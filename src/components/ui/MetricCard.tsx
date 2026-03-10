export const MetricCard = ({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }}>
    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>{value}</p>
    {subtitle && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{subtitle}</span>}
  </div>
);
