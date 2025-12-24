import { auth } from '../firebase/config';
import { User } from 'firebase/auth';

export class SecurityService {
  // Input validation and sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  static validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Admin role verification
  static async isAdmin(user: User | null): Promise<boolean> {
    if (!user) return false;
    
    try {
      const token = await user.getIdTokenResult();
      return token.claims.admin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Rate limiting for API calls
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const userLimit = this.rateLimitMap.get(identifier);

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userLimit.count >= maxRequests) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  // Secure payment validation
  static validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 10000 && Number.isFinite(amount);
  }

  // Environment variable validation
  static validateEnvironment(): { isValid: boolean; missingVars: string[] } {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_PAYPAL_CLIENT_ID'
    ];

    const missingVars = requiredVars.filter(varName => 
      !import.meta.env[varName] || import.meta.env[varName].includes('MISSING')
    );

    return {
      isValid: missingVars.length === 0,
      missingVars
    };
  }
}