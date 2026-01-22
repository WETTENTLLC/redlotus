import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import FanArtPage from './components/pages/FanArtPage';
import OfferBasedBookingPage from './components/pages/OfferBasedBookingPage';
import StoreFront from './components/store/StoreFront';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MonitoringService } from './monitoring/MonitoringService';
import { PerformanceService } from './performance/PerformanceService';
import { EnvironmentService } from './config/EnvironmentService';
import TribeTransition from './components/TribeTransition';
import TribeExperience from './components/TribeExperience';
import CommunityForum from './features/community/CommunityForum';
import { testFirebaseConnection, validateEnvironmentVariables } from './utils/firebaseTest';
import TribeJoinModal from './components/TribeJoinModal';
import ContentDisplay from './components/ContentDisplay';
import MinimalAppWrapper from './components/MinimalAppWrapper';
import ProductCard from './components/ProductCard';
import { HelmetProvider } from 'react-helmet-async';

// Import images
import redLotusAlbumRap from './assets/red-lotus-album-rap.jpeg';
import yellowLotusAlbumPop from './assets/yellow-lotus-album-pop.jpeg';
import blueLotusAlbumRnb from './assets/blue-lotus-album-rnb.jpeg';
import redLotusImage from './assets/red-lotus-image.png';
import yellowLotusImage from './assets/yellow-lotus-image.png';
import blueLotusImage from './assets/blue-lotus-image.png';
import behindTheScenesMain from './assets/behind-the-scenes-main-image.jpeg';
import behindTheScenes2 from './assets/behind-the-scenes-image2.jpeg';
import behindTheScenes3 from './assets/behind-the-scenes-image3.jpeg';

// Navigation sections
type SectionName = 'hut' | 'music' | 'vibrate' | 'tribe' | 'bts' | 'store' | 'live' | 'fanart' | 'booking' | 'community' | 'admin';

// Tribe/Theme color definitions
const tribeColors = {
  red: {
    name: 'Red',
    accent: '#b71c1c',
    image: redLotusImage,
    album: redLotusAlbumRap,
    description: 'Winter energy and focused motivation.',
  },
  yellow: {
    name: 'Yellow',
    accent: '#fbc02d',
    image: yellowLotusImage,
    album: yellowLotusAlbumPop,
    description: 'Summer energy and uplifting positivity.',
  },
  blue: {
    name: 'Blue',
    accent: '#1976d2',
    image: blueLotusImage,
    album: blueLotusAlbumRnb,
    description: 'Spring renewal and calm reflection.',
  },
};

function App() {
  const { currentUser, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionName>('hut');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Tribe membership states
  const [userTribe, setUserTribe] = useState<'red' | 'yellow' | 'blue' | null>(null);
  const [showTribeTransition, setShowTribeTransition] = useState(false);
  const [tribeTransitionType, setTribeTransitionType] = useState<'red' | 'yellow' | 'blue'>('red');
  const [tribeMember, setTribeMember] = useState<any>(null);
  const [allTribes, setAllTribes] = useState<any[]>([]);
  const [selectedTribeForView, setSelectedTribeForView] = useState<'red' | 'yellow' | 'blue'>('red');
  const [activeTheme, setActiveTheme] = useState<'red' | 'yellow' | 'blue'>('red');

  // Modal states
  const [showTribeModal, setShowTribeModal] = useState(false);
  const [selectedTribeForJoin, setSelectedTribeForJoin] = useState<'red' | 'yellow' | 'blue'>('red');

  // UI states
  const [showThemeWelcome, setShowThemeWelcome] = useState(false);
  const [themeWelcomeMessage, setThemeWelcomeMessage] = useState('');

  // Initialize app
  useEffect(() => {
    try {
      MonitoringService.initialize();
      PerformanceService.initialize();
      MonitoringService.trackPageView();

      if (EnvironmentService.isDevelopment()) {
        const validation = EnvironmentService.validateConfiguration();
        if (!validation.isValid) {
          console.warn('Environment configuration issues:', validation.errors);
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, []);

  // Test Firebase connection on mount
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const handleJoinSuccess = (member: any) => {
    setTribeMember(member);
    setUserTribe(member.tribe as 'red' | 'yellow' | 'blue');
    setAllTribes(prev => [...prev, member]);
    setShowTribeModal(false);
  };

  const handleTribeJoin = (tribe: 'red' | 'yellow' | 'blue') => {
    setSelectedTribeForJoin(tribe);
    setShowTribeModal(true);
  };

  const handleTribeSwitch = (tribe: 'red' | 'yellow' | 'blue') => {
    setTribeTransitionType(tribe);
    setShowTribeTransition(true);
    setTimeout(() => {
      setUserTribe(tribe);
      setShowTribeTransition(false);
    }, 1000);
  };

  const isMemberOfTribe = (tribe: 'red' | 'yellow' | 'blue') => {
    return allTribes.some(t => t.tribe === tribe);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-grey-light">Loading...</div>;
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Routes>
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={currentUser ? <AdminDashboard /> : <Navigate to="/login" />} />

          {/* Main App Route */}
          <Route
            path="/*"
            element={
              <MinimalAppWrapper
                activeSection={activeSection}
                onSectionChange={(section) => {
                  setActiveSection(section as SectionName);
                  MonitoringService.trackUserAction('nav_click', 'navigation', section);
                }}
              >
                {/* Home Section */}
                {activeSection === 'hut' && (
                  <section className="section text-center">
                    <h1 className="section-title">Red Lotus</h1>
                    <p className="section-subtitle">
                      Experience music through the seasons of life
                    </p>
                    <div className="mt-xl">
                      <p style={{ color: '#666' }} className="mb-lg">
                        Join our global community and discover unique musical experiences across multiple dimensions.
                      </p>
                      <div className="flex gap-lg justify-center flex-wrap">
                        <button className="btn" onClick={() => setActiveSection('music')}>
                          Explore Music
                        </button>
                        <button className="btn btn-secondary" onClick={() => setActiveSection('tribe')}>
                          Join Tribe
                        </button>
                      </div>
                    </div>
                    <div className="mt-2xl">
                      <button
                        onClick={() => setShowAdminLogin(true)}
                        style={{ fontSize: '12px', opacity: 0.6, cursor: 'pointer', background: 'none', border: 'none', padding: '8px' }}
                      >
                        Artist Admin
                      </button>
                    </div>
                  </section>
                )}

                {/* Music Section */}
                {activeSection === 'music' && (
                  <section className="section">
                    <h1 className="section-title">Music Collection</h1>
                    <p className="section-subtitle">Curated albums from the Red Lotus universe</p>

                    <div className="products-grid mt-2xl">
                      {Object.entries(tribeColors).map(([key, tribe]) => {
                        const tribeKey = key as 'red' | 'yellow' | 'blue';
                        return (
                          <div key={key}>
                            <ProductCard
                              title={`${tribe.name} Lotus Album`}
                              description={tribe.description}
                              image={tribe.album}
                              accentColor={tribeKey}
                            >
                              <button className="btn" style={{ width: '100%', marginTop: '12px' }}>
                                Stream Now
                              </button>
                            </ProductCard>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Vibrate Section */}
                {activeSection === 'vibrate' && (
                  <section className="section">
                    <h1 className="section-title">Find Your Vibe</h1>
                    <p className="section-subtitle">Explore music for every mood and season</p>

                    <div className="products-grid mt-2xl">
                      {Object.entries(tribeColors).map(([key, tribe]) => (
                        <div
                          key={key}
                          className="product-card"
                          onClick={() => {
                            setSelectedTribeForView(key as 'red' | 'yellow' | 'blue');
                            MonitoringService.trackUserAction('vibe_select', 'ui', key);
                          }}
                        >
                          <img src={tribe.image} alt={tribe.name} className="product-image" />
                          <div className="product-info">
                            <div className={`product-accent ${key}`}></div>
                            <h3 className="product-name">{tribe.name} Lotus</h3>
                            <p className="product-description">{tribe.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Tribe Section */}
                {activeSection === 'tribe' && (
                  <section className="section">
                    <h1 className="section-title">Join The Tribe</h1>
                    <p className="section-subtitle">Choose your tribe and unlock exclusive experiences</p>

                    <div className="three-column-grid mt-2xl">
                      {Object.entries(tribeColors).map(([key, tribe]) => {
                        const isMember = isMemberOfTribe(key as 'red' | 'yellow' | 'blue');
                        const tribeKey = key as 'red' | 'yellow' | 'blue';

                        return (
                          <div key={key}>
                            <ProductCard
                              title={`${tribe.name} Lotus Tribe`}
                              description={tribe.description}
                              image={tribe.image}
                              accentColor={tribeKey}
                            >
                            <button
                              className={isMember ? 'btn' : 'btn btn-secondary'}
                              onClick={() =>
                                isMember
                                  ? handleTribeSwitch(key as 'red' | 'yellow' | 'blue')
                                  : handleTribeJoin(key as 'red' | 'yellow' | 'blue')
                              }
                              style={{ width: '100%', marginTop: '12px' }}
                            >
                              {isMember ? 'Switch Tribe' : 'Join Tribe'}
                            </button>
                          </ProductCard>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Behind The Scenes */}
                {activeSection === 'bts' && (
                  <section className="section">
                    <h1 className="section-title">Behind The Scenes</h1>
                    <p className="section-subtitle">Get an exclusive look at the creative process</p>

                    <div className="three-column-grid mt-2xl">
                      {[behindTheScenesMain, behindTheScenes2, behindTheScenes3].map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt="Behind the scenes"
                          className="product-image"
                          style={{ borderRadius: '8px' }}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Store */}
                {activeSection === 'store' && (
                  <section className="section">
                    <h1 className="section-title">Red Lotus Store</h1>
                    <p className="section-subtitle">Official merchandise and exclusive items</p>
                    <div className="mt-2xl">
                      <StoreFront />
                    </div>
                  </section>
                )}

                {/* Live Shows */}
                {activeSection === 'live' && (
                  <section className="section">
                    <h1 className="section-title">Red Lotus LIVE</h1>
                    <p className="section-subtitle">Experience live performances and virtual events</p>

                    <div className="mt-2xl" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', textAlign: 'center' }}>
                      <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '600' }}>Live Shows Coming Soon</h3>
                      <p style={{ color: '#666', marginBottom: '24px' }}>
                        Stay tuned for upcoming live performances and virtual concert experiences.
                      </p>
                      <button className="btn">Get Notified</button>
                    </div>
                  </section>
                )}

                {/* Fan Art */}
                {activeSection === 'fanart' && (
                  <section className="section">
                    <FanArtPage />
                  </section>
                )}

                {/* Booking */}
                {activeSection === 'booking' && (
                  <section className="section">
                    <OfferBasedBookingPage />
                  </section>
                )}

                {/* Community */}
                {activeSection === 'community' && (
                  <section className="section">
                    {tribeMember ? (
                      <CommunityForum
                        tribe={tribeMember.tribe || 'main'}
                        userEmail={tribeMember.email}
                        userName={tribeMember.name}
                      />
                    ) : (
                      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '28px', marginBottom: '16px', fontWeight: '600' }}>Join a Tribe to Access Community</h2>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                          You need to join a tribe first to access the community forum.
                        </p>
                        <button className="btn" onClick={() => setActiveSection('tribe')}>
                          Join a Tribe
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {/* Admin Login Modal */}
                {showAdminLogin && (
                  <div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 50,
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '100%',
                      }}
                    >
                      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Artist Admin Login</h2>
                      <button
                        onClick={() => {
                          window.location.href = '/login';
                          MonitoringService.trackUserAction('admin_login_click', 'navigation', 'login');
                        }}
                        className="btn"
                        style={{ width: '100%', marginBottom: '12px' }}
                      >
                        Go to Login
                      </button>
                      <button
                        onClick={() => setShowAdminLogin(false)}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Tribe Join Modal */}
                <TribeJoinModal
                  isOpen={showTribeModal}
                  onClose={() => setShowTribeModal(false)}
                  tribe={selectedTribeForJoin}
                  onJoinSuccess={handleJoinSuccess}
                />

                {/* Tribe Transition Animation */}
                <TribeTransition tribe={tribeTransitionType} isActive={showTribeTransition} />

                {/* Theme Welcome Message */}
                {showThemeWelcome && (
                  <div className="fixed top-16 md:top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn px-4 w-full max-w-lg">
                    <div
                      style={{
                        backgroundColor: tribeColors[activeTheme].accent,
                        color: '#fff',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        border: '2px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                        {tribeColors[activeTheme].name} Lotus Tribe Activated!
                      </h3>
                      <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{themeWelcomeMessage}</p>
                    </div>
                  </div>
                )}
              </MinimalAppWrapper>
            }
          />
        </Routes>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
