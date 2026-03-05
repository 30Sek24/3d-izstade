import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Koka māju un pamatu izmaksas
// ------------------------------------------------------------------
const PRICES = {
  // PAMATI
  foundation: {
    type: {
      none: { name: 'Jau izbūvēti (Tikai koka karkass)', matM2: 0, workM2: 0 },
      slab: { name: 'Zviedru plātne (Siltināta)', matM2: 80, workM2: 50 },
      strip: { name: 'Lentveida pamati', matM2: 60, workM2: 45 },
      screw_pile: { name: 'Skrūvpāļi (koka režģogs)', matM2: 35, workM2: 25 },
    }
  },
  // SIENAS
  walls: {
    type: {
      timber_frame: { name: 'Koka karkass (150mm ar vati)', matM2: 70, workM2: 45 },
      log: { name: 'Guļbūve (200mm frēzbaļķis)', matM2: 140, workM2: 80 },
      clt: { name: 'CLT masīvkoka paneļi (100mm)', matM2: 120, workM2: 35 },
    },
    facade: {
      none: { name: 'Bez ārējās apdares', matM2: 0, workM2: 0 },
      boards: { name: 'Koka vagondēļi (krāsoti)', matM2: 25, workM2: 18 },
      plaster: { name: 'Dekoratīvais apmetums (uz karkasa)', matM2: 15, workM2: 25 },
    }
  },
  // PĀRSEGUMI (Slabs / Ceilings)
  slabs: {
    type: {
      timber_joists: { name: 'Koka sijas (ar OSB un vati)', matM2: 45, workM2: 25 },
      clt_slab: { name: 'CLT paneļu pārsegums', matM2: 95, workM2: 20 },
    }
  },
  // JUMTS (Vienkāršots kopējais jumta mezgls šim kalkulatoram)
  roof: {
    type: {
      truss_metal: { name: 'Kopnes + Metāla dakstiņš', matM2: 45, workM2: 30 },
      rafter_clay: { name: 'Spāres + Māla dakstiņš', matM2: 65, workM2: 45 },
      flat_bitumen: { name: 'Plakanais (Sijas + Ruberoīds)', matM2: 35, workM2: 25 },
    },
    insulation: {
      none: { name: 'Bez siltināšanas (Aukstie bēniņi)', matM2: 0, workM2: 0 },
      wool_300: { name: 'Minerālvate 300mm', matM2: 18, workM2: 12 },
    }
  }
};

export default function TimberHouseCalc() {
  const [params, setParams] = useState({
    country: 'lv',
    // Ģeometrija
    floorArea: 120, // 1. stāva platība
    floors: 1, // Stāvu skaits
    roofArea: 150, // Jumta platība

    // Izvēles
    foundType: 'slab',
    wallType: 'timber_frame',
    facadeType: 'boards',
    slabType: 'timber_joists',
    roofType: 'truss_metal',
    roofInsulation: 'wool_300',
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

    // Ģeometrija (Vienkāršotas aplēses ātram konceptam)
    const footprint = params.floorArea;
    const totalFloorArea = params.floorArea * params.floors;
    const wallAreaEstimate = (Math.sqrt(footprint) * 4) * (params.floors * 3); // Perimetrs * 3m augstums katram stāvam
    const slabArea = params.floors > 1 ? params.floorArea * (params.floors - 1) : 0; // Starpstāvu pārsegumi

    // 1. PAMATI (Rēķina no apbūves laukuma - footprint)
    const fData = PRICES.foundation.type[params.foundType as keyof typeof PRICES.foundation.type];
    const foundMat = footprint * fData.matM2 * matMult;
    const foundWork = footprint * fData.workM2 * workMult;

    // 2. SIENU KONSTRUKCIJAS UN FASĀDE (Rēķina no sienu laukuma)
    const wTypeData = PRICES.walls.type[params.wallType as keyof typeof PRICES.walls.type];
    const wFacData = PRICES.walls.facade[params.facadeType as keyof typeof PRICES.walls.facade];
    const wallMat = wallAreaEstimate * (wTypeData.matM2 + wFacData.matM2) * matMult;
    const wallWork = wallAreaEstimate * (wTypeData.workM2 + wFacData.workM2) * workMult;

    // 3. PĀRSEDZES / PĀRSEGUMI (Rēķina no starpstāvu laukuma)
    let slabMat = 0;
    let slabWork = 0;
    if (params.floors > 1) {
      const sData = PRICES.slabs.type[params.slabType as keyof typeof PRICES.slabs.type];
      slabMat = slabArea * sData.matM2 * matMult;
      slabWork = slabArea * sData.workM2 * workMult;
    }

    // 4. JUMTA KONSTRUKCIJA (Rēķina no jumta laukuma)
    const rTypeData = PRICES.roof.type[params.roofType as keyof typeof PRICES.roof.type];
    const rInsData = PRICES.roof.insulation[params.roofInsulation as keyof typeof PRICES.roof.insulation];
    const roofMat = params.roofArea * (rTypeData.matM2 + rInsData.matM2) * matMult;
    const roofWork = params.roofArea * (rTypeData.workM2 + rInsData.workM2) * workMult;

    // KOPĀ
    const totalMat = foundMat + wallMat + slabMat + roofMat;
    const totalWork = foundWork + wallWork + slabWork + roofWork;

    setResults({
      geom: { footprint, totalFloorArea, wallAreaEstimate, slabArea },
      costs: {
        foundation: { mat: foundMat, work: foundWork },
        walls: { mat: wallMat, work: wallWork },
        slabs: { mat: slabMat, work: slabWork },
        roof: { mat: roofMat, work: roofWork },
      },
      totalMat,
      totalWork,
      grandTotal: totalMat + totalWork
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>Koka Māju Projektu Tāme</h1>
        <p>Smalks aprēķins: Pamati, Sienas, Pārsegumi un Jumts pa sekcijām.</p>
      </div>

      <div className="calc-grid">
        {/* KREISĀ PUSE */}
        <div className="calc-form-column">

          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#22c55e' }}>
            <h2>Lokācija un Reģions</h2>
            <div className="input-group">
              <select name="country" value={params.country} onChange={handleChange} style={{ fontWeight: 'bold' }}>
                {renderCountryOptions()}
              </select>
            </div>
          </section>
          
          <section className="calc-section">
            <h2>1. Apjoms un Ģeometrija</h2>
            <div className="input-group-2">
              <label>1. Stāva (Pamatu) platība (m²)
                <input type="number" name="floorArea" value={params.floorArea} onChange={handleChange} min="20" />
              </label>
              <label>Stāvu skaits
                <input type="number" name="floors" value={params.floors} onChange={handleChange} min="1" max="3" />
              </label>
            </div>
            <div className="input-group" style={{ marginTop: '15px' }}>
              <label>Paredzamā Jumta platība (m²)
                <input type="number" name="roofArea" value={params.roofArea} onChange={handleChange} min="20" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Pamatu Izbūve</h2>
            <div className="input-group">
              <label>Pamatu tips
                <select name="foundType" value={params.foundType} onChange={handleChange}>
                  {Object.entries(PRICES.foundation.type).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Sienu Konstrukcijas un Fasāde</h2>
            <div className="input-group">
              <label>Sienu Nesošais Materiāls
                <select name="wallType" value={params.wallType} onChange={handleChange}>
                  {Object.entries(PRICES.walls.type).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Ārējā Apdare (Fasāde)
                <select name="facadeType" value={params.facadeType} onChange={handleChange}>
                  {Object.entries(PRICES.walls.facade).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          {params.floors > 1 && (
            <section className="calc-section">
              <h2>4. Starpstāvu Pārsegumi (Pārsedzes)</h2>
              <div className="input-group">
                <label>Pārseguma veids
                  <select name="slabType" value={params.slabType} onChange={handleChange}>
                    {Object.entries(PRICES.slabs.type).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                </label>
              </div>
            </section>
          )}

          <section className="calc-section">
            <h2>5. Jumta Konstrukcija</h2>
            <div className="input-group">
              <label>Jumta Mezgls (Karkass + Segums)
                <select name="roofType" value={params.roofType} onChange={handleChange}>
                  {Object.entries(PRICES.roof.type).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
              <label>Jumta Siltinājums
                <select name="roofInsulation" value={params.roofInsulation} onChange={handleChange}>
                  {Object.entries(PRICES.roof.insulation).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ marginTop: '20px', background: '#16a34a' }}>Sastādīt Tāmi</button>

        </div>

        {/* LABĀ PUSE: REZULTĀTI */}
        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#16a34a' }}>
            <h3 className="results-title">Koka Mājas Tāme</h3>
            
            {!results ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏗️</div>
                <p>Aizpildi mājas datus un spied Sastādīt Tāmi</p>
              </div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', marginTop: 0, padding: '15px', background: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                    <div>Kopējā Telpu Platība:<br/><strong style={{fontSize: '1rem'}}>{results.geom.totalFloorArea} m²</strong></div>
                    <div>Ārsienu Platība (Aptuveni):<br/><strong style={{fontSize: '1rem'}}>{results.geom.wallAreaEstimate.toFixed(0)} m²</strong></div>
                  </div>
                </div>

                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Sadaļa</th>
                      <th>Materiāli</th>
                      <th>Darbs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1. Pamatu Izbūve</td>
                      <td>{results.costs.foundation.mat.toFixed(0)} €</td>
                      <td>{results.costs.foundation.work.toFixed(0)} €</td>
                    </tr>
                    <tr>
                      <td>2. Sienas & Fasāde</td>
                      <td>{results.costs.walls.mat.toFixed(0)} €</td>
                      <td>{results.costs.walls.work.toFixed(0)} €</td>
                    </tr>
                    {params.floors > 1 && (
                      <tr>
                        <td>3. Starpstāvu Pārsegumi</td>
                        <td>{results.costs.slabs.mat.toFixed(0)} €</td>
                        <td>{results.costs.slabs.work.toFixed(0)} €</td>
                      </tr>
                    )}
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <td>4. Jumta Konstrukcija</td>
                      <td>{results.costs.roof.mat.toFixed(0)} €</td>
                      <td>{results.costs.roof.work.toFixed(0)} €</td>
                    </tr>
                  </tbody>
                  <tfoot className="table-totals">
                    <tr>
                      <td>KOPUMMĀ:</td>
                      <td className="text-blue">{results.totalMat.toFixed(0)} €</td>
                      <td className="text-orange">{results.totalWork.toFixed(0)} €</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="grand-total-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <span className="gt-label">Projekta Kopējās Izmaksas</span>
                  <span className="gt-value" style={{ color: '#15803d' }}>{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext" style={{ color: '#22c55e' }}>Summās nav iekļauts PVN (21%)</span>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
