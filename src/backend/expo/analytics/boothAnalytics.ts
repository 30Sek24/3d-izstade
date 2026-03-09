import { supabaseClient } from '../../../lib/supabaseClient';
import { logger } from '../../logging/logger';

export const boothAnalytics = {
  /**
   * Ensures an analytics record exists for the booth, then increments a specific field
   */
  async _incrementStat(boothId: string, field: 'visits' | 'interactions' | 'leads_generated') {
    try {
      // First, try to get existing record
      const { data: existing, error: fetchError } = await supabaseClient
        .from('booth_analytics')
        .select('*')
        .eq('booth_id', boothId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'not found'
         throw fetchError;
      }

      if (!existing) {
        // Create new record
        const insertPayload = { booth_id: boothId, [field]: 1 };
        const { error: insertError } = await supabaseClient
          .from('booth_analytics')
          .insert([insertPayload]);
        if (insertError) throw insertError;
      } else {
        // Update existing record
        const { error: updateError } = await supabaseClient
          .from('booth_analytics')
          .update({ [field]: (existing[field] || 0) + 1, updated_at: new Date().toISOString() })
          .eq('booth_id', boothId);
        if (updateError) throw updateError;
      }
      
      return { success: true, error: null };
    } catch (error) {
      logger.error('BoothAnalytics', `Failed to increment ${field} for booth ${boothId}`, error);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Tracks a visit/view to a specific booth
   */
  async trackVisit(boothId: string) {
    logger.info('BoothAnalytics', `Tracking visit for ${boothId}`);
    return this._incrementStat(boothId, 'visits');
  },

  /**
   * Tracks an interaction (button click, video view) inside the booth
   */
  async trackInteraction(boothId: string) {
    logger.info('BoothAnalytics', `Tracking interaction for ${boothId}`);
    return this._incrementStat(boothId, 'interactions');
  },

  /**
   * Tracks when a lead is captured inside the booth
   */
  async trackLeadGenerated(boothId: string) {
    logger.info('BoothAnalytics', `Tracking lead generated for ${boothId}`);
    return this._incrementStat(boothId, 'leads_generated');
  },

  /**
   * Gets analytics stats for a booth
   */
  async getBoothStats(boothId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('booth_analytics')
        .select('*')
        .eq('booth_id', boothId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Return zeros if no data exists yet
      if (!data) {
        return { data: { visits: 0, interactions: 0, leads_generated: 0 }, error: null };
      }

      return { data, error: null };
    } catch (error) {
      logger.error('BoothAnalytics', `Failed to get stats for ${boothId}`, error);
      return { data: null, error: String(error) };
    }
  }
};
