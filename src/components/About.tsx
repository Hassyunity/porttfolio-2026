import React from 'react';
import '../assets/styles/About.css';
import { useReveal } from '../hooks/useReveal';
import SectionBackdrop from './SectionBackdrop';

const About: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const skills = [
    "Ruby on Rails", "TypeScript", "React", "Node.js",
    "n8n", "Docker", "PostgreSQL", "deploiement"
  ];

  return (
    <section
      id="about"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionBackdrop variant="about" />
      <h2 className="section-title">
        <span className="path">~/</span>A propos
        <span className="title-rule" />
        <span className="title-index">[01]</span>
      </h2>

      <div className="about-layout">
        <div className="about-main">
          <div className="about-section reveal-item" style={{ '--reveal-delay': '0s' } as React.CSSProperties}>
            <p className="comment">
              <span className="hashtag">#</span> Qui je suis ?</p>
            <p>
              Développeur Full-stack passionné par la création de produits numériques,
              je transforme des idées en plateformes complètes : backend robuste,
              APIs efficaces et interfaces fluides. Mon objectif est simple :
              créer des outils intelligents qui simplifient le travail et apportent un vrai impact
              en solutions concrètes, performantes et surtout utiles au quotidien.
            </p>
          </div>

          <div className="about-section reveal-item" style={{ '--reveal-delay': '0.12s' } as React.CSSProperties}>
            <p className="comment">
              <span className="hashtag">#</span> Ce que je fais
            </p>
            <p className="desc-text">
              Spécialisé en <strong>Ruby on Rails</strong> et <strong>React</strong>,
              je conçois des solutions <strong>SaaS</strong> et des applications
              <strong> web modernes</strong>.
              J'interviens sur l'ensemble de la chaîne technique,
              du développement aux déploiements <strong>Cloud</strong>, afin de construire des plateformes robustes,
              évolutives et performantes.
              Au-delà du développement, j'intègre des systèmes d'automatisation avec <strong>n8n</strong> et
              j'explore les <strong>fonctionnalités IA</strong> pour optimiser les processus métiers et maximiser
              la valeur délivrée.
            </p>
          </div>

          <div className="about-section reveal-item" style={{ '--reveal-delay': '0.24s' } as React.CSSProperties}>
            <p className="comment">
              <span className="hashtag">#</span> Mon approche
            </p>
            <p>Je code, j'automatise, j'optimise, et je ne m'arrête jamais d'apprendre.</p>
          </div>

          <div className="skills-card reveal-item" style={{ '--reveal-delay': '0.36s' } as React.CSSProperties}>
            <p className="skills-card-title">STACK PRINCIPALE</p>
            <div className="about-grid">
              {skills.map((skill) => (
                <div key={skill} className="skill-tag">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-side">
          <div className="side-stats reveal-item" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
            <div className="side-stat">
              <span className="side-stat-value">3-5</span>
              <span className="side-stat-label">ANS D'EXPÉRIENCE</span>
            </div>
            <div className="side-stat">
              <span className="side-stat-value">7</span>
              <span className="side-stat-label">PROJETS LIVRÉS</span>
            </div>
          </div>

          <div className="side-card reveal-item" style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}>
            <div className="side-card-header">
              <span className="side-card-icon">⌘</span>
              <span className="side-card-tag">ACTUEL</span>
            </div>
            <p className="side-card-title">CTO &amp; Responsable Projet</p>
            <p className="side-card-desc">Fullstack Developer / DevOps chez XR Technologie.</p>
          </div>

          <div className="side-location reveal-item" style={{ '--reveal-delay': '0.3s' } as React.CSSProperties}>
            <span>BASE : MADAGASCAR</span>
            <span className="side-location-tag">DISPONIBLE</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
