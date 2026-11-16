import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  evaluateTerrainPoint,
  clamp,
  smoothstep,
  mixColor,
} from '../terrainGenerators';
import { getWaterfallLipY } from '../generators/fluvial';
import {
  useDisposeGeometry,
  mergeColorGeometries,
  paintGeometrySolid,
  buildVaultedRoofShell,
  ConformantWaterMesh,
  GroundedPineTrees,
} from './shared';
import { VolcanicSteamPlume } from './volcanicMeshes';

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

export const IncisedMeanderFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const waterFn = useMemo(() => () => 0.58 * reliefScale, [reliefScale]);
  return (
    <group>
      <ConformantWaterMesh
        normSub="감입곡류천"
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
      const gz = evaluateTerrainPoint('범람원', rx, hy, reliefScale).height;
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
  useDisposeGeometry(leveeHousesGeo);

  return (
    <group>
      <ConformantWaterMesh
        normSub="범람원"
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
  useDisposeGeometry(caprockLedgeGeo);

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
  useDisposeGeometry(waterfallSheetGeo);

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

