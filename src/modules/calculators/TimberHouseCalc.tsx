import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Koka māju tipi, siltinājums un apdare (Bāze EUR)
// ------------------------------------------------------------------

const PRICES = {
  // --- KONSTRUKCIJAS VEIDS ---
  structures: {
    frame_standard: { name: 'Koka karkass (C24, 150mm)', mat: 85, work: 65 }, // par m2 (sienas)
    frame_premium: { name: 'Koka karkass (C24, 200mm+)', mat: 120, work: 85 },
    clt: { name: 'CLT Paneļi (Cross Laminated Timber)', mat: 280, work: 120 },
    log_glued: { name: 'Līmētas brusas guļbūve', mat: 220, work: 150 },
  },

  // --- SILTINĀJUMS ---
  insulation: {
    mineral_wool: { name: 'Minerālvate (Knauf/Paroc)', price: 25 }, // par m2
    steico: { name: 'Kokšķiedras vate (Steico)', price: 45 },
    ecowool: { name: 'Ekovate (Iepūšamā)', price: 35 },
  },

  // --- ĀRĒJĀ APDARE ---
  cladding: {
    wood_painted: { name: 'Koka dēļu apdare (Krāsota)', mat: 22, work: 28 },
    wood_burnt: { name: 'Dedzināta koka dēļi (Shou Sugi Ban)', mat: 55, work: 35 },
    cement_board: { name: 'Cementšķiedras paneļi (Cedral)', mat: 45, work: 45 },
  },

  // --- JUMTA KONSTRUKCIJA (Koka mājai) ---
  roof_truss: { name: 'Koka kopņu sistēma', price: 45 }, // par m2 (horizontāli)
};

export default function TimberHouseCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    livingArea: 100,
    floors: 1,
    structType: 'frame_standard',
    insulType: 'mineral_wool',
    cladType: 'wood_painted',
    includeTrusses: true,
    energyClass: 'A+',
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

    // Aprēķina koeficienti (Sienu laukums pret dzīvojamo platību ~1.5x - 2.5x)
    const wallArea = params.livingArea * 1.8;

    // 1. Karkass / Sienas
    const struct = PRICES.structures[params.structType as keyof typeof PRICES.structures];
    const structCost = {
      mat: (wallArea * struct.mat) * matMult,
      work: (wallArea * struct.work) * workMult,
    };

    // 2. Siltinājums
    const insul = PRICES.insulation[params.insulType as keyof typeof PRICES.insulation];
    const energyMult = params.energyClass === 'A++' ? 1.4 : 1.0;
    const insulCost = {
      mat: (wallArea * insul.price * energyMult) * matMult,
      work: (wallArea * 15) * workMult,
    };

    // 3. Apdare
    const clad = PRICES.cladding[params.cladType as keyof typeof PRICES.cladding];
    const cladCost = {
      mat: (wallArea * clad.mat) * matMult,
      work: (wallArea * clad.work) * workMult,
    };

    // 4. Jumta kopnes
    let roofCost = 0;
    if (params.includeTrusses) {
      roofCost = (params.livingArea * PRICES.roof_truss.price) * matMult;
    }

    const totalMat = structCost.mat + insulCost.mat + cladCost.mat + roofCost;
    const totalWork = structCost.work + insulCost.work + cladCost.work;
    const grandTotal = totalMat + totalWork;

    setResults({
      structCost,
      insulCost,
      cladCost,
      totalMat,
      totalWork,
      grandTotal,
      wallArea,
      imageUrl: params.imageUrl,
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Koka Māju Konstrukciju Tāme</h1>
        <p>Ekoloģisku un energoefektīvu koka ēku karkasa un apdares aprēķins.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#22c55e' }}>
            <h2>1. Dzīvojamās platības parametri</h2>
            <div className="input-group">
              <label>Reģions
                <select name="country" value={params.country} onChange={handleChange}>
                  {renderCountryOptions()}
                </select>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <label>Platība (m²)
                  <input type="number" name="livingArea" value={params.livingArea} onChange={handleChange} min="20" />
                </label>
                <label>Energo klase
                  <select name="energyClass" value={params.energyClass} onChange={handleChange}>
                    <option value="A">A klase</option>
                    <option value="A+">A+ klase</option>
                    <option value="A++">A++ (Pasīvā)</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Konstrukcijas un Siltinājums</h2>
            <div className="input-group">
              <label>Karkasa tips
                <select name="structType" value={params.structType} onChange={handleChange}>
                  {Object.entries(PRICES.structures).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
              <label style={{ marginTop: '15px' }}>Siltumizolācija
                <select name="insulType" value={params.insulType} onChange={handleChange}>
                  {Object.entries(PRICES.insulation).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Ārējā Apdare un Jumts</h2>
            <div className="input-group">
              <label>Fasādes apdare
                <select name="cladType" value={params.cladType} onChange={handleChange}>
                  {Object.entries(PRICES.cladding).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                <input type="checkbox" name="includeTrusses" checked={params.includeTrusses} onChange={(e) => setParams({...params, includeTrusses: e.target.checked})} />
                Iekļaut rūpnieciski ražotas jumta kopnes
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>4. Arhitektūras vizualizācija</h2>
            <div className="input-group">
              <label>Projekta vizualizācijas URL
                <input type="text" name="imageUrl" value={params.imageUrl} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#22c55e' }}>Ģenerēt Koka Mājas Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Koka Konstrukciju Specifikācija</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🌲</div>
                <p>Izvēlieties platību un konstrukciju tipu</p>
              </div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', background: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' }}>
                  Platība: <strong>{params.livingArea} m²</strong> | Sienas: <strong>~{results.wallArea.toFixed(0)} m²</strong><br/>
                  Siltinājums: <strong>{PRICES.insulation[params.insulType as keyof typeof PRICES.insulation].name}</strong>
                </div>

                {results.imageUrl && (
                   <img src={results.imageUrl} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} alt="Mājas projekts" />
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
                      <td>Nesošais karkass / CLT</td>
                      <td>{results.structCost.mat.toFixed(0)} €</td>
                      <td>{results.structCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.structCost.mat + results.structCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>Siltinājuma slānis</td>
                      <td>{results.insulCost.mat.toFixed(0)} €</td>
                      <td>{results.insulCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.insulCost.mat + results.insulCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>Fasādes apdare ({params.cladType.replace('_', ' ')})</td>
                      <td>{results.cladCost.mat.toFixed(0)} €</td>
                      <td>{results.cladCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.cladCost.mat + results.cladCost.work).toFixed(0)} €</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                  <span className="gt-label">Konstrukciju Komplekta Izmaksas</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Cenā ietilpst visi karkasa stiprinājumi, hermetizācija un kopnes.</span>
                </div>

                <div className="action-buttons">
                  <button className="btn-primary" style={{ background: '#22c55e' }}>Saņemt Mezglu Rasējumus</button>
                  <button className="btn-secondary">Konsultēties ar Inženieri</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
