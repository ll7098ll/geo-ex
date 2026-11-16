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
      (x, _y, z) => {
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

  // Horizontal residual thermal cooling cracks along the tube floor (properly flat in XY!)
  const floorGlowSegments = useMemo(() => {
    return [-3.6, -2.6, -1.5, -0.4, 0.9, 2.1].map((gy, idx) => {
      const gx = Math.sin(gy * 0.26) * 1.35 + Math.sin(idx * 2.4) * 0.18;
      const gz = evaluateTerrainPoint('용암동굴', gx, gy, reliefScale).height + 0.025;
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
      Math.hypot(x + 0.9, y - 0.7) < 1.25 ? 2.24 * reliefScale : null,
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
      opacity={0.86}
      waveScale={0.18}
    />
  );
};

export const StratovolcanoFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => (
  <group>
    <AnimatedLavaLake elevation={3.28 * reliefScale} radius={0.82} />
    <VolcanicSteamPlume position={[0, 0, 3.65 * reliefScale]} scale={0.95} />
  </group>
);

export const ShieldVolcanoFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => (
  <group>
    <AnimatedLavaLake position={[-0.22, -0.18, 1.98 * reliefScale]} radius={0.76} />
    <VolcanicSteamPlume position={[-0.22, -0.18, 2.35 * reliefScale]} scale={0.75} />
  </group>
);
