import React from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import '../assets/styles/Projects.css';
import { useReveal } from '../hooks/useReveal';
import alteaImg from '../assets/images/altea.jpg';
import autoImg from '../assets/images/auto.jpg';
import bazarImg from '../assets/images/leader.jpg';
import hmaxImg from '../assets/images/h-max.png';

interface Project {
  title: string;
  category: string;
  year?: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
}

const FEATURED: Project[] = [
  {
    title: "Altea Flow",
    category: "SaaS · Agents IA",
    year: "2026",
    description: "SaaS d'automatisation de workflows métier et de réconciliation de données piloté par des agents IA. Conçu de bout en bout, du backend Rails à l'infrastructure Supabase.",
    tags: ["n8n", "Ruby on Rails", "React", "PostgreSQL", "Supabase"],
    link: "https://altea-flow.netlify.app/",
    image: alteaImg
  },
  {
    title: "Auto | DECISIONS",
    category: "Agence d'automatisation",
    description: "Agence d'automatisation intelligente spécialisée sur n8n. Des solutions sur mesure pour les équipes RH, Finance et Marketing qui transforment des processus critiques en workflows fluides.",
    tags: ["n8n", "Workflow Automation", "API Integration", "AI Agents"],
    link: "https://auto-decisions.netlify.app",
    image: autoImg
  },
  {
    title: "Bazar Naka",
    category: "E-commerce",
    description: "Supermarché en ligne complet : exploration du catalogue, promotions et gestion dynamique du panier.",
    tags: ["Ruby on Rails", "PostgreSQL", "HTML/CSS"],
    link: "https://bazarnaka.onrender.com/",
    image: bazarImg
  },
  {
    title: "H-max AI",
    category: "Assistant virtuel",
    description: "Assistant virtuel interactif intégrant une logique algorithmique personnalisée et une API météo en temps réel.",
    tags: ["React", "TypeScript", "Vite.js", "OpenWeather API"],
    link: "https://H-max.netlify.app/",
    image: hmaxImg
  }
];

const OTHERS: Project[] = [
  {
    title: "Pulse by Ingedata",
    category: "Plateforme RH d'entreprise",
    description: "Microservices Recrutement, Talent et Candidat, couverts par des tests automatisés.",
    tags: ["Ruby on Rails", "PostgreSQL", "RSpec", "Cypress", "Docker"]
  },
  {
    title: "Babel Goods",
    category: "E-commerce social",
    description: "Gestion centralisée des commandes, clients et statistiques de ventes pour boutiques Facebook.",
    tags: ["React", "Vite.js", "Tailwind CSS"],
    link: "https://babel-goods-fr.onrender.com/"
  },
  {
    title: "API RESTful Node/React",
    category: "Full-stack",
    description: "Création d'endpoints personnalisés et consommation d'APIs REST modernes.",
    tags: ["Node.js", "Express", "React", "Vite.js"],
    link: "https://react-node-811w.onrender.com/"
  }
];

const Projects: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>(0.05);

  return (
    <section
      id="projects"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="section-head">
        <div>
          <p className="eyebrow reveal-item">04 — Projets</p>
          <h2 className="section-title reveal-item">
            Des produits <em>en production</em>, utilisés au quotidien.
          </h2>
        </div>
        <p className="section-lead reveal-item" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
          Une sélection de plateformes SaaS, d'outils d'automatisation et d'applications web
          que j'ai conçus, développés et déployés.
        </p>
      </div>

      <div className="featured-list">
        {FEATURED.map((project, index) => (
          <article
            key={project.title}
            className={`featured-card reveal-item ${index % 2 === 1 ? 'is-reversed' : ''}`}
          >
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-media"
              aria-label={`Voir le site ${project.title}`}
            >
              <img src={project.image} alt={`Aperçu de ${project.title}`} loading="lazy" />
            </a>

            <div className="featured-body">
              <div className="featured-meta">
                <span className="featured-index">0{index + 1}</span>
                <span>{project.category}</span>
                {project.year && <span>{project.year}</span>}
              </div>
              <h3 className="featured-title">{project.title}</h3>
              <p className="featured-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="featured-link">
                Voir le site <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="others reveal-item">
        <h3 className="others-title">Autres réalisations</h3>
        <ul className="others-list">
          {OTHERS.map((project) => {
            const content = (
              <>
                <span className="others-name">{project.title}</span>
                <span className="others-category">{project.category}</span>
                <span className="others-desc">{project.description}</span>
                <span className="others-action">
                  {project.link ? (
                    <ArrowUpRight size={18} />
                  ) : (
                    <span className="others-private"><Lock size={13} /> Confidentiel</span>
                  )}
                </span>
              </>
            );

            return (
              <li key={project.title}>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="others-row">
                    {content}
                  </a>
                ) : (
                  <div className="others-row">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
