import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

const PRICES = {
  windows: {
    pvc_standard: { name: 'PVC logi (2 stikli)', priceM2: 120, installM2: 30 },
    pvc_premium: { name: 'PVC logi (3 stikli, energoefektīvi)', priceM2: 180, installM2: 35 },
    alu: { name: 'Alumīnija logi', priceM2: 350, installM2: 50 },
    wood: { name: 'Koka logi', priceM2: 400, installM2: 50 },
  },
  doors: {
    interior_std: { name: 'Iekšdurvis (Standarta MDF)', priceBase: 150, install: 60 },
    interior_wood: { name: 'Iekšdurvis (Masīvkoks)', priceBase: 350, install: 80 },
    exterior_metal: { name: 'Ārdurvis (Metāla/Drošības)', priceBase: 450, install: 120 },
    exterior_pvc: { name: 'Ārdurvis (PVC stiklotas)', priceBase: 600, install: 100 },
  },
  extras: {
    sill: { name: 'Palodzes (iekšējās un ārējās)', priceM: 15, installM: 10 },
    disposal: { name: 'Veco logu/durvju demontāža un utilizācija', priceUnit: 25 },
  }
};

export default function WindowsCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    // Logu izmēri
    windowWidth: 1.5,
    windowHeight: 1.4,
    windowCount: 4,
    windowType: 'pvc_premium',
    windowSillsLength: 15,
    // Durvju izmēri
    doorWidth: 0.9,
    doorHeight: 2.1,
    doorsIntType: 'interior_std',
    doorsIntCount: 4,
    doorsExtType: 'exterior_metal',
    doorsExtCount: 1,
    needDisposal: true,
  });

  const [results, setResults] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;
    if (type === 'checkbox') finalValue = (e.target as HTMLInputElement).checked;
    else if (type === 'number') finalValue = parseFloat(value) || 0;
    setParams(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleCalculate = () => {
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;

    // Logi
    const windowAreaTotal = params.windowWidth * params.windowHeight * params.windowCount;
    const wData = PRICES.windows[params.windowType as keyof typeof PRICES.windows];
    const winMat = windowAreaTotal * wData.priceM2 * matMult;
    const winWork = windowAreaTotal * wData.installM2 * workMult;

    // Palodzes
    const sillMat = params.windowSillsLength * PRICES.extras.sill.priceM * matMult;
    const sillWork = params.windowSillsLength * PRICES.extras.sill.installM * workMult;

    // Durvis (ar izmēra koeficientu pret standartu 0.9x2.1 = 1.89m2)
    const standardDoorArea = 1.89;
    const actualDoorArea = params.doorWidth * params.doorHeight;
    const sizeMult = actualDoorArea / standardDoorArea;

    const dIntData = PRICES.doors[params.doorsIntType as keyof typeof PRICES.doors];
    const dExtData = PRICES.doors[params.doorsExtType as keyof typeof PRICES.doors];
    
    const doorsMat = (params.doorsIntCount * dIntData.priceBase * sizeMult + params.doorsExtCount * dExtData.priceBase * sizeMult) * matMult;
    const doorsWork = (params.doorsIntCount * dIntData.install + params.doorsExtCount * dExtData.install) * workMult;

    // Demontāža
    const totalUnitsForDisposal = params.needDisposal ? (params.windowCount + params.doorsIntCount + params.doorsExtCount) : 0;
    const dispWork = totalUnitsForDisposal * PRICES.extras.disposal.priceUnit * workMult;

    const totalMat = winMat + sillMat + doorsMat;
    const totalWork = winWork + sillWork + doorsWork + dispWork;

    setResults({
      windowAreaTotal,
      doorArea: actualDoorArea,
      winCost: { mat: winMat, work: winWork },
      sillCost: { mat: sillMat, work: sillWork },
      doorsCost: { mat: doorsMat, work: doorsWork },
      dispWork,
      totalMat, totalWork, grandTotal: totalMat + totalWork
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Logu un Durvju Tāme</h1>
        <p>Precīza izmēru specifikācija logiem un durvīm ar Eiropas reģionu cenām.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ borderLeftColor: '#0ea5e9' }}>
            <h2>1. Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange}>{renderCountryOptions()}</select>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Logu izmēri un tips</h2>
            <div className="input-group-2">
              <label>Loga Platums (m)
                <input type="number" name="windowWidth" value={params.windowWidth} onChange={handleChange} step="0.05" />
              </label>
              <label>Loga Augstums (m)
                <input type="number" name="windowHeight" value={params.windowHeight} onChange={handleChange} step="0.05" />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Logu skaits (gab)
                <input type="number" name="windowCount" value={params.windowCount} onChange={handleChange} />
              </label>
              <label>Profila Tips
                <select name="windowType" value={params.windowType} onChange={handleChange}>
                  {Object.entries(PRICES.windows).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Durvju izmēri un tips</h2>
            <div className="input-group-2">
              <label>Durvju Platums (m)
                <input type="number" name="doorWidth" value={params.doorWidth} onChange={handleChange} step="0.05" />
              </label>
              <label>Durvju Augstums (m)
                <input type="number" name="doorHeight" value={params.doorHeight} onChange={handleChange} step="0.05" />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Iekšdurvis (gab)
                <input type="number" name="doorsIntCount" value={params.doorsIntCount} onChange={handleChange} />
              </label>
              <label>Ārdurvis (gab)
                <input type="number" name="doorsExtCount" value={params.doorsExtCount} onChange={handleChange} />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#0ea5e9', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        {/* REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#0ea5e9' }}>
            <h3 className="results-title">Montāžas Specifikācija</h3>
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">🪟</div><p>Ievadiet izmērus un aprēķiniet</p></div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', background: '#f0f9ff' }}>
                  Kopējā logu platība: <strong>{results.windowAreaTotal.toFixed(2)} m²</strong><br/>
                  Durvju specifikācija: <strong>{params.doorWidth} x {params.doorHeight} m</strong>
                </div>
                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Materiāli</th><th>Darbs</th></tr></thead>
                  <tbody>
                    <tr><td>Logu Konstrukcijas</td><td>{results.winCost.mat.toFixed(0)} €</td><td>{results.winCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Durvju Bloki</td><td>{results.doorsCost.mat.toFixed(0)} €</td><td>{results.doorsCost.work.toFixed(0)} €</td></tr>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}><td>Demontāža / Utilizācija</td><td>-</td><td>{results.dispWork.toFixed(0)} €</td></tr>
                  </tbody>
                </table>
                <div className="grand-total-box" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
                  <span className="gt-label">KOPĒJĀ SUMMA</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
