import React, { useState, useEffect } from 'react';
import { TestingService, TestResult } from './TestingService';

const ProductionReadinessTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setIsComplete(false);
    
    try {
      const results = await TestingService.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
      setIsComplete(true);
    }
  };

  const getStatusIcon = (passed: boolean) => passed ? '✅' : '❌';
  const getStatusColor = (passed: boolean) => passed ? 'text-green-600' : 'text-red-600';

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🧪 Production Readiness Testing
        </h2>
        <p className="text-gray-600">
          Comprehensive testing suite to validate production readiness
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-semibold ${
            isRunning
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? '🔄 Running Tests...' : '🚀 Run Production Tests'}
        </button>
      </div>

      {isComplete && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">📊 Test Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalTests - passedTests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${successRate === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                {successRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {successRate === 100 && isComplete && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎉</span>
            <div>
              <h4 className="text-lg font-semibold text-green-800">Ready for Production!</h4>
              <p className="text-green-700">All tests passed successfully. The application is ready to go live.</p>
            </div>
          </div>
        </div>
      )}

      {successRate < 100 && isComplete && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h4 className="text-lg font-semibold text-red-800">Not Ready for Production</h4>
              <p className="text-red-700">Some tests failed. Please address the issues before deploying.</p>
            </div>
          </div>
        </div>
      )}

      {testResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">📋 Detailed Results</h3>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{getStatusIcon(result.passed)}</span>
                    <span className="font-medium">{result.testName}</span>
                  </div>
                  <span className="text-sm text-gray-500">{result.duration}ms</span>
                </div>
                {result.error && (
                  <div className="mt-2 text-sm text-red-600 ml-8">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isRunning && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Running comprehensive tests...</p>
        </div>
      )}
    </div>
  );
};

export default ProductionReadinessTest;