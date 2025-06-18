import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const VibrationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-lotus via-yellow-lotus to-blue-lotus text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Vibration</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Feel the energy that moves through every season of life
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-red-lotus">The Lotus Philosophy</h2>
            <div className="prose prose-lg mx-auto text-center">
              <p className="text-xl mb-8">
                Red Lotus represents the vibration of life itself - the energy that flows through every season, 
                every emotion, and every moment of human experience.
              </p>
              <p className="text-lg mb-8">
                Like the lotus flower that rises from muddy waters to bloom in pure beauty, 
                our music emerges from the full spectrum of life's experiences - the struggles, 
                the joy, the reflection, and the growth.
              </p>
            </div>
          </div>
        </section>

        {/* Energy Colors Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Energy Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              
              {/* Red Energy */}
              <div className="text-center">
                <div className="w-24 h-24 bg-red-lotus rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2 text-red-lotus">Red Energy</h3>
                <p>Winter intensity, focus, and determined drive. The fire within.</p>
              </div>

              {/* Yellow Energy */}
              <div className="text-center">
                <div className="w-24 h-24 bg-yellow-lotus rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2 text-yellow-lotus">Yellow Energy</h3>
                <p>Summer joy, optimism, and radiant positivity. The light that guides.</p>
              </div>

              {/* Blue Energy */}
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-lotus rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2 text-blue-lotus">Blue Energy</h3>
                <p>Spring renewal, peace, and thoughtful reflection. The calm within the storm.</p>
              </div>

              {/* Brown Energy */}
              <div className="text-center">
                <div className="w-24 h-24 bg-amber-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2 text-amber-700">Brown Energy</h3>
                <p>Autumn grounding, stability, and natural harmony. The earth beneath our feet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Vibes */}
        <section className="py-16 bg-red-lotus">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Find Your Vibe</h2>
            <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
              What energy resonates with you today? Explore our music to find the vibration that matches your current state of being.
            </p>
            <div className="space-x-4">
              <a href="/music" className="inline-block bg-white text-red-lotus px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                Explore Music
              </a>
              <a href="/fan-art" className="inline-block bg-yellow-lotus text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-600 transition">
                See Fan Art
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VibrationPage;
