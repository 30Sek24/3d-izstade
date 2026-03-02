import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Plane, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useParams, Link } from 'react-router-dom';

// Datu bāzes imitācija konkrētiem stendiem
const BOOTH_DATA: Record<string, any> = {
  'Santehnika24': {
    name: 'Santehnika24',
    color: '#3b82f6',
    slogan: 'Ūdens Sistēmu Līderi',
    description: 'Mēs piedāvājam inovatīvākos risinājumus mājas un industriālajai santehnikai. Mūsu produkti ietaupa līdz pat 40% ūdens.',
    products: [
      { name: 'Gudrā Duša', price: '450 €' },
      { name: 'Eco Pods', price: '280 €' },
      { name: 'Vara Caurules', price: '12 €/m' }
    ]
  },
  'Būvnieks PRO': {
    name: 'Būvnieks PRO',
    color: '#eab308',
    slogan: 'Viss Tavam Objektam',
    description: 'Būvmateriālu vairumtirdzniecība un piegāde 24 stundu laikā visā Latvijā.',
    products: [
      { name: 'Cementa Maisījums', price: '5.50 €' },
      { name: 'Siltumizolācija', price: '14 €/m2' },
      { name: 'Reģipsis', price: '3.20 €/lapa' }
    ]
  },
  'EkoMāja': {
    name: 'EkoMāja',
    color: '#10b981',
    slogan: 'Zaļā Būvniecība',
    description: 'Dabīgi, elpojoši materiāli un saules paneļu sistēmas tavai ģimenei.',
    products: [
      { name: 'Saules Panelis 400W', price: '120 €' },
      { name: 'Kokšķiedras Vate', price: '18 €/m2' },
      { name: 'Vēja Ģenerators', price: '850 €' }
    ]
  }
};

export default function BoothRoom() {
  const { id } = useParams<{ id: string }>();
  const brandName = id ? decodeURIComponent(id) : 'Nezināms Uzņēmums';
  
  // Ja uzņēmums nav datubāzē, uztaisām fallback profilu
  const data = BOOTH_DATA[brandName] || {
    name: brandName,
    color: '#a855f7',
    slogan: 'Jauni Risinājumi Jums',
    description: 'Piedāvājam augstākās kvalitātes pakalpojumus un preces būvniecības sektorā.',
    products: [
      { name: 'Konsultācija', price: '50 €/h' },
      { name: 'Materiālu Piegāde', price: 'Pēc vienošanās' }
    ]
  };

  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', background: '#000' }}>
      
      {/* UI Pārklājums (HTML izvēlne "virs" 3D telpas) */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 10,
        background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: '12px',
        border: `1px solid ${data.color}`, color: '#fff', width: '350px',
        backdropFilter: 'blur(10px)'
      }}>
        <Link to="/expo" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>← Atpakaļ uz Lielo Halli</Link>
        <h1 style={{ color: data.color, margin: '15px 0 5px 0', fontSize: '2rem' }}>{data.name}</h1>
        <p style={{ fontStyle: 'italic', color: '#cbd5e1', marginBottom: '20px', fontSize: '0.9rem' }}>"{data.slogan}"</p>
        <p style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>{data.description}</p>
        
        <h3 style={{ marginTop: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Aktuālie Produkti:</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0 0' }}>
          {data.products.map((p: any, i: number) => (
            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span>{p.name}</span>
              <strong style={{ color: data.color }}>{p.price}</strong>
            </li>
          ))}
        </ul>

        <button style={{
          width: '100%', padding: '12px', background: data.color, color: '#000',
          border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '20px',
          cursor: 'pointer', fontSize: '1rem'
        }}>
          Sazināties ar Pārdevēju
        </button>
      </div>

      {/* PAŠA STENDA 3D IEKŠTELPA */}
      <Canvas shadows camera={{ position: [0, 1.5, 6], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        <OrbitControls enableZoom={true} maxDistance={10} minDistance={2} maxPolarAngle={Math.PI/2 - 0.05} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 4, 2]} intensity={2} color="#fff" />
        <spotLight position={[0, 5, 0]} angle={0.6} penumbra={1} intensity={5} color={data.color} castShadow />

        {/* Telpas Grīda */}
        <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
        </Plane>

        {/* Telpas Aizmugurējā Siena (Reklāmas Siena) */}
        <mesh position={[0, 2.5, -4]} receiveShadow castShadow>
          <boxGeometry args={[12, 5, 0.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        
        {/* Lielais Uzņēmuma Logo uz Sienas */}
        <Text position={[0, 3, -3.7]} fontSize={1} color={data.color} anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf">
          {data.name}
        </Text>

        {/* Pjedestāls / Galds Produktiem */}
        <mesh position={[0, 0.5, -1]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
          <meshStandardMaterial color="#000" roughness={0.1} metalness={0.9} />
        </mesh>
        
        {/* Abstrakts Produkts uz pjedestāla */}
        <group position={[0, 1.5, -1]}>
          <mesh castShadow>
            <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />
            <meshStandardMaterial color={data.color} metalness={0.8} roughness={0.2} emissive={data.color} emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Reklāmas stendi (Roll-up baneri) sānos */}
        <mesh position={[-4, 1.5, -2]} rotation={[0, Math.PI/4, 0]} castShadow>
          <boxGeometry args={[1.5, 3, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[4, 1.5, -2]} rotation={[0, -Math.PI/4, 0]} castShadow>
          <boxGeometry args={[1.5, 3, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        <ContactShadows resolution={512} scale={10} blur={2} opacity={0.5} far={5} color="#000" />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
      
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', fontSize: '0.9rem', pointerEvents: 'none' }}>
        Groziet telpu ar peli vai pirkstu
      </div>
    </div>
  );
}