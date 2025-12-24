# Firebase Configuration Helper Script for Windows
# This script helps set up Firebase authentication for your Red Lotus website

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Red Lotus Firebase Setup Assistant" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will help you set up Firebase authentication for your Red Lotus website."
Write-Host "You'll need to create a Firebase project if you don't already have one."
Write-Host ""
Write-Host "Steps to follow:" -ForegroundColor Yellow
Write-Host "1. Go to https://console.firebase.google.com/"
Write-Host "2. Create a new project or select an existing one"
Write-Host "3. Add a web app to your project (if you haven't already)"
Write-Host "4. Copy the Firebase configuration values"
Write-Host ""
$openConsole = Read-Host "Would you like to open the Firebase console now? (y/n)"

if ($openConsole -eq "y" -or $openConsole -eq "Y") {
    Write-Host "Opening Firebase console in your default browser..." -ForegroundColor Green
    Start-Process "https://console.firebase.google.com/"
}

Write-Host ""
Write-Host "Please enter your Firebase configuration values below:" -ForegroundColor Yellow
Write-Host "(These will be saved to your .env.local file)"
Write-Host ""

$firebaseApiKey = Read-Host "Firebase API Key"
$firebaseAuthDomain = Read-Host "Firebase Auth Domain"
$firebaseProjectId = Read-Host "Firebase Project ID"
$firebaseStorageBucket = Read-Host "Firebase Storage Bucket"
$firebaseMessagingSenderId = Read-Host "Firebase Messaging Sender ID"
$firebaseAppId = Read-Host "Firebase App ID"

# Create or update .env.local file
$envContent = @"
# Firebase environment variables
VITE_FIREBASE_API_KEY=$firebaseApiKey
VITE_FIREBASE_AUTH_DOMAIN=$firebaseAuthDomain
VITE_FIREBASE_PROJECT_ID=$firebaseProjectId
VITE_FIREBASE_STORAGE_BUCKET=$firebaseStorageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$firebaseMessagingSenderId
VITE_FIREBASE_APP_ID=$firebaseAppId
"@

# Write to .env.local
Set-Content -Path ".env.local" -Value $envContent

Write-Host ""
Write-Host "Firebase configuration has been saved to .env.local" -ForegroundColor Green
Write-Host ""

$createUser = Read-Host "Would you like to create a test admin user? (y/n)"

if ($createUser -eq "y" -or $createUser -eq "Y") {
    Write-Host "To create a test admin user, you need to:" -ForegroundColor Yellow
    Write-Host "1. Go to Firebase console > Authentication"
    Write-Host "2. Enable Email/Password authentication method if not already enabled"
    Write-Host "3. Click 'Add user'"
    Write-Host "4. Enter an email and password"
    Write-Host ""
    $openAuth = Read-Host "Would you like to open the Firebase Authentication page? (y/n)"
    
    if ($openAuth -eq "y" -or $openAuth -eq "Y") {
        Write-Host "Opening Firebase Authentication in your default browser..." -ForegroundColor Green
        Start-Process "https://console.firebase.google.com/project/_/authentication/users"
    }
}

Write-Host ""
Write-Host "Setup complete! You should now be able to use admin login functionality." -ForegroundColor Green
Write-Host "Restart your development server for the changes to take effect."
Write-Host ""

# Check if we need to enable authentication
$enableAuth = Read-Host "Do you need to enable Email/Password authentication in Firebase? (y/n)"

if ($enableAuth -eq "y" -or $enableAuth -eq "Y") {
    Write-Host "Opening Firebase Authentication providers page..." -ForegroundColor Green
    Start-Process "https://console.firebase.google.com/project/_/authentication/providers"
    Write-Host "Make sure to enable the Email/Password authentication method!"
}

Write-Host ""
Write-Host "For security purposes, make sure your .env.local file is in .gitignore!" -ForegroundColor Yellow
Write-Host ""
