import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hassytsihoarana.studioblog',
  appName: 'Studio blog',
  webDir: 'dist-admin',
  backgroundColor: '#08080a',
  android: {
    backgroundColor: '#08080a',
    // Pas d'inspection de la WebView dans l'APK de production.
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SystemBars: {
      // Texte clair sur fond sombre.
      style: 'DARK',
    },
  },
};

export default config;
