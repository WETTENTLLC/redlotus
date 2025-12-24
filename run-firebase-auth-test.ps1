# Run Firebase Auth Test with Node.js
# This script installs necessary dependencies and runs the Node.js test

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Firebase Authentication Node.js Test" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if node is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed. Please install Node.js to run this test." -ForegroundColor Red
    exit 1
}

# Install required packages if not already installed
Write-Host "Installing required packages..." -ForegroundColor Yellow
npm install --no-save firebase dotenv

Write-Host ""
Write-Host "Known user accounts:" -ForegroundColor Yellow
Write-Host "- silentmediacompany@gmail.com (User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1)" -ForegroundColor White
Write-Host "- wettentertainmentllc@gmail.com (User ID: Gig3KWhFSQVZiL1heGsb9OVv4302)" -ForegroundColor White
Write-Host ""

# Get login credentials
$email = Read-Host "Enter email address to test"
$password = Read-Host "Enter password to test" -AsSecureString
$passwordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host "Running Firebase authentication test..." -ForegroundColor Cyan
node test-firebase-auth-node.js $email $passwordText

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Green
