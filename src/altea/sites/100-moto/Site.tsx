import { useEffect } from 'react';
import { ArrowRight, Bike, Clock, CreditCard, Gauge, Mail, MapPin, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { content as c } from './content';
import './site.css';

const ICONS = { wrench: Wrench, gauge: Gauge, shield: ShieldCheck, card: CreditCard };

const Site = () => {
  useEffect(() => {
    document.title = `${c.name} · ${c.tagline}`;
  }, []);

  return (
    <div className="m100">
      <header className="m100-header">
        <a href="#accueil" className="m100-logo"><span>100%</span> Moto</a>
        <nav className="m100-nav" aria-label="Sections">
          <a href="#motos">Motos</a>
          <a href="#atelier">Atelier</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href={c.phoneHref} className="m100-btn m100-btn-small"><Phone size={15} /> {c.phone}</a>
      </header>

      <main>
        <section id="accueil" className="m100-hero">
          <div className="m100-wrap">
            <p className="m100-kicker">{c.tagline} · {c.city}</p>
            <h1>{c.hero.title.split('\n').map(line => <span key={line}>{line}</span>)}</h1>
            <p className="m100-lead">{c.hero.text}</p>
            <div className="m100-actions">
              <a href="#motos" className="m100-btn">Voir les motos <ArrowRight size={16} /></a>
              <a href="#contact" className="m100-btn m100-btn-ghost">Prendre rendez-vous</a>
            </div>
            <dl className="m100-highlights">
              {c.highlights.map(item => (
                <div key={item.label}><dt>{item.value}</dt><dd>{item.label}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section id="motos" className="m100-section">
          <div className="m100-wrap">
            <p className="m100-kicker">En ce moment</p>
            <h2>Neuves et occasions</h2>
            <ul className="m100-chips">{c.categories.map(category => <li key={category}>{category}</li>)}</ul>
            <ul className="m100-bikes">
              {c.bikes.map(bike => (
                <li key={bike.name} className="m100-bike">
                  <div className="m100-bike-visual" aria-hidden="true"><Bike size={56} strokeWidth={1.2} /></div>
                  <div className="m100-bike-body">
                    <span className={`m100-tag ${bike.condition === 'Neuve' ? 'is-new' : ''}`}>{bike.condition}</span>
                    <h3>{bike.name}</h3>
                    <p>{bike.category} · {bike.detail}</p>
                    <strong>{bike.price}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="atelier" className="m100-section m100-section-alt">
          <div className="m100-wrap">
            <p className="m100-kicker">Services</p>
            <h2>L'atelier et le magasin</h2>
            <ul className="m100-services">
              {c.services.map(service => {
                const Icon = ICONS[service.icon as keyof typeof ICONS];
                return (
                  <li key={service.title}>
                    <Icon size={22} />
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="contact" className="m100-section">
          <div className="m100-wrap m100-contact">
            <div>
              <p className="m100-kicker">Nous trouver</p>
              <h2>Passez nous voir</h2>
              <ul className="m100-infos">
                <li><MapPin size={18} /> <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer">{c.address}</a></li>
                <li><Phone size={18} /> <a href={c.phoneHref}>{c.phone}</a></li>
                <li><Mail size={18} /> <a href={`mailto:${c.email}`}>{c.email}</a></li>
              </ul>
              <div className="m100-actions">
                <a href={c.phoneHref} className="m100-btn"><Phone size={16} /> Appeler</a>
                <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className="m100-btn m100-btn-ghost"><MapPin size={16} /> Itinéraire</a>
              </div>
            </div>
            <div className="m100-hours">
              <h3><Clock size={18} /> Horaires</h3>
              <dl>
                {c.hours.map(row => (
                  <div key={row.days}><dt>{row.days}</dt><dd>{row.time}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="m100-footer">
        <div className="m100-wrap">
          <span>© {new Date().getFullYear()} {c.name}</span>
          <span>Site de démonstration : contenu fictif · Réalisé par Altea</span>
        </div>
      </footer>
    </div>
  );
};

export default Site;
