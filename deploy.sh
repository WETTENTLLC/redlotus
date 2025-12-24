#!/bin/bash

echo "🚀 Red Lotus Production Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add remote if it doesn't exist
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/WETTENTLLC/redlotus.git
fi

# Stage all files
echo "📁 Staging files for commit..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "🎉 Production-ready Red Lotus website with comprehensive security, performance, and monitoring"

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🌐 Next steps for redlotusofficial.com deployment:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Import the GitHub repository: WETTENTLLC/redlotus"
echo "3. Add your custom domain: redlotusofficial.com"
echo "4. Set environment variables in Vercel dashboard"
echo "5. Deploy!"
echo ""
echo "📋 Don't forget to:"
echo "- Update .env.local with production Firebase credentials"
echo "- Switch PayPal to live client ID"
echo "- Configure your custom domain DNS"
echo ""
echo "🎊 Red Lotus is ready to go live!"