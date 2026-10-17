import type React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code2 } from 'lucide-react';
import '../assets/styles/Home.css';
import myPhoto from '../assets/images/pdp-cutout.webp';

const STACK = ['Ruby on Rails', 'React', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL', 'n8n', 'CI/CD', 'Cloud', 'API Stripe', 'Agents IA'];

const Home = () => (
  <section className="page home">
    <div className="home-glow" aria-hidden="true" />

    <div className="home-content">
      <p className="home-status rise"><span className="status-dot" /> Disponible pour de nouveaux projets</p>
      <p className="kicker rise" style={{ '--d': 1 } as React.CSSProperties}>Full-stack · DevOps · CTO</p>
      <h1 className="home-title">
        <span className="rise" style={{ '--d': 2 } as React.CSSProperties}>Du code.</span>
        <span className="rise" style={{ '--d': 3 } as React.CSSProperties}>De l’impact.</span>
        <em className="rise" style={{ '--d': 4 } as React.CSSProperties}>Du caractère.</em>
      </h1>
      <p className="home-intro rise" style={{ '--d': 5 } as React.CSSProperties}>
        Je conçois des produits web qui font la différence : développement full-stack,
        automatisation et direction technique, de votre idée à la production.
      </p>
      <div className="home-actions rise" style={{ '--d': 6 } as React.CSSProperties}>
        <Link to="/projets" className="btn btn-primary">Voir mes projets <ArrowUpRight size={17} /></Link>
        <Link to="/contact" className="btn btn-ghost">Parlons de votre projet</Link>
      </div>
    </div>

    <figure className="home-portrait rise" style={{ '--d': 3 } as React.CSSProperties}>
      <div className="portrait-ring" aria-hidden="true" />
      <img src={myPhoto} alt="Portrait de Hassy Tsihoarana, développeur full-stack et CTO" fetchPriority="high" />
      <div className="portrait-chip" aria-hidden="true"><Code2 size={16} /> Idée → Code → Production</div>
      <figcaption className="portrait-card">
        <span className="portrait-label">Actuellement</span>
        <strong>CTO & Responsable projet</strong>
        <span>XR Technologie · Madagascar</span>
      </figcaption>
    </figure>

    <div className="home-ticker" aria-hidden="true">
      <div className="ticker-track">
        {[...STACK, ...STACK].map((item, i) => <span key={i}>{item}<i>✦</i></span>)}
      </div>
    </div>
  </section>
);

export default Home;
