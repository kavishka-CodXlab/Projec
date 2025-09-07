import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002; // Changed from 3001 to 3002

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create directories
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(dataDir);
fs.ensureDirSync(uploadsDir);

// File paths
const projectsFile = path.join(dataDir, 'projects.json');
const messagesFile = path.join(dataDir, 'messages.json');
const userDataFile = path.join(dataDir, 'userData.json');

// Default data
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
    description: 'Developed an intelligent chatbot to assist users with basic medical queries and symptom guidance.',
    technologies: ['Python 3.6+', 'Langchain', 'FAISS', 'Chainlit', 'PyPDF2', 'Git'],
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
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

// Initialize data files
const initializeDataFiles = () => {
  if (!fs.existsSync(projectsFile)) {
    fs.writeJsonSync(projectsFile, defaultProjects, { spaces: 2 });
    console.log('✅ Created projects.json with default data');
  }
  if (!fs.existsSync(messagesFile)) {
    fs.writeJsonSync(messagesFile, [], { spaces: 2 });
    console.log('✅ Created messages.json');
  }
  if (!fs.existsSync(userDataFile)) {
    fs.writeJsonSync(userDataFile, defaultUserData, { spaces: 2 });
    console.log('✅ Created userData.json with default data');
  }
};

initializeDataFiles();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
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

// Helper functions
const readJsonFile = (filePath) => {
  try {
    return fs.readJsonSync(filePath);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error);
    return null;
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeJsonSync(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error);
    return false;
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all projects
app.get('/api/projects', (req, res) => {
  try {
    console.log('📥 GET /api/projects - Fetching projects');
    const projects = readJsonFile(projectsFile);
    if (projects === null) {
      return res.status(500).json({ error: 'Failed to read projects data' });
    }
    console.log(`✅ Returning ${projects.length} projects`);
    res.json(projects);
  } catch (error) {
    console.error('❌ Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update projects
app.put('/api/projects', (req, res) => {
  try {
    console.log('📝 PUT /api/projects - Updating projects');
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

    console.log(`✅ Successfully saved ${projects.length} projects`);
    res.json({ message: 'Projects updated successfully', projects });
  } catch (error) {
    console.error('❌ Error updating projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user data
app.get('/api/user-data', (req, res) => {
  try {
    console.log(' GET /api/user-data - Fetching user data');
    const userData = readJsonFile(userDataFile);
    if (userData === null) {
      return res.status(500).json({ error: 'Failed to read user data' });
    }
    res.json(userData);
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user data
app.put('/api/user-data', (req, res) => {
  try {
    console.log(' PUT /api/user-data - Updating user data');
    const userData = req.body;
    
    if (!userData.name || !userData.title || !userData.bio) {
      return res.status(400).json({ error: 'Invalid user data structure' });
    }

    const success = writeJsonFile(userDataFile, userData);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save user data' });
    }

    console.log('✅ Successfully saved user data');
    res.json({ message: 'User data updated successfully', userData });
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages
app.get('/api/messages', (req, res) => {
  try {
    console.log('📥 GET /api/messages - Fetching messages');
    const messages = readJsonFile(messagesFile);
    if (messages === null) {
      return res.status(500).json({ error: 'Failed to read messages data' });
    }
    res.json(messages);
  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add message
app.post('/api/messages', (req, res) => {
  try {
    console.log(' POST /api/messages - Adding message');
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

    console.log('✅ Successfully added message');
    res.json({ message: 'Message saved successfully', newMessage });
  } catch (error) {
    console.error('❌ Error adding message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as read
app.put('/api/messages/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 PUT /api/messages/${id}/read - Marking message as read`);
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
    console.error('❌ Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    console.log(' POST /api/upload - Uploading image');
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('✅ Image uploaded successfully:', imageUrl);
    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/projects`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📁 Data: ${dataDir}`);
  console.log(` Uploads: ${uploadsDir}`);
});