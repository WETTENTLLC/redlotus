/**
 * Real-time Analytics Service for Red Lotus Music
 * Replaces mock data with actual Firebase Analytics
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface RealTimeAnalytics {
  visitors: number;
  signups: number;
  musicStreams: number;
  tribeSelections: {
    red: number;
    yellow: number;
    blue: number;
    brown: number;
    pink: number;
  };
  totalRevenue: number;
  activeUsers: number;
  lastUpdated: Date;
}

export interface TribeAnalytics {
  red: number;
  yellow: number;
  blue: number;
  brown: number;
  pink: number;
}

class RealTimeAnalyticsService {
  private static instance: RealTimeAnalyticsService;
  private analyticsRef = doc(db, 'analytics', 'realtime');

  public static getInstance(): RealTimeAnalyticsService {
    if (!RealTimeAnalyticsService.instance) {
      RealTimeAnalyticsService.instance = new RealTimeAnalyticsService();
    }
    return RealTimeAnalyticsService.instance;
  }

  /**
   * Get real-time visitor count
   */
  public async getRealTimeVisitors(): Promise<number> {
    try {
      const analyticsDoc = await getDoc(this.analyticsRef);
      const data = analyticsDoc.data();
      return data?.visitors || 0;
    } catch (error) {
      console.error('Error fetching visitor count:', error);
      return 0;
    }
  }

  /**
   * Get real-time signup count
   */
  public async getRealTimeSignups(): Promise<number> {
    try {
      const signupsQuery = query(collection(db, 'signups'));
      const signupsSnapshot = await getDocs(signupsQuery);
      return signupsSnapshot.size;
    } catch (error) {
      console.error('Error fetching signup count:', error);
      return 0;
    }
  }

  /**
   * Get real-time music stream count
   */
  public async getRealTimeMusicStreams(): Promise<number> {
    try {
      const analyticsDoc = await getDoc(this.analyticsRef);
      const data = analyticsDoc.data();
      return data?.musicStreams || 0;
    } catch (error) {
      console.error('Error fetching music stream count:', error);
      return 0;
    }
  }

  /**
   * Get real-time tribe selection counts
   */
  public async getRealTimeTribeSelections(): Promise<TribeAnalytics> {
    try {
      const tribeQuery = query(collection(db, 'tribeSelections'));
      const tribeSnapshot = await getDocs(tribeQuery);
      
      const selections: TribeAnalytics = {
        red: 0,
        yellow: 0,
        blue: 0,
        brown: 0,
        pink: 0
      };

      tribeSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.tribe && selections.hasOwnProperty(data.tribe)) {
          selections[data.tribe as keyof TribeAnalytics]++;
        }
      });

      return selections;
    } catch (error) {
      console.error('Error fetching tribe selections:', error);
      return {
        red: 0,
        yellow: 0,
        blue: 0,
        brown: 0,
        pink: 0
      };
    }
  }

  /**
   * Get complete real-time analytics
   */
  public async getAllRealTimeAnalytics(): Promise<RealTimeAnalytics> {
    try {
      const [visitors, signups, musicStreams, tribeSelections] = await Promise.all([
        this.getRealTimeVisitors(),
        this.getRealTimeSignups(),
        this.getRealTimeMusicStreams(),
        this.getRealTimeTribeSelections()
      ]);

      const analyticsDoc = await getDoc(this.analyticsRef);
      const data = analyticsDoc.data();

      return {
        visitors,
        signups,
        musicStreams,
        tribeSelections,
        totalRevenue: data?.totalRevenue || 0,
        activeUsers: data?.activeUsers || 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      return {
        visitors: 0,
        signups: 0,
        musicStreams: 0,
        tribeSelections: {
          red: 0,
          yellow: 0,
          blue: 0,
          brown: 0,
          pink: 0
        },
        totalRevenue: 0,
        activeUsers: 0,
        lastUpdated: new Date()
      };
    }
  }
  /**
   * Track a visitor
   */
  public async trackVisitor(): Promise<void> {
    try {
      await updateDoc(this.analyticsRef, {
        visitors: increment(1),
        lastUpdated: new Date()
      });
      console.log('👤 Real-time analytics: Visitor tracked');
    } catch (error) {
      console.error('❌ Error tracking visitor:', error);
      // Create the document if it doesn't exist
      try {
        await setDoc(this.analyticsRef, {
          visitors: 1,
          signups: 0,
          musicStreams: 0,
          tribeSelections: {
            red: 0,
            yellow: 0,
            blue: 0,
            brown: 0,
            pink: 0
          },
          totalRevenue: 0,
          activeUsers: 1,
          lastUpdated: new Date()
        });
        console.log('📊 Real-time analytics document created and visitor tracked');
      } catch (createError) {
        console.error('❌ Error creating analytics document:', createError);
      }
    }
  }

  /**
   * Track a signup
   */
  public async trackSignup(email: string, tribe?: string): Promise<void> {
    try {
      // Add to signups collection
      await setDoc(doc(collection(db, 'signups')), {
        email,
        tribe: tribe || 'none',
        timestamp: new Date(),
        source: 'website'
      });

      // Update analytics counter
      await updateDoc(this.analyticsRef, {
        signups: increment(1),
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error tracking signup:', error);
    }
  }

  /**
   * Track a music stream
   */
  public async trackMusicStream(songId: string, duration?: number): Promise<void> {
    try {
      // Add to streams collection
      await setDoc(doc(collection(db, 'musicStreams')), {
        songId,
        duration: duration || 0,
        timestamp: new Date(),
        source: 'website'
      });

      // Update analytics counter
      await updateDoc(this.analyticsRef, {
        musicStreams: increment(1),
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error tracking music stream:', error);
    }
  }

  /**
   * Track a tribe selection
   */
  public async trackTribeSelection(tribe: string): Promise<void> {
    try {
      // Add to tribe selections collection
      await setDoc(doc(collection(db, 'tribeSelections')), {
        tribe,
        timestamp: new Date(),
        source: 'website'
      });
    } catch (error) {
      console.error('Error tracking tribe selection:', error);
    }
  }

  /**
   * Get recent activity for admin dashboard
   */
  public async getRecentActivity(limitCount: number = 10): Promise<any[]> {
    try {
      const activities: any[] = [];

      // Get recent signups
      const signupsQuery = query(
        collection(db, 'signups'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const signupsSnapshot = await getDocs(signupsQuery);
      signupsSnapshot.forEach((doc) => {
        activities.push({
          type: 'signup',
          data: doc.data(),
          timestamp: doc.data().timestamp
        });
      });

      // Get recent music streams
      const streamsQuery = query(
        collection(db, 'musicStreams'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const streamsSnapshot = await getDocs(streamsQuery);
      streamsSnapshot.forEach((doc) => {
        activities.push({
          type: 'stream',
          data: doc.data(),
          timestamp: doc.data().timestamp
        });
      });

      // Sort by timestamp and return
      activities.sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
      return activities.slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  /**
   * Initialize analytics document if it doesn't exist
   */
  public async initializeAnalytics(): Promise<void> {
    try {
      const analyticsDoc = await getDoc(this.analyticsRef);
      if (!analyticsDoc.exists()) {
        await setDoc(this.analyticsRef, {
          visitors: 0,
          musicStreams: 0,
          totalRevenue: 0,
          activeUsers: 0,
          lastUpdated: new Date(),
          initialized: true
        });
      }
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }
}

export default RealTimeAnalyticsService;
