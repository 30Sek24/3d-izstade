import '../../components/calculator/styles/CalculatorPro.css';

const UPCOMING_EVENTS = [
  { id: 1, title: 'BuildTech 2026: Product Launch', date: 'March 15, 14:00', type: 'Product Launch', host: 'Tesla Industrial', color: '#eab308' },
  { id: 2, title: 'AI for Business: Live Demo', date: 'March 18, 16:30', type: 'Live Demo', host: 'AI Core Systems', color: '#3b82f6' },
  { id: 3, title: 'Digital Art Auction: LIVE', date: 'March 20, 20:00', type: 'Live Event', host: 'Meta-Art Studio', color: '#8b5cf6' },
  { id: 4, title: 'B2B Growth: CEO Webinar', date: 'March 22, 10:00', type: 'Webinar', host: 'Warpala Accelerator', color: '#06b6d4' },
];

export default function EventsHub() {
  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header" style={{ marginBottom: '50px' }}>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3.5rem', fontWeight: 950 }}>
          WARPALA EXPO EVENTS HUB
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Product Launches, Live Demos & Webinars</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
        {UPCOMING_EVENTS.map(e => (
          <div key={e.id} className="glass-card" style={{ padding: '30px', borderLeft: `6px solid ${e.color}` }}>
            <div style={{ fontSize: '0.8rem', color: e.color, fontWeight: 900, marginBottom: '10px' }}>{e.type.toUpperCase()}</div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '15px' }}>{e.title}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#fff' }}>📅 {e.date}</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>By {e.host}</div>
              </div>
              <button className="btn-pro" style={{ background: e.color, color: '#000', padding: '10px 20px', fontSize: '0.8rem' }}>REGISTER</button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>• 540 people registered</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>• Available in 3D & VR</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '50px', padding: '40px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid #8b5cf6' }}>
        <h3 style={{ color: '#fff', marginBottom: '15px' }}>HOST YOUR OWN EVENT</h3>
        <p style={{ color: '#cbd5e1', marginBottom: '25px' }}>Access our 3D projector rooms and live stream infrastructure to reach thousands of B2B partners.</p>
        <button className="btn-pro" style={{ background: '#8b5cf6' }}>REQUEST EVENT SLOT</button>
      </div>
    </div>
  );
}
