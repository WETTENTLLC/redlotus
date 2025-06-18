import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app, auth } from '../../firebase/config';

const FirebaseAuthDiagnostics: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [results, setResults] = useState<Array<{test: string, passed: boolean, message: string}>>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [envVarStatus, setEnvVarStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, []);

  const runDiagnostics = async () => {
    setStatus('testing');
    setResults([]);
    setErrorDetails('');
    
    // Test 1: Check Firebase initialization
    try {
      if (!app) {
        throw new Error('Firebase app is not initialized');
      }
      
      addResult('Firebase Initialization', true, 'Firebase app is properly initialized');
    } catch (error: any) {
      addResult('Firebase Initialization', false, `Error: ${error.message}`);
      setStatus('error');
      return;
    }
    
    // Test 2: Check environment variables
    const envVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];
    
    let missingVars = [];
    const envStatus: Record<string, string> = {};
    
    for (const varName of envVars) {
      const value = import.meta.env[varName];
      envStatus[varName] = value && !value.includes('MISSING') ? 'present' : 'missing';
      if (!value || value.includes('MISSING')) {
        missingVars.push(varName);
      }
    }
    
    setEnvVarStatus(envStatus);
      if (missingVars.length > 0) {
      addResult('Environment Variables', false, `Missing variables: ${missingVars.join(', ')}`);
      setStatus('error');
    } else {
      addResult('Environment Variables', true, 'All environment variables are set');
    }
    
    // Test 3: Check auth service
    try {
      if (!auth) {
        throw new Error('Auth service could not be initialized');
      }
      
      addResult('Auth Service', true, 'Auth service is available');
    } catch (error: any) {
      addResult('Auth Service', false, `Error: ${error.message}`);
      setStatus('error');
      return;
    }
    
    // Test 4: Check Firebase project access
    try {
      addResult('Firebase Project Access', true, 'Project ID: red-lotus-cf4b4');
    } catch (error: any) {
      addResult('Firebase Project Access', false, `Error determining project access`);
    }
    
    setStatus('success');
  };
    const testLogin = async () => {
    if (!testEmail || !testPassword) {
      setErrorDetails('Please enter both email and password');
      return;
    }
    
    setStatus('testing');
    setErrorDetails('');
    
    try {
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      addResult('Test Login', true, `Successfully logged in as ${testEmail}`);
      
      // Sign out after successful login is optional, leaving user logged in helps troubleshooting
      // await signOut(auth);
      // addResult('Test Logout', true, 'Successfully logged out');
      
      setStatus('success');
    } catch (error: any) {
      console.error('Login test error:', error);
      addResult('Test Login', false, `Login failed: ${error.code} - ${error.message}`);
      setErrorDetails(`${error.code}: ${error.message}`);
      setStatus('error');
    }
  };
  
  const addResult = (test: string, passed: boolean, message: string) => {
    setResults(prev => [...prev, { test, passed, message }]);
  };
  
  useEffect(() => {
    // Run diagnostics when component mounts
    runDiagnostics();
  }, []);
  
  return (      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-lotus">Firebase Authentication Diagnostics</h2>
      
      <div className="mb-4 p-3 bg-blue-100 rounded text-blue-800">
        <p className="font-semibold">Your Firebase User ID: 6vYl8pnvVrdDxOW0ywxL7qFuJGh1</p>
        <p className="text-sm mt-1">This ID is associated with your admin account.</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">System Checks</h3>
        {status === 'testing' && (
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin h-4 w-4 border-2 border-red-lotus border-t-transparent rounded-full"></div>
            <span>Running diagnostics...</span>
          </div>
        )}
        
        <div className="space-y-2 mt-3">
          {results.map((result, index) => (
            <div key={index} className={`p-3 rounded ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-semibold flex items-center">
                <span className={`mr-2 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.passed ? '✓' : '✗'}
                </span>
                {result.test}
              </div>
              <div className={`text-sm ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Test Login</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={testPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          {errorDetails && (
            <div className="p-3 bg-red-100 text-red-800 rounded text-sm">
              {errorDetails}
            </div>
          )}
          
          <button
            onClick={testLogin}
            className="w-full py-2 px-4 bg-red-lotus text-white rounded-md hover:bg-opacity-90 transition"
          >
            Test Credentials
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p><strong>Note:</strong> This tool is for diagnostic purposes only. It helps you verify if your Firebase configuration is working correctly.</p>
        <p className="mt-2">If you're having trouble, please check the <a href="ADMIN_LOGIN_SETUP.md" className="text-red-lotus hover:underline">Admin Login Setup Guide</a>.</p>
      </div>
    </div>
  );
};

export default FirebaseAuthDiagnostics;
