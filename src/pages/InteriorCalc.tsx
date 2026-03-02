import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';

// ------------------------------------------------------------------
// DATUBĀZE: Cenas un materiāli (Bāzes likmes EUR Rīgai/Standartam)
// ------------------------------------------------------------------

const PRICES = {
  // --- DEMONTĀŽA ---
  demolition: {
    none: { name: 'Bez demontāžas', mat: 0, work: 0 },
    light: { name: 'Viegla (tapetes, grīdlīstes, segums)', mat: 0, work: 6.00 },
    heavy: { name: 'Smaga (flīzes, starpsienas, grīdas laušana)', mat: 0, work: 25.00 },
  },
  // Mūsdienu Konteineru cenas
  container: {
    none: { name: 'Nevajag (savs transports)', price: 0 },
    small: { name: '5m³ Konteiners', price: 350 },
    medium: { name: '7m³ Konteiners', price: 450 },
    large: { name: '10m³ Konteiners', price: 600 },
  },

  // --- GRĪDA ---
  floor_prep: {
    none: { name: 'Bez sagatavošanas', mat: 0, work: 0 },
    osb: { name: 'OSB plātņu ieklāšana', mat: 9.50, work: 8.00 },
    betons: { name: 'Betona izlīdzināšana (Pašizlīdzinošais)', mat: 8.00, work: 10.00 },
  },
  floor_cover: {
    none: { name: 'Bez seguma', mat: 0, work: 0 },
    laminats: { name: 'Lamināts + apakšklājs', mat: 15.00, work: 9.00 },
    vinils: { name: 'Līmējamais Vinils (LVT)', mat: 25.00, work: 12.00 },
    parkets: { name: 'Koka parkets', mat: 55.00, work: 20.00 },
    flizes: { name: 'Akmens masas flīzes', mat: 30.00, work: 35.00 },
  },
  floor_skirting: {
    none: { name: 'Bez kājlīstēm', mat: 0, work: 0 }, 
    mdf: { name: 'MDF krāsotas kājlīstes', mat: 5.50, work: 5.00 }, 
    plastmasas: { name: 'Plastmasas (PVC)', mat: 2.50, work: 3.00 }, 
  },

  // --- SIENAS ---
  wall_prep: {
    none: { name: 'Bez sagatavošanas', mat: 0, work: 0 },
    regipsis_profils: { name: 'Reģipša montāža (uz profiliem)', mat: 8.50, work: 15.00 },
    apmesana: { name: 'Sienu apmešana (MP75)', mat: 5.00, work: 16.00 },
  },
  wall_finish: {
    none: { name: 'Bez apdares', mat: 0, work: 0 },
    krasa_standard: { name: 'Špaktelēšana + Standarta Krāsošana', mat: 5.50, work: 18.00 },
    krasa_premium: { name: 'Špaktelēšana + Premium Krāsošana', mat: 10.00, work: 25.00 },
    tapetes: { name: 'Tapešu līmēšana', mat: 18.00, work: 12.00 },
    dekors: { name: 'Dekoratīvais apmetums', mat: 22.00, work: 35.00 },
  },

  // --- GRIESTI ---
  ceiling_type: {
    none: { name: 'Bez griestiem', mat: 0, work: 0 },
    regipsis: { name: 'Reģipša griesti (špaktelēti, krāsoti)', mat: 12.00, work: 35.00 },
    iestieptie: { name: 'Iestieptie PVC griesti', mat: 25.00, work: 15.00 },
    armstrong: { name: 'Iekārtie "Armstrong" griesti', mat: 15.00, work: 12.00 },
  },

  // --- ELEKTRO / CITI ---
  electrical_points: { name: 'Elektrības punkti (Rozetes, slēdži)', mat: 15.00, work: 20.00 }, // /gab
  doors: { name: 'Iekšdurvju bloka montāža', mat: 180.00, work: 85.00 } // /gab
};

const ROOM_TYPES = {
  living_room: 'Viesistaba',
  bedroom: 'Guļamistaba',
  kitchen: 'Virtuve',
  bathroom: 'Vannas istaba',
  toilet: 'Tualete',
  corridor: 'Koridors',
};

export default function InteriorCalc() {
  // ------------------------------------------------------------------
  // STATE: Lietotāja ievadītie parametri (Draft)
  // ------------------------------------------------------------------
  const [params, setParams] = useState({
    country: 'lv',
    roomType: 'living_room',
    // Ģeometrija
    area: 20,
    height: 2.7,
    windowArea: 2.5,
    doorCount: 1,

    // Demontāža
    demolitionType: 'none',
    containerSize: 'none',

    // Grīda
    floorPrep: 'osb',
    floorCover: 'laminats',
    floorSkirting: 'mdf',

    // Sienas
    wallPrep: 'none',
    wallFinish: 'krasa_standard',

    // Griesti
    ceilingType: 'regipsis',

    // Ekstras
    elecPoints: 4,

    // Media
    imageUrl: '',
    videoUrl: '',
  });

  // ------------------------------------------------------------------
  // STATE: Fiksētie rezultāti (Pēc pogas "Aprēķināt" nospiešanas)
  // ------------------------------------------------------------------
  const [results, setResults] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // ------------------------------------------------------------------
  // APRĒĶINA FUNKCIJA (Izsauc TIKAI nospiežot pogu)
  // ------------------------------------------------------------------
  const handleCalculate = () => {
    // Multiplikatori valstij (Materiāliem un Darbam atsevišķi)
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;

    // Ģeometrija
    const floorArea = params.area;
    const ceilingArea = params.area;
    const perimeter = Math.sqrt(floorArea) * 4; 
    const grossWallArea = perimeter * params.height;
    const totalDoorArea = params.doorCount * 1.6;
    const netWallArea = Math.max(0, grossWallArea - params.windowArea - totalDoorArea);

    // 0. DEMONTĀŽA UN BŪVGRUŽI
    const demoRate = PRICES.demolition[params.demolitionType as keyof typeof PRICES.demolition];
    const containerRate = PRICES.container[params.containerSize as keyof typeof PRICES.container];
    
    const demolitionCost = {
      mat: containerRate.price * matMult, 
      work: (floorArea * demoRate.work) * workMult,
    };

    // 1. GRĪDA
    const floorPrepRate = PRICES.floor_prep[params.floorPrep as keyof typeof PRICES.floor_prep];
    const floorCoverRate = PRICES.floor_cover[params.floorCover as keyof typeof PRICES.floor_cover];
    const skirtingRate = PRICES.floor_skirting[params.floorSkirting as keyof typeof PRICES.floor_skirting];

    const floorCost = {
      mat: ((floorArea * floorPrepRate.mat) + (floorArea * floorCoverRate.mat) + (perimeter * skirtingRate.mat)) * matMult,
      work: ((floorArea * floorPrepRate.work) + (floorArea * floorCoverRate.work) + (perimeter * skirtingRate.work)) * workMult,
    };

    // 2. SIENAS
    const wallPrepRate = PRICES.wall_prep[params.wallPrep as keyof typeof PRICES.wall_prep];
    const wallFinishRate = PRICES.wall_finish[params.wallFinish as keyof typeof PRICES.wall_finish];

    const wallCost = {
      mat: ((netWallArea * wallPrepRate.mat) + (netWallArea * wallFinishRate.mat)) * matMult,
      work: ((netWallArea * wallPrepRate.work) + (netWallArea * wallFinishRate.work)) * workMult,
    };

    // 3. GRIESTI
    const ceilingRate = PRICES.ceiling_type[params.ceilingType as keyof typeof PRICES.ceiling_type];
    
    const ceilingCost = {
      mat: (ceilingArea * ceilingRate.mat) * matMult,
      work: (ceilingArea * ceilingRate.work) * workMult,
    };

    // 4. EKSTRAS
    const elecCost = {
      mat: (params.elecPoints * PRICES.electrical_points.mat) * matMult,
      work: (params.elecPoints * PRICES.electrical_points.work) * workMult,
    };
    const doorCost = {
      mat: (params.doorCount * PRICES.doors.mat) * matMult,
      work: (params.doorCount * PRICES.doors.work) * workMult,
    };

    const extrasCost = {
      mat: elecCost.mat + doorCost.mat,
      work: elecCost.work + doorCost.work
    };

    const totalMat = demolitionCost.mat + floorCost.mat + wallCost.mat + ceilingCost.mat + extrasCost.mat;
    const totalWork = demolitionCost.work + floorCost.work + wallCost.work + ceilingCost.work + extrasCost.work;
    const grandTotal = totalMat + totalWork;

    // Saglabājam rezultātus state objektā
    setResults({
      netWallArea,
      perimeter,
      demolitionCost,
      floorCost,
      wallCost,
      ceilingCost,
      extrasCost,
      totalMat,
      totalWork,
      grandTotal,
      workMult,
      matMult,
      roomType: ROOM_TYPES[params.roomType as keyof typeof ROOM_TYPES],
      imageUrl: params.imageUrl,
      videoUrl: params.videoUrl,
    });
  };

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Iekšējās Apdares Tāme</h1>
        <p>Precīzs un starptautisks remonta kalkulators ar materiālu un darbu dalījumu.</p>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '10px' }}>Ietver darbus, ko veic: Reģipšnieki, Flīzētāji, Krāsotāji, Namdari, u.c. apdares speciālisti.</p>
      </div>

      <div className="calc-grid">
        {/* KREISĀ PUSE: IEVADFORMAS */}
        <div className="calc-form-column">
          
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#334155' }}>
            <h2>Lokācija un Telpas Tips</h2>
            <div className="input-group">
              <label>Valsts, kurā notiek objekts
                <select name="country" value={params.country} onChange={handleChange} style={{ borderColor: '#334155', fontWeight: 'bold' }}>
                  {renderCountryOptions()}
                </select>
              </label>
              <label style={{ marginTop: '15px' }}>Telpas Tips
                <select name="roomType" value={params.roomType} onChange={handleChange}>
                  {Object.entries(ROOM_TYPES).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>0. Demontāža un Būvgruži</h2>
            <div className="input-group">
              <label>Demontāžas apjoms (rēķina no platības)
                <select name="demolitionType" value={params.demolitionType} onChange={handleChange}>
                  {Object.entries(PRICES.demolition).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </label>
              <label>Būvgružu konteiners
                <select name="containerSize" value={params.containerSize} onChange={handleChange}>
                  {Object.entries(PRICES.container).map(([key, val]) => (
                    <option key={key} value={key}>{val.name} (Bāze {val.price} €)</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>1. Telpas Ģeometrija</h2>
            <div className="input-group-2">
              <label>Grīdas platība (m²)
                <input type="number" name="area" value={params.area} onChange={handleChange} step="0.5" />
              </label>
              <label>Griestu augstums (m)
                <input type="number" name="height" value={params.height} onChange={handleChange} step="0.1" />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Logu platība kopā (m²)
                <input type="number" name="windowArea" value={params.windowArea} onChange={handleChange} step="0.5" />
              </label>
              <label>Iekšdurvju skaits (gab)
                <input type="number" name="doorCount" value={params.doorCount} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>2. Grīdas Izbūve</h2>
            <div className="input-group">
              <label>Pamatnes Sagatavošana
                <select name="floorPrep" value={params.floorPrep} onChange={handleChange}>
                  {Object.entries(PRICES.floor_prep).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </label>
              <label>Grīdas Segums
                <select name="floorCover" value={params.floorCover} onChange={handleChange}>
                  {Object.entries(PRICES.floor_cover).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </label>
              <label>Kājlīstes (Perimetram)
                <select name="floorSkirting" value={params.floorSkirting} onChange={handleChange}>
                  {Object.entries(PRICES.floor_skirting).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>3. Sienu Apdare</h2>
            <div className="input-group">
              <label>Sienu Pamatnes Sagatavošana
                <select name="wallPrep" value={params.wallPrep} onChange={handleChange}>
                  {Object.entries(PRICES.wall_prep).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </label>
              <label>Noslēdzošā Apdare
                <select name="wallFinish" value={params.wallFinish} onChange={handleChange}>
                  {Object.entries(PRICES.wall_finish).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>4. Griesti un Ekstras</h2>
            <div className="input-group">
              <label>Griestu Izbūves Veids
                <select name="ceilingType" value={params.ceilingType} onChange={handleChange}>
                  {Object.entries(PRICES.ceiling_type).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </label>
              <label>Elektrības punkti (Rozetes, slēdži, lampas)
                <input type="number" name="elecPoints" value={params.elecPoints} onChange={handleChange} min="0" />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>5. Vizuālie Materiāli</h2>
            <div className="input-group">
              <label>Attēla URL (lielformāta)
                <input type="text" name="imageUrl" value={params.imageUrl} onChange={handleChange} placeholder="https://..." />
              </label>
              <label style={{ marginTop: '15px' }}>Video URL (YouTube/MP4)
                <input type="text" name="videoUrl" value={params.videoUrl} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>
          </section>

          {/* Lielā pogā "Aprēķināt" apakšā zem visām formām */}
          <button 
            onClick={handleCalculate}
            style={{ 
              background: '#2563eb', color: '#fff', border: 'none', padding: '24px', 
              fontSize: '1.4rem', fontWeight: 900, borderRadius: '12px', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '2px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s', marginTop: '20px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Sastādīt Tāmi
          </button>

        </div>

        {/* LABĀ PUSE: REZULTĀTI (Rāda tikai ja ir nospiests Aprēķināt) */}
        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Tāmes Detalizācija</h3>
            
            {!results ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>📊</div>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>Aizpildi datus un spied "Sastādīt Tāmi"</p>
                <p style={{ fontSize: '0.9rem' }}>Rezultāti un materiālu/darbu atšifrējums parādīsies šeit.</p>
              </div>
            ) : (
              <>
                <div className="geom-summary" style={{ marginBottom: '20px', marginTop: 0, padding: '12px' }}>
                  Telpas tips: <strong>{results.roomType}</strong><br/>
                  Sienas: <strong>{results.netWallArea.toFixed(1)} m²</strong> | Perimetrs: <strong>{results.perimeter.toFixed(1)} m</strong>
                </div>

                {results.imageUrl && (
                  <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <img src={results.imageUrl} alt="Telpas vizualizācija" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}

                {results.videoUrl && (
                  <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#000' }}>
                    {results.videoUrl.includes('youtube.com') || results.videoUrl.includes('youtu.be') ? (
                      <iframe 
                        width="100%" 
                        height="200" 
                        src={results.videoUrl.replace('watch?v=', 'embed/')} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video src={results.videoUrl} controls style={{ width: '100%', height: '200px' }} />
                    )}
                  </div>
                )}

                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Pozīcija</th>
                      <th>Materiāli</th>
                      <th>Darbs</th>
                      <th>Kopā</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>0. Demontāža (Konteineri, Darbs)</td>
                      <td>{results.demolitionCost.mat.toFixed(0)} €</td>
                      <td>{results.demolitionCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.demolitionCost.mat + results.demolitionCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>1. Grīda (m², m)</td>
                      <td>{results.floorCost.mat.toFixed(0)} €</td>
                      <td>{results.floorCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.floorCost.mat + results.floorCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>2. Sienas (m²)</td>
                      <td>{results.wallCost.mat.toFixed(0)} €</td>
                      <td>{results.wallCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.wallCost.mat + results.wallCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>3. Griesti (m²)</td>
                      <td>{results.ceilingCost.mat.toFixed(0)} €</td>
                      <td>{results.ceilingCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.ceilingCost.mat + results.ceilingCost.work).toFixed(0)} €</strong></td>
                    </tr>
                    <tr>
                      <td>4. Ekstras (Elektr., Durvis)</td>
                      <td>{results.extrasCost.mat.toFixed(0)} €</td>
                      <td>{results.extrasCost.work.toFixed(0)} €</td>
                      <td><strong>{(results.extrasCost.mat + results.extrasCost.work).toFixed(0)} €</strong></td>
                    </tr>
                  </tbody>
                  <tfoot className="table-totals">
                    <tr>
                      <td>KOPUMMĀ:</td>
                      <td className="text-blue">{results.totalMat.toFixed(0)} €</td>
                      <td className="text-orange">{results.totalWork.toFixed(0)} €</td>
                      <td className="text-green"></td>
                    </tr>
                  </tfoot>
                </table>

                <div className="grand-total-box">
                  <span className="gt-label">Projekta Kopējās Izmaksas</span>
                  <span className="gt-value">{results.grandTotal.toFixed(0)} €</span>
                  <span className="gt-subtext">Summās nav iekļauts PVN (21%)</span>
                  {results.countryMultiplier !== 1 && (
                     <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold' }}>Pielietots valsts tirgus koeficients: {results.countryMultiplier}x</div>
                  )}
                </div>

                <div className="action-buttons">
                  <button className="btn-primary">Ģenerēt PDF Tāmi</button>
                  <button className="btn-secondary">Saglabāt Draftu</button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}