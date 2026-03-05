import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Apkures sistēmu parametri un cenas (EUR)
// ------------------------------------------------------------------
const HEAT_SOURCES = {
  heatpump_aw: { 
    name: 'Siltumsūknis (Gaiss-Ūdens)', 
    basePrice: 4500, // bāzes iekārta
    pricePerKw: 180, // papildus eiro par katru kW
    installWork: 800, // montāža
    installMat: 500,  // trubas, filtri, apsaiste
    cop: 3.5, // Efektivitātes koeficients (Vidējais)
    fuelPricePerKwh: 0.15 // Elektrības cena
  },
  heatpump_gg: { 
    name: 'Siltumsūknis (Zeme-Ūdens)', 
    basePrice: 6500, 
    pricePerKw: 200, 
    installWork: 2500, // urbumi, kontūrs
    installMat: 1500, 
    cop: 4.5,
    fuelPricePerKwh: 0.15
  },
  pellet: { 
    name: 'Granulu Katls (Pilnīgi automātisks)', 
    basePrice: 3200, 
    pricePerKw: 120, 
    installWork: 900, 
    installMat: 600, // skursteņa pieslēgums, sūkņi
    cop: 0.85, // Lietderība
    fuelPricePerKwh: 0.07 // Granulu cena par 1 kWh enerģijas
  },
  gas: { 
    name: 'Kondensācijas Gāzes Katls', 
    basePrice: 1500, 
    pricePerKw: 60, 
    installWork: 600, 
    installMat: 400,
    cop: 0.95,
    fuelPricePerKwh: 0.09
  },
  electric: { 
    name: 'Elektriskais Katls (Jonu/Teņu)', 
    basePrice: 800, 
    pricePerKw: 40, 
    installWork: 300, 
    installMat: 200,
    cop: 0.99,
    fuelPricePerKwh: 0.15
  },
};

const DISTRIBUTION = {
  none: { name: 'Jau izbūvēta (Tikai Katla Maiņa)', matM2: 0, workM2: 0 },
  warm_floor: { name: 'Siltās Grīdas (Caurules + Kolektors)', matM2: 18, workM2: 12 },
  radiators: { name: 'Radiatori (Jauni tērauda + trases)', matM2: 25, workM2: 15 }, // m2 ekvivalents
};

const INSULATION_FACTORS = {
  passive: { name: 'Pasīvā māja (A+ klase)', wattsPerM2: 40 },
  new: { name: 'Jaunbūve (Laba izolācija)', wattsPerM2: 60 },
  renovated: { name: 'Renovēta māja (Vidēja)', wattsPerM2: 90 },
  old: { name: 'Veca māja (Slikta izolācija)', wattsPerM2: 130 },
};

export default function HeatingCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    area: 120,
    insulation: 'new',
    heatSource: 'heatpump_aw',
    distribution: 'warm_floor',
    hotWaterTank: true, 
    smartControl: true, 
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
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;

    const wattsRequired = INSULATION_FACTORS[params.insulation as keyof typeof INSULATION_FACTORS].wattsPerM2;
    let requiredPowerKw = (params.area * wattsRequired) / 1000;
    if (params.hotWaterTank) requiredPowerKw *= 1.15; 
    
    const designPowerKw = Math.ceil(requiredPowerKw);
    const sourceData = HEAT_SOURCES[params.heatSource as keyof typeof HEAT_SOURCES];
    const distData = DISTRIBUTION[params.distribution as keyof typeof DISTRIBUTION];

    let equipmentMat = (sourceData.basePrice + (designPowerKw * sourceData.pricePerKw)) * matMult;
    let equipmentWork = sourceData.installWork * workMult;
    let equipmentExtraMat = sourceData.installMat * matMult;

    if (params.hotWaterTank) {
      equipmentMat += 800 * matMult; 
      equipmentExtraMat += 150 * matMult; 
      equipmentWork += 200 * workMult; 
    }

    if (params.smartControl) {
      equipmentMat += 350 * matMult; 
      equipmentWork += 100 * workMult;
    }

    const distMat = params.area * distData.matM2 * matMult;
    const distWork = params.area * distData.workM2 * workMult;

    const totalMat = equipmentMat + equipmentExtraMat + distMat;
    const totalWork = equipmentWork + distWork;
    const grandTotal = totalMat + totalWork;

    // Eiropā arī elektrības cenas un granulu cenas atšķiras. Pieņemam, ka materiālu reizinātājs 
    // nedaudz atspoguļo arī energoresursu dārdzību attiecīgajā valstī.
    const annualHeatDemandKwh = requiredPowerKw * 200 * 24 * 0.40;
    const annualHeatingCost = (annualHeatDemandKwh / sourceData.cop) * sourceData.fuelPricePerKwh * matMult;

    setResults({
      requiredPowerKw, designPowerKw, sourceData,
      equipmentMat, equipmentWork, equipmentExtraMat, distMat, distWork,
      totalMat, totalWork, grandTotal, annualHeatDemandKwh, annualHeatingCost
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Apkures & Siltumtehnikas Tāme</h1>
        <p>Siltumzudumu novērtējums, iekārtu izmaksas, iekšējo tīklu izbūve un gada ekspluatācijas prognoze.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">

          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#ef4444' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>
          
          <section className="calc-section">
            <h2>1. Ēkas Siltumzudumi un Jauda</h2>
            <div className="input-group-2">
              <label>Apsildāmā platība (m²)
                <input type="number" name="area" value={params.area} onChange={handleChange} min="20" step="1" />
              </label>
              <label>Ēkas Izolācijas Klase
                <select name="insulation" value={params.insulation} onChange={handleChange}>
                  {Object.entries(INSULATION_FACTORS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Katlu Telpas Konfigurācija</h2>
            <div className="input-group">
              <label>Siltuma Avots
                <select name="heatSource" value={params.heatSource} onChange={handleChange}>
                  {Object.entries(HEAT_SOURCES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="hotWaterTank" checked={params.hotWaterTank} onChange={handleChange} />
                + Karstā Ūdens Boileris (200L)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="smartControl" checked={params.smartControl} onChange={handleChange} />
                + Viedā telpu vadība (Wi-Fi)
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Siltuma Sadale (Iekšējie tīkli)</h2>
            <div className="input-group">
              <label>Izbūves veids telpās
                <select name="distribution" value={params.distribution} onChange={handleChange}>
                  {Object.entries(DISTRIBUTION).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#ef4444', marginTop: '20px' }}>Sastādīt Tāmi</button>
        </div>

        {/* REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#ef4444' }}>
            <h3 className="results-title" style={{ color: '#991b1b', borderBottomColor: '#fca5a5' }}>Būvniecības Tāme</h3>
            
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">🔥</div><p>Aizpildi datus un spied Sastādīt Tāmi</p></div>
            ) : (
              <>
                <div className="geom-summary" style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Projektētā Siltuma Jauda:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d4ed8' }}>{results.requiredPowerKw.toFixed(1)} kW</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px', margin: 0 }}>Rekomendētais iekārtas izmērs: ~{results.designPowerKw} kW</p>
                </div>

                <table className="results-table">
                  <thead><tr><th>Pozīcija</th><th>Mat. & Iekārtas</th><th>Darbs</th></tr></thead>
                  <tbody>
                    <tr><td>Siltuma Avots ({results.designPowerKw} kW)</td><td>{results.equipmentMat.toFixed(0)} €</td><td>{results.equipmentWork.toFixed(0)} €</td></tr>
                    <tr><td>Apsaiste (Caurules, filtri)</td><td>{results.equipmentExtraMat.toFixed(0)} €</td><td>-</td></tr>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}><td>Siltuma Sadale Telpās</td><td>{results.distMat.toFixed(0)} €</td><td>{results.distWork.toFixed(0)} €</td></tr>
                  </tbody>
                  <tfoot className="table-totals">
                    <tr><td>KOPĀ:</td><td className="text-blue">{results.totalMat.toFixed(0)} €</td><td className="text-orange">{results.totalWork.toFixed(0)} €</td></tr>
                  </tfoot>
                </table>

                <div className="grand-total-box" style={{ background: '#fef2f2', borderColor: '#fecaca', marginBottom: '20px' }}>
                  <span className="gt-label" style={{ color: '#991b1b' }}>Sistēmas Izbūve (CAPEX)</span>
                  <span className="gt-value" style={{ color: '#b91c1c' }}>{results.grandTotal.toFixed(0)} €</span>
                </div>

                <div style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', color: '#fff' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: '#cbd5e1', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Ekspluatācijas Prognoze (Gads)</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#94a3b8', marginBottom: '8px' }}>
                    <span>Paredzamais Patēriņš:</span><span>{Math.round(results.annualHeatDemandKwh).toLocaleString('lv-LV')} kWh</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#94a3b8', marginBottom: '15px' }}>
                    <span>Sistēmas COP (Lietderība):</span><span>{results.sourceData.cop.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', paddingTop: '15px', borderTop: '1px solid #334155' }}>
                    <span style={{ fontSize: '1.1rem', color: '#fff' }}>Izmaksas apkures sezonā:</span>
                    <strong style={{ fontSize: '1.8rem', color: '#10b981', lineHeight: 1 }}>{results.annualHeatingCost.toFixed(0)} € / gadā</strong>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
