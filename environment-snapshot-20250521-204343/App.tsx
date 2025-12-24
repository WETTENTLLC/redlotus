import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// Import images
import lotusForEachAlbum from './assets/lotus-each-album.png';
import redLotusAlbumRap from './assets/red-lotus-album-rap.jpeg';
import yellowLotusAlbumPop from './assets/yellow-lotus-album-pop.jpeg'; 
import blueLotusAlbumRnb from './assets/blue-lotus-album-rnb.jpeg';
import redLotusImage from './assets/red-lotus-image.png';
import yellowLotusImage from './assets/yellow-lotus-image.png';
import blueLotusImage from './assets/blue-lotus-image.png';
import brownLotusImage from './assets/brown-lotus-image.png';
import pinkLotusImageJPEG from './assets/pink-lotus-image.JPEG';
import behindTheScenesMain from './assets/behind-the-scenes-main-image.JPEG';
import behindTheScenes2 from './assets/behind-the-scenes-image2.JPEG';
import behindTheScenes3 from './assets/behind-the-scenes-image3.JPEG';
import artistMain from './assets/artist-image-main.JPEG';
import artistImage1 from './assets/aritst-image1.JPEG';
import artistImage2 from './assets/artist-image2.JPEG';
import artistImage3 from './assets/artist-image3.JPEG';
import artistImage4 from './assets/artist-image4.JPEG';
import artistSecondaryLogo from './assets/artist-secondary-logo-image.jpeg';

// Navigation sections
type SectionName = 'hut' | 'music' | 'vibrate' | 'tribe' | 'bts' | 'store' | 'live' | 'admin';

function App() {
  const { currentUser, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionName>('hut');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Theme state for the different lotus colors
  const [activeTheme, setActiveTheme] = useState<'red' | 'yellow' | 'blue'>('red');
  
  // Define theme colors for styling elements
  const themeColors = {
    red: {
      bg: 'bg-red-lotus',
      text: 'text-red-lotus',
      name: 'Red',
      description: 'Winter energy and focused motivation.',
      album: redLotusAlbumRap,
      image: redLotusImage
    },
    yellow: {
      bg: 'bg-yellow-lotus',
      text: 'text-yellow-lotus',
      name: 'Yellow',
      description: 'Summer energy and uplifting positivity.',
      album: yellowLotusAlbumPop,
      image: yellowLotusImage
    },
    blue: {
      bg: 'bg-blue-lotus',
      text: 'text-blue-lotus',
      name: 'Blue',
      description: 'Spring renewal and calm reflection.',
      album: blueLotusAlbumRnb,
      image: blueLotusImage
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (window.location.pathname === '/login' || window.location.pathname === '/admin') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={currentUser ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="App lotus-bg">
      <header className="flex flex-col items-center py-4">
        <div className="w-full flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold text-white">RED LOTUS</h1>
          
          <nav className="flex gap-6 text-xl font-bold text-white">
            <button 
              onClick={() => setActiveSection('hut')} 
              className={`hover:underline ${activeSection === 'hut' ? 'underline' : ''}`}
            >
              HUT
            </button>
            <button 
              onClick={() => setActiveSection('music')} 
              className={`hover:underline ${activeSection === 'music' ? 'underline' : ''}`}
            >
              MUSIC
            </button>
            <button 
              onClick={() => setActiveSection('vibrate')} 
              className={`hover:underline ${activeSection === 'vibrate' ? 'underline' : ''}`}
            >
              VIBRATE
            </button>
            <img src={lotusForEachAlbum} alt="Lotus Logo" className="w-10 h-10 mx-2" />
            <button 
              onClick={() => setActiveSection('tribe')} 
              className={`hover:underline ${activeSection === 'tribe' ? 'underline' : ''}`}
            >
              TRIBE
            </button>
            <button 
              onClick={() => setActiveSection('bts')} 
              className={`hover:underline ${activeSection === 'bts' ? 'underline' : ''}`}
            >
              BTS
            </button>
            <button 
              onClick={() => setActiveSection('store')} 
              className={`hover:underline ${activeSection === 'store' ? 'underline' : ''}`}
            >
              STORE
            </button>
            <button 
              onClick={() => setActiveSection('live')} 
              className={`hover:underline ${activeSection === 'live' ? 'underline' : ''}`}
            >
              LIVE
            </button>
          </nav>
          
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded-full bg-red-lotus cursor-pointer border-2 border-transparent hover:border-white"
              onClick={() => setActiveTheme('red')}
            ></div>
            <div 
              className="w-8 h-8 rounded-full bg-yellow-lotus cursor-pointer border-2 border-transparent hover:border-white"
              onClick={() => setActiveTheme('yellow')}
            ></div>
            <div 
              className="w-8 h-8 rounded-full bg-blue-lotus cursor-pointer border-2 border-transparent hover:border-white"
              onClick={() => setActiveTheme('blue')}
            ></div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        {activeSection === 'hut' && (
          <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl">
            <h2 className="text-5xl font-bold mb-6">Red Lotus</h2>
            <div className="flex gap-6 justify-center mb-8">
              <button className="bg-red-lotus text-white px-8 py-3 rounded-full text-xl hover:bg-opacity-80 transition">
                Explore
              </button>
              <button className="bg-red-lotus text-white px-8 py-3 rounded-full text-xl hover:bg-opacity-80 transition">
                Vibrate
              </button>
            </div>
            <p className="text-xl mb-12">
              Experience music through the seasons of life
            </p>
            <div className="mt-12">
              <button 
                onClick={() => setShowAdminLogin(true)} 
                className="text-white opacity-70 hover:opacity-100 transition"
              >
                Artist Admin
              </button>
            </div>
          </div>
        )}

        {activeSection === 'music' && (
          <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">{themeColors[activeTheme].name} Lotus Albums</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img src={themeColors[activeTheme].album} alt={`${themeColors[activeTheme].name} Lotus Album`} className="w-64 h-64 object-cover rounded-lg" />
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Lotus: The {themeColors[activeTheme].name} Album</h3>
                <p className="mb-4">{themeColors[activeTheme].description}</p>
                <button className={`${themeColors[activeTheme].bg} text-white px-6 py-2 rounded-full hover:bg-opacity-80 transition`}>
                  Stream Now
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'vibrate' && (
          <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">Find Your Vibe</h2>
            <p className="text-xl mb-6">Explore music for every mood and season</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.keys(themeColors).map(color => (
                <div key={color} className="p-4 bg-black bg-opacity-50 rounded-lg hover:transform hover:scale-105 transition cursor-pointer">
                  <h3 className="text-xl font-bold mb-2">{themeColors[color as keyof typeof themeColors].name} Lotus</h3>
                  <p>{themeColors[color as keyof typeof themeColors].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'tribe' && (
          <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">Join The Tribe</h2>
            <p className="text-xl mb-6">Connect with like-minded fans and get exclusive content</p>
            <form className="max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-3 mb-4 rounded bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30"
              />
              <button className="bg-red-lotus text-white px-6 py-3 rounded-full w-full hover:bg-opacity-80 transition">
                Join Now
              </button>
            </form>
          </div>
        )}

        {activeSection === 'bts' && (
          <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">Behind The Scenes</h2>
            <p className="text-xl mb-6">Get an exclusive look at the creative process</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <img src={behindTheScenesMain} alt="Behind the scenes" className="w-full h-48 object-cover rounded-lg" />
              <img src={behindTheScenes2} alt="Behind the scenes" className="w-full h-48 object-cover rounded-lg" />
              <img src={behindTheScenes3} alt="Behind the scenes" className="w-full h-48 object-cover rounded-lg" />
            </div>
          </div>
        )}

        {activeSection === 'store' && (
          <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">Lotus Store</h2>
            <p className="text-xl mb-6">Official merchandise and exclusive items</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-black bg-opacity-50 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Digital Albums</h3>
                <p className="mb-4">Download high-quality versions of all Lotus albums</p>
                <button className="bg-red-lotus text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition">
                  Shop Albums
                </button>
              </div>
              <div className="p-4 bg-black bg-opacity-50 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Merchandise</h3>
                <p className="mb-4">T-shirts, hoodies, and accessories</p>
                <button className="bg-red-lotus text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition">
                  Shop Merch
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'live' && (
          <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">Live Shows</h2>
            <p className="text-xl mb-6">Upcoming performances and virtual events</p>
            <div className="space-y-4">
              <div className="p-4 bg-black bg-opacity-50 rounded-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Virtual Concert Experience</h3>
                  <p>July 15, 2025 - 8:00 PM</p>
                </div>
                <button className="mt-2 md:mt-0 bg-red-lotus text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition">
                  Get Tickets
                </button>
              </div>
              <div className="p-4 bg-black bg-opacity-50 rounded-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Exclusive Streaming Night</h3>
                  <p>August 18, 2025 - 7:30 PM</p>
                </div>
                <button className="mt-2 md:mt-0 bg-red-lotus text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition">
                  Get Tickets
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Artist Admin Login</h2>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="w-full bg-red-lotus text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
            >
              Go to Login
            </button>
            <button 
              onClick={() => setShowAdminLogin(false)} 
              className="w-full mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
