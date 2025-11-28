import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const HERO_DOC_PATH = 'hero_section/mainHero';

// Get hero data
export const getHeroData = async () => {
  try {
    const docRef = doc(db, HERO_DOC_PATH);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default data if document doesn't exist
      return {
        title: 'Make Your Brand Unmissable',
        subtitle: 'Premium Outdoor Advertising',
        tagline: 'Premium hoarding and billboard solutions across the city — visible, vibrant, and valuable.',
        buttonText: 'Search Media',
        videos: ['/adi.mp4', '/add.mp4', '/addd.mp4'],
        updatedAt: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error getting hero data:', error);
    throw error;
  }
};

// Update hero data
export const updateHeroData = async (data) => {
  try {
    const docRef = doc(db, HERO_DOC_PATH);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, updateData, { merge: true });
    return updateData;
  } catch (error) {
    console.error('Error updating hero data:', error);
    throw error;
  }
};

// Upload video to Firebase Storage
export const uploadHeroVideo = async (file, onProgress) => {
  try {
    const timestamp = Date.now();
    const fileName = `hero_videos/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload file
    const uploadTask = uploadBytes(storageRef, file);
    
    // Wait for upload to complete
    await uploadTask;
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return { url: downloadURL, path: fileName };
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

// Delete video from Firebase Storage
export const deleteHeroVideo = async (videoPath) => {
  try {
    // Only delete if it's a Firebase Storage path
    if (videoPath.includes('firebase') || videoPath.includes('hero_videos/')) {
      const storageRef = ref(storage, videoPath);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error('Error deleting video:', error);
    // Don't throw error if file doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
};

// Real-time listener for hero data
export const subscribeToHeroData = (callback) => {
  const docRef = doc(db, HERO_DOC_PATH);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      // Return default data
      callback({
        title: 'Make Your Brand Unmissable',
        subtitle: 'Premium Outdoor Advertising',
        tagline: 'Premium hoarding and billboard solutions across the city — visible, vibrant, and valuable.',
        buttonText: 'Search Media',
        videos: ['/adi.mp4', '/add.mp4', '/addd.mp4'],
        updatedAt: new Date().toISOString()
      });
    }
  }, (error) => {
    console.error('Error listening to hero data:', error);
  });
};

// Initialize hero document with default data
export const initializeHeroData = async () => {
  try {
    const docRef = doc(db, HERO_DOC_PATH);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const defaultData = {
        title: 'Make Your Brand Unmissable',
        subtitle: 'Premium Outdoor Advertising',
        tagline: 'Premium hoarding and billboard solutions across the city — visible, vibrant, and valuable.',
        buttonText: 'Search Media',
        videos: ['/adi.mp4', '/add.mp4', '/addd.mp4'],
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, defaultData);
      return defaultData;
    }
    return docSnap.data();
  } catch (error) {
    console.error('Error initializing hero data:', error);
    throw error;
  }
};
