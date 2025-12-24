# One-Click Firebase Setup for Red Lotus
# Just run this script and you're done!

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "One-Click Firebase Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Apply the pre-configured Firebase values
$envContent = @"
# Firebase environment variables - Configured for Red Lotus
VITE_FIREBASE_API_KEY=AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU
VITE_FIREBASE_AUTH_DOMAIN=red-lotus-cf4b4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=red-lotus-cf4b4
VITE_FIREBASE_STORAGE_BUCKET=gs://red-lotus-cf4b4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=211871391956
VITE_FIREBASE_APP_ID=1:211871391956:web:e701bdecd876d9f0015b41
# User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1
"@

# Write to .env.local
Set-Content -Path ".env.local" -Value $envContent

Write-Host "✓ Firebase configuration applied!" -ForegroundColor Green
Write-Host ""

# Restart the development server
Write-Host "Restarting development server..." -ForegroundColor Yellow
$npmProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($npmProcesses) {
    $npmProcesses | ForEach-Object { $_.Kill() }
}

Write-Host "Starting development server..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow

Write-Host ""
Write-Host "Setup complete! Admin login should now work." -ForegroundColor Green
Write-Host "Access the site and click 'Artist Admin' to test." -ForegroundColor White
Write-Host ""
