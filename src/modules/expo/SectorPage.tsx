import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { expoService } from '../../services/expoService';
import '../../components/calculator/styles/CalculatorPro.css';

export default function SectorPage() {
  const { id } = useParams<{ id: string }>();
  const [sector, setSector] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [allSectors, allCompanies] = await Promise.all([
          expoService.getSectors(),
          expoService.getCompaniesWithBooths()
        ]);
        
        const currentSector = allSectors.find((s: any) => s.id === id);
        const sectorCompanies = allCompanies.filter((c: any) => c.sector_id === id);
        
        setSector(currentSector);
        setCompanies(sectorCompanies);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-blue)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <Link to="/city-map" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', marginBottom: '20px', display: 'block' }}>← ATPAKAĻ UZ KARTI</Link>
        <h1 className="text-accent" style={{ fontSize: '3.5rem', color: sector?.color_theme || '#fff' }}>
          {sector?.name || 'Business District'}
        </h1>
        <p style={{ fontSize: '1.2rem' }}>{sector?.description || 'Atklājiet labākos uzņēmumus un pakalpojumus šajā pilsētas daļā.'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', marginTop: '50px' }}>
        {companies.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
            Šajā sektorā pašlaik nav aktīvu stendu.
          </div>
        ) : companies.map(company => (
          <div key={company.id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '180px', background: sector?.color_theme || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {company.logo_url ? <img src={company.logo_url} style={{ maxWidth: '150px' }} alt="Logo" /> : <h2 style={{ fontSize: '3rem', margin: 0, opacity: 0.2 }}>{company.name[0]}</h2>}
            </div>
            <div style={{ padding: '25px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{company.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', minHeight: '60px', marginBottom: '20px' }}>{company.description}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/expo/booth/${company.id}`} className="btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>APMEKLĒT STENDU</Link>
                <button className="btn-glass" style={{ flex: 1, fontSize: '0.8rem' }}>PROFILA DATI</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
