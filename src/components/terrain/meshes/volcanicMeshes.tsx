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
} from '../terrainGenerators';
import { getCalderaShoreRadius } from '../generators/volcanic';
import {
  useDisposeGeometry,
  mergeColorGeometries,
  paintGeometrySolid,
  buildVaultedRoofShell,
  ConformantWaterMesh,
  GroundedPineTrees,
} from './shared';

const AnimatedLavaLake: React.FC<{
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
      Array.from({ length: 12 }, (_, i) => ({
        phase: (i / 12) * Math.PI * 2,
        driftX: 0.25 + Math.sin(i * 4.3) * 0.35,
        driftY: Math.cos(i * 2.9) * 0.28,
        baseSize: 0.16 + (i % 4) * 0.055,
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!puffsRef.current) return;
    puffsRef.current.children.forEach((child, i) => {
      const s = seeds[i];
      const prog = ((t * 0.24 + s.phase / (Math.PI * 2)) % 1.0);
      child.position.set(
        s.driftX * prog * 1.65 * scale,
        s.driftY * prog * 1.45 * scale,
        prog * 2.15 * scale
      );
      const sz = s.baseSize * (0.85 + prog * 1.75) * scale;
      child.scale.set(sz * 1.15, sz * 1.05, sz * 0.72);
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = Math.sin(prog * Math.PI) * 0.19;
      }
    });
  });

  return (
    <group position={position} ref={puffsRef}>
      {seeds.map((_, idx) => (
        <mesh key={idx}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#eef4f7" transparent opacity={0.14} roughness={1} depthWrite={false} />
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
    const cDark = new THREE.Color('#191c22');
    const cMid = new THREE.Color('#2d323b');
    const cCap = new THREE.Color('#424854');
    const cWet = new THREE.Color('#12181e');
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

        // Stepped discrete basalt colonnade terrace height guaranteed proud above recessed DEM backing!
        const normStep = clamp((distInland + 2.75) / 5.8, 0.0, 1.0);
        const quantizedTier = Math.floor(Math.pow(normStep, 1.18) * 11.0 + cell.cellId * 2.3) / 11.5;
        const demBaseH = evaluateTerrainPoint('주상절리', cx, cy, 1.0).height;
        const rawTop = clamp(Math.max(0.48 + quantizedTier * 3.42, demBaseH + 0.22), 0.44, 4.02);
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

        const shade = 0.80 + cell.cellId * 0.36;

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
          .multiplyScalar(0.86 + cell.cellId * 0.28);
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
  useDisposeGeometry(columnsGeo);

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

export const LavaTubeFeatures: React.FC<{ reliefScale?: number }> = ({
  reliefScale = 1.0,
}) => {
  const lavaTubeGeo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];

    const getCeilingZ = (x: number, y: number): number => {
      const cx = Math.sin(y * 0.26) * 1.35;
      const dx = (x - cx) / 2.02;
      const arch = Math.max(0, 1.0 - dx * dx);
      return (0.82 + Math.pow(arch, 0.58) * 1.48 + (y + 10.0) * 0.015) * reliefScale;
    };

    const roofShell = buildVaultedRoofShell(
      -4.1,
      4.1,
      -6.4,
      4.0,
      72,
      96,
      (x, y) => {
        const cx = Math.sin(y * 0.26) * 1.35;
        const distTube = Math.abs(x - cx);
        if (distTube > 2.04) return null;

        // Organic curved front entrance collapse gap separating Natural Bridge from main Lava Tube
        const gapFront = -4.25 + Math.sin(x * 1.4) * 0.14;
        const gapBack = -2.35 + Math.cos(x * 1.2) * 0.16;
        if (y > gapFront && y < gapBack) return null;

        // Organic slightly irregular Skylight collapse window (천창 / 궤) at (cx(0.65), 0.65)
        const skylightCx = Math.sin(0.65 * 0.26) * 1.35;
        const skyAng = Math.atan2(y - 0.65, x - skylightCx);
        const skyR = 0.86 + Math.sin(skyAng * 3.0 + 0.5) * 0.08 + Math.cos(skyAng * 5.0) * 0.05;
        if (Math.hypot(x - skylightCx, y - 0.65) < skyR) return null;

        const ceilZ = getCeilingZ(x, y);
        // Match the exact uncarved pahoehoe plain height + subtle shoulder tuck into the DEM rim!
        const ropy = Math.sin(y * 5.5 + Math.cos(x * 2.2) * 1.8) * 0.035;
        const shoulderTuck = smoothstep(1.62, 2.04, distTube) * 0.08;
        const surfaceBase =
          (2.65 + (y / 10.0) * 0.35 + warpedFbm(x * 0.45, y * 0.45, 3) * 0.26 + ropy - shoulderTuck) *
          reliefScale;

        const gotjawal = smoothstep(0.42, 0.64, fbm(x * 0.75 + 2.0, y * 0.75, 4));
        const topColor = mixColor('#2e2a28', '#423c38', fbm(x * 3, y * 3)).lerp(
          new THREE.Color('#294e21'),
          gotjawal * 0.78
        );
        const innerColor = mixColor('#1a1412', '#302520', fbm(x * 5, y * 5));

        return { ceilZ, topZ: surfaceBase, topColor, innerColor };
      },
      (x, _y, z) => {
        const bed = Math.sin((z / Math.max(0.5, reliefScale)) * 12.0 + x * 0.8) * 0.5 + 0.5;
        return mixColor('#221c19', '#483a33', bed);
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
      if (Math.hypot(lx - Math.sin(0.65 * 0.26) * 1.35, ly - 0.65) < 1.08) continue;
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
    const colFloor = evaluateTerrainPoint('용암동굴', colX, colY, reliefScale).height;
    const colCeil = getCeilingZ(colX, colY);
    const colH = Math.max(0.4, colCeil - colFloor + 0.15);
    const lavaPillar = new THREE.CylinderGeometry(0.22, 0.30, colH, 10);
    lavaPillar.rotateX(Math.PI / 2); // +Z upright!
    lavaPillar.translate(colX, colY, colFloor + colH * 0.5 - 0.05);
    parts.push(paintGeometrySolid(lavaPillar, '#362822'));

    return mergeColorGeometries(parts);
  }, [reliefScale]);
  useDisposeGeometry(lavaTubeGeo);

  // Organic sinuous residual glowing cooling-fissure vein along the tube floor (zero rectangular cards!)
  const floorGlowRibbonGeo = useMemo(() => {
    const segs = 48;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const cEdge = new THREE.Color('#2b1109');
    const cCore = new THREE.Color('#ff5514');

    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const gy = -3.8 + t * 6.4;
      const gx = Math.sin(gy * 0.26) * 1.35 + Math.sin(gy * 1.45) * 0.22;
      const tx = 0.26 * 1.35 * Math.cos(gy * 0.26) + 1.45 * 0.22 * Math.cos(gy * 1.45);
      const len = Math.hypot(tx, 1.0);
      const nx = 1.0 / len;
      const ny = -tx / len;

      const taper = Math.sin(t * Math.PI);
      const halfW = (0.08 + 0.14 * Math.abs(Math.sin(gy * 1.9))) * taper;
      const gz = evaluateTerrainPoint('용암동굴', gx, gy, reliefScale).height + 0.022;

      // Left edge, glowing center core, right edge
      pos.push(gx - nx * halfW, gy - ny * halfW, gz);
      col.push(cEdge.r, cEdge.g, cEdge.b);

      pos.push(gx, gy, gz + 0.008);
      col.push(cCore.r, cCore.g, cCore.b);

      pos.push(gx + nx * halfW, gy + ny * halfW, gz);
      col.push(cEdge.r, cEdge.g, cEdge.b);
    }

    for (let i = 0; i < segs; i++) {
      const r0 = i * 3;
      const r1 = (i + 1) * 3;
      idx.push(r0, r0 + 1, r1, r0 + 1, r1 + 1, r1);
      idx.push(r0 + 1, r0 + 2, r1 + 1, r0 + 2, r1 + 2, r1 + 1);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }, [reliefScale]);
  useDisposeGeometry(floorGlowRibbonGeo);

  const skylightX = Math.sin(0.65 * 0.26) * 1.35;
  const skylightFloorZ = evaluateTerrainPoint('용암동굴', skylightX, 0.65, reliefScale).height;
  const beamHeight = Math.max(0.8, 2.55 * reliefScale - skylightFloorZ);

  return (
    <group>
      <mesh geometry={lavaTubeGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.82} metalness={0.12} />
      </mesh>

      {/* Organic Sinuous Ropy-Lava Floor Residual Cooling Vein */}
      <mesh geometry={floorGlowRibbonGeo}>
        <meshStandardMaterial
          vertexColors
          emissive="#c93b0b"
          emissiveIntensity={0.9}
          roughness={0.55}
        />
      </mesh>

      {/* Volumetric Sunbeam entering strictly through the Skylight hole to the tube floor! */}
      <mesh
        position={[skylightX + 0.06, 0.62, skylightFloorZ + beamHeight * 0.5]}
        rotation={[Math.PI / 2 - 0.06, 0, 0.08]}
      >
        <cylinderGeometry args={[0.42, 0.78, beamHeight, 20, 1, true]} />
        <meshBasicMaterial
          color="#fff4d4"
          transparent
          opacity={0.13}
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
};

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
export const FaultMountainFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const axialRiverFn = useMemo(
    () => (x: number, _y: number) => (x < -3.2 ? 0.42 * reliefScale : null),
    [reliefScale]
  );
  return (
    <group>
      <ConformantWaterMesh
        normSub="단층 산맥"
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


export const DomeVolcanoFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const seaFn = useMemo(
    () => (x: number, y: number) =>
      y < -5.2 + Math.sin(x * 0.35) * 0.65 ? (getBaseWaterElevation('종상화산', reliefScale) ?? 0.42) : null,
    [reliefScale]
  );
  return (
    <ConformantWaterMesh
      normSub="종상화산"
      reliefScale={reliefScale}
      waterLevelFn={seaFn}
      deepColor="#0a293d"
      shallowColor="#19637a"
      foamColor="#dcf4fc"
      opacity={0.86}
      waveScale={0.65}
    />
  );
};

export const LavaPlateauFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const gorgeWaterFn = useMemo(() => () => getBaseWaterElevation('용암대지', reliefScale), [reliefScale]);
  return (
    <ConformantWaterMesh
      normSub="용암대지"
      reliefScale={reliefScale}
      waterLevelFn={gorgeWaterFn}
      deepColor="#0e424f"
      shallowColor="#1e6f80"
      foamColor="#cdeff5"
      opacity={0.88}
      waveScale={0.32}
    />
  );
};

export const TuffConeFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const seaFn = useMemo(
    () => (x: number, y: number) => {
      if (Math.hypot(x - 0.8, y - 0.5) < 3.1) return null;
      return getBaseWaterElevation('수성화산', reliefScale);
    },
    [reliefScale]
  );
  return (
    <ConformantWaterMesh
      normSub="수성화산"
      reliefScale={reliefScale}
      waterLevelFn={seaFn}
      deepColor="#092d42"
      shallowColor="#1a6f85"
      foamColor="#dff6fc"
      opacity={0.86}
      waveScale={0.7}
    />
  );
};

export const ParasiticConeFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const craterPondFn = useMemo(
    () => (x: number, y: number) =>
      Math.hypot(x + 0.9, y - 0.7) < 1.25 ? 2.26 * reliefScale : null,
    [reliefScale]
  );
  return (
    <ConformantWaterMesh
      normSub="기생화산"
      reliefScale={reliefScale}
      waterLevelFn={craterPondFn}
      deepColor="#144538"
      shallowColor="#266e59"
      foamColor="#b8e6d8"
      opacity={0.88}
      waveScale={0.18}
    />
  );
};

export const StratovolcanoFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => (
  <group>
    <AnimatedLavaLake elevation={3.46 * reliefScale} radius={0.68} />
    <VolcanicSteamPlume position={[0, 0, 3.72 * reliefScale]} scale={0.9} />
  </group>
);

export const ShieldVolcanoFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => (
  <group>
    <AnimatedLavaLake position={[-0.22, -0.18, 2.04 * reliefScale]} radius={0.74} />
    <VolcanicSteamPlume position={[-0.22, -0.18, 2.38 * reliefScale]} scale={0.72} />
  </group>
);
