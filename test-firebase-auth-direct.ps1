# Test Firebase Authentication
# This script tests Firebase Authentication directly using Firebase SDK

$ErrorActionPreference = "Stop"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Firebase Authentication Tester" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Create a temporary test file
$testFilePath = ".\firebase-auth-test-temp.js"

Write-Host "Creating temporary test file..." -ForegroundColor Yellow

# Content for the test file
$testFileContent = @"
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from .env.local
if (fs.existsSync('.env.local')) {
  console.log('Loading environment variables from .env.local');
  dotenv.config({ path: '.env.local' });
} else {
  console.log('No .env.local file found');
  process.exit(1);
}

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
console.log(JSON.stringify(firebaseConfig, null, 2));

// Check if config values are valid
let isConfigValid = true;
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value || value === 'undefined') {
    console.log(`Error: ${key} is missing or invalid`);
    isConfigValid = false;
  }
});

if (!isConfigValid) {
  console.log('Firebase configuration is invalid. Please check your .env.local file.');
  process.exit(1);
}

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  const auth = getAuth(app);
  console.log('Auth service initialized successfully');
  
  // Try to sign in with provided credentials
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.log('Usage: node firebase-auth-test-temp.js <email> <password>');
    process.exit(1);
  }
  
  console.log(`Attempting to sign in with email: ${email}`);
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('Authentication successful!');
      console.log(`User ID: ${user.uid}`);
      console.log(`Email: ${user.email}`);
      process.exit(0);
    })
    .catch((error) => {
      console.log('Authentication failed!');
      console.log(`Error code: ${error.code}`);
      console.log(`Error message: ${error.message}`);
      process.exit(1);
    });
} catch (error) {
  console.log('Failed to initialize Firebase:');
  console.log(error);
  process.exit(1);
}
"@

$testFileContent | Out-File -FilePath $testFilePath -Encoding utf8

Write-Host "Installing necessary npm packages..." -ForegroundColor Yellow
npm install -g firebase dotenv

$email = Read-Host "Enter email address to test"
$password = Read-Host "Enter password to test" -AsSecureString
$passwordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host "Running Firebase authentication test..." -ForegroundColor Cyan
node $testFilePath $email $passwordText

# Clean up
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item -Path $testFilePath

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Green
