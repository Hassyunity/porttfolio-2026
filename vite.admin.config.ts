import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build de l'application Android (admin seul) : `npm run build:admin`, sortie dans dist-admin/ pour Capacitor.
export default defineConfig({
  plugins: [react()],
  root: 'mobile',
  envDir: '..',
  publicDir: false,
  base: './',
  build: {
    outDir: '../dist-admin',
    emptyOutDir: true,
    // WebView Android à jour (Chrome récent) : pas de code de compatibilité inutile.
    target: 'chrome111',
    cssTarget: 'chrome111',
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
  },
})
