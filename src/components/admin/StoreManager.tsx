import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import PayPalPayment from '../payments/PayPalPayment';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'music' | 'merch' | 'digital' | 'ticket';
  category: string;
  image?: string;
  audioFile?: string;
  downloadFile?: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  metadata?: any;
}

const StoreManager: React.FC = () => {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    type: 'music' as 'music' | 'merch' | 'digital' | 'ticket',
    category: '',
    inStock: true,
    featured: false
  });

  const [files, setFiles] = useState({
    image: null as File | null,
    audio: null as File | null,
    download: null as File | null
  });

  const [uploading, setUploading] = useState(false);

  const categories = {
    music: ['Album', 'Single', 'EP', 'Remix', 'Instrumental'],
    merch: ['T-Shirt', 'Hoodie', 'Poster', 'Sticker', 'Accessories', 'Jewelry'],
    digital: ['Wallpaper', 'Sheet Music', 'Stems', 'Behind The Scenes'],
    ticket: ['Concert', 'Meet & Greet', 'Virtual Event', 'Experience']
  };

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'store'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StoreItem[];
      setStoreItems(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching store items:', error);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, `store/${path}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const itemData: any = {
        ...formData,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Upload files
      if (files.image) {
        itemData.image = await uploadFile(files.image, 'images');
      }
      if (files.audio) {
        itemData.audioFile = await uploadFile(files.audio, 'audio');
      }
      if (files.download) {
        itemData.downloadFile = await uploadFile(files.download, 'downloads');
      }

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, 'store', editingItem.id), itemData);
      } else {
        // Add new item
        await addDoc(collection(db, 'store'), itemData);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        type: 'music',
        category: '',
        inStock: true,
        featured: false
      });
      setFiles({ image: null, audio: null, download: null });
      setShowAddForm(false);
      setEditingItem(null);
      fetchStoreItems();
    } catch (error) {
      console.error('Error saving store item:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      type: item.type,
      category: item.category,
      inStock: item.inStock,
      featured: item.featured
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'store', itemId));
        fetchStoreItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const toggleFeatured = async (item: StoreItem) => {
    try {
      await updateDoc(doc(db, 'store', item.id), {
        featured: !item.featured
      });
      fetchStoreItems();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Store Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-lotus text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
        >
          Add New Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Store Item' : 'Add New Store Item'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>                <input
                  type="text"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, type: e.target.value as any, category: ''})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="music">Music</option>
                    <option value="merch">Merchandise</option>
                    <option value="digital">Digital</option>
                    <option value="ticket">Ticket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories[formData.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles({...files, image: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {formData.type === 'music' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Audio File</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles({...files, audio: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Download File (optional)</label>
                <input
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles({...files, download: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, inStock: e.target.checked})}
                    className="mr-2"
                  />
                  In Stock
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2"
                  />
                  Featured
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-red-lotus text-white py-2 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400"
                >
                  {uploading ? 'Uploading...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      title: '', description: '', price: 0, type: 'music', 
                      category: '', inStock: true, featured: false
                    });
                    setFiles({ image: null, audio: null, download: null });
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

      {/* Store Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeItems.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <span className="text-green-600 font-bold">${item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{item.type}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">{item.category}</span>
                {item.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Featured</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleFeatured(item)}
                  className="flex-1 bg-yellow-500 text-white py-1 px-2 rounded text-sm hover:bg-yellow-600"
                >
                  {item.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {storeItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No store items yet. Add your first item to get started!</p>
        </div>
      )}
    </div>
  );
};

export default StoreManager;
