import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Html, Text, Environment, MeshReflectorMaterial, Preload, AdaptiveDpr, AdaptiveEvents, Bvh } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Joystick } from 'react-joystick-component';

// --- Shared Constants ---
const BASE_SPEED = 18.0;
const SPRINT_MULTIPLIER = 2.5;
const joystickState = { x: 0, y: 0 };
let isTouchDevice = false;
if (typeof window !== 'undefined') {
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// --- Floating Data Particles ---
function DataParticles({ count = 1000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 600;
      p[i * 3 + 1] = Math.random() * 80;
      p[i * 3 + 2] = (Math.random() - 0.5) * 1200;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={points} 
          itemSize={3} 
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#3b82f6" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

// --- Professional Data HUD ---
function DataHUD({ isLocked }: { isLocked: boolean }) {
  const [metrics, setMetrics] = useState({ ping: '12ms', load: '0.04%', fps: '60' });
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        ping: Math.floor(Math.random() * 5 + 10) + 'ms',
        load: (Math.random() * 0.05).toFixed(3) + '%',
        fps: (60 - Math.random() * 2).toFixed(0)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  if (!isLocked) return null;
  return (
    <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 100, color: '#3b82f6', fontFamily: 'monospace', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>// ANALYTICS_CORE_ACTIVE</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>NETWORK_LATENCY: {metrics.ping}</div>
      <div style={{ fontSize: '0.8rem' }}>NODE_COMPUTE: {metrics.load}</div>
      <div style={{ fontSize: '0.8rem' }}>STABILITY: 100%</div>
    </div>
  );
}

// --- 0. AUDIO ---
function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.05;
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);
  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause(); else audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    setIsPlaying(!isPlaying);
  };
  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
      <button onClick={toggle} style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #000', color: '#000', padding: '12px 24px', borderRadius: '2px', cursor: 'pointer', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '1px' }}>
        {isPlaying ? 'AUDIO: ENABLED' : 'AUDIO: MUTED'}
      </button>
    </div>
  );
}

// --- 1. PLAYER & CONTROLS ---
const usePlayerControls = () => {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, sprint: false });
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) { 
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: true })); break; 
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: true })); break; 
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: true })); break; 
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: true })); break; 
        case 'ShiftLeft': case 'ShiftRight': setMovement(m => ({ ...m, sprint: true })); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) { 
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: false })); break; 
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: false })); break; 
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: false })); break; 
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: false })); break; 
        case 'ShiftLeft': case 'ShiftRight': setMovement(m => ({ ...m, sprint: false })); break;
      }
    };
    document.addEventListener('keydown', handleKeyDown); document.addEventListener('keyup', handleKeyUp);
    return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('keyup', handleKeyUp); };
  }, []);
  return movement;
};

function Player() {
  const { forward, backward, left, right, sprint } = usePlayerControls();
  const { camera } = useThree();
  const direction = useRef(new THREE.Vector3());
  useEffect(() => { const savedPos = sessionStorage.getItem('expo_camera_pos'); if (savedPos) { const pos = JSON.parse(savedPos); camera.position.set(pos.x, 1.7, pos.z); } else { camera.position.set(0, 1.7, 120); } }, [camera]);
  useFrame((_, delta) => {
    const speed = BASE_SPEED * (sprint ? SPRINT_MULTIPLIER : 1);
    direction.current.z = Number(forward) - Number(backward) - joystickState.y;
    direction.current.x = Number(right) - Number(left) + joystickState.x;
    direction.current.normalize();
    if (forward || backward || joystickState.y !== 0) camera.translateZ(-direction.current.z * speed * delta);
    if (left || right || joystickState.x !== 0) camera.translateX(direction.current.x * speed * delta);
    camera.position.y = 1.7; 
    if (camera.position.x > 140) camera.position.x = 140; if (camera.position.x < -140) camera.position.x = -140; if (camera.position.z > 145) camera.position.z = 145; if (camera.position.z < -1000) camera.position.z = -1000;
  });
  return null;
}

function StaticTextLabel({ text, position, rotation = [0, 0, 0], color, size = 1, opacity = 1 }: any) {
  return <Text position={position} rotation={rotation} fontSize={size} color={color} anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" fontWeight={900} fillOpacity={opacity}>{text}</Text>;
}

function PavilionScreen({ position, rotation = [0,0,0], isPaid = false, content = [] }: { position: [number, number, number], rotation?: [number, number, number], isPaid?: boolean, content?: string | string[] }) {
  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => { if (isPaid && Array.isArray(content) && content.length > 1) { const interval = setInterval(() => { setImgIndex(prev => (prev + 1) % content.length); }, 4000); return () => clearInterval(interval); } }, [isPaid, content]);
  return (
    <group position={position} rotation={rotation}>
      <mesh><planeGeometry args={[12, 6]} /><meshBasicMaterial color="#000" /></mesh>
      {isPaid ? (
        <Html position={[0, 0, 0.05]} center transform occlude="blending" distanceFactor={8}>
          <div style={{ width: '600px', height: '300px', background: '#000', overflow: 'hidden', border: '1px solid #444' }}>
            {typeof content === 'string' && content.startsWith('http') ? <video src={content} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : Array.isArray(content) && content.length > 0 ? <img src={content[imgIndex]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Portfolio" /> : <div style={{ color: '#fff', textAlign: 'center', paddingTop: '130px', fontWeight: 'bold' }}>DATA STREAMING...</div>}
          </div>
        </Html>
      ) : <StaticTextLabel text="CORPORATE SPACE AVAILABLE" position={[0, 0, 0.1]} color="#333" size={0.5} />}
    </group>
  );
}

function ThemedBooth({ position, title, subtitle, color, rotation = [0,0,0], link, jobsCount = 0, requestsCount = 0, category = 'generic', content = [] }: any) {
  const navigate = useNavigate();
  const { camera } = useThree();
  const [showInfo, setShowInfo] = useState(false);
  const handleEnter = (e: any) => { e.stopPropagation(); sessionStorage.setItem('expo_camera_pos', JSON.stringify({ x: camera.position.x, y: camera.position.y, z: camera.position.z })); document.exitPointerLock(); navigate(link || '/'); };
  const isConstruction = ['building', 'industrial'].includes(category);
  const isTech = ['tech', 'digital'].includes(category);
  const isSOS = ['emergency', 'service'].includes(category);
  const isDesign = ['design', 'luxury'].includes(category);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.03, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 24]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.9} clearcoat={1} />
      </mesh>
      {isConstruction && (
        <group>
          {[[-12.5, 11], [12.5, 11], [-12.5, -11], [12.5, -11]].map((p, i) => (
            <mesh key={i} position={[p[0], 7, p[1]]} castShadow><boxGeometry args={[1.2, 14, 1.2]} /><meshPhysicalMaterial color="#222" metalness={1} roughness={0.2} /></mesh>
          ))}
          <mesh position={[0, 14, 0]} castShadow><boxGeometry args={[26.5, 1, 24.5]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0.1} /></mesh>
          <mesh position={[-6, 4, -5]} rotation={[0, 0, Math.PI/4]} castShadow><boxGeometry args={[0.2, 10, 0.2]} /><meshPhysicalMaterial color="#eab308" metalness={1} /></mesh>
        </group>
      )}
      {isTech && (
        <group>
          <mesh position={[0, 7, -11.5]} castShadow><boxGeometry args={[26, 14, 0.2]} /><meshPhysicalMaterial color={color} transparent opacity={0.1} roughness={0} metalness={1} transmission={0.9} thickness={1} /></mesh>
          <mesh position={[0, 14.2, 0]}><boxGeometry args={[26.2, 0.4, 24.2]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={4} /></mesh>
          <mesh position={[0, 5, -6]} rotation={[Math.PI/4, Math.PI/4, 0]}><octahedronGeometry args={[2]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={5} transparent opacity={0.7} /></mesh>
        </group>
      )}
      {isSOS && (
        <group>
          <mesh position={[0, 7, -11.8]}><boxGeometry args={[26, 14, 1.5]} /><meshPhysicalMaterial color="#050505" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[-12.5, 14.5, 11]}><cylinderGeometry args={[0.6, 0.6, 1.5]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={10} /></mesh>
          <mesh position={[12.5, 14.5, 11]}><cylinderGeometry args={[0.6, 0.6, 1.5]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={10} /></mesh>
          <mesh position={[0, 7, -8]} scale={[1, 1, 1]}><boxGeometry args={[20, 12, 0.1]} /><meshPhysicalMaterial color="#ef4444" wireframe /></mesh>
        </group>
      )}
      {isDesign && (
        <group>
          <mesh position={[0, 15, -4]} castShadow><boxGeometry args={[30, 0.6, 20]} /><meshPhysicalMaterial color="#fff" roughness={0.01} clearcoat={1} /></mesh>
          <mesh position={[-14, 7, 0]}><boxGeometry args={[0.1, 14, 24]} /><meshPhysicalMaterial color="#fff" transparent opacity={0.3} transmission={0.5} /></mesh>
          <mesh position={[5, 4, -5]} rotation={[0, Math.PI/4, Math.PI/4]} castShadow><torusKnotGeometry args={[1.5, 0.2, 128, 16]} /><meshPhysicalMaterial color="#000" metalness={1} roughness={0} clearcoat={1} /></mesh>
        </group>
      )}
      <group position={[0, 16, 8]}>
         <mesh castShadow><boxGeometry args={[20, 5, 0.6]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0.05} clearcoat={1} /></mesh>
         <StaticTextLabel text={title} position={[0, 0, 0.35]} color={color} size={1.8} />
      </group>
      <PavilionScreen position={[0, 8, -11]} isPaid={true} content={content} />
      <StaticTextLabel text={title} position={[0, 3.2, -10.5]} color="#000" size={2} />
      <StaticTextLabel text={subtitle} position={[0, 1.6, -10.5]} color="#444" size={0.9} />
      <group position={[-10, 1.8, 10]} rotation={[0, Math.PI/6, 0]} onClick={handleEnter} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh castShadow><boxGeometry args={[7, 2, 0.4]} /><meshPhysicalMaterial color="#000" metalness={1} roughness={0.1} /></mesh>
        <mesh position={[0, 0, 0.21]}><planeGeometry args={[6.8, 1.8]} /><meshBasicMaterial color={color} /></mesh>
        <StaticTextLabel text={isSOS ? "CRITICAL RESPONSE" : "OPEN INTERFACE"} position={[0, 0, 0.25]} color="#fff" size={0.6} />
      </group>
      <group position={[10, 4, 10]} rotation={[0, -Math.PI/6, 0]} onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh castShadow><boxGeometry args={[7, 6, 0.2]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0} /></mesh>
        <mesh position={[0, 0, 0.11]}><planeGeometry args={[6.8, 5.8]} /><meshBasicMaterial color="#fcfcfc" /></mesh>
        <StaticTextLabel text={category.toUpperCase() + " KPIs"} position={[0, 2.2, 0.15]} color="#888" size={0.5} />
        <StaticTextLabel text={`CAPACITY: ${jobsCount}`} position={[0, 0.8, 0.15]} color="#10b981" size={0.7} />
        <StaticTextLabel text={`REVENUE: ${requestsCount}M`} position={[0, -0.8, 0.15]} color="#3b82f6" size={0.7} />
        <Html position={[0, 3.5, 0.2]} center transform occlude><div style={{ background: color, padding: '10px 25px', color: '#fff', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '4px', boxShadow: `0 20px 40px ${color}88`, animation: 'pulse 1s infinite alternate', textTransform: 'uppercase', borderRadius: '2px' }}>AI CORE ACTIVE</div></Html>
        {showInfo && (
          <Html position={[0, 4, 0]} center transform occlude>
            <div style={{ background: '#fff', border: `4px solid ${color}`, padding: '50px', color: '#000', width: '450px', pointerEvents: 'auto', boxShadow: '0 80px 160px rgba(0,0,0,0.3)', fontFamily: 'Inter, sans-serif' }}>
              <h4 style={{ margin: '0 0 25px 0', color: color, fontSize: '2rem', fontWeight: 900 }}>{title}</h4>
              <p style={{ color: '#333', marginBottom: '40px', fontSize: '1.1rem' }}>Industrial protocols for {category} operations.</p>
              <button style={{ background: color, color: '#fff', border: 'none', padding: '20px', width: '100%', cursor: 'pointer', fontWeight: '900', textTransform: 'uppercase' }}>Initialize Partnership</button>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function InfoDesk() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const navigate = useNavigate();
  return (
    <group position={[0, 0, 130]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[24, 3, 6]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0.05} clearcoat={1} /></mesh>
      <mesh position={[0, 3.2, 0]}><boxGeometry args={[24.2, 0.4, 6.2]} /><meshPhysicalMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} /></mesh>
      <StaticTextLabel text="COMMAND & CONTROL" position={[0, 10, -4]} rotation={[0, Math.PI, 0]} color="#000" size={6} />
      <group position={[0, 6, -4.5]} rotation={[0, Math.PI, 0]} onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <mesh><boxGeometry args={[10, 2.5, 0.5]} /><meshPhysicalMaterial color="#000" metalness={1} roughness={0} /></mesh>
        <StaticTextLabel text="NETWORK STATUS" position={[0, 0, 0.3]} color="#3b82f6" size={0.8} />
      </group>
      {isOpen && (
        <Html position={[0, 12, -4.5]} rotation={[0, Math.PI, 0]} center transform occlude>
          <div style={{ background: '#fff', border: `1px solid #eee`, padding: '60px', color: '#000', width: '800px', pointerEvents: 'auto', boxShadow: '0 100px 200px rgba(0,0,0,0.2)', fontFamily: 'Inter, sans-serif' }}>
            {!showOrderForm ? (
              <>
                <h2 style={{ color: '#000', fontSize: '4rem', fontWeight: 900 }}>SUMMIT HUB</h2>
                <button onClick={() => setShowOrderForm(true)} style={{ background: '#000', color: '#fff', border: 'none', padding: '25px', width: '100%', fontWeight: '900', marginBottom: '20px' }}>Issue Global Request</button>
                <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '22px', border: '2px solid #000', fontWeight: 'bold' }}>Login to Core</button>
              </>
            ) : <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}><h2 style={{ fontWeight: 900 }}>GLOBAL DISSEMINATION</h2><textarea placeholder="Enter technical specifications..." rows={7} style={{ padding: '25px', fontSize: '1.2rem' }}></textarea><button onClick={() => { alert('Broadcast Executed!'); setShowOrderForm(false); setIsOpen(false); }} style={{ background: '#10b981', color: '#fff', padding: '25px', fontWeight: 'bold' }}>Execute Global Broadcast</button></div>}
            <button onClick={() => setIsOpen(false)} style={{ width: '100%', padding: '20px', color: '#ccc', fontWeight: 'bold', border: 'none', background: 'none' }}>DISCONNECT</button>
          </div>
        </Html>
      )}
    </group>
  );
}

function SidebarSeminarTheatre({ position, rotation = [0,0,0] }: any) {
  const [seminar, setSeminar] = useState<any>(null);
  useEffect(() => { const fetchSeminar = async () => { const { data } = await supabase.from('expo_seminar').select('*, expo_booth(title, color)').eq('is_live', true).single(); if (data) setSeminar(data); }; fetchSeminar(); }, []);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 20, -6]} castShadow receiveShadow><boxGeometry args={[80, 50, 2]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0.1} /></mesh>
      <mesh position={[0, 20, -4.9]}><planeGeometry args={[76, 40]} /><meshBasicMaterial color="#000" /></mesh>
      <StaticTextLabel text={seminar ? `LIVE FEED: ${seminar.expo_booth.title}` : "EXECUTIVE PLENARY"} position={[0, 42, -4.8]} color="#000" size={4.5} />
      {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 12 }).map((_, c) => (
        <mesh key={`seat-${r}-${c}`} position={[c * 6 - 33, 0.5, r * 6 + 20]} castShadow><boxGeometry args={[4, 1.2, 4]} /><meshPhysicalMaterial color="#eee" metalness={0.5} roughness={0.5} /></mesh>
      )))}
    </group>
  );
}

function WallBillboard({ position, rotation = [0,0,0], color, text, slotId }: any) {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => { const fetchAds = async () => { const { data } = await supabase.from('ad_campaign').select('*').eq('slot_id', slotId).eq('is_active', true); if (data && data.length > 0) setAds(data); }; fetchAds(); }, [slotId]);
  useEffect(() => { if (ads.length <= 1) return; const interval = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % ads.length); }, 10000); return () => clearInterval(interval); }, [ads]);
  const currentAd = ads[currentIndex];
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow><boxGeometry args={[80, 40, 1.5]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0.1} /></mesh>
      <mesh position={[0, 0, 0.81]}><planeGeometry args={[78, 38]} /><meshBasicMaterial color="#000" /></mesh>
      {currentAd ? <Html position={[0, 0, 0.9]} center transform occlude><div style={{ width: '780px', height: '380px', background: '#000', overflow: 'hidden' }}>{currentAd.media_type === 'video' ? <video src={currentAd.media_url} autoPlay loop muted style={{ width: '100%' }} /> : <img src={currentAd.media_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Ad" />}</div></Html> : <Text position={[0, 0, 0.9]} fontSize={4} color={color} fontWeight={900} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf">{text}</Text>}
    </group>
  );
}

function MobileCameraControls() {
  const { camera, gl } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isDragging = useRef(false);
  const previousTouch = useRef({ x: 0, y: 0 });
  useEffect(() => { if (!isTouchDevice) return; const domElement = gl.domElement; const onTouchStart = (e: TouchEvent) => { isDragging.current = true; previousTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }; const onTouchMove = (e: TouchEvent) => { if (!isDragging.current) return; const touchX = e.touches[0].clientX; const touchY = e.touches[0].clientY; const movementX = touchX - previousTouch.current.x; const movementY = touchY - previousTouch.current.y; euler.current.setFromQuaternion(camera.quaternion); euler.current.y -= movementX * 0.005; euler.current.x -= movementY * 0.005; euler.current.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, euler.current.x)); camera.quaternion.setFromEuler(euler.current); previousTouch.current = { x: touchX, y: touchY }; }; const onTouchEnd = () => { isDragging.current = false; }; domElement.addEventListener('touchstart', onTouchStart, { passive: true }); domElement.addEventListener('touchmove', onTouchMove, { passive: true }); domElement.addEventListener('touchend', onTouchEnd); return () => { domElement.removeEventListener('touchstart', onTouchStart); domElement.removeEventListener('touchmove', onTouchMove); domElement.removeEventListener('touchend', onTouchEnd); } }, [camera, gl.domElement]);
  return null;
}

export default function Expo3D() {
  const [isLocked, setIsLocked] = useState(false);
  const [mobileMode, setMobileMode] = useState(false);
  const [dynamicBooths, setDynamicBooths] = useState<any[]>([]);
  const controlsRef = useRef<any>(null);
  useEffect(() => { const fetchBooths = async () => { const { data } = await supabase.from('expo_booth').select('*'); if (data) setDynamicBooths(data); }; fetchBooths(); }, []);

  const businessBooths = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const LX = -50; const RX = 50;
    const rotL = [0, Math.PI / 2, 0]; const rotR = [0, -Math.PI / 2, 0];
    const exhibitionPhotos = ['https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1531050171651-7484a93ef05e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1475721027187-4024733924f3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80'];
    
    nodes.push(<ThemedBooth key="acc" position={[LX, 0, 100]} rotation={rotL} title="BIZNESA AKCELERATORS" subtitle="Executive Strategy" color="#a855f7" link="/bizness30" requestsCount={150} category="tech" content={[exhibitionPhotos[0], exhibitionPhotos[1]]} />);
    nodes.push(<ThemedBooth key="b1" position={[LX, 0, 0]} rotation={rotL} title="APDARE UN REMONTS" subtitle="Industrial Finishing" color="#eab308" link="/apdare" jobsCount={2} requestsCount={5} category="building" content={[exhibitionPhotos[2]]} />);
    nodes.push(<ThemedBooth key="b2" position={[LX, 0, -100]} rotation={rotL} title="SILDĪŠANAS SISTĒMAS" subtitle="Climate Control" color="#ea580c" link="/apkure" requestsCount={12} category="service" content={[exhibitionPhotos[3]]} />);
    nodes.push(<ThemedBooth key="b3" position={[LX, 0, -200]} rotation={rotL} title="JUMTU BŪVNIECĪBA" subtitle="Structural Integrity" color="#f43f5e" link="/jumti" jobsCount={4} category="building" content={[exhibitionPhotos[4]]} />);
    nodes.push(<ThemedBooth key="b4" position={[LX, 0, -300]} rotation={rotL} title="LOGI UN DURVIS" subtitle="Acoustic Solutions" color="#0ea5e9" link="/logi" requestsCount={8} category="building" content={[exhibitionPhotos[5]]} />);
    nodes.push(<ThemedBooth key="b6" position={[LX, 0, -400]} rotation={rotL} title="INTERJERA DIZAINS" subtitle="Premium Visuals" color="#a855f7" link="/dizains" category="design" content={[exhibitionPhotos[6]]} />);
    nodes.push(<ThemedBooth key="b7" position={[LX, 0, -500]} rotation={rotL} title="UZFRIŠINĀŠANA 24H" subtitle="Rapid Maintenance" color="#f43f5e" link="/uzfrisinasana" requestsCount={20} category="service" content={[exhibitionPhotos[0]]} />);
    nodes.push(<ThemedBooth key="sos" position={[RX, 0, 100]} rotation={rotR} title="24/7 SOS AVĀRIJA" subtitle="Emergency Dispatch" color="#ef4444" link="/avarija" jobsCount={5} requestsCount={14} category="emergency" content={[exhibitionPhotos[1]]} />);
    nodes.push(<ThemedBooth key="p1" position={[RX, 0, 0]} rotation={rotR} title="KOKA MĀJU BŪVE" subtitle="Sustainable Frames" color="#22c55e" link="/kokamajas" jobsCount={3} category="building" content={[exhibitionPhotos[2]]} />);
    nodes.push(<ThemedBooth key="p2" position={[RX, 0, -100]} rotation={rotR} title="PAMATU IZBŪVE" subtitle="Ground Engineering" color="#94a3b8" link="/pamati" requestsCount={6} category="building" content={[exhibitionPhotos[3]]} />);
    nodes.push(<ThemedBooth key="p3" position={[RX, 0, -200]} rotation={rotR} title="SANTEHNIKAS IEKĀRTAS" subtitle="Fluid Dynamics" color="#06b6d4" link="/santehnika" jobsCount={2} category="service" content={[exhibitionPhotos[4]]} />);
    nodes.push(<ThemedBooth key="p4" position={[RX, 0, -300]} rotation={rotR} title="UZKOPŠANAS SERVISS" subtitle="Facility Hygiene" color="#14b8a6" link="/uzkopsana" jobsCount={8} category="service" content={[exhibitionPhotos[5]]} />);
    nodes.push(<ThemedBooth key="p5" position={[RX, 0, -400]} rotation={rotR} title="SAGĀDE UN LOĢISTIKA" subtitle="Supply Chain" color="#f59e0b" link="/sagade" jobsCount={2} category="industrial" content={[exhibitionPhotos[6]]} />);
    nodes.push(<ThemedBooth key="p6" position={[RX, 0, -500]} rotation={rotR} title="AUTO SERVISS" subtitle="Precision Diagnostics" color="#f97316" link="/autoserviss" category="service" content={[exhibitionPhotos[0]]} />);
    nodes.push(<ThemedBooth key="p7" position={[RX, 0, -600]} rotation={rotR} title="NEKUSTAMAIS ĪPAŠUMS" subtitle="Asset Management" color="#10b981" link="/majoklis" category="luxury" content={[exhibitionPhotos[1]]} />);
    nodes.push(<ThemedBooth key="p8" position={[RX, 0, -700]} rotation={rotR} title="DOKUMENTU HUBS" subtitle="Encrypted Filing" color="#8b5cf6" link="/dokumenti" category="tech" content={[exhibitionPhotos[2]]} />);
    dynamicBooths.forEach((booth, idx) => { const x = booth.side === 'left' ? LX : RX; const rot = booth.side === 'left' ? rotL : rotR; nodes.push(<ThemedBooth key={booth.id} position={[x, 0, -800 - (idx * 120)]} rotation={rot} title={booth.title} subtitle={booth.subtitle} color={booth.color} jobsCount={booth.jobs_count} requestsCount={booth.requests_count} category={booth.category || 'generic'} content={[exhibitionPhotos[idx % exhibitionPhotos.length]]} link={`/expo/stends/${booth.slug || booth.id}`} />); });
    return nodes;
  }, [dynamicBooths]);

  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', background: '#fff', touchAction: 'none' }}>
      <AudioToggle />
      <DataHUD isLocked={isLocked || mobileMode} />
      {!isLocked && !mobileMode && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#000' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px' }}>EXPO CORE</h1>
          <p style={{ color: '#888', fontSize: '1.4rem', marginBottom: '50px', letterSpacing: '4px', fontWeight: 'bold' }}>INDUSTRIAL METAVERSE SUMMIT 2026</p>
          <button onClick={() => { if (isTouchDevice) setMobileMode(true); else controlsRef.current?.lock(); }} style={{ padding: '30px 120px', fontSize: '1.5rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '900', letterSpacing: '2px' }}>INITIALIZE INTERFACE</button>
        </div>
      )}
      {mobileMode && <div style={{ position: 'absolute', bottom: '40px', left: '40px', zIndex: 50 }}><Joystick size={100} sticky={true} baseColor="rgba(0,0,0,0.05)" stickColor="rgba(0,0,0,0.8)" move={(e: any) => { joystickState.x = e.x || 0; joystickState.y = e.y || 0; }} stop={() => { joystickState.x = 0; joystickState.y = 0; }} /></div>}
      <Canvas shadows="soft" camera={{ fov: 50, far: 2000 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace, powerPreference: "high-performance" }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Bvh firstHitOnly>
            {!isTouchDevice && <PointerLockControls ref={controlsRef} onLock={() => setIsLocked(true)} onUnlock={() => setIsLocked(false)} />}
            {isTouchDevice && <MobileCameraControls />}
            <Player />
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <DataParticles count={1500} />
            <pointLight position={[0, 150, 0]} intensity={2} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} />
            <directionalLight position={[100, 150, 100]} intensity={1.5} color="#fff" castShadow shadow-mapSize={[2048, 2048]} />
            <group>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[600, 2500]} />
                <MeshReflectorMaterial blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={1.5} roughness={1} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#f8fafc" metalness={0.1} mirror={1} />
              </mesh>
            </group>
            <mesh position={[0, 50, 200]} receiveShadow><boxGeometry args={[600, 100, 10]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0.1} /></mesh>
            <mesh position={[0, 50, -1200]} receiveShadow><boxGeometry args={[600, 100, 10]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0.1} /></mesh>
            <mesh position={[-300, 50, -500]} receiveShadow><boxGeometry args={[10, 100, 1500]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0.1} /></mesh>
            <mesh position={[300, 50, -500]} receiveShadow><boxGeometry args={[10, 100, 1500]} /><meshPhysicalMaterial color="#fff" metalness={1} roughness={0.1} /></mesh>
            <WallBillboard position={[294.9, 40, 0]} rotation={[0, -Math.PI/2, 0]} color="#000" text="CORPORATE GOVERNANCE" slotId="hall_wall_right" />
            <WallBillboard position={[-294.9, 40, -200]} rotation={[0, Math.PI/2, 0]} color="#000" text="GLOBAL INFRASTRUCTURE" slotId="hall_wall_left" />
            <WallBillboard position={[0, 40, -1194.9]} rotation={[0, 0, 0]} color="#000" text="TERMINAL ENDPOINT" slotId="hall_end" />
            <InfoDesk />
            {businessBooths}
            <SidebarSeminarTheatre position={[-180, 0, -200]} rotation={[0, Math.PI/2, 0]} />
            <EffectComposer>
              <N8AO intensity={1.5} aoRadius={2} />
              <Bloom luminanceThreshold={1} intensity={0.5} mipmapBlur />
              <Noise opacity={0.02} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
            <Preload all />
          </Bvh>
        </Suspense>
      </Canvas>
    </div>
  );
}
