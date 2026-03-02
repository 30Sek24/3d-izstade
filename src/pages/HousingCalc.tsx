import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';

// ------------------------------------------------------------------
// DATUBĀZE: Nekustamā īpašuma algoritma parametri
// ------------------------------------------------------------------
const REGIONS = {
  riga_centrs: { name: 'Rīga (Centrs)', basePriceM2: 2400, rentYield: 0.05, rentBaseM2: 12 },
  riga_mikrorajons: { name: 'Rīga (Mikrorajoni)', basePriceM2: 1300, rentYield: 0.065, rentBaseM2: 7 },
  pieriga: { name: 'Pierīga', basePriceM2: 1500, rentYield: 0.055, rentBaseM2: 8 },
  lielpilseta: { name: 'Reģionu Lielpilsētas', basePriceM2: 900, rentYield: 0.07, rentBaseM2: 5 },
  lauki: { name: 'Lauki / Mazpilsētas', basePriceM2: 450, rentYield: 0.04, rentBaseM2: 2.5 },
};

const PROP_TYPES = {
  apartment_new: { name: 'Dzīvoklis (Jaunais projekts)', priceMult: 1.4, rentMult: 1.3 },
  apartment_old: { name: 'Dzīvoklis (Pirmskara / Padomju)', priceMult: 0.8, rentMult: 0.9 },
  house_new: { name: 'Privātmāja (Jaunbūve)', priceMult: 1.3, rentMult: 1.1 },
  house_old: { name: 'Privātmāja (Vecā)', priceMult: 0.7, rentMult: 0.7 },
  commercial: { name: 'Komerctelpa', priceMult: 1.1, rentMult: 1.5 },
};

const CONDITIONS = {
  shell: { name: 'Pelēkā apdare', val: 0.7 },
  needs_repair: { name: 'Vajadzīgs kapitālais remonts', val: 0.6 },
  cosmetic: { name: 'Kosmētiskais remonts', val: 0.9 },
  good: { name: 'Laba stāvoklī (Gatavs dzīvošanai)', val: 1.0 },
  premium: { name: 'Ekskluzīvs / Dizainera remonts', val: 1.35 },
};

export default function HousingCalc() {
  const [params, setParams] = useState({
    region: 'riga_mikrorajons',
    propType: 'apartment_old',
    condition: 'good',
    area: 50,
    floor: 3,
    hasElevator: false,
    hasParking: false,
    hasBalcony: false,
    energyClass: 'C', // A, B, C, D, F
    // Investīciju sadaļai
    purchasePrice: 0, // Ja zina savu cenu
    renovationBudget: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = parseFloat(value) || 0;
    }

    setParams(prev => ({ ...prev, [name]: finalValue }));
  };

  // ------------------------------------------------------------------
  // ALGORITMS: Īpašuma tirgus vērtība
  // ------------------------------------------------------------------
  const regionData = REGIONS[params.region as keyof typeof REGIONS];
  const typeData = PROP_TYPES[params.propType as keyof typeof PROP_TYPES];
  const conditionData = CONDITIONS[params.condition as keyof typeof CONDITIONS];

  let calculatedPricePerM2 = regionData.basePriceM2 * typeData.priceMult * conditionData.val;

  // Ekstru koeficienti
  if (params.hasElevator && params.floor > 2) calculatedPricePerM2 *= 1.05;
  if (!params.hasElevator && params.floor > 4) calculatedPricePerM2 *= 0.90; // Sods par augstiem stāviem bez lifta
  if (params.hasParking) calculatedPricePerM2 += (8000 / params.area); // Fiksēta stāvvietas vērtība uz m2
  if (params.hasBalcony) calculatedPricePerM2 *= 1.03;
  if (params.energyClass === 'A') calculatedPricePerM2 *= 1.10;
  if (params.energyClass === 'F') calculatedPricePerM2 *= 0.85;

  const estimatedMarketValue = calculatedPricePerM2 * params.area;

  // ------------------------------------------------------------------
  // ALGORITMS: Īres potenciāls un Ienesīgums (ROI)
  // ------------------------------------------------------------------
  let calculatedRentPerM2 = regionData.rentBaseM2 * typeData.rentMult * conditionData.val;
  if (params.hasParking) calculatedRentPerM2 += 1.0;
  if (params.hasBalcony) calculatedRentPerM2 += 0.5;

  const estimatedMonthlyRent = calculatedRentPerM2 * params.area;
  const annualRentIncome = estimatedMonthlyRent * 12;

  // Investīciju analīze (Ja lietotājs ievada savu summu, izmantojam to, citādi rēķinām no tirgus vērtības)
  const actualInvestment = (params.purchasePrice > 0 ? params.purchasePrice : estimatedMarketValue) + params.renovationBudget;
  const grossYield = actualInvestment > 0 ? (annualRentIncome / actualInvestment) * 100 : 0;
  const paybackYears = grossYield > 0 ? (100 / grossYield) : 0;

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Nekustamā Īpašuma Analītiķis</h1>
        <p>Vērtējiet īpašuma tirgus cenu, īres ienesīgumu un investīciju atdevi (ROI).</p>
      </div>

      <div className="calc-grid">
        {/* KREISĀ PUSE: IEVADFORMAS */}
        <div className="calc-form-column">
          
          <section className="calc-section">
            <h2>1. Pamatinformācija</h2>
            <div className="input-group">
              <label>Reģions / Lokācija
                <select name="region" value={params.region} onChange={handleChange}>
                  {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Īpašuma veids
                <select name="propType" value={params.propType} onChange={handleChange}>
                  {Object.entries(PROP_TYPES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Kopējā platība (m²)
                <input type="number" name="area" value={params.area} onChange={handleChange} min="10" />
              </label>
              <label>Stāvs
                <input type="number" name="floor" value={params.floor} onChange={handleChange} min="1" max="50" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Stāvoklis un Ekstras</h2>
            <div className="input-group">
              <label>Telpu stāvoklis
                <select name="condition" value={params.condition} onChange={handleChange}>
                  {Object.entries(CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Ēkas energoefektivitāte
                <select name="energyClass" value={params.energyClass} onChange={handleChange}>
                  <option value="A">A klase (Ļoti augsta)</option>
                  <option value="B">B klase</option>
                  <option value="C">C klase (Standarta)</option>
                  <option value="D">D klase</option>
                  <option value="F">F klase (Ļoti slikta, veca ēka)</option>
                </select>
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="hasElevator" checked={params.hasElevator} onChange={handleChange} />
                Ēkā ir Lifts
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="hasParking" checked={params.hasParking} onChange={handleChange} />
                Garantēta Stāvvieta
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="hasBalcony" checked={params.hasBalcony} onChange={handleChange} />
                Balkons / Terase
              </label>
            </div>
          </section>

          <section className="calc-section" style={{ borderLeft: '4px solid #10b981', background: '#f0fdf4' }}>
            <h2>3. Investora Rīki (Izvēles)</h2>
            <p style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '15px' }}>
              Aizpildi šo, ja zini savu pirkšanas cenu un vēlies aprēķināt reālo peļņu, nevis paļauties uz tirgus vidējo.
            </p>
            <div className="input-group-2">
              <label>Faktiskā pirkuma summa (€)
                <input type="number" name="purchasePrice" value={params.purchasePrice} onChange={handleChange} placeholder="Piem. 55000" />
              </label>
              <label>Plānotais remonta budžets (€)
                <input type="number" name="renovationBudget" value={params.renovationBudget} onChange={handleChange} />
              </label>
            </div>
          </section>

        </div>

        {/* LABĀ PUSE: REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#10b981' }}>
            
            {/* Tirgus Cena */}
            <div style={{ marginBottom: '30px' }}>
              <h3 className="results-title" style={{ color: '#065f46', borderBottomColor: '#6ee7b7' }}>Pārdošanas Vērtējums</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#059669', textAlign: 'center', margin: '15px 0' }}>
                {Math.round(estimatedMarketValue).toLocaleString('lv-LV')} €
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#4b5563' }}>
                <span>Cena par m²:</span>
                <strong>{Math.round(calculatedPricePerM2)} €/m²</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#4b5563', marginTop: '5px' }}>
                <span>Realizācijas laiks:</span>
                <strong>2-4 mēneši</strong>
              </div>
            </div>

            {/* Īres Potenciāls */}
            <div style={{ marginBottom: '30px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#334155', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '15px' }}>Īres Tirgus Potenciāls</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginBottom: '10px' }}>
                <span>Mēneša maksa:</span>
                <strong style={{ color: '#3b82f6' }}>{Math.round(estimatedMonthlyRent)} €/mēn</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#64748b' }}>
                <span>Likme:</span>
                <span>{calculatedRentPerM2.toFixed(1)} €/m²</span>
              </div>
            </div>

            {/* Investīciju ROI */}
            <div className="grand-total-box" style={{ background: '#0f172a', borderColor: '#334155', color: '#fff' }}>
              <span className="gt-label" style={{ color: '#94a3b8' }}>Bruto Ienesīgums (ROI)</span>
              
              <div style={{ display: 'flex', alignItems: 'end', gap: '15px', marginTop: '10px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: grossYield >= 6 ? '#10b981' : grossYield >= 4 ? '#eab308' : '#ef4444', lineHeight: 1 }}>
                  {grossYield.toFixed(1)}%
                </span>
                <span style={{ fontSize: '1rem', color: '#94a3b8', paddingBottom: '5px' }}>gadā</span>
              </div>

              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#cbd5e1' }}>
                <span>Atpelnīšanās laiks:</span>
                <strong>{paybackYears.toFixed(1)} gadi</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#cbd5e1', marginTop: '5px' }}>
                <span>Kopējās Investīcijas:</span>
                <strong>{actualInvestment.toLocaleString('lv-LV')} €</strong>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" style={{ background: '#10b981' }}>Eksportēt Investora Pārskatu</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}