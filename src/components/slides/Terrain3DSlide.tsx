import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Maximize2,
  ChevronDown,
  Layers,
  Compass,
  RotateCw,
  RotateCcw,
  RefreshCw,
  Plus,
  Check,
} from 'lucide-react';
import Terrain3D, { Terrain3DRef } from '../Terrain3D';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../../types';

interface Terrain3DSlideProps {
  result: SearchResultType;
  region: Region;
  selectedTerrain: string | null;
  onSelectAlternativePlace?: (place: PlaceInfo) => void;
  onScrollNext?: () => void;
  onAddSpecimen?: (place: PlaceInfo) => void;
  isCollected?: boolean;
  isActive?: boolean;
}

export const Terrain3DSlide: React.FC<Terrain3DSlideProps> = ({
  result,
  region: _region,
  selectedTerrain,
  onSelectAlternativePlace,
  onScrollNext,
  onAddSpecimen,
  isCollected = false,
  isActive = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showContours, setShowContours] = useState(false);
  const [showStrata, setShowStrata] = useState(true);
  const [reliefScale, setReliefScale] = useState(1.0);
  const [isFlipped, setIsFlipped] = useState(false);

  const terrainRef = useRef<Terrain3DRef>(null);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const cycleRelief = () => {
    setReliefScale((prev) => {
      if (prev < 1.2) return 1.3;
      if (prev < 1.5) return 1.6;
      return 1.0;
    });
  };

  const { placeInfo, alternativePlaces } = result;
  const geology = placeInfo?.geology;

  const resolvedSubTerrain =
    selectedTerrain && selectedTerrain !== '모든 지형'
      ? selectedTerrain
      : placeInfo?.terrain || '';

  const placeContext = placeInfo
    ? `${placeInfo.placeName} ${placeInfo.terrain} ${placeInfo.tagline}`
    : result.placeName;

  return (
    <section
      id="section-3d"
      className="h-full w-full relative overflow-hidden bg-[#08080A] flex flex-col justify-between selection:bg-[#FFCC00] selection:text-black select-none"
      aria-label="03 3D 입체 지형"
    >
      {/* ========================================================
          1. Single Persistent 3D Canvas Stage Layer (Inline & Fullscreen)
         ======================================================== */}
      <div
        className={
          isFullscreen
            ? 'fixed inset-0 z-50 bg-[#08080A] flex flex-col'
            : 'absolute inset-0 w-full h-full'
        }
      >
        {isFullscreen && (
          <div className="flex items-center justify-between px-6 py-3 bg-[#131418] hairline-border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 bg-[#1F34FF] text-white text-xs font-mono font-black">
                ACT 03
              </div>
              <div>
                <h3 className="font-sans font-black text-white text-base tracking-tight uppercase">
                  {result.placeName} 3D 지형 디오라마 [ {resolvedSubTerrain} ]
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  [ 240×240 HIGH-DENSITY MESH · 360° ORBIT // DRAG TO ROTATE ]
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-black hairline-border">
                <button
                  onClick={() => setShowContours((prev) => !prev)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                    showContours
                      ? 'text-[#FFCC00] bg-white/10'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  [ 등고선 {showContours ? 'ON' : 'OFF'} ]
                </button>
                <button
                  onClick={() => setShowStrata((prev) => !prev)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer border-l border-white/10 ${
                    showStrata
                      ? 'text-amber-300 bg-white/10'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  [ 지층 {showStrata ? 'ON' : 'OFF'} ]
                </button>
                <button
                  onClick={cycleRelief}
                  className="px-3 py-1.5 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer border-l border-white/10"
                >
                  [ 고저차 {reliefScale.toFixed(1)}x ]
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 bg-[#FFCC00] text-black font-mono font-bold text-xs uppercase cursor-pointer"
              >
                [ 닫기 (ESC) ]
              </button>
            </div>
          </div>
        )}

        <div
          key="terrain-3d-stage"
          className={isFullscreen ? 'flex-1 w-full relative' : 'w-full h-full relative'}
        >
          <Terrain3D
            ref={terrainRef}
            category={result.categoryId}
            subTerrain={resolvedSubTerrain}
            placeContext={placeContext}
            autoRotate={isAutoRotating}
            onAutoRotateChange={setIsAutoRotating}
            show3DContours={showContours}
            showStrata={showStrata}
            reliefScale={reliefScale}
            isActive={isActive || isFullscreen}
          />
        </div>
      </div>

      {/* Atmospheric scrim */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#08080A]/90 via-[#08080A]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#08080A] via-[#08080A]/70 to-transparent pointer-events-none z-10" />

      {/* ========================================================
          2. Top Header Bar: Telemetry & 3D Controls
         ======================================================== */}
      <div className="relative z-40 pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Specimen Tag & Alternative Sites */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="px-3.5 py-1.5 bg-[#131418] hairline-border text-xs text-[#FFCC00] font-mono font-bold flex items-center gap-2 shadow-2xl corner-ticks">
            <span className="bg-[#1F34FF] text-white px-1.5 py-0.5 text-[10px] font-black">
              ACT 03
            </span>
            <span className="font-sans text-white font-bold">{result.placeName}</span>
            <span className="text-white/30">·</span>
            <span className="text-[#FFCC00] font-mono">[ {resolvedSubTerrain} ]</span>
          </div>

          {/* Alternative Specimen Quick Buttons */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 bg-[#131418] hairline-border px-3 py-1">
              <span className="text-[10px] font-mono text-zinc-400 font-semibold pl-1 flex items-center gap-1 shrink-0 uppercase">
                <Layers className="w-3 h-3 text-[#FFCC00]" />
                // LINKED:
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

        {/* Right: Unified 3D Controls Strip */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-[#131418] hairline-border shadow-2xl corner-ticks">
          {/* Visual Effects Control Group */}
          <div className="flex items-center gap-0.5 border-r border-white/10 pr-1 mr-0.5">
            {/* 3D Contours Toggle */}
            <button
              onClick={() => setShowContours((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                showContours
                  ? 'text-[#FFCC00] bg-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="3D 등고선 오버레이 토글"
            >
              <Layers className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span className="hidden sm:inline">등고선</span>
              <span className="text-[10px] font-mono">
                [{showContours ? 'ON' : 'OFF'}]
              </span>
            </button>

            {/* Geological Strata Toggle */}
            <button
              onClick={() => setShowStrata((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer border-l border-white/10 ${
                showStrata
                  ? 'text-amber-300 bg-white/10'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="지층 단면 노출 토글"
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">지층</span>
              <span className="text-[10px] font-mono">
                [{showStrata ? 'ON' : 'OFF'}]
              </span>
            </button>

            {/* Relief Scale Cycling */}
            <button
              onClick={cycleRelief}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer border-l border-white/10"
              title="고저차 과장 배율 변경"
            >
              <span className="text-[11px] text-[#FFCC00]">고저차</span>
              <span className="text-[10px] text-white font-mono">
                [{reliefScale.toFixed(1)}x]
              </span>
            </button>
          </div>

          {/* Auto Rotate */}
          <button
            onClick={() => terrainRef.current?.toggleAutoRotate()}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
              isAutoRotating ? 'text-[#FFCC00]' : 'text-zinc-400 hover:text-white'
            }`}
            title="3D 회전 제어"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`}
              style={{ animationDuration: '12s' }}
            />
            <span className="hidden sm:inline">
              [{isAutoRotating ? '회전 중' : '회전'}]
            </span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={() => terrainRef.current?.resetCamera()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer border-l border-white/10"
            title="카메라 각도 기본값으로 리셋"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span className="hidden sm:inline">[리셋]</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCC00] text-black font-mono font-bold text-xs uppercase transition-all cursor-pointer border-l border-white/15 hover:bg-amber-400"
            title="전체화면"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">[전체화면]</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. 180° Y-Axis 3D Flip Card: Geological Specimen Profile & Field Manual
         ======================================================== */}
      <div className="relative z-40 pb-6 px-4 sm:px-8 lg:px-12 flex flex-col items-center gap-3 pointer-events-none w-full max-w-6xl mx-auto">
        <div className="w-full perspective-1000 pointer-events-auto">
          <div
            className={`w-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT SIDE: Specimen Specs Grid */}
            <div className="w-full bg-[#08080A]/95 backdrop-blur-xl hairline-border p-4 sm:p-5 shadow-2xl corner-ticks backface-hidden">
              <div className="flex items-center justify-between mb-3 pb-2 hairline-border-b">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFCC00] uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>[ EXPEDITION SPECIMEN DATA // ACT 03 ]</span>
                </div>

                <div className="flex items-center gap-2">
                  {placeInfo && onAddSpecimen && (
                    <button
                      onClick={() => onAddSpecimen(placeInfo)}
                      className={`px-3 py-1 text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer hairline-border ${
                        isCollected
                          ? 'bg-[#1F34FF] text-white border-[#1F34FF]'
                          : 'bg-[#131418] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black'
                      }`}
                    >
                      {isCollected ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>[ 수집 완료 ]</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>[ + 표본 수집 ]</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setIsFlipped(true)}
                    className="px-3 py-1 bg-[#131418] hairline-border hover:border-[#1F34FF] hover:text-[#96D0FF] text-[11px] font-mono font-bold text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-[#1F34FF]" />
                    <span>[ 3D 플립: 판독 매뉴얼 ➔ ]</span>
                  </button>
                </div>
              </div>

              {geology && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-xs font-mono">
                  <div className="pt-1.5 sm:pt-0 sm:pr-3">
                    <div className="text-zinc-500 text-[10px] uppercase mb-1">
                      [ (a) 지질 시대 ]
                    </div>
                    <div className="font-sans font-bold text-white text-xs sm:text-sm break-words">
                      {geology.geologicalAge}
                    </div>
                  </div>

                  <div className="pt-1.5 sm:pt-0 sm:px-3">
                    <div className="text-zinc-500 text-[10px] uppercase mb-1">
                      [ (b) 암석 분류 ]
                    </div>
                    <div className="font-sans font-bold text-white text-xs sm:text-sm break-words">
                      {geology.rockType}
                    </div>
                  </div>

                  <div className="pt-1.5 sm:pt-0 sm:px-3">
                    <div className="text-zinc-500 text-[10px] uppercase mb-1">
                      [ (c) 지체 구조 ]
                    </div>
                    <div className="font-sans font-bold text-white text-xs sm:text-sm break-words">
                      {geology.tectonicSetting}
                    </div>
                  </div>

                  <div className="pt-1.5 sm:pt-0 sm:px-3">
                    <div className="text-zinc-500 text-[10px] uppercase mb-1">
                      [ (d) 형성 인자 ]
                    </div>
                    <div className="font-sans font-bold text-white text-xs sm:text-sm break-words">
                      {geology.geomorphicAgent}
                    </div>
                  </div>

                  {geology.scale && (
                    <div className="pt-1.5 sm:pt-0 sm:pl-3 col-span-2 sm:col-span-4 lg:col-span-1">
                      <div className="text-zinc-500 text-[10px] uppercase mb-1">
                        [ (e) 대표 규모 ]
                      </div>
                      <div className="font-mono font-bold text-[#FFCC00] text-xs sm:text-sm break-words">
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
              )}
            </div>

            {/* BACK SIDE: Visual Interpretation Manual (Flipped) */}
            <div className="w-full bg-[#131418] hairline-border p-4 sm:p-5 shadow-2xl corner-ticks-cobalt rotate-y-180 backface-hidden absolute inset-0">
              <div className="flex items-center justify-between mb-3 pb-2 hairline-border-b">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#96D0FF] uppercase tracking-wider">
                  <Box className="w-3.5 h-3.5 text-[#1F34FF]" />
                  <span>[ 3D 지형학적 시각 판독 요령 & 단면 분석 매뉴얼 ]</span>
                </div>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="px-3 py-1 bg-black hairline-border hover:border-[#FFCC00] text-[11px] font-mono font-bold text-[#FFCC00] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#FFCC00]" />
                  <span>[ ➔ 앞면 스펙으로 복귀 ]</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-zinc-300">
                <div className="p-2.5 bg-[#08080A] hairline-border">
                  <span className="text-[#FFCC00] font-bold block mb-1">
                    01. 완경사 기복 분석법
                  </span>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    사면 경사가 완만한 지형은 고저차 배율을 1.3x 또는 1.6x로
                    조정하여 미세 능선과 골짜기를 극대화해 관찰합니다.
                  </p>
                </div>
                <div className="p-2.5 bg-[#08080A] hairline-border">
                  <span className="text-[#96D0FF] font-bold block mb-1">
                    02. 등고선 간격 판독
                  </span>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    등고선이 조밀한 구역은 급경사 침식 지형(단애/폭포), 간격이
                    넓은 구역은 완경사 퇴적 지형(삼각주/선상지)입니다.
                  </p>
                </div>
                <div className="p-2.5 bg-[#08080A] hairline-border">
                  <span className="text-white font-bold block mb-1">
                    03. 28층 지질 단면층 비교
                  </span>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    지층 토글을 활성화하여 퇴적암 수평 층리 및 화성암 주상절리
                    단면의 지하 암석 구조를 비교 판독할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Down Button to Act 4 */}
        <div className="flex flex-col items-center">
          <button
            onClick={onScrollNext}
            className="pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 bg-[#131418] hover:bg-[#FFCC00] text-white hover:text-black hairline-border hover:border-[#FFCC00] font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-2xl cursor-pointer group active:scale-95 corner-ticks"
          >
            <span>[ ACT 04 // 상세 지형 형성 해설 및 탐방 가이드 ]</span>
            <ChevronDown className="w-4 h-4 text-[#FFCC00] group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
};
