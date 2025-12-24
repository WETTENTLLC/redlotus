import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface SimpleTribeActivationProps {
  onTribeSelect: (tribe: 'red' | 'yellow' | 'blue') => void;
  currentTribe?: 'red' | 'yellow' | 'blue' | null;
}

const SimpleTribeActivation: React.FC<SimpleTribeActivationProps> = ({ onTribeSelect, currentTribe }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedTribe, setSelectedTribe] = useState<'red' | 'yellow' | 'blue' | null>(null);

  const tribes = {
    red: {
      name: 'Red Lotus',
      season: 'Winter',
      description: 'Focus & Determination',
      color: 'bg-red-600',
      textColor: 'text-red-100'
    },
    yellow: {
      name: 'Yellow Lotus', 
      season: 'Summer',
      description: 'Joy & Positivity',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-100'
    },
    blue: {
      name: 'Blue Lotus',
      season: 'Spring', 
      description: 'Peace & Renewal',
      color: 'bg-blue-600',
      textColor: 'text-blue-100'
    }
  };

  const handleJoinTribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTribe || !email) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Add to subscriptions
      await addDoc(collection(db, 'subscriptions'), {
        email: email.trim(),
        tribe: selectedTribe,
        timestamp: new Date(),
        subscribed: true
      });
      
      setSubmitStatus('success');
      onTribeSelect(selectedTribe);
      setEmail('');
      
    } catch (error) {
      console.error('Error joining tribe:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Tribe</h2>
        <p className="text-lg mb-6">Select your lotus tribe to unlock personalized experiences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(tribes).map(([key, tribe]) => (
          <div
            key={key}
            className={`p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedTribe === key 
                ? `${tribe.color} border-4 border-white shadow-lg` 
                : 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600'
            }`}
            onClick={() => setSelectedTribe(key as 'red' | 'yellow' | 'blue')}
          >
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${tribe.color} flex items-center justify-center`}>
                <span className="text-2xl">🪷</span>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${selectedTribe === key ? 'text-white' : 'text-gray-200'}`}>
                {tribe.name}
              </h3>
              <p className={`text-sm mb-2 ${selectedTribe === key ? 'text-gray-100' : 'text-gray-400'}`}>
                {tribe.season}
              </p>
              <p className={`text-sm ${selectedTribe === key ? 'text-gray-200' : 'text-gray-500'}`}>
                {tribe.description}
              </p>
              {selectedTribe === key && (
                <div className="mt-4 text-white font-bold">
                  ✓ Selected
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTribe && (
        <div className="bg-black/60 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Join the {tribes[selectedTribe].name} Tribe
          </h3>
          
          <form onSubmit={handleJoinTribe} className="max-w-md mx-auto">
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-white focus:outline-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${
                isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : `${tribes[selectedTribe].color} hover:opacity-80`
              }`}
            >
              {isSubmitting ? 'Joining...' : `Join ${tribes[selectedTribe].name} Tribe`}
            </button>
            
            {submitStatus === 'success' && (
              <div className="mt-4 text-green-400 text-center">
                ✅ Successfully joined the {tribes[selectedTribe].name} tribe!
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mt-4 text-red-400 text-center">
                ❌ Error joining the tribe. Please try again.
              </div>
            )}
          </form>
        </div>
      )}

      {currentTribe && (
        <div className="mt-8 text-center">
          <div className={`inline-block px-6 py-3 ${tribes[currentTribe].color} text-white rounded-full`}>
            🎵 {tribes[currentTribe].name} tribe activated! 🎵
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTribeActivation;