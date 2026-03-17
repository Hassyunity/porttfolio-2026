import React from 'react';
import '../assets/styles/Footer.css';
import cvPath from '../assets/fichier/cv_fr.pdf'; 

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
          {/* Bloc CV */}
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
          
          {/* Le copyright passe automatiquement à la ligne grâce au flex-direction: column */}
          <p className="copyright">
            © {currentYear} // Hassy Tsihoarana.
          </p>
        </div>

        <div className="footer-right">
          <div className="contact-item">
            <span className="footer-label">tel:</span>
            <a href="tel:+261348123281" className="footer-link">+261 34 16 020 73</a>
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