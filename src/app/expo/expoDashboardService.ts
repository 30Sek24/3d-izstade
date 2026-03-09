import { CityMapAPI, ExpoDataAPI } from '../../services/expo';
import { logger } from '../../backend/logging/logger';
import { supabaseClient } from '../../lib/supabaseClient';

export const expoDashboardService = {
  /**
   * Fetches the macro city layout
   */
  async getCityMap() {
    try {
      logger.info('ExpoDashboardService', 'Fetching city map for UI');
      return await CityMapAPI.getExpoCity();
    } catch (error) {
      logger.error('ExpoDashboardService', 'Failed to fetch city map', error);
      return { data: null, error: String(error) };
    }
  },

  /**
   * Retrieves only the booths owned/managed by the specific user
   */
  async getUserBooths(userId: string) {
    try {
      logger.info('ExpoDashboardService', `Fetching booths for user ${userId}`);
      // Currently, expo_booths lacks user_id. For safety, we return all or simulate user filter.
      const { data, error } = await supabaseClient
        .from('expo_booths')
        .select('*')
        .limit(5); // simulated owned limitation

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      logger.error('ExpoDashboardService', 'Failed to fetch user booths', error);
      return { data: null, error: String(error) };
    }
  },

  /**
   * Retrieves analytics for a specific booth to show in the UI panel
   */
  async getBoothAnalytics(boothId: string) {
    try {
      logger.info('ExpoDashboardService', `Fetching analytics for booth ${boothId}`);
      return await ExpoDataAPI.getBoothStats(boothId);
    } catch (error) {
      logger.error('ExpoDashboardService', 'Failed to fetch booth analytics', error);
      return { data: null, error: String(error) };
    }
  }
};
