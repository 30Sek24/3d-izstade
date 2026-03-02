/**
 * Šis Node.js skripts ģenerē nelielu, pavisam īstu .glb (GL Transmission Format)
 * 3D modeli, ko var ielādēt mūsu Expo hallē. Mēs izmantojam 'three' bibliotēkas 
 * GLTFExporter (servera pusē).
 * 
 * Tas izveidos modernu, rotējošu "Abstrakto Skulptūru", kas pierādīs,
 * ka mūsu 3D halle spēj ielādēt failus no ārpuses.
 */
import * as THREE from 'three';
import fs from 'fs';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// 1. Izveidojam 3D ainu un objektus (tāpat kā to darītu Blenderī, tikai ar kodu)
const scene = new THREE.Scene();

// Izveidojam "Dzelteno Dimantu"
const geometry = new THREE.OctahedronGeometry(1.5, 0); // rādiuss, detaļas
const material = new THREE.MeshStandardMaterial({ 
  color: 0xeab308, 
  roughness: 0.2, 
  metalness: 0.8 
});
const diamond = new THREE.Mesh(geometry, material);
diamond.name = "Abstract_Diamond";
scene.add(diamond);

// Pievienojam iekšējo kubu (mazāku, tumšāku), lai izskatās sarežģītāk
const innerGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const innerMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 });
const innerBox = new THREE.Mesh(innerGeo, innerMat);
innerBox.rotation.set(Math.PI/4, Math.PI/4, 0); // Nedaudz sagriežam
diamond.add(innerBox);

console.log("🛠️  Ģenerēju GLTF failu...");

// 2. Eksportējam ainu uz GLB (Binarā versija)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  function (gltfArrayBuffer) {
    const filePath = './public/models/statue.glb';
    fs.writeFileSync(filePath, Buffer.from(gltfArrayBuffer));
    console.log(`✅ Veiksmīgi saglabāts 3D fails: ${filePath}`);
    console.log(`Pārbaudi to pārlūkā pievienojot <primitive object={scene} />`);
  },
  function (error) {
    console.error('An error happened during export:', error);
  },
  { binary: true } // Saglabājam kā .glb nevis .gltf (ietaupa vietu, iecepj tekstūras)
);