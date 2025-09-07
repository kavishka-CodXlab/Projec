import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, ContactMessage, UserData } from '../types';
import { projectsService, messagesService, userDataService } from '../services/firebaseService';

interface AppContextType {
  projects: Project[];
  messages: ContactMessage[];
  userData: UserData;
  isAdmin: boolean;
  chatbotOpen: boolean;
  loading: boolean;
  error: string | null;
  addMessage: (message: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
  updateUserData: (data: Partial<UserData>) => void;
  updateProjects: (projects: Project[]) => void;
  addProject: (project: Omit<Project, 'id' | 'image'>, imageFile: File) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>, imageFile?: File) => Promise<void>;
  deleteProject: (project: Project) => Promise<void>;
  setIsAdmin: (isAdmin: boolean) => void;
  setChatbotOpen: (open: boolean) => void;
  saveUserData: () => Promise<void>;
  saveProjects: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Fallback data for when Firebase is not available
const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'AI Medical Chatbot',
    description: 'An intelligent medical assistant powered by AI to help users with health-related queries.',
    technologies: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
    image: '/ai-medical-chatbot.png',
    githubUrl: 'https://github.com/yourusername/ai-medical-chatbot',
    liveUrl: 'https://ai-medical-chatbot.vercel.app'
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with payment integration and admin dashboard.',
    technologies: ['React', 'Express.js', 'Stripe', 'PostgreSQL'],
    image: '/ecommerce.png',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://ecommerce-demo.vercel.app'
  }
];

const fallbackUserData: UserData = {
  name: 'Kavishka Thilakarathna',
  title: 'Full Stack Developer',
  bio: 'Passionate developer creating innovative solutions with modern technologies.',
  education: {
    degree: 'Bachelor of Science in Computer Science',
    university: 'University of Colombo',
    year: '2023',
    description: 'Specialized in software engineering and web development'
  },
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'Firebase'],
  socialLinks: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    facebook: '',
    instagram: '',
    whatsapp: ''
  }
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    title: '',
    bio: '',
    education: {
      degree: '',
      university: '',
      year: '',
      description: ''
    },
    skills: [],
    socialLinks: {
      github: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      whatsapp: ''
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Test Firebase connection
  const testFirebaseConnection = async (): Promise<boolean> => {
    try {
      console.log('🔥 Testing Firebase connection...');
      await projectsService.getProjects();
      console.log('✅ Firebase connected successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ Firebase connection failed:', error);
      return false;
    }
  };

  // Load data from Firebase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading data...');

        // Test Firebase connection first
        const isFirebaseConnected = await testFirebaseConnection();

        if (isFirebaseConnected) {
          // Load from Firebase
          console.log('📡 Loading data from Firebase...');
          const [projectsData, messagesData, userDataData] = await Promise.all([
            projectsService.getProjects(),
            messagesService.getMessages(),
            userDataService.getUserData()
          ]);

          console.log('✅ Firebase data loaded:', { 
            projects: projectsData.length, 
            messages: messagesData.length 
          });

          setProjects(projectsData.length > 0 ? projectsData : fallbackProjects);
          setMessages(messagesData);
          if (userDataData) {
            setUserData(userDataData);
          }
        } else {
          // Use fallback data
          console.log('📦 Using fallback data');
          setProjects(fallbackProjects);
          setMessages([]);
          setUserData(fallbackUserData);
          setError('Firebase connection failed. Using offline data.');
        }
      } catch (err) {
        console.error('❌ Error loading data:', err);
        console.log('📦 Falling back to default data');
        
        // Use fallback data on error
        setProjects(fallbackProjects);
        setMessages([]);
        setUserData(fallbackUserData);
        setError('Using offline data. Firebase connection failed.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time listeners
    const unsubscribeProjects = projectsService.subscribeToProjects((projects) => {
      console.log('📡 Projects updated:', projects.length);
      setProjects(projects);
    });

    const unsubscribeMessages = messagesService.subscribeToMessages((messages) => {
      console.log('📡 Messages updated:', messages.length);
      setMessages(messages);
    });

    const unsubscribeUserData = userDataService.subscribeToUserData((userData) => {
      console.log('📡 User data updated');
      if (userData) {
        setUserData(userData);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeProjects();
      unsubscribeMessages();
      unsubscribeUserData();
    };
  }, []);

  const addMessage = async (messageData: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead'>) => {
    try {
      console.log('💬 Adding message:', messageData);
      await messagesService.addMessage(messageData);
      console.log('✅ Message added successfully');
    } catch (err) {
      console.error('❌ Error adding message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add message';
      setError(errorMessage);
      throw err;
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      console.log('👁️ Marking message as read:', id);
      await messagesService.markAsRead(id);
      console.log('✅ Message marked as read');
    } catch (err) {
      console.error('❌ Error marking message as read:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark message as read';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'image'>, imageFile: File) => {
    try {
      console.log('🚀 Adding new project with image...');
      await projectsService.addProjectWithImage(projectData, imageFile);
      console.log('✅ Project added successfully');
    } catch (err) {
      console.error('❌ Error adding project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add project';
      setError(errorMessage);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>, imageFile?: File) => {
    try {
      console.log('🔄 Updating project...');
      await projectsService.updateProjectWithImage(id, updates, imageFile);
      console.log('✅ Project updated successfully');
    } catch (err) {
      console.error('❌ Error updating project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteProject = async (project: Project) => {
    try {
      console.log('🗑️ Deleting project...');
      await projectsService.deleteProjectWithImage(project);
      console.log('✅ Project deleted successfully');
    } catch (err) {
      console.error('❌ Error deleting project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    }
  };

  const saveUserData = async () => {
    try {
      setError(null);
      console.log('💾 Saving user data...');
      await userDataService.updateUserData(userData);
      console.log('✅ User data saved successfully');
    } catch (err) {
      console.error('❌ Error saving user data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user data';
      setError(errorMessage);
      throw err;
    }
  };

  const saveProjects = async () => {
    try {
      setError(null);
      console.log(' Saving projects...');
      await projectsService.updateProjects(projects);
      console.log('✅ Projects saved successfully');
    } catch (err) {
      console.error('❌ Error saving projects:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save projects';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        messages,
        userData,
        isAdmin,
        chatbotOpen,
        loading,
        error,
        addMessage,
        markMessageAsRead,
        updateUserData,
        updateProjects,
        addProject,
        updateProject,
        deleteProject,
        setIsAdmin,
        setChatbotOpen,
        saveUserData,
        saveProjects
      }}
    >
      {children}
    </AppContext.Provider>
  );
};