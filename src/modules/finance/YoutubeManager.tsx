import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

const MOCK_VIDEOS = [
  { id: 1, title: 'Deep Space 16K Meditation', views: '1.2M', revenue: '450 €', status: 'Published' },
  { id: 2, title: 'Cyberpunk Neon Loops', views: '800K', revenue: '220 €', status: 'Processing' },
  { id: 3, title: 'Forest River 8K', views: '50K', revenue: '15 €', status: 'Published' },
];

export default function YoutubeManager() {
  const [stats] = useState({ totalViews: '2.05M', estimatedAdSense: '685 €' });

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header">
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem' }}>
          YouTube Revenue Hub
        </h1>
        <p>Pārvaldi savu saturu un mērogo ieņēmumus.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', borderColor: '#ef4444' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>TOTAL VIEWS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff' }}>{stats.totalViews}</div>
        </div>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', borderColor: '#10b981' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 900 }}>ADSENSE REVENUE</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#10b981' }}>{stats.estimatedAdSense}</div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }} className="calc-section">
        <h2>Tavi Video</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {MOCK_VIDEOS.map(v => (
            <div key={v.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#fff' }}>{v.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Views: {v.views} | Revenue: {v.revenue}</div>
              </div>
              <span style={{ color: v.status === 'Published' ? '#10b981' : '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>{v.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
