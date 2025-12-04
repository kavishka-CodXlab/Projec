import React, { useEffect, useState, Suspense } from 'react';
import { ChevronDown, Github, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import WarpStars from './canvas/WarpStars';
import ScrambleText from './ui/ScrambleText';
import BinaryText from './ui/BinaryText';
import ErrorBoundary from './ErrorBoundary';

const Hero: React.FC = () => {
  const { userData } = useApp();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialIcons = [
    { icon: Github, href: userData?.socialLinks?.github || '#', label: 'GitHub' },
    { icon: Linkedin, href: userData?.socialLinks?.linkedin || '#', label: 'LinkedIn' },
    { icon: Facebook, href: userData?.socialLinks?.facebook || '#', label: 'Facebook' },
    { icon: Instagram, href: userData?.socialLinks?.instagram || '#', label: 'Instagram' },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark">
      {/* CSS-based Futuristic Background */}
      {/* 3D Space Background */}
      <div className="absolute inset-0 z-0 bg-dark">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <WarpStars />
            <Preload all />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/50 to-dark pointer-events-none" />
      </div>

      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/20 to-dark z-0 pointer-events-none"></div>

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
          className="pointer-events-auto inline-block"
        >
          {/* Holographic Glass Card */}
          <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden group">
            {/* Scanning Light Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50 animate-scan"></div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm font-mono tracking-wider backdrop-blur-sm">
                <BinaryText text="CURIOSITY FIRST" className="inline-block text-neon-blue" revealSpeed={30} />
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="block text-white mb-2 drop-shadow-lg text-opacity-90">Hello, I'm</span>
              <ScrambleText
                text={userData.name || "Kavishka Thilakarathna"}
                className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-pink font-black"
              />
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
              {userData.title || "Computer Science Student & Aspiring Software Developer"}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-6 mb-10"
            >
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-neon-blue hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-neon-blue/20"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToAbout}
                className="relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_35px_rgba(0,243,255,0.6)] transition-all duration-300 overflow-hidden group/btn"
              >
                <span className="relative z-10 drop-shadow-sm">Discover Universe</span>
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 group-hover/btn:animate-shine"></div>
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5 hover:border-neon-purple/50 transition-colors backdrop-blur-sm z-20"
              >
                Get In Touch
              </motion.a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto"
        >
          <motion.button
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={scrollToAbout}
            className="text-gray-500 hover:text-neon-blue transition-colors"
          >
            <ChevronDown className="w-10 h-10" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
