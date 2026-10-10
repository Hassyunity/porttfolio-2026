import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import '../assets/styles/Blog.css';
import { supabase } from '../lib/supabaseClient';

// Importation des fichiers JSON
import visionIA from './articles/vision_ia.json';
import securiteAPI from './articles/securite_api.json';
import reactRailsLivraison from './articles/react_rails_livraison.json';

// --- INTERFACES ---
interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list';
  text?: string;
  items?: string[];
}

interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string | ContentBlock[];
  tags: string[];
}

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

// Initialisation des articles
const blogPosts: BlogPost[] = [
  reactRailsLivraison as BlogPost,
  visionIA as BlogPost,
  securiteAPI as BlogPost,
];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Charger les commentaires depuis Supabase ---
  const fetchComments = useCallback(async (postId: number) => {
    if (!supabase) {
      setCommentsError("Les commentaires sont momentanément indisponibles.");
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
      setCommentsError("Impossible de charger les commentaires pour le moment.");
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    setComments([]);
    setSubmitError(null);
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost, fetchComments]);

  // --- Ajouter un commentaire via Supabase ---
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newComment.author.trim();
    const content = newComment.text.trim();
    if (!supabase || !selectedPost) return;
    if (!name || content.length < 3) {
      setSubmitError('Merci de renseigner votre nom et un message (3 caractères minimum).');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .insert({ name, content, post_id: selectedPost.id })
        .select('id, post_id, name, content, created_at')
        .single();

      if (error) throw error;
      setNewComment({ author: '', text: '' });
      setComments((prev) => [data, ...prev]);
    } catch (err) {
      console.error('Erreur insertion commentaire:', err);
      setSubmitError("Le commentaire n'a pas pu être envoyé. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- VUE DÉTAILLÉE ---
  if (selectedPost) {
    const postComments = comments;

    return (
      <main className="blog-page blog-detail">
        <button className="back-btn" onClick={() => setSelectedPost(null)}>
          <ArrowLeft size={16} /> Tous les articles
        </button>

        <header className="post-header">
          <p className="eyebrow">{selectedPost.date}</p>
          <h1 className="post-title-detail">{selectedPost.title}</h1>
          <p className="post-excerpt">{selectedPost.excerpt}</p>
          <div className="project-tags">
            {selectedPost.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <article className="post-content">
          {Array.isArray(selectedPost.content) ? (
            selectedPost.content.map((block, index) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2 key={index} className="content-h2">
                      {block.text}
                    </h2>
                  );
                case 'list':
                  return (
                    <ul key={index} className="content-list">
                      {block.items?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                default:
                  return (
                    <p key={index} className="content-p">
                      {block.text}
                    </p>
                  );
              }
            })
          ) : (
            <p className="content-p">{selectedPost.content}</p>
          )}
        </article>

        {/* SECTION COMMENTAIRES */}
        <section className="comments-section">
          <h3 className="comments-title">
            Commentaires <span>({postComments.length})</span>
          </h3>

          <div className="comments-list">
            {commentsLoading ? (
              <p className="comment-empty">Chargement des commentaires...</p>
            ) : commentsError ? (
              <p className="comment-empty comment-error">{commentsError}</p>
            ) : postComments.length > 0 ? (
              postComments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author">{c.name}</span>
                    <span className="comment-date">
                      {new Date(c.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="comment-text">{c.content}</p>
                </div>
              ))
            ) : (
              <p className="comment-empty">Pas encore de commentaires. Soyez le premier !</p>
            )}
          </div>

          <form className="comment-form" onSubmit={handleAddComment}>
            <h4>Laisser un commentaire</h4>
            <input
              type="text"
              placeholder="Votre nom"
              value={newComment.author}
              maxLength={NAME_MAX}
              disabled={!supabase}
              onChange={(e) =>
                setNewComment({ ...newComment, author: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Votre message..."
              value={newComment.text}
              minLength={3}
              maxLength={CONTENT_MAX}
              disabled={!supabase}
              onChange={(e) =>
                setNewComment({ ...newComment, text: e.target.value })
              }
              rows={4}
              required
            ></textarea>
            {submitError && <p className="comment-empty comment-error">{submitError}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting || !supabase}>
              {submitting ? 'Envoi...' : 'Publier le commentaire'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  // --- VUE LISTE ---
  return (
    <main className="blog-page">
      <header className="page-header">
        <p className="eyebrow">Journal</p>
        <h1 className="section-title">
          Réflexions sur le code, l'<em>IA</em> et l'artisanat numérique.
        </h1>
      </header>

      <div className="blog-list">
        {blogPosts.map((post) => (
          <button
            key={post.id}
            className="blog-card"
            onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
          >
            <span className="blog-card-date">{post.date}</span>
            <span className="blog-card-main">
              <span className="blog-card-title">{post.title}</span>
              <span className="blog-card-excerpt">{post.excerpt}</span>
              <span className="project-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </span>
            </span>
            <span className="blog-card-read">
              Lire <ArrowRight size={16} />
            </span>
          </button>
        ))}
      </div>
    </main>
  );
};

export default BlogPage;
