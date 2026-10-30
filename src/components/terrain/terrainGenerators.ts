import * as THREE from 'three';
import { evalVolcanicTerrain } from './generators/volcanic';
import { evalCoastalTerrain } from './generators/coastal';
import { evalFluvialTerrain } from './generators/fluvial';
import { evalKarstTerrain } from './generators/karst';
import { evalGlacialTerrain } from './generators/glacial';
import { evalAridTerrain } from './generators/arid';
import { generateTerrainElevationField } from './contour/terrainDEMGenerator';
import {
  normalizeTerrainName,
  TerrainEvalResult,
  fbm,
  clamp,
  mixColor,
} from './terrainMath';

export * from './terrainMath';
export * from './contour/terrainDEMGenerator';
export * from './contour/terrainContourMetadata';

// ==========================================
// Terrain Key Resolver
// ==========================================
export const resolveTerrainKey = (name: string): string => {
  const norm = normalizeTerrainName(name);
  if (norm.includes('오름') || norm.includes('기생화산')) return '기생화산';
  if (norm.includes('사주') || norm.includes('사취')) return '사주·사취';
  if (norm.includes('석호')) return '석호';
  if (norm.includes('파식대')) return '파식대';
  if (norm.includes('해식애')) return '해식애';
  if (norm.includes('시스택')) return '시스택';
  if (norm.includes('해안 사구') || (norm.includes('사구') && !norm.includes('사막'))) return '해안 사구';
  if (norm.includes('감입곡류') || norm.includes('곡류')) return '곡류천';
  if (norm.includes('범람원')) return '범람원';
  if (norm.includes('선상지')) return '선상지';
  if (norm.includes('삼각주')) return '삼각주';
  if (norm.includes('하안단구')) return '하안단구';
  if (norm.includes('폭포')) return '폭포';
  if (norm.includes('석회동굴')) return '석회동굴';
  if (norm.includes('돌리네')) return '돌리네';
  if (norm.includes('카렌')) return '카렌';
  if (norm.includes('탑 카르스트') || norm.includes('탑카르스트')) return '탑 카르스트';
  if (norm.includes('U자곡') || norm.includes('유자곡')) return 'U자곡';
  if (norm.includes('피오르드')) return '피오르드';
  if (norm.includes('혼') || norm.includes('호른')) return '혼';
  if (norm.includes('권곡') || norm.includes('카르')) return '권곡';
  if (norm.includes('모레인') || norm.includes('빙퇴석')) return '모레인';
  if (norm.includes('메사') || norm.includes('뷰트')) return '메사·뷰트';
  if (norm.includes('와디')) return '와디';
  if (norm.includes('버섯바위')) return '버섯바위';
  if (norm.includes('오아시스')) return '오아시스';
  if (norm.includes('플라야')) return '플라야';
  if (norm.includes('사막')) return '사막';
  if (norm.includes('주상절리')) return '주상절리';
  if (norm.includes('용암동굴')) return '용암동굴';
  if (norm.includes('칼데라')) return '칼데라';
  if (norm.includes('단층 산맥') || norm.includes('단층')) return '단층 산맥';
  if (norm.includes('갯벌')) return '갯벌';
  if (norm.includes('화산')) return '화산';
  return norm;
};

// ==========================================
// Terrain Height & Vertex Color Evaluator
// ==========================================

export function evaluateTerrainPoint(
  normSub: string,
  category: string,
  x: number,
  y: number,
  reliefScale = 1.0
): TerrainEvalResult {
  const v = evalVolcanicTerrain(normSub, x, y, reliefScale);
  if (v) return v;

  const c = evalCoastalTerrain(normSub, x, y, reliefScale);
  if (c) return c;

  const f = evalFluvialTerrain(normSub, x, y, reliefScale);
  if (f) return f;

  const k = evalKarstTerrain(normSub, x, y, reliefScale);
  if (k) return k;

  const g = evalGlacialTerrain(normSub, x, y, reliefScale);
  if (g) return g;

  const a = evalAridTerrain(normSub, x, y, reliefScale);
  if (a) return a;

  // Generic fallback mountain landscape
  const h = (fbm(x * 0.6, y * 0.6) * 3.0) * reliefScale;
  const color = new THREE.Color("#666666");
  return { height: h, color };
}

// ==========================================
// Complete Geological Block Diorama Generator
// Builds the top terrain surface PLUS 4 solid
// vertical side skirts showing geological strata!
// ==========================================
const GEOMETRY_CACHE: Record<string, THREE.BufferGeometry> = {};

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
  materialPreset: TerrainMaterialPreset = 'natural'
): THREE.BufferGeometry {
  const normSub = resolveTerrainKey(subTerrain);
  const cacheKey = `${category}-${normSub}-${reliefScale.toFixed(2)}-strata:${showStrata}-stage:${evolutionStage}-mat:${materialPreset}`;
  if (GEOMETRY_CACHE[cacheKey]) return GEOMETRY_CACHE[cacheKey];

  const size = 20;
  const segments = 160; // 160x160 grid for optimal balance of crisp fidelity and 60fps performance
  const halfSize = size / 2;
  const step = size / segments;
  const numGridVerts = (segments + 1) * (segments + 1);

  // Evolution morphological factor (1: nascent stage, 2: building/uplift, 3: mature erosion, 4: modern)
  const stageMorph = evolutionStage === 1 ? 0.45 : evolutionStage === 2 ? 0.7 : evolutionStage === 3 ? 0.88 : 1.0;
  const effectiveRelief = reliefScale * stageMorph;

  // Single Source of Truth: Get normalized DEM Elevation Field
  const dem = generateTerrainElevationField(category, subTerrain, effectiveRelief, 4, segments, size);

  // Grid vertex heights & colors cache
  const gridHeights: number[][] = [];
  const gridColors: THREE.Color[][] = [];

  for (let j = 0; j <= segments; j++) {
    gridHeights[j] = [];
    gridColors[j] = [];
    for (let i = 0; i <= segments; i++) {
      const idx = j * (segments + 1) + i;
      gridHeights[j][i] = dem.elevations[idx];
      gridColors[j][i] = new THREE.Color(
        dem.colors[idx * 3],
        dem.colors[idx * 3 + 1],
        dem.colors[idx * 3 + 2]
      );
    }
  }

  // Base elevation of the pedestal
  const baseZ = -1.2;

  // Let's count vertices:
  // Top plane: (segments + 1) * (segments + 1)
  // 4 Skirts: each skirt has (segments + 1) top vertices and (segments + 1) bottom vertices
  // Total skirt vertices = 4 * 2 * (segments + 1) = 8 * (segments + 1)
  // Bottom plate: (segments + 1) * (segments + 1) (or simple 2 triangles)
  const numSkirtVerts = 4 * (segments + 1) * 2;
  const totalVerts = numGridVerts + numSkirtVerts + 4; // plus bottom quad

  const positions = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const indices: number[] = [];

  let vertIdx = 0;

  // Helper to calculate custom preset color
  const evalPresetColor = (baseColor: THREE.Color, heightVal: number): THREE.Color => {
    if (materialPreset === 'hypsometric') {
      const normH = clamp((heightVal / (reliefScale || 1.0)) / 5.2, 0, 1);
      if (normH < 0.12) {
        return mixColor('#0d47a1', '#1976d2', normH / 0.12);
      } else if (normH < 0.35) {
        return mixColor('#1b5e20', '#4caf50', (normH - 0.12) / 0.23);
      } else if (normH < 0.58) {
        return mixColor('#fbc02d', '#f57c00', (normH - 0.35) / 0.23);
      } else if (normH < 0.82) {
        return mixColor('#d84315', '#4e342e', (normH - 0.58) / 0.24);
      } else {
        return mixColor('#78909c', '#ffffff', (normH - 0.82) / 0.18);
      }
    } else if (materialPreset === 'thermal') {
      const normH = clamp((heightVal / (reliefScale || 1.0)) / 5.0, 0, 1);
      if (normH < 0.2) {
        return mixColor('#090a2a', '#00b0ff', normH / 0.2);
      } else if (normH < 0.45) {
        return mixColor('#00b0ff', '#00e676', (normH - 0.2) / 0.25);
      } else if (normH < 0.72) {
        return mixColor('#00e676', '#ffea00', (normH - 0.45) / 0.27);
      } else if (normH < 0.9) {
        return mixColor('#ffea00', '#ff3d00', (normH - 0.72) / 0.18);
      } else {
        return mixColor('#ff3d00', '#ffffff', (normH - 0.9) / 0.1);
      }
    } else if (materialPreset === 'bedrock') {
      return mixColor('#8c8072', '#ded6c8', clamp(heightVal / (5.0 * (reliefScale || 1.0)), 0, 1));
    } else if (materialPreset === 'obsidian') {
      return mixColor('#101214', '#202429', clamp(heightVal / (5.0 * (reliefScale || 1.0)), 0, 1));
    }
    return baseColor;
  };

  // 1. TOP TERRAIN SURFACE
  for (let j = 0; j <= segments; j++) {
    const y = -halfSize + j * step;
    for (let i = 0; i <= segments; i++) {
      const x = -halfSize + i * step;
      const h = gridHeights[j][i];
      const col = evalPresetColor(gridColors[j][i], h);

      positions[vertIdx * 3] = x;
      positions[vertIdx * 3 + 1] = y;
      positions[vertIdx * 3 + 2] = h;

      colors[vertIdx * 3] = col.r;
      colors[vertIdx * 3 + 1] = col.g;
      colors[vertIdx * 3 + 2] = col.b;

      uvs[vertIdx * 2] = (x + halfSize) / size;
      uvs[vertIdx * 2 + 1] = (y + halfSize) / size;

      vertIdx++;
    }
  }

  // Top surface triangle indices
  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + 1;
      const c = (j + 1) * (segments + 1) + i;
      const d = c + 1;

      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  // Geological strata coloring helper for side skirts
  const getStrataColor = (x: number, y: number, z: number): THREE.Color => {
    if (!showStrata) {
      return new THREE.Color('#22242b');
    }

    if (materialPreset !== 'natural') {
      return evalPresetColor(new THREE.Color('#33383f'), z);
    }

    // 1. 단층 산맥: 명확한 단층선 변위(Fault Displacement)와 단층 파쇄대(Gouge Zone)
    let effZ = z;
    if (normSub === '단층 산맥') {
      const faultX = Math.sin(y * 0.15) * 0.7; // 자연스러운 주향 굴곡
      const distToFault = Math.abs(x - faultX);
      if (distToFault < 0.38) {
        // 단층 마찰 파쇄대 (어두운 각력암 및 단층점토)
        const gouge = Math.sin(z * 16.0 + y * 2.0) * 0.5 + 0.5;
        return new THREE.Color('#141416').lerp(new THREE.Color('#382820'), gouge);
      }
      // 단층면 기준 상반/하반 층리 수직 변위 어긋남
      effZ = x < faultX ? z + 1.15 : z - 0.75;
    }

    // 2. 화산 지형: 중심부 지하 마그마 화도(Magma Conduit) 및 마그마방 관입 표현
    if (category === 'volcanic' || normSub === '화산' || normSub === '기생화산' || normSub === '칼데라') {
      const distToCenter = Math.sqrt(x * x + y * y);
      const conduitRadius = 1.35 + (z < 0 ? 0.75 : 0.15);
      if (distToCenter < conduitRadius) {
        const pulse = Math.sin(z * 5.0 + x * 2.0) * 0.5 + 0.5;
        const magmaCore = new THREE.Color('#ff3c00').lerp(new THREE.Color('#ff8c00'), pulse);
        const contactAureole = new THREE.Color('#2c140d');
        const factor = distToCenter / conduitRadius;
        return magmaCore.lerp(contactAureole, factor * factor);
      }
    }

    // 3. 지형 계열별 정밀 층리
    if (category === 'volcanic') {
      // 현무암질 용암류, 다공질 스코리아, 화산재 응회암 호층
      const layer = Math.sin(effZ * 4.4 + fbm(x * 0.3, y * 0.3) * 1.5) * 0.5 + 0.5;
      const subLayer = Math.sin(effZ * 14.0) * 0.5 + 0.5;
      const colA = new THREE.Color('#242120');
      const colB = new THREE.Color('#4c2920');
      const colC = new THREE.Color('#151618');
      return colA.lerp(colB, layer).lerp(colC, subLayer * 0.4);
    } else if (category === 'arid') {
      // 건조 사암의 사층리(Cross-bedding, 25도 경사)와 수평 이암층
      const crossBed = Math.sin((effZ * 4.8 + x * 0.7) + fbm(x * 0.25, effZ * 0.25) * 1.2) * 0.5 + 0.5;
      const planarBed = Math.sin(effZ * 2.0) * 0.5 + 0.5;
      const colA = new THREE.Color('#944e34');
      const colB = new THREE.Color('#b86e49');
      const colC = new THREE.Color('#d99c72');
      return colA.lerp(colB, crossBed).lerp(colC, planarBed * 0.4);
    } else if (category === 'karst') {
      // 후층 석회암의 수평 층리면과 수직 용식 절리(Joint Fissure), 테라로사 점토대
      const bed = Math.sin(effZ * 3.4) * 0.5 + 0.5;
      const isJoint = Math.sin(x * 2.5 + y * 0.3) > 0.88;
      const colA = new THREE.Color('#4c4f52');
      const colB = new THREE.Color('#676c70');
      const colTerra = new THREE.Color('#783428');
      const baseCol = colA.lerp(colB, bed);
      return isJoint ? baseCol.lerp(colTerra, 0.65) : baseCol;
    } else if (category === 'glacial') {
      // 결정질 화강편마암 기반암과 불규칙한 빙퇴석(Till) 혼재층
      const foliation = Math.sin(effZ * 5.5 + (x - y) * 0.35) * 0.5 + 0.5;
      const colA = new THREE.Color('#3c4247');
      const colB = new THREE.Color('#555e66');
      const colC = new THREE.Color('#25282c');
      return colA.lerp(colB, foliation).lerp(colC, (Math.sin(effZ * 15) * 0.5 + 0.5) * 0.35);
    } else {
      // 하천/해안: 점이층리(Graded bedding)와 모래/실트/점토 교호 퇴적층
      const bed = Math.sin(effZ * 4.6 + fbm(x * 0.2, y * 0.2) * 1.1) * 0.5 + 0.5;
      const fineBed = Math.sin(effZ * 16.0) * 0.5 + 0.5;
      const colA = new THREE.Color('#3f3730');
      const colB = new THREE.Color('#5d4f43');
      const colC = new THREE.Color('#7d6b58');
      return colA.lerp(colB, bed).lerp(colC, fineBed * 0.3);
    }
  };

  // Helper to add a side skirt wall
  const addSkirt = (
    coordAccessor: (t: number) => { x: number; y: number; h: number },
    segmentsCount: number,
    normalFlip: boolean
  ) => {
    const skirtStartIdx = vertIdx;

    for (let k = 0; k <= segmentsCount; k++) {
      const { x, y, h } = coordAccessor(k);

      // Top skirt vertex (matches the terrain surface edge)
      positions[vertIdx * 3] = x;
      positions[vertIdx * 3 + 1] = y;
      positions[vertIdx * 3 + 2] = h;
      const topCol = getStrataColor(x, y, h);
      colors[vertIdx * 3] = topCol.r;
      colors[vertIdx * 3 + 1] = topCol.g;
      colors[vertIdx * 3 + 2] = topCol.b;
      uvs[vertIdx * 2] = k / segmentsCount;
      uvs[vertIdx * 2 + 1] = 1.0;
      vertIdx++;

      // Bottom skirt vertex (at baseZ)
      positions[vertIdx * 3] = x;
      positions[vertIdx * 3 + 1] = y;
      positions[vertIdx * 3 + 2] = baseZ;
      const botCol = getStrataColor(x, y, baseZ);
      colors[vertIdx * 3] = botCol.r * 0.7; // slightly darker at bottom
      colors[vertIdx * 3 + 1] = botCol.g * 0.7;
      colors[vertIdx * 3 + 2] = botCol.b * 0.7;
      uvs[vertIdx * 2] = k / segmentsCount;
      uvs[vertIdx * 2 + 1] = 0.0;
      vertIdx++;
    }

    // Connect skirt quad triangles
    for (let k = 0; k < segmentsCount; k++) {
      const p1 = skirtStartIdx + k * 2;
      const p2 = p1 + 1;
      const p3 = p1 + 2;
      const p4 = p1 + 3;

      if (!normalFlip) {
        indices.push(p1, p2, p3);
        indices.push(p2, p4, p3);
      } else {
        indices.push(p1, p3, p2);
        indices.push(p2, p3, p4);
      }
    }
  };

  // 1. South Skirt (y = -halfSize, i goes 0 -> segments)
  addSkirt(
    (i) => ({
      x: -halfSize + i * step,
      y: -halfSize,
      h: gridHeights[0][i],
    }),
    segments,
    false
  );

  // 2. North Skirt (y = +halfSize, i goes segments -> 0)
  addSkirt(
    (i) => {
      const actualI = segments - i;
      return {
        x: -halfSize + actualI * step,
        y: halfSize,
        h: gridHeights[segments][actualI],
      };
    },
    segments,
    false
  );

  // 3. West Skirt (x = -halfSize, j goes segments -> 0)
  addSkirt(
    (j) => {
      const actualJ = segments - j;
      return {
        x: -halfSize,
        y: -halfSize + actualJ * step,
        h: gridHeights[actualJ][0],
      };
    },
    segments,
    false
  );

  // 4. East Skirt (x = +halfSize, j goes 0 -> segments)
  addSkirt(
    (j) => ({
      x: halfSize,
      y: -halfSize + j * step,
      h: gridHeights[j][segments],
    }),
    segments,
    false
  );

  // 5. Solid Base Bottom Plate (quad at baseZ)
  const b1 = vertIdx;
  positions[vertIdx * 3] = -halfSize;
  positions[vertIdx * 3 + 1] = -halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  uvs[vertIdx * 2] = 0; uvs[vertIdx * 2 + 1] = 0;
  vertIdx++;

  const b2 = vertIdx;
  positions[vertIdx * 3] = halfSize;
  positions[vertIdx * 3 + 1] = -halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  uvs[vertIdx * 2] = 1; uvs[vertIdx * 2 + 1] = 0;
  vertIdx++;

  const b3 = vertIdx;
  positions[vertIdx * 3] = halfSize;
  positions[vertIdx * 3 + 1] = halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  uvs[vertIdx * 2] = 1; uvs[vertIdx * 2 + 1] = 1;
  vertIdx++;

  const b4 = vertIdx;
  positions[vertIdx * 3] = -halfSize;
  positions[vertIdx * 3 + 1] = halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  uvs[vertIdx * 2] = 0; uvs[vertIdx * 2 + 1] = 1;
  vertIdx++;

  indices.push(b1, b2, b3);
  indices.push(b1, b3, b4);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  GEOMETRY_CACHE[cacheKey] = geo;
  return geo;
}
