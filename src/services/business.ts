import { businessGenerator } from '../backend/business/businessGenerator';
import { supabaseClient } from '../lib/supabaseClient';

export const BusinessSystemAPI = {
  /**
   * Generates a new business end-to-step (Idea -> DB Project -> Workflow Tasks)
   */
  generateBusiness: businessGenerator.launchBusinessWorkflow.bind(businessGenerator),
  
  /**
   * Retrieves all AI-generated businesses from the database
   */
  getGeneratedBusinesses: async () => {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .contains('metadata', { generated_by: 'ai_system' })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching generated businesses', error);
      return { data: null, error: String(error) };
    }
  }
};
