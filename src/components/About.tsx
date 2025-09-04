import React, { useEffect, useRef, useState } from 'react';
import { User, MapPin, Calendar, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MeeImg from '../assets/Mee.jpg';

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

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Who I Am </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                 I'm a Computer Science student passionate about software development and problem-solving. I enjoy working on efficient, user-friendly solutions and have hands-on experience in UI/UX design. 
                 I'm always exploring new technologies and improving my skills as I grow in the field
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                  <MapPin className="w-5 h-5 text-blue-400 mb-2" />
                  <h4 className="text-white font-medium">Location</h4>
                  <p className="text-gray-400 text-sm">Sri Jayawardhanapura Kotte , Sri Lanka</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                  <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                  <h4 className="text-white font-medium">Status</h4>
                  <p className="text-gray-400 text-sm">Undergraduate Student</p>
                </div>
              </div>
            </div>

      <div className="relative">
  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-slate-700">
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1">
        <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden">
          <img
            src={MeeImg}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

                  <h3 className="text-2xl font-bold text-white mb-2">Kavishka Thilakarathna</h3>
                  <p className="text-blue-400 font-medium mb-4">{userData.title}</p>
                  <div className="flex items-center justify-center text-gray-400">
                    <Heart className="w-4 h-4 mr-2 text-red-400" />
                    <span className="text-sm">Passionate about Technology</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;