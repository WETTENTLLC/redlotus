# Firebase Configuration Tester
# This script tests if your Firebase configuration is correctly set up

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Red Lotus Firebase Config Tester" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please run setup-firebase.ps1 first to create your Firebase configuration." -ForegroundColor Yellow
    exit 1
}

# Read the .env.local file
$envContent = Get-Content ".env.local" -Raw

# Check each required Firebase variable
$requiredVars = @(
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID"
)

$missingVars = @()
$emptyVars = @()

foreach ($var in $requiredVars) {
    if ($envContent -notmatch "$var=") {
        $missingVars += $var
    } elseif ($envContent -match "$var=\s*$") {
        $emptyVars += $var
    }
}

if ($missingVars.Count -gt 0 -or $emptyVars.Count -gt 0) {
    Write-Host "Firebase Configuration Issues Detected!" -ForegroundColor Red
    Write-Host ""
    
    if ($missingVars.Count -gt 0) {
        Write-Host "Missing variables:" -ForegroundColor Yellow
        foreach ($var in $missingVars) {
            Write-Host "  - $var" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    if ($emptyVars.Count -gt 0) {
        Write-Host "Empty variables:" -ForegroundColor Yellow
        foreach ($var in $emptyVars) {
            Write-Host "  - $var" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    Write-Host "Would you like to run the Firebase setup script now? (y/n)"
    $runSetup = Read-Host
    
    if ($runSetup -eq "y" -or $runSetup -eq "Y") {
        Write-Host "Running Firebase setup script..." -ForegroundColor Green
        & .\configure-firebase-auth.ps1
        exit 0
    } else {
        Write-Host "Please run configure-firebase-auth.ps1 to set up your Firebase configuration." -ForegroundColor Yellow
        exit 1
    }
}

# Verify known values
$authDomain = if ($envContent -match "VITE_FIREBASE_AUTH_DOMAIN=(.+)") { $matches[1] } else { "" }
$expectedDomain = "red-lotus-731yjtl8z-wettentllcs-projects.vercel.app"

if ($authDomain -and ($authDomain -ne $expectedDomain)) {
    Write-Host "Warning: Auth domain mismatch!" -ForegroundColor Yellow
    Write-Host "  Expected: $expectedDomain" -ForegroundColor Yellow
    Write-Host "  Found: $authDomain" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This may cause authentication issues. Would you like to update it? (y/n)"
    $updateDomain = Read-Host
    
    if ($updateDomain -eq "y" -or $updateDomain -eq "Y") {
        $envContent = $envContent -replace "VITE_FIREBASE_AUTH_DOMAIN=.+", "VITE_FIREBASE_AUTH_DOMAIN=$expectedDomain"
        Set-Content -Path ".env.local" -Value $envContent
        Write-Host "Auth domain updated to $expectedDomain" -ForegroundColor Green
    }
}

# All checks passed
Write-Host "Firebase Configuration Test: SUCCESS" -ForegroundColor Green
Write-Host "Your Firebase configuration appears to be correctly set up." -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure you've added '$expectedDomain' to your Firebase authorized domains" -ForegroundColor White
Write-Host "2. Verify your admin user account is set up in Firebase Authentication" -ForegroundColor White
Write-Host "3. Test the login at /login or through the Admin button on the site" -ForegroundColor White
Write-Host ""
Write-Host "Your Firebase User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1" -ForegroundColor Magenta
Write-Host ""
