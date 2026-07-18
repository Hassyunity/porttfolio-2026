import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ChatWidget from './components/ChatWidget';
import './assets/styles/global.css';

const BlogPage = lazy(() => import('./pages/BlogPage'));
const Album = lazy(() => import('./pages/Album'));

// On crée un composant qui regroupe toutes les sections du portfolio
const MainPortfolio = () => (
  <>
    <Home />
    <About />
    <Skills />
    <Projects />
    <Contact />
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedBackground />
        <Navbar />
        <Suspense fallback={<div className="route-loading">Chargement...</div>}>
          <Routes>
            <Route path="/" element={<MainPortfolio />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/album" element={<Album />} />
          </Routes>
        </Suspense>
        <Footer />
        <WhatsAppButton />
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;