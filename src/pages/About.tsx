import React from 'react';
import '../assets/styles/About.css';
import officePhoto from '../assets/images/bureau.jpg';
import { PILLARS } from '../data/portfolio';

const About: React.FC = () => (
  <section className="page about">
    <figure className="about-visual rise">
      <img src={officePhoto} alt="Hassy Tsihoarana à son poste de travail" />
      <figcaption><span>Basé à</span> Madagascar</figcaption>
    </figure>

    <div className="about-body">
      <header className="rise" style={{ '--d': 1 } as React.CSSProperties}>
        <p className="eyebrow">Profil</p>
        <h1 className="page-title">Un développeur qui pense <em>produit</em>, pas seulement code.</h1>
      </header>

      <div className="about-text rise" style={{ '--d': 2 } as React.CSSProperties}>
        <p>
          Développeur full-stack passionné par la création de produits numériques, je transforme
          des idées en plateformes complètes : backend robuste, APIs efficaces et interfaces fluides.
        </p>
        <p>
          Spécialisé en <strong>Ruby on Rails</strong> et <strong>React</strong>, j'interviens sur toute la
          chaîne, du développement aux déploiements <strong>Cloud</strong>, et j'intègre de
          l'automatisation <strong>n8n</strong> et des <strong>fonctionnalités IA</strong>.
        </p>
      </div>

      <blockquote className="about-quote rise" style={{ '--d': 3 } as React.CSSProperties}>
        « Je code, j'automatise, j'optimise — et je ne m'arrête jamais d'apprendre. »
      </blockquote>

      <div className="about-pillars">
        {PILLARS.map((pillar, i) => (
          <article key={pillar.title} className="about-pillar rise" style={{ '--d': 4 + i } as React.CSSProperties}>
            <span>0{i + 1}</span>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default About;
