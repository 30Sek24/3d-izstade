import { pubClient } from './eventBus.js';
import { PlatformEvent } from './eventTypes.js';
import type { EventPayload } from './eventTypes.js';
import { logger } from '../logging/logger.js';

export const eventPublisher = {
  /**
   * Publishes an event to the Redis event bus.
   */
  async publish(eventType: PlatformEvent, data: Record<string, any>, metadata?: Record<string, any>) {
    try {
      const payload: EventPayload = {
        eventId: crypto.randomUUID(),
        eventType,
        timestamp: new Date().toISOString(),
        data,
        metadata
      };

      const message = JSON.stringify(payload);
      
      // Publish to a channel named after the event type
      await pubClient.publish(eventType, message);
      
      logger.info('EventPublisher', `Published event: ${eventType} (${payload.eventId})`);
      return { success: true, eventId: payload.eventId };
    } catch (error) {
      logger.error('EventPublisher', `Failed to publish event: ${eventType}`, error);
      return { success: false, error: String(error) };
    }
  }
};
