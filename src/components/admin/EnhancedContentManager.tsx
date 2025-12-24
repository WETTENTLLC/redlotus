import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { LocalStorageService } from '../../services/LocalStorageService';
import lotusLogo from '../../assets/lotus-each-album.png';

interface ContentPost {
  id: string;
  title: string;
  description?: string;
  content: string;
  type: 'image' | 'quote' | 'announcement' | 'music' | 'video' | 'behind-scenes';
  targetSection: 'hut' | 'music' | 'vibrate' | 'tribe' | 'bts' | 'store' | 'live' | 'community';
  targetTribe?: 'red' | 'yellow' | 'blue' | 'all';
  isActive: boolean;
  isPinned: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  metadata?: any;
}

const EnhancedContentManager: React.FC = () => {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState<ContentPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedTribe, setSelectedTribe] = useState<string>('all');
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'announcement' as ContentPost['type'],
    targetSection: 'hut' as ContentPost['targetSection'],
    targetTribe: 'all' as ContentPost['targetTribe'],
    isActive: true,
    isPinned: false,
    order: 0,
    tags: [] as string[],
    author: 'Red Lotus'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');

  const contentTypes = {
    announcement: '📢 Announcement',
    image: '🖼️ Image Post',
    quote: '💭 Inspirational Quote',
    music: '🎵 Music Content',
    video: '🎬 Video Content',
    'behind-scenes': '🎭 Behind The Scenes'
  };

  const sections = {
    hut: '🏠 HUT (Homepage)',
    music: '🎵 MUSIC Section',
    vibrate: '✨ VIBRATE Section', 
    tribe: '🌸 TRIBE Section',
    community: '👥 COMMUNITY Forum',
    bts: '🎭 BEHIND THE SCENES',
    store: '🛍️ STORE Section',
    live: '🎤 LIVE Shows'
  };

  const tribes = {
    all: '🌈 All Tribes',
    red: '❄️ Red Lotus (Winter)',
    yellow: '☀️ Yellow Lotus (Summer)',
    blue: '🌸 Blue Lotus (Spring)'
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Use localStorage only - bypass Firebase completely
      const localPosts = LocalStorageService.getPostsByType('admin');
      const formattedPosts: ContentPost[] = localPosts.map(post => ({
        id: post.id,
        title: post.title,
        description: '',
        content: post.content,
        type: 'announcement' as any,
        targetSection: (post.section || 'hut') as any,
        targetTribe: post.tribe,
        isActive: post.isActive,
        isPinned: post.isPinned || false,
        order: 0,
        createdAt: post.timestamp,
        updatedAt: post.timestamp,
        author: post.author,
        tags: [],
        metadata: {}
      }));
      
      console.log('📊 Loaded posts from localStorage:', formattedPosts.length);
      setPosts(formattedPosts);
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `content-posts/${formData.type}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Use localStorage only - bypass Firebase completely
      if (editingPost) {
        LocalStorageService.updatePost(editingPost.id, {
          title: formData.title,
          content: formData.content,
          author: formData.author,
          type: 'admin',
          section: formData.targetSection,
          tribe: formData.targetTribe,
          isActive: formData.isActive,
          isPinned: formData.isPinned
        });
      } else {
        LocalStorageService.addPost({
          title: formData.title,
          content: formData.content,
          author: formData.author,
          type: 'admin',
          section: formData.targetSection,
          tribe: formData.targetTribe,
          isActive: formData.isActive,
          isPinned: formData.isPinned
        });
      }
      
      console.log('✅ Post saved successfully:', {
        section: formData.targetSection,
        tribe: formData.targetTribe,
        title: formData.title,
        isActive: formData.isActive
      });

      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('❌ Error saving post:', error);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', content: '', type: 'announcement',
      targetSection: 'hut', targetTribe: 'all', isActive: true, isPinned: false,
      order: 0, tags: [], author: 'Red Lotus'
    });
    setSelectedFile(null);
    setTagInput('');
    setShowAddForm(false);
    setEditingPost(null);
  };

  const handleEdit = (post: ContentPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description || '',
      content: post.content,
      type: post.type,
      targetSection: post.targetSection,
      targetTribe: post.targetTribe || 'all',
      isActive: post.isActive,
      isPinned: post.isPinned,
      order: post.order,
      tags: post.tags || [],
      author: post.author
    });
    setShowAddForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        LocalStorageService.deletePost(postId);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const toggleActive = async (post: ContentPost) => {
    try {
      LocalStorageService.updatePost(post.id, {
        isActive: !post.isActive
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const togglePin = async (post: ContentPost) => {
    try {
      LocalStorageService.updatePost(post.id, {
        isPinned: !post.isPinned
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating pin status:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const filteredPosts = posts.filter(post => {
    const sectionMatch = selectedSection === 'all' || post.targetSection === selectedSection;
    const tribeMatch = selectedTribe === 'all' || post.targetTribe === selectedTribe || post.targetTribe === 'all';
    return sectionMatch && tribeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-lotus via-yellow-lotus to-blue-lotus p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={lotusLogo} alt="Lotus" className="w-12 h-10 filter brightness-0 invert" />
            <div>
              <h2 className="text-3xl font-bold">Content Management System</h2>
              <p className="text-white/90">Create and manage content for all sections and tribes</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-white text-red-lotus px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            ✨ Create New Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Section:</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Sections</option>
              {Object.entries(sections).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Tribe:</label>
            <select
              value={selectedTribe}
              onChange={(e) => setSelectedTribe(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {Object.entries(tribes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto">
            <div className="text-sm text-gray-600">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-red-lotus">
              {editingPost ? '✏️ Edit Post' : '✨ Create New Post'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">📝 Post Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                    placeholder="Enter an engaging title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">👤 Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">📄 Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg h-24 focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                  placeholder="Brief description of the post..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">📋 Content Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                  >
                    {Object.entries(contentTypes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">🎯 Target Section</label>
                  <select
                    value={formData.targetSection}
                    onChange={(e) => setFormData({...formData, targetSection: e.target.value as any})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                  >
                    {Object.entries(sections).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">🌸 Target Tribe</label>
                  <select
                    value={formData.targetTribe}
                    onChange={(e) => setFormData({...formData, targetTribe: e.target.value as any})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                  >
                    {Object.entries(tribes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content Input */}
              {formData.type === 'quote' || formData.type === 'announcement' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {formData.type === 'quote' ? '💭 Quote Text' : '📢 Announcement Content'}
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg h-32 focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                    placeholder={formData.type === 'quote' ? 'Enter inspirational quote...' : 'Enter announcement content...'}
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📁 Upload {formData.type === 'image' ? 'Image' : formData.type === 'video' ? 'Video' : 'Media File'}
                  </label>
                  <input
                    type="file"
                    accept={formData.type === 'image' ? 'image/*' : formData.type === 'video' ? 'video/*' : '*/*'}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                    required={!editingPost}
                  />
                  {editingPost && formData.content && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Current file:</p>
                      {formData.type === 'image' ? (
                        <img src={formData.content} alt={formData.title} className="w-48 h-32 object-cover rounded-lg" />
                      ) : (
                        <a href={formData.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View current file
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">🏷️ Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                    placeholder="Add tags..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">📊 Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-lotus focus:border-transparent"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-3 w-4 h-4"
                    />
                    ✅ Active (visible on site)
                  </label>
                </div>

                <div className="flex items-center pt-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      className="mr-3 w-4 h-4"
                    />
                    📌 Pin to top
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-red-lotus text-white py-3 px-6 rounded-lg font-bold hover:bg-opacity-90 disabled:bg-gray-400 transition"
                >
                  {uploading ? '⏳ Publishing...' : (editingPost ? '💾 Update Post' : '🚀 Publish Post')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No posts found</h3>
            <p className="text-gray-500">Create your first post to get started!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
              post.isPinned ? 'border-l-yellow-500 bg-yellow-50' : 
              post.isActive ? 'border-l-green-500' : 'border-l-red-500 bg-gray-50'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    {post.isPinned && <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">📌 PINNED</span>}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      post.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {post.isActive ? '✅ LIVE' : '❌ DRAFT'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {contentTypes[post.type]}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {sections[post.targetSection]}
                    </span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tribes[post.targetTribe || 'all']}
                    </span>
                  </div>

                  {post.description && (
                    <p className="text-gray-600 mb-3">{post.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👤 {post.author}</span>
                    <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>📊 Order: {post.order}</span>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => togglePin(post)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition"
                  >
                    {post.isPinned ? '📌' : '📍'}
                  </button>
                  <button
                    onClick={() => toggleActive(post)}
                    className={`px-3 py-2 rounded text-sm transition ${
                      post.isActive 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {post.isActive ? '👁️‍🗨️ Hide' : '👁️ Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              {post.type === 'quote' || post.type === 'announcement' ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="italic text-gray-700">"{post.content.substring(0, 200)}..."</p>
                </div>
              ) : post.type === 'image' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <img src={post.content} alt={post.title} className="w-48 h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedContentManager;