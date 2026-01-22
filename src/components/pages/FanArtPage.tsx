import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import lotusLogo from '../../assets/lotus-each-album.png';

// Analytics will be tracked through the main app component

interface FanArtItem {
  id: string;
  title: string;
  artist: string;
  image: string;
  description?: string;
  submittedDate: string;
  social?: string;
}

const FanArtPage: React.FC = () => {
  const [fanArtItems, setFanArtItems] = useState<FanArtItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    artistName: '',
    description: '',
    socialHandle: '',
    email: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);  useEffect(() => {
    // Analytics are tracked through the main app component
    loadApprovedFanArt();
  }, []);

  const loadApprovedFanArt = async () => {
    try {
      const q = query(
        collection(db, 'fanart'),
        where('approved', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const approvedArt: FanArtItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FanArtItem));
      
      // If no approved art exists, show placeholder items
      if (approvedArt.length === 0) {
        const placeholderArt: FanArtItem[] = [
          {
            id: '1',
            title: 'Red Lotus Portrait',
            artist: 'Fan Artist 1',
            image: '/fan-art/placeholder1.jpg',
            description: 'Digital portrait of Red Lotus',
            submittedDate: '2024-12-01',
            social: '@fanartist1'
          },
          {
            id: '2',
            title: 'Lotus Symbol Design',
            artist: 'Fan Artist 2',
            image: '/fan-art/placeholder2.jpg',
            description: 'Creative interpretation of the Red Lotus symbol',
            submittedDate: '2024-12-10',
            social: '@fanartist2'
          }
        ];
        setFanArtItems(placeholderArt);
      } else {
        setFanArtItems(approvedArt);
      }
    } catch (error) {
      console.error('Error loading fan art:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleSubmitArt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select an image file');
      return;
    }

    setUploading(true);
    setUploadError(null);    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `fanArt/${Date.now()}_${selectedFile.name}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add submission to Firestore for admin approval
      await addDoc(collection(db, 'fanart'), {
        title: uploadForm.title,
        artist: uploadForm.artistName,
        description: uploadForm.description,
        social: uploadForm.socialHandle,
        email: uploadForm.email,
        image: downloadURL,
        submittedDate: new Date().toISOString(),
        approved: false, // Needs admin approval
        createdAt: new Date()
      });

      setUploadSuccess(true);
      setShowUploadForm(false);
      
      // Reset form
      setUploadForm({
        title: '',
        artistName: '',
        description: '',
        socialHandle: '',
        email: ''
      });
      setSelectedFile(null);

      // Hide success message after 5 seconds
      setTimeout(() => setUploadSuccess(false), 5000);

    } catch (error) {
      console.error('Error uploading fan art:', error);
      setUploadError('Failed to upload artwork. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="section">
      <h1 className="section-title">Fan Art Gallery</h1>
      <p className="section-subtitle">Amazing artwork created by the Red Lotus community</p>

      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 text-center">
          <p className="text-green-800 font-bold">🎉 Your artwork has been submitted for review!</p>
          <p className="text-green-700 mt-2">We'll review it and add it to the gallery if approved. Thank you for sharing your creativity!</p>
        </div>
      )}

      {/* Submission Call-to-Action */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8 md:mb-12 border-l-4 border-red-500">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-black">
            Submit Your Fan Art!
          </h2>
          <p className="text-base md:text-lg mb-4 md:mb-6 text-grey-600">
            Created something inspired by Red Lotus? Submit your art directly for review and potential gallery feature!
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 md:px-8 rounded-lg transition-colors touch-manipulation"
          >
              🎨 Submit Your Art
            </button>
          </div>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-4 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-red-500/30 mobile-scroll">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-red-400">Submit Fan Art</h3>
                <button 
                  onClick={() => setShowUploadForm(false)}
                  className="text-white/60 hover:text-white text-2xl p-2 touch-manipulation"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitArt} className="space-y-4">
                <div>
                  <label className="block text-white/90 mb-2 text-sm md:text-base">Artwork Title*</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white focus:border-red-500 focus:outline-none touch-manipulation"
                    placeholder="My Red Lotus Fan Art"
                  />
                </div>

                <div>
                  <label className="block text-grey-800 mb-2 text-sm md:text-base font-medium">Your Name/Artist Name*</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.artistName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadForm({...uploadForm, artistName: e.target.value})}
                    className="w-full p-3 bg-white border border-grey-300 rounded text-black focus:border-red-500 focus:outline-none touch-manipulation"
                    placeholder="Your artist name"
                  />
                </div>

                <div>
                  <label className="block text-grey-800 mb-2 text-sm md:text-base font-medium">Email*</label>
                  <input
                    type="email"
                    required
                    value={uploadForm.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadForm({...uploadForm, email: e.target.value})}
                    className="w-full p-3 bg-white border border-grey-300 rounded text-black focus:border-red-500 focus:outline-none touch-manipulation"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-grey-800 mb-2 text-sm md:text-base font-medium">Social Handle (optional)</label>
                  <input
                    type="text"
                    value={uploadForm.socialHandle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadForm({...uploadForm, socialHandle: e.target.value})}
                    className="w-full p-3 bg-white border border-grey-300 rounded text-black focus:border-red-500 focus:outline-none touch-manipulation"
                    placeholder="@yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-grey-800 mb-2 text-sm md:text-base font-medium">Description (optional)</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUploadForm({...uploadForm, description: e.target.value})}
                    className="w-full p-3 bg-white border border-grey-300 rounded text-black focus:border-red-500 focus:outline-none h-20 touch-manipulation"
                    placeholder="Tell us about your artwork..."
                  />
                </div>

                <div>
                  <label className="block text-grey-800 mb-2 text-sm md:text-base font-medium">Select Image File* (Max 5MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full p-3 bg-white border border-grey-300 rounded text-black focus:border-red-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600 touch-manipulation"
                  />
                  {selectedFile && (
                    <p className="text-green-600 mt-2 text-sm">📁 {selectedFile.name}</p>
                  )}
                </div>

                {uploadError && (
                  <div className="bg-red-900/50 border border-red-500 rounded p-3">
                    <p className="text-red-400 text-sm">{uploadError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1 bg-grey-300 hover:bg-grey-400 text-black py-3 rounded font-medium transition-colors touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-grey-400 disabled:cursor-not-allowed text-white py-3 rounded font-medium transition-colors touch-manipulation"
                  >
                    {uploading ? '⏳ Uploading...' : '🚀 Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}        {/* Fan Art Grid */}
        {fanArtItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {fanArtItems.map((item: FanArtItem) => (
              <div 
                key={item.id}
                className="bg-white rounded-lg overflow-hidden border border-red-500 hover:border-red-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer touch-manipulation"
                onClick={() => openImageModal(item.image)}
              >
                <div className="aspect-square bg-grey-200 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTExODI3Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBDMTI3LjYxNCA1MCA1MCA3Ny4zODU4IDUwIDEwNUM1MCAxMzIuNjE0IDc3LjM4NTggMTYwIDEwMCAxNjBDMTIyLjYxNCAxNjAgMTUwIDEzMi42MTQgMTUwIDEwNUMxNTAgNzcuMzg1OCAxMjIuNjE0IDUwIDEwMCA1MFoiIHN0cm9rZT0iI0VGNDQ0NCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik04NSA5MEwxMTUgMTIwTTExNSA5MEw4NSAxMjAiIHN0cm9rZT0iI0VGNDQ0NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHRLEHT+PGJleHQ+CjxwYXRoIGQ9Ik0xMDAgMTcwQzEzNS44OTkgMTcwIDE2NSAxNDAuODk5IDE2NSAxMDVDMTY1IDY5LjEwMTUgMTM1Ljg5OSA0MCAxMDAgNDBDNjQuMTAxNSA0MCAzNSA2OS4xMDE1IDM1IDEwNUMzNSAxNDAuODk5IDY0LjEwMTUgMTcwIDEwMCAxNzBaIiBzdHJva2U9IiNFRjQ0NDQiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRUY0NDQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYW4gQXJ0IENvbWluZyBTb29uPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-red-500 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-grey-600 text-sm mb-2">
                    by {item.artist}
                  </p>
                  {item.social && (
                    <p className="text-amber-500 text-sm mb-2">
                      {item.social}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-grey-500 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <div className="text-4xl md:text-6xl mb-4">🎨</div>
            <h3 className="text-xl md:text-2xl font-semibold text-red-500 mb-4">
              Gallery Coming Soon!
            </h3>
            <p className="text-grey-600 max-w-md mx-auto text-sm md:text-base">
              We're preparing to showcase amazing fan art from the Red Lotus community. 
              Be the first to submit your artwork!
            </p>
          </div>
        )}

        {/* Community Guidelines */}
        <div className="mt-12 md:mt-16 bg-white rounded-lg p-4 md:p-8 border-l-4 border-yellow-500 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6 text-center">
            📝 Community Art Guidelines
          </h3>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h4 className="text-base md:text-lg font-semibold text-red-500 mb-3">✅ What We Love:</h4>
              <ul className="space-y-2 text-grey-700 text-sm md:text-base">
                <li>• Original artwork inspired by Red Lotus</li>
                <li>• Digital art, paintings, drawings, photography</li>
                <li>• Creative interpretations of lyrics or themes</li>
                <li>• Fan art of live performances or music videos</li>
                <li>• Respectful tributes and artistic expressions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold text-red-500 mb-3">📋 Submission Info:</h4>
              <ul className="space-y-2 text-grey-700 text-sm md:text-base">
                <li>• High-resolution images (min 1200px)</li>
                <li>• Include your artist name and social handle</li>
                <li>• Brief description of your artwork</li>
                <li>• Original work only (no AI-generated art)</li>
                <li>• Family-friendly content only</li>
              </ul>
            </div>
          </div>
        </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Fan Art" 
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-2 md:top-4 right-2 md:right-4 text-white/80 hover:text-white text-xl md:text-2xl bg-black/50 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center touch-manipulation"
              aria-label="Close image"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FanArtPage;
