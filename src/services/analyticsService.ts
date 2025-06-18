/**
 * Analytics Service for Red Lotus Music
 * Tracks SEO performance and user engagement
 */

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: { [key: string]: any };
}

interface PageViewData {
  page_title: string;
  page_location: string;
  page_referrer?: string;
  content_group1?: string; // Page category
  content_group2?: string; // Page type
  custom_parameters?: { [key: string]: any };
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
  private gtmId = import.meta.env.VITE_GTM_CONTAINER_ID || '';
  private isInitialized = false;

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }
  /**
   * Initialize Google Analytics and other tracking
   */
  public initialize(): void {
    if (this.isInitialized) return;

    console.log('🚀 Initializing Analytics Services...');

    // Initialize Google Analytics 4
    this.initializeGA4();
    
    // Initialize Google Tag Manager
    this.initializeGTM();
    
    // Initialize other tracking services
    this.initializeHotjar();
    this.initializeFacebookPixel();
    
    this.isInitialized = true;
    console.log('✅ Analytics Services initialized');
  }
  /**
   * Initialize Google Analytics 4
   */  private initializeGA4(): void {
    // Only initialize if GA ID is configured
    if (!this.gaId || this.gaId.includes('XXXXXXXXXX')) {
      console.log('📊 Google Analytics not configured - skipping initialization');
      return;
    }
    
    console.log('📊 Initializing Google Analytics 4...');
    
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', this.gaId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      allow_google_signals: true,
      send_page_view: false // We'll send manually for SPA
    });
  }
  /**
   * Initialize Google Tag Manager
   */  private initializeGTM(): void {
    // Only initialize if GTM ID is configured
    if (!this.gtmId || this.gtmId.includes('XXXXXXXXXX')) {
      console.log('🏷️ Google Tag Manager not configured - skipping initialization');
      return;
    }
    
    console.log('🏷️ Initializing Google Tag Manager...');
    
    // GTM script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${this.gtmId}');
    `;
    document.head.appendChild(script);

    // GTM noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${this.gtmId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.appendChild(noscript);
  }
  /**
   * Initialize Hotjar for user behavior tracking
   */  private initializeHotjar(): void {
    const hjid = import.meta.env.VITE_HOTJAR_ID;
    const hjv = '6';
    
    // Only initialize if Hotjar ID is configured
    if (!hjid || hjid === 'XXXXXXX') {
      console.log('🔥 Hotjar not configured - skipping initialization');
      return;
    }
    
    console.log('🔥 Initializing Hotjar...');
    
    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hjid},hjv:${hjv}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);
  }
  /**
   * Initialize Facebook Pixel
   */  private initializeFacebookPixel(): void {
    const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
    
    // Only initialize if pixel ID is configured
    if (!pixelId || pixelId === 'XXXXXXXXXXXXXXX') {
      console.log('📘 Facebook Pixel not configured - skipping initialization');
      return;
    }
    
    console.log('📘 Initializing Facebook Pixel...');
    
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }

  /**
   * Track page view for SPA
   */
  public trackPageView(data: PageViewData): void {
    if (!this.isInitialized) return;

    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('config', this.gaId, {
        page_title: data.page_title,
        page_location: data.page_location,
        page_referrer: data.page_referrer,
        content_group1: data.content_group1,
        content_group2: data.content_group2,
        ...data.custom_parameters
      });
    }

    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }

    // Custom tracking for music-specific metrics
    this.trackMusicMetrics(data);
  }

  /**
   * Track custom events
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // GTM Data Layer
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'custom_event',
        event_action: event.action,
        event_category: event.category,
        event_label: event.label,
        event_value: event.value,
        ...event.custom_parameters
      });
    }
  }

  /**
   * Track music-specific metrics
   */
  private trackMusicMetrics(data: PageViewData): void {
    const musicEvents = {
      album_view: data.page_location.includes('/albums/'),
      live_show_view: data.page_location.includes('/live/'),
      tribe_engagement: data.page_location.includes('/tribe'),
      home_visit: data.page_location === '/' || data.page_location.includes('home')
    };

    Object.entries(musicEvents).forEach(([event, shouldTrack]) => {
      if (shouldTrack) {
        this.trackEvent({
          action: event,
          category: 'Music Engagement',
          label: data.page_title,
          custom_parameters: {
            page_type: data.content_group1,
            user_type: this.getUserType()
          }
        });
      }
    });
  }

  /**
   * Track album plays/interactions
   */
  public trackAlbumInteraction(albumId: string, action: 'play' | 'pause' | 'skip' | 'favorite'): void {
    this.trackEvent({
      action: `album_${action}`,
      category: 'Music Interaction',
      label: albumId,
      custom_parameters: {
        content_type: 'album',
        content_id: albumId
      }
    });
  }

  /**
   * Track live show interest
   */
  public trackLiveShowInteraction(showId: string, action: 'view' | 'interested' | 'ticket_click'): void {
    this.trackEvent({
      action: `live_show_${action}`,
      category: 'Live Show Engagement',
      label: showId,
      custom_parameters: {
        content_type: 'live_show',
        content_id: showId
      }
    });
  }

  /**
   * Track tribe engagement
   */
  public trackTribeEngagement(action: 'join_attempt' | 'content_view' | 'community_click'): void {
    this.trackEvent({
      action: `tribe_${action}`,
      category: 'Community Engagement',
      custom_parameters: {
        engagement_type: 'tribe_interaction'
      }
    });
  }

  /**
   * Track search interactions
   */
  public trackSearch(query: string, results: number): void {
    this.trackEvent({
      action: 'search',
      category: 'Site Search',
      label: query,
      value: results,
      custom_parameters: {
        search_term: query,
        search_results: results
      }
    });
  }

  /**
   * Track social media clicks
   */
  public trackSocialClick(platform: string): void {
    this.trackEvent({
      action: 'social_click',
      category: 'Social Media',
      label: platform,
      custom_parameters: {
        social_platform: platform
      }
    });
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(): void {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Track Core Web Vitals
      this.trackEvent({
        action: 'page_load_time',
        category: 'Performance',
        value: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        custom_parameters: {
          metric_type: 'load_time'
        }
      });

      // Track LCP, FID, CLS if available
      this.trackWebVitals();
    }
  }

  /**
   * Track Core Web Vitals
   */
  private trackWebVitals(): void {
    // This would typically use the web-vitals library
    // For now, we'll track basic performance metrics
    
    if ('PerformanceObserver' in window) {
      // Track Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackEvent({
            action: 'lcp',
            category: 'Core Web Vitals',
            value: Math.round(entry.startTime),
            custom_parameters: {
              metric_type: 'largest_contentful_paint'
            }
          });
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }
    }
  }

  /**
   * Get user type based on behavior
   */
  private getUserType(): string {
    // Simple logic to determine user type
    const visits = localStorage.getItem('visit_count');
    const hasInteracted = localStorage.getItem('has_interacted');
    
    if (!visits) return 'new_visitor';
    if (parseInt(visits) > 5) return 'returning_visitor';
    if (hasInteracted) return 'engaged_visitor';
    
    return 'casual_visitor';
  }

  /**
   * Track user session for better analytics
   */
  public trackSession(): void {
    const sessionStart = Date.now();
    localStorage.setItem('session_start', sessionStart.toString());
    
    // Track visit count
    const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
    localStorage.setItem('visit_count', visitCount.toString());
    
    // Track session when user leaves
    window.addEventListener('beforeunload', () => {
      const sessionEnd = Date.now();
      const sessionDuration = sessionEnd - sessionStart;
      
      this.trackEvent({
        action: 'session_duration',
        category: 'User Engagement',
        value: Math.round(sessionDuration / 1000), // Convert to seconds
        custom_parameters: {
          visit_number: visitCount,
          session_duration_ms: sessionDuration
        }
      });
    });
  }
}

export default AnalyticsService.getInstance();
