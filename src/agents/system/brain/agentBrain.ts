import { agentMemory } from '../memory/agentMemory';
import { agentScheduler } from '../scheduler/agentScheduler';

/**
 * The Brain acts as the core processor for any agent.
 * It reads tasks, processes them (simulated via tools), and writes results back.
 */
export const agentBrain = {
  /**
   * Executes a single task. In a real scenario, this would call an LLM API.
   */
  async processTask(taskId: string, agentId: string, taskData: Record<string, any>) {
    try {
      console.log(`[AgentBrain] Agent ${agentId} is processing task ${taskId}...`);
      
      // Mark as processing
      await agentScheduler.completeTask(taskId, {}, 'processing');

      // 1. Recall past memory if needed
      const memoryContext = await agentMemory.recall(agentId, 'recent_context');

      // 2. Simulate AI Processing Time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Generate Mock Result (Will be replaced with real LLM calls later)
      const result = {
        action: taskData.action,
        output: `Processed [${taskData.action}] successfully.`,
        timestamp: new Date().toISOString(),
        contextUsed: memoryContext.data
      };

      // 4. Update Memory
      await agentMemory.remember(agentId, 'last_action', result.output);

      // 5. Complete Task
      const response = await agentScheduler.completeTask(taskId, result, 'completed');
      
      return response;
    } catch (error) {
      console.error(`[AgentBrain] Error processing task ${taskId}:`, error);
      await agentScheduler.completeTask(taskId, { error: String(error) }, 'failed');
      return { data: null, error };
    }
  }
};
