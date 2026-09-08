import React, { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Eye,
  RotateCw,
  Grid,
  Layers,
  MapPin,
  Sparkles,
  Maximize2,
  Compass,
  Info,
  X,
} from 'lucide-react';
import { TerrainAnnotation } from '../types';
import {
  generateTerrainDioramaGeometry,
  resolveTerrainKey,
} from './terrain/terrainGenerators';
import { TERRAIN_ANNOTATIONS } from './terrain/TerrainAnnotationsData';
import { TerrainSpecialMeshes } from './terrain/TerrainSpecialMeshes';

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
  activeAnnotationIndex: number | null;
  onSelectAnnotation: (idx: number | null) => void;
}

const DioramaMesh: React.FC<DioramaMeshProps> = ({
  category,
  subTerrain,
  wireframe,
  reliefScale,
  showAnnotations,
  showStrata,
  activeAnnotationIndex,
  onSelectAnnotation,
}) => {
  const normSub = resolveTerrainKey(subTerrain);

  // Generate solid diorama block geometry with terrain surface + geological strata skirts
  const geometry = useMemo(() => {
    return generateTerrainDioramaGeometry(category, subTerrain, reliefScale, showStrata);
  }, [category, subTerrain, reliefScale, showStrata]);

  const annotations: TerrainAnnotation[] = TERRAIN_ANNOTATIONS[normSub] || [];

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* 1. Solid Diorama Mesh (Terrain Surface + 4 Side Strata Skirts + Bottom Plate) */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          wireframe={wireframe}
          roughness={
            category === 'arid'
              ? 0.95
              : category === 'glacial'
              ? 0.3
              : normSub === '주상절리'
              ? 0.55
              : 0.75
          }
          metalness={
            category === 'glacial'
              ? 0.35
              : normSub === '플라야'
              ? 0.4
              : normSub === '주상절리'
              ? 0.2
              : 0.04
          }
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
// Main Export: Terrain3D Component
// ==========================================
export interface Terrain3DProps {
  category: string;
  subTerrain: string;
}

export default function Terrain3D({ category, subTerrain }: Terrain3DProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [reliefScale, setReliefScale] = useState(1.0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showStrata, setShowStrata] = useState(true);
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number | null>(null);

  const controlsRef = useRef<any>(null);

  const setCameraView = (view: 'perspective' | 'top' | 'front' | 'profile') => {
    if (!controlsRef.current) return;
    setAutoRotate(false);

    if (view === 'top') {
      // Direct Top-down Aerial View
      controlsRef.current.object.position.set(0, 24, 0.01);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'front') {
      // Front Geological Cross-Section View
      controlsRef.current.object.position.set(0, 2.5, 20);
      controlsRef.current.target.set(0, 1.0, 0);
    } else if (view === 'profile') {
      // Side Profile View
      controlsRef.current.object.position.set(20, 2.5, 0);
      controlsRef.current.target.set(0, 1.0, 0);
    } else {
      // Perspective 3/4 Isometric View
      controlsRef.current.object.position.set(0, 10, 16);
      controlsRef.current.target.set(0, 0.5, 0);
    }
    controlsRef.current.update();
  };

  const normSub = resolveTerrainKey(subTerrain);
  const annotationList = TERRAIN_ANNOTATIONS[normSub] || [];

  return (
    <div
      className="w-full h-full bg-radial from-slate-900 via-slate-950 to-black relative overflow-hidden select-none"
      onClick={() => setActiveAnnotationIndex(null)}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 10, 16], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Sky
          sunPosition={[100, 35, 80]}
          turbidity={category === 'arid' ? 7 : 0.4}
          rayleigh={category === 'arid' ? 2.2 : 0.65}
        />
        <Environment
          preset={
            category === 'volcanic'
              ? 'sunset'
              : category === 'glacial'
              ? 'dawn'
              : category === 'arid'
              ? 'park'
              : 'city'
          }
        />
        <ambientLight intensity={0.7} />
        <directionalLight position={[14, 20, 10]} intensity={2.0} castShadow />
        <directionalLight position={[-12, 10, -10]} intensity={0.65} color="#c5ddfc" />
        <directionalLight position={[0, -12, 6]} intensity={0.3} color="#edf4ff" />

        <React.Suspense fallback={null}>
          <DioramaMesh
            category={category}
            subTerrain={subTerrain}
            wireframe={wireframe}
            reliefScale={reliefScale}
            showAnnotations={showAnnotations}
            showStrata={showStrata}
            activeAnnotationIndex={activeAnnotationIndex}
            onSelectAnnotation={setActiveAnnotationIndex}
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

      {/* Top Left: Camera View Controls */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none z-20">
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-md border border-white/15 pointer-events-auto shadow-xl">
          <button
            onClick={() => setCameraView('perspective')}
            className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="기본 3D 입체 뷰"
          >
            <Eye className="w-3.5 h-3.5 text-[#FFCC00]" />
            입체
          </button>
          <button
            onClick={() => setCameraView('top')}
            className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="수직 항공 평면 뷰"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            항공뷰
          </button>
          <button
            onClick={() => setCameraView('front')}
            className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="정면 지질 단면 뷰"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            단면뷰
          </button>
          <button
            onClick={() => setCameraView('profile')}
            className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="측면 종단면 프로필"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            측면뷰
          </button>
        </div>
      </div>

      {/* Top Right: Feature Toggles */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none z-20">
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-md border border-white/15 pointer-events-auto shadow-xl">
          {/* Toggle Geological Strata Layers on Skirt */}
          <button
            onClick={() => setShowStrata(!showStrata)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
              showStrata
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
            title="하부 지질 단면 층리 표시"
          >
            <Layers className="w-3.5 h-3.5" />
            지질단면
          </button>

          {/* Toggle Annotations */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
              showAnnotations
                ? 'bg-[#FFCC00] text-slate-950 font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
            title="지형 특징 핀 표시"
          >
            <MapPin className="w-3.5 h-3.5" />
            특징 핀
          </button>

          {/* Toggle Wireframe */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
              wireframe
                ? 'bg-white text-slate-950 font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
            title="지형 3D 격자망 보기"
          >
            <Grid className="w-3.5 h-3.5" />
            격자망
          </button>

          {/* Toggle Auto Rotation */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
              autoRotate ? 'text-[#FFCC00]' : 'text-white/40 hover:text-white'
            }`}
            title="자동 회전 On/Off"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`}
              style={{ animationDuration: '8s' }}
            />
          </button>
        </div>
      </div>

      {/* Bottom Controls: Relief Scale Slider & Subterrain Status */}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 pointer-events-none z-20">
        {/* Relief exaggeration slider */}
        <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-md border border-white/15 pointer-events-auto flex items-center gap-2.5 text-xs text-white shadow-xl">
          <span className="text-gray-300 font-medium whitespace-nowrap">
            고저차 과장: <span className="text-[#FFCC00] font-bold">{reliefScale.toFixed(1)}x</span>
          </span>
          <input
            type="range"
            min="0.5"
            max="1.8"
            step="0.1"
            value={reliefScale}
            onChange={(e) => setReliefScale(parseFloat(e.target.value))}
            className="w-20 sm:w-28 accent-[#FFCC00] cursor-pointer"
          />
        </div>

        {/* Subterrain Status Pill */}
        <div className="bg-slate-950/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-2 border border-white/15 pointer-events-none shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
          <span className="font-bold text-[#FFCC00]">{subTerrain}</span>
          <span className="text-gray-400 hidden sm:inline">• 3D 지질 블록 다이어그램</span>
        </div>
      </div>

      {/* Left Annotation Drawer (Features List on large screens) */}
      {showAnnotations && annotationList.length > 0 && (
        <div className="absolute left-3 top-16 hidden lg:flex flex-col gap-1 pointer-events-auto max-w-[220px] z-10">
          <div className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-md border border-white/15 text-white text-[11px] shadow-2xl">
            <div className="flex items-center gap-1.5 font-bold text-[#FFCC00] mb-2 pb-1.5 border-b border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              주요 지형 특성 ({annotationList.length})
            </div>
            <div className="space-y-1.5">
              {annotationList.map((a, i) => {
                const isSelected = activeAnnotationIndex === i;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveAnnotationIndex(isSelected ? null : i)}
                    className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-400/20 text-white border border-amber-400/40'
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-[#FFCC00] text-slate-950'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate text-[11px]">
                        {a.name}
                      </div>
                      <div className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                        {a.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
