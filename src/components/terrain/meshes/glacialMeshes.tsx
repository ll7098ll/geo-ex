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
    () => (x: number, y: number) => {
      const valleyX = Math.sin(y * 0.25) * 1.15;
      return Math.abs(x - valleyX) < 2.9 ? 0.44 * reliefScale : null;
    },
    [reliefScale]
  );

  // Separate perched stream mesh along the West Hanging Valley floor right up to the waterfall lip
  const hangingStreamFn = useMemo(
    () => (x: number, y: number) => {
      const valleyX = Math.sin(y * 0.25) * 1.15;
      const hvAxisY = 1.45 + Math.sin((x + 4.0) * 0.35) * 0.40;
      if (x <= valleyX - 3.35 && Math.abs(y - hvAxisY) < 0.65) {
        return (2.74 + Math.max(0, -x - 3.6) * 0.06) * reliefScale;
      }
      return null;
    },
    [reliefScale]
  );

  // Bridalveil Waterfall plunging cleanly from the carved West Hanging Valley lip (x ≈ valleyX - 3.55) to the cliff-base plunge pool!
  const hangingFallGeo = useMemo(() => {
    const valleyX = Math.sin(1.45 * 0.25) * 1.15;
    const lipX = valleyX - 3.60;
    const plungeX = valleyX - 2.22;
    const nx = 18;
    const ns = 28;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];

    const cTop = new THREE.Color('#4aa3bd');
    const cFoam = new THREE.Color('#eefaff');
    const tmp = new THREE.Color();

    for (let j = 0; j <= ns; j++) {
      const s = j / ns;
      for (let i = 0; i <= nx; i++) {
        const u = i / nx - 0.5;
        const width = 0.52 + s * 0.24;
        const y = 1.45 + u * width;
        const x = lipX + s * (plungeX - lipX);
        const zTop = 2.75 * reliefScale;
        const zBot = 0.40 * reliefScale;
        const z = zTop - (zTop - zBot) * Math.pow(s, 1.85);
        const rib = Math.sin(u * 14.0 + s * 3.0) * 0.025 * Math.sin(s * Math.PI);
        pos.push(x + rib, y, z);

        const froth = clamp(Math.pow(s, 0.72) * 0.85 + 0.15, 0, 1);
        tmp.copy(cTop).lerp(cFoam, froth);
        col.push(tmp.r, tmp.g, tmp.b);
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

  const plungePosX = Math.sin(1.45 * 0.25) * 1.15 - 2.22;

  return (
    <group>
      <mesh geometry={hangingFallGeo}>
        <meshStandardMaterial vertexColors transparent opacity={0.88} roughness={0.14} side={THREE.DoubleSide} />
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
      <ConformantWaterMesh
        normSub="U자곡"
        reliefScale={reliefScale}
        waterLevelFn={hangingStreamFn}
        deepColor="#165d70"
        shallowColor="#2c8fa6"
        foamColor="#e2f9ff"
        opacity={0.86}
        waveScale={0.22}
      />
      <VolcanicSteamPlume
        position={[plungePosX, 1.45, 0.46 * reliefScale]}
        scale={0.40}
      />
      <GroundedPineTrees
        normSub="U자곡"
        reliefScale={reliefScale}
        coords={[
          [-0.15, -4.5, 0.72],
          [0.35, -5.4, 0.78],
          [-1.25, 0.2, 0.75],
          [-0.45, 2.8, 0.74],
          [2.15, 3.2, 0.72],
          [-0.35, 5.4, 0.76],
          [1.85, 5.2, 0.70],
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
  // 1. Sculpted 3D Crevassed Valley Glacier Tongue (빙하 설단) with sealed back wall & grounded snout edge!
  const glacierTongueGeo = useMemo(() => {
    const nx = 48;
    const ny = 60;
    const xMin = -3.08;
    const xMax = 3.08;
    const yMin = 1.92;
    const yMax = 9.98;
    const stride = nx + 1;

    const posList: number[] = [];
    const colList: number[] = [];
    const idxList: number[] = [];

    const vMap = new Int32Array((nx + 1) * (ny + 1)).fill(-1);
    const iceClean = new THREE.Color('#dceff7');
    const iceCrevasse = new THREE.Color('#287499');
    const medialTill = new THREE.Color('#59524a');
    const tmp = new THREE.Color();

    const evalIceZ = (x: number, y: number): { z: number; groundZ: number; col: THREE.Color } | null => {
      const snoutY = 2.05 + 0.16 * x * x;
      const halfW = 2.90 + smoothstep(2.0, 9.5, y) * 0.22;
      if (y < snoutY - 0.08 || Math.abs(x) > halfW + 0.08) return null;

      const groundZ = evaluateTerrainPoint('모레인', x, y, reliefScale).height;
      const snoutT = smoothstep(snoutY - 0.06, snoutY + 1.35, y);
      const marginT = smoothstep(halfW + 0.06, halfW - 0.55, Math.abs(x));
      const dome = Math.pow(snoutT * marginT, 0.55);

      // Arcuate transverse crevasses opening across the convex ice flow!
      const crevPhase = Math.abs(Math.sin((y - 0.14 * x * x) * 3.8 + fbm(x * 1.5, y * 1.5) * 0.9));
      const crevasseCut = (1.0 - smoothstep(0.04, 0.22, crevPhase)) * 0.24 * dome;

      const iceThickness = (0.95 + smoothstep(2.2, 9.8, y) * 0.72) * dome - crevasseCut;
      // Carve subglacial meltwater ice-cave arch at snout center (x ≈ 0, y ≈ snoutY)
      const portalNotch =
        y < snoutY + 0.45 && Math.abs(x) < 0.55
          ? (1.0 - Math.pow(x / 0.55, 2.0)) * (1.0 - Math.max(0, y - snoutY) / 0.45) * 0.42
          : 0;

      // Tuck perimeter slightly beneath DEM ground so snout/flanks never float
      const edgeTuck = (1.0 - clamp(dome * 4.0, 0, 1)) * 0.04;
      const z = groundZ + (Math.max(0.0, iceThickness - portalNotch) - edgeTuck) * reliefScale;

      // Color: bright glacier firn/ice + deep azure crevasses + central dark medial moraine stripe!
      const medialBand = Math.exp(-Math.pow((x - Math.sin(y * 0.25) * 0.25) / 0.28, 2.0)) * 0.78;
      const lateralDebris = smoothstep(halfW - 0.65, halfW, Math.abs(x)) * 0.65;
      const crevBlue = clamp(crevasseCut / 0.18, 0, 1);

      tmp.copy(iceClean).lerp(iceCrevasse, crevBlue * 0.85);
      tmp.lerp(medialTill, Math.max(medialBand, lateralDebris));

      return { z, groundZ, col: tmp.clone() };
    };

    const zGrid: ({ z: number; groundZ: number; col: THREE.Color } | null)[] = new Array((nx + 1) * (ny + 1)).fill(
      null
    );
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

    // Seal the back cross-section edge (j = ny, y = yMax) cleanly down to bedrock DEM so it's solid from behind!
    const backWallCol = new THREE.Color('#9ec6db');
    for (let i = 0; i < nx; i++) {
      const g0 = ny * stride + i;
      const g1 = g0 + 1;
      const c0 = zGrid[g0];
      const c1 = zGrid[g1];
      if (!c0 || !c1) continue;
      const x0 = xMin + (i / nx) * (xMax - xMin);
      const x1 = xMin + ((i + 1) / nx) * (xMax - xMin);
      const b = posList.length / 3;
      posList.push(x0, yMax, c0.z, x1, yMax, c1.z, x0, yMax, c0.groundZ - 0.04, x1, yMax, c1.groundZ - 0.04);
      for (let k = 0; k < 4; k++) {
        colList.push(backWallCol.r, backWallCol.g, backWallCol.b);
      }
      // Outward +Y normal
      idxList.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
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

  // Moraine-dammed Proglacial Lake + Sloped Braided Meltwater Channels ONLY (sandur gravel stays dry!)
  const proglacialWaterFn = useMemo(
    () => (x: number, y: number) => {
      const termArcY = -2.85 + 0.21 * x * x;
      if (Math.abs(x) < 3.05 && y > termArcY + 0.1 && y < 2.35) {
        return 1.06 * reliefScale;
      }
      if (y <= termArcY + 0.1 && Math.abs(x) < 3.8) {
        // Sits cleanly inside the carved braided meltwater channels (depth ~0.24m) while dry sandur stays above!
        const outwashSlope = smoothstep(-10.0, -2.5, y) * 0.30;
        return (0.48 + outwashSlope) * reliefScale;
      }
      return null;
    },
    [reliefScale]
  );

  return (
    <group>
      <mesh geometry={glacierTongueGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.44} metalness={0.08} />
      </mesh>
      <ConformantWaterMesh
        normSub="모레인"
        reliefScale={reliefScale}
        waterLevelFn={proglacialWaterFn}
        deepColor="#14636b"
        shallowColor="#26929c"
        foamColor="#96d1db"
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

  // Direct cliff-to-sea fjord waterfall (7자매 폭포 / 밀포드 보웬 폭포 스타일 — 동적 절벽 샘플링으로 정확히 정렬!)
  const fjordFallData = useMemo(() => {
    if (!isFjord) return null;
    const wfY = -2.4;
    const mainX = Math.sin(wfY * 0.26) * 1.65 - 0.35;

    let xShore = mainX + 2.2;
    let xCrest = mainX + 3.4;
    let zCrest = 3.6 * reliefScale;

    for (let sx = mainX + 1.5; sx <= mainX + 5.0; sx += 0.08) {
      const hz = evaluateTerrainPoint('피오르드', sx, wfY, reliefScale).height;
      if (hz < 0.72 * reliefScale) {
        xShore = sx;
      }
      if (hz >= 3.45 * reliefScale) {
        xCrest = sx;
        zCrest = hz;
        break;
      }
    }

    const nx = 10;
    const ns = 24;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const cTop = new THREE.Color('#7ec8db');
    const cFoam = new THREE.Color('#f0fbff');
    const tmp = new THREE.Color();

    for (let j = 0; j <= ns; j++) {
      const s = j / ns;
      for (let i = 0; i <= nx; i++) {
        const u = i / nx - 0.5;
        const width = 0.24 + s * 0.20;
        const y = wfY + u * width;
        const x = xCrest - s * (xCrest - (xShore - 0.08));
        const z = zCrest - (zCrest - 0.64 * reliefScale) * Math.pow(s, 1.55);
        pos.push(x, y, z);

        tmp.copy(cTop).lerp(cFoam, clamp(Math.pow(s, 0.65), 0, 1));
        col.push(tmp.r, tmp.g, tmp.b);
      }
    }
    const stride = nx + 1;
    for (let j = 0; j < ns; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * stride + i;
        idx.push(a, a + 1, a + stride);
        idx.push(a + 1, a + stride + 1, a + stride);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return { geo, mistPos: [xShore - 0.06, wfY, 0.70 * reliefScale] as [number, number, number] };
  }, [isFjord, reliefScale]);
  useDisposeGeometry(fjordFallData?.geo ?? null);

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
        {fjordFallData && (
          <>
            <mesh geometry={fjordFallData.geo}>
              <meshStandardMaterial vertexColors transparent opacity={0.84} roughness={0.14} side={THREE.DoubleSide} />
            </mesh>
            <VolcanicSteamPlume position={fjordFallData.mistPos} scale={0.34} />
          </>
        )}
      </group>
    );
  }

  return <MoraineAndGlacierFeatures reliefScale={reliefScale} />;
};

