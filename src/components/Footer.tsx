import React from 'react';
import '../assets/styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="color-bar">
        <span className="bar orange"></span>
        <span className="bar gold"></span>
        <span className="bar yellow"></span>
        <span className="bar green"></span>
        <span className="bar light-blue"></span>
        <span className="bar purple"></span>
      </div>
      
      <div className="footer-container">
        <div className="footer-left">
          <p className="copyright">
            © {currentYear} // Hassy Tsihoarana.
          </p>
        </div>

        <div className="footer-right">
          <div className="contact-item">
            <span className="footer-label">tel:</span>
            <a href="tel:+261348123281" className="footer-link">+261 34 81 232 81</a>
          </div>
          <div className="contact-item">
            <span className="footer-label">mail:</span>
            <a href="mailto:hassy.tsihoarana@gmail.com" className="footer-link">hassy.tsihoarana@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;