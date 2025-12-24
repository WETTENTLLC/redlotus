# Red Lotus Production Deployment Script for Windows
Write-Host "🚀 Red Lotus Production Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Add remote if it doesn't exist
try {
    git remote get-url origin | Out-Null
} catch {
    Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/WETTENTLLC/redlotus.git
}

# Stage all files
Write-Host "📁 Staging files for commit..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "🎉 Production-ready Red Lotus website with comprehensive security, performance, and monitoring"

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Next steps for redlotusofficial.com deployment:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Import the GitHub repository: WETTENTLLC/redlotus" -ForegroundColor White
Write-Host "3. Add your custom domain: redlotusofficial.com" -ForegroundColor White
Write-Host "4. Set environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "5. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📋 Don't forget to:" -ForegroundColor Yellow
Write-Host "- Update .env.local with production Firebase credentials" -ForegroundColor White
Write-Host "- Switch PayPal to live client ID" -ForegroundColor White
Write-Host "- Configure your custom domain DNS" -ForegroundColor White
Write-Host ""
Write-Host "🎊 Red Lotus is ready to go live!" -ForegroundColor Magenta