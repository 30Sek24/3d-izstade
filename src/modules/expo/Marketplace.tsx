import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Industrial Drill PRO', price: '€299', category: 'Construction', company: 'BuildMaster', image: 'https://images.unsplash.com/photo-1504148454958-ef9b0684784e?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Eco-Cleaning Kit', price: '€45', category: 'Cleaning', company: 'GreenClean', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: '8K Render Station', price: '€4,500', category: 'Tech', company: 'RenderMax', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Organic Food Pack', price: '€80', category: 'Food', company: 'BioFarm', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80' },
];

export default function Marketplace() {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Construction', 'Transport', 'Cleaning', 'Renovation', 'Tech', 'Consulting'];

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header" style={{ marginBottom: '50px' }}>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3.5rem', fontWeight: 950 }}>
          WARPALA EXPO MARKETPLACE
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Secure B2B Transactions (10-20% platform commission)</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {categories.map(c => (
          <button 
            key={c} 
            onClick={() => setFilter(c)}
            style={{ 
              padding: '10px 20px', 
              background: filter === c ? '#3b82f6' : 'rgba(255,255,255,0.05)', 
              border: 'none', 
              borderRadius: '8px', 
              color: '#fff', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        {MOCK_PRODUCTS.filter(p => filter === 'All' || p.category === filter).map(p => (
          <div key={p.id} className="glass-card" style={{ overflow: 'hidden', transition: 'transform 0.3s' }}>
            <img src={p.image} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt={p.name} />
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 900, marginBottom: '5px' }}>{p.category.toUpperCase()}</div>
              <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>{p.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 950, color: '#10b981' }}>{p.price}</span>
                <button className="btn-pro" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>BUY NOW</button>
              </div>
              <div style={{ marginTop: '15px', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                By {p.company}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
