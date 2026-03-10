import type { WorkflowDefinition, WorkflowNode } from './workflowDefinition.js';
import { logger } from '../logging/logger.js';

export const workflowValidator = {
  /**
   * Validates a workflow definition to ensure it can be executed safely.
   */
  validate(workflow: WorkflowDefinition): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push('Workflow must contain at least one node.');
    }

    if (!workflow.edges) {
      errors.push('Workflow edges array is missing.');
    }

    const triggers = workflow.nodes.filter(n => n.type === 'trigger');
    if (triggers.length === 0) {
      errors.push('Workflow must have at least one trigger node.');
    }

    // Basic cycle detection (prevent infinite synchronous loops in DAG)
    const hasCycle = this._detectCycle(workflow.nodes, workflow.edges);
    if (hasCycle) {
      errors.push('Workflow contains circular dependencies (loops).');
    }

    if (errors.length > 0) {
      logger.warn('WorkflowValidator', `Validation failed for workflow ${workflow.name}`, { errors });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  _detectCycle(nodes: WorkflowNode[], edges: any[]): boolean {
    // Adjacency list
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      if (adj.has(e.source)) {
        adj.get(e.source)!.push(e.target);
      }
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const checkCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adj.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (checkCycle(neighbor)) return true;
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (checkCycle(node.id)) return true;
    }

    return false;
  }
};
