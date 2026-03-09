// Frontend exposure for backend automation engine
import { workflowEngine } from '../backend/automation/workflowEngine';

export const AutomationAPI = {
  startBusinessWorkflow: workflowEngine.startBusinessWorkflow,
};
