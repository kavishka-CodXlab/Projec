import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Settings, Mail, Edit, Save, X, Eye, Trash2, Plus, Upload, Image as ImageIcon, GripVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface SortableProjectItemProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onRemove: (id: string) => void;
  onTechnologiesChange: (id: string, value: string) => void;
  onImageUpload: (id: string, file: File) => void;
}

const SortableProjectItem: React.FC<SortableProjectItemProps> = ({
  project,
  isEditing,
  onUpdate,
  onRemove,
  onTechnologiesChange,
  onImageUpload
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    if (file) {
      console.log('Calling onImageUpload for project:', project.id);
      onImageUpload(project.id, file);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-slate-700/30 rounded-lg lg:rounded-xl p-4 lg:p-6 ${isDragging ? 'shadow-2xl' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
            <div className="flex-1 space-y-3 lg:space-y-4 lg:mr-6">
              {/* Drag Handle */}
              <div className="flex items-center space-x-2 mb-2">
                <button
                  {...attributes}
                  {...listeners}
                  className="p-1 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400">Drag to reorder</span>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image
                </label>
                <div className="space-y-3">
                  {/* Current Image Preview */}
                  {project.image && (
                    <div className="w-full max-w-xs lg:max-w-sm">
                      <div className="w-full h-32 lg:h-40 rounded-lg overflow-hidden bg-slate-600 border border-slate-500">
                        <img
                          src={project.image}
                          alt="Project preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Current cover image</p>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id={`image-upload-${project.id}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.getElementById(`image-upload-${project.id}`) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 border border-blue-500 hover:border-blue-400"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {project.image ? 'Change Image' : 'Upload Image'}
                      </span>
                    </button>
                    <p className="text-xs text-gray-400 mt-1">
                      Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Title */}
              <div>
                <label htmlFor={`project-title-${project.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  id={`project-title-${project.id}`}
                  type="text"
                  value={project.title}
                  onChange={(e) => onUpdate(project.id, { title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Project title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor={`project-desc-${project.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id={`project-desc-${project.id}`}
                  value={project.description}
                  onChange={(e) => onUpdate(project.id, { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Project description"
                  required
                />
              </div>

              {/* Technologies */}
              <div>
                <label htmlFor={`project-tech-${project.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Technologies
                </label>
                <input
                  id={`project-tech-${project.id}`}
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => onTechnologiesChange(project.id, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Technologies (comma separated)"
                  required
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label htmlFor={`project-github-${project.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub URL
                </label>
                <input
                  id={`project-github-${project.id}`}
                  type="url"
                  value={project.githubUrl || ''}
                  onChange={(e) => onUpdate(project.id, { githubUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Live URL */}
              <div>
                <label htmlFor={`project-live-${project.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Live URL
                </label>
                <input
                  id={`project-live-${project.id}`}
                  type="url"
                  value={project.liveUrl || ''}
                  onChange={(e) => onUpdate(project.id, { liveUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-project.com"
                />
              </div>
            </div>
            <button
              onClick={() => onRemove(project.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded transition-colors duration-200"
              aria-label="Remove project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-4 lg:space-x-6">
          <div className="w-24 h-18 lg:w-32 lg:h-24 rounded-lg overflow-hidden bg-slate-600 flex-shrink-0 border border-slate-500">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2 lg:mb-3 text-lg lg:text-xl">{project.title}</h3>
            <p className="text-gray-300 mb-3 lg:mb-4 text-sm lg:text-base line-clamp-2 lg:line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {project.technologies.map((tech, index) => (
                <span
                  key={`${project.id}-tech-${index}`}
                  className="px-2 py-1 lg:px-3 lg:py-1.5 bg-blue-600/20 text-blue-400 rounded text-xs lg:text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            {(project.githubUrl || project.liveUrl) && (
              <div className="flex gap-3 lg:gap-4 mt-3 lg:mt-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs lg:text-sm font-medium"
                  >
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-xs lg:text-sm font-medium"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    isAdmin, 
    setIsAdmin, 
    messages, 
    markMessageAsRead, 
    userData, 
    updateUserData, 
    projects, 
    updateProjects 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'messages' | 'content'>('messages');
  const [editingUserData, setEditingUserData] = useState(false);
  const [editingProjects, setEditingProjects] = useState(false);
  const [editUserForm, setEditUserForm] = useState(userData);
  const [editProjectsForm, setEditProjectsForm] = useState(projects);

  // Sync local state with global state when they change
  useEffect(() => {
    setEditUserForm(userData);
  }, [userData]);

  useEffect(() => {
    setEditProjectsForm(projects);
  }, [projects]);
  const [isVisible, setIsVisible] = useState(true);
  const [messageFilter, setMessageFilter] = useState<'all' | 'chatbot' | 'contact'>('all');

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Early return if not admin
  if (!isAdmin) {
    return null;
  }

  // Memoized tab configuration
  const tabs = useMemo(() => [
    { id: 'messages' as const, label: 'Messages', icon: Mail },
    { id: 'content' as const, label: 'Content', icon: Edit }
  ], []);

  // Optimized handlers with useCallback
  const handleUserDataSave = useCallback(() => {
    updateUserData(editUserForm);
    setEditingUserData(false);
    // Force a small delay to ensure state updates properly
    setTimeout(() => {
      setEditUserForm(editUserForm);
    }, 100);
  }, [editUserForm, updateUserData]);

  const handleProjectsSave = useCallback(() => {
    updateProjects(editProjectsForm);
    setEditingProjects(false);
    // Force a small delay to ensure state updates properly
    setTimeout(() => {
      setEditProjectsForm(editProjectsForm);
    }, 100);
  }, [editProjectsForm, updateProjects]);

  const handleUserDataCancel = useCallback(() => {
    setEditUserForm(userData);
    setEditingUserData(false);
  }, [userData]);

  const handleProjectsCancel = useCallback(() => {
    setEditProjectsForm(projects);
    setEditingProjects(false);
  }, [projects]);

  const addNewProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Project description',
      technologies: ['Technology'],
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
    };
    setEditProjectsForm(prev => [...prev, newProject]);
  }, []);

  const removeProject = useCallback((id: string) => {
    setEditProjectsForm(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    console.log('updateProject called with:', { id, updates });
    setEditProjectsForm(prev => {
      const updated = prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
      );
      console.log('Updated projects form:', updated);
      return updated;
    });
  }, []);

  const handleUserFormChange = useCallback((field: keyof typeof userData, value: string) => {
    setEditUserForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTechnologiesChange = useCallback((id: string, value: string) => {
    const technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    updateProject(id, { technologies });
  }, [updateProject]);

  const handleCloseAdmin = useCallback(() => {
    setIsVisible(false);
    // Small delay to allow fade-out animation before logout
    setTimeout(() => {
      onLogout();
    }, 200);
  }, [onLogout]);

  const handleMarkAsRead = useCallback((messageId: string) => {
    markMessageAsRead(messageId);
  }, [markMessageAsRead]);

  // Drag and drop handler
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEditProjectsForm((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  }, []);

  // Image upload handler
  const handleImageUpload = useCallback((projectId: string, file: File) => {
    console.log('handleImageUpload called with:', { projectId, file });
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      alert('Image size should be less than 5MB');
      return;
    }

    console.log('File validation passed, reading file...');
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      console.log('File read successfully, imageUrl length:', imageUrl?.length);
      if (imageUrl) {
        console.log('Updating project with new image');
        updateProject(projectId, { image: imageUrl });
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading image file');
    };
    reader.readAsDataURL(file);
  }, [updateProject]);

  // Memoized messages list
  const messagesList = useMemo(() => {
    // Filter messages based on selected filter
    const filteredMessages = messages.filter((message) => {
      if (messageFilter === 'all') return true;
      if (messageFilter === 'chatbot') return message.name === 'Chatbot User';
      if (messageFilter === 'contact') return message.name !== 'Chatbot User';
      return true;
    });

    if (filteredMessages.length === 0) {
      return <p className="text-gray-400">No messages yet.</p>;
    }

    return (
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg border transition-colors duration-200 ${
              message.isRead
                ? 'bg-slate-700/30 border-slate-600'
                : 'bg-blue-600/10 border-blue-600/30'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-white font-semibold">{message.name}</h3>
                  {message.name === 'Chatbot User' && (
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium border border-purple-600/30">
                      Chatbot
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{message.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleDateString()}
                </span>
                {!message.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(message.id)}
                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    aria-label="Mark as read"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">{message.message}</p>
          </div>
        ))}
      </div>
    );
  }, [messages, handleMarkAsRead, messageFilter]);

  return (
    <div className={`fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 overflow-y-auto transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 lg:mb-12">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center">
                <Settings className="w-8 h-8 lg:w-10 lg:h-10 mr-3 text-blue-400" />
              Admin Dashboard
            </h1>
              <div className="hidden lg:block text-sm text-gray-400">
                Manage your portfolio content and messages
              </div>
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={handleCloseAdmin}
                className="px-4 py-2 lg:px-6 lg:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold text-sm lg:text-base"
              >
                Logout
              </button>
            <button
              onClick={handleCloseAdmin}
                className="p-2 lg:p-3 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
              aria-label="Close admin dashboard"
            >
                <X className="w-6 h-6 lg:w-7 lg:h-7" />
            </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 lg:gap-4 mb-8 lg:mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 lg:px-6 lg:py-4 rounded-lg font-medium transition-colors duration-200 text-sm lg:text-base ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  aria-label={`Switch to ${tab.label} tab`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-700">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Contact Messages</h2>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  <button
                    onClick={() => setMessageFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      messageFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setMessageFilter('chatbot')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      messageFilter === 'chatbot'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Chatbot
                  </button>
                  <button
                    onClick={() => setMessageFilter('contact')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      messageFilter === 'contact'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Contact Form
                  </button>
                </div>
              </div>
              {messagesList}
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* User Data Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  <div className="flex space-x-2">
                    {editingUserData && (
                      <button
                        onClick={handleUserDataCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      onClick={editingUserData ? handleUserDataSave : () => setEditingUserData(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {editingUserData ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {editingUserData ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleUserDataSave(); }} className="space-y-4">
                    <div>
                      <label htmlFor="user-name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        value={editUserForm.name}
                        onChange={(e) => handleUserFormChange('name', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="user-title" className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        id="user-title"
                        type="text"
                        value={editUserForm.title}
                        onChange={(e) => handleUserFormChange('title', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="user-bio" className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        id="user-bio"
                        value={editUserForm.bio}
                        onChange={(e) => handleUserFormChange('bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        required
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium">{userData.name}</h3>
                      <p className="text-gray-400">{userData.title}</p>
                    </div>
                    <p className="text-gray-300">{userData.bio}</p>
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Projects</h2>
                  <div className="flex space-x-2">
                    {editingProjects && (
                      <>
                        <button
                          onClick={addNewProject}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={handleProjectsCancel}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={editingProjects ? handleProjectsSave : () => setEditingProjects(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {editingProjects ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                      {editingProjects ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={editProjectsForm.map(project => project.id)}
                      strategy={verticalListSortingStrategy}
                    >
                        <div className="grid gap-6 lg:gap-8">
                        {editProjectsForm.map((project) => (
                          <SortableProjectItem
                            key={project.id}
                            project={project}
                            isEditing={true}
                            onUpdate={updateProject}
                            onRemove={removeProject}
                            onTechnologiesChange={handleTechnologiesChange}
                            onImageUpload={handleImageUpload}
                          />
                            ))}
                          </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="grid gap-6 lg:gap-8">
                    {projects.map((project) => (
                      <SortableProjectItem
                        key={project.id}
                        project={project}
                        isEditing={false}
                        onUpdate={updateProject}
                        onRemove={removeProject}
                        onTechnologiesChange={handleTechnologiesChange}
                        onImageUpload={handleImageUpload}
                      />
                    ))}
                        </div>
                      )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 