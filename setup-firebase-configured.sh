#!/bin/bash
# One-click Firebase Authentication Setup for Red Lotus

echo "=================================================="
echo "  Red Lotus Firebase Authentication Quick Setup"
echo "=================================================="
echo ""
echo "This script will configure Firebase authentication with the correct values."
echo "Your Firebase User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1"
echo ""

# Default values from Vercel
DEFAULT_API_KEY="AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU"
DEFAULT_AUTH_DOMAIN="red-lotus-cf4b4.firebaseapp.com"
DEFAULT_PROJECT_ID="red-lotus-cf4b4"
DEFAULT_STORAGE_BUCKET="gs://red-lotus-cf4b4.firebasestorage.app"
DEFAULT_MESSAGING_SENDER_ID="211871391956"
DEFAULT_APP_ID="1:211871391956:web:e701bdecd876d9f0015b41"

# Function to get user input or use default value
get_input() {
  local prompt="$1"
  local default="$2"
  local input
  
  if [ -n "$default" ]; then
    prompt="$prompt [$default]"
  fi
  
  read -p "$prompt: " input
  
  if [ -z "$input" ] && [ -n "$default" ]; then
    echo "$default"
  else
    echo "$input"
  fi
}

echo "Using Firebase configuration values from Vercel:"
echo "(Press Enter to use the pre-filled values)"
echo ""

API_KEY=$(get_input "Firebase API Key" "$DEFAULT_API_KEY")
AUTH_DOMAIN=$(get_input "Firebase Auth Domain" "$DEFAULT_AUTH_DOMAIN")
PROJECT_ID=$(get_input "Firebase Project ID" "$DEFAULT_PROJECT_ID")
STORAGE_BUCKET=$(get_input "Firebase Storage Bucket" "$DEFAULT_STORAGE_BUCKET")
MESSAGING_SENDER_ID=$(get_input "Firebase Messaging Sender ID" "$DEFAULT_MESSAGING_SENDER_ID")
APP_ID=$(get_input "Firebase App ID" "$DEFAULT_APP_ID")

# Update .env.local with the provided values
cat > .env.local << EOL
# Firebase environment variables - Configured for Red Lotus
VITE_FIREBASE_API_KEY=${API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${APP_ID}
# User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1
EOL

echo ""
echo "Firebase configuration has been saved to .env.local"
echo ""

# Ask if the user wants to open Firebase Console
read -p "Would you like to open the Firebase Console to verify settings? (y/n): " OPEN_CONSOLE

if [[ $OPEN_CONSOLE == "y" || $OPEN_CONSOLE == "Y" ]]; then
  echo "Opening Firebase Console..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "https://console.firebase.google.com/project/${PROJECT_ID}/authentication/users"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "https://console.firebase.google.com/project/${PROJECT_ID}/authentication/users"
  else
    # Windows or other
    echo "Please open this URL in your browser:"
    echo "https://console.firebase.google.com/project/${PROJECT_ID}/authentication/users"
  fi
fi

# Reminder about authorized domains
echo ""
echo "Important: Make sure to add the following domains to your Firebase authorized domains:"
echo "1. red-lotus-731yjtl8z-wettentllcs-projects.vercel.app"
echo "2. red-lotus-wettentllcs-projects.vercel.app"
echo "3. localhost (for local development)"
echo ""
echo "Setup complete! You should now be able to use admin login functionality."
echo ""
echo "Next steps:"
echo "1. Restart your development server"
echo "2. Test the login functionality"
echo "3. If you have issues, visit /diagnostics in your browser"
echo ""
