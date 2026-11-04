import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  Layers,
  Compass,
  FileText,
  Activity,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  MapPin,
  ExternalLink,
  Globe,
  ArrowUp,
  Box,
  Eye,
  Award,
  Info,
  Quote,
  LucideIcon,
} from 'lucide-react';
import { SearchResult as SearchResultType, Region } from '../../types';
import {
  getCurriculumMeta,
  getKeyTakeaways,
  getGlossaryItems,
} from '../../utils/curriculumHelper';

interface GeologicalGuideSlideProps {
  result: SearchResultType;
  region: Region;
  selectedTerrain: string | null;
  onNavigateSlide: (index: number) => void;
}

type TabKey = 'overview' | 'evolution' | 'field' | 'glossary';

export const GeologicalGuideSlide: React.FC<GeologicalGuideSlideProps> = ({
  result,
  region,
  selectedTerrain,
  onNavigateSlide,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const { placeInfo } = result;

  if (!placeInfo) {
    return (
      <section
        id="section-guide"
        className="h-full w-full relative overflow-y-auto bg-[#07070a] text-zinc-100 p-8 flex items-center justify-center font-serif"
      >
        <p className="text-zinc-400">지형 해설 정보를 불러오는 중입니다...</p>
      </section>
    );
  }

  const curriculumMeta = getCurriculumMeta(placeInfo);
  const keyTakeaways = getKeyTakeaways(placeInfo);
  const glossaryItems = getGlossaryItems(placeInfo);
  const evolutionStages = placeInfo.evolutionStages || [];
  const fieldGuide = placeInfo.fieldGuide;
  const geology = placeInfo.geology;
  const mapQuery = placeInfo.mapQuery || result.placeName;

  const tabs: { key: TabKey; label: string; shortLabel: string; icon: LucideIcon; dept: string }[] = [
    { key: 'overview', label: '01. 교과 핵심 개요', shortLabel: '01. 핵심 개요', icon: BookOpen, dept: 'FEATURE' },
    { key: 'evolution', label: '02. 형성 원리 4단계', shortLabel: '02. 형성 원리', icon: Activity, dept: 'EVOLUTION' },
    { key: 'field', label: '03. 현장·위성 탐방', shortLabel: '03. 현장 탐방', icon: Compass, dept: 'FIELD' },
    { key: 'glossary', label: '04. 용어·심층 보고서', shortLabel: '04. 심층 보고서', icon: FileText, dept: 'ARCHIVE' },
  ];

  return (
    <section
      id="section-guide"
      className="h-full w-full relative overflow-y-auto bg-[#07070a] text-zinc-100 selection:bg-[#FFCC00] selection:text-black pt-4 sm:pt-6 pb-24"
      aria-label="04 상세 지형 해설"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        {/* ========================================================
            1. Editorial Publication Header Bar & Dateline Kicker
           ======================================================== */}
        <div className="border-b-2 border-white/10 pb-6 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FFCC00] uppercase font-bold">
              <span className="bg-[#FFCC00] text-black px-1.5 py-0.5 text-[10px]">CH.04</span>
              <span>SPECIAL INVESTIGATION</span>
              <span className="text-white/40">·</span>
              <span className="text-zinc-300">{region === 'world' ? 'GLOBAL ARCHIVE' : 'KOREA ARCHIVE'}</span>
              <span className="text-white/40">·</span>
              <span className="text-white">{selectedTerrain || placeInfo.terrain}</span>
            </div>

            <div className="text-xs font-mono font-semibold text-[#FFCC00] bg-black/80 border border-[#FFCC00]/40 px-3 py-1">
              {curriculumMeta.course} 연계 지리 탐구
            </div>
          </div>

          {/* Article Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            {placeInfo.placeName} 자연 지리 심층 리포트
          </h1>

          {/* Article Deck / Subhead */}
          <p className="mt-3 text-base sm:text-lg text-zinc-300 font-serif italic max-w-4xl leading-relaxed">
            "{placeInfo.tagline}"
          </p>
        </div>

        {/* ========================================================
            2. Editorial Lead Paragraph with Drop-Cap & Pull Quote
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0b0b10] border border-white/10 rounded-lg p-6 sm:p-8">
          {/* Opening Narrative with Drop-Cap */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono font-bold text-[#FFCC00] tracking-widest uppercase mb-1">
              EXPEDITION INTRODUCTION // 현장 보고
            </div>
            <p className="magazine-drop-cap text-sm sm:text-base text-zinc-300 leading-relaxed font-serif">
              {placeInfo.formationProcess
                ? placeInfo.formationProcess
                : `${placeInfo.placeName}은(는) 지구 내부의 역동적인 조산 및 화산 작용, 그리고 수만 년에 걸친 풍화와 침식의 시간이 빚어낸 경이로운 자연 지형입니다.`}
            </p>
            <div className="text-xs font-mono text-zinc-400 pt-2 border-t border-white/5 flex items-center gap-2">
              <span className="text-[#FFCC00]">탐사 기록:</span>
              <span>{placeInfo.countryOrArea}</span>
              <span>·</span>
              <span>{geology?.rockType || '자연 지형'}</span>
              {geology?.scale?.elevationMeters && (
                <>
                  <span>·</span>
                  <span>해발 {geology.scale.elevationMeters}m</span>
                </>
              )}
            </div>
          </div>

          {/* Featured Pull Quote */}
          <div className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
            <div className="magazine-pullquote border-y border-white/15 py-5 my-auto">
              <Quote className="w-6 h-6 text-[#FFCC00] mb-2 opacity-80" />
              <blockquote className="text-base sm:text-lg text-white font-serif italic leading-relaxed">
                "{placeInfo.tagline}"
              </blockquote>
              <cite className="block mt-2.5 text-xs font-mono text-[#FFCC00] not-italic uppercase tracking-wider">
                — 국립 지리 탐사 보고서 발췌
              </cite>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. Magazine Department Navigation Ribbon
           ======================================================== */}
        <div
          role="tablist"
          aria-label="매거진 챕터 부서 탭"
          className="w-full grid grid-cols-4 gap-1 sm:gap-1.5 p-1 bg-black/90 border border-white/15"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.key}`}
                id={`tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 px-1.5 sm:px-3 py-2.5 text-xs sm:text-sm font-mono tracking-tight sm:tracking-normal transition-all cursor-pointer whitespace-nowrap overflow-hidden ${
                  isActive
                    ? 'bg-[#FFCC00] text-black font-extrabold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#FFCC00]'}`} />
                <span className="hidden md:inline font-bold truncate">{tab.label}</span>
                <span className="inline md:hidden font-bold truncate">{tab.shortLabel}</span>
                <span
                  className={`hidden xl:inline text-[10px] font-mono px-1 py-0.5 shrink-0 ${
                    isActive ? 'bg-black/20 text-black' : 'text-zinc-500'
                  }`}
                >
                  [{tab.dept}]
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: FEATURE BRIEF (교과 핵심 개요 & 팩트 시트)
           ======================================================== */}
        {activeTab === 'overview' && (
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="space-y-6 animate-in fade-in duration-200"
          >
            {/* Curriculum Standard Card */}
            <div className="bg-[#0b0b10] p-6 border border-white/10 rounded-lg shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-white/15 bg-black/60 rounded-md flex items-center justify-center text-[#FFCC00] shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FFCC00] font-bold uppercase tracking-wider">
                    <span>{curriculumMeta.course}</span>
                    <span aria-hidden="true">·</span>
                    <span>단원: {curriculumMeta.unit}</span>
                  </div>
                  <h3 className="font-serif font-black text-white text-lg sm:text-xl">
                    핵심 교육과정 성취기준 및 탐구 목표
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-light">
                    {curriculumMeta.coreStandard}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
                    <span className="text-[#FFCC00] font-bold">KEY CONCEPTS:</span>
                    {curriculumMeta.keyConcepts.map((concept, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 px-2 py-0.5 text-zinc-300">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Multi-Column Magazine Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Column 1: Geological Fact Sheet */}
              <div className="lg:col-span-5 bg-[#0b0b10] p-6 border border-white/10 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10 text-white font-serif font-bold text-base">
                    <Layers className="w-4 h-4 text-[#FFCC00]" />
                    <span>지질학적 핵심 프로필 명세서</span>
                  </div>

                  <dl className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-white/5 border border-white/5">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">구성 암석 (ROCK TYPE)</dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {geology?.rockType || '현무암 및 자연 화산/퇴적암류'}
                      </dd>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">형성 지질시대 (GEOLOGICAL AGE)</dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {geology?.geologicalAge || '신생대 제4기 플라이스토세~홀로세'}
                      </dd>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">지구조 환경 (TECTONIC SETTING)</dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {geology?.tectonicSetting || '판 내부 열점(Hotspot) 또는 섭입대'}
                      </dd>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">주요 작용력 (GEOMORPHIC AGENT)</dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {geology?.geomorphicAgent || '마그마 분출, 유수 작용 및 풍화·침식'}
                      </dd>
                    </div>

                    {geology?.scale && (
                      <div className="p-3 bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-zinc-400 text-[10px] uppercase">지형 규모 (SCALE):</span>
                        <span className="text-[#FFCC00] font-mono font-bold">
                          {geology.scale.elevationMeters ? `해발 ${geology.scale.elevationMeters.toLocaleString()}m` : ''}
                          {geology.scale.areaKm2 ? ` · 면적 ${geology.scale.areaKm2.toLocaleString()}㎢` : ''}
                          {geology.scale.depthMeters ? ` · 깊이 ${geology.scale.depthMeters}m` : ''}
                        </span>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
                  * 지구과학 교과서 및 국립 지질 도폭 공인 관측 데이터
                </div>
              </div>

              {/* Column 2: 3 Key Takeaways & Core Mechanism */}
              <div className="lg:col-span-7 bg-[#0b0b10] p-6 border border-white/10 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10 text-white font-serif font-bold text-base">
                    <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
                    <span>한눈에 보는 지형 형성 원리 (3대 핵심 팩트)</span>
                  </div>

                  <div className="space-y-3.5">
                    {keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 hover:border-[#FFCC00]/40 transition-colors"
                      >
                        <span className="font-mono text-xs font-bold text-black bg-[#FFCC00] px-2 py-0.5 shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-light font-serif">
                          {takeaway}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Exam Notes Callout */}
                  <div className="mt-5 p-4 bg-black/60 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFCC00] mb-1 uppercase tracking-wider">
                      <Info className="w-4 h-4" />
                      <span>교과 시험 및 탐구 논술 핵심 포인트</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-light">
                      {placeInfo.formationProcess || placeInfo.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>다음 탭에서 4단계 지형 진화 메커니즘을 확인하세요.</span>
                  <button
                    onClick={() => setActiveTab('evolution')}
                    className="text-[#FFCC00] hover:underline font-bold cursor-pointer"
                  >
                    4단계 형성 원리 보기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: EVOLUTION ESSAY (형성 원리 4단계 타임라인)
           ======================================================== */}
        {activeTab === 'evolution' && (
          <div
            id="panel-evolution"
            role="tabpanel"
            aria-labelledby="tab-evolution"
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="bg-[#0b0b10] p-6 sm:p-8 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-[#FFCC00] bg-black flex items-center justify-center text-[#FFCC00]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-white text-lg sm:text-xl">
                      {placeInfo.placeName} 지형 진화 4단계 타임라인
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      CHRONOLOGICAL EVOLUTION ESSAY // 기저 암반 형성부터 현대 지형 완성까지
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#FFCC00] hidden sm:inline-block font-bold">
                  STAGES 01 ~ 04
                </span>
              </div>

              {evolutionStages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {evolutionStages.map((stage) => (
                    <div
                      key={stage.stageNumber}
                      className="p-5 bg-white/5 border border-white/10 hover:border-[#FFCC00] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="font-bold text-black bg-[#FFCC00] px-2 py-0.5 tracking-wider font-mono text-[11px]">
                            FIG. 0{stage.stageNumber}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">{stage.timeframe}</span>
                        </div>
                        <h4 className="font-serif font-bold text-white text-base mb-2 group-hover:text-[#FFCC00] transition-colors">
                          {stage.title}
                        </h4>
                        <p className="text-xs text-zinc-300 leading-relaxed mb-4 font-light font-serif">
                          {stage.process}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-xs text-zinc-200">
                        <Eye className="w-3.5 h-3.5 text-[#FFCC00] shrink-0 mt-0.5" />
                        <span className="font-mono text-[11px] leading-relaxed text-[#FFCC00]">
                          [관찰 지표] {stage.visualKeyFeature}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-400 text-sm font-serif">
                  {placeInfo.formationProcess}
                </div>
              )}

              {/* Scientific Takeaway Banner */}
              <div className="mt-6 p-4 bg-black/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-300">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#FFCC00] shrink-0" />
                  <span>수억~수만 년에 걸친 마그마 분출과 지각 융기, 침식이 만든 자연의 조각입니다.</span>
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onNavigateSlide(2)}
                    className="text-[#FFCC00] hover:underline font-bold cursor-pointer"
                  >
                    3D 디오라마 단면 확인 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: FIELD SURVEY (현장·위성 탐방 가이드)
           ======================================================== */}
        {activeTab === 'field' && (
          <div
            id="panel-field"
            role="tabpanel"
            aria-labelledby="tab-field"
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Field Observation & Best Season */}
              <div className="lg:col-span-6 space-y-6">
                {/* Observation Checkpoints */}
                <div className="bg-[#0b0b10] p-6 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10">
                    <Compass className="w-5 h-5 text-[#FFCC00]" />
                    <div>
                      <h4 className="font-serif font-black text-white text-base">
                        현장 탐험 시 핵심 관찰 포인트
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        FIELD OBSERVATION CHECKPOINTS
                      </p>
                    </div>
                  </div>

                  {placeInfo.observationPoints && placeInfo.observationPoints.length > 0 ? (
                    <ul className="space-y-3 font-serif">
                      {placeInfo.observationPoints.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/5 text-xs sm:text-sm text-zinc-200 leading-relaxed"
                        >
                          <span className="font-mono text-xs font-bold text-[#FFCC00] shrink-0 mt-0.5">
                            0{i + 1}.
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-400">관찰 포인트를 불러오는 중입니다.</p>
                  )}
                </div>

                {/* Season & Conservation */}
                <div className="bg-[#0b0b10] p-6 border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <Calendar className="w-5 h-5 text-[#FFCC00]" />
                    <div>
                      <h4 className="font-serif font-black text-white text-base">
                        탐방 시기 및 자연유산 보전 안내
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        SEASON & CONSERVATION ETHICS
                      </p>
                    </div>
                  </div>

                  {fieldGuide?.bestVisitingSeason && (
                    <div className="p-3.5 bg-white/5 border border-white/5 text-xs sm:text-sm">
                      <span className="font-mono font-bold text-[#FFCC00] block mb-1 uppercase text-xs">
                        [최적 방문 시기]
                      </span>
                      <p className="text-zinc-200 leading-relaxed font-serif">
                        {fieldGuide.bestVisitingSeason}
                      </p>
                    </div>
                  )}

                  <div className="p-3.5 bg-black/60 border border-white/10 rounded-lg text-xs sm:text-sm">
                    <span className="font-mono font-bold text-[#FFCC00] flex items-center gap-1.5 mb-1 uppercase">
                      <AlertTriangle className="w-4 h-4 text-[#FFCC00]" />
                      <span>안전 유의사항 및 지형 보전</span>
                    </span>
                    <p className="text-zinc-200 leading-relaxed font-light">
                      {fieldGuide?.cautionAndConservation ||
                        '지정된 관람로를 준수하고 자연 지형을 훼손하거나 암석을 무단 반출하지 않도록 유의하세요.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Satellite Image Reading & Live Map Links */}
              <div className="lg:col-span-6 space-y-6">
                {/* Satellite Checkpoints */}
                <div className="bg-[#0b0b10] p-6 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10">
                    <Globe className="w-5 h-5 text-[#FFCC00]" />
                    <div>
                      <h4 className="font-serif font-black text-white text-base">
                        위성사진 판독 핵심 지표 3선
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        ORBITAL RECONNAISSANCE SIGNATURES
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 font-serif">
                    {(fieldGuide?.satelliteCheckPoints || [
                      '산 정상부를 중심으로 방사상으로 뻗은 하천 수계망 및 침식 골짜기',
                      '분화구 림 또는 침식 절벽이 만드는 선명한 음영 경계선',
                      '주변 평지와 확연히 구별되는 독특한 식생 및 암석 색조 대비',
                    ]).map((chk, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/5 text-xs sm:text-sm text-zinc-200 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-bold text-black bg-[#FFCC00] w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Satellite Exploration Links */}
                <div className="bg-[#0b0b10] p-6 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10">
                    <MapPin className="w-5 h-5 text-[#FFCC00]" />
                    <h4 className="font-serif font-black text-white text-base">
                      초고해상도 위성 지도 바로가기
                    </h4>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}&t=k`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 border border-white/10 bg-white/5 hover:bg-[#FFCC00] hover:text-black transition-colors font-bold text-zinc-200"
                    >
                      <span className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-sky-400 group-hover:text-black" />
                        <span>Google 지도 고해상도 위성뷰 열기</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>

                    <a
                      href={`https://earth.google.com/web/search/${encodeURIComponent(mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 border border-white/10 bg-white/5 hover:bg-[#FFCC00] hover:text-black transition-colors font-bold text-zinc-200"
                    >
                      <span className="flex items-center gap-2.5">
                        <Box className="w-4 h-4 text-[#FFCC00] group-hover:text-black" />
                        <span>Google Earth 3D 웹 입체 탐색</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>

                    {region === 'korea' && (
                      <a
                        href={`https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 border border-white/10 bg-white/5 hover:bg-[#FFCC00] hover:text-black transition-colors font-bold text-zinc-200"
                      >
                        <span className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-teal-400 group-hover:text-black" />
                          <span>네이버 지도 항공뷰 열기</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: ARCHIVE DOSSIER (지질 사전 & 심층 보고서)
           ======================================================== */}
        {activeTab === 'glossary' && (
          <div
            id="panel-glossary"
            role="tabpanel"
            aria-labelledby="tab-glossary"
            className="space-y-6 animate-in fade-in duration-200"
          >
            {/* Earth Science Glossary Cards */}
            <div className="bg-[#0b0b10] p-6 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 pb-3 mb-5 border-b border-white/10">
                <div className="w-8 h-8 border border-[#FFCC00] bg-black flex items-center justify-center text-[#FFCC00]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-white text-base sm:text-lg">
                    교과 핵심 지질학 용어 사전
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    GEOLOGICAL GLOSSARY ARCHIVE
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {glossaryItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/5 border border-white/10 hover:border-[#FFCC00] transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-white text-sm text-[#FFCC00]">
                        {item.term}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500">TERM 0{idx + 1}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-serif font-light">
                      {item.definition}
                    </p>
                    {item.curriculumNote && (
                      <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-400">
                        <span className="text-[#FFCC00] font-bold">교과 포인트: </span>
                        {item.curriculumNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific In-Depth Report & Scholarly Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#0b0b10] p-6 sm:p-8 border border-white/10 shadow-xl prose prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-[#FFCC00] max-w-none">
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10 not-prose text-white font-serif font-black text-base sm:text-lg">
                  <FileText className="w-5 h-5 text-[#FFCC00]" />
                  <span>심층 지형학적 형성 보고서 (SPECIAL DOSSIER)</span>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.description}</ReactMarkdown>
              </div>

              <div className="lg:col-span-4 space-y-6">
                {/* References */}
                {result.searchSources.length > 0 && (
                  <div className="bg-[#0b0b10] p-6 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/10 font-serif font-bold text-white text-base">
                      <FileText className="w-4 h-4 text-[#FFCC00]" />
                      <span>학술 및 지리 참고 문헌</span>
                    </div>
                    <ul className="space-y-2 text-xs font-mono">
                      {result.searchSources.map((source, idx) => (
                        <li key={idx}>
                          <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 hover:text-[#FFCC00] flex items-center justify-between gap-2 py-1 transition-colors border-b border-white/5 pb-1"
                          >
                            <span className="break-words leading-snug">{source.title}</span>
                            <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 space-y-2">
                  <p className="font-bold text-white uppercase text-[#FFCC00]">학습 탐사 노트</p>
                  <p className="leading-relaxed">
                    상단 챕터 탭을 전환하며 지형의 기본 프로필, 형성 원리, 현장 관찰 단서를 순차적으로 탐구할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            5. Bottom Article Return & Expedition Navigation Bar
           ======================================================== */}
        <div className="pt-8 border-t-2 border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateSlide(1)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#FFCC00] hover:text-black text-xs font-bold text-zinc-200 transition-all cursor-pointer border border-white/15"
            >
              <MapPin className="w-4 h-4 text-[#FFCC00] group-hover:text-black" />
              <span>CH.02 위성 지도로 이동</span>
            </button>
            <button
              onClick={() => onNavigateSlide(2)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#FFCC00] hover:text-black text-xs font-bold text-zinc-200 transition-all cursor-pointer border border-white/15"
            >
              <Box className="w-4 h-4 text-[#FFCC00] group-hover:text-black" />
              <span>CH.03 3D 디오라마로 이동</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateSlide(0)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FFCC00] text-black hover:bg-amber-400 font-black text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>CH.01 매거진 커버로 돌아가기</span>
          </button>
        </div>
      </div>
    </section>
  );
};
