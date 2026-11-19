import * as THREE from 'three';
import { generateTerrainElevationField } from './contour/terrainDEMGenerator';
import { resolveTerrainKey, getBaseWaterElevation } from '../../constants/terrainRegistry';
import {
  fbm,
  smoothstep,
  clamp,
  mixColor,
} from './terrainMath';
import { getCalderaShoreRadius } from './generators/volcanic';
import { getWavePlatformCliffX, TIDE_POOL_SPECS } from './generators/coastal';
import { getWaterfallLipY } from './generators/fluvial';

export * from './terrainMath';
export * from './terrainEvaluator';
export * from './contour/terrainDEMGenerator';
export * from './contour/terrainContourMetadata';
export {
  resolveTerrainKey,
  getBaseWaterElevation,
} from '../../constants/terrainRegistry';

/**
 * Returns the exact local water, lava, or brine surface elevation at (x, y) for any terrain archetype,
 * matching BOTH global base-water bodies and perched/local basins (caldera lake, cirque tarn, waterfall
 * upper/lower reaches, hanging valley stream, proglacial lake, oasis, playa brine, crater lava lakes, etc.).
 * Used to drive the per-vertex `aSubmerged` attribute so 3D contours are suppressed underwater everywhere.
 */
export function getLocalWaterElevation(
  normSub: string,
  x: number,
  y: number,
  reliefScale = 1.0
): number | null {
  switch (normSub) {
    case '칼데라': {
      const r = Math.hypot(x, y);
      const ang = Math.atan2(y, x);
      return r <= getCalderaShoreRadius(ang) + 0.35 ? 1.62 * reliefScale : null;
    }
    case '화산':
      return Math.hypot(x, y) <= 0.72 ? 3.46 * reliefScale : null;
    case '순상화산':
      return Math.hypot(x + 0.22, y + 0.18) <= 0.78 ? 2.04 * reliefScale : null;
    case '기생화산':
      return Math.hypot(x + 0.9, y - 0.7) < 1.25 ? 2.26 * reliefScale : null;
    case '단층 산맥':
      return x < -3.2 ? 0.42 * reliefScale : null;
    case '주상절리': {
      const coastCurve = Math.sin(y * 0.32) * 1.15 + Math.cos(y * 0.65) * 0.45;
      return x < coastCurve + 0.5 ? 0.52 * reliefScale : null;
    }
    case '종상화산':
      return y < -5.2 + Math.sin(x * 0.35) * 0.65 ? (getBaseWaterElevation('종상화산', reliefScale) ?? 0.42 * reliefScale) : null;
    case '수성화산':
      return Math.hypot(x - 0.8, y - 0.5) < 3.1 ? null : getBaseWaterElevation('수성화산', reliefScale);
    case '해안 사구': {
      if (x < -5.2) return 0.42 * reliefScale;
      const slackDist = Math.hypot((x + 1.05) / 1.05, (y - 1.15) / 2.55);
      return slackDist < 1.0 ? 0.58 * reliefScale : null;
    }
    case '파식대': {
      const cliffX = getWavePlatformCliffX(y);
      if (x > cliffX - 0.2) return null;
      for (const p of TIDE_POOL_SPECS) {
        const pd = Math.hypot((x - p.px) / p.rx, (y - p.py) / p.ry);
        if (pd < 1.02) {
          const benchBase = 0.46 + smoothstep(-3.85, cliffX - 0.45, x) * 0.34;
          return (benchBase - 0.04) * reliefScale;
        }
      }
      return 0.44 * reliefScale;
    }
    case '선상지':
      return y < -6.8 ? 0.32 * reliefScale : null;
    case '폭포': {
      const lipY = getWaterfallLipY(x);
      if (y >= lipY - 0.06) return 3.80 * reliefScale;
      if (y <= lipY - 0.30) return 0.56 * reliefScale;
      return null;
    }
    case '석회동굴': {
      if (Math.abs(x) > 3.6 || y > 2.2) return null;
      const caveStreamX = -1.15 + Math.sin(y * 0.5) * 0.45 + smoothstep(-3.8, -9.5, y) * 0.55;
      if (Math.abs(x - caveStreamX) < 0.96 && y < 2.05) {
        return 0.45 * reliefScale;
      }
      const arc = y + 0.14 * x * x;
      if (x > -0.35 && x < 2.15) {
        if (arc > -2.95 && arc < -1.9) return 0.62 * reliefScale;
        if (arc > -1.45 && arc < -0.4) return 0.78 * reliefScale;
        if (arc > 0.05 && arc < 1.1) return 0.94 * reliefScale;
      }
      return null;
    }
    case '혼':
      return Math.hypot(x / 1.6, (y - 5.2) / 1.4) <= 1.05 ? 0.64 * reliefScale : null;
    case 'U자곡': {
      const valleyX = Math.sin(y * 0.25) * 1.15;
      if (Math.abs(x - valleyX) < 2.9) return 0.44 * reliefScale;
      const hvAxisY = 1.45 + Math.sin((x + 4.0) * 0.35) * 0.40;
      if (x <= valleyX - 3.35 && Math.abs(y - hvAxisY) < 0.65) {
        return (2.74 + Math.max(0, -x - 3.6) * 0.06) * reliefScale;
      }
      return null;
    }
    case '권곡':
      return Math.hypot(x / 2.35, (y - 0.70) / 2.05) <= 1.05 ? 1.32 * reliefScale : null;
    case '모레인': {
      const termArcY = -2.85 + 0.21 * x * x;
      if (Math.abs(x) < 3.05 && y > termArcY + 0.1 && y < 2.35) {
        return 1.06 * reliefScale;
      }
      if (y <= termArcY + 0.1 && Math.abs(x) < 3.8) {
        const outwashSlope = smoothstep(-10.0, -2.5, y) * 0.30;
        return (0.48 + outwashSlope) * reliefScale;
      }
      return null;
    }
    case '오아시스': {
      const lakeArcY = -0.55 + 0.22 * x * x;
      return Math.hypot(x / 2.25, (y - lakeArcY) / 1.25) <= 1.15 ? 0.64 * reliefScale : null;
    }
    case '플라야': {
      const rx = 7.4 + Math.sin(y * 0.4) * 0.45;
      const ry = y > 0 ? 6.6 : 9.2;
      return Math.hypot(x / rx, y / ry) <= 0.76 ? 0.303 * reliefScale : null;
    }
    default:
      return getBaseWaterElevation(normSub, reliefScale);
  }
}

// ==========================================
// Complete Geological Block Diorama Generator
// Builds the 240x240 adaptive-triangulated terrain surface
// PLUS 4 multi-layered vertical geological strata cross-sections!
// ==========================================
const GEOMETRY_CACHE = new Map<string, THREE.BufferGeometry>();
const MAX_GEOMETRY_CACHE_SIZE = 24;

export type TerrainMaterialPreset =
  | 'natural'
  | 'hypsometric'
  | 'thermal'
  | 'bedrock'
  | 'obsidian';

export function generateTerrainDioramaGeometry(
  category: string,
  subTerrain: string,
  reliefScale = 1.0,
  showStrata = true,
  evolutionStage = 4,
  materialPreset: TerrainMaterialPreset = 'natural',
  placeContext?: string
): THREE.BufferGeometry {
  const normSub = resolveTerrainKey(subTerrain, placeContext);
  const cacheKey = `${category}-${normSub}-${reliefScale.toFixed(2)}-strata:${showStrata}-stage:${evolutionStage}-mat:${materialPreset}`;
  const cachedGeo = GEOMETRY_CACHE.get(cacheKey);
  if (cachedGeo) {
    GEOMETRY_CACHE.delete(cacheKey);
    GEOMETRY_CACHE.set(cacheKey, cachedGeo);
    return cachedGeo;
  }

  const size = 20;
  const segments = 240; // 240x240 high-resolution grid (0.083m cell spacing)
  const skirtLayers = 28; // Vertical strata subdivision so horizontal/cross/faulted beds render crisply!
  const halfSize = size / 2;
  const step = size / segments;
  const numGridVerts = (segments + 1) * (segments + 1);

  const stageMorph =
    evolutionStage === 1 ? 0.45 : evolutionStage === 2 ? 0.7 : evolutionStage === 3 ? 0.88 : 1.0;
  const effectiveRelief = reliefScale * stageMorph;

  // Single Source of Truth: Get normalized DEM Elevation Field at matching 240x240 resolution
  const dem = generateTerrainElevationField(
    category,
    normSub,
    effectiveRelief,
    4,
    segments,
    size
  );

  const gridHeights: Float32Array = dem.elevations;
  const gridColors: Float32Array = dem.colors;

  // Base elevation of the geological block pedestal
  const baseZ = -1.35;

  // Vertex budget:
  // Top surface: (segments + 1)^2
  // 4 Skirts: 4 * (segments + 1) * (skirtLayers + 1)
  // Bottom plate: 4
  const vertsPerSkirt = (segments + 1) * (skirtLayers + 1);
  const totalVerts = numGridVerts + 4 * vertsPerSkirt + 4;

  const positions = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const submerged = new Float32Array(totalVerts);
  const indices: number[] = [];

  let vertIdx = 0;
  const tmpColor = new THREE.Color();

  const evalPresetColor = (r: number, g: number, b: number, heightVal: number): THREE.Color => {
    if (materialPreset === 'hypsometric') {
      const normH = clamp(heightVal / (reliefScale || 1.0) / 5.2, 0, 1);
      if (normH < 0.12) return mixColor('#0d47a1', '#1976d2', normH / 0.12);
      if (normH < 0.35) return mixColor('#1b5e20', '#4caf50', (normH - 0.12) / 0.23);
      if (normH < 0.58) return mixColor('#fbc02d', '#f57c00', (normH - 0.35) / 0.23);
      if (normH < 0.82) return mixColor('#d84315', '#4e342e', (normH - 0.58) / 0.24);
      return mixColor('#78909c', '#ffffff', (normH - 0.82) / 0.18);
    } else if (materialPreset === 'thermal') {
      const normH = clamp(heightVal / (reliefScale || 1.0) / 5.0, 0, 1);
      if (normH < 0.2) return mixColor('#090a2a', '#00b0ff', normH / 0.2);
      if (normH < 0.45) return mixColor('#00b0ff', '#00e676', (normH - 0.2) / 0.25);
      if (normH < 0.72) return mixColor('#00e676', '#ffea00', (normH - 0.45) / 0.27);
      if (normH < 0.9) return mixColor('#ffea00', '#ff3d00', (normH - 0.72) / 0.18);
      return mixColor('#ff3d00', '#ffffff', (normH - 0.9) / 0.1);
    } else if (materialPreset === 'bedrock') {
      return mixColor('#8c8072', '#ded6c8', clamp(heightVal / (5.0 * (reliefScale || 1.0)), 0, 1));
    } else if (materialPreset === 'obsidian') {
      return mixColor('#101214', '#202429', clamp(heightVal / (5.0 * (reliefScale || 1.0)), 0, 1));
    }
    return tmpColor.setRGB(r, g, b);
  };

  // 1. TOP TERRAIN SURFACE
  for (let j = 0; j <= segments; j++) {
    const y = -halfSize + j * step;
    const rowOffset = j * (segments + 1);
    for (let i = 0; i <= segments; i++) {
      const x = -halfSize + i * step;
      const cellIdx = rowOffset + i;
      const h = gridHeights[cellIdx];
      const col = evalPresetColor(
        gridColors[cellIdx * 3],
        gridColors[cellIdx * 3 + 1],
        gridColors[cellIdx * 3 + 2],
        h
      );

      positions[vertIdx * 3] = x;
      positions[vertIdx * 3 + 1] = y;
      positions[vertIdx * 3 + 2] = h;

      colors[vertIdx * 3] = col.r;
      colors[vertIdx * 3 + 1] = col.g;
      colors[vertIdx * 3 + 2] = col.b;

      uvs[vertIdx * 2] = (x + halfSize) / size;
      uvs[vertIdx * 2 + 1] = (y + halfSize) / size;

      const localW = getLocalWaterElevation(normSub, x, y, effectiveRelief);
      submerged[vertIdx] = localW !== null ? smoothstep(-0.015, 0.025, localW - h) : 0.0;

      vertIdx++;
    }
  }

  // Top surface triangle indices:
  // Counter-clockwise winding (a, b, c) & (b, d, c) or (a, b, d) & (a, d, c) so normals point +Z (UPWARD)!
  // Adaptive diagonal splitting chooses the smoother ridge/cliff crease diagonal to eliminate jagged sawtooth edges.
  for (let j = 0; j < segments; j++) {
    const rowA = j * (segments + 1);
    const rowC = (j + 1) * (segments + 1);
    for (let i = 0; i < segments; i++) {
      const a = rowA + i;
      const b = a + 1;
      const c = rowC + i;
      const d = c + 1;

      const diagAD = Math.abs(gridHeights[a] - gridHeights[d]);
      const diagBC = Math.abs(gridHeights[b] - gridHeights[c]);

      if (diagAD < diagBC) {
        indices.push(a, b, d);
        indices.push(a, d, c);
      } else {
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
  }

  // 2. GEOLOGICAL STRATA CROSS-SECTION COLORING
  const invScale = 1.0 / Math.max(0.5, effectiveRelief);
  const getStrataColor = (x: number, y: number, z: number, surfaceH: number): THREE.Color => {
    if (!showStrata) {
      return new THREE.Color('#1d2026');
    }
    if (materialPreset !== 'natural') {
      return evalPresetColor(0.2, 0.22, 0.25, z).clone();
    }

    // Normalize positive elevation by reliefScale so strata bands scale physically with relief exaggeration
    const normZ = z >= 0 ? z * invScale : z;
    const depthBelowSurface = (surfaceH - z) * invScale;

    // Top regolith / soil horizon right beneath vegetated surfaces (0 ~ 0.16m)
    if (
      depthBelowSurface < 0.14 &&
      normZ > 0.55 &&
      category !== 'arid' &&
      category !== 'glacial'
    ) {
      return mixColor('#3b2f23', '#4f3f2f', clamp(depthBelowSurface / 0.14, 0, 1));
    }

    // Special structural cross-section for Fault-Block Mountain (단층 산맥: ~64° westward-dipping normal fault!)
    if (normSub === '단층 산맥') {
      const surfaceFaultX = Math.sin(y * 0.16) * 0.55 - 0.85;
      // Normal fault plane dips westward (-X) as depth increases (normZ decreases),
      // so the down-dropped western hanging wall (x < faultPlaneX) sits above the dipping fault plane
      // while the uplifted eastern footwall (x > faultPlaneX) rises beneath it!
      const faultPlaneX = surfaceFaultX + (normZ - 1.2) * 0.48;
      const distFault = Math.abs(x - faultPlaneX);

      if (distFault < 0.24) {
        // Dark crushed fault breccia & clay gouge zone
        const gouge = fbm(x * 6.0, normZ * 6.0) * 0.6 + 0.2;
        return mixColor('#121215', '#3b2820', gouge);
      }
      // Sharp vertical stratigraphic throw (동측 하반/Footwall +0.95m 융기 vs 서측 상반/Hanging wall -0.85m 침강)
      const displacedZ = x > faultPlaneX ? normZ - 0.95 + (x - faultPlaneX) * 0.12 : normZ + 0.85;
      const markerBed = smoothstep(0.75, 0.95, Math.sin(displacedZ * 5.2));
      const baseBed = Math.sin(displacedZ * 2.6 + fbm(x * 0.3, y * 0.3) * 0.8) * 0.5 + 0.5;
      const rockCol = mixColor('#3d3834', '#6e6459', baseBed);
      if (markerBed > 0.1) {
        rockCol.lerp(new THREE.Color('#a68763'), markerBed * 0.75);
      }
      return rockCol;
    }

    // Volcanic cross-section: alternating basaltic lava flows, reddish scoria/ash tuff, & basal magma feeder sill/dike
    if (category === 'volcanic') {
      const radialWallDist = Math.min(Math.abs(x), Math.abs(y));
      // Deep glowing magma reservoir sill & feeder dike visible at base of volcanic block walls
      if (
        (normSub === '화산' || normSub === '순상화산' || normSub === '칼데라' || normSub === '기생화산') &&
        z < -0.45
      ) {
        const sillTop = -0.55 - Math.pow(radialWallDist / 5.2, 2.0) * 0.65 + Math.sin(x * 0.9 + y * 0.9) * 0.08;
        if (z < sillTop) {
          const heat = clamp((sillTop - z) / 0.55, 0.0, 1.0);
          return mixColor('#4a150b', '#d9480f', heat * 0.85);
        }
      }

      if (normSub === '용암대지' && normZ < 1.15) {
        // 철원 한탄강 용암대지 특유의 하부 중생대 화강암 기반암 vs 상부 신생대 현무암 부정합 경계!
        const granTex = fbm(x * 3.5, normZ * 3.5);
        return mixColor('#6e655b', '#968b7e', granTex);
      }

      // Gently outward-dipping volcanic lava & pyroclastic strata
      const flankDip = (Math.abs(x) + Math.abs(y)) * 0.06;
      const vZ = normZ + flankDip;
      const flowUnit = Math.sin(vZ * 5.6 + fbm(x * 0.4, y * 0.4) * 1.1) * 0.5 + 0.5;
      const scoriaMarker = smoothstep(0.78, 0.96, Math.sin(vZ * 2.8 + 0.8));
      const basaltCol = mixColor('#1b1c20', '#333136', flowUnit);
      if (scoriaMarker > 0.05) {
        basaltCol.lerp(new THREE.Color('#6b2e21'), scoriaMarker * 0.78);
      }
      return basaltCol;
    }

    // Arid cross-section: Eolian cross-bedding (24° dipping foresets truncated by horizontal bounding surfaces)
    if (category === 'arid') {
      const setIndex = Math.floor((normZ + 2.0) * 1.35);
      const dipDir = setIndex % 2 === 0 ? 0.58 : -0.42;
      const foreset = Math.sin((normZ * 9.5 + (x + y * 0.5) * dipDir * 3.2)) * 0.5 + 0.5;
      const boundingSurface = smoothstep(0.92, 0.99, Math.abs(Math.sin((normZ + 2.0) * 1.35 * Math.PI)));
      const sandstone = mixColor('#8c4327', '#cc7a4b', foreset * 0.72 + fbm(x * 0.5, normZ) * 0.28);
      if (boundingSurface > 0.1) {
        sandstone.lerp(new THREE.Color('#e3ac78'), boundingSurface * 0.65);
      }
      return sandstone;
    }

    // Karst cross-section: Thick bedded gray carbonate strata + Terra Rossa solution joints + phreatic conduits
    if (category === 'karst') {
      const bed = Math.sin(normZ * 4.8 + fbm(x * 0.25, y * 0.25) * 0.6) * 0.5 + 0.5;
      const stylolite = smoothstep(0.90, 0.98, Math.abs(Math.sin(normZ * 4.8)));
      const jointVal = Math.abs(Math.sin(x * 1.35 + y * 1.15 + fbm(x * 0.5, normZ * 0.8) * 1.2));
      const isSolutionFissure = jointVal < 0.08 && normZ > -0.4;

      // Subterranean phreatic cave conduit oval cross-sections
      const cond1 = Math.hypot((x + 2.5) / 0.85, (normZ - 0.35) / 0.38);
      const cond2 = Math.hypot((y - 1.8) / 0.75, (normZ + 0.15) / 0.32);
      if (cond1 < 1.0 || cond2 < 1.0) {
        return mixColor('#0f0e0d', '#292420', Math.min(cond1, cond2));
      }

      const limeCol = mixColor('#4a4e52', '#7d8287', bed);
      if (stylolite > 0.1) limeCol.lerp(new THREE.Color('#2c2f33'), stylolite * 0.55);
      if (isSolutionFissure) limeCol.lerp(new THREE.Color('#823322'), 0.78);
      return limeCol;
    }

    // Glacial cross-section: Folded crystalline gneissic basement + upper glacial till veneer
    if (category === 'glacial') {
      if (depthBelowSurface < 0.35 && normZ < 2.2) {
        // Unsorted glacial till boulder-clay layer
        return mixColor('#545049', '#756f65', fbm(x * 5.0, normZ * 5.0));
      }
      const foldWave = Math.sin((x + y) * 0.45) * 0.55 + fbm(x * 0.4, y * 0.4) * 0.65;
      const foliation = Math.sin((normZ + foldWave) * 7.5) * 0.5 + 0.5;
      const quartzVein = smoothstep(0.88, 0.97, Math.sin((normZ * 3.2 - (x - y) * 0.55)));
      const gneiss = mixColor('#32373d', '#5d6670', foliation);
      if (quartzVein > 0.1) gneiss.lerp(new THREE.Color('#adb6bf'), quartzVein * 0.55);
      return gneiss;
    }

    // Coastal & Fluvial: Rhythmic graded sandstone, siltstone, mudstone & gravel channel lenses
    const gentleDip = Math.sin((x - y) * 0.18) * 0.22;
    const sZ = normZ + gentleDip;
    const majorBed = Math.sin(sZ * 5.2 + fbm(x * 0.25, y * 0.25) * 0.8) * 0.5 + 0.5;
    const fineLamina = Math.sin(sZ * 16.5) * 0.5 + 0.5;
    const sedCol = mixColor('#3b332b', '#7a6855', majorBed * 0.75 + fineLamina * 0.25);
    return sedCol;
  };

  // Helper to build a vertically subdivided side skirt wall with outward-facing normals
  // Traversing the perimeter counter-clockwise (South -> East -> North -> West) ensures
  // (downward vector) x (along-perimeter vector) always points strictly OUTWARD!
  const addSubdividedSkirt = (
    coordAccessor: (k: number) => { x: number; y: number; h: number }
  ) => {
    const skirtStartIdx = vertIdx;
    const colStride = skirtLayers + 1;

    for (let k = 0; k <= segments; k++) {
      const { x, y, h } = coordAccessor(k);
      const u = k / segments;

      for (let m = 0; m <= skirtLayers; m++) {
        const vFrac = m / skirtLayers; // 0 = top (z = h), 1 = bottom (z = baseZ)
        const z = h + (baseZ - h) * vFrac;
        const depthShade = 1.0 - vFrac * 0.26;
        const sCol = getStrataColor(x, y, z, h);

        positions[vertIdx * 3] = x;
        positions[vertIdx * 3 + 1] = y;
        positions[vertIdx * 3 + 2] = z;

        colors[vertIdx * 3] = sCol.r * depthShade;
        colors[vertIdx * 3 + 1] = sCol.g * depthShade;
        colors[vertIdx * 3 + 2] = sCol.b * depthShade;

        uvs[vertIdx * 2] = u;
        uvs[vertIdx * 2 + 1] = 1.0 - vFrac;

        vertIdx++;
      }
    }

    for (let k = 0; k < segments; k++) {
      const col0 = skirtStartIdx + k * colStride;
      const col1 = col0 + colStride;
      for (let m = 0; m < skirtLayers; m++) {
        const p00 = col0 + m;     // curr top
        const p01 = col0 + m + 1; // curr down
        const p10 = col1 + m;     // next top
        const p11 = col1 + m + 1; // next down

        indices.push(p00, p01, p10);
        indices.push(p01, p11, p10);
      }
    }
  };

  // 1. South (Front) Skirt: y = -halfSize, x from -halfSize -> +halfSize (Outward normal: -Y)
  addSubdividedSkirt((i) => ({
    x: -halfSize + i * step,
    y: -halfSize,
    h: gridHeights[i],
  }));

  // 2. East (Right) Skirt: x = +halfSize, y from -halfSize -> +halfSize (Outward normal: +X)
  addSubdividedSkirt((j) => ({
    x: halfSize,
    y: -halfSize + j * step,
    h: gridHeights[j * (segments + 1) + segments],
  }));

  // 3. North (Back) Skirt: y = +halfSize, x from +halfSize -> -halfSize (Outward normal: +Y)
  addSubdividedSkirt((i) => {
    const actualI = segments - i;
    return {
      x: -halfSize + actualI * step,
      y: halfSize,
      h: gridHeights[segments * (segments + 1) + actualI],
    };
  });

  // 4. West (Left) Skirt: x = -halfSize, y from +halfSize -> -halfSize (Outward normal: -X)
  addSubdividedSkirt((j) => {
    const actualJ = segments - j;
    return {
      x: -halfSize,
      y: -halfSize + actualJ * step,
      h: gridHeights[actualJ * (segments + 1)],
    };
  });

  // 5. Solid Base Bottom Plate at baseZ (Winding for -Z outward downward normal)
  const b1 = vertIdx;
  positions[vertIdx * 3] = -halfSize;
  positions[vertIdx * 3 + 1] = -halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.07;
  colors[vertIdx * 3 + 1] = 0.08;
  colors[vertIdx * 3 + 2] = 0.09;
  uvs[vertIdx * 2] = 0;
  uvs[vertIdx * 2 + 1] = 0;
  vertIdx++;

  const b2 = vertIdx;
  positions[vertIdx * 3] = halfSize;
  positions[vertIdx * 3 + 1] = -halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.07;
  colors[vertIdx * 3 + 1] = 0.08;
  colors[vertIdx * 3 + 2] = 0.09;
  uvs[vertIdx * 2] = 1;
  uvs[vertIdx * 2 + 1] = 0;
  vertIdx++;

  const b3 = vertIdx;
  positions[vertIdx * 3] = halfSize;
  positions[vertIdx * 3 + 1] = halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.07;
  colors[vertIdx * 3 + 1] = 0.08;
  colors[vertIdx * 3 + 2] = 0.09;
  uvs[vertIdx * 2] = 1;
  uvs[vertIdx * 2 + 1] = 1;
  vertIdx++;

  const b4 = vertIdx;
  positions[vertIdx * 3] = -halfSize;
  positions[vertIdx * 3 + 1] = halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.07;
  colors[vertIdx * 3 + 1] = 0.08;
  colors[vertIdx * 3 + 2] = 0.09;
  uvs[vertIdx * 2] = 0;
  uvs[vertIdx * 2 + 1] = 1;
  vertIdx++;

  indices.push(b1, b3, b2);
  indices.push(b1, b4, b3);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setAttribute('aSubmerged', new THREE.BufferAttribute(submerged, 1));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  // Bound cache size to avoid memory bloat across rapid explorations
  if (GEOMETRY_CACHE.size >= MAX_GEOMETRY_CACHE_SIZE) {
    const oldest = GEOMETRY_CACHE.keys().next().value;
    if (oldest) {
      GEOMETRY_CACHE.get(oldest)?.dispose();
      GEOMETRY_CACHE.delete(oldest);
    }
  }

  GEOMETRY_CACHE.set(cacheKey, geo);
  return geo;
}
