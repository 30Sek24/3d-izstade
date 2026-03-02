import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

const PRICES = {
  projects: {
    sketch: { name: 'Skiču projekts (Plānojums)', work: 15 }, // /m2
    tech: { name: 'Tehniskais projekts (Elektrība, santehnika)', work: 25 }, // /m2
    full: { name: 'Pilns Dizaina projekts (Ar materiālu specifikāciju)', work: 45 }, // /m2
  },
  visualizations: {
    pricePerRoom: 250 // EUR par vienas telpas 3D vizualizāciju
  },
  supervision: {
    pricePerMonth: 500 // Autoruzraudzība
  }
};

export default function DesignerCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    area: 80,
    projectType: 'tech',
    visRooms: 2,
    supervisionMonths: 0,
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

    const projRate = PRICES.projects[params.projectType as keyof typeof PRICES.projects].work;
    const projWork = params.area * projRate * workMult;
    
    const visWork = params.visRooms * PRICES.visualizations.pricePerRoom * workMult;
    const supWork = params.supervisionMonths * PRICES.supervision.pricePerMonth * workMult;

    const totalWork = projWork + visWork + supWork;

    setResults({
      projWork, visWork, supWork, totalWork, grandTotal: totalWork, countryMultiplier: workMult
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Interjera Dizaina Tāme</h1>
        <p>Telpu plānošana, tehniskie rasējumi un 3D vizualizācijas.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#a855f7' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Projekta Apjoms</h2>
            <div className="input-group">
              <label>Telpu kopējā platība (m²)
                <input type="number" name="area" value={params.area} onChange={handleChange} min="10" />
              </label>
              <label>Projekta detalizācija
                <select name="projectType" value={params.projectType} onChange={handleChange}>
                  {Object.entries(PRICES.projects).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Ekstras</h2>
            <div className="input-group-2">
              <label>3D Vizualizācijas (telpu skaits)
                <input type="number" name="visRooms" value={params.visRooms} onChange={handleChange} min="0" />
              </label>
              <label>Autoruzraudzība (mēneši)
                <input type="number" name="supervisionMonths" value={params.supervisionMonths} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#a855f7', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#a855f7' }}>
            <h3 className="results-title">Dizaina Pakalpojumi</h3>
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">🎨</div><p>Aizpildi datus un spied Sastādīt Tāmi</p></div>
            ) : (
              <>
                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Maksa (Darbs)</th></tr></thead>
                  <tbody>
                    <tr><td>Projekta izstrāde ({params.area}m²)</td><td>{results.projWork.toFixed(0)} €</td></tr>
                    <tr><td>3D Vizualizācijas ({params.visRooms} gab)</td><td>{results.visWork.toFixed(0)} €</td></tr>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}><td>Autoruzraudzība</td><td>{results.supWork.toFixed(0)} €</td></tr>
                  </tbody>
                </table>
                <div className="grand-total-box" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
                  <span className="gt-label">Dizainera Honorārs</span>
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