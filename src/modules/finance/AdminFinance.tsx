import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function AdminFinance() {
  const [platformRevenue] = useState(84500);
  const [activeArtists] = useState(142);
  const [aiGenerations] = useState(1240);

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header">
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem' }}>
          Platformas Finanšu Centrs
        </h1>
        <p>Reāllaika dati par Warpala OS ekosistēmu.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', borderColor: '#10b981' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>KOPĒJIE IEŅĒMUMI</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#10b981' }}>{platformRevenue.toLocaleString()} €</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', borderColor: '#8b5cf6' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>AKTĪVIE MĀKSLINIEKI</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#8b5cf6' }}>{activeArtists}</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', borderColor: '#3b82f6' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>AI ĢENERĀCIJAS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#3b82f6' }}>{aiGenerations}</div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }} className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section">
            <h2>Pēdējie darījumi</h2>
            <table style={{ width: '100%', color: '#cbd5e1', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '10px' }}>Datums</th>
                  <th style={{ padding: '10px' }}>Veids</th>
                  <th style={{ padding: '10px' }}>Summa</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px' }}>08.03.2026</td>
                  <td style={{ padding: '10px' }}>AI Video Generation</td>
                  <td style={{ padding: '10px', color: '#10b981' }}>+ 2.00 €</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px' }}>08.03.2026</td>
                  <td style={{ padding: '10px' }}>Artist Commission</td>
                  <td style={{ padding: '10px', color: '#10b981' }}>+ 45.00 €</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
