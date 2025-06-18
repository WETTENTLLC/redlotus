// Firebase Environment Checker
// This utility helps diagnose Firebase configuration issues

/**
 * Checks if Firebase environment variables are correctly set
 * @returns {Object} Result of the check with details
 */
export const checkFirebaseEnvironment = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missingVars = [];
  const placeholderVars = [];
  const validVars = [];
  
  for (const varName of requiredVars) {
    const value = import.meta.env[varName];
    
    if (!value) {
      missingVars.push(varName);
    } else if (value.includes('MISSING') || value.includes('your-')) {
      placeholderVars.push(varName);
    } else {
      validVars.push(varName);
    }
  }
  
  // Check specifically for auth domain
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const expectedDomain = 'red-lotus-731yjtl8z-wettentllcs-projects.vercel.app';
  const authDomainCorrect = authDomain === expectedDomain;
  
  return {
    success: missingVars.length === 0 && placeholderVars.length === 0,
    missingVars,
    placeholderVars,
    validVars,
    authDomainCorrect,
    expectedAuthDomain: expectedDomain,
    actualAuthDomain: authDomain,
    userId: '6vYl8pnvVrdDxOW0ywxL7qFuJGh1'
  };
};

/**
 * Logs Firebase environment status to console
 */
export const logFirebaseEnvironmentStatus = () => {
  const result = checkFirebaseEnvironment();
  
  console.group('Firebase Environment Check');
  
  if (result.success) {
    console.log('%c✓ All Firebase environment variables are set correctly', 'color: green; font-weight: bold');
  } else {
    console.log('%c⚠ Firebase environment issues detected', 'color: red; font-weight: bold');
    
    if (result.missingVars.length > 0) {
      console.log('%cMissing variables:', 'font-weight: bold');
      console.log(result.missingVars);
    }
    
    if (result.placeholderVars.length > 0) {
      console.log('%cVariables with placeholder values:', 'font-weight: bold');
      console.log(result.placeholderVars);
    }
  }
  
  if (!result.authDomainCorrect) {
    console.log('%cAuth domain mismatch:', 'color: orange; font-weight: bold');
    console.log(`Expected: ${result.expectedAuthDomain}`);
    console.log(`Actual: ${result.actualAuthDomain}`);
  }
  
  console.log('User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1');
  console.groupEnd();
  
  return result;
};

export default {
  checkFirebaseEnvironment,
  logFirebaseEnvironmentStatus
};
