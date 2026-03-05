import { useState } from 'react';
import '../components/calculator/styles/CalculatorPro.css';

const EMERGENCY_SERVICES = [
  { id: 'jumts', name: 'Jumta bojājums (Norauts/Tek)', price: 'No 150 € / izsaukums', color: '#ef4444', icon: '🌪️' },
  { id: 'santehnika', name: 'Santehnikas avārija (Plīsums/Plūdi)', price: 'No 120 € / izsaukums', color: '#3b82f6', icon: '💧' },
  { id: 'apkure', name: 'Apkures sistēmas bojājums (Auksts)', price: 'No 140 € / izsaukums', color: '#ea580c', icon: '❄️' },
  { id: 'elektriba', name: 'Elektrības traucējumi (Nav gaismas)', price: 'No 100 € / izsaukums', color: '#eab308', icon: '⚡' },
  { id: 'atslegas', name: 'Slēdzeņu avārija (Aizcirtušās durvis)', price: 'No 90 € / izsaukums', color: '#8b5cf6', icon: '🔑' },
];

export default function SosEmergency() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!phone) {
      alert("Lūdzu, ievadiet telefona numuru!");
      return;
    }
    setIsSubmitting(true);
    // Simulējam pieteikuma apstrādi
    await new Promise(res => setTimeout(res, 2000));
    alert("SOS PIETEIKUMS SAŅEMTS!\n\nPlatformu Centra dežurants ir saņēmis Jūsu foto/video un datus. Meistars sazināsies ar Jums 5 minūšu laikā.");
    setIsSubmitting(false);
    setSelectedService(null);
    setMediaUrl('');
    setPhone('');
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#ef4444' }}>🚨 24/7 AVĀRIJAS DIENESTS</h1>
        <p>Neatliekama palīdzība jebkurai krīzes situācijai tavā īpašumā. Mūsu centrālais dispečers reaģē nekavējoties.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        {EMERGENCY_SERVICES.map(service => (
          <div 
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            style={{ 
              background: selectedService === service.id ? '#fef2f2' : '#fff', 
              border: `2px solid ${selectedService === service.id ? service.color : '#e2e8f0'}`,
              borderRadius: '16px', padding: '30px', cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedService === service.id ? `0 10px 30px ${service.color}33` : '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{service.icon}</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#0f172a' }}>{service.name}</h3>
            <p style={{ color: '#64748b', fontWeight: 'bold' }}>{service.price}</p>
          </div>
        ))}
      </div>

      {selectedService && (
        <div style={{ marginTop: '40px', background: '#0f172a', padding: '40px', borderRadius: '24px', color: '#fff' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#ef4444', margin: '0 0 10px 0', textAlign: 'center' }}>ZIŅOT PAR AVĀRIJU</h2>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '30px', textAlign: 'center' }}>
              Pievienojiet vizuālos materiālus, lai dežurants un meistars varētu uzreiz novērtēt bojājuma smagumu.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#94a3b8' }}>
                  FOTO VAI VIDEO (SAITE VAI ATŠIFRĒJUMS)
                </label>
                <textarea 
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Iekopējiet saiti uz attēlu/video vai īsi aprakstiet redzamo..."
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', background: '#1e293b', border: '1px solid #334155', color: '#fff', height: '120px', fontFamily: 'inherit' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
                  * Reālajā lietotnē šeit būs "Upload" poga tiešai failu augšupielādei.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#94a3b8' }}>
                  TELEFONA NUMURS ĀTRAI SAZIŅAI
                </label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+371 ..." 
                  style={{ width: '100%', padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff', marginBottom: '20px' }} 
                />
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ 
                    background: '#ef4444', color: '#fff', border: 'none', padding: '20px', 
                    fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', 
                    boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)', transition: 'all 0.2s' 
                  }}
                >
                  {isSubmitting ? 'SŪTA PIETEIKUMU...' : 'IZSAUKT PALĪDZĪBU'}
                </button>
              </div>
            </div>

            {mediaUrl && (mediaUrl.startsWith('http') || mediaUrl.length > 20) && (
              <div style={{ marginTop: '30px', padding: '20px', background: '#1e293b', borderRadius: '12px', border: '1px dashed #334155' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>PRIEKŠSKATĪJUMS MEISTARAM:</div>
                <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', borderRadius: '8px', overflow: 'hidden' }}>
                  {mediaUrl.startsWith('http') ? (
                    <img src={mediaUrl} alt="Avārijas situācija" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div style={{ color: '#475569', fontStyle: 'italic' }}>Apraksts pievienots: {mediaUrl.substring(0, 50)}...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '60px', padding: '30px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>
        <p><strong>Kas ir dispečers?</strong> Tas ir Platformu Centra operatīvās vadības speciālists, kurš reāllaikā redz visus brīvos meistarus izstādes hallē un uzreiz nodod Jūsu vizuālos datus tuvākajai brigādei.</p>
      </div>
    </div>
  );
}
