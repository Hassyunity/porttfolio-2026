import React from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, ArrowRight } from 'lucide-react';
import '../assets/styles/Contact.css';
import { useReveal } from '../hooks/useReveal';

const EMAIL = 'hassy.tsihoarana@gmail.com';

const CONTACT_METHODS = [
  {
    label: 'Email',
    value: EMAIL,
    link: `mailto:${EMAIL}`,
    Icon: Mail
  },
  {
    label: 'LinkedIn',
    value: 'tsihoarana-hassy',
    link: 'https://www.linkedin.com/in/tsihoarana-hassy-b8349020b/',
    Icon: Linkedin
  },
  {
    label: 'GitHub',
    value: 'Hassyunity · 73 dépôts',
    link: 'https://github.com/Hassyunity',
    Icon: Github
  }
];

const Contact: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="contact"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="contact-layout">
        <div className="contact-cta">
          <p className="eyebrow reveal-item">06 — Contact</p>
          <h2 className="contact-heading reveal-item" style={{ '--reveal-delay': '0.08s' } as React.CSSProperties}>
            Construisons <em>ensemble</em> votre prochain produit.
          </h2>
          <p className="section-lead reveal-item" style={{ '--reveal-delay': '0.16s' } as React.CSSProperties}>
            Un SaaS à lancer, un processus à automatiser ou une équipe technique à structurer ?
            Parlons-en — je réponds généralement sous 24 heures.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent('Projet — prise de contact')}`}
            className="btn btn-primary contact-main-btn reveal-item"
            style={{ '--reveal-delay': '0.24s' } as React.CSSProperties}
          >
            Démarrer une conversation <ArrowRight size={16} />
          </a>
        </div>

        <ul className="contact-list">
          {CONTACT_METHODS.map(({ label, value, link, Icon }, index) => (
            <li
              key={label}
              className="reveal-item"
              style={{ '--reveal-delay': `${0.15 + index * 0.08}s` } as React.CSSProperties}
            >
              <a
                href={link}
                target={link.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="contact-row"
              >
                <span className="contact-icon"><Icon size={18} strokeWidth={1.5} /></span>
                <span className="contact-text">
                  <span className="contact-label">{label}</span>
                  <span className="contact-value">{value}</span>
                </span>
                <ArrowUpRight size={18} className="contact-arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Contact;
