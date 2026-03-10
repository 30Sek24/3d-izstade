import { logger } from '../../logging/logger.js';

export interface TaskNode {
  id: string;
  agentRole: string;
  description: string;
  dependencies: string[]; // array of TaskNode ids that must complete first
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
}

export const agentTaskGraph = {
  /**
   * Creates a dependency graph for a complex goal.
   */
  buildGraph(nodes: TaskNode[]): Map<string, TaskNode> {
    const graph = new Map<string, TaskNode>();
    nodes.forEach(node => graph.set(node.id, node));
    return graph;
  },

  /**
   * Identifies which tasks are ready to be executed (dependencies met).
   */
  getReadyTasks(graph: Map<string, TaskNode>): TaskNode[] {
    const readyTasks: TaskNode[] = [];
    
    for (const [_, node] of graph.entries()) {
      if (node.status === 'pending') {
        const canRun = node.dependencies.every(depId => {
          const depNode = graph.get(depId);
          return depNode && depNode.status === 'completed';
        });

        if (canRun) {
          readyTasks.push(node);
        }
      }
    }
    
    return readyTasks;
  },

  /**
   * Updates a task's status and result in the graph.
   */
  updateTask(graph: Map<string, TaskNode>, taskId: string, status: TaskNode['status'], result?: any) {
    const node = graph.get(taskId);
    if (node) {
      node.status = status;
      if (result) node.result = result;
      graph.set(taskId, node);
      logger.info('AgentTaskGraph', `Task ${taskId} updated to ${status}`);
    }
  }
};
