import { logger } from '../../logging/logger.js';
import { agentExecutionLoop } from './agentExecutionLoop.js';
import { agentTaskGraph } from './agentTaskGraph.js';
import type { TaskNode } from './agentTaskGraph.js';
import { supabaseClient } from '../../../lib/supabaseClient.js';
import { memoryService } from '../memoryService.js';

export const agentCoordinator = {
  /**
   * Orchestrates a multi-agent workflow using a directed acyclic graph (DAG) of tasks.
   * Agents share memory and trigger sequentially based on dependencies.
   */
  async runCollaborativeWorkflow(projectId: string, _overarchingGoal: string, nodes: TaskNode[]) {
    try {
      logger.info('AgentCoordinator', `Starting collaborative workflow for project ${projectId}`);
      
      const graph = agentTaskGraph.buildGraph(nodes);
      let allCompleted = false;
      let iterations = 0;
      const MAX_WORKFLOW_ITERATIONS = 20;

      // Shared Memory Hub (Agents will write/read from a shared context tag)
      const sharedMemoryId = `project_shared_${projectId}`;

      while (!allCompleted && iterations < MAX_WORKFLOW_ITERATIONS) {
        const readyTasks = agentTaskGraph.getReadyTasks(graph);
        
        if (readyTasks.length === 0) {
          // Check if we are done or deadlocked
          const pending = Array.from(graph.values()).filter(n => n.status === 'pending');
          if (pending.length === 0) {
            allCompleted = true;
          } else {
            throw new Error('Workflow deadlock: Dependencies cannot be resolved.');
          }
          break;
        }

        // Execute ready tasks in parallel
        await Promise.all(readyTasks.map(async (task) => {
          agentTaskGraph.updateTask(graph, task.id, 'in_progress');
          
          try {
            // Find an available agent matching the role
            const { data: agents } = await supabaseClient
              .from('agents')
              .select('id')
              .eq('role', task.agentRole)
              .limit(1);

            let agentId = agents?.[0]?.id;
            
            if (!agentId) {
              logger.warn('AgentCoordinator', `No specific agent found for role ${task.agentRole}, using fallback ID.`);
              agentId = 'shared_system_agent';
            }

            // Agents read shared memory to understand what happened previously
            const sharedContext = await memoryService.getMemory(sharedMemoryId, 5);
            const contextString = sharedContext.data?.map(m => m.context).join(' | ') || '';
            const enrichedTaskDescription = `${task.description}. Context from other agents: ${contextString}`;

            // Create a temporary task ID for execution
            const tempTaskId = `temp_collab_${task.id}_${Date.now()}`;
            
            // Run the autonomous agent loop
            const result = await agentExecutionLoop.runAgent(
              tempTaskId, 
              agentId, 
              task.agentRole, 
              enrichedTaskDescription,
              3 // Shorter max iterations for sub-tasks
            );

            // Agents write their findings back to the shared memory hub
            if (result && result.status === 'success') {
              await memoryService.saveMemory({
                agent_id: sharedMemoryId,
                context: `Agent ${task.agentRole} completed task [${task.description}]. Result summary: ${JSON.stringify(result.results)}`,
                metadata: { project_id: projectId }
              });
              agentTaskGraph.updateTask(graph, task.id, 'completed', result);
            } else {
              agentTaskGraph.updateTask(graph, task.id, 'failed', result);
            }
          } catch (e) {
            logger.error('AgentCoordinator', `Task ${task.id} failed`, e);
            agentTaskGraph.updateTask(graph, task.id, 'failed');
          }
        }));

        iterations++;
      }

      if (!allCompleted) {
        logger.warn('AgentCoordinator', 'Workflow halted before all tasks completed (max iterations).');
      }

      return {
        success: allCompleted,
        finalState: Array.from(graph.values())
      };

    } catch (error) {
      logger.error('AgentCoordinator', 'Workflow orchestration failed', error);
      return { success: false, error: String(error) };
    }
  }
};
