import * as THREE from 'three';

export interface TerrainEvalResult {
  height: number;
  color: THREE.Color;
}

export const random = (x: number, y: number) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
};

export const noise = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);
  const a = random(ix, iy);
  const b = random(ix + 1, iy);
  const c = random(ix, iy + 1);
  const d = random(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy * (1.0 - ux) + (d - b) * ux * uy;
};

export const fbm = (x: number, y: number, octaves = 5) => {
  let v = 0;
  let a = 0.5;
  let shift = 100.0;
  for (let i = 0; i < octaves; i++) {
    v += a * noise(x, y);
    x = x * 2.0 + shift;
    y = y * 2.0 + shift;
    a *= 0.5;
  }
  return v;
};

export const warpedFbm = (x: number, y: number, octaves = 4) => {
  const wx = fbm(x + 1.7, y + 9.2, 3);
  const wy = fbm(x + 8.3, y + 2.8, 3);
  return fbm(x + 3.0 * wx, y + 3.0 * wy, octaves);
};

export const hexVoronoi = (x: number, y: number) => {
  const hx = x * (2.0 / Math.sqrt(3));
  const hy = y;
  const ix = Math.floor(hx);
  const iy = Math.floor(hy);
  let minDist = 10.0;
  let cellId = 0;
  let cellCenterX = 0;
  let cellCenterY = 0;

  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const px = ix + i;
      const py = iy + j;
      const jx = px + random(px, py) * 0.12;
      const jy = py + random(px + 7.1, py + 3.4) * 0.12;
      const dx = hx - jx;
      const dy = hy - jy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) {
        minDist = d;
        cellId = random(px * 13, py * 37);
        cellCenterX = jx;
        cellCenterY = jy;
      }
    }
  }
  return { dist: minDist, cellId, cellCenterX, cellCenterY };
};

// Exact regular hexagonal lattice for columnar basalt
export const getHexBasaltColumn = (x: number, y: number, scale = 0.55) => {
  const s = scale;
  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / s;
  const r = ((2 / 3) * y) / s;
  
  const cx = q;
  const cz = r;
  const cy = -q - r;
  
  let rx = Math.round(cx);
  let ry = Math.round(cy);
  let rz = Math.round(cz);
  const dx = Math.abs(rx - cx);
  const dy = Math.abs(ry - cy);
  const dz = Math.abs(rz - cz);
  if (dx > dy && dx > dz) {
    rx = -ry - rz;
  } else if (dy > dz) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }
  
  const centerX = s * (Math.sqrt(3) * rx + (Math.sqrt(3) / 2) * rz);
  const centerY = s * (1.5 * rz);
  
  const relX = Math.abs(x - centerX);
  const relY = Math.abs(y - centerY);
  const distFromCenter = Math.max(relX * (Math.sqrt(3) / 2) + relY * 0.5, relY);
  const inradius = s * (Math.sqrt(3) / 2);
  const edgeDist = Math.max(0, inradius - distFromCenter);
  const relDist = distFromCenter / inradius;
  
  const cellId = (Math.abs(Math.sin(rx * 19.123 + rz * 43.789)) * 1000) % 1;
  return { cellId, centerX, centerY, edgeDist, relDist, rx, rz };
};

export const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const mixColor = (c1: string, c2: string, t: number) => {
  const color1 = new THREE.Color(c1);
  const color2 = new THREE.Color(c2);
  color1.lerp(color2, clamp(t, 0, 1));
  return color1;
};

/**
 * Normalizes terrain strings for robust matching, removing parenthetical terms
 * e.g., "해식애 (해안 절벽)" -> "해식애", "혼 (호른)" -> "혼"
 */
export const normalizeTerrainName = (name: string): string => {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
};

