import React from 'react';
import '../assets/styles/SectionBackdrop.css';

type BackdropVariant = 'about' | 'skills' | 'experience' | 'projects' | 'results' | 'contact';

interface SectionBackdropProps {
  variant: BackdropVariant;
}

const SNIPPETS: Record<BackdropVariant, string> = {
  about: `class Developer {
  name = "Hassy Tsihoarana";
  stack = ["Rails", "React", "TS"];

  mission() {
    return "build useful things";
  }
}`,
  skills: `$ whoami
> fullstack_developer

$ skills --list
> [rails, react, docker, n8n, ...]`,
  experience: `$ history --user hassy
> XR Technologie ......... CTO
> Pulse by Ingedata ...... dev
> uptime: 3-5 years`,
  projects: `$ git log --oneline
> feat: ship altea-flow
> feat: launch auto-decisions
> fix: optimize db queries

$ git push origin main`,
  results: `$ deploy --status
> altea-flow ........ live
> auto-decisions ..... live
> pulse-hr ...... tested`,
  contact: `POST /contact HTTP/1.1
Host: hassy.dev

{
  "status": "available",
  "response_time": "< 24h"
}`,
};

const SectionBackdrop: React.FC<SectionBackdropProps> = ({ variant }) => (
  <pre className={`section-backdrop section-backdrop-${variant}`} aria-hidden="true">
    {SNIPPETS[variant]}
  </pre>
);

export default SectionBackdrop;
