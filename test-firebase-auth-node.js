// Firebase Authentication Direct Test
// This script tests Firebase authentication directly using Node.js

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase Configuration:');
console.log(JSON.stringify({
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...${firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 5)}` : 'MISSING',
  authDomain: firebaseConfig.authDomain || 'MISSING',
  projectId: firebaseConfig.projectId || 'MISSING',
  storageBucket: firebaseConfig.storageBucket || 'MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId || 'MISSING',
  appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 5)}...${firebaseConfig.appId.substring(firebaseConfig.appId.length - 5)}` : 'MISSING'
}, null, 2));

// Check if required values are present
const missingValues = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value || value === 'undefined')
  .map(([key]) => key);

if (missingValues.length > 0) {
  console.error(`\nMissing configuration values: ${missingValues.join(', ')}`);
  console.error('Please check your .env.local file');
  process.exit(1);
}

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  console.log('\nFirebase initialized successfully');
  
  const auth = getAuth(app);
  console.log('Auth service initialized successfully');
  
  // Get email and password from command line arguments
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.log('\nUsage: node test-firebase-auth-node.js <email> <password>');
    console.log('\nKnown user accounts:');
    console.log('- silentmediacompany@gmail.com (User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1)');
    console.log('- wettentertainmentllc@gmail.com (User ID: Gig3KWhFSQVZiL1heGsb9OVv4302)');
    process.exit(1);
  }
  
  console.log(`\nAttempting to sign in with email: ${email}`);
  
  // Attempt sign-in
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('\n✓ Authentication successful!');
      console.log(`User ID: ${user.uid}`);
      console.log(`Email: ${user.email}`);
      console.log(`Display Name: ${user.displayName || 'Not set'}`);
      console.log(`Email Verified: ${user.emailVerified}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n✗ Authentication failed!');
      console.error(`Error code: ${error.code}`);
      console.error(`Error message: ${error.message}`);
      
      // Show helpful troubleshooting tips based on error code
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check if you\'re using the correct email address');
        console.log('2. Verify that the user exists in Firebase Authentication');
        console.log('3. If you recently exported/imported users, passwords might need to be reset');
      } else if (error.code === 'auth/wrong-password') {
        console.log('\nTroubleshooting tips:');
        console.log('1. Make sure you\'re using the correct password');
        console.log('2. Check if caps lock is enabled');
        console.log('3. Consider resetting your password if you\'ve forgotten it');
      } else if (error.code === 'auth/network-request-failed') {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check your internet connection');
        console.log('2. Verify that your Firebase project is active');
        console.log('3. Make sure your API key is correct and not restricted');
      }
      
      process.exit(1);
    });
  
} catch (error) {
  console.error('\nFailed to initialize Firebase:');
  console.error(error);
  process.exit(1);
}
