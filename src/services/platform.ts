// Frontend exposure for Platform Control Center
import { platformMetrics } from '../backend/platform/metrics/platformMetrics';
import { systemMonitor } from '../backend/platform/monitoring/systemMonitor';
import { aiOptimizer } from '../backend/platform/optimization/aiOptimizer';

export const PlatformAPI = {
  // 1. Metrics Aggregation
  getPlatformMetrics: async () => {
    const [agents, leads, business, expo] = await Promise.all([
      platformMetrics.getAgentStats(),
      platformMetrics.getLeadStats(),
      platformMetrics.getBusinessStats(),
      platformMetrics.getExpoStats()
    ]);

    return {
      agents: agents.data,
      leads: leads.data,
      business: business.data,
      expo: expo.data
    };
  },

  // 2. System Health & Monitoring
  getSystemHealth: async () => {
    const [queue, agentHealth, llm] = await Promise.all([
      systemMonitor.getQueueStatus(),
      systemMonitor.getAgentHealth(),
      systemMonitor.getLLMUsage()
    ]);

    return {
      queue: queue.data,
      agentHealth: agentHealth.data,
      llmUsage: llm.data
    };
  },

  // 3. AI Optimization Insights
  getOptimizationInsights: async () => {
    return {
      analyzeLeadConversion: aiOptimizer.analyzeLeadConversion,
      suggestBetterNiches: aiOptimizer.suggestBetterNiches,
      optimizeAgentTasks: aiOptimizer.optimizeAgentTasks
    };
  }
};
