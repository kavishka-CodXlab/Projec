import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Education: React.FC = () => {
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

  return (
    <section id="education" ref={sectionRef} className="py-20 bg-slate-900/50 relative">
      {/* Graduation Animation Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(18)].map((_, i) => (
          <svg
            key={i}
            width={32 + Math.random() * 32}
            height={32 + Math.random() * 32}
            style={{
              position: 'absolute',
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              opacity: 0.12 + Math.random() * 0.18,
              animation: `float${i} 12s ease-in-out infinite`,
              zIndex: 0
            }}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="16" y="32" width="32" height="16" rx="4" fill="#8B5CF6" />
            <rect x="24" y="24" width="16" height="8" rx="2" fill="#3B82F6" />
            <rect x="28" y="16" width="8" height="8" rx="2" fill="#fff" />
          </svg>
        ))}
        <style>{`
          ${[...Array(18)].map((_, i) => `@keyframes float${i} {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }`).join(' ')}
        `}</style>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
               <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Education</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-400 to-purple-600"></div>
              
              <div className="space-y-8">
                <div className="relative flex items-center">
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full border-4 border-slate-900 z-10"></div>
                  
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                          {/* Change to a university/college SVG icon for higher education */}
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="14" width="20" height="10" rx="2" fill="#fff" />
                            <rect x="10" y="10" width="12" height="4" rx="1" fill="#8B5CF6" />
                            <rect x="14" y="6" width="4" height="4" rx="1" fill="#3B82F6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{userData.education.degree}</h3>
                          <p className="text-blue-400 font-medium">{userData.education.university}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-sm">2025-2027</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-sm">SLIIT Metro</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {userData.education.description}
                      </p>
                      
                      <div className="flex items-center text-sm text-blue-400">
                        <Award className="w-4 h-4 mr-2" />
                        <span>Currently Pursuing</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Education Items Can Be Added Here */}
                <div className="relative flex items-center">
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-600 rounded-full border-4 border-slate-900 z-10"></div>
                  
                  <div className="ml-12 md:ml-0 md:w-1/2 md:ml-auto md:pl-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
                          {/* Change to a diploma/certificate SVG icon for foundation diploma */}
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="14" width="16" height="8" rx="2" fill="#e5e7eb" />
                            <rect x="12" y="10" width="8" height="4" rx="1" fill="#6366f1" />
                            <circle cx="16" cy="18" r="2" fill="#3B82F6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-300">Foundation Diploma</h3>
                          <p className="text-gray-500">Edith Cowan University</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Focus on Advanced Mathematics, Physics, and Computer Science, laying the foundation for my university studies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;