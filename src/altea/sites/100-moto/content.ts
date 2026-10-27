// Contenu du site 100% Moto. SITE DE DÉMONSTRATION : coordonnées, modèles et prix sont fictifs.
// Pour un vrai client : dupliquer le dossier, puis remplacer ce fichier par ses informations.

export const content = {
  name: '100% Moto',
  tagline: 'Concession & atelier moto',
  city: 'Votre ville',
  phone: '01 23 45 67 89',
  phoneHref: 'tel:+33123456789',
  email: 'contact@exemple.fr',
  address: '12 avenue de la Route, 00000 Votre ville',
  mapsUrl: 'https://www.google.com/maps',

  hero: {
    title: 'Votre passion,\nnotre métier.',
    text: 'Motos neuves et d\'occasion, équipement, entretien toutes marques : une équipe de passionnés pour vous accompagner à chaque kilomètre.',
  },

  highlights: [
    { value: '15 ans', label: 'd\'expérience' },
    { value: '+80', label: 'motos en stock' },
    { value: '48 h', label: 'délai atelier moyen' },
  ],

  categories: ['Roadster', 'Trail', 'Sportive', 'Custom', 'Scooter', 'A2 / jeunes permis'],

  bikes: [
    { name: 'Roadster 700', category: 'Roadster', condition: 'Neuve', detail: '689 cm³ · A2 possible', price: '7 990 €' },
    { name: 'Trail 900 Adventure', category: 'Trail', condition: 'Neuve', detail: '890 cm³ · valises incluses', price: '12 490 €' },
    { name: 'Sport 600 R', category: 'Sportive', condition: 'Occasion', detail: '2022 · 8 400 km', price: '8 900 €' },
    { name: 'Custom 1200 Classic', category: 'Custom', condition: 'Occasion', detail: '2021 · 12 100 km', price: '10 750 €' },
  ],

  services: [
    { icon: 'wrench', title: 'Atelier toutes marques', text: 'Entretien, révision constructeur, diagnostic électronique et préparation.' },
    { icon: 'gauge', title: 'Pneus & freinage', text: 'Montage, équilibrage et contrôle sécurité en rendez-vous rapide.' },
    { icon: 'shield', title: 'Équipement', text: 'Casques, blousons, gants et bottes, conseils d\'ajustement en magasin.' },
    { icon: 'card', title: 'Financement & reprise', text: 'Solutions de financement et estimation de votre moto actuelle.' },
  ],

  hours: [
    { days: 'Mardi – Vendredi', time: '9 h – 12 h · 14 h – 19 h' },
    { days: 'Samedi', time: '9 h – 18 h' },
    { days: 'Dimanche – Lundi', time: 'Fermé' },
  ],
};
