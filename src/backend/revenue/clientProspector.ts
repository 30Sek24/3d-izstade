import { logger } from '../logging/logger.js';
import { googleMapsLeadSource } from '../leads/sources/googleMapsLeadSource.js';
import { supabaseClient } from '../../lib/supabaseClient.js';

export const clientProspector = {
  /**
   * Discovers potential business clients in specific niches and locations.
   */
  async findProspects(niche: string, location: string, limit: number = 10) {
    try {
      logger.info('ClientProspector', `Finding prospects for: ${niche} in ${location}`);

      // 1. Use the existing Lead Engine infrastructure to fetch real data from Google Maps
      const leads = await googleMapsLeadSource.fetchLeads(niche, location, limit);

      if (leads.error || !leads.data) {
        throw new Error(leads.error || 'Failed to fetch lead data');
      }

      const storedProspects = [];

      // 2. Store prospects in the new prospects table
      for (const lead of leads.data) {
        const { data, error } = await supabaseClient
          .from('prospects')
          .insert([{
            company_name: lead.company_name,
            website: lead.website,
            email: lead.email,
            industry: niche,
            location: lead.location,
            status: 'new'
          }])
          .select()
          .single();

        if (error) {
          logger.warn('ClientProspector', `Failed to store prospect: ${error.message}`);
          continue;
        }
        
        storedProspects.push(data);
      }

      logger.info('ClientProspector', `Successfully discovered and stored ${storedProspects.length} prospects`);
      return { data: storedProspects, error: null };
    } catch (error) {
      logger.error('ClientProspector', 'Prospecting failed', error);
      return { data: null, error: String(error) };
    }
  }
};
