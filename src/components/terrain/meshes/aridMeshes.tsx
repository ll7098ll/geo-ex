import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  evaluateTerrainPoint,
  smoothstep,
} from '../terrainGenerators';
import { MUSHROOM_PEDESTAL_SPECS } from '../generators/arid';
import {
  useDisposeGeometry,
  mergeColorGeometries,
  paintGeometrySolid,
  ConformantWaterMesh,
} from './shared';

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
      const gz = evaluateTerrainPoint('버섯바위', sp.mx, sp.my, reliefScale).height - 0.04;
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
      const vz = evaluateTerrainPoint('버섯바위', vx, vy, reliefScale).height;
      // Tetrahedron/Cone-like sharp 3-ridged wind-polished stone!
      const stone = new THREE.ConeGeometry(vr, vr * 0.72 * reliefScale, 3);
      stone.rotateX(Math.PI / 2);
      stone.rotateZ(vx * 1.7 + vy);
      stone.translate(vx, vy, vz + vr * 0.22 * reliefScale);
      parts.push(paintGeometrySolid(stone, '#8c6239'));
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);
  useDisposeGeometry(geo);

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

  // Grounded +Z curved Date Palm trees with genuine downward-drooping (-Z) frond crowns on dry oasis banks!
  const oasisPropsGeo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];
    const palmCoords: [number, number, number][] = [
      [-2.35, -0.05, 1.0],
      [-1.82, 1.05, 0.92],
      [-0.65, 1.25, 1.05],
      [0.85, 1.15, 0.95],
      [2.32, 0.92, 1.02], // Moved cleanly up-bank onto dry oasis sand (above 0.64 water level!)
      [2.45, -0.15, 0.88],
      [-1.62, -1.62, 0.85],
      [1.52, -1.72, 0.90],
    ];

    for (const [px, py, sc] of palmCoords) {
      const gz = evaluateTerrainPoint('오아시스', px, py, reliefScale).height;
      const trunkH = 0.98 * sc;
      const leanX = (px > 0 ? 0.08 : -0.08) * sc;

      const trunk = new THREE.CylinderGeometry(0.042 * sc, 0.068 * sc, trunkH, 7);
      trunk.rotateX(Math.PI / 2); // +Z upright!
      trunk.translate(px + leanX * 0.5, py, gz + trunkH * 0.48);
      parts.push(paintGeometrySolid(trunk, '#6b4c30'));

      const topZ = gz + trunkH * 0.95;
      // Outer drooping palm fronds (pointing outward +X, pitched downward -Z via rotateY(+pitch), then rotated by azimuth ang!)
      for (let f = 0; f < 8; f++) {
        const ang = (f / 8) * Math.PI * 2 + px;
        const frondLen = 0.56 * sc;
        const frond = new THREE.ConeGeometry(0.105 * sc, frondLen, 4);
        frond.translate(0, frondLen * 0.48, 0);
        frond.scale(1.0, 1.0, 0.22);
        frond.rotateZ(-Math.PI / 2); // Align frond axis along +X
        frond.rotateY(0.36 + (f % 2) * 0.16); // Positive rotateY pitches +X tip downward (-Z)!
        frond.rotateZ(ang);
        frond.translate(px + leanX, py, topZ);
        parts.push(paintGeometrySolid(frond, f % 2 === 0 ? '#27691f' : '#3a852e'));
      }
      // Inner slightly arched upper crown fronds
      for (let f = 0; f < 5; f++) {
        const ang = (f / 5) * Math.PI * 2 + py + 0.4;
        const frondLen = 0.36 * sc;
        const frond = new THREE.ConeGeometry(0.085 * sc, frondLen, 4);
        frond.translate(0, frondLen * 0.46, 0);
        frond.scale(1.0, 1.0, 0.22);
        frond.rotateZ(-Math.PI / 2);
        frond.rotateY(-0.14); // Gently lifted inner crown
        frond.rotateZ(ang);
        frond.translate(px + leanX, py, topZ + 0.03 * sc);
        parts.push(paintGeometrySolid(frond, '#459636'));
      }
    }

    return mergeColorGeometries(parts);
  }, [reliefScale]);
  useDisposeGeometry(oasisPropsGeo);

  return (
    <group>
      <ConformantWaterMesh
        normSub="오아시스"
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

export const PlayaBrineFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  // Smooth continuous brine mirror elevation: fills ONLY the 2 depressed Uyuni brine basins while crisp white hex halite ridges poke above!
  const brineFn = useMemo(
    () => (x: number, y: number) => {
      const rx = 7.4 + Math.sin(y * 0.4) * 0.45;
      const ry = y > 0 ? 6.6 : 9.2;
      const rBasin = Math.hypot(x / rx, y / ry);
      if (rBasin > 0.76) return null;
      return 0.303 * reliefScale;
    },
    [reliefScale]
  );

  return (
    <ConformantWaterMesh
      normSub="플라야"
      reliefScale={reliefScale}
      waterLevelFn={brineFn}
      deepColor="#9ac3db"
      shallowColor="#cce5f2"
      foamColor="#ffffff"
      opacity={0.56}
      waveScale={0.04}
      roughness={0.03}
    />
  );
};

