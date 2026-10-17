import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../assets/styles/Blog.css';
import { BLOG_POSTS } from '../data/blog';

const BlogPage: React.FC = () => (
  <section className="page blog">
    <header className="page-head rise">
      <p className="eyebrow">Journal</p>
      <h1 className="page-title">Réflexions sur le code, l'<em>IA</em> et l'artisanat numérique.</h1>
    </header>

    <div className="blog-grid">
      {BLOG_POSTS.map((post, i) => (
        <Link key={post.id} to={`/blog/${post.id}`} className="blog-card rise" style={{ '--d': 1 + i } as React.CSSProperties}>
          <span className="blog-card-top">
            <span className="kicker">{post.date}</span>
            <span className="blog-card-num">{String(i + 1).padStart(2, '0')}</span>
          </span>
          <span className="blog-card-title">{post.title}</span>
          <span className="blog-card-excerpt">{post.excerpt}</span>
          <span className="tags">{post.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}</span>
          <span className="blog-card-read">Lire l'article <ArrowRight size={15} /></span>
        </Link>
      ))}
    </div>
  </section>
);

export default BlogPage;
