import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';
import { generateAiResponse } from '../../services/aiService';

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
    demolitionType: 'none', containerSize: 'none', floorPrep: 'betons', floorCover: 'laminats',
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

      const responseText = await generateAiResponse(prompt);
      setAiAnalysis(responseText);
    } catch {
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
      work: ((params.area * floorPrepRate.work) + (params.area * floorCoverRate.mat) + (perimeter * skirtingRate.work)) * workMult,
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
          <section className="calc-section">
            <h2>🌍 Lokācijas un Telpas Parametri</h2>
            <div className="input-group">
              <label>Reģions
                <select name="country" value={params.country} onChange={handleChange}>{renderCountryOptions()}</select>
              </label>
              <div className="input-group-2" style={{ marginTop: '20px' }}>
                <label>Telpas veids
                  <select name="roomType" value={params.roomType} onChange={handleChange}>
                    {Object.entries(ROOM_TYPES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                  </select>
                </label>
                <label>Platība (m²)
                  <input type="number" name="area" value={params.area} onChange={handleChange} />
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>📐 Telpas Ģeometrija</h2>
            <div className="input-group-2">
              <label>Griestu augstums (m)
                <input type="number" name="height" value={params.height} onChange={handleChange} step="0.1" />
              </label>
              <label>Logu laukums (m²)
                <input type="number" name="windowArea" value={params.windowArea} onChange={handleChange} step="0.1" />
              </label>
              <label>Iekšdurvju skaits
                <input type="number" name="doorCount" value={params.doorCount} onChange={handleChange} />
              </label>
              <label>Elektrības punkti
                <input type="number" name="elecPoints" value={params.elecPoints} onChange={handleChange} />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>🧹 Demontāža un Atkritumi</h2>
            <div className="input-group">
              <label>Demontāžas apjoms
                <select name="demolitionType" value={params.demolitionType} onChange={handleChange}>
                  {Object.entries(PRICES.demolition).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
                </select>
              </label>
              <label style={{ marginTop: '20px' }}>Būvgružu konteiners
                <select name="containerSize" value={params.containerSize} onChange={handleChange}>
                  {Object.entries(PRICES.container).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>🪵 Grīdu un Sienu Apdare</h2>
            <div className="input-group">
              <label>Grīdas sagatavošana
                <select name="floorPrep" value={params.floorPrep} onChange={handleChange}>
                  {Object.entries(PRICES.floor_prep).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
                </select>
              </label>
              <label style={{ marginTop: '20px' }}>Grīdas segums
                <select name="floorCover" value={params.floorCover} onChange={handleChange}>
                  {Object.entries(PRICES.floor_cover).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
                </select>
              </label>
              <label style={{ marginTop: '20px' }}>Sienu apdare
                <select name="wallFinish" value={params.wallFinish} onChange={handleChange}>
                  {Object.entries(PRICES.wall_finish).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
                </select>
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ width: '100%', padding: '24px', fontSize: '1.2rem' }}>
            Sastādīt Remonta Tāmi
          </button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Remonta Specifikācija</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🛋️</div>
                <p>Norādiet telpas izmērus un vēlmes</p>
              </div>
            ) : (
              <>
                <div className="grand-total-box">
                  <span className="gt-label">{results.roomType} ({params.area} m²)</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Aprēķinā iekļauti materiāli un darbs.</span>
                </div>

                <div style={{ gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px', display: 'grid' }}>
                  <button onClick={getAiAdvice} disabled={isAiLoading} className="btn-glass" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>
                    {isAiLoading ? '🤖 ANALIZĒ...' : '✨ AI PADOMS'}
                  </button>
                  <button className="btn-glass">Eksportēt PDF</button>
                </div>

                {aiAdvice && (
                  <div className="glass-card" style={{ marginTop: '25px', padding: '25px', background: 'rgba(15, 23, 42, 0.9)', borderColor: 'var(--accent-blue)' }}>
                    <div style={{ color: 'var(--accent-blue)', fontWeight: 900, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🤖</span> AI PROJEKTU VADĪTĀJS
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{aiAdvice}</div>
                  </div>
                )}

                <table className="results-table" style={{ marginTop: '25px' }}>
                  <thead>
                    <tr>
                      <th>Pozīcija</th>
                      <th>Materiāli</th>
                      <th>Darbs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Demontāža / Gruži</td><td>{results.demolitionCost.mat.toFixed(0)} €</td><td>{results.demolitionCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Grīdas darbi</td><td>{results.floorCost.mat.toFixed(0)} €</td><td>{results.floorCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Sienu apdare</td><td>{results.wallCost.mat.toFixed(0)} €</td><td>{results.wallCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Griestu darbi</td><td>{results.ceilingCost.mat.toFixed(0)} €</td><td>{results.ceilingCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Elektrība / Durvis</td><td>{results.extrasCost.mat.toFixed(0)} €</td><td>{results.extrasCost.work.toFixed(0)} €</td></tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
