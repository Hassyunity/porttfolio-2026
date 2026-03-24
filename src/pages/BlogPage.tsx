import React, { useState, useEffect } from 'react';
import '../assets/styles/Blog.css';

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

// --- URL API dynamique ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Initialisation des articles
const blogPosts: BlogPost[] = [visionIA as BlogPost, securiteAPI as BlogPost];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });

  // --- Charger les commentaires depuis l'API ---
  const fetchComments = async (postId: number) => {
    try {
      const res = await fetch(`${API_URL}/comments?post_id=${postId}`);
      const data: Comment[] = await res.json();
      // Trier les plus récents en premier
      setComments(
        data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (err) {
      console.error('Erreur fetch commentaires:', err);
    }
  };

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  // --- Ajouter un commentaire via l'API ---
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.author || !newComment.text) return;

    const payload = {
      comment: {
        name: newComment.author,
        content: newComment.text,
        post_id: selectedPost.id
      }
    };

    try {
      await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setNewComment({ author: '', text: '' });
      fetchComments(selectedPost.id); // Recharge les commentaires
    } catch (err) {
      console.error('Erreur POST commentaire:', err);
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
            {postComments.length > 0 ? (
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
            <button type="submit" className="submit-btn">
              Poster le commentaire
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