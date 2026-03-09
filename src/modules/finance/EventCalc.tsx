import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function EventCalc() {
  const [activeTab, setActiveTab] = useState('mass'); // 'mass' or 'premium'
  const [params, setParams] = useState({
    ticketPrice: 10,
    attendees: 500,
    premiumPrice: 100,
    premiumUnits: 100,
    sponsorBudget: 0,
    merchRevenue: 0,
    costPerPerson: 2,
    fixedCosts: 1500,
  });

  const [results, setResults] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const ticketTotal = activeTab === 'mass' ? params.ticketPrice * params.attendees : params.premiumPrice * params.premiumUnits;
    const grossRevenue = ticketTotal + params.sponsorBudget + params.merchRevenue;
    const variableCosts = (activeTab === 'mass' ? params.attendees : params.premiumUnits) * params.costPerPerson;
    const totalExpenses = params.fixedCosts + variableCosts;
    const netProfit = grossRevenue - totalExpenses;

    setResults({
      ticketTotal,
      grossRevenue,
      totalExpenses,
      netProfit,
      margin: ((netProfit / grossRevenue) * 100).toFixed(1),
      isGoalReached: ticketTotal >= 10000
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>Monetizācijas Stratēģija</h1>
        <p>Izvēlieties starp masu mēroga pasākumu vai ekskluzīvu digitālo aktīvu pārdošanu.</p>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          <button onClick={() => setActiveTab('mass')} style={{ padding: '15px 30px', borderRadius: '12px', background: activeTab === 'mass' ? '#10b981' : '#1e293b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800 }}>MASU (10€ x 500)</button>
          <button onClick={() => setActiveTab('premium')} style={{ padding: '15px 30px', borderRadius: '12px', background: activeTab === 'premium' ? '#8b5cf6' : '#1e293b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800 }}>PREMIUM (100€ x 100)</button>
        </div>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ borderLeftColor: activeTab === 'mass' ? '#10b981' : '#8b5cf6' }}>
            <h2>{activeTab === 'mass' ? '1. Biļešu tirdzniecība' : '1. Ekskluzīvie Aktīvi'}</h2>
            <div className="input-group">
              {activeTab === 'mass' ? (
                <>
                  <label>Biļetes cena (€)
                    <input type="number" name="ticketPrice" value={params.ticketPrice} onChange={handleChange} />
                  </label>
                  <label style={{ marginTop: '15px' }}>Apmeklētāju skaits
                    <input type="number" name="attendees" value={params.attendees} onChange={handleChange} />
                  </label>
                </>
              ) : (
                <>
                  <label>Vienības cena (€)
                    <input type="number" name="premiumPrice" value={params.premiumPrice} onChange={handleChange} />
                  </label>
                  <label style={{ marginTop: '15px' }}>Pārdotais skaits
                    <input type="number" name="premiumUnits" value={params.premiumUnits} onChange={handleChange} />
                  </label>
                </>
              )}
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Izmaksu daļa</h2>
            <div className="input-group">
              <label>Fiksētās izmaksas (Īre, Tehnika)
                <input type="number" name="fixedCosts" value={params.fixedCosts} onChange={handleChange} />
              </label>
              <label style={{ marginTop: '15px' }}>Mainīgās izmaksas (uz 1 cilv.)
                <input type="number" name="costPerPerson" value={params.costPerPerson} onChange={handleChange} />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#10b981' }}>Aprēķināt Peļņu</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Finanšu Rezultāts</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <p>Ievadiet datus, lai redzētu prognozi.</p>
              </div>
            ) : (
              <>
                <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <span className="gt-label">Neto Peļņa</span>
                  <span className="gt-value">{results.netProfit.toFixed(0)} €</span>
                  <span className="gt-subtext">Rentabilitāte: {results.margin}%</span>
                </div>

                <table className="results-table">
                  <tbody>
                    <tr>
                      <td>Biļešu ieņēmumi ({params.attendees} x {params.ticketPrice}€)</td>
                      <td>{results.ticketTotal.toFixed(0)} €</td>
                    </tr>
                    <tr>
                      <td>Kopējie ieņēmumi</td>
                      <td>{results.grossRevenue.toFixed(0)} €</td>
                    </tr>
                    <tr>
                      <td>Kopējās izmaksas</td>
                      <td>{results.totalExpenses.toFixed(0)} €</td>
                    </tr>
                  </tbody>
                </table>

                <div className="action-buttons">
                  <button className="btn-primary" style={{ background: '#10b981' }}>Lejupielādēt Biznesa Plānu</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
