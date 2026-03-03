import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Plane, Text, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function BoothRoom() {
  const { id } = useParams<{ id: string }>();
  const [booth, setBooth] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lead Form State
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBoothData = async () => {
      if (!id) return;
      
      // Fetch booth by slug or id
      const { data: boothData } = await supabase
        .from('expo_booth')
        .select('*, organization(*)')
        .or(`slug.eq.${id},id.eq.${id}`)
        .single();

      if (boothData) {
        setBooth(boothData);
        
        // Fetch related offers
        const { data: offersData } = await supabase.from('booth_offer').select('*').eq('booth_id', boothData.id).order('sort_order');
        setOffers(offersData || []);

        // Fetch related assets
        const { data: assetsData } = await supabase.from('booth_asset').select('*').eq('booth_id', boothData.id);
        setAssets(assetsData || []);
      }
      setIsLoading(false);
    };

    fetchBoothData();
  }, [id]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.phone) return alert("Lūdzu, aizpildiet obligātos laukus!");
    
    setIsSubmitting(true);
    const { error } = await supabase.from('booth_lead').insert([{
      booth_id: booth.id,
      name: leadData.name,
      phone: leadData.phone,
      message: leadData.message
    }]);

    if (!error) {
      alert("Paldies! Jūsu pieteikums ir nosūtīts uzņēmumam.");
      setShowLeadForm(false);
      setLeadData({ name: '', phone: '', message: '' });
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ielādē stenda telpu...</div>;

  if (!booth) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Stends nav atrasts. <Link to="/expo" style={{ color: '#3b82f6', marginLeft: '10px' }}>Atpakaļ</Link></div>;

  const color = booth.color || '#3b82f6';
  const logoAsset = assets.find(a => a.asset_type === 'logo');
  const portfolioAssets = assets.filter(a => a.asset_type === 'portfolio');

  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', background: '#000' }}>
      
      {/* UI Sidebar Overlay */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 10,
        background: 'rgba(15, 23, 42, 0.9)', padding: '25px', borderRadius: '16px',
        border: `2px solid ${color}`, color: '#fff', width: '380px',
        backdropFilter: 'blur(15px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <Link to="/expo" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>← Atpakaļ uz Lielo Halli</Link>
        
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          {logoAsset && <img src={logoAsset.url} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} alt="Logo" />}
          <h1 style={{ color: color, margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>{booth.title}</h1>
        </div>
        
        <p style={{ fontStyle: 'italic', color: '#cbd5e1', margin: '10px 0 20px 0', fontSize: '0.9rem', opacity: 0.8 }}>"{booth.subtitle}"</p>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
          <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '25px' }}>{booth.description || "Šis uzņēmums vēl nav pievienojis aprakstu."}</p>
          
          {offers.length > 0 && (
            <>
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '15px' }}>Īpašie Piedāvājumi</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {offers.map((offer) => (
                  <li key={offer.id} style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>{offer.title}</span>
                      <span style={{ color: color }}>{offer.price}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '5px 0 0 0' }}>{offer.description}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <button 
          onClick={() => setShowLeadForm(true)}
          style={{
            width: '100%', padding: '15px', background: color, color: '#000',
            border: 'none', borderRadius: '8px', fontWeight: '900', marginTop: '25px',
            cursor: 'pointer', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px',
            boxShadow: `0 10px 20px ${color}33`
          }}
        >
          Sazināties ar Meistaru
        </button>
      </div>

      {/* Lead Capture Modal */}
      {showLeadForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <form onSubmit={handleLeadSubmit} style={{ background: '#1e293b', padding: '40px', borderRadius: '20px', width: '450px', border: `2px solid ${color}` }}>
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>Pieteikt darbu</h2>
            <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '0.9rem' }}>Atstājiet datus un uzņēmums ar Jums sazināsies.</p>
            
            <input 
              type="text" placeholder="Jūsu Vārds" required 
              value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }} 
            />
            <input 
              type="text" placeholder="Telefona numurs" required 
              value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }} 
            />
            <textarea 
              placeholder="Īss darba apraksts..." rows={4}
              value={leadData.message} onChange={e => setLeadData({...leadData, message: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
            
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '15px', background: color, color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {isSubmitting ? "Sūta..." : "NOSŪTĪT PIETEIKUMU"}
            </button>
            <button type="button" onClick={() => setShowLeadForm(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#94a3b8', marginTop: '10px', cursor: 'pointer' }}>Atcelt</button>
          </form>
        </div>
      )}

      {/* 3D SCENE */}
      <Canvas shadows camera={{ position: [0, 1.5, 7], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <OrbitControls enableZoom={true} maxDistance={12} minDistance={3} maxPolarAngle={Math.PI/2 - 0.1} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 2]} intensity={1.5} color="#fff" />
        <spotLight position={[0, 6, 0]} angle={0.5} penumbra={1} intensity={4} color={color} castShadow />

        <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
        </Plane>

        {/* Back Advertising Wall */}
        <mesh position={[0, 2.5, -5]} receiveShadow castShadow>
          <boxGeometry args={[14, 6, 0.5]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        
        <Text position={[0, 3.5, -4.7]} fontSize={0.8} color={color} fontWeight={900}>{booth.title}</Text>
        <Text position={[0, 2.8, -4.7]} fontSize={0.3} color="#64748b" maxWidth={8}>"{booth.subtitle}"</Text>

        {/* Portfolio Gallery Sliders */}
        {portfolioAssets.length > 0 && (
          <group position={[0, 1.5, -4.7]}>
            <Html position={[0, 0, 0]} center transform occlude>
              <div style={{ display: 'flex', gap: '10px' }}>
                {portfolioAssets.slice(0, 3).map(asset => (
                  <img key={asset.id} src={asset.url} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${color}` }} alt="Portfolio" />
                ))}
              </div>
            </Html>
          </group>
        )}

        {/* Center Display Pedestal */}
        <mesh position={[0, 0.5, -1]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, 1, 32]} />
          <meshStandardMaterial color="#000" metalness={1} roughness={0.1} />
        </mesh>
        
        <group position={[0, 1.6, -1]}>
          <mesh castShadow>
            <torusKnotGeometry args={[0.4, 0.15, 128, 16]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* Side Banner Slots */}
        <mesh position={[-5, 2, -3]} rotation={[0, Math.PI/6, 0]} castShadow>
          <boxGeometry args={[2, 4, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
          {portfolioAssets[3] && (
            <Html position={[0, 0, 0.06]} center transform occlude>
              <img src={portfolioAssets[3].url} style={{ width: '180px', height: '380px', objectFit: 'cover' }} alt="Side Banner" />
            </Html>
          )}
        </mesh>

        <mesh position={[5, 2, -3]} rotation={[0, -Math.PI/6, 0]} castShadow>
          <boxGeometry args={[2, 4, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
          {portfolioAssets[4] && (
            <Html position={[0, 0, 0.06]} center transform occlude>
              <img src={portfolioAssets[4].url} style={{ width: '180px', height: '380px', objectFit: 'cover' }} alt="Side Banner" />
            </Html>
          )}
        </mesh>

        <ContactShadows resolution={1024} scale={15} blur={2} opacity={0.4} far={10} color="#000" />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
      
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: '#475569', fontSize: '0.8rem', pointerEvents: 'none', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px' }}>
        IZMANTOJIET PELI, LAI GROZĪTU TELPU
      </div>
    </div>
  );
}