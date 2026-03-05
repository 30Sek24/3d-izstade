import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';

const DAYS = [
  { day: 1, title: 'Idejas Definēšana', desc: 'Noformulē savu unikālo piedāvājumu (USP). Ar ko tu atšķiries no citiem meistariem? Definē savu galveno nišu (piem. tikai flīzēšana vai pilna apdare).', cat: 'stratēģija' },
  { day: 2, title: 'Tirgus Izpēte', desc: 'Apskati konkurentus savā reģionā. Kādas ir viņu cenas un vājās vietas? Atrodi tukšās vietas tirgū, kuras tu vari aizpildīt labāk.', cat: 'stratēģija' },
  { day: 3, title: 'Zīmola Izveide', desc: 'Izveido vienkāršu logo un nosaukumu. Atceries - uzticamība sākas ar vizuālo tēlu. Izvēlies krāsas, kas asociējas ar kvalitāti un drošību.', cat: 'mārketings' },
  { day: 4, title: 'Dokumentu Sakārtošana', desc: 'Lejupielādē standarta līguma paraugu no Dokumentu Huba un pielāgo to sev. Sagatavo darba drošības instrukcijas un garantijas lapu.', cat: 'juridiskie' },
  { day: 5, title: 'Pirmā Tāme', desc: 'Izmanto mūsu PRO kalkulatorus un izveido parauga tāmi sapņu projektam. Iemācies pamatot katru pozīciju klientam, lai nebūtu jautājumu par cenu.', cat: 'operācijas' },
  { day: 6, title: 'Sociālo Tīklu Uzstādīšana', desc: 'Izveido Facebook un Instagram biznesa lapas. Nopublicē pirmo ierakstu par saviem pakalpojumiem un vērtībām. Pievieno kvalitatīvu profila bildi.', cat: 'mārketings' },
  { day: 7, title: 'Portfolio Atlasīšana', desc: 'Sāc vākt bildes no saviem darbiem. Pat ja tie ir mazi labojumi - tie ir tavi rezultāti. Izveido "Pirms un Pēc" albumus katrā nozarei.', cat: 'mārketings' },
  { day: 8, title: 'Cenu Lapas Izveide', desc: 'Definē savas stundas likmes un izmaksas dažādiem darbu veidiem. Sagatavo saprotamu cenrādi, ko vari ātri nosūtīt interesentiem.', cat: 'operācijas' },
  { day: 9, title: 'Pirmais Sludinājums', desc: 'Ievieto sludinājumu vietējā grupā vai portālā, izmantojot mūsu reklāmas šablonu. Pievieno savu labāko darbu foto un tiešu aicinājumu sazināties.', cat: 'pārdošana' },
  { day: 10, title: 'Kvalitātes Standarti', desc: 'Uzraksti savu 5 punktu solījumu klientam par to, kā tu strādā (piem. tīrība, termiņi, komunikācija). Tas būs tavs kvalitātes zīmogs.', cat: 'stratēģija' },
  { day: 11, title: 'Instrumentu Audits', desc: 'Pārbaudi savu aprīkojumu. Vai viss ir darba kārtībā? Sastādi sarakstu ar nepieciešamajiem papildinājumiem darba efektivitātes celšanai.', cat: 'operācijas' },
  { day: 12, title: 'Piegādātāju Kontakti', desc: 'Atrodi labākos materiālu piegādātājus un noskaidro par meistaru atlaidēm. Izveido kontaktu sarakstu ātrai materiālu sagādei.', cat: 'operācijas' },
  { day: 13, title: 'Atsauksmju Vākšana', desc: 'Sazinies ar iepriekšējiem klientiem un palūdz īsu atsauksmi. Publicē tās savos sociālajos tīklos, lai vairotu uzticību.', cat: 'mārketings' },
  { day: 14, title: 'Google Business Profile', desc: 'Reģistrē savu uzņēmumu Google Maps. Tas ļaus vietējiem klientiem tevi vieglāk atrast un rakstīt atsauksmes tieši tur.', cat: 'mārketings' },
  { day: 15, title: 'Finanšu Plānošana', desc: 'Izveido sistēmu ieņēmumu un izdevumu uzskaitei. Aprēķini, cik daudz tev jānopelna, lai segtu visus nodokļus un amortizāciju.', cat: 'finanses' },
  { day: 16, title: 'Sadarbības Partneri', desc: 'Atrodi meistarus no citām nozarēm (piem. elektriķi, ja esi apdarnieks), ar kuriem vari apmainīties ar klientiem.', cat: 'stratēģija' },
  { day: 17, title: 'Pārdošanas Skripts', desc: 'Sagatavo atbildes uz biežākajiem klientu jautājumiem un iebildumiem. Iemācies profesionāli "pārdot" savu dārgāko cenu caur kvalitāti.', cat: 'pārdošana' },
  { day: 18, title: 'Video Saturs', desc: 'Nofilmē īsu video (Reels/TikTok) par kādu darba procesu vai noderīgu padomu klientam. Video rada personīgāku saikni.', cat: 'mārketings' },
  { day: 19, title: 'Objekta Apskate', desc: 'Izveido kontrolsarakstu objekta pirmajai apskatei. Ko tieši tu pārbaudi un kādus jautājumus uzdod klientam uz vietas.', cat: 'operācijas' },
  { day: 20, title: 'Garantijas Serviss', desc: 'Nodefinē, kā tieši strādā tava garantija. Klientam jājūtas drošam, ka tu nepazudīsi, ja parādīsies kāda problēma pēc gada.', cat: 'juridiskie' },
  { day: 21, title: 'E-pasta Mārketings', desc: 'Izveido sarakstu ar potenciālajiem sadarbības partneriem (arhitekti, mākleri) un nosūti tiem savu profesionālo portfolio.', cat: 'pārdošana' },
  { day: 22, title: 'Laika Menedžments', desc: 'Ievies kalendāru, kurā plāno ne tikai darbus, bet arī tāmu gatavošanu un tikšanās. Nepārplāno sevi - atstāj laiku negaidītiem darbiem.', cat: 'operācijas' },
  { day: 23, title: 'Biznesa Kartītes', desc: 'Pasūti vai izveido digitālo vizītkarti (QR kodu). Tam jābūt vienmēr līdzi, lai katra tikšanās varētu kļūt par potenciālu darbu.', cat: 'mārketings' },
  { day: 24, title: 'Nodokļu Optimizācija', desc: 'Konsultējies ar grāmatvedi par piemērotāko nodokļu režīmu tavam biznesa mērogam. Nezināšana nav attaisnojums.', cat: 'finanses' },
  { day: 25, title: 'Objekta Foto sesija', desc: 'Uzaicini profesionālu fotogrāfu vai iemācies pats nofotografēt pabeigtu objektu kā žurnāla vākam. Kvalitatīvas bildes pārdod pašas.', cat: 'mārketings' },
  { day: 26, title: 'Klientu Lojalitāte', desc: 'Izdomā mazu bonusu vai dāvanu klientam pēc objekta nodošanas. Tas garantēs labas atsauksmes un ieteikumus tālāk.', cat: 'stratēģija' },
  { day: 27, title: 'Profesionālā Izaugsme', desc: 'Atrodi meistarklasi vai kursus par jaunākajām tehnoloģijām savā nozarē. Esi vienu soli priekšā citiem ar savām zināšanām.', cat: 'stratēģija' },
  { day: 28, title: 'Darba Apģērbs', desc: 'Iegādājies kvalitatīvu darba apģērbu ar sava zīmola logo. Tavs izskats objektā ir tava vizītkarte un uzticamības garants.', cat: 'mārketings' },
  { day: 29, title: 'Mēneša Analīze', desc: 'Apskati, cik daudz pieteikumu esi saņēmis un cik no tiem kļuvuši par darbiem. Kas strādāja vislabāk un ko mainīt nākamajā mēnesī?', cat: 'stratēģija' },
  { day: 30, title: 'Oficiālā Atklāšana', desc: 'Apsveicu! Tavs biznesa pamats ir uzbūvēts. Tagad dodies uz Expo halli, paņem savu stendu un sāc strādāt pilnā jaudā!', cat: 'stratēģija' },
];

export default function BusinessGame() {
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('biz_game_progress');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeDay, setActiveDay] = useState(1);

  const toggleDay = (day: number) => {
    const newCompleted = completedDays.includes(day) 
      ? completedDays.filter(d => d !== day) 
      : [...completedDays, day];
    setCompletedDays(newCompleted);
    localStorage.setItem('biz_game_progress', JSON.stringify(newCompleted));
  };

  const progress = (completedDays.length / 30) * 100;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'stratēģija': return '#3b82f6';
      case 'mārketings': return '#ec4899';
      case 'juridiskie': return '#64748b';
      case 'operācijas': return '#f59e0b';
      case 'pārdošana': return '#10b981';
      case 'finanses': return '#8b5cf6';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="calculator-pro-wrapper" style={{ paddingBottom: '100px' }}>
      <div className="calc-header">
        <h1 style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px' }}>
          30 DIENAS LĪDZ BIZNESAM
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '15px auto' }}>
          Soli pa solim no meistara par veiksmīgu uzņēmēju. Izpildi uzdevumus un iekaro savu tirgu.
        </p>
      </div>

      {/* Progress Section */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontWeight: 800, color: '#0f172a' }}>TAVA IZAICINĀJUMA PROGRESS</span>
          <span style={{ fontWeight: 900, color: '#3b82f6', fontSize: '1.5rem' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: '50px', height: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', height: '100%', transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}></div>
        </div>
        <p style={{ marginTop: '15px', color: '#64748b', fontSize: '0.9rem' }}>
          {completedDays.length === 30 ? '🔥 IZCILI! Tu esi pabeidzis visu izaicinājumu!' : `Pabeigti ${completedDays.length} no 30 uzdevumiem. Turpini strādāt!`}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px' }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(dayNum => {
            const isCompleted = completedDays.includes(dayNum);
            const isCurrent = dayNum === activeDay;
            const task = DAYS.find(d => d.day === dayNum);

            return (
              <div 
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                style={{ 
                  aspectRatio: '1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#fff',
                  color: (isCompleted || isCurrent) ? '#fff' : '#1e293b',
                  border: isCurrent ? '4px solid #bfdbfe' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isCurrent ? '0 15px 30px -5px rgba(59, 130, 246, 0.4)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>DIENA</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>{dayNum}</div>
                {isCompleted && <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1rem' }}>✅</div>}
                {task && !isCompleted && !isCurrent && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getCategoryColor(task.cat), marginTop: '8px' }}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Task Details Sidebar */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '40px', position: 'sticky', top: '24px', height: 'fit-content', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{activeDay}.</h2>
            {DAYS.find(d => d.day === activeDay) && (
              <span style={{ 
                padding: '6px 16px', borderRadius: '50px', 
                background: getCategoryColor(DAYS.find(d => d.day === activeDay)!.cat) + '15', 
                color: getCategoryColor(DAYS.find(d => d.day === activeDay)!.cat),
                fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                {DAYS.find(d => d.day === activeDay)?.cat}
              </span>
            )}
          </div>

          {DAYS.find(d => d.day === activeDay) ? (
            <>
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '20px', lineHeight: 1.3 }}>{DAYS.find(d => d.day === activeDay)?.title}</h3>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '40px' }}>
                {DAYS.find(d => d.day === activeDay)?.desc}
              </p>
              
              <button 
                onClick={() => toggleDay(activeDay)}
                style={{ 
                  width: '100%', padding: '20px', borderRadius: '12px', border: 'none', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer',
                  background: completedDays.includes(activeDay) ? '#f1f5f9' : '#0f172a',
                  color: completedDays.includes(activeDay) ? '#64748b' : '#fff',
                  boxShadow: completedDays.includes(activeDay) ? 'none' : '0 10px 20px rgba(15, 23, 42, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                {completedDays.includes(activeDay) ? 'Uzdevums pabeigts' : 'Atzīmēt kā pabeigtu'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.2 }}>🏁</div>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Šis ir pēdējais solis tavā ceļā uz biznesu!</p>
            </div>
          )}
          
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>Padoms:</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ fontSize: '1.5rem' }}>💡</div>
              <p style={{ fontSize: '0.95rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                Katrs pabeigtais uzdevums tevi tuvina "PRO" statusam izstādē un palielina tavu uzticamību klientu acīs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
