// Frontend exposure for backend lead service
import { leadService } from '../backend/leads/leadService';
import { leadEngine } from '../backend/leads/engine/leadEngine';
import { supabaseClient } from '../lib/supabaseClient';

export const LeadsAPI = {
  // Existing Phase 3 functions
  createLead: leadService.createLead,
  updateLead: leadService.updateLead,
  getLeadsBySource: leadService.getLeadsBySource,

  // New Phase 9 functions
  getLeads: async () => {
    try {
      const { data, error } = await supabaseClient.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching leads:', error);
      return { data: null, error: String(error) };
    }
  },
  
  generateLeads: async (industry: string, location: string) => {
    return await leadEngine.processAndStoreLeads(industry, location);
  },
  
  updateLeadStatus: async (leadId: string, status: string, contacted: boolean = false) => {
    try {
      const { data, error } = await supabaseClient
        .from('leads')
        .update({ status, contacted })
        .eq('id', leadId)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating lead status:', error);
      return { data: null, error: String(error) };
    }
  }
};
