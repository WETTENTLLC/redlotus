import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, Timestamp, query, orderBy, updateDoc, onSnapshot } from 'firebase/firestore';
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
  featured: boolean;
  approved: boolean;
}

export const FanArtManager: React.FC = () => {
  const [artworks, setArtworks] = useState<FanArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [description, setDescription] = useState('');
  const [artFile, setArtFile] = useState<File | null>(null);
  const [featured, setFeatured] = useState(false);

  // Fetch fan art from Firestore
  useEffect(() => {
    const q = query(collection(db, 'fanArt'), orderBy('createdAt', 'desc'));
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
          likes: data.likes || 0,
          featured: data.featured || false,
          approved: data.approved || false
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

  // Handle fan art submission by admin
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
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
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
            featured: featured,
            approved: true
          });
          
          // Reset form
          resetForm();
        }
      );
    } catch (err: any) {
      setError(`Error uploading fan art: ${err.message}`);
      setIsUploading(false);
      console.error('Error uploading fan art:', err);
    }
  };

  // Reset the form fields
  const resetForm = () => {
    setTitle('');
    setArtistName('');
    setDescription('');
    setArtFile(null);
    setFeatured(false);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Toggle featured status
  const handleToggleFeatured = async (id: string) => {
    try {
      const artwork = artworks.find(art => art.id === id);
      if (!artwork) return;
      
      // Get the document reference
      const artworkRef = doc(db, 'fanArt', id);
      
      // Update the featured status in Firestore
      await updateDoc(artworkRef, {
        featured: !artwork.featured
      });
    } catch (err: any) {
      setError(`Failed to update featured status: ${err.message}`);
      console.error('Error updating featured status:', err);
    }
  };

  // Approve artwork
  const handleApprove = async (id: string) => {
    try {
      const artworkRef = doc(db, 'fanArt', id);
      await updateDoc(artworkRef, { approved: true });
    } catch (err: any) {
      setError(`Failed to approve artwork: ${err.message}`);
      console.error('Error approving artwork:', err);
    }
  };

  // Delete artwork
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this artwork? This cannot be undone.')) {
      return;
    }
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'fanArt', id));
    } catch (err: any) {
      setError(`Failed to delete artwork: ${err.message}`);
      console.error('Error deleting artwork:', err);
    }
  };

  // Batch upload multiple fan arts
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Validate files
    const invalidFiles = files.filter(file => 
      !file.type.match('image.*') || file.size > 5 * 1024 * 1024
    );
    
    if (invalidFiles.length > 0) {
      setError(`${invalidFiles.length} files were invalid (not images or too large). They will be skipped.`);
    }
    
    const validFiles = files.filter(file => 
      file.type.match('image.*') && file.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length === 0) {
      setError('No valid files to upload.');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      let uploadedCount = 0;
      
      for (const file of validFiles) {
        const storageRef = ref(storage, `fanArt/batch-${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = ((uploadedCount + (snapshot.bytesTransferred / snapshot.totalBytes)) / validFiles.length) * 100;
              setUploadProgress(progress);
            }, 
            (error) => {
              console.error(`Error uploading ${file.name}:`, error);
              resolve(); // Continue with next file even if one fails
            }, 
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // Generate artist name and title from filename
                const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                
                // Parse the filename to extract better information
                // Assuming format like "Fan Art - [Artist Name] - [Title]" or similar variations
                let generatedTitle = '';
                let artistName = 'Fan Submission';
                
                // Check if filename contains "fan art" (case insensitive)
                if (fileName.toLowerCase().includes('fan art')) {
                  const parts = fileName.split('-').map(part => part.trim());
                  
                  if (parts.length >= 3) {
                    // Format: "Fan Art - [Artist Name] - [Title]"
                    artistName = parts[1];
                    generatedTitle = parts.slice(2).join(' - ');
                  } else if (parts.length === 2) {
                    // Format: "Fan Art - [Title]"
                    generatedTitle = parts[1];
                  } else {
                    // Just "Fan Art" or similar
                    generatedTitle = fileName.replace(/fan\s*art/i, '').trim();
                    if (!generatedTitle) generatedTitle = 'Red Lotus Fan Art';
                  }
                } else {
                  // If no "fan art" in name, use the whole filename
                  generatedTitle = fileName
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());
                }
                
                // Add document to Firestore
                await addDoc(collection(db, 'fanArt'), {
                  imageUrl: downloadURL,
                  title: generatedTitle || 'Red Lotus Fan Art',
                  artistName: artistName || 'Fan Submission',
                  description: `Fan artwork submitted for Red Lotus on ${new Date().toLocaleDateString()}`,
                  createdAt: Timestamp.now(),
                  likes: 0,
                  featured: false,
                  approved: true
                });
                
                uploadedCount++;
                resolve();
              } catch (err) {
                console.error('Error processing uploaded file:', err);
                resolve(); // Continue with next file even if processing fails
              }
            }
          );
        });
      }
      
      alert(`Successfully uploaded ${uploadedCount} of ${validFiles.length} files`);
      setUploadProgress(0);
      setIsUploading(false);
      
    } catch (err: any) {
      setError(`Batch upload error: ${err.message}`);
      console.error('Batch upload error:', err);
      setIsUploading(false);
    }
  };

  return (
    <div className="fan-art-manager">
      <h2 className="text-2xl font-bold mb-4">Fan Art Manager</h2>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative">
          <span className="block sm:inline">{error}</span>
          <span 
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setError(null)}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 11-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 011.414-1.414l2.93 2.93 2.93-2.93a1 1 0 111.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414z"></path>
            </svg>
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Upload Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Upload Fan Art</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Artwork Title</label>
              <input
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Give this artwork a title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Artist Name</label>
              <input
                type="text"
                value={artistName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtistName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Fan's name or username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Description of the artwork"
                rows={3}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={() => setFeatured(!featured)}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm font-medium">Feature on homepage</label>
            </div>
            
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-lotus h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
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
                {isUploading ? 'Uploading...' : 'Upload Artwork'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Batch Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Batch Upload</h3>
          <p className="mb-4 text-sm text-gray-600">
            Upload multiple fan art images at once. File names will be used to generate titles.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Multiple Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleBatchUpload}
                className="w-full"
                disabled={isUploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 5MB per file. JPEG, PNG formats.
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
                <p className="text-sm text-gray-500 mt-1">Processing batch: {Math.round(uploadProgress)}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Fan Art Gallery Management */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Manage Fan Art Gallery</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-lotus mx-auto"></div>
            <p className="mt-2">Loading fan art...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p>No fan art has been uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {artworks.map(artwork => (
                  <tr key={artwork.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24 h-24 overflow-hidden rounded">
                        <img 
                          src={artwork.imageUrl} 
                          alt={artwork.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{artwork.title}</p>
                        <p className="text-sm text-gray-500">by {artwork.artistName}</p>
                        {artwork.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{artwork.description}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Uploaded: {artwork.createdAt.toLocaleDateString()} • Likes: {artwork.likes}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        artwork.featured 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {artwork.featured ? 'Featured' : 'Regular'}
                      </span>
                      {!artwork.approved && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Pending Approval
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleToggleFeatured(artwork.id)}
                        className={`px-3 py-1 rounded text-xs ${
                          artwork.featured
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800'
                        }`}
                      >
                        {artwork.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      {!artwork.approved && (
                        <button
                          onClick={() => handleApprove(artwork.id)}
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded text-xs"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(artwork.id)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};