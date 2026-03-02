import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

const PROPERTY_TYPES = {
  apartment_soviet: { name: 'Dzīvoklis (Sērijveida)', basePrice: 1050, rentMult: 0.05, maintenance: 1.5 },
  apartment_new: { name: 'Dzīvoklis (Jaunais projekts)', basePrice: 2300, rentMult: 0.06, maintenance: 0.8 },
  apartment_prewar: { name: 'Pirmskara mūra māja', basePrice: 1800, rentMult: 0.05, maintenance: 1.2 },
  house_detached: { name: 'Privātmāja (Savrupmāja)', basePrice: 1400, rentMult: 0.04, maintenance: 0.5 },
  house_twin: { name: 'Dvīņu māja / Rindu māja', basePrice: 1600, rentMult: 0.045, maintenance: 0.6 },
  land_build: { name: 'Zeme apbūvei', basePrice: 45, rentMult: 0.02, maintenance: 0.1 },
};

const CONDITION_LEVELS = {
  white_box: { name: 'Pelēkā apdare', mult: 0.75 },
  standard: { name: 'Standarta remonts', mult: 1.0 },
  high_end: { name: 'Premium / Dizaina apdare', mult: 1.4 },
  needs_cap: { name: 'Nepieciešams kapitālais remonts', mult: 0.6 },
};

const HEATING_TYPES = {
  central: { name: 'Rīgas Siltums (Centrālā)', mult: 1.0 },
  gas: { name: 'Gāzes katls (Autonoma)', mult: 1.1 },
  heatpump: { name: 'Siltumsūknis', mult: 1.15 },
  electric: { name: 'Elektriskā', mult: 0.9 },
  wood: { name: 'Malkas / Granulu', mult: 0.95 },
};

export default function HousingCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    address: 'Brīvības iela 1, Rīga, Latvija',
    type: 'apartment_new',
    area: 55,
    balconyArea: 5,
    condition: 'standard',
    heating: 'central',
    floor: 3,
    totalFloors: 5,
    hasParking: false,
    hasStorage: false,
    energyClass: 'A',
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
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;
    const typeData = PROPERTY_TYPES[params.type as keyof typeof PROPERTY_TYPES];
    const condData = CONDITION_LEVELS[params.condition as keyof typeof CONDITION_LEVELS];
    const heatData = HEATING_TYPES[params.heating as keyof typeof HEATING_TYPES];

    // Bāzes cena par m2
    let pricePerM2 = typeData.basePrice * condData.mult * heatData.mult * matMult;
    
    // Koeficienti
    if (params.energyClass === 'A') pricePerM2 *= 1.1;
    if (params.energyClass === 'B') pricePerM2 *= 1.05;
    if (params.energyClass === 'F') pricePerM2 *= 0.9;

    if (params.hasParking) pricePerM2 *= 1.08;
    if (params.hasStorage) pricePerM2 *= 1.03;

    // Stāva ietekme (Pirmais un pēdējais parasti lētāki dzīvokļiem)
    if (params.type.startsWith('apartment')) {
      if (params.floor === 1) pricePerM2 *= 0.95;
      if (params.floor === params.totalFloors && params.totalFloors > 1) pricePerM2 *= 0.97;
    }

    const marketValue = (params.area * pricePerM2) + (params.balconyArea * pricePerM2 * 0.4);
    const monthlyRent = (marketValue * typeData.rentMult) / 12;
    const annualYield = typeData.rentMult * 100;
    const monthlyMaintenance = params.area * typeData.maintenance * matMult;

    setResults({
      marketValue,
      pricePerM2,
      monthlyRent,
      annualYield,
      monthlyMaintenance,
      addressEncoded: encodeURIComponent(params.address)
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Nekustamā Īpašuma Novērtējums</h1>
        <p>Padziļināta tirgus analīze, ROI aprēķins un Google Maps integrācija.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ borderLeftColor: '#10b981' }}>
            <h2>1. Lokācija un Reģions</h2>
            <div className="input-group">
              <label>Valsts
                <select name="country" value={params.country} onChange={handleChange}>{renderCountryOptions()}</select>
              </label>
              <label style={{ marginTop: '15px' }}>Precīza Adrese (Kartiņai)
                <input type="text" name="address" value={params.address} onChange={handleChange} placeholder="Pilsēta, iela, numurs" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Īpašuma Parametri</h2>
            <div className="input-group-2">
              <label>Tips
                <select name="type" value={params.type} onChange={handleChange}>
                  {Object.entries(PROPERTY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Iekštelpu platība (m²)
                <input type="number" name="area" value={params.area} onChange={handleChange} />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Balkons / Terase (m²)
                <input type="number" name="balconyArea" value={params.balconyArea} onChange={handleChange} />
              </label>
              <label>Stāvoklis
                <select name="condition" value={params.condition} onChange={handleChange}>
                  {Object.entries(CONDITION_LEVELS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Inženiertehniskie dati</h2>
            <div className="input-group-2">
              <label>Apkures veids
                <select name="heating" value={params.heating} onChange={handleChange}>
                  {Object.entries(HEATING_TYPES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Energoefektivitāte
                <select name="energyClass" value={params.energyClass} onChange={handleChange}>
                  <option value="A">A klase (Pasīvā)</option>
                  <option value="B">B klase (Efektīva)</option>
                  <option value="C">C klase (Standarta)</option>
                  <option value="D">D klase (Zema)</option>
                  <option value="F">F klase (Veca)</option>
                </select>
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Stāvs
                <input type="number" name="floor" value={params.floor} onChange={handleChange} />
              </label>
              <label>Kopā stāvi ēkā
                <input type="number" name="totalFloors" value={params.totalFloors} onChange={handleChange} />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>4. Ekstras</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="hasParking" checked={params.hasParking} onChange={handleChange} />
                Privātā Autostāvvieta
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="hasStorage" checked={params.hasStorage} onChange={handleChange} />
                Noliktavas telpa / Pagrabs
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#10b981', marginTop: '20px' }}>APRĒĶINĀT VĒRTĪBU</button>
        </div>

        {/* REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#10b981' }}>
            <h3 className="results-title">Vērtējuma Atskaite</h3>
            
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">🗺️</div><p>Ievadiet datus un spiediet "Aprēķināt"</p></div>
            ) : (
              <>
                <div style={{ width: '100%', height: '250px', background: '#f1f5f9', borderRadius: '15px', marginBottom: '25px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <iframe 
                    width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${results.addressEncoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="grand-total-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', marginBottom: '25px' }}>
                  <span className="gt-label">APTUVENĀ TIRGUS VĒRTĪBA</span>
                  <span className="gt-value" style={{ color: '#15803d' }}>{results.marketValue.toLocaleString('lv-LV', { maximumFractionDigits: 0 })} €</span>
                  <span className="gt-subtext">Vērtējums balstīts uz {COUNTRIES[params.country as keyof typeof COUNTRIES].name} datiem</span>
                </div>

                <div style={{ background: '#0f172a', padding: '25px', borderRadius: '16px', color: '#fff' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>FINANŠU ANALĪTIKA</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Vidējā cena / m2</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{results.pricePerM2.toFixed(0)} €</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Īres ienesīgums</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>{results.annualYield.toFixed(1)}% / gadā</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Potenciālā īre</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{results.monthlyRent.toFixed(0)} € / mēn.</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Apsaimniekošana</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>~{results.monthlyMaintenance.toFixed(0)} € / mēn.</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', fontSize: '0.85rem', color: '#854d0e' }}>
                  💡 <strong>Aģenta padoms:</strong> Šis īpašums ir {params.energyClass} energoefektivitātes klases, kas palielina tā likviditāti tirgū par apmēram 15%.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}