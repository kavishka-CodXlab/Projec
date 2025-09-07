import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from '../firebase/config';

export const imageUploadService = {
  // Upload image to Firebase Storage
  async uploadImage(file: File, folder: string = 'projects'): Promise<string> {
    try {
      console.log('🔥 Starting image upload process...');
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      // Test Firebase Storage connection
      console.log('🔥 Testing Firebase Storage connection...');
      console.log('📦 Storage instance:', storage);
      console.log('📦 Storage app:', storage.app);

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const imageRef = ref(storage, `${folder}/${fileName}`);

      console.log('📤 Uploading image:', fileName);
      console.log('📤 Image reference:', imageRef);
      
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);
      console.log('✅ Image uploaded successfully');
      console.log('📸 Snapshot:', snapshot);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('🔗 Image URL generated:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        name: (error as any)?.name,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  // Delete image from Firebase Storage
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (!pathMatch) {
        throw new Error('Invalid image URL');
      }

      const imagePath = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, imagePath);

      console.log('🗑️ Deleting image:', imagePath);
      await deleteObject(imageRef);
      console.log('✅ Image deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      throw error;
    }
  },

  // Validate image file
  validateImage(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'File must be an image' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'Image size must be less than 5MB' };
    }

    // Check file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      return { isValid: false, error: 'Only JPG, PNG, GIF, and WebP images are allowed' };
    }

    return { isValid: true };
  }
};
