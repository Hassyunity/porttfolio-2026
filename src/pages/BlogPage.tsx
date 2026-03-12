import React, { useState } from 'react';
import '../assets/styles/Blog.css';

// Importation des fichiers JSON
import visionIA from './articles/vision_ia.json';
import securiteAPI from './articles/securite_api.json';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

// On regroupe les articles importés
const blogPosts: BlogPost[] = [visionIA, securiteAPI];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <section id="blog-page" className="section-container detail-view">
        <button className="back-btn" onClick={() => setSelectedPost(null)}>
          <span className="arrow">←</span> back to blogs
        </button>
        
        <header className="post-header">
          <span className="post-date"># {selectedPost.date}</span>
          <h1 className="post-title-detail">{selectedPost.title}</h1>
          <div className="project-tags">
            {selectedPost.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </header>

        <article className="post-content">
          <p>{selectedPost.content}</p>
        </article>
      </section>
    );
  }

  return (
    <section id="blog-page" className="section-container">
      <h2 className="section-title"><span className="path">~/</span>blogs</h2>
      <p className="comment"># Et si l'IA devient notre assistante de création, sans jamais remplacer notre vision.</p>
      
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