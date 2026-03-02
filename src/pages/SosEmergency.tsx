import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';

const EMERGENCY_SERVICES = [
  { id: 'jumts', name: 'Jumta bojājums (Norauts/Tek)', price: 'No 150 € / izsaukums', color: '#ef4444', icon: '🌪️' },
  { id: 'santehnika', name: 'Santehnikas avārija (Plīsums/Plūdi)', price: 'No 120 € / izsaukums', color: '#3b82f6', icon: '💧' },
  { id: 'apkure', name: 'Apkures sistēmas bojājums (Auksts)', price: 'No 140 € / izsaukums', color: '#ea580c', icon: '❄️' },
  { id: 'elektriba', name: 'Elektrības traucējumi (Nav gaismas)', price: 'No 100 € / izsaukums', color: '#eab308', icon: '⚡' },
  { id: 'atslegas', name: 'Slēdzeņu avārija (Aizcirtušās durvis)', price: 'No 90 € / izsaukums', color: '#8b5cf6', icon: '🔑' },
];

export default function SosEmergency() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#ef4444' }}>🚨 24/7 AVĀRIJAS DIENESTS</h1>
        <p>Neatliekama palīdzība jebkurai krīzes situācijai tavā īpašumā. Mēs reaģējam nekavējoties.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        {EMERGENCY_SERVICES.map(service => (
          <div 
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            style={{ 
              background: selectedService === service.id ? '#fef2f2' : '#fff', 
              border: `2px solid ${selectedService === service.id ? service.color : '#e2e8f0'}`,
              borderRadius: '16px', padding: '30px', cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedService === service.id ? `0 10px 30px ${service.color}33` : '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{service.icon}</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#0f172a' }}>{service.name}</h3>
            <p style={{ color: '#64748b', fontWeight: 'bold' }}>{service.price}</p>
          </div>
        ))}
      </div>

      {selectedService && (
        <div style={{ marginTop: '40px', background: '#0f172a', padding: '40px', borderRadius: '16px', color: '#fff', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', margin: '0 0 15px 0' }}>Izsaukt Meistaru Nekavējoties!</h2>
          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '30px' }}>Mūsu dežurants sazināsies ar Jums 5 minūšu laikā.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <input type="text" placeholder="Jūsu Telefona Numurs" style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', width: '300px' }} />
            <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0 40px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}>
              SAUKT PALĪDZĪBU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}