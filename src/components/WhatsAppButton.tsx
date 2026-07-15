import React from 'react';
import '../assets/styles/WhatsApp.css';

const WHATSAPP_NUMBER = '261385841524';
const DEFAULT_MESSAGE = 'Bonjour Hassy, je vous contacte depuis votre portfolio.';

const WhatsAppButton: React.FC = () => {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-bubble"
      aria-label="Contacter sur WhatsApp"
    >
      <span className="whatsapp-tooltip">Discutons sur WhatsApp</span>
      <svg className="whatsapp-icon" viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.48L4 29l7.72-1.87A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.8c-1.98 0-3.827-.55-5.406-1.5l-.386-.23-4.58 1.11 1.137-4.46-.252-.4A9.77 9.77 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.4-7.34c-.297-.15-1.755-.866-2.027-.966-.272-.1-.47-.15-.668.15-.198.298-.767.965-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.254-.462-2.39-1.475-.883-.788-1.48-1.76-1.653-2.058-.173-.298-.018-.46.13-.608.134-.133.298-.347.446-.52.15-.174.198-.298.298-.496.1-.198.05-.372-.025-.52-.075-.15-.668-1.612-.916-2.207-.24-.578-.485-.5-.668-.51l-.57-.01c-.198 0-.52.075-.792.372-.272.298-1.04 1.017-1.04 2.48 0 1.463 1.065 2.877 1.213 3.075.15.198 2.096 3.2 5.08 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.755-.717 2.003-1.41.248-.694.248-1.288.173-1.41-.074-.124-.272-.198-.57-.347z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;
