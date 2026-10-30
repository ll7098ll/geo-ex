import React, { useState } from 'react';
import {
  Box,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronDown,
  Layers,
  ChevronRight,
} from 'lucide-react';
import Terrain3D from '../Terrain3D';
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
  const { placeInfo, alternativePlaces } = result;
  const geology = placeInfo?.geology;

  const resolvedSubTerrain =
    selectedTerrain && selectedTerrain !== '모든 지형'
      ? selectedTerrain
      : placeInfo?.terrain || '';

  return (
    <section
      id="section-3d"
      className="h-screen w-full snap-start snap-always relative overflow-hidden bg-[#07070a] flex flex-col justify-between"
      aria-label="03 3D 입체 지형"
    >
      {/* ========================================================
          Fullscreen 3D Viewer Modal (ESC or Minimize to exit)
         ======================================================== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#07070a] flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-6 py-3.5 bg-[#0e0e13]/90 border-b border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Box className="w-5 h-5 text-[#FFCC00]" />
              <div>
                <h3 className="font-serif font-bold text-white text-base">
                  {result.placeName} 3D 지형 디오라마 ({resolvedSubTerrain})
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  전체화면 몰입 모드 · 드래그 360° 회전 · 마우스 휠 줌
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors border border-white/15 cursor-pointer shadow-sm"
            >
              <Minimize2 className="w-4 h-4 text-[#FFCC00]" />
              <span>전체화면 종료 (ESC)</span>
            </button>
          </div>
          <div className="flex-1 w-full h-full relative">
            <Terrain3D
              category={result.categoryId}
              subTerrain={resolvedSubTerrain}
              isFullscreen={true}
              onToggleFullscreen={() => setIsFullscreen(false)}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          1. 3D Canvas Viewport (Fills entire background 100vh)
         ======================================================== */}
      <div className="absolute inset-0 w-full h-full">
        <Terrain3D
          category={result.categoryId}
          subTerrain={resolvedSubTerrain}
          isFullscreen={false}
          onToggleFullscreen={() => setIsFullscreen(true)}
        />
      </div>

      {/* Subtle top & bottom scrim for DOM HUD readability */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

      {/* ========================================================
          2. Floating Top Header HUD
         ======================================================== */}
      <div className="relative z-20 pt-20 px-6 sm:px-12 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs text-[#FFCC00] font-semibold flex items-center gap-2 shadow-lg">
            <span className="font-mono text-white text-[11px] bg-white/10 px-1.5 py-0.5 rounded">03</span>
            <span>3D 입체 지형 디오라마</span>
            <span className="text-white/40">·</span>
            <span className="text-white font-bold">{result.placeName}</span>
            <span className="text-slate-400 font-light hidden sm:inline">({resolvedSubTerrain})</span>
          </div>

          {/* Quick Landmark Alternative Buttons */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="hidden lg:flex flex-wrap items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
              <span className="text-[11px] text-slate-400 font-medium pl-1 flex items-center gap-1 shrink-0">
                <Layers className="w-3 h-3 text-[#FFCC00]" />
                명소:
              </span>
              {alternativePlaces.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlternativePlace?.(alt)}
                  className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 hover:bg-[#FFCC00] text-slate-300 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                >
                  {alt.placeName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action: Fullscreen Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/70 hover:bg-[#FFCC00] text-slate-200 hover:text-black rounded-full text-xs font-semibold transition-all border border-white/15 hover:border-[#FFCC00] shadow-lg cursor-pointer"
            title="3D 모델 전체화면으로 크게 보기"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span>전체화면 몰입 뷰</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. Floating Bottom Geological Profile Ribbon & Down Button
         ======================================================== */}
      <div className="relative z-20 pb-7 px-4 sm:px-12 flex flex-col items-center gap-4 pointer-events-none w-full max-w-6xl mx-auto">
        {geology && (
          <div className="w-full bg-[#0e0e14]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-5 sm:px-6 py-4 shadow-2xl pointer-events-auto max-h-[38vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFCC00] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>핵심 지질학적 프로필</span>
              </div>
              <span className="text-[11px] text-slate-400 font-light hidden sm:inline">
                마우스 드래그 360° 회전 · 휠 줌 인/아웃
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-xs">
              <div className="pt-1.5 sm:pt-0 sm:pr-3">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                  지질 시대
                </div>
                <div className="font-serif font-medium text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.geologicalAge}
                </div>
              </div>

              <div className="pt-1.5 sm:pt-0 sm:px-3">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                  암석 종류
                </div>
                <div className="font-serif font-medium text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.rockType}
                </div>
              </div>

              <div className="pt-1.5 sm:pt-0 sm:px-3">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                  지체 구조
                </div>
                <div className="font-serif font-medium text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.tectonicSetting}
                </div>
              </div>

              <div className="pt-1.5 sm:pt-0 sm:px-3">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                  주요 형성 인자
                </div>
                <div className="font-serif font-medium text-white text-xs sm:text-sm break-words leading-snug">
                  {geology.geomorphicAgent}
                </div>
              </div>

              {geology.scale && (
                <div className="pt-1.5 sm:pt-0 sm:pl-3 col-span-2 sm:col-span-4 lg:col-span-1">
                  <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                    대표 규모
                  </div>
                  <div className="font-serif font-semibold text-[#FFCC00] text-xs sm:text-sm break-words leading-snug">
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
            className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/75 hover:bg-[#FFCC00] text-white hover:text-black border border-white/20 hover:border-[#FFCC00] backdrop-blur-md font-semibold text-xs transition-all shadow-2xl cursor-pointer group active:scale-95 animate-bounce"
          >
            <span>상세 지형 형성 해설 및 탐방 가이드 보기</span>
            <ChevronDown className="w-4 h-4 text-[#FFCC00] group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
};
