import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Html,
  MeshReflectorMaterial
} from '@react-three/drei';
import { EffectComposer, Bloom, SSAO, Noise } from '@react-three/postprocessing';
import { useNavigate, useParams } from 'react-router-dom';

// Placeholder for a detailed furniture piece (Sofa)
function ModernSofa(props: any) {
  return (
    <group {...props}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.1, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh castShadow receiveShadow position={[1.1, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Pillows */}
      <mesh castShadow position={[-0.5, 0.9, -0.2]} rotation={[0.2, 0, 0.2]}>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

// Placeholder for a kitchen island
function ModernKitchen(props: any) {
  return (
    <group {...props}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 1.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[3.2, 0.1, 1.4]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
}

function RoomEnvironment() {
  return (
    <group>
      {/* Walls */}
      <mesh position={[0, 2.5, -4]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1e293b"
          metalness={0.5}
        />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} castShadow intensity={1.5} shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-2, 3, -2]} intensity={2} color="#fef08a" castShadow />
      
      {/* Architectural Window Light */}
      <spotLight position={[4, 4, 0]} angle={0.5} penumbra={0.5} intensity={4} color="#e0f2fe" castShadow />
    </group>
  );
}

export default function FurnitureShowroom() {
  const { id } = useParams();
  const nav = useNavigate();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Determine what type of room to show based on the ID (e.g., '10-1' for kitchen, '10-2' for living room)
  const isKitchen = id?.includes('10-1');

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        <button onClick={() => nav('/expo-3d')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(10px)', fontWeight: 'bold' }}>
          ← BACK TO CITY
        </button>
      </div>

      {activeItem && (
        <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '300px', background: 'rgba(15, 23, 42, 0.9)', padding: '20px', borderRadius: '16px', border: '1px solid #334155', color: '#fff', zIndex: 10, backdropFilter: 'blur(10px)' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{activeItem}</h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '20px' }}>Premium quality materials with modern design. Available in multiple configurations.</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>€1,250</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>In Stock</span>
          </div>
          <button style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>ADD TO PROJECT</button>
          <button style={{ width: '100%', padding: '12px', background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>AR VIEW</button>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: '#94a3b8', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '20px', zIndex: 10, backdropFilter: 'blur(5px)' }}>
        DRAG TO ROTATE • SCROLL TO ZOOM • CLICK ITEMS
      </div>

      <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <RoomEnvironment />

          {isKitchen ? (
            <group onClick={() => setActiveItem('Nordic Kitchen Island')} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
              <ModernKitchen position={[0, 0, -1]} />
              <Html position={[0, 2, -1]} center>
                <div style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', pointerEvents: 'none', border: '1px solid #3b82f6' }}>Kitchen Island</div>
              </Html>
            </group>
          ) : (
            <group onClick={() => setActiveItem('Minimalist Sofa')} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
              <ModernSofa position={[0, 0, -1]} />
              <Html position={[0, 1.5, -1]} center>
                <div style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', pointerEvents: 'none', border: '1px solid #3b82f6' }}>Modular Sofa</div>
              </Html>
            </group>
          )}

          <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000" />
          
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the floor
            minDistance={2} 
            maxDistance={8} 
          />

          <EffectComposer>
            <Bloom luminanceThreshold={1} intensity={0.5} />
            <SSAO radius={0.2} intensity={20} />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
