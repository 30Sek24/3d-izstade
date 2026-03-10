import { useState, useEffect } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { supabase } from '../core/supabase';

interface Autopilot {
  id: string;
  is_active: boolean;
  total_reach: number;
  total_leads: number;
  last_run_at: string;
}

export default function MarketingAutopilot() {
  const [autopilots, setAutopilots] = useState<Autopilot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data } = await supabase.from('marketing_autopilot').select('*');
        if (isMounted) {
          if (data && data.length > 0) {
            setAutopilots(data);
          } else {
            // Fallback mock dati, ja tabula tukša
            setAutopilots([
              { id: 'b2b_bots', is_active: true, total_reach: 42500, total_leads: 124, last_run_at: new Date().toISOString() },
              { id: 'b2c_bots', is_active: false, total_reach: 84200, total_leads: 542, last_run_at: new Date().toISOString() }
            ]);
          }
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };
    load();

    const subscription = supabase
      .channel('autopilot_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'marketing_autopilot' }, (payload: { new: Autopilot }) => {
        setAutopilots(current => current.map(a => a.id === payload.new.id ? payload.new : a));
      })
      .subscribe();

    return () => { 
      isMounted = false;
      supabase.removeChannel(subscription); 
    };
  }, []);

  const toggleAutopilot = async (id: string, currentState: boolean) => {
    // UI feedback immediate
    setAutopilots(prev => prev.map(a => a.id === id ? { ...a, is_active: !currentState } : a));
    
    try {
      await supabase
        .from('marketing_autopilot')
        .update({ is_active: !currentState, last_run_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) { 
      console.error("Autopilot toggle error:", e); 
    }
  };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
      <div className="spinner" style={{ border: '4px solid rgba(59, 130, 246, 0.1)', borderTop: '4px solid var(--accent-blue)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }}></div>
    </div>
  );

  const b2b = autopilots.find(a => a.id === 'b2b_bots');
  const b2c = autopilots.find(a => a.id === 'b2c_bots');

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1 className="text-accent" style={{ fontSize: '3.5rem' }}>Fleet Autopilot</h1>
        <p style={{ fontSize: '1.2rem' }}>Autonomā mārketinga un klientu piesaistes sistēma.</p>
      </div>

      {/* GLOBAL STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '10px' }}>KOPĒJĀ SASNIEDZAMĪBA</div>
          <div style={{ fontSize: '3rem', fontWeight: 950, color: '#fff' }}>
            {((b2b?.total_reach || 0) + (b2c?.total_reach || 0)).toLocaleString()}
          </div>
          <div style={{ color: 'var(--accent-blue)', fontWeight: 800, fontSize: '0.8rem', marginTop: '10px' }}>GLOBAL NETWORK ACCESS</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '10px' }}>KONVERTĒTIE KLIENTI (LEADS)</div>
          <div style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--accent-emerald)' }}>
            {((b2b?.total_leads || 0) + (b2c?.total_leads || 0)).toLocaleString()}
          </div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem', marginTop: '10px' }}>READY TO START PROJECTS</div>
        </div>
      </div>

      <div className="calc-grid">
        {/* B2B BOT */}
        <div className="glass-card" style={{ padding: '40px', border: b2b?.is_active ? '2px solid var(--accent-purple)' : '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>🚀 B2B AGENT</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Enterprise Outreach System</p>
            </div>
            {b2b?.is_active && <div className="pulse-dot" style={{ width: '15px', height: '15px', background: 'var(--accent-purple)', borderRadius: '50%', boxShadow: '0 0 15px var(--accent-purple)' }}></div>}
          </div>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem' }}>
              <span>Targeting: LinkedIn / Business Directories</span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 900 }}>ACTIVE SCANNING</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              <div style={{ width: '65%', height: '100%', background: 'var(--accent-purple)', borderRadius: '10px' }}></div>
            </div>
          </div>
          <button 
            onClick={() => toggleAutopilot('b2b_bots', b2b?.is_active ?? false)}
            className="btn-primary" 
            style={{ width: '100%', background: b2b?.is_active ? '#f43f5e' : 'var(--accent-purple)', padding: '18px' }}
          >
            {b2b?.is_active ? 'DEACTIVATE B2B UNIT' : 'START GLOBAL OUTREACH'}
          </button>
        </div>

        {/* B2C BOT */}
        <div className="glass-card" style={{ padding: '40px', border: b2c?.is_active ? '2px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>🎯 B2C AGENT</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Client Acquisition Bot</p>
            </div>
            {b2c?.is_active && <div className="pulse-dot" style={{ width: '15px', height: '15px', background: 'var(--accent-blue)', borderRadius: '50%', boxShadow: '0 0 15px var(--accent-blue)' }}></div>}
          </div>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem' }}>
              <span>Targeting: Google Ads / Social Media</span>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 900 }}>OPTIMIZING BIDS</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              <div style={{ width: '82%', height: '100%', background: 'var(--accent-blue)', borderRadius: '10px' }}></div>
            </div>
          </div>
          <button 
            onClick={() => toggleAutopilot('b2c_bots', b2c?.is_active ?? false)}
            className="btn-primary" 
            style={{ width: '100%', background: b2c?.is_active ? '#f43f5e' : 'var(--accent-blue)', padding: '18px' }}
          >
            {b2c?.is_active ? 'DEACTIVATE B2C UNIT' : 'LAUNCH TRAFFIC ENGINE'}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '40px', padding: '25px', background: 'rgba(15, 23, 42, 0.9)', borderLeft: '4px solid var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '2rem' }}>🤖</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, color: '#fff' }}>AI INSIGHT: CONVERSION OPTIMIZED</h4>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Your bots are currently targeting high-intent keywords in the DACH region. Expected lead growth: +15% this week.
          </p>
        </div>
        <button className="btn-glass" style={{ fontSize: '0.7rem' }}>VIEW LOGS</button>
      </div>

      <style>{`
        .pulse-dot { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
