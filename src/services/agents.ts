// Frontend exposure for agent orchestration system
import { agentBrain } from '../agents/system/brain/agentBrain';
import { agentScheduler } from '../agents/system/scheduler/agentScheduler';
import { agentMemory } from '../agents/system/memory/agentMemory';

export const AgentSystemAPI = {
  brain: agentBrain,
  scheduler: agentScheduler,
  memory: agentMemory
};
