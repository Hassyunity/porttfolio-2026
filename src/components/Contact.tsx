import React from 'react';
import { Mail, Github, Linkedin, Monitor } from 'lucide-react';
import '../assets/styles/Contact.css';
import { useReveal } from '../hooks/useReveal';
import SectionBackdrop from './SectionBackdrop';

const Contact: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const contactMethods = [
    {
      label: "email",
      value: "hassy.tsihoarana@gmail.com",
      link: "mailto:hassy.tsihoarana@gmail.com",
      icon: <Mail size={18} />
    },
    {
      label: "github",
      value: "github.com/Hassyunity",
      link: "https://github.com/Hassyunity",
      extra: "73 repos",
      icon: <Github size={18} />
    },
    {
      label: "linkedin",
      value: "linkedin.com/in/tsihoarana-hassy/",
      link: "https://www.linkedin.com/in/tsihoarana-hassy-b8349020b/",
      icon: <Linkedin size={18} />
    },
    {
      label: "portfolio",
      value: "hassy.tsihoarana.com",
      link: "/",
      icon: <Monitor size={18} />
    }
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className={`section-container reveal-section ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionBackdrop variant="contact" />
      <h2 className="section-title">
        <span className="path">~/</span>contact
        <span className="title-rule" />
        <span className="title-index">[06]</span>
      </h2>

      <div className="contact-cta">
        <h3 className="contact-cta-heading">
          <span>CONSTRUISONS</span>
          <span className="contact-cta-accent">ENSEMBLE</span>
        </h3>
        <p className="contact-intro">
          <span className="arrow-prompt">&gt;</span> N'hésitez pas à me contacter :
        </p>
      </div>

      <div className="contact-grid">
        {contactMethods.map((method, index) => (
          <a
            key={index}
            href={method.link}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card reveal-item"
            style={{ '--reveal-delay': `${index * 0.08}s` } as React.CSSProperties}
          >
            <div className="contact-header">
              {method.icon}
              <span className="contact-label">{method.label}</span>
              {method.extra && <span className="contact-extra">{method.extra}</span>}
            </div>
            <p className="contact-value">{method.value}</p>
          </a>
        ))}
      </div>

      <div className="contact-status">
        <span className="status-dot" />
         LOCALISATION : MADAGASCAR
      </div>
    </section>
  );
};

export default Contact;