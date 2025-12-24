import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export const testFirebaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Try to add a test document to verify connection
    const testDoc = await addDoc(collection(db, 'connection-test'), {
      timestamp: new Date(),
      test: true
    });
    
    console.log('Firebase connection test successful:', testDoc.id);
    return { success: true };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const validateEnvironmentVariables = (): { valid: boolean; missing: string[] } => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  return {
    valid: missing.length === 0,
    missing
  };
};