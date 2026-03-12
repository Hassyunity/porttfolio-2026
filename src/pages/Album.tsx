import React from 'react';
import '../assets/styles/Album.css'; // Crée ce fichier pour le style
import alteaImg from '../assets/images/altea.png';
import leader from '../assets/images/leader.png';
import hmax from '../assets/images/h-max.png';
import auto from '../assets/images/auto.png';
import n8n from '../assets/images/n8n.png';
import Bmray from '../assets/images/b-mray.png';

const Album: React.FC = () => {
  const photos = [
    { id: 1, url: alteaImg, title: 'altea flow' },
    { id: 2, url: auto, title: 'Auto | DECISIONS' },
    { id: 3, url: leader, title: 'Leader' },
    { id: 4, url: hmax, title: 'H-Max' },
    { id: 5, url: n8n, title: 'n8n' },
    { id: 6, url: Bmray, title: 'B-Mray' }
  ];

  return (
    <div className="album-container">
      <header id="album" className="album-header">
        <h1 className="section-title"><span className="path">~/</span>album</h1>
        <p className="album-subtitle">Instants capturés.</p>
      </header>

      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-card">
            <img src={photo.url} alt={photo.title} loading="lazy" />
            <div className="photo-overlay">
              <span>{photo.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Album;