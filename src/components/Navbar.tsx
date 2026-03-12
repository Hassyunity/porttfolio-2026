import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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

      {/* Bouton Burger */}
      <div className={`burger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>

      {/* Liens de navigation */}
      <div className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
        <a href="/#about" className="nav-link link-about" onClick={closeMenu}>./about</a>
        <a href="/#skills" className="nav-link link-skills" onClick={closeMenu}>./skills</a>
        <a href="/#projects" className="nav-link link-projects" onClick={closeMenu}>./projects</a>
        <a href="/#contact" className="nav-link link-contact" onClick={closeMenu}>./contact</a>
        <Link to="/blogs" className="nav-link link-blog" onClick={closeMenu}>./blogs</Link>
        <Link to="/album" className="nav-link link-album" onClick={closeMenu}>./album</Link>
      </div>
    </nav>
  );
};

export default Navbar;