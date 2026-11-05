import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check, Compass, Mail, MessageCircle, Sparkles, X } from 'lucide-react';
import '../assets/styles/Skills.css';
import { EMAIL, SERVICES, WHATSAPP_NUMBER } from '../data/portfolio';

const formatPrice = (n: number) =>
  `${new Intl.NumberFormat('fr-FR').format(n).replace(/[\u202f\u00a0]/g, ' ')} Ar`;

const useCountUp = (target: number, duration = 600) => {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (target - start) * eased);
      from.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
};

const spotlight = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

const pan = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--pan', String((e.clientX - r.left) / r.width));
};

const Skills: React.FC = () => {
  const [openName, setOpenName] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [planByOffer, setPlanByOffer] = useState<Record<string, string>>({});
  const [addonsByOffer, setAddonsByOffer] = useState<Record<string, Record<string, boolean>>>({});

  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const current = SERVICES.find(s => s.name === openName) ?? SERVICES[0];
  const plan =
    current.plans.find(p => p.name === planByOffer[current.name]) ??
    current.plans.find(p => p.popular) ??
    current.plans[0];
  const selectedAddons = current.addons.filter(addon => !!addonsByOffer[current.name]?.[addon.name]);
  const total = plan.price + selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const animatedTotal = useCountUp(total);

  const openOffer = (name: string) => {
    triggerRef.current = document.activeElement as HTMLElement;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    setClosing(false);
    setOpenName(name);
  };

  const close = useCallback(() => {
    setClosing(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setOpenName(null);
      setClosing(false);
      triggerRef.current?.focus();
    }, 280);
  }, []);

  useEffect(() => {
    if (!openName) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [openName, close]);

  useEffect(() => () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  const selectedLabel = selectedAddons.length
    ? ` + ${selectedAddons.map(addon => addon.name.toLowerCase()).join(' + ')}`
    : '';
  const message =
    `Bonjour Hassy, l’offre « ${current.name} » (formule ${plan.name}${selectedLabel}) m’intéresse. ` +
    `Estimation : ${formatPrice(total)}. Pouvons-nous en discuter ?`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const mailLink = `mailto:${EMAIL}?subject=${encodeURIComponent(`Projet ${current.name}`)}&body=${encodeURIComponent(message)}`;

  const overlay = openName && (
    <div
      className={`svc-overlay ${closing ? 'is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={current.name}
      onKeyDown={e => { if (e.key.startsWith('Arrow')) e.stopPropagation(); }}
    >
      <div className="svc-sheet">
        <header className="svc-top">
          <div className="svc-switch" role="tablist" aria-label="Changer d’offre">
            {SERVICES.map(s => (
              <button
                key={s.name}
                type="button"
                role="tab"
                aria-selected={s.name === current.name}
                className={s.name === current.name ? 'is-active' : ''}
                onClick={() => setOpenName(s.name)}
              >
                <s.Icon size={16} strokeWidth={1.6} /> {s.name}
              </button>
            ))}
          </div>
          <button ref={closeBtnRef} type="button" className="svc-close" onClick={close} aria-label="Fermer">
            <X size={20} strokeWidth={1.6} />
          </button>
        </header>

        <div className="svc-main" key={current.name}>
          <aside className="svc-hero">
            <img className="svc-hero-art" src={current.image} alt="" aria-hidden="true" />
            <div className="svc-hero-content">
              <span className="svc-hero-icon"><current.Icon size={26} strokeWidth={1.4} /></span>
              <p className="svc-kicker">SERVICE {String(SERVICES.indexOf(current) + 1).padStart(2, '0')}</p>
              <h2>{current.name}</h2>
              <p className="svc-hero-tagline">{current.tagline}</p>
              <p className="svc-hero-copy">{current.detail}</p>

              <p className="svc-label">Inclus dans cette offre</p>
              <ul className="svc-features">
                {current.list.map(item => (
                  <li key={item}><Check size={15} strokeWidth={2.2} /> {item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="svc-config">
            <section>
              <p className="svc-step"><span>1</span> Choisissez votre formule</p>
              <div className="svc-plans" role="radiogroup" aria-label="Formules">
                {current.plans.map(p => {
                  const active = p.name === plan.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`svc-plan ${active ? 'is-active' : ''}`}
                      onClick={() => setPlanByOffer(prev => ({ ...prev, [current.name]: p.name }))}
                      onMouseMove={spotlight}
                    >
                      {p.popular && <span className="svc-badge">Recommandé</span>}
                      <span className="svc-plan-check"><Check size={14} strokeWidth={2.6} /></span>
                      <span className="svc-plan-name">{p.name}</span>
                      <strong>{formatPrice(p.price)}</strong>
                      <span className="svc-plan-desc">{p.description}</span>
                      <ul>
                        {p.items.map(item => <li key={item}><Check size={13} strokeWidth={2.2} /> {item}</li>)}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <p className="svc-step"><span>2</span> Ajoutez un service complémentaire <em>(facultatif)</em></p>
              <div className="svc-addons-list">
                {current.addons.map(addon => {
                  const enabled = !!addonsByOffer[current.name]?.[addon.name];
                  return (
                    <button
                      key={addon.name}
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      className={`svc-tour ${enabled ? 'is-on' : ''}`}
                      onClick={() => setAddonsByOffer(prev => {
                        const currentAddons = prev[current.name] ?? {};
                        return {
                          ...prev,
                          [current.name]: {
                            ...currentAddons,
                            [addon.name]: !currentAddons[addon.name],
                          },
                        };
                      })}
                    >
                      <span className="svc-tour-icon"><Compass size={22} strokeWidth={1.5} /></span>
                      <span className="svc-tour-text">
                        <b>{addon.name}</b>
                        <span>{addon.description}</span>
                      </span>
                      <span className="svc-tour-price">+ {formatPrice(addon.price)}</span>
                      <span className="svc-switch-ui" aria-hidden="true"><span /></span>
                    </button>
                  );
                })}
              </div>

              {current.addons.some(addon => addon.name.toLowerCase().includes('visite')) && (
                <div className={`svc-reveal ${selectedAddons.some(addon => addon.name.toLowerCase().includes('visite')) ? 'is-open' : ''}`}>
                  <div className="svc-reveal-inner">
                    <div className="svc-preview" onMouseMove={pan}>
                      <div className="svc-pano"><div className="svc-pano-inner" /></div>
                      <span className="svc-preview-badge">360°</span>
                      <span className="svc-spot" style={{ left: '26%', top: '60%' }} />
                      <span className="svc-spot" style={{ left: '58%', top: '44%' }} />
                      <span className="svc-spot" style={{ left: '80%', top: '66%' }} />
                      <span className="svc-preview-hint">Bougez la souris pour explorer</span>
                    </div>
                    <ul className="svc-tour-features">
                      {current.addons
                        .filter(addon => addon.name.toLowerCase().includes('visite'))
                        .flatMap(addon => addon.features)
                        .map(f => <li key={f}><Check size={14} strokeWidth={2.2} /> {f}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        <footer className="svc-bar">
          <div className="svc-total">
            <span>Estimation · {plan.name}{selectedAddons.length ? ` + ${selectedAddons.map(addon => addon.name).join(' + ')}` : ''}</span>
            <strong>{formatPrice(animatedTotal)}</strong>
          </div>
          <div className="svc-cta">
            <a className="svc-btn svc-btn-main" href={whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle size={18} strokeWidth={1.8} /> Discuter sur WhatsApp <ArrowRight size={16} />
            </a>
            <a className="svc-btn svc-btn-ghost" href={mailLink}>
              <Mail size={17} strokeWidth={1.8} /> Par email
            </a>
          </div>
        </footer>
      </div>
    </div>
  );

  return (
    <section className="page skills">
      <header className="page-head page-head-split rise">
        <div>
          <p className="eyebrow">MES SERVICES</p>
          <h1 className="page-title">Des solutions web pensées pour <em>créer</em>, <em>convertir</em> et <em>grandir</em>.</h1>
        </div>
        <p className="lead">
          Deux offres pour donner vie à votre présence digitale. Choisissez un service pour découvrir les formules et obtenir une estimation.
        </p>
      </header>

      <div className="services-grid">
        {SERVICES.map(({ Icon, name, tagline, image, plans }, i) => {
          const from = Math.min(...plans.map(p => p.price));
          const isVitrine = name === 'Site vitrine';
          return (
            <button
              key={name}
              type="button"
              aria-haspopup="dialog"
              className={`service-card service-card-${i + 1} rise`}
              style={{ '--d': 1 + i } as React.CSSProperties}
              onClick={() => openOffer(name)}
              onMouseMove={spotlight}
            >
              <span className="service-card-frame" aria-hidden="true" />
              <span className="service-card-glow" aria-hidden="true" />

              <div className="service-card-layout">
                <div className="service-card-header">
                  <div className="service-card-label">
                    <span className="service-card-index">0{i + 1}.</span>
                    <span className="skill-icon"><Icon size={22} strokeWidth={1.8} /></span>
                  </div>
                  <span className={`service-chip ${i === 1 ? 'service-chip-featured' : ''}`}>
                    {i === 0 ? 'Service principal' : 'Recommandé'}
                  </span>
                </div>

                <div className="service-card-heading">
                  <span className="service-card-title">Création de</span>
                  <strong>{isVitrine ? 'Site Web Vitrine' : 'Site Web Dynamique'}</strong>
                </div>

                <p className="service-tagline">{tagline}</p>

                <img
                  className="service-card-image"
                  src={image}
                  alt={isVitrine ? 'Site vitrine' : 'Site web dynamique'}
                  aria-hidden="true"
                />

                <div className="service-card-foot">
                  <span className="service-price-tag"><span className="service-price-icon">◆</span>
                    <span>À partir de<strong>{formatPrice(from)}</strong></span>
                  </span>
                  <span className="service-open">Voir les formules <ArrowRight size={17} strokeWidth={2} /></span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="skills-note rise" style={{ '--d': 4 } as React.CSSProperties}>
        <Sparkles size={15} strokeWidth={1.5} />
        <span>Tarifs indicatifs en ariary (MGA). Le devis final est confirmé après un échange sur votre besoin. Accompagnement de bout en bout, du design à la mise en ligne.</span>
      </p>

      {overlay && createPortal(overlay, document.body)}
    </section>
  );
};

export default Skills;