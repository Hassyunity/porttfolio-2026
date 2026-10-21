// Edge Function : lance ou annule une exécution de l'agent IA (workflow GitHub Actions).
// Le token GitHub reste ici, côté serveur : l'app admin n'y a jamais accès.
//
// Secrets (supabase secrets set …) :
//   AGENT_GITHUB_TOKEN    token GitHub autorisé à lancer le workflow (Actions : read & write)
//   AGENT_WORKFLOW_REPO   dépôt qui contient .github/workflows/ai-agent.yml (ex. Hassyunity/porttfolio-2026)
//   AGENT_WORKFLOW_REF    branche de ce workflow (ex. Production)
//   AGENT_ALLOWED_REPOS   facultatif : dépôts autorisés, séparés par des virgules
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const env = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Secret ${name} manquant dans la fonction agent-dispatch.`);
  return value;
};

async function github(path: string, init: RequestInit) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env('AGENT_GITHUB_TOKEN')}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`GitHub a refusé la demande (${response.status}) : ${(await response.text()).slice(0, 300)}`);
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, 405);

  try {
    // Client « au nom de l'utilisateur » : la RLS et is_blog_admin() s'appliquent à son jeton.
    const supabase = createClient(env('SUPABASE_URL'), req.headers.get('apikey') ?? env('SUPABASE_ANON_KEY'), {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
      auth: { persistSession: false },
    });
    const { data: isAdmin } = await supabase.rpc('is_blog_admin');
    if (isAdmin !== true) return json({ error: 'Accès refusé : réservé aux administrateurs.' }, 403);

    const body = await req.json().catch(() => ({}));

    if (body.action === 'run') {
      const { data: script, error } = await supabase.from('agent_scripts').select('*').eq('id', body.script_id).single();
      if (error || !script) return json({ error: 'Script introuvable.' }, 404);
      if (!script.prompt.trim()) return json({ error: 'La consigne est vide.' }, 400);

      const allowed = (Deno.env.get('AGENT_ALLOWED_REPOS') ?? '').split(',').map(repo => repo.trim().toLowerCase()).filter(Boolean);
      if (allowed.length && !allowed.includes(script.repo.toLowerCase())) {
        return json({ error: `Le dépôt ${script.repo} n'est pas dans la liste autorisée (AGENT_ALLOWED_REPOS).` }, 403);
      }

      const { data: run, error: insertError } = await supabase
        .from('agent_runs')
        .insert({ script_id: script.id, prompt: script.prompt, repo: script.repo, base_branch: script.base_branch })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);

      try {
        await github(`/repos/${env('AGENT_WORKFLOW_REPO')}/actions/workflows/ai-agent.yml/dispatches`, {
          method: 'POST',
          body: JSON.stringify({ ref: env('AGENT_WORKFLOW_REF'), inputs: { run_id: String(run.id) } }),
        });
      } catch (err) {
        const message = (err as Error).message;
        await supabase.from('agent_runs').update({ status: 'failed', error: message, finished_at: new Date().toISOString() }).eq('id', run.id);
        return json({ error: message }, 502);
      }
      return json({ run });
    }

    if (body.action === 'cancel') {
      const { data: run, error } = await supabase.from('agent_runs').select('id, status, gh_run_id').eq('id', body.run_id).single();
      if (error || !run) return json({ error: 'Exécution introuvable.' }, 404);
      if (run.status !== 'queued' && run.status !== 'running') return json({ error: 'Cette exécution est déjà terminée.' }, 409);

      // Pas encore démarrée : le workflow verra le statut « cancelled » et s'arrêtera de lui-même.
      if (run.gh_run_id) {
        await github(`/repos/${env('AGENT_WORKFLOW_REPO')}/actions/runs/${run.gh_run_id}/cancel`, { method: 'POST' });
      }
      await supabase.from('agent_runs').update({ status: 'cancelled', finished_at: new Date().toISOString() }).eq('id', run.id);
      return json({ ok: true });
    }

    return json({ error: 'Action inconnue.' }, 400);
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
