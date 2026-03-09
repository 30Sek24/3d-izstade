import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function AdminFinance() {
  const [stats] = useState({
    totalRevenue: 142500,
    monthlyProfit: 32400,
    activeSubscribers: 1240,
    pendingInvoices: 8
  });

  const transactions = [
    { id: 1, date: '2026-03-09', desc: 'Abonementa apmaksa: Premium Plan', amount: 149.00, status: 'completed', type: 'in' },
    { id: 2, date: '2026-03-09', desc: 'AI API Noslodze (OpenAI)', amount: -42.50, status: 'completed', type: 'out' },
    { id: 3, date: '2026-03-08', desc: 'Projekta #442 starpmaksājums', amount: 2500.00, status: 'completed', type: 'in' },
    { id: 4, date: '2026-03-08', desc: 'Serveru īre (AWS/RTX Node)', amount: -850.00, status: 'completed', type: 'out' },
    { id: 5, date: '2026-03-07', desc: 'Komisija: Jānis Bērziņš (Roof)', amount: 450.00, status: 'pending', type: 'in' },
  ];

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-accent" style={{ color: '#10b981' }}>Finanšu Vadība</h1>
          <p>Reāllaika naudas plūsmas un platformas peļņas analītika.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-glass">RĒĶINU ARHĪVS</button>
          <button className="btn-primary" style={{ background: '#10b981' }}>+ JAUNS RĒĶINS</button>
        </div>
      </div>

      {/* TOP STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginTop: '40px' }}>
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '10px' }}>KOPĒJĀ APGROZĪJUMS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff' }}>{stats.totalRevenue.toLocaleString()} €</div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>↑ +18% vs pag. gads</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '10px' }}>TĪRĀ PEĻŅA (MĒN)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#10b981' }}>{stats.monthlyProfit.toLocaleString()} €</div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>Marža: 22.8%</div>
        </div>
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '10px' }}>AKTĪVIE KLIENTI</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff' }}>{stats.activeSubscribers}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', marginTop: '10px' }}>LTV: 1,240 €</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '10px' }}>NEAPMAKSĀTI RĒĶINI</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#f59e0b' }}>{stats.pendingInvoices}</div>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '10px' }}>Kopā: 4,250 €</div>
        </div>
      </div>

      <div className="calc-grid" style={{ marginTop: '40px' }}>
        {/* TRANSACTIONS */}
        <div className="calc-form-column">
          <section className="calc-section">
            <h2 style={{ marginBottom: '25px' }}>📈 Pēdējie darījumi</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {transactions.map(tx => (
                <div key={tx.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '15px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      background: tx.type === 'in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: tx.type === 'in' ? '#10b981' : '#f43f5e', fontSize: '1.2rem'
                    }}>
                      {tx.type === 'in' ? '↙' : '↗'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{tx.desc}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tx.date} • {tx.status.toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 900, 
                    color: tx.type === 'in' ? '#10b981' : '#f43f5e',
                    fontSize: '1.1rem'
                  }}>
                    {tx.type === 'in' ? '+' : ''} {tx.amount.toLocaleString()} €
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* EXPENSE BREAKDOWN */}
        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Izdevumu Sadalījums</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'AI & Infrastruktūra', val: 45, color: 'var(--accent-purple)' },
                { label: 'Marketinga kampaņas', val: 25, color: 'var(--accent-blue)' },
                { label: 'Administratīvie', val: 15, color: '#64748b' },
                { label: 'Rezerves fonds', val: 15, color: '#10b981' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{item.label}</span>
                    <span style={{ fontWeight: 800 }}>{item.val}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.val}%`, height: '100%', background: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              marginTop: '40px', padding: '25px', borderRadius: '20px', 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 900, marginBottom: '10px' }}>NODOKĻU PROGNOZE (Q1)</div>
              <div style={{ fontSize: '2rem', fontWeight: 950, color: '#fff' }}>12,450.00 €</div>
              <button className="btn-glass" style={{ marginTop: '15px', width: '100%', fontSize: '0.75rem' }}>EKSPORTĒT ATSKAITI EDS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
