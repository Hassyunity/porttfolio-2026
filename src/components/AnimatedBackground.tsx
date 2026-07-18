import React, { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Layout, Cloud, Users, AppWindow, LineChart, Workflow } from 'lucide-react';
import '../assets/styles/AnimatedBackground.css';

interface CodeSymbol {
  text: string;
  top: string;
  left: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  parallaxSpeed: number;
}

const CODE_SYMBOLS: CodeSymbol[] = [
  { text: '</>', top: '8%', left: '10%', size: 30, color: '#ff7b54', duration: 16, delay: 0, parallaxSpeed: 0.15 },
  { text: '{ }', top: '15%', left: '85%', size: 36, color: '#ffcc33', duration: 20, delay: -4, parallaxSpeed: -0.2 },
  { text: '01', top: '28%', left: '5%', size: 22, color: '#44cc44', duration: 14, delay: -8, parallaxSpeed: 0.3 },
  { text: '=>', top: '40%', left: '92%', size: 28, color: '#4488ff', duration: 18, delay: -2, parallaxSpeed: -0.15 },
  { text: 'git commit', top: '52%', left: '14%', size: 16, color: '#a370f7', duration: 22, delay: -10, parallaxSpeed: 0.25 },
  { text: '<div>', top: '62%', left: '80%', size: 20, color: '#ff7b54', duration: 17, delay: -6, parallaxSpeed: -0.1 },
  { text: '{ }', top: '72%', left: '8%', size: 26, color: '#ffcc33', duration: 19, delay: -12, parallaxSpeed: 0.2 },
  { text: 'npm run dev', top: '83%', left: '58%', size: 15, color: '#4488ff', duration: 21, delay: -3, parallaxSpeed: -0.3 },
  { text: '10', top: '10%', left: '48%', size: 20, color: '#44cc44', duration: 15, delay: -9, parallaxSpeed: 0.18 },
  { text: 'const x =', top: '90%', left: '28%', size: 15, color: '#a370f7', duration: 23, delay: -1, parallaxSpeed: -0.22 },
  { text: '[ ]', top: '35%', left: '35%', size: 24, color: '#44cc44', duration: 18, delay: -14, parallaxSpeed: 0.12 },
  { text: 'async', top: '68%', left: '45%', size: 14, color: '#ff7b54', duration: 20, delay: -7, parallaxSpeed: -0.18 },
];

interface FloatingIcon {
  Icon: LucideIcon;
  top: string;
  left: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  parallaxSpeed: number;
}

// Platformes, SaaS, CRM, applications, graphiques — le vocabulaire visuel du métier
const FLOATING_ICONS: FloatingIcon[] = [
  { Icon: Layout, top: '20%', left: '68%', size: 40, color: '#ff7b54', duration: 19, delay: -5, parallaxSpeed: 0.2 },
  { Icon: Cloud, top: '46%', left: '88%', size: 44, color: '#4488ff', duration: 24, delay: -11, parallaxSpeed: -0.25 },
  { Icon: Users, top: '58%', left: '20%', size: 36, color: '#a370f7', duration: 20, delay: -3, parallaxSpeed: 0.15 },
  { Icon: AppWindow, top: '78%', left: '70%', size: 38, color: '#ffcc33', duration: 21, delay: -9, parallaxSpeed: -0.18 },
  { Icon: LineChart, top: '5%', left: '38%', size: 42, color: '#44cc44', duration: 17, delay: -6, parallaxSpeed: 0.22 },
  { Icon: Workflow, top: '88%', left: '10%', size: 38, color: '#ff7b54', duration: 23, delay: -13, parallaxSpeed: -0.12 },
];

const AnimatedBackground: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      bgRef.current?.style.setProperty('--scroll-y', String(window.scrollY));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="animated-bg" ref={bgRef} aria-hidden="true">
      <div className="bg-orb-wrap bg-orb-wrap-orange">
        <div className="bg-orb bg-orb-orange" />
      </div>
      <div className="bg-orb-wrap bg-orb-wrap-blue">
        <div className="bg-orb bg-orb-blue" />
      </div>
      <div className="bg-orb-wrap bg-orb-wrap-purple">
        <div className="bg-orb bg-orb-purple" />
      </div>

      {CODE_SYMBOLS.map((s, i) => (
        <div
          key={`sym-${i}`}
          className="bg-code-wrap"
          style={{ top: s.top, left: s.left, '--parallax-speed': s.parallaxSpeed } as React.CSSProperties}
        >
          <span
            className="bg-code-symbol"
            style={{
              fontSize: `${s.size}px`,
              color: s.color,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            {s.text}
          </span>
        </div>
      ))}

      {FLOATING_ICONS.map(({ Icon, top, left, size, color, duration, delay, parallaxSpeed }, i) => (
        <div
          key={`icon-${i}`}
          className="bg-code-wrap"
          style={{ top, left, '--parallax-speed': parallaxSpeed } as React.CSSProperties}
        >
          <Icon
            className="bg-code-symbol bg-float-icon"
            size={size}
            color={color}
            strokeWidth={1.5}
            style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
          />
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
