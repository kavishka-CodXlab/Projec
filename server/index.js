import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
fs.ensureDirSync(dataDir);

// File paths
const projectsFile = path.join(dataDir, 'projects.json');
const messagesFile = path.join(dataDir, 'messages.json');
const userDataFile = path.join(dataDir, 'userData.json');

// Initialize data files with default values if they don't exist
const initializeDataFiles = () => {
  const defaultProjects = [
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
      image: '/uploads/ai-medical-chatbot.png',
      githubUrl: 'https://github.com/kavishka-CodXlab/medbot-2.0',
      liveUrl: 'https://example.com'
    }
  ];

  const defaultUserData = {
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

  if (!fs.existsSync(projectsFile)) {
    fs.writeJsonSync(projectsFile, defaultProjects, { spaces: 2 });
  }
  if (!fs.existsSync(messagesFile)) {
    fs.writeJsonSync(messagesFile, [], { spaces: 2 });
  }
  if (!fs.existsSync(userDataFile)) {
    fs.writeJsonSync(userDataFile, defaultUserData, { spaces: 2 });
  }
};

// Initialize data files
initializeDataFiles();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to read JSON file
const readJsonFile = (filePath) => {
  try {
    return fs.readJsonSync(filePath);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeJsonSync(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Routes

// Get all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = readJsonFile(projectsFile);
    if (projects === null) {
      return res.status(500).json({ error: 'Failed to read projects data' });
    }
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update projects
app.put('/api/projects', (req, res) => {
  try {
    const { projects } = req.body;
    
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Projects must be an array' });
    }

    // Validate each project
    for (const project of projects) {
      if (!project.id || !project.title || !project.description || !Array.isArray(project.technologies)) {
        return res.status(400).json({ error: 'Invalid project data structure' });
      }
    }

    const success = writeJsonFile(projectsFile, projects);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save projects' });
    }

    res.json({ message: 'Projects updated successfully', projects });
  } catch (error) {
    console.error('Error updating projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user data
app.get('/api/user-data', (req, res) => {
  try {
    const userData = readJsonFile(userDataFile);
    if (userData === null) {
      return res.status(500).json({ error: 'Failed to read user data' });
    }
    res.json(userData);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user data
app.put('/api/user-data', (req, res) => {
  try {
    const userData = req.body;
    
    if (!userData.name || !userData.title || !userData.bio) {
      return res.status(400).json({ error: 'Invalid user data structure' });
    }

    const success = writeJsonFile(userDataFile, userData);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save user data' });
    }

    res.json({ message: 'User data updated successfully', userData });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages
app.get('/api/messages', (req, res) => {
  try {
    const messages = readJsonFile(messagesFile);
    if (messages === null) {
      return res.status(500).json({ error: 'Failed to read messages data' });
    }
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add message
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const messages = readJsonFile(messagesFile) || [];
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    messages.unshift(newMessage);
    const success = writeJsonFile(messagesFile, messages);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save message' });
    }

    res.json({ message: 'Message saved successfully', newMessage });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as read
app.put('/api/messages/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const messages = readJsonFile(messagesFile) || [];
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    messages[messageIndex].isRead = true;
    const success = writeJsonFile(messagesFile, messages);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to update message' });
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
