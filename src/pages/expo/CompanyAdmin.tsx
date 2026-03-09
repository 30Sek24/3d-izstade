import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../core/supabase';
import { expoService } from '../../services/expoService';
import type { Sector } from '../../services/expoService';
import '../../components/calculator/styles/CalculatorPro.css';
import WarpalaLogo from '../../shared/Logo';

export default function CompanyAdmin() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [company, setCompany] = useState<any>({
    name: '',
    description: '',
    sector_id: '',
    logo_url: '',
    website: '',
    location: '',
    booth: {
      video_url: '',
      services: [],
      products: []
    }
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const sectorData = await expoService.getSectors();
        if (sectorData) setSectors(sectorData);
        
        const companies = await expoService.getCompaniesWithBooths();
        if (companies && companies.length > 0) {
          const first = companies[0];
          setCompany({
            id: first.id,
            name: first.name,
            description: first.description,
            sector_id: first.sector_id,
            logo_url: first.logo_url,
            website: first.website,
            location: first.location,
            booth: first.booth || { video_url: '', services: [], products: [] }
          });
          
          const leadData = await expoService.getServiceRequests(first.id);
          if (leadData) setLeads(leadData);
        }
      } catch (e) {
        console.error("Init error:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSave = async () => {
    if (!company.name || !company.sector_id) {
      setMessage({ type: 'error', text: 'Lūdzu ievadiet nosaukumu un sektoru!' });
      return;
    }
    setLoading(true);
    try {
      const { data: compData, error: compError } = await supabase
        .from('companies')
        .upsert({
          id: company.id,
          name: company.name,
          description: company.description,
          sector_id: company.sector_id,
          logo_url: company.logo_url,
          tier: 'pro'
        })
        .select()
        .single();

      if (compError) throw compError;

      const { error: boothError } = await supabase
        .from('booths')
        .upsert({
          company_id: compData.id,
          video_url: company.booth?.video_url || '',
          services: [],
          products: []
        });

      if (boothError) throw boothError;

      setCompany((prev: any) => ({ ...prev, id: compData.id }));
      setMessage({ type: 'success', text: 'Viss saglabāts!' });
    } catch (e: any) {
      setMessage({ type: 'error', text: 'Kļūda saglabājot.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', color: 'white' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <WarpalaLogo size={50} />
        <button onClick={() => nav('/expo-3d')} className="btn-pro" style={{ background: '#3b82f6' }}>UZ 3D PILSĒTU</button>
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px' }}>EXPO ADMIN</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Pārvaldi savu stendu šeit.</p>

      {message && (
        <div style={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', background: message.type === 'success' ? '#065f46' : '#991b1b' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
          <h3>Uzņēmuma dati</h3>
          <input 
            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }} 
            placeholder="Nosaukums" 
            value={company.name} 
            onChange={e => setCompany({...company, name: e.target.value})} 
          />
          <select 
            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
            value={company.sector_id}
            onChange={e => setCompany({...company, sector_id: e.target.value})}
          >
            <option value="">Izvēlies sektoru</option>
            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <textarea 
            style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }} 
            placeholder="Apraksts" 
            value={company.description} 
            onChange={e => setCompany({...company, description: e.target.value})} 
          />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
          <h3>3D Stenda video</h3>
          <input 
            style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }} 
            placeholder="Video URL (YouTube/MP4)" 
            value={company.booth?.video_url} 
            onChange={e => setCompany({...company, booth: {...company.booth, video_url: e.target.value}})} 
          />
          <button onClick={handleSave} className="btn-pro" style={{ width: '100%', padding: '15px', background: '#3b82f6' }}>
            {loading ? 'Saglabā...' : 'SAGLABĀT IZMAIŅAS'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
        <h3>Ienākošie Leads</h3>
        {leads.length === 0 ? <p style={{ color: '#64748b' }}>Nav jaunu ziņu.</p> : leads.map(l => (
          <div key={l.id} style={{ padding: '10px 0', borderBottom: '1px solid #334155' }}>
            <strong>{l.client_name}</strong> ({l.client_email}): {l.message}
          </div>
        ))}
      </div>
    </div>
  );
}
