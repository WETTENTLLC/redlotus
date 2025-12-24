# Update and Deploy Red Lotus to Vercel with Custom Domain
# This script prepares and deploys the Red Lotus website to Vercel with redlotusofficial.com domain configuration

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Red Lotus Vercel Deployment with Custom Domain" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Confirm before proceeding
$confirmation = Read-Host "This will deploy the current version to Vercel with redlotusofficial.com domain. Continue? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit
}

# Step 1: Ensure all SEO updates for the domain are applied
Write-Host "Step 1: Checking SEO configurations for redlotusofficial.com..." -ForegroundColor Green

# Update the seoService baseUrl if needed
$seoServicePath = ".\src\services\seoService.ts"
$seoServiceContent = Get-Content -Path $seoServicePath -Raw
if ($seoServiceContent -match "redlotusmusic.com") {
    Write-Host "  Updating SEO Service domain references..." -ForegroundColor Yellow
    $seoServiceContent = $seoServiceContent -replace "redlotusmusic.com", "redlotusofficial.com"
    Set-Content -Path $seoServicePath -Value $seoServiceContent
    Write-Host "  SEO Service updated." -ForegroundColor Green
} else {
    Write-Host "  SEO Service already configured for redlotusofficial.com." -ForegroundColor Green
}

# Check index.html for domain references
$indexPath = ".\index.html"
$indexContent = Get-Content -Path $indexPath -Raw
if ($indexContent -match "redlotusmusic.com") {
    Write-Host "  Updating index.html domain references..." -ForegroundColor Yellow
    $indexContent = $indexContent -replace "redlotusmusic.com", "redlotusofficial.com"
    Set-Content -Path $indexPath -Value $indexContent
    Write-Host "  index.html updated." -ForegroundColor Green
} else {
    Write-Host "  index.html already configured for redlotusofficial.com." -ForegroundColor Green
}

# Check sitemap.xml for domain references
$sitemapPath = ".\public\sitemap.xml"
$sitemapContent = Get-Content -Path $sitemapPath -Raw
if ($sitemapContent -match "redlotusmusic.com") {
    Write-Host "  Updating sitemap.xml domain references..." -ForegroundColor Yellow
    $sitemapContent = $sitemapContent -replace "redlotusmusic.com", "redlotusofficial.com"
    # Also update the lastmod date to today
    $today = Get-Date -Format "yyyy-MM-dd"
    $sitemapContent = $sitemapContent -replace "\d{4}-\d{2}-\d{2}", $today
    Set-Content -Path $sitemapPath -Value $sitemapContent
    Write-Host "  sitemap.xml updated with current date." -ForegroundColor Green
} else {
    Write-Host "  sitemap.xml already configured for redlotusofficial.com." -ForegroundColor Green
}

# Check robots.txt for domain references
$robotsPath = ".\public\robots.txt"
$robotsContent = Get-Content -Path $robotsPath -Raw
if ($robotsContent -match "redlotusmusic.com") {
    Write-Host "  Updating robots.txt domain references..." -ForegroundColor Yellow
    $robotsContent = $robotsContent -replace "redlotusmusic.com", "redlotusofficial.com"
    Set-Content -Path $robotsPath -Value $robotsContent
    Write-Host "  robots.txt updated." -ForegroundColor Green
} else {
    Write-Host "  robots.txt already configured for redlotusofficial.com." -ForegroundColor Green
}

# Step 2: Ensure vercel.json has the right configurations
Write-Host "Step 2: Configuring Vercel for deployment..." -ForegroundColor Green

$vercelJsonPath = ".\vercel.json"
$vercelConfig = Get-Content -Path $vercelJsonPath -Raw | ConvertFrom-Json

# Check if we need to update vercel.json
$needsUpdate = $false

# Add domain configuration if not present
# Removed - domains are managed in Vercel dashboard, not in vercel.json
# if (-not (Get-Member -InputObject $vercelConfig -Name "domains" -MemberType Properties)) {
#     Write-Host "  Adding domain configuration to vercel.json..." -ForegroundColor Yellow
#     $vercelConfig | Add-Member -Name "domains" -Value @("redlotusofficial.com", "www.redlotusofficial.com") -MemberType NoteProperty
#     $needsUpdate = $true
# }

# Add redirect configuration for www to non-www
if (-not (Get-Member -InputObject $vercelConfig -Name "redirects" -MemberType Properties)) {
    Write-Host "  Adding redirect configuration to vercel.json..." -ForegroundColor Yellow
    $redirect = @(
        @{
            source = "https://www.redlotusofficial.com/:path*"
            destination = "https://redlotusofficial.com/:path*"
            permanent = $true
        }
    )
    $vercelConfig | Add-Member -Name "redirects" -Value $redirect -MemberType NoteProperty
    $needsUpdate = $true
}

# Save vercel.json if updated
if ($needsUpdate) {
    $vercelConfig | ConvertTo-Json -Depth 4 | Set-Content -Path $vercelJsonPath
    Write-Host "  vercel.json updated with domain configurations." -ForegroundColor Green
} else {
    Write-Host "  vercel.json already properly configured." -ForegroundColor Green
}

# Step 3: Build the project
Write-Host "Step 3: Building the project..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix the errors before deploying." -ForegroundColor Red
    exit
}

Write-Host "Build completed successfully." -ForegroundColor Green

# Step 4: Deploy to Vercel
Write-Host "Step 4: Deploying to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = vercel --version
} catch {
    $vercelInstalled = $null
}

if ($null -eq $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed! Please check the errors above." -ForegroundColor Red
    exit
}

Write-Host "Deployment completed successfully!" -ForegroundColor Green

# Step 5: Verify domain configuration
Write-Host "Step 5: Verifying domain configuration..." -ForegroundColor Green
Write-Host "Checking domain settings in Vercel..." -ForegroundColor Cyan
vercel domains ls

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your site should now be deployed to Vercel with redlotusofficial.com domain configuration."
Write-Host ""
Write-Host "IMPORTANT DNS REMINDERS:" -ForegroundColor Yellow
Write-Host "1. Ensure your Namecheap DNS settings have these records:" -ForegroundColor Yellow
Write-Host "   - A Record: @ points to 76.76.21.21" -ForegroundColor White
Write-Host "   - CNAME Record: www points to cname.vercel-dns.com." -ForegroundColor White
Write-Host ""
Write-Host "2. DNS propagation can take up to 48 hours, but usually completes within a few hours."
Write-Host ""
Write-Host "To verify your site, visit: https://redlotusofficial.com"
Write-Host ""
