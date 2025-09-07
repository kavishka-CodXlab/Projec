import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, ExternalLink, Github } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { collection, addDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const ProjectManagement: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, loading, error } = useApp();
  
  // Debug: Log projects when they change
  React.useEffect(() => {
    console.log('📊 Projects updated:', projects.length, projects);
  }, [projects]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: null as File | null
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      image: null
    });
    setIsAdding(false);
    setEditingId(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submitted:', formData);
    
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔥 Starting project save process...');
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        image: 'https://via.placeholder.com/400x300?text=Project+Image' // Use placeholder for now
      };

      console.log('📦 Project data prepared:', projectData);

      if (editingId) {
        // Update existing project
        console.log('🔄 Updating project:', editingId);
        const projectRef = doc(db, 'projects', editingId);
        await updateDoc(projectRef, {
          ...projectData,
          updatedAt: new Date()
        });
        console.log('✅ Project updated successfully');
      } else {
        // Add new project
        console.log('➕ Adding new project');
        const projectsRef = collection(db, 'projects');
        const docRef = await addDoc(projectsRef, {
          ...projectData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ Project added successfully:', docRef.id);
      }

      // Show success message
      setSuccessMessage(editingId ? 'Project updated successfully!' : 'Project added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Reset form after a short delay
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      console.error('❌ Error saving project:', err);
      alert(`Error saving project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      image: null
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await deleteProject(project);
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Error deleting project. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-red-400" />
          </div>
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

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span className="text-green-400 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Management</h2>
          <p className="text-gray-400">Manage your portfolio projects</p>
          <div className="mt-2 text-sm">
            <span className="text-blue-400">Projects: {projects.length}</span>
            {loading && <span className="ml-4 text-yellow-400">Loading...</span>}
            {error && <span className="ml-4 text-red-400">Error: {error}</span>}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              try {
                console.log('🧪 Testing Firebase connection...');
                const testRef = collection(db, 'test');
                const docRef = await addDoc(testRef, { 
                  test: 'manual', 
                  timestamp: new Date(),
                  message: 'Manual test from admin dashboard'
                });
                console.log('✅ Test successful:', docRef.id);
                alert('Firebase test successful! Check console for details.');
              } catch (error) {
                console.error('❌ Test failed:', error);
                alert(`Firebase test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
          >
            <span>Test Firebase</span>
          </button>
          <button
            onClick={async () => {
              try {
                console.log('🔄 Manually loading projects from Firebase...');
                const projectsRef = collection(db, 'projects');
                const snapshot = await getDocs(projectsRef);
                const projectsData = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }));
                console.log('📊 Loaded projects:', projectsData.length, projectsData);
                alert(`Loaded ${projectsData.length} projects from Firebase. Check console for details.`);
              } catch (error) {
                console.error('❌ Load failed:', error);
                alert(`Failed to load projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
          >
            <span>Load Projects</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
              title="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, TypeScript"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourproject.com"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                placeholder="Select project image"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                If no image is selected, a placeholder will be used
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingId ? 'Update' : 'Add'} Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-4">Get started by adding your first project</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Project
            </button>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg';
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
