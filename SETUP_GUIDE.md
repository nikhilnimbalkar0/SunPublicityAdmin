# Hoarding Management Admin Dashboard - Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Git (optional)

## Step 1: Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

## Step 2: Firebase Configuration

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "hoarding-management"
4. Follow the setup wizard

### 2.2 Enable Firebase Services

#### Enable Authentication:
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method

#### Enable Firestore Database:
1. Go to **Firestore Database**
2. Click "Create Database"
3. Start in **Production mode** (or Test mode for development)
4. Choose your region

#### Enable Storage:
1. Go to **Storage**
2. Click "Get Started"
3. Start in **Production mode** (or Test mode for development)

### 2.3 Get Firebase Configuration
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>) to add a web app
4. Register app with nickname: "Admin Dashboard"
5. Copy the Firebase configuration object

### 2.4 Create Environment File
Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 3: Setup Firestore Database

### 3.1 Create Collections
In Firestore Console, create these collections:

#### Collection: `users`
Document structure:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "active": true,
  "createdAt": "timestamp"
}
```

#### Collection: `hoardings`
Document structure:
```json
{
  "title": "Premium Highway Billboard",
  "location": "Mumbai Highway",
  "size": "20x10 ft",
  "price": 50000,
  "availability": true,
  "imageUrl": "",
  "createdAt": "timestamp"
}
```

#### Collection: `bookings`
Document structure:
```json
{
  "userId": "user_document_id",
  "hoardingId": "hoarding_document_id",
  "status": "Pending",
  "paymentStatus": "Unpaid",
  "amount": 50000,
  "createdAt": "timestamp"
}
```

### 3.2 Setup Firestore Security Rules
In Firestore Console, go to **Rules** tab and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Hoardings collection
    match /hoardings/{hoardingId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3.3 Setup Storage Security Rules
In Storage Console, go to **Rules** tab and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /hoardings/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 4: Create Admin User

### 4.1 Create User in Firebase Authentication
1. Go to **Authentication** > **Users**
2. Click "Add User"
3. Enter email: `admin@example.com`
4. Enter password: (choose a secure password)
5. Click "Add User"
6. Copy the User UID

### 4.2 Add User Document in Firestore
1. Go to **Firestore Database**
2. Open `users` collection
3. Click "Add Document"
4. Document ID: (paste the User UID from step 4.1)
5. Add fields:
   - `name` (string): "Admin User"
   - `email` (string): "admin@example.com"
   - `role` (string): "admin"
   - `active` (boolean): true
   - `createdAt` (timestamp): (current timestamp)

## Step 5: Run the Application

### Development Mode
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Login
- Email: `admin@example.com`
- Password: (the password you set in step 4.1)

## Step 6: Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Step 7: Deploy (Optional)

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Troubleshooting

### Issue: "Access denied" error
- Verify user role is set to "admin" in Firestore
- Check Firestore security rules are properly configured

### Issue: Images not uploading
- Verify Storage is enabled in Firebase Console
- Check Storage security rules allow write access

### Issue: Environment variables not working
- Ensure `.env` file is in project root
- Restart development server after changing `.env`
- Variable names must start with `VITE_`

### Issue: Firebase errors
- Verify all Firebase services are enabled
- Check Firebase configuration in `.env` is correct
- Ensure billing is enabled for Firebase project (if using paid features)

## Additional Features to Add (Optional)

1. **Email Notifications**: Use Firebase Cloud Functions to send emails
2. **Advanced Analytics**: Integrate Google Analytics
3. **Real-time Updates**: Use Firestore real-time listeners
4. **Image Optimization**: Compress images before upload
5. **Multi-language Support**: Add i18n support
6. **Advanced Filtering**: Add date range filters
7. **Bulk Operations**: Add bulk delete/update features
8. **Export to PDF**: Add PDF export for reports

## Support

For issues or questions:
- Check Firebase documentation: https://firebase.google.com/docs
- Review React documentation: https://react.dev
- Check Tailwind CSS docs: https://tailwindcss.com/docs

## License
Private - All rights reserved

---
**Developed by:** Nikhil Mahesh Nimbalkar  
**Version:** 1.0  
**Date:** November 2025
