import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDownToLine } from 'lucide-react';
import '../assets/styles/Navbar.css';
import cvPath from '../assets/fichier/cv_fr.pdf';

const SECTION_LINKS = [
  { id: 'about', label: 'Profil' },
  { id: 'skills', label: 'Expertises' },
  { id: 'experience', label: 'Parcours' },
  { id: 'projects', label: 'Projets' },
  { id: 'contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloque le scroll de la page quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Nav "spy" : surligne le lien de la section actuellement visible à l'écran
  useEffect(() => {
    if (!isHome) return;

    const sections = SECTION_LINKS
      .map(({ id }) => document.getElementById(id))
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

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar ${isScrolled || !isHome ? 'is-scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="nav-brand" onClick={() => { window.scrollTo(0, 0); closeMenu(); }}>
          <img src="/lg.png" alt="" className="nav-brand-logo" />
          <span className="nav-brand-name">Hassy Tsihoarana</span>
        </Link>

        <nav className={`nav-links ${isOpen ? 'nav-active' : ''}`} aria-label="Navigation principale">
          {SECTION_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`/#${id}`}
              className={`nav-link ${isHome && activeSection === id ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
          <Link to="/blogs" className={`nav-link ${location.pathname === '/blogs' ? 'active' : ''}`} onClick={closeMenu}>Blog</Link>
          <Link to="/album" className={`nav-link ${location.pathname === '/album' ? 'active' : ''}`} onClick={closeMenu}>Album</Link>

          <a href={cvPath} download="CV_Hassy_Tsihoarana.pdf" className="nav-cv nav-cv-mobile" onClick={closeMenu}>
            Télécharger le CV <ArrowDownToLine size={15} />
          </a>
        </nav>

        <a href={cvPath} download="CV_Hassy_Tsihoarana.pdf" className="nav-cv nav-cv-desktop">
          CV <ArrowDownToLine size={14} />
        </a>

        <button
          className={`burger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
