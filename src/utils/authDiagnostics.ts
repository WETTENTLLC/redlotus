// Auth Diagnostics Helper
// Add this to any page where you're having auth issues to debug Firebase authentication problems

// Add type declaration for window.firebase
declare global {
  interface Window {
    firebase?: any;
  }
}

// Step 1: Add this script to your React component
const runAuthDiagnostics = () => {
  console.log('🔍 Running Firebase Auth Diagnostics');
  
  // Check if Firebase is initialized properly
  try {
    const firebaseApp = window.firebase?.app;
    console.log('Firebase initialized:', !!firebaseApp);
  } catch (err) {
    console.error('Firebase app initialization error:', err);
  }
  
  // Check environment variables
  console.log('Environment variables check:');
  const envVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  envVars.forEach(varName => {
    const value = import.meta.env[varName];
    console.log(`${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
    
    // Check for placeholder values
    if (value && (value.includes('MISSING') || value.includes('your-'))) {
      console.warn(`⚠️ ${varName} appears to have a placeholder value`);
    }
  });
  
  // Check Auth Domain against current URL
  const currentDomain = window.location.hostname;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  
  console.log('Current domain:', currentDomain);
  console.log('Auth domain:', authDomain);
  
  if (currentDomain !== 'localhost' && 
      authDomain && 
      !authDomain.includes(currentDomain) && 
      !currentDomain.includes(authDomain.split('.')[0])) {
    console.warn('⚠️ Your current domain might not be authorized in Firebase. Add it to Firebase Auth > Authorized Domains');
  }
  
  // Test a Firebase operation
  try {
    const auth = window.firebase?.auth?.();
    console.log('Auth instance available:', !!auth);
    
    // Check if we're already signed in
    const currentUser = auth?.currentUser;
    console.log('Current user:', currentUser ? `✅ Signed in as ${currentUser.email}` : '❌ Not signed in');
    
    // Check persistence
    const persistence = auth?.Auth?.Persistence;
    console.log('Auth persistence options available:', !!persistence);
  } catch (err) {
    console.error('Firebase auth test error:', err);
  }
  
  console.log('🔍 Auth diagnostics complete. Check for any warnings or errors above.');
};

// Step 2: Call this function from your component
// Example usage in a React component:
// 
// useEffect(() => {
//   runAuthDiagnostics();
// }, []);

export default runAuthDiagnostics;
