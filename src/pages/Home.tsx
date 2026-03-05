import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const trustPills = [
  "Bezmaksas sākuma aprēķins",
  "Aptuvens budžets 30 sekundēs",
  "BOQ + pieņēmumu skaidrība",
  "Pēc piekrišanas: līdz 3 meistariem"
];

const topCalculations = [
  { title: "Vannas istabas remonts", range: "no ~5 800 EUR", href: "/apdare" },
  { title: "Virtuves remonts", range: "no ~4 200 EUR", href: "/apdare" },
  { title: "Flīzēšana", range: "no ~28 EUR/m²", href: "/apdare" },
  { title: "Krāsošana", range: "no ~8 EUR/m²", href: "/apdare" },
  { title: "Grīdas segumi", range: "no ~18 EUR/m²", href: "/apdare" },
  { title: "Elektro darbi", range: "no ~35 EUR/punkts", href: "/apdare" }
];

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date('2026-03-06T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const dist = target - now;
      if (dist < 0) return clearInterval(interval);
      setTimeLeft({
        d: Math.floor(dist / (1000 * 60 * 60 * 24)),
        h: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((dist % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#020617', color: '#fff' }}>
      
      {/* HERO SECTION */}
      <section style={{ 
        padding: '120px 24px 80px', 
        textAlign: 'center', 
        background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', borderRadius: '50px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', marginBottom: '30px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #3b82f6' }}></span>
            Metaverse Construction Hub 2026
          </div>
          
          <h1 style={{ fontSize: '5.5rem', fontWeight: 950, letterSpacing: '-4px', lineHeight: 0.9, marginBottom: '25px' }}>
            Remonta tāme <br/>
            <span style={{ color: '#3b82f6' }}>30 sekundēs.</span>
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: '#94a3b8', marginBottom: '50px', maxWidth: '800px', margin: '0 auto 50px', lineHeight: 1.5 }}>
            Pirmā ekosistēma, kas apvieno snaipera precizitātes tāmju ģeneratorus un globālu 3D Metaverse Expo izstādi.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '80px' }}>
            <Link to="/kalkulators" style={{ padding: '20px 40px', background: '#3b82f6', color: '#fff', fontWeight: 800, textDecoration: 'none', borderRadius: '12px', fontSize: '1.2rem', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5)' }}>Sākt aprēķinu</Link>
            <Link to="/expo" style={{ padding: '20px 40px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 800, textDecoration: 'none', borderRadius: '12px', fontSize: '1.2rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>Ieeja 3D Expo</Link>
          </div>

          {/* LAUNCH COUNTER */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '24px', display: 'inline-flex', gap: '40px', backdropFilter: 'blur(10px)' }}>
             <div style={{ textAlign: 'left' }}>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '5px' }}>Lielā atklāšana</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>06.03.2026.</div>
             </div>
             <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
             <div style={{ display: 'flex', gap: '25px' }}>
               {[
                 { val: timeLeft.d, unit: 'd' },
                 { val: timeLeft.h, unit: 'h' },
                 { val: timeLeft.m, unit: 'm' },
                 { val: timeLeft.s, unit: 's' }
               ].map((t, i) => (
                 <div key={i} style={{ textAlign: 'center' }}>
                   <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{t.val}</div>
                   <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>{t.unit}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ padding: '20px', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
          {trustPills.map((pill, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ color: '#10b981' }}>✓</span> {pill}
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR CALCS */}
      <section style={{ padding: '100px 24px', background: '#020617' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '10px' }}>Populārākie aprēķini</h2>
              <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Saņem precīzu orientieri savam projektam pāris sekundēs.</p>
            </div>
            <Link to="/kalkulators" style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'none' }}>Skatīt visus →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {topCalculations.map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '1rem' }}>Aptuvenais sākuma līmenis: <span style={{ color: '#fff', fontWeight: 700 }}>{item.range}</span></p>
                <Link to={item.href} style={{ display: 'inline-block', padding: '12px 24px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 700, textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem' }}>Aprēķināt precīzāk</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D EXPO PREVIEW */}
      <section style={{ padding: '100px 24px', background: '#0f172a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#1e293b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)' }}>
               <div style={{ fontSize: '5rem' }}>🏗️</div>
               <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, backdropFilter: 'blur(5px)' }}>
                 LIVE PREVIEW: HALL A
               </div>
            </div>
          </div>
          <div>
            <div style={{ color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', fontSize: '0.9rem' }}>Nākotne ir klāt</div>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-3px', lineHeight: 1, marginBottom: '30px' }}>3D Metaverse <br/>Izstādes Halle</h2>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '40px' }}>
              Nestaigā pa garlaicīgiem sarakstiem. Ienāc interaktīvā 3D vidē, apskati meistaru portfolio, rīko tiešraides seminārus un atrodi labākos sadarbības partnerus reāllaikā.
            </p>
            <Link to="/expo" style={{ display: 'inline-block', padding: '18px 40px', background: '#10b981', color: '#fff', fontWeight: 800, textDecoration: 'none', borderRadius: '12px', fontSize: '1.1rem', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)' }}>Atklāt Expo Halli</Link>
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section style={{ padding: '100px 24px', background: '#020617' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '60px', letterSpacing: '-2px' }}>Platforma ikvienam</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Meistari un Brigādes', desc: 'Iegūstiet savu stendu un rādiet portfolio tūkstošiem klientu.', icon: '🛠️' },
              { title: 'Būvniecības Uzņēmumi', desc: 'Pārvaldiet tāmes, līgumus un piesaistiet jaunus projektus hallē.', icon: '🏗️' },
              { title: 'Dizaineri un Arhitekti', desc: 'Rīkojiet izglītojošus seminārus un audzējiet savu auditoriju.', icon: '🎨' },
              { title: 'Klienti un Interesenti', desc: 'Izmantojiet PRO rīkus, lai saprastu sava mājokļa patiesās izmaksas.', icon: '👀' },
            ].map((role, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{role.icon}</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px' }}>{role.title}</h4>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '120px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
        <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-3px', lineHeight: 1, marginBottom: '30px' }}>Gatavs nākotnei?</h2>
        <p style={{ fontSize: '1.4rem', marginBottom: '50px', opacity: 0.9, maxWidth: '700px', margin: '0 auto 50px' }}>Pievienojies lielākajai būvniecības ekosistēmai un sāc strādāt profesionāli.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
           <Link to="/login" style={{ padding: '20px 50px', background: '#000', color: '#fff', fontWeight: 800, textDecoration: 'none', borderRadius: '12px', fontSize: '1.2rem' }}>Reģistrēties tagad</Link>
           <Link to="/kalkulators" style={{ padding: '20px 50px', background: '#fff', color: '#3b82f6', fontWeight: 800, textDecoration: 'none', borderRadius: '12px', fontSize: '1.2rem' }}>Sākt aprēķinu</Link>
        </div>
      </section>
    </div>
  );
}