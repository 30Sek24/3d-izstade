import { agentScheduler } from '../scheduler/agentScheduler.js';
import { agentExecutionLoop } from '../../../backend/agents/engine/agentExecutionLoop.js';
import { supabaseClient } from '../../../lib/supabaseClient.js';

/**
 * The Brain acts as the core processor for any agent.
 * Now upgraded to use the multi-step Autonomous Execution Loop (Phase 5).
 */
export const agentBrain = {
  /**
   * Executes a single task using the autonomous execution engine.
   */
  async processTask(taskId: string, agentId: string, taskData: Record<string, any>) {
    try {
      console.log(`[AgentBrain] Agent ${agentId} is starting autonomous task ${taskId}...`);
      
      // Fetch agent role for the engine
      const { data: agent } = await supabaseClient
        .from('agents')
        .select('role')
        .eq('id', agentId)
        .single();

      const role = agent?.role || 'general_assistant';
      const description = taskData.action || taskData.brief || 'Perform autonomous operations';

      // Route to the real execution loop
      return await agentExecutionLoop.runAgent(taskId, agentId, role, description);

    } catch (error) {
      console.error(`[AgentBrain] Fatal error in task ${taskId}:`, error);
      await agentScheduler.completeTask(taskId, { error: String(error) }, 'failed');
      return { data: null, error };
    }
  }
};
