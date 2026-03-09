import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats] = useState({ 
    revenue: 12450, 
    projects: 12, 
    leads: 45,
    activeTasks: 8,
    systemSync: 98
  });

  const recentActivities = [
    { id: 1, type: 'calc', text: 'Jauna tāme izveidota: "Vannas istabas remonts"', time: 'pirms 10 min', icon: '📝' },
    { id: 2, type: 'lead', text: 'Lead saņemts: Jānis Bērziņš (Elektroinstalācija)', time: 'pirms 45 min', icon: '👥' },
    { id: 3, type: 'ai', text: 'AI aģents pabeidza rakstu: "Jumta seguma izmaksas 2026"', time: 'pirms 2h', icon: '🤖' },
    { id: 4, type: 'finance', text: 'Saņemts maksājums: 1 250 € (Projekts #442)', time: 'pirms 4h', icon: '💰' },
  ];

  return (
    <div className="calculator-pro-wrapper">
      {/* WELCOME HEADER */}
      <div className="calc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-accent" style={{ fontSize: '3.5rem', marginBottom: '5px' }}>
            Labrīt, Admin!
          </h1>
          <p style={{ fontSize: '1.2rem' }}>Warpala OS sistēma darbojas ar <strong>{stats.systemSync}%</strong> efektivitāti.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
          <Link to="/projects" className="btn-primary">JAUNS PROJEKTS</Link>
          <Link to="/ai-agent" className="btn-glass">AI PADOMNIEKS</Link>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '25px', marginTop: '50px' 
      }}>
        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '15px' }}>
            IEŅĒMUMI (MĒN)
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>
            {stats.revenue.toLocaleString()} €
          </div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '10px', fontWeight: 700 }}>
            ↑ +12.5% kopš pag. mēneša
          </div>
        </div>

        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '15px' }}>
            AKTĪVIE PROJEKTI
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>
            {stats.projects}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '10px', fontWeight: 700 }}>
            4 pabeigti šonedēļ
          </div>
        </div>

        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '15px' }}>
            JAUNI PIETEIKUMI
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>
            {stats.leads}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '10px', fontWeight: 700 }}>
            12 gaida atbildi
          </div>
        </div>

        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '15px' }}>
            AI UZDEVUMI
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>
            {stats.activeTasks}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', marginTop: '10px', fontWeight: 700 }}>
            Auto-marketing: Aktīvs
          </div>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="calc-grid" style={{ marginTop: '40px' }}>
        {/* LEFT: ACTIVITIES */}
        <div className="calc-form-column">
          <section className="calc-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>📊 Pēdējās aktivitātes</h2>
              <button className="btn-glass" style={{ fontSize: '0.7rem' }}>SKATĪT VISU</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {recentActivities.map(act => (
                <div key={act.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '20px', padding: '18px', 
                  background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)',
                  transition: 'all 0.2s'
                }} 
                className="activity-item"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                >
                  <div style={{ fontSize: '1.5rem', background: 'rgba(255,255,255,0.03)', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                    {act.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{act.text}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: SYSTEM HEALTH */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ top: '100px' }}>
            <h3 className="results-title">Sistēmas Statuss</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>CPU NOSLODZE</span>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 900 }}>OPTIMĀLA</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '24%', height: '100%', background: '#10b981' }}></div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>GPU RENDER (RTX_4080)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 900 }}>AKTĪVS</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: 'var(--accent-blue)' }}></div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>AI KAPACITĀTE</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 900 }}>HIGH-PRIORITY</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', background: 'var(--accent-purple)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ 
              marginTop: '30px', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', 
              border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '15px'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
              <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>VISI MEZGLI SINHRONIZĒTI</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
