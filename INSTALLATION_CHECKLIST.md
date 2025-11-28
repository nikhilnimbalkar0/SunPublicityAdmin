# Installation & Verification Checklist

Use this checklist to ensure your Hoarding Management Admin Dashboard is properly set up.

## ✅ Pre-Installation Checklist

### System Requirements
- [ ] Node.js v18 or higher installed
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] Git installed (optional)
  - Check: `git --version`
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Code editor (VS Code recommended)

### Firebase Account
- [ ] Firebase account created
- [ ] Access to Firebase Console
- [ ] Billing enabled (if required for your region)

## 📦 Installation Steps

### Step 1: Project Setup
- [ ] Navigate to project directory
  ```bash
  cd c:/Users/nikhi/OneDrive/Desktop/dash
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Verify installation completed without errors
- [ ] Check `node_modules` folder exists

### Step 2: Firebase Project Setup
- [ ] Created new Firebase project
- [ ] Project name: "hoarding-management" (or your choice)
- [ ] Selected region/location
- [ ] Disabled Google Analytics (optional)

### Step 3: Firebase Services Configuration

#### Authentication
- [ ] Opened Authentication section
- [ ] Clicked "Get Started"
- [ ] Enabled "Email/Password" sign-in method
- [ ] Saved changes

#### Firestore Database
- [ ] Opened Firestore Database section
- [ ] Created database
- [ ] Selected mode (Test/Production)
- [ ] Selected region
- [ ] Database created successfully

#### Firebase Storage
- [ ] Opened Storage section
- [ ] Clicked "Get Started"
- [ ] Selected mode (Test/Production)
- [ ] Storage bucket created

### Step 4: Firebase Configuration
- [ ] Opened Project Settings (gear icon)
- [ ] Scrolled to "Your apps" section
- [ ] Added web app (</> icon)
- [ ] Registered app with nickname
- [ ] Copied Firebase config object
- [ ] Created `.env` file from `.env.example`
  ```bash
  cp .env.example .env
  ```
- [ ] Pasted all Firebase credentials in `.env`
- [ ] Verified all 6 environment variables are set:
  - [ ] VITE_FIREBASE_API_KEY
  - [ ] VITE_FIREBASE_AUTH_DOMAIN
  - [ ] VITE_FIREBASE_PROJECT_ID
  - [ ] VITE_FIREBASE_STORAGE_BUCKET
  - [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
  - [ ] VITE_FIREBASE_APP_ID

### Step 5: Firestore Security Rules
- [ ] Opened Firestore Database → Rules tab
- [ ] Copied rules from SETUP_GUIDE.md
- [ ] Published rules
- [ ] Rules published successfully

### Step 6: Storage Security Rules
- [ ] Opened Storage → Rules tab
- [ ] Copied rules from SETUP_GUIDE.md
- [ ] Published rules
- [ ] Rules published successfully

### Step 7: Create Admin User

#### In Firebase Authentication
- [ ] Opened Authentication → Users tab
- [ ] Clicked "Add User"
- [ ] Entered email: `admin@example.com`
- [ ] Entered secure password
- [ ] User created successfully
- [ ] Copied User UID

#### In Firestore Database
- [ ] Opened Firestore Database
- [ ] Created collection: `users`
- [ ] Added document with ID = User UID
- [ ] Added fields:
  - [ ] name (string): "Admin User"
  - [ ] email (string): "admin@example.com"
  - [ ] role (string): "admin"
  - [ ] active (boolean): true
  - [ ] createdAt (timestamp): current time
- [ ] Document saved successfully

## 🚀 Running the Application

### Development Server
- [ ] Started dev server
  ```bash
  npm run dev
  ```
- [ ] Server started without errors
- [ ] Browser opened automatically (or manually open http://localhost:3000)
- [ ] Login page displayed correctly

### First Login
- [ ] Entered admin email
- [ ] Entered admin password
- [ ] Clicked "Sign In"
- [ ] Successfully logged in
- [ ] Redirected to dashboard

## ✅ Feature Verification

### Dashboard Page
- [ ] Dashboard loads without errors
- [ ] Statistics cards display (4 cards)
- [ ] Charts render correctly (2 charts)
- [ ] Recent bookings table visible
- [ ] No console errors

### Navigation
- [ ] Sidebar visible and functional
- [ ] All menu items clickable:
  - [ ] Dashboard
  - [ ] Manage Users
  - [ ] Manage Hoardings
  - [ ] Manage Bookings
  - [ ] Reports
  - [ ] Settings
- [ ] Active route highlighted
- [ ] Sidebar collapses on mobile

### Manage Users Page
- [ ] Page loads successfully
- [ ] "Add User" button visible
- [ ] Search bar functional
- [ ] User table displays
- [ ] Can add new user
- [ ] Can edit user
- [ ] Can delete user
- [ ] Can toggle user status

### Manage Hoardings Page
- [ ] Page loads successfully
- [ ] "Add Hoarding" button visible
- [ ] Search bar functional
- [ ] Grid layout displays
- [ ] Can add new hoarding
- [ ] Image upload works
- [ ] Can edit hoarding
- [ ] Can delete hoarding

### Manage Bookings Page
- [ ] Page loads successfully
- [ ] Filter dropdowns work
- [ ] Search bar functional
- [ ] Bookings table displays
- [ ] Can approve booking
- [ ] Can reject booking
- [ ] Can delete booking
- [ ] Can update payment status

### Reports Page
- [ ] Page loads successfully
- [ ] All charts render (4 charts)
- [ ] Data tables display
- [ ] Export buttons visible
- [ ] CSV export works

### Settings Page
- [ ] Page loads successfully
- [ ] Profile form displays
- [ ] Password form displays
- [ ] Theme toggle works
- [ ] Can update profile
- [ ] Can change password

### Theme & Responsiveness
- [ ] Dark mode toggle works
- [ ] Theme persists on refresh
- [ ] Mobile responsive (< 640px)
- [ ] Tablet responsive (640-1024px)
- [ ] Desktop responsive (> 1024px)
- [ ] Sidebar collapses on mobile

### Authentication
- [ ] Logout button works
- [ ] Redirects to login after logout
- [ ] Protected routes work
- [ ] Can't access admin without login
- [ ] Session persists on refresh

## 🧪 Testing Checklist

### Create Test Data
- [ ] Added 3-5 test users
- [ ] Added 3-5 test hoardings with images
- [ ] Added 3-5 test bookings
- [ ] All data displays correctly

### CRUD Operations
- [ ] Create operations work for all modules
- [ ] Read operations work for all modules
- [ ] Update operations work for all modules
- [ ] Delete operations work for all modules

### Error Handling
- [ ] Invalid login shows error
- [ ] Form validation works
- [ ] Network errors handled gracefully
- [ ] Loading states display correctly

## 🐛 Troubleshooting Verification

### Common Issues Resolved
- [ ] No "Access denied" errors
- [ ] Images upload successfully
- [ ] Environment variables loaded
- [ ] Firebase services accessible
- [ ] No console errors
- [ ] No build warnings (except Tailwind CSS lints)

### Browser Console
- [ ] No JavaScript errors
- [ ] No Firebase errors
- [ ] No network errors
- [ ] No authentication errors

## 📊 Performance Check

- [ ] Pages load quickly (< 2 seconds)
- [ ] Images load properly
- [ ] Charts render smoothly
- [ ] No lag in navigation
- [ ] Smooth animations

## 🔒 Security Verification

- [ ] Can't access admin routes without login
- [ ] Non-admin users can't access dashboard
- [ ] Firestore rules prevent unauthorized access
- [ ] Storage rules prevent unauthorized uploads
- [ ] Environment variables not exposed in client

## 📱 Cross-Browser Testing

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on mobile browsers

## 🎨 UI/UX Verification

- [ ] All icons display correctly
- [ ] Colors consistent throughout
- [ ] Buttons have hover states
- [ ] Forms are user-friendly
- [ ] Error messages are clear
- [ ] Success messages display
- [ ] Loading spinners show during operations

## 📚 Documentation Review

- [ ] README.md reviewed
- [ ] QUICK_START.md reviewed
- [ ] SETUP_GUIDE.md reviewed
- [ ] FEATURES.md reviewed
- [ ] PROJECT_STRUCTURE.md reviewed
- [ ] PROJECT_SUMMARY.md reviewed

## 🚀 Production Readiness

### Pre-Deployment
- [ ] All features tested
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Firebase security rules set
- [ ] Build succeeds
  ```bash
  npm run build
  ```
- [ ] Preview build works
  ```bash
  npm run preview
  ```

### Deployment Options
- [ ] Firebase Hosting configured (if using)
- [ ] Vercel configured (if using)
- [ ] Netlify configured (if using)
- [ ] Domain configured (if applicable)

## ✅ Final Verification

- [ ] All checklist items completed
- [ ] Application fully functional
- [ ] No critical errors
- [ ] Ready for production use
- [ ] Documentation accessible
- [ ] Support resources available

## 📝 Notes

**Installation Date:** _______________  
**Installed By:** _______________  
**Firebase Project ID:** _______________  
**Admin Email:** _______________  
**Deployment URL:** _______________  

## 🎉 Success Criteria

Your installation is successful if:
- ✅ All pages load without errors
- ✅ All CRUD operations work
- ✅ Authentication functions properly
- ✅ Charts and reports display correctly
- ✅ Theme toggle works
- ✅ Responsive on all devices
- ✅ No console errors

## 🆘 If Something Doesn't Work

1. **Check Firebase Console** for errors
2. **Review browser console** for JavaScript errors
3. **Verify `.env` file** has correct values
4. **Restart dev server** after changing `.env`
5. **Clear browser cache** and try again
6. **Review SETUP_GUIDE.md** for detailed instructions
7. **Check Firestore rules** are properly configured
8. **Verify admin user** has role="admin" in Firestore

## 📞 Support Resources

- Firebase Documentation: https://firebase.google.com/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Vite Documentation: https://vitejs.dev

---

**🎊 Congratulations on completing the installation!**

If all items are checked, your Hoarding Management Admin Dashboard is ready to use!

**Version:** 1.0  
**Last Updated:** November 2025
