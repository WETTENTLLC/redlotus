export interface EnvironmentConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  paypal: {
    clientId: string;
  };
  security: {
    adminEmail: string;
    rateLimitRequests: number;
    rateLimitWindow: number;
  };
  analytics?: {
    gaId?: string;
    gtmId?: string;
    hotjarId?: string;
    facebookPixelId?: string;
  };
  performance?: {
    sentryDsn?: string;
    monitoringEnabled: boolean;
  };
  cdn?: {
    cdnUrl?: string;
    assetsUrl?: string;
  };
}

export class EnvironmentService {
  private static config: EnvironmentConfig | null = null;

  static initialize(): EnvironmentConfig {
    if (this.config) return this.config;

    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_PAYPAL_CLIENT_ID'
    ];

    const missingVars = requiredVars.filter(varName => 
      !import.meta.env[varName] || 
      import.meta.env[varName].includes('MISSING') ||
      import.meta.env[varName].includes('your_')
    );

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    this.config = {
      firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      },
      paypal: {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
      },
      security: {
        adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@redlotusmusic.com',
        rateLimitRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '100'),
        rateLimitWindow: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '900000'),
      },
      analytics: {
        gaId: import.meta.env.VITE_GA_MEASUREMENT_ID,
        gtmId: import.meta.env.VITE_GTM_CONTAINER_ID,
        hotjarId: import.meta.env.VITE_HOTJAR_ID,
        facebookPixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID,
      },
      performance: {
        sentryDsn: import.meta.env.VITE_SENTRY_DSN,
        monitoringEnabled: import.meta.env.VITE_PERFORMANCE_MONITORING === 'true',
      },
      cdn: {
        cdnUrl: import.meta.env.VITE_CDN_URL,
        assetsUrl: import.meta.env.VITE_ASSETS_URL,
      }
    };

    return this.config;
  }

  static getConfig(): EnvironmentConfig {
    if (!this.config) {
      return this.initialize();
    }
    return this.config;
  }

  static isProduction(): boolean {
    return import.meta.env.PROD;
  }

  static isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  static validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      this.initialize();
    } catch (error) {
      errors.push((error as Error).message);
    }

    // Additional validations
    const config = this.getConfig();
    
    if (this.isProduction() && config.paypal.clientId.startsWith('sb')) {
      errors.push('Production environment should not use PayPal sandbox client ID');
    }

    if (!config.firebase.projectId.includes('-')) {
      errors.push('Firebase project ID appears to be invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}