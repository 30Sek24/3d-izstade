import { supabaseClient } from '../../../lib/supabaseClient';
import { logger } from '../../logging/logger';

export const expoSceneService = {
  /**
   * Returns complete scene orchestration data for Unreal Engine to load
   */
  async getSceneData() {
    try {
      logger.info('ExpoSceneService', 'Getting Global Scene Data for Unreal Engine');
      const { data: booths, error } = await supabaseClient
        .from('expo_booths')
        .select('*');

      if (error) throw error;

      // Unreal Engine Structured JSON format
      const ue5Scene = booths.map((b: any) => ({
        booth_id: b.id,
        position: b.assets_3d?.transform?.location || [0, 0, 0],
        model_url: b['3d_model_url'] || b.assets_3d?.mesh_url || 'default_mesh.uasset',
        metadata: {
          company: b.company_name,
          type: b.booth_type,
          district: b.district,
          logo: b.logo
        }
      }));

      return { data: { sceneType: "GlobalExpo", entities: ue5Scene }, error: null };
    } catch (error) {
      logger.error('ExpoSceneService', 'Failed to get scene data', error);
      return { data: null, error: String(error) };
    }
  },

  /**
   * Returns localized scene data for a specific booth level
   */
  async getBoothScene(boothId: string) {
    try {
      logger.info('ExpoSceneService', `Getting Booth Scene for ${boothId}`);
      const { data: booth, error } = await supabaseClient
        .from('expo_booths')
        .select('*')
        .eq('id', boothId)
        .single();

      if (error) throw error;

      const ue5Booth = {
        booth_id: booth.id,
        streamingLevel: `Level_Booth_${booth.id}`,
        model_url: booth['3d_model_url'],
        metadata: {
           company: booth.company_name,
           colors: booth.contact_info?.brand_colors || ['#ffffff'],
           interactiveElements: booth.assets_3d?.interactives || []
        }
      };

      return { data: ue5Booth, error: null };
    } catch (error) {
      logger.error('ExpoSceneService', 'Failed to get booth scene', error);
      return { data: null, error: String(error) };
    }
  },

  /**
   * Returns the macro layout for the City level
   */
  async getCityScene() {
    try {
      logger.info('ExpoSceneService', 'Getting City Map structural data');
      const { data: booths, error } = await supabaseClient
        .from('expo_booths')
        .select('district');

      if (error) throw error;

      const districts = [...new Set(booths.map((b: any) => b.district).filter(Boolean))];

      const cityMapData = {
        navMeshReady: true,
        zones: districts.map(d => ({
          name: d,
          waypoint: `WP_Dist_${d}`
        }))
      };

      return { data: cityMapData, error: null };
    } catch (error) {
      logger.error('ExpoSceneService', 'Failed to get city scene', error);
      return { data: null, error: String(error) };
    }
  }
};
