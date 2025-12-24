# Firebase Configuration Test Script
# This script checks if the Firebase authentication is working

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Firebase Authentication Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists and has the correct values
if (-not (Test-Path ".env.local")) {
    Write-Host "Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Running one-click setup to create it..." -ForegroundColor Yellow
    & .\one-click-setup.ps1
}
else {
    $envContent = Get-Content ".env.local" -Raw
    
    # Expected values
    $expectedApiKey = "AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU"
    $expectedAuthDomain = "red-lotus-cf4b4.firebaseapp.com"
    $expectedProjectId = "red-lotus-cf4b4"
    
    # Check if values match
    $apiKeyCorrect = $envContent -match "VITE_FIREBASE_API_KEY=$expectedApiKey"
    $authDomainCorrect = $envContent -match "VITE_FIREBASE_AUTH_DOMAIN=$expectedAuthDomain"
    $projectIdCorrect = $envContent -match "VITE_FIREBASE_PROJECT_ID=$expectedProjectId"
    
    if (-not ($apiKeyCorrect -and $authDomainCorrect -and $projectIdCorrect)) {
        Write-Host "Warning: Firebase configuration in .env.local doesn't match expected values." -ForegroundColor Yellow
        Write-Host "Running one-click setup to fix it..." -ForegroundColor Yellow
        & .\one-click-setup.ps1
    }
    else {
        Write-Host "✓ Firebase configuration in .env.local is correct!" -ForegroundColor Green
    }
}

# Open the diagnostics page to further test authentication
Write-Host ""
Write-Host "Opening diagnostics page to test Firebase connection..." -ForegroundColor Cyan
Start-Process "http://localhost:5173/diagnostics"

Write-Host ""
Write-Host "Performing additional checks:" -ForegroundColor Yellow
Write-Host "1. Verify that you can see your Firebase User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1" -ForegroundColor White
Write-Host "2. Check that all system checks pass on the diagnostics page" -ForegroundColor White
Write-Host "3. Try the test login functionality with your Firebase credentials" -ForegroundColor White
Write-Host ""
Write-Host "If all tests pass, your Firebase authentication is working correctly!" -ForegroundColor Green
Write-Host ""
