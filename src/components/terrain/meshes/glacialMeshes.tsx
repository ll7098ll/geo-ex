import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  evaluateTerrainPoint,
  fbm,
  clamp,
  smoothstep,
} from '../terrainGenerators';
import {
  useDisposeGeometry,
  mergeColorGeometries,
  paintGeometrySolid,
  ConformantWaterMesh,
  GroundedPineTrees,
} from './shared';
import { VolcanicSteamPlume } from './volcanicMeshes';

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
  useDisposeGeometry(hangingFallGeo);

  return (
    <group>
      <mesh geometry={hangingFallGeo}>
        <meshStandardMaterial vertexColors transparent opacity={0.86} roughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <ConformantWaterMesh
        normSub="U자곡"
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

export const CirqueFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
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

      const groundZ = evaluateTerrainPoint('모레인', x, y, reliefScale).height;
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
      const ez = evaluateTerrainPoint('모레인', ex, ey, reliefScale).height;
      const b = new THREE.DodecahedronGeometry(er, 0);
      b.scale(1.15, 0.9, 0.82);
      b.translate(ex, ey, ez + er * 0.45);
      parts.push(paintGeometrySolid(b, '#78726a'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);
  useDisposeGeometry(glacierTongueGeo);

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

