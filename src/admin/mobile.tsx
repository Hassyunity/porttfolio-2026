// Point d'entrée de l'application Android : uniquement l'espace d'administration, sans le site.
import '../assets/styles/global.css';
import './AdminMobile.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { App } from '@capacitor/app';
import AdminApp from './AdminApp';

// Bouton retour Android : revient en arrière dans l'app, la quitte depuis la liste des articles.
App.addListener('backButton', () => {
  if (/^#?\/admin\/?$/.test(window.location.hash)) App.exitApp();
  else window.history.back();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
