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
    interior_std: { name: 'Iekšdurvis (Standarta MDF)', price: 150, install: 60 },
    interior_wood: { name: 'Iekšdurvis (Masīvkoks)', price: 350, install: 80 },
    exterior_metal: { name: 'Ārdurvis (Metāla/Drošības)', price: 450, install: 120 },
    exterior_pvc: { name: 'Ārdurvis (PVC stiklotas)', price: 600, install: 100 },
  },
  extras: {
    sill: { name: 'Palodzes (iekšējās un ārējās)', priceM: 15, installM: 10 },
    disposal: { name: 'Veco logu/durvju demontāža un utilizācija', priceUnit: 25 },
  }
};

export default function WindowsCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    windowArea: 10,
    windowType: 'pvc_premium',
    windowSillsLength: 15, // Palodžu garums
    doorsIntType: 'interior_std',
    doorsIntCount: 4,
    doorsExtType: 'exterior_metal',
    doorsExtCount: 1,
    needDisposal: true,
  });

  const [results, setResults] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'checkbox') finalValue = (e.target as HTMLInputElement).checked;
    else if (type === 'number') finalValue = parseFloat(value) || 0;
    
    setParams(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleCalculate = () => {
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;

    // Logi
    const wData = PRICES.windows[params.windowType as keyof typeof PRICES.windows];
    const winMat = params.windowArea * wData.priceM2 * matMult;
    const winWork = params.windowArea * wData.installM2 * workMult;

    // Palodzes
    const sillMat = params.windowSillsLength * PRICES.extras.sill.priceM * matMult;
    const sillWork = params.windowSillsLength * PRICES.extras.sill.installM * workMult;

    // Durvis
    const dIntData = PRICES.doors[params.doorsIntType as keyof typeof PRICES.doors];
    const dExtData = PRICES.doors[params.doorsExtType as keyof typeof PRICES.doors];
    
    const doorsMat = (params.doorsIntCount * dIntData.price + params.doorsExtCount * dExtData.price) * matMult;
    const doorsWork = (params.doorsIntCount * dIntData.install + params.doorsExtCount * dExtData.install) * workMult;

    // Demontāža
    const totalUnitsForDisposal = params.needDisposal ? (Math.ceil(params.windowArea / 1.5) + params.doorsIntCount + params.doorsExtCount) : 0;
    const dispWork = totalUnitsForDisposal * PRICES.extras.disposal.priceUnit * workMult;

    const totalMat = winMat + sillMat + doorsMat;
    const totalWork = winWork + sillWork + doorsWork + dispWork;

    setResults({
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
        <p>Logu izgatavošana, palodzes, durvju bloki un to pilna montāža.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#0ea5e9' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Logu bloki un palodzes</h2>
            <div className="input-group">
              <label>Kopējā logu platība (m²)
                <input type="number" name="windowArea" value={params.windowArea} onChange={handleChange} min="0" />
              </label>
              <label>Logu Profila Tips
                <select name="windowType" value={params.windowType} onChange={handleChange}>
                  {Object.entries(PRICES.windows).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Kopējais palodžu garums (m)
                <input type="number" name="windowSillsLength" value={params.windowSillsLength} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Durvis</h2>
            <div className="input-group-2">
              <label>Iekšdurvju tips
                <select name="doorsIntType" value={params.doorsIntType} onChange={handleChange}>
                  <option value="interior_std">{PRICES.doors.interior_std.name}</option>
                  <option value="interior_wood">{PRICES.doors.interior_wood.name}</option>
                </select>
              </label>
              <label>Skaits (gab)
                <input type="number" name="doorsIntCount" value={params.doorsIntCount} onChange={handleChange} min="0" />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Ārdurvju tips
                <select name="doorsExtType" value={params.doorsExtType} onChange={handleChange}>
                  <option value="exterior_metal">{PRICES.doors.exterior_metal.name}</option>
                  <option value="exterior_pvc">{PRICES.doors.exterior_pvc.name}</option>
                </select>
              </label>
              <label>Skaits (gab)
                <input type="number" name="doorsExtCount" value={params.doorsExtCount} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Demontāža</h2>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '1rem', color: '#0f172a' }}>
                <input type="checkbox" name="needDisposal" checked={params.needDisposal} onChange={handleChange} style={{ width: '24px', height: '24px' }} />
                Demontēt un izvest vecās konstrukcijas
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#0ea5e9', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#0ea5e9' }}>
            <h3 className="results-title">Būvniecības Specifikācija</h3>
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">🪟</div><p>Aizpildi datus un spied Sastādīt Tāmi</p></div>
            ) : (
              <>
                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Materiāli</th><th>Darbs</th></tr></thead>
                  <tbody>
                    <tr><td>Logu Konstrukcijas ({params.windowArea}m²)</td><td>{results.winCost.mat.toFixed(0)} €</td><td>{results.winCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Palodzes ({params.windowSillsLength}m)</td><td>{results.sillCost.mat.toFixed(0)} €</td><td>{results.sillCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Durvju Bloki</td><td>{results.doorsCost.mat.toFixed(0)} €</td><td>{results.doorsCost.work.toFixed(0)} €</td></tr>
                    {params.needDisposal && (
                      <tr style={{ borderBottom: '2px solid #e2e8f0' }}><td>Veco bloku demontāža</td><td>-</td><td>{results.dispWork.toFixed(0)} €</td></tr>
                    )}
                  </tbody>
                  <tfoot className="table-totals">
                    <tr><td>KOPUMMĀ:</td><td className="text-blue">{results.totalMat.toFixed(0)} €</td><td className="text-orange">{results.totalWork.toFixed(0)} €</td></tr>
                  </tfoot>
                </table>
                <div className="grand-total-box" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
                  <span className="gt-label">Logu un Durvju Tāme</span>
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