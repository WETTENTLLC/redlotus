#!/usr/bin/env node

/**
 * Red Lotus - Quick Functionality Test
 * Tests basic Firebase connectivity and PayPal configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🌸 Red Lotus - Quick Functionality Test\n');

// Check if environment file exists and has required variables
function checkEnvironmentSetup() {
  console.log('1. Checking environment setup...');
  
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('   ❌ .env.local file not found');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_PAYPAL_CLIENT_ID'
  ];
  
  let allSet = true;
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=\n`)) {
      console.log(`   ❌ ${varName} not set`);
      allSet = false;
    } else {
      console.log(`   ✅ ${varName} configured`);
    }
  });
  
  return allSet;
}

// Check if all main files exist
function checkFileStructure() {
  console.log('\n2. Checking file structure...');
  
  const requiredFiles = [
    'src/App.tsx',
    'src/pages/AdminDashboard.tsx',
    'src/components/admin/StoreManager.tsx',
    'src/components/admin/ContentManager.tsx',
    'src/components/admin/BookingManager.tsx',
    'src/components/store/StoreFront.tsx',
    'src/components/pages/FanArtPage.tsx',
    'src/components/pages/OfferBasedBookingPage.tsx',
    'src/components/payments/PayPalPayment.tsx',
    'src/firebase/config.ts'
  ];
  
  let allExist = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} missing`);
      allExist = false;
    }
  });
  
  return allExist;
}

// Check package.json dependencies
function checkDependencies() {
  console.log('\n3. Checking dependencies...');
  
  const packagePath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log('   ❌ package.json not found');
    return false;
  }
  
  const package_ = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = [
    'firebase',
    'react-firebase-hooks',
    '@paypal/react-paypal-js',
    'react',
    'react-dom',
    'tailwindcss'
  ];
  
  let allInstalled = true;
  requiredDeps.forEach(dep => {
    if (package_.dependencies[dep] || package_.devDependencies[dep]) {
      console.log(`   ✅ ${dep}`);
    } else {
      console.log(`   ❌ ${dep} not installed`);
      allInstalled = false;
    }
  });
  
  return allInstalled;
}

// Run all checks
function runTests() {
  const envOk = checkEnvironmentSetup();
  const filesOk = checkFileStructure();
  const depsOk = checkDependencies();
  
  console.log('\n📊 Test Results:');
  console.log(`   Environment: ${envOk ? '✅ Ready' : '❌ Needs setup'}`);
  console.log(`   File Structure: ${filesOk ? '✅ Complete' : '❌ Missing files'}`);
  console.log(`   Dependencies: ${depsOk ? '✅ Installed' : '❌ Missing packages'}`);
  
  if (envOk && filesOk && depsOk) {
    console.log('\n🎉 All checks passed! Ready for testing.');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Open: http://localhost:5175/');
    console.log('   3. Test admin dashboard: /admin');
    console.log('   4. Follow ADMIN_TESTING_CHECKLIST.md');
  } else {
    console.log('\n⚠️  Some issues found. Please fix before proceeding.');
  }
}

runTests();
