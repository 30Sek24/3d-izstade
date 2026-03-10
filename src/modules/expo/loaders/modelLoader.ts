import { useGLTF } from '@react-three/drei';

export function useModelLoader(url: string | null | undefined) {
  // If no URL is provided, return null to signal the component to use primitive fallbacks
  if (!url) return { scene: null };
  try {
    const gltf = useGLTF(url);
    return gltf;
  } catch (error) {
    console.warn(`Failed to load model from ${url}`, error);
    return { scene: null };
  }
}
