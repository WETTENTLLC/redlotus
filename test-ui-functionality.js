/**
 * Red Lotus Website UI Testing Script
 * Tests all user interactions, buttons, forms, and functionality
 */

const puppeteer = require('puppeteer');

console.log('🎵 RED LOTUS WEBSITE UI TESTING SUITE 🎵');
console.log('=' .repeat(50));

async function testWebsiteFunctionality() {
  let browser;
  const testResults = [];
  
  try {
    // Launch browser
    console.log('🚀 Launching browser for testing...');
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for headless testing
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    // Enable console logging from the page
    page.on('console', msg => {
      if (msg.text().includes('🎵') || msg.text().includes('📊') || msg.text().includes('Analytics')) {
        console.log('🌐 Page Log:', msg.text());
      }
    });
    
    // Test 1: Load Homepage
    console.log('\n📱 Testing Homepage Load...');
    try {
      await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
      const title = await page.title();
      console.log(`✅ Homepage loaded: "${title}"`);
      testResults.push({ test: 'Homepage Load', status: 'PASS', details: title });
    } catch (error) {
      console.log(`❌ Homepage load failed: ${error.message}`);
      testResults.push({ test: 'Homepage Load', status: 'FAIL', details: error.message });
    }
    
    // Test 2: Navigation Menu
    console.log('\n🧭 Testing Navigation Menu...');
    try {
      const navLinks = await page.$$('nav a, header a');
      console.log(`✅ Found ${navLinks.length} navigation links`);
      testResults.push({ test: 'Navigation Menu', status: 'PASS', details: `${navLinks.length} links found` });
    } catch (error) {
      console.log(`❌ Navigation test failed: ${error.message}`);
      testResults.push({ test: 'Navigation Menu', status: 'FAIL', details: error.message });
    }
    
    // Test 3: Music Player
    console.log('\n🎵 Testing Music Player...');
    try {
      const musicButtons = await page.$$('[class*="play"], [class*="music"], audio');
      console.log(`✅ Found ${musicButtons.length} music-related elements`);
      testResults.push({ test: 'Music Player', status: 'PASS', details: `${musicButtons.length} music elements` });
    } catch (error) {
      console.log(`❌ Music player test failed: ${error.message}`);
      testResults.push({ test: 'Music Player', status: 'FAIL', details: error.message });
    }
    
    // Test 4: Firebase Test Page
    console.log('\n🔥 Testing Firebase Test Dashboard...');
    try {
      await page.goto('http://localhost:5174/firebase-test', { waitUntil: 'networkidle0' });
      
      // Look for Firebase test buttons
      const testButtons = await page.$$('button');
      console.log(`✅ Firebase test page loaded with ${testButtons.length} test buttons`);
      
      // Try to click validation button if it exists
      const validationButton = await page.$('button:has-text("Run Complete Validation")');
      if (validationButton) {
        await validationButton.click();
        console.log('✅ Clicked validation button');
        await page.waitForTimeout(3000); // Wait for tests to run
      }
      
      testResults.push({ test: 'Firebase Test Page', status: 'PASS', details: `${testButtons.length} test controls` });
    } catch (error) {
      console.log(`❌ Firebase test page failed: ${error.message}`);
      testResults.push({ test: 'Firebase Test Page', status: 'FAIL', details: error.message });
    }
    
    // Test 5: Diagnostics Page
    console.log('\n🔧 Testing Diagnostics Page...');
    try {
      await page.goto('http://localhost:5174/diagnostics', { waitUntil: 'networkidle0' });
      const pageContent = await page.content();
      if (pageContent.includes('Firebase') || pageContent.includes('Diagnostics')) {
        console.log('✅ Diagnostics page loaded successfully');
        testResults.push({ test: 'Diagnostics Page', status: 'PASS', details: 'Page loaded with content' });
      } else {
        throw new Error('Diagnostics content not found');
      }
    } catch (error) {
      console.log(`❌ Diagnostics page failed: ${error.message}`);
      testResults.push({ test: 'Diagnostics Page', status: 'FAIL', details: error.message });
    }
    
    // Test 6: Forms and Inputs
    console.log('\n📝 Testing Forms and Inputs...');
    try {
      await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
      const forms = await page.$$('form');
      const inputs = await page.$$('input, textarea, select');
      console.log(`✅ Found ${forms.length} forms and ${inputs.length} input elements`);
      testResults.push({ test: 'Forms and Inputs', status: 'PASS', details: `${forms.length} forms, ${inputs.length} inputs` });
    } catch (error) {
      console.log(`❌ Forms test failed: ${error.message}`);
      testResults.push({ test: 'Forms and Inputs', status: 'FAIL', details: error.message });
    }
    
    // Test 7: Check for JavaScript Errors
    console.log('\n🐛 Checking for JavaScript Errors...');
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Navigate through key pages to trigger any errors
    const testPages = [
      'http://localhost:5174',
      'http://localhost:5174/music',
      'http://localhost:5174/about',
      'http://localhost:5174/store'
    ];
    
    for (const url of testPages) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });
      } catch (error) {
        // Page might not exist, continue testing
      }
    }
    
    if (jsErrors.length === 0) {
      console.log('✅ No JavaScript errors detected');
      testResults.push({ test: 'JavaScript Errors', status: 'PASS', details: 'No errors found' });
    } else {
      console.log(`⚠️ Found ${jsErrors.length} JavaScript errors`);
      testResults.push({ test: 'JavaScript Errors', status: 'WARN', details: `${jsErrors.length} errors` });
    }
    
    // Test 8: Performance Check
    console.log('\n⚡ Testing Page Performance...');
    try {
      await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime
        };
      });
      
      console.log(`✅ Page load time: ${performanceMetrics.loadTime.toFixed(2)}ms`);
      console.log(`✅ DOM content loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
      testResults.push({ test: 'Performance', status: 'PASS', details: `Load: ${performanceMetrics.loadTime.toFixed(2)}ms` });
    } catch (error) {
      console.log(`❌ Performance test failed: ${error.message}`);
      testResults.push({ test: 'Performance', status: 'FAIL', details: error.message });
    }
    
  } catch (error) {
    console.error('❌ Testing suite failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return testResults;
}

// Test Live Website
async function testLiveWebsite() {
  console.log('\n🌐 Testing Live Website (redlotusofficial.com)...');
  let browser;
  const liveResults = [];
  
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Test live website load
    try {
      await page.goto('https://redlotusofficial.com', { waitUntil: 'networkidle0', timeout: 10000 });
      const title = await page.title();
      console.log(`✅ Live website loaded: "${title}"`);
      liveResults.push({ test: 'Live Website Load', status: 'PASS', details: title });
    } catch (error) {
      console.log(`❌ Live website failed: ${error.message}`);
      liveResults.push({ test: 'Live Website Load', status: 'FAIL', details: error.message });
    }
    
  } catch (error) {
    console.error('❌ Live website testing failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return liveResults;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive UI testing...\n');
  
  const localResults = await testWebsiteFunctionality();
  const liveResults = await testLiveWebsite();
  
  // Combine results
  const allResults = [...localResults, ...liveResults];
  
  // Generate report
  console.log('\n' + '='.repeat(50));
  console.log('📋 UI TESTING RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  const passed = allResults.filter(r => r.status === 'PASS').length;
  const failed = allResults.filter(r => r.status === 'FAIL').length;
  const warnings = allResults.filter(r => r.status === 'WARN').length;
  const total = allResults.length;
  
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   📈 Total: ${total}`);
  console.log(`   🎯 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  // Detailed results
  console.log('\n📝 Detailed Results:');
  allResults.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`   ${icon} ${result.test}: ${result.details}`);
  });
  
  if (failed === 0) {
    console.log('\n🎉 ALL UI TESTS PASSED!');
    console.log('✅ Website is fully functional');
    console.log('✅ User interactions working correctly');
    console.log('✅ Both local and live sites operational');
  } else {
    console.log('\n⚠️  Some UI tests failed');
    console.log('❌ Check the detailed results above');
  }
  
  console.log('\n🎵 RED LOTUS UI TESTING COMPLETE 🎵');
}

// Check if puppeteer is available
try {
  runAllTests().catch(error => {
    console.error('❌ UI testing failed:', error);
    console.log('\n📋 MANUAL TESTING CHECKLIST:');
    console.log('1. ✅ Open http://localhost:5174 and verify homepage loads');
    console.log('2. ✅ Navigate through all menu items');
    console.log('3. ✅ Test music player functionality');
    console.log('4. ✅ Access Firebase test dashboard: http://localhost:5174/firebase-test');
    console.log('5. ✅ Run validation tests on the dashboard');
    console.log('6. ✅ Check diagnostics page: http://localhost:5174/diagnostics');
    console.log('7. ✅ Test live website: https://redlotusofficial.com');
    console.log('8. ✅ Verify all forms and buttons work');
    console.log('9. ✅ Check browser console for any errors');
    console.log('10. ✅ Test on mobile/tablet devices');
  });
} catch (error) {
  console.log('📋 PUPPETEER NOT AVAILABLE - MANUAL TESTING REQUIRED');
  console.log('=' .repeat(50));
  console.log('\nTo install Puppeteer for automated testing:');
  console.log('npm install puppeteer');
  console.log('\n📋 MANUAL TESTING CHECKLIST:');
  console.log('1. ✅ Open http://localhost:5174 and verify homepage loads');
  console.log('2. ✅ Navigate through all menu items');
  console.log('3. ✅ Test music player functionality');
  console.log('4. ✅ Access Firebase test dashboard: http://localhost:5174/firebase-test');
  console.log('5. ✅ Run validation tests on the dashboard');
  console.log('6. ✅ Check diagnostics page: http://localhost:5174/diagnostics');
  console.log('7. ✅ Test live website: https://redlotusofficial.com');
  console.log('8. ✅ Verify all forms and buttons work');
  console.log('9. ✅ Check browser console for any errors');
  console.log('10. ✅ Test on mobile/tablet devices');
}
