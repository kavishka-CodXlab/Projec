import React, { useState } from 'react';
import { Settings, Mail, Edit, Save, X, Eye, Trash2, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

const AdminDashboard: React.FC = () => {
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
  const [activeTab, setActiveTab] = useState('messages');
  const [editingUserData, setEditingUserData] = useState(false);
  const [editingProjects, setEditingProjects] = useState(false);
  const [editUserForm, setEditUserForm] = useState(userData);
  const [editProjectsForm, setEditProjectsForm] = useState(projects);

  if (!isAdmin) return null;

  const handleUserDataSave = () => {
    updateUserData(editUserForm);
    setEditingUserData(false);
  };

  const handleProjectsSave = () => {
    updateProjects(editProjectsForm);
    setEditingProjects(false);
  };

  const addNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Project description',
      technologies: ['Technology'],
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
    };
    setEditProjectsForm([...editProjectsForm, newProject]);
  };

  const removeProject = (id: string) => {
    setEditProjectsForm(editProjectsForm.filter(p => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setEditProjectsForm(editProjectsForm.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Settings className="w-8 h-8 mr-3 text-blue-400" />
              Admin Dashboard
            </h1>
            <button
              onClick={() => setIsAdmin(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            {[
              { id: 'messages', label: 'Messages', icon: Mail },
              { id: 'content', label: 'Content', icon: Edit }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>
              {messages.length === 0 ? (
                <p className="text-gray-400">No messages yet.</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
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
                          <h3 className="text-white font-semibold">{message.name}</h3>
                          <p className="text-gray-400 text-sm">{message.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleDateString()}
                          </span>
                          {!message.isRead && (
                            <button
                              onClick={() => markMessageAsRead(message.id)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
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
              )}
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* User Data Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  <button
                    onClick={() => editingUserData ? handleUserDataSave() : setEditingUserData(true)}
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

                {editingUserData ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={editUserForm.name}
                        onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={editUserForm.title}
                        onChange={(e) => setEditUserForm({...editUserForm, title: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea
                        value={editUserForm.bio}
                        onChange={(e) => setEditUserForm({...editUserForm, bio: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
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

              {/* Projects Section.. */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Projects</h2>
                  <div className="flex space-x-2">
                    {editingProjects && (
                      <button
                        onClick={addNewProject}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    )}
                    <button
                      onClick={() => editingProjects ? handleProjectsSave() : setEditingProjects(true)}
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

                <div className="grid gap-6">
                  {(editingProjects ? editProjectsForm : projects).map((project) => (
                    <div key={project.id} className="bg-slate-700/30 rounded-lg p-4">
                      {editingProjects ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-3">
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => updateProject(project.id, { title: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                                placeholder="Project title"
                              />
                              <textarea
                                value={project.description}
                                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                                placeholder="Project description"
                              />
                              <input
                                type="text"
                                value={project.technologies.join(', ')}
                                onChange={(e) => updateProject(project.id, { technologies: e.target.value.split(', ') })}
                                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                                placeholder="Technologies (comma separated)"
                              />
                            </div>
                            <button
                              onClick={() => removeProject(project.id)}
                              className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-white font-semibold mb-2">{project.title}</h3>
                          <p className="text-gray-300 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;