$ErrorActionPreference = "Stop"

# Create a clean working directory
$workDir = "vercel-fix-setup-page"
if (Test-Path $workDir) {
    Remove-Item -Path $workDir -Recurse -Force
}
New-Item -ItemType Directory -Path $workDir -Force | Out-Null

# Change to the working directory
Set-Location $workDir

# Link to the existing project
vercel link --yes --project=red-lotus

# Make sure we have a directory structure
New-Item -ItemType Directory -Path "src\pages" -Force | Out-Null

# Copy the fixed file
Copy-Item "..\src\pages\SetupGuidePage.tsx" -Destination "src\pages\" -Force

# Deploy just this file
vercel deploy --prod
