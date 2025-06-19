# Red Lotus Admin Login - Final Setup Instructions

This document provides a comprehensive guide to setting up the admin login functionality for the Red Lotus website. All the necessary scripts and configuration files have been created to make this process as simple as possible.

## Option 1: One-Click Setup (Recommended)

For the quickest setup, simply run:

```powershell
.\one-click-setup.ps1
```

This script will:
1. Configure Firebase with the correct credentials
2. Create/update your .env.local file
3. Restart the development server

## Option 2: Manual Setup

If you prefer to set things up manually:

1. Copy the following Firebase configuration to your `.env.local` file:

```
VITE_FIREBASE_API_KEY=AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU
VITE_FIREBASE_AUTH_DOMAIN=red-lotus-cf4b4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=red-lotus-cf4b4
VITE_FIREBASE_STORAGE_BUCKET=gs://red-lotus-cf4b4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=211871391956
VITE_FIREBASE_APP_ID=1:211871391956:web:e701bdecd876d9f0015b41
```

2. Restart your development server:

```powershell
npm run dev
```

## Testing the Setup

After setup, you should:

1. Run the test script to verify your configuration:

```powershell
.\test-firebase-auth.ps1
```

2. Manually test the admin login:
   - Open your site at http://localhost:5173
   - Click "Artist Admin" at the bottom of the page
   - Click "Go to Login"
   - Log in with your Firebase credentials

3. Visit the diagnostics page:
   - Go to http://localhost:5173/diagnostics
   - Verify all system checks pass

## Troubleshooting

If you encounter any issues:

1. Check the diagnostics page at /diagnostics
2. Verify the Firebase configuration in your .env.local file
3. Make sure the Firebase project exists and has Authentication enabled
4. Ensure you've added these domains to Firebase's authorized domains:
   - red-lotus-731yjtl8z-wettentllcs-projects.vercel.app
   - red-lotus-wettentllcs-projects.vercel.app
   - localhost

## For Deployment

When deploying to Vercel:

1. Add the Firebase environment variables to your Vercel project
2. Make sure the correct Firebase authorization domains are set
3. See FIREBASE_DEPLOYMENT.md for detailed deployment instructions

## Additional Resources

- For detailed setup steps: [ADMIN_LOGIN_SETUP.md](./ADMIN_LOGIN_SETUP.md)
- For deployment guide: [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md)
- For quick reference: [FIREBASE_AUTH_README.md](./FIREBASE_AUTH_README.md)

Your Firebase User ID: `6vYl8pnvVrdDxOW0ywxL7qFuJGh1`
