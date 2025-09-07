import React, { useState, useCallback, useMemo } from 'react';
import { Settings, Mail, Edit, Save, X, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectManagement from './ProjectManagement';
import FirebaseDebug from './FirebaseDebug';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    isAdmin, 
    setIsAdmin, 
    messages, 
    markMessageAsRead, 
    userData, 
    updateUserData, 
    saveUserData
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'profile'>('messages');
  const [editingUserData, setEditingUserData] = useState(false);
  const [editUserForm, setEditUserForm] = useState(userData);
  const [isVisible, setIsVisible] = useState(true);
  const [messageFilter, setMessageFilter] = useState<'all' | 'chatbot' | 'contact'>('all');

  // Early return if not admin
  if (!isAdmin) {
    return null;
  }

  // Memoized tab configuration
  const tabs = useMemo(() => [
    { id: 'messages' as const, label: 'Messages', icon: Mail },
    { id: 'projects' as const, label: 'Projects', icon: Edit },
    { id: 'profile' as const, label: 'Profile', icon: Settings }
  ], []);

  // Optimized handlers with useCallback
  const handleUserDataSave = useCallback(async () => {
    try {
      updateUserData(editUserForm);
      await saveUserData();
      setEditingUserData(false);
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  }, [editUserForm, updateUserData, saveUserData]);

  const handleUserDataCancel = useCallback(() => {
    setEditUserForm(userData);
    setEditingUserData(false);
  }, [userData]);

  const handleUserFormChange = useCallback((field: keyof typeof userData, value: string) => {
    setEditUserForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCloseAdmin = useCallback(() => {
    setIsVisible(false);
    // Small delay to allow fade-out animation before logout
    setTimeout(() => {
      onLogout();
    }, 200);
  }, [onLogout]);

  const handleMarkAsRead = useCallback(async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [markMessageAsRead]);

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

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-700">
              <ProjectManagement />
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
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
          )}
        </div>
      </div>
      
      {/* Firebase Debug Component */}
      <FirebaseDebug />
    </div>
  );
};

export default AdminDashboard;