import React from 'react';
import '../assets/styles/Results.css';
import { useReveal } from '../hooks/useReveal';

interface ResultCard {
  context: string;
  title: string;
  description: string;
  tag: string;
}

const RESULTS: ResultCard[] = [
  {
    context: "Altea Flow",
    title: "Automatisation de bout en bout",
    description: "Conception d'un SaaS complet de réconciliation de données piloté par agents IA (n8n), du backend Rails à l'infra Supabase.",
    tag: "SaaS en production"
  },
  {
    context: "Auto | DECISIONS",
    title: "Workflows métier transformés",
    description: "Automatisations n8n déployées pour des clients RH, Finance et Marketing, transformant des processus critiques en workflows fluides.",
    tag: "Multi-clients"
  },
  {
    context: "Pulse by Ingedata",
    title: "Fiabilité renforcée",
    description: "Microservices RH (Recrutement, Talent, Candidat) couverts par des tests automatisés RSpec et Cypress pour limiter les régressions.",
    tag: "Tests automatisés"
  }
];

const Results: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="results"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="results-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow reveal-item">05 — Résultats</p>
            <h2 className="section-title reveal-item">
              Des résultats <em>concrets</em>, pas des promesses.
            </h2>
          </div>
        </div>

        <div className="results-grid">
          {RESULTS.map((r, i) => (
            <article
              key={r.context}
              className="result-card reveal-item"
              style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}
            >
              <span className="result-context">{r.context}</span>
              <h3 className="result-title">{r.title}</h3>
              <p className="result-desc">{r.description}</p>
              <span className="result-tag">{r.tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
