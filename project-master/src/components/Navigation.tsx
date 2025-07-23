import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, GraduationCap, Briefcase, Code, Mail, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';


const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
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
            {/* Animated Dot */}
            <span className="ml-2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 animate-pulse shadow-lg"></span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
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
          <div className="md:hidden mt-2 animate-fade-in-down">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-blue-900/95 rounded-xl shadow-2xl">
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
            </div>
          </div>
        )}
      </div>
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