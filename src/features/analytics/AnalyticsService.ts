/**
 * Service to track user interactions with music content
 */

import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/config';
import RealTimeAnalyticsService from '../../services/realTimeAnalytics';

export const trackMusicInteraction = async (
  contentId: string,
  interactionType: string,
  amount?: number
): Promise<void> => {
  try {
    console.log(`Tracking ${interactionType} interaction for content ${contentId} with amount ${amount}`);
    
    // Log to Firebase Analytics if available
    if (analytics) {
      logEvent(analytics, 'music_interaction', {
        content_id: contentId,
        interaction_type: interactionType,
        value: amount || 0,
        currency: 'USD'
      });
    }
    
    // Track in real-time analytics service based on interaction type
    const realTimeService = RealTimeAnalyticsService.getInstance();
    
    switch (interactionType) {
      case 'stream':
      case 'play':
        await realTimeService.trackMusicStream(contentId);
        break;
      case 'purchase':
        // Purchases are tracked separately in the purchase flow
        break;
      case 'tribe_selection':
        await realTimeService.trackTribeSelection(contentId);
        break;
    }
    
  } catch (error) {
    console.error("Error tracking music interaction:", error);
  }
};
