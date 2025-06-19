# Setting Up redlotusofficial.com with Namecheap and Vercel

This guide will walk you through the process of connecting your Namecheap domain (redlotusofficial.com) to your Vercel-hosted Red Lotus website.

## Prerequisites
- Namecheap account with access to redlotusofficial.com
- Vercel account with your Red Lotus project deployed
- Admin access to both platforms

## Step 1: Verify Your Domain in Vercel

1. Log in to your Vercel account: https://vercel.com/dashboard
2. Navigate to your Red Lotus project
3. Go to Settings > Domains
4. Click "Add Domain"
5. Enter your domain: `redlotusofficial.com`
6. Click "Add"
7. Vercel will provide you with the required DNS records to set up in Namecheap

## Step 2: Configure DNS in Namecheap

1. Log in to your Namecheap account: https://www.namecheap.com/
2. Go to "Domain List" and click "Manage" next to redlotusofficial.com
3. Navigate to the "Advanced DNS" tab
4. Set up the following records:

### For the apex domain (redlotusofficial.com):
- Type: A
- Host: @
- Value: 76.76.21.21
- TTL: Automatic

### For the www subdomain:
- Type: CNAME
- Host: www
- Value: cname.vercel-dns.com.
- TTL: Automatic

## Step 3: Configure www Redirect (Optional)

If you want all traffic to go to the non-www version (or vice versa):

1. In your Vercel project settings, go to Domains
2. Click on the three dots next to your domain
3. Select "Redirect Domain"
4. Choose your preferred redirect (www to non-www or non-www to www)

## Step 4: Verify SSL Setup

1. In Vercel, check that both domains show "Valid Configuration"
2. SSL certificates will be automatically provisioned by Vercel
3. Wait a few minutes for DNS propagation and SSL issuance

## Step 5: Test Your Domain

1. Open a browser and go to https://redlotusofficial.com
2. Also test https://www.redlotusofficial.com
3. Verify that both load correctly and redirect as configured

## DNS Propagation

DNS changes can take up to 48 hours to fully propagate across the internet. However, most changes take effect within a few hours.

## SEO Considerations

After setting up your domain:

1. Verify your site with Google Search Console using the new domain
2. Submit your new sitemap at https://redlotusofficial.com/sitemap.xml
3. If migrating from another domain, set up 301 redirects from the old domain to the new one

## Troubleshooting

If your domain doesn't connect properly:

1. Verify all DNS records are entered correctly
2. Check for typos in domain names and record values
3. Ensure you're not using conflicting DNS settings
4. Wait for DNS propagation (up to 48 hours)
5. Contact Namecheap support or Vercel support if issues persist
