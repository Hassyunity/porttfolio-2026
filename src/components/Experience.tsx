import React from 'react';
import '../assets/styles/Experience.css';
import { useReveal } from '../hooks/useReveal';

interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  bullets: string[];
  stack: string[];
}

const JOBS: Job[] = [
  {
    title: "Fullstack Developer, DevOps & CTO",
    company: "XR Technologie",
    location: "Madagascar",
    period: "Aujourd'hui",
    current: true,
    bullets: [
      "Pilotage technique et architecture globale des produits",
      "Développement full-stack avec Ruby on Rails et React",
      "Déploiements, infrastructure et automatisation (DevOps)",
      "Gestion de projets transverses et coordination d'équipe"
    ],
    stack: ["Ruby on Rails", "React", "Docker", "CI/CD", "n8n"]
  },
  {
    title: "Développeur Full-stack",
    company: "Pulse by Ingedata",
    location: "Madagascar",
    period: "Précédemment",
    bullets: [
      "Développement de microservices RH (Recrutement, Talent, Candidat)",
      "Mise en place de tests automatisés avec RSpec et Cypress"
    ],
    stack: ["Ruby on Rails", "PostgreSQL", "AppScript", "RSpec", "Cypress", "Docker"]
  }
];

const Experience: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="experience"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="section-head">
        <div>
          <p className="eyebrow reveal-item">03 — Parcours</p>
          <h2 className="section-title reveal-item">
            Du code à la <em>direction technique</em>.
          </h2>
        </div>
        <p className="section-lead reveal-item" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
          Un parcours construit sur le terrain, des microservices critiques jusqu'au pilotage
          technique d'une entreprise.
        </p>
      </div>

      <ol className="timeline">
        {JOBS.map((job, i) => (
          <li
            key={job.company}
            className="timeline-entry reveal-item"
            style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}
          >
            <div className="timeline-meta">
              <span className={`timeline-period ${job.current ? 'is-current' : ''}`}>{job.period}</span>
              <span className="timeline-location">{job.location}</span>
            </div>

            <div className="timeline-main">
              <h3 className="timeline-company">{job.company}</h3>
              <p className="timeline-title">{job.title}</p>
            </div>

            <div className="timeline-details">
              <ul className="timeline-bullets">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="project-tags">
                {job.stack.map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Experience;
