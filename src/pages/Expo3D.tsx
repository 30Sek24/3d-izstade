import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Html, Text, Plane } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// --- Shared Constants ---
const SPEED = 18.0;

// --- 0. AUDIO ---
function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/11/22/audio_f8b1b1112d.mp3?filename=smooth-jazz-piano-126227.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
      <button onClick={toggle} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #3b82f6', color: '#fff', padding: '12px 25px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(5px)', textTransform: 'uppercase', fontSize: '0.8rem' }}>
        {isPlaying ? '🔊 MŪZIKA IESLĒGTA' : '⏻ MŪZIKA IZSLĒGTA'}
      </button>
    </div>
  );
}

// --- 1. PLAYER & CONTROLS ---
const usePlayerControls = () => {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: true })); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: false })); break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return movement;
};

function Player() {
  const { forward, backward, left, right } = usePlayerControls();
  const { camera } = useThree();
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const savedPos = sessionStorage.getItem('expo_camera_pos');
    if (savedPos) {
      const pos = JSON.parse(savedPos);
      camera.position.set(pos.x, 1.7, pos.z);
    } else {
      camera.position.set(0, 1.7, 100); 
    }
  }, [camera]);

  useFrame((_, delta) => {
    direction.current.z = Number(forward) - Number(backward);
    direction.current.x = Number(right) - Number(left);
    direction.current.normalize();
    if (forward || backward) camera.translateZ(-direction.current.z * SPEED * delta);
    if (left || right) camera.translateX(direction.current.x * SPEED * delta);
    camera.position.y = 1.7; 
    if (camera.position.x > 95) camera.position.x = 95;
    if (camera.position.x < -95) camera.position.x = -95;
    if (camera.position.z > 145) camera.position.z = 145;
    if (camera.position.z < -550) camera.position.z = -550;
  });
  return null;
}

// --- Directional Text: Only visible when camera.z > sign.z (approaching from entry) ---
function DirectionalText({ text, position, rotation = [0, 0, 0], color, size = 1 }: any) {
  const textRef = useRef<any>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (!textRef.current) return;
    textRef.current.visible = camera.position.z > position[2];
  });
  return (
    <Text ref={textRef} position={position} rotation={rotation} fontSize={size} color={color} anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" fontWeight={900}>
      {text}
    </Text>
  );
}

function StaticTextLabel({ text, position, rotation = [0, 0, 0], color, size = 1 }: any) {
  return (
    <Text position={position} rotation={rotation} fontSize={size} color={color} anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" fontWeight={900}>
      {text}
    </Text>
  );
}

// --- Pavilion Screen: Handles Video or Rotating Images ---
function PavilionScreen({ position, rotation = [0,0,0], isPaid = false, content = [] }: { position: [number, number, number], rotation?: [number, number, number], isPaid?: boolean, content?: string | string[] }) {
  const [imgIndex, setImgIndex] = useState(0);
  
  useEffect(() => {
    if (isPaid && Array.isArray(content) && content.length > 1) {
      const interval = setInterval(() => {
        setImgIndex(prev => (prev + 1) % content.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaid, content]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[10, 4]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      
      {isPaid ? (
        <Html position={[0, 0, 0.1]} center transform occlude>
          <div style={{ width: '400px', height: '160px', background: '#000', overflow: 'hidden' }}>
            {typeof content === 'string' ? (
              <video src={content} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src={content[imgIndex]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Portfolio" />
            )}
          </div>
        </Html>
      ) : (
        <StaticTextLabel text="REKLĀMAS VIETA PIEEJAMA" position={[0, 0, 0.1]} color="#222" size={0.4} />
      )}
    </group>
  );
}

// --- 3. TUMŠIE MĀJIŅU PAVILJONI ---
function DarkPavilion({ position, title, subtitle, color, rotation = [0,0,0], link, jobsCount = 0, requestsCount = 0, isPaid = false, content = [] }: any) {
  const navigate = useNavigate();
  const { camera } = useThree();
  const [showInfo, setShowInfo] = useState(false);

  const handleEnter = (e: any) => {
    e.stopPropagation();
    sessionStorage.setItem('expo_camera_pos', JSON.stringify({ x: camera.position.x, y: camera.position.y, z: camera.position.z }));
    document.exitPointerLock();
    navigate(link || '/');
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[14, 12]} /><meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} /></mesh>
      <mesh position={[0, 3, -5.8]} castShadow receiveShadow><boxGeometry args={[14, 6, 0.4]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[-6.8, 3, 0]}><boxGeometry args={[0.4, 6, 12]} /><meshStandardMaterial color="#1e293b" transparent opacity={0.6} /></mesh>
      <mesh position={[6.8, 3, 0]}><boxGeometry args={[0.4, 6, 12]} /><meshStandardMaterial color="#1e293b" transparent opacity={0.6} /></mesh>
      <mesh position={[0, 6.2, 0]}><boxGeometry args={[15, 0.4, 13]} /><meshStandardMaterial color="#020617" /></mesh>
      
      {/* Roof Sign (One-way) */}
      <group position={[0, 8, 4]}>
         <mesh castShadow><boxGeometry args={[10, 4, 0.4]} /><meshStandardMaterial color="#000" /></mesh>
         <DirectionalText text={title} position={[0, 0, 0.25]} color={color} size={0.8} />
      </group>

      <PavilionScreen position={[0, 3.5, -5.5]} isPaid={isPaid} content={content} />
      
      <StaticTextLabel text={title} position={[0, 1, -5.5]} color={color} size={1} />
      <StaticTextLabel text={subtitle} position={[0, 0.5, -5.5]} color="#aaa" size={0.5} />

      {/* Enter Button */}
      <group position={[-5, 1, 4]} rotation={[0, Math.PI/4, 0]} onClick={handleEnter} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh castShadow><boxGeometry args={[2.5, 0.8, 0.4]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} /></mesh>
        <StaticTextLabel text="IEIET" position={[0, 0, 0.21]} color="#000" size={0.3} />
      </group>

      {/* Info Board */}
      <group position={[5, 2, 4]} rotation={[0, -Math.PI/4, 0]} onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh castShadow><boxGeometry args={[3, 2, 0.2]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <StaticTextLabel text="DĒLIS" position={[0, 0.6, 0.11]} color="#fff" size={0.2} />
        <StaticTextLabel text={`Vakances: ${jobsCount}`} position={[0, 0.1, 0.11]} color="#10b981" size={0.25} />
        <StaticTextLabel text={`Objekti: ${requestsCount}`} position={[0, -0.3, 0.11]} color="#eab308" size={0.25} />
        {showInfo && (
          <Html position={[0, 1.5, 0]} center transform occlude>
            <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: `2px solid ${color}`, padding: '20px', borderRadius: '12px', color: '#fff', width: '250px', pointerEvents: 'auto' }}>
              <h4 style={{ margin: '0 0 10px 0', color: color }}>SAZINĀTIES</h4>
              <button style={{ background: '#10b981', color: '#000', border: 'none', padding: '8px', width: '100%', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>Pieteikties darbā</button>
              <button style={{ background: '#eab308', color: '#000', border: 'none', padding: '8px', width: '100%', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Pieteikt projektu</button>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// --- 4. INFO PUNKTS ---
function InfoDesk() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const navigate = useNavigate();

  return (
    <group position={[0, 0, 110]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[14, 3, 3]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[0, 3.2, 0]}><boxGeometry args={[14.2, 0.4, 3.2]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.2} /></mesh>
      <StaticTextLabel text="PLATFORMU CENTRS" position={[0, 5, -1.6]} rotation={[0, Math.PI, 0]} color="#3b82f6" size={3} />
      <group position={[0, 4, -2]} rotation={[0, Math.PI, 0]} onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh><boxGeometry args={[5, 1.5, 0.5]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} /></mesh>
        <StaticTextLabel text="INFO TERMINĀLIS" position={[0, 0, 0.26]} color="#fff" size={0.3} />
      </group>
      {isOpen && (
        <Html position={[0, 6, -2]} rotation={[0, Math.PI, 0]} center transform occlude>
          <div style={{ background: 'rgba(15, 23, 42, 0.98)', border: `2px solid #3b82f6`, padding: '30px', borderRadius: '15px', color: '#fff', width: '500px', fontFamily: 'sans-serif', pointerEvents: 'auto' }}>
            {!showOrderForm ? (
              <>
                <h2 style={{ margin: '0 0 15px 0', color: '#3b82f6', fontSize: '2rem', textAlign: 'center' }}>Izstādes Informācija</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', background: '#020617', padding: '15px', borderRadius: '8px' }}>
                  <div><div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Apmeklētāji</div><div style={{ fontSize: '1.8rem', color: '#10b981', fontWeight: 'bold' }}>1,284</div></div>
                  <div><div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Aizņemti Stendi</div><div style={{ fontSize: '1.8rem', color: '#eab308', fontWeight: 'bold' }}>17 / 24</div></div>
                </div>
                <button onClick={() => setShowOrderForm(true)} style={{ background: '#eab308', color: '#000', border: 'none', padding: '12px', width: '100%', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>Pieteikt darbu visai zālei</button>
                <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>Reģistrēt Biznesu</button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h2 style={{ color: '#eab308', fontSize: '1.5rem', textAlign: 'center' }}>Centrālais Pasūtījums</h2>
                <textarea placeholder="Ko Jums nepieciešams izdarīt?..." rows={4} style={{ padding: '10px', background: '#020617', color: '#fff', border: '1px solid #334155' }}></textarea>
                <button onClick={() => { alert('Pasūtījums reģistrēts!'); setShowOrderForm(false); setIsOpen(false); }} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>NOSŪTĪT VISIEM</button>
                <button onClick={() => setShowOrderForm(false)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Atpakaļ</button>
              </div>
            )}
            <button onClick={() => setIsOpen(false)} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginTop: '15px' }}>Aizvērt</button>
          </div>
        </Html>
      )}
    </group>
  );
}

// --- 5. SEMINĀRU ZĀLE ---
function SidebarSeminarTheatre({ position, rotation = [0,0,0] }: any) {
  const [hasJoined, setHasJoined] = useState(false);
  const [seminar, setSeminar] = useState<any>(null);

  useEffect(() => {
    const fetchSeminar = async () => {
      const { data } = await supabase.from('expo_seminar').select('*, expo_booth(title, color)').eq('is_live', true).single();
      if (data) setSeminar(data);
    };
    fetchSeminar();
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 15, -5]} castShadow receiveShadow><boxGeometry args={[50, 30, 2]} /><meshStandardMaterial color="#020617" /></mesh>
      <mesh position={[0, 15, -3.9]}><planeGeometry args={[46, 20]} /><meshBasicMaterial color="#000" /></mesh>
      <StaticTextLabel text={seminar ? `TIEŠRAIDE: ${seminar.expo_booth.title}` : "SEMINĀRU UN APMĀCĪBU ZĀLE"} position={[0, 24, -3.8]} color={seminar ? seminar.expo_booth.color : "#3b82f6"} size={2.5} />
      <group position={[15, 5, 3]}>
        <mesh castShadow><boxGeometry args={[8, 5, 0.5]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <StaticTextLabel text={seminar ? seminar.title : "BRĪVAS VIETAS: 14"} position={[0, 0, 0.3]} color={hasJoined ? "#10b981" : "#ef4444"} size={0.4} />
        {!hasJoined && (
          <group position={[0, -1.5, 0.3]} onClick={(e) => { e.stopPropagation(); setHasJoined(true); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
            <mesh><boxGeometry args={[4, 1, 0.2]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} /></mesh>
            <StaticTextLabel text="PIEDALĪTIES" position={[0, 0, 0.11]} color="#fff" size={0.4} />
          </group>
        )}
      </group>
      {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => (
        <mesh key={`seat-${r}-${c}`} position={[c * 5 - 17.5, 0.5, r * 5 + 15]} castShadow><boxGeometry args={[3, 1, 3]} /><meshStandardMaterial color="#1e293b" /></mesh>
      )))}
    </group>
  );
}

// --- 6. WALL BILLBOARDS ---
function WallBillboard({ position, rotation = [0,0,0], color, text }: any) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow><boxGeometry args={[60, 30, 1]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0, 0.6]}><planeGeometry args={[58, 28]} /><meshBasicMaterial color="#000" /></mesh>
      <DirectionalText text={text} position={[0, 0, 0.7]} color={color} size={3} />
    </group>
  );
}

// --- 7. MAIN EXPO COMPONENT ---
export default function Expo3D() {
  const [isLocked, setIsLocked] = useState(false);
  const [dynamicBooths, setDynamicBooths] = useState<any[]>([]);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const fetchBooths = async () => {
      const { data } = await supabase.from('expo_booth').select('*');
      if (data) setDynamicBooths(data);
    };
    fetchBooths();
  }, []);

  const businessBooths = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const LX = -35; const RX = 35;
    const rotL = [0, Math.PI / 2, 0]; const rotR = [0, -Math.PI / 2, 0];

    const mockPortfolio = [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503387762-592cd58cd47f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80'
    ];

    // Left Column
    nodes.push(<DarkPavilion key="acc" position={[LX, 0, 60]} rotation={rotL} title="BIZNESA AKCELERATORS" subtitle="30 Dienu Izaicinājums" color="#a855f7" link="/bizness30" requestsCount={150} isPaid={true} content={mockPortfolio} />);
    nodes.push(<DarkPavilion key="b1" position={[LX, 0, 20]} rotation={rotL} title="APDARE UN REMONTS" subtitle="Namdari, Reģipšnieki" color="#eab308" link="/apdare" jobsCount={2} requestsCount={5} />);
    nodes.push(<DarkPavilion key="b2" position={[LX, 0, -20]} rotation={rotL} title="SILDĪŠANAS SISTĒMAS" subtitle="Siltumsūkņi un Katli" color="#ea580c" link="/apkure" requestsCount={12} />);
    nodes.push(<DarkPavilion key="b3" position={[LX, 0, -60]} rotation={rotL} title="JUMTU BŪVNIECĪBA" subtitle="Segumi un Notekas" color="#f43f5e" link="/jumti" jobsCount={4} />);
    nodes.push(<DarkPavilion key="b4" position={[LX, 0, -100]} rotation={rotL} title="LOGI UN DURVIS" subtitle="PVC, Alumīnijs, Koks" color="#0ea5e9" link="/logi" requestsCount={8} />);
    nodes.push(<DarkPavilion key="b6" position={[LX, 0, -140]} rotation={rotL} title="INTERJERA DIZAINS" subtitle="3D Vizualizācijas" color="#a855f7" link="/dizains" isPaid={true} content={['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80']} />);
    nodes.push(<DarkPavilion key="b7" position={[LX, 0, -180]} rotation={rotL} title="UZFRIŠINĀŠANA 24H" subtitle="Sīkie darbi" color="#f43f5e" link="/uzfrisinasana" requestsCount={20} />);

    // Right Column
    nodes.push(<DarkPavilion key="sos" position={[RX, 0, 60]} rotation={rotR} title="24/7 SOS AVĀRIJA" subtitle="Santehniķi, Elektriķi" color="#ef4444" link="/avarija" jobsCount={5} requestsCount={14} />);
    nodes.push(<DarkPavilion key="p1" position={[RX, 0, 20]} rotation={rotR} title="KOKA MĀJU BŪVE" subtitle="Karkasi un CLT" color="#22c55e" link="/kokamajas" jobsCount={3} />);
    nodes.push(<DarkPavilion key="p2" position={[RX, 0, -20]} rotation={rotR} title="PAMATU IZBŪVE" subtitle="Pāļi un Plātnes" color="#94a3b8" link="/pamati" requestsCount={6} />);
    nodes.push(<DarkPavilion key="p3" position={[RX, 0, -60]} rotation={rotR} title="SANTEHNIKAS IEKĀRTAS" subtitle="Punkti un Montāža" color="#06b6d4" link="/santehnika" jobsCount={2} />);
    nodes.push(<DarkPavilion key="p4" position={[RX, 0, -100]} rotation={rotR} title="UZKOPŠANAS SERVISS" subtitle="Pēcremonta tīrīšana" color="#14b8a6" link="/uzkopsana" jobsCount={8} />);
    nodes.push(<DarkPavilion key="p5" position={[RX, 0, -140]} rotation={rotR} title="SAGĀDE UN LOĢISTIKA" subtitle="Transports un Krāvēji" color="#f59e0b" link="/sagade" jobsCount={2} />);
    nodes.push(<DarkPavilion key="p6" position={[RX, 0, -180]} rotation={rotR} title="AUTO SERVISS" subtitle="Diagnostika" color="#f97316" link="/autoserviss" />);
    nodes.push(<DarkPavilion key="p7" position={[RX, 0, -220]} rotation={rotR} title="NEKUSTAMAIS ĪPAŠUMS" subtitle="Aģentu rīki" color="#10b981" link="/majoklis" isPaid={true} content={['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80']} />);
    nodes.push(<DarkPavilion key="p8" position={[RX, 0, -260]} rotation={rotR} title="DOKUMENTU HUBS" subtitle="Līgumi un Rēķini" color="#8b5cf6" link="/dokumenti" />);

    // Dynamic from DB
    dynamicBooths.forEach((booth) => {
      const x = booth.side === 'left' ? LX : RX;
      const rot = booth.side === 'left' ? rotL : rotR;
      nodes.push(
        <DarkPavilion 
          key={booth.id} position={[x, 0, booth.position_z]} rotation={rot} 
          title={booth.title} subtitle={booth.subtitle} color={booth.color} 
          jobsCount={booth.jobs_count} requestsCount={booth.requests_count}
          isPaid={booth.is_paid} content={[]}
        />
      );
    });

    return nodes;
  }, [dynamicBooths]);

  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', background: '#020617' }}>
      <AudioToggle />
      {!isLocked && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', backdropFilter: 'blur(15px)' }}>
          <h1 style={{ fontSize: '5rem', color: '#3b82f6', fontWeight: 900, marginBottom: '10px', textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>PLATFORMU CENTRS</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px', letterSpacing: '2px' }}>EKSPERTU UN TEHNOLOĢIJU METAVERSA IZSTĀDE</p>
          <button onClick={() => controlsRef.current?.lock()} style={{ padding: '25px 100px', fontSize: '1.4rem', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)' }}>
            Ienākt Izstādē
          </button>
          <p style={{ marginTop: '40px', color: '#475569' }}>WASD - Staigāt | PELE - Skatīties</p>
        </div>
      )}
      <Canvas shadows camera={{ fov: 60, far: 1500 }}>
        <PointerLockControls ref={controlsRef} onLock={() => setIsLocked(true)} onUnlock={() => setIsLocked(false)} />
        <Player />
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 100, 50]} intensity={0.8} castShadow shadow-mapSize={[4096, 4096]} />
        <group>
          <Plane args={[200, 1000]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshStandardMaterial color="#e2e8f0" roughness={0.1} /></Plane>
          <gridHelper args={[200, 80, '#cbd5e1', '#f1f5f9']} position={[0, 0.01, 0]} />
        </group>
        <mesh position={[0, 25, 150]} receiveShadow><boxGeometry args={[200, 50, 2]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0, 25, -550]} receiveShadow><boxGeometry args={[200, 50, 2]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[-100, 25, -200]} receiveShadow><boxGeometry args={[2, 50, 700]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[100, 25, -200]} receiveShadow><boxGeometry args={[2, 50, 700]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0, 50, -200]}><boxGeometry args={[200, 2, 700]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <WallBillboard position={[98.9, 20, 0]} rotation={[0, -Math.PI/2, 0]} color="#eab308" text="REKLĀMA: JAUNI PROJEKTI" />
        <WallBillboard position={[-98.9, 20, -100]} rotation={[0, Math.PI/2, 0]} color="#ef4444" text="REKLĀMA: SOS DIENESTS" />
        <WallBillboard position={[0, 20, -548.9]} rotation={[0, 0, 0]} color="#3b82f6" text="MEISTARU APMĀCĪBA" />
        <InfoDesk />
        {businessBooths}
        <SidebarSeminarTheatre position={[-70, 0, -150]} rotation={[0, Math.PI/2, 0]} />
        <EffectComposer><Bloom luminanceThreshold={0.5} intensity={0.8} /></EffectComposer>
      </Canvas>
    </div>
  );
}