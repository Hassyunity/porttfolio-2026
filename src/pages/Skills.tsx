import React from 'react';
import { Sparkles } from 'lucide-react';
import '../assets/styles/Skills.css';
import { CAPABILITIES, TOOLS } from '../data/portfolio';

const Skills: React.FC = () => (
  <section className="page skills">
    <header className="page-head page-head-split rise">
      <div>
        <p className="eyebrow">Expertises</p>
        <h1 className="page-title">De l'idée à la <em>production</em>, sans couture.</h1>
      </div>
      <p className="lead">
        Une maîtrise de bout en bout de la chaîne technique : un seul interlocuteur, du premier
        schéma d'architecture au dernier déploiement.
      </p>
    </header>

    <div className="skills-grid">
      {CAPABILITIES.map(({ Icon, name, description, list }, i) => (
        <article key={name} className="skill-card rise" style={{ '--d': 1 + i } as React.CSSProperties}>
          <span className="skill-icon"><Icon size={20} strokeWidth={1.5} /></span>
          <h2>{name}</h2>
          <p>{description}</p>
          <ul>{list.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </article>
      ))}
    </div>

    <div className="skills-footer rise" style={{ '--d': 5 } as React.CSSProperties}>
      <div className="skills-tools">
        <span className="kicker">Au quotidien</span>
        <div className="tags">{TOOLS.map(tool => <span key={tool} className="tag">{tool}</span>)}</div>
      </div>
      <p className="skills-focus">
        <Sparkles size={17} strokeWidth={1.5} />
        <span><b>Focus actuel</b> Intégrer l'<em>intelligence artificielle</em> au web et à l'automatisation.</span>
      </p>
    </div>
  </section>
);

export default Skills;
