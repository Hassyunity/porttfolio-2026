import React from 'react';
import '../assets/styles/Ticker.css';

const TICKER_ITEMS = [
  'Ruby on Rails', 'React', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL',
  'n8n', 'CI/CD', 'Cloud', 'API Stripe', 'CRM sur mesure', 'Agents IA'
];

const Ticker: React.FC = () => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker-track">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="ticker-item">
          {item}
          <span className="ticker-sep">✦</span>
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
