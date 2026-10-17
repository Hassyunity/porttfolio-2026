import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarClock, Download, ExternalLink, FileText, HardDrive, PenLine, Plus, Search, Trash2, Upload, UploadCloud } from 'lucide-react';
import {
  STATE_LABEL, countPendingChanges, deletePost, exportBackup, exportForSite, formatDateTime, importPosts, listPosts,
  postState, timeAgo, type PostRow, type PostState,
} from './adminApi';
import { fetchSitePosts } from '../lib/postStore';
import { readingMinutes } from '../lib/readingTime';

type Filter = 'all' | PostState;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'draft', label: 'Brouillons' },
  { id: 'scheduled', label: 'Programmés' },
  { id: 'published', label: 'Publiés' },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [sitePosts, setSitePosts] = useState<PostRow[] | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listPosts().then(setPosts).catch((err: Error) => setError(err.message));
    fetchSitePosts().then(setSitePosts);
  }, []);

  const pending = posts && sitePosts ? countPendingChanges(posts, sitePosts) : 0;

  const onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(null);
    try {
      const result = await importPosts(file);
      setPosts(await listPosts());
      const parts = [`${result.added} ajouté(s)`, `${result.updated} mis à jour`];
      if (result.skipped) parts.push(`${result.skipped} ignoré(s) (slug déjà utilisé)`);
      if (result.ignored) parts.push(`${result.ignored} invalide(s)`);
      setInfo(`Import terminé : ${parts.join(', ')}.`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

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

  const remove = async (post: PostRow) => {
    if (!window.confirm(`Supprimer définitivement « ${post.title} » ?`)) return;
    try {
      await deletePost(post.id);
      setPosts(prev => prev?.filter(item => item.id !== post.id) ?? null);
    } catch (err) {
      setError((err as Error).message);
    }
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

        {pending > 0 && (
          <div className="admin-publish">
            <UploadCloud size={20} />
            <div>
              <strong>{pending} changement{pending > 1 ? 's' : ''} à mettre en ligne pour tous les visiteurs</strong>
              <p>
                Pour l'instant, ces articles ne sont visibles que dans ce navigateur. Téléchargez <code>blog-posts.json</code>,
                remplacez le fichier <code>public/blog-posts.json</code> du projet, puis redéployez le site.
              </p>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={exportForSite}><Download size={14} /> blog-posts.json</button>
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

        <label className="admin-search">
          <Search size={15} />
          <input type="search" placeholder="Rechercher par titre ou tag…" value={query} onChange={e => setQuery(e.target.value)} />
        </label>

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
                    {state === 'published' && (
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Voir sur le site" title="Voir sur le site"><ExternalLink size={15} /></a>
                    )}
                    <Link to={`/admin/articles/${post.id}`} className="icon-btn" aria-label="Modifier" title="Modifier"><PenLine size={15} /></Link>
                    <button type="button" className="icon-btn admin-danger" onClick={() => remove(post)} aria-label="Supprimer" title="Supprimer"><Trash2 size={15} /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <footer className="admin-storage">
          <p><HardDrive size={14} /> Les articles sont enregistrés dans ce navigateur. Faites une sauvegarde régulière, et importez-la pour écrire depuis un autre appareil.</p>
          <div>
            <button type="button" className="admin-link" onClick={exportForSite}><Download size={14} /> Exporter pour le site</button>
            <button type="button" className="admin-link" onClick={exportBackup}><Download size={14} /> Sauvegarde complète</button>
            <button type="button" className="admin-link" onClick={() => fileRef.current?.click()}><Upload size={14} /> Importer</button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
          </div>
        </footer>
      </div>
    </main>
  );
};

export default AdminDashboard;
