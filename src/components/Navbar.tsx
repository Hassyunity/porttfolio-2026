import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
          <div className="logo-wrapper">
            <img src="/lg.png" alt="Logo" className="logo-img" />
          </div>
        </Link>
      </div>
      <div className="nav-links">
        {/* Liens avec ancres pour la navigation sur la même page */}
        <a href="/#about" className="nav-link link-about">./about</a>
        <a href="/#skills" className="nav-link link-skills">./skills</a>
        <a href="/#projects" className="nav-link link-projects">./projects</a>
        <a href="/#contact" className="nav-link link-contact">./contact</a>
        
        {/* Lien vers la page Blog */}
        <Link to="/blogs" className="nav-link link-blog">./blogs</Link>
      </div>
    </nav>
  );
};

export default Navbar;