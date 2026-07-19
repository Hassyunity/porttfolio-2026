import React from 'react';
import '../assets/styles/Ticker.css';

const TICKER_ITEMS = [
  'RUBY ON RAILS', 'REACT', 'TYPESCRIPT', 'NODE.JS', 'DOCKER', 'POSTGRESQL',
  'N8N', 'CI/CD', 'CLOUD', 'API STRIPE', 'CRM PERSONNALISÉ', 'GIT'
];

const Ticker: React.FC = () => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker-track">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="ticker-item">
          {item}
          <span className="ticker-dot">•</span>
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
