import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Upload, 
  Trash2, 
  Plus, 
  Eye, 
  X, 
  Loader, 
  AlertCircle,
  CheckCircle,
  Video
} from 'lucide-react';
import {
  getHeroData,
  updateHeroData,
  uploadHeroVideo,
  deleteHeroVideo,
  subscribeToHeroData,
  initializeHeroData
} from '../services/heroService';

export default function HeroAdmin() {
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    buttonText: '',
    videos: []
  });

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    buttonText: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  const fileInputRef = useRef(null);

  // Load hero data on mount and subscribe to changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await initializeHeroData();
        setHeroData(data);
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          tagline: data.tagline || '',
          buttonText: data.buttonText || ''
        });
      } catch (error) {
        showMessage('error', 'Failed to load hero data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToHeroData((data) => {
      setHeroData(data);
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        tagline: data.tagline || '',
        buttonText: data.buttonText || ''
      });
    });

    return () => unsubscribe();
  }, []);

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save text data
  const handleSaveText = async () => {
    try {
      setSaving(true);
      await updateHeroData({
        ...heroData,
        ...formData
      });
      showMessage('success', 'Hero text updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update hero text');
    } finally {
      setSaving(false);
    }
  };

  // Upload video
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      showMessage('error', 'Please upload a video or image file');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      showMessage('error', 'File size must be less than 100MB');
      return;
    }

    try {
      setUploading(true);
      showMessage('info', 'Uploading video...');
      
      const { url } = await uploadHeroVideo(file);
      
      const updatedVideos = [...(heroData.videos || []), url];
      await updateHeroData({
        ...heroData,
        videos: updatedVideos
      });
      
      showMessage('success', 'Video uploaded successfully!');
    } catch (error) {
      showMessage('error', 'Failed to upload video');
      console.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add video URL
  const handleAddVideoUrl = async () => {
    const url = prompt('Enter video/image URL:');
    if (!url || !url.trim()) return;

    try {
      setSaving(true);
      const updatedVideos = [...(heroData.videos || []), url.trim()];
      await updateHeroData({
        ...heroData,
        videos: updatedVideos
      });
      showMessage('success', 'Video URL added successfully!');
    } catch (error) {
      showMessage('error', 'Failed to add video URL');
    } finally {
      setSaving(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async (index) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      setSaving(true);
      const videoToDelete = heroData.videos[index];
      const updatedVideos = heroData.videos.filter((_, i) => i !== index);
      
      // Delete from storage if it's a Firebase URL
      if (videoToDelete.includes('firebase')) {
        try {
          await deleteHeroVideo(videoToDelete);
        } catch (error) {
          console.error('Error deleting from storage:', error);
        }
      }
      
      await updateHeroData({
        ...heroData,
        videos: updatedVideos
      });
      
      showMessage('success', 'Video deleted successfully!');
    } catch (error) {
      showMessage('error', 'Failed to delete video');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hero Section Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your website's hero section content and media
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
          message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
           message.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
           <Loader className="w-5 h-5 animate-spin" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Live Preview */}
      {showPreview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            {heroData.videos && heroData.videos.length > 0 ? (
              heroData.videos[previewIndex]?.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  className="w-full h-full object-cover"
                  src={heroData.videos[previewIndex]}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={heroData.videos[previewIndex]}
                  alt="Hero preview"
                />
              )
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Video className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
              <div>
                <div className="inline-block mb-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs backdrop-blur">
                  {formData.subtitle || 'Subtitle'}
                </div>
                <h2 className="text-3xl font-bold mb-2">{formData.title || 'Title'}</h2>
                <p className="text-sm mb-4 text-gray-200">{formData.tagline || 'Tagline'}</p>
                <button className="bg-yellow-500 text-black px-6 py-2 rounded-full text-sm font-semibold">
                  {formData.buttonText || 'Button'}
                </button>
              </div>
            </div>
            {heroData.videos && heroData.videos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {heroData.videos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreviewIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === previewIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Content Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Text Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Subtitle (Badge Text)
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Premium Outdoor Advertising"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Main Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Make Your Brand Unmissable"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tagline (Description)
              </label>
              <textarea
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="e.g., Premium hoarding and billboard solutions..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Search Media"
              />
            </div>
            <button
              onClick={handleSaveText}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Text Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Background Videos ({heroData.videos?.length || 0})
          </h2>
          
          {/* Upload Controls */}
          <div className="mb-4 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Video/Image
                </>
              )}
            </button>
            <button
              onClick={handleAddVideoUrl}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Add Video URL
            </button>
          </div>

          {/* Video List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {heroData.videos && heroData.videos.length > 0 ? (
              heroData.videos.map((video, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                    {video.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={video}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={video}
                        alt={`Video ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Video {index + 1}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {video}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(index)}
                    disabled={saving}
                    className="flex-shrink-0 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No videos uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-semibold mb-1">Real-time Sync Enabled</p>
            <p>All changes are automatically synced to your website in real-time. Videos cycle every 15 seconds on the live site.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
