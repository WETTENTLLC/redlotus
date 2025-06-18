import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const MusicPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-red-lotus text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Red Lotus Music</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Experience the sound across all seasons of life
            </p>
          </div>
        </section>

        {/* Music Sections */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Red Lotus - Winter/Rap */}
              <div className="bg-red-lotus rounded-lg p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Red Lotus</h3>
                <p className="mb-6">Winter energy and focused motivation. Raw rap and intense beats for those moments of drive and determination.</p>
                <div className="space-y-2">
                  <a href="#" className="block bg-white text-red-lotus py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Listen on Spotify
                  </a>
                  <a href="#" className="block bg-white text-red-lotus py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Apple Music
                  </a>
                </div>
              </div>

              {/* Yellow Lotus - Summer/Pop */}
              <div className="bg-yellow-lotus rounded-lg p-6 text-black text-center">
                <h3 className="text-2xl font-bold mb-4">Yellow Lotus</h3>
                <p className="mb-6">Summer energy and uplifting positivity. Bright pop melodies for your most joyful moments.</p>
                <div className="space-y-2">
                  <a href="#" className="block bg-white text-yellow-lotus py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Listen on Spotify
                  </a>
                  <a href="#" className="block bg-white text-yellow-lotus py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Apple Music
                  </a>
                </div>
              </div>

              {/* Blue Lotus - Spring/R&B */}
              <div className="bg-blue-lotus rounded-lg p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Blue Lotus</h3>
                <p className="mb-6">Spring renewal and calm reflection. Smooth R&B vibes perfect for thoughtful, peaceful times.</p>
                <div className="space-y-2">
                  <a href="#" className="block bg-white text-blue-lotus py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Listen on Spotify
                  </a>
                  <a href="#" className="block bg-white text-blue-lotus py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Apple Music
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Releases */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Latest Releases</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-xl mb-8">
                Stay tuned for new music across all the lotus seasons. Follow us on social media for the latest updates and exclusive previews.
              </p>
              <div className="text-center">
                <a href="/#social" className="inline-block bg-red-lotus text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition">
                  Follow for Updates
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MusicPage;
