import React from 'react';
import { useNavigate } from 'react-router-dom';
import FirebaseAuthDiagnostics from '../components/diagnostics/FirebaseAuthDiagnostics';

const DiagnosticsPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-red-lotus">Red Lotus Admin Diagnostics</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Back to Home
            </button>
          </div>
            <p className="mb-8 text-gray-700">
            This page helps you diagnose issues with Firebase authentication for the Red Lotus admin portal.
            If you're experiencing login problems, the tools below will help identify what's wrong.
          </p>
          
          <div className="mb-8 p-4 bg-blue-100 border border-blue-300 rounded text-blue-800">
            <h3 className="font-bold text-lg mb-2">Your Firebase Information</h3>
            <p><strong>User ID:</strong> 6vYl8pnvVrdDxOW0ywxL7qFuJGh1</p>
            <p><strong>Authorized Domain:</strong> https://red-lotus-731yjtl8z-wettentllcs-projects.vercel.app/</p>
            <p className="mt-2 text-sm">This information is important for setting up your Firebase configuration properly.</p>
          </div>
          
          <FirebaseAuthDiagnostics />
          
          <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-red-lotus">Additional Resources</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Setup Guide</h3>
                <p className="text-gray-700">Follow our detailed setup guide to configure Firebase authentication properly.</p>                <a
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    navigate('/setup-guide');
                  }}
                  className="text-red-lotus hover:underline inline-block mt-2"
                >
                  View Setup Guide
                </a>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Firebase Documentation</h3>
                <p className="text-gray-700">Official Firebase documentation for authentication.</p>
                <a
                  href="https://firebase.google.com/docs/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-lotus hover:underline inline-block mt-2"
                >
                  Firebase Auth Docs
                </a>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Run Setup Script</h3>
                <p className="text-gray-700">
                  We've created a setup script to help you configure Firebase. Run it from your project directory:
                </p>
                <div className="mt-2 p-3 bg-gray-100 rounded font-mono text-sm">
                  <p className="mb-1">Windows:</p>
                  <code>.\setup-firebase.ps1</code>
                  <p className="mt-2 mb-1">Mac/Linux:</p>
                  <code>bash setup-firebase.sh</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPage;
