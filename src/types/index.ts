export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface UserData {
  name: string;
  title: string;
  bio: string;
  education: {
    degree: string;
    university: string;
    year: string;
    description: string;
  };
  skills: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
}

// Chatbot conversation flow types
export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: string[];
  isTyping?: boolean;
}

export interface Slot {
  name: string;
  prompt: string;
  type: 'string' | 'email' | 'url' | 'file';
  options?: string[];
  required?: boolean;
}

export interface Intent {
  name: string;
  training_phrases: string[];
  responses: string[];
  quick_replies?: string[];
  slots?: Slot[];
  confirmation?: string;
  final_response?: string;
}

export interface ConversationState {
  currentIntent: string | null;
  collectedSlots: Record<string, any>;
  isWaitingForSlot: boolean;
  currentSlot: string | null;
  isConfirming: boolean;
  conversationHistory: ChatMessage[];
}