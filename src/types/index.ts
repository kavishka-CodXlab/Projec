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