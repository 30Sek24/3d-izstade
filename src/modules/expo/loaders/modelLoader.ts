import { useGLTF } from '@react-three/drei';

export function useModelLoader(url: string | null | undefined) {
  // Always call the hook unconditionally to satisfy React Rules of Hooks
  const safeUrl = url || '/models/default_booth.glb';
  const gltf = useGLTF(safeUrl);
  
  // If no URL was provided, return null to signal the component to use primitive fallbacks
  if (!url) return { scene: null };
  
  return gltf;
}
