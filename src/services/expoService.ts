import { supabase } from '../core/supabase';

export interface Sector {
  id: string;
  name: string;
  description: string;
  color_theme: string;
  map_position: { x: number; y: number; z: number };
}

export interface Company {
  id: string;
  sector_id: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  location: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  booth?: Booth;
}

export interface Booth {
  id: string;
  company_id: string;
  video_url: string;
  images: string[];
  services: any[];
  products: any[];
}

export const expoService = {
  // Iegūt visus sektorus
  async getSectors() {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as Sector[];
  },

  // Iegūt visus uzņēmumus ar to stendu datiem
  async getCompaniesWithBooths() {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        booth:booths(*)
      `)
      .eq('is_active', true);
    
    if (error) throw error;
    return data as (Company & { booth: Booth })[];
  },

  // Nosūtīt pakalpojuma pieprasījumu (Lead)
  async sendRequest(request: { company_id: string; service_name: string; client_name: string; client_email: string; message: string }) {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([request]);
    
    if (error) throw error;
    return data;
  },

  // Iegūt visus pieprasījumus konkrētam uzņēmumam
  async getServiceRequests(companyId: string) {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
