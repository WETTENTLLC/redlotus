# Check and fix Firebase environment variables
# This script ensures that the Firebase configuration in .env.local is correct

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Firebase Environment Configuration Check" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".\.env.local"
$correctConfig = @{
    "VITE_FIREBASE_API_KEY" = "AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU"
    "VITE_FIREBASE_AUTH_DOMAIN" = "red-lotus-cf4b4.firebaseapp.com"
    "VITE_FIREBASE_PROJECT_ID" = "red-lotus-cf4b4"
    "VITE_FIREBASE_STORAGE_BUCKET" = "gs://red-lotus-cf4b4.firebasestorage.app"
    "VITE_FIREBASE_MESSAGING_SENDER_ID" = "211871391956"
    "VITE_FIREBASE_APP_ID" = "1:211871391956:web:e701bdecd876d9f0015b41"
}

function Get-EnvValue {
    param (
        [string]$content,
        [string]$key
    )
    
    $match = [regex]::Match($content, "$key=(.+)")
    if ($match.Success) {
        return $match.Groups[1].Value
    }
    return $null
}

# Check if .env.local exists
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env.local file not found. Creating it now..." -ForegroundColor Yellow
    
    $newEnvContent = @"
# filepath: .env.local
# Firebase environment variables - Configured for Red Lotus
VITE_FIREBASE_API_KEY=AIzaSyD6v_yDbP-Y58jVFpMr0wn4vEdjW77SXjU
VITE_FIREBASE_AUTH_DOMAIN=red-lotus-cf4b4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=red-lotus-cf4b4
VITE_FIREBASE_STORAGE_BUCKET=gs://red-lotus-cf4b4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=211871391956
VITE_FIREBASE_APP_ID=1:211871391956:web:e701bdecd876d9f0015b41
# User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1

# PayPal Configuration - For development use sandbox, for production use live client ID
VITE_PAYPAL_CLIENT_ID=sb
"@
    
    $newEnvContent | Out-File -FilePath $envFile -Encoding utf8
    Write-Host ".env.local file created with correct Firebase configuration" -ForegroundColor Green
} else {
    # Read environment file
    $envContent = Get-Content $envFile -Raw
    $needsFix = $false
    $missingVars = @()
    $incorrectVars = @()
    
    # Check each configuration value
    foreach ($key in $correctConfig.Keys) {
        $currentValue = Get-EnvValue -content $envContent -key $key
        
        if ($currentValue -eq $null) {
            $missingVars += $key
            $needsFix = $true
        } elseif ($currentValue -ne $correctConfig[$key]) {
            $incorrectVars += $key
            $needsFix = $true
        }
    }
    
    # Report issues
    if ($missingVars.Count -gt 0) {
        Write-Host "Missing environment variables:" -ForegroundColor Red
        foreach ($var in $missingVars) {
            Write-Host "- $var" -ForegroundColor Red
        }
    }
    
    if ($incorrectVars.Count -gt 0) {
        Write-Host "Incorrect environment variables:" -ForegroundColor Yellow
        foreach ($var in $incorrectVars) {
            Write-Host "- $var" -ForegroundColor Yellow
            $currentValue = Get-EnvValue -content $envContent -key $var
            Write-Host "  Current: $currentValue" -ForegroundColor Gray
            Write-Host "  Expected: $($correctConfig[$var])" -ForegroundColor Gray
        }
    }
    
    # Fix if needed
    if ($needsFix) {
        Write-Host ""
        $fixConfirm = Read-Host "Would you like to fix these issues? (y/n)"
        
        if ($fixConfirm -eq "y") {
            # Create backup of original file
            $backupFile = "$envFile.bak"
            Copy-Item -Path $envFile -Destination $backupFile -Force
            Write-Host "Created backup at $backupFile" -ForegroundColor Gray
            
            # Fix the file by replacing or adding missing variables
            foreach ($key in $correctConfig.Keys) {
                $pattern = "$key=.+"
                $replacement = "$key=$($correctConfig[$key])"
                
                if ((Get-EnvValue -content $envContent -key $key) -eq $null) {
                    # Add missing variable
                    $envContent += "`n$replacement"
                } else {
                    # Replace incorrect variable
                    $envContent = [regex]::Replace($envContent, $pattern, $replacement)
                }
            }
            
            # Save the updated content
            $envContent | Out-File -FilePath $envFile -Encoding utf8
            Write-Host "Fixed environment variables in $envFile" -ForegroundColor Green
        } else {
            Write-Host "No changes made to environment variables" -ForegroundColor Yellow
        }
    } else {
        Write-Host "All Firebase environment variables are correct!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Environment configuration check complete" -ForegroundColor Cyan
