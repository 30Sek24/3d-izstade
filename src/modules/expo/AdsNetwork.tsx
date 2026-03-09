import { useNavigate } from 'react-router-dom';
import '../../components/calculator/styles/CalculatorPro.css';

const ACTIVE_CAMPAIGNS = [
  { id: 1, title: 'Warpala OS Launch', impressions: '1.2M', clicks: '45K', ctr: '3.75%', budget: '€5,000' },
  { id: 2, title: 'Solar Panel Promo', impressions: '800K', clicks: '22K', ctr: '2.75%', budget: '€3,200' },
  { id: 3, title: 'AI Workshop Ads', impressions: '500K', clicks: '15K', ctr: '3.00%', budget: '€2,500' },
];

const AD_TYPES = [
  { id: 1, name: 'Featured Booth (3D)', price: '€200/mo', reach: 'High', description: 'Priority placement in the 3D City center.' },
  { id: 2, name: 'Homepage Banner (OS)', price: '€500/mo', reach: 'Maximum', description: 'Visible to all Warpala OS users upon login.' },
  { id: 3, name: 'Sector Leader Ad', price: '€150/mo', reach: 'Targeted', description: 'Top placement in specific districts (Transport, Cleaning, etc).' },
];

export default function AdsNetwork() {
  const nav = useNavigate();

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header" style={{ marginBottom: '50px' }}>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3.5rem', fontWeight: 950 }}>
          WARPALA ADS NETWORK
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Monetize your presence and scale globally (LV, SE, DE, USA)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '30px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '20px' }}>🎯 ADVERTISING SLOTS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {AD_TYPES.map(ad => (
              <div key={ad.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{ad.name}</span>
                  <span style={{ color: '#10b981', fontWeight: 900 }}>{ad.price}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ad.description}</div>
              </div>
            ))}
          </div>
          <button className="btn-pro" style={{ marginTop: '25px', width: '100%', background: '#10b981', color: '#000' }}>CREATE NEW CAMPAIGN</button>
        </div>

        <div className="glass-card" style={{ padding: '30px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '20px' }}>💼 WARPALA BUSINESS SUITE</h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '20px' }}>All booths include professional tools to manage your business (10-20% commission applies to marketplace sales).</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', textAlign: 'center', border: '1px solid #3b82f6' }}>
              <div style={{ fontSize: '1.5rem' }}>📊</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>ANALYTICS</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', textAlign: 'center', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '1.5rem' }}>📅</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>BOOKING</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', textAlign: 'center', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '1.5rem' }}>📄</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>INVOICING</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', textAlign: 'center', border: '1px solid #8b5cf6' }}>
              <div style={{ fontSize: '1.5rem' }}>🤝</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>CRM</div>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.2rem' }}>YOUR ACTIVE CAMPAIGNS</h3>
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>CAMPAIGN</th>
              <th style={{ padding: '15px' }}>IMPRESSIONS</th>
              <th style={{ padding: '15px' }}>CLICKS</th>
              <th style={{ padding: '15px' }}>CTR</th>
              <th style={{ padding: '15px' }}>BUDGET</th>
              <th style={{ padding: '15px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVE_CAMPAIGNS.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #1e293b' }}>
                <td style={{ padding: '15px' }}>{c.title}</td>
                <td style={{ padding: '15px' }}>{c.impressions}</td>
                <td style={{ padding: '15px' }}>{c.clicks}</td>
                <td style={{ padding: '15px' }}>{c.ctr}</td>
                <td style={{ padding: '15px' }}>{c.budget}</td>
                <td style={{ padding: '15px' }}><span style={{ color: '#10b981' }}>● ACTIVE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => nav('/expo-3d')} style={{ marginTop: '20px' }}>Back</button>
    </div>
  );
}
