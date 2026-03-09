import { useState, useEffect } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { Link } from 'react-router-dom';
import { expoService } from '../../services/expoService';

export default function Marketplace() {
  const [filter, setFilter] = useState('All');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const data = await expoService.getMarketplaceServices(filter);
        setServices(data || []);
      } catch (e) {
        console.error("Kļūda ielādējot pakalpojumus:", e);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [filter]);

  const categories = ['All', 'Construction', 'Heating', 'Creative', 'Cleaning', 'Legal'];

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-accent" style={{ fontSize: '3.5rem' }}>Global Market Hub</h1>
          <p style={{ fontSize: '1.2rem' }}>Pērc un pārdod industriālos pakalpojumus Warpala ekosistēmā.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '5px' }}>PLATFORMAS APGROZĪJUMS (24H)</div>
          <div style={{ fontSize: '2rem', fontWeight: 950, color: '#10b981' }}>124,500.00 €</div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div style={{ margin: '40px 0', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Meklēt pakalpojumu, uzņēmumu vai risinājumu..." 
          style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px 25px', borderRadius: '14px', color: '#fff', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setFilter(c)}
              className={filter === c ? 'btn-primary' : 'btn-glass'}
              style={{ fontSize: '0.75rem', padding: '10px 20px' }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--accent-blue)' }}>
          <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p>Ielādē tirgus datus...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {services.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
              Šajā kategorijā pakalpojumi vēl nav pievienoti.
            </div>
          ) : services.map(service => (
            <div key={service.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img src={service.image_url || 'https://images.unsplash.com/photo-1632759162352-7106d1472239?auto=format&fit=crop&w=600&q=80'} style={{ width: '100%', height: '220px', objectFit: 'cover' }} alt={service.name} />
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(15, 23, 42, 0.8)', padding: '5px 12px', borderRadius: '20px', color: '#fff', fontSize: '0.75rem', fontWeight: 800, backdropFilter: 'blur(5px)' }}>
                  ⭐ {service.rating} ({service.reviews_count})
                </div>
              </div>
              
              <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 900, marginBottom: '8px', letterSpacing: '1px' }}>{(service.category || 'Service').toUpperCase()}</div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '15px', lineHeight: '1.4' }}>{service.name}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {(service.tags || []).map((tag: string) => (
                    <span key={tag} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '4px 10px', borderRadius: '6px' }}>{tag}</span>
                  ))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>SĀKOT NO</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#fff' }}>{service.price_starting_from} €</div>
                    </div>
                    <Link to={`/calculators`} className="btn-glass" style={{ fontSize: '0.7rem', borderColor: 'var(--accent-blue)' }}>PRECĪZA TĀME</Link>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" style={{ flex: 2 }}>PASŪTĪT</button>
                    <button className="btn-glass" style={{ flex: 1 }}>KONSULTĀCIJA</button>
                  </div>
                </div>

                <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #10b981)' }}></div>
                  {service.company?.name || 'Unknown Company'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROMO BANNER */}
      <div className="glass-card" style={{ marginTop: '60px', padding: '40px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Esi pakalpojumu sniedzējs?</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px' }}>Pievieno savu uzņēmumu Warpala tirgum un saņem apstiprinātus pasūtījumus tieši no mūsu kalkulatoriem.</p>
        <button className="btn-primary" style={{ background: 'var(--accent-purple)' }}>PIEVIENOT SAVU PAKALPOJUMU</button>
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
