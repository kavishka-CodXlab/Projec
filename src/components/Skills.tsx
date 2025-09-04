import React, { useEffect, useRef, useState } from 'react';
import { Code, Database, Globe, Server } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Skills: React.FC = () => {
  const { userData } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const skillCategories = [
    {
      name: 'Frontend',
      icon: Globe,
      skills: ['JavaScript', 'TypeScript', 'React', 'HTML/CSS'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Backend',
      icon: Server,
      skills: ['Node.js', 'Python', 'Java'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Database',
      icon: Database,
      skills: ['SQL', 'MongoDB'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Tools',
      icon: Code,
      skills: ['Git'],
      color: 'from-orange-500 to-red-500'
    }
  ];

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
    <section id="skills" ref={sectionRef} className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Technical <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Skills</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Technologies and tools I use to build efficient and elegant solutions.
            </p>
          </div>

          {/* Skill Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{category.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
