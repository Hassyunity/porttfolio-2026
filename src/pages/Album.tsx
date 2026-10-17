import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../assets/styles/Album.css';
import alteaImg from '../assets/images/altea.jpg';
import leader from '../assets/images/leader.jpg';
import hmax from '../assets/images/h-max.png';
import auto from '../assets/images/auto.jpg';
import n8n from '../assets/images/n8n.png';
import Bmray from '../assets/images/b-mray.jpg';

const PHOTOS = [
  { url: alteaImg, title: 'Altea Flow', caption: 'Tableau de bord SaaS' },
  { url: auto, title: 'Auto | DECISIONS', caption: 'Workflows n8n' },
  { url: Bmray, title: 'B-Mray', caption: 'Plateforme multi-écrans' },
  { url: leader, title: 'Bazar Naka', caption: 'Supermarché en ligne' },
  { url: hmax, title: 'H-Max', caption: 'Assistant virtuel' },
  { url: n8n, title: 'n8n', caption: 'Automatisation' },
];

const Album: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') { event.preventDefault(); setActive((active + 1) % PHOTOS.length); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setActive((active - 1 + PHOTOS.length) % PHOTOS.length); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  const photo = active !== null ? PHOTOS[active] : null;

  return (
    <section className="page album">
      <header className="page-head rise">
        <p className="eyebrow">Album</p>
        <h1 className="page-title">Instants <em>capturés</em>, projets en images.</h1>
      </header>

      <div className="photo-grid">
        {PHOTOS.map((item, i) => (
          <button key={item.title} className="photo-card rise" style={{ '--d': 1 + i } as React.CSSProperties} onClick={() => setActive(i)}>
            <img src={item.url} alt={item.title} />
            <span className="photo-overlay">
              <strong>{item.title}</strong>
              <span>{item.caption}</span>
            </span>
          </button>
        ))}
      </div>

      {photo && active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.title} onClick={() => setActive(null)}>
          <button className="icon-btn lightbox-close" onClick={() => setActive(null)} aria-label="Fermer"><X size={20} /></button>
          <button className="icon-btn lightbox-nav lightbox-prev" onClick={event => { event.stopPropagation(); setActive((active - 1 + PHOTOS.length) % PHOTOS.length); }} aria-label="Photo précédente"><ChevronLeft size={20} /></button>
          <figure onClick={event => event.stopPropagation()}>
            <img src={photo.url} alt={photo.title} />
            <figcaption><strong>{photo.title}</strong> — {photo.caption} <span>{active + 1} / {PHOTOS.length}</span></figcaption>
          </figure>
          <button className="icon-btn lightbox-nav lightbox-next" onClick={event => { event.stopPropagation(); setActive((active + 1) % PHOTOS.length); }} aria-label="Photo suivante"><ChevronRight size={20} /></button>
        </div>
      )}
    </section>
  );
};

export default Album;
