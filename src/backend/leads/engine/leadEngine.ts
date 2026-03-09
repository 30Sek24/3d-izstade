import { logger } from '../../logging/logger';
import { googleMapsLeadSource } from '../sources/googleMapsLeadSource';
import { directoryLeadSource } from '../sources/directoryLeadSource';
import { linkedinLeadSource } from '../sources/linkedinLeadSource';
import { leadScoring } from '../leadScoring';
import { supabaseClient } from '../../../lib/supabaseClient';
import { agentScheduler } from '../../../agents/system/scheduler/agentScheduler';

export const leadEngine = {
  /**
   * 1. Collect leads from multiple sources
   */
  async collectLeads(industry: string, location: string) {
    try {
      logger.info('LeadEngine', `Collecting leads for ${industry} in ${location}`);
      
      // Parallel fetching from sources
      const [maps, directory, linkedin] = await Promise.all([
        googleMapsLeadSource.fetchLeads(industry, location),
        directoryLeadSource.fetchLeads(industry, location),
        linkedinLeadSource.fetchLeads(industry, location)
      ]);

      const allLeads = [
        ...(maps.data || []),
        ...(directory.data || []),
        ...(linkedin.data || [])
      ];

      return { data: allLeads, error: null };
    } catch (error) {
      logger.error('LeadEngine', 'Failed to collect leads', error);
      return { data: [], error: String(error) };
    }
  },

  /**
   * 2. Validate lead data format
   */
  validateLead(lead: any) {
    if (!lead.company_name) return false;
    if (!lead.email && !lead.phone) return false;
    return true;
  },

  /**
   * 3. Process (Collect -> Validate -> Score -> Store)
   */
  async processAndStoreLeads(industry: string, location: string) {
    try {
      logger.info('LeadEngine', `Processing and storing leads for ${industry}`);
      const collection = await this.collectLeads(industry, location);
      const leads = collection.data || [];

      const validLeads = leads.filter(this.validateLead);
      const storedLeads = [];

      for (const lead of validLeads) {
        const score = leadScoring.scoreLead(lead);

        // Store in Supabase
        const { data, error } = await supabaseClient.from('leads').insert([{
          source: 'LeadEngine',
          contact_info: lead,
          status: 'new',
          score: score,
          contacted: false
        }]).select().single();

        if (!error && data) {
          storedLeads.push(data);
        }
      }

      logger.info('LeadEngine', `Successfully stored ${storedLeads.length} valid leads`);
      return { data: storedLeads, error: null };
    } catch (error) {
      logger.error('LeadEngine', 'Failed to process leads', error);
      return { data: null, error: String(error) };
    }
  },

  /**
   * 4. Assign a lead to a sales agent by creating a task
   */
  async assignLead(leadId: string, salesAgentId: string) {
    try {
      logger.info('LeadEngine', `Assigning lead ${leadId} to agent ${salesAgentId}`);
      
      const taskResult = await agentScheduler.dispatchTask({
        agent_id: salesAgentId,
        status: 'pending',
        task_data: {
          action: 'Perform Outreach',
          lead_id: leadId
        }
      });

      return { data: taskResult.data, error: null };
    } catch (error) {
      logger.error('LeadEngine', 'Failed to assign lead', error);
      return { data: null, error: String(error) };
    }
  }
};
