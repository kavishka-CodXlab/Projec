import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
// Replace these values with your NEW Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLYfWMrYnLOXY9opE_IqXfBZrJsUqj7gQ",
  authDomain: "my-portfolio-51ea3.firebaseapp.com",
  projectId: "my-portfolio-51ea3",
  storageBucket: "my-portfolio-51ea3.firebasestorage.app",
  messagingSenderId: "886954305646",
  appId: "1:886954305646:web:208b2b0827f57441a4de7f"
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Firebase configuration is missing. Please check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Connect to emulators in development (optional)
if (import.meta.env.DEV) {
  // Uncomment these lines if you want to use Firebase emulators for development
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export default app;
