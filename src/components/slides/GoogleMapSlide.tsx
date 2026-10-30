import React, { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Globe,
  Layers,
  ChevronRight,
  Maximize,
  MousePointerClick,
  ChevronDown,
  Navigation as NavigationIcon,
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
  // Controls whether the user is in interactive map mode (iframe pointer events enabled)
  // or slide scroll mode (where wheel gestures smoothly scroll between sections)
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);

  const mapQuery = placeInfo?.mapQuery || result.placeName;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&t=k&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="section-map"
      className="h-screen w-full snap-start snap-always relative overflow-hidden bg-slate-950 flex flex-col justify-between"
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

      {/* Atmospheric Vignette Gradients for High Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-full sm:w-[540px] bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* ========================================================
          2. Top Interactive Map Mode Switcher & Guide Tag
         ======================================================== */}
      <div className="relative z-20 pt-20 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs text-[#FFCC00] font-semibold flex items-center gap-2 shadow-lg">
            <span className="font-mono text-white text-[11px] bg-white/10 px-1.5 py-0.5 rounded">02</span>
            <span>구글 위성 지도 뷰포트</span>
            <span className="text-white/40">·</span>
            <span className="text-white font-light">{region === 'korea' ? '대한민국' : '전 세계'}</span>
          </div>
        </div>

        {/* Map Interaction Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsInteractiveMode((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-lg cursor-pointer border ${
              isInteractiveMode
                ? 'bg-[#FFCC00] text-black border-[#FFCC00] shadow-[0_0_15px_rgba(255,204,0,0.5)]'
                : 'bg-black/70 text-slate-200 hover:text-white border-white/20 hover:border-white/40'
            }`}
            title={
              isInteractiveMode
                ? '지도 조작 완료 (페이지 스크롤 모드로 복귀)'
                : '지도 내 줌 및 드래그 조작 켜기'
            }
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>{isInteractiveMode ? '지도 조작 중 (스크롤 잠금 해제)' : '지도 확대/이동 조작 켜기'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. Mid-Left Floating Glass Editorial Card
         ======================================================== */}
      <div className="relative z-20 px-4 sm:px-12 w-full max-w-xl pointer-events-none my-auto">
        <div className="bg-[#0e0e14]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-5 sm:p-7 shadow-2xl pointer-events-auto transition-transform max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar">
          {/* Category & Region Kicker */}
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-bold text-[#FFCC00] uppercase tracking-widest">
            <div className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-4 h-4 text-[#FFCC00]" />
              <span>
                {region === 'korea' ? '대한민국' : '전 세계'} · {selectedTerrain || placeInfo?.terrain}
              </span>
            </div>
            {placeInfo?.countryOrArea && (
              <div className="flex items-center gap-1.5 text-slate-300 font-light break-words">
                <span className="text-white/30">|</span>
                <span>{placeInfo.countryOrArea}</span>
              </div>
            )}
          </div>

          {/* Place Name Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md break-words">
            {result.placeName}
          </h2>

          {/* Tagline */}
          {placeInfo?.tagline && (
            <p className="mt-2.5 text-sm sm:text-base text-slate-200 font-light leading-relaxed break-words">
              {placeInfo.tagline}
            </p>
          )}

          {/* Formation Process Short Summary */}
          {placeInfo?.formationProcess && (
            <div className="mt-4 pt-3.5 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed font-light break-words">
              <span className="text-[#FFCC00] font-semibold mr-1.5">[형성 메커니즘]</span>
              {placeInfo.formationProcess}
            </div>
          )}

          {/* Quick External Map Links */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}&t=k`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer hover:border-[#FFCC00]"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Google 지도 크게보기</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href={`https://earth.google.com/web/search/${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer hover:border-[#FFCC00]"
            >
              <NavigationIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Earth 3D</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {region === 'korea' && (
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer hover:border-[#FFCC00]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>네이버 항공사진</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>

          {/* Alternative places within the same terrain */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="mt-5 pt-3.5 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                <Layers className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>이 지형의 다른 명소 둘러보기:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alternativePlaces.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlternativePlace?.(alt)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 hover:bg-[#FFCC00] text-slate-300 hover:text-black border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                  >
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
      <div className="relative z-20 pb-8 px-6 sm:px-12 flex flex-col items-center pointer-events-none">
        <button
          onClick={onScrollNext}
          className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/75 hover:bg-[#FFCC00] text-white hover:text-black border border-white/20 hover:border-[#FFCC00] backdrop-blur-md font-semibold text-xs transition-all shadow-2xl cursor-pointer group active:scale-95 animate-bounce"
        >
          <span>3D 입체 지형 디오라마 보러가기</span>
          <ChevronDown className="w-4 h-4 text-[#FFCC00] group-hover:text-black transition-colors" />
        </button>
        <span className="text-[10px] text-slate-400 font-light mt-1.5 pointer-events-none drop-shadow">
          마우스 휠이나 방향키(↓)로도 다음 슬라이드로 넘어갈 수 있습니다
        </span>
      </div>
    </section>
  );
};
