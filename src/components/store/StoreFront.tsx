import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
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
}

const StoreFront: React.FC = () => {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'music' | 'merch' | 'digital' | 'ticket'>('all');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const q = query(
        collection(db, 'store'),
        where('inStock', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StoreItem[];
      
      // Sort by featured first, then by creation date
      const sortedItems = items.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      
      setStoreItems(sortedItems);
    } catch (error) {
      console.error('Error fetching store items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? storeItems 
    : storeItems.filter(item => item.type === selectedCategory);

  const handlePurchase = (item: StoreItem) => {
    setSelectedItem(item);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (details: any) => {
    console.log('Purchase successful:', details, selectedItem);
    // Here you would handle the successful purchase
    // - Send download links
    // - Update inventory
    // - Send confirmation email
    setShowPayment(false);
    setSelectedItem(null);
    alert('Purchase successful! Check your email for download links.');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setShowPayment(false);
    alert('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-lotus"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { key: 'all', label: 'All Items' },
          { key: 'music', label: 'Music' },
          { key: 'merch', label: 'Merchandise' },
          { key: 'digital', label: 'Digital' },
          { key: 'ticket', label: 'Tickets' }
        ].map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key as any)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === category.key
                ? 'bg-red-lotus text-white'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-black bg-opacity-50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                {item.featured && (
                  <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold">
                    FEATURED
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm mb-3">{item.description}</p>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                  {item.type.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">
                  {item.category}
                </span>
              </div>
              
              {item.type === 'music' && item.audioFile && (
                <div className="mb-3">
                  <audio 
                    controls 
                    className="w-full"
                    preload="metadata"
                  >
                    <source src={item.audioFile} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold text-xl">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handlePurchase(item)}
                  className="bg-red-lotus text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition font-bold"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-white">
          <p>No items available in this category yet.</p>
        </div>
      )}

      {/* PayPal Payment Modal */}
      {showPayment && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Complete Purchase
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <strong>{selectedItem.title}</strong>
              </p>
              <p className="text-gray-600 mb-2">
                {selectedItem.description}
              </p>
              <p className="text-lg font-bold text-green-600">
                ${selectedItem.price.toFixed(2)}
              </p>
            </div>
            
            <PayPalPayment
              amount={selectedItem.price}
              productTitle={selectedItem.title}
              productType={selectedItem.type === 'music' ? 'music' : 'ticket'}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            <button
              onClick={() => {
                setShowPayment(false);
                setSelectedItem(null);
              }}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Social Media Links */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">Follow Us</h3>
        <div className="flex justify-center gap-6">
          <a 
            href="https://tiktok.com/@redlotusofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-lotus text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition"
          >
            TikTok
          </a>
          <a 
            href="https://instagram.com/redlotusofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-lotus text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition"
          >
            Instagram
          </a>
          <a 
            href="https://twitter.com/redlotusofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-lotus text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition"
          >
            Twitter
          </a>
          <a 
            href="https://youtube.com/@redlotusofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-lotus text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition"
          >
            YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoreFront;
