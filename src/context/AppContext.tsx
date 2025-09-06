import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

export const useApp = (): AppContextType => {
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

// Helper functions for localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    console.log(`Loading ${key} from localStorage:`, item);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    console.log(`Saving ${key} to localStorage:`, value);
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Successfully saved ${key} to localStorage`);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or use defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    const loaded = loadFromStorage<Project[]>('portfolio-projects', initialProjects);
    console.log('Initial projects loaded:', loaded);
    return loaded;
  });
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const loaded = loadFromStorage<ContactMessage[]>('portfolio-messages', []);
    console.log('Initial messages loaded:', loaded);
    return loaded;
  });
  const [userData, setUserData] = useState<UserData>(() => {
    const loaded = loadFromStorage<UserData>('portfolio-userData', initialUserData);
    console.log('Initial userData loaded:', loaded);
    return loaded;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    console.log('Projects changed, saving to localStorage:', projects);
    saveToStorage('portfolio-projects', projects);
  }, [projects]);

  useEffect(() => {
    console.log('Messages changed, saving to localStorage:', messages);
    saveToStorage('portfolio-messages', messages);
  }, [messages]);

  useEffect(() => {
    console.log('UserData changed, saving to localStorage:', userData);
    saveToStorage('portfolio-userData', userData);
  }, [userData]);

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
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, isRead: true } : msg
      )
    );
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  };

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};