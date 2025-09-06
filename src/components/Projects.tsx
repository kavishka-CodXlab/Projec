import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Code, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Projects: React.FC = () => {
  const { projects } = useApp();
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
    <section id="projects" ref={sectionRef} className="py-20 lg:py-32 bg-slate-800/50">
      <div className="max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6">
              Featured <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Projects</span>
            </h2>
            <div className="w-24 h-1 lg:w-32 lg:h-1.5 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-300 mt-4 lg:mt-6 max-w-3xl xl:max-w-4xl mx-auto text-base lg:text-lg xl:text-xl">
              Here are some of the projects I've worked on, showcasing my skills in various technologies and frameworks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`group bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 lg:h-56 xl:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 lg:p-3 bg-slate-800/80 rounded-full text-white hover:bg-blue-600 transition-colors duration-200"
                      >
                        <Github className="w-4 h-4 lg:w-5 lg:h-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 lg:p-3 bg-slate-800/80 rounded-full text-white hover:bg-blue-600 transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="flex items-center mb-3 lg:mb-4">
                    <Code className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 mr-2 lg:mr-3" />
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white">{project.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base xl:text-lg">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 lg:gap-3 mb-4 lg:mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 lg:px-4 lg:py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-xs lg:text-sm font-medium border border-blue-600/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Recent</span>
                    </div>
                    <div className="flex space-x-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;