import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const topCalculations = [
  { title: "Vannas istabas remonts", range: "no ~5 800 EUR", href: "/apdare", icon: "🚿" },
  { title: "Virtuves remonts", range: "no ~4 200 EUR", href: "/apdare", icon: "🍳" },
  { title: "Flīzēšana", range: "no ~28 EUR/m²", href: "/apdare", icon: "🧱" },
  { title: "Krāsošana", range: "no ~8 EUR/m²", href: "/apdare", icon: "🎨" },
  { title: "Grīdas segumi", range: "no ~18 EUR/m²", href: "/apdare", icon: "🪵" },
  { title: "Elektro darbi", range: "no ~35 EUR/punkts", href: "/apdare", icon: "⚡" }
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
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      
      {/* HERO SECTION */}
      <section style={{ 
        padding: '160px 24px 100px', 
        textAlign: 'center', 
        background: 'radial-gradient(circle at 50% -20%, #1e293b 0%, var(--bg-main) 70%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '400px', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="glass-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 24px', borderRadius: '50px', marginBottom: '40px', borderColor: 'var(--accent-primary)' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 15px var(--accent-primary)' }}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-primary)' }}>Metaverse Construction Hub 2026</span>
          </div>
          
          <h1 style={{ fontSize: '6rem', fontWeight: 950, letterSpacing: '-5px', lineHeight: 0.85, marginBottom: '35px' }}>
            Remonta tāme <br/>
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>snaipera precizitātē.</span>
          </h1>
          
          <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '60px', maxWidth: '850px', margin: '0 auto 60px', lineHeight: 1.4, fontWeight: 400 }}>
            Pasaulē pirmā ekosistēma, kas apvieno augstas precizitātes AI tāmju ģeneratorus ar globālu 3D Metaverse Expo izstādi.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '100px' }}>
            <Link to="/kalkulators" className="btn-pro btn-pro-primary" style={{ padding: '24px 48px', fontSize: '1.25rem' }}>Sākt bezmaksas aprēķinu</Link>
            <Link to="/expo" className="btn-pro btn-pro-secondary" style={{ padding: '24px 48px', fontSize: '1.25rem' }}>Ieeja 3D Expo Hallē</Link>
          </div>

          {/* LAUNCH COUNTER */}
          <div className="glass-card" style={{ padding: '40px', display: 'inline-flex', gap: '60px', alignItems: 'center' }}>
             <div style={{ textAlign: 'left' }}>
               <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Lielā atklāšana</div>
               <div style={{ fontSize: '2rem', fontWeight: 900 }}>06. MARTĀ</div>
             </div>
             <div style={{ width: '1px', height: '50px', background: 'var(--border-glass)' }}></div>
             <div style={{ display: 'flex', gap: '40px' }}>
               {[
                 { val: timeLeft.d, unit: 'DIENAS' },
                 { val: timeLeft.h, unit: 'STUNDAS' },
                 { val: timeLeft.m, unit: 'MINŪTES' },
                 { val: timeLeft.s, unit: 'SEKUNDES' }
               ].map((t, i) => (
                 <div key={i} style={{ textAlign: 'center', minWidth: '80px' }}>
                   <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{String(t.val).padStart(2, '0')}</div>
                   <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.unit}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* POPULAR CALCS */}
      <section style={{ padding: '120px 24px', background: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '15px' }}>Populārākie rīki</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', maxWidth: '600px' }}>Saņem precīzu projekta specifikāciju un izmaksu kontroli pāris sekundēs.</p>
            </div>
            <Link to="/kalkulators" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '1.1rem' }}>Visi kalkulatori →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
            {topCalculations.map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '40px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} 
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}>
                <div style={{ fontSize: '3rem', marginBottom: '25px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>No <span style={{ color: '#fff', fontWeight: 700 }}>{item.range}</span></p>
                <Link to={item.href} className="btn-pro btn-pro-secondary" style={{ width: '100%' }}>Atvērt PRO rīku</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METAVERSE SECTION */}
      <section style={{ padding: '140px 24px', background: '#0f172a', position: 'relative' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '100px', alignItems: 'center' }}>
          <div className="glass-card" style={{ position: 'relative', aspectRatio: '16/10', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0' }}>
             <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=1200&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} alt="3D Expo" />
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-main), transparent)' }}></div>
             <div style={{ position: 'absolute', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase' }}>ENTER THE METAVERSE</div>
          </div>
          <div>
            <div style={{ color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px', fontSize: '0.9rem' }}>Nākotnes Būvniecība</div>
            <h2 style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-4px', lineHeight: 0.95, marginBottom: '35px' }}>3D Expo <br/>Halle</h2>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '50px' }}>
              Nestaigā pa garlaicīgiem sarakstiem. Ienāc interaktīvā 3D vidē, apskati meistaru portfolio, apmeklē tiešraides seminārus un atrodi labākos sadarbības partnerus reāllaikā.
            </p>
            <Link to="/expo" className="btn-pro btn-pro-primary" style={{ background: '#10b981', padding: '20px 45px' }}>Ienākt Izstādē</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '160px 24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
        <h2 style={{ fontSize: '5rem', fontWeight: 950, letterSpacing: '-4px', lineHeight: 1, marginBottom: '40px' }}>Gatavs sākt projektu?</h2>
        <p style={{ fontSize: '1.6rem', marginBottom: '60px', opacity: 0.9, maxWidth: '800px', margin: '0 auto 60px', fontWeight: 500 }}>Pievienojies tūkstošiem speciālistu un klientu lielākajā būvniecības ekosistēmā.</p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
           <Link to="/login" className="btn-pro" style={{ padding: '24px 60px', background: '#000', color: '#fff', fontSize: '1.3rem' }}>Reģistrēties tagad</Link>
           <Link to="/kalkulators" className="btn-pro" style={{ padding: '24px 60px', background: '#fff', color: 'var(--accent-primary)', fontSize: '1.3rem' }}>Izveidot pirmo tāmi</Link>
        </div>
      </section>
    </div>
  );
}
