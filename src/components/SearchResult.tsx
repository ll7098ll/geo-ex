import React, { forwardRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MapPin,
  Box,
  ExternalLink,
  Compass,
  Shuffle,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Layers,
  Calendar,
  Mountain,
  Globe,
  Activity,
  Eye,
  AlertTriangle,
  Clock,
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

type ContentTab = 'geology' | 'field' | 'maps';

export const SearchResult = forwardRef<HTMLDivElement, SearchResultProps>(
  ({ result, region, selectedTerrain, onSelectAlternativePlace, onShufflePlace }, ref) => {
    const { placeInfo, alternativePlaces } = result;
    const geology = placeInfo?.geology;
    const evolutionStages = placeInfo?.evolutionStages;
    const fieldGuide = placeInfo?.fieldGuide;

    const [activeTab, setActiveTab] = useState<ContentTab>('geology');
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
      <div ref={ref} className="bg-[#f8fafc] w-full relative z-30 min-h-screen pb-24">
        {/* Fullscreen 3D Viewer Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Box className="w-5 h-5 text-[#FFCC00]" />
                <div>
                  <h3 className="font-bold text-white text-base">
                    {result.placeName} 3D 정밀 지형 시뮬레이터 ({resolvedSubTerrain})
                  </h3>
                  <p className="text-xs text-slate-400">
                    전체화면 몰입 모드 • 드래그 360° 회전 • 스크롤 줌 • 핀 클릭 시 상세 지형 정보
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors border border-slate-700 cursor-pointer shadow-sm"
              >
                <Minimize2 className="w-4 h-4 text-[#FFCC00]" />
                <span>전체화면 종료 (ESC)</span>
              </button>
            </div>
            <div className="flex-1 w-full h-full relative">
              <Terrain3D category={result.categoryId} subTerrain={resolvedSubTerrain} />
            </div>
          </div>
        )}

        {/* Map Hero Banner */}
        <div className="w-full h-[36vh] min-h-[280px] max-h-[400px] relative overflow-hidden bg-slate-950">
          <iframe
            title={`${result.placeName} 위성 지도`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              placeInfo?.mapQuery || result.placeName
            )}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
            className="absolute inset-0 w-full h-full border-0 opacity-75 mix-blend-luminosity"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/60 pointer-events-none" />

          {/* Banner Floating Metadata & Shuffle Action */}
          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 md:p-10 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2 text-brand-700 font-bold tracking-wider uppercase text-xs md:text-sm bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-2xs border border-slate-200/60">
                <MapPin className="w-3.5 h-3.5 text-[#E65100]" />
                <span>
                  {region === 'korea' ? '대한민국' : '전 세계'} • {selectedTerrain}
                </span>
              </div>

              {onShufflePlace && (
                <button
                  onClick={onShufflePlace}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-black/80 hover:bg-black text-[#FFCC00] hover:text-white rounded-full text-xs md:text-sm font-semibold backdrop-blur-md transition-all border border-[#FFCC00]/40 shadow-sm cursor-pointer active:scale-95"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>다른 명소 무작위 변경</span>
                </button>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 drop-shadow-2xs leading-tight">
              {result.placeName}
            </h2>

            {placeInfo?.tagline && (
              <p className="mt-1.5 text-sm sm:text-base text-slate-700 font-medium max-w-3xl line-clamp-2 leading-relaxed">
                {placeInfo.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Alternative Places Selection Strip */}
        {alternativePlaces && alternativePlaces.length > 0 && (
          <div className="border-y border-slate-200/90 bg-white/95 backdrop-blur-xs relative z-10 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-xs font-bold text-slate-500 tracking-wider whitespace-nowrap flex items-center gap-1.5 shrink-0 mr-1">
                  <Layers className="w-3.5 h-3.5 text-brand-600" />
                  <span>이 지형의 다른 명소:</span>
                </span>
                {alternativePlaces.map((alt) => {
                  const isCurrent = placeInfo?.id === alt.id;
                  return (
                    <button
                      key={alt.id}
                      onClick={() => onSelectAlternativePlace?.(alt)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border-slate-200 hover:border-amber-300 active:scale-[0.98]'
                      }`}
                    >
                      <span>{alt.placeName}</span>
                      <ChevronRight className={`w-3 h-3 ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SECTION 1: 3D Interactive Diorama Studio & Quick Insight
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            {/* Studio Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#E65100]">
                  <Box className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      3D 입체 지형 스튜디오
                    </h3>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200/60">
                      {resolvedSubTerrain}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    지형학적 실측 특성에 기반한 정밀 3D 단면 시뮬레이션
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium hidden md:inline-block">
                  드래그: 360° 회전 • 스크롤: 줌 • 핀 클릭: 지형 포인트
                </span>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                  title="3D 모델 전체화면으로 크게 보기"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>전체화면</span>
                </button>
              </div>
            </div>

            {/* 3D Canvas Box - Spacious Wide Viewport */}
            <div className="w-full h-[460px] sm:h-[520px] md:h-[580px] bg-slate-950 relative border-b border-slate-800">
              <Terrain3D category={result.categoryId} subTerrain={resolvedSubTerrain} />
            </div>

            {/* Quick Scientific Metric Bar (지질 핵심 요약 바) */}
            {geology && (
              <div className="bg-slate-50/90 px-4 sm:px-6 py-3 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>핵심 지질 프로필 요약</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>지질 시대</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-800 truncate mt-0.5">
                      {geology.geologicalAge}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Mountain className="w-3 h-3 text-emerald-600" />
                      <span>암석 종류</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-800 truncate mt-0.5">
                      {geology.rockType}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Globe className="w-3 h-3 text-emerald-600" />
                      <span>지체 구조</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-800 truncate mt-0.5">
                      {geology.tectonicSetting}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Activity className="w-3 h-3 text-emerald-600" />
                      <span>주요 형성 인자</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-800 truncate mt-0.5">
                      {geology.geomorphicAgent}
                    </div>
                  </div>

                  {geology.scale && (
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-4 lg:col-span-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Maximize2 className="w-3 h-3 text-emerald-600" />
                        <span>대표 규모</span>
                      </div>
                      <div className="text-xs sm:text-[13px] font-bold text-slate-800 truncate mt-0.5">
                        {geology.scale.elevationMeters
                          ? `해발 ${geology.scale.elevationMeters}m`
                          : geology.scale.areaKm2
                          ? `면적 ${geology.scale.areaKm2}㎢`
                          : geology.scale.lengthKm
                          ? `길이 ${geology.scale.lengthKm}km`
                          : '실측 데이터 참조'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            SECTION 2: 목적별 3단 탭 인터페이스 (Deep-Dive Tabs)
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Tab Selection Bar */}
          <div className="flex items-center justify-start border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-px">
            <button
              onClick={() => setActiveTab('geology')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'geology'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Mountain className={`w-4 h-4 ${activeTab === 'geology' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>지질 과학 & 진화사</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 ml-0.5">
                4단계 타임라인
              </span>
            </button>

            <button
              onClick={() => setActiveTab('field')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'field'
                  ? 'border-amber-600 text-amber-800 bg-amber-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Compass className={`w-4 h-4 ${activeTab === 'field' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>현장 탐험 & 관찰 가이드</span>
              {placeInfo?.observationPoints && placeInfo.observationPoints.length > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 ml-0.5">
                  관찰 포인트 {placeInfo.observationPoints.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('maps')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'maps'
                  ? 'border-sky-600 text-sky-800 bg-sky-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Globe className={`w-4 h-4 ${activeTab === 'maps' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>위성 지도 & 탐험 자료</span>
              {(result.mapsLinks.length > 0 || result.searchSources.length > 0) && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 ml-0.5">
                  자료 {result.mapsLinks.length + result.searchSources.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: 지질 과학 & 진화사 (Geological Science & 4-Stage Evolution) */}
          {activeTab === 'geology' && (
            <div className="pt-6 space-y-6 animate-in fade-in duration-200">
              {/* Detailed Geological Measurements */}
              {geology && geology.scale && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                    <Maximize2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      정밀 지형 실측 규모 및 환경
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2.5 text-xs">
                    {geology.scale.elevationMeters && (
                      <span className="bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700">
                        해발고도: <strong className="text-slate-900 font-bold">{geology.scale.elevationMeters}m</strong>
                      </span>
                    )}
                    {geology.scale.depthMeters && (
                      <span className="bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700">
                        수심/단차: <strong className="text-slate-900 font-bold">{geology.scale.depthMeters}m</strong>
                      </span>
                    )}
                    {geology.scale.areaKm2 && (
                      <span className="bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700">
                        면적: <strong className="text-slate-900 font-bold">{geology.scale.areaKm2}㎢</strong>
                      </span>
                    )}
                    {geology.scale.lengthKm && (
                      <span className="bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700">
                        연장 길이: <strong className="text-slate-900 font-bold">{geology.scale.lengthKm}km</strong>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 4-Stage Evolution Timeline */}
              {evolutionStages && evolutionStages.length > 0 && (
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                    <Activity className="w-4.5 h-4.5 text-indigo-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        지형 진화 4단계 타임라인 (Terrain Evolution Timeline)
                      </h4>
                      <p className="text-xs text-slate-500">
                        기반암 태동부터 현대 경관 완성까지의 지구과학적 형성 주기
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {evolutionStages.map((stage) => (
                      <div
                        key={stage.stageNumber}
                        className="p-4 rounded-lg bg-slate-50/90 border border-slate-200 hover:border-indigo-300 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                              단계 {stage.stageNumber}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {stage.timeframe}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-sm mb-1.5">{stage.title}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">{stage.process}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs font-medium text-indigo-900 bg-indigo-50/70 p-2 rounded">
                          <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>특징: {stage.visualKeyFeature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Geographic Overview & Detailed Scholarly Article */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Geographic & Formation Briefing */}
                <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs h-fit">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                    <Compass className="w-4.5 h-4.5 text-brand-600" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      지리적 위치 및 형성 개요
                    </h3>
                  </div>
                  <div className="prose prose-sm text-slate-600 leading-relaxed text-xs sm:text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.mapsDescription}</ReactMarkdown>
                  </div>
                </div>

                {/* Comprehensive Article */}
                <div className="lg:col-span-8">
                  <article className="prose prose-slate max-w-none prose-headings:font-serif prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl prose-p:text-sm sm:prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-sm sm:prose-li:text-[15px] prose-a:text-brand-600 hover:prose-a:text-brand-700 bg-white p-6 sm:p-8 md:p-10 shadow-xs border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 text-slate-900 font-bold text-base">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      <span>심층 지형학적 형성 보고서</span>
                    </div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.description}</ReactMarkdown>
                  </article>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 현장 탐험 & 관찰 가이드 (Field Exploration Guide) */}
          {activeTab === 'field' && (
            <div className="pt-6 space-y-6 animate-in fade-in duration-200">
              {/* Observation Points Cards */}
              {placeInfo?.observationPoints && placeInfo.observationPoints.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-5 sm:p-6 rounded-xl border border-amber-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        현장 탐험 시 핵심 관찰 포인트
                      </h4>
                      <p className="text-xs text-slate-500">
                        실제 방문 시 꼭 눈여겨보아야 할 주요 지형학적 증거와 시각적 요소
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    {placeInfo.observationPoints.map((pt, i) => (
                      <div
                        key={i}
                        className="bg-white/95 p-3.5 rounded-lg border border-amber-100 shadow-2xs flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Guide Box */}
              {fieldGuide && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Best Season & Satellite Checkpoints */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <Calendar className="w-4.5 h-4.5 text-teal-600" />
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        탐방 시기 및 위성 관측 팁
                      </h3>
                    </div>

                    {fieldGuide.bestVisitingSeason && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          최적 방문 계절 및 기상
                        </h4>
                        <p className="text-xs sm:text-sm font-medium text-teal-900 bg-teal-50/90 p-3 rounded-lg border border-teal-100 leading-relaxed">
                          {fieldGuide.bestVisitingSeason}
                        </p>
                      </div>
                    )}

                    {fieldGuide.satelliteCheckPoints && fieldGuide.satelliteCheckPoints.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          위성 영상 판독 체크포인트
                        </h4>
                        <ul className="space-y-2">
                          {fieldGuide.satelliteCheckPoints.map((chk, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-100"
                            >
                              <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                              <span className="leading-snug">{chk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right: Caution & Conservation */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          안전 유의사항 및 지질유산 보전
                        </h3>
                      </div>

                      {fieldGuide.cautionAndConservation ? (
                        <div className="mt-4 p-4 rounded-lg bg-amber-50/80 border border-amber-200">
                          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                            {fieldGuide.cautionAndConservation}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 mt-4">
                          현장 탐방 시 지정된 관람로를 준수하고 자연 지형을 훼손하지 않도록 유의하세요.
                        </p>
                      )}
                    </div>

                    <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      <p className="text-xs text-slate-500">
                        지질유산은 수억 년에 걸쳐 형성된 인류 공통의 자연 자산입니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 위성 지도 & 탐험 자료 (Satellite Maps & Scholarly Sources) */}
          {activeTab === 'maps' && (
            <div className="pt-6 space-y-6 animate-in fade-in duration-200">
              {/* Interactive High-Res Google Satellite Embed */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapIcon className="w-4.5 h-4.5 text-sky-600" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      실시간 고해상도 위성 지도
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    확대/축소 및 위성 모드 지원
                  </span>
                </div>

                <div className="w-full h-[400px] sm:h-[460px] rounded-lg overflow-hidden border border-slate-200 bg-slate-950 relative">
                  <iframe
                    title={`${result.placeName} 인터랙티브 위성 맵`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      placeInfo?.mapQuery || result.placeName
                    )}&t=k&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* External References & Map Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Satellite Maps Links */}
                {result.mapsLinks.length > 0 && (
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                      <MapPin className="w-4.5 h-4.5 text-amber-600" />
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        공식 위성 지도 바로가기
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {result.mapsLinks.map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={link.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-slate-700 hover:text-amber-800 flex items-start gap-2.5 group p-2.5 rounded-lg hover:bg-amber-50/60 border border-transparent hover:border-amber-200 transition-all"
                          >
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                            <span className="leading-snug font-medium line-clamp-2">{link.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 ml-auto shrink-0 text-slate-400 group-hover:text-amber-700" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scholarly Sources */}
                {result.searchSources.length > 0 && (
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                      <FileText className="w-4.5 h-4.5 text-indigo-600" />
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        학술 및 지리 탐방 참고 자료
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {result.searchSources.map((source, idx) => (
                        <li key={idx}>
                          <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-slate-700 hover:text-indigo-800 flex items-start gap-2.5 group p-2.5 rounded-lg hover:bg-indigo-50/60 border border-transparent hover:border-indigo-200 transition-all"
                          >
                            <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                            <span className="leading-snug font-medium line-clamp-2">{source.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SearchResult.displayName = 'SearchResult';
