// Frontend exposure for AI Agent Marketplace
import { agentRegistry } from '../backend/marketplace/agents/agentRegistry';
import { workflowMarketplace } from '../backend/marketplace/workflows/workflowMarketplace';
import { templateService } from '../backend/marketplace/templates/templateService';
import { installService } from '../backend/marketplace/installService';

export const MarketplaceAPI = {
  // Browsing
  getAgents: agentRegistry.getAvailableAgents,
  getWorkflows: workflowMarketplace.getAvailableWorkflows,
  getTemplates: templateService.getAvailableTemplates,

  // Installation
  installAgent: installService.installAgent,
  installWorkflow: installService.installWorkflow,
  installTemplate: installService.installTemplate
};
