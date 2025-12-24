# 🌐 Custom Domain Setup: redlotusofficial.com

## Vercel Deployment with Custom Domain

### 1. Deploy to Vercel

1. **Push to GitHub** (use `deploy.ps1` script):
   ```powershell
   .\deploy.ps1
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import `WETTENTLLC/redlotus` from GitHub
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 2. Environment Variables in Vercel

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
VITE_PAYPAL_CLIENT_ID=your_LIVE_paypal_client_id
```

### 3. Custom Domain Configuration

#### In Vercel Dashboard:
1. Go to your project → Settings → Domains
2. Add domain: `redlotusofficial.com`
3. Add domain: `www.redlotusofficial.com`

#### DNS Configuration:
Configure these DNS records with your domain provider:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. SSL Certificate
- Vercel automatically provides SSL certificates
- Your site will be available at `https://redlotusofficial.com`

### 5. Verification Steps

After deployment, verify:
- [ ] Site loads at `https://redlotusofficial.com`
- [ ] All sections work (Music, Store, Live, etc.)
- [ ] PayPal payments work with LIVE credentials
- [ ] File uploads work
- [ ] Admin dashboard accessible
- [ ] Analytics tracking active
- [ ] Performance monitoring working

### 6. Production Checklist

Before going live:
- [ ] Run production tests at `/production-test`
- [ ] Verify all environment variables are set
- [ ] Test payment flows end-to-end
- [ ] Check Firebase security rules
- [ ] Verify admin access controls
- [ ] Test on mobile devices
- [ ] Check Core Web Vitals performance

### 7. Post-Launch Monitoring

Monitor these metrics:
- Error rates in Vercel dashboard
- Performance metrics
- Payment transaction success rates
- User engagement analytics
- Firebase usage and costs

---

## Alternative: Firebase Hosting

If you prefer Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Then configure custom domain in Firebase Console → Hosting → Add custom domain.

---

## 🎉 Ready to Launch!

Your Red Lotus website is production-ready with:
- ✅ Enterprise security
- ✅ Optimized performance  
- ✅ Comprehensive monitoring
- ✅ Custom domain support
- ✅ SSL encryption
- ✅ Global CDN delivery

**Launch command**: `.\deploy.ps1`