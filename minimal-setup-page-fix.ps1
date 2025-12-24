$ErrorActionPreference = "Stop"

# Create a clean working directory
$workDir = "vercel-fix-setup-page"
if (Test-Path $workDir) {
    Remove-Item -Path $workDir -Recurse -Force
}
New-Item -ItemType Directory -Path $workDir -Force | Out-Null

# Change to the working directory
Set-Location $workDir

# Create a minimal package.json
@"
{
  "name": "red-lotus-setup-page-fix",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "echo 'Skipping build'",
    "vercel-build": "echo 'Skipping build for single file update'"
  }
}
"@ | Set-Content "package.json"

# Create a simple vercel.json
@"
{
  "version": 2,
  "buildCommand": null,
  "outputDirectory": ".",
  "public": false,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
"@ | Set-Content "vercel.json"

# Make sure we have a directory structure
New-Item -ItemType Directory -Path "src\pages" -Force | Out-Null

# Copy the fixed file
Copy-Item "..\src\pages\SetupGuidePage.tsx" -Destination "src\pages\" -Force

# Create a placeholder index.html
@"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Red Lotus Setup Page Fix</title>
</head>
<body>
  <h1>Red Lotus Setup Page Fix</h1>
  <p>This is a specialized deployment that only updates the SetupGuidePage.tsx file.</p>
</body>
</html>
"@ | Set-Content "index.html"

# Link to the existing project
vercel link --yes --project=red-lotus

# Deploy the minimal setup
vercel deploy --prod
