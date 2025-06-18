import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'quote' | 'behind-scenes' | 'artist-photo';
  targetSection: 'hut' | 'music' | 'vibrate' | 'tribe' | 'bts' | 'store' | 'live';
  content: string; // URL for images, text for quotes
  isActive: boolean;
  order: number;
  createdAt: string;
  metadata?: any;
}

const ContentManager: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image' as 'image' | 'quote' | 'behind-scenes' | 'artist-photo',
    targetSection: 'hut' as 'hut' | 'music' | 'vibrate' | 'tribe' | 'bts' | 'store' | 'live',
    content: '',
    isActive: true,
    order: 0
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const contentTypes = {
    image: 'General Image',
    quote: 'Inspirational Quote',
    'behind-scenes': 'Behind The Scenes',
    'artist-photo': 'Artist Photo'
  };

  const sections = {
    hut: 'HUT (Homepage)',
    music: 'MUSIC Section',
    vibrate: 'VIBRATE Section',
    tribe: 'TRIBE Section',
    bts: 'BEHIND THE SCENES',
    store: 'STORE Section',
    live: 'LIVE Shows'
  };

  useEffect(() => {
    fetchContentItems();
  }, []);

  const fetchContentItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'content'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentItem[];
      setContentItems(items.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching content items:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `content/${formData.type}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let content = formData.content;

      // Upload file if it's an image type and file is selected
      if ((formData.type === 'image' || formData.type === 'behind-scenes' || formData.type === 'artist-photo') && selectedFile) {
        content = await uploadFile(selectedFile);
      }

      const itemData: any = {
        ...formData,
        content,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, 'content', editingItem.id), itemData);
      } else {
        // Add new item
        await addDoc(collection(db, 'content'), itemData);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'image',
        targetSection: 'hut',
        content: '',
        isActive: true,
        order: 0
      });
      setSelectedFile(null);
      setShowAddForm(false);
      setEditingItem(null);
      fetchContentItems();
    } catch (error) {
      console.error('Error saving content item:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      targetSection: item.targetSection,
      content: item.content,
      isActive: item.isActive,
      order: item.order
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this content item?')) {
      try {
        await deleteDoc(doc(db, 'content', itemId));
        fetchContentItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const toggleActive = async (item: ContentItem) => {
    try {
      await updateDoc(doc(db, 'content', item.id), {
        isActive: !item.isActive
      });
      fetchContentItems();
    } catch (error) {
      console.error('Error updating active status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-lotus text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
        >
          Add New Content
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Content Item' : 'Add New Content Item'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Content Type</label>
                  <select
                    value={formData.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {Object.entries(contentTypes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Target Section</label>
                  <select
                    value={formData.targetSection}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, targetSection: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {Object.entries(sections).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.type === 'quote' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Quote Text</label>
                  <textarea
                    value={formData.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md h-24"
                    placeholder="Enter the inspirational quote here..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {formData.type === 'image' ? 'Image File' : 
                     formData.type === 'behind-scenes' ? 'Behind The Scenes Photo' : 
                     'Artist Photo'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border rounded-md"
                    required={!editingItem}
                  />
                  {editingItem && formData.content && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Current image:</p>
                      <img src={formData.content} alt={formData.title} className="w-32 h-32 object-cover rounded" />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    Active (visible on site)
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-red-lotus text-white py-2 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400"
                >
                  {uploading ? 'Uploading...' : (editingItem ? 'Update Content' : 'Add Content')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      title: '', description: '', type: 'image', targetSection: 'hut', 
                      content: '', isActive: true, order: 0
                    });
                    setSelectedFile(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Items List */}
      <div className="space-y-4">
        {Object.entries(sections).map(([sectionKey, sectionLabel]) => {
          const sectionItems = contentItems.filter(item => item.targetSection === sectionKey);
          if (sectionItems.length === 0) return null;

          return (
            <div key={sectionKey} className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-lotus">{sectionLabel}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectionItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {item.type === 'quote' ? (
                      <p className="text-sm text-gray-600 italic mb-2">"{item.content.substring(0, 100)}..."</p>
                    ) : (
                      <img src={item.content} alt={item.title} className="w-full h-24 object-cover rounded mb-2" />
                    )}
                    
                    <div className="flex gap-1 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {contentTypes[item.type]}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        Order: {item.order}
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(item)}
                        className="flex-1 bg-yellow-500 text-white py-1 px-2 rounded text-xs hover:bg-yellow-600"
                      >
                        {item.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {contentItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No content items yet. Add your first piece of content to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
