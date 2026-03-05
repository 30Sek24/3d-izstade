import { useState } from 'react';
import OpenAI from 'openai';

export default function FutureOracle() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_key') || '');
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
    if (!apiKey) {
      setError('Lūdzu, ievadiet OpenAI API atslēgu iestatījumos.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      
      const prompt = `Esi nākotnes biznesa orākuls. Analizē šo profilu:
      Vecums: ${profile.age}
      Valsts: ${profile.country}
      Profesija: ${profile.profession}
      Ienākumi: ${profile.income} EUR
      Prasmes: ${profile.skills.join(', ')}
      Mērķis: ${profile.goal}
      
      Sniedz prognozi 2030. gadam par šī cilvēka biznesa izaugsmi būvniecības nozarē. 
      Atbildi JSON formātā ar šādiem laukiem: prediction, recommendation, estimated_income_2030, risk_level. Atbildi latviski.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (content) {
        setResult(JSON.parse(content));
      }
    } catch (err: any) {
      setError('Kļūda: ' + (err.message || 'Neizdevās sazināties ar AI'));
    } finally {
      setLoading(false);
    }
  }

  const saveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_key', key);
  };

  return (
    <div style={{ padding: '100px 24px', background: '#020617', color: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-2px' }}>Nākotnes Orākuls <span style={{ color: '#3b82f6' }}>AI</span></h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '50px' }}>Simulē savu nākotni būvniecības nozarē, izmantojot reālu AI prognozēšanu.</p>

        <div style={{ marginBottom: '30px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>OpenAI API Atslēga (tiek glabāta tikai tavā pārlūkā)</label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={e => saveKey(e.target.value)} 
            placeholder="sk-..." 
            style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} 
          />
        </div>

        {error && <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', marginBottom: '20px' }}>{error}</div>}

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>Vecums</label>
              <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>Profesija</label>
              <input type="text" value={profile.profession} onChange={e => setProfile({...profile, profession: e.target.value})} style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>Ienākumi mēnesī (EUR)</label>
              <input type="number" value={profile.income} onChange={e => setProfile({...profile, income: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>Mērķis</label>
              <select value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value})} style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}>
                <option value="izaugsme">Biznesa izaugsme</option>
                <option value="stabilitate">Stabilitāte</option>
                <option value="automatizacija">Automatizācija</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            {loading ? 'ANALIZĒ...' : 'ĢENERĒ NĀKOTNES PROGNOZI'}
          </button>
        </div>

        {result && (
          <div style={{ marginTop: '50px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '40px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Tava nākotne 2030:</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '30px' }}>{result.prediction}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>IETEIKUMS</div>
                <div style={{ fontWeight: 'bold' }}>{result.recommendation}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>IENĀKUMU PROGNOZE</div>
                <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.4rem' }}>{result.estimated_income_2030} EUR</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>RISKA LĪMENIS</div>
                <div style={{ fontWeight: 'bold', color: result.risk_level === 'Zems' ? '#10b981' : '#f59e0b' }}>{result.risk_level}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}