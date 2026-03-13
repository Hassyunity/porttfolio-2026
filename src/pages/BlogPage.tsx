import React, { useState } from 'react';
import '../assets/styles/Blog.css';

// Importation des fichiers JSON
import visionIA from './articles/vision_ia.json';
import securiteAPI from './articles/securite_api.json';

// 1. Définition des types pour le contenu structuré
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
  // Content peut être soit l'ancien format (string) soit le nouveau (ContentBlock[])
  content: string | ContentBlock[]; 
  tags: string[];
}

const blogPosts: BlogPost[] = [visionIA as BlogPost, securiteAPI as BlogPost];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Vue détaillée de l'article
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
          {Array.isArray(selectedPost.content) ? (
            // Rendu si c'est le NOUVEAU format (Tableau d'objets)
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
            // Rendu si c'est l'ANCIEN format (Texte brut)
            <p className="content-p">{selectedPost.content}</p>
          )}
        </article>
      </section>
    );
  }

  // Vue liste des articles (Grid)
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