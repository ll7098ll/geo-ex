import React, { forwardRef } from 'react';
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
  Maximize2
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
  ({ result, region, selectedTerrain, onSelectAlternativePlace, onShufflePlace }, ref) => {
    const { placeInfo, alternativePlaces } = result;
    const geology = placeInfo?.geology;
    const evolutionStages = placeInfo?.evolutionStages;
    const fieldGuide = placeInfo?.fieldGuide;

    return (
      <div ref={ref} className="bg-[#f8fafc] w-full relative z-30 min-h-screen pb-24">
        {/* Map Hero Banner */}
        <div className="w-full h-[38vh] min-h-[300px] max-h-[420px] relative overflow-hidden bg-slate-950">
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

        {/* Alternative Places Selection Strip (다양한 장소 목록) - sticky 제거하여 스크롤 시 자연스럽게 이동하도록 수정 */}
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

        {/* Main Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: 3D Interactive Terrain Diorama & Scientific Story */}
            <div className="lg:col-span-8 space-y-8">
              {/* 3D Diorama Container */}
              <div className="bg-white p-3 shadow-xs border border-slate-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <Box className="w-4.5 h-4.5 text-brand-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        3D 정밀 지형 시뮬레이터 ({selectedTerrain})
                      </h3>
                      <p className="text-[11px] text-slate-500 hidden sm:block">
                        지형학적 실측 특성에 기반한 3D 입체 단면 시뮬레이션
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                    드래그: 360° 회전 • 스크롤: 줌
                  </span>
                </div>

                {/* 3D Canvas Box */}
                <div className="w-full h-[400px] sm:h-[460px] rounded-md overflow-hidden bg-slate-950 border border-slate-800">
                  <Terrain3D
                    category={result.categoryId}
                    subTerrain={
                      selectedTerrain && selectedTerrain !== '모든 지형'
                        ? selectedTerrain
                        : (placeInfo?.terrain || '')
                    }
                  />
                </div>
              </div>

              {/* 1. Geological Metadata Badges */}
              {geology && (
                <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <Mountain className="w-4.5 h-4.5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">지질학적 메타데이터 및 환경</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        지질 시대
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {geology.geologicalAge}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                        암석 종류
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {geology.rockType}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        지체 구조 환경
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {geology.tectonicSetting}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        형성 인자
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {geology.geomorphicAgent}
                      </div>
                    </div>
                    {geology.scale && (
                      <div className="p-3 bg-slate-50 rounded-md border border-slate-100 sm:col-span-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                          지형 실측 규모
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                          {geology.scale.elevationMeters && (
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                              해발고도: <strong>{geology.scale.elevationMeters}m</strong>
                            </span>
                          )}
                          {geology.scale.depthMeters && (
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                              수심/단차: <strong>{geology.scale.depthMeters}m</strong>
                            </span>
                          )}
                          {geology.scale.areaKm2 && (
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                              면적: <strong>{geology.scale.areaKm2}㎢</strong>
                            </span>
                          )}
                          {geology.scale.lengthKm && (
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                              연장 길이: <strong>{geology.scale.lengthKm}km</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. 4-Stage Evolution Timeline */}
              {evolutionStages && evolutionStages.length > 0 && (
                <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                    <Activity className="w-4.5 h-4.5 text-indigo-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        지형 진화 4단계 타임라인 (Terrain Evolution)
                      </h4>
                      <p className="text-xs text-slate-500">
                        기반암 태동부터 현대 경관 완성까지의 지구과학적 형성 주기
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {evolutionStages.map((stage) => (
                      <div
                        key={stage.stageNumber}
                        className="p-3.5 sm:p-4 rounded-lg bg-slate-50/90 border border-slate-200/80 hover:border-indigo-200 transition-colors flex flex-col justify-between"
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
                          <h5 className="font-bold text-slate-900 text-sm mb-1">{stage.title}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">{stage.process}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-indigo-900 bg-indigo-50/60 p-2 rounded">
                          <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>특징: {stage.visualKeyFeature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Observation Points Cards */}
              {placeInfo?.observationPoints && placeInfo.observationPoints.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 p-5 sm:p-6 rounded-lg border border-amber-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4.5 h-4.5 text-amber-600" />
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">현장 탐험 시 핵심 관찰 포인트</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {placeInfo.observationPoints.map((pt, i) => (
                      <div
                        key={i}
                        className="bg-white/95 p-3 rounded-md border border-amber-100/90 shadow-2xs flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-slate-800 leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Comprehensive Article */}
              <article className="prose prose-slate max-w-none prose-headings:font-serif prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl prose-p:text-sm sm:prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-sm sm:prose-li:text-[15px] prose-a:text-brand-600 hover:prose-a:text-brand-700 bg-white p-6 sm:p-8 md:p-10 shadow-xs border border-slate-200 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.description}</ReactMarkdown>
              </article>
            </div>

            {/* Right Column: Geographic Briefing, Field Guide & Deep References */}
            <div className="lg:col-span-4 space-y-6">
              {/* Location & Scientific Briefing */}
              <div className="bg-white p-5 sm:p-6 shadow-xs border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                  <Compass className="w-4.5 h-4.5 text-brand-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">지리적 위치 및 형성 개요</h3>
                </div>
                <div className="prose prose-sm text-slate-600 leading-relaxed text-xs sm:text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.mapsDescription}</ReactMarkdown>
                </div>
              </div>

              {/* Field Guide Box */}
              {fieldGuide && (
                <div className="bg-white p-5 sm:p-6 shadow-xs border border-slate-200 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Calendar className="w-4.5 h-4.5 text-teal-600" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">탐방 및 위성 관측 가이드</h3>
                  </div>

                  {fieldGuide.bestVisitingSeason && (
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        최적 방문 시기
                      </h4>
                      <p className="text-xs font-medium text-slate-800 bg-teal-50/80 p-2.5 rounded border border-teal-100 leading-relaxed">
                        {fieldGuide.bestVisitingSeason}
                      </p>
                    </div>
                  )}

                  {fieldGuide.satelliteCheckPoints && fieldGuide.satelliteCheckPoints.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        위성 영상 체크포인트
                      </h4>
                      <ul className="space-y-1.5">
                        {fieldGuide.satelliteCheckPoints.map((chk, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                            <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                            <span>{chk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {fieldGuide.cautionAndConservation && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        안전 및 자연유산 보전
                      </div>
                      <p className="text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded border border-amber-200 leading-relaxed">
                        {fieldGuide.cautionAndConservation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* References & High-Res Maps Links */}
              {(result.searchSources.length > 0 || result.mapsLinks.length > 0) && (
                <div className="bg-white p-5 sm:p-6 shadow-xs border border-slate-200 rounded-lg">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-3 pb-3 border-b border-slate-100">
                    탐험 출처 및 현장 지도
                  </h3>

                  {result.mapsLinks.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">위성 지도 연동</h4>
                      <ul className="space-y-2">
                        {result.mapsLinks.map((link, idx) => (
                          <li key={idx}>
                            <a
                              href={link.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-brand-600 hover:text-brand-800 flex items-start gap-2 group p-2 rounded-md hover:bg-slate-50 transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 opacity-75 group-hover:opacity-100" />
                              <span className="line-clamp-2 leading-snug font-medium">{link.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.searchSources.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        학술 및 탐방 웹 자료
                      </h4>
                      <ul className="space-y-2">
                        {result.searchSources.map((source, idx) => (
                          <li key={idx}>
                            <a
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-brand-600 hover:text-brand-800 flex items-start gap-2 group p-2 rounded-md hover:bg-slate-50 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                              <span className="line-clamp-2 leading-snug">{source.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SearchResult.displayName = 'SearchResult';
