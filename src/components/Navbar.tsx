import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import '../assets/styles/Navbar.css';
import cvPath from '../assets/fichier/cv_fr.pdf';

const SECTION_IDS = ['about', 'skills', 'experience', 'projects', 'contact'];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
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

  const isHome = location.pathname === '/';

  // Nav "spy" : surligne le lien de la section actuellement visible à l'écran
  useEffect(() => {
    if (!isHome) return;

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

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
        <span className="logo-sys">Hassy</span>
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
        <a href="/#about" className={`nav-link link-about ${isHome && activeSection === 'about' ? 'active' : ''}`} onClick={closeMenu}>PROFIL</a>
        <a href="/#skills" className={`nav-link link-skills ${isHome && activeSection === 'skills' ? 'active' : ''}`} onClick={closeMenu}>EXPERTISES</a>
        <a href="/#experience" className={`nav-link link-experience ${isHome && activeSection === 'experience' ? 'active' : ''}`} onClick={closeMenu}>PARCOURS</a>
        <a href="/#projects" className={`nav-link link-projects ${isHome && activeSection === 'projects' ? 'active' : ''}`} onClick={closeMenu}>PROJETS</a>
        <a href="/#contact" className={`nav-link link-contact ${isHome && activeSection === 'contact' ? 'active' : ''}`} onClick={closeMenu}>CONTACT</a>
        <Link to="/blogs" className="nav-link link-blog" onClick={closeMenu}>BLOGS</Link>
        <Link to="/album" className="nav-link link-album" onClick={closeMenu}>ALBUMS</Link>
        <button
          className={`theme-toggle ${theme === 'light' ? 'is-light' : ''}`}
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          aria-label="Basculer le thème clair/sombre"
          aria-pressed={theme === 'light'}
        >
          <span className="toggle-track">
            <span className="toggle-star toggle-star-1" />
            <span className="toggle-star toggle-star-2" />
            <span className="toggle-star toggle-star-3" />
            <span className="toggle-thumb">
              {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
            </span>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;