import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

const PRICES = {
  fixes: {
    cosmetic: { name: 'Sīki krāsojuma defekti / špaktele (vietējā labošana)', work: 45 },
    electrical: { name: 'Rozetes / slēdža / lampas nomaiņa (gab)', work: 20 },
    plumbing: { name: 'Pilna krāna / sifona / poda mehānisma maiņa', work: 50 },
    furniture: { name: 'Eņģu, rokturu, durtiņu pieregulēšana', work: 35 },
    silicone: { name: 'Silikona šuvju pārvilkšana vannasistabā', work: 60 },
  },
  urgency: {
    standard: { name: 'Standarta (Tuvāko dienu laikā)', mult: 1.0 },
    express: { name: 'Ekspress 24H laikā!', mult: 1.5 },
  }
};

export default function QuickFixCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    urgency: 'standard',
    qtyCosmetic: 0,
    qtyElectrical: 0,
    qtyPlumbing: 0,
    qtyFurniture: 0,
    qtySilicone: 0,
  });

  const [results, setResults] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;
    if (type === 'number') finalValue = parseFloat(value) || 0;
    
    setParams(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleCalculate = () => {
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const urgencyMult = PRICES.urgency[params.urgency as keyof typeof PRICES.urgency].mult;

    const costCosmetic = params.qtyCosmetic * PRICES.fixes.cosmetic.work * workMult * urgencyMult;
    const costElectrical = params.qtyElectrical * PRICES.fixes.electrical.work * workMult * urgencyMult;
    const costPlumbing = params.qtyPlumbing * PRICES.fixes.plumbing.work * workMult * urgencyMult;
    const costFurniture = params.qtyFurniture * PRICES.fixes.furniture.work * workMult * urgencyMult;
    const costSilicone = params.qtySilicone * PRICES.fixes.silicone.work * workMult * urgencyMult;

    const totalWork = costCosmetic + costElectrical + costPlumbing + costFurniture + costSilicone;
    // Bāzes izsaukuma maksa, ja summa ir pārāk maza
    const callOutFee = totalWork > 0 && totalWork < 50 ? (50 - totalWork) : 0; 
    const grandTotal = totalWork + callOutFee;

    setResults({
      costCosmetic, costElectrical, costPlumbing, costFurniture, costSilicone,
      callOutFee, grandTotal, totalWork
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>Uzfrišināšana 24H Laikā</h1>
        <p>Sīko defektu novēršana, vizuālais remonts un sagatavošana pārdošanai/īrei ĀTRI.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">

          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#f43f5e' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Ātrums</h2>
            <div className="input-group">
              <select name="urgency" value={params.urgency} onChange={handleChange} style={{ borderColor: params.urgency === 'express' ? '#f43f5e' : '#cbd5e1' }}>
                {Object.entries(PRICES.urgency).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Defektu Saraksts (Norādi skaitu)</h2>
            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Caurumi sienā, traipi, sīki špakteles darbi (vietas)</span>
                <input type="number" name="qtyCosmetic" value={params.qtyCosmetic} onChange={handleChange} min="0" style={{ width: '80px' }} />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Nestrādājošas rozetes / slēdži / lampas (gab)</span>
                <input type="number" name="qtyElectrical" value={params.qtyElectrical} onChange={handleChange} min="0" style={{ width: '80px' }} />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Tekoši krāni / trubas / podi (gab)</span>
                <input type="number" name="qtyPlumbing" value={params.qtyPlumbing} onChange={handleChange} min="0" style={{ width: '80px' }} />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Sašķiebušās mēbeļu durtiņas / eņģes (gab)</span>
                <input type="number" name="qtyFurniture" value={params.qtyFurniture} onChange={handleChange} min="0" style={{ width: '80px' }} />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Vannasistabas silikona šuvju maiņa (telpas)</span>
                <input type="number" name="qtySilicone" value={params.qtySilicone} onChange={handleChange} min="0" style={{ width: '80px' }} />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#f43f5e', marginTop: '20px' }}>Aprēķināt Izmaksas</button>
        </div>

        {/* REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#f43f5e' }}>
            <h3 className="results-title">Remonta Tāme</h3>
            {!results ? (
               <div className="empty-state"><div className="empty-state-icon">🛠️</div><p>Saskaiti defektus un ģenerē tāmi</p></div>
            ) : (
              <>
                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Maksa</th></tr></thead>
                  <tbody>
                    {results.costCosmetic > 0 && <tr><td>Kosmētiskais remonts</td><td>{results.costCosmetic.toFixed(0)} €</td></tr>}
                    {results.costElectrical > 0 && <tr><td>Elektriķa darbi</td><td>{results.costElectrical.toFixed(0)} €</td></tr>}
                    {results.costPlumbing > 0 && <tr><td>Santehnikas labojumi</td><td>{results.costPlumbing.toFixed(0)} €</td></tr>}
                    {results.costFurniture > 0 && <tr><td>Mēbeļu regulēšana</td><td>{results.costFurniture.toFixed(0)} €</td></tr>}
                    {results.costSilicone > 0 && <tr><td>Silikona šuves</td><td>{results.costSilicone.toFixed(0)} €</td></tr>}
                    {results.callOutFee > 0 && <tr style={{ color: '#64748b' }}><td>Minimālā izsaukuma piemaksa</td><td>{results.callOutFee.toFixed(0)} €</td></tr>}
                  </tbody>
                </table>
                <div className="grand-total-box" style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
                  <span className="gt-label">"Uzfrišināšanas" Summa</span>
                  <span className="gt-value" style={{ color: '#e11d48' }}>{results.grandTotal.toFixed(0)} €</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
