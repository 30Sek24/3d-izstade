import { emailSequenceEngine } from './emailSequenceEngine.js';
import { logger } from '../logging/logger.js';

let sequenceInterval: any = null;

/**
 * Periodically triggers the email sequence engine to check for due follow-ups.
 */
export const emailScheduler = {
  /**
   * Starts the background sequence processor.
   */
  start(intervalMs: number = 3600000) { // Default check once per hour
    if (sequenceInterval) return;
    
    logger.info('EmailScheduler', 'Starting email sequence processor.');
    sequenceInterval = setInterval(async () => {
      await emailSequenceEngine.processSequences();
    }, intervalMs);
  },

  /**
   * Stops the processor.
   */
  stop() {
    if (sequenceInterval) {
      clearInterval(sequenceInterval);
      sequenceInterval = null;
    }
    logger.info('EmailScheduler', 'Stopped email sequence processor.');
  }
};
