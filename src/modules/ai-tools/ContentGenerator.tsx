import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult('');
    
    // AI ģenerēšanas simulācija
    await new Promise(r => setTimeout(r, 3000));
    
    let content = '';
    if (platform === 'linkedin') {
      content = `🚀 Kā samazināt izmaksas, bet saglabāt kvalitāti būvniecībā?\n\nMūsu jaunākajā projektā saskārāmies ar izaicinājumu: ${topic}. \n\nŠeit ir 3 galvenie secinājumi, ko mūsu komanda atklāja:\n1️⃣ Pareiza materiālu plānošana var ietaupīt līdz pat 15% budžeta.\n2️⃣ AI rīki palīdz pamanīt kļūdas tāmēs pirms darbu sākuma.\n3️⃣ Sadarbība ar pārbaudītiem piegādātājiem nozīmē mazāk dīkstāvju.\n\nVai jūsu uzņēmums jau izmanto tehnoloģijas, lai optimizētu procesus? Dalaties komentāros! 👇\n\n#Būvniecība #Inovācijas #WarpalaOS #ConstructionTech`;
    } else if (platform === 'blog') {
      content = `# Kā veiksmīgi realizēt projektu: ${topic}\n\nMūsdienu dinamiskajā vidē ir būtiski sekot līdzi jaunākajām tendencēm. Šajā rakstā mēs apskatīsim galvenos aspektus, kas palīdzēs sasniegt labākos rezultātus.\n\n## 1. Ievads\nPlānošana ir visa pamats. Bez skaidra redzējuma par mērķiem un pieejamajiem resursiem, pat vislabākā ideja var izgāzties.\n\n## 2. Galvenie izaicinājumi\nMūsu pieredze rāda, ka... [Turpinājums sekos]`;
    } else {
      content = `Pārsteidzoši rezultāti! 🔥 Nupat pabeidzām analizēt datus par "${topic}". Jaunās tehnoloģijas ļauj strādāt par 30% ātrāk. Vairāk info mūsu mājaslapā! 🚀 #Warpala #Tech`;
    }

    setResult(content);
    setIsGenerating(false);
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1 className="text-accent" style={{ fontSize: '3.5rem' }}>AI Satura Ģenerators</h1>
        <p>Raksti blogus, LinkedIn postus un mārketinga tekstus pāris sekundēs.</p>
      </div>

      <div className="calc-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <div className="calc-form-column">
          <section className="calc-section">
            <h2>📝 Par ko rakstīsim?</h2>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ievadi tēmu vai galvenos atslēgvārdus (piem. 'Viedās mājas priekšrocības un izmaksas')..."
              style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', padding: '20px', color: '#fff', fontSize: '1rem', outline: 'none', marginBottom: '20px' }}
            />
            
            <div className="input-group-2">
              <label>Platforma
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="linkedin">LinkedIn (Profesionāls)</option>
                  <option value="blog">Mājaslapas Blogs (SEO)</option>
                  <option value="twitter">X / Twitter (Īss un kodolīgs)</option>
                  <option value="instagram">Instagram / Facebook</option>
                </select>
              </label>
              <label>Balss tonis
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                  <option value="professional">Profesionāls un izglītojošs</option>
                  <option value="friendly">Draudzīgs un piesaistošs</option>
                  <option value="direct">Tiešs un uz pārdošanu vērsts</option>
                </select>
              </label>
            </div>
          </section>

          <button 
            onClick={handleGenerate} 
            disabled={isGenerating || !topic}
            className="btn-primary" 
            style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }}
          >
            {isGenerating ? 'AI DOMĀ UN RAKSTA...' : '✨ ĢENERĒT SATURU'}
          </button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Rezultāts</h3>
            
            {!result && !isGenerating ? (
              <div className="empty-state">
                <div className="empty-state-icon">✍️</div>
                <p>Ievadiet tēmu un nospiediet "Ģenerēt", lai redzētu maģiju.</p>
              </div>
            ) : isGenerating ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-blue)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <p style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>ANALYZING TRENDS...</p>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {result}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigator.clipboard.writeText(result)}>KOPĒT TEKSTU</button>
                  <button className="btn-glass" style={{ flex: 1, borderColor: '#10b981', color: '#10b981' }}>PUBLICEET</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
