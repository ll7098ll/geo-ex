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
  const TWO_PI = Math.PI * 2;

  // 100% periodic pixel hash (wraps cleanly modulo 512)
  const periodicHash = (px: number, py: number, seed: number) => {
    const a = px & 511;
    const b = py & 511;
    const h = Math.sin(a * 12.9898 + b * 78.233 + seed) * 43758.5453123;
    return h - Math.floor(h);
  };

  // Smooth periodic cellular pore/pit evaluator (cellSize must divide 512)
  const periodicPore = (px: number, py: number, cellSize: number, seed: number) => {
    const cells = 512 / cellSize;
    const gx = Math.floor(px / cellSize);
    const gy = Math.floor(py / cellSize);
    const fx = (px - gx * cellSize) / cellSize;
    const fy = (py - gy * cellSize) / cellSize;
    const cx = gx & (cells - 1);
    const cy = gy & (cells - 1);
    const rx = 0.25 + periodicHash(cx, cy, seed) * 0.5;
    const ry = 0.25 + periodicHash(cx + 17, cy + 31, seed + 5.1) * 0.5;
    return Math.hypot(fx - rx, fy - ry);
  };

  for (let y = 0; y < 512; y++) {
    const v = (y / 512) * TWO_PI;
    for (let x = 0; x < 512; x++) {
      const u = (x / 512) * TWO_PI;
      const idx = (y * 512 + x) * 4;
      let val = 128;

      if (actualKey === 'volcanic') {
        // Vesicular porous basalt / scoria texture with periodic micro-cavities & cooling micro-cracks
        const n1 = Math.sin(u * 32) * Math.cos(v * 32) * 0.5 + 0.5;
        const n2 = Math.sin(u * 96 + v * 64) * 0.5 + 0.5;
        const pore = periodicPore(x, y, 8, 1.3) < 0.26 ? 0.22 : 0.82;
        const crack = Math.abs(Math.sin(u * 12 + Math.sin(v * 16) * 2.0)) > 0.86 ? 0.32 : 1.0;
        val = Math.floor((n1 * 0.4 + n2 * 0.3 + pore * 0.3) * crack * 255);
      } else if (actualKey === 'arid' || actualKey === 'sandy') {
        // Wind-blown sand ripples and fine quartz grit
        const ripple = Math.sin(u * 28 - v * 10 + Math.sin(v * 4) * 0.6) * 0.5 + 0.5;
        const fineGrit = periodicHash(x, y, 7.2);
        const n1 = Math.sin(u * 64) * Math.sin(v * 64) * 0.5 + 0.5;
        val = Math.floor((ripple * 0.55 + n1 * 0.25 + fineGrit * 0.2) * 255);
      } else if (actualKey === 'glacial') {
        // Glacial striations (parallel scratch grooves) and crystalline frost
        const striation = Math.sin(v * 68 + Math.sin(u * 4) * 1.5) * 0.5 + 0.5;
        const microScratch = Math.sin(v * 192) * 0.5 + 0.5;
        const frost = periodicHash(x, y, 13.7);
        val = Math.floor((striation * 0.5 + microScratch * 0.3 + frost * 0.2) * 255);
      } else if (actualKey === 'karst') {
        // Pitted limestone with solution runnels & dissolution pores
        const lapies = Math.abs(Math.sin(u * 32 + v * 12 + Math.sin(v * 8) * 0.5)) * 0.5 + 0.5;
        const pit = periodicPore(x, y, 16, 19.4) < 0.28 ? 0.28 : 0.85;
        const n2 = Math.sin(u * 96 + v * 96) * 0.5 + 0.5;
        val = Math.floor((lapies * 0.45 + pit * 0.35 + n2 * 0.2) * 255);
      } else if (actualKey === 'coastal') {
        // Intertidal sand ripples and wet mud glisten
        const tidalRipple = Math.sin(u * 44 + Math.cos(v * 20) * 1.2) * 0.5 + 0.5;
        const waterSheen = Math.sin(u * 8 + v * 8) * 0.5 + 0.5;
        const grit = periodicHash(x, y, 23.1);
        val = Math.floor((tidalRipple * 0.55 + waterSheen * 0.25 + grit * 0.2) * 255);
      } else if (actualKey === 'rocky') {
        // Sharp fractured bedrock joints and jagged scree facets
        const f1 = Math.abs(Math.sin(u * 48 + v * 16));
        const f2 = Math.abs(Math.cos(u * 24 - v * 56));
        const joint = f1 > 0.82 || f2 > 0.85 ? 0.18 : 0.95;
        const roughness = periodicHash(x, y, 31.9);
        val = Math.floor(((f1 * 0.45 + f2 * 0.45) * joint + roughness * 0.1) * 255);
      } else if (actualKey === 'crystalline') {
        // Faceted crystal polygon planes & bright sparkling specular micro-facets
        const c1 = Math.sin(u * 112 + v * 32) * Math.cos(v * 96 - u * 32);
        const facet = Math.abs(c1);
        const glint = periodicHash(x, y, 41.3) > 0.92 ? 1.0 : 0.42;
        val = Math.floor((facet * 0.7 + glint * 0.3) * 255);
      } else if (actualKey === 'smooth') {
        // Subtle silky fluid polish with gentle low-frequency undulation
        const s1 = Math.sin(u * 12) * Math.cos(v * 12) * 0.5 + 0.5;
        val = Math.floor((s1 * 0.6 + 0.4) * 255);
      } else {
        // Fluvial / default: alluvial silt, stratified river pebbles and sand
        const n1 = Math.sin(u * 24) * Math.cos(v * 24) * 0.5 + 0.5;
        const n2 = Math.sin(u * 72 + v * 40) * 0.5 + 0.5;
        const pebble = periodicHash(x, y, 53.7);
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
