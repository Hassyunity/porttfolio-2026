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
  id: string;
  postId: number;
  author: string;
  text: string;
  date: string;
}

// Initialisation des articles
const blogPosts: BlogPost[] = [visionIA as BlogPost, securiteAPI as BlogPost];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // États pour les commentaires
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });

  // Charger les commentaires au montage du composant
  useEffect(() => {
    const savedComments = localStorage.getItem('blog_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Fonction pour ajouter un commentaire
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.author || !newComment.text) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId: selectedPost.id,
      author: newComment.author,
      text: newComment.text,
      date: new Date().toLocaleDateString('fr-FR')
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem('blog_comments', JSON.stringify(updatedComments));
    setNewComment({ author: '', text: '' });
  };

  // --- VUE DÉTAILLÉE ---
  if (selectedPost) {
    const postComments = comments.filter(c => c.postId === selectedPost.id);

    return (
      <section id="blog-page" className="section-container detail-view">
        <button className="back-btn" onClick={() => setSelectedPost(null)}>
          <span className="arrow">←</span> back to blogs
        </button>
        
        <header className="post-header">
          <span className="post-date"># {selectedPost.date}</span>
          <h1 className="post-title-detail">{selectedPost.title}</h1>
          <div className="project-tags">
            {selectedPost.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </header>

        <article className="post-content">
          {Array.isArray(selectedPost.content) ? (
            selectedPost.content.map((block, index) => {
              switch (block.type) {
                case 'heading':
                  return <h2 key={index} className="content-h2">{block.text}</h2>;
                case 'list':
                  return (
                    <ul key={index} className="content-list">
                      {block.items?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  );
                default:
                  return <p key={index} className="content-p">{block.text}</p>;
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
              postComments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author">{c.author}</span>
                    <span className="comment-date">{c.date}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
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
              onChange={(e) => setNewComment({...newComment, author: e.target.value})}
              required
            />
            <textarea 
              placeholder="Votre message..." 
              value={newComment.text}
              onChange={(e) => setNewComment({...newComment, text: e.target.value})}
              rows={4}
              required
            ></textarea>
            <button type="submit" className="submit-btn">Poster le commentaire</button>
          </form>
        </section>
      </section>
    );
  }

  // --- VUE LISTE (GRID) ---
  return (
    <section id="blog-page" className="section-container">
      <h2 className="section-title"><span className="path">~/</span>blogs</h2>
      <p className="comment"># Réflexions sur le code, l'IA et l'artisanat numérique.</p>
      
      <div className="projects-grid">
        {blogPosts.map(post => (
          <div key={post.id} className="project-card blog-card" onClick={() => setSelectedPost(post)}>
            <div className="card-header">
              <span className="post-date">{post.date}</span>
            </div>
            <h3 className="project-title">{post.title}</h3>
            <p className="project-desc">{post.excerpt}</p>
            <div className="project-tags">
              {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
            <span className="read-more">read article <span className="arrow">→</span></span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogPage;