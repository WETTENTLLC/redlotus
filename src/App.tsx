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
import { SecurityService } from './security/SecurityService';
import ProductionReadinessTest from './testing/ProductionReadinessTest';
import TribeTransition from './components/TribeTransition';
import TribeExperience from './components/TribeExperience';
import SimpleTribeActivation from './components/SimpleTribeActivation';
import CommunityForum from './features/community/CommunityForum';
import { testFirebaseConnection, validateEnvironmentVariables } from './utils/firebaseTest';
import TribeJoinModal from './components/TribeJoinModal';

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
type SectionName = 'hut' | 'music' | 'vibrate' | 'tribe' | 'bts' | 'store' | 'live' | 'fanart' | 'booking' | 'community' | 'admin';

function App() {
  const { currentUser, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionName>('hut');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Tribe membership state
  const [userTribe, setUserTribe] = useState<'red' | 'yellow' | 'blue' | null>(null);
  const [showTribeTransition, setShowTribeTransition] = useState(false);
  const [tribeTransitionType, setTribeTransitionType] = useState<'red' | 'yellow' | 'blue'>('red');
  useEffect(() => {
    try {
      // Initialize monitoring and performance services
      MonitoringService.initialize();
      PerformanceService.initialize();
      
      // Track page load
      MonitoringService.trackPageView();
      
      // Validate environment in development
      if (EnvironmentService.isDevelopment()) {
        const validation = EnvironmentService.validateConfiguration();
        if (!validation.isValid) {
          console.warn('Environment configuration issues:', validation.errors);
        }
      }
      
      // Check for existing tribe membership
      const existingMember = localStorage.getItem('currentTribeMember');
      const allTribesData = localStorage.getItem('tribemembers');
      
      if (existingMember) {
        const memberData = JSON.parse(existingMember);
        setTribeMember(memberData);
        setUserTribe(memberData.tribe);
        setActiveTheme(memberData.tribe);
        setSelectedTribeForView(memberData.tribe);
      }
      
      if (allTribesData) {
        setAllTribes(JSON.parse(allTribesData));
      }
    } catch (error) {
      console.error('Failed to initialize production services:', error);
      // Continue without monitoring services if they fail
    }
    
    // Cleanup on unmount
    return () => {
      try {
        PerformanceService.cleanup();
      } catch (error) {
        console.warn('Cleanup failed:', error);
      }
    };
  }, []);
  
  // Theme state for the different lotus colors
  const [activeTheme, setActiveTheme] = useState<'red' | 'yellow' | 'blue'>('red');
  const [showThemeWelcome, setShowThemeWelcome] = useState(false);
  const [themeWelcomeMessage, setThemeWelcomeMessage] = useState('');
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Email subscription state for Tribe section
  const [tribeEmail, setTribeEmail] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmissionStatus, setEmailSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');
  
  // Debug state for Firebase testing
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Tribe join modal state
  const [showTribeModal, setShowTribeModal] = useState(false);
  const [selectedTribeForJoin, setSelectedTribeForJoin] = useState<'red' | 'yellow' | 'blue'>('red');
  const [tribeMember, setTribeMember] = useState<any>(null);
  const [allTribes, setAllTribes] = useState<any[]>([]);
  const [selectedTribeForView, setSelectedTribeForView] = useState<'red' | 'yellow' | 'blue'>('red');
  
  // Define theme colors for styling elements
  const themeColors = {
    red: {
      bg: 'bg-red-lotus',
      text: 'text-red-lotus',
      name: 'Red',
      description: 'Winter energy and focused motivation.',
      album: redLotusAlbumRap,
      image: redLotusImage,
      welcome: 'Welcome to the Red Lotus tribe! Experience the power of winter energy and focused motivation.'
    },
    yellow: {
      bg: 'bg-yellow-lotus',
      text: 'text-yellow-lotus',
      name: 'Yellow',
      description: 'Summer energy and uplifting positivity.',
      album: yellowLotusAlbumPop,
      image: yellowLotusImage,
      welcome: 'Welcome to the Yellow Lotus tribe! Embrace the warmth of summer energy and uplifting positivity.'
    },
    blue: {
      bg: 'bg-blue-lotus',
      text: 'text-blue-lotus',
      name: 'Blue',
      description: 'Spring renewal and calm reflection.',
      album: blueLotusAlbumRnb,
      image: blueLotusImage,
      welcome: 'Welcome to the Blue Lotus tribe! Find peace in spring renewal and calm reflection.'
    }
  };

  // Handle theme change with enhanced tribe activation
  const handleThemeChange = (theme: 'red' | 'yellow' | 'blue') => {
    try {
      setActiveTheme(theme);
      setUserTribe(theme);
      setThemeWelcomeMessage(themeColors[theme].welcome);
      
      // Trigger tribe transition animation
      setTribeTransitionType(theme);
      setShowTribeTransition(true);
      
      // Show welcome message after animation
      setTimeout(() => {
        setShowThemeWelcome(true);
        setShowTribeTransition(false);
      }, 1500);
      
      // Track theme change (with error handling)
      try {
        MonitoringService.trackUserAction('tribe_activation', 'ui', theme);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
      
      // Hide welcome message after 4 seconds
      setTimeout(() => {
        setShowThemeWelcome(false);
      }, 5500);
    } catch (error) {
      console.error('Error activating tribe:', error);
      // Still set the tribe even if other features fail
      setActiveTheme(theme);
      setUserTribe(theme);
    }
  };

  // Handle explore button click
  const handleExplore = () => {
    setActiveSection('music');
    MonitoringService.trackUserAction('explore_click', 'navigation', 'music');
  };

  // Handle vibrate button click
  const handleVibrate = () => {
    setActiveSection('vibrate');
    MonitoringService.trackUserAction('vibrate_click', 'navigation', 'vibrate');
  };

  // Handle tribe join modal
  const handleTribeJoin = (tribe: 'red' | 'yellow' | 'blue') => {
    setSelectedTribeForJoin(tribe);
    setShowTribeModal(true);
  };

  const handleJoinSuccess = (memberData: any) => {
    // Update all tribes list
    const existingMembers = JSON.parse(localStorage.getItem('tribemembers') || '[]');
    const updatedMembers = [...existingMembers];
    const existingIndex = updatedMembers.findIndex(m => m.tribe === memberData.tribe);
    
    if (existingIndex >= 0) {
      updatedMembers[existingIndex] = memberData;
    } else {
      updatedMembers.push(memberData);
    }
    
    localStorage.setItem('tribemembers', JSON.stringify(updatedMembers));
    setAllTribes(updatedMembers);
    
    // Set as current tribe if first one or if switching
    setTribeMember(memberData);
    setUserTribe(memberData.tribe);
    setActiveTheme(memberData.tribe);
    setSelectedTribeForView(memberData.tribe);
    localStorage.setItem('currentTribeMember', JSON.stringify(memberData));
  };

  // Handle tribe switching for viewing
  const handleTribeSwitch = (tribe: 'red' | 'yellow' | 'blue') => {
    setSelectedTribeForView(tribe);
    setActiveTheme(tribe);
    
    // Check if user is member of this tribe
    const memberOfThisTribe = allTribes.find(t => t.tribe === tribe);
    if (memberOfThisTribe) {
      setTribeMember(memberOfThisTribe);
      setUserTribe(tribe);
      localStorage.setItem('currentTribeMember', JSON.stringify(memberOfThisTribe));
    }
  };

  // Check if user is member of specific tribe
  const isMemberOfTribe = (tribe: 'red' | 'yellow' | 'blue') => {
    return allTribes.some(t => t.tribe === tribe);
  };

  // Debug function to test Firebase connection
  const testFirebase = async () => {
    try {
      setDebugInfo('Testing Firebase connection...');
      
      // Validate environment variables first
      const envValidation = validateEnvironmentVariables();
      if (!envValidation.valid) {
        setDebugInfo(`Missing env vars: ${envValidation.missing.join(', ')}`);
        return;
      }
      
      // Test Firebase connection
      const result = await testFirebaseConnection();
      if (result.success) {
        setDebugInfo('✅ Firebase connection successful!');
      } else {
        setDebugInfo(`❌ Firebase error: ${result.error}`);
      }
    } catch (error) {
      setDebugInfo(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle email subscription with security validation
  const handleEmailSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tribeEmail.trim()) {
      setEmailError('Please enter your email address.');
      return;
    }
    
    setIsSubmittingEmail(true);
    setEmailSubmissionStatus('idle');
    setEmailError('');
    
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(tribeEmail.trim())) {
        setEmailError('Please enter a valid email address.');
        setEmailSubmissionStatus('error');
        return;
      }
      
      // Check if Firebase is properly initialized
      if (!db) {
        throw new Error('Database connection not available');
      }
      
      // Add email to Firestore with simplified approach
      await addDoc(collection(db, 'subscriptions'), {
        email: tribeEmail.trim().toLowerCase(),
        timestamp: new Date(),
        tribe: activeTheme,
        subscribed: true
      });
      
      setEmailSubmissionStatus('success');
      setUserTribe(activeTheme); // Set the user tribe
      setTribeEmail('');
      
      // Track successful subscription (with error handling)
      try {
        MonitoringService.trackEvent({
          event: 'email_subscription',
          category: 'engagement',
          action: 'subscribe',
          label: 'tribe_signup'
        });
      } catch (trackingError) {
        console.warn('Analytics tracking failed:', trackingError);
      }
      
    } catch (error) {
      console.error('Error subscribing email:', error);
      setEmailSubmissionStatus('error');
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          setEmailError('Permission denied. Please try again later.');
        } else if (error.message.includes('network')) {
          setEmailError('Network error. Please check your connection.');
        } else if (error.message.includes('Database connection')) {
          setEmailError('Service temporarily unavailable. Please try again.');
        } else {
          setEmailError('Error joining the tribe. Please try again.');
        }
      } else {
        setEmailError('Unexpected error occurred. Please try again.');
      }
      
      // Log error (with error handling)
      try {
        MonitoringService.logError({
          level: 'error',
          message: 'Email subscription failed',
          url: window.location.href,
          metadata: { email: tribeEmail, error: (error as Error).message }
        });
      } catch (logError) {
        console.warn('Error logging failed:', logError);
      }
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (window.location.pathname === '/login' || window.location.pathname === '/admin' || window.location.pathname === '/production-test') {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={currentUser ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/production-test" element={<ProductionReadinessTest />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className="App lotus-bg" 
        style={{
          backgroundImage: `url(${artistSecondaryLogo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
      >
        <header className="flex flex-col items-center py-4 relative">
          <div className="w-full flex justify-between items-center px-4 md:px-6">
            <h1 className="text-xl md:text-2xl font-bold text-white">RED LOTUS</h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-3 xl:gap-6 text-sm xl:text-xl font-bold text-white">
              <button 
                onClick={() => setActiveSection('hut')} 
                className={`hover:underline ${activeSection === 'hut' ? 'underline' : ''} transition-all`}
              >
                HUT
              </button>
              <button 
                onClick={() => setActiveSection('music')} 
                className={`hover:underline ${activeSection === 'music' ? 'underline' : ''} transition-all`}
              >
                MUSIC
              </button>
              <button 
                onClick={() => setActiveSection('vibrate')} 
                className={`hover:underline ${activeSection === 'vibrate' ? 'underline' : ''} transition-all`}
              >
                VIBRATE
              </button>
              <img src={lotusForEachAlbum} alt="Lotus Logo" className="w-16 h-12 xl:w-20 xl:h-16 mx-1 xl:mx-2" />
              <button 
                onClick={() => setActiveSection('tribe')} 
                className={`hover:underline ${activeSection === 'tribe' ? 'underline' : ''} transition-all`}
              >
                TRIBE
              </button>
              <button 
                onClick={() => setActiveSection('community')} 
                className={`hover:underline ${activeSection === 'community' ? 'underline' : ''} transition-all`}
              >
                COMMUNITY
              </button>
              <button 
                onClick={() => setActiveSection('bts')} 
                className={`hover:underline ${activeSection === 'bts' ? 'underline' : ''} transition-all`}
              >
                BTS
              </button>
              <button 
                onClick={() => setActiveSection('store')} 
                className={`hover:underline ${activeSection === 'store' ? 'underline' : ''} transition-all`}
              >
                STORE
              </button>
              <button 
                onClick={() => setActiveSection('live')} 
                className={`hover:underline ${activeSection === 'live' ? 'underline' : ''} transition-all`}
              >
                LIVE
              </button>
              <button 
                onClick={() => setActiveSection('fanart')} 
                className={`hover:underline ${activeSection === 'fanart' ? 'underline' : ''} transition-all`}
              >
                FAN ART
              </button>
              <button 
                onClick={() => setActiveSection('booking')} 
                className={`hover:underline ${activeSection === 'booking' ? 'underline' : ''} transition-all`}
              >
                BOOKING
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>

            {/* Enhanced Theme Switcher with Tribe Activation */}
            <div className="flex gap-1 md:gap-2">
              <div 
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-lotus cursor-pointer border-4 ${
                  activeTheme === 'red' ? 'border-white shadow-lg shadow-red-500/50 scale-110' : 'border-transparent hover:border-white/50'
                } transition-all duration-300 flex items-center justify-center relative overflow-hidden touch-manipulation transform hover:scale-105`}
                onClick={() => handleThemeChange('red')}
                title="Red Lotus - Winter Energy & Focus"
              >
                <img 
                  src={lotusForEachAlbum} 
                  alt="Red Lotus" 
                  className={`w-10 h-8 md:w-12 md:h-10 object-contain filter brightness-0 invert opacity-90 ${
                    activeTheme === 'red' ? 'animate-pulse' : ''
                  }`}
                />
                {activeTheme === 'red' && (
                  <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse rounded-full" />
                )}
              </div>
              <div 
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-lotus cursor-pointer border-4 ${
                  activeTheme === 'yellow' ? 'border-white shadow-lg shadow-yellow-500/50 scale-110' : 'border-transparent hover:border-white/50'
                } transition-all duration-300 flex items-center justify-center relative overflow-hidden touch-manipulation transform hover:scale-105`}
                onClick={() => handleThemeChange('yellow')}
                title="Yellow Lotus - Summer Energy & Positivity"
              >
                <img 
                  src={lotusForEachAlbum} 
                  alt="Yellow Lotus" 
                  className={`w-10 h-8 md:w-12 md:h-10 object-contain filter brightness-0 opacity-90 ${
                    activeTheme === 'yellow' ? 'animate-bounce' : ''
                  }`}
                />
                {activeTheme === 'yellow' && (
                  <div className="absolute inset-0 bg-yellow-500 opacity-20 animate-pulse rounded-full" />
                )}
              </div>
              <div 
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-lotus cursor-pointer border-4 ${
                  activeTheme === 'blue' ? 'border-white shadow-lg shadow-blue-500/50 scale-110' : 'border-transparent hover:border-white/50'
                } transition-all duration-300 flex items-center justify-center relative overflow-hidden touch-manipulation transform hover:scale-105`}
                onClick={() => handleThemeChange('blue')}
                title="Blue Lotus - Spring Energy & Renewal"
              >
                <img 
                  src={lotusForEachAlbum} 
                  alt="Blue Lotus" 
                  className={`w-10 h-8 md:w-12 md:h-10 object-contain filter brightness-0 invert opacity-90 ${
                    activeTheme === 'blue' ? 'animate-pulse' : ''
                  }`}
                />
                {activeTheme === 'blue' && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
              
              {/* Mobile Menu */}
              <div className="absolute top-full left-0 right-0 bg-black bg-opacity-95 backdrop-blur-sm z-50 lg:hidden animate-slideDown">
                <nav className="flex flex-col py-4 px-6 space-y-4">
                  {['hut', 'music', 'vibrate', 'tribe', 'community', 'bts', 'store', 'live', 'fanart', 'booking'].map((section) => (
                    <button 
                      key={section}
                      onClick={() => {
                        setActiveSection(section as SectionName);
                        setIsMobileMenuOpen(false);
                        MonitoringService.trackUserAction('mobile_nav', 'navigation', section);
                      }} 
                      className={`text-white text-lg font-bold py-3 px-4 rounded-lg transition-all touch-manipulation ${
                        activeSection === section ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={lotusForEachAlbum} alt="" className="w-10 h-8 filter brightness-0 invert" />
                        {section.toUpperCase()}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </>
          )}
        </header>

        <main className="flex-grow flex items-center justify-center px-4 py-8">
          {activeSection === 'hut' && (
            <div className="text-center text-white p-4 md:p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl w-full">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Red Lotus</h2>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-6 md:mb-8">
                <button 
                  onClick={handleExplore}
                  className={`${themeColors[activeTheme].bg} text-white px-6 md:px-8 py-3 rounded-full text-lg md:text-xl hover:bg-opacity-80 transition transform hover:scale-105 touch-manipulation`}
                >
                  Explore
                </button>
                <button 
                  onClick={handleVibrate}
                  className={`${themeColors[activeTheme].bg} text-white px-6 md:px-8 py-3 rounded-full text-lg md:text-xl hover:bg-opacity-80 transition transform hover:scale-105 touch-manipulation`}
                >
                  Vibrate
                </button>
              </div>
              <p className="text-lg md:text-xl mb-8 md:mb-12">
                Experience music through the seasons of life
              </p>
              <div className="mt-8 md:mt-12">
                <button 
                  onClick={() => setShowAdminLogin(true)} 
                  className="text-white opacity-70 hover:opacity-100 transition touch-manipulation py-2 px-4 mr-4"
                >
                  Artist Admin
                </button>
                {EnvironmentService.isDevelopment() && (
                  <>
                    <button 
                      onClick={() => window.location.href = '/production-test'} 
                      className="text-yellow-400 opacity-70 hover:opacity-100 transition touch-manipulation py-2 px-4 mr-4"
                    >
                      Production Test
                    </button>
                    <button 
                      onClick={testFirebase} 
                      className="text-green-400 opacity-70 hover:opacity-100 transition touch-manipulation py-2 px-4"
                    >
                      Test Firebase
                    </button>
                    {debugInfo && (
                      <div className="mt-4 p-2 bg-black bg-opacity-50 rounded text-sm text-white">
                        {debugInfo}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {activeSection === 'music' && (
            <div className="text-center text-white p-4 md:p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl w-full">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">{themeColors[activeTheme].name} Lotus Albums</h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                <img 
                  src={themeColors[activeTheme].album} 
                  alt={`${themeColors[activeTheme].name} Lotus Album`} 
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg mx-auto md:mx-0" 
                />
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Lotus: The {themeColors[activeTheme].name} Album</h3>
                  <p className="mb-4 text-sm md:text-base">{themeColors[activeTheme].description}</p>
                  <button 
                    className={`${themeColors[activeTheme].bg} text-white px-6 py-2 rounded-full hover:bg-opacity-80 transition touch-manipulation`}
                    onClick={() => MonitoringService.trackUserAction('stream_click', 'music', themeColors[activeTheme].name)}
                  >
                    Stream Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'vibrate' && (
            <div className="text-center text-white p-4 md:p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl w-full">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Find Your Vibe</h2>
              <p className="text-lg md:text-xl mb-4 md:mb-6">Explore music for every mood and season</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {Object.keys(themeColors).map(color => (
                  <div 
                    key={color} 
                    className="p-4 bg-black bg-opacity-50 rounded-lg hover:transform hover:scale-105 transition cursor-pointer touch-manipulation"
                    onClick={() => {
                      handleThemeChange(color as 'red' | 'yellow' | 'blue');
                      MonitoringService.trackUserAction('vibe_select', 'ui', color);
                    }}
                  >
                    <h3 className="text-lg md:text-xl font-bold mb-2">{themeColors[color as keyof typeof themeColors].name} Lotus</h3>
                    <p className="text-sm md:text-base">{themeColors[color as keyof typeof themeColors].description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'tribe' && (
            <div className="text-center text-white p-4 md:p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl w-full mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">🌸 Join the Lotus Tribe 🌸</h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8">Choose your tribe and unlock exclusive experiences</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.entries(themeColors).map(([key, tribe]) => {
                  const isMember = isMemberOfTribe(key as 'red' | 'yellow' | 'blue');
                  const isSelected = selectedTribeForView === key;
                  
                  return (
                    <div
                      key={key}
                      className={`p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isSelected 
                          ? `${tribe.bg} border-4 border-white shadow-lg transform scale-105` 
                          : 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-white/50'
                      }`}
                      onClick={() => handleTribeSwitch(key as 'red' | 'yellow' | 'blue')}
                    >
                      <div className="text-center">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${tribe.bg} flex items-center justify-center shadow-lg`}>
                          <img src={lotusForEachAlbum} alt="Lotus" className="w-12 h-10 filter brightness-0 invert" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                          {tribe.name} Lotus
                        </h3>
                        <p className={`text-base mb-3 font-medium ${isSelected ? 'text-gray-100' : 'text-gray-400'}`}>
                          {tribe.description}
                        </p>
                        <div className={`text-sm mb-4 ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                          {key === 'red' && '❄️ Winter Energy • Focus • Determination'}
                          {key === 'yellow' && '☀️ Summer Energy • Joy • Positivity'}
                          {key === 'blue' && '🌸 Spring Energy • Peace • Renewal'}
                        </div>
                        
                        {isMember ? (
                          <div className="space-y-2">
                            <div className="text-green-400 font-bold text-sm">✓ MEMBER</div>
                            {isSelected && (
                              <div className="text-white font-bold text-lg animate-pulse">
                                ✓ ACTIVE
                              </div>
                            )}
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTribeJoin(key as 'red' | 'yellow' | 'blue');
                            }}
                            className={`${tribe.bg} text-white px-6 py-2 rounded-full font-bold hover:opacity-80 transition-all`}
                          >
                            Join Tribe
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {allTribes.length > 0 && (
                <div className="mb-6">
                  <div className={`inline-block px-8 py-4 ${themeColors[selectedTribeForView].bg} text-white rounded-full font-bold text-xl`}>
                    🎵 {themeColors[selectedTribeForView].name} Lotus Experience Active! 🎵
                  </div>
                </div>
              )}
              
              {tribeMember && selectedTribeForView === tribeMember.tribe && (
                <TribeExperience tribe={tribeMember.tribe} isActive={true} />
              )}
            </div>
          )}

          {activeSection === 'bts' && (
            <div className="text-center text-white p-4 md:p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl w-full">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Behind The Scenes</h2>
              <p className="text-lg md:text-xl mb-4 md:mb-6">Get an exclusive look at the creative process</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <img src={behindTheScenesMain} alt="Behind the scenes" className="w-full h-32 md:h-48 object-cover rounded-lg" />
                <img src={behindTheScenes2} alt="Behind the scenes" className="w-full h-32 md:h-48 object-cover rounded-lg" />
                <img src={behindTheScenes3} alt="Behind the scenes" className="w-full h-32 md:h-48 object-cover rounded-lg" />
              </div>
            </div>
          )}

          {activeSection === 'store' && (
            <div className="text-center text-white p-4 md:p-8 bg-black bg-opacity-60 rounded-lg max-w-6xl w-full">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Lotus Store</h2>
              <p className="text-lg md:text-xl mb-4 md:mb-6">Official merchandise and exclusive items</p>
              <StoreFront />
            </div>
          )}

          {activeSection === 'live' && (
            <div className="text-center text-white p-4 md:p-8 bg-black bg-opacity-60 rounded-lg max-w-4xl w-full">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Live Shows</h2>
              <p className="text-lg md:text-xl mb-4 md:mb-6">Upcoming performances and virtual events</p>
              <div className="space-y-4">
                <div className="p-4 bg-black bg-opacity-50 rounded-lg flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-bold">Virtual Concert Experience</h3>
                    <p className="text-sm md:text-base">July 15, 2025 - 8:00 PM</p>
                  </div>
                  <button 
                    className="bg-red-lotus text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition touch-manipulation"
                    onClick={() => MonitoringService.trackUserAction('ticket_click', 'live', 'virtual_concert')}
                  >
                    Get Tickets
                  </button>
                </div>
                <div className="p-4 bg-black bg-opacity-50 rounded-lg flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-bold">Exclusive Streaming Night</h3>
                    <p className="text-sm md:text-base">August 18, 2025 - 7:30 PM</p>
                  </div>
                  <button 
                    className="bg-red-lotus text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition touch-manipulation"
                    onClick={() => MonitoringService.trackUserAction('ticket_click', 'live', 'streaming_night')}
                  >
                    Get Tickets
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'community' && (
            <div className="w-full max-w-6xl px-2 md:px-0">
              {tribeMember ? (
                <CommunityForum 
                  tribe={tribeMember.tribe || 'main'} 
                  userEmail={tribeMember.email}
                  userName={tribeMember.name}
                />
              ) : (
                <div className="text-center text-white p-8 bg-black bg-opacity-60 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">Join a Tribe to Access Community</h2>
                  <p className="mb-6">You need to join a tribe first to access the community forum.</p>
                  <button 
                    onClick={() => setActiveSection('tribe')}
                    className="bg-yellow-lotus text-black px-6 py-3 rounded-full font-bold hover:opacity-80 transition-all"
                  >
                    Join a Tribe
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'fanart' && (
            <div className="w-full max-w-6xl px-2 md:px-0">
              <FanArtPage />
            </div>
          )}

          {activeSection === 'booking' && (
            <div className="w-full max-w-6xl px-2 md:px-0">
              <OfferBasedBookingPage />
            </div>
          )}
        </main>

        {showAdminLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Artist Admin Login</h2>
              <button 
                onClick={() => {
                  window.location.href = '/login';
                  MonitoringService.trackUserAction('admin_login_click', 'navigation', 'login');
                }} 
                className="w-full bg-red-lotus text-white px-4 py-3 rounded hover:bg-opacity-80 transition touch-manipulation mb-3"
              >
                Go to Login
              </button>
              <button 
                onClick={() => setShowAdminLogin(false)} 
                className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded hover:bg-gray-300 transition touch-manipulation"
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

        {/* Enhanced Theme Welcome Message */}
        {showThemeWelcome && (
          <div className="fixed top-16 md:top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn px-4 w-full max-w-lg">
            <div className={`${themeColors[activeTheme].bg} text-white px-6 py-4 rounded-xl shadow-2xl text-center mx-auto border-2 border-white/20`}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="animate-spin">
                  <img src={lotusForEachAlbum} alt="Lotus Logo" className="w-12 h-10 filter brightness-0 invert" />
                </div>
                <h3 className="font-bold text-xl">{themeColors[activeTheme].name} Lotus Tribe Activated!</h3>
                <div className="animate-spin">
                  <img src={lotusForEachAlbum} alt="Lotus Logo" className="w-12 h-10 filter brightness-0 invert" />
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-2">{themeWelcomeMessage}</p>
              <div className="text-xs opacity-80">
                🎵 Your tribe experience is now personalized 🎵
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;