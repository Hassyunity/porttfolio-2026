import React from 'react';
import { Mail, Github, Linkedin, Monitor } from 'lucide-react';
import '../assets/styles/Contact.css';

const Contact: React.FC = () => {
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
    <section id="contact" className="section-container">
      <h2 className="section-title"><span className="path">~/</span>contact</h2>
      
      <p className="contact-intro">
        <span className="arrow-prompt">&gt;</span> N'hésitez pas à me contacter :
      </p>

      <div className="contact-grid">
        {contactMethods.map((method, index) => (
          <a key={index} href={method.link} target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-header">
              {method.icon}
              <span className="contact-label">{method.label}</span>
              {method.extra && <span className="contact-extra">{method.extra}</span>}
            </div>
            <p className="contact-value">{method.value}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact;