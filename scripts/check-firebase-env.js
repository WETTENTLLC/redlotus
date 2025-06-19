// Check if Firebase environment variables are properly set
// Run this script with node: node check-firebase-env.js

console.log("Checking Firebase environment variables...");

const envVariables = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID"
];

let allPresent = true;
const missing = [];

// Check process.env for the variables
envVariables.forEach(variable => {
  if (!process.env[variable]) {
    allPresent = false;
    missing.push(variable);
  } else {
    console.log(`✓ ${variable} is set`);
  }
});

if (!allPresent) {
  console.log("\n❌ The following environment variables are missing:");
  missing.forEach(variable => {
    console.log(`  - ${variable}`);
  });
  
  console.log("\nTo fix this issue:");
  console.log("1. Create a .env file in the root of your project");
  console.log("2. Add the missing variables to the .env file");
  console.log("3. Make sure to add these variables to your Vercel project settings");
  console.log("\nExample .env file:");
  missing.forEach(variable => {
    console.log(`${variable}=your-value-here`);
  });
  
  process.exit(1);
} else {
  console.log("\n✅ All Firebase environment variables are set!");
  console.log("Your app should work correctly with Firebase authentication.");
  
  console.log("\n🔍 Remember: These variables must also be set in your Vercel project settings.");
  process.exit(0);
}
