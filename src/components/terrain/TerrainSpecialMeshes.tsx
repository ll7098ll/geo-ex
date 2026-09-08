import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ==========================================
// 1. Animated Realistic Water Shader
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
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.z = (position ? position[2] : elevation) + Math.sin(t * 1.5) * 0.02;
    }
  });

  const pos: [number, number, number] = position || [0, 0, elevation];

  return (
    <mesh ref={meshRef} position={pos}>
      {circular ? (
        <circleGeometry args={[radius, 48]} />
      ) : (
        <planeGeometry args={size} />
      )}
      <meshStandardMaterial
        ref={matRef}
        color={color}
        roughness={0.08}
        metalness={0.25}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ==========================================
// 2. Animated Pulsing Lava Lake for Volcanoes
// ==========================================
export const AnimatedLavaLake: React.FC<{ elevation?: number; radius?: number; position?: [number, number, number] }> = ({
  elevation = 3.6,
  radius = 1.3,
  position,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) {
      const pulse = 0.75 + Math.sin(t * 2.5) * 0.25;
      matRef.current.emissiveIntensity = pulse * 1.8;
    }
  });

  const pos: [number, number, number] = position || [0, 0, elevation];

  return (
    <mesh ref={meshRef} position={pos}>
      <circleGeometry args={[radius, 32]} />
      <meshStandardMaterial
        ref={matRef}
        color="#ff3b00"
        emissive="#ff2200"
        emissiveIntensity={1.5}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};

// ==========================================
// 3. True 3D Hexagonal Basalt Columns for 주상절리
// ==========================================
export const ColumnarJointingColumns: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  // Generate a cluster of genuine vertical hexagonal prism columns stepping into the sea
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

        // Clustered on the seaward terrace
        if (x > -1.0 && x < 8.0 && Math.abs(y) < 7.5) {
          // Stepped terrace heights
          const stepBase = 2.4 - (x - 2.5) * 0.45 - (d * 0.08);
          const height = Math.max(0.6, (stepBase + ((Math.sin(q * 17 + r * 31) * 0.5 + 0.5) * 1.2)) * reliefScale);
          const z = height / 2;

          const shade = 0.12 + (Math.sin(q * 7 + r * 13) * 0.5 + 0.5) * 0.08;
          const col = new THREE.Color(shade, shade * 1.05, shade * 1.15).getHexString();

          list.push({
            pos: [x, y, z],
            height,
            radius: hexRadius * 0.95, // slight gap between columns
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
          <meshStandardMaterial
            color={col.color}
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>
      ))}
      {/* Coastal wave foam plane */}
      <mesh position={[-2.5, 0, 0.42 * reliefScale]}>
        <planeGeometry args={[9, 16]} />
        <meshStandardMaterial
          color="#a8d3e6"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// ==========================================
// 4. Genuine 3D Undercut Mushroom Rock for 버섯바위
// ==========================================
export const UndercutMushroomRock: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Central Primary Mushroom Rock */}
      {/* 1. Base pedestal foot */}
      <mesh position={[0, 0, (0.8 * reliefScale) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.4, 0.8 * reliefScale, 16]} />
        <meshStandardMaterial color="#947146" roughness={0.9} />
      </mesh>
      {/* 2. Narrow wind-abraded undercut neck (지표 1m 집중 마식 작용) */}
      <mesh position={[0, 0, 1.4 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.65, 0.8 * reliefScale, 16]} />
        <meshStandardMaterial color="#82623a" roughness={0.95} />
      </mesh>
      {/* 3. Broad heavy resistant caprock table (모자바위) */}
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
// 5. Cascading Waterfall Sheet & Plunge Pool
// ==========================================
export const WaterfallCascades: React.FC<{ reliefScale?: number }> = ({ reliefScale = 1.0 }) => {
  const cascadeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (cascadeRef.current) {
      const t = clock.getElapsedTime();
      cascadeRef.current.position.x = Math.sin(t * 12) * 0.02;
    }
  });

  return (
    <group>
      {/* Vertical falling water sheet plunging from upper river down into plunge pool */}
      <mesh
        ref={cascadeRef}
        position={[0, -0.2, (2.3 * reliefScale)]}
        rotation={[Math.PI * 0.42, 0, 0]}
      >
        <planeGeometry args={[2.6, 3.4 * reliefScale]} />
        <meshStandardMaterial
          color="#d1effa"
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Foaming Plunge Pool Water Disc */}
      <mesh position={[0, 1.8, 0.48 * reliefScale]}>
        <circleGeometry args={[2.1, 32]} />
        <meshStandardMaterial
          color="#38829e"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Upper River Stream Water */}
      <mesh position={[0, -4.8, 3.8 * reliefScale]}>
        <planeGeometry args={[2.6, 7.5]} />
        <meshStandardMaterial
          color="#2d6e8a"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Lower Gorge River */}
      <mesh position={[0, 6.0, 0.52 * reliefScale]}>
        <planeGeometry args={[2.4, 6.5]} />
        <meshStandardMaterial
          color="#2d6e8a"
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
};

// ==========================================
// 6. Cave Portal & Stalactites for Limestone & Lava Caves
// ==========================================
export const CavePortalFeatures: React.FC<{ reliefScale?: number; isLavaTube?: boolean }> = ({
  reliefScale = 1.0,
  isLavaTube = false,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Dark interior cave void */}
      <mesh position={[0, 0, 0.3 * reliefScale]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.4, 24]} />
        <meshBasicMaterial color="#080706" />
      </mesh>

      {/* Stalactites (종유석) hanging from roof */}
      {!isLavaTube && (
        <group position={[0, 0, 1.6 * reliefScale]}>
          {[
            { pos: [-0.6, -0.4, 0], h: 0.8 },
            { pos: [0.5, -0.3, 0], h: 1.1 },
            { pos: [0.2, 0.6, 0], h: 0.9 },
            { pos: [-0.7, 0.5, 0], h: 0.7 },
          ].map((st, idx) => (
            <mesh key={idx} position={st.pos as [number, number, number]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.15, st.h * reliefScale, 8]} />
              <meshStandardMaterial color="#8c8881" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// ==========================================
// 7. Master Contextual Specialized Meshes
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

    case '버섯바위':
      return <UndercutMushroomRock reliefScale={reliefScale} />;

    case '폭포':
      return <WaterfallCascades reliefScale={reliefScale} />;

    case '화산':
      return <AnimatedLavaLake elevation={4.3 * reliefScale} radius={1.4} />;

    case '기생화산':
      // Crater lake / wetland inside summit bowl
      return (
        <AnimatedWaterSurface
          position={[0, 0, 1.75 * reliefScale]}
          circular
          radius={1.4}
          color="#1e4d3c"
          opacity={0.82}
        />
      );

    case '칼데라':
      // Deep caldera lake filling the basin around the resurgent dome
      return (
        <AnimatedWaterSurface
          position={[-0.4, -0.2, 1.45 * reliefScale]}
          circular
          radius={5.5}
          color="#0f4466"
          opacity={0.92}
        />
      );

    case '권곡':
      // Alpine Tarn lake cradled in glacial cirque basin
      return (
        <AnimatedWaterSurface
          position={[0, -0.3, 1.25 * reliefScale]}
          circular
          radius={3.2}
          color="#16687a"
          opacity={0.9}
        />
      );

    case '모레인':
      // Glacial meltwater lake dammed by terminal moraine
      return (
        <AnimatedWaterSurface
          position={[0, -0.8, 1.15 * reliefScale]}
          size={[8, 5]}
          color="#238299"
          opacity={0.88}
        />
      );

    case '오아시스':
      // Desert oasis spring pool
      return (
        <AnimatedWaterSurface
          position={[0, 0, 0.65 * reliefScale]}
          circular
          radius={1.8}
          color="#11798c"
          opacity={0.92}
        />
      );

    case '곡류천':
      // Meandering river water & oxbow lake water
      return (
        <group>
          <AnimatedWaterSurface
            position={[0, 0, 0.42 * reliefScale]}
            size={[20, 20]}
            color="#1d596e"
            opacity={0.82}
          />
        </group>
      );

    case '석호':
      // Outer ocean + inner calm brackish lagoon
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
    case '해식애':
    case '시스택':
    case '파식대':
    case '갯벌':
    case '피오르드':
      // High-grade ocean water with subtle foam
      return (
        <AnimatedWaterSurface
          position={[0, 0, (normSub === '피오르드' ? 0.72 : 0.48) * reliefScale]}
          size={[20, 20]}
          color={normSub === '피오르드' ? '#0b2e47' : '#144666'}
          opacity={0.88}
        />
      );

    case '플라야':
      // Ultra-reflective shallow salt film
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
