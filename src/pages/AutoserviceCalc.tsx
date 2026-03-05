import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';
import { COUNTRIES, renderCountryOptions } from '../lib/constants';
import { useLocalStorage } from '../lib/useLocalStorage';

const JOBS = {
  maintenance: {
    oil_change: { name: 'Eļļas un filtru maiņa', price: 45, labor: 40 },
    brakes_front: { name: 'Priekšējo bremžu disku/kluču maiņa', price: 120, labor: 60 },
    brakes_rear: { name: 'Aizmugurējo bremžu disku/kluču maiņa', price: 110, labor: 60 },
    suspension_check: { name: 'Ritošās daļas diagnostika un remonts', price: 0, labor: 45 },
  },
  engine: {
    timing_belt: { name: 'Zobsiksnas komplekta maiņa', price: 250, labor: 180 },
    clutch: { name: 'Sajūga komplekta maiņa', price: 350, labor: 220 },
    alternator: { name: 'Ģeneratora remonts/maiņa', price: 140, labor: 50 },
  },
  diagnostics: {
    computer: { name: 'Datorizētā kļūdu lasīšana', price: 0, labor: 35 },
    electrical: { name: 'Elektrosistēmas diagnostika', price: 0, labor: 50 },
  }
};

export default function AutoserviceCalc() {
  const [params, setParams] = useLocalStorage('calc_params_autoservice', {
    country: 'lv',
    brand: 'Volvo',
    model: 'XC60',
    year: 2018,
    mileage: 150000,
    fuel: 'diesel',
    selectedJobs: [] as string[]
  });

  const [results, setResults] = useState<any>(null);

  const toggleJob = (jobId: string) => {
    const current = params.selectedJobs || [];
    const next = current.includes(jobId) 
      ? current.filter(id => id !== jobId)
      : [...current, jobId];
    setParams({ ...params, selectedJobs: next });
  };

  const handleCalculate = () => {
    const workMult = COUNTRIES[params.country as keyof typeof COUNTRIES].workMult;
    const matMult = COUNTRIES[params.country as keyof typeof COUNTRIES].matMult;

    let totalMat = 0;
    let totalWork = 0;
    const detailedJobs: any[] = [];

    const allJobs = { ...JOBS.maintenance, ...JOBS.engine, ...JOBS.diagnostics };
    
    (params.selectedJobs || []).forEach(jobId => {
      const job = (allJobs as any)[jobId];
      if (job) {
        const m = job.price * matMult;
        const w = job.labor * workMult;
        totalMat += m;
        totalWork += w;
        detailedJobs.push({ name: job.name, mat: m, work: w });
      }
    });

    setResults({
      jobs: detailedJobs,
      totalMat,
      totalWork,
      grandTotal: totalMat + totalWork
    });
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1>PRO Auto Servisa Tāme</h1>
        <p>Precīzs remontdarbu un rezerves daļu aprēķins jūsu automašīnai.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section" style={{ background: '#f8fafc', borderLeftColor: '#eab308' }}>
            <h2>Auto un Lokācija</h2>
            <div className="input-group-2">
              <label>Valsts
                <select value={params.country} onChange={e => setParams({...params, country: e.target.value})}>
                  {renderCountryOptions()}
                </select>
              </label>
              <label>Izlaiduma gads
                <input type="number" value={params.year} onChange={e => setParams({...params, year: parseInt(e.target.value) || 2018})} />
              </label>
            </div>
            <div className="input-group-2" style={{ marginTop: '15px' }}>
              <label>Marka / Modelis
                <input type="text" value={`${params.brand} ${params.model}`} onChange={e => {
                  const parts = e.target.value.split(' ');
                  setParams({...params, brand: parts[0] || '', model: parts.slice(1).join(' ') || ''});
                }} />
              </label>
              <label>Nobraukums (km)
                <input type="number" value={params.mileage} onChange={e => setParams({...params, mileage: parseInt(e.target.value) || 0})} />
              </label>
            </div>
          </section>

          <section className="calc-section">
            <h2>Izvēlieties darbus</h2>
            {Object.entries(JOBS).map(([catKey, category]: [string, any]) => (
              <div key={catKey} style={{ marginBottom: '20px' }}>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
                  {catKey === 'maintenance' ? 'Apkope' : catKey === 'engine' ? 'Dzinējs / Transmisija' : 'Diagnostika'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(category).map(([id, job]: [string, any]) => (
                    <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: (params.selectedJobs || []).includes(id) ? '#fefce8' : '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={(params.selectedJobs || []).includes(id)} onChange={() => toggleJob(id)} style={{ width: '18px', height: '18px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{job.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Daļas no {job.price}€ · Darbs no {job.labor}€</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <button onClick={handleCalculate} className="btn-primary" style={{ background: '#eab308', color: '#000' }}>Aprēķināt Servisa Tāmi</button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results" style={{ borderColor: '#eab308' }}>
            <h3 className="results-title">Servisa Specifikācija</h3>
            {!results ? (
              <div className="empty-state"><div className="empty-state-icon">🔧</div><p>Izvēlieties darbus un spiediet Aprēķināt</p></div>
            ) : (
              <>
                <table className="results-table">
                  <thead><tr><th>Darbs</th><th>Detaļas</th><th>Darbs</th></tr></thead>
                  <tbody>
                    {results.jobs.map((j: any, i: number) => (
                      <tr key={i}>
                        <td>{j.name}</td>
                        <td>{j.mat.toFixed(0)} €</td>
                        <td>{j.work.toFixed(0)} €</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-totals">
                    <tr><td>KOPUMMĀ:</td><td className="text-blue">{results.totalMat.toFixed(0)} €</td><td className="text-orange">{results.totalWork.toFixed(0)} €</td></tr>
                  </tfoot>
                </table>
                <div className="grand-total-box" style={{ background: '#fefce8', borderColor: '#fef08a' }}>
                  <span className="gt-label">Remonta budžets (ar PVN)</span>
                  <span className="gt-value">{(results.grandTotal * 1.21).toFixed(0)} €</span>
                </div>
                <button 
                  onClick={() => alert("Pieteikums nosūtīts servisam!")}
                  className="btn-primary" style={{ width: '100%', marginTop: '20px', background: '#000' }}>
                  PIETEIKT VIZĪTI
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
