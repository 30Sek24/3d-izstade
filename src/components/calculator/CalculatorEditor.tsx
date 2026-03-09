import { useState, useMemo } from 'react';
import { 
  OBJECT_TYPES, LOCATION_OPTIONS, QUALITY_LEVELS, MODULES,
  calculateEstimate 
} from '../../core/calculator';
import type { CalculatorInput } from '../../core/calculator';
import './styles/CalculatorPro.css';

interface Props {
  initialModule?: typeof MODULES[number];
}

export default function CalculatorEditor({ initialModule = 'renovation' }: Props) {
  const [mode, setMode] = useState<'client' | 'agent'>('client');
  const [input, setInput] = useState<CalculatorInput>({
    mode: 'client',
    module: initialModule,
    fullName: '',
    email: '',
    phone: '',
    objectType: initialModule === 'autoservice' ? 'automasina' : 'dzivoklis',
    location: 'riga_rajoni',
    repairType: 'eiro',
    qualityLevel: 'standarta',
    complexityLevel: 'standarta',
    accessLevel: 'erti',
    deadlineLevel: 'standarta',
    floorAreaM2: 50,
    roomsCount: 2,
    doorCount: 3,
    windowCount: 2,
  });

  const estimate = useMemo(() => calculateEstimate({ ...input, mode }), [input, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="calc-editor-container">
      {/* MODE SELECTOR */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#f1f5f9', padding: '5px', borderRadius: '12px', width: 'fit-content' }}>
        <button 
          onClick={() => setMode('client')}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: mode === 'client' ? '#fff' : 'transparent', boxShadow: mode === 'client' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', fontWeight: 700, cursor: 'pointer' }}
        >
          KLIENTA REŽĪMS
        </button>
        <button 
          onClick={() => setMode('agent')}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: mode === 'agent' ? '#3b82f6' : 'transparent', color: mode === 'agent' ? '#fff' : '#64748b', fontWeight: 700, cursor: 'pointer' }}
        >
          AĢENTA REŽĪMS 🔓
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        {/* INPUTS */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '30px' }}>PROJEKTA PARAMETRI</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label className="field-label">
              Vārds Uzvārds
              <input type="text" name="fullName" value={input.fullName} onChange={handleInputChange} placeholder="Jānis Bērziņš" className="calc-input" />
            </label>
            <label className="field-label">
              E-pasts
              <input type="email" name="email" value={input.email} onChange={handleInputChange} placeholder="janis@piemērs.lv" className="calc-input" />
            </label>
            
            <label className="field-label">
              Objekta tips
              <select name="objectType" value={input.objectType} onChange={handleInputChange} className="calc-input">
                {OBJECT_TYPES.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
              </select>
            </label>
            
            <label className="field-label">
              Lokācija
              <select name="location" value={input.location} onChange={handleInputChange} className="calc-input">
                {LOCATION_OPTIONS.map(l => <option key={l} value={l}>{l.replace('_', ' ').toUpperCase()}</option>)}
              </select>
            </label>

            <label className="field-label">
              Remonta kvalitāte
              <select name="qualityLevel" value={input.qualityLevel} onChange={handleInputChange} className="calc-input">
                {QUALITY_LEVELS.map(q => <option key={q} value={q}>{q.toUpperCase()}</option>)}
              </select>
            </label>

            <label className="field-label">
              Platība (m²)
              <input type="number" name="floorAreaM2" value={input.floorAreaM2} onChange={handleInputChange} className="calc-input" />
            </label>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>SADALĪJUMS PA POZĪCIJĀM</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>
                  <th style={{ padding: '10px' }}>POZĪCIJA</th>
                  <th style={{ padding: '10px' }}>DAUDZUMS</th>
                  {mode === 'agent' && <th style={{ padding: '10px' }}>PAŠIZMAKSA</th>}
                  <th style={{ padding: '10px' }}>KLIENTA CENA</th>
                </tr>
              </thead>
              <tbody>
                {estimate?.lineItems.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '15px 10px', fontWeight: 600 }}>{item.position}</td>
                    <td style={{ padding: '15px 10px' }}>{item.quantity} {item.unit}</td>
                    {mode === 'agent' && <td style={{ padding: '15px 10px', color: '#ef4444' }}>{item.costPrice.toFixed(2)} €</td>}
                    <td style={{ padding: '15px 10px', fontWeight: 700, color: '#0f172a' }}>{item.unitPrice.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY SIDEBAR */}
        <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
          <div style={{ background: '#0f172a', padding: '30px', borderRadius: '24px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '20px', letterSpacing: '1px' }}>KOPSAVILKUMS</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Tāmes kopsumma:</span>
              <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>{estimate?.totalEstimate.toFixed(2)} €</span>
            </div>

            {mode === 'agent' && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '10px' }}>
                  <span>Pašizmaksa:</span>
                  <span>{estimate?.totalCost.toFixed(2)} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 800 }}>
                  <span>TĪRĀ PEĻŅA:</span>
                  <span>{estimate?.totalProfit.toFixed(2)} €</span>
                </div>
              </div>
            )}

            <button style={{ width: '100%', marginTop: '30px', padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
              ĢENERĒT PDF TĀMI
            </button>
            <button style={{ width: '100%', marginTop: '10px', padding: '15px', background: 'transparent', color: '#94a3b8', border: '1px solid #1e293b', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
              SAGLABĀT PROJEKTU
            </button>
          </div>
          
          <div style={{ marginTop: '20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '20px', borderRadius: '24px', color: '#fff' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>💡 PADOMS AĢENTAM:</p>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              Šobrīd tirgus peļņas norma ir 20-30%. Ja vēlaties palielināt peļņu, iesakiet klientam premium materiālus.
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        .calc-input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 8px; font-weight: 600; }
        .field-label { font-size: 0.85rem; font-weight: 700; color: #64748b; }
      `}</style>
    </div>
  );
}
