import { useState } from 'react';

type Scenario = 'Conservative' | 'Base' | 'Aggressive';

export default function AdminFinance() {
  const [scenario, setScenario] = useState<Scenario>('Base');

  // Ievades parametri
  const [inputs, setInputs] = useState({
    boothsTotal: 24,
    boothOccupancyPct: 40,
    boothPriceMonth: 290,
    premiumWallSlots: 6,
    standardWallSlots: 6,
    wallFillPct: 50,
    premiumWallPriceWeek: 800,
    standardWallPriceWeek: 500,
    leadsExpectedPerDay: 50,
    leadPrice: 15,
  });

  const handleInputChange = (field: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const applyScenario = (s: Scenario) => {
    setScenario(s);
    if (s === 'Conservative') {
      setInputs(prev => ({ ...prev, boothOccupancyPct: 20, wallFillPct: 25, leadsExpectedPerDay: 20 }));
    } else if (s === 'Base') {
      setInputs(prev => ({ ...prev, boothOccupancyPct: 40, wallFillPct: 50, leadsExpectedPerDay: 50 }));
    } else if (s === 'Aggressive') {
      setInputs(prev => ({ ...prev, boothOccupancyPct: 80, wallFillPct: 90, leadsExpectedPerDay: 150 }));
    }
  };

  // Aprēķini
  const activeBooths = Math.round(inputs.boothsTotal * (inputs.boothOccupancyPct / 100));
  const boothMrr = activeBooths * inputs.boothPriceMonth;

  const activePremiumWalls = Math.round(inputs.premiumWallSlots * (inputs.wallFillPct / 100));
  const activeStandardWalls = Math.round(inputs.standardWallSlots * (inputs.wallFillPct / 100));
  
  // Reklāmas = nedēļas cena * 4 nedēļas
  const premiumAdMrr = activePremiumWalls * inputs.premiumWallPriceWeek * 4;
  const standardAdMrr = activeStandardWalls * inputs.standardWallPriceWeek * 4;
  const totalAdMrr = premiumAdMrr + standardAdMrr;

  // Līdi mēnesī
  const leadRevenueMonth = inputs.leadsExpectedPerDay * 30 * inputs.leadPrice;

  const totalMrr = boothMrr + totalAdMrr + leadRevenueMonth;
  const arr = totalMrr * 12;

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\\n"
      + "Scenario," + scenario + "\\n"
      + "MRR," + totalMrr + "\\n"
      + "ARR," + arr + "\\n"
      + "Ad Revenue," + totalAdMrr + "\\n"
      + "Booth Revenue," + boothMrr + "\\n"
      + "Lead Revenue," + leadRevenueMonth + "\\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finance_export_${scenario.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Platformas Finanšu Modelēšana (MRR/KPI)</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {(['Conservative', 'Base', 'Aggressive'] as Scenario[]).map(s => (
          <button 
            key={s} 
            onClick={() => applyScenario(s)}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '6px', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: 'bold',
              background: scenario === s ? '#3b82f6' : '#e2e8f0',
              color: scenario === s ? '#fff' : '#475569'
            }}
          >
            {s} Scenārijs
          </button>
        ))}
        <button onClick={exportCSV} style={{ marginLeft: 'auto', padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          📥 Eksportēt CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* IEVADES */}
        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <h2 style={{ marginTop: 0, color: '#0f172a' }}>Pieņēmumi un Cenas</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#64748b', marginBottom: '10px' }}>🎪 Stendi</h4>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <span style={{ display: 'inline-block', width: '200px' }}>Aizpildījums (%)</span>
              <input type="number" value={inputs.boothOccupancyPct} onChange={e => handleInputChange('boothOccupancyPct', Number(e.target.value))} style={{ width: '80px', padding: '5px' }} /> %
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ display: 'inline-block', width: '200px' }}>Mēneša maksa (€)</span>
              <input type="number" value={inputs.boothPriceMonth} onChange={e => handleInputChange('boothPriceMonth', Number(e.target.value))} style={{ width: '80px', padding: '5px' }} /> €
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#64748b', marginBottom: '10px' }}>📺 Reklāmas Sienas</h4>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <span style={{ display: 'inline-block', width: '200px' }}>Aizpildījums (%)</span>
              <input type="number" value={inputs.wallFillPct} onChange={e => handleInputChange('wallFillPct', Number(e.target.value))} style={{ width: '80px', padding: '5px' }} /> %
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <span style={{ display: 'inline-block', width: '200px' }}>Premium Sienas Cena (€/ned)</span>
              <input type="number" value={inputs.premiumWallPriceWeek} onChange={e => handleInputChange('premiumWallPriceWeek', Number(e.target.value))} style={{ width: '80px', padding: '5px' }} /> €
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ display: 'inline-block', width: '200px' }}>Standarta Sienas Cena (€/ned)</span>
              <input type="number" value={inputs.standardWallPriceWeek} onChange={e => handleInputChange('standardWallPriceWeek', Number(e.target.value))} style={{ width: '80px', padding: '5px' }} /> €
            </label>
          </div>

          <div>
            <h4 style={{ color: '#64748b', marginBottom: '10px' }}>🎣 Līdu Pārdošana</h4>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <span style={{ display: 'inline-block', width: '200px' }}>Sagaidāmi Līdi dienā</span>
              <input type="number" value={inputs.leadsExpectedPerDay} onChange={e => handleInputChange('leadsExpectedPerDay', Number(e.target.value))} style={{ width: '80px', padding: '5px' }} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ display: 'inline-block', width: '200px' }}>Vidējā Līda Cena (€)</span>
              <input type="number" value={inputs.leadPrice} onChange={e => handleInputChange('leadPrice', Number(e.target.value))} style={{ width: '80px', padding: '5px' }} /> €
            </label>
          </div>
        </div>

        {/* REZULTĀTI */}
        <div>
          <div style={{ background: '#0f172a', color: '#fff', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
            <h2 style={{ marginTop: 0, color: '#3b82f6' }}>MRR: €{totalMrr.toLocaleString()} / mēn</h2>
            <h3 style={{ margin: 0, color: '#10b981' }}>ARR: €{arr.toLocaleString()} / gadā</h3>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0 }}>Ieņēmumu Sadalījums</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Reklāmas (Ads)</span>
              <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>€{totalAdMrr.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Stendu Abonementi</span>
              <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>€{boothMrr.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span>Līdu Tirdzniecība</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>€{leadRevenueMonth.toLocaleString()}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#fef3c7', color: '#92400e', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>💡 Padoms €10k Mērķim:</strong> Ja Premium reklāmas aizpildījums palielinās par 20%, jūs sasniedzat dienas normu ātrāk. Galvenais dzinējspēks ir *Performance* pierādīšana (impresijas) caur telemetriju.
          </div>
        </div>
      </div>
    </div>
  );
}