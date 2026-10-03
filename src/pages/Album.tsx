import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import '../assets/styles/Album.css';
import alteaImg from '../assets/images/altea.jpg';
import leader from '../assets/images/leader.jpg';
import hmax from '../assets/images/h-max.png';
import auto from '../assets/images/auto.jpg';
import n8n from '../assets/images/n8n.png';
import Bmray from '../assets/images/b-mray.jpg';

interface Photo {
  id: number;
  url: string;
  title: string;
  caption: string;
}

const PHOTOS: Photo[] = [
  { id: 1, url: alteaImg, title: 'Altea Flow', caption: 'Tableau de bord SaaS' },
  { id: 2, url: auto, title: 'Auto | DECISIONS', caption: 'Workflows n8n' },
  { id: 3, url: Bmray, title: 'B-Mray', caption: 'Plateforme multi-écrans' },
  { id: 4, url: leader, title: 'Bazar Naka', caption: 'Supermarché en ligne' },
  { id: 5, url: hmax, title: 'H-Max', caption: 'Assistant virtuel' },
  { id: 6, url: n8n, title: 'n8n', caption: 'Automatisation' }
];

const Album: React.FC = () => {
  const [active, setActive] = useState<Photo | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <main className="album-page">
      <header className="page-header">
        <p className="eyebrow">Album</p>
        <h1 className="section-title">
          Instants <em>capturés</em>, projets en images.
        </h1>
      </header>

      <div className="photo-grid">
        {PHOTOS.map((photo) => (
          <button key={photo.id} className="photo-card" onClick={() => setActive(photo)}>
            <img src={photo.url} alt={photo.title} loading="lazy" />
            <span className="photo-overlay">
              <span className="photo-title">{photo.title}</span>
              <span className="photo-caption">{photo.caption}</span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Fermer">
            <X size={20} />
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={active.url} alt={active.title} />
            <figcaption>
              <span>{active.title}</span> — {active.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
};

export default Album;
