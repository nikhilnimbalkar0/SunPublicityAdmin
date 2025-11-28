# Quick Start Guide

Get your Hoarding Management Admin Dashboard up and running in 5 minutes!

## Prerequisites Check
- [ ] Node.js installed (v18+)
- [ ] Firebase account created
- [ ] Code editor (VS Code recommended)

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies (1 min)
```bash
cd c:/Users/nikhi/OneDrive/Desktop/dash
npm install
```

### Step 2: Firebase Setup (2 min)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add Project" → Name it "hoarding-management"
   - Disable Google Analytics (optional)

2. **Enable Services**
   - **Authentication**: Enable Email/Password
   - **Firestore**: Create database (Test mode)
   - **Storage**: Enable storage (Test mode)

3. **Get Config**
   - Project Settings → Your apps → Web app
   - Copy the config object

### Step 3: Environment Setup (30 sec)
```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your Firebase config
```

Your `.env` should look like:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Create Admin User (1 min)

1. **In Firebase Console → Authentication**
   - Click "Add User"
   - Email: `admin@example.com`
   - Password: `admin123` (change later!)
   - Copy the User UID

2. **In Firestore Database**
   - Create collection: `users`
   - Add document with ID = User UID
   - Fields:
     ```
     name: "Admin User"
     email: "admin@example.com"
     role: "admin"
     active: true
     createdAt: (current timestamp)
     ```

### Step 5: Run the App (30 sec)
```bash
npm run dev
```

Open http://localhost:3000

**Login with:**
- Email: `admin@example.com`
- Password: `admin123`

## 🎉 You're Done!

You should now see the admin dashboard with:
- ✅ Dashboard overview
- ✅ User management
- ✅ Hoarding management
- ✅ Booking management
- ✅ Reports
- ✅ Settings

## 📝 Next Steps

### Add Sample Data (Optional)

#### Add a Sample Hoarding
1. Go to "Manage Hoardings"
2. Click "Add Hoarding"
3. Fill in:
   - Title: "Premium Highway Billboard"
   - Location: "Mumbai Highway"
   - Size: "20x10 ft"
   - Price: 50000
   - Upload an image (optional)
   - Check "Available for Booking"
4. Click "Add Hoarding"

#### Add a Sample User
1. Go to "Manage Users"
2. Click "Add User"
3. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Role: "user"
   - Check "Active Account"
4. Click "Add User"

#### Add a Sample Booking
1. In Firestore, create collection: `bookings`
2. Add document with auto-ID
3. Fields:
   ```
   userId: (user document ID)
   hoardingId: (hoarding document ID)
   status: "Pending"
   paymentStatus: "Unpaid"
   amount: 50000
   createdAt: (current timestamp)
   ```

### Customize the App

1. **Change Branding**
   - Edit `src/components/Sidebar.jsx` - Update logo and title
   - Edit `index.html` - Update page title

2. **Modify Colors**
   - Edit `tailwind.config.js` - Change primary colors

3. **Add Your Logo**
   - Replace `public/vite.svg` with your logo
   - Update references in components

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Linting
npm run lint            # Check code quality
```

## 🐛 Troubleshooting

### "Access denied" error
→ Make sure user role is "admin" in Firestore

### Images not uploading
→ Check Storage is enabled in Firebase Console

### Environment variables not working
→ Restart dev server after changing .env

### Firebase errors
→ Verify all services are enabled in Firebase Console

## 📚 Documentation

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Features List**: See `FEATURES.md`
- **Project Structure**: See `PROJECT_STRUCTURE.md`
- **Main README**: See `README.md`

## 🆘 Need Help?

1. Check the documentation files
2. Review Firebase Console for errors
3. Check browser console for errors
4. Verify .env file is correct

## 🚀 Deploy to Production

### Firebase Hosting
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Vercel
```bash
npm run build
npm install -g vercel
vercel
```

---

**🎊 Congratulations!** You now have a fully functional admin dashboard!

**Developed by:** Nikhil Mahesh Nimbalkar  
**Version:** 1.0  
**Date:** November 2025
