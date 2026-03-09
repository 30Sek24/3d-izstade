import { useState, useMemo } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { calculateCost } from '../../core/costEngine';

interface MaterialItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface LabourItem {
  id: string;
  name: string;
  hours: number;
  hourRate: number;
}

interface Room {
  id: string;
  name: string;
  materials: MaterialItem[];
  labour: LabourItem[];
}

export default function ProjectBuilder() {
  const [projectTitle, setProjectTitle] = useState('Jauns Projekts');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const simulatedRooms: Room[] = [
        { 
          id: 'ai-r1', 
          name: 'Main Area (AI Gen)', 
          materials: [{ id: 'm1', name: 'Premium Materials Package', qty: 1, price: 2500 }],
          labour: [{ id: 'l1', name: 'Standard Installation', hours: 40, hourRate: 25 }]
        },
        { 
          id: 'ai-r2', 
          name: 'Technical Zone (AI Gen)', 
          materials: [{ id: 'm2', name: 'Electrical & Plumbing Kit', qty: 1, price: 1200 }],
          labour: [{ id: 'l2', name: 'Specialist Work', hours: 20, hourRate: 35 }]
        }
      ];

      setRooms(simulatedRooms);
      setProjectTitle(`AI ESTIMATE: ${aiPrompt}`);
    } catch (err) {
      alert("AI Engine Error. Please try again.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const addRoom = () => {
    const newRoom: Room = { id: Math.random().toString(), name: 'Jauna Telpa', materials: [], labour: [] };
    setRooms([...rooms, newRoom]);
  };

  const addItem = (roomId: string, type: 'material' | 'labour') => {
    const newRooms = rooms.map(r => {
      if (r.id === roomId) {
        if (type === 'material') {
          return { ...r, materials: [...r.materials, { id: Math.random().toString(), name: 'Materiāls', qty: 1, price: 0 }] };
        } else {
          return { ...r, labour: [...r.labour, { id: Math.random().toString(), name: 'Speciālists', hours: 1, hourRate: 0 }] };
        }
      }
      return r;
    });
    setRooms(newRooms);
  };

  const updateItem = (roomId: string, itemId: string, type: 'material' | 'labour', field: string, value: any) => {
    const newRooms = rooms.map(r => {
      if (r.id === roomId) {
        if (type === 'material') {
          return { ...r, materials: r.materials.map(i => i.id === itemId ? { ...i, [field]: value } : i) };
        } else {
          return { ...r, labour: r.labour.map(i => i.id === itemId ? { ...i, [field]: value } : i) };
        }
      }
      return r;
    });
    setRooms(newRooms);
  };

  const totals = useMemo(() => {
    let allMaterials: any[] = [];
    let allLabour: any[] = [];
    if (rooms && Array.isArray(rooms)) {
      rooms.forEach(r => {
        if (r.materials) allMaterials = [...allMaterials, ...r.materials.map(m => ({ price: m.price || 0, quantity: m.qty || 0 }))];
        if (r.labour) allLabour = [...allLabour, ...r.labour.map(l => ({ hourRate: l.hourRate || 0, hours: l.hours || 0 }))];
      });
    }
    return calculateCost(allMaterials, allLabour);
  }, [rooms]);

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <input 
          value={projectTitle} 
          onChange={e => setProjectTitle(e.target.value)}
          style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #3b82f6', color: '#fff', fontSize: '2.5rem', fontWeight: 950, textAlign: 'center', width: '100%', marginBottom: '10px' }}
        />
        <p>Warpala AI Construction OS | Smart Project Builder</p>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            value={aiPrompt} 
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Piemēram: 'Renovate 70m2 apartment' vai 'Build terrace 30m2'..."
            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid #334155', color: '#fff', padding: '15px', borderRadius: '8px', fontSize: '1rem' }}
          />
          <button 
            onClick={handleAiGenerate} 
            disabled={isAiGenerating || !aiPrompt}
            style={{ padding: '0 30px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}
          >
            {isAiGenerating ? 'AI GENERATING...' : '✨ AI ONE-CLICK'}
          </button>
        </div>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <button onClick={addRoom} className="btn-pro" style={{ width: '100%', marginBottom: '30px', background: '#334155' }}>+ MANUĀLI PIEVIENOT TELPU</button>
          
          {rooms.map(room => (
            <section key={room.id} className="calc-section" style={{ borderLeftColor: '#3b82f6', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <input 
                  value={room.name} 
                  onChange={e => {
                    const newRooms = rooms.map(r => r.id === room.id ? { ...r, name: e.target.value } : r);
                    setRooms(newRooms);
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}
                />
                <button onClick={() => setRooms(rooms.filter(r => r.id !== room.id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Dzēst</button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', marginBottom: '10px' }}>📦 MATERIĀLI</div>
                {room.materials.map(m => (
                  <div key={m.id} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <input value={m.name} style={{ flex: 2 }} onChange={e => updateItem(room.id, m.id, 'material', 'name', e.target.value)} />
                    <input type="number" style={{ flex: 1 }} value={m.qty} onChange={e => updateItem(room.id, m.id, 'material', 'qty', parseFloat(e.target.value) || 0)} />
                    <input type="number" style={{ flex: 1 }} value={m.price} onChange={e => updateItem(room.id, m.id, 'material', 'price', parseFloat(e.target.value) || 0)} />
                  </div>
                ))}
                <button onClick={() => addItem(room.id, 'material')} style={{ padding: '5px 15px', background: 'rgba(255,255,255,0.05)', color: '#aaa', border: '1px dashed #444', cursor: 'pointer', marginTop: '10px' }}>+ Materiāls</button>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', marginBottom: '10px' }}>👷 DARBS</div>
                {room.labour.map(l => (
                  <div key={l.id} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <input value={l.name} style={{ flex: 2 }} onChange={e => updateItem(room.id, l.id, 'labour', 'name', e.target.value)} />
                    <input type="number" style={{ flex: 1 }} value={l.hours} onChange={e => updateItem(room.id, l.id, 'labour', 'hours', parseFloat(e.target.value) || 0)} />
                    <input type="number" style={{ flex: 1 }} value={l.hourRate} onChange={e => updateItem(room.id, l.id, 'labour', 'hourRate', parseFloat(e.target.value) || 0)} />
                  </div>
                ))}
                <button onClick={() => addItem(room.id, 'labour')} style={{ padding: '5px 15px', background: 'rgba(255,255,255,0.05)', color: '#aaa', border: '1px dashed #444', cursor: 'pointer', marginTop: '10px' }}>+ Darbs</button>
              </div>
            </section>
          ))}
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Tāmes Kopsavilkums</h3>
            <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)' }}>
              <span className="gt-label">Kopējā Summa</span>
              <span className="gt-value">{totals.total.toLocaleString()} €</span>
            </div>

            <div className="glass-card" style={{ marginTop: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Materiāli:</span>
                <strong>{totals.materialCost.toLocaleString()} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Darba spēks:</span>
                <strong>{totals.labourCost.toLocaleString()} €</strong>
              </div>
            </div>

            <button className="btn-pro" style={{ width: '100%', marginTop: '30px', background: '#10b981' }}>SAGLABĀT PROFILĀ</button>
            <p style={{ fontSize: '0.6rem', color: '#666', textAlign: 'center', marginTop: '15px' }}>Generated with Warpala AI Construction OS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
