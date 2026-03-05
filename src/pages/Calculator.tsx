import { useState } from 'react';
import CalculatorEditor from '../components/calculator/CalculatorEditor';
import { MODULES } from '../lib/calculator';

const CATEGORIES = [
  { id: 'renovation', title: 'MĀJOKĻA REMONTS', icon: '🏠', desc: 'Dzīvokļu un māju atjaunošana' },
  { id: 'autoservice', title: 'AUTO SERVISS', icon: '🚗', desc: 'Remonts un tehniskā apkope' },
  { id: 'marketing', title: 'BIZNESA PAKALPOJUMI', icon: '📈', desc: 'Mārketings un aģenta serviss' },
  { id: 'real_estate', title: 'NĪ INVESTĪCIJAS', icon: '🏢', desc: 'Īpašumu novērtēšana un peļņa' },
];

export default function Calculator() {
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[number] | null>(null);

  if (selectedModule) {
    return (
      <div style={{ padding: '20px' }}>
        <button 
          onClick={() => setSelectedModule(null)}
          style={{ marginBottom: '20px', padding: '10px 20px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          ← Atpakaļ uz izvēlni
        </button>
        <CalculatorEditor initialModule={selectedModule} />
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '10px', letterSpacing: '-2px' }}>
        PROFESIONĀLIE <span style={{ color: '#3b82f6' }}>KALKULATORI</span>
      </h1>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.2rem', marginBottom: '60px' }}>
        Izvēlieties nozari, lai veiktu precīzu aprēķinu un sagatavotu profesionālu tāmi.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {CATEGORIES.map(cat => (
          <div 
            key={cat.id}
            onClick={() => setSelectedModule(cat.id as any)}
            style={{ 
              background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{cat.icon}</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>{cat.title}</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
