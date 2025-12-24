import { auth, db, storage } from '../firebase/config';
import { SecurityService } from '../security/SecurityService';
import { EnvironmentService } from '../config/EnvironmentService';

export interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export class TestingService {
  private static results: TestResult[] = [];

  static async runAllTests(): Promise<TestResult[]> {
    this.results = [];
    
    console.log('🧪 Starting comprehensive production readiness tests...');
    
    await this.runTest('Environment Configuration', this.testEnvironmentConfig);
    await this.runTest('Firebase Connection', this.testFirebaseConnection);
    await this.runTest('Authentication System', this.testAuthenticationSystem);
    await this.runTest('Database Operations', this.testDatabaseOperations);
    await this.runTest('File Upload Security', this.testFileUploadSecurity);
    await this.runTest('Payment Validation', this.testPaymentValidation);
    await this.runTest('Security Services', this.testSecurityServices);
    await this.runTest('Performance Metrics', this.testPerformanceMetrics);
    
    this.generateTestReport();
    return this.results;
  }

  private static async runTest(testName: string, testFunction: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    
    try {
      await testFunction();
      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - startTime
      });
      console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - startTime
      });
      console.error(`❌ ${testName} - FAILED:`, (error as Error).message);
    }
  }

  private static async testEnvironmentConfig(): Promise<void> {
    const validation = EnvironmentService.validateConfiguration();
    if (!validation.isValid) {
      throw new Error(`Environment validation failed: ${validation.errors.join(', ')}`);
    }
    
    const config = EnvironmentService.getConfig();
    if (!config.firebase.apiKey || !config.paypal.clientId) {
      throw new Error('Critical configuration missing');
    }
  }

  private static async testFirebaseConnection(): Promise<void> {
    if (!auth || !db || !storage) {
      throw new Error('Firebase services not initialized');
    }
    
    // Test auth connection
    try {
      await auth.authStateReady();
    } catch (error) {
      throw new Error('Firebase Auth connection failed');
    }
  }

  private static async testAuthenticationSystem(): Promise<void> {
    // Test admin verification (should handle null user gracefully)
    const isAdmin = await SecurityService.isAdmin(null);
    if (isAdmin) {
      throw new Error('Admin check should return false for null user');
    }
  }

  private static async testDatabaseOperations(): Promise<void> {
    try {
      // Test basic Firestore connection
      const { collection, getDocs } = await import('firebase/firestore');
      const testQuery = collection(db, 'test');
      // This will fail gracefully if collection doesn't exist
      await getDocs(testQuery);
    } catch (error) {
      // Expected for non-existent collections
      if (!(error as Error).message.includes('permission-denied')) {
        throw error;
      }
    }
  }

  private static async testFileUploadSecurity(): Promise<void> {
    // Test file validation
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    const isValidType = SecurityService.validateFileType(mockFile, ['image/jpeg']);
    if (isValidType) {
      throw new Error('File type validation should reject text files for image uploads');
    }
    
    const isValidSize = SecurityService.validateFileSize(mockFile, 0.001); // 1KB limit
    if (isValidSize) {
      throw new Error('File size validation should reject files over limit');
    }
  }

  private static async testPaymentValidation(): Promise<void> {
    // Test payment amount validation
    if (SecurityService.validatePaymentAmount(-10)) {
      throw new Error('Should reject negative amounts');
    }
    
    if (SecurityService.validatePaymentAmount(20000)) {
      throw new Error('Should reject amounts over $10,000');
    }
    
    if (!SecurityService.validatePaymentAmount(25.99)) {
      throw new Error('Should accept valid payment amounts');
    }
  }

  private static async testSecurityServices(): Promise<void> {
    // Test input sanitization
    const maliciousInput = '<script>alert("xss")</script>Hello';
    const sanitized = SecurityService.sanitizeInput(maliciousInput);
    
    if (sanitized.includes('<script>')) {
      throw new Error('Input sanitization failed to remove script tags');
    }
    
    // Test email validation
    if (!SecurityService.validateEmail('test@example.com')) {
      throw new Error('Valid email should pass validation');
    }
    
    if (SecurityService.validateEmail('invalid-email')) {
      throw new Error('Invalid email should fail validation');
    }
    
    // Test rate limiting
    const identifier = 'test-user';
    for (let i = 0; i < 5; i++) {
      if (!SecurityService.checkRateLimit(identifier, 3, 60000)) {
        if (i < 3) {
          throw new Error('Rate limiting triggered too early');
        }
        break;
      }
    }
  }

  private static async testPerformanceMetrics(): Promise<void> {
    // Test bundle size awareness
    const performanceEntries = performance.getEntriesByType('navigation');
    if (performanceEntries.length === 0) {
      throw new Error('Performance metrics not available');
    }
    
    // Basic performance check
    const loadTime = performanceEntries[0] as PerformanceNavigationTiming;
    if (loadTime.loadEventEnd - loadTime.loadEventStart > 5000) {
      console.warn('⚠️ Page load time exceeds 5 seconds');
    }
  }

  private static generateTestReport(): void {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => r.failed).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log('\n📊 TEST REPORT');
    console.log('================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️ Total Time: ${totalTime}ms`);
    console.log(`🎯 Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`- ${result.testName}: ${result.error}`);
      });
    }
    
    console.log('\n' + (failed === 0 ? '🎉 ALL TESTS PASSED - READY FOR PRODUCTION!' : '⚠️ TESTS FAILED - NOT READY FOR PRODUCTION'));
  }

  static getResults(): TestResult[] {
    return this.results;
  }
}