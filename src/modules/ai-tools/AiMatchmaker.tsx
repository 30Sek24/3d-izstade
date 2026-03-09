import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

const COMPANIES = [
  { id: 1, name: 'BuildMaster SIA', expertise: ['Roofing', 'Construction'], rating: 4.9, speed: 'Fast', priceRange: '€€€' },
  { id: 2, name: 'EcoHeat Systems', expertise: ['Heating', 'Solar'], rating: 4.8, speed: 'Normal', priceRange: '€€' },
  { id: 3, name: 'RenderMax Studio', expertise: ['3D', 'Creative'], rating: 5.0, speed: 'Ultra Fast', priceRange: '€€€' },
  { id: 4, name: 'GreenClean PRO', expertise: ['Cleaning', 'Industrial'], rating: 4.7, speed: 'Fast', priceRange: '€' },
];

export default function AiMatchmaker() {
  const [query, setPrompt] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [match, setMatch] = useState<any>(null);

  const runMatch = async () => {
    setIsMatching(true);
    setMatch(null);
    await new Promise(r => setTimeout(r, 2500)); // AI domāšanas simulācija
    
    // Vienkārša loģika: meklējam pēc atslēgvārdiem
    const found = COMPANIES.find(c => 
      c.expertise.some(e => query.toLowerCase().includes(e.toLowerCase())) ||
      c.name.toLowerCase().includes(query.toLowerCase())
    ) || COMPANIES[0];

    setMatch(found);
    setIsMatching(false);
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1 className="text-accent">AI Matchmaker</h1>
        <p>Gudrā uzņēmumu un projektu saskaņošanas sistēma.</p>
      </div>

      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠</div>
        <h2 style={{ marginBottom: '20px' }}>Ko jūs plānojat būvēt vai darīt?</h2>
        <textarea 
          value={query}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Piemēram: 'Man vajag steidzami nomainīt jumtu 150m2 mājai'..."
          style={{ width: '100%', height: '120px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', padding: '20px', color: '#fff', fontSize: '1.1rem', outline: 'none', marginBottom: '20px' }}
        />
        <button 
          onClick={runMatch} 
          disabled={isMatching || !query}
          className="btn-primary" 
          style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }}
        >
          {isMatching ? 'ANALIZĒ PIEPRASĪJUMU...' : 'ATRAST LABĀKO IZPILDĪTĀJU'}
        </button>
      </div>

      {match && !isMatching && (
        <div style={{ marginTop: '40px', animation: 'fadeIn 0.5s' }}>
          <div className="glass-card" style={{ borderLeft: '6px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', padding: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 900, marginBottom: '10px' }}>AI MATCH: 98% SCORE</div>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff' }}>
                  {match.name[0]}
                </div>
              </div>
              <div>
                <h2 style={{ marginBottom: '10px' }}>{match.name}</h2>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>⭐ {match.rating}</span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>⏱️ {match.speed}</span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>💰 {match.priceRange}</span>
                </div>
                <p style={{ color: 'var(--text-dim)', marginBottom: '20px' }}>Šis uzņēmums ir speciālists {match.expertise.join(', ')} jomā un pašlaik ir pieejams jūsu projektam.</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button className="btn-primary">SAZINĀTIES TAGAD</button>
                  <button className="btn-glass">SKATĪT PROFILU</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
