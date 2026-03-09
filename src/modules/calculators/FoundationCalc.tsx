import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Pamatu veidi, materiāli un zemes darbi (Bāze EUR)
// ------------------------------------------------------------------

const PRICES = {
  // --- PAMATU TIPI ---
  types: {
    strip: { name: 'Lentveida pamati (Monolītie)', mat: 85, work: 120 }, // par tek.m
    slab: { name: 'Siltinātā zviedru plātne (U-Plātne)', mat: 110, work: 95 }, // par m2
    pile: { name: 'Pāļu pamati (Urbtie / Dzītie)', mat: 145, work: 180 }, // par gab
    block: { name: 'Fibo / Betonbloku pamati', mat: 65, work: 85 }, // par tek.m
  },

  // --- ZEMES DARBI ---
  earthworks: {
    excavation: { name: 'Tranšeju rakšana / Bedres izstrāde', price: 15 }, // par m3
    sand_fill: { name: 'Smilts / Šķembu spilvens (ar blīvēšanu)', price: 28 }, // par m3
    soil_removal: { name: 'Grunts izvešana', price: 12 }, // par m3
  },

  // --- SILTINĀŠANA UN HIDRO ---
  insulation: {
    eps_100: { name: 'EPS 100 Siltinājums (100mm)', price: 18 }, // par m2
    xps: { name: 'XPS Ekstrudētais putuplasts (100mm)', price: 28 },
    membrane: { name: 'Hidroizolācijas membrāna / Bitumens', price: 12 },
  },

  // --- MATERIĀLU PAPILDUS ---
  concrete_m3: { name: 'Betons C25/30 ar sūkni', price: 135 },
  reinforcement_t: { name: 'Armatūra (Ø10-12mm)', price: 1250 },
};

export default function FoundationCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    area: 100,
    perimeter: 45,
    type: 'slab',
    depth: 1.2,
    includeExcavation: true,
    includeInsulation: true,
    insulationType: 'xps',
    soilType: 'sand', // sand, clay, rock
    imageUrl: '',
  });

  const [results, setResults] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCalculate = () => {
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;

    // 1. Pamatu pamata izmaksas
    const typeRate = PRICES.types[params.type as keyof typeof PRICES.types];
    const unitValue = params.type === 'slab' ? params.area : params.perimeter;
    
    const structureCost = {
      mat: (unitValue * typeRate.mat) * matMult,
      work: (unitValue * typeRate.work) * workMult,
    };

    // 2. Zemes darbi
    let earthworkCost = 0;
    if (params.includeExcavation) {
      const volume = (params.perimeter * 0.6 * params.depth); // aptuvenais apjoms
      earthworkCost = (volume * (PRICES.earthworks.excavation.price + PRICES.earthworks.sand_fill.price)) * workMult;
    }

    // 3. Siltināšana
    let insulationCost = 0;
    if (params.includeInsulation) {
      const insRate = PRICES.insulation[params.insulationType as keyof typeof PRICES.insulation];
      insulationCost = (params.area * insRate.price) * matMult;
    }

    const totalMat = structureCost.mat + insulationCost;
    const totalWork = structureCost.work + earthworkCost;
    const grandTotal = totalMat + totalWork;

    setResults({
      structureCost,
      earthworkCost,
      insulationCost,
      totalMat,
      totalWork,
      grandTotal,
      imageUrl: params.imageUrl,
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Pamatu Izbūves Tāme</h1>
        <p>Pilns nulles cikla aprēķins: zemes darbi, betonēšana, armēšana un hidroizolācija.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#64748b' }}>
            <h2>1. Objekta ģeometrija</h2>
            <div className="input-group">
              <label>Reģions
                <select name="country" value={params.country} onChange={handleChange}>
                  {renderCountryOptions()}
                </select>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <label>Pamatnes platība (m²)
                  <input type="number" name="area" value={params.area} onChange={handleChange} min="10" />
                </label>
                <label>Perimetrs (m)
                  <input type="number" name="perimeter" value={params.perimeter} onChange={handleChange} min="10" />
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Pamatu tips un dziļums</h2>
            <div className="input-group">
              <label>Konstrukcijas veids
                <select name="type" value={params.type} onChange={handleChange}>
                  {Object.entries(PRICES.types).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
              <label style={{ marginTop: '15px' }}>Pamatu dziļums (m)
                <input type="number" name="depth" value={params.depth} onChange={handleChange} step="0.1" min="0.4" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Papildus darbi un Siltināšana</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="includeExcavation" checked={params.includeExcavation} onChange={(e) => setParams({...params, includeExcavation: e.target.checked})} />
                Iekļaut zemes darbus un smilts spilvenu
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="includeInsulation" checked={params.includeInsulation} onChange={(e) => setParams({...params, includeInsulation: e.target.checked})} />
                Iekļaut siltināšanu (L-bloki / Plāksnes)
              </label>
              {params.includeInsulation && (
                <select name="insulationType" value={params.insulationType} onChange={handleChange} style={{ marginLeft: '34px', width: 'calc(100% - 34px)' }}>
                  {Object.entries(PRICES.insulation).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              )}
            </div>
          </section>

          <section className="calc-section">
            <h2>4. Grunts plāns / Foto</h2>
            <div className="input-group">
              <label>Objekta foto vai ģeodēzija (URL)
                <input type="text" name="imageUrl" value={params.imageUrl} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#64748b' }}>Ģenerēt Pamatu Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Nulles Cikla Specifikācija</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏗️</div>
                <p>Norādiet ēkas perimetru un tipu</p>
              </div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', background: 'rgba(100, 116, 139, 0.1)', borderColor: '#64748b' }}>
                  Tips: <strong>{PRICES.types[params.type as keyof typeof PRICES.types].name}</strong><br/>
                  Platība: <strong>{params.area} m²</strong> | Dziļums: <strong>{params.depth} m</strong>
                </div>

                {results.imageUrl && (
                   <img src={results.imageUrl} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} alt="Grunts" />
                )}

                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Pozīcija</th>
                      <th>Mat.</th>
                      <th>Darbs</th>
                      <th>Kopā</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pamatu konstrukcija</td>
                      <td>{results.structureCost.mat.toFixed(0)} €</td>
                      <td>{results.structureCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.structureCost.mat + results.structureCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    {params.includeExcavation && (
                      <tr>
                        <td>Zemes darbi & Spilvens</td>
                        <td>0 €</td>
                        <td>{results.earthworkCost.toFixed(0)} €</td>
                        <td><strong>{results.earthworkCost.toFixed(0)} €</strong></td>
                      </tr>
                    )}
                    {params.includeInsulation && (
                      <tr>
                        <td>Siltināšana ({params.insulationType.toUpperCase()})</td>
                        <td>{results.insulationCost.toFixed(0)} €</td>
                        <td>0 €</td>
                        <td><strong>{results.insulationCost.toFixed(0)} €</strong></td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #64748b, #334155)' }}>
                  <span className="gt-label">Pamatu Izbūves Investīcija</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Aprēķinā iekļauta betona sūkņa īre un veidņu montāža.</span>
                </div>

                <div className="action-buttons">
                  <button className="btn-primary" style={{ background: '#64748b' }}>Lejupielādēt Mezglus</button>
                  <button className="btn-secondary">Pieteikt Ģeodēziju</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
