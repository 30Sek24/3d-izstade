import { useState } from 'react';
import { generateAiResponse } from '../services/aiService';

interface OracleResult {
  prediction: string;
  recommendation: string;
  estimated_income_2030: number | string;
  risk_level: string;
}

export default function FutureOracle() {
  const [result, setResult] = useState<OracleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    age: 30,
    country: "Latvija",
    profession: "Būvnieks",
    income: 2500,
    skills: ["mūrēšana", "tāmēšana"],
    goal: "izaugsme",
  });

  async function handleSubmit() {
    setLoading(true);
    setError('');
    
    try {
      const prompt = `Esi nākotnes biznesa orākuls. Analizē šo profilu:
      Vecums: ${profile.age}
      Valsts: ${profile.country}
      Profesija: ${profile.profession}
      Ienākumi: ${profile.income} EUR
      Prasmes: ${profile.skills.join(', ')}
      Mērķis: ${profile.goal}
      
      Sniedz prognozi 2030. gadam par šī cilvēka biznesa izaugsmi būvniecības nozarē.`;

      // Simulating a parsed response for the prototype from our secure backend
      await generateAiResponse(prompt);
      
      setResult({
        prediction: "Izcilas izredzes kļūt par reģionālo līderi nozarē. Optimizējot procesus un pielietojot AI, efektivitāte dubultosies.",
        recommendation: "Investē projektu vadības sistēmās un darbinieku apmācībā.",
        estimated_income_2030: profile.income * 3,
        risk_level: "VIDĒJS"
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Neizdevās sazināties ar AI mezglu';
      setError('SISTĒMAS KĻŪDA: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div className="glass-card" style={{ display: 'inline-flex', padding: '8px 20px', borderRadius: '50px', marginBottom: '25px', borderColor: 'var(--accent-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-secondary)', letterSpacing: '2px' }}>NEURAL LINK ACTIVE</span>
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-4px', lineHeight: 1, marginBottom: '20px' }}>
            Nākotnes <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Orākuls AI</span>
          </h1>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Simulē savu biznesa trajektoriju 2030. gadam, izmantojot reāllaika tirgus datus un mākslīgo intelektu.
          </p>
        </div>

        {/* TOP PANEL: STATUS */}
        <div className="glass-card" style={{ padding: '30px 40px', marginBottom: '40px', display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>MODELIS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>SECURE BACKEND AI</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>STATUSS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>READY</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="glass-card" style={{ padding: '20px', borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', marginBottom: '30px', fontWeight: 700, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px' }}>
          
          {/* LEFT: INPUT PROFILE */}
          <div className="glass-card" style={{ padding: '40px' }}>
            <h3 style={{ marginBottom: '30px', fontSize: '1.4rem' }}>Lietotāja Profils</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pašreizējā Profesija</label>
                <input type="text" value={profile.profession} onChange={e => setProfile({...profile, profession: e.target.value})} style={{ width: '100%', marginTop: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '12px', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vecums</label>
                  <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} style={{ width: '100%', marginTop: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '12px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ienākumi (€)</label>
                  <input type="number" value={profile.income} onChange={e => setProfile({...profile, income: parseInt(e.target.value)})} style={{ width: '100%', marginTop: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '12px', color: '#fff' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Galvenais Mērķis</label>
                <select value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value})} style={{ width: '100%', marginTop: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '12px', color: '#fff' }}>
                  <option value="izaugsme">Biznesa strauja izaugsme</option>
                  <option value="stabilitate">Finansiālā stabilitāte</option>
                  <option value="automatizacija">Pilnīga automatizācija</option>
                </select>
              </div>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="btn-pro btn-pro-primary"
                style={{ width: '100%', padding: '20px', marginTop: '10px' }}
              >
                {loading ? 'SINTEZĒ DATUS...' : 'ĢENERĒ PROGNOZI'}
              </button>
            </div>
          </div>

          {/* RIGHT: TERMINAL OUTPUT */}
          <div className="glass-card" style={{ 
            background: 'rgba(2, 6, 23, 0.8)', 
            padding: '40px', 
            position: 'relative', 
            minHeight: '500px',
            border: '1px solid var(--accent-primary)',
            boxShadow: 'inset 0 0 50px rgba(59, 130, 246, 0.1)'
          }}>
            {!result && !loading && (
              <div style={{ textAlign: 'center', marginTop: '150px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.2 }}>🧠</div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', letterSpacing: '1px' }}>PROGNOZĒŠANAS MEZGLS GAIDA DATUS...</p>
              </div>
            )}

            {loading && (
              <div style={{ marginTop: '150px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', border: '4px solid var(--border-glass)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)', fontSize: '0.8rem', animation: 'pulse 2s infinite' }}>APSTRĀDĀ NOZARES TRENDUS...</div>
              </div>
            )}

            {result && !loading && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 15px var(--accent-primary)' }}></div>
                  <h2 style={{ fontSize: '1.8rem', margin: 0 }}>PROGNOZE 2030</h2>
                </div>
                
                <p style={{ fontSize: '1.25rem', lineHeight: 1.7, marginBottom: '40px', color: '#fff', fontStyle: 'italic' }}>
                  "{result.prediction}"
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '10px' }}>Stratēģiskais Ieteikums</div>
                    <div style={{ fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{result.recommendation}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981' }}>IENĀKUMI 2030</div>
                      <div style={{ fontWeight: 900, color: '#fff', fontSize: '1.4rem' }}>{result.estimated_income_2030} EUR</div>
                    </div>
                    <div style={{ background: 'rgba(234, 179, 8, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(234, 179, 8, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#eab308' }}>RISKA LĪMENIS</div>
                      <div style={{ fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>{result.risk_level}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
