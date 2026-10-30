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
        className="h-screen w-full snap-start snap-always relative overflow-y-auto bg-[#0a0a0c] text-slate-100 p-8 flex items-center justify-center"
      >
        <p className="text-slate-400">지형 해설 정보를 불러오는 중입니다...</p>
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

  const tabs: { key: TabKey; label: string; icon: LucideIcon; badge: string }[] = [
    { key: 'overview', label: '01. 교과 핵심 개요', icon: BookOpen, badge: '개념 & 팩트' },
    { key: 'evolution', label: '02. 형성 원리 4단계', icon: Activity, badge: '단계별 메커니즘' },
    { key: 'field', label: '03. 현장·위성 탐방', icon: Compass, badge: '관찰 & 판독' },
    { key: 'glossary', label: '04. 용어·심층 정리', icon: FileText, badge: '지질 사전 & 보고서' },
  ];

  return (
    <section
      id="section-guide"
      className="h-screen w-full snap-start snap-always relative overflow-y-auto bg-[#0a0a0c] text-slate-100 selection:bg-[#FFCC00] selection:text-black pt-20 pb-24"
      aria-label="04 상세 지형 해설"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ========================================================
            Header Bar: Distinctive Title & Geographic Context
           ======================================================== */}
        <div className="border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-[#FFCC00] font-bold">SLIDE 04</span>
              <span aria-hidden="true">·</span>
              <span>{region === 'world' ? '전 세계(World)' : '대한민국(Korea)'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-white font-medium">{selectedTerrain || placeInfo.terrain}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{placeInfo.countryOrArea}</span>
            </div>

            <div className="text-xs font-medium text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-md">
              {curriculumMeta.course} 연계 지형
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            {placeInfo.placeName} 자연 지리 핵심 해설
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-slate-300 font-light max-w-4xl line-clamp-2">
            {placeInfo.tagline}
          </p>
        </div>

        {/* ========================================================
            Tab Navigation Bar (Single-line, accessible button controls)
           ======================================================== */}
        <div
          role="tablist"
          aria-label="지형 해설 주제별 탭"
          className="flex items-center gap-2 p-1.5 bg-[#121217] rounded-xl border border-white/10 overflow-x-auto no-scrollbar"
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
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFCC00] text-black shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#FFCC00]'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-black/15 text-black' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: 교과 핵심 개요 (Core Concepts & Profile)
           ======================================================== */}
        {activeTab === 'overview' && (
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="space-y-6 animate-in fade-in duration-200"
          >
            {/* Curriculum Standard Card */}
            <div className="bg-[#121217] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/25 flex items-center justify-center text-[#FFCC00] shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-[#FFCC00] font-semibold">{curriculumMeta.course}</span>
                    <span aria-hidden="true">·</span>
                    <span>단원: {curriculumMeta.unit}</span>
                  </div>
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                    핵심 교육과정 성취기준 및 탐구 목표
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {curriculumMeta.coreStandard}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400 font-mono">
                    <span className="text-[#FFCC00]">핵심 키워드:</span>
                    {curriculumMeta.keyConcepts.map((concept, idx) => (
                      <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-slate-300">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Split: Fact Sheet & 3 Key Takeaways */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Geological Fact Sheet */}
              <div className="lg:col-span-5 bg-[#121217] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/10 text-white font-serif font-bold text-base">
                    <Layers className="w-4 h-4 text-[#FFCC00]" />
                    <span>지질학적 핵심 프로필</span>
                  </div>

                  <dl className="space-y-3 text-xs sm:text-sm">
                    <div className="p-3 rounded-xl bg-[#171720] border border-white/5">
                      <dt className="text-slate-400 text-xs mb-1">구성 암석 (Rock Type)</dt>
                      <dd className="text-white font-medium">
                        {geology?.rockType || '현무암 및 자연 화산/퇴적암류'}
                      </dd>
                    </div>

                    <div className="p-3 rounded-xl bg-[#171720] border border-white/5">
                      <dt className="text-slate-400 text-xs mb-1">형성 지질시대 (Geological Age)</dt>
                      <dd className="text-white font-medium">
                        {geology?.geologicalAge || '신생대 제4기 플라이스토세~홀로세'}
                      </dd>
                    </div>

                    <div className="p-3 rounded-xl bg-[#171720] border border-white/5">
                      <dt className="text-slate-400 text-xs mb-1">지구조 환경 (Tectonic Setting)</dt>
                      <dd className="text-white font-medium">
                        {geology?.tectonicSetting || '판 내부 열점(Hotspot) 또는 섭입대'}
                      </dd>
                    </div>

                    <div className="p-3 rounded-xl bg-[#171720] border border-white/5">
                      <dt className="text-slate-400 text-xs mb-1">주요 작용력 (Geomorphic Agent)</dt>
                      <dd className="text-white font-medium">
                        {geology?.geomorphicAgent || '마그마 분출, 유수 작용 및 풍화·침식'}
                      </dd>
                    </div>

                    {geology?.scale && (
                      <div className="p-3 rounded-xl bg-[#171720] border border-white/5 flex items-center justify-between text-xs">
                        <span className="text-slate-400">지형 규모:</span>
                        <span className="text-[#FFCC00] font-mono font-bold">
                          {geology.scale.elevationMeters ? `해발 ${geology.scale.elevationMeters.toLocaleString()}m` : ''}
                          {geology.scale.areaKm2 ? ` · 면적 ${geology.scale.areaKm2.toLocaleString()}㎢` : ''}
                          {geology.scale.depthMeters ? ` · 깊이 ${geology.scale.depthMeters}m` : ''}
                        </span>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 font-mono">
                  * 지구과학 교과서 및 한국지리 지질 도폭 기준 공인 데이터
                </div>
              </div>

              {/* 3 Key Takeaways & Core Mechanism */}
              <div className="lg:col-span-7 bg-[#121217] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/10 text-white font-serif font-bold text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>한눈에 보는 지형 형성 원리 (3대 핵심 정리)</span>
                  </div>

                  <div className="space-y-3.5">
                    {keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl bg-[#171720] border border-white/5 hover:border-[#FFCC00]/30 transition-colors"
                      >
                        <span className="font-mono text-xs font-bold text-[#FFCC00] bg-[#FFCC00]/10 px-2 py-0.5 rounded shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                          {takeaway}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Formation Mechanism Summary */}
                  <div className="mt-5 p-4 rounded-xl bg-amber-950/20 border border-amber-500/25">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                      <Info className="w-4 h-4" />
                      <span>교과 시험 및 탐구 핵심 포인트</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-light">
                      {placeInfo.formationProcess || placeInfo.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>다음 탭에서 세부 4단계 진화 과정을 확인하세요.</span>
                  <button
                    onClick={() => setActiveTab('evolution')}
                    className="text-[#FFCC00] hover:underline font-semibold cursor-pointer"
                  >
                    4단계 형성 원리 보기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: 형성 원리 4단계 (Step-by-Step Geological Evolution)
           ======================================================== */}
        {activeTab === 'evolution' && (
          <div
            id="panel-evolution"
            role="tabpanel"
            aria-labelledby="tab-evolution"
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFCC00]/10 border border-[#FFCC00]/25 flex items-center justify-center text-[#FFCC00]">
                    <Activity className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                      {placeInfo.placeName} 지형 진화 4단계 타임라인
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      기저 암반 태동부터 현대 경관 완성까지의 지구과학적 진화 과정
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
                  Chronological Stages 01 ~ 04
                </span>
              </div>

              {evolutionStages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {evolutionStages.map((stage) => (
                    <div
                      key={stage.stageNumber}
                      className="p-5 rounded-xl bg-[#171720] border border-white/8 hover:border-[#FFCC00]/40 transition-colors flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                          <span className="font-bold text-[#FFCC00] tracking-widest uppercase font-mono">
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

                      <div className="pt-2.5 border-t border-white/8 flex items-start gap-2 text-xs text-amber-200/90 font-medium">
                        <Eye className="w-3.5 h-3.5 text-[#FFCC00] shrink-0 mt-0.5" />
                        <span className="break-words leading-relaxed">{stage.visualKeyFeature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  {placeInfo.formationProcess}
                </div>
              )}

              {/* Scientific Takeaway Banner */}
              <div className="mt-6 p-4 rounded-xl bg-[#171720] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#FFCC00] shrink-0" />
                  <span>수억~수만 년에 걸친 판구조론적 분출 및 침식 작용이 만든 지형입니다.</span>
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onNavigateSlide(2)}
                    className="text-[#FFCC00] hover:underline font-semibold cursor-pointer"
                  >
                    3D 디오라마 단면 확인 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: 현장·위성 탐방 가이드 (Field & Satellite Observation)
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
                <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10">
                    <Compass className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-serif font-bold text-white text-base">
                        현장 탐험 시 핵심 관찰 포인트
                      </h4>
                      <p className="text-xs text-slate-400 font-light">
                        실제 지형 방문 시 눈여겨보아야 할 주요 증거
                      </p>
                    </div>
                  </div>

                  {placeInfo.observationPoints && placeInfo.observationPoints.length > 0 ? (
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
                    <p className="text-xs text-slate-400">관찰 포인트를 불러오는 중입니다.</p>
                  )}
                </div>

                {/* Season & Conservation */}
                <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <Calendar className="w-5 h-5 text-teal-400" />
                    <div>
                      <h4 className="font-serif font-bold text-white text-base">
                        탐방 시기 및 자연유산 보전
                      </h4>
                      <p className="text-xs text-slate-400 font-light">
                        안전하고 품격 있는 자연 지리 탐방 안내
                      </p>
                    </div>
                  </div>

                  {fieldGuide?.bestVisitingSeason && (
                    <div className="p-3.5 rounded-xl bg-[#171720] border border-white/5 text-xs sm:text-sm">
                      <span className="font-semibold text-slate-400 block mb-1">최적 방문 시기</span>
                      <p className="text-slate-200 leading-relaxed">
                        {fieldGuide.bestVisitingSeason}
                      </p>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/25 text-xs sm:text-sm">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>안전 유의사항 및 지형 보전</span>
                    </span>
                    <p className="text-amber-100/90 leading-relaxed font-light">
                      {fieldGuide?.cautionAndConservation ||
                        '지정된 관람로를 준수하고 자연 지형을 훼손하거나 암석을 무단 반출하지 않도록 유의하세요.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Satellite Image Reading & Live Map Links */}
              <div className="lg:col-span-6 space-y-6">
                {/* Satellite Checkpoints */}
                <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10">
                    <Globe className="w-5 h-5 text-sky-400" />
                    <div>
                      <h4 className="font-serif font-bold text-white text-base">
                        위성사진 판독 핵심 3선
                      </h4>
                      <p className="text-xs text-slate-400 font-light">
                        우주 및 항공 시점에서 식별되는 지형적 단서
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {(fieldGuide?.satelliteCheckPoints || [
                      '산 정상부를 중심으로 방사상으로 뻗은 하천 수계망 및 침식 골짜기',
                      '분화구 림 또는 침식 절벽이 만드는 선명한 음영 경계선',
                      '주변 평지와 확연히 구별되는 독특한 식생 및 암석 색조 대비',
                    ]).map((chk, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#171720] border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-500/30 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Satellite Exploration Links */}
                <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10">
                    <MapPin className="w-5 h-5 text-[#FFCC00]" />
                    <h4 className="font-serif font-bold text-white text-base">
                      초고해상도 위성 지도 바로가기
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}&t=k`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-[#171720] hover:bg-[#1f1f2c] transition-colors text-xs font-semibold text-slate-200"
                    >
                      <span className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-sky-400" />
                        <span>Google 지도 고해상도 위성뷰 열기</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href={`https://earth.google.com/web/search/${encodeURIComponent(mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-[#171720] hover:bg-[#1f1f2c] transition-colors text-xs font-semibold text-slate-200"
                    >
                      <span className="flex items-center gap-2.5">
                        <Box className="w-4 h-4 text-[#FFCC00]" />
                        <span>Google Earth 3D 웹 입체 탐색</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    {region === 'korea' && (
                      <a
                        href={`https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-[#171720] hover:bg-[#1f1f2c] transition-colors text-xs font-semibold text-slate-200"
                      >
                        <span className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span>네이버 지도 항공뷰 열기</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: 용어·심층 정리 (Glossary & In-Depth Report)
           ======================================================== */}
        {activeTab === 'glossary' && (
          <div
            id="panel-glossary"
            role="tabpanel"
            aria-labelledby="tab-glossary"
            className="space-y-6 animate-in fade-in duration-200"
          >
            {/* Earth Science Glossary Cards */}
            <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 pb-3 mb-5 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-[#FFCC00]/10 border border-[#FFCC00]/25 flex items-center justify-center text-[#FFCC00]">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                    교과 핵심 지질학 용어 사전
                  </h3>
                  <p className="text-xs text-slate-400 font-light">
                    시험 및 수행평가에 자주 출제되는 필수 지구과학 용어 해설
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {glossaryItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#171720] border border-white/8 hover:border-[#FFCC00]/30 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-white text-sm text-[#FFCC00]">
                        {item.term}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">TERM 0{idx + 1}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-light">
                      {item.definition}
                    </p>
                    {item.curriculumNote && (
                      <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                        <span className="text-amber-300 font-medium">교과 포인트: </span>
                        {item.curriculumNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific In-Depth Report & Scholarly Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#121217] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl prose prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-[#FFCC00] max-w-none">
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10 not-prose text-white font-serif font-bold text-base sm:text-lg">
                  <FileText className="w-5 h-5 text-[#FFCC00]" />
                  <span>심층 지형학적 형성 보고서</span>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.description}</ReactMarkdown>
              </div>

              <div className="lg:col-span-4 space-y-6">
                {/* References */}
                {result.searchSources.length > 0 && (
                  <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/10">
                      <FileText className="w-4 h-4 text-[#FFCC00]" />
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
                            <span className="break-words leading-snug">{source.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#171720] border border-white/10 text-xs text-slate-400 space-y-2">
                  <p className="font-semibold text-white">학습 노트 및 피드백</p>
                  <p className="font-light leading-relaxed">
                    상단 탭을 전환하며 지형의 기본 프로필, 형성 원리, 현장 관찰 단서를 순차적으로 탐구할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            Bottom Quick Return Dock
           ======================================================== */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateSlide(1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer border border-white/10"
            >
              <MapPin className="w-4 h-4 text-[#FFCC00]" />
              <span>02 구글 위성지도로 이동</span>
            </button>
            <button
              onClick={() => onNavigateSlide(2)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer border border-white/10"
            >
              <Box className="w-4 h-4 text-[#FFCC00]" />
              <span>03 3D 디오라마로 이동</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateSlide(0)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFCC00] text-black hover:bg-amber-400 font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>01 메인 화면으로 돌아가기</span>
          </button>
        </div>
      </div>
    </section>
  );
};
