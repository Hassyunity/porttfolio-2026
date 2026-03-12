import React from 'react';
import '../assets/styles/About.css';

const About: React.FC = () => {
  const skills = [
    "Ruby on Rails", "TypeScript", "React", "Node.js", 
    "n8n", "Docker", "PostgreSQL", "deploiement"
  ];

  return (
    <section id="about" className="section-container">
      <h2 className="section-title"><span className="path">~/</span>about</h2>
      
      <div className="about-content">
        <div className="about-section">
          <p className="comment">
            <span className="hashtag">#</span> Qui je suis ?</p>
          <p>
            Développeur Full-stack, je transforme des architectures complexes
            en outils fluides et sécurisés qui font gagner des heures de travail
            aux équipes. Mon objectif est simple : convertir des idées complexes
            en solutions concrètes, performantes et surtout utiles au quotidien.
          </p>
        </div>

        <div className="about-section">
          <p className="comment">
            <span className="hashtag">#</span> Ce que je fais
          </p>
          <p className="desc-text">
            Spécialisé en <strong>Ruby on Rails </strong>
            et<strong> React</strong>,
            je conçois des solutions SaaS et des applications web modernes.
            Au-delà du développement, j'intègre des systèmes d'automatisation
            avec <strong>n8n</strong> et explore les fonctionnalités IA pour optimiser les processus
            métiers et maximiser la valeur délivrée.
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