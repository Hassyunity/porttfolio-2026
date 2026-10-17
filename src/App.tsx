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
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Album = lazy(() => import('./pages/Album'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="route-loading">Chargement</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projets" element={<Projects />} />
            <Route path="/profil" element={<About />} />
            <Route path="/expertises" element={<Skills />} />
            <Route path="/parcours" element={<Experience />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/album" element={<Album />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blogs" element={<Navigate to="/blog" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
