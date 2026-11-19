import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Lightformer } from '@react-three/drei';
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

const DEFAULT_CAMERA_POS: [number, number, number] = [0, 11.8, 19.6];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.4, 0];

// ==========================================
// Terrain Default Material Settings per Category & SubTerrain
// ==========================================
function getDefaultMaterialSettings(category: string, subTerrain: string, placeContext?: string) {
  const normSub = resolveTerrainKey(subTerrain, placeContext);
  let roughness = 0.76;
  let metalness = 0.05;
  let bumpScale = 0.035;

  if (category === 'volcanic') {
    if (normSub === '주상절리') {
      roughness = 0.62;
      metalness = 0.08;
      bumpScale = 0.045;
    } else if (normSub === '용암동굴') {
      roughness = 0.85;
      metalness = 0.08;
      bumpScale = 0.04;
    } else {
      roughness = 0.80;
      metalness = 0.05;
      bumpScale = 0.035;
    }
  } else if (category === 'glacial') {
    // Natural matte snow/firn & alpine bedrock (eliminates chrome/wet-plastic sheen)
    roughness = 0.72;
    metalness = 0.04;
    bumpScale = 0.03;
  } else if (category === 'arid') {
    if (normSub === '플라야') {
      // Crystalline matte salt crust (actual brine mirror reflection lives on PlayaBrineFeatures water mesh)
      roughness = 0.62;
      metalness = 0.04;
      bumpScale = 0.02;
    } else {
      roughness = 0.94;
      metalness = 0.03;
      bumpScale = 0.025;
    }
  } else if (category === 'karst') {
    roughness = 0.74;
    metalness = 0.05;
    bumpScale = 0.042;
  } else if (category === 'coastal') {
    roughness = 0.72;
    metalness = 0.06;
    bumpScale = 0.03;
  } else {
    roughness = 0.74;
    metalness = 0.05;
    bumpScale = 0.03;
  }

  return {
    materialPreset: 'natural' as TerrainMaterialPreset,
    texturePattern: 'auto' as TexturePatternKey,
    roughness,
    metalness,
    bumpScale,
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
      reliefScale,
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
      reliefScale,
    });
  }, [show3DContours, contourInterval, indexInterval, waterLevel, reliefScale]);

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
          customProgramCacheKey={() => `terrain_mat_v8_${materialPreset}`}
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
        reliefScale={reliefScale}
      />
    </group>
  );
};

// ==========================================
// Terrain Atmospheric Lighting & Offline Procedural IBL Environment Rig
// ==========================================
interface TerrainEnvironmentConfig {
  sunPos: [number, number, number];
  turbidity: number;
  rayleigh: number;
  keyColor: string;
  keyIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  rimColor: string;
  rimIntensity: number;
  fogColor: string;
  fogDensity: number;
}

const ENVIRONMENT_BY_CATEGORY: Record<string, TerrainEnvironmentConfig> = {
  volcanic: {
    sunPos: [85, 32, 65],
    turbidity: 3.5,
    rayleigh: 1.4,
    keyColor: '#fff2e0',
    keyIntensity: 2.35,
    hemiSky: '#b2c2d4',
    hemiGround: '#3d3430',
    hemiIntensity: 1.05,
    rimColor: '#a2c6e8',
    rimIntensity: 0.65,
    fogColor: '#151920',
    fogDensity: 0.014,
  },
  glacial: {
    sunPos: [100, 45, 90],
    turbidity: 0.2,
    rayleigh: 0.35,
    keyColor: '#f2f8ff',
    keyIntensity: 2.4,
    hemiSky: '#b8dcff',
    hemiGround: '#5a7894',
    hemiIntensity: 0.95,
    rimColor: '#90caff',
    rimIntensity: 0.85,
    fogColor: '#0f1826',
    fogDensity: 0.014,
  },
  arid: {
    sunPos: [80, 50, 40],
    turbidity: 7.5,
    rayleigh: 2.2,
    keyColor: '#fff4dc',
    keyIntensity: 2.5,
    hemiSky: '#ffe3b3',
    hemiGround: '#8c6138',
    hemiIntensity: 0.9,
    rimColor: '#ffd48c',
    rimIntensity: 0.65,
    fogColor: '#1f1812',
    fogDensity: 0.015,
  },
  karst: {
    sunPos: [90, 28, 80],
    turbidity: 2.5,
    rayleigh: 1.2,
    keyColor: '#fffcee',
    keyIntensity: 2.15,
    hemiSky: '#b6e6d8',
    hemiGround: '#264d3b',
    hemiIntensity: 0.9,
    rimColor: '#5eead4',
    rimIntensity: 0.65,
    fogColor: '#121e1a',
    fogDensity: 0.014,
  },
  coastal: {
    sunPos: [100, 38, 80],
    turbidity: 1.2,
    rayleigh: 0.75,
    keyColor: '#fffef0',
    keyIntensity: 2.3,
    hemiSky: '#aae2ff',
    hemiGround: '#194361',
    hemiIntensity: 0.95,
    rimColor: '#38bdf8',
    rimIntensity: 0.72,
    fogColor: '#0e1d29',
    fogDensity: 0.014,
  },
  fluvial: {
    sunPos: [100, 35, 75],
    turbidity: 1.5,
    rayleigh: 0.9,
    keyColor: '#fffde6',
    keyIntensity: 2.25,
    hemiSky: '#cceeff',
    hemiGround: '#2e5223',
    hemiIntensity: 0.9,
    rimColor: '#86efac',
    rimIntensity: 0.65,
    fogColor: '#112022',
    fogDensity: 0.014,
  },
};

const TerrainEnvironmentRig: React.FC<{ category: string; normSub: string }> = ({
  category,
  normSub,
}) => {
  const { scene } = useThree();
  // Fault-block mountain (단층 산맥: Sierra Nevada / Teton style) uses crisp alpine-fluvial daylight rather than volcanic lighting
  const effectiveEnvKey = normSub === '단층 산맥' ? 'fluvial' : category;
  const config = ENVIRONMENT_BY_CATEGORY[effectiveEnvKey] || ENVIRONMENT_BY_CATEGORY.fluvial;

  useEffect(() => {
    scene.fog = new THREE.FogExp2(config.fogColor, config.fogDensity);
    return () => {
      scene.fog = null;
    };
  }, [scene, config.fogColor, config.fogDensity]);

  return (
    <>
      <Sky sunPosition={config.sunPos} turbidity={config.turbidity} rayleigh={config.rayleigh} />
      {/* 100% Offline Procedural IBL Environment (zero external HDRI CDN requests!) */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={1.55}
          color={config.hemiSky}
          position={[0, 14, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[28, 28, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2.4}
          color={config.keyColor}
          position={[14, 11, 10]}
          rotation={[0, -Math.PI / 4, 0]}
          scale={8}
        />
        <Lightformer
          form="rect"
          intensity={1.25}
          color={config.rimColor}
          position={[-14, 7, -10]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[18, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.85}
          color={config.hemiGround}
          position={[0, -10, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[28, 28, 1]}
        />
      </Environment>
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

interface Terrain3DProps {
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

  const normSub = useMemo(
    () => resolveTerrainKey(subTerrain, placeContext),
    [subTerrain, placeContext]
  );

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
    controlsRef.current.object.position.set(...DEFAULT_CAMERA_POS);
    controlsRef.current.target.set(...DEFAULT_CAMERA_TARGET);
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
    return getTerrainContourMeta(normSub).contourSettings;
  }, [normSub]);

  return (
    <div className="w-full h-full bg-radial from-slate-900 via-slate-950 to-black relative overflow-hidden select-none">
      {/* 3D Canvas */}
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        frameloop={isActive ? 'always' : 'demand'}
        camera={{ position: DEFAULT_CAMERA_POS, fov: 42 }}
        gl={{ antialias: true, alpha: false }}
      >
        <TerrainEnvironmentRig category={category} normSub={normSub} />

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
          target={DEFAULT_CAMERA_TARGET}
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
