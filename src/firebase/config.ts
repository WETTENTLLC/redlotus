import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { EnvironmentService } from '../config/EnvironmentService';

// Initialize environment configuration
const envConfig = EnvironmentService.initialize();

// Firebase configuration from environment service
const firebaseConfig = envConfig.firebase;

// Validate configuration in development
if (EnvironmentService.isDevelopment()) {
  const validation = EnvironmentService.validateConfiguration();
  if (!validation.isValid) {
    console.error('Firebase configuration errors:', validation.errors);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth, envConfig };
