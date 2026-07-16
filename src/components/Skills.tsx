import React from 'react';
import '../assets/styles/Skills.css';
import { useReveal } from '../hooks/useReveal';

const Skills: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const categories = [
    { name: "Frontend", list: ["TypeScript", "React", "Styles"] },
    { name: "Backend", list: ["Ruby on Rails", "Node.js", "PostgreSQL"] },
    { name: "DevOps", list: ["Git", "Docker", "Nginx", "CI/CD", "Cloud"] },
    { name: "Environnement de travail", list: ["VS Code", "Postman", "PostgreSQL", "Figma", "GitHub", "Jira", "ClickUp"] }
  ];

  let itemIndex = 0;

  return (
    <section
      id="skills"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <h2 className="section-title"><span className="path">~/</span>Expertises</h2>

      <div className="skills-grid">
        {categories.map(cat => (
          <div key={cat.name} className="skill-cat">
            <h3 className="cat-title">{`# ${cat.name}`}</h3>
            <div className="skill-list">
              {cat.list.map(skill => {
                const delay = itemIndex * 0.05;
                itemIndex += 1;
                return (
                  <div
                    key={skill}
                    className="skill-item reveal-item"
                    style={{ '--reveal-delay': `${delay}s` } as React.CSSProperties}
                  >
                    <span className="arrow">▶</span>
                    <span className="skill-name">{skill}</span>
                    <div className="line"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* --- BLOC FOCUS ACTUEL --- */}
      <div className="focus-container reveal-item" style={{ '--reveal-delay': `${itemIndex * 0.05 + 0.1}s` } as React.CSSProperties}>
        <div className="focus-box">
          <p className="focus-title"># Focus actuel</p>
          <p className="focus-text">
            Exploration des <span className="focus-highlight">fonctionnalités IA</span> dans le développement web moderne et l'automatisation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Skills;