import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PointerLockControls, 
  Text, 
  Environment, 
  ContactShadows, 
  Bvh, 
  Html,
  Stars,
} from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseUrl } from '../lib/supabase';
import { telemetry } from '../lib/telemetry';
import { Joystick } from 'react-joystick-component';

// Constants
const BASE_SPEED = 15;
const SPRINT_MULTIPLIER = 2.5;

// Global joystick state
const joystickState = { x: 0, y: 0 };
const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

function DataHUD({ isLocked }: { isLocked: boolean }) {
  const [stats, setStats] = useState({ visitors: 0, activeRooms: 0, latency: '12ms' });
  useEffect(() => { const interval = setInterval(() => { setStats(s => ({ ...s, visitors: 1200 + Math.floor(Math.random() * 50) })); }, 3000); return () => clearInterval(interval); }, []);

  return (
    <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 100, pointerEvents: 'none' }}>
      <div className="glass-card" style={{ padding: '20px 30px', borderColor: 'var(--accent-primary)', background: 'rgba(15, 23, 42, 0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
          <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '1px', color: '#fff' }}>SYSTEM ONLINE</div>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>CONCURRENT_USERS: <span style={{ color: '#fff' }}>{stats.visitors}</span></div>
          <div>NETWORK_LATENCY: <span style={{ color: '#fff' }}>{stats.latency}</span></div>
          <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: 800, color: isLocked ? '#3b82f6' : '#ef4444' }}>
            {isLocked ? '>>> LINK_STABLE' : '>>> WAITING_FOR_SYNC...'}
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioToggle() {
  const [on, setOn] = useState(false); const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => { audio.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); audio.current.loop = true; audio.current.volume = 0.05; return () => { if (audio.current) audio.current.pause(); }; }, []);
  const toggle = () => { if (!audio.current) return; if (on) audio.current.pause(); else audio.current.play(); setOn(!on); };
  return (
    <button onClick={toggle} className="glass-card" style={{ 
      position: 'absolute', top: '24px', right: '24px', zIndex: 100, 
      padding: '12px 24px', fontWeight: 900, cursor: 'pointer', color: '#fff',
      fontSize: '0.8rem', letterSpacing: '1px'
    }}>
      {on ? '🔊 AUDIO ON' : '🔈 AUDIO OFF'}
    </button>
  );
}

interface StaticTextLabelProps {
  text: string;
  position: [number, number, number];
  rotation?: [number, number, number] | THREE.Euler;
  color: string;
  size?: number;
  opacity?: number;
}

function StaticTextLabel({ text, position, rotation = [0, 0, 0], color, size = 1, opacity = 1 }: StaticTextLabelProps) {
  return <Text position={position} rotation={rotation} fontSize={size} color={color} anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" fontWeight={900} fillOpacity={opacity}>{text}</Text>;
}

interface SidebarSeminarTheatreProps {
  position: [number, number, number];
  rotation?: [number, number, number] | THREE.Euler;
}

function SidebarSeminarTheatre({ position, rotation = [0,0,0] }: SidebarSeminarTheatreProps) {
  const [seminar, setSeminar] = useState<any>(null); useEffect(() => { const f = async () => { try { 
    if (supabaseUrl.includes('dummy') || supabaseUrl.includes('xyz.supabase.co')) return;
    const { data } = await supabase.from('expo_seminar').select('*, expo_booth(title, color)').eq('is_live', true).single(); if (data) setSeminar(data); 
  } catch { /* ignore */ } }; f(); }, []);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 20, -6]} castShadow receiveShadow><boxGeometry args={[80, 50, 2]} /><meshPhysicalMaterial color="#fff" metalness={0.2} roughness={0.2} /></mesh>
      <mesh position={[0, 20, -4.9]}><planeGeometry args={[76, 40]} /><meshBasicMaterial color="#000" /></mesh>
      <StaticTextLabel text={seminar ? `LIVE FEED: ${seminar.expo_booth.title}` : "EXECUTIVE PLENARY"} position={[0, 42, -4.8]} color="#000" size={4.5} />
      {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => (<mesh key={`seat-${r}-${c}`} position={[c * 8 - 28, 0.5, r * 8 + 30]} castShadow><boxGeometry args={[4, 1.2, 4]} /><meshPhysicalMaterial color="#eee" metalness={0.5} roughness={0.6} /></mesh>)))}
    </group>
  );
}

interface WallBillboardProps {
  position: [number, number, number];
  rotation?: [number, number, number] | THREE.Euler;
  color: string;
  text: string;
  slotId: string;
}

function WallBillboard({ position, rotation = [0,0,0], color, text, slotId }: WallBillboardProps) {
  const [ads, setAds] = useState<any[]>([]); const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => { const f = async () => { try { 
    if (supabaseUrl.includes('dummy') || supabaseUrl.includes('xyz.supabase.co')) return;
    const { data } = await supabase.from('ad_campaign').select('*').eq('slot_id', slotId).eq('is_active', true); if (data && data.length > 0) setAds(data); 
  } catch { /* ignore */ } }; f(); }, [slotId]);
  useEffect(() => { if (ads.length <= 1) return; const interval = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % ads.length); try { telemetry.trackAdImpression(ads[currentIndex].id); } catch { /* ignore */ } }, 15000); return () => clearInterval(interval); }, [ads, currentIndex]);
  const ad = ads[currentIndex];
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow><boxGeometry args={[80, 40, 1.5]} /><meshPhysicalMaterial color="#050505" metalness={0.2} roughness={0.2} /></mesh>
      <mesh position={[0, 0, 0.81]}><planeGeometry args={[78, 38]} /><meshBasicMaterial color="#000" /></mesh>
      {ad ? <Html position={[0, 0, 0.9]} center transform occlude="blending" distanceFactor={12}><div style={{ width: '780px', height: '380px', background: '#000', overflow: 'hidden' }}>{ad.media_type === 'video' ? <video src={ad.media_url} autoPlay loop muted style={{ width: '100%' }} /> : <img src={ad.media_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Ad" />}</div></Html> : <Text position={[0, 0, 0.9]} fontSize={4} color={color} fontWeight={900} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf">{text}</Text>}
    </group>
  );
}

function MobileCameraControls() {
  const { camera, gl } = useThree(); const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ')); const isDragging = useRef(false); const previousTouch = useRef({ x: 0, y: 0 });
  useEffect(() => { if (!isTouchDevice) return; const domElement = gl.domElement; const onTouchStart = (e: TouchEvent) => { isDragging.current = true; previousTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }; const onTouchMove = (e: TouchEvent) => { if (!isDragging.current) return; const touchX = e.touches[0].clientX; const touchY = e.touches[0].clientY; const movementX = touchX - previousTouch.current.x; const movementY = touchY - previousTouch.current.y; euler.current.setFromQuaternion(camera.quaternion); euler.current.y -= movementX * 0.005; euler.current.x -= movementY * 0.005; euler.current.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, euler.current.x)); camera.quaternion.setFromEuler(euler.current); previousTouch.current = { x: touchX, y: touchY }; }; const onTouchEnd = () => { isDragging.current = false; }; domElement.addEventListener('touchstart', onTouchStart, { passive: true }); domElement.addEventListener('touchmove', onTouchMove, { passive: true }); domElement.addEventListener('touchend', onTouchEnd); return () => { domElement.removeEventListener('touchstart', onTouchStart); domElement.removeEventListener('touchmove', onTouchMove); domElement.removeEventListener('touchend', onTouchEnd); } }, [camera, gl.domElement]);
  return null;
}

function Player() {
  const { camera } = useThree(); const dir = useRef(new THREE.Vector3());
  const [mov, setMov] = useState({ f: false, b: false, l: false, r: false, s: false });
  useEffect(() => {
    const d = (e: KeyboardEvent) => { switch (e.code) { case 'KeyW': setMov(m => ({ ...m, f: true })); break; case 'KeyS': setMov(m => ({ ...m, b: true })); break; case 'KeyA': setMov(m => ({ ...m, l: true })); break; case 'KeyD': setMov(m => ({ ...m, r: true })); break; case 'ShiftLeft': setMov(m => ({ ...m, s: true })); break; } };
    const u = (e: KeyboardEvent) => { switch (e.code) { case 'KeyW': setMov(m => ({ ...m, f: false })); break; case 'KeyS': setMov(m => ({ ...m, b: false })); break; case 'KeyA': setMov(m => ({ ...m, l: false })); break; case 'KeyD': setMov(m => ({ ...m, r: false })); break; case 'ShiftLeft': setMov(m => ({ ...m, s: false })); break; } };
    document.addEventListener('keydown', d); document.addEventListener('keyup', u); return () => { document.removeEventListener('keydown', d); document.removeEventListener('keyup', u); };
  }, []);
  useEffect(() => { const p = sessionStorage.getItem('expo_camera_pos'); if (p) { const { x, z } = JSON.parse(p); camera.position.set(x, 1.7, z); } else camera.position.set(0, 1.7, 120); }, [camera]);
  useFrame((_, delta) => {
    const s = BASE_SPEED * (mov.s ? SPRINT_MULTIPLIER : 1);
    dir.current.z = Number(mov.f) - Number(mov.b) - joystickState.y; dir.current.x = Number(mov.r) - Number(mov.l) + joystickState.x; dir.current.normalize();
    if (mov.f || mov.b || joystickState.y !== 0) camera.translateZ(-dir.current.z * s * delta);
    if (mov.l || mov.r || joystickState.x !== 0) camera.translateX(dir.current.x * s * delta);
    const nx = Math.max(-140, Math.min(140, camera.position.x));
    const nz = Math.max(-1000, Math.min(145, camera.position.z));
    camera.position.set(nx, 1.7, nz);
  });
  return null;
}

interface ThemedBoothProps {
  position: [number, number, number];
  title: string;
  subtitle: string;
  color: string;
  rotation?: [number, number, number] | THREE.Euler;
  link?: string;
  jobsCount?: number;
  requestsCount?: number;
  category?: string;
  content?: string[];
}

function ThemedBooth({ position, title, subtitle, color, rotation = [0,0,0], link, jobsCount = 0, requestsCount = 0, category = 'generic', content = [] }: ThemedBoothProps) {
  const nav = useNavigate();
  const enter = (e: any) => { if (e && typeof e.stopPropagation === 'function') e.stopPropagation(); sessionStorage.setItem('expo_camera_pos', JSON.stringify({ x: position[0], y: 1.7, z: position[2] + 15 })); sessionStorage.setItem('expo_initialized', 'true'); if (typeof document !== 'undefined') document.exitPointerLock(); nav(link || '/'); };
  const isC = ['building', 'industrial'].includes(category); const isT = ['tech', 'digital'].includes(category); const isS = ['emergency', 'service'].includes(category); const isD = ['design', 'luxury'].includes(category);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.03, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[26, 24]} /><meshPhysicalMaterial color="#f8fafc" roughness={1} metalness={0} /></mesh>
      {isC && (<group>
          {[[-12.5, 11], [12.5, 11], [-12.5, -11], [12.5, -11]].map((p, i) => (<mesh key={i} position={[p[0], 7, p[1]]} castShadow><boxGeometry args={[1.2, 14, 1.2]} /><meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.3} /></mesh>))}
          <mesh position={[0, 14, 0]} castShadow><boxGeometry args={[26.5, 1, 24.5]} /><meshPhysicalMaterial color="#0a0a0a" metalness={0.2} roughness={0.2} /></mesh>
          <mesh position={[-6, 4, -5]} rotation={[0, 0, Math.PI/4]} castShadow><boxGeometry args={[0.2, 10, 0.2]} /><meshPhysicalMaterial color="#eab308" metalness={0.2} /></mesh>
        </group>)}
      {isT && (<group>
          <mesh position={[0, 7, -11.5]} castShadow><boxGeometry args={[26, 14, 0.2]} /><meshPhysicalMaterial color={color} transparent opacity={0.1} roughness={0} metalness={0.2} transmission={0.9} thickness={1} /></mesh>
          <mesh position={[0, 14.2, 0]}><boxGeometry args={[26.2, 0.4, 24.2]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={4} /></mesh>
          <mesh position={[0, 5, -6]} rotation={[Math.PI/4, Math.PI/4, 0]}><octahedronGeometry args={[2]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={5} transparent opacity={0.7} /></mesh>
        </group>)}
      {isS && (<group>
          <mesh position={[0, 7, -11.8]}><boxGeometry args={[26, 14, 1.5]} /><meshPhysicalMaterial color="#050505" metalness={0.8} roughness={0.3} /></mesh>
          {[[-12.5, 10], [12.5, 10]].map((p, i) => (<mesh key={i} position={[p[0], 12.5, p[1]]}><cylinderGeometry args={[0.5, 0.5, 1]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={5} /></mesh>))}
          <mesh position={[0, 7, -8]} scale={[1, 1, 1]}><boxGeometry args={[20, 12, 0.1]} /><meshPhysicalMaterial color="#ef4444" wireframe /></mesh>
        </group>)}
      {isD && (<group>
          <mesh position={[0, 15, -4]} castShadow><boxGeometry args={[30, 0.6, 20]} /><meshPhysicalMaterial color="#fff" roughness={0.05} clearcoat={1} /></mesh>
          <mesh position={[-14, 7, 0]}><boxGeometry args={[0.1, 14, 24]} /><meshPhysicalMaterial color="#fff" transparent opacity={0.3} transmission={0.5} /></mesh>
          <mesh position={[5, 4, -5]} rotation={[0, Math.PI/4, Math.PI/4]} castShadow><torusKnotGeometry args={[1.5, 0.2, 128, 16]} /><meshPhysicalMaterial color="#000" metalness={0.2} roughness={0.1} clearcoat={1} /></mesh>
        </group>)}
      <group position={[0, 16, 8]}><mesh castShadow><boxGeometry args={[20, 5, 0.6]} /><meshPhysicalMaterial color="#fff" metalness={0.2} roughness={0.1} clearcoat={1} /></mesh><StaticTextLabel text={title} position={[0, 0, 0.35]} color={color} size={1.8} /></group>
      <PavilionScreen position={[0, 8, -11]} isPaid={true} content={content} />
      <group position={[-10, 0, 10]} rotation={[0, Math.PI/6, 0]} onClick={enter} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh position={[0, 1, 0]} castShadow><boxGeometry args={[1, 2, 0.5]} /><meshPhysicalMaterial color="#111" metalness={0.2} /></mesh>
        <mesh position={[0, 2, 0.3]} rotation={[-0.5, 0, 0]}><planeGeometry args={[1.2, 0.8]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={2} /></mesh>
        <StaticTextLabel text="ENTER" position={[0, 2.1, 0.4]} rotation={[-0.5, 0, 0]} color="#fff" size={0.2} />
        <StaticTextLabel text={subtitle} position={[0, 0.5, 0.3]} color="#fff" size={0.15} opacity={0.5} />
      </group>
      <group position={[10, 4, 10]} rotation={[0, -Math.PI/6, 0]} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh castShadow><boxGeometry args={[7, 8, 0.2]} /><meshPhysicalMaterial color="#fff" metalness={0.2} roughness={0.1} /></mesh>
        <mesh position={[0, 0, 0.11]}><planeGeometry args={[6.8, 7.8]} /><meshBasicMaterial color="#fcfcfc" /></mesh>
        <StaticTextLabel text={category.toUpperCase() + " OPS"} position={[0, 3, 0.15]} color="#aaa" size={0.4} />
        <StaticTextLabel text={`JOBS: ${jobsCount}`} position={[0, 0, 0.15]} color="#000" size={0.6} /><StaticTextLabel text={`REQS: ${requestsCount}`} position={[0, -1, 0.15]} color="#000" size={0.6} />
        <Html position={[0, -3.5, 0.2]} center transform occlude="blending" distanceFactor={8}><div style={{ width: '250px', background: '#000', color: color, padding: '5px', fontSize: '0.6rem', fontFamily: 'monospace', overflow: 'hidden' }}><div style={{ animation: 'marquee 10s linear infinite' }}>&gt;&gt;&gt; SYSTEM ACTIVE // {title} READY...</div></div></Html>
      </group>
    </group>
  );
}

function InfoDesk() {
  const [open, setOpen] = useState(false); const nav = useNavigate();
  return (
    <group position={[0, 0, 130]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[24, 3, 6]} /><meshPhysicalMaterial color="#fff" metalness={0.2} roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0, 3.2, 0]}><boxGeometry args={[24.2, 0.4, 6.2]} /><meshPhysicalMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} /></mesh>
      <StaticTextLabel text="COMMAND CENTER" position={[0, 10, -4]} rotation={[0, Math.PI, 0]} color="#000" size={6} />
      <group position={[0, 6, -4.5]} rotation={[0, Math.PI, 0]} onClick={(e) => { e.stopPropagation(); setOpen(true); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}><mesh><boxGeometry args={[10, 2.5, 0.5]} /><meshPhysicalMaterial color="#000" metalness={0.2} roughness={0.1} /></mesh><StaticTextLabel text="NETWORK" position={[0, 0, 0.3]} color="#3b82f6" size={0.8} /></group>
      {open && (<Html position={[0, 12, -4.5]} rotation={[0, Math.PI, 0]} center transform occlude>
          <div style={{ background: '#fff', border: `1px solid #eee`, padding: '60px', color: '#000', width: '800px', pointerEvents: 'auto', boxShadow: '0 100px 200px rgba(0,0,0,0.2)', fontFamily: 'Inter, sans-serif' }}>
            <h2 style={{ color: '#000', fontSize: '4rem', fontWeight: 900 }}>SUMMIT HUB</h2><button onClick={() => nav('/login')} style={{ width: '100%', padding: '22px', border: '2px solid #000', fontWeight: 'bold' }}>Login to Core</button>
            <button onClick={() => setOpen(false)} style={{ width: '100%', padding: '20px', color: '#ccc', fontWeight: 'bold', border: 'none', background: 'none' }}>DISCONNECT</button>
          </div>
        </Html>)}
    </group>
  );
}

function PavilionScreen({ position, rotation = [0, 0, 0], isPaid, content = [] }: { position: [number, number, number], rotation?: [number, number, number] | THREE.Euler, isPaid?: boolean, content?: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => { if (content.length > 1) { const i = setInterval(() => setIndex(prev => (prev + 1) % content.length), 5000); return () => clearInterval(i); } }, [content]);
  if (!isPaid || content.length === 0) return null;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0.1]}><planeGeometry args={[18, 10]} /><meshBasicMaterial color="#000" /></mesh>
      <Html position={[0, 0, 0.12]} center transform occlude="blending" distanceFactor={10}><div style={{ width: '600px', height: '330px', overflow: 'hidden' }}><img src={content[index]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Pavilion" /></div></Html>
    </group>
  );
}

export default function Expo3D() {
  const [isL, setIsL] = useState(() => {
    if (typeof sessionStorage !== 'undefined') {
      return !!sessionStorage.getItem('expo_initialized');
    }
    return false;
  }); 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mM, setMM] = useState(false); const [dB, setDB] = useState<any[]>([]); const cRef = useRef<any>(null);
  useEffect(() => {
    const f = async () => {
      if (supabaseUrl.includes('dummy') || supabaseUrl.includes('xyz.supabase.co')) return;
      try {
        const { data } = await supabase.from('expo_booth').select('*');
        if (data) setDB(data);
      } catch { /* ignore */ }
    };
    f();
  }, []);

  const bBooths = useMemo(() => {
    const nodes: React.ReactNode[] = []; const LX = -50; const RX = 50; const rL = [0, Math.PI / 2, 0] as [number, number, number]; const rR = [0, -Math.PI / 2, 0] as [number, number, number];
    const ph = ['https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1531050171651-7484a93ef05e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1475721027187-4024733924f3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80'];
    nodes.push(<ThemedBooth key="acc" position={[LX, 0, 100]} rotation={rL} title="BIZNESA AKCELERATORS" subtitle="Strategy" color="#a855f7" link="/bizness30" requestsCount={150} category="tech" content={[ph[0], ph[1]]} />);
    nodes.push(<ThemedBooth key="b1" position={[LX, 0, 0]} rotation={rL} title="APDARE UN REMONTS" subtitle="Finishing" color="#eab308" link="/apdare" jobsCount={2} requestsCount={5} category="building" content={[ph[2]]} />);
    nodes.push(<ThemedBooth key="b2" position={[LX, 0, -100]} rotation={rL} title="SILDĪŠANAS SISTĒMAS" subtitle="Climate" color="#ea580c" link="/apkure" requestsCount={12} category="service" content={[ph[3]]} />);
    nodes.push(<ThemedBooth key="b3" position={[LX, 0, -200]} rotation={rL} title="JUMTU BŪVNIECĪBA" subtitle="Structural" color="#f43f5e" link="/jumti" jobsCount={4} category="building" content={[ph[4]]} />);
    nodes.push(<ThemedBooth key="b4" position={[LX, 0, -300]} rotation={rL} title="LOGI UN DURVIS" subtitle="Acoustics" color="#0ea5e9" link="/logi" requestsCount={8} category="building" content={[ph[5]]} />);
    nodes.push(<ThemedBooth key="b6" position={[LX, 0, -400]} rotation={rL} title="INTERJERA DIZAINS" subtitle="Premium" color="#a855f7" link="/dizains" category="design" content={[ph[6]]} />);
    nodes.push(<ThemedBooth key="b7" position={[LX, 0, -500]} rotation={rL} title="UZFRIŠINĀŠANA 24H" subtitle="Maintenance" color="#f43f5e" link="/uzfrisinasana" requestsCount={20} category="service" content={[ph[0]]} />);
    nodes.push(<ThemedBooth key="sos" position={[RX, 0, 100]} rotation={rR} title="24/7 SOS AVĀRIJA" subtitle="Dispatch" color="#ef4444" link="/avarija" jobsCount={5} requestsCount={14} category="emergency" content={[ph[1]]} />);
    nodes.push(<ThemedBooth key="p1" position={[RX, 0, 0]} rotation={rR} title="KOKA MĀJU BŪVE" subtitle="Sustainable" color="#22c55e" link="/kokamajas" jobsCount={3} category="building" content={[ph[2]]} />);
    nodes.push(<ThemedBooth key="p2" position={[RX, 0, -100]} rotation={rR} title="PAMATU IZBŪVE" subtitle="Ground" color="#94a3b8" link="/pamati" requestsCount={6} category="building" content={[ph[3]]} />);
    nodes.push(<ThemedBooth key="p3" position={[RX, 0, -200]} rotation={rR} title="SANTEHNIKAS IEKĀRTAS" subtitle="Fluid" color="#06b6d4" link="/santehnika" jobsCount={2} category="service" content={[ph[4]]} />);
    nodes.push(<ThemedBooth key="p4" position={[RX, 0, -300]} rotation={rR} title="UZKOPŠANAS SERVISS" subtitle="Facility" color="#14b8a6" link="/uzkopsana" jobsCount={8} category="service" content={[ph[5]]} />);
    nodes.push(<ThemedBooth key="p5" position={[RX, 0, -400]} rotation={rR} title="SAGĀDE UN LOĢISTIKA" subtitle="Supply" color="#f59e0b" link="/sagade" jobsCount={2} category="industrial" content={[ph[6]]} />);
    nodes.push(<ThemedBooth key="p6" position={[RX, 0, -500]} rotation={rR} title="AUTO SERVISS" subtitle="Precision" color="#f97316" link="/autoserviss" category="service" content={[ph[0]]} />);
    nodes.push(<ThemedBooth key="p7" position={[RX, 0, -600]} rotation={rR} title="NEKUSTAMAIS ĪPAŠUMS" subtitle="Assets" color="#10b981" link="/majoklis" category="luxury" content={[ph[1]]} />);
    nodes.push(<ThemedBooth key="p8" position={[RX, 0, -700]} rotation={rR} title="DOKUMENTU HUBS" subtitle="Encrypted" color="#8b5cf6" link="/dokumenti" category="tech" content={[ph[2]]} />);
    dB.forEach((b, i) => nodes.push(<ThemedBooth key={b.id} position={[b.side==='left'?-50:50, 0, -800-(i*120)]} rotation={b.side==='left'?rL:rR} title={b.title} subtitle={b.subtitle} color={b.color} jobsCount={b.jobs_count} requestsCount={b.requests_count} category={b.category||'generic'} content={[ph[i%ph.length]]} link={`/expo/stends/${b.slug||b.id}`} />));
    return nodes;
  }, [dB]);

  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', background: 'var(--bg-main)', touchAction: 'none' }}>
      <AudioToggle /> <DataHUD isLocked={isL || mM} />
      {!isL && !mM && (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-main)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '8rem', fontWeight: 950, letterSpacing: '-8px', marginBottom: '40px', background: 'linear-gradient(135deg, #fff 0%, var(--accent-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EXPO CORE</h1>
          <button onClick={() => { if (isTouchDevice) setMM(true); else { try { cRef.current?.lock(); } catch { /* ignore */ } } setIsL(true); sessionStorage.setItem('expo_initialized', 'true'); }} className="btn-pro btn-pro-primary" style={{ padding: '30px 120px', fontSize: '1.5rem' }}>INITIALIZE LINK</button>
        </div>
      )}
      {mM && <div style={{ position: 'absolute', bottom: '40px', left: '40px', zIndex: 50 }}><Joystick size={100} sticky baseColor="rgba(255,255,255,0.05)" stickColor="var(--accent-primary)" move={(e: any)=>{joystickState.x=e.x || 0;joystickState.y=e.y || 0;}} stop={()=>{joystickState.x=0;joystickState.y=0;}} /></div>}
      <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ fov: 50, far: 2500, near: 0.1 }} gl={{ antialias: false, powerPreference: "high-performance" }} dpr={[1, 1.2]}>
        <Suspense fallback={null}>
          <Bvh firstHitOnly>
            {!isTouchDevice && <PointerLockControls ref={cRef} onLock={()=>setIsL(true)} onUnlock={()=>setIsL(false)} />}
            {isTouchDevice && <MobileCameraControls />}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.5} />
            <Environment preset="warehouse" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
              <planeGeometry args={[1000, 2000]} />
              <meshPhysicalMaterial color="#020617" roughness={0.8} metalness={0.2} />
            </mesh>
            {bBooths}
            <SidebarSeminarTheatre position={[0, 0, -800]} />
            <WallBillboard position={[-140, 40, 100]} rotation={[0, Math.PI / 2, 0]} color="#3b82f6" text="PRO SYSTEMS" slotId="hall_wall_left" />
            <WallBillboard position={[140, 40, 100]} rotation={[0, -Math.PI / 2, 0]} color="#10b981" text="GLOBAL NETWORK" slotId="hall_wall_right" />
            <InfoDesk />
            <ContactShadows resolution={1024} scale={150} blur={2} opacity={0.5} far={10} color="#000" />
            <Player />
          </Bvh>
        </Suspense>
      </Canvas>
      <div className="glass-card" style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-secondary)', fontSize: '0.75rem', pointerEvents: 'none', padding: '10px 30px', borderRadius: '50px', fontWeight: 800, letterSpacing: '1px', border: '1px solid var(--border-glass)' }}>
        {isTouchDevice ? 'IZMANTO VIRZIENSTRUCU, LAI PĀRVIETOTOS' : 'WASD + PELE, LAI PĀRVIETOTOS'}
      </div>
    </div>
  );
}
