# 🌸 Red Lotus Official Website

A modern, responsive website for Red Lotus featuring e-commerce, fan art gallery, booking system, and comprehensive admin dashboard.

## ✨ Features

### 🎨 **Fan Art Gallery**
- Community art submissions with upload system
- Admin approval workflow
- Responsive gallery display with artist credits

### 💼 **Offer Based Booking**
- Professional booking request form
- PayPal integration for consultation fees
- File upload for client materials
- Admin booking management system

### 🏪 **E-commerce Store**
- Dynamic product catalog (music, merchandise, digital content, tickets)
- PayPal payment processing
- Inventory management
- Featured products system

### ⚙️ **Admin Dashboard**
- **Store Manager**: Add/edit/delete products, set pricing, manage inventory
- **Content Manager**: Upload images, quotes, behind-the-scenes content
- **Booking Manager**: Review and manage booking requests
- **Fan Art Manager**: Approve/reject fan art submissions
- **Media Upload**: Direct file management with metadata
- **Message Manager**: Handle contact form submissions
- **Vibe Quotes**: Manage inspirational quotes

### 🔗 **Social Integration**
- Complete social media link management
- Printful merchandise integration
- TikTok content integration
- Community engagement features

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Payments**: PayPal React SDK
- **Build Tool**: Vite
- **Deployment**: Ready for Vercel, Netlify, or Firebase Hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase project
- PayPal developer account

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd red-lotus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase and PayPal credentials in `.env.local`:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
   # ... other variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin dashboard components
│   ├── pages/           # Page components
│   ├── payments/        # PayPal integration
│   ├── store/           # E-commerce components
│   └── upload/          # File upload components
├── features/            # Feature-specific modules
├── firebase/            # Firebase configuration
├── pages/               # Main page components
├── assets/              # Static assets
└── types/               # TypeScript type definitions
```

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID  
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID (sandbox for dev, live for production)

## 🔧 Admin Access

1. Navigate to `/admin` 
2. Sign in with Firebase authentication
3. Access the admin dashboard with full management capabilities

## 💳 Payment Setup

### Development (Sandbox)
1. Create a PayPal sandbox account at [developer.paypal.com](https://developer.paypal.com)
2. Create a sandbox application
3. Use the sandbox client ID in your environment variables

### Production
1. Create a live PayPal application
2. Replace `VITE_PAYPAL_CLIENT_ID` with your live client ID
3. Test thoroughly before going live

## 🔥 Firebase Setup

1. Create a Firebase project
2. Enable Authentication, Firestore, and Storage
3. Configure security rules for your use case
4. Add your Firebase config to environment variables

## 📱 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## 🧪 Testing

- **Development**: `npm run dev` and test locally
- **Build**: `npm run build` to verify production builds
- **Type Check**: TypeScript compilation ensures type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions about the Red Lotus website, please contact the development team.

---

**Built with ❤️ for Red Lotus** 🌸
    ...reactDom.configs.recommended.rules,
  },
})
```
