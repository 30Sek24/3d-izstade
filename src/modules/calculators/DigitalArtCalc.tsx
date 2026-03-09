import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import OpenAI from 'openai';

export default function DigitalArtCalc() {
  const [params, setParams] = useState({
    artType: 'space',
    duration: 60,
    genEngine: 'premium',
    upscaleTier: '8k', // 8k or 16k
    publishToYoutube: true,
    listingInGallery: true,
  });

  const [results, setResults] = useState<any>(null);
  const [aiAdvice, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleCalculate = () => {
    // Pipeline cenas
    const genCost = params.genEngine === 'premium' ? 450 : 850;
    const upscaleCost = params.upscaleTier === '16k' ? 600 : 300;
    const publishingCost = params.publishToYoutube ? 150 : 0;
    
    const totalCost = genCost + upscaleCost + publishingCost;
    const salePrice = 150; // Tavs noteiktais gabalcena

    setResults({
      genCost,
      upscaleCost,
      publishingCost,
      totalCost,
      salePrice,
      type: params.artType.toUpperCase(),
      target: params.upscaleTier.toUpperCase()
    });
    setAiAnalysis(null);
  };

  const getAiAdvice = async () => {
    if (!results) return;
    setIsAiLoading(true);
    try {
      const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const prompt = `Analizē šo digitālās mākslas biznesa plānu:
      Tips: ${results.type}
      Kvalitāte: ${results.target}
      Plānotā pārdošanas cena: 150 EUR gabalā
      
      Sniedz 3 stratēģiskus padomus:
      1. Kā vislabāk optimizēt YouTube algoritmus 8K mākslai.
      2. Kāds AI promptu stils vislabāk pārdodas (minimalist vs complex).
      3. Kā konvertēt YouTube skatītājus par galerijas pircējiem.
      Atbildi latviski, kā digitālā mārketinga guru.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      setAiAnalysis(response.choices[0].message.content);
    } catch {
      setAiAnalysis("AI mezgls aizņemts ar 16K renderēšanu.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>AI Mākslas Biznesa Pipeline</h1>
        <p>No mākslīgā intelekta vīzijas līdz tirdzniecībai Infinity galerijā.</p>
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: '#8b5cf6' }}>AI GEN</span> ➔ 
          <span className="badge" style={{ background: '#3b82f6' }}>AUTO UPSCALE</span> ➔ 
          <span className="badge" style={{ background: '#10b981' }}>PUBLISH</span> ➔ 
          <span className="badge" style={{ background: '#f59e0b' }}>SELL (150€)</span>
        </div>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ borderLeftColor: '#8b5cf6' }}>
            <h2>1. Produkcijas Posms</h2>
            <div className="input-group">
              <label>Mākslas tēma
                <select value={params.artType} onChange={e => setParams({...params, artType: e.target.value})}>
                  <option value="space">Space & Universe 8K</option>
                  <option value="relaxing">Nature & Relaxing 8K</option>
                  <option value="abstract">Abstract Visuals 16K</option>
                </select>
              </label>
              <label style={{ marginTop: '15px' }}>AI Dzinējs
                <select value={params.genEngine} onChange={e => setParams({...params, genEngine: e.target.value})}>
                  <option value="standard">Standard (Stable Diffusion)</option>
                  <option value="premium">Premium (Midjourney/Runway)</option>
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Apstrāde & Publicēšana</h2>
            <div className="input-group">
              <label>Upscale mērķis
                <select value={params.upscaleTier} onChange={e => setParams({...params, upscaleTier: e.target.value})}>
                  <option value="8k">8K Ultra HD</option>
                  <option value="16k">16K Hyper Fidelity (Premium)</option>
                </select>
              </label>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={params.publishToYoutube} onChange={e => setParams({...params, publishToYoutube: e.target.checked})} />
                  Automātiska YouTube publikācija (8K)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={params.listingInGallery} onChange={e => setParams({...params, listingInGallery: e.target.checked})} />
                  Eksponēt Infinity Galerijā
                </label>
              </div>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)' }}>Palaist Biznesa Pipeline</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            {!results ? <div className="empty-state">🎨 Sāciet savu digitālās mākslas ceļu</div> : (
              <>
                <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <span className="gt-label">Pārdošanas Cena Galerijā</span>
                  <span className="gt-value">{results.salePrice} €</span>
                  <span className="gt-subtext">Par vienu unikālo 8K/16K licenci.</span>
                </div>

                <table className="results-table">
                  <tbody>
                    <tr><td>AI Generation posms</td><td>{results.genCost} €</td></tr>
                    <tr><td>{results.target} Upscale posms</td><td>{results.upscaleCost} €</td></tr>
                    <tr><td>Publicēšanas serviss</td><td>{results.publishingCost} €</td></tr>
                  </tbody>
                </table>

                <div className="geom-summary" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: '#f59e0b', marginTop: '20px' }}>
                  Mērķis: <strong>100 gab</strong> x 150 € = <strong>15 000 €</strong>
                </div>

                <button onClick={getAiAdvice} disabled={isAiLoading} style={{ width: '100%', padding: '15px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', marginTop: '20px' }}>
                  {isAiLoading ? '🤖 ANALIZĒ TIRGU...' : '🚀 AI BIZNESA STRATĒĢIJA'}
                </button>
                {aiAdvice && (
                  <div className="glass-card" style={{ marginTop: '15px', padding: '20px', background: 'rgba(15, 23, 42, 0.95)', borderColor: '#2563eb', fontSize: '0.85rem' }}>
                    <div style={{ color: '#2563eb', fontWeight: 900, marginBottom: '10px' }}>🤖 AI STRATĒĢA IETEIKUMI</div>
                    <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{aiAdvice}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
