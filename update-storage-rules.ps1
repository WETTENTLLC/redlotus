# Firebase Storage Rules Update Script
# Run this from the project root directory

Write-Host "Updating Firebase Storage Security Rules..." -ForegroundColor Green

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
    Write-Host "Firebase CLI detected" -ForegroundColor Green
} catch {
    Write-Host "Error: Firebase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g firebase-tools"
    exit 1
}

# Login to Firebase (if not already logged in)
Write-Host "Checking Firebase authentication..." -ForegroundColor Yellow
firebase login --no-localhost

# Deploy storage rules
Write-Host "Deploying storage security rules..." -ForegroundColor Yellow
firebase deploy --only storage

Write-Host "Storage rules updated successfully!" -ForegroundColor Green
Write-Host "The following permissions are now active:" -ForegroundColor Cyan
Write-Host "- Music uploads: Admin only" -ForegroundColor White
Write-Host "- Music downloads: Public access" -ForegroundColor White
Write-Host "- Image uploads: Admin only" -ForegroundColor White
Write-Host "- Video uploads: Admin only" -ForegroundColor White
Write-Host "- Fan art uploads: Authenticated users" -ForegroundColor White
