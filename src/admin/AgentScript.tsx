import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch, GitPullRequest, Play, Square, Trash2 } from 'lucide-react';
import {
  DEFAULT_REPO, REPO_RE, RUN_LABEL, cancelRun, deleteScript, getScript, isActive, listRuns, runDuration, runScript,
  saveScript, type AgentRun, type AgentScript as Script, type ScriptInput,
} from './agentApi';
import { formatDateTime, timeAgo } from './adminApi';
import { Markdown } from '../lib/markdown';

const EMPTY: ScriptInput = { title: '', prompt: '', repo: DEFAULT_REPO, base_branch: '' };
const PROMPT_MAX = 20000;

const toInput = ({ title, prompt, repo, base_branch }: Script): ScriptInput => ({ title, prompt, repo, base_branch });
const same = (a: ScriptInput, b: ScriptInput) => JSON.stringify(a) === JSON.stringify(b);

const RunCard: React.FC<{ run: AgentRun; open: boolean; onCancel: () => void; busy: boolean }> = ({ run, open, onCancel, busy }) => {
  const duration = runDuration(run);
  return (
    <li className="agent-run">
      <details open={open}>
        <summary>
          <span className={`admin-badge is-${run.status}`}>{RUN_LABEL[run.status]}</span>
          <span className="agent-run-when">{formatDateTime(run.created_at)}</span>
          <span className="admin-muted">
            {duration && `${duration}`}
            {run.cost_usd !== null && ` · ${Number(run.cost_usd).toFixed(2)} $`}
          </span>
        </summary>

        <div className="agent-run-body">
          <p className="admin-row-meta">
            <GitBranch size={12} /> {run.repo}{run.base_branch && ` · depuis ${run.base_branch}`}{run.branch && ` → ${run.branch}`}
          </p>
          <div className="agent-run-links">
            {run.pr_url && <a href={run.pr_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm"><GitPullRequest size={14} /> Pull Request</a>}
            {run.run_url && <a href={run.run_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><ExternalLink size={14} /> Logs GitHub</a>}
            {isActive(run) && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={busy}><Square size={13} /> Arrêter</button>
            )}
          </div>
          {run.status === 'queued' && <p className="admin-muted">En attente du démarrage sur GitHub Actions…</p>}
          {run.status === 'running' && <p className="admin-muted">L'agent travaille sur le dépôt. Cette page se met à jour toute seule.</p>}
          {run.error && <p className={run.status === 'succeeded' ? 'admin-info' : 'admin-error'}>{run.error}</p>}
          {run.result && <div className="prose agent-run-result"><Markdown source={run.result} /></div>}
        </div>
      </details>
    </li>
  );
};

const AgentScript: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'nouveau';
  const numericId = isNew ? null : Number(id);

  const [script, setScript] = useState<Script | null>(null);
  const [form, setForm] = useState<ScriptInput>(EMPTY);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'save' | 'run' | 'cancel' | 'delete' | null>(null);
  const [notice, setNotice] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const loadedId = useRef<number | null>(null);

  const saved = script ? toInput(script) : EMPTY;
  const dirty = !same(form, saved);

  useEffect(() => {
    if (numericId === null || Number.isNaN(numericId) || loadedId.current === numericId) return;
    let alive = true;
    Promise.all([getScript(numericId), listRuns(numericId)])
      .then(([row, list]) => { if (alive) { loadedId.current = row.id; setScript(row); setForm(toInput(row)); setRuns(list); } })
      .catch((err: Error) => { if (alive) setLoadError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [numericId]);

  const refreshRuns = useCallback(() => {
    if (script) listRuns(script.id).then(setRuns).catch(() => { /* nouvel essai au prochain tour */ });
  }, [script]);

  // Suivi en direct tant qu'une exécution est en file ou en cours.
  const active = runs.some(isActive);
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(refreshRuns, 4000);
    return () => window.clearInterval(timer);
  }, [active, refreshRuns]);

  if (numericId !== null && Number.isNaN(numericId)) return <Navigate to="/admin/agent" replace />;

  const update = (patch: Partial<ScriptInput>) => setForm(current => ({ ...current, ...patch }));

  const validate = () => {
    if (!form.title.trim()) return 'Donnez un titre au script.';
    if (!REPO_RE.test(form.repo.trim())) return 'Dépôt invalide : utilisez le format propriétaire/nom (ex. Hassyunity/porttfolio-2026).';
    return null;
  };

  /** Enregistre si besoin et renvoie le script à jour. */
  const persist = async (): Promise<Script> => {
    if (script && !dirty) return script;
    const row = await saveScript(script?.id ?? null, {
      title: form.title.trim(), prompt: form.prompt, repo: form.repo.trim(), base_branch: form.base_branch.trim(),
    });
    loadedId.current = row.id;
    setScript(row);
    setForm(toInput(row));
    if (!script) navigate(`/admin/agent/${row.id}`, { replace: true });
    return row;
  };

  const run = async (action: 'save' | 'run' | 'cancel' | 'delete', task: () => Promise<string | void>) => {
    setBusy(action);
    setNotice(null);
    try {
      const message = await task();
      if (message) setNotice({ type: 'ok', text: message });
    } catch (err) {
      setNotice({ type: 'error', text: (err as Error).message });
    } finally {
      setBusy(null);
    }
  };

  const onSave = () => {
    const invalid = validate();
    if (invalid) return setNotice({ type: 'error', text: invalid });
    run('save', async () => { await persist(); return 'Script enregistré.'; });
  };

  const onRun = () => {
    const invalid = validate() ?? (form.prompt.trim() ? null : 'Écrivez la consigne de l\'agent avant de lancer.');
    if (invalid) return setNotice({ type: 'error', text: invalid });
    run('run', async () => {
      const row = await persist();
      const started = await runScript(row.id);
      setRuns(current => [started, ...current]);
      return 'Exécution lancée : l\'agent démarre sur GitHub Actions (environ 30 s).';
    });
  };

  const onCancel = (target: AgentRun) => {
    if (!window.confirm('Arrêter cette exécution ? Le travail en cours de l\'agent sera perdu.')) return;
    run('cancel', async () => { await cancelRun(target.id); refreshRuns(); return 'Exécution arrêtée.'; });
  };

  const onDelete = () => {
    if (!script || !window.confirm(`Supprimer « ${script.title} » et son historique ? Les Pull Requests déjà ouvertes restent sur GitHub.`)) return;
    run('delete', async () => { await deleteScript(script.id); navigate('/admin/agent', { replace: true }); });
  };

  const leave = (event: React.MouseEvent) => {
    if (dirty && !window.confirm('Des modifications ne sont pas enregistrées. Quitter quand même ?')) event.preventDefault();
  };

  if (loading) return <main className="admin-main"><p className="admin-muted admin-container">Chargement du script…</p></main>;
  if (loadError) {
    return (
      <main className="admin-main">
        <div className="admin-container">
          <p className="admin-error" role="alert">{loadError}</p>
          <Link to="/admin/agent" className="btn btn-ghost"><ArrowLeft size={15} /> Retour aux scripts</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-main">
      <div className="admin-container agent-script">
        <div className="editor-bar agent-bar">
          <Link to="/admin/agent" className="admin-link" onClick={leave}><ArrowLeft size={15} /> Scripts</Link>
          <span className={`editor-saved ${dirty ? 'is-dirty' : ''}`}>
            {dirty ? 'Modifications non enregistrées' : script ? `Enregistré ${timeAgo(script.updated_at)}` : 'Pas encore enregistré'}
          </span>
          <div className="editor-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onSave} disabled={!!busy || (!!script && !dirty)}>
              {busy === 'save' ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={onRun} disabled={!!busy || active}>
              <Play size={14} /> {busy === 'run' ? 'Lancement…' : active ? 'En cours…' : 'Exécuter'}
            </button>
          </div>
        </div>

        {notice && <p className={notice.type === 'ok' ? 'admin-info' : 'admin-error'} role={notice.type === 'ok' ? 'status' : 'alert'}>{notice.text}</p>}

        <label className="admin-field">
          <span>Titre</span>
          <input value={form.title} onChange={e => update({ title: e.target.value })} maxLength={200} placeholder="Ex. Ajouter une page Témoignages" />
        </label>

        <div className="agent-repo">
          <label className="admin-field">
            <span>Dépôt GitHub</span>
            <input value={form.repo} onChange={e => update({ repo: e.target.value })} placeholder="propriétaire/nom" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
          </label>
          <label className="admin-field">
            <span>Branche de départ</span>
            <input value={form.base_branch} onChange={e => update({ base_branch: e.target.value })} placeholder="par défaut du dépôt" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
          </label>
        </div>

        <label className="admin-field">
          <span>Consigne pour l'agent <em>{form.prompt.length} / {PROMPT_MAX}</em></span>
          <textarea
            className="agent-prompt"
            rows={12}
            value={form.prompt}
            maxLength={PROMPT_MAX}
            onChange={e => update({ prompt: e.target.value })}
            placeholder={'Décrivez le travail comme à un développeur senior :\n\n- le but et le contexte\n- ce qu\'il faut créer ou modifier\n- les contraintes (style, librairies, tests)\n- comment vérifier que c\'est fini'}
          />
          <small>L'agent clone le dépôt, code, lance build et tests, puis ouvre une Pull Request que vous validez sur GitHub.</small>
        </label>

        {script && (
          <section className="agent-runs">
            <h2 className="agent-runs-title">Exécutions</h2>
            {runs.length === 0 ? (
              <p className="admin-muted">Pas encore lancé.</p>
            ) : (
              <ul>
                {runs.map((item, index) => (
                  <RunCard key={item.id} run={item} open={index === 0} onCancel={() => onCancel(item)} busy={!!busy} />
                ))}
              </ul>
            )}
          </section>
        )}

        {script && (
          <button type="button" className="admin-delete" onClick={onDelete} disabled={!!busy}>
            <Trash2 size={14} /> {busy === 'delete' ? 'Suppression…' : 'Supprimer le script'}
          </button>
        )}
      </div>
    </main>
  );
};

export default AgentScript;
