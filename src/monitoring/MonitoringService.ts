import { EnvironmentService } from '../config/EnvironmentService';

export interface ErrorLog {
  id: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export class MonitoringService {
  private static errorLogs: ErrorLog[] = [];
  private static analyticsEvents: AnalyticsEvent[] = [];
  private static sessionId: string = this.generateSessionId();
  private static isInitialized = false;

  static initialize(): void {
    if (this.isInitialized) return;

    this.setupErrorHandlers();
    this.setupPerformanceMonitoring();
    this.initializeAnalytics();
    this.isInitialized = true;

    console.log('🔍 Monitoring service initialized');
  }

  private static setupErrorHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        level: 'error',
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        metadata: {
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript'
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        level: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        metadata: {
          type: 'promise_rejection',
          reason: event.reason
        }
      });
    });

    // React error boundary integration
    window.addEventListener('react-error', ((event: CustomEvent) => {
      this.logError({
        level: 'error',
        message: event.detail.message,
        stack: event.detail.stack,
        url: window.location.href,
        metadata: {
          type: 'react_error',
          componentStack: event.detail.componentStack
        }
      });
    }) as EventListener);
  }

  private static setupPerformanceMonitoring(): void {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.logError({
              level: 'warning',
              message: `Long task detected: ${entry.duration.toFixed(2)}ms`,
              url: window.location.href,
              metadata: {
                type: 'performance',
                duration: entry.duration,
                startTime: entry.startTime
              }
            });
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }
    }

    // Monitor memory usage
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / (1024 * 1024);
        
        if (usedMB > 100) { // Alert if memory usage exceeds 100MB
          this.logError({
            level: 'warning',
            message: `High memory usage: ${usedMB.toFixed(2)}MB`,
            url: window.location.href,
            metadata: {
              type: 'memory',
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit
            }
          });
        }
      }
    }, 30000); // Check every 30 seconds
  }

  private static initializeAnalytics(): void {
    const config = EnvironmentService.getConfig();
    
    // Initialize Google Analytics if configured
    if (config.analytics?.gaId) {
      this.initializeGA(config.analytics.gaId);
    }

    // Track page views
    this.trackPageView();
    
    // Track user engagement
    this.trackUserEngagement();
  }

  private static initializeGA(gaId: string): void {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, {
      send_page_view: false // We'll handle page views manually
    });
  }

  static logError(error: Omit<ErrorLog, 'id' | 'timestamp' | 'userAgent'>): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ...error
    };

    this.errorLogs.push(errorLog);

    // Keep only last 100 errors in memory
    if (this.errorLogs.length > 100) {
      this.errorLogs = this.errorLogs.slice(-100);
    }

    // Send to external service in production
    if (EnvironmentService.isProduction()) {
      this.sendErrorToService(errorLog);
    }

    console.error('Logged error:', errorLog);
  }

  static trackEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): void {
    const analyticsEvent: AnalyticsEvent = {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...event
    };

    this.analyticsEvents.push(analyticsEvent);

    // Send to Google Analytics if available
    if ((window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }

    // Keep only last 500 events in memory
    if (this.analyticsEvents.length > 500) {
      this.analyticsEvents = this.analyticsEvents.slice(-500);
    }
  }

  static trackPageView(page?: string): void {
    const currentPage = page || window.location.pathname;
    
    this.trackEvent({
      event: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: currentPage
    });

    if ((window as any).gtag) {
      (window as any).gtag('config', EnvironmentService.getConfig().analytics?.gaId, {
        page_path: currentPage
      });
    }
  }

  static trackUserEngagement(): void {
    let startTime = Date.now();
    let isActive = true;

    // Track time on page
    const trackEngagement = () => {
      if (isActive) {
        const timeSpent = Date.now() - startTime;
        if (timeSpent > 10000) { // Only track if user spent more than 10 seconds
          this.trackEvent({
            event: 'user_engagement',
            category: 'engagement',
            action: 'time_on_page',
            value: Math.round(timeSpent / 1000) // Convert to seconds
          });
        }
      }
    };

    // Track when user becomes inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        trackEngagement();
      } else {
        isActive = true;
        startTime = Date.now();
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', trackEngagement);
  }

  static trackPaymentEvent(amount: number, productType: string, success: boolean): void {
    this.trackEvent({
      event: success ? 'purchase' : 'purchase_failed',
      category: 'ecommerce',
      action: success ? 'purchase' : 'purchase_failed',
      label: productType,
      value: success ? amount : undefined
    });
  }

  static trackUserAction(action: string, category: string, label?: string): void {
    this.trackEvent({
      event: 'user_action',
      category,
      action,
      label
    });
  }

  private static async sendErrorToService(error: ErrorLog): Promise<void> {
    try {
      // In a real implementation, you would send to Sentry, LogRocket, etc.
      // For now, we'll just log to console in production
      if (EnvironmentService.isProduction()) {
        console.error('Production error:', error);
      }
    } catch (e) {
      console.error('Failed to send error to monitoring service:', e);
    }
  }

  static getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  static getAnalyticsEvents(): AnalyticsEvent[] {
    return [...this.analyticsEvents];
  }

  static generateHealthReport(): {
    status: 'healthy' | 'warning' | 'critical';
    errors: number;
    warnings: number;
    lastError?: ErrorLog;
    uptime: number;
  } {
    const errors = this.errorLogs.filter(log => log.level === 'error').length;
    const warnings = this.errorLogs.filter(log => log.level === 'warning').length;
    const lastError = this.errorLogs.filter(log => log.level === 'error').pop();

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (errors > 10) status = 'critical';
    else if (errors > 5 || warnings > 20) status = 'warning';

    return {
      status,
      errors,
      warnings,
      lastError,
      uptime: Date.now() - this.getSessionStartTime()
    };
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static generateSessionId(): string {
    return 'session_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2);
  }

  private static getSessionStartTime(): number {
    return parseInt(this.sessionId.split('_')[1], 36);
  }
}