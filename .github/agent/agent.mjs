// Liaison entre le workflow ai-agent.yml et la table Supabase agent_runs.
//   node agent.mjs start   → lit l'exécution, la passe « running », écrit la consigne et les sorties du job
//   node agent.mjs finish  → enregistre le statut final, le compte rendu de l'agent et la Pull Request
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RUN_ID, RUNNER_TEMP, GITHUB_OUTPUT } = process.env;
const now = () => new Date().toISOString();

async function rest(path, init = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  });
  if (!response.ok) throw new Error(`Supabase ${response.status} : ${await response.text()}`);
  return response.json();
}

const getRun = async () => (await rest(`agent_runs?id=eq.${Number(RUN_ID)}&select=*,agent_scripts(title)`))[0];
const updateRun = patch => rest(`agent_runs?id=eq.${Number(RUN_ID)}`, { method: 'PATCH', body: JSON.stringify(patch) });
const output = (name, value) => appendFileSync(GITHUB_OUTPUT, `${name}=${value}\n`);

async function start() {
  const run = await getRun();
  if (!run) throw new Error(`Exécution ${RUN_ID} introuvable.`);
  if (run.status !== 'queued') {
    console.log(`Exécution ${RUN_ID} au statut « ${run.status} » : rien à faire.`);
    output('skip', 'true');
    return;
  }
  const branch = `agent/${RUN_ID}-${Date.now().toString(36)}`;
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
  await updateRun({
    status: 'running',
    started_at: now(),
    branch,
    gh_run_id: Number(GITHUB_RUN_ID),
    run_url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
  });
  writeFileSync(`${RUNNER_TEMP}/prompt.md`, run.prompt);
  output('skip', 'false');
  output('repo', run.repo);
  output('base', run.base_branch);
  output('branch', branch);
  output('title', run.agent_scripts.title.replace(/\s+/g, ' ').slice(0, 120));
}

async function finish() {
  const run = await getRun();
  if (!run || run.status === 'cancelled') return; // annulée depuis l'app : on garde ce statut

  let agent = null;
  try { agent = JSON.parse(readFileSync(`${RUNNER_TEMP}/result.json`, 'utf8')); } catch { /* agent non lancé ou sortie illisible */ }

  const { JOB_STATUS, PR_URL } = process.env;
  const ok = JOB_STATUS === 'success' && agent && !agent.is_error;
  const noChanges = existsSync(`${RUNNER_TEMP}/no-changes`);

  await updateRun({
    status: JOB_STATUS === 'cancelled' ? 'cancelled' : ok ? 'succeeded' : 'failed',
    finished_at: now(),
    result: agent?.result ?? null,
    cost_usd: agent?.total_cost_usd ?? null,
    pr_url: PR_URL || null,
    error: ok ? (noChanges ? 'Aucune modification de code : pas de Pull Request.' : null)
      : agent?.is_error ? 'L\'agent s\'est arrêté sur une erreur (voir le compte rendu et les logs).'
      : 'Le workflow a échoué : ouvrez les logs GitHub Actions pour le détail.',
  });
}

const commands = { start, finish };
await commands[process.argv[2]]();
