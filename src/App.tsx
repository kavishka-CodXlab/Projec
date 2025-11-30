import React from 'react';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-dark text-white selection:bg-neon-blue selection:text-dark">
        <Navigation />
        <Hero />
        <About />
        <Education />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
        <Chatbot />
      </div>
    </AppProvider>
  );
}

export default App;