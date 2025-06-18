/**
 * Service to track user interactions with music content
 */

import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/config';
import RealTimeAnalyticsService from '../services/realTimeAnalytics';

export const trackMusicInteraction = async (
  contentId: string,
  interactionType: string,
  amount?: number
): Promise<void> => {
  try {
    console.log(`🎵 Tracking ${interactionType} interaction for content ${contentId} with amount ${amount}`);
    
    // Log to Firebase Analytics if available
    if (analytics) {
      logEvent(analytics, 'music_interaction', {
        content_id: contentId,
        interaction_type: interactionType,
        value: amount || 0,
        currency: 'USD'
      });
      console.log(`✅ Firebase Analytics event logged: music_interaction`);
    } else {
      console.warn(`⚠️ Firebase Analytics not available - event not logged`);
    }    
    // Track in real-time analytics service based on interaction type
    const realTimeService = RealTimeAnalyticsService.getInstance();
    
    switch (interactionType) {
      case 'stream':
      case 'play':
        await realTimeService.trackMusicStream(contentId);
        console.log(`📊 Real-time analytics: Music stream tracked for ${contentId}`);
        break;
      case 'purchase':
        // Purchases are tracked separately in the purchase flow
        console.log(`💰 Purchase interaction logged for ${contentId}`);
        break;
      case 'tribe_selection':
        await realTimeService.trackTribeSelection(contentId);
        console.log(`🏮 Real-time analytics: Tribe selection tracked for ${contentId}`);
        break;
      default:
        console.log(`📈 General interaction logged: ${interactionType} for ${contentId}`);
    }
    
  } catch (error) {
    console.error("❌ Error tracking music interaction:", error);
  }
};
