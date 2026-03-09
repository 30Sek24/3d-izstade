import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../../core/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Logu profili, stikli un darbi (Bāze EUR)
// ------------------------------------------------------------------

const PRICES = {
  // --- PROFILU SISTĒMAS ---
  profiles: {
    pvc_standard: { name: 'PVC Standarta (70mm, 5-kameras)', mat: 120, work: 45 }, // par m2
    pvc_premium: { name: 'PVC Premium (82mm, 7-kameras)', mat: 185, work: 55 },
    alu_thermal: { name: 'Alumīnija (Ar termo tiltu)', mat: 320, work: 85 },
    wood_premium: { name: 'Koka (Līmētas brusas)', mat: 280, work: 75 },
  },

  // --- STIKLA PAKETES ---
  glazing: {
    double: { name: '2-stiklu pakete (Selektīvais)', mat: 45 }, // par m2
    triple: { name: '3-stiklu pakete (Argon)', mat: 75 },
    triple_solar: { name: '3-stiklu (Solar/Energy)', mat: 110 },
  },

  // --- MONTĀŽAS TIPS ---
  installation: {
    standard: { name: 'Standarta montāža (Puta + Skrūves)', price: 35 }, // par gab
    illbruck: { name: 'Siltā montāža (Tvaika/Vēja lentes)', price: 75 },
    bracket: { name: 'Iznestā montāža (Siltinājuma slānī)', price: 145 },
  },

  // --- PAPILDUS ---
  accessories: {
    windowsill_internal: { name: 'Iekšējā palodze (PVC/MDF)', price: 15 }, // par tek.m
    windowsill_external: { name: 'Ārējā palodze (Cinkots skārds)', price: 12 },
    mosquito_net: { name: 'Insektu tīkls (Rāmis)', price: 45 },
  }
};

export default function WindowsCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    windowCount: 5,
    totalArea: 10,
    profileType: 'pvc_premium',
    glazingType: 'triple',
    installType: 'illbruck',
    internalSills: 5,
    externalSills: 5,
    nets: 2,
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

    // 1. Profilu un stiklu izmaksas
    const prof = PRICES.profiles[params.profileType as keyof typeof PRICES.profiles];
    const glass = PRICES.glazing[params.glazingType as keyof typeof PRICES.glazing];
    
    const productCost = {
      mat: (params.totalArea * (prof.mat + glass.mat)) * matMult,
      work: (params.totalArea * prof.work) * workMult,
    };

    // 2. Montāža
    const inst = PRICES.installation[params.installType as keyof typeof PRICES.installation];
    const installationCost = {
      mat: (params.windowCount * inst.price * 0.3) * matMult, // palīgmateriāli
      work: (params.windowCount * inst.price * 0.7) * workMult, // darbs
    };

    // 3. Papildaprīkojums
    const accCost = {
      mat: (params.internalSills * PRICES.accessories.windowsill_internal.price + 
            params.externalSills * PRICES.accessories.windowsill_external.price +
            params.nets * PRICES.accessories.mosquito_net.price) * matMult,
      work: (params.windowCount * 15) * workMult, // palodžu montāžas darbs
    };

    const totalMat = productCost.mat + installationCost.mat + accCost.mat;
    const totalWork = productCost.work + installationCost.work + accCost.work;
    const grandTotal = totalMat + totalWork;

    setResults({
      productCost,
      installationCost,
      accCost,
      totalMat,
      totalWork,
      grandTotal,
      imageUrl: params.imageUrl,
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Logu un Durvju Tāme</h1>
        <p>Energoefektīvu konstrukciju aprēķins ar siltās montāžas mezgliem un stiklojuma variācijām.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#0ea5e9' }}>
            <h2>1. Konstrukciju apjoms</h2>
            <div className="input-group">
              <label>Reģions
                <select name="country" value={params.country} onChange={handleChange}>
                  {renderCountryOptions()}
                </select>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <label>Skaits (gab)
                  <input type="number" name="windowCount" value={params.windowCount} onChange={handleChange} min="1" />
                </label>
                <label>Kopējā platība (m²)
                  <input type="number" name="totalArea" value={params.totalArea} onChange={handleChange} min="0.5" step="0.1" />
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Profilu sistēma un Stiklojums</h2>
            <div className="input-group">
              <label>Profila veids
                <select name="profileType" value={params.profileType} onChange={handleChange}>
                  {Object.entries(PRICES.profiles).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
              <label style={{ marginTop: '15px' }}>Stikla pakete
                <select name="glazingType" value={params.glazingType} onChange={handleChange}>
                  {Object.entries(PRICES.glazing).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Montāžas veids un Palodzes</h2>
            <div className="input-group">
              <label>Montāžas tehnoloģija
                <select name="installType" value={params.installType} onChange={handleChange}>
                  {Object.entries(PRICES.installation).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '15px' }}>
                <label>Iekš. palodzes (m)
                  <input type="number" name="internalSills" value={params.internalSills} onChange={handleChange} min="0" />
                </label>
                <label>Ār. palodzes (m)
                  <input type="number" name="externalSills" value={params.externalSills} onChange={handleChange} min="0" />
                </label>
                <label>Tīkli (gab)
                  <input type="number" name="nets" value={params.nets} onChange={handleChange} min="0" />
                </label>
              </div>
            </div>
          </section>

          <section className="calc-section">
            <h2>4. Fasādes skice</h2>
            <div className="input-group">
              <label>Pievienot ēkas fasādes bildi (URL)
                <input type="text" name="imageUrl" value={params.imageUrl} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#0ea5e9' }}>Aprēķināt Logu Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Logu un Montāžas Specifikācija</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🪟</div>
                <p>Norādiet izmērus un profilu tipu</p>
              </div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', background: 'rgba(14, 165, 233, 0.1)', borderColor: '#0ea5e9' }}>
                  Skaits: <strong>{params.windowCount} gab</strong> | Platība: <strong>{params.totalArea} m²</strong><br/>
                  Sistēma: <strong>{PRICES.profiles[params.profileType as keyof typeof PRICES.profiles].name}</strong>
                </div>

                {results.imageUrl && (
                   <img src={results.imageUrl} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} alt="Fasāde" />
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
                      <td>Logu konstrukcijas</td>
                      <td>{results.productCost.mat.toFixed(0)} €</td>
                      <td>{results.productCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.productCost.mat + results.productCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>Montāža ({PRICES.installation[params.installType as keyof typeof PRICES.installation].name})</td>
                      <td>{results.installationCost.mat.toFixed(0)} €</td>
                      <td>{results.installationCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.installationCost.mat + results.installationCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>Palodzes un Aksesuāri</td>
                      <td>{results.accCost.mat.toFixed(0)} €</td>
                      <td>{results.accCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.accCost.mat + results.accCost.work).toFixed(0)} €</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div className="grand-total-box" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                  <span className="gt-label">Gatavs Projekts (Ar montāžu)</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Cenā ietilpst visi blīvējuma materiāli un stiprinājumi.</span>
                </div>

                <div className="action-buttons">
                  <button className="btn-primary" style={{ background: '#0ea5e9' }}>Lejupielādēt Rasējumus</button>
                  <button className="btn-secondary">Pasūtīt Uzmērīšanu</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
