import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-03-06T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1e293b' }}>
      
      {/* PRE-LAUNCH ANNOUNCEMENT */}
      <div style={{ background: '#3b82f6', color: '#fff', padding: '12px 20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>
        🚀 LIELĀ ATKLĀŠANA: 06.03.2026. | AIZŅEM SAVU 3D STENDU TAGAD!
      </div>

      {/* HERO SECTION */}
      <section style={{ 
        background: '#020617', 
        color: 'white', 
        padding: '120px 20px', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '10px 25px', borderRadius: '50px', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', color: '#3b82f6', marginBottom: '30px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Pasaules pirmā 3D būvniecības ekosistēma
          </div>
          
          <h1 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1, marginBottom: '20px' }}>
            Platformu Centrs <br/>
            <span style={{ color: '#3b82f6' }}>Metaverse 2026</span>
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: '#94a3b8', marginBottom: '50px', maxWidth: '800px', margin: '0 auto 50px' }}>
            Atklāšana 6. martā. Pieejama pēdējā iespēja reģistrēt savu uzņēmumu un ieņemt vietu hallē pirms globālā starta.
          </p>

          {/* COUNTDOWN TIMER */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
            {[
              { val: timeLeft.days, label: 'DIENAS' },
              { val: timeLeft.hours, label: 'STUNDAS' },
              { val: timeLeft.mins, label: 'MINŪTES' },
              { val: timeLeft.secs, label: 'SEKUNDES' }
            ].map((t, i) => (
              <div key={i} style={{ width: '100px' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{t.val}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 'bold', marginTop: '5px' }}>{t.label}</div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '10px', fontWeight: 800 }}>Esmu Klients</h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '25px' }}>Pieejiet pie tāmēm, rēķiniet izmaksas un rezervējiet meistarus pirms atklāšanas.</p>
              <Link to="/expo" style={{ display: 'inline-block', padding: '15px 35px', background: '#10b981', color: '#fff', fontWeight: 'bold', textDecoration: 'none', borderRadius: '10px', fontSize: '1.1rem' }}>Ieeja Izstādē</Link>
            </div>
            
            <div style={{ background: 'rgba(59,130,246,0.05)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(59,130,246,0.3)', textAlign: 'left' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.8rem', marginBottom: '10px', fontWeight: 800 }}>Esmu Firma</h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '25px' }}>Aizņemiet savu būdiņu un aktivizējiet reklāmas kampaņas pirms 6. marta.</p>
              <Link to="/login" style={{ display: 'inline-block', padding: '15px 35px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', textDecoration: 'none', borderRadius: '10px', fontSize: '1.1rem' }}>REĢISTRĒT STENDU</Link>
            </div>
          </div>
        </div>
      </section>

      {/* AUTOPILOT MARKETING TEXTS (Internal Library for scripts) */}
      <section style={{ padding: '100px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '60px' }}>Globālā Mārketinga Autopilots</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* AUTOPILOT 1: B2B (Firms) */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#8b5cf6', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase' }}>Bots A: Uzņēmumu Piesaiste</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Automātiskā Kampaņa "Stendu Rezervācija"</h3>
              <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#334155' }}>
                [ENG] 🚨 Attention Builders & Contractors! The world's first 3D Metaverse Construction Expo is opening on 06.03.2026. Don't be left out! Claim your virtual booth today and reach global clients before the grand opening. Your services in 3D start now.
                <br/><br/>
                [LV] 🚨 Būvniecības uzņēmumi un Meistari! Pasaulē pirmā 3D Expo halle veras vaļā 06.03.2026. Aizņemiet savu vietu hallē, rādiet savu portfolio 3D vidē un audzējiet klientu loku jau tūlīt. Reģistrējies: [Link]
              </div>
              <button style={{ marginTop: '20px', padding: '10px 20px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>AKTIVIZĒT B2B BOTU</button>
            </div>

            {/* AUTOPILOT 2: B2C (Clients) */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#10b981', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase' }}>Bots B: Klientu Piesaiste</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Automātiskā Kampaņa "Tāmes & SOS"</h3>
              <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#334155' }}>
                [ENG] 🏠 Planning a renovation? Don't pay more than you should. Use our PRO Calculators to get pinpoint accurate estimates in 30 seconds. Visit the 3D Construction Expo from March 6th and find the best verified specialists!
                <br/><br/>
                [LV] 🏠 Plāno remontu? Nemaksā "no gaisa" izdomātas cenas. Izmanto Platformu Centra PRO kalkulatorus un saņem precīzu tāmi 30 sekundēs. No 6. marta iepazīsties ar labākajiem meistariem mūsu 3D Metaverse hallē!
              </div>
              <button style={{ marginTop: '20px', padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>AKTIVIZĒT B2C BOTU</button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: '#3b82f6', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Gatavs lielajam startam?</h2>
        <p style={{ marginBottom: '30px', opacity: 0.9 }}>Reģistrējies un esi daļa no nākotnes.</p>
        <Link to="/login" style={{ padding: '18px 50px', background: '#000', color: '#fff', fontWeight: 'bold', textDecoration: 'none', borderRadius: '10px', fontSize: '1.2rem', display: 'inline-block' }}>Pievienoties Platformu Centram</Link>
      </section>
    </div>
  );
}