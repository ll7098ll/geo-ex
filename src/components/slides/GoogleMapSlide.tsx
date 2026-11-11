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
          2. Top Header Bar: Telemetry Status & Interactive Mode Toggle
         ======================================================== */}
      <div className="relative z-40 pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 bg-[#131418] hairline-border text-xs text-[#FFCC00] font-mono font-bold flex items-center gap-2 shadow-2xl corner-ticks">
            <span className="bg-[#1F34FF] text-white px-1.5 py-0.5 text-[10px] font-mono font-black">
              ACT 02
            </span>
            <span>[ SATELLITE TELEMETRY ]</span>
            <span className="text-white/30">/</span>
            <span className="text-zinc-300 font-mono">
              {region === 'korea' ? 'KR_ZONE' : 'WD_GLOBAL'}
            </span>
          </div>
        </div>

        {/* Map Interaction Loupe Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsInteractiveMode((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md transition-all shadow-xl cursor-pointer hairline-border corner-ticks ${
              isInteractiveMode
                ? 'bg-[#FFCC00] text-black border-[#FFCC00] font-black'
                : 'bg-[#131418] text-white hover:text-[#FFCC00] hover:border-white/40'
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
                ? '[ 조작 잠금 해제 (스크롤 복귀) ]'
                : '[ 위성 돋보기 조작 모드 켜기 ]'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. Mid-Left Editorial Placard (Swiss Brutalist Panel)
         ======================================================== */}
      <div className="relative z-40 px-4 sm:px-8 lg:px-12 w-full max-w-xl pointer-events-none my-auto">
        <div className="bg-[#08080A]/95 backdrop-blur-xl hairline-border p-6 sm:p-7 shadow-2xl pointer-events-auto transition-transform max-h-[calc(100vh-190px)] overflow-y-auto no-scrollbar corner-ticks">
          {/* 28-degree Diagonal Hatch Header Bar */}
          <div className="w-full h-2 diagonal-hatch-cobalt mb-4 hairline-border-b" />

          {/* Department Kicker */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono font-bold text-[#FFCC00] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#FFCC00]" />
              <span>[ FIELD SPECIMEN // {region === 'korea' ? 'KOREA' : 'WORLD'} ]</span>
            </div>
            <span className="text-zinc-400 font-mono text-[10px]">
              {selectedTerrain || placeInfo?.terrain}
            </span>
          </div>

          {/* Place Name Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-white tracking-tighter uppercase leading-none break-words">
            {result.placeName}
          </h2>

          {/* Subhead / Tagline */}
          {placeInfo?.tagline && (
            <p className="mt-3 text-sm sm:text-base text-zinc-300 font-serif italic leading-relaxed break-words hairline-border-b pb-3">
              "{placeInfo.tagline}"
            </p>
          )}

          {/* Geological Formation Mechanism Summary */}
          {placeInfo?.formationProcess && (
            <div className="mt-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light break-words">
              <span className="text-[#96D0FF] font-bold font-mono uppercase tracking-wider block mb-1">
                // FORMATION MECHANISM
              </span>
              <p className="line-clamp-4">{placeInfo.formationProcess}</p>
            </div>
          )}

          {/* Expedition Field Metadata Grid */}
          <div className="mt-4 pt-3.5 hairline-border-t grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#131418] p-2.5 hairline-border">
              <span className="text-zinc-500 block text-[10px] uppercase">
                [ (a) 탐사 지역 ]
              </span>
              <span className="text-white font-semibold">
                {placeInfo?.countryOrArea || '글로벌 지형'}
              </span>
            </div>
            <div className="bg-[#131418] p-2.5 hairline-border">
              <span className="text-zinc-500 block text-[10px] uppercase">
                [ (b) 지질 시대 / 암석 ]
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
                className={`w-full py-2.5 px-4 font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer hairline-border corner-ticks active:scale-98 ${
                  isCollected
                    ? 'bg-[#1F34FF] text-white border-[#1F34FF]'
                    : 'bg-[#131418] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00]'
                }`}
              >
                {isCollected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>[ SPECIMEN COLLECTED IN ARCHIVE ]</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>[ + COLLECT SPECIMEN TO ARCHIVE ]</span>
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131418] hover:bg-[#1F34FF] hairline-border text-xs font-mono font-bold text-white transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={`https://earth.google.com/web/search/${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131418] hover:bg-[#1F34FF] hairline-border text-xs font-mono font-bold text-white transition-all shadow-sm cursor-pointer"
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131418] hover:bg-[#1F34FF] hairline-border text-xs font-mono font-bold text-white transition-all shadow-sm cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Naver Map</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>

          {/* Alternative Field Exploration Sites */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="mt-4 pt-3.5 hairline-border-t">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>// LINKED SITES:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alternativePlaces.map((alt, idx) => (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlternativePlace?.(alt)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-[#131418] hover:bg-[#FFCC00] text-zinc-300 hover:text-black hairline-border hover:border-[#FFCC00] transition-all cursor-pointer whitespace-nowrap corner-ticks"
                  >
                    <span className="text-[#FFCC00] font-bold group-hover:text-black">
                      [{String(idx + 1).padStart(2, '0')}]
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
          className="pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 bg-[#131418] hover:bg-[#FFCC00] text-white hover:text-black hairline-border hover:border-[#FFCC00] font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-2xl cursor-pointer group active:scale-95 corner-ticks"
        >
          <span>[ ACT 03 // 3D 입체 지형 디오라마 ]</span>
          <ChevronDown className="w-4 h-4 text-[#FFCC00] group-hover:text-black transition-colors" />
        </button>
      </div>
    </section>
  );
};
