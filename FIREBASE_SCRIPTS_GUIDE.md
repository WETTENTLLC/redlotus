# Firebase Authentication Scripts Guide

This document explains all the scripts created to help with Firebase authentication setup and troubleshooting.

## Setup Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `one-click-setup.ps1` | Applies the correct Firebase configuration automatically and restarts the development server | For the quickest, simplest setup |
| `setup-firebase-configured.ps1` | Applies the correct Firebase configuration with prompts | When you want to customize some values |
| `setup-firebase-configured.sh` | Same as above for macOS/Linux | For macOS/Linux users |
| `configure-firebase-auth.ps1` | Interactive script with pre-filled values | For custom configuration |

## Testing Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `test-firebase-auth.ps1` | Tests if Firebase auth is correctly configured | After setup to verify everything works |
| `test-firebase-config.ps1` | Checks if .env.local has correct values | When troubleshooting configuration issues |

## Troubleshooting

For troubleshooting, you can:

1. Run diagnostics in the browser:
   ```
   http://localhost:5173/diagnostics
   ```

2. Check if your Firebase configuration is correct:
   ```powershell
   .\test-firebase-config.ps1
   ```

3. Reset to the known working configuration:
   ```powershell
   .\one-click-setup.ps1
   ```

## Deployment Scripts

For deployment to Vercel, update the environment variables:

```powershell
.\prepare-for-vercel.ps1
```

## Script Locations

All scripts are in the root directory of the project:

```
c:\Users\wette\OneDrive\Desktop\Red Lotus\
```

## Common Issues and Solutions

1. **Login not working**: Run `one-click-setup.ps1` to reset to known working configuration
2. **Firebase errors in console**: Check if all environment variables are set correctly
3. **Domain not authorized**: Add your domain to Firebase Authentication > Authorized Domains
4. **Development server issues**: Restart with `npm run dev` after configuration changes

## Firebase Configuration Values

```
VITE_FIREBASE_API_KEY=AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU
VITE_FIREBASE_AUTH_DOMAIN=red-lotus-cf4b4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=red-lotus-cf4b4
VITE_FIREBASE_STORAGE_BUCKET=gs://red-lotus-cf4b4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=211871391956
VITE_FIREBASE_APP_ID=1:211871391956:web:e701bdecd876d9f0015b41
```
