import { useState } from 'react';
import '../components/calculator/CalculatorLayout.css';

export default function AutoserviceCalc() {
  const [auto, setAuto] = useState({ brand: '', model: '', year: 2016, mileage: 185000, fuel: 'diesel', condition: 'good' });
  const [jobs, setJobs] = useState<Record<string, boolean>>({ oil: true });
  const [keys, setKeys] = useState({ type: 'remote', count: 1, allLost: false });

  // Job definitions
  const availableJobs = [
    { id: 'oil', label: 'Eļļa + filtri', min: 85, max: 180 },
    { id: 'brakes', label: 'Bremžu diski/kluči (ass)', min: 120, max: 320 },
    { id: 'diag', label: 'Diagnostika + elektro pārbaude', min: 70, max: 180 },
    { id: 'sus', label: 'Piekare (tipveida mezgli)', min: 90, max: 260 },
    { id: 'ac', label: 'Kondicioniera serviss', min: 45, max: 120 },
    { id: 'tires', label: 'Riepu montāža/balansēšana', min: 30, max: 90 },
  ];

  // Logic from legacy code
  const age = Math.max(0, 2026 - auto.year);
  const basePerYear = age <= 2 ? 18500 : age <= 5 ? 13800 : age <= 8 ? 9800 : age <= 12 ? 6400 : 3600;
  const conditionFactor = auto.condition === 'excellent' ? 1.08 : auto.condition === 'good' ? 1.0 : auto.condition === 'average' ? 0.9 : 0.8;
  const fuelFactor = auto.fuel === 'ev' ? 1.12 : auto.fuel === 'hybrid' ? 1.06 : auto.fuel === 'diesel' ? 0.97 : 1.0;
  const mileageFactor = auto.mileage > 280000 ? 0.78 : auto.mileage > 200000 ? 0.86 : auto.mileage > 130000 ? 0.94 : 1.03;
  
  const marketBase = basePerYear * conditionFactor * fuelFactor * mileageFactor;
  const valueMin = Math.round(marketBase * 0.9);
  const valueMax = Math.round(marketBase * 1.1);

  let serviceMin = 0;
  let serviceMax = 0;
  availableJobs.forEach(job => {
    if (jobs[job.id]) {
      serviceMin += job.min;
      serviceMax += job.max;
    }
  });

  let oneMin = keys.type === 'basic' ? 35 : keys.type === 'remote' ? 95 : 180;
  let oneMax = keys.type === 'basic' ? 90 : keys.type === 'remote' ? 220 : 420;
  let keyMin = oneMin * keys.count;
  let keyMax = oneMax * keys.count;
  if (keys.allLost && keys.count > 0) {
    keyMin += 120;
    keyMax += 280;
  }

  const totalMin = serviceMin + keyMin;
  const totalMax = serviceMax + keyMax;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Autoservisa Kalkulators (Portēts)</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Ātrs aprēķins pēc auto parametriem un izmaksu modelēšana.</p>

      <div className="calc-editor-container" style={{ gridTemplateColumns: '1fr 1fr', height: 'auto', gap: '40px' }}>
        {/* KREISĀ PUSE: IEVADE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="takeoff-module">
            <h3>1. Auto profils</h3>
            <div className="takeoff-grid" style={{ marginTop: '15px' }}>
              <label>Marka <input type="text" value={auto.brand} onChange={e => setAuto({...auto, brand: e.target.value})} placeholder="Piem. Volvo" /></label>
              <label>Modelis <input type="text" value={auto.model} onChange={e => setAuto({...auto, model: e.target.value})} placeholder="Piem. XC60" /></label>
              <label>Gads <input type="number" value={auto.year} onChange={e => setAuto({...auto, year: parseInt(e.target.value) || 2016})} /></label>
              <label>Nobraukums (km) <input type="number" step="1000" value={auto.mileage} onChange={e => setAuto({...auto, mileage: parseInt(e.target.value) || 0})} /></label>
              <label>Dzinējs 
                <select style={{ padding: '10px', marginTop: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} value={auto.fuel} onChange={e => setAuto({...auto, fuel: e.target.value})}>
                  <option value="petrol">Benzīns</option><option value="diesel">Dīzelis</option>
                  <option value="hybrid">Hibrīds</option><option value="ev">Elektriskais</option>
                </select>
              </label>
              <label>Stāvoklis 
                <select style={{ padding: '10px', marginTop: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} value={auto.condition} onChange={e => setAuto({...auto, condition: e.target.value})}>
                  <option value="excellent">Ļoti labs</option><option value="good">Labs</option>
                  <option value="average">Vidējs</option><option value="poor">Vājš</option>
                </select>
              </label>
            </div>
          </div>

          <div className="takeoff-module">
            <h3>2. Servisa darbi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              {availableJobs.map(job => (
                <label key={job.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!jobs[job.id]} onChange={e => setJobs({...jobs, [job.id]: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                  {job.label} <span style={{ color: '#666', fontSize: '0.85em' }}>({job.min} - {job.max} €)</span>
                </label>
              ))}
            </div>
          </div>

          <div className="takeoff-module">
            <h3>3. Atslēgu modelēšana</h3>
            <div className="takeoff-grid" style={{ marginTop: '15px' }}>
              <label>Atslēgas tips
                <select style={{ padding: '10px', marginTop: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} value={keys.type} onChange={e => setKeys({...keys, type: e.target.value})}>
                  <option value="basic">Parastā atslēga</option>
                  <option value="remote">Pults atslēga</option>
                  <option value="smart">Smart key / keyless</option>
                </select>
              </label>
              <label>Skaits
                <input type="number" min="0" max="4" value={keys.count} onChange={e => setKeys({...keys, count: parseInt(e.target.value) || 0})} />
              </label>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', cursor: 'pointer' }}>
              <input type="checkbox" checked={keys.allLost} onChange={e => setKeys({...keys, allLost: e.target.checked})} style={{ width: '18px', height: '18px' }}/>
              Nav palikusi neviena strādājoša atslēga (+ izmaksas)
            </label>
          </div>

        </div>

        {/* LABĀ PUSE: REZULTĀTI */}
        <div style={{ position: 'sticky', top: '20px', alignSelf: 'start' }}>
          <div className="summary-card" style={{ background: '#111827', color: 'white', border: 'none' }}>
            <h3 style={{ borderBottomColor: '#374151', color: '#eab308' }}>Rezultāts</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9em', marginBottom: '20px' }}>
              {auto.brand || 'Auto'} {auto.model || 'modelis'} · orientējošs modelis
            </p>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '0.85em', color: '#9ca3af', textTransform: 'uppercase' }}>Servisa darbi</div>
              <div style={{ fontSize: '1.2rem' }}>{serviceMin} - {serviceMax} €</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '0.85em', color: '#9ca3af', textTransform: 'uppercase' }}>Atslēgas</div>
              <div style={{ fontSize: '1.2rem' }}>{keyMin} - {keyMax} €</div>
            </div>

            <div style={{ margin: '20px 0', height: '1px', background: '#374151' }}></div>

            <div style={{ marginBottom: '25px' }}>
              <div style={{ fontSize: '0.85em', color: '#9ca3af', textTransform: 'uppercase' }}>Kopējais remonts (Aptuveni)</div>
              <div style={{ fontSize: '1.8rem', color: '#eab308', fontWeight: 'bold' }}>{totalMin} - {totalMax} €</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85em', color: '#9ca3af', textTransform: 'uppercase' }}>Tirgus vērtējums auto tirdzniecībai</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{valueMin} - {valueMax} €</div>
            </div>

            <button className="btn w-full" style={{ marginTop: '20px', background: '#eab308', color: '#000', fontWeight: 'bold' }}>
              Pieteikt Servisa Darbu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}