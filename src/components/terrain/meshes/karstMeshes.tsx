import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  evaluateTerrainPoint,
  fbm,
  warpedFbm,
  clamp,
  smoothstep,
  mixColor,
} from '../terrainGenerators';
import {
  useDisposeGeometry,
  mergeColorGeometries,
  paintGeometrySolid,
  buildVaultedRoofShell,
  ConformantWaterMesh,
  GroundedPineTrees,
} from './shared';

export const LimestoneCaveFeatures: React.FC<{ reliefScale?: number }> = ({
  reliefScale = 1.0,
}) => {
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
      const floorZ = evaluateTerrainPoint('석회동굴', sx, sy, reliefScale).height;
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
      const fz = evaluateTerrainPoint('석회동굴', gx, gy, reliefScale).height;
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
      const fz = evaluateTerrainPoint('석회동굴', px, py, reliefScale).height;
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
  useDisposeGeometry(karstCavernGeo);

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

export const DolineFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <GroundedPineTrees
      normSub="돌리네"
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

