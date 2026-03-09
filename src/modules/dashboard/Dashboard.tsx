import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function Dashboard() {
  const [stats] = useState({ revenue: 12450, projects: 12, leads: 45 });

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header">
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem' }}>
          Tavs Warpala OS Panelis
        </h1>
        <p>Pārskats par tavu biznesu un aktivitātēm.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>KOPĒJIE IEŅĒMUMI</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#10b981' }}>{stats.revenue.toLocaleString()} €</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>AKTĪVIE PROJEKTI</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#3b82f6' }}>{stats.projects}</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>JAUNI LEADS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#f59e0b' }}>{stats.leads}</div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }} className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section">
            <h2>Pēdējās aktivitātes</h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              <div style={{ padding: '15px 0', borderBottom: '1px solid #1e293b' }}>✅ Jauna tāme izveidota: "Vannas istabas remonts"</div>
              <div style={{ padding: '15px 0', borderBottom: '1px solid #1e293b' }}>📈 Lead saņemts: Jānis Bērziņš (Elektroinstalācija)</div>
              <div style={{ padding: '15px 0', borderBottom: '1px solid #1e293b' }}>🤖 AI aģents pabeidza rakstu: "Jumta seguma izmaksas 2026"</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
