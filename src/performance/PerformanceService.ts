export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  bundleSize: number;
  memoryUsage: number;
}

export class PerformanceService {
  private static metrics: PerformanceMetrics | null = null;
  private static observers: PerformanceObserver[] = [];

  static initialize(): void {
    this.setupPerformanceObservers();
    this.measureInitialMetrics();
  }

  private static setupPerformanceObservers(): void {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (this.metrics) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (this.metrics) {
            this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        if (this.metrics) {
          this.metrics.cumulativeLayoutShift = clsValue;
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private static measureInitialMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    this.metrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: 0, // Will be updated by observer
      cumulativeLayoutShift: 0, // Will be updated by observer
      firstInputDelay: 0, // Will be updated by observer
      bundleSize: this.estimateBundleSize(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  private static estimateBundleSize(): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources
      .filter(resource => resource.name.includes('.js') || resource.name.includes('.css'))
      .reduce((total, resource) => total + (resource.transferSize || 0), 0);
  }

  private static getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  static getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  static analyzePerformance(): {
    score: number;
    recommendations: string[];
    criticalIssues: string[];
  } {
    if (!this.metrics) {
      return {
        score: 0,
        recommendations: ['Performance monitoring not initialized'],
        criticalIssues: ['Cannot analyze performance without metrics']
      };
    }

    const recommendations: string[] = [];
    const criticalIssues: string[] = [];
    let score = 100;

    // Load Time Analysis
    if (this.metrics.loadTime > 3000) {
      criticalIssues.push('Page load time exceeds 3 seconds');
      score -= 20;
    } else if (this.metrics.loadTime > 1500) {
      recommendations.push('Consider optimizing load time (currently > 1.5s)');
      score -= 10;
    }

    // First Contentful Paint
    if (this.metrics.firstContentfulPaint > 2500) {
      criticalIssues.push('First Contentful Paint is too slow (> 2.5s)');
      score -= 15;
    } else if (this.metrics.firstContentfulPaint > 1800) {
      recommendations.push('Optimize First Contentful Paint');
      score -= 8;
    }

    // Largest Contentful Paint
    if (this.metrics.largestContentfulPaint > 4000) {
      criticalIssues.push('Largest Contentful Paint is too slow (> 4s)');
      score -= 15;
    } else if (this.metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize Largest Contentful Paint');
      score -= 8;
    }

    // Cumulative Layout Shift
    if (this.metrics.cumulativeLayoutShift > 0.25) {
      criticalIssues.push('High Cumulative Layout Shift detected');
      score -= 15;
    } else if (this.metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Reduce layout shifts for better UX');
      score -= 8;
    }

    // Bundle Size Analysis
    const bundleSizeMB = this.metrics.bundleSize / (1024 * 1024);
    if (bundleSizeMB > 2) {
      criticalIssues.push(`Bundle size is too large (${bundleSizeMB.toFixed(1)}MB)`);
      score -= 20;
    } else if (bundleSizeMB > 1) {
      recommendations.push(`Consider reducing bundle size (${bundleSizeMB.toFixed(1)}MB)`);
      score -= 10;
    }

    // Memory Usage
    const memoryMB = this.metrics.memoryUsage / (1024 * 1024);
    if (memoryMB > 50) {
      recommendations.push(`High memory usage detected (${memoryMB.toFixed(1)}MB)`);
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      recommendations,
      criticalIssues
    };
  }

  static generateOptimizationReport(): string {
    const analysis = this.analyzePerformance();
    const metrics = this.getMetrics();

    let report = '🚀 PERFORMANCE OPTIMIZATION REPORT\n';
    report += '=====================================\n\n';
    
    report += `📊 Overall Score: ${analysis.score}/100\n\n`;

    if (metrics) {
      report += '📈 Core Web Vitals:\n';
      report += `- Load Time: ${metrics.loadTime.toFixed(0)}ms\n`;
      report += `- First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(0)}ms\n`;
      report += `- Largest Contentful Paint: ${metrics.largestContentfulPaint.toFixed(0)}ms\n`;
      report += `- Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}\n`;
      report += `- First Input Delay: ${metrics.firstInputDelay.toFixed(0)}ms\n\n`;

      report += '💾 Resource Usage:\n';
      report += `- Bundle Size: ${(metrics.bundleSize / (1024 * 1024)).toFixed(2)}MB\n`;
      report += `- Memory Usage: ${(metrics.memoryUsage / (1024 * 1024)).toFixed(2)}MB\n\n`;
    }

    if (analysis.criticalIssues.length > 0) {
      report += '🚨 Critical Issues:\n';
      analysis.criticalIssues.forEach(issue => {
        report += `- ${issue}\n`;
      });
      report += '\n';
    }

    if (analysis.recommendations.length > 0) {
      report += '💡 Recommendations:\n';
      analysis.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
      report += '\n';
    }

    report += analysis.score >= 90 ? '✅ EXCELLENT PERFORMANCE' : 
              analysis.score >= 70 ? '⚠️ GOOD PERFORMANCE - MINOR OPTIMIZATIONS NEEDED' :
              '❌ POOR PERFORMANCE - MAJOR OPTIMIZATIONS REQUIRED';

    return report;
  }

  static cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}