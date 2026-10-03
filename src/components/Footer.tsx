import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDownToLine } from 'lucide-react';
import '../assets/styles/Footer.css';
import cvPath from '../assets/fichier/cv_fr.pdf';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-name">Hassy Tsihoarana</p>
            <p className="footer-tagline">Développeur Full-stack · DevOps · CTO</p>
            <a href={cvPath} download="CV_Hassy_Tsihoarana.pdf" className="btn btn-ghost footer-cv">
              Télécharger le CV <ArrowDownToLine size={15} />
            </a>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <span className="footer-col-title">Navigation</span>
              <a href="/#about">Profil</a>
              <a href="/#skills">Expertises</a>
              <a href="/#projects">Projets</a>
              <Link to="/blogs">Blog</Link>
              <Link to="/album">Album</Link>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Contact</span>
              <a href="mailto:hassy.tsihoarana@gmail.com">hassy.tsihoarana@gmail.com</a>
              <a href="tel:+261341602073">+261 34 16 020 73</a>
              <a href="https://www.linkedin.com/in/tsihoarana-hassy-b8349020b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/Hassyunity" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Hassy Tsihoarana. Tous droits réservés.</p>
          <button
            className="footer-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Retour en haut <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
