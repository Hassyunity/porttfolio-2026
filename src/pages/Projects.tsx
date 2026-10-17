import React, { useState } from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import '../assets/styles/Projects.css';
import { PROJECTS } from '../data/portfolio';

const Projects: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const project = PROJECTS[current];

  return (
    <section className="page projects">
      <header className="page-head rise">
        <p className="eyebrow">Réalisations</p>
        <h1 className="page-title">Des idées devenues <em>produits.</em></h1>
      </header>

      <div className="projects-body">
        <ol className="projects-list rise" style={{ '--d': 1 } as React.CSSProperties} aria-label="Liste des projets">
          {PROJECTS.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                className={`projects-item ${i === current ? 'is-active' : ''}`}
                aria-pressed={i === current}
                onClick={() => setCurrent(i)}
                onMouseEnter={() => setCurrent(i)}
              >
                <span className="projects-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="projects-name">{item.title}</span>
                <span className="projects-cat">{item.category}</span>
              </button>
            </li>
          ))}
        </ol>

        <article key={project.title} className="project-detail" aria-live="polite">
          <div className={`project-cover ${project.image ? '' : 'is-generated'}`}>
            {project.image
              ? <img src={project.image} alt={`Aperçu de ${project.title}`} />
              : <strong aria-hidden="true">{project.wordmark}</strong>}
          </div>
          <div className="project-info">
            <div className="project-meta">
              <span>{project.category}</span>
              {project.year && <span>{project.year}</span>}
              {project.impact && <span className="project-impact">{project.impact}</span>}
            </div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="tags">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
            {project.link
              ? <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary project-open">Voir le projet <ArrowUpRight size={16} /></a>
              : <span className="project-private"><Lock size={13} /> Projet confidentiel</span>}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Projects;
