import { logger } from '../../logging/logger';
import { seoRunner } from '../runners/seoRunner';
import { marketingRunner } from '../runners/marketingRunner';
import { leadRunner } from '../runners/leadRunner';
import { salesRunner } from '../runners/salesRunner';
import { agentScheduler } from '../../../agents/system/scheduler/agentScheduler';
import { supabaseClient } from '../../../lib/supabaseClient';

export const agentExecutor = {
  /**
   * Executes a task by determining the correct runner based on the agent's role.
   */
  async executeTask(taskId: string, agentId: string, taskData: any) {
    try {
      logger.info('AgentExecutor', `Determining runner for task ${taskId} (Agent: ${agentId})`);

      // 1. Fetch agent details to get the role
      const { data: agent, error } = await supabaseClient
        .from('agents')
        .select('role')
        .eq('id', agentId)
        .single();

      if (error || !agent) {
         throw new Error(`Failed to fetch agent role: ${error?.message}`);
      }

      const role = agent.role.toLowerCase();

      // 2. Mark task as processing
      await agentScheduler.completeTask(taskId, {}, 'processing');

      // 3. Map to correct runner
      let result = null;
      switch (role) {
        case 'seo':
        case 'seo_agent':
          result = await seoRunner.execute(taskId, agentId, taskData);
          break;
        case 'marketing':
        case 'marketing_agent':
          result = await marketingRunner.execute(taskId, agentId, taskData);
          break;
        case 'lead':
        case 'lead_agent':
          result = await leadRunner.execute(taskId, agentId, taskData);
          break;
        case 'sales':
        case 'sales_agent':
          result = await salesRunner.execute(taskId, agentId, taskData);
          break;
        default:
          logger.warn('AgentExecutor', `No specific runner found for role '${role}'. Using dummy completion.`);
          result = { status: 'success', note: `Fallback execution for role ${role}` };
          await agentScheduler.completeTask(taskId, result, 'completed');
          break;
      }

      return result;
    } catch (err) {
      logger.error('AgentExecutor', `Execution failed for task ${taskId}`, err);
      await agentScheduler.completeTask(taskId, { error: String(err) }, 'failed');
      return null;
    }
  }
};
