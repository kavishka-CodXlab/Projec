import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, ContactMessage, UserData, BlogPost } from '../types';

interface AppContextType {
  projects: Project[];
  messages: ContactMessage[];
  userData: UserData;
  isAdmin: boolean;
  chatbotOpen: boolean;
  blogPosts: BlogPost[];
  addMessage: (message: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  updateUserData: (data: Partial<UserData>) => void;
  updateProjects: (projects: Project[]) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setChatbotOpen: (open: boolean) => void;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  removeBlogPost: (id: string) => void;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const initialUserData: UserData = {
  name: "Your Name",
  title: "Computer Science Student",
  bio: "I'm a passionate Computer Science undergraduate student at the University of Bedfordshire, dedicated to learning and creating innovative technology solutions.",
  education: {
    degree: "Bachelor of Science in Computer Science",
    university: "University of Bedfordshire",
    year: "2021-2025",
    description: "Studying modern computer science concepts including software engineering, algorithms, data structures, and emerging technologies."
  },
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "HTML/CSS", "Git", "SQL", "MongoDB"],
  socialLinks: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/"
  }
};

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with user authentication, product management, and payment integration.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    technologies: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com'
  },
  {
    id: '3',
    title: 'Weather Analytics Dashboard',
    description: 'A responsive dashboard for weather data visualization with interactive charts and forecasting.',
    technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg',
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com'
  }
];

const initialBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Build a Modern Portfolio with React & Tailwind',
    content: 'A step-by-step guide to creating a beautiful, responsive portfolio website using React and Tailwind CSS.',
    date: new Date('2025-07-24'),
    author: 'Kavishka Kathilakarathna',
    imageUrl: '',
    videoUrl: '',
    externalUrl: ''
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [adminAuth, setAdminAuth] = useState({ username: '', authenticated: false });

  // Load from localStorage on mount
  React.useEffect(() => {
    const storedAdmin = localStorage.getItem('isAdmin');
    const storedBlogPosts = localStorage.getItem('blogPosts');
    if (storedAdmin) setIsAdmin(JSON.parse(storedAdmin));
    if (storedBlogPosts) setBlogPosts(JSON.parse(storedBlogPosts));
  }, []);

  // Persist to localStorage on change
  React.useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);
  React.useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  const addMessage = (messageData: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead'>) => {
    const newMessage: ContactMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  };

  const addBlogPost = (post: Omit<BlogPost, 'id' | 'date'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      date: new Date(),
      author: userData.name
    };
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(post => post.id === id ? { ...post, ...updates } : post));
  };

  const removeBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id));
  };

  const loginAdmin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      setAdminAuth({ username, authenticated: true });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminAuth({ username: '', authenticated: false });
  };

  return (
    <AppContext.Provider value={{
      projects,
      messages,
      userData,
      isAdmin,
      chatbotOpen,
      blogPosts,
      addMessage,
      markMessageAsRead,
      updateUserData,
      updateProjects,
      setIsAdmin,
      setChatbotOpen,
      addBlogPost,
      updateBlogPost,
      removeBlogPost,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};