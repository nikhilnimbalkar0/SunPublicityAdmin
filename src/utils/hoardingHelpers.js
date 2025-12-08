import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    collectionGroup,
    query,
    orderBy,
    setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Helper functions for working with category-based hoarding structure
 * Structure: categories/{categoryName}/hoardings/{hoardingId}
 * Note: categoryName is used as the document ID (e.g., "Downtown Billboard")
 */

/**
 * Get a reference to a specific hoarding document
 * @param {string} categoryName - The category name (used as document ID)
 * @param {string} hoardingId - The hoarding ID
 * @returns {DocumentReference} Firestore document reference
 */
export const getHoardingRef = (categoryName, hoardingId) => {
    return doc(db, 'categories', categoryName, 'hoardings', hoardingId);
};

/**
 * Get a reference to the hoardings subcollection for a category
 * @param {string} categoryName - The category name
 * @returns {CollectionReference} Firestore collection reference
 */
export const getHoardingsCollectionRef = (categoryName) => {
    return collection(db, 'categories', categoryName, 'hoardings');
};

/**
 * Fetch all hoardings across all categories using collectionGroup
 * @returns {Promise<Array>} Array of hoarding objects with id, categoryName, and data
 */
export const getAllHoardings = async () => {
    try {
        const hoardingsQuery = query(
            collectionGroup(db, 'hoardings'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(hoardingsQuery);

        return snapshot.docs.map(doc => {
            // Extract categoryName from the document path
            // Path format: categories/{categoryName}/hoardings/{hoardingId}
            const pathParts = doc.ref.path.split('/');
            const categoryName = pathParts[1];

            return {
                id: doc.id,
                categoryName,
                ...doc.data()
            };
        });
    } catch (error) {
        console.error('Error fetching all hoardings:', error);
        throw error;
    }
};

/**
 * Fetch hoardings for a specific category
 * @param {string} categoryName - The category name
 * @returns {Promise<Array>} Array of hoarding objects
 */
export const getHoardingsByCategory = async (categoryName) => {
    try {
        const hoardingsRef = getHoardingsCollectionRef(categoryName);
        const hoardingsQuery = query(hoardingsRef, orderBy('createdAt', 'desc'));

        const snapshot = await getDocs(hoardingsQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            categoryName,
            ...doc.data()
        }));
    } catch (error) {
        console.error(`Error fetching hoardings for category ${categoryName}:`, error);
        throw error;
    }
};

/**
 * Create a new hoarding in a category
 * @param {string} categoryName - The category name
 * @param {Object} hoardingData - The hoarding data
 * @returns {Promise<Object>} Created hoarding with ID
 */
export const createHoarding = async (categoryName, hoardingData) => {
    try {
        const hoardingsRef = getHoardingsCollectionRef(categoryName);
        const docRef = await addDoc(hoardingsRef, hoardingData);

        return {
            id: docRef.id,
            categoryName,
            ...hoardingData
        };
    } catch (error) {
        console.error('Error creating hoarding:', error);
        throw error;
    }
};

/**
 * Update a hoarding
 * @param {string} categoryName - The category name
 * @param {string} hoardingId - The hoarding ID
 * @param {Object} updates - The updates to apply
 * @returns {Promise<void>}
 */
export const updateHoarding = async (categoryName, hoardingId, updates) => {
    try {
        const hoardingRef = getHoardingRef(categoryName, hoardingId);
        await updateDoc(hoardingRef, updates);
    } catch (error) {
        console.error('Error updating hoarding:', error);
        throw error;
    }
};

/**
 * Delete a hoarding
 * @param {string} categoryName - The category name
 * @param {string} hoardingId - The hoarding ID
 * @returns {Promise<void>}
 */
export const deleteHoarding = async (categoryName, hoardingId) => {
    try {
        const hoardingRef = getHoardingRef(categoryName, hoardingId);
        await deleteDoc(hoardingRef);
    } catch (error) {
        console.error('Error deleting hoarding:', error);
        throw error;
    }
};

/**
 * Ensure a category document exists (creates if not exists)
 * @param {string} categoryName - The category name
 * @returns {Promise<void>}
 */
export const ensureCategoryExists = async (categoryName) => {
    try {
        const categoryRef = doc(db, 'categories', categoryName);
        await setDoc(categoryRef, { name: categoryName }, { merge: true });
    } catch (error) {
        console.error('Error ensuring category exists:', error);
        throw error;
    }
};
