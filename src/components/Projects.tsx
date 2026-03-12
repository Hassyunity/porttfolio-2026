import React from 'react';
import '../assets/styles/Projects.css';

interface Project {
  title: string;
  description: string;
  tags: string[];
  status: 'production' | 'development';
  link: string;
  repo?: string;
}

const Projects: React.FC = () => {
  const projectList: Project[] = [
    {
      title: "Pulse by Ingedata",
      description: "Plateforme RH & Gestion de projets d'entreprise. Développement de microservices (Recrutement, Talent, Candidat ...) et tests automatisés.",
      tags: ["Ruby on Rails", "PostgreSQL", "AppScript", "RSpec", "Cypress", "Docker"],
      status: "production",
      link: "#"
    },
    {
      title: "Altea Flow",
      description: "SaaS d'automatisation de workflows métier et réconciliation de données via agents IA (n8n).",
      tags: ["n8n", "Ruby on Rails", "React", "PostgreSQL", "Supabase", "render/netlify"],
      status: "production",
      link: "https://altea-flow.netlify.app/"
    },
    {
      title: "Auto | DECISIONS",
      description: "Agence d'automatisation intelligente spécialisée sur n8n. Solutions sur mesure pour RH, Finance et Marketing visant à transformer des processus critiques en workflows fluides.",
      tags: ["n8n", "Workflow Automation", "API Integration", "AI Agents"],
      status: "production",
      link: "https://auto-decisions.netlify.app"
    },
    {
      title: "Babel Goods",
      description: "Solution e-commerce pour boutiques Facebook. Gestion centralisée des commandes, clients et statistiques de ventes.",
      tags: ["React", "Vite.js", "Tailwind CSS"],
      status: "production",
      link: "https://babel-goods-fr.onrender.com/"
    },
    {
      title: "Bazar Naka",
      description: "Supermarché en ligne complet permettant l'exploration de produits et la gestion de panier dynamique.",
      tags: ["Ruby on Rails", "PostgreSQL", "HTML/CSS"],
      status: "production",
      link: "https://bazarnaka.onrender.com/"
    },
    {
      title: "H-max AI",
      description: "Assistant virtuel interactif intégrant une logique algorithmique personnalisée et une API météo en temps réel.",
      tags: ["React", "TypeScript", "Vite.js", "OpenWeather API"],
      status: "production",
      link: "https://H-max.netlify.app/"
    },
    {
      title: "API RESTful Node/React",
      description: "Projet full-stack axé sur la création d'endpoints personnalisés et la consommation d'APIs REST modernes.",
      tags: ["Node.js", "React", "Vite.js", "Express"],
      status: "production",
      link: "https://react-node-811w.onrender.com/"
    }
  ];

  return (
    <section id="projects" className="section-container">
      <h2 className="section-title"><span className="path">~/</span>projets</h2>
      
      <div className="projects-grid">
        {projectList.map((project, index) => (
          <div key={index} className="project-card">
            <div className="card-header">
              <h3 className="project-title">{project.title}</h3>
              <span className={`status-badge ${project.status}`}>
                {project.status}
              </span>
            </div>
            
            <p className="project-desc">{project.description}</p>
            
            <div className="project-tags">
              {project.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            
            <div className="project-footer">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="view-link">
                voir le site <span className="arrow">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;