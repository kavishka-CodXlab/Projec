import React, { useState, useRef } from 'react';
import { Settings, Mail, Edit, Save, X, Eye, Trash2, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, BlogPost } from '../types';

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const { loginAdmin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white"
        />
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

const AdminDashboard: React.FC<{ showLogin: boolean; setShowLogin: (show: boolean) => void; onLogout: () => void; isAuthenticated: boolean }> = ({ showLogin, setShowLogin, onLogout, isAuthenticated }) => {
  const [editingUserData, setEditingUserData] = useState(false);
  const [editingProjects, setEditingProjects] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);
  const [editUserForm, setEditUserForm] = useState<any>(null);
  const [editProjectsForm, setEditProjectsForm] = useState<any[]>([]);
  const [editBlogForm, setEditBlogForm] = useState<BlogPost | null>(null);
  const [newBlogForm, setNewBlogForm] = useState({ title: '', content: '', imageUrl: '', videoUrl: '', externalUrl: '' });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    messages,
    markMessageAsRead,
    userData,
    updateUserData,
    projects,
    updateProjects,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    removeBlogPost
  } = useApp();
  const [activeTab, setActiveTab] = useState('messages');

  React.useEffect(() => {
    setEditUserForm(userData);
    setEditProjectsForm(projects);
  }, [userData, projects]);

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
    setEditProjectsForm((editProjectsForm as any[]).filter((p: any) => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setEditProjectsForm((editProjectsForm as any[]).map((p: any) =>
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  if (!isAuthenticated) {
    if (!showLogin) return null;
    return <AdminLogin onLogin={() => { setShowLogin(false); }} />;
  }

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
            <div className="flex gap-2">
              <button
                onClick={onLogout}
                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 font-semibold"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            {[
              { id: 'messages', label: 'Messages', icon: Mail },
              { id: 'content', label: 'Content', icon: Edit },
              { id: 'blog', label: 'Blog', icon: Plus }
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
                  {(editingProjects ? (editProjectsForm as any[]) : projects).map((project: any) => (
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
                            {project.technologies.map((tech: any, index: number) => (
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

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
                <button
                  onClick={() => setNewBlogForm({ title: '', content: '', imageUrl: '', videoUrl: '', externalUrl: '' })}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>
              {/* Add New Blog Form */}
              {newBlogForm.title !== '' || newBlogForm.content !== '' || newBlogForm.imageUrl !== '' || newBlogForm.videoUrl !== '' || newBlogForm.externalUrl !== '' ? (
                <div className="mb-8 space-y-2">
                  <input
                    type="text"
                    value={newBlogForm.title}
                    onChange={e => setNewBlogForm({ ...newBlogForm, title: e.target.value })}
                    placeholder="Blog Title"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  <textarea
                    value={newBlogForm.content}
                    onChange={e => setNewBlogForm({ ...newBlogForm, content: e.target.value })}
                    placeholder="Blog Content"
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  {/* Drag-and-drop image upload */}
                  <div
                    className={`w-full h-32 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${dragActive ? 'border-blue-400 bg-blue-900/10' : 'border-slate-600 bg-slate-800/20'}`}
                    onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                    onDrop={e => {
                      e.preventDefault(); setDragActive(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewBlogForm({ ...newBlogForm, imageUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    {newBlogForm.imageUrl ? (
                      <img src={newBlogForm.imageUrl} alt="Preview" className="h-28 object-contain rounded" />
                    ) : (
                      <span className="text-gray-400">Drag & drop an image here, or click to select</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={imageInputRef}
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewBlogForm({ ...newBlogForm, imageUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    value={newBlogForm.videoUrl}
                    onChange={e => setNewBlogForm({ ...newBlogForm, videoUrl: e.target.value })}
                    placeholder="Video URL (optional)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={newBlogForm.externalUrl}
                    onChange={e => setNewBlogForm({ ...newBlogForm, externalUrl: e.target.value })}
                    placeholder="External Blog URL (optional)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  <button
                    onClick={() => {
                      addBlogPost({
                        title: newBlogForm.title,
                        content: newBlogForm.content,
                        author: 'Admin',
                        imageUrl: newBlogForm.imageUrl,
                        videoUrl: newBlogForm.videoUrl,
                        externalUrl: newBlogForm.externalUrl
                      });
                      setNewBlogForm({ title: '', content: '', imageUrl: '', videoUrl: '', externalUrl: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Save
                  </button>
                </div>
              ) : null}
              {/* Blog Posts List */}
              <div className="space-y-6">
                {blogPosts.length === 0 ? (
                  <p className="text-gray-400">No blog posts yet.</p>
                ) : (
                  blogPosts.map(post => (
                    <div key={post.id} className="bg-slate-700/30 rounded-lg p-4">
                      {editingBlog && editBlogForm?.id === post.id ? (
                        <div>
                          <input
                            type="text"
                            value={editBlogForm.title}
                            onChange={e => setEditBlogForm({ ...editBlogForm, title: e.target.value } as BlogPost)}
                            className="w-full px-3 py-2 mb-2 bg-slate-600 border border-slate-500 rounded text-white"
                          />
                          <textarea
                            value={editBlogForm.content}
                            onChange={e => setEditBlogForm({ ...editBlogForm, content: e.target.value } as BlogPost)}
                            rows={3}
                            className="w-full px-3 py-2 mb-2 bg-slate-600 border border-slate-500 rounded text-white"
                          />
                          <input
                            type="text"
                            value={editBlogForm.imageUrl || ''}
                            onChange={e => setEditBlogForm({ ...editBlogForm, imageUrl: e.target.value } as BlogPost)}
                            placeholder="Image URL (optional)"
                            className="w-full px-3 py-2 mb-2 bg-slate-600 border border-slate-500 rounded text-white"
                          />
                          <input
                            type="text"
                            value={editBlogForm.videoUrl || ''}
                            onChange={e => setEditBlogForm({ ...editBlogForm, videoUrl: e.target.value } as BlogPost)}
                            placeholder="Video URL (optional)"
                            className="w-full px-3 py-2 mb-2 bg-slate-600 border border-slate-500 rounded text-white"
                          />
                          <input
                            type="text"
                            value={editBlogForm.externalUrl || ''}
                            onChange={e => setEditBlogForm({ ...editBlogForm, externalUrl: e.target.value } as BlogPost)}
                            placeholder="External Blog URL (optional)"
                            className="w-full px-3 py-2 mb-2 bg-slate-600 border border-slate-500 rounded text-white"
                          />
                          <button
                            onClick={() => {
                              updateBlogPost(post.id, editBlogForm!);
                              setEditingBlog(false);
                              setEditBlogForm(null);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingBlog(false);
                              setEditBlogForm(null);
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                          <p className="text-gray-300 mb-3">{post.content}</p>
                          {post.imageUrl && (
                            <img src={post.imageUrl} alt="Blog" className="w-full h-48 object-cover rounded mb-2" />
                          )}
                          {post.videoUrl && (
                            <video src={post.videoUrl} controls className="w-full h-48 rounded mb-2" />
                          )}
                          {post.externalUrl && (
                            <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">External Blog Page ↗</a>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                setEditingBlog(true);
                                setEditBlogForm(post);
                              }}
                              className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeBlogPost(post.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AdminLogin };
export default AdminDashboard;