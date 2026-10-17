import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import '../assets/styles/Blog.css';
import { supabase } from '../lib/supabaseClient';
import { usePublishedPosts } from '../lib/blogApi';
import { Markdown } from '../lib/markdown';
import { readingMinutes } from '../lib/readingTime';

interface Comment {
  id: number;
  post_id: number;
  name: string;
  content: string;
  created_at: string;
}

const COMMENTS_TABLE = 'comments_blogs_portfolio';
const NAME_MAX = 100;
const CONTENT_MAX = 500;
const COMMENTS_PER_PAGE = 3;
const GAP = 48;

// Pagine le texte en colonnes de la hauteur disponible, comme une liseuse.
function useColumnPager(deps: unknown[]) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ pages: 1, step: 0 });
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const flow = flowRef.current;
    if (!viewport || !flow) return;
    const width = viewport.clientWidth;
    const perPage = width > 860 ? 2 : 1;
    const colWidth = (width - GAP * (perPage - 1)) / perPage;
    flow.style.setProperty('--col-w', `${colWidth}px`);
    flow.style.setProperty('--gap', `${GAP}px`);
    const columns = Math.max(1, Math.round((flow.scrollWidth + GAP) / (colWidth + GAP)));
    const pages = Math.ceil(columns / perPage);
    setLayout({ pages, step: width + GAP });
    setPage(p => Math.min(p, pages - 1));
  }, []);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  return { viewportRef, flowRef, page, setPage, ...layout };
}

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const { posts, loading } = usePublishedPosts();
  const post = posts.find(item => item.slug === slug);
  const { viewportRef, flowRef, page, setPage, pages, step } = useColumnPager([post?.id]);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async (postId: number) => {
    if (!supabase) {
      setCommentsError('Les commentaires sont momentanément indisponibles.');
      return;
    }
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .select('id, post_id, name, content, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComments(data ?? []);
    } catch (err) {
      console.error('Erreur fetch commentaires:', err);
      setCommentsError('Impossible de charger les commentaires pour le moment.');
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (post) fetchComments(post.id);
  }, [post, fetchComments]);

  // Flèches : tournent les pages de l'article ; au bord, la navigation globale prend le relais.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea')) return;
      if (showComments) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault();
        return;
      }
      if (event.key === 'ArrowRight' && page < pages - 1) { event.preventDefault(); setPage(page + 1); }
      if (event.key === 'ArrowLeft' && page > 0) { event.preventDefault(); setPage(page - 1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [page, pages, setPage, showComments]);

  useEffect(() => {
    if (!showComments) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setShowComments(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showComments]);

  if (!post) return loading ? <div className="route-loading">Chargement</div> : <Navigate to="/blog" replace />;

  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = newComment.author.trim();
    const content = newComment.text.trim();
    if (!supabase) return;
    if (!name || content.length < 3) {
      setSubmitError('Merci de renseigner votre nom et un message (3 caractères minimum).');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .insert({ name, content, post_id: post.id })
        .select('id, post_id, name, content, created_at')
        .single();
      if (error) throw error;
      setNewComment({ author: '', text: '' });
      setComments(prev => [data, ...prev]);
      setCommentPage(0);
    } catch (err) {
      console.error('Erreur insertion commentaire:', err);
      setSubmitError("Le commentaire n'a pas pu être envoyé. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  const commentPages = Math.max(1, Math.ceil(comments.length / COMMENTS_PER_PAGE));
  const visibleComments = comments.slice(commentPage * COMMENTS_PER_PAGE, (commentPage + 1) * COMMENTS_PER_PAGE);

  return (
    <section className="page post">
      <header className="post-head rise">
        <Link to="/blog" className="post-back"><ArrowLeft size={15} /> Tous les articles</Link>
        <p className="kicker">{post.date} · {readingMinutes(post.content)} min de lecture</p>
        <h1 className="post-title">{post.title}</h1>
      </header>

      <div className="post-viewport rise" style={{ '--d': 1 } as React.CSSProperties} ref={viewportRef}>
        <div className="post-flow prose" ref={flowRef} style={{ transform: `translateX(${-page * step}px)` }}>
          <p className="post-excerpt">{post.excerpt}</p>
          <Markdown source={post.content} />
          <div className="tags post-tags">{post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
        </div>
      </div>

      <div className="post-controls rise" style={{ '--d': 2 } as React.CSSProperties}>
        <button type="button" className="icon-btn" onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Page précédente">
          <ChevronLeft size={18} />
        </button>
        <span className="post-progress" aria-live="polite">
          Page {page + 1} / {pages}
          <span className="post-progress-bar" aria-hidden="true"><span style={{ transform: `scaleX(${(page + 1) / pages})` }} /></span>
        </span>
        <button type="button" className="icon-btn" onClick={() => setPage(page + 1)} disabled={page >= pages - 1} aria-label="Page suivante">
          <ChevronRight size={18} />
        </button>
        <button type="button" className="btn btn-ghost post-comments-btn" onClick={() => setShowComments(true)}>
          <MessageCircle size={15} /> Commentaires ({comments.length})
        </button>
      </div>

      {showComments && (
        <div className="drawer-backdrop" onClick={() => setShowComments(false)}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Commentaires" onClick={event => event.stopPropagation()}>
            <div className="drawer-head">
              <h2>Commentaires <span>({comments.length})</span></h2>
              <button type="button" className="icon-btn" onClick={() => setShowComments(false)} aria-label="Fermer"><X size={18} /></button>
            </div>

            <div className="comments-list">
              {commentsLoading ? <p className="comment-empty">Chargement des commentaires…</p>
                : commentsError ? <p className="comment-empty comment-error">{commentsError}</p>
                : visibleComments.length ? visibleComments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-meta">
                      <strong>{comment.name}</strong>
                      <span>{new Date(comment.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                )) : <p className="comment-empty">Pas encore de commentaires. Soyez le premier !</p>}
            </div>

            {commentPages > 1 && (
              <div className="comments-pager">
                <button type="button" className="icon-btn" onClick={() => setCommentPage(p => p - 1)} disabled={commentPage === 0} aria-label="Commentaires plus récents"><ChevronLeft size={16} /></button>
                <span>{commentPage + 1} / {commentPages}</span>
                <button type="button" className="icon-btn" onClick={() => setCommentPage(p => p + 1)} disabled={commentPage >= commentPages - 1} aria-label="Commentaires plus anciens"><ChevronRight size={16} /></button>
              </div>
            )}

            <form className="comment-form" onSubmit={handleAddComment}>
              <input
                type="text"
                placeholder="Votre nom"
                value={newComment.author}
                maxLength={NAME_MAX}
                disabled={!supabase}
                onChange={event => setNewComment({ ...newComment, author: event.target.value })}
                required
              />
              <textarea
                placeholder="Votre message…"
                value={newComment.text}
                minLength={3}
                maxLength={CONTENT_MAX}
                disabled={!supabase}
                onChange={event => setNewComment({ ...newComment, text: event.target.value })}
                rows={3}
                required
              />
              {submitError && <p className="comment-empty comment-error">{submitError}</p>}
              <button type="submit" className="btn btn-primary" disabled={submitting || !supabase}>
                {submitting ? 'Envoi…' : 'Publier le commentaire'}
              </button>
            </form>
          </aside>
        </div>
      )}
    </section>
  );
};

export default BlogPost;
