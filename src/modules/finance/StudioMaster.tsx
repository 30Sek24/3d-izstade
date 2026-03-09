import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

const TIER_DATA: any = {
  'standard': { name: 'Standard Studio', price: 'Free', features: ['8K Export', 'Basic AI', 'Warpala Hosting'] },
  'pro': { name: 'PRO Studio', price: '49 €/mo', features: ['16K Export', 'Unlimited AI', 'Custom Domain', 'Ads Network'] },
  'enterprise': { name: 'Enterprise', price: 'Custom', features: ['Full White-label', 'API Access', '24/7 Support'] }
};

export default function StudioMaster() {
  const [activeTier] = useState('pro');

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header">
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem' }}>
          Warpala Studio Ecosystem
        </h1>
        <p>Pārvaldi savu digitālo studiju un abonementus.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        {Object.entries(TIER_DATA).map(([key, val]: any) => (
          <div key={key} className="glass-card" style={{ padding: '30px', borderColor: activeTier === key ? '#8b5cf6' : '#1e293b' }}>
            <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 900 }}>{key.toUpperCase()}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#fff', marginTop: '5px' }}>{val.name}</div>
            <div style={{ fontSize: '1.5rem', color: '#8b5cf6', fontWeight: 800, margin: '15px 0' }}>{val.price}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
              {val.features.map((f: string, i: number) => <li key={i} style={{ marginBottom: '8px' }}>✅ {f}</li>)}
            </ul>
            <button className="btn-pro" style={{ width: '100%', background: activeTier === key ? '#8b5cf6' : 'transparent', border: activeTier === key ? 'none' : '1px solid #334155' }}>
              {activeTier === key ? 'CURRENT PLAN' : 'UPGRADE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
