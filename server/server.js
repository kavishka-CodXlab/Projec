import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

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

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Projects CRUD operations

// GET /api/projects - Get all projects
app.get('/api/projects', (req, res) => {
  try {
    console.log('📥 GET /api/projects - Fetching projects');
    const projects = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
    
    // Parse technologies JSON strings
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies)
    }));
    
    console.log(`✅ Returning ${formattedProjects.length} projects`);
    res.json(formattedProjects);
  } catch (error) {
    console.error('❌ Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/projects - Create new project
app.post('/api/projects', (req, res) => {
  try {
    console.log('➕ POST /api/projects - Creating new project');
    const { title, description, technologies, image, githubUrl, liveUrl } = req.body;
    
    if (!title || !description || !technologies) {
      return res.status(400).json({ error: 'Title, description, and technologies are required' });
    }

    const insertProject = db.prepare(`
      INSERT INTO projects (title, description, technologies, image, githubUrl, liveUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertProject.run(
      title,
      description,
      JSON.stringify(technologies),
      image || 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      githubUrl || '',
      liveUrl || ''
    );

    const newProject = {
      id: result.lastInsertRowid,
      title,
      description,
      technologies,
      image: image || 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || ''
    };

    console.log('✅ Project created successfully:', newProject.id);
    res.json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/projects/:id - Update project
app.put('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 PUT /api/projects/${id} - Updating project`);
    const { title, description, technologies, image, githubUrl, liveUrl } = req.body;
    
    if (!title || !description || !technologies) {
      return res.status(400).json({ error: 'Title, description, and technologies are required' });
    }

    const updateProject = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, technologies = ?, image = ?, githubUrl = ?, liveUrl = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = updateProject.run(
      title,
      description,
      JSON.stringify(technologies),
      image || 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      githubUrl || '',
      liveUrl || '',
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedProject = {
      id: parseInt(id),
      title,
      description,
      technologies,
      image: image || 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || ''
    };

    console.log('✅ Project updated successfully:', id);
    res.json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/projects/:id - Delete project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/projects/${id} - Deleting project`);

    const deleteProject = db.prepare('DELETE FROM projects WHERE id = ?');
    const result = deleteProject.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('✅ Project deleted successfully:', id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/projects - Update all projects (for admin dashboard)
app.put('/api/projects', (req, res) => {
  try {
    console.log('📝 PUT /api/projects - Updating all projects');
    const { projects } = req.body;
    
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Projects must be an array' });
    }

    // Clear existing projects
    db.prepare('DELETE FROM projects').run();

    // Insert updated projects
    const insertProject = db.prepare(`
      INSERT INTO projects (title, description, technologies, image, githubUrl, liveUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    projects.forEach(project => {
      insertProject.run(
        project.title,
        project.description,
        JSON.stringify(project.technologies),
        project.image,
        project.githubUrl || '',
        project.liveUrl || ''
      );
    });

    console.log(`✅ Successfully saved ${projects.length} projects`);
    res.json({ message: 'Projects updated successfully', projects });
  } catch (error) {
    console.error('❌ Error updating projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User data operations

// GET /api/user-data - Get user data
app.get('/api/user-data', (req, res) => {
  try {
    console.log('�� GET /api/user-data - Fetching user data');
    const userData = db.prepare('SELECT * FROM user_data WHERE id = 1').get();
    
    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const formattedUserData = {
      ...userData,
      education: JSON.parse(userData.education),
      skills: JSON.parse(userData.skills),
      socialLinks: JSON.parse(userData.socialLinks)
    };

    res.json(formattedUserData);
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/user-data - Update user data
app.put('/api/user-data', (req, res) => {
  try {
    console.log('�� PUT /api/user-data - Updating user data');
    const userData = req.body;
    
    if (!userData.name || !userData.title || !userData.bio) {
      return res.status(400).json({ error: 'Name, title, and bio are required' });
    }

    const updateUserData = db.prepare(`
      UPDATE user_data 
      SET name = ?, title = ?, bio = ?, education = ?, skills = ?, socialLinks = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = 1
    `);

    updateUserData.run(
      userData.name,
      userData.title,
      userData.bio,
      JSON.stringify(userData.education),
      JSON.stringify(userData.skills),
      JSON.stringify(userData.socialLinks)
    );

    console.log('✅ User data updated successfully');
    res.json({ message: 'User data updated successfully', userData });
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Messages operations

// GET /api/messages - Get all messages
app.get('/api/messages', (req, res) => {
  try {
    console.log('📥 GET /api/messages - Fetching messages');
    const messages = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all();
    res.json(messages);
  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/messages - Add new message
app.post('/api/messages', (req, res) => {
  try {
    console.log('�� POST /api/messages - Adding message');
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const insertMessage = db.prepare(`
      INSERT INTO messages (name, email, message)
      VALUES (?, ?, ?)
    `);

    const result = insertMessage.run(name, email, message);
    const newMessage = {
      id: result.lastInsertRowid,
      name,
      email,
      message,
      isRead: false,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Message added successfully');
    res.json({ message: 'Message saved successfully', newMessage });
  } catch (error) {
    console.error('❌ Error adding message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/messages/:id/read - Mark message as read
app.put('/api/messages/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 PUT /api/messages/${id}/read - Marking message as read`);

    const updateMessage = db.prepare('UPDATE messages SET isRead = 1 WHERE id = ?');
    const result = updateMessage.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
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
    console.log('�� POST /api/upload - Uploading image');
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
  console.log(`📁 Database: ${__dirname}/portfolio.db`);
  console.log(`📁 Uploads: ${uploadsDir}`);
});
