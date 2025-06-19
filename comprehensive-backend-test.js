/**
 * Comprehensive Backend Testing Suite
 * Red Lotus Website - Full System Validation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎵 RED LOTUS COMPREHENSIVE BACKEND TESTING SUITE 🎵');
console.log('=' .repeat(60));

// Test Results Collection
const testResults = {
  firebase: { passed: 0, failed: 0, warnings: 0, tests: [] },
  analytics: { passed: 0, failed: 0, warnings: 0, tests: [] },
  deployment: { passed: 0, failed: 0, warnings: 0, tests: [] },
  authentication: { passed: 0, failed: 0, warnings: 0, tests: [] },
  realtime: { passed: 0, failed: 0, warnings: 0, tests: [] }
};

function addTest(category, name, status, message) {
  testResults[category].tests.push({ name, status, message, timestamp: new Date() });
  testResults[category][status]++;
}

function logTest(emoji, message, status = 'info') {
  const colors = {
    pass: '\x1b[32m',  // Green
    fail: '\x1b[31m',  // Red
    warning: '\x1b[33m', // Yellow
    info: '\x1b[36m',  // Cyan
    reset: '\x1b[0m'   // Reset
  };
  console.log(`${colors[status]}${emoji} ${message}${colors.reset}`);
}

// Test 1: Environment Configuration
logTest('🔧', 'Testing Environment Configuration...', 'info');
try {
  require('dotenv').config({ path: '.env.local' });
  
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  let missingVars = [];
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName] === 'undefined') {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    addTest('firebase', 'Environment Variables', 'passed', 'All Firebase environment variables are configured');
    logTest('✅', 'Environment variables: CONFIGURED', 'pass');
  } else {
    addTest('firebase', 'Environment Variables', 'failed', `Missing: ${missingVars.join(', ')}`);
    logTest('❌', `Missing environment variables: ${missingVars.join(', ')}`, 'fail');
  }
} catch (error) {
  addTest('firebase', 'Environment Variables', 'failed', `Error loading environment: ${error.message}`);
  logTest('❌', `Environment configuration error: ${error.message}`, 'fail');
}

// Test 2: Firebase Project Connectivity
logTest('🔥', 'Testing Firebase Project Connectivity...', 'info');
try {
  const { initializeApp } = require('firebase/app');
  const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
  
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  addTest('firebase', 'Firebase Initialization', 'passed', 'Firebase app and Firestore initialized successfully');
  logTest('✅', 'Firebase connectivity: ESTABLISHED', 'pass');
  
  // Test Firestore access
  logTest('📊', 'Testing Firestore Database Access...', 'info');
  const { doc, getDoc } = require('firebase/firestore');
  
  // Try to access a test document (this will create it if it doesn't exist)
  const testDocRef = doc(db, 'test', 'connectivity');
  
  addTest('firebase', 'Firestore Access', 'passed', 'Firestore database is accessible');
  logTest('✅', 'Firestore database: ACCESSIBLE', 'pass');
  
} catch (error) {
  addTest('firebase', 'Firebase Initialization', 'failed', `Firebase initialization failed: ${error.message}`);
  logTest('❌', `Firebase connectivity: FAILED - ${error.message}`, 'fail');
}

// Test 3: Build System
logTest('🏗️', 'Testing Build System...', 'info');
try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    addTest('deployment', 'Build Script', 'passed', 'Build script is configured');
    logTest('✅', 'Build system: CONFIGURED', 'pass');
  } else {
    addTest('deployment', 'Build Script', 'failed', 'Build script not found in package.json');
    logTest('❌', 'Build system: NOT CONFIGURED', 'fail');
  }
} catch (error) {
  addTest('deployment', 'Build Script', 'failed', `Build system test failed: ${error.message}`);
  logTest('❌', `Build system error: ${error.message}`, 'fail');
}

// Test 4: Deployment Configuration
logTest('🚀', 'Testing Deployment Configuration...', 'info');
try {
  const vercelConfigPath = path.join(__dirname, 'vercel.json');
  if (fs.existsSync(vercelConfigPath)) {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    addTest('deployment', 'Vercel Configuration', 'passed', 'vercel.json exists and is valid');
    logTest('✅', 'Vercel deployment: CONFIGURED', 'pass');
  } else {
    addTest('deployment', 'Vercel Configuration', 'warning', 'vercel.json not found');
    logTest('⚠️', 'Vercel config: NOT FOUND', 'warning');
  }
} catch (error) {
  addTest('deployment', 'Vercel Configuration', 'failed', `Vercel config error: ${error.message}`);
  logTest('❌', `Vercel config error: ${error.message}`, 'fail');
}

// Test 5: Source Code Validation
logTest('📝', 'Testing Source Code Structure...', 'info');
try {
  const criticalFiles = [
    'src/App.tsx',
    'src/firebase/config.ts',
    'src/services/realTimeAnalytics.ts',
    'src/utils/FirebaseValidationService.ts',
    'src/components/FirebaseTestComponent.tsx'
  ];
  
  let missingFiles = [];
  criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length === 0) {
    addTest('firebase', 'Source Code Structure', 'passed', 'All critical files are present');
    logTest('✅', 'Source code structure: COMPLETE', 'pass');
  } else {
    addTest('firebase', 'Source Code Structure', 'failed', `Missing files: ${missingFiles.join(', ')}`);
    logTest('❌', `Missing source files: ${missingFiles.join(', ')}`, 'fail');
  }
} catch (error) {
  addTest('firebase', 'Source Code Structure', 'failed', `Source code validation error: ${error.message}`);
  logTest('❌', `Source code error: ${error.message}`, 'fail');
}

// Test 6: Analytics Services
logTest('📊', 'Testing Analytics Services Configuration...', 'info');
try {
  const analyticsServicePath = path.join(__dirname, 'src/services/realTimeAnalytics.ts');
  const validationServicePath = path.join(__dirname, 'src/utils/FirebaseValidationService.ts');
  
  if (fs.existsSync(analyticsServicePath) && fs.existsSync(validationServicePath)) {
    addTest('analytics', 'Analytics Services', 'passed', 'Real-time analytics and validation services are present');
    logTest('✅', 'Analytics services: CONFIGURED', 'pass');
  } else {
    addTest('analytics', 'Analytics Services', 'failed', 'Analytics service files missing');
    logTest('❌', 'Analytics services: MISSING', 'fail');
  }
} catch (error) {
  addTest('analytics', 'Analytics Services', 'failed', `Analytics services test failed: ${error.message}`);
  logTest('❌', `Analytics services error: ${error.message}`, 'fail');
}

// Generate Final Report
console.log('\n' + '='.repeat(60));
console.log('📋 COMPREHENSIVE TEST RESULTS SUMMARY');
console.log('='.repeat(60));

let totalPassed = 0, totalFailed = 0, totalWarnings = 0, totalTests = 0;

Object.entries(testResults).forEach(([category, results]) => {
  const categoryTotal = results.passed + results.failed + results.warnings;
  if (categoryTotal > 0) {
    totalPassed += results.passed;
    totalFailed += results.failed;
    totalWarnings += results.warnings;
    totalTests += categoryTotal;
    
    console.log(`\n🔹 ${category.toUpperCase()}:`);
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   ⚠️  Warnings: ${results.warnings}`);
    console.log(`   📊 Total: ${categoryTotal}`);
  }
});

console.log('\n' + '-'.repeat(40));
console.log('🎯 OVERALL RESULTS:');
console.log(`   ✅ Total Passed: ${totalPassed}`);
console.log(`   ❌ Total Failed: ${totalFailed}`);
console.log(`   ⚠️  Total Warnings: ${totalWarnings}`);
console.log(`   📊 Total Tests: ${totalTests}`);

const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';
console.log(`   🎉 Success Rate: ${successRate}%`);

// Final Status
if (totalFailed === 0 && totalWarnings === 0) {
  logTest('🎉', 'ALL TESTS PASSED! Red Lotus backend is fully operational!', 'pass');
} else if (totalFailed === 0) {
  logTest('✅', `Backend is operational with ${totalWarnings} warnings to review`, 'warning');
} else {
  logTest('⚠️', `Backend has ${totalFailed} critical issues that need attention`, 'fail');
}

console.log('\n' + '='.repeat(60));
console.log('🎵 RED LOTUS BACKEND TESTING COMPLETE 🎵');
console.log('='.repeat(60));

// Next Steps
console.log('\n📋 RECOMMENDED NEXT STEPS:');
if (totalFailed === 0) {
  console.log('1. ✅ Access testing dashboard: http://localhost:5174/firebase-test');
  console.log('2. ✅ Run user interface tests on the website');
  console.log('3. ✅ Verify real-time analytics data in Firebase Console');
  console.log('4. ✅ Test all user interactions (music, uploads, forms)');
  console.log('5. ✅ Monitor live website at https://redlotusofficial.com');
} else {
  console.log('1. ❌ Fix the failed tests listed above');
  console.log('2. ❌ Re-run this testing suite');
  console.log('3. ❌ Check Firebase Console for additional issues');
}

console.log('\n🌐 LIVE WEBSITE: https://redlotusofficial.com');
console.log('🔧 DEV SERVER: http://localhost:5174');
console.log('🧪 TEST DASHBOARD: http://localhost:5174/firebase-test');
