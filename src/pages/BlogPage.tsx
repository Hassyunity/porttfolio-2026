import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import '../assets/styles/Blog.css';
import { usePublishedPosts } from '../lib/blogApi';

const PER_PAGE = 3;

const BlogPage: React.FC = () => {
  const { posts } = usePublishedPosts();
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const visible = posts.slice(current * PER_PAGE, (current + 1) * PER_PAGE);

  return (
    <section className="page blog">
      <header className="page-head blog-head rise">
        <div>
          <p className="eyebrow">Journal</p>
          <h1 className="page-title">Réflexions sur le code, l'<em>IA</em> et l'artisanat numérique.</h1>
        </div>
        {pages > 1 && (
          <div className="blog-pager" aria-label="Pages d'articles">
            <button type="button" className="icon-btn" onClick={() => setPage(current - 1)} disabled={current === 0} aria-label="Articles plus récents"><ChevronLeft size={18} /></button>
            <span>{current + 1} / {pages}</span>
            <button type="button" className="icon-btn" onClick={() => setPage(current + 1)} disabled={current >= pages - 1} aria-label="Articles plus anciens"><ChevronRight size={18} /></button>
          </div>
        )}
      </header>

      <div className="blog-grid" key={current}>
        {visible.map((post, i) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card rise" style={{ '--d': 1 + i } as React.CSSProperties}>
            <span className="blog-card-top">
              <span className="kicker">{post.date}</span>
              <span className="blog-card-num">{String(current * PER_PAGE + i + 1).padStart(2, '0')}</span>
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
};

export default BlogPage;
