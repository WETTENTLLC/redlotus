# Clone Production and Update Single File
# This script clones the exact production site files and updates only one file

# Step 1: Create a fresh clone directory
$cloneDir = "exact-production-clone"
Write-Host "Step 1: Creating fresh clone directory at $cloneDir..." -ForegroundColor Cyan
if (Test-Path $cloneDir) {
    Remove-Item -Path $cloneDir -Recurse -Force
}
New-Item -ItemType Directory -Path $cloneDir -Force | Out-Null

# Step 2: Download the production files
Write-Host "Step 2: Downloading production files from red-lotus-731yjtl8z-wettentllcs-projects.vercel.app..." -ForegroundColor Cyan
Set-Location $cloneDir
vercel login
vercel pull --yes --environment=production

# Step 3: Check if SetupGuidePage.tsx exists, create backup if it does
$setupPagePath = ".\src\pages\SetupGuidePage.tsx"
if (Test-Path $setupPagePath) {
    Write-Host "Step 3: Backing up original SetupGuidePage.tsx..." -ForegroundColor Cyan
    Copy-Item $setupPagePath -Destination "$setupPagePath.backup" -Force
} else {
    Write-Host "Step 3: Creating pages directory structure..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path ".\src\pages" -Force | Out-Null
}

# Step 4: Copy the fixed file from the parent directory
Write-Host "Step 4: Copying fixed SetupGuidePage.tsx..." -ForegroundColor Cyan
$sourceSetupPage = "..\src\pages\SetupGuidePage.tsx"
if (Test-Path $sourceSetupPage) {
    Copy-Item $sourceSetupPage -Destination $setupPagePath -Force
} else {
    Write-Host "ERROR: Fixed SetupGuidePage.tsx not found at $sourceSetupPage" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Step 5: Verify the production build succeeds with the updated file
Write-Host "Step 5: Building project to verify no compilation errors..." -ForegroundColor Cyan
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed! Restoring original file and aborting." -ForegroundColor Red
    if (Test-Path "$setupPagePath.backup") {
        Copy-Item "$setupPagePath.backup" -Destination $setupPagePath -Force
    }
    Set-Location ..
    exit 1
}

# Step 6: Deploy to Vercel
Write-Host "Step 6: Deploying to Vercel..." -ForegroundColor Cyan
vercel deploy --prod

# Step 7: Return to original directory
Set-Location ..

Write-Host ""
Write-Host "Deployment completed. Please verify at https://red-lotus.vercel.app/setup-guide" -ForegroundColor Green
