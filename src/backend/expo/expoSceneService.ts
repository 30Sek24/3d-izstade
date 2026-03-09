import { supabaseClient, handleSupabaseError } from '../../lib/supabaseClient';

/**
 * Service dedicated to providing data for future Unreal Engine integration.
 * It formats the standard Supabase data into Unreal Engine optimized JSON structures.
 */
export const expoSceneService = {
  /**
   * Returns complete scene orchestration data for Unreal Engine to load
   */
  async getSceneData() {
    try {
      // Fetch all booths and map their 3D assets
      const { data: booths, error } = await supabaseClient
        .from('expo_booths')
        .select('id, company_name, assets_3d, industry_sector');

      if (error) throw error;

      // Formatting logic for UE5 consumption
      const ue5SceneStructure = {
        version: "1.0",
        sceneType: "GlobalExpo",
        entities: booths?.map(b => ({
          id: b.id,
          name: b.company_name,
          sector: b.industry_sector,
          mesh: b.assets_3d?.mesh_url || "default_booth.uasset",
          transform: b.assets_3d?.transform || { location: [0,0,0], rotation: [0,0,0], scale: [1,1,1] }
        })) || []
      };

      return { data: ue5SceneStructure, error: null };
    } catch (error) {
      return handleSupabaseError(error, 'getSceneData');
    }
  },

  /**
   * Returns specific localized booth scene details
   */
  async getBoothScene(boothId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('expo_booths')
        .select('*')
        .eq('id', boothId)
        .single();

      if (error) throw error;

      const ue5BoothStructure = {
        id: data.id,
        streamingLevel: `Level_Booth_${data.id}`,
        assets: data.assets_3d,
        branding: {
           company: data.company_name,
           colors: data.contact_info?.brand_colors || ['#ffffff']
        }
      };

      return { data: ue5BoothStructure, error: null };
    } catch (error) {
      return handleSupabaseError(error, 'getBoothScene');
    }
  },

  /**
   * Returns the macro layout for the City Map navigation in UE5
   */
  async getCityMap() {
    try {
       // Future expansion: Query a 'sectors' or 'city_zones' table.
       // For now, grouping booths by industry sector.
       const { data: booths, error } = await supabaseClient
         .from('expo_booths')
         .select('industry_sector');
       
       if (error) throw error;

       const activeSectors = [...new Set(booths?.map(b => b.industry_sector).filter(Boolean))];

       const ue5MapStructure = {
         navMeshReady: true,
         zones: activeSectors.map(sector => ({
            name: sector,
            waypoint: `WP_${sector}`,
            unlocked: true
         }))
       };

       return { data: ue5MapStructure, error: null };
    } catch (error) {
      return handleSupabaseError(error, 'getCityMap');
    }
  }
};
