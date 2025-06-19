# Firebase Authentication Deployment Guide

This guide will help you set up Firebase authentication for your Red Lotus website both locally and in production.

## Important Information

- **Firebase User ID**: `6vYl8pnvVrdDxOW0ywxL7qFuJGh1`
- **Authorized Domain**: `https://red-lotus-731yjtl8z-wettentllcs-projects.vercel.app/`

## Local Development Setup

### Step 1: Configure Firebase Locally

Run the Firebase configuration script:

```powershell
# Windows
.\configure-firebase-auth.ps1

# macOS/Linux
bash ./quick-setup-firebase.sh
```

This will guide you through setting up your Firebase environment variables.

### Step 2: Test Authentication Locally

1. Start your development server: `npm run dev`
2. Visit `http://localhost:5173/` in your browser
3. Click on "Artist Admin" and then "Go to Login"
4. Enter your Firebase credentials
5. If you encounter issues, visit `/diagnostics` for troubleshooting tools

## Production Deployment Setup

### Step 1: Add Firebase Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" > "Environment Variables"
3. Add the following environment variables:

| Variable Name | Value |
|---------------|-------|
| VITE_FIREBASE_API_KEY | AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU |
| VITE_FIREBASE_AUTH_DOMAIN | red-lotus-cf4b4.firebaseapp.com |
| VITE_FIREBASE_PROJECT_ID | red-lotus-cf4b4 |
| VITE_FIREBASE_STORAGE_BUCKET | gs://red-lotus-cf4b4.firebasestorage.app |
| VITE_FIREBASE_MESSAGING_SENDER_ID | 211871391956 |
| VITE_FIREBASE_APP_ID | 1:211871391956:web:e701bdecd876d9f0015b41 |

4. Make sure to select "Production" and any other environments you need
5. Click "Save"

### Step 2: Authorize Vercel Domain in Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (red-lotus-cf4b4)
3. Go to "Authentication" > "Settings" > "Authorized domains"
4. Add the following domains if they're not already there:
   - `red-lotus-731yjtl8z-wettentllcs-projects.vercel.app`
   - `red-lotus-wettentllcs-projects.vercel.app`
   - `localhost` (for local development)
5. Add your custom domain if you're using one

### Step 3: Deploy to Vercel

1. Make sure all your changes are committed to your repository
2. Push to your main branch or manually trigger a deployment in Vercel
3. Once deployment is complete, test the admin login functionality

## Troubleshooting

If you encounter authentication issues:

1. Visit `/diagnostics` on your deployed site
2. Check that all environment variables are set correctly
3. Verify that your domain is authorized in Firebase
4. Check the browser console for specific error messages

## Security Best Practices

1. Never commit your `.env.local` file to version control
2. Use environment-specific API keys for development and production
3. Set appropriate Firebase security rules for your database and storage
4. Regularly audit user accounts in Firebase Authentication

For additional help with Firebase authentication, refer to the [official Firebase documentation](https://firebase.google.com/docs/auth).
