import { useGLTF } from '@react-three/drei';

export function useModelLoader(url: string, fallbackUrl: string = '/models/default_booth.glb') {
  try {
    const gltf = useGLTF(url || fallbackUrl);
    return gltf;
  } catch (error) {
    console.warn(`Failed to load model from ${url}, falling back to ${fallbackUrl}`, error);
    const fallbackGltf = useGLTF(fallbackUrl);
    return fallbackGltf;
  }
}

// Preload the fallback model so it's always ready
useGLTF.preload('/models/default_booth.glb');
