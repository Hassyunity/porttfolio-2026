
// Point d'entrée Android : espace d'administration uniquement.
import '../assets/styles/global.css';
import './AdminMobile.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { App } from '@capacitor/app';

import AdminApp from './AdminApp';

// Gestion du bouton Retour Android.
App.addListener('backButton', () => {
  const currentPath = window.location.hash
    .replace(/^#/, '')
    .split('?')[0]
    .replace(/\/+$/, '') || '/';

  // À la racine de l'administration : quitter l'application.
  if (currentPath === '/admin') {
    App.exitApp();
    return;
  }

  // Sinon, revenir à l'écran précédent.
  window.history.back();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Toute autre route redirige vers l'administration. */}
        <Route
          path="*"
          element={<Navigate to="/admin" replace />}
        />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
