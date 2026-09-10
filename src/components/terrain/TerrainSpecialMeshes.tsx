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
}

export const AnimatedWaterSurface: React.FC<WaterMeshProps> = ({
  color = '#1b5e7d',
  opacity = 0.85,
  elevation = 0.5,
  size = [20, 20],
  position,
  circular = false,
  radius = 6,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);

  // Store initial vertex positions for wave calculations
  const originalZRef = useRef<Float32Array | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle bulk oscillation
      const baseZ = position ? position[2] : elevation;
      meshRef.current.position.z = baseZ + Math.sin(t * 1.8) * 0.015;
    }

    // Dynamic wave ripples across vertices
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
        // Multi-frequency wave formula
        const wave1 = Math.sin(x * 1.4 + t * 2.2) * 0.035;
        const wave2 = Math.cos(y * 1.6 + t * 1.7) * 0.03;
        const wave3 = Math.sin((x + y) * 0.9 - t * 2.8) * 0.02;
        posAttr.setZ(i, (originalZRef.current ? originalZRef.current[i] : 0) + wave1 + wave2 + wave3);
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
export const AnimatedLavaLake: React.FC<{ elevation?: number; radius?: number; position?: [number, number, number] }> = ({
  elevation = 3.6,
  radius = 1.3,
  position,
}) => {
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
// 3. Dynamic Volcanic Ash & Steam Plume Particles
// ==========================================
export const VolcanicSteamPlume: React.FC<{
  position?: [number, number, number];
  count?: number;
  isSulfur?: boolean;
}> = ({ position = [0, 0, 4.4], count = 28, isSulfur = false }) => {
  const groupRef = useRef<THREE.Group>(null);

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

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      if (!p) return;
      const age = (t + p.phase) % 3.5;
      const progress = age / 3.5; // 0 to 1

      const currentZ = progress * 4.2;
      const swirl = t * p.swirlSpeed + i;
      const currentRadius = p.swirlRadius * (0.4 + progress * 1.6);
      const currentX = p.baseX + Math.cos(swirl) * currentRadius + progress * 0.6; // gentle wind drift
      const currentY = p.baseY + Math.sin(swirl) * currentRadius;

      child.position.set(currentX, currentY, currentZ);

      // Scale grows as smoke billows into the sky
      const currentScale = p.size * (1.0 + progress * 2.8);
      child.scale.set(currentScale, currentScale, currentScale);

      // Opacity fades out towards the top
      const mesh = child as THREE.Mesh;
      if (mesh.material && !Array.isArray(mesh.material)) {
        (mesh.material as THREE.MeshStandardMaterial).opacity =
          Math.sin(progress * Math.PI) * (isSulfur ? 0.45 : 0.6);
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
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
  );
};

// ==========================================
// 4. True 3D Hexagonal Basalt Columns for 주상절리
// ==========================================
export const ColumnarJointingColumns: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const columns = useMemo(() => {
    const list: { pos: [number, number, number]; height: number; radius: number; color: string }[] = [];
    const hexRadius = 0.38;
    const hexW = hexRadius * Math.sqrt(3);
    const hexH = hexRadius * 1.5;

    for (let r = -6; r <= 6; r++) {
      for (let q = -5; q <= 6; q++) {
        const x = (q * hexW + ((r % 2) * hexW) / 2) + 2.5;
        const y = r * hexH;
        const d = Math.sqrt(x * x + y * y);

        if (x > -1.0 && x < 8.0 && Math.abs(y) < 7.5) {
          const stepBase = 2.4 - (x - 2.5) * 0.45 - d * 0.08;
          const height = Math.max(0.6, (stepBase + ((Math.sin(q * 17 + r * 31) * 0.5 + 0.5) * 1.2)) * reliefScale);
          const z = height / 2;

          const shade = 0.12 + (Math.sin(q * 7 + r * 13) * 0.5 + 0.5) * 0.08;
          const col = new THREE.Color(shade, shade * 1.05, shade * 1.15).getHexString();

          list.push({
            pos: [x, y, z],
            height,
            radius: hexRadius * 0.95,
            color: `#${col}`,
          });
        }
      }
    }
    return list;
  }, [reliefScale]);

  return (
    <group>
      {columns.map((col, idx) => (
        <mesh key={idx} position={col.pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[col.radius, col.radius, col.height, 6]} />
          <meshStandardMaterial color={col.color} roughness={0.65} metalness={0.15} />
        </mesh>
      ))}
      {/* Coastal wave foam plane */}
      <mesh position={[-2.5, 0, 0.42 * reliefScale]}>
        <planeGeometry args={[9, 16]} />
        <meshStandardMaterial color="#a8d3e6" roughness={0.1} metalness={0.2} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// ==========================================
// 5. True 3D Sea Arch & Crashing Sea Stack
// ==========================================
export const SeaArchAndStack: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const foamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (foamRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1.0 + Math.sin(t * 3.2) * 0.12;
      foamRef.current.scale.set(scale, scale, 1.0);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Sea Arch Bridge Span with Hollow Center */}
      <group position={[3.2, 1.0, 1.3 * reliefScale]} rotation={[0, 0, Math.PI * 0.1]}>
        {/* Arch curved lintel */}
        <mesh position={[0, 0, 1.1 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.55, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#63594e" roughness={0.85} />
        </mesh>
        {/* Left cliff leg */}
        <mesh position={[-1.5, 0, 0.2 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.95, 1.8 * reliefScale, 12]} />
          <meshStandardMaterial color="#574e44" roughness={0.9} />
        </mesh>
        {/* Right seaward pillar leg */}
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
        {/* Crashing white surf foam ring around stack base */}
        <mesh ref={foamRef} position={[0, 0, 0.48 * reliefScale]}>
          <ringGeometry args={[0.85, 1.5, 24]} />
          <meshStandardMaterial color="#eef8fc" transparent opacity={0.78} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 6. Genuine 3D Undercut Mushroom Rock
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
      <group position={[4.5, 3.2, 0]}>
        <mesh position={[0, 0, 0.6 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.8, 1.2 * reliefScale, 12]} />
          <meshStandardMaterial color="#82623a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 1.6 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.4, 0.9, 0.8 * reliefScale, 16]} />
          <meshStandardMaterial color="#c29157" roughness={0.8} />
        </mesh>
      </group>

      {/* Desert pavement ventifact pebbles around base */}
      {useMemo(() => {
        const pebbles: { pos: [number, number, number]; r: number; col: string }[] = [];
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 2.0 + Math.random() * 5.0;
          const px = Math.cos(angle) * dist;
          const py = Math.sin(angle) * dist;
          pebbles.push({
            pos: [px, py, 0.65 * reliefScale],
            r: 0.12 + Math.random() * 0.18,
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
// 7. Cascading Waterfall with Plunge Pool Mist
// ==========================================
export const WaterfallCascades: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const cascadeRef = useRef<THREE.Mesh>(null);
  const mistGroupRef = useRef<THREE.Group>(null);

  const mistParticles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 22; i++) {
      list.push({
        baseX: (Math.random() - 0.5) * 1.8,
        baseY: 1.5 + (Math.random() - 0.5) * 0.8,
        speedZ: 0.6 + Math.random() * 0.6,
        size: 0.3 + Math.random() * 0.35,
        phase: (i / 22) * 2.5,
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
      {/* 1. Vertical falling water sheet */}
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
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Foaming Plunge Pool Water Disc */}
      <mesh position={[0, 1.8, 0.48 * reliefScale]}>
        <circleGeometry args={[2.1, 32]} />
        <meshStandardMaterial color="#38829e" roughness={0.2} metalness={0.1} transparent opacity={0.9} />
      </mesh>
      {/* White churning foam ring */}
      <mesh position={[0, 1.8, 0.49 * reliefScale]}>
        <ringGeometry args={[0.6, 1.8, 24]} />
        <meshStandardMaterial color="#eef8fc" transparent opacity={0.7} roughness={0.3} />
      </mesh>

      {/* 3. Rising Water Spray Mist Particles */}
      <group ref={mistGroupRef}>
        {mistParticles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#f0faff" transparent opacity={0.4} roughness={1} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* Upper River Stream Water */}
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
// 8. Cave Portal, Stalactites & Lava Tubes
// ==========================================
export const CavePortalFeatures: React.FC<{ reliefScale?: number; isLavaTube?: boolean }> = ({
  reliefScale = 1.0,
  isLavaTube = false,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Dark interior cave void portal */}
      <mesh position={[0, 0, 0.3 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.6, 2.6, 0.6, 24]} />
        <meshBasicMaterial color="#080706" />
      </mesh>

      {!isLavaTube ? (
        // Limestone Cave (석회동굴): Stalactites, Stalagmites, Underground River
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

          {/* Subterranean cave stream flowing out */}
          <mesh position={[0, 0.6, 0.32 * reliefScale]}>
            <planeGeometry args={[1.4, 4.0]} />
            <meshStandardMaterial color="#198287" roughness={0.1} metalness={0.2} transparent opacity={0.8} />
          </mesh>
        </group>
      ) : (
        // Lava Tube (용암동굴): Basalt Tube, Lava Stalactites & Glowing cooling cracks
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
        </group>
      )}
    </group>
  );
};

// ==========================================
// 9. 3D Desert Date Palm Trees for Oasis
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
      {palmClusters.map((palm, pIdx) => (
        <group key={pIdx} position={palm.pos as [number, number, number]} rotation={[0, 0, palm.rot]}>
          {/* Curved Trunk */}
          <mesh position={[0, 0, palm.h / 2]} rotation={[Math.PI / 2, 0, 0.15]}>
            <cylinderGeometry args={[0.1, 0.18, palm.h, 8]} />
            <meshStandardMaterial color="#6e5338" roughness={0.9} />
          </mesh>

          {/* Palm Fronds Canopy */}
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
    </group>
  );
};

// ==========================================
// 10. Glacial Icebergs & Erratic Boulders
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

      {/* Moraine Erratic Boulders perched on ridges */}
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
// 11. Master Contextual Specialized Meshes
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

    case '버섯바위':
      return <UndercutMushroomRock reliefScale={reliefScale} />;

    case '폭포':
      return <WaterfallCascades reliefScale={reliefScale} />;

    case '화산':
      return (
        <group>
          <AnimatedLavaLake elevation={4.3 * reliefScale} radius={1.4} />
          <VolcanicSteamPlume position={[0, 0, 4.3 * reliefScale]} count={28} />
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
      return (
        <group>
          <AnimatedWaterSurface
            position={[-0.4, -0.2, 1.45 * reliefScale]}
            circular
            radius={5.5}
            color="#0f4466"
            opacity={0.92}
          />
          {/* Secondary steam vents from resurgent dome */}
          <VolcanicSteamPlume position={[-0.4, -0.2, 2.4 * reliefScale]} count={12} isSulfur />
        </group>
      );

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

    case '곡류천':
      return (
        <AnimatedWaterSurface
          position={[0, 0, 0.42 * reliefScale]}
          size={[20, 20]}
          color="#1d596e"
          opacity={0.82}
        />
      );

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

    case '사주·사취':
    case '파식대':
    case '갯벌':
      return (
        <AnimatedWaterSurface
          position={[0, 0, 0.48 * reliefScale]}
          size={[20, 20]}
          color="#144666"
          opacity={0.88}
        />
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

    default:
      return null;
  }
};
