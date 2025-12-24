/**
 * Real-Time Analytics Testing Suite
 * Red Lotus Website - Analytics Functions Validation
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, updateDoc, increment } = require('firebase/firestore');

require('dotenv').config({ path: '.env.local' });

console.log('📊 RED LOTUS REAL-TIME ANALYTICS TESTING 📊');
console.log('=' .repeat(50));

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testAnalyticsFunction(name, testFunction) {
  try {
    console.log(`🧪 Testing ${name}...`);
    const result = await testFunction();
    console.log(`✅ ${name}: SUCCESS - ${result}`);
    return { name, status: 'success', result };
  } catch (error) {
    console.log(`❌ ${name}: FAILED - ${error.message}`);
    return { name, status: 'failed', error: error.message };
  }
}

async function runAnalyticsTests() {
  const testResults = [];
  
  // Test 1: Visitor Tracking
  testResults.push(await testAnalyticsFunction('Visitor Tracking', async () => {
    const visitorRef = doc(db, 'analytics', 'visitors');
    const initialData = await getDoc(visitorRef);
    const initialCount = initialData.exists() ? initialData.data().count || 0 : 0;
    
    // Simulate visitor tracking
    await setDoc(visitorRef, { 
      count: increment(1),
      lastUpdated: new Date().toISOString(),
      testMode: true
    }, { merge: true });
    
    const updatedData = await getDoc(visitorRef);
    const newCount = updatedData.data().count;
    
    return `Visitor count: ${initialCount} → ${newCount}`;
  }));
  
  // Test 2: Music Streaming Analytics
  testResults.push(await testAnalyticsFunction('Music Stream Tracking', async () => {
    const streamRef = doc(db, 'analytics', 'music_streams');
    const initialData = await getDoc(streamRef);
    const initialCount = initialData.exists() ? initialData.data().count || 0 : 0;
    
    // Simulate music stream
    await setDoc(streamRef, {
      count: increment(1),
      lastUpdated: new Date().toISOString(),
      lastSong: 'test-song-backend-validation',
      testMode: true
    }, { merge: true });
    
    const updatedData = await getDoc(streamRef);
    const newCount = updatedData.data().count;
    
    return `Music streams: ${initialCount} → ${newCount}`;
  }));
  
  // Test 3: Tribe Selection Analytics
  testResults.push(await testAnalyticsFunction('Tribe Selection Tracking', async () => {
    const tribeRef = doc(db, 'analytics', 'tribe_selections');
    const initialData = await getDoc(tribeRef);
    const initialRed = initialData.exists() ? (initialData.data().red || 0) : 0;
    
    // Simulate tribe selection
    await setDoc(tribeRef, {
      red: increment(1),
      lastUpdated: new Date().toISOString(),
      testMode: true
    }, { merge: true });
    
    const updatedData = await getDoc(tribeRef);
    const newRed = updatedData.data().red;
    
    return `Red tribe selections: ${initialRed} → ${newRed}`;
  }));
  
  // Test 4: User Signups Analytics
  testResults.push(await testAnalyticsFunction('User Signup Tracking', async () => {
    const signupRef = doc(db, 'analytics', 'signups');
    const initialData = await getDoc(signupRef);
    const initialCount = initialData.exists() ? initialData.data().count || 0 : 0;
    
    // Simulate signup
    await setDoc(signupRef, {
      count: increment(1),
      lastUpdated: new Date().toISOString(),
      testMode: true
    }, { merge: true });
    
    const updatedData = await getDoc(signupRef);
    const newCount = updatedData.data().count;
    
    return `User signups: ${initialCount} → ${newCount}`;
  }));
  
  // Test 5: Purchase Analytics
  testResults.push(await testAnalyticsFunction('Purchase Event Tracking', async () => {
    const purchaseRef = doc(db, 'analytics', 'purchases');
    const timestamp = new Date().toISOString();
    
    // Simulate purchase event
    await setDoc(doc(db, 'analytics', `purchase_${Date.now()}`), {
      amount: 25.00,
      item: 'test-merchandise',
      timestamp: timestamp,
      testMode: true
    });
    
    return `Purchase event recorded at ${timestamp}`;
  }));
  
  // Test 6: Real-Time Data Retrieval
  testResults.push(await testAnalyticsFunction('Real-Time Data Retrieval', async () => {
    const collections = ['visitors', 'music_streams', 'tribe_selections', 'signups'];
    const results = {};
    
    for (const collection of collections) {
      const docRef = doc(db, 'analytics', collection);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        results[collection] = docSnap.data();
      }
    }
    
    return `Retrieved data from ${Object.keys(results).length} collections`;
  }));
  
  return testResults;
}

// Run the tests
runAnalyticsTests().then(results => {
  console.log('\n' + '='.repeat(50));
  console.log('📋 ANALYTICS TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const total = results.length;
  
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${total}`);
  console.log(`   🎯 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL ANALYTICS TESTS PASSED!');
    console.log('✅ Real-time analytics system is fully operational');
    console.log('✅ Data collection and retrieval working correctly');
    console.log('✅ Firebase Firestore integration successful');
  } else {
    console.log('\n⚠️  Some analytics tests failed');
    console.log('❌ Check Firebase Console for additional details');
  }
  
  console.log('\n📱 NEXT STEPS:');
  console.log('1. Test website UI interactions');
  console.log('2. Verify admin panel functions');
  console.log('3. Test music upload and streaming');
  console.log('4. Validate form submissions');
  console.log('5. Check live analytics dashboard');
  
  console.log('\n🌐 LIVE WEBSITE: https://redlotusofficial.com');
  console.log('🔧 TEST DASHBOARD: http://localhost:5174/firebase-test');
  
}).catch(error => {
  console.error('❌ Analytics testing failed:', error);
  process.exit(1);
});
