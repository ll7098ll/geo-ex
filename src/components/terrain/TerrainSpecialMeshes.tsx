import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  evaluateTerrainPoint,
  getBaseWaterElevation,
  fbm,
  warpedFbm,
  getHexBasaltColumn,
  clamp,
  smoothstep,
  mixColor,
} from './terrainGenerators';
import { getCalderaShoreRadius } from './generators/volcanic';
import {
  getSeaCliffEdgeX,
  getWavePlatformCliffX,
  SEA_STACK_SPECS,
  TIDE_POOL_SPECS,
} from './generators/coastal';
import { getWaterfallLipY } from './generators/fluvial';
import { MUSHROOM_PEDESTAL_SPECS } from './generators/arid';

// ============================================================================
// 0. Utility: Merge Indexed/Non-Indexed BufferGeometries (position, normal, color)
// ============================================================================
function mergeColorGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalVerts = 0;
  let totalIndices = 0;

  for (const g of geos) {
    if (!g.attributes.normal) g.computeVertexNormals();
    const vCount = g.attributes.position.count;
    totalVerts += vCount;
    totalIndices += g.index ? g.index.count : vCount;
  }

  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const indices = new Uint32Array(totalIndices);

  let vOffset = 0;
  let iOffset = 0;

  for (const g of geos) {
    const pos = g.attributes.position;
    const nrm = g.attributes.normal;
    const col = g.attributes.color;
    const vCount = pos.count;

    positions.set(pos.array as Float32Array, vOffset * 3);
    if (nrm) {
      normals.set(nrm.array as Float32Array, vOffset * 3);
    }
    if (col) {
      colors.set(col.array as Float32Array, vOffset * 3);
    } else {
      colors.fill(0.7, vOffset * 3, (vOffset + vCount) * 3);
    }

    if (g.index) {
      const idxArr = g.index.array;
      for (let k = 0; k < idxArr.length; k++) {
        indices[iOffset + k] = idxArr[k] + vOffset;
      }
      iOffset += idxArr.length;
    } else {
      for (let k = 0; k < vCount; k++) {
        indices[iOffset + k] = vOffset + k;
      }
      iOffset += vCount;
    }

    vOffset += vCount;
    g.dispose();
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  return merged;
}

function paintGeometrySolid(geo: THREE.BufferGeometry, hex: string): THREE.BufferGeometry {
  const c = new THREE.Color(hex);
  const count = geo.attributes.position.count;
  const colArr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colArr[i * 3] = c.r;
    colArr[i * 3 + 1] = c.g;
    colArr[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
  return geo;
}

// ============================================================================
// 1. Conformant Volumetric Water Mesh
// Samples the exact terrain DEM so water ONLY exists inside true basins/channels,
// blends shallow shoreline foam -> deep water color, and builds vertical water
// cross-section walls along the ±10 diorama edges!
// ============================================================================
interface ConformantWaterProps {
  normSub: string;
  category: string;
  reliefScale: number;
  waterLevelFn: (x: number, y: number) => number | null;
  deepColor?: string;
  shallowColor?: string;
  foamColor?: string;
  opacity?: number;
  waveScale?: number;
  segments?: number;
  roughness?: number;
}

export const ConformantWaterMesh: React.FC<ConformantWaterProps> = ({
  normSub,
  category,
  reliefScale,
  waterLevelFn,
  deepColor = '#0c3b54',
  shallowColor = '#1e788c',
  foamColor = '#bfe8f2',
  opacity = 0.84,
  waveScale = 0.55,
  segments = 128,
  roughness = 0.08,
}) => {
  const geoRef = useRef<THREE.BufferGeometry | null>(null);

  const waterData = useMemo(() => {
    const size = 20;
    const half = size / 2;
    const step = size / segments;
    const stride = segments + 1;

    const terrainH = new Float32Array(stride * stride);
    const waterZ = new Float32Array(stride * stride);
    const validMask = new Uint8Array(stride * stride);

    for (let j = 0; j <= segments; j++) {
      const y = -half + j * step;
      for (let i = 0; i <= segments; i++) {
        const x = -half + i * step;
        const idx = j * stride + i;
        const w = waterLevelFn(x, y);
        if (w === null) {
          validMask[idx] = 0;
          waterZ[idx] = -999;
          terrainH[idx] = 0;
        } else {
          validMask[idx] = 1;
          waterZ[idx] = w;
          terrainH[idx] = evaluateTerrainPoint(normSub, category, x, y, reliefScale).height;
        }
      }
    }

    const posList: number[] = [];
    const colList: number[] = [];
    const waveWeightList: number[] = []; // 1 on deep interior top surface, 0 on shorelines & side skirts
    const idxList: number[] = [];

    const cDeep = new THREE.Color(deepColor);
    const cShallow = new THREE.Color(shallowColor);
    const cFoam = new THREE.Color(foamColor);
    const tmp = new THREE.Color();

    const topVertMap = new Int32Array(stride * stride).fill(-1);

    const getOrAddTopVert = (i: number, j: number): number => {
      const gIdx = j * stride + i;
      if (topVertMap[gIdx] !== -1) return topVertMap[gIdx];

      const x = -half + i * step;
      const y = -half + j * step;
      const w = waterZ[gIdx];
      const th = terrainH[gIdx];
      const depth = Math.max(0, w - th) / Math.max(0.5, reliefScale);

      // Depth-based color absorption + shoreline surf foam
      if (depth < 0.045) {
        tmp.copy(cFoam).lerp(cShallow, clamp(depth / 0.045, 0, 1));
      } else {
        tmp.copy(cShallow).lerp(cDeep, clamp((depth - 0.045) / 0.34, 0, 1));
      }

      const vIndex = posList.length / 3;
      posList.push(x, y, w);
      colList.push(tmp.r, tmp.g, tmp.b);

      const isBorder = i === 0 || i === segments || j === 0 || j === segments;
      const waveFactor = isBorder ? 0.0 : smoothstep(0.02, 0.16, depth);
      waveWeightList.push(waveFactor);

      topVertMap[gIdx] = vIndex;
      return vIndex;
    };

    // 1. Top water surface quads (only where water is genuinely above the terrain bed!)
    for (let j = 0; j < segments; j++) {
      for (let i = 0; i < segments; i++) {
        const g00 = j * stride + i;
        const g10 = g00 + 1;
        const g01 = g00 + stride;
        const g11 = g01 + 1;

        if (!validMask[g00] || !validMask[g10] || !validMask[g01] || !validMask[g11]) continue;

        const wet00 = waterZ[g00] > terrainH[g00] + 0.004;
        const wet10 = waterZ[g10] > terrainH[g10] + 0.004;
        const wet01 = waterZ[g01] > terrainH[g01] + 0.004;
        const wet11 = waterZ[g11] > terrainH[g11] + 0.004;

        if (!(wet00 || wet10 || wet01 || wet11)) continue;

        const v00 = getOrAddTopVert(i, j);
        const v10 = getOrAddTopVert(i + 1, j);
        const v01 = getOrAddTopVert(i, j + 1);
        const v11 = getOrAddTopVert(i + 1, j + 1);

        // +Z upward normal winding
        idxList.push(v00, v10, v01);
        idxList.push(v10, v11, v01);
      }
    }

    const topVertCount = posList.length / 3;

    // 2. Volumetric translucent water side-walls along the 4 diorama borders (±10)
    const addWaterSkirtEdge = (getGridIndex: (k: number) => { i: number; j: number }) => {
      for (let k = 0; k < segments; k++) {
        const a = getGridIndex(k);
        const b = getGridIndex(k + 1);
        const ga = a.j * stride + a.i;
        const gb = b.j * stride + b.i;
        if (!validMask[ga] || !validMask[gb]) continue;

        const wa = waterZ[ga];
        const wb = waterZ[gb];
        const ha = terrainH[ga];
        const hb = terrainH[gb];

        if (wa <= ha + 0.005 && wb <= hb + 0.005) continue;

        const xa = -half + a.i * step;
        const ya = -half + a.j * step;
        const xb = -half + b.i * step;
        const yb = -half + b.j * step;

        const botA = Math.min(wa, ha);
        const botB = Math.min(wb, hb);

        const baseV = posList.length / 3;
        // Top-curr, Bot-curr, Top-next, Bot-next
        posList.push(xa, ya, wa);
        colList.push(cShallow.r * 0.9, cShallow.g * 0.9, cShallow.b * 0.9);
        waveWeightList.push(0);

        posList.push(xa, ya, botA);
        colList.push(cDeep.r * 0.72, cDeep.g * 0.72, cDeep.b * 0.72);
        waveWeightList.push(0);

        posList.push(xb, yb, wb);
        colList.push(cShallow.r * 0.9, cShallow.g * 0.9, cShallow.b * 0.9);
        waveWeightList.push(0);

        posList.push(xb, yb, botB);
        colList.push(cDeep.r * 0.72, cDeep.g * 0.72, cDeep.b * 0.72);
        waveWeightList.push(0);

        // Counter-clockwise perimeter traversal -> outward normal!
        idxList.push(baseV, baseV + 1, baseV + 2);
        idxList.push(baseV + 1, baseV + 3, baseV + 2);
      }
    };

    // South (y = -10, i: 0 -> segments)
    addWaterSkirtEdge((k) => ({ i: k, j: 0 }));
    // East (x = +10, j: 0 -> segments)
    addWaterSkirtEdge((k) => ({ i: segments, j: k }));
    // North (y = +10, i: segments -> 0)
    addWaterSkirtEdge((k) => ({ i: segments - k, j: segments }));
    // West (x = -10, j: segments -> 0)
    addWaterSkirtEdge((k) => ({ i: 0, j: segments - k }));

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(posList);
    const baseZ = new Float32Array(topVertCount);
    for (let v = 0; v < topVertCount; v++) {
      baseZ[v] = positions[v * 3 + 2];
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colList), 3));
    geo.setIndex(idxList);
    geo.computeVertexNormals();

    return {
      geometry: geo,
      baseZ,
      waveWeights: new Float32Array(waveWeightList),
      topVertCount,
    };
  }, [normSub, category, reliefScale, waterLevelFn, deepColor, shallowColor, foamColor, segments]);

  useFrame(({ clock }) => {
    if (!waterData || waveScale <= 0.01 || waterData.topVertCount === 0) return;
    const t = clock.getElapsedTime();
    const posAttr = waterData.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const { baseZ, waveWeights, topVertCount } = waterData;

    for (let v = 0; v < topVertCount; v++) {
      const wgt = waveWeights[v];
      if (wgt <= 0.001) continue;
      const x = arr[v * 3];
      const y = arr[v * 3 + 1];
      const ripple =
        (Math.sin(x * 1.65 + t * 2.1) * 0.018 +
          Math.cos(y * 1.85 - t * 1.7) * 0.015 +
          Math.sin((x - y) * 1.15 + t * 2.6) * 0.01) *
        waveScale *
        wgt;
      arr[v * 3 + 2] = baseZ[v] + ripple;
    }
    posAttr.needsUpdate = true;
  });

  if (waterData.topVertCount === 0) return null;

  return (
    <mesh ref={(m) => { if (m) geoRef.current = m.geometry; }} geometry={waterData.geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={roughness}
        metalness={0.22}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

// Keep legacy AnimatedWaterSurface export for full API compatibility
export const AnimatedWaterSurface: React.FC<{
  color?: string;
  opacity?: number;
  elevation?: number;
  size?: [number, number];
  position?: [number, number, number];
  circular?: boolean;
  radius?: number;
  waveScale?: number;
}> = ({
  color = '#1b5e7d',
  opacity = 0.85,
  elevation = 0.5,
  size = [20, 20],
  position,
  circular = false,
  radius = 6,
}) => {
  const pos: [number, number, number] = position || [0, 0, elevation];
  return (
    <mesh position={pos}>
      {circular ? <circleGeometry args={[radius, 36]} /> : <planeGeometry args={[size[0], size[1], 16, 16]} />}
      <meshStandardMaterial color={color} roughness={0.08} metalness={0.25} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ============================================================================
// 2. Grounded +Z-Upright Ecological & Geomorphic Micro-Props
// ============================================================================
const GroundedPineTrees: React.FC<{
  normSub: string;
  category: string;
  reliefScale: number;
  coords: [number, number, number?][];
  foliageColor?: string;
}> = ({ normSub, category, reliefScale, coords, foliageColor = '#234a1e' }) => {
  const geo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];
    for (const [tx, ty, customScale] of coords) {
      const gz = evaluateTerrainPoint(normSub, category, tx, ty, reliefScale).height;
      const sc = customScale ?? (0.78 + ((Math.abs(Math.sin(tx * 12.7 + ty * 31.3)) * 100) % 0.42));

      // Trunk standing along +Z (rotate X by +PI/2)
      const trunk = new THREE.CylinderGeometry(0.035 * sc, 0.055 * sc, 0.28 * sc, 6);
      trunk.rotateX(Math.PI / 2);
      trunk.translate(tx, ty, gz + 0.12 * sc);
      parts.push(paintGeometrySolid(trunk, '#4a3221'));

      // 2-tier conifer canopy along +Z
      const c1 = new THREE.ConeGeometry(0.22 * sc, 0.46 * sc, 7);
      c1.rotateX(Math.PI / 2);
      c1.translate(tx, ty, gz + 0.36 * sc);
      parts.push(paintGeometrySolid(c1, foliageColor));

      const c2 = new THREE.ConeGeometry(0.16 * sc, 0.38 * sc, 7);
      c2.rotateX(Math.PI / 2);
      c2.translate(tx, ty, gz + 0.56 * sc);
      parts.push(paintGeometrySolid(c2, '#2f5e27'));
    }
    return parts.length > 0 ? mergeColorGeometries(parts) : null;
  }, [normSub, category, reliefScale, coords, foliageColor]);

  if (!geo) return null;
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.86} />
    </mesh>
  );
};

// ============================================================================
// 3. Volcanic Special Meshes (Lava Lake, Steam Plume, 265 Hex Basalt Columns, Lava Tube Cutaway)
// ============================================================================
export const AnimatedLavaLake: React.FC<{
  elevation?: number;
  radius?: number;
  position?: [number, number, number];
}> = ({ elevation = 3.3, radius = 0.92, position }) => {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.emissiveIntensity = 1.45 + Math.sin(t * 2.8) * 0.4;
    }
  });

  const pos: [number, number, number] = position || [0, 0, elevation];

  return (
    <group position={pos}>
      <mesh>
        <circleGeometry args={[radius, 36]} />
        <meshStandardMaterial
          ref={matRef}
          color="#ff3b00"
          emissive="#ff2600"
          emissiveIntensity={1.6}
          roughness={0.28}
          metalness={0.1}
        />
      </mesh>
      {[
        { p: [-0.28 * radius, 0.22 * radius, 0.015], r: 0.28 * radius },
        { p: [0.34 * radius, -0.18 * radius, 0.015], r: 0.32 * radius },
        { p: [-0.08 * radius, -0.36 * radius, 0.015], r: 0.22 * radius },
      ].map((crust, idx) => (
        <mesh key={idx} position={crust.p as [number, number, number]}>
          <circleGeometry args={[crust.r, 10]} />
          <meshStandardMaterial color="#1b1210" roughness={0.92} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0.6]} color="#ff4d00" intensity={2.4} distance={5.5} />
    </group>
  );
};

export const VolcanicSteamPlume: React.FC<{
  position?: [number, number, number];
  scale?: number;
}> = ({ position = [0, 0, 3.8], scale = 1.0 }) => {
  const puffsRef = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        phase: (i / 8) * Math.PI * 2,
        driftX: (Math.sin(i * 4.3) - 0.2) * 0.45,
        driftY: Math.cos(i * 2.9) * 0.35,
        baseSize: 0.22 + (i % 3) * 0.09,
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!puffsRef.current) return;
    puffsRef.current.children.forEach((child, i) => {
      const s = seeds[i];
      const prog = ((t * 0.28 + s.phase / (Math.PI * 2)) % 1.0);
      child.position.set(
        s.driftX * prog * 1.8 * scale,
        s.driftY * prog * 1.8 * scale,
        prog * 2.3 * scale
      );
      const sz = s.baseSize * (1.0 + prog * 1.9) * scale;
      child.scale.set(sz, sz, sz * 0.78);
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = Math.sin(prog * Math.PI) * 0.28;
      }
    });
  });

  return (
    <group position={position} ref={puffsRef}>
      {seeds.map((_, idx) => (
        <mesh key={idx}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#e6ecef" transparent opacity={0.22} roughness={1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// High-density merged 3D hexagonal basalt colonnade (~270 interlocking 6-sided columns!)
export const ColumnarJointingColumns: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const columnsGeo = useMemo(() => {
    const hexScale = 0.46;
    const inradius = hexScale * (Math.sqrt(3) / 2) * 0.93; // 7% dark cooling-crack shadow gap between columns!
    const circumR = inradius / (Math.sqrt(3) / 2);

    const posList: number[] = [];
    const nrmList: number[] = [];
    const colList: number[] = [];
    const idxList: number[] = [];

    const seenCells = new Set<string>();
    const cDark = new THREE.Color('#16181d');
    const cMid = new THREE.Color('#282c34');
    const cCap = new THREE.Color('#3b404a');
    const cWet = new THREE.Color('#0f1418');
    const tmp = new THREE.Color();

    for (let ySample = -9.4; ySample <= 9.4; ySample += 0.36) {
      for (let xSample = -4.2; xSample <= 4.6; xSample += 0.36) {
        const cell = getHexBasaltColumn(xSample, ySample, hexScale);
        const key = `${cell.rx},${cell.rz}`;
        if (seenCells.has(key)) continue;
        seenCells.add(key);

        const cx = cell.centerX;
        const cy = cell.centerY;
        if (Math.abs(cx) > 9.45 || Math.abs(cy) > 9.45) continue;

        const coastCurve = Math.sin(cy * 0.32) * 1.15 + Math.cos(cy * 0.65) * 0.45;
        const distInland = cx - coastCurve;
        if (distInland < -2.75 || distInland > 3.05) continue;

        // Stepped discrete basalt colonnade terrace height (Giant's Causeway / 중문 주상절리 계단식 단면!)
        const normStep = clamp((distInland + 2.75) / 5.8, 0.0, 1.0);
        const quantizedTier = Math.floor(Math.pow(normStep, 1.18) * 11.0 + cell.cellId * 2.3) / 11.5;
        const rawTop = clamp(0.46 + quantizedTier * 3.42, 0.42, 3.88);
        const topZ = rawTop * reliefScale;
        const botZ = 0.16 * reliefScale;

        // Slight pentagon/hexagon natural irregularity via deterministic vertex angle jitter
        const cornersX: number[] = [];
        const cornersY: number[] = [];
        for (let s = 0; s < 6; s++) {
          const ang = (s / 6) * Math.PI * 2 + Math.PI / 6;
          const jitterR = circumR * (0.94 + 0.10 * Math.sin(cell.cellId * 37.0 + s * 2.1));
          cornersX.push(cx + Math.cos(ang) * jitterR);
          cornersY.push(cy + Math.sin(ang) * jitterR);
        }

        const shade = 0.78 + cell.cellId * 0.38;

        // 6 crisp flat vertical prism faces
        for (let s = 0; s < 6; s++) {
          const sn = (s + 1) % 6;
          const x0 = cornersX[s];
          const y0 = cornersY[s];
          const x1 = cornersX[sn];
          const y1 = cornersY[sn];

          const dx = x1 - x0;
          const dy = y1 - y0;
          const len = Math.hypot(dx, dy) || 1;
          // Outward face normal in XY plane
          const nx = dy / len;
          const ny = -dx / len;

          const baseV = posList.length / 3;
          // Bottom-0, Bottom-1, Top-1, Top-0
          posList.push(x0, y0, botZ, x1, y1, botZ, x1, y1, topZ, x0, y0, topZ);
          nrmList.push(nx, ny, 0, nx, ny, 0, nx, ny, 0, nx, ny, 0);

          const botTone = tmp.copy(cWet).multiplyScalar(shade);
          colList.push(botTone.r, botTone.g, botTone.b, botTone.r, botTone.g, botTone.b);

          const topSideTone = tmp.copy(rawTop < 0.85 ? cDark : cMid).multiplyScalar(shade);
          colList.push(topSideTone.r, topSideTone.g, topSideTone.b, topSideTone.r, topSideTone.g, topSideTone.b);

          idxList.push(baseV, baseV + 1, baseV + 2);
          idxList.push(baseV, baseV + 2, baseV + 3);
        }

        // Horizontal cup-and-ball hexagonal top cap (+Z normal!)
        const capCenterIdx = posList.length / 3;
        const dishDip = (cell.cellId > 0.5 ? -0.025 : 0.02) * reliefScale;
        const capTone = tmp
          .copy(rawTop < 0.72 ? cDark : cCap)
          .multiplyScalar(0.85 + cell.cellId * 0.28);
        if (distInland > 2.45) {
          capTone.lerp(new THREE.Color('#3a572c'), 0.45);
        }

        posList.push(cx, cy, topZ + dishDip);
        nrmList.push(0, 0, 1);
        colList.push(capTone.r * 0.92, capTone.g * 0.92, capTone.b * 0.92);

        for (let s = 0; s < 6; s++) {
          posList.push(cornersX[s], cornersY[s], topZ);
          nrmList.push(0, 0, 1);
          colList.push(capTone.r, capTone.g, capTone.b);
        }
        for (let s = 0; s < 6; s++) {
          const sn = (s + 1) % 6;
          idxList.push(capCenterIdx, capCenterIdx + 1 + s, capCenterIdx + 1 + sn);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posList), 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nrmList), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colList), 3));
    geo.setIndex(idxList);
    return geo;
  }, [reliefScale]);

  const seaFn = useMemo(
    () => (x: number, y: number) => {
      const coastCurve = Math.sin(y * 0.32) * 1.15 + Math.cos(y * 0.65) * 0.45;
      return x < coastCurve + 0.5 ? 0.52 * reliefScale : null;
    },
    [reliefScale]
  );

  return (
    <group>
      <mesh geometry={columnsGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.52} metalness={0.16} />
      </mesh>
      <ConformantWaterMesh
        normSub="주상절리"
        category="volcanic"
        reliefScale={reliefScale}
        waterLevelFn={seaFn}
        deepColor="#0a2e46"
        shallowColor="#196b85"
        foamColor="#dbf4fc"
        opacity={0.86}
        waveScale={0.85}
      />
    </group>
  );
};

// ============================================================================
// 4. Cutaway Caves: Limestone Cavern (석회동굴) & Horizontal Basalt Lava Tube (용암동굴)
// ============================================================================
function buildVaultedRoofShell(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  nx: number,
  ny: number,
  evalSpan: (
    x: number,
    y: number
  ) => { ceilZ: number; topZ: number; topColor: THREE.Color; innerColor: THREE.Color } | null,
  wallColorFn: (x: number, y: number, z: number) => THREE.Color
): THREE.BufferGeometry {
  const stride = nx + 1;
  const ceilZGrid = new Float32Array((nx + 1) * (ny + 1));
  const topZGrid = new Float32Array((nx + 1) * (ny + 1));
  const validGrid = new Uint8Array((nx + 1) * (ny + 1));
  const topCols: THREE.Color[] = new Array((nx + 1) * (ny + 1));
  const innerCols: THREE.Color[] = new Array((nx + 1) * (ny + 1));

  for (let j = 0; j <= ny; j++) {
    const y = yMin + (j / ny) * (yMax - yMin);
    for (let i = 0; i <= nx; i++) {
      const x = xMin + (i / nx) * (xMax - xMin);
      const g = j * stride + i;
      const res = evalSpan(x, y);
      if (res && res.topZ > res.ceilZ + 0.04) {
        validGrid[g] = 1;
        ceilZGrid[g] = res.ceilZ;
        topZGrid[g] = res.topZ;
        topCols[g] = res.topColor;
        innerCols[g] = res.innerColor;
      }
    }
  }

  const posList: number[] = [];
  const colList: number[] = [];
  const idxList: number[] = [];

  const topVMap = new Int32Array((nx + 1) * (ny + 1)).fill(-1);
  const botVMap = new Int32Array((nx + 1) * (ny + 1)).fill(-1);

  const getTopV = (i: number, j: number) => {
    const g = j * stride + i;
    if (topVMap[g] !== -1) return topVMap[g];
    const x = xMin + (i / nx) * (xMax - xMin);
    const y = yMin + (j / ny) * (yMax - yMin);
    const c = topCols[g];
    const v = posList.length / 3;
    posList.push(x, y, topZGrid[g]);
    colList.push(c.r, c.g, c.b);
    topVMap[g] = v;
    return v;
  };

  const getBotV = (i: number, j: number) => {
    const g = j * stride + i;
    if (botVMap[g] !== -1) return botVMap[g];
    const x = xMin + (i / nx) * (xMax - xMin);
    const y = yMin + (j / ny) * (yMax - yMin);
    const c = innerCols[g];
    const v = posList.length / 3;
    posList.push(x, y, ceilZGrid[g]);
    colList.push(c.r, c.g, c.b);
    botVMap[g] = v;
    return v;
  };

  const cellActive = (ci: number, cj: number): boolean => {
    if (ci < 0 || ci >= nx || cj < 0 || cj >= ny) return false;
    const g00 = cj * stride + ci;
    return !!(validGrid[g00] && validGrid[g00 + 1] && validGrid[g00 + stride] && validGrid[g00 + stride + 1]);
  };

  const addCutWall = (x0: number, y0: number, zBot0: number, zTop0: number, x1: number, y1: number, zBot1: number, zTop1: number) => {
    const layers = 6;
    const base = posList.length / 3;
    for (let m = 0; m <= layers; m++) {
      const f = m / layers;
      const za = zTop0 + (zBot0 - zTop0) * f;
      const zb = zTop1 + (zBot1 - zTop1) * f;
      const ca = wallColorFn(x0, y0, za);
      const cb = wallColorFn(x1, y1, zb);
      posList.push(x0, y0, za, x1, y1, zb);
      colList.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b);
    }
    for (let m = 0; m < layers; m++) {
      const r0 = base + m * 2;
      const r1 = r0 + 2;
      idxList.push(r0, r1, r0 + 1);
      idxList.push(r0 + 1, r1, r1 + 1);
    }
  };

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      if (!cellActive(i, j)) continue;

      const t00 = getTopV(i, j);
      const t10 = getTopV(i + 1, j);
      const t01 = getTopV(i, j + 1);
      const t11 = getTopV(i + 1, j + 1);
      // Top surface (+Z normal)
      idxList.push(t00, t10, t01);
      idxList.push(t10, t11, t01);

      const b00 = getBotV(i, j);
      const b10 = getBotV(i + 1, j);
      const b01 = getBotV(i, j + 1);
      const b11 = getBotV(i + 1, j + 1);
      // Underside ceiling (-Z normal)
      idxList.push(b00, b01, b10);
      idxList.push(b10, b01, b11);

      const x0 = xMin + (i / nx) * (xMax - xMin);
      const x1 = xMin + ((i + 1) / nx) * (xMax - xMin);
      const y0 = yMin + (j / ny) * (yMax - yMin);
      const y1 = yMin + ((j + 1) / ny) * (yMax - yMin);
      const g00 = j * stride + i;
      const g10 = g00 + 1;
      const g01 = g00 + stride;
      const g11 = g01 + 1;

      // Seal any open boundary (front arch portal, skylight rim, bridge edges!) with layered rock cross-section walls
      if (!cellActive(i, j - 1)) {
        addCutWall(x0, y0, ceilZGrid[g00], topZGrid[g00], x1, y0, ceilZGrid[g10], topZGrid[g10]);
      }
      if (!cellActive(i, j + 1)) {
        addCutWall(x1, y1, ceilZGrid[g11], topZGrid[g11], x0, y1, ceilZGrid[g01], topZGrid[g01]);
      }
      if (!cellActive(i - 1, j)) {
        addCutWall(x0, y1, ceilZGrid[g01], topZGrid[g01], x0, y0, ceilZGrid[g00], topZGrid[g00]);
      }
      if (!cellActive(i + 1, j)) {
        addCutWall(x1, y0, ceilZGrid[g10], topZGrid[g10], x1, y1, ceilZGrid[g11], topZGrid[g11]);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posList), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colList), 3));
  geo.setIndex(idxList);
  geo.computeVertexNormals();
  return geo;
}

export const CavePortalFeatures: React.FC<{ reliefScale?: number; isLavaTube?: boolean }> = ({
  reliefScale = 1.0,
  isLavaTube = false,
}) => {
  // -------------------------------------------------------------------------
  // A. 용암동굴 (Horizontal Basalt Lava Tube + Skylight + Natural Bridge + Lava Benches + Lavacicles)
  // -------------------------------------------------------------------------
  if (isLavaTube) {
    const lavaTubeGeo = useMemo(() => {
      const parts: THREE.BufferGeometry[] = [];

      const getCeilingZ = (x: number, y: number): number => {
        const cx = Math.sin(y * 0.26) * 1.35;
        const dx = (x - cx) / 1.95;
        const arch = Math.max(0, 1.0 - dx * dx);
        return (0.85 + Math.pow(arch, 0.58) * 1.48 + (y + 10.0) * 0.015) * reliefScale;
      };

      const roofShell = buildVaultedRoofShell(
        -3.8,
        3.8,
        -6.4,
        3.9,
        56,
        72,
        (x, y) => {
          const cx = Math.sin(y * 0.26) * 1.35;
          const distTube = Math.abs(x - cx);
          if (distTube > 1.92) return null;

          // Front entrance collapse gap (y in [-4.35, -2.35]) separates the front Natural Bridge from the main Lava Tube!
          if (y > -4.35 && y < -2.35) return null;

          // Circular Skylight collapse window (천창 / 궤) at (cx(0.65), 0.65)
          const skylightCx = Math.sin(0.65 * 0.26) * 1.35;
          const dSkylight = Math.hypot(x - skylightCx, y - 0.65);
          if (dSkylight < 0.86) return null;

          const ceilZ = getCeilingZ(x, y);
          const surfaceBase =
            (2.68 + (y / 10.0) * 0.35 + warpedFbm(x * 0.45, y * 0.45, 3) * 0.26) * reliefScale;

          const gotjawal = smoothstep(0.42, 0.64, fbm(x * 0.75 + 2.0, y * 0.75, 4));
          const topColor = mixColor('#2a2624', '#3d3733', fbm(x * 3, y * 3)).lerp(
            new THREE.Color('#274a1f'),
            gotjawal * 0.78
          );
          const innerColor = mixColor('#181311', '#2c221e', fbm(x * 5, y * 5));

          return { ceilZ, topZ: surfaceBase, topColor, innerColor };
        },
        (x, y, z) => {
          const bed = Math.sin((z / Math.max(0.5, reliefScale)) * 12.0 + x * 0.8) * 0.5 + 0.5;
          return mixColor('#1e1917', '#42352f', bed);
        }
      );
      parts.push(roofShell);

      // Lateral Lava Benches (만장굴 다단 용암선반!) along both inner tube walls for y in [-2.2, +3.4]
      for (const side of [-1, 1]) {
        for (const benchElev of [0.92, 1.32]) {
          for (let seg = 0; seg < 14; seg++) {
            const y0 = -2.1 + seg * 0.38;
            const cx = Math.sin(y0 * 0.26) * 1.35;
            const bench = new THREE.BoxGeometry(0.28, 0.42, 0.09 * reliefScale);
            bench.rotateZ(-Math.cos(y0 * 0.26) * 0.34);
            bench.translate(cx + side * 1.46, y0, (benchElev + (y0 + 10.0) * 0.015) * reliefScale);
            parts.push(paintGeometrySolid(bench, '#2e2420'));
          }
        }
      }

      // Shark-tooth Lavacicles (용암종유: hanging strictly -Z downward!)
      for (let i = 0; i < 28; i++) {
        const ly = -2.0 + (i / 28) * 5.2;
        const cx = Math.sin(ly * 0.26) * 1.35;
        const lx = cx + Math.sin(i * 7.3) * 1.05;
        if (Math.hypot(lx - Math.sin(0.65 * 0.26) * 1.35, ly - 0.65) < 1.05) continue;
        const cz = getCeilingZ(lx, ly);
        const len = (0.18 + (i % 4) * 0.06) * reliefScale;
        const cone = new THREE.ConeGeometry(0.055, len, 6);
        cone.rotateX(-Math.PI / 2); // Point -Z downward!
        cone.translate(lx, ly, cz - len * 0.45);
        parts.push(paintGeometrySolid(cone, '#291f1b'));
      }

      // Solidified Basalt Lava Column (만장굴 용암석주: spanning floor to ceiling at y = 1.85!)
      const colY = 1.85;
      const colX = Math.sin(colY * 0.26) * 1.35 + 0.38;
      const colFloor = evaluateTerrainPoint('용암동굴', 'volcanic', colX, colY, reliefScale).height;
      const colCeil = getCeilingZ(colX, colY);
      const colH = Math.max(0.4, colCeil - colFloor + 0.15);
      const lavaPillar = new THREE.CylinderGeometry(0.22, 0.30, colH, 10);
      lavaPillar.rotateX(Math.PI / 2); // +Z upright!
      lavaPillar.translate(colX, colY, colFloor + colH * 0.5 - 0.05);
      parts.push(paintGeometrySolid(lavaPillar, '#362822'));

      return mergeColorGeometries(parts);
    }, [reliefScale]);

    // Horizontal residual thermal cooling cracks along the tube floor (properly flat in XY!)
    const floorGlowSegments = useMemo(() => {
      return [-3.6, -2.6, -1.5, -0.4, 0.9, 2.1].map((gy, idx) => {
        const gx = Math.sin(gy * 0.26) * 1.35 + Math.sin(idx * 2.4) * 0.18;
        const gz = evaluateTerrainPoint('용암동굴', 'volcanic', gx, gy, reliefScale).height + 0.025;
        return { gx, gy, gz, rotZ: -Math.cos(gy * 0.26) * 0.34 };
      });
    }, [reliefScale]);

    const skylightX = Math.sin(0.65 * 0.26) * 1.35;

    return (
      <group>
        <mesh geometry={lavaTubeGeo} castShadow receiveShadow>
          <meshStandardMaterial vertexColors roughness={0.82} metalness={0.12} />
        </mesh>

        {/* Horizontal Ropy-Lava Floor Residual Cooling Cracks */}
        {floorGlowSegments.map((seg, idx) => (
          <mesh key={idx} position={[seg.gx, seg.gy, seg.gz]} rotation={[0, 0, seg.rotZ]}>
            <planeGeometry args={[0.36, 0.92]} />
            <meshStandardMaterial
              color="#3d180e"
              emissive="#c93b0b"
              emissiveIntensity={0.85}
              roughness={0.65}
            />
          </mesh>
        ))}

        {/* Dramatic Volumetric Sunbeam slanting through the Skylight collapse window! */}
        <mesh
          position={[skylightX + 0.18, 0.55, 1.55 * reliefScale]}
          rotation={[Math.PI / 2 - 0.12, 0, 0.15]}
        >
          <cylinderGeometry args={[0.62, 1.05, 2.35 * reliefScale, 20, 1, true]} />
          <meshBasicMaterial
            color="#fff2cc"
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <pointLight
          position={[0.1, -1.6, 1.45 * reliefScale]}
          color="#ff7b29"
          intensity={1.6}
          distance={6.5}
        />
        <pointLight
          position={[skylightX, 0.65, 1.8 * reliefScale]}
          color="#ffe9b3"
          intensity={1.8}
          distance={5.5}
        />
      </group>
    );
  }

  // -------------------------------------------------------------------------
  // B. 석회동굴 (Cutaway Karst Limestone Cavern Roof + Vertical Speleothems + Rimstone Pools)
  // -------------------------------------------------------------------------
  const karstCavernGeo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];

    const getKarstCeilZ = (x: number, y: number): number => {
      const spanW = 3.95 + Math.sin(y * 0.45) * 0.3;
      const nx = clamp(x / spanW, -1.0, 1.0);
      const dome = Math.pow(Math.max(0, 1.0 - nx * nx), 0.55);
      const backDrop = smoothstep(1.9, 3.1, y) * 0.85;
      return (1.15 + dome * 2.15 - backDrop + fbm(x * 1.8, y * 1.8) * 0.18) * reliefScale;
    };

    // 1. Vaulted Stratified Limestone Roof over y in [-3.95, +3.15], x in [-4.5, +4.5]
    const roof = buildVaultedRoofShell(
      -4.55,
      4.55,
      -3.95,
      3.15,
      56,
      52,
      (x, y) => {
        const spanW = 4.15 + Math.sin(y * 0.45) * 0.3;
        if (Math.abs(x) > spanW) return null;
        // Arched portal curve at the front entrance y ≈ -3.95
        const portalCurveY = -3.95 + Math.pow(x / 4.2, 2.0) * 0.55;
        if (y < portalCurveY) return null;

        const ceilZ = getKarstCeilZ(x, y);
        const dSink = Math.hypot(x + 1.2, y - 5.6);
        const sinkDip = dSink < 2.1 ? Math.pow(Math.cos((dSink / 2.1) * Math.PI * 0.5), 1.6) * 1.45 : 0;
        const topZ =
          (4.08 + warpedFbm(x * 0.35, y * 0.35, 4) * 0.68 + smoothstep(-2.0, 7.5, y) * 0.55 - sinkDip) *
          reliefScale;

        const karrenOutcrop = smoothstep(0.58, 0.76, fbm(x * 1.6, y * 1.6, 3));
        const topColor = mixColor('#2f5224', '#456e35', fbm(x * 2.2, y * 2.2)).lerp(
          new THREE.Color('#a8aba4'),
          karrenOutcrop * 0.68
        );
        const innerColor = mixColor('#3b352c', '#695c49', fbm(x * 4, y * 4));
        return { ceilZ, topZ, topColor, innerColor };
      },
      (x, _y, z) => {
        const bed = Math.sin((z / Math.max(0.5, reliefScale)) * 11.0 + x * 0.35) * 0.5 + 0.5;
        return mixColor('#524f49', '#8f8b80', bed);
      }
    );
    parts.push(roof);

    // 2. Hanging Stalactites & Soda Straws (종유석: strictly -Z downward!)
    for (let i = 0; i < 42; i++) {
      const sx = Math.sin(i * 12.9898) * 3.15;
      const sy = -3.45 + ((i * 0.618034) % 1.0) * 5.75;
      const ceilZ = getKarstCeilZ(sx, sy);
      const floorZ = evaluateTerrainPoint('석회동굴', 'karst', sx, sy, reliefScale).height;
      const clearance = ceilZ - floorZ;
      if (clearance < 0.75 * reliefScale) continue;

      const len = Math.min(clearance * 0.46, (0.38 + (i % 5) * 0.16) * reliefScale);
      const rad = 0.045 + (i % 4) * 0.025;
      const stalactite = new THREE.ConeGeometry(rad, len, 7);
      stalactite.rotateX(-Math.PI / 2); // Hang -Z downward!
      stalactite.translate(sx, sy, ceilZ - len * 0.45);
      parts.push(paintGeometrySolid(stalactite, i % 2 === 0 ? '#d9c7a3' : '#bfa77e'));
    }

    // 3. Rising Stalagmites (석순: strictly +Z upward from the cavern floor!)
    const stalagmiteCoords: [number, number, number, number][] = [
      [-2.35, -2.8, 0.14, 0.72],
      [2.15, -2.5, 0.16, 0.85],
      [0.95, -1.9, 0.12, 0.62],
      [-2.45, -1.1, 0.15, 0.78],
      [2.45, -0.6, 0.17, 0.92],
      [-0.45, -0.2, 0.13, 0.68],
      [1.35, 0.3, 0.15, 0.75],
      [-2.2, 0.8, 0.16, 0.84],
      [2.25, 1.4, 0.14, 0.70],
      [-0.85, 1.9, 0.15, 0.80],
      [0.95, -3.2, 0.11, 0.54],
      [-1.85, -3.4, 0.13, 0.60],
    ];
    for (const [gx, gy, rBase, hRaw] of stalagmiteCoords) {
      const fz = evaluateTerrainPoint('석회동굴', 'karst', gx, gy, reliefScale).height;
      const smH = hRaw * reliefScale;
      const sm = new THREE.CylinderGeometry(rBase * 0.42, rBase, smH, 8);
      sm.rotateX(Math.PI / 2); // Stand +Z upward!
      sm.translate(gx, gy, fz + smH * 0.48);
      parts.push(paintGeometrySolid(sm, '#c9b086'));

      const cap = new THREE.SphereGeometry(rBase * 0.44, 8, 6);
      cap.translate(gx, gy, fz + smH * 0.95);
      parts.push(paintGeometrySolid(cap, '#e3cfa8'));
    }

    // 4. Grand Joined Fluted Travertine Columns (석주: continuous floor-to-ceiling pillars!)
    const pillarSpots: [number, number, number][] = [
      [1.75, -1.65, 0.28],
      [-2.05, -0.35, 0.30],
      [1.85, 0.95, 0.26],
      [-1.55, 1.65, 0.25],
      [0.35, 1.95, 0.32],
    ];
    for (const [px, py, pr] of pillarSpots) {
      const fz = evaluateTerrainPoint('석회동굴', 'karst', px, py, reliefScale).height;
      const cz = getKarstCeilZ(px, py);
      const span = Math.max(0.5, cz - fz + 0.18);
      // Lower half tapering up + upper half flaring to ceiling (classic hourglass cave column!)
      const lower = new THREE.CylinderGeometry(pr * 0.62, pr * 1.15, span * 0.55, 10);
      lower.rotateX(Math.PI / 2);
      lower.translate(px, py, fz + span * 0.26);
      parts.push(paintGeometrySolid(lower, '#cfb88e'));

      const upper = new THREE.CylinderGeometry(pr * 1.18, pr * 0.62, span * 0.55, 10);
      upper.rotateX(Math.PI / 2);
      upper.translate(px, py, cz - span * 0.26);
      parts.push(paintGeometrySolid(upper, '#dcc7a0'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);

  // Stepped Rimstone Pool (휴석소) & Subterranean Stream Water
  const caveWaterFn = useMemo(
    () => (x: number, y: number) => {
      if (Math.abs(x) > 3.2 || y > 2.2) return null;
      const caveStreamX = -1.15 + Math.sin(y * 0.5) * 0.45;
      if (Math.abs(x - caveStreamX) < 0.78 && y < 2.0) {
        return 0.48 * reliefScale;
      }
      // 3 stepped travertine gour pools inside the cavern
      const arc = y + 0.14 * x * x;
      if (Math.abs(x) < 1.95) {
        if (arc > -2.9 && arc < -1.95) return 0.63 * reliefScale;
        if (arc > -1.4 && arc < -0.45) return 0.79 * reliefScale;
        if (arc > 0.1 && arc < 1.05) return 0.95 * reliefScale;
      }
      return null;
    },
    [reliefScale]
  );

  return (
    <group>
      <mesh geometry={karstCavernGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.68} metalness={0.08} />
      </mesh>
      <ConformantWaterMesh
        normSub="석회동굴"
        category="karst"
        reliefScale={reliefScale}
        waterLevelFn={caveWaterFn}
        deepColor="#0b4f5c"
        shallowColor="#2299a8"
        foamColor="#aef2f7"
        opacity={0.86}
        waveScale={0.25}
      />
      {/* Warm amber & turquoise subterranean cave lighting */}
      <pointLight position={[0.4, -1.6, 2.15 * reliefScale]} color="#ffbe6b" intensity={2.3} distance={8.5} />
      <pointLight position={[-0.9, 1.1, 2.05 * reliefScale]} color="#5ce1e6" intensity={1.5} distance={7.0} />
    </group>
  );
};

// ============================================================================
// 5. Caldera Lake (칼데라 — 백두산 천지 / 크레이터 레이크)
// ============================================================================
export const CalderaLakeFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const calderaWaterFn = useMemo(
    () => (x: number, y: number) => {
      const r = Math.hypot(x, y);
      const ang = Math.atan2(y, x);
      const maxR = getCalderaShoreRadius(ang) + 0.35;
      return r <= maxR ? 1.62 * reliefScale : null;
    },
    [reliefScale]
  );

  return (
    <group>
      <ConformantWaterMesh
        normSub="칼데라"
        category="volcanic"
        reliefScale={reliefScale}
        waterLevelFn={calderaWaterFn}
        deepColor="#082a47"
        shallowColor="#16648c"
        foamColor="#bce8f7"
        opacity={0.9}
        waveScale={0.45}
      />
      <VolcanicSteamPlume position={[0.55, 0.35, 2.75 * reliefScale]} scale={0.55} />
    </group>
  );
};
export const CalderaCheonjiLake = CalderaLakeFeatures;

// ============================================================================
// 6. Coastal Special Meshes (해식애, 시스택, 해안 사구, 사주·사취, 석호, 갯벌, 파식대)
// ============================================================================
export const SeaArchAndStack: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  // Custom 3D Stratified Rock Sea Arch bridging from headland tip (2.15, 0.35) to (-0.15, 0.28)
  // WITH an open wave-cut tunnel underneath!
  const seaArchGeo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];

    const archMesh = buildVaultedRoofShell(
      -0.65,
      2.45,
      -0.45,
      1.05,
      36,
      22,
      (x, y) => {
        const centerLineY = 0.28 + ((x + 0.15) / 2.3) * 0.08 + Math.sin(x * 1.4) * 0.06;
        const halfThick = 0.46 + smoothstep(0.8, 2.3, x) * 0.36;
        const dy = Math.abs(y - centerLineY);
        if (dy > halfThick) return null;

        // Span parameter u in [-1, +1] across the tunnel opening x in [0.18, 1.78]
        const u = (x - 0.98) / 0.82;
        let ceilZ = 0.22 * reliefScale; // Solid pier down to seafloor at both ends!
        if (Math.abs(u) < 1.0) {
          // Open semi-elliptical sea-arch tunnel (z up to 2.25 * reliefScale) so ocean waves pass right under!
          ceilZ = (0.35 + Math.pow(1.0 - u * u, 0.58) * 1.95) * reliefScale;
        }

        const edgeRound = Math.pow(Math.max(0, 1.0 - Math.pow(dy / halfThick, 2.4)), 0.22);
        const topZ =
          (3.48 + smoothstep(0.0, 2.3, x) * 0.34 + fbm(x * 2.2, y * 2.2) * 0.12) *
          edgeRound *
          reliefScale;

        if (topZ <= ceilZ + 0.08 * reliefScale) return null;

        const isGrassCap = dy < halfThick * 0.68;
        const topColor = isGrassCap
          ? mixColor('#3a5c2b', '#52783c', fbm(x * 3, y * 3))
          : mixColor('#695847', '#8c765f', fbm(x * 4, y * 4));
        const innerColor = mixColor('#332b24', '#524438', fbm(x * 5, y * 5));

        return { ceilZ, topZ, topColor, innerColor };
      },
      (x, y, z) => {
        const strata = Math.sin((z / Math.max(0.5, reliefScale)) * 12.5 + x * 0.3 + y * 0.2) * 0.5 + 0.5;
        return mixColor('#4f4135', '#8c745c', strata);
      }
    );
    parts.push(archMesh);

    // Overhanging caprock ledges on the top of the two main sea stacks so they show classic wave-undercut profiles!
    for (const s of SEA_STACK_SPECS.slice(0, 3)) {
      const cap = new THREE.CylinderGeometry(s.rx * 0.88, s.rx * 0.72, 0.42 * reliefScale, 14);
      cap.rotateX(Math.PI / 2);
      cap.rotateZ(s.rot);
      cap.translate(s.sx, s.sy, (s.h - 0.32) * reliefScale);
      parts.push(paintGeometrySolid(cap, '#7d6954'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);

  const seaFn = useMemo(() => () => 0.50 * reliefScale, [reliefScale]);

  return (
    <group>
      <mesh geometry={seaArchGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.76} />
      </mesh>
      <ConformantWaterMesh
        normSub="시스택"
        category="coastal"
        reliefScale={reliefScale}
        waterLevelFn={seaFn}
        deepColor="#0a2f44"
        shallowColor="#1c748c"
        foamColor="#def6fc"
        opacity={0.85}
        waveScale={0.85}
      />
      <GroundedPineTrees
        normSub="시스택"
        category="coastal"
        reliefScale={reliefScale}
        coords={[
          [6.2, 2.8],
          [6.8, -1.8],
          [5.8, -4.5],
          [7.4, 4.6],
          [7.8, 0.5],
        ]}
      />
    </group>
  );
};

const SeaCliffFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  // 3D Overhanging Wave-Cut Notch & Sea-Cave Portals along the base of the cliff!
  const notchOverhangGeo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];

    // Overhanging rock visor along the wave-cut cliff base (creates a true shadowed wave-cut notch below z = 1.25!)
    const visor = buildVaultedRoofShell(
      -0.2,
      4.2,
      -8.5,
      8.5,
      28,
      64,
      (x, y) => {
        const cx = getSeaCliffEdgeX(y);
        const relX = x - cx;
        // Jutting 0.48m seaward from the cliff face between z = 1.05 and z = 2.25!
        if (relX < -0.72 || relX > 0.12) return null;
        const jutT = clamp((relX + 0.72) / 0.84, 0, 1);
        const ceilZ = (0.98 + (1.0 - jutT) * 0.28 + Math.sin(y * 0.9) * 0.08) * reliefScale;
        const topZ = (1.65 + jutT * 0.95) * reliefScale;
        const strata = Math.sin(topZ * 12.0) * 0.5 + 0.5;
        return {
          ceilZ,
          topZ,
          topColor: mixColor('#4a3e34', '#7d6b59', strata),
          innerColor: new THREE.Color('#1c1815'),
        };
      },
      (_x, y, z) => {
        const s = Math.sin((z / Math.max(0.5, reliefScale)) * 14.0 + y * 0.25) * 0.5 + 0.5;
        return mixColor('#3f352d', '#7d6c5b', s);
      }
    );
    parts.push(visor);

    // Fallen angular rockfall talus blocks on the wave-cut bench
    for (const [by, offX, sc] of [
      [-5.2, -1.05, 0.32],
      [-1.8, -0.95, 0.38],
      [1.4, -1.15, 0.28],
      [4.6, -1.0, 0.35],
    ]) {
      const bx = getSeaCliffEdgeX(by) + offX;
      const bz = evaluateTerrainPoint('해식애', 'coastal', bx, by, reliefScale).height;
      const rock = new THREE.DodecahedronGeometry(sc, 0);
      rock.scale(1.2, 0.9, 0.65 * reliefScale);
      rock.translate(bx, by, bz + 0.14 * reliefScale);
      parts.push(paintGeometrySolid(rock, '#54483d'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);

  const seaFn = useMemo(() => () => 0.50 * reliefScale, [reliefScale]);

  return (
    <group>
      <mesh geometry={notchOverhangGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.8} />
      </mesh>
      <ConformantWaterMesh
        normSub="해식애"
        category="coastal"
        reliefScale={reliefScale}
        waterLevelFn={seaFn}
        deepColor="#092d42"
        shallowColor="#1b6f87"
        foamColor="#e3f8ff"
        opacity={0.85}
        waveScale={0.85}
      />
      <GroundedPineTrees
        normSub="해식애"
        category="coastal"
        reliefScale={reliefScale}
        coords={[
          [4.8, -4.5],
          [5.6, -1.2],
          [4.5, 2.4],
          [6.2, 5.2],
          [7.4, -2.8],
          [7.1, 1.8],
        ]}
      />
    </group>
  );
};

export const CoastalDuneFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const duneWaterFn = useMemo(
    () => (x: number, y: number) => {
      // Western sea surf zone
      if (x < -5.2) return 0.42 * reliefScale;
      // Interdunal freshwater slack wetland (두웅습지 at (-1.05, 1.15))
      const slackDist = Math.hypot((x + 1.05) / 1.05, (y - 1.15) / 2.55);
      if (slackDist < 1.0) return 0.58 * reliefScale;
      return null;
    },
    [reliefScale]
  );

  return (
    <group>
      <ConformantWaterMesh
        normSub="해안 사구"
        category="coastal"
        reliefScale={reliefScale}
        waterLevelFn={duneWaterFn}
        deepColor="#0f3e54"
        shallowColor="#236f7d"
        foamColor="#e6f5f8"
        opacity={0.84}
        waveScale={0.5}
      />
      {/* Grounded coastal windbreak black pine forest (해송 방풍림) on stable inland back-dune! */}
      <GroundedPineTrees
        normSub="해안 사구"
        category="coastal"
        reliefScale={reliefScale}
        coords={[
          [5.4, -5.5],
          [6.2, -3.4],
          [5.8, -1.1],
          [6.6, 1.2],
          [5.5, 3.5],
          [6.9, 5.4],
          [7.8, -2.2],
          [8.1, 2.6],
          [7.4, -5.8],
        ]}
      />
    </group>
  );
};

export const SandSpitFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const seaFn = useMemo(() => () => 0.52 * reliefScale, [reliefScale]);
  return (
    <group>
      <ConformantWaterMesh
        normSub="사주·사취"
        category="coastal"
        reliefScale={reliefScale}
        waterLevelFn={seaFn}
        deepColor="#0a3147"
        shallowColor="#1f7a8c"
        foamColor="#e8f7eb"
        opacity={0.85}
        waveScale={0.65}
      />
      <GroundedPineTrees
        normSub="사주·사취"
        category="coastal"
        reliefScale={reliefScale}
        coords={[
          [4.4, -3.1, 0.95],
          [4.9, -2.7, 0.8],
          [3.9, -3.4, 0.85],
          [-7.6, 4.5, 1.0],
          [-8.2, -4.2, 0.95],
        ]}
      />
    </group>
  );
};

const LagoonFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const waterFn = useMemo(() => () => 0.55 * reliefScale, [reliefScale]);
  return (
    <group>
      <ConformantWaterMesh
        normSub="석호"
        category="coastal"
        reliefScale={reliefScale}
        waterLevelFn={waterFn}
        deepColor="#0d3b4c"
        shallowColor="#1f6e6e"
        foamColor="#d9f2ee"
        opacity={0.85}
        waveScale={0.45}
      />
      {/* Barrier spit pine windbreak (송지호·경포대 해송림) + western hills */}
      <GroundedPineTrees
        normSub="석호"
        category="coastal"
        reliefScale={reliefScale}
        coords={[
          [2.75, 3.6, 0.72],
          [2.82, 2.2, 0.75],
          [2.78, 0.7, 0.70],
          [2.68, -3.2, 0.74],
          [2.75, -4.6, 0.72],
          [-5.8, 3.2, 1.0],
          [-6.5, -2.5, 1.05],
          [-7.4, 0.2, 0.95],
        ]}
      />
    </group>
  );
};

export const TidalFlatFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const creekWaterFn = useMemo(() => () => 0.33 * reliefScale, [reliefScale]);
  return (
    <ConformantWaterMesh
      normSub="갯벌"
      category="coastal"
      reliefScale={reliefScale}
      waterLevelFn={creekWaterFn}
      deepColor="#1b3c47"
      shallowColor="#365c63"
      foamColor="#9eb8bd"
      opacity={0.82}
      waveScale={0.28}
    />
  );
};

export const WaveCutPlatformFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const platformWaterFn = useMemo(
    () => (x: number, y: number) => {
      const cliffX = getWavePlatformCliffX(y);
      if (x > cliffX - 0.2) return null;
      // Check perched tide pools on the wave-cut bench first!
      for (const p of TIDE_POOL_SPECS) {
        const pd = Math.hypot((x - p.px) / p.rx, (y - p.py) / p.ry);
        if (pd < 1.02) {
          const benchBase = 0.46 + smoothstep(-3.85, cliffX - 0.45, x) * 0.34;
          return (benchBase - 0.04) * reliefScale;
        }
      }
      // Subtidal open sea west of the platform step
      return 0.44 * reliefScale;
    },
    [reliefScale]
  );

  return (
    <group>
      <ConformantWaterMesh
        normSub="파식대"
        category="coastal"
        reliefScale={reliefScale}
        waterLevelFn={platformWaterFn}
        deepColor="#0a2e42"
        shallowColor="#1f7385"
        foamColor="#dcf5fa"
        opacity={0.85}
        waveScale={0.6}
      />
      <GroundedPineTrees
        normSub="파식대"
        category="coastal"
        reliefScale={reliefScale}
        coords={[
          [5.8, -3.5],
          [6.4, 0.6],
          [5.9, 4.2],
          [7.6, -1.2],
        ]}
      />
    </group>
  );
};

// ============================================================================
// 7. Fluvial Special Meshes (선상지, 곡류천, 감입곡류천, 범람원, 삼각주, 하안단구, 폭포)
// ============================================================================
export const AlluvialFanFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  // Spring-line collector stream at fan toe (y ≈ -8.25)
  const toeWaterFn = useMemo(
    () => (_x: number, y: number) => (y < -6.8 ? 0.32 * reliefScale : null),
    [reliefScale]
  );

  return (
    <group>
      <ConformantWaterMesh
        normSub="선상지"
        category="fluvial"
        reliefScale={reliefScale}
        waterLevelFn={toeWaterFn}
        deepColor="#145061"
        shallowColor="#297d8f"
        foamColor="#bce8f0"
        opacity={0.84}
        waveScale={0.25}
      />
      <GroundedPineTrees
        normSub="선상지"
        category="fluvial"
        reliefScale={reliefScale}
        coords={[
          [-5.2, 6.4],
          [-3.4, 7.2],
          [3.6, 6.8],
          [5.8, 5.9],
          [-6.8, 4.8],
          [6.9, 4.6],
        ]}
      />
    </group>
  );
};

export const MeanderingRiverFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const waterFn = useMemo(() => () => 0.56 * reliefScale, [reliefScale]);
  return (
    <group>
      <ConformantWaterMesh
        normSub="곡류천"
        category="fluvial"
        reliefScale={reliefScale}
        waterLevelFn={waterFn}
        deepColor="#114b5c"
        shallowColor="#247685"
        foamColor="#cbeaf0"
        opacity={0.86}
        waveScale={0.32}
      />
      <GroundedPineTrees
        normSub="곡류천"
        category="fluvial"
        reliefScale={reliefScale}
        coords={[
          [-2.2, 0.9, 0.72],
          [-7.6, 4.2, 0.85],
          [-7.8, -3.5, 0.82],
          [6.8, 3.8, 0.85],
          [6.4, -4.4, 0.80],
        ]}
      />
    </group>
  );
};

const IncisedMeanderFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const waterFn = useMemo(() => () => 0.58 * reliefScale, [reliefScale]);
  return (
    <group>
      <ConformantWaterMesh
        normSub="감입곡류천"
        category="fluvial"
        reliefScale={reliefScale}
        waterLevelFn={waterFn}
        deepColor="#0d4454"
        shallowColor="#1d6f80"
        foamColor="#c7edf5"
        opacity={0.88}
        waveScale={0.35}
      />
      <GroundedPineTrees
        normSub="감입곡류천"
        category="fluvial"
        reliefScale={reliefScale}
        coords={[
          [0.0, 1.4, 0.82],
          [-0.9, 0.2, 0.78],
          [0.85, -0.4, 0.76],
          [0.0, -1.8, 0.72],
          [-7.2, -3.8, 0.95],
          [7.4, -3.2, 0.95],
          [0.0, 7.6, 0.92],
        ]}
      />
    </group>
  );
};

export const FloodplainFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const waterFn = useMemo(() => () => 0.60 * reliefScale, [reliefScale]);

  // Grounded hamlet cottages along the dry elevated Natural Levee crest!
  const leveeHousesGeo = useMemo(() => {
    const spots: [number, number][] = [
      [-2.1, -3.2],
      [-2.3, -1.8],
      [-1.9, 2.4],
      [2.2, -2.5],
      [2.5, 3.6],
    ];
    const parts: THREE.BufferGeometry[] = [];
    for (const [hx, hy] of spots) {
      const rx = Math.sin(hy * 0.32) * 1.85 + Math.cos(hy * 0.17) * 0.55 + hx;
      const gz = evaluateTerrainPoint('범람원', 'fluvial', rx, hy, reliefScale).height;
      const wall = new THREE.BoxGeometry(0.28, 0.22, 0.16);
      wall.translate(rx, hy, gz + 0.08);
      parts.push(paintGeometrySolid(wall, '#dfd6c7'));

      const roof = new THREE.ConeGeometry(0.22, 0.14, 4);
      roof.rotateX(Math.PI / 2);
      roof.rotateZ(Math.PI / 4);
      roof.translate(rx, hy, gz + 0.23);
      parts.push(paintGeometrySolid(roof, '#75412b'));
    }
    return mergeColorGeometries(parts);
  }, [reliefScale]);

  return (
    <group>
      <ConformantWaterMesh
        normSub="범람원"
        category="fluvial"
        reliefScale={reliefScale}
        waterLevelFn={waterFn}
        deepColor="#144957"
        shallowColor="#286e75"
        foamColor="#bedee0"
        opacity={0.85}
        waveScale={0.25}
      />
      <mesh geometry={leveeHousesGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.82} />
      </mesh>
    </group>
  );
};

export const DeltaFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const waterFn = useMemo(() => () => 0.50 * reliefScale, [reliefScale]);
  return (
    <ConformantWaterMesh
      normSub="삼각주"
      category="fluvial"
      reliefScale={reliefScale}
      waterLevelFn={waterFn}
      deepColor="#0d3d52"
      shallowColor="#266e73"
      foamColor="#cbe8e3"
      opacity={0.86}
      waveScale={0.42}
    />
  );
};

export const RiverTerraceFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const waterFn = useMemo(() => () => 0.56 * reliefScale, [reliefScale]);
  return (
    <group>
      <ConformantWaterMesh
        normSub="하안단구"
        category="fluvial"
        reliefScale={reliefScale}
        waterLevelFn={waterFn}
        deepColor="#114959"
        shallowColor="#217285"
        foamColor="#ccecf2"
        opacity={0.86}
        waveScale={0.32}
      />
      <GroundedPineTrees
        normSub="하안단구"
        category="fluvial"
        reliefScale={reliefScale}
        coords={[
          [-6.4, -3.2],
          [-6.8, 2.5],
          [8.4, -2.0],
          [8.6, 3.4],
        ]}
      />
    </group>
  );
};

export const WaterfallCascades: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const curtainMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // 1. 3D Overhanging Hard Caprock Lip + Recessed Dark Shale Alcove behind the waterfall!
  const caprockLedgeGeo = useMemo(() => {
    return buildVaultedRoofShell(
      -3.2,
      3.2,
      0.75,
      2.35,
      40,
      20,
      (x, y) => {
        const lipY = getWaterfallLipY(x);
        // Jutting 0.58m forward (-Y) from lipY to create a genuine undercut waterfall ledge!
        if (y < lipY - 0.58 || y > lipY + 0.22) return null;
        const jut = clamp((y - (lipY - 0.58)) / 0.8, 0, 1);
        const inChannel = 1.0 - smoothstep(0.6, 1.35, Math.abs(x));
        const topZ = (4.22 - inChannel * 0.64) * reliefScale;
        const ceilZ = (2.85 + (1.0 - jut) * 0.35) * reliefScale;
        if (topZ <= ceilZ + 0.08 * reliefScale) return null;
        return {
          ceilZ,
          topZ,
          topColor: inChannel > 0.4 ? new THREE.Color('#1c596b') : new THREE.Color('#665e54'),
          innerColor: new THREE.Color('#1a1816'),
        };
      },
      (_x, _y, z) => {
        const b = Math.sin((z / Math.max(0.5, reliefScale)) * 16.0) * 0.5 + 0.5;
        return mixColor('#595147', '#8c8070', b);
      }
    );
  }, [reliefScale]);

  // 2. True Parabolic Free-Falling Horseshoe Water Curtain!
  const waterfallSheetGeo = useMemo(() => {
    const nx = 36;
    const ns = 28;
    const posList: number[] = [];
    const colList: number[] = [];
    const idxList: number[] = [];

    const cCrest = new THREE.Color('#25859c');
    const cFoam = new THREE.Color('#eefaff');
    const tmp = new THREE.Color();

    for (let j = 0; j <= ns; j++) {
      const s = j / ns; // 0 at lip crest -> 1 at plunge pool impact
      for (let i = 0; i <= nx; i++) {
        const x = -1.22 + (i / nx) * 2.44;
        const lipY = getWaterfallLipY(x) - 0.42;
        // Parabolic projectile trajectory forward (-Y) and downward (-Z)
        const y = lipY - s * 1.08;
        const zTop = 3.74 * reliefScale;
        const zBot = 0.52 * reliefScale;
        const z = zTop - (zTop - zBot) * (s * s * 0.85 + s * 0.15);

        // Natural water-curtain rib streaks
        const rib = Math.sin(x * 11.0 + s * 3.0) * 0.035 * Math.sin(s * Math.PI);
        posList.push(x, y + rib, z);

        const froth = clamp(Math.pow(s, 0.7) * 0.85 + (Math.sin(x * 16.0) * 0.5 + 0.5) * 0.25, 0, 1);
        tmp.copy(cCrest).lerp(cFoam, froth);
        colList.push(tmp.r, tmp.g, tmp.b);
      }
    }

    const stride = nx + 1;
    for (let j = 0; j < ns; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * stride + i;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        // Front-facing (-Y/+Z) normal
        idxList.push(a, c, b);
        idxList.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posList), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colList), 3));
    geo.setIndex(idxList);
    geo.computeVertexNormals();
    return geo;
  }, [reliefScale]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (curtainMatRef.current) {
      curtainMatRef.current.opacity = 0.86 + Math.sin(t * 7.5) * 0.05;
    }
  });

  const upperRiverFn = useMemo(
    () => (x: number, y: number) => {
      const lipY = getWaterfallLipY(x);
      return y >= lipY - 0.15 ? 3.80 * reliefScale : null;
    },
    [reliefScale]
  );

  const lowerRiverFn = useMemo(
    () => (x: number, y: number) => {
      const lipY = getWaterfallLipY(x);
      return y <= lipY - 0.35 ? 0.56 * reliefScale : null;
    },
    [reliefScale]
  );

  return (
    <group>
      <mesh geometry={caprockLedgeGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.78} />
      </mesh>

      <mesh geometry={waterfallSheetGeo} castShadow>
        <meshStandardMaterial
          ref={curtainMatRef}
          vertexColors
          roughness={0.12}
          metalness={0.08}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Upper Caprock River */}
      <ConformantWaterMesh
        normSub="폭포"
        category="fluvial"
        reliefScale={reliefScale}
        waterLevelFn={upperRiverFn}
        deepColor="#125063"
        shallowColor="#247c94"
        foamColor="#dcf7ff"
        opacity={0.88}
        waveScale={0.35}
      />

      {/* Lower Plunge Pool & Recession Gorge River */}
      <ConformantWaterMesh
        normSub="폭포"
        category="fluvial"
        reliefScale={reliefScale}
        waterLevelFn={lowerRiverFn}
        deepColor="#0c4252"
        shallowColor="#1f798f"
        foamColor="#eafbff"
        opacity={0.88}
        waveScale={0.65}
      />

      {/* Plunge-pool turbulent whitewater foam ring & spray mist */}
      <VolcanicSteamPlume position={[0, 0.35, 0.62 * reliefScale]} scale={0.72} />

      <GroundedPineTrees
        normSub="폭포"
        category="fluvial"
        reliefScale={reliefScale}
        coords={[
          [-3.8, 3.8],
          [-4.6, 6.2],
          [3.9, 4.1],
          [4.8, 6.5],
          [-4.2, -3.5],
          [4.4, -3.2],
        ]}
      />
    </group>
  );
};

// ============================================================================
// 8. Karst Special Meshes (돌리네, 탑 카르스트)
// ============================================================================
export const DolineFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <GroundedPineTrees
      normSub="돌리네"
      category="karst"
      reliefScale={reliefScale}
      coords={[
        [-6.5, 4.2, 0.85],
        [1.4, 4.8, 0.82],
        [6.8, -2.6, 0.88],
        [-0.8, -5.8, 0.85],
      ]}
    />
  );
};

export const TowerKarstFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const waterFn = useMemo(() => () => 0.52 * reliefScale, [reliefScale]);
  return (
    <ConformantWaterMesh
      normSub="탑 카르스트"
      category="karst"
      reliefScale={reliefScale}
      waterLevelFn={waterFn}
      deepColor="#0c4745"
      shallowColor="#1e7a73"
      foamColor="#c4f0eb"
      opacity={0.87}
      waveScale={0.3}
    />
  );
};

export const FaultMountainFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const axialRiverFn = useMemo(
    () => (x: number, _y: number) => (x < -3.2 ? 0.42 * reliefScale : null),
    [reliefScale]
  );
  return (
    <group>
      <ConformantWaterMesh
        normSub="단층 산맥"
        category="volcanic"
        reliefScale={reliefScale}
        waterLevelFn={axialRiverFn}
        deepColor="#124959"
        shallowColor="#237082"
        foamColor="#c9edf5"
        opacity={0.85}
        waveScale={0.22}
      />
      <GroundedPineTrees
        normSub="단층 산맥"
        category="volcanic"
        reliefScale={reliefScale}
        coords={[
          [3.6, -4.2],
          [5.2, -1.0],
          [4.4, 2.8],
          [6.5, 4.5],
          [7.2, -3.5],
        ]}
      />
    </group>
  );
};

// ============================================================================
// 9. Glacial Special Meshes (혼, U자곡, 피오르드, 권곡, 모레인 + 3D Valley Glacier!)
// ============================================================================
export const GlacialHornFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const tarnWaterFn = useMemo(
    () => (x: number, y: number) => {
      const dNorthTarn = Math.hypot(x / 1.6, (y - 5.2) / 1.4);
      return dNorthTarn <= 1.05 ? 0.64 * reliefScale : null;
    },
    [reliefScale]
  );

  return (
    <ConformantWaterMesh
      normSub="혼"
      category="glacial"
      reliefScale={reliefScale}
      waterLevelFn={tarnWaterFn}
      deepColor="#0e4f61"
      shallowColor="#218599"
      foamColor="#d4f6fc"
      opacity={0.88}
      waveScale={0.2}
    />
  );
};

export const GlacialValleyFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  // Narrow valley-floor meltwater stream ONLY (leaves the flat U-valley meadow dry and green!)
  const meltwaterFn = useMemo(
    () => (x: number, _y: number) => (Math.abs(x) < 2.6 ? 0.44 * reliefScale : null),
    [reliefScale]
  );

  // Bridalveil Waterfall plunging from the carved West Hanging Valley (y ≈ 1.45, x ≈ valleyX - 1.95) down to the U-valley floor!
  const hangingFallGeo = useMemo(() => {
    const valleyX = Math.sin(1.45 * 0.25) * 1.15;
    const lipX = valleyX - 2.02;
    const nx = 14;
    const ns = 22;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];

    for (let j = 0; j <= ns; j++) {
      const s = j / ns;
      for (let i = 0; i <= nx; i++) {
        const y = 1.45 + ((i / nx) - 0.5) * 0.62;
        const x = lipX + s * 0.48;
        const z = (2.74 - (2.74 - 0.42) * (s * s * 0.8 + s * 0.2)) * reliefScale;
        pos.push(x, y, z);
        col.push(0.86, 0.96, 1.0);
      }
    }
    const stride = nx + 1;
    for (let j = 0; j < ns; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * stride + i;
        idx.push(a, a + stride, a + 1);
        idx.push(a + 1, a + stride, a + stride + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, [reliefScale]);

  return (
    <group>
      <mesh geometry={hangingFallGeo}>
        <meshStandardMaterial vertexColors transparent opacity={0.86} roughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <ConformantWaterMesh
        normSub="U자곡"
        category="glacial"
        reliefScale={reliefScale}
        waterLevelFn={meltwaterFn}
        deepColor="#125063"
        shallowColor="#247e94"
        foamColor="#daf7fc"
        opacity={0.86}
        waveScale={0.28}
      />
      <VolcanicSteamPlume
        position={[Math.sin(1.45 * 0.25) * 1.15 - 1.55, 1.45, 0.48 * reliefScale]}
        scale={0.42}
      />
      <GroundedPineTrees
        normSub="U자곡"
        category="glacial"
        reliefScale={reliefScale}
        coords={[
          [-1.3, -4.5, 0.72],
          [1.2, -5.2, 0.78],
          [-1.1, 0.2, 0.75],
          [1.35, 2.8, 0.74],
          [-1.25, 5.4, 0.76],
        ]}
      />
    </group>
  );
};

const CirqueFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  // Enclosed armchair Cirque Tarn (권곡호: sits 100% inside the overdeepened rock bowl behind the y = -2.05 rock lip!)
  const tarnFn = useMemo(
    () => (x: number, y: number) => {
      const d = Math.hypot(x / 2.35, (y - 0.70) / 2.05);
      return d <= 1.05 ? 1.32 * reliefScale : null;
    },
    [reliefScale]
  );

  return (
    <ConformantWaterMesh
      normSub="권곡"
      category="glacial"
      reliefScale={reliefScale}
      waterLevelFn={tarnFn}
      deepColor="#0d4d5e"
      shallowColor="#218599"
      foamColor="#d4f6fc"
      opacity={0.88}
      waveScale={0.28}
    />
  );
};

const MoraineAndGlacierFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  // 1. Sculpted 3D Crevassed Valley Glacier Tongue (빙하 설단) descending from y = +9.9 to snout y ≈ +2.1!
  const glacierTongueGeo = useMemo(() => {
    const nx = 44;
    const ny = 56;
    const xMin = -3.05;
    const xMax = 3.05;
    const yMin = 1.95;
    const yMax = 9.95;
    const stride = nx + 1;

    const posList: number[] = [];
    const colList: number[] = [];
    const idxList: number[] = [];

    const vMap = new Int32Array((nx + 1) * (ny + 1)).fill(-1);
    const iceClean = new THREE.Color('#dceff7');
    const iceCrevasse = new THREE.Color('#287499');
    const medialTill = new THREE.Color('#59524a');
    const tmp = new THREE.Color();

    const evalIceZ = (x: number, y: number): { z: number; col: THREE.Color } | null => {
      const snoutY = 2.05 + 0.16 * x * x;
      const halfW = 2.88 + smoothstep(2.0, 9.5, y) * 0.22;
      if (y < snoutY || Math.abs(x) > halfW) return null;

      const groundZ = evaluateTerrainPoint('모레인', 'glacial', x, y, reliefScale).height;
      const snoutT = smoothstep(snoutY, snoutY + 1.35, y);
      const marginT = smoothstep(halfW, halfW - 0.55, Math.abs(x));
      const dome = Math.pow(snoutT * marginT, 0.55);

      // Arcuate transverse crevasses opening across the convex ice flow!
      const crevPhase = Math.abs(Math.sin((y - 0.14 * x * x) * 3.8 + fbm(x * 1.5, y * 1.5) * 0.9));
      const crevasseCut = (1.0 - smoothstep(0.04, 0.22, crevPhase)) * 0.24 * dome;

      const iceThickness = (0.95 + smoothstep(2.2, 9.8, y) * 0.72) * dome - crevasseCut;
      // Carve subglacial meltwater ice-cave arch at snout center (x ≈ 0, y ≈ snoutY)
      const portalNotch =
        y < snoutY + 0.45 && Math.abs(x) < 0.55
          ? (1.0 - Math.pow(x / 0.55, 2.0)) * (1.0 - (y - snoutY) / 0.45) * 0.42
          : 0;

      const z = groundZ + Math.max(0.02, iceThickness - portalNotch) * reliefScale;

      // Color: bright glacier firn/ice + deep azure crevasses + central dark medial moraine stripe!
      const medialBand = Math.exp(-Math.pow((x - Math.sin(y * 0.25) * 0.25) / 0.28, 2.0)) * 0.78;
      const lateralDebris = smoothstep(halfW - 0.65, halfW, Math.abs(x)) * 0.65;
      const crevBlue = clamp(crevasseCut / 0.18, 0, 1);

      tmp.copy(iceClean).lerp(iceCrevasse, crevBlue * 0.85);
      tmp.lerp(medialTill, Math.max(medialBand, lateralDebris));

      return { z, col: tmp.clone() };
    };

    const zGrid: ( { z: number; col: THREE.Color } | null )[] = new Array((nx + 1) * (ny + 1)).fill(null);
    for (let j = 0; j <= ny; j++) {
      const y = yMin + (j / ny) * (yMax - yMin);
      for (let i = 0; i <= nx; i++) {
        const x = xMin + (i / nx) * (xMax - xMin);
        zGrid[j * stride + i] = evalIceZ(x, y);
      }
    }

    const getV = (i: number, j: number) => {
      const g = j * stride + i;
      if (vMap[g] !== -1) return vMap[g];
      const cell = zGrid[g]!;
      const x = xMin + (i / nx) * (xMax - xMin);
      const y = yMin + (j / ny) * (yMax - yMin);
      const v = posList.length / 3;
      posList.push(x, y, cell.z);
      colList.push(cell.col.r, cell.col.g, cell.col.b);
      vMap[g] = v;
      return v;
    };

    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const g00 = j * stride + i;
        if (!zGrid[g00] || !zGrid[g00 + 1] || !zGrid[g00 + stride] || !zGrid[g00 + stride + 1]) continue;
        const v00 = getV(i, j);
        const v10 = getV(i + 1, j);
        const v01 = getV(i, j + 1);
        const v11 = getV(i + 1, j + 1);
        idxList.push(v00, v10, v01);
        idxList.push(v10, v11, v01);
      }
    }

    // Angular Glacial Erratic Boulders (빙하 표석) perched on the Terminal & Lateral Moraine crests!
    const parts: THREE.BufferGeometry[] = [];
    const iceGeo = new THREE.BufferGeometry();
    iceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posList), 3));
    iceGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colList), 3));
    iceGeo.setIndex(idxList);
    iceGeo.computeVertexNormals();
    parts.push(iceGeo);

    const erratics: [number, number, number][] = [
      [-1.4, -2.45, 0.24],
      [1.35, -2.5, 0.28],
      [-2.35, -1.7, 0.22],
      [2.45, -1.55, 0.25],
      [-3.3, 0.8, 0.26],
      [3.3, 1.2, 0.24],
    ];
    for (const [ex, ey, er] of erratics) {
      const ez = evaluateTerrainPoint('모레인', 'glacial', ex, ey, reliefScale).height;
      const b = new THREE.DodecahedronGeometry(er, 0);
      b.scale(1.15, 0.9, 0.82);
      b.translate(ex, ey, ez + er * 0.45);
      parts.push(paintGeometrySolid(b, '#78726a'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);

  // Moraine-dammed Proglacial Lake (enclosed inside y in [-2.75 + 0.21*x^2, +2.35], |x| < 3.05!)
  const proglacialWaterFn = useMemo(
    () => (x: number, y: number) => {
      const termArcY = -2.85 + 0.21 * x * x;
      if (Math.abs(x) < 3.05 && y > termArcY + 0.1 && y < 2.35) {
        return 1.06 * reliefScale;
      }
      if (y <= termArcY + 0.1 && Math.abs(x) < 3.5) {
        return 0.56 * reliefScale;
      }
      return null;
    },
    [reliefScale]
  );

  return (
    <group>
      <mesh geometry={glacierTongueGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.38} metalness={0.14} />
      </mesh>
      <ConformantWaterMesh
        normSub="모레인"
        category="glacial"
        reliefScale={reliefScale}
        waterLevelFn={proglacialWaterFn}
        deepColor="#14636b"
        shallowColor="#2ba1ab"
        foamColor="#d9fafc"
        opacity={0.9}
        waveScale={0.26}
      />
    </group>
  );
};

export const GlacialFeatures: React.FC<{ reliefScale?: number; isFjord?: boolean }> = ({
  reliefScale = 1.0,
  isFjord = false,
}) => {
  const fjordWaterFn = useMemo(() => () => 0.66 * reliefScale, [reliefScale]);

  if (isFjord) {
    return (
      <group>
        <ConformantWaterMesh
          normSub="피오르드"
          category="glacial"
          reliefScale={reliefScale}
          waterLevelFn={fjordWaterFn}
          deepColor="#072238"
          shallowColor="#145875"
          foamColor="#d4f2fc"
          opacity={0.89}
          waveScale={0.45}
        />
        {/* Direct cliff-to-sea fjord waterfall (7자매 폭포 / 밀포드 보웬 폭포 스타일!) */}
        <VolcanicSteamPlume position={[2.05, -2.4, 0.72 * reliefScale]} scale={0.45} />
      </group>
    );
  }

  return <MoraineAndGlacierFeatures reliefScale={reliefScale} />;
};

// ============================================================================
// 10. Arid Special Meshes (버섯바위 3D Stratified Pedestal Rocks, 오아시스, 사막, 플라야)
// ============================================================================
function buildMushroomRockGeometry(
  cx: number,
  cy: number,
  groundZ: number,
  totalHeight: number,
  capRadius: number,
  neckRadius: number,
  seed: number
): THREE.BufferGeometry {
  const radialSegs = 48;
  const heightSegs = 40;
  const stride = radialSegs + 1;

  const posList: number[] = [];
  const colList: number[] = [];
  const idxList: number[] = [];

  const cDarkBed = new THREE.Color('#7d3f20');
  const cMidSand = new THREE.Color('#bf7743');
  const cPaleChalk = new THREE.Color('#e8c391');
  const tmp = new THREE.Color();

  for (let j = 0; j <= heightSegs; j++) {
    const t = j / heightSegs; // 0 = base on desert pavement, 1 = top crown
    const z = groundZ + t * totalHeight;

    // Authentic wind-abraded pedestal rock profile:
    // 0.00 - 0.12: flared bedrock root anchored on Reg pavement
    // 0.12 - 0.42: severely undercut narrow neck eroded by saltating sand grains (0.5~1.5m zone!)
    // 0.42 - 0.84: overhanging horizontally-bedded resistant sandstone caprock!
    // 0.84 - 1.00: rounded weathered crown
    let rProfile = 0;
    if (t < 0.12) {
      const u = t / 0.12;
      rProfile = neckRadius * (1.85 - 0.85 * smoothstep(0, 1, u));
    } else if (t < 0.42) {
      const u = (t - 0.12) / 0.30;
      const pinch = Math.sin(u * Math.PI);
      rProfile = neckRadius * (1.0 - 0.22 * pinch) + Math.pow(u, 3.2) * (capRadius * 0.28);
    } else if (t < 0.84) {
      const u = (t - 0.42) / 0.42;
      const overhangCurve = Math.sin(u * Math.PI * 0.88 + 0.18);
      const beddingRibs = Math.sin(t * 42.0 + seed) * 0.045 * capRadius;
      rProfile = neckRadius * 1.15 + (capRadius - neckRadius * 1.15) * Math.pow(Math.max(0, overhangCurve), 0.55) + beddingRibs;
    } else {
      const u = (t - 0.84) / 0.16;
      rProfile = capRadius * 0.56 * Math.sqrt(Math.max(0.0004, 1.0 - u * u));
    }

    // Slight windward/leeward cap asymmetry
    const shiftX = t > 0.42 ? Math.sin(seed * 3.1) * 0.14 * capRadius * ((t - 0.42) / 0.58) : 0;

    for (let i = 0; i <= radialSegs; i++) {
      const theta = (i / radialSegs) * Math.PI * 2;
      const lobe =
        1.0 +
        0.09 * Math.sin(theta * 3.0 + seed) +
        0.06 * Math.cos(theta * 5.0 - seed * 1.7) +
        0.03 * Math.sin(theta * 8.0 + t * 10.0);
      const r = Math.max(0.01, rProfile * lobe);

      const vx = cx + shiftX + Math.cos(theta) * r;
      const vy = cy + Math.sin(theta) * r * 0.92;
      posList.push(vx, vy, z);

      // Horizontal sedimentary sandstone & ironstone strata bands
      const bedWave = Math.sin(t * 34.0 + Math.sin(theta * 2.0) * 0.4) * 0.5 + 0.5;
      const fineBed = Math.sin(t * 85.0) * 0.5 + 0.5;
      if (t < 0.40) {
        // Darker wind-polished undercut neck shadow
        tmp.copy(cDarkBed).lerp(cMidSand, bedWave * 0.65);
      } else {
        tmp.copy(cMidSand).lerp(cPaleChalk, bedWave * 0.7 + fineBed * 0.3);
        if (bedWave < 0.18) tmp.lerp(cDarkBed, 0.55);
      }
      colList.push(tmp.r, tmp.g, tmp.b);
    }
  }

  for (let j = 0; j < heightSegs; j++) {
    for (let i = 0; i < radialSegs; i++) {
      const a = j * stride + i;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      // Outward normal winding around Z-axis
      idxList.push(a, b, c);
      idxList.push(b, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posList), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colList), 3));
  geo.setIndex(idxList);
  geo.computeVertexNormals();
  return geo;
}

export const UndercutMushroomRock: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const geo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];

    const specs = [
      { ...MUSHROOM_PEDESTAL_SPECS[0], h: 3.35, capR: 1.62, neckR: 0.30, seed: 1.2 }, // 주 버섯바위
      { ...MUSHROOM_PEDESTAL_SPECS[1], h: 2.55, capR: 1.18, neckR: 0.24, seed: 3.7 }, // 제2 버섯바위
      { ...MUSHROOM_PEDESTAL_SPECS[2], h: 2.25, capR: 1.05, neckR: 0.22, seed: 5.4 }, // 제3 버섯바위
    ];

    for (const sp of specs) {
      const gz = evaluateTerrainPoint('버섯바위', 'arid', sp.mx, sp.my, reliefScale).height - 0.04;
      parts.push(
        buildMushroomRockGeometry(
          sp.mx,
          sp.my,
          gz,
          sp.h * reliefScale,
          sp.capR,
          sp.neckR,
          sp.seed
        )
      );
    }

    // Wind-faceted 3-edged Ventifacts (삼릉석) scattered across the Reg desert pavement!
    const ventifacts: [number, number, number][] = [
      [-2.3, -2.6, 0.24],
      [2.5, -2.1, 0.28],
      [-3.4, -0.8, 0.20],
      [1.9, 3.4, 0.22],
      [-1.5, 3.8, 0.25],
      [5.2, -1.4, 0.26],
      [-5.6, -3.2, 0.23],
    ];
    for (const [vx, vy, vr] of ventifacts) {
      const vz = evaluateTerrainPoint('버섯바위', 'arid', vx, vy, reliefScale).height;
      // Tetrahedron/Cone-like sharp 3-ridged wind-polished stone!
      const stone = new THREE.ConeGeometry(vr, vr * 0.72 * reliefScale, 3);
      stone.rotateX(Math.PI / 2);
      stone.rotateZ(vx * 1.7 + vy);
      stone.translate(vx, vy, vz + vr * 0.22 * reliefScale);
      parts.push(paintGeometrySolid(stone, '#8c6239'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);

  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.86} metalness={0.04} />
    </mesh>
  );
};

export const OasisPalms: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const springWaterFn = useMemo(
    () => (x: number, y: number) => {
      const lakeArcY = -0.55 + 0.22 * x * x;
      const dLake = Math.hypot(x / 2.25, (y - lakeArcY) / 1.25);
      return dLake <= 1.15 ? 0.64 * reliefScale : null;
    },
    [reliefScale]
  );

  // Grounded +Z curved Date Palm trees & Adobe Oasis Pavilion (둔황 월아천·시와 오아시스 분위기!)
  const oasisPropsGeo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];
    const palmCoords: [number, number, number][] = [
      [-2.25, -0.1, 1.0],
      [-1.75, 0.95, 0.92],
      [-0.65, 1.15, 1.05],
      [0.85, 1.05, 0.95],
      [1.95, 0.75, 1.02],
      [2.35, -0.15, 0.88],
      [-1.55, -1.55, 0.85],
      [1.45, -1.65, 0.90],
    ];

    for (const [px, py, sc] of palmCoords) {
      const gz = evaluateTerrainPoint('오아시스', 'arid', px, py, reliefScale).height;
      const trunkH = 0.95 * sc;
      const leanX = (px > 0 ? 0.08 : -0.08) * sc;

      const trunk = new THREE.CylinderGeometry(0.042 * sc, 0.068 * sc, trunkH, 7);
      trunk.rotateX(Math.PI / 2); // +Z upright!
      trunk.translate(px + leanX * 0.5, py, gz + trunkH * 0.48);
      parts.push(paintGeometrySolid(trunk, '#6b4c30'));

      const topZ = gz + trunkH * 0.94;
      for (let f = 0; f < 7; f++) {
        const ang = (f / 7) * Math.PI * 2 + px;
        const frond = new THREE.ConeGeometry(0.11 * sc, 0.52 * sc, 4);
        frond.scale(1.0, 1.0, 0.28);
        // Orient frond outward horizontally and drooping slightly
        frond.rotateZ(-Math.PI / 2 + 0.35);
        frond.rotateY(0);
        const holder = new THREE.Matrix4().makeRotationZ(ang);
        frond.applyMatrix4(holder);
        frond.translate(px + leanX + Math.cos(ang) * 0.22 * sc, py + Math.sin(ang) * 0.22 * sc, topZ);
        parts.push(paintGeometrySolid(frond, f % 2 === 0 ? '#2b6e22' : '#3d8731'));
      }
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);

  return (
    <group>
      <ConformantWaterMesh
        normSub="오아시스"
        category="arid"
        reliefScale={reliefScale}
        waterLevelFn={springWaterFn}
        deepColor="#085866"
        shallowColor="#1996a8"
        foamColor="#bef5fa"
        opacity={0.9}
        waveScale={0.22}
      />
      <mesh geometry={oasisPropsGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.82} />
      </mesh>
    </group>
  );
};

export const DesertFeatures: React.FC<{ reliefScale?: number }> = () => null;

const PlayaBrineFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  // Subtle mirror-like shallow brine film pockets inside the central salt pan (우유니 거울 염수막!)
  const brineFn = useMemo(
    () => (x: number, y: number) => {
      const rx = 7.4 + Math.sin(y * 0.4) * 0.45;
      const ry = y > 0 ? 6.6 : 9.2;
      const rBasin = Math.hypot(x / rx, y / ry);
      if (rBasin > 0.72) return null;
      const pocket = fbm(x * 0.45 + 2.1, y * 0.45, 2);
      return pocket > 0.52 ? 0.318 * reliefScale : null;
    },
    [reliefScale]
  );

  return (
    <ConformantWaterMesh
      normSub="플라야"
      category="arid"
      reliefScale={reliefScale}
      waterLevelFn={brineFn}
      deepColor="#9ec5db"
      shallowColor="#cfe6f2"
      foamColor="#ffffff"
      opacity={0.52}
      waveScale={0.05}
      roughness={0.02}
    />
  );
};

// ============================================================================
// Main Dispatcher: TerrainSpecialMeshes
// ============================================================================
export const TerrainSpecialMeshes: React.FC<{
  normSub: string;
  category: string;
  reliefScale: number;
}> = ({ normSub, category, reliefScale }) => {
  // 1. Volcanic Category
  if (normSub === '화산') {
    return (
      <group>
        <AnimatedLavaLake elevation={3.28 * reliefScale} radius={0.82} />
        <VolcanicSteamPlume position={[0, 0, 3.65 * reliefScale]} scale={0.95} />
      </group>
    );
  }
  if (normSub === '순상화산') {
    return (
      <group>
        <AnimatedLavaLake position={[-0.22, -0.18, 1.98 * reliefScale]} radius={0.76} />
        <VolcanicSteamPlume position={[-0.22, -0.18, 2.35 * reliefScale]} scale={0.75} />
      </group>
    );
  }
  if (normSub === '종상화산') {
    const seaFn = (x: number, y: number) =>
      y < -5.2 + Math.sin(x * 0.35) * 0.65 ? (getBaseWaterElevation('종상화산', reliefScale) ?? 0.42) : null;
    return (
      <ConformantWaterMesh
        normSub="종상화산"
        category={category}
        reliefScale={reliefScale}
        waterLevelFn={seaFn}
        deepColor="#0a293d"
        shallowColor="#19637a"
        foamColor="#dcf4fc"
        opacity={0.86}
        waveScale={0.65}
      />
    );
  }
  if (normSub === '용암대지') {
    const gorgeWaterFn = () => getBaseWaterElevation('용암대지', reliefScale);
    return (
      <ConformantWaterMesh
        normSub="용암대지"
        category={category}
        reliefScale={reliefScale}
        waterLevelFn={gorgeWaterFn}
        deepColor="#0e424f"
        shallowColor="#1e6f80"
        foamColor="#cdeff5"
        opacity={0.88}
        waveScale={0.32}
      />
    );
  }
  if (normSub === '수성화산') {
    const seaFn = (x: number, y: number) => {
      // Exclude the dry grassy bowl inside Seongsan Ilchulbong crater!
      if (Math.hypot(x - 0.8, y - 0.5) < 3.1) return null;
      return getBaseWaterElevation('수성화산', reliefScale);
    };
    return (
      <ConformantWaterMesh
        normSub="수성화산"
        category={category}
        reliefScale={reliefScale}
        waterLevelFn={seaFn}
        deepColor="#092d42"
        shallowColor="#1a6f85"
        foamColor="#dff6fc"
        opacity={0.86}
        waveScale={0.7}
      />
    );
  }
  if (normSub === '기생화산') {
    const craterPondFn = (x: number, y: number) =>
      Math.hypot(x + 0.9, y - 0.7) < 1.25 ? 2.24 * reliefScale : null;
    return (
      <ConformantWaterMesh
        normSub="기생화산"
        category={category}
        reliefScale={reliefScale}
        waterLevelFn={craterPondFn}
        deepColor="#144538"
        shallowColor="#266e59"
        foamColor="#b8e6d8"
        opacity={0.86}
        waveScale={0.18}
      />
    );
  }
  if (normSub === '칼데라') {
    return <CalderaLakeFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '주상절리') {
    return <ColumnarJointingColumns reliefScale={reliefScale} />;
  }
  if (normSub === '용암동굴') {
    return <CavePortalFeatures reliefScale={reliefScale} isLavaTube={true} />;
  }
  if (normSub === '단층 산맥') {
    return <FaultMountainFeatures reliefScale={reliefScale} />;
  }

  // 2. Coastal Category
  if (normSub === '갯벌') {
    return <TidalFlatFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '해식애') {
    return <SeaCliffFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '시스택') {
    return <SeaArchAndStack reliefScale={reliefScale} />;
  }
  if (normSub === '해안 사구') {
    return <CoastalDuneFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '사주·사취') {
    return <SandSpitFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '석호') {
    return <LagoonFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '파식대') {
    return <WaveCutPlatformFeatures reliefScale={reliefScale} />;
  }

  // 3. Fluvial Category
  if (normSub === '선상지') {
    return <AlluvialFanFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '곡류천') {
    return <MeanderingRiverFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '감입곡류천') {
    return <IncisedMeanderFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '범람원') {
    return <FloodplainFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '삼각주') {
    return <DeltaFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '하안단구') {
    return <RiverTerraceFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '폭포') {
    return <WaterfallCascades reliefScale={reliefScale} />;
  }

  // 4. Karst Category
  if (normSub === '돌리네') {
    return <DolineFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '탑 카르스트') {
    return <TowerKarstFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '석회동굴') {
    return <CavePortalFeatures reliefScale={reliefScale} isLavaTube={false} />;
  }

  // 5. Glacial Category
  if (normSub === '혼') {
    return <GlacialHornFeatures reliefScale={reliefScale} />;
  }
  if (normSub === 'U자곡') {
    return <GlacialValleyFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '피오르드') {
    return <GlacialFeatures reliefScale={reliefScale} isFjord={true} />;
  }
  if (normSub === '권곡') {
    return <CirqueFeatures reliefScale={reliefScale} />;
  }
  if (normSub === '모레인') {
    return <GlacialFeatures reliefScale={reliefScale} isFjord={false} />;
  }

  // 6. Arid Category
  if (normSub === '버섯바위') {
    return <UndercutMushroomRock reliefScale={reliefScale} />;
  }
  if (normSub === '오아시스') {
    return <OasisPalms reliefScale={reliefScale} />;
  }
  if (normSub === '플라야') {
    return <PlayaBrineFeatures reliefScale={reliefScale} />;
  }

  return null;
};
