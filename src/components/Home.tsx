import React from 'react';
import '../assets/styles/Home.css';
import myPhoto from '../assets/images/pdps.png';
import myOffice from '../assets/images/bureau.jpeg';

const Home: React.FC = () => {
  return (
    <section id="home" className="home-container">
      <div className="home-wrapper">
        <div className="hero-content">
          <div className="hero-status">
            <span className="status-dot" />
            SYSTÈME EN LIGNE // PRÊT POUR NOUVELLES MISSIONS
          </div>

          <p className="hero-role">DÉVELOPPEUR FULL-STACK &amp; CTO</p>

          <h1 className="hero-name">
            <span>HASSY</span>
            <span className="hero-name-accent">TSIHOARANA</span>
          </h1>

          <div className="hero-intro">
            <p>
              Je transforme des idées en plateformes complètes : backend robuste,
              APIs efficaces et interfaces fluides. J'automatise, je déploie,
              je pilote la technique.
            </p>
          </div>

          <div className="hero-btns">
            <button
              className="btn-light"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Voir mes projets
            </button>
            <button
              className="btn-dark"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Me contacter
            </button>
          </div>
        </div>

        {/* Photo avec flip au survol */}
        <div className="hero-image-container">
          <div className="photo-circle">
            <div className="photo-flip-inner">
              <div className="photo-face photo-face-front">
                <img src={myPhoto} alt="Hassy Tsihoarana" />
              </div>
              <div className="photo-face photo-face-back">
                <img src={myOffice} alt="Espace de travail de Hassy Tsihoarana" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
