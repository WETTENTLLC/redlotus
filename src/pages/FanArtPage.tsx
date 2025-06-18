import React from 'react';
import { FanArtGallery } from '../features/fanart/FanArtGallery';

const FanArtPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-lotus/30 to-black">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-white">Lotus Fan Art</h1>
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xl text-white/90">
            A showcase of incredible artwork created by our amazing community. 
            Share your own Red Lotus-inspired creations and connect with fellow fans.
          </p>
        </div>
        
        <FanArtGallery />
      </div>
    </div>
  );
};

export default FanArtPage;