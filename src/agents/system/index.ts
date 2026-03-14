import { agentBrain as AgentBrain } from './brain/agentBrain';
import { agentMemory as AgentMemory } from './memory/agentMemory';
import { agentScheduler as TaskScheduler } from './scheduler/agentScheduler';
import { WorkflowEngine } from './workflows/WorkflowEngine';

export const WarpalaCore = {
  AgentBrain,
  AgentMemory,
  TaskScheduler,
  WorkflowEngine
};

// Also export individually for easier access
export { AgentBrain, AgentMemory, TaskScheduler, WorkflowEngine };
