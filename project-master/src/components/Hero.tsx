import React, { useEffect, useState } from 'react';
import { ChevronDown, Github, Linkedin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Hero: React.FC = () => {
  const { userData } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialIcons = [
    { icon: Github, href: userData.socialLinks.github, label: 'https://github.com/kavishka-CodXlab' },
    { icon: Linkedin, href: userData.socialLinks.linkedin, label: 'https://github.com/kavishka-CodXlab' },
    { icon: Facebook, href: userData.socialLinks.facebook, label: 'Facebook' },
    { icon: Instagram, href: userData.socialLinks.instagram, label: 'Instagram' },
    { icon: MessageCircle, href: userData.socialLinks.whatsapp, label: 'WhatsApp' },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        {/* Moving Stars Animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {[...Array(40)].map((_, i) => {
            const duration = 8 + Math.random() * 8;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;
            return (
              <circle
                key={i}
                r={1.2 + Math.random() * 1.5}
                fill="white"
                opacity={0.7 + Math.random() * 0.3}
              >
                <animate
                  attributeName="cx"
                  values={`${startX}%;${endX}%`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${startY}%;${endY}%`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </svg>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block text-white mb-2">Hello, I'm</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              Kavishka Thilakarathna
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Computer Science Student & Aspiring Software Developer
          </p>
          
          <div className="flex justify-center space-x-6 mb-12">
            {socialIcons.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full bg-slate-800/50 border border-slate-700 text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToAbout}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              Explore My Work
            </button>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 border-2 border-blue-600 text-blue-400 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Get In Touch
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
         <button
  type="button"
  onClick={scrollToAbout}
  className="group inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300
             focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
>
  {/* optional hover animation */}
  <ChevronDown className="w-8 h-8 transform transition-transform duration-300 group-hover:translate-y-1" />
</button>

        </div>
      </div>
    </section>
  );
};

export default Hero;
