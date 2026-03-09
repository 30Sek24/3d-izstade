import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';
import OpenAI from 'openai';

// ------------------------------------------------------------------
// DATUBĀZE: Cenas un materiāli (Bāzes likmes EUR Rīgai/Standartam)
// ------------------------------------------------------------------

const PRICES = {
  demolition: {
    none: { name: 'Bez demontāžas', mat: 0, work: 0 },
    light: { name: 'Viegla (tapetes, grīdlīstes, segums)', mat: 0, work: 6.00 },
    heavy: { name: 'Smaga (flīzes, starpsienas, grīdas laušana)', mat: 0, work: 25.00 },
  },
  container: {
    none: { name: 'Nevajag (savs transports)', price: 0 },
    small: { name: '5m³ Konteiners', price: 350 },
    medium: { name: '7m³ Konteiners', price: 450 },
    large: { name: '10m³ Konteiners', price: 600 },
  },
  floor_prep: {
    none: { name: 'Bez sagatavošanas', mat: 0, work: 0 },
    osb: { name: 'OSB plātņu ieklāšana', mat: 9.50, work: 8.00 },
    betons: { name: 'Betona izlīdzināšana (Pašizlīdzinošais)', mat: 8.00, work: 10.00 },
  },
  floor_cover: {
    none: { name: 'Bez seguma', mat: 0, work: 0 },
    laminats: { name: 'Lamināts + apakšklājs', mat: 15.00, work: 9.00 },
    vinils: { name: 'Līmējamais Vinils (LVT)', mat: 25.00, work: 12.00 },
    parkets: { name: 'Koka parkets', mat: 55.00, work: 20.00 },
    flizes: { name: 'Akmens masas flīzes', mat: 30.00, work: 35.00 },
  },
  floor_skirting: {
    none: { name: 'Bez kājlīstēm', mat: 0, work: 0 }, 
    mdf: { name: 'MDF krāsotas kājlīstes', mat: 5.50, work: 5.00 }, 
    plastmasas: { name: 'Plastmasas (PVC)', mat: 2.50, work: 3.00 }, 
  },
  wall_prep: {
    none: { name: 'Bez sagatavošanas', mat: 0, work: 0 },
    regipsis_profils: { name: 'Reģipša montāža (uz profiliem)', mat: 8.50, work: 15.00 },
    apmesana: { name: 'Sienu apmešana (MP75)', mat: 5.00, work: 16.00 },
  },
  wall_finish: {
    none: { name: 'Bez apdares', mat: 0, work: 0 },
    krasa_standard: { name: 'Špaktelēšana + Standarta Krāsošana', mat: 5.50, work: 18.00 },
    krasa_premium: { name: 'Špaktelēšana + Premium Krāsošana', mat: 10.00, work: 25.00 },
    tapetes: { name: 'Tapešu līmēšana', mat: 18.00, work: 12.00 },
    dekors: { name: 'Dekoratīvais apmetums', mat: 22.00, work: 35.00 },
  },
  ceiling_type: {
    none: { name: 'Bez griestiem', mat: 0, work: 0 },
    regipsis: { name: 'Reģipša griesti (špaktelēti, krāsoti)', mat: 12.00, work: 35.00 },
    iestieptie: { name: 'Iestieptie PVC griesti', mat: 25.00, work: 15.00 },
    armstrong: { name: 'Iekārtie "Armstrong" griesti', mat: 15.00, work: 12.00 },
  },
  electrical_points: { name: 'Elektrības punkti (Rozetes, slēdži)', mat: 15.00, work: 20.00 },
  doors: { name: 'Iekšdurvju bloka montāža', mat: 180.00, work: 85.00 }
};

const ROOM_TYPES = {
  living_room: 'Viesistaba',
  bedroom: 'Guļamistaba',
  kitchen: 'Virtuve',
  bathroom: 'Vannas istaba',
  toilet: 'Tualete',
  corridor: 'Koridors',
};

export default function InteriorCalc() {
  const [params, setParams] = useState({
    country: 'lv', roomType: 'living_room', area: 20, height: 2.7, windowArea: 2.5, doorCount: 1,
    demolitionType: 'none', containerSize: 'none', floorPrep: 'osb', floorCover: 'laminats',
    floorSkirting: 'mdf', wallPrep: 'none', wallFinish: 'krasa_standard', ceilingType: 'regipsis',
    elecPoints: 4, imageUrl: '', videoUrl: '',
  });

  const [results, setResults] = useState<any>(null);
  const [aiAdvice, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setParams(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const getAiAdvice = async () => {
    if (!results) return;
    setIsAiLoading(true);
    try {
      const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const prompt = `Analizē šo iekšējās apdares tāmi:
      Telpa: ${results.roomType}
      Platība: ${params.area} m2
      Kopējā summa: ${results.grandTotal} EUR
      Materiāli: ${results.totalMat} EUR, Darbs: ${results.totalWork} EUR
      
      Sniedz 3 profesionālus padomus:
      1. Kā optimizēt izmaksas šai telpai.
      2. Materiālu saderības ieteikums.
      3. Kas jāņem vērā pirms darbu uzsākšanas.
      Atbildi latviski, profesionāli.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      setAiAnalysis(response.choices[0].message.content);
    } catch (err) {
      setAiAnalysis("AI mezgls pašlaik nav sasniedzams.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCalculate = () => {
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;
    const perimeter = Math.sqrt(params.area) * 4; 
    const netWallArea = Math.max(0, (perimeter * params.height) - params.windowArea - (params.doorCount * 1.6));

    const demoRate = PRICES.demolition[params.demolitionType as keyof typeof PRICES.demolition];
    const containerRate = PRICES.container[params.containerSize as keyof typeof PRICES.container];
    const demolitionCost = { mat: containerRate.price * matMult, work: (params.area * demoRate.work) * workMult };

    const floorPrepRate = PRICES.floor_prep[params.floorPrep as keyof typeof PRICES.floor_prep];
    const floorCoverRate = PRICES.floor_cover[params.floorCover as keyof typeof PRICES.floor_cover];
    const skirtingRate = PRICES.floor_skirting[params.floorSkirting as keyof typeof PRICES.floor_skirting];
    const floorCost = {
      mat: ((params.area * floorPrepRate.mat) + (params.area * floorCoverRate.mat) + (perimeter * skirtingRate.mat)) * matMult,
      work: ((params.area * floorPrepRate.work) + (params.area * floorCoverRate.work) + (perimeter * skirtingRate.work)) * workMult,
    };

    const wallPrepRate = PRICES.wall_prep[params.wallPrep as keyof typeof PRICES.wall_prep];
    const wallFinishRate = PRICES.wall_finish[params.wallFinish as keyof typeof PRICES.wall_finish];
    const wallCost = {
      mat: ((netWallArea * wallPrepRate.mat) + (netWallArea * wallFinishRate.mat)) * matMult,
      work: ((netWallArea * wallPrepRate.work) + (netWallArea * wallFinishRate.work)) * workMult,
    };

    const ceilingRate = PRICES.ceiling_type[params.ceilingType as keyof typeof PRICES.ceiling_type];
    const ceilingCost = { mat: (params.area * ceilingRate.mat) * matMult, work: (params.area * ceilingRate.work) * workMult };

    const extrasCost = {
      mat: (params.elecPoints * PRICES.electrical_points.mat + params.doorCount * PRICES.doors.mat) * matMult,
      work: (params.elecPoints * PRICES.electrical_points.work + params.doorCount * PRICES.doors.work) * workMult
    };

    const totalMat = demolitionCost.mat + floorCost.mat + wallCost.mat + ceilingCost.mat + extrasCost.mat;
    const totalWork = demolitionCost.work + floorCost.work + wallCost.work + ceilingCost.work + extrasCost.work;
    const grandTotal = totalMat + totalWork;

    setResults({ netWallArea, perimeter, demolitionCost, floorCost, wallCost, ceilingCost, extrasCost, totalMat, totalWork, grandTotal, roomType: ROOM_TYPES[params.roomType as keyof typeof ROOM_TYPES], imageUrl: params.imageUrl, videoUrl: params.videoUrl });
    setAiAnalysis(null);
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Iekšējās Apdares Tāme</h1>
        <p>Precīzs un starptautisks remonta kalkulators ar AI Projektu vadītāju.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#334155' }}>
            <h2>Parametri</h2>
            <div className="input-group">
              <label>Valsts <select name="country" value={params.country} onChange={handleChange}>{renderCountryOptions()}</select></label>
              <label style={{ marginTop: '15px' }}>Telpa <select name="roomType" value={params.roomType} onChange={handleChange}>{Object.entries(ROOM_TYPES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select></label>
              <label style={{ marginTop: '15px' }}>Platība (m²) <input type="number" name="area" value={params.area} onChange={handleChange} /></label>
            </div>
          </section>
          {/* Simplified sections for brevity in this example update */}
          <button onClick={handleCalculate} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '24px', fontSize: '1.4rem', fontWeight: 900, borderRadius: '12px', cursor: 'pointer', width: '100%', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            {!results ? <div className="empty-state">📊 Norādiet telpas datus</div> : (
              <>
                <div className="grand-total-box">
                  <span className="gt-label">Kopējās Izmaksas</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                </div>
                <button onClick={getAiAdvice} disabled={isAiLoading} style={{ width: '100%', padding: '15px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', marginTop: '20px' }}>
                  {isAiLoading ? '🤖 ANALIZĒ...' : '✨ SINERĢĒT AR AI'}
                </button>
                {aiAdvice && (
                  <div className="glass-card" style={{ marginTop: '15px', padding: '20px', background: 'rgba(15, 23, 42, 0.9)', borderColor: '#2563eb' }}>
                    <div style={{ color: '#2563eb', fontWeight: 900, marginBottom: '10px' }}>🤖 AI PROJEKTU VADĪTĀJS</div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{aiAdvice}</div>
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
