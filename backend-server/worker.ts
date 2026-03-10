import dotenv from 'dotenv';
import { taskQueue } from '../src/backend/queue/taskQueue.js';
import { logger } from '../src/backend/logging/logger.js';

dotenv.config();

console.log('👷 AI Agent Worker starting...');

// Start the polling mechanism for agent tasks
taskQueue.startPolling(5000); // Poll every 5 seconds

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Worker', 'SIGTERM received. Stopping worker...');
  taskQueue.stopPolling();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Worker', 'SIGINT received. Stopping worker...');
  taskQueue.stopPolling();
  process.exit(0);
});
