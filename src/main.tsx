import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/styles/NavAttract.css';
import './assets/styles/NavMenu.css';
import './assets/styles/NavResponsive.css';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
