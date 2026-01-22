import React from 'react';

interface TribeExperienceProps {
  tribe: 'red' | 'yellow' | 'blue';
  isActive: boolean;
}

const TribeExperience: React.FC<TribeExperienceProps> = ({ tribe, isActive }) => {
  const tribeData = {
    red: {
      name: 'Red Lotus Tribe',
      season: 'Winter',
      energy: 'Focus & Determination',
      motto: 'Embrace the cold, ignite your fire within',
      benefits: [
        'Exclusive winter-themed content',
        'Focus and motivation sessions',
        'Early access to rap & hip-hop tracks',
        'Strength-building community challenges'
      ],
      bgGradient: 'from-red-900 via-red-600 to-red-400',
      textColor: 'text-red-100',
      accentColor: 'text-red-300'
    },
    yellow: {
      name: 'Yellow Lotus Tribe',
      season: 'Summer',
      energy: 'Joy & Positivity',
      motto: 'Shine bright like the summer sun',
      benefits: [
        'Uplifting summer vibes content',
        'Daily positivity boosts',
        'First listen to pop & dance tracks',
        'Fun community events & challenges'
      ],
      bgGradient: 'from-yellow-900 via-yellow-500 to-yellow-300',
      textColor: 'text-yellow-100',
      accentColor: 'text-yellow-300'
    },
    blue: {
      name: 'Blue Lotus Tribe',
      season: 'Spring',
      energy: 'Renewal & Peace',
      motto: 'Flow like water, bloom like spring',
      benefits: [
        'Spring renewal and growth content',
        'Meditation and mindfulness sessions',
        'Exclusive R&B & soul previews',
        'Personal growth community support'
      ],
      bgGradient: 'from-blue-900 via-blue-600 to-blue-400',
      textColor: 'text-blue-100',
      accentColor: 'text-blue-300'
    }
  };

  if (!isActive) return null;

  const currentTribe = tribeData[tribe];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className={`bg-gradient-to-br ${currentTribe.bgGradient} rounded-2xl p-8 shadow-2xl border border-white/20`}>
        <div className="text-center mb-8">
          <h2 className={`text-4xl font-bold ${currentTribe.textColor} mb-2`}>
            Welcome to the {currentTribe.name}
          </h2>
          <div className={`text-xl ${currentTribe.accentColor} mb-4`}>
            {currentTribe.season} • {currentTribe.energy}
          </div>
          <p className={`text-lg ${currentTribe.textColor} italic`}>
            "{currentTribe.motto}"
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className={`text-2xl font-bold ${currentTribe.textColor} mb-4`}>
              Your Tribe Benefits
            </h3>
            <ul className="space-y-3">
              {currentTribe.benefits.map((benefit, index) => (
                <li key={index} className={`${currentTribe.textColor} flex items-center gap-3`}>
                  <span className="text-2xl">{benefit.split(' ')[0]}</span>
                  <span>{benefit.substring(benefit.indexOf(' ') + 1)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className={`text-2xl font-bold ${currentTribe.textColor} mb-4`}>
              Tribe Stats
            </h3>
            <div className="space-y-3">
              <div className={`${currentTribe.textColor} flex justify-between`}>
                <span>Active Members:</span>
                <span className={currentTribe.accentColor}>1,247</span>
              </div>
              <div className={`${currentTribe.textColor} flex justify-between`}>
                <span>Posts This Week:</span>
                <span className={currentTribe.accentColor}>89</span>
              </div>
              <div className={`${currentTribe.textColor} flex justify-between`}>
                <span>Your Tribe Level:</span>
                <span className={currentTribe.accentColor}>Newcomer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full ${currentTribe.textColor}`}>
            <span>Your personalized {tribe} lotus experience is now active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TribeExperience;