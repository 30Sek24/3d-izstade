import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * 3D Modeļu (GLTF/GLB) optimizācijas un kompresijas skripts.
 * Izmanto @gltf-transform/cli, lai automātiski saspiestu modeļu ģeometriju (Draco)
 * un tekstūras (KTX2 / BasisU), kas ir KRITISKI ātram Expo 3D web ielādes laikam.
 * 
 * Lietošana terminālī:
 * node scripts/optimize-gltf.mjs <ievades_fails.glb> <izvades_fails.glb>
 */

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Lietošana: node optimize-gltf.mjs <input.glb> <output.glb>');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath = path.resolve(args[1]);

if (!fs.existsSync(inputPath)) {
  console.error(`Kļūda: Fails ${inputPath} neeksistē.`);
  process.exit(1);
}

console.log(`🚀 Sāku optimizēt: ${inputPath}`);

try {
  // Šeit mēs pielietojam 3 ļoti svarīgas transformācijas:
  // 1. dedup - noņem dublētos materiālus/meshus (mazina faila izmēru).
  // 2. draco - saspiež ģeometriju (verteksus) ļoti mazā izmērā.
  // 3. (Komentēts) ktx2 - saspiestu WebGPU tekstūru formāts. Prasa instalētu 'toktx' sistēmā. Mēs sākumā varam iztikt ar wep / draco.
  
  const command = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-compress webp`;
  
  console.log(`Izpildu komandu: ${command}`);
  
  execSync(command, { stdio: 'inherit' });
  
  const inputSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
  const outputSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  
  console.log(`✅ Optimizācija pabeigta!`);
  console.log(`📉 Sākotnējais izmērs: ${inputSize} MB`);
  console.log(`✨ Jaunais izmērs:     ${outputSize} MB`);
  
} catch (error) {
  console.error('Kļūda optimizācijas laikā:', error);
}