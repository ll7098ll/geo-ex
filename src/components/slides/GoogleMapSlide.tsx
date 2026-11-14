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
  Plus,
  Check,
} from 'lucide-react';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../../types';

interface GoogleMapSlideProps {
  result: SearchResultType;
  region: Region;
  selectedTerrain: string | null;
  onSelectAlternativePlace?: (place: PlaceInfo) => void;
  onScrollNext?: () => void;
  onAddSpecimen?: (place: PlaceInfo) => void;
  isCollected?: boolean;
}

export const GoogleMapSlide: React.FC<GoogleMapSlideProps> = ({
  result,
  region,
  selectedTerrain,
  onSelectAlternativePlace,
  onScrollNext,
  onAddSpecimen,
  isCollected = false,
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
      className="h-full w-full relative overflow-hidden bg-[#08080A] flex flex-col justify-between selection:bg-[#FFCC00] selection:text-black"
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

      {/* Atmospheric Vignette Gradients for Brutalist Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-[#08080A]/70 pointer-events-none z-10" />
      <div className="absolute inset-y-0 left-0 w-full sm:w-[600px] bg-gradient-to-r from-[#08080A]/95 via-[#08080A]/75 to-transparent pointer-events-none z-10" />

      {/* ========================================================
          2. Top Header Bar: Status & Interactive Mode Toggle
         ======================================================== */}
      <div className="relative z-40 pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 bg-[#131418]/95 backdrop-blur-md hairline-border text-xs font-sans font-bold flex items-center gap-2.5 shadow-2xl">
            <span className="w-1.5 h-3.5 bg-[#FFCC00] inline-block" />
            <span className="text-[#FFCC00] tracking-wider uppercase">위성 지형 관측</span>
            <span className="text-white/25">·</span>
            <span className="text-zinc-200 font-medium">
              {region === 'korea' ? '대한민국' : '전 세계'}
            </span>
          </div>
        </div>

        {/* Map Interaction Loupe Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsInteractiveMode((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-sans font-bold tracking-wide backdrop-blur-md transition-all duration-200 shadow-xl cursor-pointer hairline-border ${
              isInteractiveMode
                ? 'bg-[#FFCC00] text-black border-[#FFCC00]'
                : 'bg-[#131418]/95 text-white hover:text-[#FFCC00] hover:border-[#FFCC00]/60'
            }`}
            title={
              isInteractiveMode
                ? '지도 조작 완료 (페이지 스크롤 모드로 복귀)'
                : '지도 내 줌 및 드래그 조작 켜기'
            }
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>
              {isInteractiveMode
                ? '조작 잠금 해제 (스크롤 복귀)'
                : '위성 지도 직접 조작하기'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. Mid-Left Editorial Placard
         ======================================================== */}
      <div className="relative z-40 px-4 sm:px-8 lg:px-12 w-full max-w-xl pointer-events-none my-auto">
        <div className="bg-[#08080A]/92 backdrop-blur-xl hairline-border p-6 sm:p-7 shadow-2xl pointer-events-auto transition-all duration-300 max-h-[calc(100vh-190px)] overflow-y-auto no-scrollbar border-t-[3px] border-t-[#FFCC00]">
          {/* Department Kicker */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs font-sans font-bold text-[#FFCC00] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#FFCC00]" />
              <span>{region === 'korea' ? 'KOREA ARCHIVE' : 'WORLD ARCHIVE'}</span>
            </div>
            <span className="text-zinc-300 font-sans text-xs font-medium">
              {selectedTerrain || placeInfo?.terrain}
            </span>
          </div>

          {/* Place Name Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight break-words">
            {result.placeName}
          </h2>

          {/* Subhead / Tagline */}
          {placeInfo?.tagline && (
            <p className="mt-3 text-sm sm:text-base text-zinc-300 font-serif italic leading-relaxed break-words hairline-border-b pb-3.5">
              "{placeInfo.tagline}"
            </p>
          )}

          {/* Geological Formation Mechanism Summary */}
          {placeInfo?.formationProcess && (
            <div className="mt-4 text-xs sm:text-sm text-zinc-200 leading-relaxed font-serif break-words">
              <span className="text-[#FFCC00] font-sans font-bold text-xs uppercase tracking-wider block mb-1.5">
                형성 원리
              </span>
              <p className="line-clamp-4 text-zinc-300">{placeInfo.formationProcess}</p>
            </div>
          )}

          {/* Expedition Field Metadata Grid */}
          <div className="mt-4 pt-3.5 hairline-border-t grid grid-cols-2 gap-2.5 text-xs font-sans">
            <div className="bg-[#131418] p-3 hairline-border">
              <span className="text-zinc-400 block text-[11px] mb-0.5">
                탐사 지역
              </span>
              <span className="text-white font-semibold">
                {placeInfo?.countryOrArea || '글로벌 지형'}
              </span>
            </div>
            <div className="bg-[#131418] p-3 hairline-border">
              <span className="text-zinc-400 block text-[11px] mb-0.5">
                지질 시대 · 암석
              </span>
              <span className="text-[#FFCC00] font-semibold truncate block">
                {placeInfo?.geology?.geologicalAge ||
                  placeInfo?.geology?.rockType ||
                  '자연 지형'}
              </span>
            </div>
          </div>

          {/* Specimen Action Button */}
          {placeInfo && onAddSpecimen && (
            <div className="mt-4">
              <button
                onClick={() => onAddSpecimen(placeInfo)}
                className={`w-full py-2.5 px-4 font-sans text-xs font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hairline-border active:scale-[0.99] ${
                  isCollected
                    ? 'bg-[#FFCC00] text-black border-[#FFCC00]'
                    : 'bg-[#131418] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00]'
                }`}
              >
                {isCollected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>표본함에 저장됨</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>표본함에 수집하기</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* External Cartographic Reference Links */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}&t=k`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#131418] hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] hairline-border text-xs font-sans font-semibold text-white transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={`https://earth.google.com/web/search/${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#131418] hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] hairline-border text-xs font-sans font-semibold text-white transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <NavigationIcon className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors" />
              <span>Google Earth 3D</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {region === 'korea' && (
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#131418] hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] hairline-border text-xs font-sans font-semibold text-white transition-colors duration-200 shadow-sm cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors" />
                <span>Naver Map</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>

          {/* Alternative Field Exploration Sites */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="mt-4 pt-3.5 hairline-border-t">
              <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-zinc-400 mb-2">
                <Layers className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>함께 둘러볼 연관 명소</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alternativePlaces.map((alt, idx) => (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlternativePlace?.(alt)}
                    className="group flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans bg-[#131418] hover:bg-[#FFCC00] text-zinc-200 hover:text-black hairline-border hover:border-[#FFCC00] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  >
                    <span className="text-[#FFCC00] font-mono text-[11px] font-bold group-hover:text-black">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
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
          4. Bottom Floating Slide Guide Button
         ======================================================== */}
      <div className="relative z-40 pb-6 px-4 sm:px-8 lg:px-12 flex flex-col items-center pointer-events-none">
        <button
          onClick={onScrollNext}
          className="pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 bg-[#131418]/95 hover:bg-[#FFCC00] text-white hover:text-black hairline-border hover:border-[#FFCC00] font-sans font-bold text-xs tracking-wide transition-all duration-200 shadow-2xl cursor-pointer group active:scale-[0.98]"
        >
          <span>3D 입체 지형 디오라마 보기</span>
          <ChevronDown className="w-4 h-4 text-[#FFCC00] group-hover:text-black transition-colors duration-200" />
        </button>
      </div>
    </section>
  );
};
