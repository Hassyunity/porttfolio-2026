import React from 'react';
import '../assets/styles/Skills.css';

const Skills: React.FC = () => {
  const categories = [
    { name: "Frontend", list: ["TypeScript", "React", "Styles"] },
    { name: "Backend", list: ["Ruby on Rails", "Node.js", "PostgreSQL"] },
    { name: "DevOps", list: ["Git", "Docker", "Nginx", "CI/CD", "Cloud"] },
    { name: "Environnement de travail", list: ["VS Code", "Postman", "PostgreSQL", "Figma", "GitHub", "Jira", "ClickUp"] }
  ];

  return (
    <section id="skills" className="section-container">
      <h2 className="section-title"><span className="path">~/</span>Expertises</h2>
      
      <div className="skills-grid">
        {categories.map(cat => (
          <div key={cat.name} className="skill-cat">
            <h3 className="cat-title">{`# ${cat.name}`}</h3>
            <div className="skill-list">
              {cat.list.map(skill => (
                <div key={skill} className="skill-item">
                  <span className="arrow">▶</span>
                  <span className="skill-name">{skill}</span>
                  <div className="line"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- BLOC FOCUS ACTUEL --- */}
      <div className="focus-container">
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