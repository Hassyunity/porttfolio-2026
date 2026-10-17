import React from 'react';
import { ArrowUpRight, ArrowRight, ArrowDownToLine } from 'lucide-react';
import '../assets/styles/Contact.css';
import cvPath from '../assets/fichier/cv_fr.pdf';
import { CONTACT_METHODS, EMAIL } from '../data/portfolio';

const Contact: React.FC = () => (
  <section className="page contact">
    <div className="contact-cta">
      <p className="eyebrow rise">Contact</p>
      <h1 className="contact-title rise" style={{ '--d': 1 } as React.CSSProperties}>
        Construisons <em>ensemble</em> votre prochain produit.
      </h1>
      <p className="lead rise" style={{ '--d': 2 } as React.CSSProperties}>
        Un SaaS à lancer, un processus à automatiser ou une équipe technique à structurer ?
        Parlons-en, je réponds généralement sous 24 heures.
      </p>
      <div className="contact-actions rise" style={{ '--d': 3 } as React.CSSProperties}>
        <a href={`mailto:${EMAIL}?subject=${encodeURIComponent('Projet — prise de contact')}`} className="btn btn-primary">
          Démarrer une conversation <ArrowRight size={16} />
        </a>
        <a href={cvPath} download="CV_Hassy_Tsihoarana.pdf" className="btn btn-ghost">
          Télécharger le CV <ArrowDownToLine size={15} />
        </a>
      </div>
    </div>

    <ul className="contact-list">
      {CONTACT_METHODS.map(({ label, value, link, Icon }, i) => (
        <li key={label} className="rise" style={{ '--d': 2 + i } as React.CSSProperties}>
          <a
            href={link}
            target={link.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="contact-row"
          >
            <span className="contact-icon"><Icon size={18} strokeWidth={1.5} /></span>
            <span className="contact-text">
              <span className="kicker">{label}</span>
              <span className="contact-value">{value}</span>
            </span>
            <ArrowUpRight size={18} className="contact-arrow" />
          </a>
        </li>
      ))}
    </ul>

    <p className="contact-legal">© {new Date().getFullYear()} Hassy Tsihoarana. Tous droits réservés.</p>
  </section>
);

export default Contact;
