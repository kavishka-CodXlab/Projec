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
import AdminDashboard, { AdminLogin } from './components/AdminDashboard';

function App() {
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col">
        <Navigation onAdminLogin={handleAdminLogin} />
        <main className="flex-1 w-full max-w-full mx-auto px-2 sm:px-4 md:px-8">
          <Hero />
          <About />
          <Education />
          <Projects />
          <Skills />
          <Contact />
          {/* <Blog /> */}
        </main>
        <Footer />
        <Chatbot />
        {/* Show admin login popup if toggled and not authenticated */}
        {showAdminLogin && !isAuthenticated && (
          <AdminLogin onLogin={handleLoginSuccess} />
        )}
        {/* Show admin dashboard only after successful login */}
        {isAuthenticated && (
          <AdminDashboard showLogin={showAdminLogin} setShowLogin={setShowAdminLogin} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        )}
      </div>
    </AppProvider>
  );
}

export default App;