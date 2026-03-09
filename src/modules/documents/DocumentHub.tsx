import '../../components/calculator/styles/CalculatorPro.css';

const MOCK_DOCS = [
  { id: 1, name: 'Tāme_Jumts_Bērziņš.pdf', type: 'Estimate', date: '2026-03-08', size: '1.2 MB', status: 'signed' },
  { id: 2, name: 'Rēķins_2026_001.pdf', type: 'Invoice', date: '2026-03-07', size: '450 KB', status: 'pending' },
  { id: 3, name: 'Projekts_Vannasistaba_v2.dwg', type: 'Blueprint', date: '2026-03-05', size: '12.5 MB', status: 'draft' },
  { id: 4, name: 'Līgums_SIA_KokaMajas.pdf', type: 'Contract', date: '2026-03-01', size: '2.1 MB', status: 'signed' },
  { id: 5, name: 'Tāme_Apkure_Logistics.pdf', type: 'Estimate', date: '2026-02-28', size: '1.4 MB', status: 'archived' },
];

export default function DocumentHub() {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'signed': return <span style={{ color: '#10b981' }}>● Parakstīts</span>;
      case 'pending': return <span style={{ color: '#f59e0b' }}>● Gaida apmaksu</span>;
      case 'draft': return <span style={{ color: '#3b82f6' }}>● Melnraksts</span>;
      default: return <span style={{ color: '#94a3b8' }}>● Arhivēts</span>;
    }
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-accent">Dokumentu Centrs</h1>
          <p>Visas tāmes, līgumi un rēķini drošā mākoņkrātuvē.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-glass">SKENĒT</button>
          <button className="btn-primary">+ AUGŠUPIELĀDĒT</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '40px 0' }}>
        {['All', 'Estimates', 'Invoices', 'Contracts', 'Blueprints'].map(cat => (
          <div key={cat} className="glass-card" style={{ padding: '20px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              {cat === 'All' ? '📂' : cat === 'Estimates' ? '📊' : cat === 'Invoices' ? '💰' : cat === 'Contracts' ? '✍️' : '📐'}
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{cat.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="results-table" style={{ margin: 0 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '20px' }}>NOSAUKUMS</th>
              <th>TIPS</th>
              <th>DATUMS</th>
              <th>IZMĒRS</th>
              <th>STATUSS</th>
              <th style={{ textAlign: 'right', padding: '20px' }}>DARBĪBAS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DOCS.map(doc => (
              <tr key={doc.id} className="activity-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '1.2rem' }}>📄</div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{doc.name}</div>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{doc.type}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{doc.date}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{doc.size}</td>
                <td style={{ fontSize: '0.75rem', fontWeight: 800 }}>{getStatusIcon(doc.status)}</td>
                <td style={{ textAlign: 'right', padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn-glass" style={{ padding: '8px' }}>👁️</button>
                    <button className="btn-glass" style={{ padding: '8px' }}>📥</button>
                    <button className="btn-glass" style={{ padding: '8px', color: '#f43f5e' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
