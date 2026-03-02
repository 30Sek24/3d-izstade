import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

const PRICES = {
  points: {
    water: { name: 'Aukstā/Karstā ūdens punkts (Izlietne, veļasmašīna)', mat: 25, work: 35 },
    sewer: { name: 'Kanalizācijas punkts (50mm)', mat: 15, work: 20 },
    toilet: { name: 'Kanalizācijas stāvvada pieslēgums (110mm)', mat: 25, work: 45 },
  },
  installations: {
    faucet: { name: 'Jaucējkrāna montāža', mat: 0, work: 25 },
    toilet_bowl: { name: 'Klozetpoda montāža (Parastais)', mat: 0, work: 45 },
    built_in_toilet: { name: 'Iebūvējamā rāmja (Geberit) uzstādīšana', mat: 0, work: 85 },
    bath: { name: 'Vannas uzstādīšana un pieslēgšana', mat: 0, work: 90 },
    shower: { name: 'Duškabīnes montāža', mat: 0, work: 120 },
  }
};

export default function PlumbingCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    waterPoints: 3,
    sewerPoints: 3,
    toiletPoints: 1,
    faucets: 2,
    toilets: 1,
    builtInToilets: 0,
    baths: 1,
    showers: 0,
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

    // Punkti (Caurulvadu izbūve)
    const ptsMat = (params.waterPoints * PRICES.points.water.mat + params.sewerPoints * PRICES.points.sewer.mat + params.toiletPoints * PRICES.points.toilet.mat) * matMult;
    const ptsWork = (params.waterPoints * PRICES.points.water.work + params.sewerPoints * PRICES.points.sewer.work + params.toiletPoints * PRICES.points.toilet.work) * workMult;

    // Iekārtu montāža
    const instMat = 0; // Pieņemam, ka podus un vannas pērk pats klients, mēs rēķinām TIKAI montāžu
    const instWork = (
      params.faucets * PRICES.installations.faucet.work +
      params.toilets * PRICES.installations.toilet_bowl.work +
      params.builtInToilets * PRICES.installations.built_in_toilet.work +
      params.baths * PRICES.installations.bath.work +
      params.showers * PRICES.installations.shower.work
    ) * workMult;

    const totalMat = ptsMat + instMat;
    const totalWork = ptsWork + instWork;

    setResults({
      ptsCost: { mat: ptsMat, work: ptsWork },
      instCost: { mat: instMat, work: instWork },
      totalMat, totalWork, grandTotal: totalMat + totalWork, countryMultiplier: workMult
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Santehnikas Tāme</h1>
        <p>Caurulvadu vilkšana, izvadu izbūve un santehnikas iekārtu montāža.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#3b82f6' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Caurulvadu un izvadu (punktu) izbūve</h2>
            <div className="input-group-2">
              <label>Ūdens punkti (Izlietnes, dušas, veļasmašīnas)
                <input type="number" name="waterPoints" value={params.waterPoints} onChange={handleChange} min="0" />
              </label>
              <label>Kanalizācijas punkti (50mm)
                <input type="number" name="sewerPoints" value={params.sewerPoints} onChange={handleChange} min="0" />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Tualetes stāvvada pieslēgumi (110mm)
                <input type="number" name="toiletPoints" value={params.toiletPoints} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Santehnikas iekārtu montāža (Tīrais darbs)</h2>
            <div className="input-group-2">
              <label>Jaucējkrāni / Maisītāji
                <input type="number" name="faucets" value={params.faucets} onChange={handleChange} min="0" />
              </label>
              <label>Parastie klozetpodi
                <input type="number" name="toilets" value={params.toilets} onChange={handleChange} min="0" />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Iebūvējamie rāmji (Geberit u.c.)
                <input type="number" name="builtInToilets" value={params.builtInToilets} onChange={handleChange} min="0" />
              </label>
              <label>Vannas
                <input type="number" name="baths" value={params.baths} onChange={handleChange} min="0" />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Duškabīnes
                <input type="number" name="showers" value={params.showers} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#3b82f6', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#3b82f6' }}>
            <h3 className="results-title">Santehnikas Detalizācija</h3>
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">💧</div><p>Aizpildi datus un spied Sastādīt Tāmi</p></div>
            ) : (
              <>
                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Caurules/Mat.</th><th>Darbs</th></tr></thead>
                  <tbody>
                    <tr><td>Izvadu izbūve (Punkti)</td><td>{results.ptsCost.mat.toFixed(0)} €</td><td>{results.ptsCost.work.toFixed(0)} €</td></tr>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}><td>Iekārtu Montāža</td><td>-</td><td>{results.instCost.work.toFixed(0)} €</td></tr>
                  </tbody>
                  <tfoot className="table-totals">
                    <tr><td>KOPUMMĀ:</td><td className="text-blue">{results.totalMat.toFixed(0)} €</td><td className="text-orange">{results.totalWork.toFixed(0)} €</td></tr>
                  </tfoot>
                </table>
                <div className="grand-total-box" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                  <span className="gt-label">Santehnikas Tāme</span>
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