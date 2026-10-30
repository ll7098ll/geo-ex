import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ==========================================
// 1. Dynamic Gerstner Animated Realistic Water
// ==========================================
interface WaterMeshProps {
  color?: string;
  opacity?: number;
  elevation?: number;
  size?: [number, number];
  position?: [number, number, number];
  circular?: boolean;
  radius?: number;
  waveScale?: number;
}

export const AnimatedWaterSurface: React.FC<WaterMeshProps> = ({
  color = '#1b5e7d',
  opacity = 0.85,
  elevation = 0.5,
  size = [20, 20],
  position,
  circular = false,
  radius = 6,
  waveScale = 1.0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const originalZRef = useRef<Float32Array | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const baseZ = position ? position[2] : elevation;
      meshRef.current.position.z = baseZ + Math.sin(t * 1.8) * 0.012;
    }

    if (geoRef.current) {
      const posAttr = geoRef.current.attributes.position;
      if (!originalZRef.current) {
        originalZRef.current = new Float32Array(posAttr.count);
        for (let i = 0; i < posAttr.count; i++) {
          originalZRef.current[i] = posAttr.getZ(i);
        }
      }

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const w1 = Math.sin(x * 1.4 + t * 2.2) * 0.035 * waveScale;
        const w2 = Math.cos(y * 1.6 + t * 1.7) * 0.03 * waveScale;
        const w3 = Math.sin((x + y) * 0.9 - t * 2.8) * 0.02 * waveScale;
        posAttr.setZ(i, (originalZRef.current ? originalZRef.current[i] : 0) + w1 + w2 + w3);
      }
      posAttr.needsUpdate = true;
      geoRef.current.computeVertexNormals();
    }
  });

  const pos: [number, number, number] = position || [0, 0, elevation];

  return (
    <mesh ref={meshRef} position={pos}>
      {circular ? (
        <circleGeometry ref={geoRef} args={[radius, 36]} />
      ) : (
        <planeGeometry ref={geoRef} args={[size[0], size[1], 24, 24]} />
      )}
      <meshStandardMaterial
        color={color}
        roughness={0.06}
        metalness={0.28}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ==========================================
// 2. Animated Pulsing Lava Lake & Thermal Fissures
// ==========================================
export const AnimatedLavaLake: React.FC<{
  elevation?: number;
  radius?: number;
  position?: [number, number, number];
}> = ({ elevation = 3.6, radius = 1.3, position }) => {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) {
      const pulse = 0.75 + Math.sin(t * 3.0) * 0.25;
      matRef.current.emissiveIntensity = pulse * 2.2;
    }
  });

  const pos: [number, number, number] = position || [0, 0, elevation];

  return (
    <group position={pos}>
      {/* Molten lake core */}
      <mesh>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color="#ff3b00"
          emissive="#ff2200"
          emissiveIntensity={1.8}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      {/* Dark cooling crust islands floating in the lava */}
      {[
        { pos: [-0.4, 0.3, 0.02], r: 0.35 },
        { pos: [0.5, -0.2, 0.02], r: 0.42 },
        { pos: [0.1, -0.5, 0.02], r: 0.3 },
      ].map((crust, idx) => (
        <mesh key={idx} position={crust.pos as [number, number, number]}>
          <circleGeometry args={[crust.r, 8]} />
          <meshStandardMaterial color="#1f1816" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// ==========================================
// 3. Volcanic Ash, Steam & Fire Embers Particles
// ==========================================
export const VolcanicSteamPlume: React.FC<{
  position?: [number, number, number];
  count?: number;
  isSulfur?: boolean;
}> = ({ position = [0, 0, 4.4], count = 28, isSulfur = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const emberGroupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        baseX: (Math.random() - 0.5) * 0.5,
        baseY: (Math.random() - 0.5) * 0.5,
        speedZ: 0.8 + Math.random() * 0.7,
        swirlSpeed: 0.6 + Math.random() * 0.8,
        swirlRadius: 0.3 + Math.random() * 0.9,
        size: 0.25 + Math.random() * 0.35,
        phase: (i / count) * 4.0,
      });
    }
    return arr;
  }, [count]);

  const embers = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      arr.push({
        baseX: (Math.random() - 0.5) * 0.4,
        baseY: (Math.random() - 0.5) * 0.4,
        speedZ: 1.5 + Math.random() * 1.2,
        phase: Math.random() * 2.0,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        if (!p) return;
        const age = (t + p.phase) % 3.5;
        const progress = age / 3.5;

        const currentZ = progress * 4.2;
        const swirl = t * p.swirlSpeed + i;
        const currentRadius = p.swirlRadius * (0.4 + progress * 1.6);
        const currentX = p.baseX + Math.cos(swirl) * currentRadius + progress * 0.6;
        const currentY = p.baseY + Math.sin(swirl) * currentRadius;

        child.position.set(currentX, currentY, currentZ);
        const currentScale = p.size * (1.0 + progress * 2.8);
        child.scale.set(currentScale, currentScale, currentScale);

        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          (mesh.material as THREE.MeshStandardMaterial).opacity =
            Math.sin(progress * Math.PI) * (isSulfur ? 0.45 : 0.6);
        }
      });
    }

    if (emberGroupRef.current) {
      emberGroupRef.current.children.forEach((child, i) => {
        const e = embers[i];
        if (!e) return;
        const age = (t * 1.8 + e.phase) % 1.5;
        const prog = age / 1.5;
        child.position.set(
          e.baseX + Math.sin(t * 5.0 + i) * 0.25,
          e.baseY + Math.cos(t * 4.0 + i) * 0.25,
          prog * 2.5
        );
        const s = (1.0 - prog) * 0.12;
        child.scale.set(s, s, s);
      });
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        {particles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color={isSulfur ? '#e3d888' : '#706e73'}
              transparent
              opacity={0.5}
              roughness={1.0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Burning Ember Sparks */}
      <group ref={emberGroupRef}>
        {embers.map((_, i) => (
          <mesh key={i}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ==========================================
// 4. Stepped Hexagonal Basalt Columns for 주상절리 (Colonnade Array)
// ==========================================
export const ColumnarJointingColumns: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const columns = useMemo(() => {
    const list: { pos: [number, number, number]; h: number; r: number; col: string }[] = [];
    // Stepped colonnade along the surf zone
    const basePillars = [
      { x: -1.2, y: 0.8, h: 2.2, r: 0.42 },
      { x: -1.8, y: 1.4, h: 1.8, r: 0.40 },
      { x: -1.4, y: 2.1, h: 2.5, r: 0.45 },
      { x: -2.3, y: 1.0, h: 1.4, r: 0.38 },
      { x: -2.0, y: 2.3, h: 1.9, r: 0.41 },
      { x: -1.0, y: -0.2, h: 2.6, r: 0.44 },
      { x: -1.6, y: -0.8, h: 2.1, r: 0.42 },
      { x: -2.2, y: -1.4, h: 1.6, r: 0.39 },
      { x: -1.2, y: -1.6, h: 2.3, r: 0.43 },
      { x: -1.8, y: -2.2, h: 1.7, r: 0.40 },
      { x: -2.7, y: -0.2, h: 1.1, r: 0.36 },
      { x: -2.9, y: 0.7, h: 0.9, r: 0.35 },
      { x: -2.8, y: -1.8, h: 0.8, r: 0.34 },
      { x: -0.6, y: 1.2, h: 2.9, r: 0.46 },
      { x: -0.5, y: -0.9, h: 3.1, r: 0.48 },
      { x: -0.4, y: 0.1, h: 3.2, r: 0.47 },
      { x: -3.4, y: 0.0, h: 0.6, r: 0.32 },
      { x: -3.3, y: 1.5, h: 0.5, r: 0.30 },
    ];

    basePillars.forEach((p, idx) => {
      const shade = (idx % 3 === 0) ? '#1a1c1f' : (idx % 3 === 1) ? '#24272c' : '#2b2e34';
      list.push({
        pos: [p.x, p.y, (p.h * reliefScale) / 2],
        h: p.h * reliefScale,
        r: p.r,
        col: shade,
      });
    });
    return list;
  }, [reliefScale]);

  return (
    <group>
      {/* Hexagonal Basalt Colonnades */}
      {columns.map((col, idx) => (
        <group key={idx} position={[col.pos[0], col.pos[1], 0]}>
          <mesh position={[0, 0, col.h / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[col.r, col.r * 1.02, col.h, 6]} />
            <meshStandardMaterial color={col.col} roughness={0.72} metalness={0.12} />
          </mesh>
          {/* Subtle concave cooling rim cap */}
          <mesh position={[0, 0, col.h + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[col.r * 0.95, 6]} />
            <meshStandardMaterial color="#33373e" roughness={0.65} metalness={0.15} />
          </mesh>
          {/* Foaming water ring at base of columns in the surf */}
          {col.h < 1.8 * reliefScale && (
            <mesh position={[0, 0, 0.46 * reliefScale]}>
              <ringGeometry args={[col.r * 1.05, col.r * 1.8, 12]} />
              <meshStandardMaterial color="#eef8fc" transparent opacity={0.78} roughness={0.2} />
            </mesh>
          )}
        </group>
      ))}

      {/* Coastal ocean water surface washing over columnar joints */}
      <AnimatedWaterSurface
        elevation={0.44 * reliefScale}
        size={[12, 20]}
        position={[-4.5, 0, 0.44 * reliefScale]}
        color="#0e2a3b"
        opacity={0.9}
        waveScale={1.2}
      />
    </group>
  );
};

// ==========================================
// 5. Sea Arch, Sea Stack (촛대바위) & Circling Birds
// ==========================================
export const SeaArchAndStack: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const birdsRef = useRef<THREE.Group>(null);
  const foamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (foamRef.current) {
      const s = 1.0 + Math.sin(t * 3.2) * 0.12;
      foamRef.current.scale.set(s, s, 1.0);
    }
    if (birdsRef.current) {
      birdsRef.current.rotation.z = t * 0.45;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Sea Arch Bridge Span */}
      <group position={[3.2, 1.0, 1.3 * reliefScale]} rotation={[0, 0, Math.PI * 0.1]}>
        <mesh position={[0, 0, 1.1 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.55, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#63594e" roughness={0.85} />
        </mesh>
        <mesh position={[-1.5, 0, 0.2 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.95, 1.8 * reliefScale, 12]} />
          <meshStandardMaterial color="#574e44" roughness={0.9} />
        </mesh>
        <mesh position={[1.5, 0, 0.2 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.9, 1.8 * reliefScale, 12]} />
          <meshStandardMaterial color="#574e44" roughness={0.9} />
        </mesh>
      </group>

      {/* 2. Isolated Offshore Sea Stack (촛대바위) */}
      <group position={[5.8, -2.8, 0]}>
        <mesh position={[0, 0, 1.5 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.75, 3.0 * reliefScale, 8]} />
          <meshStandardMaterial color="#665b50" roughness={0.88} />
        </mesh>
        {/* Surf foam ring */}
        <mesh ref={foamRef} position={[0, 0, 0.48 * reliefScale]}>
          <ringGeometry args={[0.85, 1.5, 24]} />
          <meshStandardMaterial color="#eef8fc" transparent opacity={0.78} roughness={0.3} />
        </mesh>
      </group>

      {/* 3. Circling Seabirds above the sea stack */}
      <group ref={birdsRef} position={[5.8, -2.8, 4.2 * reliefScale]}>
        {[0, 1.8, 3.6, 5.0].map((rad, i) => (
          <group key={i} position={[Math.cos(rad) * 1.6, Math.sin(rad) * 1.6, Math.sin(rad * 2) * 0.3]}>
            <mesh rotation={[0, 0, rad + Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.3, 3]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// ==========================================
// 6. Coastal Sand Dune: Pine Windbreak & Dune Grass
// ==========================================
export const CoastalDuneFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const pines = useMemo(() => [
    { pos: [5.2, -3.5, 2.2 * reliefScale], s: 1.2 },
    { pos: [5.6, -1.8, 2.0 * reliefScale], s: 1.4 },
    { pos: [6.1, 0.2, 1.8 * reliefScale], s: 1.1 },
    { pos: [5.4, 2.0, 2.1 * reliefScale], s: 1.3 },
    { pos: [6.3, 3.8, 1.7 * reliefScale], s: 1.0 },
    { pos: [6.8, -2.6, 1.9 * reliefScale], s: 1.2 },
    { pos: [7.1, 1.0, 1.6 * reliefScale], s: 1.1 },
  ], [reliefScale]);

  return (
    <group>
      {/* Coastal Pine Windbreak Forest (해송 방풍림) */}
      {pines.map((p, idx) => (
        <group key={idx} position={p.pos as [number, number, number]}>
          {/* Trunk */}
          <mesh position={[0, 0, 0.7 * p.s]} rotation={[Math.PI / 2, 0, (idx % 2 === 0 ? 0.1 : -0.1)]}>
            <cylinderGeometry args={[0.08 * p.s, 0.14 * p.s, 1.4 * p.s, 8]} />
            <meshStandardMaterial color="#4a3525" roughness={0.9} />
          </mesh>
          {/* Tiered Conical Pine Canopies */}
          <mesh position={[0, 0, 1.4 * p.s]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.65 * p.s, 1.1 * p.s, 7]} />
            <meshStandardMaterial color="#1f442b" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 1.9 * p.s]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.5 * p.s, 0.9 * p.s, 7]} />
            <meshStandardMaterial color="#2d5e3c" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Coastal Sea Surf */}
      <AnimatedWaterSurface
        position={[-6.2, 0, 0.35 * reliefScale]}
        size={[8, 20]}
        color="#134c66"
        opacity={0.88}
      />
    </group>
  );
};

// ==========================================
// 7. Sand Spit, Recurved Hook & Tombolo (사주·사취 & 육계도)
// ==========================================
export const SandSpitFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Offshore Tied Island (육계도) */}
      <group position={[4.8, 3.5, 0]}>
        <mesh position={[0, 0, 1.4 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.5, 2.8 * reliefScale, 10]} />
          <meshStandardMaterial color="#5e5449" roughness={0.85} />
        </mesh>
        {/* Island top green cap */}
        <mesh position={[0, 0, 2.6 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.7, 8, 8]} />
          <meshStandardMaterial color="#355e2d" roughness={0.7} />
        </mesh>
      </group>

      {/* Outer Open Sea Water with active waves */}
      <AnimatedWaterSurface
        position={[-3.5, 0, 0.42 * reliefScale]}
        size={[14, 20]}
        color="#0d3c59"
        opacity={0.88}
        waveScale={1.1}
      />
      {/* Calm Protected Bay Water */}
      <AnimatedWaterSurface
        position={[4.0, -2.5, 0.45 * reliefScale]}
        size={[10, 12]}
        color="#175b6e"
        opacity={0.85}
        waveScale={0.5}
      />
    </group>
  );
};

// ==========================================
// 8. Tidal Flat Features (갯벌 - 갯골 & 칠면초 염습지)
// ==========================================
export const TidalFlatFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Glistening water film in the tidal creeks */}
      <AnimatedWaterSurface
        position={[0, -2.0, 0.28 * reliefScale]}
        size={[18, 14]}
        color="#182c38"
        opacity={0.65}
        waveScale={0.3}
      />
      {/* Incoming high-tide ocean water sheet at the outer edge */}
      <AnimatedWaterSurface
        position={[0, -7.0, 0.38 * reliefScale]}
        size={[20, 6]}
        color="#1a475c"
        opacity={0.82}
      />
    </group>
  );
};

// ==========================================
// 9. Wave-Cut Platform & Tide Pools (파식대 & 조수 웅덩이)
// ==========================================
export const WaveCutPlatformFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Intertidal wave water washing over platform */}
      <AnimatedWaterSurface
        position={[-3.5, 0, 0.46 * reliefScale]}
        size={[13, 20]}
        color="#113e54"
        opacity={0.85}
        waveScale={1.1}
      />
      {/* Tide Pools (조수 웅덩이) */}
      {[
        { pos: [-1.2, 2.0, 0.47 * reliefScale], r: 0.7 },
        { pos: [-1.6, -1.8, 0.47 * reliefScale], r: 0.9 },
        { pos: [-0.8, -3.5, 0.47 * reliefScale], r: 0.6 },
      ].map((pool, idx) => (
        <group key={idx} position={pool.pos as [number, number, number]}>
          <mesh>
            <circleGeometry args={[pool.r, 16]} />
            <meshStandardMaterial color="#1b7875" roughness={0.1} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ==========================================
// 10. Alluvial Fan Features (선상지: 선정/선앙/선단)
// ==========================================
export const AlluvialFanFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Fan Apex (선정): Coarse Gravel Boulder Scree */}
      {[
        { pos: [0.3, -4.0, 1.4 * reliefScale], s: 0.35 },
        { pos: [-0.4, -3.8, 1.5 * reliefScale], s: 0.4 },
        { pos: [0.0, -3.2, 1.2 * reliefScale], s: 0.3 },
      ].map((b, idx) => (
        <mesh key={idx} position={b.pos as [number, number, number]}>
          <dodecahedronGeometry args={[b.s, 0]} />
          <meshStandardMaterial color="#736655" roughness={0.9} />
        </mesh>
      ))}

      {/* Fan Toe (선단): Bubbling Spring Ponds (용천대) */}
      {[
        { pos: [-2.2, 4.2, 0.38 * reliefScale], r: 0.8 },
        { pos: [1.8, 4.0, 0.38 * reliefScale], r: 0.9 },
        { pos: [0.0, 4.5, 0.36 * reliefScale], r: 0.7 },
      ].map((spring, idx) => (
        <mesh key={idx} position={spring.pos as [number, number, number]}>
          <circleGeometry args={[spring.r, 16]} />
          <meshStandardMaterial color="#228899" roughness={0.08} transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  );
};

// ==========================================
// 11. Meandering River & Oxbow Lake (곡류천 & 우각호)
// ==========================================
export const MeanderingRiverFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* S-curve active river water */}
      <AnimatedWaterSurface
        position={[0, 0, 0.45 * reliefScale]}
        size={[20, 20]}
        color="#1d5c70"
        opacity={0.85}
        waveScale={0.5}
      />
      {/* Oxbow Lake (우각호) Marsh Vegetation along banks */}
      {[
        { pos: [-3.6, 2.2, 0.55 * reliefScale] },
        { pos: [-3.2, 3.2, 0.55 * reliefScale] },
        { pos: [-3.8, 1.2, 0.55 * reliefScale] },
      ].map((t, idx) => (
        <group key={idx} position={t.pos as [number, number, number]}>
          <mesh position={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.04, 0.08, 0.5, 6]} />
            <meshStandardMaterial color="#423528" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.6]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#3b6630" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ==========================================
// 12. Floodplain Features (범람원: 자연제방 & 배후습지)
// ==========================================
export const FloodplainFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Central River Channel */}
      <AnimatedWaterSurface
        position={[0, 0, 0.35 * reliefScale]}
        size={[20, 20]}
        color="#1f5869"
        opacity={0.85}
        waveScale={0.5}
      />
      {/* Rural Cottages on Natural Levee (자연제방 취락) */}
      {[
        { pos: [1.8, -2.0, 1.4 * reliefScale], rot: 0.2 },
        { pos: [2.1, 1.5, 1.35 * reliefScale], rot: -0.3 },
      ].map((house, idx) => (
        <group key={idx} position={house.pos as [number, number, number]} rotation={[0, 0, house.rot]}>
          {/* Walls */}
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[0.5, 0.6, 0.4]} />
            <meshStandardMaterial color="#d4c8b8" roughness={0.8} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 0, 0.5]}>
            <coneGeometry args={[0.45, 0.25, 4]} />
            <meshStandardMaterial color="#8a4b32" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ==========================================
// 13. Delta Features (삼각주 & 퇴적 플룸)
// ==========================================
export const DeltaFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Ocean water into which delta empties */}
      <AnimatedWaterSurface
        position={[0, 3.8, 0.38 * reliefScale]}
        size={[20, 12]}
        color="#114a66"
        opacity={0.88}
        waveScale={0.7}
      />
      {/* River Distributaries */}
      <AnimatedWaterSurface
        position={[0, -3.0, 0.42 * reliefScale]}
        size={[12, 10]}
        color="#1f5e73"
        opacity={0.85}
        waveScale={0.5}
      />
    </group>
  );
};

// ==========================================
// 14. River Terrace Features (하안단구: 다단 단구면)
// ==========================================
export const RiverTerraceFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Active river winding at bottom of valley */}
      <AnimatedWaterSurface
        position={[0, 0, 0.42 * reliefScale]}
        size={[20, 20]}
        color="#1a617a"
        opacity={0.88}
        waveScale={0.6}
      />
      {/* Riparian trees along river banks */}
      {[
        { pos: [-1.2, -3.5, 0.65 * reliefScale] },
        { pos: [-1.4, 1.2, 0.65 * reliefScale] },
        { pos: [1.3, -1.0, 0.65 * reliefScale] },
        { pos: [1.2, 3.2, 0.65 * reliefScale] },
      ].map((tree, idx) => (
        <group key={idx} position={tree.pos as [number, number, number]}>
          <mesh position={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.04, 0.08, 0.5, 6]} />
            <meshStandardMaterial color="#423528" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.6]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#305e26" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ==========================================
// 15. Waterfall Cascades with Plunge Pool Mist (폭포)
// ==========================================
export const WaterfallCascades: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const cascadeRef = useRef<THREE.Mesh>(null);
  const mistGroupRef = useRef<THREE.Group>(null);

  const mistParticles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        baseX: (Math.random() - 0.5) * 1.8,
        baseY: 1.5 + (Math.random() - 0.5) * 0.8,
        speedZ: 0.6 + Math.random() * 0.6,
        size: 0.3 + Math.random() * 0.35,
        phase: (i / 24) * 2.5,
      });
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cascadeRef.current) {
      cascadeRef.current.position.x = Math.sin(t * 14) * 0.025;
    }

    if (mistGroupRef.current) {
      mistGroupRef.current.children.forEach((child, i) => {
        const p = mistParticles[i];
        if (!p) return;
        const progress = ((t + p.phase) % 2.5) / 2.5;
        const z = 0.5 * reliefScale + progress * 2.2 * reliefScale;
        const spread = progress * 1.2;
        child.position.set(p.baseX + Math.sin(t * 2.0 + i) * 0.25, p.baseY + spread, z);
        const s = p.size * (1.0 + progress * 1.8);
        child.scale.set(s, s, s);
        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          (mesh.material as THREE.MeshStandardMaterial).opacity = Math.sin(progress * Math.PI) * 0.55;
        }
      });
    }
  });

  return (
    <group>
      {/* Vertical falling water sheet */}
      <mesh
        ref={cascadeRef}
        position={[0, -0.2, 2.3 * reliefScale]}
        rotation={[Math.PI * 0.42, 0, 0]}
      >
        <planeGeometry args={[2.6, 3.4 * reliefScale]} />
        <meshStandardMaterial
          color="#d5f2fc"
          roughness={0.1}
          metalness={0.12}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Foaming Plunge Pool Water Disc */}
      <mesh position={[0, 1.8, 0.48 * reliefScale]}>
        <circleGeometry args={[2.1, 32]} />
        <meshStandardMaterial color="#38829e" roughness={0.2} metalness={0.1} transparent opacity={0.9} />
      </mesh>
      {/* Foam ring */}
      <mesh position={[0, 1.8, 0.49 * reliefScale]}>
        <ringGeometry args={[0.6, 1.8, 24]} />
        <meshStandardMaterial color="#eef8fc" transparent opacity={0.75} roughness={0.3} />
      </mesh>

      {/* Mist Spray */}
      <group ref={mistGroupRef}>
        {mistParticles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#f0faff" transparent opacity={0.4} roughness={1} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* Upper River Stream */}
      <mesh position={[0, -4.8, 3.8 * reliefScale]}>
        <planeGeometry args={[2.6, 7.5]} />
        <meshStandardMaterial color="#2d6e8a" roughness={0.1} metalness={0.2} transparent opacity={0.85} />
      </mesh>

      {/* Lower Gorge River */}
      <mesh position={[0, 6.0, 0.52 * reliefScale]}>
        <planeGeometry args={[2.4, 6.5]} />
        <meshStandardMaterial color="#2d6e8a" roughness={0.15} metalness={0.2} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};

// ==========================================
// 16. Limestone Cave, Stalactites, Stalagmites & Stone Column
// ==========================================
export const CavePortalFeatures: React.FC<{ reliefScale?: number; isLavaTube?: boolean }> = ({
  reliefScale = 1.0,
  isLavaTube = false,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Dark interior cave void portal */}
      <mesh position={[0, 0, 0.3 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.6, 2.6, 0.6, 24]} />
        <meshBasicMaterial color="#080706" />
      </mesh>

      {!isLavaTube ? (
        <group>
          {/* Ceiling Stalactites (종유석) */}
          <group position={[0, 0, 1.65 * reliefScale]}>
            {[
              { pos: [-0.6, -0.4, 0], h: 0.95 },
              { pos: [0.5, -0.3, 0], h: 1.25 },
              { pos: [0.2, 0.6, 0], h: 1.0 },
              { pos: [-0.7, 0.5, 0], h: 0.8 },
              { pos: [0.9, 0.2, 0], h: 0.7 },
            ].map((st, idx) => (
              <mesh key={idx} position={st.pos as [number, number, number]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.16, st.h * reliefScale, 8]} />
                <meshStandardMaterial color="#c8c2b5" roughness={0.75} />
              </mesh>
            ))}
          </group>

          {/* Floor Stalagmites (석순) */}
          <group position={[0, 0, 0.45 * reliefScale]}>
            {[
              { pos: [0.5, -0.3, 0], h: 0.7 },
              { pos: [-0.6, -0.4, 0], h: 0.5 },
              { pos: [0.8, 0.5, 0], h: 0.6 },
            ].map((sg, idx) => (
              <mesh key={idx} position={sg.pos as [number, number, number]}>
                <coneGeometry args={[0.2, sg.h * reliefScale, 8]} />
                <meshStandardMaterial color="#c8c2b5" roughness={0.75} />
              </mesh>
            ))}
          </group>

          {/* Massive Fused Stone Column (석주) */}
          <mesh position={[-0.1, -0.6, 1.0 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 1.5 * reliefScale, 10]} />
            <meshStandardMaterial color="#d4cdbf" roughness={0.7} />
          </mesh>

          {/* Subterranean cave stream flowing out */}
          <mesh position={[0, 0.6, 0.32 * reliefScale]}>
            <planeGeometry args={[1.4, 4.0]} />
            <meshStandardMaterial color="#198287" roughness={0.1} metalness={0.2} transparent opacity={0.8} />
          </mesh>
        </group>
      ) : (
        <group>
          {/* Lava Tube interior tunnel */}
          <mesh position={[0, 0, 0.9 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.0, 2.0, 3.5, 16, 1, true]} />
            <meshStandardMaterial color="#211d1b" roughness={0.9} side={THREE.BackSide} />
          </mesh>

          {/* Glowing cooling crack on lava tube floor */}
          <mesh position={[0, 0, 0.35 * reliefScale]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 3.2]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff3300" emissiveIntensity={1.4} roughness={0.3} />
          </mesh>

          {/* Skylight collapse beam (천창 빛줄기) */}
          <mesh position={[0, 0, 1.8 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 1.2, 2.5 * reliefScale, 16, 1, true]} />
            <meshBasicMaterial color="#ffe8c2" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ==========================================
// 17. Doline / Sinkhole Features (돌리네 & 포노르 싱크홀)
// ==========================================
export const DolineFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Central Swallow Hole (포노르 / Ponor) Drainage Void */}
      <mesh position={[-1.2, -0.8, 0.45 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.15, 0.6 * reliefScale, 16]} />
        <meshBasicMaterial color="#0a0807" />
      </mesh>
      {/* Secondary Ponor in Uvala connector */}
      <mesh position={[2.8, 1.4, 0.5 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.1, 0.5 * reliefScale, 16]} />
        <meshBasicMaterial color="#0a0807" />
      </mesh>
    </group>
  );
};

// ==========================================
// 18. Tower Karst (탑 카르스트: 석봉 & 강 유역)
// ==========================================
export const TowerKarstFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Emerald Karst River flowing between limestone towers */}
      <AnimatedWaterSurface
        position={[0, 0, 0.45 * reliefScale]}
        size={[20, 20]}
        color="#126b58"
        opacity={0.88}
        waveScale={0.4}
      />
      {/* Traditional Bamboo Rafts on river */}
      {[
        { pos: [-0.5, 0.8, 0.47 * reliefScale], rot: 0.3 },
        { pos: [1.2, -1.5, 0.47 * reliefScale], rot: -0.4 },
      ].map((raft, idx) => (
        <group key={idx} position={raft.pos as [number, number, number]} rotation={[0, 0, raft.rot]}>
          <mesh>
            <boxGeometry args={[0.4, 1.2, 0.06]} />
            <meshStandardMaterial color="#c4a56a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ==========================================
// 19. Fault Block Mountain Features (단층 산맥 & 삼각말단면)
// ==========================================
export const FaultMountainFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Talus Scree Cones (애추) at base of fault scarp */}
      {[
        { pos: [-1.2, -3.0, 0.6 * reliefScale], s: 0.7 },
        { pos: [-1.1, 0.0, 0.6 * reliefScale], s: 0.85 },
        { pos: [-1.3, 3.0, 0.6 * reliefScale], s: 0.75 },
      ].map((talus, idx) => (
        <mesh key={idx} position={talus.pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.9 * talus.s, 1.2 * reliefScale, 8]} />
          <meshStandardMaterial color="#5e5449" roughness={0.92} />
        </mesh>
      ))}

      {/* Graben Valley Stream */}
      <AnimatedWaterSurface
        position={[-5.0, 0, 0.48 * reliefScale]}
        size={[8, 20]}
        color="#1f5466"
        opacity={0.82}
      />
    </group>
  );
};

// ==========================================
// 20. Glacial Horn (혼 / 마터호른 4각 피라미드 & 아레테 & 권곡호)
// ==========================================
export const GlacialHornFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const plumeRef = useRef<THREE.Group>(null);

  const spindrift = useMemo(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        x: (Math.random() - 0.5) * 0.7,
        y: (Math.random() - 0.5) * 0.7,
        speed: 1.2 + Math.random() * 0.8,
        phase: Math.random() * 2.0,
      });
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (plumeRef.current) {
      plumeRef.current.children.forEach((child, i) => {
        const s = spindrift[i];
        if (!s) return;
        const progress = ((t * s.speed + s.phase) % 2.0) / 2.0;
        child.position.set(s.x + progress * 2.8, s.y + Math.sin(t * 3.0 + i) * 0.35, progress * 0.7);
        const scale = (1.0 - progress) * 0.28;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group>
      {/* 1. Summit Spindrift Snow Cloud (정상 칼바람 눈보라 깃발/배너 클라우드) */}
      <group ref={plumeRef} position={[0, 0, 6.4 * reliefScale]}>
        {spindrift.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.42} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* 2. North Cirque Alpine Tarn Lake (북벽 권곡 바닥 에메랄드 빙하호) */}
      <AnimatedWaterSurface
        position={[0, 5.2, 0.72 * reliefScale]}
        circular
        radius={1.4}
        color="#155d6e"
        opacity={0.88}
        waveScale={0.4}
      />
    </group>
  );
};

// ==========================================
// 21. U-shaped Glacial Valley Features (U자곡: 현곡 폭포 & 빙하 유출수)
// ==========================================
export const GlacialValleyFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group>
      {/* Valley Floor Braided Meltwater Stream */}
      <AnimatedWaterSurface
        position={[0, 0, 0.48 * reliefScale]}
        size={[6, 20]}
        color="#297b8f"
        opacity={0.85}
        waveScale={0.5}
      />
      {/* Hanging Valley Waterfall (현곡 폭포) plunging from left cliff */}
      <mesh position={[-2.4, 2.0, 1.8 * reliefScale]} rotation={[Math.PI * 0.44, 0, -Math.PI * 0.2]}>
        <planeGeometry args={[0.8, 2.6 * reliefScale]} />
        <meshStandardMaterial color="#e0f4ff" transparent opacity={0.88} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ==========================================
// 22. Desert Erg, Barchan Dunes & Dust Devil (사막)
// ==========================================
export const DesertFeatures: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const devilRef = useRef<THREE.Group>(null);

  const dustParticles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 22; i++) {
      list.push({
        radius: 0.15 + (i / 22) * 0.6,
        speed: 3.5 + Math.random() * 2.0,
        zRatio: i / 22,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (devilRef.current) {
      devilRef.current.children.forEach((child, i) => {
        const d = dustParticles[i];
        if (!d) return;
        const angle = t * d.speed + d.phase;
        child.position.set(Math.cos(angle) * d.radius, Math.sin(angle) * d.radius, d.zRatio * 3.5);
      });
    }
  });

  return (
    <group>
      {/* Swirling Desert Dust Devil (회오리바람) */}
      <group ref={devilRef} position={[2.8, -1.8, 0.8 * reliefScale]}>
        {dustParticles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#d4a363" transparent opacity={0.35} roughness={1.0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ==========================================
// 23. Genuine 3D Undercut Mushroom Rock
// ==========================================
export const UndercutMushroomRock: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Base pedestal foot */}
      <mesh position={[0, 0, (0.8 * reliefScale) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.4, 0.8 * reliefScale, 16]} />
        <meshStandardMaterial color="#947146" roughness={0.9} />
      </mesh>
      {/* 2. Narrow wind-abraded undercut neck */}
      <mesh position={[0, 0, 1.4 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.65, 0.8 * reliefScale, 16]} />
        <meshStandardMaterial color="#82623a" roughness={0.95} />
      </mesh>
      {/* 3. Broad heavy resistant caprock table */}
      <mesh position={[0, 0, 2.4 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.3, 1.6, 1.2 * reliefScale, 20]} />
        <meshStandardMaterial color="#c29157" roughness={0.75} />
      </mesh>
      {/* Top caprock dome */}
      <mesh position={[0, 0, 3.1 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[2.25, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        <meshStandardMaterial color="#d19f62" roughness={0.7} />
      </mesh>

      {/* Secondary mini mushroom rock in distance */}
      <group position={[4.2, 3.0, 0]}>
        <mesh position={[0, 0, 0.6 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.8, 1.2 * reliefScale, 12]} />
          <meshStandardMaterial color="#82623a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 1.6 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.4, 0.9, 0.8 * reliefScale, 16]} />
          <meshStandardMaterial color="#c29157" roughness={0.8} />
        </mesh>
      </group>

      {/* Ventifact pebbles */}
      {useMemo(() => {
        const pebbles: { pos: [number, number, number]; r: number; col: string }[] = [];
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 2.0 + Math.random() * 5.0;
          pebbles.push({
            pos: [Math.cos(angle) * dist, Math.sin(angle) * dist, 0.65 * reliefScale],
            r: 0.12 + Math.random() * 0.16,
            col: Math.random() > 0.5 ? '#695133' : '#8a6e4b',
          });
        }
        return pebbles.map((p, idx) => (
          <mesh key={idx} position={p.pos}>
            <dodecahedronGeometry args={[p.r, 0]} />
            <meshStandardMaterial color={p.col} roughness={0.9} />
          </mesh>
        ));
      }, [reliefScale])}
    </group>
  );
};

// ==========================================
// 24. 3D Desert Date Palm Trees & Spring for Oasis
// ==========================================
export const OasisPalms: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const palmClusters = [
    { pos: [1.8, 1.2, 0.68 * reliefScale], rot: 0.2, h: 1.8 },
    { pos: [-1.7, 1.4, 0.68 * reliefScale], rot: -0.4, h: 1.6 },
    { pos: [1.4, -1.6, 0.68 * reliefScale], rot: 0.6, h: 2.0 },
    { pos: [-1.5, -1.3, 0.68 * reliefScale], rot: -0.2, h: 1.7 },
  ];

  return (
    <group>
      {/* Date Palms */}
      {palmClusters.map((palm, pIdx) => (
        <group key={pIdx} position={palm.pos as [number, number, number]} rotation={[0, 0, palm.rot]}>
          <mesh position={[0, 0, palm.h / 2]} rotation={[Math.PI / 2, 0, 0.15]}>
            <cylinderGeometry args={[0.1, 0.18, palm.h, 8]} />
            <meshStandardMaterial color="#6e5338" roughness={0.9} />
          </mesh>
          <group position={[0, 0, palm.h]}>
            {[0, 60, 120, 180, 240, 300].map((deg, fIdx) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <group key={fIdx} rotation={[0, 0, rad]}>
                  <mesh position={[0.6, 0, -0.2]} rotation={[0, Math.PI * 0.15, 0]}>
                    <coneGeometry args={[0.28, 1.2, 5]} />
                    <meshStandardMaterial color="#357032" roughness={0.6} side={THREE.DoubleSide} />
                  </mesh>
                </group>
              );
            })}
          </group>
        </group>
      ))}

      {/* Bedouin Shade Tent Canvas */}
      <group position={[-2.8, 0.2, 0.72 * reliefScale]} rotation={[0, 0, 0.4]}>
        <mesh position={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.8, 1.1, 0.6, 4]} />
          <meshStandardMaterial color="#d4c8aa" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 25. Glacial Icebergs & Erratic Boulders
// ==========================================
export const GlacialFeatures: React.FC<{ reliefScale?: number; isFjord?: boolean }> = ({
  reliefScale = 1.0,
  isFjord = true,
}) => {
  const icebergs = [
    { pos: [-2.5, -1.0, 0.72 * reliefScale], s: 0.65 },
    { pos: [2.0, 2.2, 0.72 * reliefScale], s: 0.5 },
    { pos: [-0.8, 3.4, 0.72 * reliefScale], s: 0.4 },
  ];

  return (
    <group>
      {isFjord &&
        icebergs.map((ice, i) => (
          <mesh key={i} position={ice.pos as [number, number, number]} rotation={[0.2, 0.3, i]}>
            <dodecahedronGeometry args={[ice.s, 0]} />
            <meshStandardMaterial color="#e0f4ff" roughness={0.15} metalness={0.35} transparent opacity={0.92} />
          </mesh>
        ))}

      {/* Moraine Erratic Boulders */}
      {[
        { pos: [-3.8, -4.5, 2.8 * reliefScale], s: 0.55 },
        { pos: [4.2, -3.8, 2.6 * reliefScale], s: 0.7 },
      ].map((boulder, bIdx) => (
        <mesh key={bIdx} position={boulder.pos as [number, number, number]}>
          <dodecahedronGeometry args={[boulder.s, 0]} />
          <meshStandardMaterial color="#40464c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// ==========================================
// 26. Archetypal Caldera Lake & Central Cone Plume
// ==========================================
export const CalderaLakeFeatures: React.FC<{ reliefScale: number }> = ({ reliefScale }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const lakeGeometry = useMemo(() => new THREE.RingGeometry(0.001, 3.65, 64, 16), []);

  const basePositions = useMemo(() => {
    const pos = lakeGeometry.attributes.position;
    const arr = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      arr[i * 3] = pos.getX(i);
      arr[i * 3 + 1] = pos.getY(i);
      arr[i * 3 + 2] = pos.getZ(i);
    }
    return arr;
  }, [lakeGeometry]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = lakeGeometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const baseX = basePositions[i * 3];
      const baseY = basePositions[i * 3 + 1];
      const r = Math.hypot(baseX, baseY);
      const damping = Math.max(0, 1.0 - Math.pow(r / 3.65, 2.2));

      const w1 = Math.sin(baseX * 3.2 + t * 1.8) * 0.016;
      const w2 = Math.cos(baseY * 3.8 + t * 1.4) * 0.014;
      const w3 = Math.sin((baseX + baseY) * 2.5 - t * 2.0) * 0.01;

      pos.setZ(i, (w1 + w2 + w3) * damping);
    }
    pos.needsUpdate = true;
    lakeGeometry.computeVertexNormals();
  });

  return (
    <group>
      {/* 1. Deep Blue Caldera Lake Surface (수면) */}
      <group position={[0, 0, 1.62 * reliefScale]}>
        <mesh ref={meshRef} geometry={lakeGeometry}>
          <meshStandardMaterial
            color="#093f5e"
            roughness={0.06}
            metalness={0.28}
            transparent
            opacity={0.93}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2. Gentle Geothermal Steam Plume from Central Cone Crater (중앙화구구 화구 수증기) */}
      <VolcanicSteamPlume
        position={[0.55, 0.35, 2.52 * reliefScale]}
        count={16}
        isSulfur={false}
      />

      {/* 3. Sub-surface Hydrothermal Mineral Rims along Calmer Inlets */}
      {[
        { pos: [-2.2, 1.8, 1.625 * reliefScale] },
        { pos: [2.5, -1.9, 1.625 * reliefScale] },
        { pos: [-1.4, -2.4, 1.625 * reliefScale] },
      ].map((spring, idx) => (
        <group key={idx} position={spring.pos as [number, number, number]}>
          <mesh>
            <circleGeometry args={[0.32, 16]} />
            <meshStandardMaterial color="#387a6c" roughness={0.7} transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const CalderaCheonjiLake = CalderaLakeFeatures;

// ==========================================
// 27. Master Contextual Specialized Meshes Dispatcher
// Dispatches the accurate 3D accessories based
// on the active terrain category and subterrain!
// ==========================================
export const TerrainSpecialMeshes: React.FC<{
  normSub: string;
  category: string;
  reliefScale?: number;
}> = ({ normSub, category, reliefScale = 1.0 }) => {
  switch (normSub) {
    case '주상절리':
      return <ColumnarJointingColumns reliefScale={reliefScale} />;

    case '시스택':
    case '해식애':
      return (
        <group>
          <SeaArchAndStack reliefScale={reliefScale} />
          <AnimatedWaterSurface
            position={[0, 0, 0.48 * reliefScale]}
            size={[20, 20]}
            color="#144666"
            opacity={0.88}
          />
        </group>
      );

    case '해안 사구':
      return <CoastalDuneFeatures reliefScale={reliefScale} />;

    case '사주·사취':
      return <SandSpitFeatures reliefScale={reliefScale} />;

    case '석호':
      return (
        <group>
          {/* Calm inner lagoon */}
          <AnimatedWaterSurface
            position={[1.8, 0, 0.58 * reliefScale]}
            size={[8, 18]}
            color="#1d666e"
            opacity={0.85}
          />
          {/* Outer open sea */}
          <AnimatedWaterSurface
            position={[-6.0, 0, 0.42 * reliefScale]}
            size={[8, 20]}
            color="#0f3b54"
            opacity={0.9}
          />
        </group>
      );

    case '파식대':
      return <WaveCutPlatformFeatures reliefScale={reliefScale} />;

    case '갯벌':
      return <TidalFlatFeatures reliefScale={reliefScale} />;

    case '버섯바위':
      return <UndercutMushroomRock reliefScale={reliefScale} />;

    case '폭포':
      return <WaterfallCascades reliefScale={reliefScale} />;

    case '선상지':
      return <AlluvialFanFeatures reliefScale={reliefScale} />;

    case '곡류천':
      return <MeanderingRiverFeatures reliefScale={reliefScale} />;

    case '범람원':
      return <FloodplainFeatures reliefScale={reliefScale} />;

    case '삼각주':
      return <DeltaFeatures reliefScale={reliefScale} />;

    case '하안단구':
      return <RiverTerraceFeatures reliefScale={reliefScale} />;

    case '화산':
      return (
        <group>
          <AnimatedLavaLake elevation={3.12 * reliefScale} radius={0.82} />
          <VolcanicSteamPlume position={[0, 0, 3.15 * reliefScale]} count={28} />
        </group>
      );

    case '기생화산':
      return (
        <group>
          <AnimatedWaterSurface
            position={[0, 0, 1.75 * reliefScale]}
            circular
            radius={1.4}
            color="#1e4d3c"
            opacity={0.82}
          />
          <VolcanicSteamPlume position={[0, 0, 1.8 * reliefScale]} count={14} isSulfur />
        </group>
      );

    case '칼데라':
      return <CalderaLakeFeatures reliefScale={reliefScale} />;

    case '단층 산맥':
      return <FaultMountainFeatures reliefScale={reliefScale} />;

    case '권곡':
      return (
        <group>
          <AnimatedWaterSurface
            position={[0, -0.3, 1.25 * reliefScale]}
            circular
            radius={3.2}
            color="#16687a"
            opacity={0.9}
          />
          <GlacialFeatures reliefScale={reliefScale} isFjord={false} />
        </group>
      );

    case '피오르드':
      return (
        <group>
          <AnimatedWaterSurface
            position={[0, 0, 0.72 * reliefScale]}
            size={[20, 20]}
            color="#0b2e47"
            opacity={0.88}
          />
          <GlacialFeatures reliefScale={reliefScale} isFjord={true} />
        </group>
      );

    case 'U자곡':
      return <GlacialValleyFeatures reliefScale={reliefScale} />;

    case '혼':
      return <GlacialHornFeatures reliefScale={reliefScale} />;

    case '모레인':
      return (
        <group>
          <AnimatedWaterSurface
            position={[0, -0.8, 1.15 * reliefScale]}
            size={[8, 5]}
            color="#238299"
            opacity={0.88}
          />
          <GlacialFeatures reliefScale={reliefScale} isFjord={false} />
        </group>
      );

    case '사막':
      return <DesertFeatures reliefScale={reliefScale} />;

    case '오아시스':
      return (
        <group>
          <AnimatedWaterSurface
            position={[0, 0, 0.65 * reliefScale]}
            circular
            radius={1.8}
            color="#11798c"
            opacity={0.92}
          />
          <OasisPalms reliefScale={reliefScale} />
        </group>
      );

    case '플라야':
      return (
        <mesh position={[0, 0, 0.28 * reliefScale]}>
          <planeGeometry args={[19.5, 19.5]} />
          <meshStandardMaterial
            color="#e3f0f7"
            roughness={0.02}
            metalness={0.65}
            transparent
            opacity={0.6}
          />
        </mesh>
      );

    case '석회동굴':
      return <CavePortalFeatures reliefScale={reliefScale} isLavaTube={false} />;

    case '용암동굴':
      return <CavePortalFeatures reliefScale={reliefScale} isLavaTube={true} />;

    case '돌리네':
      return <DolineFeatures reliefScale={reliefScale} />;

    case '탑 카르스트':
      return <TowerKarstFeatures reliefScale={reliefScale} />;

    default:
      return null;
  }
};
