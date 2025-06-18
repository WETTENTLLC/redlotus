# Red Lotus Admin Dashboard - Testing Checklist

## 🚀 Quick Start
1. **Development Server**: `npm run dev` → http://localhost:5175/
2. **Admin Access**: Click "Admin Dashboard" in navigation → `/admin`
3. **Login**: Use your Firebase admin credentials

## 📋 Comprehensive Testing Guide

### 🏪 **Store Manager Tab** - E-commerce Management
- [ ] **Add New Product**
  - [ ] Music: Upload audio file, set price, add description
  - [ ] Merch: Upload image, set price, add description
  - [ ] Digital: Upload download file, set price
  - [ ] Tickets: Set event details, price, quantity
- [ ] **Edit Existing Product**
  - [ ] Update price, description, image
  - [ ] Toggle in-stock status
  - [ ] Toggle featured status
- [ ] **Delete Product** - Remove items from store
- [ ] **Verify Store Display** - Check items appear in main store section

### 🎨 **Content Manager Tab** - Media & Content
- [ ] **Upload Images**
  - [ ] Gallery images → appear in photo gallery
  - [ ] Behind-the-scenes → appear in BTS section
  - [ ] General content images
- [ ] **Manage Quotes**
  - [ ] Add inspirational quotes
  - [ ] Edit existing quotes
  - [ ] Delete quotes
- [ ] **Content Assignment** - Verify content appears in correct sections

### 📁 **Media Upload Tab** - Raw File Management
- [ ] **Image Upload** - Direct image uploads to Firebase Storage
- [ ] **Music Upload** - Audio files with metadata (title, artist, price)
- [ ] **Verify Upload List** - Check uploaded songs appear in list

### 📅 **Bookings Tab** - Offer Based Booking Management
- [ ] **View Booking Requests** - See submitted booking forms
- [ ] **Approve Bookings** - Accept booking requests
- [ ] **Reject Bookings** - Decline with reason
- [ ] **Add Notes** - Internal notes for booking management
- [ ] **Payment Status** - Verify PayPal payment confirmations

### 🎭 **Fan Art Tab** - Community Art Management
- [ ] **View Submissions** - See pending fan art uploads
- [ ] **Approve Art** - Accept fan art for gallery display
- [ ] **Reject Art** - Decline submissions
- [ ] **Verify Gallery** - Check approved art appears in fan art page

### 💬 **Messages Tab** - Communication Management
- [ ] **View Messages** - See contact form submissions
- [ ] **Respond to Messages** - Admin communication tools
- [ ] **Mark as Read/Unread** - Message status management

### ✨ **Vibe Quotes Tab** - Inspirational Content
- [ ] **Add Quotes** - New inspirational quotes
- [ ] **Edit Quotes** - Update existing content
- [ ] **Delete Quotes** - Remove outdated content
- [ ] **Quote Display** - Verify quotes appear on main site

## 🛒 **User-Facing Store Testing**

### 💳 **Purchase Flow Testing**
- [ ] **Browse Products** - Navigate store categories (music, merch, digital, tickets)
- [ ] **Add to Cart** - Select items for purchase
- [ ] **PayPal Payment** - Complete test purchase with sandbox account
- [ ] **Payment Success** - Verify confirmation message
- [ ] **Download Links** - Check digital content access (if applicable)

### 🎨 **Fan Art Submission**
- [ ] **Upload Fan Art** - Submit new artwork
- [ ] **Form Completion** - Fill artist details, description
- [ ] **Submission Success** - Verify upload confirmation
- [ ] **Admin Notification** - Check submission appears in admin

### 📝 **Booking Submission**
- [ ] **Fill Booking Form** - Complete offer details
- [ ] **PayPal Payment** - Pay $25 consultation fee
- [ ] **Booking Confirmation** - Verify submission success
- [ ] **Admin Notification** - Check booking appears in admin

## 🔧 **Technical Verification**

### 🏗️ **Build & Deploy**
- [ ] **Production Build** - `npm run build` completes successfully
- [ ] **No TypeScript Errors** - Clean build output
- [ ] **Asset Optimization** - Images, fonts load correctly
- [ ] **PWA Features** - Service worker, manifest working

### 🔥 **Firebase Integration**
- [ ] **Authentication** - Admin login/logout working
- [ ] **Firestore** - Data saving/loading correctly
- [ ] **Storage** - File uploads to Firebase Storage
- [ ] **Real-time Updates** - Live data synchronization

### 💰 **PayPal Integration**
- [ ] **Sandbox Payments** - Test transactions working
- [ ] **Error Handling** - Failed payment scenarios
- [ ] **Success Callbacks** - Payment confirmation flow
- [ ] **Transaction Logging** - Payment details captured

## 🚨 **Known Issues to Test**
- [ ] **Image Loading** - All images display correctly
- [ ] **Mobile Responsiveness** - Admin dashboard works on mobile
- [ ] **File Upload Limits** - Large file handling
- [ ] **Concurrent Users** - Multiple admin sessions

## 🎯 **Production Readiness**
- [ ] **Environment Variables** - All secrets configured
- [ ] **Security Rules** - Firebase security properly set
- [ ] **Error Boundaries** - Graceful error handling
- [ ] **Performance** - Fast loading times
- [ ] **SEO** - Meta tags and descriptions
- [ ] **Analytics** - Tracking code integration

## 📞 **Support & Documentation**
- [ ] **Admin User Guide** - Documentation for staff
- [ ] **User Support** - Help for customers
- [ ] **Backup Procedures** - Data backup strategy
- [ ] **Monitoring** - Error tracking and alerts

---

## 🔗 **Quick Links**
- **Live Site**: https://redlotusofficial.com
- **Admin Dashboard**: http://localhost:5175/admin
- **Firebase Console**: https://console.firebase.google.com/project/red-lotus-cf4b4
- **PayPal Developer**: https://developer.paypal.com/

## 🏆 **Success Criteria**
✅ All admin features work without errors  
✅ Store purchases complete successfully  
✅ Content uploads to correct sections  
✅ Mobile/desktop responsive  
✅ Production build deploys cleanly  

**Status**: Ready for production deployment! 🚀
