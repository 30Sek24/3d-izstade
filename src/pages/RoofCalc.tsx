import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';
import { useLocalStorage } from '../lib/useLocalStorage';

// ------------------------------------------------------------------
// DATUBĀZE: Jumtu un noteksistēmu detaļas
// ------------------------------------------------------------------
const PRICES = {
  materials: {
    metal: { name: 'Metāla dakstiņš (Ruukki)', matPrice: 15, workPrice: 12, overlapMult: 1.15 }, 
    bitumen: { name: 'Bitumena šindelis', matPrice: 12, workPrice: 15, overlapMult: 1.05 }, 
    clay: { name: 'Māla dakstiņš (Monier)', matPrice: 28, workPrice: 25, overlapMult: 1.05 }, 
    slate: { name: 'Bezazbesta šīferis (Eternit)', matPrice: 18, workPrice: 14, overlapMult: 1.15 }, 
    standing_seam: { name: 'Valcprofils (Classic)', matPrice: 22, workPrice: 20, overlapMult: 1.10 }, 
  },
  accessories: {
    wind_film: { name: 'Pretvēja izolācijas plēve', matPrice: 1.5, workPrice: 1.0 }, // m2
    fasteners_metal: { matPrice: 0.8 }, // Skrūves uz m2
    fasteners_clay: { matPrice: 1.5 }, // Stiprinājumi uz m2
    ridge: { name: 'Kores elementi', matPrice: 12, workPrice: 5 }, // tek. metri
    eaves: { name: 'Vējmalas / Karnīzes', matPrice: 8, workPrice: 4 }, // tek. metri
  },
  lumber: {
    rafters: { name: 'Spāres (50x200mm)', matPrice: 4.5, workPrice: 5 }, // tek. metri
    battens: { name: 'Latojums (50x50mm)', matPrice: 1.2, workPrice: 1.5 }, // tek. metri
    counter_battens: { name: 'Pretlatojums (25x50mm)', matPrice: 0.8, workPrice: 1.0 }, // tek. metri
  },
  gutters: {
    pvc: { name: 'Plastmasas renes un notekas', matPrice: 9, workPrice: 6 }, // tek. metri
    metal: { name: 'Cinkota metāla renes (Ruukki)', matPrice: 16, workPrice: 8 }, 
    hidden: { name: 'Iebūvētā sistēma (slēptā)', matPrice: 45, workPrice: 25 }, 
  }
};

export default function RoofCalc() {
  const [params, setParams] = useLocalStorage('calc_params_roof', {
    country: 'lv',
    houseArea: 100, // Mājas pamata platība
    roofType: 'gable', // gable (divslīpju), hip (četrslīpju), flat (plakanais)
    pitch: 30, // Jumta leņķis
    material: 'metal',
    overhang: 0.6, // Pārkares garums (m)
    includeTimber: true, // Vai rēķināt jaunas spāres un latojumu
    includeGutters: true,
    gutterMaterial: 'metal'
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

    // 1. ĢEOMETRIJAS APRĒĶINS
    // Mājas izmērs (pieņemam kvadrātu vienkāršībai)
    const side = Math.sqrt(params.houseArea);
    const sideWithOverhang = side + (params.overhang * 2);
    
    // Jumta laukums, ņemot vērā leņķi (cos)
    const pitchRad = params.pitch * (Math.PI / 180);
    let roofAreaNet = 0;
    let ridgeLength = 0;
    let eavesLength = 0; // Karnīzes (sāni, kur tek ūdens)
    let gableEndsLength = 0; // Vējmalas

    if (params.roofType === 'gable') {
      roofAreaNet = (sideWithOverhang * sideWithOverhang) / Math.cos(pitchRad);
      ridgeLength = sideWithOverhang;
      eavesLength = sideWithOverhang * 2;
      gableEndsLength = (sideWithOverhang / Math.cos(pitchRad)) * 2;
    } else if (params.roofType === 'hip') {
      roofAreaNet = (sideWithOverhang * sideWithOverhang) / Math.cos(pitchRad);
      ridgeLength = sideWithOverhang * 0.4; // aptuveni
      eavesLength = sideWithOverhang * 4;
      gableEndsLength = 0; // Četrslīpju nav klasisko vējmalu
    } else { // flat
      roofAreaNet = sideWithOverhang * sideWithOverhang;
      ridgeLength = 0;
      eavesLength = sideWithOverhang * 4; // parapets
      gableEndsLength = 0;
    }

    const matData = PRICES.materials[params.material as keyof typeof PRICES.materials];
    
    // Materiāla zudumi un pārlaidumi
    const roofAreaGross = roofAreaNet * matData.overlapMult;

    // 2. KOKA KONSTRUKCIJAS (Spāres, latojums)
    let timberMat = 0;
    let timberWork = 0;
    let raftersLength = 0;
    let battensLength = 0;
    let counterBattensLength = 0;

    if (params.includeTimber) {
      // Spāres ar soli 0.6m
      raftersLength = (sideWithOverhang / 0.6) * (sideWithOverhang / Math.cos(pitchRad));
      // Latojums ar soli 0.35m
      battensLength = (sideWithOverhang / Math.cos(pitchRad) / 0.35) * sideWithOverhang * 2;
      // Pretlatojums sakrīt ar spārēm
      counterBattensLength = raftersLength;

      timberMat = (
        (raftersLength * PRICES.lumber.rafters.matPrice) + 
        (battensLength * PRICES.lumber.battens.matPrice) + 
        (counterBattensLength * PRICES.lumber.counter_battens.matPrice)
      ) * matMult;
      
      timberWork = (
        (raftersLength * PRICES.lumber.rafters.workPrice) + 
        (battensLength * PRICES.lumber.battens.workPrice) + 
        (counterBattensLength * PRICES.lumber.counter_battens.workPrice)
      ) * workMult;
    }

    // 3. JUMTA SEGUMS UN AKSESUĀRI
    const coverMat = roofAreaGross * matData.matPrice * matMult;
    const coverWork = roofAreaNet * matData.workPrice * workMult;

    const filmMat = roofAreaGross * PRICES.accessories.wind_film.matPrice * matMult;
    const filmWork = roofAreaNet * PRICES.accessories.wind_film.workPrice * workMult;

    // Stiprinājumi (Aptuveni uz m2)
    const fastMat = roofAreaGross * (params.material === 'clay' ? PRICES.accessories.fasteners_clay.matPrice : PRICES.accessories.fasteners_metal.matPrice) * matMult;

    // Kores un Vējmalas
    const trimsMat = ((ridgeLength * PRICES.accessories.ridge.matPrice) + (gableEndsLength * PRICES.accessories.eaves.matPrice)) * matMult;
    const trimsWork = ((ridgeLength * PRICES.accessories.ridge.workPrice) + (gableEndsLength * PRICES.accessories.eaves.workPrice)) * workMult;

    // 4. NOTEKSISTĒMA
    let guttersMat = 0;
    let guttersWork = 0;
    if (params.includeGutters) {
      const gData = PRICES.gutters[params.gutterMaterial as keyof typeof PRICES.gutters];
      guttersMat = eavesLength * gData.matPrice * matMult;
      guttersWork = eavesLength * gData.workPrice * workMult;
    }

    // KOPSAVILKUMS
    const totalMat = timberMat + coverMat + filmMat + fastMat + trimsMat + guttersMat;
    const totalWork = timberWork + coverWork + filmWork + trimsWork + guttersWork;

    setResults({
      geom: { roofAreaNet, roofAreaGross, ridgeLength, eavesLength, raftersLength, battensLength },
      timberCost: { mat: timberMat, work: timberWork },
      coverCost: { mat: coverMat + filmMat + fastMat, work: coverWork + filmWork },
      trimsCost: { mat: trimsMat, work: trimsWork },
      guttersCost: { mat: guttersMat, work: guttersWork },
      totalMat, totalWork, grandTotal: totalMat + totalWork
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Jumta un Noteksistēmu Tāme</h1>
        <p>Smalks inženiertehniskais aprēķins ar koka konstrukcijām un materiālu zudumiem.</p>
      </div>

      <div className="calc-grid">
        {/* KREISĀ PUSE */}
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
            <h2>1. Mājas un Jumta Ģeometrija</h2>
            <div className="input-group-2">
              <label>Mājas apbūves laukums (m²)
                <input type="number" name="houseArea" value={params.houseArea} onChange={handleChange} min="20" />
              </label>
              <label>Jumta tips
                <select name="roofType" value={params.roofType} onChange={handleChange}>
                  <option value="gable">Divslīpju (Klasisks)</option>
                  <option value="hip">Četrslīpju (Telts)</option>
                  <option value="flat">Plakanais</option>
                </select>
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Slīpums (Grādos)
                <input type="number" name="pitch" value={params.pitch} onChange={handleChange} min="0" max="60" />
              </label>
              <label>Pārkare / Karnīze (m)
                <input type="number" name="overhang" value={params.overhang} onChange={handleChange} min="0" step="0.1" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Koka Konstrukcijas</h2>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '1rem', color: '#0f172a' }}>
                <input type="checkbox" name="includeTimber" checked={params.includeTimber} onChange={handleChange} style={{ width: '24px', height: '24px' }} />
                Aprēķināt jaunas spāres un latojumu (Pilna pārbūve)
              </label>
            </div>
            {params.includeTimber && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px' }}>* Tiks automātiski aprēķināts 50x200 spāru un 50x50 latojuma apjoms balstoties uz jumta platību.</p>
            )}
          </section>

          <section className="calc-section">
            <h2>3. Jumta Segums un Detalizācija</h2>
            <div className="input-group">
              <label>Izvēlētais Materiāls
                <select name="material" value={params.material} onChange={handleChange}>
                  {Object.entries(PRICES.materials).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px' }}>* Seguma cenā automātiski tiks iekļauti materiālu pārlaiduma zudumi (5-15%), pretvēja plēve un stiprinājumi.</p>
          </section>

          <section className="calc-section">
            <h2>4. Noteksistēmas</h2>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>
                <input type="checkbox" name="includeGutters" checked={params.includeGutters} onChange={handleChange} style={{ width: '24px', height: '24px' }} />
                Iekļaut lietusūdens noteksistēmu
              </label>
              {params.includeGutters && (
                <label>Sistēmas materiāls
                  <select name="gutterMaterial" value={params.gutterMaterial} onChange={handleChange}>
                    {Object.entries(PRICES.gutters).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                </label>
              )}
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ marginTop: '20px' }}>Ģenerēt Tāmi</button>

        </div>

        {/* LABĀ PUSE: REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Būvniecības Specifikācija</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏠</div>
                <p>Aizpildi ģeometriju un ģenerē tāmi</p>
              </div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', marginTop: 0, padding: '15px', background: '#f8fafc', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>Jumta platība (tīrā):<br/><strong>{results.geom.roofAreaNet.toFixed(1)} m²</strong></div>
                    <div>Materiāls (ar zudumiem):<br/><strong>{results.geom.roofAreaGross.toFixed(1)} m²</strong></div>
                    <div>Nepieciešamās Spāres:<br/><strong>{results.geom.raftersLength.toFixed(0)} m</strong></div>
                    <div>Latojuma brusas:<br/><strong>{results.geom.battensLength.toFixed(0)} m</strong></div>
                  </div>
                </div>

                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Pozīcija</th>
                      <th>Materiāli</th>
                      <th>Darbs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.includeTimber && (
                      <tr>
                        <td>Koka Karkass (Spāres, Latojums)</td>
                        <td>{results.timberCost.mat.toFixed(0)} €</td>
                        <td>{results.timberCost.work.toFixed(0)} €</td>
                      </tr>
                    )}
                    <tr>
                      <td>Segums + Plēve + Skrūves</td>
                      <td>{results.coverCost.mat.toFixed(0)} €</td>
                      <td>{results.coverCost.work.toFixed(0)} €</td>
                    </tr>
                    <tr>
                      <td>Skārda detaļas (Kores, Vējmalas)</td>
                      <td>{results.trimsCost.mat.toFixed(0)} €</td>
                      <td>{results.trimsCost.work.toFixed(0)} €</td>
                    </tr>
                    {params.includeGutters && (
                      <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                        <td>Noteksistēmas ({results.geom.eavesLength.toFixed(0)}m)</td>
                        <td>{results.guttersCost.mat.toFixed(0)} €</td>
                        <td>{results.guttersCost.work.toFixed(0)} €</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="table-totals">
                    <tr>
                      <td>KOPUMMĀ:</td>
                      <td className="text-blue">{results.totalMat.toFixed(0)} €</td>
                      <td className="text-orange">{results.totalWork.toFixed(0)} €</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="grand-total-box">
                  <span className="gt-label">Jumta Izbūves Projekts</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Summās nav iekļauts PVN (21%)</span>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
