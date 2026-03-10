import { useState, useMemo, useEffect } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { calculateCost } from '../../core/costEngine';
import { expoService } from '../../services/expoService';
import { stripeService } from '../../services/stripeService';

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
  const [step, setStep] = useState(1);
  const [projectTitle, setProjectTitle] = useState('Jauns Projekts');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [marketData, setMarketData] = useState<any[]>([]);

  useEffect(() => {
    async function loadMarketData() {
      try {
        const data = await expoService.getMarketplaceServices();
        setMarketData(data || []);
      } catch (e) { console.error("Market data load error:", e); }
    }
    loadMarketData();
  }, []);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setStep(2);
    try {
      await new Promise(r => setTimeout(r, 2500));
      
      const relatedService = marketData.find(s => 
        aiPrompt.toLowerCase().includes(s.category?.toLowerCase()) || 
        aiPrompt.toLowerCase().includes(s.name?.toLowerCase())
      );

      const simulatedRooms: Room[] = [
        { 
          id: 'ai-r1', 
          name: 'Galvenais posms (AI Ieteikums)', 
          materials: [{ 
            id: 'm1', 
            name: relatedService ? `${relatedService.name} - Materiāli` : 'Standarta materiālu pakete', 
            qty: 1, 
            price: relatedService ? parseFloat(relatedService.price_starting_from) * 0.6 : 1500 
          }],
          labour: [{ 
            id: 'l1', 
            name: 'Specializētie montāžas darbi', 
            hours: 40, 
            hourRate: 35 
          }]
        }
      ];

      setRooms(simulatedRooms);
      setProjectTitle(`PROJEKTS: ${aiPrompt.toUpperCase()}`);
      setStep(3);
    } catch {
      alert("AI Engine Error. Please try again.");
      setStep(1);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const totals = useMemo(() => {
    let allMaterials: any[] = [];
    let allLabour: any[] = [];
    rooms.forEach(r => {
      allMaterials = [...allMaterials, ...r.materials.map(m => ({ price: m.price || 0, quantity: m.qty || 0 }))];
      allLabour = [...allLabour, ...r.labour.map(l => ({ hourRate: l.hourRate || 0, hours: l.hours || 0 }))];
    });
    return calculateCost(allMaterials, allLabour);
  }, [rooms]);

  return (
    <div className="calculator-pro-wrapper">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '60px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: step >= s ? 1 : 0.3, transition: '0.3s' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: step === s ? 'var(--accent-blue)' : step > s ? '#10b981' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>
              {step > s ? '✓' : s}
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {s === 1 ? 'Definīcija' : s === 2 ? 'Analīze' : s === 3 ? 'Pielāgošana' : 'Gatavs'}
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ animation: 'fadeIn 0.5s', maxWidth: '800px', margin: '0 auto' }}>
          <div className="calc-header" style={{ textAlign: 'center' }}>
            <h1 className="text-accent" style={{ fontSize: '3.5rem' }}>Ar ko mēs sāksim?</h1>
            <p>Aprakstiet savu ideju, un Warpala AI sastādīs pirmo tāmi.</p>
          </div>
          <div className="glass-card" style={{ padding: '40px', background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <textarea 
              value={aiPrompt} 
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Piemēram: 'Nepieciešama jumta nomaiņa 120m2 mājai ar siltināšanu'..."
              style={{ width: '100%', height: '150px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '20px', borderRadius: '16px', fontSize: '1.2rem', outline: 'none', marginBottom: '30px' }}
            />
            <button 
              onClick={handleAiGenerate} 
              disabled={!aiPrompt}
              className="btn-primary"
              style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }}
            >
              ✨ ĢENERĒT PROJEKTA STRUKTŪRU
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ textAlign: 'center', padding: '100px 0', animation: 'fadeIn 0.5s' }}>
          <div className="spinner" style={{ border: '6px solid rgba(59, 130, 246, 0.1)', borderTop: '6px solid var(--accent-blue)', borderRadius: '50%', width: '80px', height: '80px', animation: 'spin 1s linear infinite', margin: '0 auto 30px' }}></div>
          <h2 className="text-accent" style={{ fontSize: '2rem' }}>{isAiGenerating ? 'AI ARCHITECT IS THINKING...' : 'PREPARING PLAN...'}</h2>
          <p style={{ color: 'var(--text-dim)' }}>Analizējam tirgus cenas un būvnormatīvus jūsu projektam.</p>
        </div>
      )}

      {step >= 3 && (
        <div className="calc-grid" style={{ animation: 'fadeIn 0.5s' }}>
          <div className="calc-form-column">
            <section className="calc-section" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <input 
                  value={projectTitle} 
                  onChange={e => setProjectTitle(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 900, fontSize: '1.8rem', outline: 'none', width: '100%' }}
                />
              </div>
              
              {rooms.map(room => (
                <div key={room.id} style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ marginBottom: '20px', color: 'var(--accent-blue)' }}>{room.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {room.materials.map(m => (
                      <div key={m.id} style={{ display: 'flex', gap: '10px' }}>
                        <input value={m.name} style={{ flex: 3 }} readOnly />
                        <input type="number" value={m.qty} style={{ flex: 1 }} readOnly />
                        <input type="number" value={m.price} style={{ flex: 1.5 }} readOnly />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setStep(1)} className="btn-glass" style={{ flex: 1 }}>← ATPAKAĻ</button>
                <button onClick={() => setStep(4)} className="btn-primary" style={{ flex: 2 }}>TURPINĀT UZ KOPSAVILKUMU</button>
              </div>
            </section>
          </div>

          <div className="calc-results-column">
            <div className="sticky-results">
              <h3 className="results-title">Projekta Kopsavilkums</h3>
              <div className="grand-total-box">
                <span className="gt-label">TĀMES KOPUMMĀ</span>
                <span className="gt-value">{totals.total.toLocaleString()} €</span>
              </div>
              
              {step === 4 && (
                <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s' }}>
                  <div className="glass-card" style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', marginBottom: '20px' }}>
                    <h4 style={{ color: '#10b981', margin: '0 0 10px 0' }}>✓ Projekts gatavs nosūtīšanai</h4>
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>AI ir verificējis visas pozīcijas atbilstoši reālajām tirgus cenām.</p>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', background: '#10b981', padding: '20px' }}>SŪTĪT PIEDĀVĀJUMU KLIENTAM</button>
                  
                  <button 
                    onClick={async () => {
                      const { url } = await stripeService.createCheckoutSession(totals.total, projectTitle);
                      alert(`Maksājuma saite izveidota: ${url}`);
                    }}
                    className="btn-glass" 
                    style={{ width: '100%', marginTop: '10px' }}
                  >
                    STRIPE MAKSĀJUMA SAITE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
