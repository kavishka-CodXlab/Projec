import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, GraduationCap, Briefcase, Code, Mail, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdminDashboard from './AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import TerminalText from './ui/TerminalText';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAdmin, setIsAdmin } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      setIsAuthenticated(true);
      setShowLogin(false);
      setShowAdmin(true);
      setError('');
      setIsAdmin(true);
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setShowAdmin(false);
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setIsAdmin(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Education', href: '#education', icon: GraduationCap },
    { name: 'Projects', href: '#projects', icon: Briefcase },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-2xl font-bold font-mono group flex items-center gap-1"
            >
              <span className="text-neon-blue">&lt;</span>
              <TerminalText
                text="Kavishka"
                typingSpeed={200}
                deleteSpeed={100}
                delayBetween={3000}
                className="text-white group-hover:text-neon-blue transition-colors"
                cursorColor="bg-neon-blue"
              />
              <span className="text-neon-blue">/&gt;</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="relative px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                  >
                    <span className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded-full text-sm font-medium text-neon-purple border border-neon-purple/50 hover:bg-neon-purple/10 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-neon-blue" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setShowLogin(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-neon-purple hover:bg-neon-purple/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Admin</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLogin && !isAuthenticated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowLogin(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 bg-dark-card border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 mb-4 bg-dark-lighter border border-white/10 rounded-xl text-white focus:border-neon-blue focus:outline-none transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 mb-4 bg-dark-lighter border border-white/10 rounded-xl text-white focus:border-neon-blue focus:outline-none transition-colors"
                />
                {error && <p className="text-red-400 mb-4 text-center text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-shadow"
                >
                  Login
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard */}
      {showAdmin && isAuthenticated && <AdminDashboard onLogout={handleLogout} />}
    </motion.nav>
  );
};

export default Navigation;