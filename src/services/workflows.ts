import { workflowRunner } from '../backend/workflows/workflowRunner.js';
import { workflowValidator } from '../backend/workflows/workflowValidator.js';
import { supabaseClient } from '../lib/supabaseClient.js';

export const WorkflowAPI = {
  executeWorkflow: workflowRunner.execute,
  validateWorkflow: workflowValidator.validate,
  
  async getWorkflows() {
    const { data, error } = await supabaseClient
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getWorkflowRuns(workflowId: string) {
    const { data, error } = await supabaseClient
      .from('workflow_runs')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('started_at', { ascending: false });
    
    return { data, error };
  }
};
