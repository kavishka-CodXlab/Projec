import React from 'react';
import { ExternalLink, Github, Code, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProjectList = () => {
  const { projects, loading, error } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Projects</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Projects Found</h3>
          <p className="text-gray-400">No projects are available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Here are some of the projects I've worked on, showcasing my skills in various technologies and frameworks.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-blue-600 transition-colors duration-200"
                      title="View on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-blue-600 transition-colors duration-200"
                      title="View Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                {/* Title */}
                <div className="flex items-center mb-3">
                  <Code className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium border border-blue-600/30 hover:bg-blue-600/30 transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Recent</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200 group/link"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-xs group-hover/link:underline">Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200 group/link"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-xs group-hover/link:underline">Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 border border-slate-600"
          >
            <Loader2 className="w-4 h-4" />
            <span>Refresh Projects</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
