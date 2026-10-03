import React from 'react';
import '../assets/styles/About.css';
import { useReveal } from '../hooks/useReveal';
import officePhoto from '../assets/images/bureau.jpg';

const PILLARS = [
  {
    title: 'Concevoir',
    text: "Des architectures SaaS claires et évolutives, pensées pour le produit autant que pour le code.",
  },
  {
    title: 'Automatiser',
    text: "Des workflows n8n et des agents IA qui suppriment les tâches répétitives et fiabilisent les données.",
  },
  {
    title: 'Piloter',
    text: "Déploiements cloud, CI/CD et coordination d'équipe : la technique au service des objectifs business.",
  },
];

const About: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="about-layout">
        <figure className="about-visual reveal-item">
          <img src={officePhoto} alt="Hassy Tsihoarana à son poste de travail" loading="lazy" />
          <figcaption>
            <span>Basé à</span> Madagascar
          </figcaption>
        </figure>

        <div className="about-body">
          <p className="eyebrow reveal-item">01 — Profil</p>
          <h2 className="section-title reveal-item" style={{ '--reveal-delay': '0.08s' } as React.CSSProperties}>
            Un développeur qui pense <em>produit</em>, pas seulement code.
          </h2>

          <div className="about-text reveal-item" style={{ '--reveal-delay': '0.16s' } as React.CSSProperties}>
            <p>
              Développeur full-stack passionné par la création de produits numériques, je transforme
              des idées en plateformes complètes : backend robuste, APIs efficaces et interfaces fluides.
            </p>
            <p>
              Spécialisé en <strong>Ruby on Rails</strong> et <strong>React</strong>, j'interviens sur
              l'ensemble de la chaîne — du développement aux déploiements <strong>Cloud</strong> — et
              j'intègre des systèmes d'automatisation avec <strong>n8n</strong> et des
              <strong> fonctionnalités IA</strong> pour maximiser la valeur délivrée.
            </p>
          </div>

          <blockquote className="about-quote reveal-item" style={{ '--reveal-delay': '0.24s' } as React.CSSProperties}>
            « Je code, j'automatise, j'optimise — et je ne m'arrête jamais d'apprendre. »
          </blockquote>
        </div>
      </div>

      <div className="about-pillars">
        {PILLARS.map((pillar, i) => (
          <article
            key={pillar.title}
            className="about-pillar reveal-item"
            style={{ '--reveal-delay': `${0.1 + i * 0.1}s` } as React.CSSProperties}
          >
            <span className="about-pillar-index">0{i + 1}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default About;
