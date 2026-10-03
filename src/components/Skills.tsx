import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { LayoutTemplate, Server, CloudCog, Workflow, Sparkles } from 'lucide-react';
import '../assets/styles/Skills.css';
import { useReveal } from '../hooks/useReveal';

interface Capability {
  Icon: LucideIcon;
  name: string;
  description: string;
  list: string[];
}

const CAPABILITIES: Capability[] = [
  {
    Icon: LayoutTemplate,
    name: 'Frontend',
    description: 'Interfaces rapides, accessibles et soignées.',
    list: ['React', 'TypeScript', 'Vite', 'CSS moderne'],
  },
  {
    Icon: Server,
    name: 'Backend & API',
    description: 'Architectures robustes et APIs bien conçues.',
    list: ['Ruby on Rails', 'Node.js', 'PostgreSQL', 'REST / JWT'],
  },
  {
    Icon: CloudCog,
    name: 'DevOps & Cloud',
    description: 'Des mises en production sereines et répétables.',
    list: ['Docker', 'Nginx', 'CI/CD', 'Git', 'Cloud'],
  },
  {
    Icon: Workflow,
    name: 'SaaS, CRM & automatisation',
    description: 'Des processus métier qui tournent tout seuls.',
    list: ['n8n', 'Make (Integromat)', 'API Stripe', 'Signature électronique', 'CRM sur mesure'],
  },
];

const TOOLS = ['VS Code', 'Postman', 'Figma', 'GitHub', 'Jira', 'ClickUp', 'Trello'];

const Skills: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="skills"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="section-head">
        <div>
          <p className="eyebrow reveal-item">02 — Expertises</p>
          <h2 className="section-title reveal-item">
            De l'idée à la <em>production</em>, sans couture.
          </h2>
        </div>
        <p className="section-lead reveal-item" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
          Une maîtrise de bout en bout de la chaîne technique, pour que votre produit avance
          avec un seul interlocuteur, du premier schéma d'architecture au dernier déploiement.
        </p>
      </div>

      <div className="skills-grid">
        {CAPABILITIES.map(({ Icon, name, description, list }, i) => (
          <article
            key={name}
            className="skill-card reveal-item"
            style={{ '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties}
          >
            <span className="skill-icon"><Icon size={20} strokeWidth={1.4} /></span>
            <h3 className="skill-name">{name}</h3>
            <p className="skill-desc">{description}</p>
            <ul className="skill-list">
              {list.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="skills-footer reveal-item" style={{ '--reveal-delay': '0.35s' } as React.CSSProperties}>
        <div className="skills-tools">
          <span className="skills-tools-label">Au quotidien</span>
          <div className="project-tags">
            {TOOLS.map((tool) => (
              <span key={tool} className="tag">{tool}</span>
            ))}
          </div>
        </div>

        <div className="skills-focus">
          <Sparkles size={18} strokeWidth={1.4} />
          <p>
            <span>Focus actuel</span>
            Intégrer l'<em>intelligence artificielle</em> au développement web et à l'automatisation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Skills;
