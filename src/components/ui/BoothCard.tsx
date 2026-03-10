export const BoothCard = ({ booth, analytics }: { booth: any, analytics?: any }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    overflow: 'hidden'
  }}>
    <div style={{ height: '120px', background: 'linear-gradient(45deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '3rem' }}>{booth.logo ? '🏛️' : '🏗️'}</span>
    </div>
    <div style={{ padding: '20px' }}>
      <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>{booth.company_name}</h3>
      <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '0.85rem' }}>{booth.district?.toUpperCase() || 'GENERAL'}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>VISITS</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{analytics?.visits || 0}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>LEADS</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{analytics?.leads_generated || 0}</div>
        </div>
      </div>
    </div>
  </div>
);
