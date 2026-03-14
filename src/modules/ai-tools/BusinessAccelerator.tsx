import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { generateAiResponse } from '../../services/aiService';

export default function BusinessAccelerator() {
  const [activeTool, setActiveTool] = useState('estimator');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const TOOLS: any = {
    'estimator': { name: 'AI ESTIMATOR', icon: '📊', color: '#3b82f6', prompt: 'Aprēķini nepieciešamos resursus un materiālus šim projektam:' },
    'quote': { name: 'QUOTE GENERATOR', icon: '📝', color: '#10b981', prompt: 'Izveido profesionālu cenas piedāvājumu klientam par šo darbu:' },
    'marketing': { name: 'AI MARKETING', icon: '🚀', color: '#f59e0b', prompt: 'Izveido mārketinga stratēģiju un reklāmas tekstus šim produktam:' },
    'advisor': { name: 'BUSINESS ADVISOR', icon: '🧠', color: '#8b5cf6', prompt: 'Sniedz biznesa attīstības padomus šai situācijai:' }
  };

  const processAI = async () => {
    setIsProcessing(true);
    setOutput(null);
    try {
      const current = TOOLS[activeTool];
      const responseText = await generateAiResponse(`${current.prompt} \n\n ${input}`);
      setOutput(responseText);
    } catch {
      setOutput("AI mezgls pašlaik analizē citus datus. Mēģiniet vēlreiz.");
    } finally {
      setIsProcessing(false);
    }
  };

  const current = TOOLS[activeTool];

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1 style={{ background: `linear-gradient(135deg, ${current.color}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem' }}>
          {current.name}
        </h1>
        <p>Automatizē savu biznesu ar 30Sek24 viedajiem rīkiem.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '30px 0', flexWrap: 'wrap' }}>
        {Object.entries(TOOLS).map(([key, val]: any) => (
          <button key={key} onClick={() => {setActiveTool(key); setOutput(null);}} style={{ 
            padding: '15px 25px', borderRadius: '12px', border: `2px solid ${val.color}`,
            background: activeTool === key ? val.color : 'transparent',
            color: '#fff', fontWeight: 900, cursor: 'pointer', transition: 'all 0.3s'
          }}>
            {val.icon} {val.name}
          </button>
        ))}
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ borderLeftColor: current.color }}>
            <h2>Ievadi informāciju</h2>
            <textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apraksti projektu, preci vai situāciju šeit..."
              style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: '#fff', padding: '20px', borderRadius: '12px', fontSize: '1.1rem' }}
            />
            <button onClick={processAI} disabled={isProcessing || !input} className="btn-pro" style={{ width: '100%', marginTop: '20px', background: current.color }}>
              {isProcessing ? 'AI DOMĀ...' : `PALAIST ${current.name}`}
            </button>
          </section>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            {!output && !isProcessing ? (
              <div className="empty-state">
                <div style={{ fontSize: '4rem' }}>🤖</div>
                <p>AI ir gatavs palīdzēt tavam biznesam.</p>
              </div>
            ) : isProcessing ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div className="spinner" style={{ borderColor: current.color, borderTopColor: 'transparent' }}></div>
                <p style={{ marginTop: '20px', color: '#aaa' }}>Ģenerē viedu atbildi...</p>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '25px', borderColor: current.color, background: 'rgba(15, 23, 42, 0.9)' }}>
                <div style={{ color: current.color, fontWeight: 900, marginBottom: '15px', fontSize: '0.8rem' }}>🤖 AI ANALĪZES REZULTĀTS:</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{output}</div>
                
                <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                  <button className="btn-pro" style={{ flex: 1, fontSize: '0.75rem', background: '#10b981' }}>KOPIĒT TEKSTU</button>
                  <button className="btn-pro" style={{ flex: 1, fontSize: '0.75rem', background: '#3b82f6' }}>SAGLABĀT PDF</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
