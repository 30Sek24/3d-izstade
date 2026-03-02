import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HERO SECTION */}
      <section style={{ 
        background: '#0a0a0a', 
        color: 'white', 
        padding: '100px 20px', 
        textAlign: 'center',
        borderBottom: '1px solid #333',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Fona dekorācija */}
        <div style={{
          position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '20px' }}>
            Nākotnes Būvniecības <br/>
            <span style={{ color: '#3b82f6' }}>Platformu Centrs</span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#9ca3af', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
            Vienīgā ekosistēma, kas apvieno snaipera precizitātes tāmju ģeneratorus un globālu 3D Metaverse Expo izstādi visiem nozares dalībniekiem.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* PATH 1: CLIENT */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '10px' }}>Esmu Klients</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '20px' }}>Meklēju meistarus, rēķinu remonta izmaksas vai SOS palīdzību.</p>
              <Link to="/expo" style={{ display: 'inline-block', padding: '12px 24px', background: '#10b981', color: '#fff', fontWeight: 'bold', textDecoration: 'none', borderRadius: '6px' }}>Ieeja Izstādē</Link>
            </div>
            
            {/* PATH 2: PRO */}
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.3)', textAlign: 'left' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.5rem', marginBottom: '10px' }}>Esmu Meistars / Firma</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '20px' }}>Vēlos savu 3D stendu, rīkot seminārus un ģenerēt PRO tāmes.</p>
              <Link to="/login" style={{ display: 'inline-block', padding: '12px 24px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', textDecoration: 'none', borderRadius: '6px' }}>Reģistrēt Biznesu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '15px' }}>Vieta ikvienam nozares interesentam</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Mūsu 3D Expo halle automātiski papildinās ar katru jaunu dalībnieku.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Meistari un Brigādes', desc: 'Iegūstiet savu stendu un rādiet portfolio tūkstošiem klientu.', icon: '🛠️' },
              { title: 'Būvniecības Uzņēmumi', desc: 'Pārvaldiet tāmes, līgumus un piesaistiet jaunus projektus hallē.', icon: '🏗️' },
              { title: 'Materiālu Tirgotāji', desc: 'Izvietojiet savu produkciju 3D stendā un pārdodiet pa tiešo.', icon: '📦' },
              { title: 'Dizaineri un Arhitekti', desc: 'Rīkojiet izglītojošus seminārus un audzējiet savu auditoriju.', icon: '🎨' },
              { title: 'Nekustamo īpašumu aģenti', desc: 'Novērtējiet objektus un atrodiet sadarbības partnerus remontiem.', icon: '🏠' },
              { title: 'Parastie Interesenti', desc: 'Izmantojiet PRO rīkus, lai saprastu sava mājokļa patiesās izmaksas.', icon: '👀' },
            ].map((role, i) => (
              <div key={i} style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{role.icon}</div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#0f172a' }}>{role.title}</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEMINAR PREVIEW */}
      <section style={{ padding: '80px 20px', background: '#0f172a', color: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '50px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>Audzē savu autoritāti</h2>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '30px' }}>
              Katrs būdiņas nomnieks var rīkot savus seminārus mūsu centrālajā zālē. 
              Dalies ar pieredzi, rādi paraugdemonstrējumus un piesaisti jaunus klientus caur izglītojošu saturu.
            </p>
            <Link to="/bizness30" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' }}>Uzzināt vairāk par biznesa augšanu →</Link>
          </div>
          <div style={{ width: '400px', height: '250px', background: '#1e293b', borderRadius: '20px', border: '4px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>TIEŠRAIDE</div>
             <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '3rem' }}>🎤</div>
               <div style={{ fontWeight: 'bold', marginTop: '10px' }}>Semināru zāle</div>
             </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 20px', background: '#3b82f6', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>Pievienojies lielākajai būvniecības kopienai</h2>
          <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>Neatkarīgi no tā, vai esi viens meistars vai liels uzņēmums - te ir tava vieta attīstībai.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/login" style={{ padding: '18px 40px', background: '#000', color: '#fff', fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px', fontSize: '1.2rem' }}>Reģistrēties tagad</Link>
            <Link to="/expo" style={{ padding: '18px 40px', background: '#fff', color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px', fontSize: '1.2rem' }}>Apskatīt Izstādi</Link>
          </div>
        </div>
      </section>
    </div>
  );
}