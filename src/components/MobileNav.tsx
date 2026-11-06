import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowDownToLine, MessageCircle } from 'lucide-react';
// Adaptez ce chemin à l'emplacement de votre fichier de données
import { PAGES, EMAIL, WHATSAPP_NUMBER } from '../data/portfolio';

const DESKTOP_QUERY = '(min-width: 1025px)';
const CLOSE_DISTANCE = 90; // px de glissement vers la droite pour fermer

interface Props {
  brand?: string;
  /** Lien de téléchargement du CV (optionnel) */
  cvHref?: string;
  cvName?: string;
}

export default function MobileNav({ brand = 'Hassy Tsihoarana', cvHref, cvName }: Props) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const drag = useRef({ x: 0, y: 0, dx: 0, on: false, locked: false });

  const close = useCallback(() => setOpen(false), []);

  // Ferme le tiroir à chaque changement de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Ferme si l'écran passe en mode ordinateur
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Tiroir ouvert : blocage du défilement, touche Échap, piège à focus
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      // Empêche Layout de changer de page avec les flèches pendant que le tiroir est ouvert
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    // Le focus arrive sur le premier lien une fois le tiroir en place
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('.mnav-links a')?.focus({ preventScroll: true });
    }, 350);

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(focusTimer);
      burgerRef.current?.focus({ preventScroll: true });
    };
  }, [open, close]);

  /* ---------- Glisser vers la droite pour fermer ---------- */
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    drag.current = { x: t.clientX, y: t.clientY, dx: 0, on: true, locked: false };
  };

  const onTouchMove = (e: TouchEvent) => {
    const d = drag.current;
    const el = panelRef.current;
    if (!d.on || !el) return;
    const t = e.touches[0];
    const dx = t.clientX - d.x;
    const dy = t.clientY - d.y;

    if (!d.locked) {
      // Geste plutôt vertical : on laisse la liste défiler
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        d.on = false;
        return;
      }
      if (Math.abs(dx) <= 8) return;
      d.locked = true;
      el.dataset.dragging = 'true';
    }
    d.dx = Math.max(0, dx);
    el.style.setProperty('--drag', `${d.dx}px`);
  };

  const onTouchEnd = () => {
    const d = drag.current;
    const el = panelRef.current;
    if (!el) return;
    delete el.dataset.dragging;
    el.style.setProperty('--drag', '0px');
    if (d.on && d.locked && d.dx > CLOSE_DISTANCE) close();
    d.on = false;
  };

  const drawer = (
    <div className="mnav-root" data-open={open}>
      <div className="mnav-scrim" onClick={close} aria-hidden="true" />

      <aside
        ref={panelRef}
        id="mnav-panel"
        className="mnav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className="mnav-head">
          <span className="mnav-brand">{brand}</span>
          <button type="button" className="mnav-close" onClick={close} aria-label="Fermer le menu">
            <span />
            <span />
          </button>
        </div>

        <nav className="mnav-links" aria-label="Pages du site">
          {PAGES.map((page, i) => (
            <div className="mnav-item" style={{ '--i': i + 1 } as CSSProperties} key={page.path}>
              <NavLink
                to={page.path}
                end={page.path === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                onClick={close}
              >
                <span>{page.label}</span>
                {page.path === '/services' && <small>Sites vitrines et dynamiques</small>}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="mnav-foot" style={{ '--i': PAGES.length + 1 } as CSSProperties}>
          <a
            className="mnav-cta"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Écrire sur WhatsApp
          </a>
          {cvHref && (
            <a className="mnav-cv" href={cvHref} download={cvName} onClick={close}>
              <ArrowDownToLine size={16} aria-hidden="true" />
              Télécharger le CV
            </a>
          )}
          <a className="mnav-mail" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="mnav-burger"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="mnav-panel"
        onClick={() => setOpen(true)}
      >
        <span className="mnav-bars" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>

      {/* Portail : le tiroir échappe au backdrop-filter de l'en-tête, qui piégerait le position: fixed */}
      {createPortal(drawer, document.body)}
    </>
  );
}