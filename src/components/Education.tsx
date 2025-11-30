import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BinaryText from './ui/BinaryText';
import StarBackground from './canvas/StarBackground';

const Education: React.FC = () => {
  const { userData } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

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

  const educationData = [
    {
      degree: "Bsc Computer Science (Hons)",
      university: "University of Bedfordshire",
      period: "2025-2028",
      location: "SLIIT Metro",
      description: userData.education.description,
      status: "Currently Pursuing",
      icon: GraduationCap,
      color: "from-cyan-400 to-blue-600"
    },
    {
      degree: "Higher Diploma",
      university: "Cardiff Metropolitan University",
      period: "2025-2027",
      location: "Colombo, Sri Lanka",
      description: "My Higher Diploma went beyond syntax, teaching me to engineer software. I progressed from core Algorithms and OOP to full-stack Web & Mobile Development. By integrating Database Design and Project Management, I learned to build robust systems that align technical architecture with real-world business goals.",
      status: "Currently Pursuing",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500"
    },
    {
      degree: "Foundation Diploma",
      university: "Edith Cowan University",
      period: "2023-2024",
      location: "Colombo, Sri Lanka",
      description: "Focus on Advanced Mathematics, Physics, and Computer Science, laying the foundation for my university studies.",
      status: "Completed",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section id="education" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full bg-dark -z-10">
        <StarBackground />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm font-mono tracking-wider backdrop-blur-sm">
                ACADEMIC_LOGS
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Education</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"></div>
          </div>

          <div className="max-w-4xl mx-auto relative" ref={containerRef}>
            {/* Animated Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="w-full bg-gradient-to-b from-cyan-400 via-blue-600 to-purple-600 shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                style={{ height: "100%", scaleY: scaleY, transformOrigin: "top" }}
              ></motion.div>
            </div>

            <div className="space-y-12">
              {educationData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-dark border-2 border-cyan-400/50 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                  </div>

                  <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group relative overflow-hidden">
                      {/* Hover Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-0.5 mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <div className="w-full h-full bg-dark rounded-[10px] flex items-center justify-center">
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                              <BinaryText text={item.degree} className="text-white" revealSpeed={30} />
                            </h3>
                            <p className="text-blue-400 font-medium">{item.university}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4 border-b border-white/5 pb-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                            <span>{item.period}</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                            <span>{item.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed mb-4 text-sm">
                          {item.description}
                        </p>

                        <div className="flex items-center text-sm font-medium">
                          <Award className={`w-4 h-4 mr-2 ${item.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`} />
                          <span className={item.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;