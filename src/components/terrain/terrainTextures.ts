import * as THREE from 'three';

const textureCache = new Map<string, THREE.CanvasTexture>();

export type TexturePatternKey =
  | 'auto'
  | 'volcanic'
  | 'glacial'
  | 'arid'
  | 'karst'
  | 'coastal'
  | 'fluvial'
  | 'rocky'
  | 'sandy'
  | 'crystalline'
  | 'smooth';

/**
 * Creates high-frequency procedural micro-bump textures tailored to each
 * geological terrain category and custom texture style to provide authentic
 * microscopic rock and sediment surface details in Three.js.
 */
export function getTerrainBumpTexture(
  textureKey: TexturePatternKey | string = 'auto',
  categoryFallback = 'fluvial'
): THREE.CanvasTexture {
  const actualKey = textureKey === 'auto' ? categoryFallback : textureKey;
  const cached = textureCache.get(actualKey);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const dummy = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
    dummy.needsUpdate = true;
    return dummy as unknown as THREE.CanvasTexture;
  }

  const imgData = ctx.createImageData(512, 512);
  const data = imgData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      let val = 128;

      if (actualKey === 'volcanic') {
        // Vesicular porous basalt / scoria texture with micro-cavities & cooling micro-cracks
        const n1 = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 0.5 + 0.5;
        const n2 = Math.sin(x * 1.8 + y * 1.2) * 0.5 + 0.5;
        const pore = ((x * 37 + y * 59) % 23) < 4 ? 0.2 : 0.8;
        const crack = Math.abs(Math.sin(x * 0.15 + Math.sin(y * 0.2) * 2.0)) > 0.85 ? 0.3 : 1.0;
        val = Math.floor((n1 * 0.4 + n2 * 0.3 + pore * 0.3) * crack * 255);
      } else if (actualKey === 'arid' || actualKey === 'sandy') {
        // Wind-blown sand ripples and fine quartz grit
        const ripple = Math.sin(x * 0.35 - y * 0.12) * 0.5 + 0.5;
        const fineGrit = ((x * 17 + y * 31) % 13) / 13.0;
        const n1 = Math.sin(x * 0.8) * Math.sin(y * 0.8) * 0.5 + 0.5;
        val = Math.floor((ripple * 0.55 + n1 * 0.25 + fineGrit * 0.2) * 255);
      } else if (actualKey === 'glacial') {
        // Glacial striations (parallel scratch grooves) and crystalline frost
        const striation = Math.sin(y * 0.85 + Math.sin(x * 0.05) * 1.5) * 0.5 + 0.5;
        const microScratch = Math.sin(y * 2.4) * 0.5 + 0.5;
        const frost = ((x * 41 + y * 67) % 17) / 17.0;
        val = Math.floor((striation * 0.5 + microScratch * 0.3 + frost * 0.2) * 255);
      } else if (actualKey === 'karst') {
        // Pitted limestone with solution runnels & dissolution pores
        const lapies = Math.abs(Math.sin(x * 0.4 + y * 0.15)) * 0.5 + 0.5;
        const pit = ((x * 29 + y * 43) % 19) < 5 ? 0.25 : 0.85;
        const n2 = Math.sin(x * 1.2 + y * 1.2) * 0.5 + 0.5;
        val = Math.floor((lapies * 0.45 + pit * 0.35 + n2 * 0.2) * 255);
      } else if (actualKey === 'coastal') {
        // Intertidal sand ripples and wet mud glisten
        const tidalRipple = Math.sin(x * 0.55 + Math.cos(y * 0.25) * 1.2) * 0.5 + 0.5;
        const waterSheen = Math.sin(x * 0.1 + y * 0.1) * 0.5 + 0.5;
        const grit = ((x * 19 + y * 37) % 11) / 11.0;
        val = Math.floor((tidalRipple * 0.55 + waterSheen * 0.25 + grit * 0.2) * 255);
      } else if (actualKey === 'rocky') {
        // Sharp fractured bedrock joints and jagged scree facets
        const f1 = Math.abs(Math.sin(x * 0.6 + y * 0.2));
        const f2 = Math.abs(Math.cos(x * 0.3 - y * 0.7));
        const joint = f1 > 0.82 || f2 > 0.85 ? 0.15 : 0.95;
        const roughness = ((x * 29 + y * 53) % 17) / 17.0;
        val = Math.floor(((f1 * 0.45 + f2 * 0.45) * joint + roughness * 0.1) * 255);
      } else if (actualKey === 'crystalline') {
        // Faceted crystal polygon planes & bright sparkling specular micro-facets
        const c1 = Math.sin(x * 1.4 + y * 0.4) * Math.cos(y * 1.2 - x * 0.4);
        const facet = Math.abs(c1);
        const glint = ((x * 47 + y * 71) % 31) > 28 ? 1.0 : 0.4;
        val = Math.floor((facet * 0.7 + glint * 0.3) * 255);
      } else if (actualKey === 'smooth') {
        // Subtle silky fluid polish with gentle low-frequency undulation
        const s1 = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.5 + 0.5;
        val = Math.floor((s1 * 0.6 + 0.4) * 255);
      } else {
        // Fluvial / default: alluvial silt, stratified river pebbles and sand
        const n1 = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.5 + 0.5;
        const n2 = Math.sin(x * 0.9 + y * 0.5) * 0.5 + 0.5;
        const pebble = ((x * 23 + y * 47) % 19) / 19.0;
        val = Math.floor((n1 * 0.45 + n2 * 0.35 + pebble * 0.2) * 255);
      }

      val = Math.max(0, Math.min(255, val));
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeat = actualKey === 'arid' || actualKey === 'sandy' ? 16 : actualKey === 'rocky' ? 14 : 12;
  texture.repeat.set(repeat, repeat);
  texture.needsUpdate = true;

  textureCache.set(actualKey, texture);
  return texture;
}
