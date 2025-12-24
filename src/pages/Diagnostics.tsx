import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Diagnostics: React.FC = () => {
  const navigate = useNavigate();
  const [firebaseConfig, setFirebaseConfig] = useState<Record<string, string>>({});
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Collect Firebase config from environment variables
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'MISSING',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'MISSING',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'MISSING',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'MISSING',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'MISSING',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || 'MISSING',
    };
    setFirebaseConfig(config);

    // Check current auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const testAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestResult(null);
    setTestError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      setTestResult(`Authentication successful! Logged in as ${userCredential.user.email}`);
    } catch (error: any) {
      console.error('Authentication test failed:', error);
      setTestError(`Authentication failed: ${error.code} - ${error.message}`);
    }
  };

  const configStatus = Object.entries(firebaseConfig).every(([_, value]) => value !== 'MISSING')
    ? 'All Firebase configuration values are present'
    : 'Some Firebase configuration values are missing';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-red-700 text-white">
          <h1 className="text-xl font-bold">Red Lotus Firebase Diagnostics</h1>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          
          <div className="mb-6 border rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="font-medium">Firebase Configuration</h3>
            </div>
            <div className="p-4">
              <p className={`mb-2 ${configStatus.includes('missing') ? 'text-red-600' : 'text-green-600'}`}>
                {configStatus}
              </p>
              
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-4 border">Parameter</th>
                    <th className="text-left py-2 px-4 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(firebaseConfig).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 px-4 border">{key}</td>
                      <td className={`py-2 px-4 border ${value === 'MISSING' ? 'text-red-600' : 'text-green-600'}`}>
                        {value === 'MISSING' ? 'Missing' : 'Present'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6 border rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="font-medium">Authentication Status</h3>
            </div>
            <div className="p-4">
              {currentUser ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p><strong>Currently logged in as:</strong> {currentUser.email}</p>
                  <p><strong>User ID:</strong> {currentUser.uid}</p>
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  Not currently logged in
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Test Authentication</h4>
                <form onSubmit={testAuthentication} className="space-y-4">
                  <div>
                    <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="testEmail"
                      type="email"
                      value={testEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="testPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="testPassword"
                      type="password"
                      value={testPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Test Sign In
                  </button>
                </form>
                
                {testResult && (
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {testResult}
                  </div>
                )}
                
                {testError && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {testError}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate('/login')}
              className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Go to Login Page
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
