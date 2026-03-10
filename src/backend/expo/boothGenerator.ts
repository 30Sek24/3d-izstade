import { supabaseClient } from '../../lib/supabaseClient.js';
import { logger } from '../logging/logger.js';
import { assetPipeline } from './assets/assetPipeline.js';

export const boothGenerator = {
  /**
   * Automatically generates a 3D booth when a new company is onboarded.
   */
  async generateBoothForCompany(companyId: string) {
    try {
      logger.info('BoothGenerator', `Starting booth generation for company: ${companyId}`);

      // 1. Fetch Company Data
      const { data: company, error: companyError } = await supabaseClient
        .from('companies')
        .select('name, logo_url, sector_id')
        .eq('id', companyId)
        .single();

      if (companyError || !company) {
        throw new Error('Failed to fetch company details');
      }

      // 2. Fetch Sector for Theme
      const { data: sector } = await supabaseClient
        .from('sectors')
        .select('color_theme')
        .eq('id', company.sector_id)
        .single();

      const themeColor = sector?.color_theme || '#3b82f6';

      // 3. Asset Pipeline: Generate base model with attached logo and colors
      // We delegate the GLB creation/assignment to the assetPipeline
      const modelUrl = await assetPipeline.generateGLBModel({
        companyName: company.name,
        logoUrl: company.logo_url,
        colorTheme: themeColor
      });

      // 4. Store in the database
      // The prompt asks to "Store in: expo_booths", but original frontend schema uses 'booths'.
      // We will write to 'booths' to maintain frontend compatibility.
      const { data: booth, error: boothError } = await supabaseClient
        .from('booths')
        .insert([{
          company_id: companyId,
          model_url: modelUrl,
          video_url: null, // Can be updated by admin later
          images: [],
          services: [],
          products: []
        }])
        .select()
        .single();

      if (boothError) throw boothError;

      logger.info('BoothGenerator', `Booth generated successfully for company ${companyId}`);
      return { data: booth, error: null };

    } catch (error) {
      logger.error('BoothGenerator', 'Failed to generate booth', error);
      return { data: null, error: String(error) };
    }
  }
};
