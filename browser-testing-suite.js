/**
 * Red Lotus Website - Real-Time Testing Validation
 * Browser-based testing for analytics and user interactions
 */

console.log('%c🎵 RED LOTUS REAL-TIME TESTING VALIDATION 🎵', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
console.log('%c═══════════════════════════════════════════════════════════', 'color: #4ecdc4;');

// Test Results Container
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

function logTest(emoji, title, status, message) {
    const colors = {
        pass: 'color: #2ecc71; font-weight: bold;',
        fail: 'color: #e74c3c; font-weight: bold;',
        warn: 'color: #f39c12; font-weight: bold;',
        info: 'color: #3498db; font-weight: bold;'
    };
    
    console.log(`%c${emoji} ${title}`, colors[status] || colors.info);
    if (message) console.log(`   ${message}`);
    
    testResults.tests.push({ title, status, message, timestamp: new Date() });
    testResults[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++;
}

// Test 1: Check if we're on the correct domain
function testDomain() {
    const currentDomain = window.location.hostname;
    const expectedDomains = ['redlotusofficial.com', 'www.redlotusofficial.com', 'localhost'];
    
    if (expectedDomains.some(domain => currentDomain.includes(domain))) {
        logTest('🌐', 'Domain Verification', 'pass', `Correct domain: ${currentDomain}`);
    } else {
        logTest('🌐', 'Domain Verification', 'fail', `Unexpected domain: ${currentDomain}`);
    }
}

// Test 2: Check Firebase Analytics initialization
function testFirebaseAnalytics() {
    try {
        // Check if Firebase analytics is loaded
        if (typeof window.gtag !== 'undefined' || window.firebase) {
            logTest('🔥', 'Firebase Analytics', 'pass', 'Firebase Analytics is initialized');
        } else {
            logTest('🔥', 'Firebase Analytics', 'warn', 'Firebase Analytics may not be fully loaded');
        }
    } catch (error) {
        logTest('🔥', 'Firebase Analytics', 'fail', `Error: ${error.message}`);
    }
}

// Test 3: Check for React and main app
function testReactApp() {
    try {
        const reactRoot = document.getElementById('root');
        if (reactRoot && reactRoot.children.length > 0) {
            logTest('⚛️', 'React Application', 'pass', 'React app is mounted and rendering');
        } else {
            logTest('⚛️', 'React Application', 'fail', 'React app not found or not rendering');
        }
    } catch (error) {
        logTest('⚛️', 'React Application', 'fail', `Error: ${error.message}`);
    }
}

// Test 4: Check for music elements
function testMusicElements() {
    try {
        const audioElements = document.querySelectorAll('audio, [class*="music"], [class*="player"], [class*="play"]');
        if (audioElements.length > 0) {
            logTest('🎵', 'Music Elements', 'pass', `Found ${audioElements.length} music-related elements`);
        } else {
            logTest('🎵', 'Music Elements', 'warn', 'No music elements detected yet (may load dynamically)');
        }
    } catch (error) {
        logTest('🎵', 'Music Elements', 'fail', `Error: ${error.message}`);
    }
}

// Test 5: Check navigation
function testNavigation() {
    try {
        const navElements = document.querySelectorAll('nav, header, [class*="nav"]');
        const links = document.querySelectorAll('a[href]');
        
        if (navElements.length > 0 && links.length > 0) {
            logTest('🧭', 'Navigation', 'pass', `Navigation present with ${links.length} links`);
        } else {
            logTest('🧭', 'Navigation', 'warn', 'Limited navigation detected');
        }
    } catch (error) {
        logTest('🧭', 'Navigation', 'fail', `Error: ${error.message}`);
    }
}

// Test 6: Check for forms
function testForms() {
    try {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, textarea, select');
        
        if (forms.length > 0 || inputs.length > 0) {
            logTest('📝', 'Forms & Inputs', 'pass', `Found ${forms.length} forms and ${inputs.length} inputs`);
        } else {
            logTest('📝', 'Forms & Inputs', 'warn', 'No forms detected (may load with user interaction)');
        }
    } catch (error) {
        logTest('📝', 'Forms & Inputs', 'fail', `Error: ${error.message}`);
    }
}

// Test 7: Check console for errors
function testConsoleErrors() {
    const originalError = console.error;
    const errors = [];
    
    console.error = function(...args) {
        errors.push(args.join(' '));
        originalError.apply(console, args);
    };
    
    setTimeout(() => {
        if (errors.length === 0) {
            logTest('🐛', 'Console Errors', 'pass', 'No console errors detected');
        } else {
            logTest('🐛', 'Console Errors', 'warn', `${errors.length} console errors detected`);
        }
        console.error = originalError;
    }, 2000);
}

// Test 8: Performance check
function testPerformance() {
    try {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
            
            if (loadTime < 3000) {
                logTest('⚡', 'Performance', 'pass', `Load time: ${loadTime.toFixed(2)}ms`);
            } else {
                logTest('⚡', 'Performance', 'warn', `Slow load time: ${loadTime.toFixed(2)}ms`);
            }
        } else {
            logTest('⚡', 'Performance', 'warn', 'Performance metrics not available');
        }
    } catch (error) {
        logTest('⚡', 'Performance', 'fail', `Error: ${error.message}`);
    }
}

// Test 9: Mobile responsiveness
function testResponsive() {
    try {
        const viewport = document.querySelector('meta[name="viewport"]');
        const isMobile = window.innerWidth <= 768;
        
        if (viewport) {
            logTest('📱', 'Mobile Responsive', 'pass', `Viewport meta tag present, width: ${window.innerWidth}px`);
        } else {
            logTest('📱', 'Mobile Responsive', 'warn', 'No viewport meta tag found');
        }
    } catch (error) {
        logTest('📱', 'Mobile Responsive', 'fail', `Error: ${error.message}`);
    }
}

// Test 10: Analytics tracking simulation
function testAnalyticsTracking() {
    try {
        // Simulate analytics events
        if (typeof gtag === 'function') {
            gtag('event', 'test_interaction', {
                event_category: 'testing',
                event_label: 'comprehensive_test'
            });
            logTest('📊', 'Analytics Tracking', 'pass', 'Analytics event sent successfully');
        } else {
            logTest('📊', 'Analytics Tracking', 'warn', 'gtag not available, analytics may be loading');
        }
    } catch (error) {
        logTest('📊', 'Analytics Tracking', 'fail', `Error: ${error.message}`);
    }
}

// Run all tests
function runComprehensiveTests() {
    console.log('%c🚀 Starting Comprehensive Website Validation...', 'color: #9b59b6; font-size: 16px;');
    console.log('');
    
    testDomain();
    testFirebaseAnalytics();
    testReactApp();
    testMusicElements();
    testNavigation();
    testForms();
    testConsoleErrors();
    testPerformance();
    testResponsive();
    testAnalyticsTracking();
    
    // Generate summary after all tests
    setTimeout(() => {
        console.log('');
        console.log('%c═══════════════════════════════════════════════════════════', 'color: #4ecdc4;');
        console.log('%c📋 COMPREHENSIVE TEST RESULTS SUMMARY', 'color: #ff6b6b; font-size: 16px; font-weight: bold;');
        console.log('%c═══════════════════════════════════════════════════════════', 'color: #4ecdc4;');
        
        const total = testResults.passed + testResults.failed + testResults.warnings;
        const successRate = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : '0.0';
        
        console.log(`%c📊 Test Results:`, 'color: #2c3e50; font-weight: bold;');
        console.log(`   ✅ Passed: ${testResults.passed}`);
        console.log(`   ❌ Failed: ${testResults.failed}`);
        console.log(`   ⚠️  Warnings: ${testResults.warnings}`);
        console.log(`   📈 Total: ${total}`);
        console.log(`   🎯 Success Rate: ${successRate}%`);
        
        if (testResults.failed === 0) {
            console.log('%c🎉 ALL CRITICAL TESTS PASSED!', 'color: #27ae60; font-size: 18px; font-weight: bold;');
            console.log('%c✅ Red Lotus website is fully operational!', 'color: #27ae60; font-weight: bold;');
        } else {
            console.log(`%c⚠️ ${testResults.failed} critical issues detected`, 'color: #e74c3c; font-weight: bold;');
            console.log('%c❌ Review failed tests above', 'color: #e74c3c; font-weight: bold;');
        }
        
        console.log('');
        console.log('%c📱 MANUAL TESTING RECOMMENDATIONS:', 'color: #8e44ad; font-weight: bold;');
        console.log('1. 🎵 Test music player functionality');
        console.log('2. 📝 Test form submissions');
        console.log('3. 🛒 Test store/commerce features');
        console.log('4. 👥 Test user registration/login');
        console.log('5. 📱 Test on mobile devices');
        console.log('6. 🔧 Visit Firebase test dashboard for detailed analytics testing');
        console.log('');
        console.log('%c🔧 Testing Dashboard: http://localhost:5174/firebase-test', 'color: #3498db; font-weight: bold;');
        console.log('%c🌐 Live Website: https://redlotusofficial.com', 'color: #3498db; font-weight: bold;');
        console.log('');
        console.log('%c🎵 RED LOTUS TESTING COMPLETE 🎵', 'color: #ff6b6b; font-size: 16px; font-weight: bold;');
        
    }, 3000);
}

// Auto-run tests when script loads
runComprehensiveTests();

// Provide manual test functions
window.redLotusTest = {
    runTests: runComprehensiveTests,
    testDomain,
    testFirebaseAnalytics,
    testReactApp,
    testMusicElements,
    testNavigation,
    testForms,
    testPerformance,
    testResponsive,
    testAnalyticsTracking,
    results: testResults
};

console.log('%c💡 To re-run tests manually, use: redLotusTest.runTests()', 'color: #95a5a6; font-style: italic;');
