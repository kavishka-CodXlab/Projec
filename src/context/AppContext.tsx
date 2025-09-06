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

// Helper function to compress base64 images
function compressBase64Image(base64: string, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(base64);
        return;
      }
      
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

// Helper function to check if a string is a base64 image
function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/') && str.includes('base64,');
}

// Helper functions for localStorage with proper Date handling and better error management
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined') {
      console.warn('localStorage is not available in this browser');
      return defaultValue;
    }

    const item = localStorage.getItem(key);
    if (!item) {
      console.log(`No data found for ${key}, using default`);
      return defaultValue;
    }
    
    const parsed = JSON.parse(item);
    console.log(`Loading ${key} from localStorage:`, parsed);
    
    // Special handling for messages to convert timestamp strings back to Date objects
    if (key === 'portfolio-messages' && Array.isArray(parsed)) {
      const messagesWithDates = parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      return messagesWithDates as T;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    console.log(`Falling back to default value for ${key}`);
    return defaultValue;
  }
}

async function saveToStorage<T>(key: string, value: T): Promise<void> {
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined') {
      throw new Error('localStorage is not available in this browser');
    }

    console.log(`Saving ${key} to localStorage:`, value);
    
    // Special handling for messages to ensure proper serialization
    let dataToSave = value;
    if (key === 'portfolio-messages' && Array.isArray(value)) {
      dataToSave = value.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
      })) as T;
    }
    
    // Special handling for projects to compress large base64 images
    if (key === 'portfolio-projects' && Array.isArray(value)) {
      const projectsWithCompressedImages = await Promise.all(
        (value as Project[]).map(async (project) => {
          if (project.image && isBase64Image(project.image)) {
            try {
              const compressedImage = await compressBase64Image(project.image);
              console.log(`Compressed image for project ${project.id}: ${project.image.length} -> ${compressedImage.length} characters`);
              return { ...project, image: compressedImage };
            } catch (error) {
              console.warn(`Failed to compress image for project ${project.id}:`, error);
              return project;
            }
          }
          return project;
        })
      );
      dataToSave = projectsWithCompressedImages as T;
    }
    
    // Check data size before saving
    const serialized = JSON.stringify(dataToSave);
    const sizeInBytes = new Blob([serialized]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    console.log(`Data size for ${key}: ${sizeInMB.toFixed(2)} MB`);
    
    // Warn if data is getting large (localStorage has ~5-10MB limit)
    if (sizeInMB > 4) {
      console.warn(`Data size for ${key} is large (${sizeInMB.toFixed(2)} MB). Consider reducing data size.`);
    }
    
    // Try to save the data
    localStorage.setItem(key, serialized);
    
    // Verify the save was successful
    const saved = localStorage.getItem(key);
    if (!saved || saved !== serialized) {
      throw new Error('Data was not saved correctly to localStorage');
    }
    
    console.log(`Successfully saved ${key} to localStorage`);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    
    // Provide more specific error messages
    let errorMessage = `Failed to save ${key}. `;
    
    if (error instanceof Error) {
      if (error.message.includes('QuotaExceededError') || error.message.includes('quota')) {
        errorMessage += 'Storage quota exceeded. Please clear some browser data or reduce the amount of content.';
      } else if (error.message.includes('not available')) {
        errorMessage += 'localStorage is not available. Please check your browser settings or try a different browser.';
      } else if (error.message.includes('not saved correctly')) {
        errorMessage += 'Data verification failed. Please try again.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
    } else {
      errorMessage += 'Please check your browser\'s storage settings or try refreshing the page.';
    }
    
    // Show user-friendly error message
    alert(errorMessage);
    
    // Also log to console for debugging
    console.error('Full error details:', error);
    console.error('Value that failed to save:', value);
  }
}

// Validation functions
function validateProject(project: any): project is Project {
  return (
    project &&
    typeof project.id === 'string' &&
    typeof project.title === 'string' &&
    typeof project.description === 'string' &&
    Array.isArray(project.technologies) &&
    typeof project.image === 'string'
  );
}

function validateContactMessage(message: any): message is ContactMessage {
  return (
    message &&
    typeof message.id === 'string' &&
    typeof message.name === 'string' &&
    typeof message.email === 'string' &&
    typeof message.message === 'string' &&
    (message.timestamp instanceof Date || typeof message.timestamp === 'string') &&
    typeof message.isRead === 'boolean'
  );
}

function validateUserData(data: any): data is UserData {
  return (
    data &&
    typeof data.name === 'string' &&
    typeof data.title === 'string' &&
    typeof data.bio === 'string' &&
    data.education &&
    Array.isArray(data.skills) &&
    data.socialLinks
  );
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or use defaults with validation
  const [projects, setProjects] = useState<Project[]>(() => {
    const loaded = loadFromStorage<Project[]>('portfolio-projects', initialProjects);
    console.log('Initial projects loaded:', loaded);
    
    // Validate loaded data
    if (Array.isArray(loaded)) {
      const validProjects = loaded.filter(validateProject);
      if (validProjects.length !== loaded.length) {
        console.warn('Some projects failed validation, using valid ones only');
      }
      return validProjects.length > 0 ? validProjects : initialProjects;
    }
    
    return initialProjects;
  });
  
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const loaded = loadFromStorage<ContactMessage[]>('portfolio-messages', []);
    console.log('Initial messages loaded:', loaded);
    
    // Validate loaded data
    if (Array.isArray(loaded)) {
      const validMessages = loaded.filter(validateContactMessage);
      if (validMessages.length !== loaded.length) {
        console.warn('Some messages failed validation, using valid ones only');
      }
      return validMessages;
    }
    
    return [];
  });
  
  const [userData, setUserData] = useState<UserData>(() => {
    const loaded = loadFromStorage<UserData>('portfolio-userData', initialUserData);
    console.log('Initial userData loaded:', loaded);
    
    // Validate loaded data
    if (validateUserData(loaded)) {
      return loaded;
    }
    
    console.warn('UserData failed validation, using default');
    return initialUserData;
  });
  
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);

  // Save to localStorage whenever data changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      console.log('Projects changed, saving to localStorage:', projects);
      await saveToStorage('portfolio-projects', projects);
    }, 100); // Small delay to prevent excessive saves during rapid changes
    
    return () => clearTimeout(timeoutId);
  }, [projects]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      console.log('Messages changed, saving to localStorage:', messages);
      await saveToStorage('portfolio-messages', messages);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      console.log('UserData changed, saving to localStorage:', userData);
      await saveToStorage('portfolio-userData', userData);
    }, 100);
    
    return () => clearTimeout(timeoutId);
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