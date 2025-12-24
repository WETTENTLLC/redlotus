import React, { useState, useEffect } from 'react';
import CommunityForum from './CommunityForum';
import { MonitoringService } from '../../monitoring/MonitoringService';

interface TribeExperienceProps {
  tribe: 'red' | 'yellow' | 'blue';
  userEmail?: string;
  userName?: string;
  onThemeChange?: (theme: 'red' | 'yellow' | 'blue') => void;
}

const TribeExperience: React.FC<TribeExperienceProps> = ({ 
  tribe, 
  userEmail, 
  userName, 
  onThemeChange 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'forum' | 'content' | 'events'>('overview');

  const tribeData = {
    red: {
      name: 'Red Lotus Tribe',
      season: 'Winter',
      energy: 'Focused Motivation',
      description: 'Harness the power of winter energy. Focus, determination, and inner strength guide your path.',
      mantra: 'I am focused, I am determined, I am unstoppable.',
      colors: {
        primary: 'bg-red-lotus',
        text: 'text-red-lotus',
        gradient: 'from-red-900 via-red-lotus to-red-600',
        accent: 'border-red-lotus'
      },
      content: {
        playlist: 'Winter Focus Sessions',
        exclusiveTrack: 'Frozen Fire (Red Lotus Exclusive)',
        meditation: '10-Minute Winter Strength Meditation',
        quote: 'In the depths of winter, I finally learned that within me there lay an invincible summer.'
      },
      benefits: [
        'Exclusive Red Lotus tracks and remixes',
        'Winter motivation content',
        'Focus and productivity sessions',
        'Red Tribe community forum',
        'Early access to rap and hip-hop releases'
      ]
    },
    yellow: {
      name: 'Yellow Lotus Tribe',
      season: 'Summer',
      energy: 'Uplifting Positivity',
      description: 'Embrace the warmth of summer energy. Joy, creativity, and boundless optimism light your way.',
      mantra: 'I radiate joy, I create beauty, I inspire others.',
      colors: {
        primary: 'bg-yellow-lotus',
        text: 'text-yellow-lotus',
        gradient: 'from-yellow-400 via-yellow-lotus to-yellow-600',
        accent: 'border-yellow-lotus'
      },
      content: {
        playlist: 'Summer Vibes Collection',
        exclusiveTrack: 'Golden Hour (Yellow Lotus Exclusive)',
        meditation: '15-Minute Joy & Gratitude Practice',
        quote: 'Keep your face always toward the sunshine—and shadows will fall behind you.'
      },
      benefits: [
        'Exclusive Yellow Lotus pop tracks',
        'Summer positivity content',
        'Creative inspiration sessions',
        'Yellow Tribe community forum',
        'Early access to pop and dance releases'
      ]
    },
    blue: {
      name: 'Blue Lotus Tribe',
      season: 'Spring',
      energy: 'Calm Reflection',
      description: 'Find peace in spring renewal. Tranquility, wisdom, and gentle growth nurture your soul.',
      mantra: 'I am at peace, I am wise, I grow with grace.',
      colors: {
        primary: 'bg-blue-lotus',
        text: 'text-blue-lotus',
        gradient: 'from-blue-400 via-blue-lotus to-blue-800',
        accent: 'border-blue-lotus'
      },
      content: {
        playlist: 'Spring Renewal Sessions',
        exclusiveTrack: 'Peaceful Waters (Blue Lotus Exclusive)',
        meditation: '20-Minute Deep Reflection Practice',
        quote: 'In the depth of silence is the voice of God.'
      },
      benefits: [
        'Exclusive Blue Lotus R&B tracks',
        'Spring renewal content',
        'Meditation and mindfulness sessions',
        'Blue Tribe community forum',
        'Early access to R&B and soul releases'
      ]
    }
  };

  const currentTribe = tribeData[tribe];

  useEffect(() => {
    MonitoringService.trackUserAction('tribe_experience_view', 'community', tribe);
  }, [tribe]);

  const handleTabChange = (tab: 'overview' | 'forum' | 'content' | 'events') => {
    setActiveTab(tab);
    MonitoringService.trackUserAction('tribe_tab_change', 'community', `${tribe}_${tab}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tribe Header */}
      <div className={`bg-gradient-to-r ${currentTribe.colors.gradient} rounded-lg p-6 mb-6 text-white`}>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">{currentTribe.name}</h1>
            <p className="text-lg opacity-90">{currentTribe.season} • {currentTribe.energy}</p>
            <p className="mt-2 opacity-80">{currentTribe.description}</p>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-75 mb-1">Daily Mantra</div>
            <div className="italic font-medium">{currentTribe.mantra}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'forum', label: 'Tribe Forum' },
          { key: 'content', label: 'Exclusive Content' },
          { key: 'events', label: 'Tribe Events' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.key
                ? `${currentTribe.colors.primary} text-white`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-black bg-opacity-60 rounded-lg p-6">
          <h2 className={`text-2xl font-bold mb-4 ${currentTribe.colors.text}`}>
            Welcome to the {currentTribe.name}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Tribe Benefits</h3>
              <ul className="space-y-2">
                {currentTribe.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className={`w-2 h-2 ${currentTribe.colors.primary} rounded-full mr-3`}></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Inspirational Quote</h3>
              <blockquote className={`italic text-lg ${currentTribe.colors.text} border-l-4 ${currentTribe.colors.accent} pl-4`}>
                "{currentTribe.content.quote}"
              </blockquote>
            </div>
          </div>

          {!userEmail && (
            <div className="mt-6 p-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
              <p className="text-yellow-200 text-center">
                Join the {currentTribe.name} to unlock exclusive content and connect with your tribe!
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'forum' && (
        <CommunityForum 
          tribe={tribe} 
          userEmail={userEmail} 
          userName={userName} 
        />
      )}

      {activeTab === 'content' && (
        <div className="bg-black bg-opacity-60 rounded-lg p-6">
          <h2 className={`text-2xl font-bold mb-6 ${currentTribe.colors.text}`}>
            Exclusive {currentTribe.name} Content
          </h2>
          
          {userEmail ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-3">🎵 Featured Playlist</h3>
                <p className={`${currentTribe.colors.text} font-medium mb-2`}>{currentTribe.content.playlist}</p>
                <button className={`px-4 py-2 ${currentTribe.colors.primary} text-white rounded hover:opacity-80 transition`}>
                  Listen Now
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-3">🎧 Exclusive Track</h3>
                <p className={`${currentTribe.colors.text} font-medium mb-2`}>{currentTribe.content.exclusiveTrack}</p>
                <button className={`px-4 py-2 ${currentTribe.colors.primary} text-white rounded hover:opacity-80 transition`}>
                  Play Exclusive
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-3">🧘 Meditation</h3>
                <p className={`${currentTribe.colors.text} font-medium mb-2`}>{currentTribe.content.meditation}</p>
                <button className={`px-4 py-2 ${currentTribe.colors.primary} text-white rounded hover:opacity-80 transition`}>
                  Start Session
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-3">📱 Mobile App</h3>
                <p className="text-gray-300 mb-2">Get the Red Lotus app for exclusive tribe features</p>
                <button className={`px-4 py-2 ${currentTribe.colors.primary} text-white rounded hover:opacity-80 transition`}>
                  Download App
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Join the {currentTribe.name} to access exclusive content</p>
              <button 
                onClick={() => onThemeChange?.(tribe)}
                className={`px-6 py-3 ${currentTribe.colors.primary} text-white rounded-lg hover:opacity-80 transition`}
              >
                Join {currentTribe.name}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-black bg-opacity-60 rounded-lg p-6">
          <h2 className={`text-2xl font-bold mb-6 ${currentTribe.colors.text}`}>
            {currentTribe.name} Events
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">Weekly Tribe Meditation</h3>
                  <p className="text-gray-400">Every Sunday at 7 PM EST</p>
                  <p className={`${currentTribe.colors.text} text-sm mt-1`}>Virtual group meditation session</p>
                </div>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">RECURRING</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">{currentTribe.season} Solstice Celebration</h3>
                  <p className="text-gray-400">Coming Soon</p>
                  <p className={`${currentTribe.colors.text} text-sm mt-1`}>Special tribe gathering with exclusive performances</p>
                </div>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">UPCOMING</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">Tribe Member Spotlight</h3>
                  <p className="text-gray-400">Monthly feature</p>
                  <p className={`${currentTribe.colors.text} text-sm mt-1`}>Celebrating amazing tribe members</p>
                </div>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">MONTHLY</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TribeExperience;