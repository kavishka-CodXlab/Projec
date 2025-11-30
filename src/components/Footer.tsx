import React from 'react';
import { Heart, Code, Github, Linkedin, Facebook, Instagram, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  // Hardcoded for debugging to isolate the crash
  const socialIcons = [
    { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-white' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark py-8 overflow-hidden border-t border-white/5">
      {/* Glowing Top Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Left: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <span className="text-xl font-bold text-white tracking-tight">
                Kavishka <span className="text-cyan-400">Thilakarathna.</span>
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-400">
                © {new Date().getFullYear()} All rights reserved.
              </span>
            </motion.div>
          </div>

          {/* Center: Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialIcons.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 transition-all duration-300 ${social.color} hover:bg-white/10 hover:border-cyan-400/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]`}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Right: Made With & Scroll Top */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Code className="w-3 h-3 text-cyan-400" />
              <span>by Innovative Lab</span>
              <span>with</span>
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white/5 hover:bg-cyan-400/10 border border-white/10 hover:border-cyan-400/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all duration-300"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;