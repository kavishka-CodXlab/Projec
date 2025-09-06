import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, ContactMessage, UserData } from '../types';
import aiMedicalChatbotImg from '../assets/ai-medical-chatbot.png';

interface AppContextType {
  projects: Project[];
  messages: ContactMessage[];
  userData: UserData;
  isAdmin: boolean;
  chatbotOpen: boolean;
  addMessage: (message: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  updateUserData: (data: Partial<UserData>) => void;
  updateProjects: (projects: Project[]) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setChatbotOpen: (open: boolean) => void;
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
    github: "https://github.com/kavishka-CodXlab",
    linkedin: "https://www.linkedin.com/in/kavishka-thilakarathna",
    facebook: "https://www.facebook.com/profile.php?id=100076249214752",
    instagram: "https://www.instagram.com/kavii_shkaa/",
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
    githubUrl: 'https://github.com/kavishka-CodXlab',
    liveUrl: 'https://example.com'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    technologies: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    githubUrl: 'https://github.com/kavishka-CodXlab',
    liveUrl: 'https://example.com'
  },
  {
    id: '3',
    title: 'AI Medical Chatbot',
    description: 'Developed an intelligent chatbot to assist users with basic medical queries and symptom guidance. Integrated LLM APIs for natural language processing, PostgreSQL for data management, and REST APIs for backend communication. Implemented logging and testing to ensure production-ready performance and reliability.',
    technologies: ['Python 3.6+', 'Langchain', 'FAISS', 'Chainlit', 'PyPDF2', 'Git'],
    image: aiMedicalChatbotImg,
    githubUrl: 'https://github.com/kavishka-CodXlab/medbot-2.0',
    liveUrl: 'https://example.com'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or use defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('portfolio_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('portfolio_userData');
    return saved ? JSON.parse(saved) : initialUserData;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const addMessage = (messageData: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead'>) => {
    const newMessage: ContactMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    setMessages(prev => {
      const updated = [newMessage, ...prev];
      localStorage.setItem('portfolio_messages', JSON.stringify(updated));
      return updated;
    });
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      );
      localStorage.setItem('portfolio_messages', JSON.stringify(updated));
      return updated;
    });
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('portfolio_userData', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
  };

  return (
    <AppContext.Provider value={{
      projects,
      messages,
      userData,
      isAdmin,
      chatbotOpen,
      addMessage,
      markMessageAsRead,
      updateUserData,
      updateProjects,
      setIsAdmin,
      setChatbotOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};