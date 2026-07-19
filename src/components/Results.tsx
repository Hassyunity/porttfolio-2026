import React from 'react';
import '../assets/styles/Results.css';
import { useReveal } from '../hooks/useReveal';
import SectionBackdrop from './SectionBackdrop';

interface ResultCard {
  context: string;
  title: string;
  description: string;
  tag: string;
}

const RESULTS: ResultCard[] = [
  {
    context: "ALTEA FLOW",
    title: "Automatisation de bout en bout",
    description: "Conception d'un SaaS complet de réconciliation de données piloté par agents IA (n8n), du backend Rails à l'infra Supabase.",
    tag: "SAAS EN PRODUCTION"
  },
  {
    context: "AUTO | DECISIONS",
    title: "Workflows métier transformés",
    description: "Automatisations n8n déployées pour des clients RH, Finance et Marketing, transformant des processus critiques en workflows fluides.",
    tag: "MULTI-CLIENTS"
  },
  {
    context: "PULSE BY INGEDATA",
    title: "Fiabilité renforcée",
    description: "Microservices RH (Recrutement, Talent, Candidat) couverts par des tests automatisés RSpec et Cypress pour limiter les régressions.",
    tag: "TESTS AUTOMATISÉS"
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
      <SectionBackdrop variant="results" />
      <h2 className="section-title">
        <span className="path">~/</span>résultats
        <span className="title-rule" />
        <span className="title-index">[05]</span>
      </h2>

      <div className="results-grid">
        {RESULTS.map((r, i) => (
          <div
            key={r.context}
            className="result-card reveal-item"
            style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}
          >
            <span className="result-context">{r.context}</span>
            <h3 className="result-title">{r.title}</h3>
            <p className="result-desc">{r.description}</p>
            <span className="result-tag">{r.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Results;
