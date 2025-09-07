import React, { useState } from 'react';
import { Edit, Trash2, Plus, ExternalLink, Github, Code, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import ProjectForm from './ProjectForm';

const ProjectList: React.FC = () => {
  const { projects, loading, error, deleteProject } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    setDeletingId(project.id);
    try {
      await deleteProject(project);
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
  };

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
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-4">Get started by adding your first project</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Project</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600 hover:border-blue-500/50 transition-all duration-300 group"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-blue-600 transition-colors"
                    title="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    disabled={deletingId === project.id}
                    className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="Delete project"
                  >
                    {deletingId === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* External Links */}
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-gray-600 transition-colors"
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
                      className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-gray-600 transition-colors"
                      title="View Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Code className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium border border-blue-600/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-600">
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
                        className="text-gray-400 hover:text-white transition-colors"
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
                        className="text-gray-400 hover:text-white transition-colors"
                        title="View Live Demo"
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
      )}

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={editingProject || undefined}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ProjectList;
