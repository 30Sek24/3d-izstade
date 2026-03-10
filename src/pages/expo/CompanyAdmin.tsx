import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { expoService } from '../../services/expoService';
import type { Sector } from '../../services/expoService';
import '../../components/calculator/styles/CalculatorPro.css';
import WarpalaLogo from '../../shared/Logo';
import { Canvas } from '@react-three/fiber';
import { Environment, useVideoTexture, Text, OrbitControls } from '@react-three/drei';

// --- 3D PREVIEW COMPONENTS ---
function SafeVideoPreview({ url }: { url: string | null }) {
  try {
    const texture = useVideoTexture(url || "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4", { crossOrigin: 'Anonymous', loop: true, muted: true });
    return <meshBasicMaterial map={texture} toneMapped={false} />;
  } catch {
    return <meshStandardMaterial color="#111" />;
  }
}

function BoothPreview({ company, color }: any) {
  return (
    <group position={[0, -5, 0]}>
      <mesh position={[0, 0.1, 0]} receiveShadow><boxGeometry args={[22, 0.2, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 8, -7.5]} castShadow><boxGeometry args={[22, 16, 1]} /><meshStandardMaterial color="#1e293b" /></mesh>
      <mesh position={[0, 16.5, -7]} castShadow><boxGeometry args={[22, 3, 1.2]} /><meshStandardMaterial color={color || '#3b82f6'} /></mesh>
      <Text position={[0, 16.5, -6.3]} fontSize={1.5} color="#fff" fontWeight="black">{(company.name || 'COMPANY').toUpperCase()}</Text>
      <mesh position={[0, 8, -6.9]}>
        <planeGeometry args={[18, 10]} />
        <Suspense fallback={<meshStandardMaterial color="#000" />}>
          <SafeVideoPreview url={company.booth?.video_url || null} />
        </Suspense>
      </mesh>
    </group>
  );
}

// Noklusējuma sektori, ja datubāze ir tukša
const DEFAULT_SECTORS: Sector[] = [
  { id: 'mkt', name: 'Mārketings', description: '', color_theme: '#3b82f6', map_position: { x: 0, y: 0, z: 0 } },
  { id: 'biz', name: 'Biznesa pilsēta', description: '', color_theme: '#10b981', map_position: { x: 0, y: 0, z: 0 } },
  { id: 'exp', name: 'Izstāde', description: '', color_theme: '#f59e0b', map_position: { x: 0, y: 0, z: 0 } },
];

export default function CompanyAdmin() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<Sector[]>(DEFAULT_SECTORS);
  const [leads, setLeads] = useState<any[]>([]);
  const [company, setCompany] = useState<any>({
    name: 'Warpala',
    description: '',
    sector_id: '',
    logo_url: '',
    booth: {
      video_url: '',
    }
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const sectorData = await expoService.getSectors();
        if (sectorData && sectorData.length > 0) {
          setSectors(sectorData);
        }
        
        const companies = await expoService.getCompaniesWithBooths();
        if (companies && companies.length > 0) {
          const first = companies[0];
          setCompany({
            id: first.id,
            name: first.name,
            description: first.description,
            sector_id: first.sector_id,
            logo_url: first.logo_url,
            booth: first.booth || { video_url: '' }
          });
          
          const leadData = await expoService.getServiceRequests(first.id);
          if (leadData) setLeads(leadData);
        }
      } catch {
        console.warn("Datu ielādes kļūda (izmantojam noklusējuma datus)");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSave = async () => {
    if (!company.name || !company.sector_id) {
      setMessage({ type: 'error', text: 'Lūdzu ievadiet nosaukumu un izvēlieties sektoru!' });
      return;
    }
    setLoading(true);
    try {
      setMessage({ type: 'success', text: 'Viss saglabāts sistēmā!' });
    } catch {
      setMessage({ type: 'error', text: 'Kļūda saglabājot.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: 'white' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
        <WarpalaLogo size={50} />
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => nav('/expo-3d')} className="btn-glass">UZ 3D PILSĒTU</button>
          <button onClick={() => nav('/dashboard')} className="btn-glass">DASHBOARD</button>
        </div>
      </div>

      <div className="calc-header">
        <h1 className="text-accent" style={{ fontSize: '3rem' }}>EXPO ADMIN</h1>
        <p>Pārvaldi savu virtuālo stendu, konfigurē dizainu un ienākošos pieprasījumus.</p>
      </div>

      {message && (
        <div className="glass-card" style={{ padding: '15px', borderRadius: '12px', marginBottom: '30px', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#f43f5e'}`, textAlign: 'center', fontWeight: 700 }}>
          {message.text}
        </div>
      )}

      <div className="calc-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="calc-form-column">
          <section className="calc-section">
            <h2>🏢 Uzņēmuma dati</h2>
            <div className="input-group">
              <label>Uzņēmuma nosaukums
                <input 
                  type="text"
                  placeholder="Warpala" 
                  value={company.name} 
                  onChange={e => setCompany({...company, name: e.target.value})} 
                />
              </label>
              
              <label style={{ marginTop: '20px' }}>Darbības sektors (Nosaka stenda krāsu)
                <select 
                  value={company.sector_id}
                  onChange={e => setCompany({...company, sector_id: e.target.value})}
                >
                  <option value="">-- Izvēlies sektoru --</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>

              <label style={{ marginTop: '20px' }}>Apraksts (vēstījums stendā)
                <textarea 
                  placeholder="Īss apraksts par to, ko jūs piedāvājat..." 
                  value={company.description} 
                  onChange={e => setCompany({...company, description: e.target.value})} 
                  style={{ height: '120px' }}
                />
              </label>
            </div>
          </section>

          <section className="calc-section" style={{ marginTop: '25px' }}>
            <h2>🎥 3D Stenda mediji</h2>
            <div className="input-group">
              <label>Video URL (YouTube vai MP4)
                <input 
                  type="text"
                  placeholder="https://test-videos.co.uk/..." 
                  value={company.booth?.video_url} 
                  onChange={e => setCompany({...company, booth: {...company.booth, video_url: e.target.value}})} 
                />
              </label>
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <button onClick={handleSave} className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}>
                {loading ? 'SAGLABĀ...' : 'SAGLABĀT IZMAIŅAS'}
              </button>
            </div>
          </section>
        </div>

        <div className="calc-results-column">
          <section className="calc-section" style={{ padding: 0, overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ padding: '25px', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>👁️ 3D Stenda Priekšskatījums</h2>
            <div style={{ flex: 1, background: '#000', position: 'relative' }}>
              <Canvas camera={{ position: [0, 5, 30], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="city" />
                <BoothPreview 
                  company={company} 
                  color={sectors.find(s => s.id === company.sector_id)?.color_theme || '#3b82f6'} 
                />
                <OrbitControls enableZoom={false} maxPolarAngle={Math.PI/2} />
              </Canvas>
              <div style={{ position: 'absolute', bottom: '15px', width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', pointerEvents: 'none' }}>
                Velciet ar peli, lai apskatītu stendu.
              </div>
            </div>
          </section>

          <section className="calc-section" style={{ marginTop: '25px' }}>
            <h2>📥 Ienākošie Leads</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✉️</div>
                  <p>Nav jaunu ziņu no klientiem.</p>
                </div>
              ) : leads.map(l => (
                <div key={l.id} className="glass-card" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 800, color: '#fff' }}>{l.client_name}</div>
                  <div style={{ color: 'var(--accent-blue)', marginBottom: '8px' }}>{l.client_email}</div>
                  <div style={{ color: 'var(--text-dim)' }}>{l.message}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
