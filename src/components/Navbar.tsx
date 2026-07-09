import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import cvPath from '../assets/fichier/cv_fr.pdf'; 

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${isOpen ? 'menu-open' : ''}`}>
      <div className="nav-logo">
        <Link to="/" onClick={() => { window.scrollTo(0, 0); closeMenu(); }}>
          <div className="logo-wrapper">
            <img src="/lg.png" alt="Logo" className="logo-img" />
          </div>
        </Link>
      </div>
<div className="contact-item cv-download">
            <a 
              href={cvPath} 
              download="CV_Hassy_Tsihoarana.pdf" 
              className="footer-link highlight cv-link-container"
            >
              <span className="pointing-hand">👉</span>
              <span className="download-text">Download_CV</span>
            </a>
          </div>
      {/* Bouton Burger */}
      <div className={`burger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>

      {/* Liens de navigation */}
      <div className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
        <a href="/#about" className="nav-link link-about" onClick={closeMenu}>./A propos</a>
        <a href="/#skills" className="nav-link link-skills" onClick={closeMenu}>./Expertises</a>
        <a href="/#projects" className="nav-link link-projects" onClick={closeMenu}>./projects</a>
        <a href="/#contact" className="nav-link link-contact" onClick={closeMenu}>./contacts</a>
        <Link to="/blogs" className="nav-link link-blog" onClick={closeMenu}>./blogs</Link>
        <Link to="/album" className="nav-link link-album" onClick={closeMenu}>./albums</Link>
        <button
          className="nav-link theme-toggle"
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;