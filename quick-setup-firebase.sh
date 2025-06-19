#!/bin/bash
# One-click Firebase Authentication Setup for Red Lotus

echo "=================================================="
echo "  Red Lotus Firebase Authentication Quick Setup"
echo "=================================================="
echo ""
echo "This script will perform all necessary steps to configure Firebase authentication."
echo "Your Firebase User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1"
echo ""

# Check if required files exist
if [ ! -f ".env.local" ]; then
  echo "Creating initial .env.local file..."
  cat > .env.local << EOL
# Firebase environment variables
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=red-lotus-731yjtl8z-wettentllcs-projects.vercel.app
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
# User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1
EOL
fi

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

echo "Please enter your Firebase configuration details:"
echo "(Press Enter to use the suggested value where available)"

API_KEY=$(get_input "Firebase API Key" "")
AUTH_DOMAIN=$(get_input "Firebase Auth Domain" "red-lotus-731yjtl8z-wettentllcs-projects.vercel.app")
PROJECT_ID=$(get_input "Firebase Project ID" "red-lotus")
STORAGE_BUCKET=$(get_input "Firebase Storage Bucket" "${PROJECT_ID}.appspot.com")
MESSAGING_SENDER_ID=$(get_input "Firebase Messaging Sender ID" "")
APP_ID=$(get_input "Firebase App ID" "")

# Update .env.local with the provided values
cat > .env.local << EOL
# Firebase environment variables
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

echo ""
echo "Setup complete! You should now be able to use admin login functionality."
echo "Remember to add ${AUTH_DOMAIN} to your Firebase authorized domains."
echo ""
echo "Next steps:"
echo "1. Restart your development server"
echo "2. Test the login functionality"
echo "3. If you have issues, visit /diagnostics in your browser"
echo ""
