import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface ElevationSlicePlaneProps {
  visible: boolean;
  elevation: number;
  minElevation: number;
  maxElevation: number;
  size?: number;
  theme?: 'gold' | 'cyan' | 'ink';
}

export const ElevationSlicePlane: React.FC<ElevationSlicePlaneProps> = ({
  visible,
  elevation,
  minElevation,
  maxElevation,
  size = 20.2,
  theme = 'gold',
}) => {
  if (!visible) return null;

  const color = theme === 'cyan' ? '#0ea5e9' : theme === 'ink' ? '#64748b' : '#f59e0b';
  const glowColor = theme === 'cyan' ? '#38bdf8' : theme === 'ink' ? '#94a3b8' : '#fbbf24';

  return (
    <group position={[0, 0, elevation]}>
      {/* 1. Semi-transparent Glass Slicing Plane */}
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          roughness={0.15}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Outer Border Glowing Rim */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(size, size)]} />
        <lineBasicMaterial color={glowColor} linewidth={2} transparent opacity={0.8} />
      </lineSegments>

      {/* 3. Floating 3D Altitude Indicator Tag */}
      <group position={[size / 2 - 1.2, -size / 2 + 1.2, 0.15]}>
        <Html distanceFactor={14} center>
          <div className="bg-slate-950/90 backdrop-blur-md border border-amber-400/60 px-2.5 py-1 rounded-md text-white text-[11px] font-bold shadow-xl whitespace-nowrap pointer-events-none flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>수평 절단면: {elevation >= 0 ? '+' : ''}{elevation.toFixed(2)}m</span>
          </div>
        </Html>
      </group>
    </group>
  );
};
