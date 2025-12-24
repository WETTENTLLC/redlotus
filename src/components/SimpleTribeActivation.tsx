import React from 'react';

interface SimpleTribeActivationProps {
  onTribeSelect: (tribe: 'red' | 'yellow' | 'blue') => void;
  currentTribe?: 'red' | 'yellow' | 'blue' | null;
}

const SimpleTribeActivation: React.FC<SimpleTribeActivationProps> = ({ onTribeSelect, currentTribe }) => {
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Tribe</h2>
        <p className="text-lg mb-6">Select your lotus tribe to unlock personalized experiences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(tribes).map(([key, tribe]) => (
          <div
            key={key}
            className={`p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
              currentTribe === key 
                ? `${tribe.color} border-4 border-white shadow-lg` 
                : 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600'
            }`}
            onClick={() => onTribeSelect(key as 'red' | 'yellow' | 'blue')}
          >
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${tribe.color} flex items-center justify-center`}>
                <span className="text-2xl">🪷</span>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${currentTribe === key ? 'text-white' : 'text-gray-200'}`}>
                {tribe.name}
              </h3>
              <p className={`text-sm mb-2 ${currentTribe === key ? 'text-gray-100' : 'text-gray-400'}`}>
                {tribe.season}
              </p>
              <p className={`text-sm ${currentTribe === key ? 'text-gray-200' : 'text-gray-500'}`}>
                {tribe.description}
              </p>
              {currentTribe === key && (
                <div className="mt-4 text-white font-bold">
                  ✓ Active Tribe
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

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