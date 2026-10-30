import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  RotateCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  X,
} from 'lucide-react';
import { TerrainAnnotation } from '../types';
import {
  generateTerrainDioramaGeometry,
  resolveTerrainKey,
  generateTerrainElevationField,
  TerrainMaterialPreset,
} from './terrain/terrainGenerators';
import { getTerrainBumpTexture, TexturePatternKey } from './terrain/terrainTextures';
import { TERRAIN_ANNOTATIONS } from './terrain/TerrainAnnotationsData';
import { TerrainSpecialMeshes } from './terrain/TerrainSpecialMeshes';
import {
  createContourShaderUniforms,
  updateContourShaderUniforms,
  injectContourShader,
  TerrainShaderUniforms,
  Contour3DTheme,
} from './terrain/contour/terrainContourShader';

// ==========================================
// Terrain Default Material Settings per Category & SubTerrain
// ==========================================
export function getDefaultMaterialSettings(category: string, subTerrain: string) {
  const normSub = resolveTerrainKey(subTerrain);
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
  wireframe: boolean;
  reliefScale: number;
  showAnnotations: boolean;
  showStrata: boolean;
  evolutionStage: number;
  activeAnnotationIndex: number | null;
  onSelectAnnotation: (idx: number | null) => void;
  show3DContours: boolean;
  contourInterval: number;
  indexInterval: number;
  highlightElevation: number | null;
  contour3DTheme: Contour3DTheme;
  showSlicePlane: boolean;
  sliceElevation: number;
  demMinElevation: number;
  demMaxElevation: number;
  demField?: any;
  crossSectionLine?: { p1: [number, number]; p2: [number, number] } | null;
  crossSectionHoverPoint?: { x: number; y: number; z: number } | null;
  isCrossSection3DVisible?: boolean;
  materialPreset: TerrainMaterialPreset;
  texturePattern: TexturePatternKey;
  roughness: number;
  metalness: number;
  bumpScale: number;
  opacity: number;
  showValleyRidgeGuide?: boolean;
  showSlopeHeat?: boolean;
  onSurfaceHover?: (probe: { x: number; y: number; elevation: number; slopeDeg: number } | null) => void;
}

const DioramaMesh: React.FC<DioramaMeshProps> = ({
  category,
  subTerrain,
  wireframe,
  reliefScale,
  showAnnotations,
  showStrata,
  evolutionStage,
  activeAnnotationIndex,
  onSelectAnnotation,
  show3DContours,
  contourInterval,
  indexInterval,
  highlightElevation,
  contour3DTheme,
  showSlicePlane,
  sliceElevation,
  demMinElevation,
  demMaxElevation,
  demField,
  crossSectionLine,
  crossSectionHoverPoint,
  isCrossSection3DVisible = true,
  materialPreset,
  texturePattern,
  roughness,
  metalness,
  bumpScale,
  opacity,
  showValleyRidgeGuide = false,
  showSlopeHeat = false,
  onSurfaceHover,
}) => {
  const normSub = resolveTerrainKey(subTerrain);

  // Generate solid diorama block geometry with terrain surface + geological strata skirts
  const geometry = useMemo(() => {
    return generateTerrainDioramaGeometry(
      category,
      subTerrain,
      reliefScale,
      showStrata,
      evolutionStage,
      materialPreset
    );
  }, [category, subTerrain, reliefScale, showStrata, evolutionStage, materialPreset]);

  const annotations: TerrainAnnotation[] = TERRAIN_ANNOTATIONS[normSub] || [];
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
      highlightElevation,
      theme: contour3DTheme,
      showValleyRidgeGuide,
      showSlopeHeat,
    })
  );

  // Dynamic Uniforms update (0ms runtime update without recompiling shaders)
  useEffect(() => {
    updateContourShaderUniforms(uniformsRef.current, {
      showContours: show3DContours,
      contourInterval,
      indexInterval,
      highlightElevation,
      theme: contour3DTheme,
      showValleyRidgeGuide,
      showSlopeHeat,
    });
  }, [show3DContours, contourInterval, indexInterval, highlightElevation, contour3DTheme, showValleyRidgeGuide, showSlopeHeat]);

  // Hook into Three.js standard material shader pipeline
  const handleBeforeCompile = useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    injectContourShader(shader, uniformsRef.current);
  }, []);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* 1. Solid Diorama Mesh (Terrain Surface + 4 Side Strata Skirts + Bottom Plate) */}
      <mesh
        geometry={geometry}
        castShadow
        receiveShadow
        onPointerMove={(e) => {
          e.stopPropagation();
          if (!onSurfaceHover || !e.point || !e.normal) return;
          const nz = Math.abs(e.normal.y);
          const slopeDeg = Math.acos(Math.min(1.0, Math.max(0.0, nz))) * 57.29578;
          onSurfaceHover({
            x: e.point.x,
            y: -e.point.z,
            elevation: e.point.y,
            slopeDeg,
          });
        }}
        onPointerLeave={() => {
          onSurfaceHover?.(null);
        }}
      >
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          wireframe={wireframe}
          bumpMap={wireframe ? undefined : bumpTexture}
          bumpScale={bumpScale}
          roughness={roughness}
          metalness={metalness}
          transparent={opacity < 0.99}
          opacity={opacity}
          onBeforeCompile={handleBeforeCompile}
          customProgramCacheKey={() => `terrain_mat_v6_${materialPreset}`}
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

      {/* 4. Interactive Geomorphic Feature Annotation Pins */}
      {showAnnotations &&
        annotations.map((anno, idx) => {
          const isSelected = activeAnnotationIndex === idx;
          // In group space (rotated -90 deg on X), coordinate mapping:
          // X -> X, Y -> Z (elevation), Z -> -Y
          const adjustedPos: [number, number, number] = [
            anno.position[0],
            anno.position[2],
            anno.position[1] * reliefScale + 0.5,
          ];

          return (
            <group key={idx} position={adjustedPos}>
              <Html distanceFactor={13} center>
                <div
                  className="group relative flex flex-col items-center pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAnnotation(isSelected ? null : idx);
                  }}
                >
                  {/* Pin Circle Marker */}
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs shadow-xl border-2 transition-all transform hover:scale-110 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-white scale-110 ring-4 ring-amber-400/40'
                        : 'bg-[#FFCC00] text-slate-950 border-white/90 animate-bounce'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Hover / Selected Callout Card */}
                  <div
                    className={`absolute bottom-8 bg-slate-950/95 text-white text-[11px] px-3 py-2 rounded-md shadow-2xl border border-white/20 whitespace-nowrap z-50 transition-all pointer-events-auto flex flex-col items-center min-w-[150px] max-w-[220px] ${
                      isSelected
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-2 mb-0.5">
                      <span className="font-bold text-[#FFCC00] text-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {anno.name}
                      </span>
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAnnotation(null);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-300 text-center leading-tight whitespace-normal font-sans">
                      {anno.description}
                    </p>
                    <div className="absolute -bottom-1 w-2 h-2 bg-slate-950 rotate-45 border-r border-b border-white/20" />
                  </div>
                </div>
              </Html>
            </group>
          );
        })}
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
        shadow-bias={-0.0005}
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
export interface Terrain3DProps {
  category: string;
  subTerrain: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export default function Terrain3D({
  category,
  subTerrain,
  onToggleFullscreen,
  isFullscreen,
}: Terrain3DProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  const matDefaults = useMemo(
    () => getDefaultMaterialSettings(category, subTerrain),
    [category, subTerrain]
  );

  const demField = useMemo(() => {
    return generateTerrainElevationField(category, subTerrain, 1.0, 4);
  }, [category, subTerrain]);

  const handleResetCamera = () => {
    if (!controlsRef.current) return;
    setAutoRotate(false);
    controlsRef.current.object.position.set(0, 10, 16);
    controlsRef.current.target.set(0, 0.5, 0);
    controlsRef.current.update();
  };

  return (
    <div className="w-full h-full bg-radial from-slate-900 via-slate-950 to-black relative overflow-hidden select-none">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 10, 16], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <TerrainEnvironmentRig category={category} />

        <React.Suspense fallback={null}>
          <DioramaMesh
            category={category}
            subTerrain={subTerrain}
            wireframe={false}
            reliefScale={1.0}
            showAnnotations={false}
            showStrata={true}
            evolutionStage={4}
            activeAnnotationIndex={null}
            onSelectAnnotation={() => {}}
            show3DContours={false}
            contourInterval={demField.contourSettings.intermediateInterval}
            indexInterval={demField.contourSettings.indexInterval}
            highlightElevation={null}
            contour3DTheme="gold"
            showSlicePlane={false}
            sliceElevation={0}
            demMinElevation={demField.minElevation}
            demMaxElevation={demField.maxElevation}
            demField={demField}
            materialPreset={matDefaults.materialPreset}
            texturePattern={matDefaults.texturePattern}
            roughness={matDefaults.roughness}
            metalness={matDefaults.metalness}
            bumpScale={matDefaults.bumpScale}
            opacity={matDefaults.opacity}
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
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
        />
      </Canvas>

      {/* Top Left: SubTerrain Label */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
          <span className="font-serif font-bold text-sm text-white">{subTerrain}</span>
          <span className="text-xs text-slate-400 font-light hidden sm:inline">· 3D 입체 디오라마</span>
        </div>
      </div>

      {/* Top Right: Minimalist Action Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-none z-20">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg pointer-events-auto">
          <button
            onClick={handleResetCamera}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            title="카메라 각도 기본값으로 리셋"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span className="hidden sm:inline">뷰 리셋</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              autoRotate
                ? 'text-[#FFCC00] bg-white/10 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={autoRotate ? '자동 회전 일시정지' : '자동 360° 회전 시작'}
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`}
              style={{ animationDuration: '10s' }}
            />
            <span className="hidden sm:inline">{autoRotate ? '회전 중' : '회전'}</span>
          </button>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer border-l border-white/10 ml-0.5"
              title={isFullscreen ? '전체화면 종료' : '전체화면으로 보기'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span className="hidden sm:inline">축소</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span className="hidden sm:inline">전체화면</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Right: Clean Subtle Guidance */}
      <div className="absolute bottom-3 right-4 pointer-events-none z-10 text-[11px] text-slate-400 font-light bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5 hidden sm:block">
        드래그하여 360° 회전 · 스크롤하여 확대/축소
      </div>

    </div>
  );
}
