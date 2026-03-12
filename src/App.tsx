import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BlogPage from './pages/BlogPage';
import Album from './pages/Album';
import './assets/styles/global.css';

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
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPortfolio />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/album" element={<Album />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;