import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  evaluateTerrainPoint,
  fbm,
  smoothstep,
  mixColor,
} from '../terrainGenerators';
import {
  getSeaCliffEdgeX,
  getWavePlatformCliffX,
  SEA_STACK_SPECS,
  TIDE_POOL_SPECS,
} from '../generators/coastal';
import {
  useDisposeGeometry,
  mergeColorGeometries,
  paintGeometrySolid,
  buildVaultedRoofShell,
  ConformantWaterMesh,
  GroundedPineTrees,
} from './shared';

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

    // Natural organic lobed stratified caprock shelves matching each sea stack's contour (zero circular bottle-caps!)
    for (const s of SEA_STACK_SPECS.slice(0, 3)) {
      const radialSegs = 28;
      const tiers = 5;
      const capPos: number[] = [];
      const capCol: number[] = [];
      const capIdx: number[] = [];
      const cosR = Math.cos(s.rot);
      const sinR = Math.sin(s.rot);
      const zBot = (s.h - 0.68) * reliefScale;
      const zTop = (s.h - 0.14) * reliefScale;

      for (let t = 0; t <= tiers; t++) {
        const vf = t / tiers;
        const z = zBot + (zTop - zBot) * vf;
        // Slight wave-cut overhang: narrower bottom waist (0.86) flaring to stratified resistant caprock (0.97) then tucking to crown (0.88)
        const profileScale = vf < 0.65 ? 0.84 + (vf / 0.65) * 0.13 : 0.97 - ((vf - 0.65) / 0.35) * 0.08;
        const strata = Math.sin((z / Math.max(0.5, reliefScale)) * 12.5 + s.sx * 0.3) * 0.5 + 0.5;
        const ringCol = mixColor('#544639', '#8f7760', strata);

        for (let k = 0; k < radialSegs; k++) {
          const ang = (k / radialSegs) * Math.PI * 2;
          const shapeMod = 1.0 + 0.12 * Math.sin(ang * 3.0 + s.rot * 2.0) + 0.08 * Math.cos(ang * 4.0);
          const lx = Math.cos(ang) * s.rx * shapeMod * profileScale;
          const ly = Math.sin(ang) * s.ry * shapeMod * profileScale;
          const wx = s.sx + lx * cosR - ly * sinR;
          const wy = s.sy + lx * sinR + ly * cosR;
          capPos.push(wx, wy, z);
          capCol.push(ringCol.r, ringCol.g, ringCol.b);
        }
      }

      for (let t = 0; t < tiers; t++) {
        for (let k = 0; k < radialSegs; k++) {
          const kn = (k + 1) % radialSegs;
          const a = t * radialSegs + k;
          const b = t * radialSegs + kn;
          const c = (t + 1) * radialSegs + k;
          const d = (t + 1) * radialSegs + kn;
          capIdx.push(a, b, d, a, d, c);
        }
      }

      // Seal bottom underside of overhanging ledge & top crown center
      const botCenter = capPos.length / 3;
      const darkUnder = new THREE.Color('#2d251e');
      capPos.push(s.sx, s.sy, zBot);
      capCol.push(darkUnder.r, darkUnder.g, darkUnder.b);
      for (let k = 0; k < radialSegs; k++) {
        const kn = (k + 1) % radialSegs;
        capIdx.push(botCenter, kn, k);
      }

      const topCenter = capPos.length / 3;
      const topCol = new THREE.Color('#6b7346');
      const topRingBase = tiers * radialSegs;
      capPos.push(s.sx, s.sy, zTop + 0.04 * reliefScale);
      capCol.push(topCol.r, topCol.g, topCol.b);
      for (let k = 0; k < radialSegs; k++) {
        const kn = (k + 1) % radialSegs;
        capIdx.push(topCenter, topRingBase + k, topRingBase + kn);
      }

      const capGeo = new THREE.BufferGeometry();
      capGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(capPos), 3));
      capGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(capCol), 3));
      capGeo.setIndex(capIdx);
      capGeo.computeVertexNormals();
      parts.push(capGeo);
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);
  useDisposeGeometry(seaArchGeo);

  const seaFn = useMemo(() => () => 0.50 * reliefScale, [reliefScale]);

  return (
    <group>
      <mesh geometry={seaArchGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.76} />
      </mesh>
      <ConformantWaterMesh
        normSub="시스택"
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

export const SeaCliffFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  // 3D Overhanging Wave-Cut Notch Visor built in cliff-following curvilinear (relX, y) coordinates!
  // Eliminates diagonal rectilinear sawtooth clipping completely while carving a shadowed basal sea-notch.
  const notchOverhangGeo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];

    const ny = 96;
    const nx = 10;
    const yMin = -9.4;
    const yMax = 9.4;
    const stride = nx + 1;

    const topPos: number[] = [];
    const topCol: number[] = [];
    const botPos: number[] = [];
    const botCol: number[] = [];

    const innerShadow = new THREE.Color('#1c1714');

    for (let j = 0; j <= ny; j++) {
      const y = yMin + (j / ny) * (yMax - yMin);
      const cx = getSeaCliffEdgeX(y);
      const endTaper = smoothstep(0.0, 0.08, j / ny) * smoothstep(1.0, 0.92, j / ny);
      const browWave = Math.sin(y * 0.95) * 0.09 + Math.cos(y * 1.85) * 0.05;

      for (let i = 0; i <= nx; i++) {
        const u = i / nx; // 0 = seaward brow tip, 1 = tucked cleanly inside the DEM cliff wall
        const maxJut = (0.76 + browWave) * (0.35 + 0.65 * endTaper);
        const relX = -maxJut * (1.0 - u) + 0.08 * u;
        const x = cx + relX;

        const demZ = evaluateTerrainPoint('해식애', x, y, 1.0).height;
        // Shadowed basal wave-cut notch ceiling: curves upward from inside cliff base to brow lip
        const ceilBase = 1.02 + Math.pow(1.0 - u, 1.35) * 0.34 + browWave * 0.35;
        // Upper rock visor slope: tapers cleanly to brow edge at u=0 and blends flush inside cliff face at u=1
        const topBase = Math.min(
          Math.max(demZ - 0.02, ceilBase + 0.06),
          ceilBase + 0.06 + Math.pow(u, 0.85) * 1.25
        );

        const topZ = topBase * reliefScale;
        const ceilZ = ceilBase * reliefScale;

        const strata = Math.sin(topBase * 14.0 + y * 0.25) * 0.5 + 0.5;
        const major = Math.sin(topBase * 3.8) * 0.5 + 0.5;
        const tc = mixColor('#42372f', '#7f6e5c', strata * 0.7 + major * 0.3);

        topPos.push(x, y, topZ);
        topCol.push(tc.r, tc.g, tc.b);

        botPos.push(x, y, ceilZ);
        botCol.push(innerShadow.r, innerShadow.g, innerShadow.b);
      }
    }

    const totalGrid = (nx + 1) * (ny + 1);
    const vPos = new Float32Array(totalGrid * 2 * 3);
    const vCol = new Float32Array(totalGrid * 2 * 3);
    vPos.set(topPos, 0);
    vPos.set(botPos, totalGrid * 3);
    vCol.set(topCol, 0);
    vCol.set(botCol, totalGrid * 3);

    const vIdx: number[] = [];
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * stride + i;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        // Top visor surface (+Z normal)
        vIdx.push(a, b, d, a, d, c);
        // Underside notch ceiling (-Z normal)
        const ba = totalGrid + a;
        const bb = totalGrid + b;
        const bc = totalGrid + c;
        const bd = totalGrid + d;
        vIdx.push(ba, bc, bd, ba, bd, bb);
      }
      // Seaward front lip closure (i = 0)
      const t0 = j * stride;
      const t1 = (j + 1) * stride;
      const b0 = totalGrid + t0;
      const b1 = totalGrid + t1;
      vIdx.push(t0, t1, b1, t0, b1, b0);
    }

    const visorGeo = new THREE.BufferGeometry();
    visorGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
    visorGeo.setAttribute('color', new THREE.BufferAttribute(vCol, 3));
    visorGeo.setIndex(vIdx);
    visorGeo.computeVertexNormals();
    parts.push(visorGeo);

    // Fallen angular rockfall talus blocks on the wave-cut bench
    for (const [by, offX, sc] of [
      [-5.2, -1.05, 0.32],
      [-1.8, -0.95, 0.38],
      [1.4, -1.15, 0.28],
      [4.6, -1.0, 0.35],
    ]) {
      const bx = getSeaCliffEdgeX(by) + offX;
      const bz = evaluateTerrainPoint('해식애', bx, by, reliefScale).height;
      const rock = new THREE.DodecahedronGeometry(sc, 0);
      rock.scale(1.2, 0.9, 0.65 * reliefScale);
      rock.translate(bx, by, bz + 0.14 * reliefScale);
      parts.push(paintGeometrySolid(rock, '#54483d'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);
  useDisposeGeometry(notchOverhangGeo);

  const seaFn = useMemo(() => () => 0.50 * reliefScale, [reliefScale]);

  return (
    <group>
      <mesh geometry={notchOverhangGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.8} />
      </mesh>
      <ConformantWaterMesh
        normSub="해식애"
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

export const LagoonFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const waterFn = useMemo(() => () => 0.55 * reliefScale, [reliefScale]);
  return (
    <group>
      <ConformantWaterMesh
        normSub="석호"
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

