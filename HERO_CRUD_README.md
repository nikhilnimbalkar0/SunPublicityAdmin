# Hero Section CRUD System

A complete Firebase-powered Hero Section management system for your React application with real-time sync capabilities.

## 🎯 Features

### Admin Panel Features
- ✅ **Edit Text Content**: Title, Subtitle, Tagline, and Button Text
- ✅ **Upload Videos/Images**: Direct upload to Firebase Storage
- ✅ **Add Video URLs**: Support for external video/image URLs
- ✅ **Delete Media**: Remove videos from Firebase Storage and Firestore
- ✅ **Live Preview**: See changes before they go live
- ✅ **Real-time Sync**: Changes instantly reflect on the website
- ✅ **Auto-save**: All changes automatically saved to Firestore

### Website Features
- ✅ **Real-time Updates**: Hero content updates automatically via Firestore listeners
- ✅ **Video Cycling**: Background videos cycle every 15 seconds
- ✅ **Smooth Transitions**: Fade effects between video changes
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Dynamic Stats**: Displays live hoarding statistics

## 📁 File Structure

```
src/
├── components/
│   ├── Hero.jsx              # Website Hero Component (with real-time sync)
│   └── HeroAdmin.jsx          # Admin CRUD Component
├── services/
│   └── heroService.js         # Firebase service functions
├── config/
│   └── firebase.js            # Firebase configuration
└── pages/
    └── Home.jsx               # Admin Panel Home (includes HeroAdmin)
```

## 🔥 Firebase Setup

### Firestore Structure
```
hero_section/
  └── mainHero/
      ├── title: string
      ├── subtitle: string
      ├── tagline: string
      ├── buttonText: string
      ├── videos: array of strings
      └── updatedAt: timestamp
```

### Storage Structure
```
hero_videos/
  ├── {timestamp}_{filename}.mp4
  ├── {timestamp}_{filename}.webm
  └── ...
```

## 🚀 Usage

### 1. Admin Panel (Managing Hero Content)

Import and use the `HeroAdmin` component in your admin panel:

```jsx
import HeroAdmin from '../components/HeroAdmin';

function AdminPage() {
  return <HeroAdmin />;
}
```

**Features:**
- Edit all text fields in real-time
- Upload videos/images (max 100MB)
- Add external video URLs
- Delete videos with confirmation
- Live preview of changes
- Auto-save to Firebase

### 2. Website (Displaying Hero Section)

Import and use the `Hero` component on your website:

```jsx
import Hero from '../components/Hero';

function HomePage() {
  return <Hero />;
}
```

**Features:**
- Automatically syncs with Firebase
- Displays current hero content
- Cycles through background videos
- Shows dynamic hoarding statistics

## 🔧 API Functions

### `heroService.js`

#### `getHeroData()`
Fetches current hero data from Firestore.

```js
const data = await getHeroData();
```

#### `updateHeroData(data)`
Updates hero data in Firestore.

```js
await updateHeroData({
  title: 'New Title',
  subtitle: 'New Subtitle',
  tagline: 'New Tagline',
  buttonText: 'Click Me',
  videos: ['url1', 'url2']
});
```

#### `uploadHeroVideo(file, onProgress)`
Uploads video/image to Firebase Storage.

```js
const { url, path } = await uploadHeroVideo(file);
```

#### `deleteHeroVideo(videoPath)`
Deletes video from Firebase Storage.

```js
await deleteHeroVideo('hero_videos/123456_video.mp4');
```

#### `subscribeToHeroData(callback)`
Real-time listener for hero data changes.

```js
const unsubscribe = subscribeToHeroData((data) => {
  console.log('Hero updated:', data);
});

// Cleanup
unsubscribe();
```

#### `initializeHeroData()`
Initializes hero document with default data if it doesn't exist.

```js
await initializeHeroData();
```

## 🎨 Customization

### Default Values
Edit default values in `heroService.js`:

```js
const defaultData = {
  title: 'Your Custom Title',
  subtitle: 'Your Custom Subtitle',
  tagline: 'Your Custom Tagline',
  buttonText: 'Your Button Text',
  videos: ['/video1.mp4', '/video2.mp4']
};
```

### Video Cycle Duration
Change video cycling interval in `Hero.jsx`:

```js
// Change 15000 (15 seconds) to your desired duration
setInterval(() => {
  // ...
}, 15000); // milliseconds
```

### Upload Size Limit
Modify max file size in `HeroAdmin.jsx`:

```js
// Change 100MB to your desired limit
if (file.size > 100 * 1024 * 1024) {
  // Error handling
}
```

## 🔒 Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /hero_section/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can edit
    }
  }
}
```

Add these Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /hero_videos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can upload
      allow delete: if request.auth != null;
    }
  }
}
```

## 📱 Responsive Design

The Hero component is fully responsive:
- **Mobile**: Single column layout, smaller text
- **Tablet**: Medium-sized elements
- **Desktop**: Full-size hero with large text

## 🐛 Troubleshooting

### Videos not loading
- Check Firebase Storage rules
- Verify video URLs are accessible
- Check browser console for errors

### Changes not syncing
- Verify Firebase connection
- Check Firestore rules
- Ensure `subscribeToHeroData` is called

### Upload failing
- Check file size (max 100MB)
- Verify file type (video/* or image/*)
- Check Firebase Storage quota

## 📊 Performance Tips

1. **Optimize video files**: Use compressed formats (WebM, MP4)
2. **Limit video count**: Keep 3-5 videos for best performance
3. **Use CDN**: Host videos on CDN for faster loading
4. **Lazy loading**: Videos load only when needed

## 🎯 Next Steps

1. Add authentication to admin panel
2. Implement role-based access control
3. Add video compression before upload
4. Create backup/restore functionality
5. Add analytics tracking

## 📝 License

This Hero CRUD system is part of your Hoarding Management Dashboard.

---

**Need help?** Check the Firebase documentation or contact your development team.
