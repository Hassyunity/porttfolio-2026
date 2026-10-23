import './assets/styles/global.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Experience = lazy(() => import('./pages/Experience'));
const Contact = lazy(() => import('./pages/Contact'));
const Reviews = lazy(() => import('./pages/Reviews'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Album = lazy(() => import('./pages/Album'));
// Espace d'administration : accessible uniquement par l'URL /admin, aucun lien visible.
const AdminApp = lazy(() => import('./admin/AdminApp'));

const loading = <div className="route-loading">Chargement</div>;

const Site = () => (
  <Layout>
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projets" element={<Projects />} />
        <Route path="/profil" element={<About />} />
        <Route path="/expertises" element={<Skills />} />
        <Route path="/parcours" element={<Experience />} />
        <Route path="/avis" element={<Reviews />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/album" element={<Album />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Navigate to="/blog" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={loading}><AdminApp /></Suspense>} />
        <Route path="/*" element={<Site />} />
      </Routes>
    </Router>
  );
}

export default App;
