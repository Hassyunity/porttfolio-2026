import React, { useState, useEffect } from 'react';
import '../assets/styles/Blog.css';
import { supabase } from '../lib/supabaseClient';

// Importation des fichiers JSON
import visionIA from './articles/vision_ia.json';
import securiteAPI from './articles/securite_api.json';

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

// Initialisation des articles
const blogPosts: BlogPost[] = [visionIA as BlogPost, securiteAPI as BlogPost];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Charger les commentaires depuis Supabase ---
  const fetchComments = async (postId: number) => {
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
  };

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  // --- Ajouter un commentaire via Supabase ---
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.author || !newComment.text) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from(COMMENTS_TABLE).insert({
        name: newComment.author,
        content: newComment.text,
        post_id: selectedPost.id
      });

      if (error) throw error;
      setNewComment({ author: '', text: '' });
      await fetchComments(selectedPost.id); // Recharge les commentaires
    } catch (err) {
      console.error('Erreur insertion commentaire:', err);
      setCommentsError("Le commentaire n'a pas pu être envoyé. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- VUE DÉTAILLÉE ---
  if (selectedPost) {
    const postComments = comments;

    return (
      <section id="blog-page" className="section-container detail-view">
        <button className="back-btn" onClick={() => setSelectedPost(null)}>
          <span className="arrow">←</span> back to blogs
        </button>

        <header className="post-header">
          <span className="post-date"># {selectedPost.date}</span>
          <h1 className="post-title-detail">{selectedPost.title}</h1>
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

        <hr className="divider" />

        {/* SECTION COMMENTAIRES */}
        <section className="comments-section">
          <h3 className="section-subtitle">
            <span className="path">//</span> commentaires ({postComments.length})
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
            <h4>Laissez un commentaire</h4>
            <input
              type="text"
              placeholder="Votre nom"
              value={newComment.author}
              onChange={(e) =>
                setNewComment({ ...newComment, author: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Votre message..."
              value={newComment.text}
              onChange={(e) =>
                setNewComment({ ...newComment, text: e.target.value })
              }
              rows={4}
              required
            ></textarea>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Envoi...' : 'Poster le commentaire'}
            </button>
          </form>
        </section>
      </section>
    );
  }

  // --- VUE LISTE (GRID) ---
  return (
    <section id="blog-page" className="section-container">
      <h2 className="section-title">
        <span className="path">~/</span>blogs
      </h2>
      <p className="comment">
        # Réflexions sur le code, l'IA et l'artisanat numérique.
      </p>

      <div className="projects-grid">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="project-card blog-card"
            onClick={() => setSelectedPost(post)}
          >
            <div className="card-header">
              <span className="post-date">{post.date}</span>
            </div>
            <h3 className="project-title">{post.title}</h3>
            <p className="project-desc">{post.excerpt}</p>
            <div className="project-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <span className="read-more">
              Lire l'article <span className="arrow">→</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogPage;