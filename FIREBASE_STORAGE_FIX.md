# Firebase Storage Error 412 - Fix Guide

## Problem
You're getting a 412 error when uploading images to Firebase Storage. This is due to Storage Rules blocking the upload.

## Solution

### Step 1: Update Firebase Storage Rules

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project: **fir-1aad8**
3. Click on **Storage** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to write to media folder
    match /media/{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to write to hero_videos folder
    match /hero_videos/{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to write to hoardings folder
    match /hoardings/{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

6. Click **Publish**

### Step 2: Verify Storage Bucket

Make sure your storage bucket is correctly configured:

**Current Config:**
```javascript
storageBucket: "fir-1aad8.firebasestorage.app"
```

**Alternative (if above doesn't work):**
```javascript
storageBucket: "fir-1aad8.appspot.com"
```

### Step 3: Check Authentication

Make sure you're logged in:
1. Open browser console
2. Check if user is authenticated
3. If not, log in through your app

### Step 4: Test Upload

After updating rules:
1. Wait 1-2 minutes for rules to propagate
2. Refresh your application
3. Try uploading an image again

## Alternative: Temporary Open Rules (Development Only)

⚠️ **WARNING: Only use this for testing, NOT for production!**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

This allows anyone to read and write. Use only for testing!

## Common Issues

### Issue 1: Rules not updated
**Solution:** Wait 1-2 minutes and refresh

### Issue 2: Not authenticated
**Solution:** Make sure you're logged in to the app

### Issue 3: Wrong bucket name
**Solution:** Try both:
- `fir-1aad8.firebasestorage.app`
- `fir-1aad8.appspot.com`

### Issue 4: CORS error
**Solution:** Add CORS configuration in Firebase Console

## Verify It's Working

After fixing, you should see:
- ✅ No 412 errors
- ✅ Images uploading successfully
- ✅ Images visible in Firebase Storage console

## Production Rules (Recommended)

For production, use more restrictive rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Authenticated write with file size limit (5MB)
    match /media/{fileName} {
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    match /hero_videos/{fileName} {
      allow write: if request.auth != null 
                   && request.resource.size < 100 * 1024 * 1024
                   && (request.resource.contentType.matches('video/.*') 
                       || request.resource.contentType.matches('image/.*'));
    }
    
    match /hoardings/{fileName} {
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Quick Fix Command

If you have Firebase CLI installed:

```bash
# Login to Firebase
firebase login

# Deploy storage rules
firebase deploy --only storage
```

## Need Help?

1. Check Firebase Console → Storage → Files
2. Look for uploaded files
3. Check browser Network tab for detailed error
4. Verify you're logged in as authenticated user

---

**After applying these fixes, your media upload should work perfectly!** ✅
