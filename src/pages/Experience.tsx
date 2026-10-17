import React from 'react';
import '../assets/styles/Experience.css';
import { JOBS } from '../data/portfolio';

const Experience: React.FC = () => (
  <section className="page experience">
    <header className="page-head page-head-split rise">
      <div>
        <p className="eyebrow">Parcours</p>
        <h1 className="page-title">Du code à la <em>direction technique.</em></h1>
      </div>
      <p className="lead">
        Un parcours construit sur le terrain, des microservices critiques jusqu'au pilotage
        technique d'une entreprise.
      </p>
    </header>

    <ol className="jobs">
      {JOBS.map((job, i) => (
        <li key={job.company} className={`job rise ${job.current ? 'is-current' : ''}`} style={{ '--d': 1 + i } as React.CSSProperties}>
          <div className="job-meta">
            <span className="job-period">{job.period}</span>
            <span>{job.location}</span>
          </div>
          <h2>{job.company}</h2>
          <p className="job-title">{job.title}</p>
          <ul className="job-bullets">{job.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
          <div className="tags">{job.stack.map(tech => <span key={tech} className="tag">{tech}</span>)}</div>
        </li>
      ))}
    </ol>
  </section>
);

export default Experience;
