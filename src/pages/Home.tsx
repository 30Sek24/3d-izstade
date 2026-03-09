import { Link } from 'react-router-dom';
import WarpalaLogo from '../shared/Logo';

const topCalculations = [
  { title: "Vannas istabas remonts", range: "no ~5 800 EUR", href: "/renovation-cost-calculator", icon: "🚿" },
  { title: "Privātmājas siltināšana", range: "no ~12 400 EUR", href: "/heating-cost-calculator", icon: "🏠" },
  { title: "Virtuves mēbeļu izgatavošana", range: "no ~3 200 EUR", href: "/renovation-cost-calculator", icon: "🍳" },
];

export default function Home() {
  return (
    <div style={{ 
      padding: '60px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a'
    }}>
      
      <div style={{ marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <WarpalaLogo size={180} />
        <h2 style={{ marginTop: '20px', fontSize: '1.5rem', color: '#64748b', fontWeight: 400 }}>
          Nākamās paaudzes B2B izstāžu ekosistēma
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '60px', flexWrap: 'wrap' }}>
        <Link to="/expo-3d" style={{ 
          padding: '15px 40px', 
          background: '#0f172a', 
          color: '#fff', 
          borderRadius: '12px', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🏙️ IEEJ 3D PILSĒTĀ
        </Link>
        <Link to="/expo/admin" style={{ 
          padding: '15px 40px', 
          background: '#fff', 
          color: '#0f172a', 
          border: '2px solid #0f172a',
          borderRadius: '12px', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🏢 UZŅĒMUMIEM
        </Link>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '40px'
      }}>
        {topCalculations.map((c, i) => (
          <Link to={c.href} key={i} style={{ 
            padding: '30px', 
            background: '#fff', 
            borderRadius: '20px', 
            textDecoration: 'none', 
            color: 'inherit',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{c.icon}</div>
            <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{c.title}</div>
            <div style={{ color: '#F97316', marginTop: '10px', fontWeight: 800, fontSize: '1.1rem' }}>{c.range}</div>
            <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#3b82f6', fontWeight: 'bold' }}>SĀKT APRĒĶINU →</div>
          </Link>
        ))}
      </div>

      {/* Papildus navigācija ātrai piekļuvei */}
      <div style={{ marginTop: '100px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '40px' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Ātrā piekļuve platformas moduļiem</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <Link to="/city-map" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 'bold' }}>2D Karte</Link>
          <Link to="/marketplace" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 'bold' }}>Marketplace</Link>
          <Link to="/urgent-services" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 'bold' }}>SOS Pakalpojumi</Link>
          <Link to="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 'bold' }}>Lietotāja Panelis</Link>
        </div>
      </div>
    </div>
  );
}
