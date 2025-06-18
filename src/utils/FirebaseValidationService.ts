/**
 * Firebase Analytics Validation Report
 * Comprehensive test results for Red Lotus Music tracking system
 */

export interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: Date;
  details?: any;
}

export interface ValidationReport {
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  results: TestResult[];
  summary: string;
}

export class FirebaseValidationService {
  private results: TestResult[] = [];

  public async runFullValidation(): Promise<ValidationReport> {
    this.results = [];

    // Test 1: Firebase Configuration
    await this.testFirebaseConfig();

    // Test 2: Analytics Initialization
    await this.testAnalyticsInitialization();

    // Test 3: Real-time Analytics
    await this.testRealTimeAnalytics();

    // Test 4: Music Interaction Tracking
    await this.testMusicInteractionTracking();

    // Test 5: Event Logging
    await this.testEventLogging();

    // Test 6: Visitor Tracking
    await this.testVisitorTracking();

    // Test 7: Tribe Selection Tracking
    await this.testTribeSelectionTracking();

    // Generate summary
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;

    const summary = this.generateSummary(passed, failed, warnings);

    return {
      totalTests: this.results.length,
      passed,
      failed,
      warnings,
      results: this.results,
      summary
    };
  }

  private async testFirebaseConfig(): Promise<void> {
    try {
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      };

      const missingKeys = Object.entries(config).filter(([_, value]) => !value);
      
      if (missingKeys.length === 0) {
        this.addResult('Firebase Configuration', 'pass', 'All environment variables are properly configured');
      } else {
        this.addResult('Firebase Configuration', 'fail', `Missing: ${missingKeys.map(([key]) => key).join(', ')}`);
      }
    } catch (error) {
      this.addResult('Firebase Configuration', 'fail', `Configuration test failed: ${error}`);
    }
  }

  private async testAnalyticsInitialization(): Promise<void> {
    try {
      const { analytics } = await import('../firebase/config');
      
      if (analytics) {
        this.addResult('Analytics Initialization', 'pass', 'Firebase Analytics initialized successfully');
      } else {
        this.addResult('Analytics Initialization', 'warning', 'Analytics object is null - may be normal in development');
      }
    } catch (error) {
      this.addResult('Analytics Initialization', 'fail', `Analytics initialization failed: ${error}`);
    }
  }

  private async testRealTimeAnalytics(): Promise<void> {
    try {
      const RealTimeAnalyticsService = (await import('../services/realTimeAnalytics')).default;
      const service = RealTimeAnalyticsService.getInstance();
      
      // Test visitor tracking
      await service.trackVisitor();
      const visitors = await service.getRealTimeVisitors();
      
      if (typeof visitors === 'number' && visitors >= 0) {
        this.addResult('Real-time Analytics', 'pass', `Visitor tracking works, current count: ${visitors}`);
      } else {
        this.addResult('Real-time Analytics', 'fail', 'Failed to retrieve visitor count');
      }
    } catch (error) {
      this.addResult('Real-time Analytics', 'fail', `Real-time analytics test failed: ${error}`);
    }
  }

  private async testMusicInteractionTracking(): Promise<void> {
    try {
      const { trackMusicInteraction } = await import('../analytics/AnalyticsService');
      
      // Test different interaction types
      const interactions = ['stream', 'purchase', 'like', 'share'];
      let successCount = 0;
      
      for (const interaction of interactions) {
        try {
          await trackMusicInteraction('test-song', interaction as any);
          successCount++;
        } catch (error) {
          console.warn(`Failed to track ${interaction}:`, error);
        }
      }
      
      if (successCount === interactions.length) {
        this.addResult('Music Interaction Tracking', 'pass', `All ${successCount} interaction types tracked successfully`);
      } else if (successCount > 0) {
        this.addResult('Music Interaction Tracking', 'warning', `${successCount}/${interactions.length} interaction types tracked`);
      } else {
        this.addResult('Music Interaction Tracking', 'fail', 'No interaction types could be tracked');
      }
    } catch (error) {
      this.addResult('Music Interaction Tracking', 'fail', `Music interaction tracking test failed: ${error}`);
    }
  }

  private async testEventLogging(): Promise<void> {
    try {
      // Check if events are being logged to console
      const originalLog = console.log;
      let eventLogged = false;
      
      console.log = (...args) => {
        if (args.some(arg => typeof arg === 'string' && (arg.includes('🎵') || arg.includes('📊') || arg.includes('Analytics')))) {
          eventLogged = true;
        }
        originalLog.apply(console, args);
      };
      
      // Trigger an event
      const { trackMusicInteraction } = await import('../analytics/AnalyticsService');
      await trackMusicInteraction('test-song', 'stream');
      
      // Restore console.log
      console.log = originalLog;
      
      if (eventLogged) {
        this.addResult('Event Logging', 'pass', 'Events are being logged to console for debugging');
      } else {
        this.addResult('Event Logging', 'warning', 'No emoji-based debug logs detected');
      }
    } catch (error) {
      this.addResult('Event Logging', 'fail', `Event logging test failed: ${error}`);
    }
  }

  private async testVisitorTracking(): Promise<void> {
    try {
      const RealTimeAnalyticsService = (await import('../services/realTimeAnalytics')).default;
      const service = RealTimeAnalyticsService.getInstance();
      
      const initialCount = await service.getRealTimeVisitors();
      await service.trackVisitor();
      const newCount = await service.getRealTimeVisitors();
      
      if (newCount >= initialCount) {
        this.addResult('Visitor Tracking', 'pass', `Visitor count tracked: ${initialCount} → ${newCount}`);
      } else {
        this.addResult('Visitor Tracking', 'fail', 'Visitor count did not increment properly');
      }
    } catch (error) {
      this.addResult('Visitor Tracking', 'fail', `Visitor tracking test failed: ${error}`);
    }
  }
  private async testTribeSelectionTracking(): Promise<void> {
    try {
      const RealTimeAnalyticsService = (await import('../services/realTimeAnalytics')).default;
      const service = RealTimeAnalyticsService.getInstance();
      
      // Test tribe selection tracking
      await service.trackTribeSelection('red');
      const tribeData = await service.getRealTimeTribeSelections();
      
      if (tribeData && typeof tribeData.red === 'number') {
        this.addResult('Tribe Selection Tracking', 'pass', `Tribe selection tracking works, red tribe: ${tribeData.red}`);
      } else {
        this.addResult('Tribe Selection Tracking', 'fail', 'Failed to track tribe selection');
      }
    } catch (error) {
      this.addResult('Tribe Selection Tracking', 'fail', `Tribe selection tracking test failed: ${error}`);
    }
  }

  private addResult(test: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any): void {
    this.results.push({
      test,
      status,
      message,
      timestamp: new Date(),
      details
    });
  }

  private generateSummary(passed: number, failed: number, warnings: number): string {
    const total = passed + failed + warnings;
    const passRate = ((passed / total) * 100).toFixed(1);
    
    if (failed === 0 && warnings === 0) {
      return `🎉 All tests passed! Firebase Analytics is fully functional.`;
    } else if (failed === 0) {
      return `✅ All critical tests passed (${passRate}% success rate). ${warnings} warnings noted.`;
    } else if (passed > failed) {
      return `⚠️ Most tests passed (${passRate}% success rate), but ${failed} critical issues need attention.`;
    } else {
      return `❌ Major issues detected (${passRate}% success rate). Firebase Analytics needs significant fixes.`;
    }
  }
}

export default FirebaseValidationService;
