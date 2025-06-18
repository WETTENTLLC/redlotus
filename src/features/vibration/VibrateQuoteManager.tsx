import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface VibeQuote {
  id?: string;
  text: string;
  author: string;
  vibe: 'red' | 'yellow' | 'blue' | 'brown' | 'pink';
  featured: boolean;
  createdAt: Date;
  isActive: boolean;
}

type VibeColor = 'red' | 'yellow' | 'blue' | 'brown' | 'pink';

const vibeColors: { [key in VibeColor]: { name: string; description: string; bgColor: string; textColor: string } } = {
  red: {
    name: 'Red Vibe',
    description: 'Winter energy and focused motivation',
    bgColor: 'bg-red-lotus',
    textColor: 'text-red-lotus'
  },
  yellow: {
    name: 'Yellow Vibe', 
    description: 'Summer energy and uplifting positivity',
    bgColor: 'bg-yellow-lotus',
    textColor: 'text-yellow-lotus'
  },
  blue: {
    name: 'Blue Vibe',
    description: 'Spring renewal and calm reflection', 
    bgColor: 'bg-blue-lotus',
    textColor: 'text-blue-lotus'
  },
  brown: {
    name: 'Brown Vibe',
    description: 'Autumn grounding and earthy connection',
    bgColor: 'bg-brown-lotus',
    textColor: 'text-brown-lotus'
  },
  pink: {
    name: 'Pink Vibe',
    description: 'Love energy and emotional connection',
    bgColor: 'bg-pink-lotus',
    textColor: 'text-pink-lotus'
  }
};

const VibrateQuoteManager: React.FC = () => {
  const [quotes, setQuotes] = useState<VibeQuote[]>([]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('Red Lotus');
  const [selectedVibe, setSelectedVibe] = useState<VibeColor>('red');
  const [featured, setFeatured] = useState(false);
  const [editingQuote, setEditingQuote] = useState<VibeQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'preview'>('add');
  const [filterVibe, setFilterVibe] = useState<VibeColor | 'all'>('all');

  // Fetch quotes
  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'vibeQuotes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedQuotes = querySnapshot.docs.map(doc => {
        return { 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        } as VibeQuote;
      });
      setQuotes(fetchedQuotes);
    } catch (err: any) {
      setError('Error fetching quotes: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Add or update a quote
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingQuote) {
        // Update existing quote
        if (editingQuote.id) {
          await updateDoc(doc(db, 'vibeQuotes', editingQuote.id), {
            text,
            author,
            vibe: selectedVibe,
            featured
          });
          
          // Reset form and editing state
          setEditingQuote(null);
          resetForm();
          
          // Refresh quotes
          fetchQuotes();
        }
      } else {
        // Add new quote
        const quoteData = {
          text,
          author,
          vibe: selectedVibe,
          featured,
          isActive: true,
          createdAt: new Date()
        };
        
        await addDoc(collection(db, 'vibeQuotes'), quoteData);
        resetForm();
        fetchQuotes();
      }
    } catch (err: any) {
      setError('Error saving quote: ' + err.message);
    }
  };

  // Delete a quote
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteDoc(doc(db, 'vibeQuotes', id));
        fetchQuotes();
      } catch (err: any) {
        setError('Error deleting quote: ' + err.message);
      }
    }
  };

  // Edit a quote
  const handleEdit = (quote: VibeQuote) => {
    setEditingQuote(quote);
    setText(quote.text);
    setAuthor(quote.author);
    setSelectedVibe(quote.vibe);
    setFeatured(quote.featured);
    setActiveTab('add');
  };

  // Toggle featured status
  const toggleFeatured = async (quote: VibeQuote) => {
    if (!quote.id) return;
    
    try {
      await updateDoc(doc(db, 'vibeQuotes', quote.id), {
        featured: !quote.featured
      });
      fetchQuotes();
    } catch (err: any) {
      setError('Error updating quote: ' + err.message);
    }
  };

  // Toggle active status
  const toggleActive = async (quote: VibeQuote) => {
    if (!quote.id) return;
    
    try {
      await updateDoc(doc(db, 'vibeQuotes', quote.id), {
        isActive: !quote.isActive
      });
      fetchQuotes();
    } catch (err: any) {
      setError('Error updating quote: ' + err.message);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setText('');
    setAuthor('Red Lotus');
    setSelectedVibe('red');
    setFeatured(false);
  };

  // Get filtered quotes
  const getFilteredQuotes = () => {
    if (filterVibe === 'all') return quotes;
    return quotes.filter(quote => quote.vibe === filterVibe);
  };

  // Get active quotes by vibe for preview
  const getActiveQuotesByVibe = (vibe: VibeColor) => {
    return quotes.filter(quote => quote.vibe === vibe && quote.isActive);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Vibrate Quote Management System</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button 
            className="float-right"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'add'
              ? 'border-b-2 border-red-lotus text-red-lotus'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Add Quote
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'manage'
              ? 'border-b-2 border-red-lotus text-red-lotus'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Manage Quotes
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'preview'
              ? 'border-b-2 border-red-lotus text-red-lotus'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Add Quote Tab */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingQuote ? 'Edit Vibe Quote' : 'Add New Vibe Quote'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Quote Text:</label>
              <textarea
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Enter your inspiring quote..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Author:</label>
              <input
                type="text"
                value={author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-lotus"
                placeholder="Quote author"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vibe Section:</label>
              <select
                value={selectedVibe}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVibe(e.target.value as VibeColor)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-lotus"
              >
                {Object.entries(vibeColors).map(([key, vibe]) => (
                  <option key={key} value={key}>
                    {vibe.name} - {vibe.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeatured(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured quote (will appear prominently)
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-red-lotus text-white rounded-md hover:bg-red-800 transition-colors"
              >
                {editingQuote ? 'Update Quote' : 'Add Quote'}
              </button>
              {editingQuote && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuote(null);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Manage Quotes Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">All Vibe Quotes</h3>
              <div>
                <label className="text-sm font-medium mr-2">Filter by vibe:</label>
                <select
                  value={filterVibe}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterVibe(e.target.value as VibeColor | 'all')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Vibes</option>
                  {Object.entries(vibeColors).map(([key, vibe]) => (
                    <option key={key} value={key}>
                      {vibe.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">Loading quotes...</div>
            ) : getFilteredQuotes().length === 0 ? (
              <div className="text-center py-8 text-gray-500">No quotes found</div>
            ) : (
              <div className="space-y-4">
                {getFilteredQuotes().map((quote) => (
                  <div 
                    key={quote.id} 
                    className={`p-4 border rounded-lg ${
                      quote.featured ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
                    } ${!quote.isActive ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${vibeColors[quote.vibe].bgColor}`}>
                          {vibeColors[quote.vibe].name}
                        </span>
                        {quote.featured && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {!quote.isActive && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => toggleActive(quote)}
                          className={`px-2 py-1 text-xs rounded ${
                            quote.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {quote.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => toggleFeatured(quote)}
                          className={`px-2 py-1 text-xs rounded ${
                            quote.featured 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {quote.featured ? 'Featured' : 'Regular'}
                        </button>
                        <button
                          onClick={() => handleEdit(quote)}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => quote.id && handleDelete(quote.id)}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <blockquote className="text-lg italic mb-2">"{quote.text}"</blockquote>
                    <p className="text-sm text-gray-600">— {quote.author}</p>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Added: {quote.createdAt.toLocaleDateString()} at {quote.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-center">Live Vibe Sections Preview</h3>
          
          {Object.entries(vibeColors).map(([vibeKey, vibeInfo]) => {
            const vibeQuotes = getActiveQuotesByVibe(vibeKey as VibeColor);
            const featuredQuote = vibeQuotes.find(q => q.featured);
            const displayQuote = featuredQuote || vibeQuotes[0];
            
            return (
              <div key={vibeKey} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`${vibeInfo.bgColor} text-white p-4`}>
                  <h4 className="text-xl font-bold">{vibeInfo.name}</h4>
                  <p className="text-sm opacity-90">{vibeInfo.description}</p>
                </div>
                
                <div className="p-6">
                  {displayQuote ? (
                    <div className="text-center">
                      <blockquote className="text-xl italic mb-4">
                        "{displayQuote.text}"
                      </blockquote>
                      <p className="text-gray-600">— {displayQuote.author}</p>
                      {displayQuote.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Featured Quote
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No active quotes for this vibe section</p>
                      <button
                        onClick={() => {
                          setSelectedVibe(vibeKey as VibeColor);
                          setActiveTab('add');
                        }}
                        className="mt-2 px-4 py-2 bg-red-lotus text-white rounded-md hover:bg-red-800 transition-colors"
                      >
                        Add Quote for {vibeInfo.name}
                      </button>
                    </div>
                  )}
                  
                  {vibeQuotes.length > 1 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Other active quotes ({vibeQuotes.length - 1}):
                      </h5>
                      <div className="space-y-2">
                        {vibeQuotes.filter(q => q.id !== displayQuote?.id).slice(0, 3).map((quote) => (
                          <div key={quote.id} className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3">
                            "{quote.text}" — {quote.author}
                          </div>
                        ))}
                        {vibeQuotes.length > 4 && (
                          <p className="text-xs text-gray-500">
                            ...and {vibeQuotes.length - 4} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VibrateQuoteManager;
