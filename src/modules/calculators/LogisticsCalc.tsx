import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';

const PRICES = {
  transport: {
    van: { name: 'Kravas mikroautobuss (līdz 1.5t)', rate: 60 }, // EUR par reisu
    truck: { name: 'Kravas auto ar manipulatoru (Fiskars)', rate: 120 }, // EUR par reisu
    heavy: { name: 'Lielgabarīta krava (Fūre)', rate: 250 }, // EUR par reisu
  },
  labor: {
    unloading: { name: 'Izkraušana ar rokām', rate: 45 }, // EUR par tonnu
    carrying: { name: 'Uznešana stāvā (bez lifta)', rate: 30 }, // EUR par tonnu par katru stāvu
  }
};

export default function LogisticsCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    fromAddress: 'Rīga, Ganību dambis',
    toAddress: 'Jūrmala, Dubulti',
    transportType: 'van',
    trips: 1,
    weightTons: 1.5,
    floorsUp: 0,
    needUnloading: true,
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

    const tRate = PRICES.transport[params.transportType as keyof typeof PRICES.transport].rate;
    const transportCost = params.trips * tRate * workMult;

    let unloadingCost = 0;
    let carryingCost = 0;

    if (params.needUnloading) {
      unloadingCost = params.weightTons * PRICES.labor.unloading.rate * workMult;
      carryingCost = params.weightTons * params.floorsUp * PRICES.labor.carrying.rate * workMult;
    }

    const totalWork = transportCost + unloadingCost + carryingCost;

    setResults({
      transportCost, unloadingCost, carryingCost, totalWork, grandTotal: totalWork
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Sagāde un Loģistika</h1>
        <p>Būvmateriālu piegāde, izkraušana un smags manuālais darbs objektā.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#f59e0b' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Maršruts un Transports</h2>
            <div className="input-group">
              <label>No kurienes (Iekraušana)
                <input type="text" name="fromAddress" value={params.fromAddress} onChange={handleChange} placeholder="Adrese vai veikals" />
              </label>
              <label>Uz kurieni (Objekts)
                <input type="text" name="toAddress" value={params.toAddress} onChange={handleChange} placeholder="Objekta adrese" />
              </label>
            </div>
            <div className="input-group" style={{ marginTop: '15px' }}>
              <label>Transportlīdzekļa tips
                <select name="transportType" value={params.transportType} onChange={handleChange}>
                  {Object.entries(PRICES.transport).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Reisu skaits
                <input type="number" name="trips" value={params.trips} onChange={handleChange} min="1" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Izkraušana un Manuāls darbs</h2>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>
                <input type="checkbox" name="needUnloading" checked={params.needUnloading} onChange={handleChange} style={{ width: '24px', height: '24px' }} />
                Nepieciešama izkraušana un uznešana
              </label>
              
              {params.needUnloading && (
                <div className="input-group-2">
                  <label>Kopējais svars (Tonnas)
                    <input type="number" name="weightTons" value={params.weightTons} onChange={handleChange} min="0" step="0.5" />
                  </label>
                  <label>Uznešana pa kāpnēm (stāvi)
                    <input type="number" name="floorsUp" value={params.floorsUp} onChange={handleChange} min="0" />
                  </label>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>* Manuāls darbs tiek rēķināts pēc tonnāžas un stāvu skaita, ievērojot darba drošības standartus.</p>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#f59e0b', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#f59e0b' }}>
            <h3 className="results-title">Loģistikas Detalizācija</h3>
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">🚚</div><p>Aizpildi datus un spied Sastādīt Tāmi</p></div>
            ) : (
              <>
                <div style={{ background: '#fffbeb', border: '1px dashed #fde68a', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
                  <strong>Maršruts:</strong><br/>
                  <span style={{color: '#92400e'}}>{params.fromAddress} → {params.toAddress}</span>
                </div>
                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Maksa</th></tr></thead>
                  <tbody>
                    <tr><td>Transports ({params.trips} reisi)</td><td>{results.transportCost.toFixed(0)} €</td></tr>
                    {params.needUnloading && (
                      <>
                        <tr><td>Izkraušana ({params.weightTons}t)</td><td>{results.unloadingCost.toFixed(0)} €</td></tr>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}><td>Uznešana ({params.floorsUp}. stāvs)</td><td>{results.carryingCost.toFixed(0)} €</td></tr>
                      </>
                    )}
                  </tbody>
                  <tfoot className="table-totals">
                    <tr><td>KOPUMMĀ:</td><td className="text-orange">{results.totalWork.toFixed(0)} €</td></tr>
                  </tfoot>
                </table>
                <div className="grand-total-box" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                  <span className="gt-label">LOĢISTIKAS CENA</span>
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
