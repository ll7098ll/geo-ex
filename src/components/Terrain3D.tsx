import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  generateTerrainDioramaGeometry,
  resolveTerrainKey,
  getBaseWaterElevation,
  getTerrainContourMeta,
  TerrainMaterialPreset,
} from './terrain/terrainGenerators';
import { getTerrainBumpTexture, TexturePatternKey } from './terrain/terrainTextures';
import { TerrainSpecialMeshes } from './terrain/TerrainSpecialMeshes';
import {
  createContourShaderUniforms,
  updateContourShaderUniforms,
  injectContourShader,
  TerrainShaderUniforms,
} from './terrain/contour/terrainContourShader';

// ==========================================
// Terrain Default Material Settings per Category & SubTerrain
// ==========================================
export function getDefaultMaterialSettings(category: string, subTerrain: string, placeContext?: string) {
  const normSub = resolveTerrainKey(subTerrain, placeContext);
  let roughness = 0.75;
  let metalness = 0.05;
  let bumpScale = 0.035;

  if (category === 'volcanic') {
    if (normSub === '주상절리') {
      roughness = 0.55;
      metalness = 0.18;
      bumpScale = 0.045;
    } else if (normSub === '용암동굴') {
      roughness = 0.85;
      metalness = 0.12;
      bumpScale = 0.04;
    } else {
      roughness = 0.78;
      metalness = 0.08;
      bumpScale = 0.035;
    }
  } else if (category === 'glacial') {
    roughness = 0.28;
    metalness = 0.35;
    bumpScale = 0.03;
  } else if (category === 'arid') {
    if (normSub === '플라야') {
      roughness = 0.08;
      metalness = 0.55;
      bumpScale = 0.015;
    } else {
      roughness = 0.95;
      metalness = 0.03;
      bumpScale = 0.025;
    }
  } else if (category === 'karst') {
    roughness = 0.72;
    metalness = 0.06;
    bumpScale = 0.042;
  } else if (category === 'coastal') {
    roughness = 0.65;
    metalness = 0.15;
    bumpScale = 0.03;
  } else {
    roughness = 0.72;
    metalness = 0.08;
    bumpScale = 0.03;
  }

  return {
    materialPreset: 'natural' as TerrainMaterialPreset,
    texturePattern: 'auto' as TexturePatternKey,
    roughness,
    metalness,
    bumpScale,
    opacity: 1.0,
  };
}

// ==========================================
// Inner 3D Diorama Mesh Component
// ==========================================
interface DioramaMeshProps {
  category: string;
  subTerrain: string;
  placeContext?: string;
  reliefScale: number;
  showStrata: boolean;
  show3DContours: boolean;
  contourInterval: number;
  indexInterval: number;
  materialPreset: TerrainMaterialPreset;
  texturePattern: TexturePatternKey;
  roughness: number;
  metalness: number;
  bumpScale: number;
}

const DioramaMesh: React.FC<DioramaMeshProps> = ({
  category,
  subTerrain,
  placeContext,
  reliefScale,
  showStrata,
  show3DContours,
  contourInterval,
  indexInterval,
  materialPreset,
  texturePattern,
  roughness,
  metalness,
  bumpScale,
}) => {
  const normSub = resolveTerrainKey(subTerrain, placeContext);
  const waterLevel = useMemo(
    () => getBaseWaterElevation(normSub, reliefScale),
    [normSub, reliefScale]
  );

  // Generate solid diorama block geometry with terrain surface + geological strata skirts
  const geometry = useMemo(() => {
    return generateTerrainDioramaGeometry(
      category,
      subTerrain,
      reliefScale,
      showStrata,
      4,
      materialPreset,
      placeContext
    );
  }, [category, subTerrain, reliefScale, showStrata, materialPreset, placeContext]);

  const bumpTexture = useMemo(
    () => getTerrainBumpTexture(texturePattern, category),
    [texturePattern, category]
  );

  // Isoline Contour Shader Uniforms Cache
  const uniformsRef = useRef<TerrainShaderUniforms>(
    createContourShaderUniforms({
      showContours: show3DContours,
      contourInterval,
      indexInterval,
      highlightElevation: null,
      theme: 'gold',
      showValleyRidgeGuide: false,
      showSlopeHeat: false,
      waterLevel,
    })
  );

  // Dynamic Uniforms update (0ms runtime update without recompiling shaders)
  useEffect(() => {
    updateContourShaderUniforms(uniformsRef.current, {
      showContours: show3DContours,
      contourInterval,
      indexInterval,
      highlightElevation: null,
      theme: 'gold',
      showValleyRidgeGuide: false,
      showSlopeHeat: false,
      waterLevel,
    });
  }, [show3DContours, contourInterval, indexInterval, waterLevel]);

  // Hook into Three.js standard material shader pipeline
  const handleBeforeCompile = useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    injectContourShader(shader, uniformsRef.current);
  }, []);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* 1. Solid Diorama Mesh (Terrain Surface + 4 Side Strata Skirts + Bottom Plate) */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          bumpMap={bumpTexture}
          bumpScale={bumpScale}
          roughness={roughness}
          metalness={metalness}
          onBeforeCompile={handleBeforeCompile}
          customProgramCacheKey={() => `terrain_mat_v7_${materialPreset}`}
        />
      </mesh>

      {/* 2. Beveled Dark Obsidian Base Pedestal Rim */}
      <mesh position={[0, 0, -1.35]}>
        <boxGeometry args={[20.4, 20.4, 0.3]} />
        <meshStandardMaterial color="#0f1115" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 3. Contextual 3D Special Meshes (Columns, Waterfalls, Lava, Water bodies, Caves, etc.) */}
      <TerrainSpecialMeshes
        normSub={normSub}
        category={category}
        reliefScale={reliefScale}
      />
    </group>
  );
};

// ==========================================
// Terrain Atmospheric Lighting & Environment Rig
// ==========================================
interface TerrainAtmosphereProps {
  category: string;
}

const TerrainEnvironmentRig: React.FC<TerrainAtmosphereProps> = ({ category }) => {
  const { scene } = useThree();

  const config = useMemo(() => {
    switch (category) {
      case 'volcanic':
        return {
          sunPos: [80, 20, 60] as [number, number, number],
          turbidity: 8.0,
          rayleigh: 2.6,
          keyColor: '#ffaa66',
          keyIntensity: 2.2,
          hemiSky: '#5e3229',
          hemiGround: '#241714',
          hemiIntensity: 0.85,
          rimColor: '#e05638',
          rimIntensity: 0.75,
          fogColor: '#1c1310',
          fogDensity: 0.015,
          preset: 'sunset' as const,
        };
      case 'glacial':
        return {
          sunPos: [100, 45, 90] as [number, number, number],
          turbidity: 0.2,
          rayleigh: 0.35,
          keyColor: '#f2f8ff',
          keyIntensity: 2.5,
          hemiSky: '#b8dcff',
          hemiGround: '#5a7894',
          hemiIntensity: 0.95,
          rimColor: '#90caff',
          rimIntensity: 0.9,
          fogColor: '#0f1826',
          fogDensity: 0.014,
          preset: 'dawn' as const,
        };
      case 'arid':
        return {
          sunPos: [80, 50, 40] as [number, number, number],
          turbidity: 9.0,
          rayleigh: 2.8,
          keyColor: '#fff2d6',
          keyIntensity: 2.6,
          hemiSky: '#ffdfa8',
          hemiGround: '#996939',
          hemiIntensity: 0.85,
          rimColor: '#ffd180',
          rimIntensity: 0.7,
          fogColor: '#211812',
          fogDensity: 0.017,
          preset: 'park' as const,
        };
      case 'karst':
        return {
          sunPos: [90, 28, 80] as [number, number, number],
          turbidity: 2.5,
          rayleigh: 1.2,
          keyColor: '#fffcee',
          keyIntensity: 2.1,
          hemiSky: '#b6e6d8',
          hemiGround: '#264d3b',
          hemiIntensity: 0.85,
          rimColor: '#5eead4',
          rimIntensity: 0.65,
          fogColor: '#121e1a',
          fogDensity: 0.015,
          preset: 'city' as const,
        };
      case 'coastal':
        return {
          sunPos: [100, 38, 80] as [number, number, number],
          turbidity: 1.2,
          rayleigh: 0.75,
          keyColor: '#fffef0',
          keyIntensity: 2.3,
          hemiSky: '#aae2ff',
          hemiGround: '#194361',
          hemiIntensity: 0.9,
          rimColor: '#38bdf8',
          rimIntensity: 0.75,
          fogColor: '#0e1d29',
          fogDensity: 0.015,
          preset: 'city' as const,
        };
      case 'fluvial':
      default:
        return {
          sunPos: [100, 35, 75] as [number, number, number],
          turbidity: 1.5,
          rayleigh: 0.9,
          keyColor: '#fffde6',
          keyIntensity: 2.2,
          hemiSky: '#cceeff',
          hemiGround: '#2e5223',
          hemiIntensity: 0.85,
          rimColor: '#86efac',
          rimIntensity: 0.65,
          fogColor: '#112022',
          fogDensity: 0.015,
          preset: 'city' as const,
        };
    }
  }, [category]);

  useEffect(() => {
    scene.fog = new THREE.FogExp2(config.fogColor, config.fogDensity);
    return () => {
      scene.fog = null;
    };
  }, [scene, config.fogColor, config.fogDensity]);

  return (
    <>
      <Sky sunPosition={config.sunPos} turbidity={config.turbidity} rayleigh={config.rayleigh} />
      <Environment preset={config.preset} />
      <hemisphereLight
        color={config.hemiSky}
        groundColor={config.hemiGround}
        intensity={config.hemiIntensity}
      />
      <directionalLight
        position={[14, 20, 10]}
        intensity={config.keyIntensity}
        color={config.keyColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight
        position={[-12, 10, -10]}
        intensity={config.rimIntensity}
        color={config.rimColor}
      />
      <directionalLight position={[0, -12, 6]} intensity={0.25} color="#edf4ff" />
    </>
  );
};

// ==========================================
// Main Export: Terrain3D Component
// ==========================================
export interface Terrain3DRef {
  resetCamera: () => void;
  toggleAutoRotate: () => void;
}

export interface Terrain3DProps {
  category: string;
  subTerrain: string;
  placeContext?: string;
  autoRotate?: boolean;
  onAutoRotateChange?: (autoRotate: boolean) => void;
  show3DContours?: boolean;
  showStrata?: boolean;
  reliefScale?: number;
  isActive?: boolean;
}

const Terrain3D = React.forwardRef<Terrain3DRef, Terrain3DProps>(({
  category,
  subTerrain,
  placeContext,
  autoRotate: autoRotateProp,
  onAutoRotateChange,
  show3DContours = false,
  showStrata = true,
  reliefScale = 1.0,
  isActive = true,
}, ref) => {
  const [internalAutoRotate, setInternalAutoRotate] = useState(true);
  const autoRotate = autoRotateProp !== undefined ? autoRotateProp : internalAutoRotate;
  const controlsRef = useRef<any>(null);

  const setAutoRotateState = useCallback(
    (val: boolean | ((prev: boolean) => boolean)) => {
      const nextVal = typeof val === 'function' ? val(autoRotate) : val;
      setInternalAutoRotate(nextVal);
      onAutoRotateChange?.(nextVal);
    },
    [autoRotate, onAutoRotateChange]
  );

  const handleResetCamera = useCallback(() => {
    if (!controlsRef.current) return;
    setAutoRotateState(false);
    controlsRef.current.object.position.set(0, 10, 16);
    controlsRef.current.target.set(0, 0.5, 0);
    controlsRef.current.update();
  }, [setAutoRotateState]);

  React.useImperativeHandle(
    ref,
    () => ({
      resetCamera: handleResetCamera,
      toggleAutoRotate: () => setAutoRotateState((prev) => !prev),
    }),
    [handleResetCamera, setAutoRotateState]
  );

  const matDefaults = useMemo(
    () => getDefaultMaterialSettings(category, subTerrain, placeContext),
    [category, subTerrain, placeContext]
  );

  const contourSettings = useMemo(() => {
    const normSub = resolveTerrainKey(subTerrain, placeContext);
    return getTerrainContourMeta(normSub).contourSettings;
  }, [subTerrain, placeContext]);

  return (
    <div className="w-full h-full bg-radial from-slate-900 via-slate-950 to-black relative overflow-hidden select-none">
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        frameloop={isActive ? 'always' : 'demand'}
        camera={{ position: [0, 10, 16], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <TerrainEnvironmentRig category={category} />

        <React.Suspense fallback={null}>
          <DioramaMesh
            category={category}
            subTerrain={subTerrain}
            placeContext={placeContext}
            reliefScale={reliefScale}
            showStrata={showStrata}
            show3DContours={show3DContours}
            contourInterval={contourSettings.intermediateInterval}
            indexInterval={contourSettings.indexInterval}
            materialPreset={matDefaults.materialPreset}
            texturePattern={matDefaults.texturePattern}
            roughness={matDefaults.roughness}
            metalness={matDefaults.metalness}
            bumpScale={matDefaults.bumpScale}
          />
        </React.Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2 + 0.05}
          minDistance={4}
          maxDistance={36}
          autoRotate={isActive && autoRotate}
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
});

export default Terrain3D;
