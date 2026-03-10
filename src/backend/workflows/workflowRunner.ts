import { supabaseClient } from '../../lib/supabaseClient.js';
import { logger } from '../logging/logger.js';
import { agentCoordinator } from '../agents/engine/agentCoordinator.js';
import { TaskNode } from '../agents/engine/agentTaskGraph.js';
import { eventPublisher } from '../events/eventPublisher.js';
import { PlatformEvent } from '../events/eventTypes.js';

export const workflowRunner = {
  /**
   * Executes a visually built workflow.
   * Converts the UI node graph into an execution graph for the Agent Coordinator.
   */
  async execute(workflowId: string, runContext: Record<string, any> = {}) {
    try {
      logger.info('WorkflowRunner', `Initiating execution for workflow ${workflowId}`);

      // 1. Fetch workflow definition
      const { data: workflow, error: fetchError } = await supabaseClient
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (fetchError || !workflow) throw new Error('Workflow not found');

      // 2. Create a Run record
      const { data: run, error: runError } = await supabaseClient
        .from('workflow_runs')
        .insert([{
          workflow_id: workflow.id,
          user_id: workflow.user_id,
          status: 'running',
          state_data: { context: runContext }
        }])
        .select()
        .single();

      if (runError) throw runError;

      // 3. Compile UI graph to AgentTaskGraph
      const nodes: any[] = workflow.nodes;
      const edges: any[] = workflow.edges;

      const agentTasks: TaskNode[] = [];
      
      nodes.forEach(node => {
        if (node.type === 'agent' || node.type === 'action') {
          // Find dependencies (incoming edges)
          const deps = edges.filter(e => e.target === node.id).map(e => e.source);
          
          agentTasks.push({
            id: node.id,
            agentRole: node.data.agentRole || 'general_assistant',
            description: node.data.label || 'Execute node action',
            dependencies: deps,
            status: 'pending'
          });
        }
      });

      // 4. Delegate to the Agent Coordinator
      // The coordinator handles parallel execution and dependency waiting
      const result = await agentCoordinator.runCollaborativeWorkflow(
        `wf_run_${run.id}`, 
        `Execute workflow: ${workflow.name}`, 
        agentTasks
      );

      // 5. Finalize run status
      const finalStatus = result.success ? 'completed' : 'failed';
      await supabaseClient
        .from('workflow_runs')
        .update({ 
          status: finalStatus, 
          completed_at: new Date().toISOString(),
          state_data: { ...runContext, finalState: result.finalState }
        })
        .eq('id', run.id);

      logger.info('WorkflowRunner', `Workflow run ${run.id} finished with status: ${finalStatus}`);
      return { success: result.success, runId: run.id };

    } catch (error) {
      logger.error('WorkflowRunner', `Execution failed for workflow ${workflowId}`, error);
      return { success: false, error: String(error) };
    }
  }
};
