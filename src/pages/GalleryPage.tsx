import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-lotus text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Gallery</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Visual journey through the Red Lotus universe
            </p>
          </div>
        </section>

        {/* Behind the Scenes */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-red-lotus">Behind the Scenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Placeholder for behind the scenes images */}
              <div className="bg-gradient-to-br from-red-lotus to-red-700 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🎵</div>
                  <p>Studio Sessions</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-lotus to-yellow-600 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-black text-center">
                  <div className="text-4xl mb-2">🎤</div>
                  <p>Recording Process</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-lotus to-blue-700 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p>Music Videos</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-lotus/80 to-yellow-lotus/80 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p>Photo Shoots</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-lotus/80 to-red-lotus/80 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🎪</div>
                  <p>Live Performances</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-lotus/80 to-blue-lotus/80 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-black text-center">
                  <div className="text-4xl mb-2">✨</div>
                  <p>Creative Process</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fan Art Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Fan Creations</h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
              See amazing artwork created by our community, inspired by the Red Lotus energy and vibration.
            </p>
            <a href="/fan-art" className="inline-block bg-red-lotus text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition">
              View Fan Art Gallery
            </a>
          </div>
        </section>

        {/* Album Artwork */}
        <section className="py-16 bg-gradient-to-b from-red-lotus/20 to-blue-lotus/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-red-lotus">Album Artwork</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              
              {/* Red Lotus Album */}
              <div className="text-center">
                <div className="bg-red-lotus rounded-lg aspect-square mb-4 flex items-center justify-center">
                  <div className="text-white text-6xl">🌸</div>
                </div>
                <h3 className="text-xl font-bold text-red-lotus">Red Lotus</h3>
                <p className="text-gray-600">Winter Collection</p>
              </div>

              {/* Yellow Lotus Album */}
              <div className="text-center">
                <div className="bg-yellow-lotus rounded-lg aspect-square mb-4 flex items-center justify-center">
                  <div className="text-black text-6xl">🌻</div>
                </div>
                <h3 className="text-xl font-bold text-yellow-lotus">Yellow Lotus</h3>
                <p className="text-gray-600">Summer Collection</p>
              </div>

              {/* Blue Lotus Album */}
              <div className="text-center">
                <div className="bg-blue-lotus rounded-lg aspect-square mb-4 flex items-center justify-center">
                  <div className="text-white text-6xl">💙</div>
                </div>
                <h3 className="text-xl font-bold text-blue-lotus">Blue Lotus</h3>
                <p className="text-gray-600">Spring Collection</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default GalleryPage;
