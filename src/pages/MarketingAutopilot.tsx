import { useState, useEffect } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { supabase } from '../lib/supabase';

export default function MarketingAutopilot() {
  const [autopilots, setAutopilots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAutopilotStatus = async () => {
    const { data } = await supabase.from('marketing_autopilot').select('*');
    if (data) setAutopilots(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAutopilotStatus();
    const subscription = supabase
      .channel('autopilot_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'marketing_autopilot' }, (payload) => {
        setAutopilots(current => current.map(a => a.id === payload.new.id ? payload.new : a));
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  const toggleAutopilot = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('marketing_autopilot')
      .update({ is_active: !currentState, last_run_at: new Date().toISOString() })
      .eq('id', id);
    
    if (!error) {
      // Local UI update for immediate feedback
      setAutopilots(prev => prev.map(a => a.id === id ? { ...a, is_active: !currentState } : a));
    }
  };

  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Savienojas ar mārketinga serveriem...</div>;

  const b2b = autopilots.find(a => a.id === 'b2b_bots');
  const b2c = autopilots.find(a => a.id === 'b2c_bots');

  return (
    <div className="calculator-pro-wrapper" style={{ paddingBottom: '100px' }}>
      <div className="calc-header">
        <h1 style={{ color: '#3b82f6', fontSize: '3rem', fontWeight: 900 }}>MĀRKETINGA AUTOPILOTS</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Globālā algoritma vadība. Šie boti strādā 24/7, lai piesaistītu partnerus un klientus.</p>
      </div>

      {/* Real-time Stats from DB */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Kopējā Sasniedzamība (Ads/Email)</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a' }}>{( (b2b?.total_reach || 0) + (b2c?.total_reach || 0) ).toLocaleString()}</div>
          <div style={{ color: '#10b981', fontWeight: 'bold' }}>+ Aktīva mērķauditorijas filtrēšana</div>
        </div>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Konvertētie Klienti (Leads)</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#3b82f6' }}>{( (b2b?.total_leads || 0) + (b2c?.total_leads || 0) ).toLocaleString()}</div>
          <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Gatavi saņemt tāmes</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* B2B BOT */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: b2b?.is_active ? '3px solid #8b5cf6' : '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>🚀 B2B Bots (Uzņēmumi)</h2>
            <div style={{ padding: '5px 15px', borderRadius: '50px', background: b2b?.is_active ? '#8b5cf6' : '#f1f5f9', color: b2b?.is_active ? '#fff' : '#64748b', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {b2b?.is_active ? 'DARBOJAS' : 'PAUZĒTS'}
            </div>
          </div>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Automātiski uzrunā Eiropas būvniecības firmas, arhitektus un materiālu tirgotājus LinkedIn un e-pasta vidē.</p>
          <button 
            onClick={() => toggleAutopilot('b2b_bots', b2b?.is_active)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: b2b?.is_active ? '#ef4444' : '#8b5cf6', color: '#fff' }}
          >
            {b2b?.is_active ? 'APTURĒT BOTU' : 'AKTIVIZĒT GLOBĀLO MEKLĒŠANU'}
          </button>
        </div>

        {/* B2C BOT */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: b2c?.is_active ? '3px solid #10b981' : '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>📣 B2C Bots (Klienti)</h2>
            <div style={{ padding: '5px 15px', borderRadius: '50px', background: b2c?.is_active ? '#10b981' : '#f1f5f9', color: b2c?.is_active ? '#fff' : '#64748b', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {b2c?.is_active ? 'AKTĪVS' : 'PAUZĒTS'}
            </div>
          </div>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Pārvalda Google un Facebook reklāmas budžetus, lai virzītu mājokļu īpašniekus uz tāmju kalkulatoriem.</p>
          <button 
            onClick={() => toggleAutopilot('b2c_bots', b2c?.is_active)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: b2c?.is_active ? '#ef4444' : '#10b981', color: '#fff' }}
          >
            {b2c?.is_active ? 'APTURĒT REKLĀMAS' : 'PALAIST KLIENTU PLŪSMU'}
          </button>
        </div>

      </div>

      <div style={{ marginTop: '60px', padding: '30px', background: '#0f172a', borderRadius: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '2rem' }}>🔒</div>
        <div>
          <h4 style={{ margin: 0, color: '#eab308' }}>DROŠĪBAS PROTOKOLS AKTĪVS</h4>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>Visi autopilotu dati ir šifrēti. Boti ievēro GDPR un starptautiskos mārketinga noteikumus.</p>
        </div>
      </div>
    </div>
  );
}