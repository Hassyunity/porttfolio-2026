import React from 'react';
import '../assets/styles/About.css';

const About: React.FC = () => {
  const skills = [
    "Ruby on Rails", "TypeScript", "React", "Node.js", 
    "n8n", "Docker", "PostgreSQL", "deploiement"
  ];

  return (
    <section id="about" className="section-container">
      <h2 className="section-title"><span className="path">~/</span>A propos</h2>
      
      <div className="about-content">
        <div className="about-section">
          <p className="comment">
            <span className="hashtag">#</span> Qui je suis ?</p>
          <p>
            Développeur Full-stack passionné par la création de produits numériques,
            je transforme des idées en plateformes complètes : backend robuste,
            APIs efficaces et interfaces fluides. Mon objectif est simple :
            créer des outils intelligents qui simplifient le travail et apportent un vrai impact.
            en solutions concrètes, performantes et surtout utiles au quotidien.
          </p>
        </div>

        <div className="about-section">
          <p className="comment">
            <span className="hashtag">#</span> Ce que je fais
          </p>
          <p className="desc-text">
            Spécialisé en <strong>Ruby on Rails</strong> et <strong>React</strong>,
            je conçois des solutions <strong>SaaS</strong> et des applications
            <strong> web modernes</strong>.
            J’interviens sur l’ensemble de la chaîne technique,
            du développement aux déploiements <strong>Cloud</strong>, afin de construire des plateformes robustes,
            évolutives et performantes.
            Au-delà du développement, j’intègre des systèmes d’automatisation avec <strong>n8n</strong> et
            j’explore les <strong>fonctionnalités IA</strong> pour optimiser les processus métiers et maximiser 
            la valeur délivrée.
          </p>
        </div>

        <div className="about-section">
          <p className="comment">
            <span className="hashtag">#</span> Mon approche
          </p>
          <p>Je code, j'automatise, j'optimise, et je ne m'arrête jamais d'apprendre.</p>
        </div>

        {/* Grille de tags identique à l'image */}
        <div className="about-grid">
          {skills.map((skill) => (
            <div key={skill} className="skill-tag">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;