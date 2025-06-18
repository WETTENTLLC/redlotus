import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, Timestamp, onSnapshot, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';

interface FanArtItem {
  id: string;
  imageUrl: string;
  title: string;
  artistName: string;
  description: string;
  createdAt: Date;
  likes: number;
}

export const FanArtGallery: React.FC = () => {
  const [artworks, setArtworks] = useState<FanArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Upload form state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [description, setDescription] = useState('');
  const [artFile, setArtFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Fetch fan art from Firestore (only approved, live updates)
  useEffect(() => {
    const q = query(collection(db, 'fanArt'), where('approved', '==', true), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedArtworks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          imageUrl: data.imageUrl,
          title: data.title,
          artistName: data.artistName,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          likes: data.likes || 0
        } as FanArtItem;
      });
      setArtworks(fetchedArtworks);
      setLoading(false);
    }, (err) => {
      setError(`Error loading fan art: ${err.message}`);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setArtFile(file);
      setError(null);
    }
  };

  // Handle fan art submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artFile) {
      setError('Please select an image to upload');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      // Create a reference to the storage location
      const storageRef = ref(storage, `fanArt/${Date.now()}-${artFile.name}`);
      
      // Upload the file to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, artFile);
      
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          // Handle unsuccessful uploads
          setError(`Upload failed: ${error.message}`);
          setIsUploading(false);
        }, 
        async () => {
          // Handle successful uploads on complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Add a new document to Firestore with the fan art details
          await addDoc(collection(db, 'fanArt'), {
            imageUrl: downloadURL,
            title,
            artistName,
            description,
            createdAt: Timestamp.now(),
            likes: 0,
            approved: false // <-- Set to false by default
          });
          
          // Reset form
          setTitle('');
          setArtistName('');
          setDescription('');
          setArtFile(null);
          setUploadProgress(0);
          setIsUploading(false);
          setShowUploadForm(false);
        }
      );
      
    } catch (err: any) {
      setError(`Error uploading fan art: ${err.message}`);
      setIsUploading(false);
      console.error('Error uploading fan art:', err);
    }
  };

  // Handle liking artwork
  const handleLike = async (id: string) => {
    try {
      // Get the current artwork
      const artwork = artworks.find(art => art.id === id);
      
      if (artwork) {
        // Update the UI optimistically
        const updatedArtworks = artworks.map(art => 
          art.id === id ? { ...art, likes: art.likes + 1 } : art
        );
        
        setArtworks(updatedArtworks);
        
        // Update in Firestore (in a real app, you'd want to use a transaction)
        const docRef = collection(db, 'fanArt');
        await addDoc(docRef, {
          likes: artwork.likes + 1
        });
      }
    } catch (err: any) {
      console.error('Error liking artwork:', err);
    }
  };

  return (
    <div className="fan-art-gallery">
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative">
          <span className="block sm:inline">{error}</span>
          <span 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 11-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 011.414-1.414l2.93 2.93 2.93-2.93a1 1 0 111.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414z"></path>
            </svg>
          </span>
        </div>
      )}

      {/* Share your art button */}
      <div className="text-center mb-12">
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-6 py-3 bg-red-lotus text-white rounded-lg hover:bg-red-700 transition shadow-lg"
        >
          {showUploadForm ? 'Cancel' : '🎨 Share Your Fan Art'}
        </button>
      </div>
      
      {/* Upload form */}
      {showUploadForm && (
        <div className="bg-black/50 p-6 rounded-lg max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Share Your Red Lotus Fan Art</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-bold mb-2">
                Artwork Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Give your artwork a title"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-bold mb-2">
                Artist Name
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtistName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Your name or artist handle"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Tell us about your artwork (optional)"
                rows={3}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-white text-sm font-bold mb-2">
                Upload Artwork
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full text-white"
              />
              <p className="text-sm text-white/70 mt-1">
                Max file size: 5MB. Supported formats: JPEG, PNG
              </p>
            </div>
            
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-lotus h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white mt-1">Uploading: {Math.round(uploadProgress)}%</p>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full px-4 py-2 text-white rounded ${
                  isUploading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-red-lotus hover:bg-red-700'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Submit Fan Art'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-lotus mx-auto"></div>
          <p className="text-white mt-4">Loading amazing fan creations...</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-12 bg-black/30 rounded-lg">
          <h3 className="text-2xl text-white mb-4">No fan art yet</h3>
          <p className="text-white/80">Be the first to share your Red Lotus-inspired creation!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map(artwork => (
            <div key={artwork.id} className="bg-black/60 rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1">
              <div className="w-full h-64 overflow-hidden">
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-1">{artwork.title}</h3>
                <p className="text-red-lotus mb-2">by {artwork.artistName}</p>
                
                {artwork.description && (
                  <p className="text-white/80 text-sm mb-4">{artwork.description}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">
                    {new Date(artwork.createdAt).toLocaleDateString()}
                  </span>
                  
                  <button 
                    onClick={() => handleLike(artwork.id)}
                    className="flex items-center text-white/90 hover:text-red-lotus transition"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18l-1.14-1.03C4.5 12.96 2 10.07 2 6.5 2 3.98 3.98 2 6.5 2c1.56 0 3.05.88 3.5 2.08C10.45 2.88 11.94 2 13.5 2 16.02 2 18 3.98 18 6.5c0 3.57-2.5 6.46-6.86 10.47L10 18z"></path>
                    </svg>
                    {artwork.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};