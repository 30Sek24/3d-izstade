import { useState, useEffect } from 'react';
import '../components/calculator/styles/CalculatorPro.css';

const DAYS = [
  { day: 1, title: 'Idejas Definēšana', desc: 'Noformulē savu unikālo piedāvājumu (USP). Ar ko tu atšķiries no citiem meistariem?', cat: 'stratēģija' },
  { day: 2, title: 'Tirgus Izpēte', desc: 'Apskati konkurentus savā reģionā. Kādas ir viņu cenas un vājās vietas?', cat: 'stratēģija' },
  { day: 3, title: 'Zīmola Izveide', desc: 'Izveido vienkāršu logo un nosaukumu. Atceries - uzticamība sākas ar vizuālo tēlu.', cat: 'mārketings' },
  { day: 4, title: 'Dokumentu Sakārtošana', desc: 'Lejupielādē standarta līguma paraugu no Dokumentu Huba un pielāgo to sev.', cat: 'juridiskie' },
  { day: 5, title: 'Pirmā Tāme', desc: 'Izmanto PRO kalkulatoru un izveido parauga tāmi savam sapņu projektam.', cat: 'operācijas' },
  { day: 6, title: 'Sociālo Tīklu Uzstādīšana', desc: 'Izveido Facebook un Instagram biznesa lapas. Nopublicē pirmo ierakstu par saviem pakalpojumiem.', cat: 'mārketings' },
  { day: 7, title: 'Portfolio Atlasīšana', desc: 'Sāc vākt bildes no saviem darbiem. Pat ja tie ir mazi labojumi - tie ir tavi rezultāti.', cat: 'mārketings' },
  { day: 8, title: 'Cenu Lapas Izveide', desc: 'Definē savas stundas likmes un izmaksas dažādiem darbu veidiem.', cat: 'operācijas' },
  { day: 9, title: 'Pirmais Sludinājums', desc: 'Ievieto sludinājumu vietējā grupā vai portālā, izmantojot mūsu reklāmas šablonu.', cat: 'pārdošana' },
  { day: 10, title: 'Kvalitātes Standarti', desc: 'Uzraksti savu 5 punktu solījumu klientam par to, kā tu strādā.', cat: 'stratēģija' },
  // ... more days can be added
];

export default function BusinessGame() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('biz_game_progress');
    if (saved) setCompletedDays(JSON.parse(saved));
  }, []);

  const toggleDay = (day: number) => {
    const newCompleted = completedDays.includes(day) 
      ? completedDays.filter(d => d !== day) 
      : [...completedDays, day];
    setCompletedDays(newCompleted);
    localStorage.setItem('biz_game_progress', JSON.stringify(newCompleted));
  };

  const progress = (completedDays.length / 30) * 100;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <div className="calc-header">
        <h1 style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem', fontWeight: 900 }}>
          30 DIENAS LĪDZ BIZNESAM
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Tavs interaktīvais ceļvedis uz veiksmīgu uzņēmumu celtniecības nozarē.</p>
      </div>

      {/* Progress Bar */}
      <div style={{ background: '#f1f5f9', borderRadius: '50px', height: '20px', marginBottom: '40px', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <div style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', height: '100%', transition: 'width 0.5s ease' }}></div>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem', fontWeight: 'bold', color: progress > 50 ? '#fff' : '#1e293b' }}>
          {Math.round(progress)}% PABEIGTS
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(dayNum => {
            const isCompleted = completedDays.includes(dayNum);
            const isLocked = dayNum > completedDays.length + 1;
            const isCurrent = dayNum === activeDay;

            return (
              <div 
                key={dayNum}
                onClick={() => !isLocked && setActiveDay(dayNum)}
                style={{ 
                  aspectRatio: '1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#fff',
                  color: (isCompleted || isCurrent) ? '#fff' : '#1e293b',
                  border: isCurrent ? '4px solid #bfdbfe' : '1px solid #e2e8f0',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.4 : 1,
                  boxShadow: isCurrent ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Diena</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{dayNum}</div>
                {isCompleted && <div style={{ fontSize: '0.8rem' }}>✓</div>}
              </div>
            );
          })}
        </div>

        {/* Task Details */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', position: 'sticky', top: '20px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Diena {activeDay}</h2>
          {DAYS.find(d => d.day === activeDay) ? (
            <>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px' }}>
                {DAYS.find(d => d.day === activeDay)?.cat}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '15px' }}>{DAYS.find(d => d.day === activeDay)?.title}</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '30px' }}>{DAYS.find(d => d.day === activeDay)?.desc}</p>
              
              <button 
                onClick={() => toggleDay(activeDay)}
                style={{ 
                  width: '100%', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                  background: completedDays.includes(activeDay) ? '#f1f5f9' : '#10b981',
                  color: completedDays.includes(activeDay) ? '#64748b' : '#fff'
                }}
              >
                {completedDays.includes(activeDay) ? 'Atzīmēt kā nepabeigtu' : 'Pabeigt uzdevumu'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔒</div>
              <p>Uzdevums vēl nav atvērts vai tiek izstrādāts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}