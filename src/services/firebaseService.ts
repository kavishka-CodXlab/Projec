import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Project, ContactMessage, UserData } from '../types';
import { imageUploadService } from './imageUploadService';

// Collections
const PROJECTS_COLLECTION = 'projects';
const MESSAGES_COLLECTION = 'messages';
const USER_DATA_COLLECTION = 'userData';

// Projects Service
export const projectsService = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    try {
      const projectsRef = collection(db, PROJECTS_COLLECTION);
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },

  // Listen to projects changes (real-time)
  subscribeToProjects(callback: (projects: Project[]) => void) {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      callback(projects);
    });
  },

  // Add a new project
  async addProject(project: Omit<Project, 'id'>): Promise<string> {
    try {
      const projectsRef = collection(db, PROJECTS_COLLECTION);
      const docRef = await addDoc(projectsRef, {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },

  // Add a new project with image upload
  async addProjectWithImage(projectData: Omit<Project, 'id' | 'image'>, imageFile: File): Promise<string> {
    try {
      console.log('🚀 Adding project with image upload...');
      
      // Validate image
      const validation = imageUploadService.validateImage(imageFile);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Upload image to Firebase Storage
      const imageUrl = await imageUploadService.uploadImage(imageFile, 'projects');
      
      // Create project with image URL
      const project: Omit<Project, 'id'> = {
        ...projectData,
        image: imageUrl
      };

      // Save project to Firestore
      const projectId = await this.addProject(project);
      
      console.log('✅ Project added successfully with image:', projectId);
      return projectId;
    } catch (error) {
      console.error('❌ Error adding project with image:', error);
      throw error;
    }
  },

  // Update a project
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      const projectRef = doc(db, PROJECTS_COLLECTION, id);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Update a project with image upload
  async updateProjectWithImage(id: string, updates: Partial<Project>, imageFile?: File): Promise<void> {
    try {
      console.log('🔄 Updating project with image...');
      
      let imageUrl = updates.image;
      
      // If new image file is provided, upload it
      if (imageFile) {
        // Validate image
        const validation = imageUploadService.validateImage(imageFile);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        // Upload new image
        imageUrl = await imageUploadService.uploadImage(imageFile, 'projects');
        
        // If there was an old image, delete it
        if (updates.image && updates.image !== imageUrl) {
          try {
            await imageUploadService.deleteImage(updates.image);
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
      }

      // Update project with new data and image URL
      await this.updateProject(id, {
        ...updates,
        image: imageUrl
      });
      
      console.log('✅ Project updated successfully');
    } catch (error) {
      console.error('❌ Error updating project with image:', error);
      throw error;
    }
  },

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    try {
      const projectRef = doc(db, PROJECTS_COLLECTION, id);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Delete a project and its image
  async deleteProjectWithImage(project: Project): Promise<void> {
    try {
      console.log('🗑️ Deleting project and image...');
      
      // Delete the image from Storage if it exists
      if (project.image) {
        try {
          await imageUploadService.deleteImage(project.image);
        } catch (deleteError) {
          console.warn('Could not delete project image:', deleteError);
        }
      }

      // Delete the project from Firestore
      await this.deleteProject(project.id);
      
      console.log('✅ Project and image deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting project with image:', error);
      throw error;
    }
  },

  // Update multiple projects (for reordering)
  async updateProjects(projects: Project[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      projects.forEach((project, index) => {
        const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
        batch.update(projectRef, {
          order: index,
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error updating projects:', error);
      throw error;
    }
  }
};

// Messages Service
export const messagesService = {
  // Get all messages
  async getMessages(): Promise<ContactMessage[]> {
    try {
      const messagesRef = collection(db, MESSAGES_COLLECTION);
      const q = query(messagesRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date()
        } as ContactMessage;
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Listen to messages changes (real-time)
  subscribeToMessages(callback: (messages: ContactMessage[]) => void) {
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date()
        } as ContactMessage;
      });
      callback(messages);
    });
  },

  // Add a new message
  async addMessage(message: Omit<ContactMessage, 'id' | 'timestamp' | 'isRead'>): Promise<string> {
    try {
      const messagesRef = collection(db, MESSAGES_COLLECTION);
      const docRef = await addDoc(messagesRef, {
        ...message,
        timestamp: serverTimestamp(),
        isRead: false,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Mark message as read
  async markAsRead(id: string): Promise<void> {
    try {
      const messageRef = doc(db, MESSAGES_COLLECTION, id);
      await updateDoc(messageRef, {
        isRead: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};

// User Data Service
export const userDataService = {
  // Get user data
  async getUserData(): Promise<UserData | null> {
    try {
      const userDataRef = doc(db, USER_DATA_COLLECTION, 'profile');
      const snapshot = await getDoc(userDataRef);
      
      if (snapshot.exists()) {
        return snapshot.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  },

  // Listen to user data changes (real-time)
  subscribeToUserData(callback: (userData: UserData | null) => void) {
    const userDataRef = doc(db, USER_DATA_COLLECTION, 'profile');
    
    return onSnapshot(userDataRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as UserData);
      } else {
        callback(null);
      }
    });
  },

  // Update user data
  async updateUserData(userData: UserData): Promise<void> {
    try {
      const userDataRef = doc(db, USER_DATA_COLLECTION, 'profile');
      await updateDoc(userDataRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },

  // Create initial user data
  async createUserData(userData: UserData): Promise<void> {
    try {
      const userDataRef = doc(db, USER_DATA_COLLECTION, 'profile');
      await updateDoc(userDataRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user data:', error);
      throw error;
    }
  }
};
