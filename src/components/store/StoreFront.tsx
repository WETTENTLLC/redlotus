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

  return (    <div className="space-y-4 md:space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center px-2">
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
            className={`px-3 py-2 md:px-4 text-sm md:text-base rounded-full transition touch-manipulation ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-black bg-opacity-50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition touch-manipulation">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-32 md:h-48 object-cover"
              />
            )}
            <div className="p-3 md:p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm md:text-lg text-white line-clamp-2">{item.title}</h3>
                {item.featured && (
                  <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold ml-2 flex-shrink-0">
                    FEATURED
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-xs md:text-sm mb-3 line-clamp-2">{item.description}</p>
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
                    className="w-full h-8 md:h-auto"
                    preload="metadata"
                  >
                    <source src={item.audioFile} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold text-lg md:text-xl">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handlePurchase(item)}
                  className="bg-red-lotus text-white px-3 py-2 md:px-4 rounded-full hover:bg-opacity-80 transition font-bold text-sm md:text-base touch-manipulation"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 md:py-12 text-white">
          <p className="text-sm md:text-base">No items available in this category yet.</p>
        </div>
      )}

      {/* PayPal Payment Modal */}
      {showPayment && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto mobile-scroll">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Complete Purchase
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <strong>{selectedItem.title}</strong>
              </p>
              <p className="text-gray-600 mb-2 text-sm md:text-base">
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
              className="mt-4 w-full bg-gray-200 text-gray-800 py-3 px-4 rounded hover:bg-gray-300 transition touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Social Media Links */}
      <div className="text-center">
        <h3 className="text-lg md:text-2xl font-bold mb-4 text-white">Follow Us</h3>
        <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
          <a 
            href="https://www.tiktok.com/@red_lotus_music" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-lotus text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-opacity-80 transition text-sm md:text-base touch-manipulation"
          >
            TikTok
          </a>
          <a 
            href="https://www.instagram.com/red.lotus.music/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-lotus text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-opacity-80 transition text-sm md:text-base touch-manipulation"
          >
            Instagram
          </a>
          <a 
            href="https://www.youtube.com/@Red-Lotus-Music" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-lotus text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-opacity-80 transition text-sm md:text-base touch-manipulation"
          >
            YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoreFront;
