import React, { useState, useEffect } from 'react';
import MediaUploader from '../components/upload/MediaUploader';
import MessageManager from '../features/messaging/MessageManager';
import QuoteManager from '../features/vibration/QuoteManager';
import StoreManager from '../components/admin/StoreManager';
import ContentManager from '../components/admin/ContentManager';
import EnhancedContentManager from '../components/admin/EnhancedContentManager';
import BookingManager from '../components/admin/BookingManager';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { LocalStorageService } from '../services/LocalStorageService';
import lotusLogo from '../assets/lotus-each-album.png';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'enhanced-content' | 'media' | 'store' | 'content' | 'messages' | 'quotes' | 'fanart' | 'bookings' | 'analytics' | 'community-posts'>('enhanced-content');
  const [user, loading, error] = useAuthState(auth);
  const [uploadedSongs, setUploadedSongs] = useState<any[]>([]);
  const [pendingFanArt, setPendingFanArt] = useState<any[]>([]);

  const fetchUploadedSongs = async () => {
    const querySnapshot = await getDocs(collection(db, 'songs'));
    const songs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUploadedSongs(songs);
  };

  const fetchPendingFanArt = async () => {
    try {
      const q = query(
        collection(db, 'fanart'),
        where('approved', '==', false)
      );
      const querySnapshot = await getDocs(q);
      const pending = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setPendingFanArt(pending);
    } catch (error) {
      console.error('Error fetching pending fan art:', error);
    }
  };

  const approveFanArt = async (artId: string) => {
    try {
      await updateDoc(doc(db, 'fanart', artId), {
        approved: true,
        approvedAt: new Date()
      });
      fetchPendingFanArt(); // Refresh the list
    } catch (error) {
      console.error('Error approving fan art:', error);
    }
  };

  const rejectFanArt = async (artId: string) => {
    try {
      await deleteDoc(doc(db, 'fanart', artId));
      fetchPendingFanArt(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting fan art:', error);
    }
  };

  useEffect(() => {
    fetchUploadedSongs();
    fetchPendingFanArt();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-lotus"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login or show login form
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-red-lotus text-center">Artist Admin Access</h2>
          <p className="mb-4 text-center">Please log in to access the admin dashboard.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full py-2 px-4 bg-red-lotus text-white rounded-md hover:bg-opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-lotus text-white shadow-md">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={lotusLogo} alt="Red Lotus Logo" className="w-16 h-12" />
              <div>
                <h1 className="text-2xl font-bold">Red Lotus Admin</h1>
                <div className="text-sm opacity-90">🔴 LIVE - Production Dashboard</div>
              </div>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="px-4 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-6 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b overflow-x-auto scrollbar-hide">
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'enhanced-content' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('enhanced-content')}
            >
              🎯 Content Hub
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'store' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('store')}
            >
              🛍️ Store Manager
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'content' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('content')}
            >
              📝 Legacy Content
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'media' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('media')}
            >
              📁 Media Upload
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'bookings' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('bookings')}
            >
              📅 Bookings
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'fanart' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('fanart')}
            >
              🎨 Fan Art ({pendingFanArt.length})
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'messages' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('messages')}
            >
              💬 Messages
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'quotes' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('quotes')}
            >
              ✨ Vibe Quotes
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'community-posts' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('community-posts')}
            >
              👥 Community Posts
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'analytics' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('analytics')}
            >
              📊 Analytics
            </button>
          </div>
          
          <div className="p-4">
            {activeTab === 'enhanced-content' && <EnhancedContentManager />}
            
            {activeTab === 'store' && <StoreManager />}
            
            {activeTab === 'content' && <ContentManager />}
            
            {activeTab === 'bookings' && <BookingManager />}
            
            {activeTab === 'community-posts' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-red-lotus">👥 Community Posts Approval</h3>
                {(() => {
                  const pendingPosts = LocalStorageService.getAllPosts().filter(post => 
                    post.type === 'community' && !post.isActive
                  );
                  const approvedPosts = LocalStorageService.getAllPosts().filter(post => 
                    post.type === 'community' && post.isActive
                  );
                  
                  return (
                    <div className="space-y-6">
                      {/* Pending Posts */}
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="text-lg font-bold text-yellow-800 mb-4">⏳ Pending Approval ({pendingPosts.length})</h4>
                        {pendingPosts.length === 0 ? (
                          <p className="text-yellow-600">No posts pending approval.</p>
                        ) : (
                          <div className="space-y-3">
                            {pendingPosts.map(post => (
                              <div key={post.id} className="bg-white p-4 rounded border">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-bold text-lg">{post.title}</h5>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        LocalStorageService.updatePost(post.id, { isActive: true });
                                        window.location.reload();
                                      }}
                                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                    >
                                      ✅ Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm('Delete this post?')) {
                                          LocalStorageService.deletePost(post.id);
                                          window.location.reload();
                                        }
                                      }}
                                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                    >
                                      ❌ Reject
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-2">{post.content}</p>
                                <div className="text-sm text-gray-500">
                                  By {post.author} • {post.tribe} tribe • {post.category} • {new Date(post.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Approved Posts */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="text-lg font-bold text-green-800 mb-4">✅ Approved Posts ({approvedPosts.length})</h4>
                        {approvedPosts.length === 0 ? (
                          <p className="text-green-600">No approved community posts yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {approvedPosts.slice(0, 10).map(post => (
                              <div key={post.id} className="bg-white p-3 rounded border flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{post.title}</span>
                                  <span className="text-gray-500 ml-2">by {post.author}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (confirm('Hide this post?')) {
                                      LocalStorageService.updatePost(post.id, { isActive: false });
                                      window.location.reload();
                                    }
                                  }}
                                  className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600"
                                >
                                  Hide
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-red-lotus">📊 Site Analytics & Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-red-lotus to-red-600 p-6 rounded-lg text-white">
                    <h4 className="text-lg font-bold mb-2">❄️ Red Lotus Tribe</h4>
                    <div className="text-3xl font-bold mb-1">{JSON.parse(localStorage.getItem('tribemembers') || '[]').filter((m: any) => m.tribe === 'red').length}</div>
                    <div className="text-red-100">Members</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-lotus to-yellow-600 p-6 rounded-lg text-white">
                    <h4 className="text-lg font-bold mb-2">☀️ Yellow Lotus Tribe</h4>
                    <div className="text-3xl font-bold mb-1">{JSON.parse(localStorage.getItem('tribemembers') || '[]').filter((m: any) => m.tribe === 'yellow').length}</div>
                    <div className="text-yellow-100">Members</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-lotus to-blue-600 p-6 rounded-lg text-white">
                    <h4 className="text-lg font-bold mb-2">🌸 Blue Lotus Tribe</h4>
                    <div className="text-3xl font-bold mb-1">{JSON.parse(localStorage.getItem('tribemembers') || '[]').filter((m: any) => m.tribe === 'blue').length}</div>
                    <div className="text-blue-100">Members</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h4 className="text-xl font-bold mb-4">Recent Tribe Members</h4>
                  <div className="space-y-2">
                    {JSON.parse(localStorage.getItem('tribemembers') || '[]').slice(-10).reverse().map((member: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{member.name}</span>
                          <span className="text-gray-500 ml-2">({member.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            member.tribe === 'red' ? 'bg-red-100 text-red-800' :
                            member.tribe === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {member.tribe === 'red' ? '❄️ Red' : member.tribe === 'yellow' ? '☀️ Yellow' : '🌸 Blue'} Lotus
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'media' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Images</h3>
                  <MediaUploader 
                    mediaType="image" 
                    folder="images" 
                    onComplete={(url) => console.log('Image uploaded:', url)} 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Music</h3>
                  <MediaUploader 
                    mediaType="audio" 
                    folder="music" 
                    onComplete={async (url, metadata) => {
                      console.log('Audio uploaded:', url, metadata);
                      await addDoc(collection(db, 'store'), { 
                        url, 
                        metadata, 
                        type: 'audio', 
                        price: metadata.price || 0 
                      });
                      fetchUploadedSongs();
                    }} 
                  />
                </div>
                {/* Video upload temporarily disabled due to type constraints */}
                {/* 
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Videos</h3>
                  <MediaUploader 
                    mediaType="video" 
                    folder="videos" 
                    onComplete={async (url, metadata) => {
                      console.log('Video uploaded:', url, metadata);
                      await addDoc(collection(db, 'store'), { 
                        url, 
                        metadata, 
                        type: 'video', 
                        price: metadata.price || 0 
                      });
                    }} 
                  />
                </div>
                */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Uploaded Songs</h3>
                  <ul>
                    {uploadedSongs.length === 0 ? (
                      <li>No songs uploaded yet.</li>
                    ) : (
                      uploadedSongs.map(song => (
                        <li key={song.id}>{song.metadata.title || song.metadata.name}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'messages' && <MessageManager />}
            
            {activeTab === 'quotes' && <QuoteManager />}

            {activeTab === 'fanart' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Pending Fan Art Submissions</h3>
                {pendingFanArt.length === 0 ? (
                  <p className="text-gray-600">No pending fan art submissions.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingFanArt.map((art: any) => (
                      <div key={art.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                          <img 
                            src={art.image} 
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-lg mb-2">{art.title}</h4>
                          <p className="text-gray-600 mb-1">by {art.artist}</p>
                          {art.email && (
                            <p className="text-gray-500 text-sm mb-1">📧 {art.email}</p>
                          )}
                          {art.social && (
                            <p className="text-gray-500 text-sm mb-2">📱 {art.social}</p>
                          )}
                          {art.description && (
                            <p className="text-gray-700 text-sm mb-3">{art.description}</p>
                          )}
                          <p className="text-gray-400 text-xs mb-3">
                            Submitted: {new Date(art.submittedDate).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveFanArt(art.id)}
                              className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-600 transition"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => rejectFanArt(art.id)}
                              className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-600 transition"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
