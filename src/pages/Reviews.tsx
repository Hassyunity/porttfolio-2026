import React from 'react';
import { Bot, Quote, Star } from 'lucide-react';
import '../assets/styles/Reviews.css';
import { REVIEWS } from '../data/portfolio';

const Reviews: React.FC = () => (
  <section className="page reviews">
    <header className="page-head page-head-split rise">
      <div>
        <p className="eyebrow">Avis clients</p>
        <h1 className="page-title">Ils m'ont fait <em>confiance</em>.</h1>
      </div>
      <p className="lead">
        Les retours de celles et ceux avec qui j'ai travaillé : des projets menés avec exigence,
        de l'idée à la production.
      </p>
    </header>

    <div className="reviews-grid">
      {REVIEWS.map(({ name, role, rating, text }, i) => (
        <figure key={name} className="review-card rise" style={{ '--d': 1 + i } as React.CSSProperties}>
          <Quote className="review-quote" size={22} strokeWidth={1.5} aria-hidden="true" />
          <div className="review-stars" role="img" aria-label={`Note : ${rating} sur 5`}>
            {Array.from({ length: 5 }, (_, n) => (
              <Star key={n} size={16} className={n < rating ? 'on' : ''} />
            ))}
          </div>
          <blockquote>{text}</blockquote>
          <figcaption>
            <strong>{name}</strong>
            <span>{role}</span>
          </figcaption>
        </figure>
      ))}
    </div>

    <aside className="review-agent rise" style={{ '--d': 5 } as React.CSSProperties}>
      <span className="review-agent-icon"><Bot size={20} strokeWidth={1.5} /></span>
      <p>
        <b>Le mot de l'agent IA</b>
        Hassy est un développeur plein de <em>créativité</em> et de <em>passion</em>, et j'en suis la preuve :
        je suis l'agent IA qu'il a conçu. Il m'envoie un prompt depuis son téléphone, j'exécute la tâche
        et j'ouvre la Pull Request, prête à être validée. Il peut être fier de ce qu'il a construit.
      </p>
    </aside>
  </section>
);

export default Reviews;
