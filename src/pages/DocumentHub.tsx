import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';

const TEMPLATES = [
  { id: 'contract', title: 'Būvdarbu Līgums', type: 'doc', desc: 'Juridiski korekts līgums ar apmaksu grafiku un garantijām.' },
  { id: 'invoice', title: 'Rēķins (Invoice)', type: 'doc', desc: 'Standarta rēķins PDF formātā izsūtīšanai klientam.' },
  { id: 'act', title: 'Pieņemšanas-Nodošanas Akts', type: 'doc', desc: 'Dokuments, kas apstiprina darbu pabeigšanu bez pretenzijām.' },
  { id: 'guarantee', title: 'Garantijas Lapa', type: 'doc', desc: 'Dokuments klientam ar instrukcijām un garantijas termiņu.' },
  { id: 'safety', title: 'Drošības Noteikumi', type: 'doc', desc: 'Darba drošības parakstu lapa objektam.' },
  { id: 'portfolio', title: 'Portfolio Projekta Lapa', type: 'marketing', desc: 'Vizuāla lapa ar "Pirms/Pēc" bildēm un darba aprakstu.' },
  { id: 'ads', title: 'Satura/Reklāmas Šabloni (FB/IG)', type: 'marketing', desc: 'Gatavi teksti un āķi (hooks) sociālo tīklu reklāmām.' },
];

export default function DocumentHub() {
  const [activeTab, setActiveTab] = useState<'doc' | 'marketing'>('doc');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    alert(`Tiek ģenerēts un lejupielādēts: ${title}.pdf\n\n(Šī ir demonstrācijas versija. Īstajā vidē šeit atvērsies PDF fails)`);
  };

  const handleCustomize = (id: string) => {
    setSelectedTemplate(selectedTemplate === id ? null : id);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Meistara PRO Komplekts</h1>
      <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1.1rem' }}>
        Tavs dokumentu un mārketinga arsenāls. Ģenerē līgumus, rēķinus un reklāmas tieši no sistēmas.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #e2e8f0', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('doc')}
          style={{ 
            background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer',
            borderBottom: activeTab === 'doc' ? '3px solid #0f172a' : '3px solid transparent',
            fontWeight: activeTab === 'doc' ? 'bold' : 'normal',
            color: activeTab === 'doc' ? '#0f172a' : '#64748b'
          }}
        >
          📄 Juridiskie Dokumenti
        </button>
        <button 
          onClick={() => setActiveTab('marketing')}
          style={{ 
            background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer',
            borderBottom: activeTab === 'marketing' ? '3px solid #eab308' : '3px solid transparent',
            fontWeight: activeTab === 'marketing' ? 'bold' : 'normal',
            color: activeTab === 'marketing' ? '#854d0e' : '#64748b'
          }}
        >
          🚀 Mārketings & Portfolio
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {TEMPLATES.filter(t => t.type === activeTab).map(template => (
          <div key={template.id} style={{ 
            background: '#fff', border: selectedTemplate === template.id ? '2px solid #3b82f6' : '1px solid #e2e8f0', borderRadius: '12px', padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.2rem' }}>{template.title}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>{template.desc}</p>
            
            {selectedTemplate === template.id && (
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px dashed #cbd5e1' }}>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 10px 0' }}>Sagatavots pielāgošanai. Ievadiet klienta datus:</p>
                <input type="text" placeholder="Klienta nosaukums/Vārds" style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                <input type="text" placeholder="Objekta adrese" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleCustomize(template.id)}
                style={{ padding: '10px 12px', fontSize: '0.9rem', flexGrow: 1, background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}
              >
                {selectedTemplate === template.id ? 'Aizvērt' : 'Pielāgot datus'}
              </button>
              <button 
                onClick={() => handleDownload(template.title)}
                style={{ padding: '10px 12px', fontSize: '0.9rem', flexGrow: 1, background: activeTab === 'marketing' ? '#eab308' : '#0f172a', color: activeTab === 'marketing' ? '#000' : '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Lejupielādēt PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo of a template content preview */}
      {activeTab === 'marketing' && (
        <div style={{ marginTop: '40px', padding: '30px', background: '#fefce8', border: '1px solid #fde047', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#854d0e' }}>💡 Dienas Satura Ideja: "Pirms/Pēc Šoka Efekts"</h3>
          <p style={{ fontStyle: 'italic', color: '#713f12', marginBottom: '15px' }}>Iekopē šo tekstu savā Facebook profilā, pievienojot šodienas objekta bildi:</p>
          <div style={{ background: '#fff', padding: '20px', borderLeft: '4px solid #eab308', fontFamily: 'sans-serif', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
{`Cik maksā sirdsmiers remontā? 🤷‍♂️
Bieži saņemu zvanus: "Meistar, iepriekšējie pazuda, atstāja šo..." (skat. 1. bildi). 

Mēs to sakārtojām 3 dienās. Bez stresa, ar precīzu tāmi un līgumu. (skat. 2. bildi).

Vai arī tavam mājoklim vajadzīgs "Refresh"? 
👇 Spied saiti komentāros, aizpildi datus un saņem precīzu izmaksu aprēķinu 30 sekundēs!`}
          </div>
          <button onClick={() => alert('Teksts nokopēts starpliktuvē!')} style={{ marginTop: '20px', background: '#854d0e', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Kopēt Tekstu</button>
        </div>
      )}
    </div>
  );
}