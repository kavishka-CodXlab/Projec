import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file
const db = new Database(path.join(__dirname, 'portfolio.db'));

// Initialize database with tables
const initDatabase = () => {
  console.log('🔧 Initializing database...');

  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL,
      image TEXT NOT NULL,
      githubUrl TEXT,
      liveUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      bio TEXT NOT NULL,
      education TEXT NOT NULL,
      skills TEXT NOT NULL,
      socialLinks TEXT NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      isRead BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database tables created successfully');
};

// Seed database with default data
const seedDatabase = () => {
  console.log('🌱 Seeding database with default data...');

  // Check if projects table is empty
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  
  if (projectCount.count === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (title, description, technologies, image, githubUrl, liveUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const defaultProjects = [
      [
        'E-Commerce Platform',
        'A full-stack e-commerce solution with user authentication, product management, and payment integration.',
        JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB', 'Stripe']),
        'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
        'https://github.com/kavishka-CodXlab',
        'https://example.com'
      ],
      [
        'Task Management App',
        'A collaborative task management application with real-time updates and team collaboration features.',
        JSON.stringify(['React', 'TypeScript', 'Firebase', 'Material-UI']),
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        'https://github.com/kavishka-CodXlab',
        'https://example.com'
      ],
      [
        'AI Medical Chatbot',
        'Developed an intelligent chatbot to assist users with basic medical queries and symptom guidance.',
        JSON.stringify(['Python 3.6+', 'Langchain', 'FAISS', 'Chainlit', 'PyPDF2', 'Git']),
        'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
        'https://github.com/kavishka-CodXlab/medbot-2.0',
        'https://example.com'
      ]
    ];

    defaultProjects.forEach(project => {
      insertProject.run(...project);
    });

    console.log('✅ Default projects added');
  }

  // Check if user_data table is empty
  const userDataCount = db.prepare('SELECT COUNT(*) as count FROM user_data').get();
  
  if (userDataCount.count === 0) {
    const insertUserData = db.prepare(`
      INSERT INTO user_data (name, title, bio, education, skills, socialLinks)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

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

    insertUserData.run(
      defaultUserData.name,
      defaultUserData.title,
      defaultUserData.bio,
      JSON.stringify(defaultUserData.education),
      JSON.stringify(defaultUserData.skills),
      JSON.stringify(defaultUserData.socialLinks)
    );

    console.log('✅ Default user data added');
  }

  console.log('✅ Database seeded successfully');
};

// Initialize database
initDatabase();
seedDatabase();

export default db;
