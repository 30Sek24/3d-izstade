import '../../components/calculator/styles/CalculatorPro.css';

const SOS_SERVICES = [
  { id: 1, name: '24h Electrician', icon: '⚡', color: '#f59e0b', time: '15-30 min', price: 'from €50' },
  { id: 2, name: '24h Plumber', icon: '🔧', color: '#3b82f6', time: '20-45 min', price: 'from €45' },
  { id: 3, name: '24h Cleaning', icon: '🧹', color: '#06b6d4', time: '1-2 hours', price: 'from €30' },
  { id: 4, name: '24h Transport', icon: '🚛', color: '#f97316', time: '30-60 min', price: 'from €60' },
];

export default function UrgentServices() {
  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header" style={{ marginBottom: '50px' }}>
        <h1 style={{ color: '#ef4444', fontSize: '3.5rem', fontWeight: 950 }}>
          WARPALA URGENT SERVICES
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Direct access to 24/7 Professional Help</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {SOS_SERVICES.map(s => (
          <div key={s.id} className="glass-card" style={{ padding: '30px', borderTop: `4px solid ${s.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{s.icon}</div>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 10px 0' }}>{s.name}</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#10b981' }}>⏱️ {s.time}</span>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', color: s.color }}>💰 {s.price}</span>
            </div>
            <button className="btn-pro" style={{ background: '#ef4444', width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 950 }}>CALL NOW</button>
            <div style={{ marginTop: '15px', color: '#94a3b8', fontSize: '0.8rem' }}>• Fully Insured Professionals</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>• GPS Tracked Response</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '50px', padding: '40px', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed #ef4444' }}>
        <h3 style={{ color: '#fff', marginBottom: '15px' }}>ARE YOU A SERVICE PROVIDER?</h3>
        <p style={{ color: '#cbd5e1', marginBottom: '25px' }}>Join our SOS network and receive urgent leads directly in your area. Minimum response time requirements apply.</p>
        <button className="btn-pro" style={{ background: 'transparent', border: '2px solid #fff' }}>JOIN SOS NETWORK</button>
      </div>
    </div>
  );
}
