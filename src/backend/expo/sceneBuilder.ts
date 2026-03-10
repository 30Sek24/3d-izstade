import { supabaseClient } from '../../lib/supabaseClient.js';
import { logger } from '../logging/logger.js';

export const sceneBuilder = {
  /**
   * Compiles the entire 3D scene data into a single structured payload for the frontend / Unreal Engine.
   */
  async buildScene() {
    try {
      logger.info('SceneBuilder', 'Building Expo Scene...');

      const [sectorsResult, companiesResult, boothsResult] = await Promise.all([
        supabaseClient.from('sectors').select('*'),
        supabaseClient.from('companies').select('*').eq('is_active', true),
        supabaseClient.from('booths').select('*')
      ]);

      if (sectorsResult.error) throw new Error(`Failed to load sectors: ${sectorsResult.error.message}`);
      if (companiesResult.error) throw new Error(`Failed to load companies: ${companiesResult.error.message}`);
      if (boothsResult.error) throw new Error(`Failed to load booths: ${boothsResult.error.message}`);

      // Assemble structured data
      const sectors = sectorsResult.data || [];
      const boothsData = boothsResult.data || [];
      const companies = (companiesResult.data || []).map(company => {
        const companyBooth = boothsData.find(b => b.company_id === company.id);
        return {
          ...company,
          booth: companyBooth || {}
        };
      });

      // Extract unique assets for preloading
      const assets = boothsData
        .map(b => b.model_url)
        .filter(url => url && url.endsWith('.glb'));

      const sceneData = {
        sectors,
        companies,
        assets: [...new Set(assets)] // unique assets
      };

      logger.info('SceneBuilder', `Scene built with ${sectors.length} sectors and ${companies.length} companies.`);
      return { data: sceneData, error: null };
    } catch (error) {
      logger.error('SceneBuilder', 'Failed to build scene', error);
      return { data: null, error: String(error) };
    }
  }
};
