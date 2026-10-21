import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarClock, CloudUpload, Download, ExternalLink, FileText, PenLine, Plus, RefreshCw, Search, Trash2, Upload } from 'lucide-react';
import {
  STATE_LABEL, deletePost, exportBackup, formatDateTime, importFile, importRows, listPosts,
  postState, timeAgo, type PostRow, type PostState,
} from './adminApi';
import { clearLegacyPosts, readLegacyPosts } from '../lib/postStore';
import { readingMinutes } from '../lib/readingTime';
import { isNative, siteUrl } from '../lib/platform';

type Filter = 'all' | PostState;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'draft', label: 'Brouillons' },
  { id: 'scheduled', label: 'Programmés' },
  { id: 'published', label: 'Publiés' },
];

const describeImport = ({ added, updated, skipped }: { added: number; updated: number; skipped: number }) =>
  `${added} ajouté(s), ${updated} mis à jour${skipped ? `, ${skipped} déjà à jour ou ignoré(s)` : ''}.`;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [legacyCount, setLegacyCount] = useState(() => readLegacyPosts().length);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    listPosts().then(list => { setPosts(list); setError(null); }).catch((err: Error) => setError(err.message));
  }, []);

  // Recharge au retour sur l'onglet (ou dans l'app) : les changements faits sur un autre appareil apparaissent.
  useEffect(() => {
    refresh();
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: 0, draft: 0, scheduled: 0, published: 0 };
    posts?.forEach(post => { result.all++; result[postState(post)]++; });
    return result;
  }, [posts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (posts ?? []).filter(post =>
      (filter === 'all' || postState(post) === filter) &&
      (!q || post.title.toLowerCase().includes(q) || post.tags.some(tag => tag.toLowerCase().includes(q))));
  }, [posts, filter, query]);

  const run = async (task: () => Promise<string | void>) => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const message = await task();
      if (message) setInfo(message);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = (post: PostRow) => {
    if (!window.confirm(`Supprimer définitivement « ${post.title} » ?`)) return;
    run(async () => { await deletePost(post.id); });
  };

  const migrateLegacy = () => run(async () => {
    const result = await importRows(readLegacyPosts());
    clearLegacyPosts();
    setLegacyCount(0);
    return `Articles de ce navigateur transférés en ligne : ${describeImport(result)}`;
  });

  const onImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) run(async () => `Import terminé : ${describeImport(await importFile(file))}`);
  };

  return (
    <main className="admin-main">
      <div className="admin-container">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Tableau de bord</p>
            <h1 className="admin-title">Vos articles</h1>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/admin/articles/nouveau')}>
            <Plus size={16} /> Nouvel article
          </button>
        </div>

        {legacyCount > 0 && (
          <div className="admin-publish">
            <CloudUpload size={20} />
            <div>
              <strong>{legacyCount} article{legacyCount > 1 ? 's' : ''} enregistré{legacyCount > 1 ? 's' : ''} uniquement dans ce navigateur</strong>
              <p>Transférez-les en ligne pour les retrouver sur tous vos appareils. Ceux qui existent déjà ne seront remplacés que par une version plus récente.</p>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={migrateLegacy} disabled={busy}>
              {busy ? 'Transfert…' : 'Transférer'}
            </button>
          </div>
        )}

        <div className="admin-stats">
          {FILTERS.map(item => (
            <button key={item.id} type="button" className={`admin-stat ${filter === item.id ? 'is-active' : ''}`} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>
              <strong>{counts[item.id]}</strong>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-toolbar">
          <label className="admin-search">
            <Search size={15} />
            <input type="search" placeholder="Rechercher par titre ou tag…" value={query} onChange={e => setQuery(e.target.value)} />
          </label>
          <button type="button" className="icon-btn" onClick={refresh} aria-label="Actualiser" title="Actualiser"><RefreshCw size={15} /></button>
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}
        {info && <p className="admin-info" role="status">{info}</p>}

        {posts === null && !error ? (
          <p className="admin-muted">Chargement des articles…</p>
        ) : visible.length === 0 ? (
          <div className="admin-empty">
            <FileText size={26} />
            <p>{posts?.length ? 'Aucun article ne correspond à ce filtre.' : 'Aucun article pour l\'instant. Lancez-vous !'}</p>
            {!posts?.length && <Link to="/admin/articles/nouveau" className="btn btn-ghost"><PenLine size={15} /> Écrire le premier article</Link>}
          </div>
        ) : (
          <ul className="admin-list">
            {visible.map(post => {
              const state = postState(post);
              return (
                <li key={post.id} className="admin-row">
                  <Link to={`/admin/articles/${post.id}`} className="admin-row-main">
                    <span className={`admin-badge is-${state}`}>{STATE_LABEL[state]}</span>
                    <span className="admin-row-title">{post.title || 'Sans titre'}</span>
                    <span className="admin-row-meta">
                      {state === 'scheduled' && <><CalendarClock size={12} /> En ligne le {formatDateTime(post.published_at!)} · </>}
                      {state === 'published' && <>Publié le {formatDateTime(post.published_at!)} · </>}
                      Modifié {timeAgo(post.updated_at)} · {readingMinutes(post.content)} min
                      {post.tags.length > 0 && <> · {post.tags.join(', ')}</>}
                    </span>
                  </Link>
                  <div className="admin-row-actions">
                    {state === 'published' && siteUrl(`/blog/${post.slug}`) && (
                      <a href={siteUrl(`/blog/${post.slug}`)!} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Voir sur le site" title="Voir sur le site"><ExternalLink size={15} /></a>
                    )}
                    <Link to={`/admin/articles/${post.id}`} className="icon-btn" aria-label="Modifier" title="Modifier"><PenLine size={15} /></Link>
                    <button type="button" className="icon-btn admin-danger" onClick={() => remove(post)} disabled={busy} aria-label="Supprimer" title="Supprimer"><Trash2 size={15} /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="admin-storage">
          <p>Vos articles sont enregistrés en ligne : connectez-vous depuis n'importe quel appareil pour les retrouver.</p>
          <div>
            <button type="button" className="admin-link" onClick={() => run(exportBackup)} disabled={busy}><Download size={14} /> Télécharger une sauvegarde</button>
            <button type="button" className="admin-link" onClick={() => fileRef.current?.click()} disabled={busy}><Upload size={14} /> Importer une sauvegarde</button>
            {/* Android ne reconnaît pas toujours le type des .json : pas de filtre dans l'app. */}
            <input ref={fileRef} type="file" accept={isNative ? undefined : 'application/json,.json'} hidden onChange={onImport} />
          </div>
        </footer>
      </div>
    </main>
  );
};

export default AdminDashboard;
