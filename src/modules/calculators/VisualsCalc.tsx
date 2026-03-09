import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';
import OpenAI from 'openai';

// ------------------------------------------------------------------
// DATUBĀZE: AI 8K Video Production (Batch & Single)
// ------------------------------------------------------------------

const PRICES = {
  production_type: {
    'ai_video_gen': { name: 'AI Video Ģenerēšana (Runway/Runway)', mat: 10, work: 80 }, 
    'topaz_8k_upscale': { name: 'Topaz AI Upscale uz 8K', mat: 25, work: 50 },
  },
  technical_services: {
    'seamless_loop': { name: 'Seamless Loop (Bezšuvju)', price: 250 }, 
    'mirror_loop': { name: 'Mirror Loop (Bezgalīgs)', price: 150 },
    'inst_loop_5min': { name: 'Installation Loop (5 min ar variācijām)', price: 550 },
    'inst_loop_10min': { name: 'Installation Loop (10 min ar variācijām)', price: 950 },
    'long_form_edit': { name: 'YouTube Ambient (1h)', price: 850 },
    'color_grading': { name: 'DaVinci Resolve Grading', price: 400 },
    'led_mapping': { name: 'LED Sienas Optimizācija', price: 300 },
  },
  render_quality: {
    'hd': { name: 'Full HD (1080p)', mult: 1 },
    '4k': { name: '4K Ultra HD', mult: 2.5 },
    '8k': { name: '8K Hyper HD (LED)', mult: 6 },
  },
  hardware: {
    media_server: { name: 'Media Serveris', price: 450 },
    operator: { name: 'Video Inženieris', price: 400 }
  }
};

export default function VisualsCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    duration: 30,
    videoCount: 1,
    useAI: true,
    useUpscale: true,
    useLoop: true,
    useMirrorLoop: false,
    quality: '8k',
    useGrading: true,
    useLedMapping: true,
    serverDays: 1,
  });

  const [results, setResults] = useState<any>(null);
  const [aiAdvice, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleCalculate = () => {
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;
    const qualityMult = PRICES.render_quality[params.quality as keyof typeof PRICES.render_quality].mult;

    // Apjoma atlaide: 20 gab -> 15%, 50 gab -> 25%
    const discount = params.videoCount >= 50 ? 0.75 : (params.videoCount >= 20 ? 0.85 : 1);

    let genMat = 0;
    let genWork = 0;
    if (params.useAI) {
      genMat += (params.duration * PRICES.production_type.ai_video_gen.mat);
      genWork += (params.duration * PRICES.production_type.ai_video_gen.work);
    }
    if (params.useUpscale) {
      genMat += (params.duration * PRICES.production_type.topaz_8k_upscale.mat);
      genWork += (params.duration * PRICES.production_type.topaz_8k_upscale.work);
    }

    const generationCost = {
      mat: (genMat * matMult * qualityMult * params.videoCount) * discount,
      work: (genWork * workMult * params.videoCount) * discount,
    };

    let techWork = 0;
    if (params.useLoop) techWork += PRICES.technical_services.seamless_loop.price;
    if (params.useMirrorLoop) techWork += PRICES.technical_services.mirror_loop.price;
    if (params.useGrading) techWork += PRICES.technical_services.color_grading.price;
    if (params.useLedMapping) techWork += PRICES.technical_services.led_mapping.price;

    const technicalCost = {
      mat: 0,
      work: (techWork * workMult * params.videoCount) * discount,
    };

    const hardwareCost = {
      mat: (params.serverDays * PRICES.hardware.media_server.price) * matMult,
      work: (params.serverDays * PRICES.hardware.operator.price) * workMult,
    };

    const totalMat = generationCost.mat + hardwareCost.mat;
    const totalWork = generationCost.work + technicalCost.work + hardwareCost.work;
    const grandTotal = totalMat + totalWork;

    setResults({
      generationCost,
      technicalCost,
      hardwareCost,
      totalMat,
      totalWork,
      grandTotal,
      videoCount: params.videoCount,
      discount: (1 - discount) * 100,
      duration: params.duration,
      isMirror: params.useMirrorLoop,
      quality: PRICES.render_quality[params.quality as keyof typeof PRICES.render_quality].name
    });
    setAiAnalysis(null);
  };

  const getAiAdvice = async () => {
    if (!results) return;
    setIsAiLoading(true);
    try {
      const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const prompt = `Analizē šo 8K batch video produkcijas tāmi:
      Skaits: ${results?.videoCount || 1} video
      Ilgums: ${results?.duration || 0}s katram
      Kopējā summa: ${results?.grandTotal || 0} EUR
      Atlaide: ${results?.discount || 0}%
      
      Sniedz 3 konkrētus padomus:
      1. Kā efektīvi vadīt ${results?.videoCount || 1} video ražošanas procesu.
      2. Kā uzturēt vizuālo konsistenci visā sērijā.
      3. YouTube kanāla mārketinga ieteikums šādam apjomam.
      Atbildi latviski, profesionāli.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      setAiAnalysis(response.choices[0].message.content);
    } catch {
      setAiAnalysis("AI mezgls pašlaik nav sasniedzams.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>AI 8K Batch Video Production</h1>
        <p>Masveida video ražošana (20–50 gab.) YouTube kanāliem un digitālajām izstādēm.</p>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', opacity: 0.8 }}>
          <span className="badge">AI Gen</span> → <span className="badge">8K Upscale</span> → <span className="badge">Batch Edit</span> → <span className="badge">YouTube Publish</span>
        </div>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#8b5cf6' }}>
            <h2>1. Apjoma un Satura Parametri</h2>
            <div className="input-group">
              <label>Reģions
                <select name="country" value={params.country} onChange={handleChange}>{renderCountryOptions()}</select>
              </label>
              <label style={{ marginTop: '15px' }}>Video skaits paketē
                <select name="videoCount" value={params.videoCount} onChange={handleChange}>
                  <option value="1">Atsevišķs video (1 gab.)</option>
                  <option value="20">Standard Batch (20 gab.) -15% atlaide</option>
                  <option value="50">Studio Batch (50 gab.) -25% atlaide</option>
                </select>
              </label>
              <label style={{ marginTop: '15px' }}>Video ilgums (s)
                <input type="number" name="duration" value={params.duration} onChange={handleChange} min="5" />
              </label>
              <label style={{ marginTop: '15px' }}>Mērķa izšķirtspēja
                <select name="quality" value={params.quality} onChange={handleChange}>
                  {Object.entries(PRICES.render_quality).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Pipeline Opcijas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><input type="checkbox" name="useAI" checked={params.useAI} onChange={handleChange} /> AI Video Ģenerēšana</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><input type="checkbox" name="useUpscale" checked={params.useUpscale} onChange={handleChange} /> Topaz 8K Upscaling</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><input type="checkbox" name="useMirrorLoop" checked={params.useMirrorLoop} onChange={handleChange} /> Mirror Loop (Infinite)</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><input type="checkbox" name="useGrading" checked={params.useGrading} onChange={handleChange} /> DaVinci Color Grading</label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#8b5cf6', width: '100%', padding: '20px', fontWeight: 900 }}>ĢENERĒT BATCH TĀMI</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            {!results ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎬</div>
                <p>Konfigurējiet video paketi, lai redzētu aprēķinu.</p>
              </div>
            ) : (
              <>
                <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  <span className="gt-label">Kopējā Investīcija ({results.videoCount} video)</span>
                  <span className="gt-value">{results.grandTotal.toLocaleString()} €</span>
                  {results.discount > 0 && <span className="gt-subtext">Iekļauta {results.discount}% apjoma atlaide!</span>}
                </div>

                <div className="geom-summary" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: '#8b5cf6', marginTop: '20px' }}>
                  Viena video pašizmaksa: <strong>{(results.grandTotal / results.videoCount).toFixed(0)} €</strong>
                </div>

                <table className="results-table" style={{ marginTop: '20px' }}>
                  <tbody>
                    <tr><td>Satura Ģenerēšana ({results.videoCount}x)</td><td>{results.generationCost.work.toLocaleString()} €</td></tr>
                    <tr><td>Tehniskā pēcapstrāde</td><td>{results.technicalCost.work.toLocaleString()} €</td></tr>
                    <tr><td>Aparatūras resursi</td><td>{results.generationCost.mat.toLocaleString()} €</td></tr>
                  </tbody>
                </table>

                <button onClick={getAiAdvice} disabled={isAiLoading} style={{ width: '100%', padding: '15px', background: 'rgba(139, 92, 246, 0.2)', color: '#a855f7', border: '1px solid #a855f7', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', marginTop: '20px' }}>
                  {isAiLoading ? '🤖 ANALIZĒ BATCH PROCESU...' : '✨ AI BATCH STRATĒĢIJA'}
                </button>
                
                {aiAdvice && (
                  <div className="glass-card" style={{ marginTop: '15px', padding: '20px', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.95)', borderColor: '#8b5cf6' }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 900, marginBottom: '10px' }}>🤖 AI PROJEKTU VADĪTĀJS</div>
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
