import React, { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Globe,
  Layers,
  ChevronRight,
  MousePointerClick,
  ChevronDown,
  Navigation as NavigationIcon,
  Compass,
} from 'lucide-react';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../../types';

interface GoogleMapSlideProps {
  result: SearchResultType;
  region: Region;
  selectedTerrain: string | null;
  onSelectAlternativePlace?: (place: PlaceInfo) => void;
  onScrollNext?: () => void;
}

export const GoogleMapSlide: React.FC<GoogleMapSlideProps> = ({
  result,
  region,
  selectedTerrain,
  onSelectAlternativePlace,
  onScrollNext,
}) => {
  const { placeInfo, alternativePlaces } = result;
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);

  const mapQuery = placeInfo?.mapQuery || result.placeName;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&t=k&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="section-map"
      className="h-full w-full relative overflow-hidden bg-[#07070a] flex flex-col justify-between selection:bg-[#FFCC00] selection:text-black"
      aria-label="02 구글 위성지도"
    >
      {/* ========================================================
          1. 100vh Fullscreen Satellite Map iFrame Layer
         ======================================================== */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          title={`${result.placeName} 초고해상도 위성 지도`}
          src={embedUrl}
          className={`w-full h-full border-0 filter contrast-125 saturate-110 transition-opacity duration-500 ${
            isInteractiveMode ? 'pointer-events-auto opacity-95' : 'pointer-events-none opacity-80'
          }`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Atmospheric Vignette Gradients for Editorial Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 pointer-events-none z-10" />
      <div className="absolute inset-y-0 left-0 w-full sm:w-[580px] bg-gradient-to-r from-black/95 via-black/75 to-transparent pointer-events-none z-10" />

      {/* ========================================================
          2. Top Header Bar: Dateline Status & Interactive Loupe Toggle
         ======================================================== */}
      <div className="relative z-40 pt-4 sm:pt-6 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 bg-black/85 backdrop-blur-md border border-white/15 text-xs text-[#FFCC00] font-mono font-bold flex items-center gap-2 shadow-lg">
            <span className="bg-[#FFCC00] text-black px-1.5 py-0.5 text-[10px] font-black">CH.02</span>
            <span>위성 지도 관측</span>
            <span className="text-white/40">·</span>
            <span className="text-white font-serif">{region === 'korea' ? '대한민국 에디션' : '글로벌 탐험'}</span>
          </div>
        </div>

        {/* Map Interaction Loupe Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsInteractiveMode((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider uppercase backdrop-blur-md transition-all shadow-xl cursor-pointer border ${
              isInteractiveMode
                ? 'bg-[#FFCC00] text-black border-[#FFCC00] shadow-[0_0_15px_rgba(255,204,0,0.6)] font-black'
                : 'bg-black/80 text-white hover:text-[#FFCC00] border-white/20 hover:border-white/40'
            }`}
            title={
              isInteractiveMode
                ? '지도 조작 완료 (페이지 스크롤 모드로 복귀)'
                : '지도 내 줌 및 드래그 조작 켜기'
            }
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>{isInteractiveMode ? '탐험 돋보기 조작 중 (스크롤 잠금)' : '위성 지도 조작 모드 켜기'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. Mid-Left Editorial Dateline Panel (Magazine Placard)
         ======================================================== */}
      <div className="relative z-40 px-5 sm:px-12 w-full max-w-xl pointer-events-none my-auto">
        <div className="bg-[#0b0b10]/95 backdrop-blur-xl border border-white/15 rounded-lg p-6 sm:p-7 shadow-2xl pointer-events-auto transition-transform max-h-[calc(100vh-190px)] overflow-y-auto no-scrollbar">
          {/* Magazine Department Kicker */}
          <div className="flex items-center gap-2 mb-2.5 text-xs font-mono font-bold text-[#FFCC00] uppercase tracking-[0.2em]">
            <Compass className="w-4 h-4 text-[#FFCC00]" />
            <span>FIELD DISPATCH · {region === 'korea' ? 'KOREA' : 'WORLD'}</span>
            <span className="text-white/30">/</span>
            <span className="text-white">{selectedTerrain || placeInfo?.terrain}</span>
          </div>

          {/* Place Name Headline (High-Contrast Editorial Serif) */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight drop-shadow-xl break-words">
            {result.placeName}
          </h2>

          {/* Subhead / Tagline */}
          {placeInfo?.tagline && (
            <p className="mt-2.5 text-sm sm:text-base text-zinc-300 font-serif italic leading-relaxed break-words border-b border-white/10 pb-3">
              "{placeInfo.tagline}"
            </p>
          )}

          {/* Geological Formation Mechanism Summary */}
          {placeInfo?.formationProcess && (
            <div className="mt-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light break-words">
              <span className="text-[#FFCC00] font-bold font-mono uppercase tracking-wider block mb-1">
                [지형 형성 메커니즘]
              </span>
              <p className="line-clamp-4">{placeInfo.formationProcess}</p>
            </div>
          )}

          {/* Expedition Field Metadata Grid */}
          <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white/5 p-2 rounded-xs border border-white/5">
              <span className="text-zinc-400 block text-[10px] uppercase">탐사 지역</span>
              <span className="text-white font-semibold">{placeInfo?.countryOrArea || '글로벌 지형'}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xs border border-white/5">
              <span className="text-zinc-400 block text-[10px] uppercase">지질 시대 / 규모</span>
              <span className="text-[#FFCC00] font-semibold truncate block">
                {placeInfo?.geology?.geologicalAge || placeInfo?.geology?.rockType || '자연 지형'}
              </span>
            </div>
          </div>

          {/* External Cartographic Reference Links */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}&t=k`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#FFCC00] hover:text-black border border-white/15 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Google 지도 크게보기</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={`https://earth.google.com/web/search/${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#FFCC00] hover:text-black border border-white/15 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
            >
              <NavigationIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Earth 3D</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {region === 'korea' && (
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#FFCC00] hover:text-black border border-white/15 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>네이버 항공사진</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>

          {/* Alternative Field Exploration Sites */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>연계 탐사 현장 선택 (SURVEY SITES):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alternativePlaces.map((alt, idx) => (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlternativePlace?.(alt)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-white/5 hover:bg-[#FFCC00] text-zinc-300 hover:text-black border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span className="text-[#FFCC00] font-bold group-hover:text-black">0{idx + 1}.</span>
                    <span>{alt.placeName}</span>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          5. Bottom Floating Slide Guide Button
         ======================================================== */}
      <div className="relative z-40 pb-8 px-6 sm:px-12 flex flex-col items-center pointer-events-none">
        <button
          onClick={onScrollNext}
          className="pointer-events-auto flex items-center gap-2.5 px-6 py-2.5 bg-black/85 hover:bg-[#FFCC00] text-white hover:text-black border border-white/20 hover:border-[#FFCC00] font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-2xl cursor-pointer group active:scale-95 animate-bounce"
        >
          <span>CHAPTER 03: 3D 입체 지형 디오라마 보러가기</span>
          <ChevronDown className="w-4 h-4 text-[#FFCC00] group-hover:text-black transition-colors" />
        </button>
        <span className="text-[10px] font-mono text-zinc-400 mt-1.5 pointer-events-none drop-shadow">
          P.02 CARTOGRAPHY · 마우스 휠이나 방향키(↓)로 다음 챕터 이동
        </span>
      </div>
    </section>
  );
};
