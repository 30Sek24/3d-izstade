import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Apkures sistēmas (Bāze EUR)
// ------------------------------------------------------------------

const PRICES = {
  sources: {
    air_water: { name: 'Gaiss-Ūdens Siltumsūknis (Panasonic/Daikin)', mat: 6500, work: 1200 },
    ground_source: { name: 'Ģeotermālais (Zemes) Siltumsūknis', mat: 9500, work: 4500 },
    gas_boiler: { name: 'Gāzes Kondensācijas Katls', mat: 1800, work: 600 },
    pellet_boiler: { name: 'Granulu Katls (Automātiskais)', mat: 3800, work: 1200 },
  },
  distribution: {
    underfloor: { name: 'Siltās grīdas (Caurules + Kolektors)', mat: 22, work: 18 },
    radiators: { name: 'Radiatoru sistēma (Tērauda / Alumīnija)', mat: 15, work: 12 },
    industrial: { name: 'Kaloriferi / Gaisa sildītāji', mat: 8, work: 5 },
  },
  add_ons: {
    automation: { name: 'Viedā vadība (Smart Home / WiFi)', price: 850 },
    buffer_tank: { name: 'Akumulācijas tvertne (500-1000L)', price: 1200 },
    solar_ready: { name: 'Saules kolektoru sagatave', price: 450 },
  }
};

export default function HeatingCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    area: 120,
    sourceType: 'air_water',
    distType: 'underfloor',
    includeAutomation: true,
    includeBuffer: false,
    includeSolar: false,
    floors: 1,
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

    const sourceRate = PRICES.sources[params.sourceType as keyof typeof PRICES.sources];
    const sourceCost = {
      mat: sourceRate.mat * matMult,
      work: sourceRate.work * workMult,
    };

    const distRate = PRICES.distribution[params.distType as keyof typeof PRICES.distribution];
    const distCost = {
      mat: (params.area * distRate.mat) * matMult,
      work: (params.area * distRate.work) * workMult,
    };

    let extrasCost = 0;
    if (params.includeAutomation) extrasCost += PRICES.add_ons.automation.price * matMult;
    if (params.includeBuffer) extrasCost += PRICES.add_ons.buffer_tank.price * matMult;
    if (params.includeSolar) extrasCost += PRICES.add_ons.solar_ready.price * matMult;

    const totalMat = sourceCost.mat + distCost.mat + extrasCost;
    const totalWork = sourceCost.work + distCost.work;
    const grandTotal = totalMat + totalWork;

    setResults({
      sourceCost,
      distCost,
      totalMat,
      totalWork,
      grandTotal,
      imageUrl: params.imageUrl,
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Apkures Sistēmu Tāme</h1>
        <p>Pilns energoefektivitātes aprēķins siltumsūkņiem, siltajām grīdām un automatizācijai.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          
          <section className="calc-section">
            <h2>🌍 Siltumtehnikas parametri</h2>
            <div className="input-group">
              <label>Reģions
                <select name="country" value={params.country} onChange={handleChange}>
                  {renderCountryOptions()}
                </select>
              </label>
              <div className="input-group-2" style={{ marginTop: '20px' }}>
                <label>Apkurināmā platība (m²)
                  <input type="number" name="area" value={params.area} onChange={handleChange} min="10" />
                </label>
                <label>Stāvu skaits
                  <input type="number" name="floors" value={params.floors} onChange={handleChange} min="1" />
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>🔥 Siltuma avots un sadale</h2>
            <div className="input-group">
              <label>Apkures iekārta
                <select name="sourceType" value={params.sourceType} onChange={handleChange}>
                  {Object.entries(PRICES.sources).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
              <label style={{ marginTop: '20px' }}>Siltuma sadales veids
                <select name="distType" value={params.distType} onChange={handleChange}>
                  {Object.entries(PRICES.distribution).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>⚙️ Komforta un efektivitātes opcijas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="includeAutomation" checked={params.includeAutomation} onChange={(e) => setParams({...params, includeAutomation: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                <span>Viedā telpu vadība (WiFi Termostati)</span>
              </label>
              <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="includeBuffer" checked={params.includeBuffer} onChange={(e) => setParams({...params, includeBuffer: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                <span>Akumulācijas tvertne sistēmai</span>
              </label>
              <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="includeSolar" checked={params.includeSolar} onChange={(e) => setParams({...params, includeSolar: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                <span>Saules kolektoru pieslēguma sagatave</span>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>📸 Objekta vizualizācija</h2>
            <div className="input-group">
              <label>Pievienot ēkas plānu vai bildi (URL)
                <input type="text" name="imageUrl" value={params.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/photo-1518005020480-309a9a0b232c" />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}>
            Aprēķināt Sistēmas Investīciju
          </button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Apkures Tāmes Detalizācija</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🌡️</div>
                <p>Izvēlieties platību un siltuma avotu</p>
              </div>
            ) : (
              <>
                <div style={{ 
                  marginBottom: '25px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', 
                  borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#fff' 
                }}>
                  Platība: <strong>{params.area} m²</strong> | Avots: <strong>{PRICES.sources[params.sourceType as keyof typeof PRICES.sources].name}</strong>
                </div>

                {results.imageUrl && (
                   <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.1)' }}>
                     <img src={results.imageUrl} style={{ width: '100%', display: 'block', transition: 'transform 0.3s' }} alt="Plāns" />
                   </div>
                )}

                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Pozīcija</th>
                      <th>Mat.</th>
                      <th>Darbs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Siltuma avota mezgls</td>
                      <td>{results.sourceCost.mat.toFixed(0)} €</td>
                      <td>{results.sourceCost.work.toFixed(0)} €</td>
                    </tr>
                    <tr>
                      <td>Siltuma sadales tīkli</td>
                      <td>{results.distCost.mat.toFixed(0)} €</td>
                      <td>{results.distCost.work.toFixed(0)} €</td>
                    </tr>
                  </tbody>
                </table>

                <div className="grand-total-box">
                  <span className="gt-label">Apkures Projekta Investīcija</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Summā iekļauta palaišana, regulēšana un garantija.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px' }}>
                  <button className="btn-glass" style={{ justifyContent: 'center' }}>PDF Eksports</button>
                  <button className="btn-glass" style={{ justifyContent: 'center', borderColor: 'var(--accent-blue)' }}>Konsultācija</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
