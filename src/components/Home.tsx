import React from 'react';
import '../assets/styles/Home.css';
import myPhoto from '../assets/images/pdp.jpeg';

const Home: React.FC = () => {
  return (
    <section id="home" className="home-container">
      <div className="home-wrapper">
        <div className="hero-content">
          <h1>Bienvenue sur mon portfolio</h1>
          <h1><span className="chevron">{">"}</span> Hassy Tsihoarana -</h1>
          <h1 className="highlight">Développeur Full-stack<span className="cursor"></span></h1>
          
          <div className="hero-sub">
            <p><span className="dollar">$</span> Code, Build, Deploy</p>
            <p className="desc">J'aime explorer de nouvelles idées et technos directement dans mes projets.</p>
          </div>

          <div className="hero-btns">
            <button 
              className="btn-light" 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Voir les projets
            </button>
            <button 
              className="btn-dark" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Me contacter
            </button>
          </div>
        </div>

        {/* Section Photo */}
        <div className="hero-image-container">
          <div className="photo-circle">
            <img src={myPhoto} alt="Hassy Tsihoarana" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;