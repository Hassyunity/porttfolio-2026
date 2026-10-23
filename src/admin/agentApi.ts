import { FunctionsHttpError, type PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// Agent IA : consignes enregistrées (agent_scripts) et exécutions sur GitHub Actions (agent_runs).
// Voir supabase/agent.sql, supabase/functions/agent-dispatch et .github/workflows/ai-agent.yml.

export interface AgentScript {
  id: number;
  title: string;
  prompt: string;
  repo: string;
  base_branch: string;
  created_at: string;
  updated_at: string;
}

export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export interface AgentRun {
  id: number;
  script_id: number;
  status: RunStatus;
  repo: string;
  base_branch: string;
  branch: string | null;
  pr_url: string | null;
  run_url: string | null;
  result: string | null;
  error: string | null;
  cost_usd: number | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export type ScriptInput = Pick<AgentScript, 'title' | 'prompt' | 'repo' | 'base_branch'>;

/** Dernière exécution jointe à chaque script, pour la liste. */
export type ScriptWithLastRun = AgentScript & { last_run: AgentRun | null };

export const RUN_LABEL: Record<RunStatus, string> = {
  queued: 'En file',
  running: 'En cours',
  succeeded: 'Terminé',
  failed: 'Échec',
  cancelled: 'Annulé',
};

export const isActive = (run: Pick<AgentRun, 'status'>) => run.status === 'queued' || run.status === 'running';

export const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
export const DEFAULT_REPO: string = import.meta.env.VITE_AGENT_DEFAULT_REPO ?? '';
/** Nom de l'Edge Function tel que déployé dans Supabase (agent-dispatch par défaut). */
const DISPATCH_FUNCTION: string = import.meta.env.VITE_AGENT_FUNCTION || 'agent-dispatch';

const SCRIPT_COLUMNS = 'id, title, prompt, repo, base_branch, created_at, updated_at';
const RUN_COLUMNS = 'id, script_id, status, repo, base_branch, branch, pr_url, run_url, result, error, cost_usd, created_at, started_at, finished_at';

function client() {
  if (!supabase) throw new Error('Supabase n\'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  return supabase;
}

function fail(error: PostgrestError): never {
  if (error.code === '42P01' || error.code === 'PGRST205') throw new Error('Les tables de l\'agent n\'existent pas : exécutez supabase/agent.sql dans Supabase.');
  if (error.code === '42501' || error.code === 'PGRST301') throw new Error('Accès refusé : votre compte n\'a pas les droits d\'administration.');
  if (error.code === '23514') throw new Error('Données invalides : vérifiez le titre et le dépôt (format propriétaire/nom).');
  if (error.code === 'PGRST116') throw new Error('Script introuvable : il a peut-être été supprimé.');
  throw new Error(error.message || 'Erreur réseau : vérifiez votre connexion.');
}

export async function listScripts(): Promise<ScriptWithLastRun[]> {
  const { data, error } = await client()
    .from('agent_scripts')
    .select(`${SCRIPT_COLUMNS}, agent_runs(${RUN_COLUMNS})`)
    .order('updated_at', { ascending: false })
    .order('created_at', { referencedTable: 'agent_runs', ascending: false })
    .limit(1, { referencedTable: 'agent_runs' });
  if (error) fail(error);
  return (data as (AgentScript & { agent_runs: AgentRun[] })[]).map(({ agent_runs, ...script }) => ({ ...script, last_run: agent_runs[0] ?? null }));
}

export async function getScript(id: number): Promise<AgentScript> {
  const { data, error } = await client().from('agent_scripts').select(SCRIPT_COLUMNS).eq('id', id).single();
  if (error) fail(error);
  return data as AgentScript;
}

export async function saveScript(id: number | null, input: ScriptInput): Promise<AgentScript> {
  const query = id === null
    ? client().from('agent_scripts').insert(input)
    : client().from('agent_scripts').update(input).eq('id', id);
  const { data, error } = await query.select(SCRIPT_COLUMNS).single();
  if (error) fail(error);
  return data as AgentScript;
}

export async function deleteScript(id: number): Promise<void> {
  const { error } = await client().from('agent_scripts').delete().eq('id', id);
  if (error) fail(error);
}

export async function listRuns(scriptId: number): Promise<AgentRun[]> {
  const { data, error } = await client()
    .from('agent_runs')
    .select(RUN_COLUMNS)
    .eq('script_id', scriptId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) fail(error);
  return data as AgentRun[];
}

/** Appelle l'Edge Function de l'agent, seule à détenir le token GitHub. */
async function dispatch(body: Record<string, unknown>) {
  const { data, error } = await client().functions.invoke(DISPATCH_FUNCTION, { body });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => null);
      throw new Error(payload?.error ?? `L'Edge Function a répondu ${error.context.status}.`);
    }
    throw new Error(`Impossible de joindre l'Edge Function « ${DISPATCH_FUNCTION} » : est-elle déployée sous ce nom ?`);
  }
  return data;
}

export const runScript = async (scriptId: number): Promise<AgentRun> => (await dispatch({ action: 'run', script_id: scriptId })).run;

export const cancelRun = async (runId: number): Promise<void> => { await dispatch({ action: 'cancel', run_id: runId }); };

/** Durée lisible d'une exécution (en cours ou terminée). */
export function runDuration(run: AgentRun) {
  if (!run.started_at) return null;
  const seconds = Math.max(0, Math.round(((run.finished_at ? Date.parse(run.finished_at) : Date.now()) - Date.parse(run.started_at)) / 1000));
  return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)} min ${String(seconds % 60).padStart(2, '0')} s`;
}
