import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PointerLockControls, 
  FlyControls,
  Text, 
  Html,
  Sky,
  useVideoTexture,
  Bvh,
  Environment,
  MeshReflectorMaterial,
  Loader
} from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { expoService } from '../../services/expoService';
import type { Sector, Company, Booth } from '../../services/expoService';

// --- CILVĒKI ---
function Person({ startPos, speed, color }: any) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.z += speed * delta;
      if (meshRef.current.position.z < -800) meshRef.current.position.z = 100;
      if (meshRef.current.position.z > 100) meshRef.current.position.z = -800;
      meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
    }
  });
  return (
    <group ref={meshRef} position={[startPos[0], 1, startPos[2]]}>
      <mesh castShadow><capsuleGeometry args={[0.3, 1, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.25, 8, 8]} /><meshStandardMaterial color="#ffdbac" /></mesh>
    </group>
  );
}

// --- VIDEO EKRĀNS ---
function SafeVideo({ url }: { url: string | null }) {
  const defaultVideo = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4";
  try {
    const texture = useVideoTexture(url || defaultVideo, { crossOrigin: 'Anonymous', loop: true, muted: true });
    return <meshBasicMaterial map={texture} toneMapped={false} />;
  } catch (e) {
    return <meshStandardMaterial color="#111" />;
  }
}

// --- PAVILJONS (DINAMISKS) ---
function DistrictBooth({ position, rotation, company, color }: { position: [number, number, number], rotation: [number, number, number], company: Company & { booth?: Booth }, color: string }) {
  const [hovered, setHovered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.stopPropagation();
    setSending(true);
    try {
      await expoService.sendRequest({
        company_id: company.id,
        service_name: 'General Inquiry',
        client_name: formData.name,
        client_email: formData.email,
        message: formData.message
      });
      alert("Pieprasījums nosūtīts!");
      setShowForm(false);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert("Kļūda nosūtot pieprasījumu.");
    } finally {
      setSending(false);
    }
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.1, 0]} receiveShadow><boxGeometry args={[22, 0.2, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 8, -7.5]} castShadow><boxGeometry args={[22, 16, 1]} /><meshStandardMaterial color="#1e293b" /></mesh>
      <mesh position={[0, 16.5, -7]} castShadow><boxGeometry args={[22, 3, 1.2]} /><meshStandardMaterial color={color} /></mesh>
      <Text position={[0, 16.5, -6.3]} fontSize={1.5} color="#fff" fontWeight="black">{company.name.toUpperCase()}</Text>
      
      <mesh position={[0, 8, -6.9]}>
        <planeGeometry args={[18, 10]} />
        <Suspense fallback={<meshStandardMaterial color="#000" />}>
          <SafeVideo url={company.booth?.video_url || null} />
        </Suspense>
      </mesh>

      <group 
        position={[0, 1.5, 5]} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); setShowForm(true); }}
      >
        <mesh castShadow receiveShadow><boxGeometry args={[8, 3, 3]} /><meshStandardMaterial color="#f8fafc" /></mesh>
        <mesh position={[0, 1.6, 0]} rotation={[-0.2, 0, 0]} castShadow><boxGeometry args={[8.2, 0.5, 3.2]} /><meshStandardMaterial color={hovered ? color : "#0f172a"} /></mesh>
        <Text position={[0, 2, 0.8]} rotation={[-0.2, 0, 0]} fontSize={0.5} color="#fff" fontWeight="bold">VISIT BOOTH</Text>
        
        {(hovered || showForm) && (
          <Html position={[0, 5, 0]} center transform distanceFactor={10}>
            <div 
              style={{ background: 'white', padding: '25px', borderRadius: '16px', border: `5px solid ${color}`, boxShadow: '0 15px 40px rgba(0,0,0,0.2)', width: '300px', textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              {!showForm ? (
                <>
                  <h3 style={{ margin: '0 0 10px 0', color: '#000' }}>{company.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '15px' }}>{company.description}</p>
                  <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '12px', background: color, border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }}>SEND MESSAGE</button>
                  <button onClick={() => nav(`/expo/booth/${company.id}`)} style={{ width: '100%', padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#1e293b', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>ENTER 3D SPACE</button>
                </>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#000' }}>Sazināties ar mums</h3>
                  <input required placeholder="Jūsu vārds" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  <input required type="email" placeholder="E-pasts" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  <textarea required placeholder="Jūsu ziņa..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Atcelt</button>
                    <button type="submit" disabled={sending} style={{ flex: 2, padding: '10px', background: color, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {sending ? 'Sūta...' : 'SŪTĪT'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// --- PLAYER ---
function Player({ mode }: { mode: 'walk' | 'fly' | 'menu' }) {
  const { camera } = useThree();
  const [mov, setMov] = useState({ f: false, b: false, l: false, r: false, shift: false });
  
  useEffect(() => {
    if (mode !== 'walk') return;
    const d = (e: KeyboardEvent) => { switch (e.code) { case 'KeyW': setMov(m => ({ ...m, f: true })); break; case 'KeyS': setMov(m => ({ ...m, b: true })); break; case 'KeyA': setMov(m => ({ ...m, l: true })); break; case 'KeyD': setMov(m => ({ ...m, r: true })); break; case 'ShiftLeft': setMov(m => ({ ...m, shift: true })); break; } };
    const u = (e: KeyboardEvent) => { switch (e.code) { case 'KeyW': setMov(m => ({ ...m, f: false })); break; case 'KeyS': setMov(m => ({ ...m, b: false })); break; case 'KeyA': setMov(m => ({ ...m, l: false })); break; case 'KeyD': setMov(m => ({ ...m, r: false })); break; case 'ShiftLeft': setMov(m => ({ ...m, shift: false })); break; } };
    document.addEventListener('keydown', d); document.addEventListener('keyup', u);
    return () => { document.removeEventListener('keydown', d); document.removeEventListener('keyup', u); };
  }, [mode]);

  useFrame((state, delta) => {
    if (mode === 'walk') {
      const speed = mov.shift ? 50 : 20;
      const dist = speed * delta;
      if (mov.f) camera.translateZ(-dist); if (mov.b) camera.translateZ(dist);
      if (mov.l) camera.translateX(-dist); if (mov.r) camera.translateX(dist);
      camera.position.y = 2;
      if (mov.f || mov.b || mov.l || mov.r) camera.position.y += Math.sin(state.clock.elapsedTime * 10) * 0.05;
    }
  });

  if (mode === 'fly') return <FlyControls movementSpeed={70} rollSpeed={0.5} dragToLook />;
  return <PointerLockControls />;
}

// --- MAIN ---
export default function Expo3D() {
  const [mode, setMode] = useState<'menu' | 'walk' | 'fly'>('menu');
  const [data, setData] = useState<{ sectors: Sector[], companies: (Company & { booth: Booth })[] }>({ sectors: [], companies: [] });
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [sectors, companies] = await Promise.all([
          expoService.getSectors(),
          expoService.getCompaniesWithBooths()
        ]);
        setData({ sectors, companies });
      } catch (e) {
        console.error("Failed to load expo data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const crowd = React.useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => (
      <Person key={i} startPos={[(Math.random() - 0.5) * 20, 1, -(Math.random() * 800)]} speed={-(3 + Math.random() * 6)} color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)} />
    ));
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      
      {mode === 'menu' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 950, color: 'white', margin: 0, letterSpacing: '-4px' }}>WARPALA</h1>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#3b82f6', marginBottom: '50px' }}>EXPO CITY</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => { setMode('walk'); setTimeout(() => document.body.requestPointerLock(), 100); }} style={{ padding: '25px 60px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>🚶 WALK BOULEVARD</button>
            <button onClick={() => setMode('fly')} style={{ padding: '25px 60px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid #fff', borderRadius: '15px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>🦅 DRONE VIEW</button>
          </div>
          <button onClick={() => nav('/city-map')} style={{ marginTop: '40px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>2D DIRECTORY</button>
        </div>
      )}

      {mode !== 'menu' && (
        <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 100 }}>
          <button onClick={() => { document.exitPointerLock(); setMode('menu'); }} style={{ background: 'white', padding: '12px 25px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>EXIT TO LOBBY</button>
        </div>
      )}

      <Canvas shadows camera={{ fov: 60, position: [0, 2, 80] }}>
        <Suspense fallback={null}>
          <Bvh firstHitOnly>
            <Sky sunPosition={[100, 20, 100]} turbidity={0.01} rayleigh={0.2} />
            <Environment preset="city" />
            <ambientLight intensity={0.3} />
            <directionalLight castShadow position={[100, 100, 50]} intensity={1.5} />
            <fog attach="fog" args={['#0f172a', 10, 800]} />

            {/* GROUND */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -500]} receiveShadow>
              <planeGeometry args={[2000, 2000]} />
              <MeshReflectorMaterial
                blur={[300, 100]} resolution={1024} mixBlur={1} mixStrength={40} roughness={1}
                depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#0f172a" metalness={0.5}
              />
            </mesh>

            {/* BOULEVARD */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -500]} receiveShadow>
              <planeGeometry args={[25, 2000]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>

            {crowd}

            {/* ENTRANCE */}
            <group position={[0, 0, 60]}>
              <mesh position={[-25, 15, 0]} castShadow><boxGeometry args={[6, 30, 6]} /><meshStandardMaterial color="#0f172a" /></mesh>
              <mesh position={[25, 15, 0]} castShadow><boxGeometry args={[6, 30, 6]} /><meshStandardMaterial color="#0f172a" /></mesh>
              <mesh position={[0, 32, 0]} castShadow><boxGeometry args={[56, 6, 8]} /><meshStandardMaterial color="#3b82f6" /></mesh>
              <Text position={[0, 32, 4.1]} fontSize={4.5} color="#fff" fontWeight="black">WARPALA EXPO CITY</Text>
            </group>

            {/* CENTRAL PLAZA */}
            <group position={[0, 0, 15]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
                <circleGeometry args={[45, 64]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
              <Text position={[0, 0.2, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={5} color="white" fillOpacity={0.2} fontWeight="black">CENTRAL PLAZA</Text>
            </group>

            {/* DINAMISKIE SEKTORI UN UZŅĒMUMI NO SUPABASE */}
            {data.sectors.map((s) => {
              const sectorCompanies = data.companies.filter(c => c.sector_id === s.id);
              const zPos = s.map_position?.z || -100;
              
              return (
                <group key={s.id} position={[0, 0, zPos]}>
                  {/* Sector Overhead Bridge */}
                  <group position={[0, 28, 0]}>
                    <mesh castShadow><boxGeometry args={[35, 6, 2]} /><meshStandardMaterial color={s.color_theme} /></mesh>
                    <Text position={[0, 0, 1.1]} fontSize={2.5} color="#fff" fontWeight="black">{s.name.toUpperCase()}</Text>
                  </group>

                  {/* Booths for this sector */}
                  {sectorCompanies.map((c, index) => {
                    const side = index % 2 === 0 ? -1 : 1;
                    const offset = Math.floor(index / 2) * -40;
                    return (
                      <DistrictBooth 
                        key={c.id}
                        position={[side * 35, 0, offset]} 
                        rotation={[0, side === -1 ? Math.PI/2 : -Math.PI/2, 0]} 
                        company={c} 
                        color={s.color_theme} 
                      />
                    );
                  })}
                </group>
              );
            })}

            <Player mode={mode} />
          </Bvh>
        </Suspense>
      </Canvas>
    </div>
  );
}
