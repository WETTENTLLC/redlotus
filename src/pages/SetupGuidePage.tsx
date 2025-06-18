import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

// Import the content directly
const markdownContent = `# Red Lotus Admin Login Setup Guide

This guide will help you set up the admin login functionality for your Red Lotus website. The login issue is related to missing Firebase configuration.

## Important Information

- **Firebase User ID**: \`6vYl8pnvVrdDxOW0ywxL7qFuJGh1\`
- **Authorized Domain**: \`https://red-lotus-731yjtl8z-wettentllcs-projects.vercel.app/\`

## Problem

The admin login functionality is not working because:

1. The Firebase configuration in the \`.env.local\` file is empty
2. This prevents the authentication system from connecting to Firebase
3. Without proper Firebase configuration, users cannot log in to the admin dashboard

## Solution

Follow these steps to fix the admin login functionality:

### Step 1: Create a Firebase Project (if you don't have one)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the prompts to set up your project
4. Make sure to enable Google Analytics (recommended)

### Step 2: Register Your Web App

1. In your Firebase project dashboard, click the </> (Web) icon to add a web app
2. Enter a nickname for your app (e.g., "Red Lotus Website")
3. Check "Also set up Firebase Hosting" if you plan to use it
4. Click "Register app"
5. You'll see a configuration object that looks like this:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
\`\`\`

6. Keep this information handy - you'll need it in the next step

### Step 3: Enable Email/Password Authentication

1. In the Firebase console, go to "Authentication" > "Sign-in method"
2. Click on "Email/Password"
3. Toggle the "Enable" switch to ON
4. Click "Save"

### Step 4: Create an Admin User

1. In the Firebase console, go to "Authentication" > "Users"
2. Click "Add user"
3. Enter an email and password for your admin user
4. Click "Add user"

### Step 5: Configure Your Local Environment

#### Option 1: Use the Setup Script (Recommended)

1. Run the setup script in your project directory:
   - Windows: \`.\setup-firebase.ps1\`
   - Mac/Linux: \`bash setup-firebase.sh\`
2. Follow the prompts to enter your Firebase configuration values

#### Option 2: Manual Configuration

1. Open the \`.env.local\` file in your project directory
2. Add your Firebase configuration values:

\`\`\`
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
\`\`\`

### Step 6: Restart Your Development Server

1. Stop your development server if it's running
2. Start it again with \`npm run dev\` or \`yarn dev\`

### Step 7: Test the Admin Login

1. Go to your website's homepage
2. Click the "Artist Admin" button at the bottom of the page
3. Click "Go to Login"
4. Enter the email and password you created in Step 4
5. You should now be logged in to the admin dashboard

## Troubleshooting

If you're still having issues with the admin login:

1. Check the browser console for any errors
2. Verify that all environment variables are set correctly in \`.env.local\`
3. Make sure you've enabled Email/Password authentication in Firebase
4. Confirm that you've created a user in Firebase Authentication

For additional help, you can use the built-in diagnostics tool that runs automatically in development mode. Check your browser console for diagnostic information.

## Security Notes

1. Never commit your \`.env.local\` file to version control
2. Make sure \`.env.local\` is listed in your \`.gitignore\` file
3. For production, set these environment variables in your hosting platform (e.g., Vercel)

By following these steps, you should have a working admin login system for your Red Lotus website.`;

const SetupGuidePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-red-lotus">Admin Login Setup Guide</h1>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/diagnostics')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Go to Diagnostics
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="markdown-content prose prose-red max-w-none">
              <Markdown>{markdownContent || ''}</Markdown>
            </div>          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupGuidePage;
