import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  evaluateTerrainPoint,
  clamp,
  smoothstep,
} from '../terrainGenerators';

function useDisposeGeometry(geo: THREE.BufferGeometry | null | undefined) {
  useEffect(() => {
    return () => {
      geo?.dispose();
    };
  }, [geo]);
}

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
          terrainH[idx] = evaluateTerrainPoint(normSub, x, y, reliefScale).height;
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
  }, [normSub, reliefScale, waterLevelFn, deepColor, shallowColor, foamColor, segments]);

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

  useDisposeGeometry(waterData.geometry);

  if (waterData.topVertCount === 0) return null;

  return (
    <mesh geometry={waterData.geometry} receiveShadow>
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

// ============================================================================
// 2. Grounded +Z-Upright Ecological & Geomorphic Micro-Props
// ============================================================================
export const GroundedPineTrees: React.FC<{
  normSub: string;
  reliefScale: number;
  coords: [number, number, number?][];
  foliageColor?: string;
}> = ({ normSub, reliefScale, coords, foliageColor = '#234a1e' }) => {
  const geo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];
    for (const [tx, ty, customScale] of coords) {
      const gz = evaluateTerrainPoint(normSub, tx, ty, reliefScale).height;
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
  }, [normSub, reliefScale, coords, foliageColor]);
  useDisposeGeometry(geo);

  if (!geo) return null;
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.86} />
    </mesh>
  );
};


export { useDisposeGeometry, mergeColorGeometries, paintGeometrySolid };

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


export { buildVaultedRoofShell };
