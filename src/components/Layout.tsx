import React, { useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowDownToLine } from 'lucide-react';
import '../assets/styles/Layout.css';
// Styles de la navbar : l'ordre compte, NavResponsive en dernier.
// Si ces trois fichiers sont déjà importés ailleurs (main.tsx, global.css), supprimez ces lignes.
import '../assets/styles/NavMenus.css';
import '../assets/styles/NavAttract.css';
import '../assets/styles/NavResponsive.css';
import cvPath from '../assets/fichier/cv_fr.pdf';
import { PAGES } from '../data/portfolio';
import ChatWidget from './ChatWidget';
import WhatsAppButton from './WhatsAppButton';
import MobileNav from './MobileNav';

const CV_NAME = 'CV_Hassy_Tsihoarana.pdf';

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // /blog/:id appartient à l'écran « Blog »
  const section = '/' + (pathname.split('/')[1] ?? '');
  const index = Math.max(0, PAGES.findIndex(page => page.path === section));
  const prev = PAGES[index - 1];
  const next = PAGES[index + 1];

  useEffect(() => {
    const label = PAGES[index].label;
    document.title = index === 0 ? 'Hassy Tsihoarana — Développeur Full-stack & CTO' : `${label} — Hassy Tsihoarana`;
  }, [index]);

  // Flèches ← → : écran précédent / suivant. Les pages qui gèrent elles-mêmes
  // les flèches (lecteur d'article, album, tiroir mobile) appellent preventDefault().
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isTyping(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight' && next) navigate(next.path);
      if (event.key === 'ArrowLeft' && prev) navigate(prev.path);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, prev, next]);

  return (
    <div className="shell">
      <a className="skip-link" href="#stage">Aller au contenu</a>

      <header className="topbar">
        <Link to="/" className="brand" aria-label="Accueil — Hassy Tsihoarana">
          <span className="brand-mark" aria-hidden="true">ht.</span>
          <span className="brand-name">Hassy Tsihoarana</span>
        </Link>

        {/* Liens horizontaux : masqués sous 1024px, le tiroir MobileNav prend le relais */}
        <nav id="main-navigation" className="menu nav-desktop-links" aria-label="Navigation principale">
          {PAGES.slice(1).map((page, i) => (
            <NavLink key={page.path} to={page.path} className="menu-link">
              <span className="menu-index" aria-hidden="true">0{i + 1}</span>
              {page.label}
            </NavLink>
          ))}
        </nav>

        {/* Groupe aligné à droite : CV + burger */}
        <div className="topbar-actions">
          <a href={cvPath} download={CV_NAME} className="topbar-cv">
            CV <ArrowDownToLine size={14} />
          </a>
          <MobileNav cvHref={cvPath} cvName={CV_NAME} />
        </div>
      </header>

      <main id="stage" className="stage">
        <div key={pathname} className="screen">{children}</div>
      </main>

      <footer className="bottombar">
        {prev ? (
          <Link to={prev.path} className="pager-link" aria-label={`Écran précédent : ${prev.label}`}>
            <ArrowLeft size={15} /> <span>{prev.label}</span>
          </Link>
        ) : <span />}

        <div className="pager-dots" aria-label={`Écran ${index + 1} sur ${PAGES.length}`}>
          <span className="pager-count">{String(index + 1).padStart(2, '0')} / {String(PAGES.length).padStart(2, '0')}</span>
          <span className="pager-track" aria-hidden="true">
            {PAGES.map((page, i) => (
              <Link key={page.path} to={page.path} tabIndex={-1} className={`pager-dot ${i === index ? 'is-active' : ''}`} title={page.label} />
            ))}
          </span>
        </div>

        {next ? (
          <Link to={next.path} className="pager-link pager-next" aria-label={`Écran suivant : ${next.label}`}>
            <span>{next.label}</span> <ArrowRight size={15} />
          </Link>
        ) : <span />}
      </footer>

      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
};

export default Layout;