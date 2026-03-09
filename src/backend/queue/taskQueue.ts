import { supabaseClient } from '../../lib/supabaseClient';
import { agentExecutor } from '../agents/execution/agentExecutor';

let isPolling = false;
let pollingInterval: any = null;

export const taskQueue = {
  /**
   * Starts the background task polling mechanism.
   * Runs asynchronously without blocking the main UI thread.
   */
  startPolling(intervalMs: number = 5000) {
    if (isPolling) return;
    
    console.log(`[TaskQueue] Starting task queue polling every ${intervalMs}ms...`);
    isPolling = true;

    // Use setInterval to periodically check for new tasks
    // This runs in the JS event loop and doesn't block React rendering
    pollingInterval = setInterval(async () => {
      await this.processNextBatch();
    }, intervalMs);
  },

  /**
   * Stops the background task polling.
   */
  stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    isPolling = false;
    console.log('[TaskQueue] Stopped task queue polling.');
  },

  /**
   * Fetches the next batch of pending tasks and executes them.
   */
  async processNextBatch() {
    try {
      // 1. Pull pending tasks from Supabase
      // Order by created_at to process oldest first. Limit to 5 per batch to avoid overload.
      const { data: tasks, error } = await supabaseClient
        .from('agent_tasks')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(5);

      if (error) {
        console.error('[TaskQueue] Error fetching tasks:', error.message);
        return;
      }

      if (!tasks || tasks.length === 0) {
        // No pending tasks
        return;
      }

      console.log(`[TaskQueue] Found ${tasks.length} pending tasks. Processing...`);

      // 2. Execute agents concurrently (or sequentially based on needs)
      // Using Promise.allSettled to ensure one failing task doesn't stop others
      await Promise.allSettled(
        tasks.map(async (task) => {
          // Pass the task to the agent executor which routes to the proper runner
          await agentExecutor.executeTask(task.id, task.agent_id, task.task_data);
        })
      );

      console.log(`[TaskQueue] Batch processing complete.`);
    } catch (err) {
      console.error('[TaskQueue] Unexpected error during batch processing:', err);
    }
  }
};
