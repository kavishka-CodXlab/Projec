import React, { useEffect, useRef, useState } from 'react';
import { User, MapPin, Calendar, Heart, Code, Cpu } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useApp } from '../context/AppContext';
import MeeImg from '../assets/Mee.jpg';
import TerminalText from './ui/TerminalText';

const About: React.FC = () => {
  const { userData } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section id="about" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-dark overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <div className="text-center mb-16">
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <span className="px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm font-mono tracking-wider backdrop-blur-sm">
                SYSTEM_ID: USER_PROFILE
              </span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Me</span>
            </motion.h2>
            <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"></motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center border border-cyan-400/30 mr-4 group-hover:scale-110 transition-transform duration-300">
                    <User className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white min-h-[2rem] flex items-center">
                    <TerminalText
                      text={["Who I Am", "Developer", "Innovator", "AI Researcher", "Digital Creator"]}
                      className="text-white"
                      typingSpeed={100}
                      delayBetween={1500}
                    />
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  I'm a Computer Science student passionate about software development and problem-solving. I enjoy working on efficient, user-friendly solutions and have hands-on experience in UI/UX design.
                  I'm always exploring new technologies and improving my skills as I grow in the field.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-cyan-400/30 transition-colors duration-300 group">
                  <MapPin className="w-8 h-8 text-cyan-400 mb-4 group-hover:animate-bounce" />
                  <h4 className="text-white font-bold text-lg mb-1">Location</h4>
                  <p className="text-gray-400 text-sm">Sri Jayawardhanapura Kotte, Sri Lanka</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-blue-600/30 transition-colors duration-300 group">
                  <Calendar className="w-8 h-8 text-blue-500 mb-4 group-hover:rotate-12 transition-transform" />
                  <h4 className="text-white font-bold text-lg mb-1">Status</h4>
                  <p className="text-gray-400 text-sm">Undergraduate Student</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Profile Card */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Holographic Effect Container */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>

                <div className="relative bg-dark-lighter/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 overflow-hidden">
                  {/* Scanning Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_15px_rgba(0,243,255,0.5)] animate-scan z-20"></div>

                  <div className="relative w-48 h-48 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30 animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute -inset-2 rounded-full border border-blue-600/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-dark relative z-10 group">
                      <img
                        src={MeeImg}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Tech Badges */}
                    <div className="absolute -right-4 top-0 bg-dark-card border border-cyan-400/30 p-2 rounded-lg shadow-lg animate-float">
                      <Code className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="absolute -left-4 bottom-4 bg-dark-card border border-blue-600/30 p-2 rounded-lg shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                      <Cpu className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>

                  <div className="text-center space-y-4 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Kavishka Thilakarathna</h3>
                      <p className="text-cyan-400 font-mono text-sm">{userData.title}</p>
                    </div>

                    <div className="flex items-center justify-center space-x-2 bg-white/5 py-2 px-4 rounded-full border border-white/5 mx-auto w-fit">
                      <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                      <span className="text-gray-300 text-sm">Tech Enthusiast</span>
                    </div>

                    <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/5">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">5+</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Projects</div>
                      </div>
                      <div className="text-center border-l border-white/5 border-r">
                        <div className="text-xl font-bold text-white">2+</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Years</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">100%</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Passion</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div >
      </div >
    </section >
  );
};

export default About;