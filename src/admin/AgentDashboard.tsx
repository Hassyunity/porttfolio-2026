import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, GitBranch, GitPullRequest, Plus, RefreshCw } from 'lucide-react';
import { RUN_LABEL, isActive, listScripts, type ScriptWithLastRun } from './agentApi';
import { timeAgo } from './adminApi';

const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState<ScriptWithLastRun[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    listScripts().then(list => { setScripts(list); setError(null); }).catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    refresh();
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  // Tant qu'une exécution tourne, la liste se met à jour toute seule.
  const anyActive = scripts?.some(script => script.last_run && isActive(script.last_run));
  useEffect(() => {
    if (!anyActive) return;
    const timer = window.setInterval(refresh, 5000);
    return () => window.clearInterval(timer);
  }, [anyActive, refresh]);

  return (
    <main className="admin-main">
      <div className="admin-container">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Agent IA</p>
            <h1 className="admin-title">Vos scripts</h1>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/admin/agent/nouveau')}>
            <Plus size={16} /> Nouveau script
          </button>
        </div>

        <p className="admin-muted">
          Décrivez une tâche de développement, enregistrez-la, puis lancez-la : l'agent travaille sur le dépôt choisi
          (GitHub Actions + Claude Code) et vous propose le résultat sous forme de Pull Request.
        </p>

        <div className="admin-toolbar">
          <span className="admin-muted">{scripts ? `${scripts.length} script${scripts.length > 1 ? 's' : ''}` : ''}</span>
          <button type="button" className="icon-btn" onClick={refresh} aria-label="Actualiser" title="Actualiser"><RefreshCw size={15} /></button>
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}

        {scripts === null && !error ? (
          <p className="admin-muted">Chargement des scripts…</p>
        ) : !scripts?.length ? (
          !error && (
            <div className="admin-empty">
              <Bot size={26} />
              <p>Aucun script pour l'instant.</p>
              <Link to="/admin/agent/nouveau" className="btn btn-ghost"><Plus size={15} /> Écrire la première consigne</Link>
            </div>
          )
        ) : (
          <ul className="admin-list">
            {scripts.map(script => {
              const run = script.last_run;
              return (
                <li key={script.id} className="admin-row">
                  <Link to={`/admin/agent/${script.id}`} className="admin-row-main">
                    <span className={`admin-badge is-${run ? run.status : 'draft'}`}>{run ? RUN_LABEL[run.status] : 'Jamais lancé'}</span>
                    <span className="admin-row-title">{script.title}</span>
                    <span className="admin-row-meta">
                      <GitBranch size={12} /> {script.repo}{script.base_branch && ` · ${script.base_branch}`}
                      {' · '}{run ? `lancé ${timeAgo(run.created_at)}` : `modifié ${timeAgo(script.updated_at)}`}
                    </span>
                  </Link>
                  {run?.pr_url && (
                    <div className="admin-row-actions">
                      <a href={run.pr_url} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Voir la Pull Request" title="Voir la Pull Request"><GitPullRequest size={15} /></a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

export default AgentDashboard;
