import React, { forwardRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MapPin,
  Box,
  ExternalLink,
  Compass,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Layers,
  Calendar,
  Globe,
  Activity,
  Eye,
  AlertTriangle,
  Maximize2,
  Minimize2,
  BookOpen,
  FileText,
  Map as MapIcon,
} from 'lucide-react';
import Terrain3D from './Terrain3D';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../types';

interface SearchResultProps {
  result: SearchResultType;
  region: Region;
  selectedTerrain: string | null;
  onSelectAlternativePlace?: (place: PlaceInfo) => void;
  onShufflePlace?: () => void;
}

export const SearchResult = forwardRef<HTMLDivElement, SearchResultProps>(
  ({ result, region, selectedTerrain, onSelectAlternativePlace }, ref) => {
    const { placeInfo, alternativePlaces } = result;
    const geology = placeInfo?.geology;
    const evolutionStages = placeInfo?.evolutionStages;
    const fieldGuide = placeInfo?.fieldGuide;

    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    // ESC key closes fullscreen 3D studio
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    // Prevent body scrolling while in fullscreen
    useEffect(() => {
      if (isFullscreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isFullscreen]);

    const resolvedSubTerrain =
      selectedTerrain && selectedTerrain !== '모든 지형'
        ? selectedTerrain
        : placeInfo?.terrain || '';

    return (
      <div
        ref={ref}
        className="bg-[#0a0a0c] w-full relative z-30 min-h-screen pb-28 text-slate-100 selection:bg-[#FFCC00] selection:text-black"
      >
        {/* Fullscreen 3D Viewer Modal */}
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

        {/* Map Hero Banner */}
        <div className="w-full h-[38vh] min-h-[300px] max-h-[440px] relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              title={`${result.placeName} 위성 지도`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                placeInfo?.mapQuery || result.placeName
              )}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0 opacity-70 filter contrast-125 saturate-110"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-black/70 pointer-events-none" />

          {/* Banner Floating Metadata */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 max-w-7xl mx-auto pointer-events-none">
            <div className="flex items-center gap-2 mb-3 text-xs md:text-sm font-bold text-[#FFCC00] uppercase tracking-widest pointer-events-auto">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {region === 'korea' ? '대한민국' : '전 세계'} · {selectedTerrain}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
              {result.placeName}
            </h2>

            {placeInfo?.tagline && (
              <p className="mt-2 text-sm sm:text-base text-slate-300 font-light max-w-3xl leading-relaxed">
                {placeInfo.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Alternative Places Selection Strip (Editorial Dark Glass) */}
        {alternativePlaces && alternativePlaces.length > 0 && (
          <div className="border-y border-white/10 bg-[#0d0d12]/90 backdrop-blur-md relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap shrink-0 mr-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>이 지형의 다른 명소:</span>
                </span>
                {alternativePlaces.map((alt) => {
                  const isCurrent = placeInfo?.id === alt.id;
                  return (
                    <button
                      key={alt.id}
                      onClick={() => onSelectAlternativePlace?.(alt)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                        isCurrent
                          ? 'bg-[#FFCC00] text-black border-[#FFCC00] font-bold shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20 active:scale-[0.98]'
                      }`}
                    >
                      <span>{alt.placeName}</span>
                      <ChevronRight
                        className={`w-3 h-3 ${isCurrent ? 'text-black' : 'text-slate-400'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MAIN SECTION: 3D Interactive Diorama Studio (Ultra-clean)
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="space-y-6">
            <div className="bg-[#121217] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Minimalist Action Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-white/10 bg-[#16161f]/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00] shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                        3D 입체 지형 스튜디오
                      </h3>
                      <span className="text-xs text-[#FFCC00] font-semibold">
                        / {resolvedSubTerrain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 hidden sm:block font-light">
                      실측 지형 특성에 기반한 인터랙티브 3D 자연 시뮬레이션
                    </p>
                  </div>
                </div>

                {/* Right Action Bar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold transition-all border border-white/15 shadow-sm active:scale-95 cursor-pointer"
                    title="3D 모델 전체화면으로 크게 보기"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#FFCC00]" />
                    <span>전체화면</span>
                  </button>
                </div>
              </div>

              {/* 3D Canvas Box */}
              <div className="w-full h-[480px] sm:h-[560px] md:h-[620px] bg-[#07070a] relative">
                <Terrain3D
                  category={result.categoryId}
                  subTerrain={resolvedSubTerrain}
                  isFullscreen={false}
                  onToggleFullscreen={() => setIsFullscreen(true)}
                />
              </div>

              {/* Sleek Geological Profile Ribbon (Editorial Data Grid) */}
              {geology && (
                <div className="bg-[#14141c] px-6 sm:px-8 py-5 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-[#FFCC00] uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFCC00]" />
                    <span>핵심 지질 프로필</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-xs">
                    <div className="pt-2 sm:pt-0 sm:pr-4">
                      <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                        지질 시대
                      </div>
                      <div className="font-serif font-medium text-white text-sm sm:text-base truncate">
                        {geology.geologicalAge}
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-0 sm:px-4">
                      <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                        암석 종류
                      </div>
                      <div className="font-serif font-medium text-white text-sm sm:text-base truncate">
                        {geology.rockType}
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-0 sm:px-4">
                      <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                        지체 구조
                      </div>
                      <div className="font-serif font-medium text-white text-sm sm:text-base truncate">
                        {geology.tectonicSetting}
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-0 sm:px-4">
                      <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                        주요 형성 인자
                      </div>
                      <div className="font-serif font-medium text-white text-sm sm:text-base truncate">
                        {geology.geomorphicAgent}
                      </div>
                    </div>

                    {geology.scale && (
                      <div className="pt-2 sm:pt-0 sm:pl-4 col-span-2 sm:col-span-4 lg:col-span-1">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                          대표 규모
                        </div>
                        <div className="font-serif font-medium text-[#FFCC00] text-sm sm:text-base truncate">
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
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: EDITORIAL KNOWLEDGE FEED (스토리형 매거진 레이아웃)
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
          {/* Part 1: 지형 진화 4단계 타임라인 (Terrain Evolution Timeline) */}
          {evolutionStages && evolutionStages.length > 0 && (
            <div className="bg-[#121217] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00]">
                    <Activity className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                      지형 진화 4단계 타임라인
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      기반암 태동부터 현대 경관 완성까지의 지구과학적 형성 과정
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {evolutionStages.map((stage) => (
                  <div
                    key={stage.stageNumber}
                    className="p-5 rounded-xl bg-[#171720] border border-white/8 hover:border-[#FFCC00]/40 transition-colors flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                        <span className="font-bold text-[#FFCC00] tracking-widest uppercase">
                          0{stage.stageNumber}단계
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">{stage.timeframe}</span>
                      </div>
                      <h4 className="font-serif font-bold text-white text-base mb-2 group-hover:text-[#FFCC00] transition-colors">
                        {stage.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">
                        {stage.process}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/8 flex items-center gap-2 text-xs text-amber-200/90 font-medium">
                      <Eye className="w-3.5 h-3.5 text-[#FFCC00] shrink-0" />
                      <span className="line-clamp-2">{stage.visualKeyFeature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Part 2: 현장 탐험 및 관찰 가이드 (Observation Points & Field Tips) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Core Observation Points */}
            <div className="lg:col-span-6 bg-[#121217] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-base">
                    현장 탐험 시 핵심 관찰 포인트
                  </h4>
                  <p className="text-xs text-slate-400 font-light">
                    실제 지형 방문 시 눈여겨보아야 할 주요 증거
                  </p>
                </div>
              </div>

              {placeInfo?.observationPoints && placeInfo.observationPoints.length > 0 ? (
                <ul className="space-y-3">
                  {placeInfo.observationPoints.map((pt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#171720] border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 py-3">관찰 포인트 데이터 준비 중입니다.</p>
              )}
            </div>

            {/* Right: Visiting Tips & Safety */}
            <div className="lg:col-span-6 bg-[#121217] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">
                      탐방 시기 및 자연유산 보전
                    </h4>
                    <p className="text-xs text-slate-400 font-light">
                      안전하고 품격 있는 자연 지리 탐방 안내
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  {fieldGuide?.bestVisitingSeason && (
                    <div>
                      <span className="font-semibold text-slate-400 text-xs block mb-1.5 uppercase tracking-wider">
                        최적 방문 시기
                      </span>
                      <p className="text-slate-200 bg-[#171720] p-3.5 rounded-xl border border-white/5 leading-relaxed">
                        {fieldGuide.bestVisitingSeason}
                      </p>
                    </div>
                  )}

                  {fieldGuide?.cautionAndConservation ? (
                    <div>
                      <span className="font-semibold text-slate-400 text-xs block mb-1.5 uppercase tracking-wider">
                        안전 유의사항 및 지형 보전
                      </span>
                      <p className="text-amber-200 bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/30 leading-relaxed flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{fieldGuide.cautionAndConservation}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">
                      현장 탐방 시 지정된 관람로를 준수하고 자연 지형을 훼손하지 않도록 유의하세요.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 text-right">
                <span className="text-[11px] text-slate-500 font-light">
                  자연유산은 수억 년에 걸쳐 형성된 인류 공통의 소중한 자연 자산입니다.
                </span>
              </div>
            </div>
          </div>

          {/* Part 3: 심층 지형학적 형성 보고서 & 참고 자료 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Geographic Briefing & External References */}
            <div className="lg:col-span-4 space-y-6">
              {/* Geographic Overview */}
              <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/10">
                  <Compass className="w-4.5 h-4.5 text-[#FFCC00]" />
                  <h4 className="font-serif font-bold text-white text-base">
                    지리적 위치 및 형성 개요
                  </h4>
                </div>
                <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed text-xs sm:text-sm font-light">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.mapsDescription}</ReactMarkdown>
                </div>
              </div>

              {/* Map & Exploration Links */}
              <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/10">
                  <MapIcon className="w-4.5 h-4.5 text-[#FFCC00]" />
                  <h4 className="font-serif font-bold text-white text-base">
                    지도 및 위성 탐방
                  </h4>
                </div>
                <div className="space-y-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      placeInfo?.mapQuery || result.placeName
                    )}&t=k`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#171720] hover:bg-[#1f1f2c] transition-colors text-xs font-semibold text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-400" />
                      <span>Google 지도 고해상도 위성뷰</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  {region === 'korea' && (
                    <a
                      href={`https://map.naver.com/p/search/${encodeURIComponent(
                        placeInfo?.mapQuery || result.placeName
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#171720] hover:bg-[#1f1f2c] transition-colors text-xs font-semibold text-slate-200"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>네이버 지도 고해상도 항공뷰</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  )}

                  {result.mapsLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#171720] hover:bg-[#1f1f2c] transition-colors text-xs font-medium text-slate-300"
                    >
                      <span className="truncate pr-2">{link.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Scholarly References */}
              {result.searchSources.length > 0 && (
                <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/10">
                    <FileText className="w-4.5 h-4.5 text-[#FFCC00]" />
                    <h4 className="font-serif font-bold text-white text-base">
                      학술 및 지리 참고 자료
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs">
                    {result.searchSources.map((source, idx) => (
                      <li key={idx}>
                        <a
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-[#FFCC00] flex items-center justify-between gap-2 py-1 transition-colors"
                        >
                          <span className="truncate">{source.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Comprehensive Scientific Article */}
            <div className="lg:col-span-8">
              <article className="bg-[#121217] p-6 sm:p-10 shadow-xl border border-white/10 rounded-2xl prose prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-[#FFCC00] hover:prose-a:underline prose-li:text-slate-300 max-w-none">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/10 text-white font-serif font-bold text-lg sm:text-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00]">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <span>심층 지형학적 형성 보고서</span>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.description}</ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SearchResult.displayName = 'SearchResult';
