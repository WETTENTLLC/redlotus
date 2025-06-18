import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

const Home: React.FC = () => {
  const [featuredQuote, setFeaturedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedQuote = async () => {
      try {
        const q = query(
          collection(db, 'quotes'), 
          where('featured', '==', true),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const quoteDoc = querySnapshot.docs[0];
          setFeaturedQuote({
            id: quoteDoc.id,
            ...quoteDoc.data() as Omit<Quote, 'id'>
          });
        }
      } catch (error) {
        console.error('Error fetching featured quote:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedQuote();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-red-lotus text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Red Lotus</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Official music collective. Experience the sound.
            </p>
          </div>
        </section>
          {/* Featured Quote */}
        {!loading && featuredQuote && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <blockquote className="text-2xl md:text-3xl italic text-gray-700">
                "{featuredQuote.text}"
              </blockquote>
              <p className="mt-4 text-xl text-red-lotus">— {featuredQuote.author}</p>
            </div>
          </section>
        )}

        {/* Merch Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Red Lotus Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Printful Store */}
              <div className="bg-red-lotus/20 rounded-lg p-6 text-center hover:bg-red-lotus/30 transition">
                <h3 className="text-xl font-bold mb-4">Official Merch</h3>
                <p className="mb-6">T-shirts, hoodies, and exclusive Red Lotus merchandise</p>
                <a 
                  href="https://red-lotus-music.printful.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-red-lotus text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition"
                >
                  Shop Now
                </a>
              </div>

              {/* Gemstone Copper Chains */}
              <div className="bg-yellow-lotus/20 rounded-lg p-6 text-center hover:bg-yellow-lotus/30 transition">
                <h3 className="text-xl font-bold mb-4">Gemstone Jewelry</h3>
                <p className="mb-6">Premium copper chains and gemstone accessories</p>
                <a 
                  href="https://gemstonedrippin.com/?sca_ref=8505691.kiWelhGqFMg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-lotus text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-600 transition"
                >
                  Shop Jewelry
                </a>
              </div>

              {/* TikTok Shop */}
              <div className="bg-blue-lotus/20 rounded-lg p-6 text-center hover:bg-blue-lotus/30 transition">
                <h3 className="text-xl font-bold mb-4">TikTok Shop</h3>
                <p className="mb-6">Follow @red.lotus.music for exclusive content and products</p>
                <a 
                  href="https://www.tiktok.com/@red.lotus.music" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-lotus text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition"
                >
                  Follow on TikTok
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16 bg-red-lotus">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Connect with Red Lotus</h2>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/red.lotus.music" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-white text-red-lotus px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
              >
                <span className="mr-2">📷</span> Instagram
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@red.lotus.music" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-white text-red-lotus px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
              >
                <span className="mr-2">🎵</span> TikTok
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@redlotusmusic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-white text-red-lotus px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
              >
                <span className="mr-2">📺</span> YouTube
              </a>

              {/* Spotify */}
              <a 
                href="https://open.spotify.com/artist/redlotus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-white text-red-lotus px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
              >
                <span className="mr-2">🎧</span> Spotify
              </a>

              {/* Apple Music */}
              <a 
                href="https://music.apple.com/artist/red-lotus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-white text-red-lotus px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
              >
                <span className="mr-2">🍎</span> Apple Music
              </a>

            </div>
            <p className="text-white text-lg">Stay connected for the latest music, behind-the-scenes content, and exclusive updates!</p>
          </div>
        </section>

        {/* Other home page sections */}
        {/* ... */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
