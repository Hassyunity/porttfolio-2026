import React from 'react';
import '../assets/styles/Experience.css';
import { useReveal } from '../hooks/useReveal';
import SectionBackdrop from './SectionBackdrop';

interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

const JOBS: Job[] = [
  {
    title: "Fullstack Developer, DevOps & CTO",
    company: "XR Technologie",
    location: "Madagascar",
    period: "ACTUEL",
    bullets: [
      "Pilotage technique et architecture globale des produits (CTO)",
      "Développement fullstack avec Ruby on Rails et React",
      "Déploiements, infrastructure et automatisation (DevOps)",
      "Gestion de projets transverses et coordination d'équipe"
    ]
  },
  {
    title: "Développeur Full-stack",
    company: "Pulse by Ingedata",
    location: "Madagascar",
    period: "PRÉCÉDENT",
    bullets: [
      "Développement de microservices RH (Recrutement, Talent, Candidat)",
      "Mise en place de tests automatisés avec RSpec et Cypress",
      "Stack : Ruby on Rails, PostgreSQL, AppScript, Docker"
    ]
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
      <SectionBackdrop variant="experience" />
      <h2 className="section-title">
        <span className="path">~/</span>parcours
        <span className="title-rule" />
        <span className="title-index">[03]</span>
      </h2>

      <div className="timeline">
        {JOBS.map((job, i) => (
          <div
            key={job.company}
            className="timeline-entry reveal-item"
            style={{ '--reveal-delay': `${i * 0.15}s` } as React.CSSProperties}
          >
            <span className="timeline-dot" />
            <div className="timeline-card">
              <div className="timeline-card-header">
                <div>
                  <h3 className="timeline-title">{job.title}</h3>
                  <p className="timeline-company">
                    {job.company} <span className="timeline-location">// {job.location}</span>
                  </p>
                </div>
                <span className="timeline-period">{job.period}</span>
              </div>
              <ul className="timeline-bullets">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
