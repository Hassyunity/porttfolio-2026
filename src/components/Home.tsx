import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../assets/styles/Home.css';
import myPhoto from '../assets/images/pdp-cutout.webp';

const STATS = [
  { value: '3–5', label: "ans d'expérience full-stack" },
  { value: '7', label: 'produits livrés en production' },
  { value: 'CTO', label: 'chez XR Technologie' },
];

// Sapins sur la crête de droite : [x, y de la base, hauteur]
const PINES: [number, number, number][] = [
  [318, 262, 22], [330, 266, 28], [343, 262, 20], [356, 258, 26],
  [369, 256, 22], [382, 252, 30], [395, 250, 24], [12, 300, 22], [26, 304, 18]
];

const STARS: [number, number][] = [
  [40, 40], [92, 22], [150, 55], [262, 30], [318, 62], [365, 28], [70, 95], [345, 110]
];

// Paysage de montagne au crépuscule, avec sentier de randonnée balisé jusqu'au sommet
const MountainBackdrop: React.FC = () => (
  <svg className="hero-portrait-scene" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#15141c" />
        <stop offset="0.35" stopColor="#2c2220" />
        <stop offset="0.58" stopColor="#7a5634" />
        <stop offset="0.72" stopColor="#c6965c" />
      </linearGradient>
      <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#f6dfb2" />
        <stop offset="0.6" stopColor="#e2b77a" />
        <stop offset="1" stopColor="#d4a565" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#e9c48a" stopOpacity="0.55" />
        <stop offset="1" stopColor="#e9c48a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9b88a" stopOpacity="0" />
        <stop offset="0.5" stopColor="#d9b88a" stopOpacity="0.28" />
        <stop offset="1" stopColor="#d9b88a" stopOpacity="0" />
      </linearGradient>
    </defs>

    <rect width="400" height="500" fill="url(#sky)" />
    {STARS.map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#f3ede2" opacity="0.55" />
    ))}

    {/* Soleil couchant entre le portrait et le sommet de droite */}
    <circle className="scene-sun-glow" cx="268" cy="186" r="120" fill="url(#sunGlow)" />
    <circle cx="268" cy="186" r="40" fill="url(#sun)" />

    {/* Oiseaux */}
    <path d="M300 92 q5 -5 10 0 q5 -5 10 0 M326 78 q4 -4 8 0 q4 -4 8 0" fill="none" stroke="#2a211b" strokeWidth="1.2" strokeLinecap="round" />

    {/* Chaîne lointaine + neiges */}
    <path d="M0 255 L38 212 L70 236 L118 158 L158 222 L200 200 L246 236 L292 150 L332 206 L370 180 L400 210 V500 H0 Z" fill="#8a6443" opacity="0.75" />
    <path d="M118 158 L104 180 L113 176 L119 186 L126 175 L134 182 Z M292 150 L277 174 L287 169 L293 179 L300 168 L309 175 Z" fill="#f1dcb4" opacity="0.7" />
    <rect y="215" width="400" height="80" fill="url(#mist)" />

    {/* Chaîne intermédiaire */}
    <path d="M0 290 L52 238 L94 280 L140 250 L186 296 L232 276 L270 298 L322 236 L362 276 L400 248 V500 H0 Z" fill="#4a3627" />
    <rect y="270" width="400" height="70" fill="url(#mist)" opacity="0.8" />

    {/* Crête proche avec le sentier balisé et le fanion au sommet */}
    <path d="M0 330 L28 300 L58 240 L84 296 L120 318 L170 330 L230 340 L290 300 L330 262 L372 250 L400 246 V500 H0 Z" fill="#241b15" />
    <path d="M6 500 C40 470 18 440 46 418 S92 392 62 362 S20 330 44 300 S70 262 58 240" fill="none" stroke="#ddb984" strokeWidth="1.4" strokeDasharray="3 4" strokeLinecap="round" opacity="0.85" />
    <path d="M58 240 V222 M58 222 L70 227 L58 232" fill="#ddb984" stroke="#ddb984" strokeWidth="1.2" strokeLinejoin="round" />

    {PINES.map(([x, y, h]) => (
      <path key={`${x}-${y}`} d={`M${x} ${y - h} L${x - h * 0.32} ${y} L${x + h * 0.32} ${y} Z`} fill="#16110d" />
    ))}

    {/* Premier plan */}
    <path d="M0 430 Q110 392 210 420 T400 398 V500 H0 Z" fill="#110e0b" />
  </svg>
);

const Home: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-content">
          <p className="hero-status">
            <span className="status-dot" />
            Disponible pour de nouveaux projets
          </p>

          <h1 className="hero-title">
            Des plateformes <em>pensées</em> pour durer, livrées pour <em>performer</em>.
          </h1>

          <p className="hero-intro">
            Je suis <strong>Hassy Tsihoarana</strong>, développeur full-stack, DevOps et CTO.
            Je transforme des idées en produits complets — backend robuste, APIs efficaces,
            interfaces fluides — et j'automatise ce qui ralentit vos équipes.
          </p>

          <div className="hero-btns">
            <a href="#projects" className="btn btn-primary">
              Découvrir mes projets <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Discutons de votre projet
            </a>
          </div>
        </div>

        <figure className="hero-portrait">
          <div className="hero-portrait-frame">
            <MountainBackdrop />
            <img src={myPhoto} alt="Portrait de Hassy Tsihoarana" />
          </div>
          <figcaption className="hero-portrait-card">
            <span className="hero-portrait-label">Actuellement</span>
            <span className="hero-portrait-role">CTO &amp; Responsable projet</span>
            <span className="hero-portrait-company">XR Technologie · Madagascar</span>
          </figcaption>
        </figure>
      </div>

      <dl className="hero-stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="hero-stat">
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default Home;
