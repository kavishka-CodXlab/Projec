import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, GraduationCap, Briefcase, Code, Mail, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdminDashboard from './AdminDashboard';


const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAdmin } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setShowLogin(false);
      setShowAdmin(true);
      setError('');
      setIsAdmin(true); // Enable AdminDashboard for valid login
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setShowAdmin(false);
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setIsAdmin(false); // Disable AdminDashboard on logout
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 shadow-2xl shadow-blue-500/10' : 'bg-transparent'
    }`}>
      {/* Animated Gradient Bar */}
      <div className="absolute left-0 top-0 w-full h-1 z-50">
        <div className="w-full h-full animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-80 blur-sm"></div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2 mb-2 md:mb-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
              <button
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center space-x-1 group focus:outline-none"
              >
                <span className="text-blue-400 group-hover:text-blue-300 transition">&lt;</span>
                <span className="text-white group-hover:text-blue-200 transition">Kavishka</span>
                <span className="text-blue-400 group-hover:text-blue-300 transition">/&gt;</span>
              </button>
            </span>
            <span className="ml-2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 animate-pulse shadow-lg"></span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:block w-full md:w-auto">
            <div className="ml-0 md:ml-10 flex flex-wrap md:flex-nowrap items-baseline space-x-2 md:space-x-4 justify-center md:justify-start">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 group overflow-hidden bg-gradient-to-r from-blue-800/20 to-purple-800/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                  >
                    <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-blue-400/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm animate-gradient-x"></span>
                    <Icon className="w-4 h-4 text-blue-400 group-hover:scale-125 transition-transform duration-300" />
                    <span className="relative z-10 text-gray-200 group-hover:text-white transition-colors duration-200">{item.name}</span>
                  </button>
                );
              })}
              {/* Admin Toggle Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 group overflow-hidden bg-gradient-to-r from-purple-700/30 to-blue-700/30 hover:from-purple-500/50 hover:to-blue-500/50 transition-all duration-300"
              >
                <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-purple-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm animate-gradient-x"></span>
                <Settings className="w-4 h-4 text-purple-400 group-hover:scale-125 transition-transform duration-300" />
                <span className="relative z-10 text-gray-200 group-hover:text-white transition-colors duration-200">Admin</span>
              </button>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-2 animate-fade-in-down w-full">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-blue-900/95 rounded-xl shadow-2xl w-full">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-base font-medium text-gray-200 hover:text-white bg-gradient-to-r from-blue-800/20 to-purple-800/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-blue-400 group-hover:scale-125 transition-transform duration-300" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              {/* Admin Toggle Button for Mobile */}
              <button
                onClick={() => setShowLogin(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-base font-medium text-gray-200 hover:text-white bg-gradient-to-r from-purple-700/30 to-blue-700/30 hover:from-purple-500/50 hover:to-blue-500/50 transition-all duration-300 group"
              >
                <Settings className="w-5 h-5 text-purple-400 group-hover:scale-125 transition-transform duration-300" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Admin Login Modal */}
      {showLogin && !isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
          <div className="relative z-10">
            <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
              {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Admin Dashboard Modal */}
      {showAdmin && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleLogout} />
          <div className="relative z-10 w-full max-w-3xl">
            <AdminDashboard />
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold mt-4"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {/* Gradient Animation Keyframes */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease-in-out infinite;
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;