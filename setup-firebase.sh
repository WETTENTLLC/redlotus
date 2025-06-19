#!/bin/bash
# Firebase Configuration Helper Script
# This script helps set up Firebase authentication for your Red Lotus website

echo "=================================="
echo "Red Lotus Firebase Setup Assistant"
echo "=================================="
echo ""
echo "This script will help you set up Firebase authentication for your Red Lotus website."
echo "You'll need to create a Firebase project if you don't already have one."
echo ""
echo "Steps to follow:"
echo "1. Go to https://console.firebase.google.com/"
echo "2. Create a new project or select an existing one"
echo "3. Add a web app to your project (if you haven't already)"
echo "4. Copy the Firebase configuration values"
echo ""
echo "Would you like to open the Firebase console now? (y/n)"
read -r OPEN_CONSOLE

if [[ $OPEN_CONSOLE == "y" || $OPEN_CONSOLE == "Y" ]]; then
  echo "Opening Firebase console in your default browser..."
  start https://console.firebase.google.com/
fi

echo ""
echo "Please enter your Firebase configuration values below:"
echo "(These will be saved to your .env.local file)"
echo ""

echo -n "Firebase API Key: "
read -r FIREBASE_API_KEY

echo -n "Firebase Auth Domain: "
read -r FIREBASE_AUTH_DOMAIN

echo -n "Firebase Project ID: "
read -r FIREBASE_PROJECT_ID

echo -n "Firebase Storage Bucket: "
read -r FIREBASE_STORAGE_BUCKET

echo -n "Firebase Messaging Sender ID: "
read -r FIREBASE_MESSAGING_SENDER_ID

echo -n "Firebase App ID: "
read -r FIREBASE_APP_ID

# Create or update .env.local file
echo "# Firebase environment variables" > .env.local
echo "VITE_FIREBASE_API_KEY=$FIREBASE_API_KEY" >> .env.local
echo "VITE_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN" >> .env.local
echo "VITE_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID" >> .env.local
echo "VITE_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET" >> .env.local
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID" >> .env.local
echo "VITE_FIREBASE_APP_ID=$FIREBASE_APP_ID" >> .env.local

echo ""
echo "Firebase configuration has been saved to .env.local"
echo ""

echo "Would you like to create a test admin user? (y/n)"
read -r CREATE_USER

if [[ $CREATE_USER == "y" || $CREATE_USER == "Y" ]]; then
  echo "To create a test admin user, you need to:"
  echo "1. Go to Firebase console > Authentication"
  echo "2. Click 'Add user'"
  echo "3. Enter an email and password"
  echo ""
  echo "Would you like to open the Firebase Authentication page? (y/n)"
  read -r OPEN_AUTH
  
  if [[ $OPEN_AUTH == "y" || $OPEN_AUTH == "Y" ]]; then
    echo "Opening Firebase Authentication in your default browser..."
    start https://console.firebase.google.com/project/_/authentication/users
  fi
fi

echo ""
echo "Setup complete! You should now be able to use admin login functionality."
echo "Restart your development server for the changes to take effect."
echo ""
