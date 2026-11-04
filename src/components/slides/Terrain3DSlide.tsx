import React, { useState, useRef } from 'react';
import {
  Box,
  Maximize2,
  Minimize2,
  ChevronDown,
  Layers,
  Compass,
  RotateCw,
  RotateCcw,
} from 'lucide-react';
import Terrain3D, { Terrain3DRef } from '../Terrain3D';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../../types';

interface Terrain3DSlideProps {
  result: SearchResultType;
  region: Region;
  selectedTerrain: string | null;
  onSelectAlternativePlace?: (place: PlaceInfo) => void;
  onScrollNext?: () => void;
}

export const Terrain3DSlide: React.FC<Terrain3DSlideProps> = ({
  result,
  region,
  selectedTerrain,
  onSelectAlternativePlace,
  onScrollNext,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const terrainRef = useRef<Terrain3DRef>(null);
  const fullscreenTerrainRef = useRef<Terrain3DRef>(null);

  const { placeInfo, alternativePlaces } = result;
  const geology = placeInfo?.geology;

  const resolvedSubTerrain =
    selectedTerrain && selectedTerrain !== '모든 지형'
      ? selectedTerrain
      : placeInfo?.terrain || '';

  return (
    <section
      id="section-3d"
      className="h-full w-full relative overflow-hidden bg-[#07070a] flex flex-col justify-between selection:bg-[#FFCC00] selection:text-black"
      aria-label="03 3D 입체 지형"
    >
      {/* ========================================================
          Fullscreen 3D Viewer Modal (ESC or Minimize to exit)
         ======================================================== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#07070a] flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-6 py-3 bg-[#0b0b10] border-b border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 bg-[#FFCC00] text-black text-xs font-mono font-black">
                CH.03
              </div>
              <div>
                <h3 className="font-serif font-black text-white text-base tracking-wide">
                  {result.placeName} 3D 지형 디오라마 ({resolvedSubTerrain})
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  NAT-GEO VIRTUAL LAB · 마우스 드래그 360° 회전 · 휠 줌 인/아웃
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-black/80 border border-white/15">
                <button
                  onClick={() => fullscreenTerrainRef.current?.toggleAutoRotate()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                    isAutoRotating
                      ? 'text-[#FFCC00] bg-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isAutoRotating ? '회전 일시정지' : '360° 자동 회전'}
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '10s' }}
                  />
                  <span>{isAutoRotating ? '회전 중' : '회전'}</span>
                </button>
                <button
                  onClick={() => fullscreenTerrainRef.current?.resetCamera()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer border-l border-white/10"
                  title="카메라 각도 초기화"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>뷰 리셋</span>
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-[#FFCC00] hover:text-black text-white text-xs font-mono font-bold transition-all border border-white/20 cursor-pointer shadow-md"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>전체화면 종료 (ESC)</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full h-full relative">
            <Terrain3D
              ref={fullscreenTerrainRef}
              category={result.categoryId}
              subTerrain={resolvedSubTerrain}
              isFullscreen={true}
              hideHud={true}
              autoRotate={isAutoRotating}
              onAutoRotateChange={setIsAutoRotating}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          1. 3D Canvas Viewport (100vh Background Specimen)
         ======================================================== */}
      <div className="absolute inset-0 w-full h-full">
        <Terrain3D
          ref={terrainRef}
          category={result.categoryId}
          subTerrain={resolvedSubTerrain}
          isFullscreen={false}
          hideHud={true}
          autoRotate={isAutoRotating}
          onAutoRotateChange={setIsAutoRotating}
        />
      </div>

      {/* Subtle top & bottom scrim for DOM HUD legibility */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10" />

      {/* ========================================================
          2. Unified Top Header Bar (Single Level, Zero Overlap)
         ======================================================== */}
      <div className="relative z-40 pt-4 sm:pt-6 px-6 sm:px-12 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Specimen Tag & Alternative Sites */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="px-3.5 py-1.5 bg-black/85 backdrop-blur-md border border-white/15 text-xs text-[#FFCC00] font-mono font-bold flex items-center gap-2 shadow-lg">
            <span className="bg-[#FFCC00] text-black px-1.5 py-0.5 text-[10px] font-black">CH.03</span>
            <span className="font-serif text-white font-bold">{result.placeName}</span>
            <span className="text-white/40">·</span>
            <span className="text-[#FFCC00] font-mono">({resolvedSubTerrain})</span>
          </div>

          {/* Alternative Specimen Quick Buttons */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1">
              <span className="text-[11px] font-mono text-zinc-400 font-semibold pl-1 flex items-center gap-1 shrink-0 uppercase">
                <Layers className="w-3 h-3 text-[#FFCC00]" />
                연계 지형 표본:
              </span>
              {alternativePlaces.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlternativePlace?.(alt)}
                  className="px-2 py-0.5 text-[11px] font-mono bg-white/5 hover:bg-[#FFCC00] text-zinc-300 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                >
                  {alt.placeName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Unified 3D Controls Strip (회전 / 뷰 리셋 / 전체화면) */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-black/85 backdrop-blur-md border border-white/15 shadow-xl">
          <button
            onClick={() => terrainRef.current?.toggleAutoRotate()}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
              isAutoRotating
                ? 'text-[#FFCC00] bg-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title={isAutoRotating ? '3D 자동 회전 정지' : '3D 자동 360° 회전 시작'}
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`}
              style={{ animationDuration: '10s' }}
            />
            <span className="hidden sm:inline">{isAutoRotating ? '회전 중' : '회전'}</span>
          </button>

          <button
            onClick={() => terrainRef.current?.resetCamera()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer border-l border-white/10"
            title="카메라 각도 기본값으로 리셋"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span className="hidden sm:inline">뷰 리셋</span>
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFCC00] text-black hover:bg-amber-400 text-xs font-mono font-black tracking-wider uppercase transition-all shadow-md cursor-pointer border-l border-black/20"
            title="3D 모델 전체화면으로 크게 보기"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>전체화면</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. Floating Bottom Geological Profile Ribbon (Magazine Placard)
         ======================================================== */}
      <div className="relative z-40 pb-7 px-5 sm:px-12 flex flex-col items-center gap-3 pointer-events-none w-full max-w-6xl mx-auto">
        {geology && (
          <div className="w-full bg-[#0b0b10]/95 backdrop-blur-xl border border-white/15 rounded-lg p-4 sm:p-5 shadow-2xl pointer-events-auto max-h-[38vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFCC00] uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>EXPEDITION SPECIMEN DATA · 핵심 지질학적 프로필</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 font-light hidden sm:inline">
                마우스 360° 회전 / 휠 확대 / 우클릭 팬 이동
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-xs font-mono">
              <div className="pt-1.5 sm:pt-0 sm:pr-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                  지질 시대 (EPOCH)
                </div>
                <div className="font-serif font-bold text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.geologicalAge}
                </div>
              </div>

              <div className="pt-1.5 sm:pt-0 sm:px-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                  암석 종류 (LITHOLOGY)
                </div>
                <div className="font-serif font-bold text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.rockType}
                </div>
              </div>

              <div className="pt-1.5 sm:pt-0 sm:px-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                  지체 구조 (TECTONICS)
                </div>
                <div className="font-serif font-bold text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.tectonicSetting}
                </div>
              </div>

              <div className="pt-1.5 sm:pt-0 sm:px-3">
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                  형성 인자 (AGENT)
                </div>
                <div className="font-serif font-bold text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.geomorphicAgent}
                </div>
              </div>

              {geology.scale && (
                <div className="pt-1.5 sm:pt-0 sm:pl-3 col-span-2 sm:col-span-4 lg:col-span-1">
                  <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                    대표 규모 (SCALE)
                  </div>
                  <div className="font-mono font-bold text-[#FFCC00] text-xs sm:text-sm break-words leading-snug">
                    {geology.scale.elevationMeters
                      ? `해발 ${geology.scale.elevationMeters}m`
                      : geology.scale.areaKm2
                      ? `면적 ${geology.scale.areaKm2}㎢`
                      : geology.scale.lengthKm
                      ? `연장 ${geology.scale.lengthKm}km`
                      : '실측치 참조'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Down Button to Page 4 */}
        <div className="flex flex-col items-center">
          <button
            onClick={onScrollNext}
            className="pointer-events-auto flex items-center gap-2.5 px-6 py-2.5 bg-black/85 hover:bg-[#FFCC00] text-white hover:text-black border border-white/20 hover:border-[#FFCC00] font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-2xl cursor-pointer group active:scale-95 animate-bounce"
          >
            <span>CHAPTER 04: 상세 지형 형성 해설 및 탐방 가이드 읽기</span>
            <ChevronDown className="w-4 h-4 text-[#FFCC00] group-hover:text-black transition-colors" />
          </button>
          <span className="text-[10px] font-mono text-zinc-400 mt-1 pointer-events-none drop-shadow">
            P.03 3D DIORAMA · 스크롤 또는 방향키(↓)로 심층 해설 기사로 이동
          </span>
        </div>
      </div>
    </section>
  );
};
