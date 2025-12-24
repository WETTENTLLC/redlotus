# Quick Firebase Auth Test Script
# This script helps diagnose Firebase auth issues by directly testing the configuration

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Firebase Authentication Quick Test" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
$envFile = ".\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env.local file not found!" -ForegroundColor Red
    exit 1
}

# Read environment variables
$envContent = Get-Content $envFile -Raw

# Check if essential Firebase config is present
$apiKey = [regex]::Match($envContent, 'VITE_FIREBASE_API_KEY=(.+)').Groups[1].Value
$authDomain = [regex]::Match($envContent, 'VITE_FIREBASE_AUTH_DOMAIN=(.+)').Groups[1].Value
$projectId = [regex]::Match($envContent, 'VITE_FIREBASE_PROJECT_ID=(.+)').Groups[1].Value

# Create test HTML file
$testHtmlPath = ".\firebase-auth-test.html"
$testHtml = @"
<!DOCTYPE html>
<html>
<head>
  <title>Firebase Auth Test</title>
  <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"></script>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .result { margin: 10px 0; padding: 10px; border-radius: 4px; }
    .success { background-color: #d4edda; color: #155724; }
    .error { background-color: #f8d7da; color: #721c24; }
    .info { background-color: #d1ecf1; color: #0c5460; }
    input, button { margin: 10px 0; padding: 8px; width: 100%; }
    button { background-color: #007bff; color: white; border: none; cursor: pointer; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Firebase Authentication Test</h1>
  <div id="config-display" class="info">Loading configuration...</div>
  
  <h2>Test Login</h2>
  <div>
    <input type="email" id="email" placeholder="Email" />
    <input type="password" id="password" placeholder="Password" />
    <button id="login-btn">Test Login</button>
  </div>
  
  <div id="result"></div>
  
  <script>
    // Display Firebase configuration
    const configDisplay = document.getElementById('config-display');
    const resultDisplay = document.getElementById('result');
    
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "$apiKey",
      authDomain: "$authDomain",
      projectId: "$projectId"
    };
    
    // Display config (with API key partially hidden)
    const displayApiKey = firebaseConfig.apiKey ? 
      firebaseConfig.apiKey.substring(0, 5) + '...' + firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 5) : 
      'Missing';
    
    configDisplay.innerHTML = `
      <strong>Firebase Configuration:</strong><br>
      API Key: ${displayApiKey}<br>
      Auth Domain: ${firebaseConfig.authDomain || 'Missing'}<br>
      Project ID: ${firebaseConfig.projectId || 'Missing'}<br>
    `;
    
    // Initialize Firebase
    try {
      firebase.initializeApp(firebaseConfig);
      addResult('Firebase initialized successfully', 'success');
    } catch (error) {
      addResult('Failed to initialize Firebase: ' + error.message, 'error');
    }
    
    // Login function
    document.getElementById('login-btn').addEventListener('click', function() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        addResult('Please enter both email and password', 'error');
        return;
      }
      
      addResult('Attempting to sign in...', 'info');
      
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          addResult(`Successfully logged in as ${user.email} (${user.uid})`, 'success');
        })
        .catch((error) => {
          addResult(`Login failed: ${error.code} - ${error.message}`, 'error');
        });
    });
    
    // Helper to add result messages
    function addResult(message, type) {
      const resultElement = document.createElement('div');
      resultElement.className = `result ${type}`;
      resultElement.textContent = message;
      resultDisplay.appendChild(resultElement);
    }
  </script>
</body>
</html>
"@

$testHtml | Out-File -FilePath $testHtmlPath -Encoding utf8

Write-Host "Firebase configuration from .env.local:" -ForegroundColor Yellow
Write-Host "API Key: $apiKey" -ForegroundColor Gray
Write-Host "Auth Domain: $authDomain" -ForegroundColor Gray
Write-Host "Project ID: $projectId" -ForegroundColor Gray
Write-Host ""

Write-Host "Test HTML file created at $testHtmlPath" -ForegroundColor Green
Write-Host "Opening the test page in your default browser..." -ForegroundColor Yellow

# Open the HTML file in the default browser
Start-Process $testHtmlPath

Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "1. Use the test page to sign in with your Firebase credentials" -ForegroundColor White
Write-Host "2. The page will show if authentication is successful" -ForegroundColor White
Write-Host "3. If you encounter errors, check the error message for details" -ForegroundColor White
Write-Host ""
Write-Host "Known user accounts:" -ForegroundColor Yellow
Write-Host "- silentmediacompany@gmail.com (User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1)" -ForegroundColor White
Write-Host "- wettentertainmentllc@gmail.com (User ID: Gig3KWhFSQVZiL1heGsb9OVv4302)" -ForegroundColor White
Write-Host ""

# Ask to open diagnostics page
$openDiagnostics = Read-Host "Would you like to open the app's diagnostics page? (y/n)"
if ($openDiagnostics -eq 'y') {
    Start-Process "http://localhost:5173/diagnostics"
}
