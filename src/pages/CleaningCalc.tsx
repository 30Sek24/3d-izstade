import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

const PRICES = {
  types: {
    post_construction: { name: 'Pēcremonta uzkopšana (Lielie putekļi, krāsas traipi)', work: 4.5, mat: 0.5 }, // /m2
    general: { name: 'Ģenerāltīrīšana (Pavasara tīrīšana)', work: 3.5, mat: 0.3 }, // /m2
    regular: { name: 'Standarta uzturēšanas tīrīšana', work: 1.5, mat: 0.1 }, // /m2
  },
  extras: {
    windows: { name: 'Logu mazgāšana', work: 2.5, mat: 0.2 }, // /m2 stikla platība
    furniture: { name: 'Mīksto mēbeļu ķīmiskā tīrīšana', work: 35, mat: 5 }, // /gab
  }
};

export default function CleaningCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    area: 100,
    cleanType: 'post_construction',
    windowArea: 15,
    furnitureCount: 0,
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

    const typeRate = PRICES.types[params.cleanType as keyof typeof PRICES.types];
    const baseMat = params.area * typeRate.mat * matMult;
    const baseWork = params.area * typeRate.work * workMult;

    const winMat = params.windowArea * PRICES.extras.windows.mat * matMult;
    const winWork = params.windowArea * PRICES.extras.windows.work * workMult;

    const furnMat = params.furnitureCount * PRICES.extras.furniture.mat * matMult;
    const furnWork = params.furnitureCount * PRICES.extras.furniture.work * workMult;

    const totalMat = baseMat + winMat + furnMat;
    const totalWork = baseWork + winWork + furnWork;

    setResults({
      baseCost: { mat: baseMat, work: baseWork },
      winCost: { mat: winMat, work: winWork },
      furnCost: { mat: furnMat, work: furnWork },
      totalMat, totalWork, grandTotal: totalMat + totalWork
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Uzkopšanas Serviss</h1>
        <p>Pēcremonta un ģenerāltīrīšanas izmaksu aprēķins.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#10b981' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Telpas Platība un Pakalpojums</h2>
            <div className="input-group">
              <label>Kopējā uzkopjamā platība (m²)
                <input type="number" name="area" value={params.area} onChange={handleChange} min="10" />
              </label>
              <label>Tīrīšanas tips
                <select name="cleanType" value={params.cleanType} onChange={handleChange}>
                  {Object.entries(PRICES.types).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Ekstras</h2>
            <div className="input-group-2">
              <label>Logu platība (m²)
                <input type="number" name="windowArea" value={params.windowArea} onChange={handleChange} min="0" />
              </label>
              <label>Mēbeļu ķīmiskā tīr. (gab)
                <input type="number" name="furnitureCount" value={params.furnitureCount} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#10b981', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#10b981' }}>
            <h3 className="results-title">Uzkopšanas Izmaksas</h3>
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">✨</div><p>Aizpildi datus un spied Sastādīt Tāmi</p></div>
            ) : (
              <>
                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Līdzekļi</th><th>Darbs</th></tr></thead>
                  <tbody>
                    <tr><td>Telpu uzkopšana</td><td>{results.baseCost.mat.toFixed(0)} €</td><td>{results.baseCost.work.toFixed(0)} €</td></tr>
                    <tr><td>Logu mazgāšana</td><td>{results.winCost.mat.toFixed(0)} €</td><td>{results.winCost.work.toFixed(0)} €</td></tr>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}><td>Dīvāni/Matrači</td><td>{results.furnCost.mat.toFixed(0)} €</td><td>{results.furnCost.work.toFixed(0)} €</td></tr>
                  </tbody>
                  <tfoot className="table-totals">
                    <tr><td>KOPUMMĀ:</td><td className="text-blue">{results.totalMat.toFixed(0)} €</td><td className="text-orange">{results.totalWork.toFixed(0)} €</td></tr>
                  </tfoot>
                </table>
                <div className="grand-total-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <span className="gt-label">Kopējās Izmaksas</span>
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