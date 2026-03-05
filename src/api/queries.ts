import { supabase } from '../lib/supabase';
import type { Section, EstimateLine } from '../lib/calculator-types';

export async function fetchSections(): Promise<Section[]> {
  try {
    const { data, error } = await supabase
      .from('section')
      .select('id, name, code, priority')
      .eq('is_active', true)
      .order('priority', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("Supabase fetch failed (maybe keys are missing or table is empty). Falling back to Mock data.");
    return [];
  }
}

export async function fetchCatalogItems(sectionId: string) {
  try {
    const { data, error } = await supabase
      .from('item')
      .select(`
        id, code, name, default_unit, type,
        work_item (base_labor_rate),
        material (brand, model)
      `)
      .eq('section_id', sectionId)
      .eq('is_active', true);
      
    if (error) throw error;
    return data || [];
  } catch {
    console.warn("Could not fetch items from Supabase.");
    return [];
  }
}

export async function saveEstimateDraft(
  lines: EstimateLine[], 
  clientName: string, 
  projectName: string, 
  geometry: Record<string, unknown>,
  userId: string
) {
  try {
    // 1. Izveidojam Estimate galveni
    const { data: estData, error: estError } = await supabase
      .from('estimate')
      .insert({
        estimate_no: `EST-${Math.floor(Math.random() * 100000)}`,
        status: 'draft',
        client_name: clientName || 'Nezināms klients',
        object_type: 'apartment', // Pagaidām ciets kodējums
        location_address: projectName || 'Nezināms objekts',
        geometry_params: geometry,
        created_by: userId
      })
      .select('id')
      .single();

    if (estError) throw estError;

    // 2. Sagatavojam rindas saglabāšanai
    if (lines.length > 0 && estData) {
      const dbLines = lines.map((l, index) => ({
        estimate_id: estData.id,
        section_id: l.section_id,
        source_type: 'custom', // Tā kā mock datiem nav īstu item_id, liekam custom
        description: l.description,
        unit: l.unit,
        qty: l.qty,
        unit_price_labor: l.unit_price_labor,
        unit_price_material: l.unit_price_material,
        line_total: (l.unit_price_labor + l.unit_price_material) * l.qty,
        sort_order: index
      }));

      const { error: linesError } = await supabase
        .from('estimate_line')
        .insert(dbLines);

      if (linesError) throw linesError;
    }

    return { success: true, estimateId: estData?.id };
  } catch (error: unknown) {
    console.error("Save Draft Error:", error);
    return { success: false, error: (error as Error).message };
  }
}