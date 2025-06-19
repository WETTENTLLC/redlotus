# Red Lotus Admin Authentication Setup

This guide provides quick instructions for setting up the admin login functionality for the Red Lotus website.

## Quick Start

Run the following command in your project directory:

```powershell
.\setup-firebase-configured.ps1
```

This script will automatically apply the correct Firebase configuration values.

## Firebase Information

- **Your Firebase User ID**: `6vYl8pnvVrdDxOW0ywxL7qFuJGh1`
- **Firebase Project ID**: `red-lotus-cf4b4`
- **Vercel Domain**: `https://red-lotus-731yjtl8z-wettentllcs-projects.vercel.app/`

## Firebase Configuration Values

These values are already configured in the setup script:

```
VITE_FIREBASE_API_KEY=AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU
VITE_FIREBASE_AUTH_DOMAIN=red-lotus-cf4b4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=red-lotus-cf4b4
VITE_FIREBASE_STORAGE_BUCKET=gs://red-lotus-cf4b4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=211871391956
VITE_FIREBASE_APP_ID=1:211871391956:web:e701bdecd876d9f0015b41
```

## Troubleshooting

If you encounter any issues with admin login:

1. Access the diagnostics page at: `/diagnostics`
2. Check the detailed setup guide at: `/setup-guide`
3. Make sure your Firebase configuration is correct in `.env.local`

## Running the App Locally

After setting up Firebase authentication, start the development server:

```powershell
npm run dev
```

## Deployment

For deployment to Vercel, make sure to add all your Firebase environment variables in the Vercel project settings.

## Need More Help?

The diagnostics page provides tools to test your Firebase configuration and authentication setup.
