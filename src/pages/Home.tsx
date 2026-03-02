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
          width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '20px' }}>
            Nākotnes Būvniecības <br/>
            <span style={{ color: '#eab308' }}>Platformu Centrs</span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#9ca3af', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
            Vienīgā sistēma, kas apvieno snaipera precizitātes tāmju ģeneratoru, reālu 3D Expo izstādi un dokumentu šablonus meistariem.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/kalkulators" style={{ 
              padding: '16px 32px', background: '#eab308', color: '#000', 
              fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px', fontSize: '1.1rem' 
            }}>
              Sākt Pro Tāmi
            </Link>
            <Link to="/expo" style={{ 
              padding: '16px 32px', background: '#222', color: '#fff', 
              border: '1px solid #444', fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px', fontSize: '1.1rem' 
            }}>
              Ieiet 3D Izstādē
            </Link>
          </div>
          <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '0.9rem' }}>Pirmās 5 dienas bez maksas. Nav nepieciešama kredītkarte.</p>
        </div>
      </section>

      {/* THREE BUSINESSES SECTION */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '15px' }}>Trīs biznesi. Viena ekosistēma.</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Sistēma, kas izveidota, lai meistari pelnītu vairāk un klienti saņemtu caurspīdīgumu.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {/* SaaS / Rīki */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#0f172a' }}>Meistara PRO Rīki</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                Snaipera precizitātes tāmes ar PDF ģeneratoru 30 sekundēs. Rasējumu ielāde, līgumi, rēķini un reklāmu šabloni.
              </p>
              <Link to="/kalkulators" style={{ color: '#eab308', fontWeight: 'bold', textDecoration: 'none' }}>Izmēģināt Kalkulatoru →</Link>
            </div>

            {/* Expo */}
            <div style={{ background: '#0a0a0a', padding: '40px', borderRadius: '16px', color: 'white', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🕶️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>3D Expo Halle</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.6, marginBottom: '20px' }}>
                Sajūties kā dzīvē bez VR brillēm. Inovācijas, materiālu stendi un tiešsaistes iepirkšanās "video" formātā tieši pārlūkā.
              </p>
              <Link to="/expo" style={{ color: '#eab308', fontWeight: 'bold', textDecoration: 'none' }}>Apskatīt Halli →</Link>
            </div>

            {/* Marketplace */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤝</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#0f172a' }}>Marketplace</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                Klientu zona (Leads). Klients aizpilda vajadzību, automātiski saņem piedāvājumus no atlasītiem meistariem un apmaksā pakalpojumu.
              </p>
              <Link to="/dokumenti" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>Apskatīt Pakalpojumus →</Link>
            </div>

          </div>
        </div>
      </section>

      {/* SHOCK EFFECT SECTION */}
      <section style={{ padding: '80px 20px', background: '#eab308', color: '#000', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>
            30 sekundēs aprēķins. <br/> 2 minūtēs tāme PDF.
          </h2>
          <p style={{ fontSize: '1.4rem', fontWeight: 500, opacity: 0.9, marginBottom: '40px' }}>
            Aizmirsti par "atbraukšu, paskatīšos" un cenām no gaisa. <br/> Pilnīga caurspīdība būvniecībā.
          </p>
          <Link to="/kalkulators" style={{ 
            padding: '18px 40px', background: '#000', color: '#fff', 
            fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px', fontSize: '1.2rem',
            display: 'inline-block', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
          }}>
            Pārbaudīt sistēmu tagad
          </Link>
        </div>
      </section>
    </div>
  );
}