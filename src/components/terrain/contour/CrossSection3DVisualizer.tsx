import React, { useMemo } from 'react';
import * as THREE from 'three';
import { TerrainElevationField } from '../../../types/contour';
import { getElevationAt } from './crossSectionMath';

interface CrossSection3DVisualizerProps {
  field: TerrainElevationField;
  line: { p1: [number, number]; p2: [number, number] } | null;
  hoverPoint: { x: number; y: number; z: number } | null;
}

export const CrossSection3DVisualizer: React.FC<CrossSection3DVisualizerProps> = ({
  field,
  line,
  hoverPoint,
}) => {
  if (!line) return null;

  const [x1, y1] = line.p1;
  const [x2, y2] = line.p2;

  // Generate surface sampling points along line (60 segments)
  const { topPoints, ribbonGeometry } = useMemo(() => {
    const numSteps = 80;
    const pts: THREE.Vector3[] = [];
    const ribbonVerts: number[] = [];
    const ribbonIndices: number[] = [];

    const baseZ = -1.15; // Diorama base pedestal depth

    for (let i = 0; i <= numSteps; i++) {
      const t = i / numSteps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      const pz = getElevationAt(field, px, py);

      // Top surface point (slightly elevated to prevent z-fighting with diorama mesh)
      const topVec = new THREE.Vector3(px, py, pz + 0.025);
      pts.push(topVec);

      // Ribbon vertex: Top (pz + 0.02) and Bottom (baseZ)
      ribbonVerts.push(px, py, pz + 0.02);
      ribbonVerts.push(px, py, baseZ);

      if (i < numSteps) {
        const v0 = i * 2;
        const v1 = i * 2 + 1;
        const v2 = (i + 1) * 2;
        const v3 = (i + 1) * 2 + 1;

        // Two triangles for each strip segment
        ribbonIndices.push(v0, v1, v2);
        ribbonIndices.push(v2, v1, v3);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(ribbonVerts, 3));
    geom.setIndex(ribbonIndices);
    geom.computeVertexNormals();

    return { topPoints: pts, ribbonGeometry: geom };
  }, [field, x1, y1, x2, y2]);

  // Top surface line geometry & Three.js Line object
  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(topPoints);
    const mat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 });
    return new THREE.Line(geom, mat);
  }, [topPoints]);

  const p1Z = getElevationAt(field, x1, y1);
  const p2Z = getElevationAt(field, x2, y2);

  return (
    <group name="cross-section-3d-visualizer">
      {/* 1. Translucent Vertical Cutting Ribbon Laser Wall */}
      <mesh geometry={ribbonGeometry}>
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Sharp Glowing Laser Cut Line on Terrain Surface */}
      <primitive object={lineObj} />

      {/* 3. Point A Marker Pin (Amber Gold) */}
      <group position={[x1, y1, p1Z]}>
        {/* Beacon Sphere */}
        <mesh position={[0, 0, 0.4]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Vertical Pin Needle */}
        <mesh position={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Pulse Ring */}
        <mesh position={[0, 0, 0.05]}>
          <ringGeometry args={[0.25, 0.35, 24]} />
          <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 4. Point B Marker Pin (Cyan Sky) */}
      <group position={[x2, y2, p2Z]}>
        {/* Beacon Sphere */}
        <mesh position={[0, 0, 0.4]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        {/* Vertical Pin Needle */}
        <mesh position={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        {/* Pulse Ring */}
        <mesh position={[0, 0, 0.05]}>
          <ringGeometry args={[0.25, 0.35, 24]} />
          <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 5. Interactive Hover Scrubbing Beacon Point */}
      {hoverPoint && (
        <group position={[hoverPoint.x, hoverPoint.y, hoverPoint.z]}>
          {/* Glowing Cursor Sphere */}
          <mesh position={[0, 0, 0.3]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
          {/* Vertical Guide Line */}
          <mesh position={[0, 0, 0.8]}>
            <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.8} />
          </mesh>
          {/* Target Base Ripple */}
          <mesh position={[0, 0, 0.02]}>
            <ringGeometry args={[0.2, 0.4, 32]} />
            <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};
