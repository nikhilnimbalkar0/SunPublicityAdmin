import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../config/cloudinary';
import {
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Search,
    CheckCircle,
    AlertCircle,
    Image as ImageIcon,
    IndianRupee,
    X,
    Loader
} from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const HordingLocation = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        locationAddress: '',
        latitude: '',
        longitude: '',
        price: '',
        Available: true,
        imageUrl: ''
    });

    // Fetch Locations
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'hordinglocation'),
            (snapshot) => {
                const locationsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLocations(locationsData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching locations:', error);
                showMessage('error', 'Failed to fetch locations');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage('error', 'Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.imageUrl;
        try {
            setUploading(true);
            const result = await uploadToCloudinary(imageFile);
            return result.url;
        } catch (error) {
            showMessage('error', `Upload failed: ${error.message}`);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.locationAddress || !formData.price) {
            showMessage('error', 'Please fill in all required fields');
            return;
        }

        try {
            const imageUrl = await uploadImage();
            const locationData = {
                name: formData.name,
                locationAddress: formData.locationAddress,
                latitude: parseFloat(formData.latitude) || 0,
                longitude: parseFloat(formData.longitude) || 0,
                price: parseFloat(formData.price) || 0,
                Available: formData.Available,
                imageUrl,
            };

            if (editingLocation) {
                await updateDoc(doc(db, 'hordinglocation', editingLocation.id), {
                    ...locationData,
                    updatedAt: serverTimestamp()
                });
                showMessage('success', 'Location updated successfully');
            } else {
                await addDoc(collection(db, 'hordinglocation'), {
                    ...locationData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                showMessage('success', 'Location added successfully');
            }
            resetForm();
        } catch (error) {
            console.error("Error saving location: ", error);
            showMessage('error', 'Failed to save location');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;
        try {
            await deleteDoc(doc(db, 'hordinglocation', id));
            showMessage('success', 'Location deleted successfully');
        } catch (error) {
            showMessage('error', 'Failed to delete location');
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditingLocation(null);
        setFormData({
            name: '',
            locationAddress: '',
            latitude: '',
            longitude: '',
            price: '',
            Available: true,
            imageUrl: ''
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const openEditModal = (location) => {
        setEditingLocation(location);
        setFormData({
            name: location.name,
            locationAddress: location.locationAddress,
            latitude: location.latitude,
            longitude: location.longitude,
            price: location.price,
            Available: location.Available,
            imageUrl: location.imageUrl
        });
        setImagePreview(location.imageUrl);
        setShowModal(true);
    };

    const filteredLocations = locations.filter(loc =>
        loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.locationAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <MapPin className="w-8 h-8 mr-3 text-primary-600" />
                        Hording Locations
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your hoarding locations
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Location</span>
                </button>
            </div>

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex items-center gap-2 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span>{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((location) => (
                    <Card key={location.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                            {location.imageUrl ? (
                                <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${location.Available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                {location.Available ? 'Available' : 'Unavailable'}
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{location.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-1">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {location.locationAddress}
                            </p>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold text-primary-600 flex items-center">
                                    <IndianRupee className="w-4 h-4" />
                                    {location.price}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(location)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(location.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingLocation ? 'Edit Location' : 'Add New Location'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                <textarea
                                    required
                                    rows="2"
                                    value={formData.locationAddress}
                                    onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={formData.Available}
                                    onChange={(e) => setFormData({ ...formData, Available: e.target.checked })}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="available" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Available
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {uploading && <Loader className="w-4 h-4 animate-spin" />}
                                    {editingLocation ? 'Update Location' : 'Add Location'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HordingLocation;
