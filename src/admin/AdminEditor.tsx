import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Bold, CalendarClock, Code, Columns2, ExternalLink, Eye, Heading2, Heading3, Image, Italic,
  Link2, List, ListOrdered, Minus, PenLine, Quote, RotateCcw, Send, Trash2, Undo2, X,
} from 'lucide-react';
import {
  ConflictError, STATE_LABEL, createPost, deletePost, formatDateTime, getPost, postState, timeAgo, updatePost,
  type PostInput, type PostRow, type PostStatus,
} from './adminApi';
import { slugify } from '../data/blog';
import { SLUG_RE } from '../lib/postStore';
import { Markdown } from '../lib/markdown';
import { countWords, readingMinutes } from '../lib/readingTime';

interface Draft {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
}

interface Backup {
  form: Draft;
  savedAt: number;
}

type Action = 'save' | 'publish' | 'schedule' | 'unpublish';
type View = 'write' | 'split' | 'preview';

const EMPTY: Draft = { title: '', slug: '', excerpt: '', content: '', tags: [] };
const EXCERPT_MAX = 500;
const MAX_TAGS = 8;

const toDraft = (row: PostRow): Draft => ({ title: row.title, slug: row.slug, excerpt: row.excerpt, content: row.content, tags: row.tags ?? [] });
const sameDraft = (a: Draft, b: Draft) => JSON.stringify(a) === JSON.stringify(b);

// --- Sauvegarde locale anti-perte (onglet fermé, coupure réseau…) ---
const backupKey = (key: string) => `admin-blog-backup:${key}`;
function readBackup(key: string): Backup | null {
  try {
    const raw = localStorage.getItem(backupKey(key));
    return raw ? JSON.parse(raw) as Backup : null;
  } catch { return null; }
}
function writeBackup(key: string, form: Draft) {
  try { localStorage.setItem(backupKey(key), JSON.stringify({ form, savedAt: Date.now() })); } catch { /* stockage indisponible */ }
}
function clearBackup(key: string) {
  try { localStorage.removeItem(backupKey(key)); } catch { /* stockage indisponible */ }
}

/** Valeur pour <input type="datetime-local"> (heure locale). */
function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const SUCCESS: Record<Action, string> = {
  save: 'Modifications enregistrées.',
  publish: 'Article publié : il est en ligne sur le blog pour tous les visiteurs.',
  schedule: 'Article programmé.',
  unpublish: 'Article repassé en brouillon : il n\'est plus visible sur le site.',
};

const AdminEditor: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'nouveau';
  const numericId = isNew ? null : Number(id);

  const [post, setPost] = useState<PostRow | null>(null);
  const [form, setForm] = useState<Draft>(EMPTY);
  const [saved, setSaved] = useState<Draft>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Action | 'delete' | null>(null);
  const [notice, setNotice] = useState<{ type: 'ok' | 'error'; text: string; conflict?: boolean } | null>(null);
  const [view, setView] = useState<View>('split');
  const [scheduling, setScheduling] = useState(false);
  const [scheduleAt, setScheduleAt] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [backup, setBackup] = useState<Backup | null>(() => {
    if (!isNew) return null;
    const found = readBackup('nouveau');
    return found && !sameDraft(found.form, EMPTY) ? found : null;
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const loadedId = useRef<number | null>(null);

  const storageKey = post ? String(post.id) : 'nouveau';
  const dirty = !sameDraft(form, saved);
  const state = post ? postState(post) : 'draft';

  const hydrate = (row: PostRow) => {
    const draft = toDraft(row);
    loadedId.current = row.id;
    setPost(row);
    setForm(draft);
    setSaved(draft);
    setSlugTouched(true);
  };

  // Chargement d'un article existant
  useEffect(() => {
    if (numericId === null || Number.isNaN(numericId) || loadedId.current === numericId) return;
    let alive = true;
    getPost(numericId)
      .then(row => {
        if (!alive) return;
        hydrate(row);
        const found = readBackup(String(row.id));
        if (found && found.savedAt > Date.parse(row.updated_at) && !sameDraft(found.form, toDraft(row))) setBackup(found);
      })
      .catch((err: Error) => { if (alive) setLoadError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [numericId]);

  // Sauvegarde locale continue tant qu'il y a des modifications non enregistrées
  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => writeBackup(storageKey, form), 600);
    return () => window.clearTimeout(timer);
  }, [form, dirty, storageKey]);

  // Alerte avant de fermer l'onglet avec des modifications non enregistrées
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  // Ctrl/Cmd + S : enregistrer sans changer le statut
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (!busy) persist('save');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (numericId !== null && Number.isNaN(numericId)) return <Navigate to="/admin" replace />;

  const update = (patch: Partial<Draft>) => setForm(current => ({ ...current, ...patch }));

  const setTitle = (title: string) => update(slugTouched ? { title } : { title, slug: slugify(title) });

  async function persist(action: Action, when?: string) {
    const title = form.title.trim();
    const slug = form.slug || slugify(title);
    if (!title) return setNotice({ type: 'error', text: 'Le titre est obligatoire.' });
    if (!SLUG_RE.test(slug)) return setNotice({ type: 'error', text: 'Slug invalide : lettres minuscules, chiffres et tirets uniquement.' });
    if ((action === 'publish' || action === 'schedule') && (!form.excerpt.trim() || !form.content.trim())) {
      return setNotice({ type: 'error', text: 'Ajoutez un résumé et du contenu avant de publier.' });
    }

    let status: PostStatus;
    let publishedAt: string | null;
    if (action === 'publish') { status = 'published'; publishedAt = new Date().toISOString(); }
    else if (action === 'schedule') { status = 'published'; publishedAt = when!; }
    else if (action === 'unpublish') { status = 'draft'; publishedAt = null; }
    else { status = post?.status ?? 'draft'; publishedAt = post?.published_at ?? null; }

    const sent = form;
    const input: PostInput = {
      title,
      slug,
      excerpt: form.excerpt.trim(),
      content: form.content,
      tags: form.tags,
      status,
      published_at: publishedAt,
    };

    setBusy(action);
    setNotice(null);
    try {
      const row = post ? await updatePost(post.id, input, post.updated_at) : await createPost(input);
      clearBackup(storageKey);
      setBackup(null);
      const draft = toDraft(row);
      loadedId.current = row.id;
      setPost(row);
      setSaved(draft);
      // Ne pas écraser ce qui a été tapé pendant l'envoi
      setForm(current => (current === sent ? draft : current));
      setSlugTouched(true);
      setScheduling(false);
      setNotice({ type: 'ok', text: action === 'schedule' ? `Article programmé : en ligne le ${formatDateTime(row.published_at!)}.` : SUCCESS[action] });
      if (!post) navigate(`/admin/articles/${row.id}`, { replace: true });
    } catch (err) {
      setNotice({ type: 'error', text: (err as Error).message, conflict: err instanceof ConflictError });
    } finally {
      setBusy(null);
    }
  }

  /** Conflit : charge la version en ligne et propose de restaurer le texte local. */
  const reloadLatest = async () => {
    if (!post) return;
    const mine: Backup = { form, savedAt: Date.now() };
    writeBackup(String(post.id), form);
    try {
      hydrate(await getPost(post.id));
      setBackup(mine);
      setNotice({ type: 'ok', text: 'Dernière version chargée. Votre texte reste disponible via « Restaurer ».' });
    } catch (err) {
      setNotice({ type: 'error', text: (err as Error).message });
    }
  };

  const openScheduler = () => {
    const base = post && state === 'scheduled' ? new Date(post.published_at!) : new Date(Date.now() + 24 * 3600 * 1000);
    if (state !== 'scheduled') base.setHours(9, 0, 0, 0);
    setScheduleAt(toLocalInput(base));
    setScheduling(true);
  };

  const confirmSchedule = () => {
    const date = new Date(scheduleAt);
    if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now() + 60_000) {
      return setNotice({ type: 'error', text: 'Choisissez une date et une heure dans le futur.' });
    }
    persist('schedule', date.toISOString());
  };

  const remove = async () => {
    if (!post || !window.confirm(`Supprimer définitivement « ${post.title} » ? Cette action est irréversible.`)) return;
    setBusy('delete');
    try {
      await deletePost(post.id);
      clearBackup(String(post.id));
      setSaved(form); // évite l'alerte « modifications non enregistrées »
      navigate('/admin', { replace: true });
    } catch (err) {
      setNotice({ type: 'error', text: (err as Error).message });
      setBusy(null);
    }
  };

  const leave = (event: React.MouseEvent) => {
    if (dirty && !window.confirm('Des modifications ne sont pas enregistrées. Quitter quand même ?')) event.preventDefault();
  };

  // --- Barre d'outils Markdown ---
  const edit = (transform: (value: string, start: number, end: number) => { value: string; start: number; end: number }) => {
    const el = textareaRef.current;
    if (!el) return;
    const result = transform(el.value, el.selectionStart, el.selectionEnd);
    update({ content: result.value });
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(result.start, result.end); });
  };

  const surround = (before: string, after = before, placeholder = 'texte') => edit((value, start, end) => {
    const selected = value.slice(start, end) || placeholder;
    return {
      value: value.slice(0, start) + before + selected + after + value.slice(end),
      start: start + before.length,
      end: start + before.length + selected.length,
    };
  });

  const prefixLines = (prefix: (index: number) => string) => edit((value, start, end) => {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const block = value.slice(lineStart, end) || 'élément';
    const replaced = block.split('\n').map((line, i) => prefix(i) + line.replace(/^(#{1,3}\s+|>\s?|[-*]\s+|\d+[.)]\s+)/, '')).join('\n');
    return { value: value.slice(0, lineStart) + replaced + value.slice(end), start: lineStart, end: lineStart + replaced.length };
  });

  const insertBlock = (text: string, selectFrom = 0, selectLength = 0) => edit((value, start, end) => {
    const before = value.slice(0, start);
    const pad = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    const next = before + pad + text + '\n\n' + value.slice(end);
    const at = before.length + pad.length + selectFrom;
    return { value: next, start: at, end: at + selectLength };
  });

  const TOOLS = [
    { icon: Heading2, label: 'Titre de section', run: () => prefixLines(() => '## ') },
    { icon: Heading3, label: 'Sous-titre', run: () => prefixLines(() => '### ') },
    { icon: Bold, label: 'Gras (Ctrl+B)', run: () => surround('**') },
    { icon: Italic, label: 'Italique (Ctrl+I)', run: () => surround('*') },
    { icon: Link2, label: 'Lien (Ctrl+K)', run: () => surround('[', '](https://)', 'texte du lien') },
    { icon: List, label: 'Liste à puces', run: () => prefixLines(() => '- ') },
    { icon: ListOrdered, label: 'Liste numérotée', run: () => prefixLines(i => `${i + 1}. `) },
    { icon: Quote, label: 'Citation', run: () => prefixLines(() => '> ') },
    { icon: Code, label: 'Bloc de code', run: () => insertBlock('```\ncode\n```', 4, 4) },
    { icon: Image, label: 'Image (URL https)', run: () => insertBlock('![Légende](https://)', 2, 7) },
    { icon: Minus, label: 'Séparateur', run: () => insertBlock('---') },
  ];

  const onEditorKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (key === 'b') { event.preventDefault(); surround('**'); }
    if (key === 'i') { event.preventDefault(); surround('*'); }
    if (key === 'k') { event.preventDefault(); surround('[', '](https://)', 'texte du lien'); }
  };

  // --- Tags ---
  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,$/, '').trim();
    if (!tag || form.tags.includes(tag) || form.tags.length >= MAX_TAGS) return setTagInput('');
    update({ tags: [...form.tags, tag] });
    setTagInput('');
  };

  const onTagKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addTag(tagInput); }
    if (event.key === 'Backspace' && !tagInput && form.tags.length) update({ tags: form.tags.slice(0, -1) });
  };

  if (loading) return <main className="admin-main"><p className="admin-muted admin-container">Chargement de l'article…</p></main>;
  if (loadError) {
    return (
      <main className="admin-main">
        <div className="admin-container">
          <p className="admin-error" role="alert">{loadError}</p>
          <Link to="/admin" className="btn btn-ghost"><ArrowLeft size={15} /> Retour aux articles</Link>
        </div>
      </main>
    );
  }

  const words = countWords(form.content);
  const slugChangedLive = post && state === 'published' && form.slug !== post.slug;

  return (
    <main className="editor">
      {/* --- Barre d'actions --- */}
      <div className="editor-bar">
        <Link to="/admin" className="admin-link" onClick={leave}><ArrowLeft size={15} /> Articles</Link>
        <span className={`admin-badge is-${state}`}>{post ? STATE_LABEL[state] : 'Nouveau brouillon'}</span>
        <span className={`editor-saved ${dirty ? 'is-dirty' : ''}`}>
          {dirty ? 'Modifications non enregistrées' : post ? `Enregistré ${timeAgo(post.updated_at)}` : 'Pas encore enregistré'}
        </span>

        <div className="editor-actions">
          {state === 'published' ? (
            <>
              <a href={`/blog/${post!.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><ExternalLink size={14} /> Voir</a>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => persist('unpublish')} disabled={!!busy}><Undo2 size={14} /> Dépublier</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => persist('save')} disabled={!!busy || !dirty}>
                {busy === 'save' ? 'Mise à jour…' : 'Mettre à jour'}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => persist('save')} disabled={!!busy || (!!post && !dirty)}>
                {busy === 'save' ? 'Enregistrement…' : state === 'scheduled' ? 'Enregistrer' : 'Enregistrer le brouillon'}
              </button>
              {state === 'scheduled' && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => persist('unpublish')} disabled={!!busy}><Undo2 size={14} /> Brouillon</button>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={openScheduler} disabled={!!busy}>
                <CalendarClock size={14} /> {state === 'scheduled' ? 'Reprogrammer' : 'Programmer'}
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => persist('publish')} disabled={!!busy}>
                <Send size={14} /> {busy === 'publish' ? 'Publication…' : state === 'scheduled' ? 'Publier maintenant' : 'Publier'}
              </button>
            </>
          )}
        </div>
      </div>

      {notice && (
        <div className={`editor-notice is-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          <span>{notice.text}</span>
          {notice.conflict && <button type="button" onClick={reloadLatest}><RotateCcw size={13} /> Charger la dernière version</button>}
          <button type="button" onClick={() => setNotice(null)} aria-label="Fermer"><X size={14} /></button>
        </div>
      )}

      {backup && (
        <div className="editor-notice is-warn" role="status">
          <span>Une version non enregistrée du {formatDateTime(new Date(backup.savedAt).toISOString())} a été retrouvée sur cet appareil.</span>
          <span className="editor-notice-actions">
            <button type="button" onClick={() => { setForm(backup.form); setSlugTouched(true); setBackup(null); }}><RotateCcw size={13} /> Restaurer</button>
            <button type="button" onClick={() => { clearBackup(storageKey); setBackup(null); }}>Ignorer</button>
          </span>
        </div>
      )}

      {scheduling && (
        <div className="editor-schedule">
          <CalendarClock size={16} />
          <label>
            <span>Mise en ligne automatique le</span>
            <input type="datetime-local" value={scheduleAt} min={toLocalInput(new Date())} onChange={e => setScheduleAt(e.target.value)} />
          </label>
          <span className="admin-muted">L'article restera invisible jusqu'à cette date, puis apparaîtra seul dans le blog.</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={confirmSchedule} disabled={!!busy}>{busy === 'schedule' ? 'Programmation…' : 'Confirmer'}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setScheduling(false)}>Annuler</button>
        </div>
      )}

      <div className="editor-body">
        {/* --- Zone d'écriture / aperçu --- */}
        <section className={`editor-workspace view-${view}`}>
          <div className="editor-modes" role="tablist" aria-label="Mode d'affichage">
            {([['write', PenLine, 'Écrire'], ['split', Columns2, 'Côte à côte'], ['preview', Eye, 'Aperçu']] as const).map(([mode, Icon, label]) => (
              <button key={mode} type="button" role="tab" aria-selected={view === mode} className={view === mode ? 'is-active' : ''} onClick={() => setView(mode)}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <div className="editor-panes">
            <div className="editor-write">
              <textarea
                className="editor-title"
                rows={1}
                placeholder="Titre de l'article"
                value={form.title}
                onChange={e => setTitle(e.target.value.replace(/\n/g, ' '))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); textareaRef.current?.focus(); } }}
                maxLength={200}
                aria-label="Titre"
              />
              <div className="editor-toolbar" role="toolbar" aria-label="Mise en forme">
                {TOOLS.map(({ icon: Icon, label, run }) => (
                  <button key={label} type="button" onClick={run} title={label} aria-label={label}><Icon size={15} /></button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                className="editor-content"
                placeholder={'Commencez à écrire…\n\n## Un titre de section\n\nDu texte avec du **gras**, de l\'*italique* et des [liens](https://).\n\n- une liste\n- à puces'}
                value={form.content}
                onChange={e => update({ content: e.target.value })}
                onKeyDown={onEditorKey}
                aria-label="Contenu (Markdown)"
              />
            </div>

            <article className="editor-preview">
              <p className="kicker">
                {state === 'draft' ? 'Aperçu' : formatDateTime(post!.published_at!)} · {readingMinutes(form.content)} min de lecture
              </p>
              <h1 className="post-title">{form.title || 'Titre de l\'article'}</h1>
              <div className="prose">
                {form.excerpt && <p className="post-excerpt">{form.excerpt}</p>}
                {form.content.trim() ? <Markdown source={form.content} /> : <p className="admin-muted">L'aperçu apparaîtra ici.</p>}
              </div>
              {form.tags.length > 0 && <div className="tags post-tags">{form.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>}
            </article>
          </div>
        </section>

        {/* --- Réglages --- */}
        <aside className="editor-side">
          <label className="admin-field">
            <span>Résumé <em>{form.excerpt.length} / {EXCERPT_MAX}</em></span>
            <textarea rows={4} value={form.excerpt} maxLength={EXCERPT_MAX} onChange={e => update({ excerpt: e.target.value })} placeholder="Une ou deux phrases affichées sur la carte de l'article et en introduction." />
          </label>

          <label className="admin-field">
            <span>Slug (adresse)</span>
            <input value={form.slug} onChange={e => { setSlugTouched(true); update({ slug: slugify(e.target.value) }); }} placeholder="mon-article" />
            <small>/blog/{form.slug || slugify(form.title) || '…'}</small>
            {slugChangedLive && <small className="admin-warn">Attention : l'adresse publique changera et l'ancien lien ne fonctionnera plus.</small>}
          </label>

          <div className="admin-field">
            <span>Tags <em>{form.tags.length} / {MAX_TAGS}</em></span>
            <div className="tag-input">
              {form.tags.map(tag => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button type="button" onClick={() => update({ tags: form.tags.filter(t => t !== tag) })} aria-label={`Retirer ${tag}`}><X size={11} /></button>
                </span>
              ))}
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={onTagKey} onBlur={() => addTag(tagInput)} placeholder={form.tags.length ? '' : 'React, IA… puis Entrée'} disabled={form.tags.length >= MAX_TAGS} />
            </div>
          </div>

          <dl className="editor-stats">
            <div><dt>Mots</dt><dd>{words}</dd></div>
            <div><dt>Lecture</dt><dd>{readingMinutes(form.content)} min</dd></div>
            {post && <div><dt>Créé</dt><dd>{formatDateTime(post.created_at)}</dd></div>}
            {post?.published_at && <div><dt>{state === 'scheduled' ? 'En ligne le' : 'Publié le'}</dt><dd>{formatDateTime(post.published_at)}</dd></div>}
          </dl>

          <details className="editor-help">
            <summary>Aide Markdown & raccourcis</summary>
            <ul>
              <li><code>## Titre</code> · <code>### Sous-titre</code></li>
              <li><code>**gras**</code> · <code>*italique*</code> · <code>`code`</code></li>
              <li><code>[texte](https://…)</code> · <code>![légende](https://…)</code></li>
              <li><code>- liste</code> · <code>1. liste</code> · <code>&gt; citation</code></li>
              <li><kbd>Ctrl</kbd>+<kbd>S</kbd> enregistrer · <kbd>Ctrl</kbd>+<kbd>B</kbd>/<kbd>I</kbd>/<kbd>K</kbd></li>
            </ul>
          </details>

          {post && (
            <button type="button" className="admin-delete" onClick={remove} disabled={!!busy}>
              <Trash2 size={14} /> {busy === 'delete' ? 'Suppression…' : 'Supprimer l\'article'}
            </button>
          )}
        </aside>
      </div>
    </main>
  );
};

export default AdminEditor;
