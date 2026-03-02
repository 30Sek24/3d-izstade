import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

const PRICES = {
  type: {
    slab: { name: 'Zviedru plātne (Siltināta)', mat: 80, work: 50 }, // per m2
    strip: { name: 'Lentveida pamati', mat: 60, work: 45 }, // per m2
    pile: { name: 'Dzenamie pāļi (Dzelzsbetona)', mat: 40, work: 35 }, // per m2
    screw: { name: 'Skrūvpāļi', mat: 25, work: 20 }, // per m2
  },
  depth: {
    standard: { name: 'Standarta (1.2m)', mult: 1.0 },
    deep: { name: 'Padziļināti (Nestabilai gruntij)', mult: 1.3 },
  }
};

export default function FoundationCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    area: 120,
    type: 'slab',
    depth: 'standard',
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

    const area = params.area;
    const typeData = PRICES.type[params.type as keyof typeof PRICES.type];
    const depthMult = PRICES.depth[params.depth as keyof typeof PRICES.depth].mult;

    const concreteVolume = params.type === 'slab' ? area * 0.25 : params.type === 'strip' ? area * 0.15 : 0;

    const totalMat = area * typeData.mat * depthMult * matMult;
    const totalWork = area * typeData.work * depthMult * workMult;

    setResults({
      totalMat, totalWork, 
      grandTotal: totalMat + totalWork,
      concreteVolume
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>Pamatu Būvniecības Tāme</h1>
        <p>Monolīta betona, skrūvpāļu un dzenamo pāļu pamatu izmaksas.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">

          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#94a3b8' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Apbūves Laukums</h2>
            <div className="input-group">
              <label>Pamatu platība (m²)
                <input type="number" name="area" value={params.area} onChange={handleChange} min="20" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Tehnoloģija</h2>
            <div className="input-group">
              <label>Pamatu tips
                <select name="type" value={params.type} onChange={handleChange}>
                  {Object.entries(PRICES.type).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Grīts specifika
                <select name="depth" value={params.depth} onChange={handleChange}>
                  {Object.entries(PRICES.depth).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ marginTop: '20px', background: '#64748b' }}>Sastādīt Tāmi</button>
        </div>

        {/* REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#64748b' }}>
            <h3 className="results-title">Pamatu Tāme</h3>
            {!results ? (
               <div className="empty-state"><div className="empty-state-icon">🏗️</div><p>Aizpildi datus un ģenerē tāmi</p></div>
            ) : (
              <>
                {results.concreteVolume > 0 && (
                  <div className="geom-summary" style={{ marginBottom: '20px' }}>
                    Orientējošais betona apjoms: <strong>{results.concreteVolume.toFixed(1)} m³</strong>
                  </div>
                )}
                <table className="results-table">
                  <thead><tr><th>Materiāli</th><th>Darbs</th></tr></thead>
                  <tbody>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <td>{results.totalMat.toFixed(0)} €</td>
                      <td>{results.totalWork.toFixed(0)} €</td>
                    </tr>
                  </tbody>
                </table>
                <div className="grand-total-box" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
                  <span className="gt-label">Kopējā Pamatu Cena</span>
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