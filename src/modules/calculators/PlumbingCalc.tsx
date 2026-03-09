import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Santehnikas mezgli un darbi (Bāze EUR)
// ------------------------------------------------------------------

const PRICES = {
  // --- MEZGLI ---
  nodes: {
    bathroom_full: { name: 'Vannas istabas mezgls (Pilns)', mat: 450, work: 650 },
    toilet_full: { name: 'Tualetes mezgls (Pods + Izlietne)', mat: 280, work: 350 },
    kitchen_full: { name: 'Virtuves mezgls (Izlietne + Trauku mašīna)', mat: 180, work: 250 },
    boiler_standard: { name: 'Boileris (Elektriskais 80-100L)', mat: 350, work: 150 },
    boiler_advanced: { name: 'Siltā ūdens tvertne (Kombinētā 200L)', mat: 850, work: 350 },
  },

  // --- CAURUĻVADI (par metru) ---
  piping: {
    water_ppr: { name: 'Ūdensvads PPR (Lodējamais)', mat: 4.5, work: 8.0 },
    water_pex: { name: 'Ūdensvads PEX (Presējamais)', mat: 7.5, work: 12.0 },
    sewer_internal: { name: 'Kanalizācija (Iekšējā HT 50/110)', mat: 8.5, work: 15.0 },
    sewer_external: { name: 'Kanalizācija (Ārējā KG)', mat: 12.5, work: 25.0 },
  },

  // --- IEKĀRTAS ---
  fixtures: {
    toilet_wall: { name: 'Iebūvējamais pods (Rāmis + Poga)', mat: 320, work: 120 },
    shower_cabin: { name: 'Dušas kabīne / Stikls', mat: 450, work: 180 },
    bathtub: { name: 'Vanna (Akrila / Akmens)', mat: 600, work: 250 },
    faucet: { name: 'Ūdens maisītājs (Krāns)', mat: 85, work: 45 },
  },

  // --- SERVISI ---
  services: {
    pressure_test: { name: 'Sistēmas spiediena pārbaude', price: 150 },
    filters_standard: { name: 'Ūdens filtru sistēma (Mehāniskie)', price: 350 },
    water_softener: { name: 'Ūdens mīkstināšanas iekārta', price: 1200 },
  }
};

export default function PlumbingCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    bathrooms: 1,
    toilets: 1,
    kitchens: 1,
    pipeLength: 20,
    pipeType: 'water_pex',
    includeBoiler: true,
    boilerType: 'boiler_standard',
    includeFilters: false,
    includeSoftener: false,
    externalSewer: 10,
    
    // Vizuālie
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

    // 1. Mezglu izmaksas
    const nodesCost = {
      mat: (params.bathrooms * PRICES.nodes.bathroom_full.mat + 
            params.toilets * PRICES.nodes.toilet_full.mat + 
            params.kitchens * PRICES.nodes.kitchen_full.mat) * matMult,
      work: (params.bathrooms * PRICES.nodes.bathroom_full.work + 
             params.toilets * PRICES.nodes.toilet_full.work + 
             params.kitchens * PRICES.nodes.kitchen_full.work) * workMult,
    };

    // 2. Cauruļvadi
    const pipeRate = PRICES.piping[params.pipeType as keyof typeof PRICES.piping];
    const pipingCost = {
      mat: (params.pipeLength * pipeRate.mat + params.externalSewer * PRICES.piping.sewer_external.mat) * matMult,
      work: (params.pipeLength * pipeRate.work + params.externalSewer * PRICES.piping.sewer_external.work) * workMult,
    };

    // 3. Iekārtas (Boileri u.c.)
    let boilerMat = 0;
    let boilerWork = 0;
    if (params.includeBoiler) {
      const bData = PRICES.nodes[params.boilerType as keyof typeof PRICES.nodes];
      boilerMat = bData.mat * matMult;
      boilerWork = bData.work * workMult;
    }

    // 4. Papildus servisi
    let extrasCost = PRICES.services.pressure_test.price * workMult;
    if (params.includeFilters) extrasCost += PRICES.services.filters_standard.price * matMult;
    if (params.includeSoftener) extrasCost += PRICES.services.water_softener.price * matMult;

    const totalMat = nodesCost.mat + pipingCost.mat + boilerMat;
    const totalWork = nodesCost.work + pipingCost.work + boilerWork + extrasCost;
    const grandTotal = totalMat + totalWork;

    setResults({
      nodesCost,
      pipingCost,
      boilerCost: { mat: boilerMat, work: boilerWork },
      totalMat,
      totalWork,
      grandTotal,
      imageUrl: params.imageUrl,
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Santehnikas un Kanalizācijas Tāme</h1>
        <p>Pilna inženiertehniskā specifikācija vannas istabām, virtuvēm un ārējiem tīkliem.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#0ea5e9' }}>
            <h2>1. Objekta Mērogs</h2>
            <div className="input-group">
              <label>Reģions
                <select name="country" value={params.country} onChange={handleChange}>
                  {renderCountryOptions()}
                </select>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <label>Vannas ist.
                  <input type="number" name="bathrooms" value={params.bathrooms} onChange={handleChange} min="0" />
                </label>
                <label>Tualetes
                  <input type="number" name="toilets" value={params.toilets} onChange={handleChange} min="0" />
                </label>
                <label>Virtuves
                  <input type="number" name="kitchens" value={params.kitchens} onChange={handleChange} min="0" />
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Cauruļvadi un Kanalizācija</h2>
            <div className="input-group">
              <label>Iekšējo tīklu tips
                <select name="pipeType" value={params.pipeType} onChange={handleChange}>
                  {Object.entries(PRICES.piping).filter(([k]) => k.startsWith('water')).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <label>Iekšvadi (m)
                  <input type="number" name="pipeLength" value={params.pipeLength} onChange={handleChange} min="0" />
                </label>
                <label>Ārējā kan. (m)
                  <input type="number" name="externalSewer" value={params.externalSewer} onChange={handleChange} min="0" />
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Siltā ūdens padeve un filtrācija</h2>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input type="checkbox" name="includeBoiler" checked={params.includeBoiler} onChange={(e) => setParams({...params, includeBoiler: e.target.checked})} />
                Iekļaut Boileri / Akumulatoru
              </label>
              {params.includeBoiler && (
                <select name="boilerType" value={params.boilerType} onChange={handleChange}>
                  {Object.entries(PRICES.nodes).filter(([k]) => k.startsWith('boiler')).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="includeFilters" checked={params.includeFilters} onChange={(e) => setParams({...params, includeFilters: e.target.checked})} />
                Ūdens attīrīšanas filtri
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="includeSoftener" checked={params.includeSoftener} onChange={(e) => setParams({...params, includeSoftener: e.target.checked})} />
                Ūdens mīkstināšanas iekārta
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>4. Plānojuma vizualizācija</h2>
            <div className="input-group">
              <label>Pievienot projekta bildi (URL)
                <input type="text" name="imageUrl" value={params.imageUrl} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#0ea5e9' }}>Sastādīt Santehnikas Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Santehnikas Specifikācija</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🚰</div>
                <p>Norādiet punktu skaitu un metrāžu</p>
              </div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', background: 'rgba(14, 165, 233, 0.1)', borderColor: '#0ea5e9' }}>
                  Punkti: <strong>{params.bathrooms + params.toilets + params.kitchens} gab</strong> | Caurules: <strong>{params.pipeLength + params.externalSewer} m</strong>
                </div>

                {results.imageUrl && (
                   <img src={results.imageUrl} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} alt="Projekts" />
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
                      <td>Mezglu izbūve ({params.bathrooms + params.toilets + params.kitchens}p)</td>
                      <td>{results.nodesCost.mat.toFixed(0)} €</td>
                      <td>{results.nodesCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.nodesCost.mat + results.nodesCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>Cauruļvadu montāža</td>
                      <td>{results.pipingCost.mat.toFixed(0)} €</td>
                      <td>{results.pipingCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.pipingCost.mat + results.pipingCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    {params.includeBoiler && (
                      <tr>
                        <td>Siltā ūdens padeve</td>
                        <td>{results.boilerCost.mat.toFixed(0)} €</td>
                        <td>{results.boilerCost.work.toFixed(0)} €</td>
                        <td><strong>{(results.boilerCost.mat + results.boilerCost.work).toFixed(0)} €</strong></td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                  <span className="gt-label">Inženiertehniskās Izmaksas</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Summā iekļauts sistēmas spiediena tests un palīgmateriāli.</span>
                </div>

                <div className="action-buttons">
                  <button className="btn-primary" style={{ background: '#0ea5e9' }}>PDF Tāme</button>
                  <button className="btn-secondary">Pasūtīt Meistaru</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
