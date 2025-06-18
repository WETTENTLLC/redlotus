import React, { useEffect, useState } from 'react';
import { analytics } from '../firebase/config';
import { trackMusicInteraction } from '../analytics/AnalyticsService';
import RealTimeAnalyticsService from '../services/realTimeAnalytics';
import FirebaseValidationService, { ValidationReport } from '../utils/FirebaseValidationService';

const FirebaseTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [isRunningValidation, setIsRunningValidation] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    visitors: 0,
    signups: 0,
    streams: 0
  });

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runCompleteValidation = async () => {
    setIsRunningValidation(true);
    addResult('🚀 Starting comprehensive Firebase validation...');
    
    try {
      const validator = new FirebaseValidationService();
      const report = await validator.runFullValidation();
      setValidationReport(report);
      addResult(`✅ Validation complete: ${report.passed}/${report.totalTests} tests passed`);
    } catch (error) {
      addResult(`❌ Validation failed: ${error}`);
    } finally {
      setIsRunningValidation(false);
    }
  };

  const testFirebaseAnalytics = async () => {
    try {
      // Test 1: Check if Firebase Analytics is initialized
      if (analytics) {
        addResult('✅ Firebase Analytics initialized successfully');
        console.log('🔥 Firebase Analytics object:', analytics);
      } else {
        addResult('❌ Firebase Analytics not initialized');
      }

      // Test 2: Test music interaction tracking
      try {
        await trackMusicInteraction('test-song', 'test_stream');
        addResult('✅ Music interaction tracking successful');
      } catch (error) {
        addResult(`❌ Music interaction tracking failed: ${error}`);
      }

      // Test 3: Test real-time analytics
      try {
        const rtService = RealTimeAnalyticsService.getInstance();
        await rtService.trackVisitor();
        addResult('✅ Real-time visitor tracking successful');
      } catch (error) {
        addResult(`❌ Real-time visitor tracking failed: ${error}`);
      }

      // Test 4: Get real-time data
      try {
        const rtService = RealTimeAnalyticsService.getInstance();
        const visitors = await rtService.getRealTimeVisitors();
        const signups = await rtService.getRealTimeSignups();
        const streams = await rtService.getRealTimeMusicStreams();
        
        setRealTimeData({ visitors, signups, streams });
        addResult(`✅ Real-time data retrieved: ${visitors} visitors, ${signups} signups, ${streams} streams`);
      } catch (error) {
        addResult(`❌ Real-time data retrieval failed: ${error}`);
      }

    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
    }
  };

  const testMusicInteractions = async () => {
    const interactions = ['stream', 'purchase', 'like', 'share'];
    const songs = ['red-lotus-rap', 'yellow-lotus-pop', 'blue-lotus-rnb'];
    
    for (const song of songs) {
      for (const interaction of interactions) {
        try {
          await trackMusicInteraction(song, interaction as any);
          addResult(`✅ ${song} - ${interaction} tracked`);
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        } catch (error) {
          addResult(`❌ ${song} - ${interaction} failed: ${error}`);
        }
      }
    }
  };

  useEffect(() => {
    addResult('🚀 Firebase Test Component loaded');
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Firebase Analytics Test Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Controls */}          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Test Controls</h2>
            <div className="space-y-3">
              <button
                onClick={runCompleteValidation}
                disabled={isRunningValidation}
                className={`w-full px-4 py-2 rounded font-bold text-white ${
                  isRunningValidation 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isRunningValidation ? '⏳ Running Validation...' : '🔍 Run Complete Validation'}
              </button>
              <button
                onClick={testFirebaseAnalytics}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🧪 Quick Firebase Tests
              </button>
              <button
                onClick={testMusicInteractions}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                🎵 Test Music Interactions
              </button>
              <button
                onClick={() => setTestResults([])}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                🗑️ Clear Results
              </button>
            </div>
          </div>

          {/* Real-Time Data */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Real-Time Analytics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>👥 Visitors:</span>
                <span className="font-bold">{realTimeData.visitors}</span>
              </div>
              <div className="flex justify-between">
                <span>📝 Signups:</span>
                <span className="font-bold">{realTimeData.signups}</span>
              </div>
              <div className="flex justify-between">
                <span>🎵 Streams:</span>
                <span className="font-bold">{realTimeData.streams}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Report */}
        {validationReport && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Validation Report</h2>
            <div className="mb-4 p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Summary</h3>
              <p className="text-lg mb-2">{validationReport.summary}</p>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-green-100 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">{validationReport.passed}</div>
                  <div className="text-sm text-green-800">Passed</div>
                </div>
                <div className="bg-red-100 p-3 rounded">
                  <div className="text-2xl font-bold text-red-600">{validationReport.failed}</div>
                  <div className="text-sm text-red-800">Failed</div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{validationReport.warnings}</div>
                  <div className="text-sm text-yellow-800">Warnings</div>
                </div>
                <div className="bg-blue-100 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">{validationReport.totalTests}</div>
                  <div className="text-sm text-blue-800">Total</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold">Detailed Results:</h4>
              {validationReport.results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded border-l-4 ${
                    result.status === 'pass' ? 'bg-green-50 border-green-500 text-green-800' :
                    result.status === 'fail' ? 'bg-red-50 border-red-500 text-red-800' :
                    'bg-yellow-50 border-yellow-500 text-yellow-800'
                  }`}
                >
                  <div className="font-bold">{result.test}</div>
                  <div className="text-sm">{result.message}</div>
                  <div className="text-xs text-gray-500">{result.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">No tests run yet. Click a test button above.</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800">Testing Instructions:</h3>
          <ul className="mt-2 text-yellow-700 list-disc list-inside space-y-1">
            <li>Open browser Developer Tools (F12) and check Console tab</li>
            <li>Run Firebase Tests to verify core functionality</li>
            <li>Test Music Interactions to validate tracking</li>
            <li>Check console for emoji-based debug logs (🚀, ✅, 📊, etc.)</li>
            <li>Monitor Real-Time Analytics data updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTestComponent;
