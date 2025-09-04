import React, { useEffect, useState } from 'react';
import { ChevronDown, Github, Linkedin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Hero: React.FC = () => {
  const { userData } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Moving Star Animation
    const canvas = document.getElementById('star-canvas') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = 500;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width - width / 2, // Spread stars from right to left
      y: Math.random() * height,
      z: Math.random() * width,
      o: 0.5 + Math.random() * 0.5,
      r: 0.5 + Math.random() * 1.5,
      speed: 0.5 + Math.random() * 1.5
    }));

    function drawStars() {
      ctx?.clearRect(0, 0, width, height);
      for (let star of stars) {
        star.z -= star.speed;
        if (star.z <= 0) {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
          star.z = width;
        }
        let k = 128.0 / star.z;
        let sx = star.x * k + width / 2;
        let sy = star.y * k + height / 2;
        if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
        ctx?.beginPath();
        ctx?.arc(sx, sy, star.r, 0, 2 * Math.PI);
        ctx!.fillStyle = `rgba(180,220,255,${star.o})`;
        ctx?.fill();
      }
    }

    let animationFrameId: number;
    function animate() {
      drawStars();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialIcons = [
    { icon: Github, href: userData.socialLinks.github, label: 'GitHub' },
    { icon: Linkedin, href: userData.socialLinks.linkedin, label: 'LinkedIn' },
    { icon: Facebook, href: userData.socialLinks.facebook, label: 'Facebook' },
    { icon: Instagram, href: userData.socialLinks.instagram, label: 'Instagram' },
    { icon: MessageCircle, href: userData.socialLinks.whatsapp, label: 'WhatsApp' },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Moving Star Animated Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <canvas id="star-canvas" className="w-full h-full block" style={{ position: 'absolute', inset: 0 }}></canvas>
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
