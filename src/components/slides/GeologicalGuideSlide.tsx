import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  GraduationCap,
  BookOpen,
  Award,
  Compass,
  Layers,
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
  Info,
  FileText,
  LucideIcon,
  Sparkles,
} from 'lucide-react';
import { SearchResult as SearchResultType, Region } from '../../types';
import {
  EducationLevel,
  EDUCATION_LEVELS,
  getLevelContent,
} from '../../utils/educationLevelHelper';

interface GeologicalGuideSlideProps {
  result: SearchResultType;
  region: Region;
  selectedTerrain: string | null;
  onNavigateSlide: (index: number) => void;
}

type TabKey = 'evolution' | 'concepts' | 'field' | 'archive';

export const GeologicalGuideSlide: React.FC<GeologicalGuideSlideProps> = ({
  result,
  region,
  selectedTerrain,
  onNavigateSlide,
}) => {
  const [level, setLevel] = useState<EducationLevel>('high');
  const [activeTab, setActiveTab] = useState<TabKey>('evolution');

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

  const content = getLevelContent(placeInfo, level);
  const mapQuery = placeInfo.mapQuery || result.placeName;

  const tabs: { key: TabKey; label: string; shortLabel: string; icon: LucideIcon }[] = [
    { key: 'evolution', label: '01. 4단계 형성 원리', shortLabel: '01. 형성 원리', icon: Activity },
    { key: 'concepts', label: '02. 핵심 개념 & 지질 팩트', shortLabel: '02. 개념·팩트', icon: Layers },
    { key: 'field', label: '03. 현장·위성 탐방 가이드', shortLabel: '03. 현장 탐방', icon: Compass },
    { key: 'archive', label: '04. 심층 리포트 전문', shortLabel: '04. 심층 리포트', icon: FileText },
  ];

  return (
    <section
      id="section-guide"
      className="h-full w-full relative overflow-y-auto bg-[#07070a] text-zinc-100 selection:bg-[#FFCC00] selection:text-black pt-3 sm:pt-5 pb-24"
      aria-label="04 상세 지형 해설"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* ========================================================
            1. Level Switcher Bar & Publication Header
           ======================================================== */}
        <div className="bg-[#0b0b10] border border-white/10 rounded-xl p-4 sm:p-5 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
            {/* Left: Location & Terrain Breadcrumb */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#FFCC00] uppercase mb-1">
                <span className="bg-[#FFCC00] text-black px-1.5 py-0.5 text-[10px] font-black">CH.04</span>
                <span>GEOLOGICAL INVESTIGATION</span>
                <span className="text-white/30">·</span>
                <span className="text-zinc-300">{region === 'world' ? 'GLOBAL ARCHIVE' : 'KOREA ARCHIVE'}</span>
                <span className="text-white/30">·</span>
                <span className="text-white">{selectedTerrain || placeInfo.terrain}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
                {placeInfo.placeName}
                <span className="text-sm sm:text-base font-sans font-normal text-zinc-400 ml-3">
                  {placeInfo.countryOrArea}
                </span>
              </h1>
            </div>

            {/* Right: Education Level Switcher (초/중/고/일반) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>해설 난이도 선택:</span>
              </span>
              <div
                role="group"
                aria-label="해설 수준 선택"
                className="grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-black/80 border border-white/15 rounded-lg"
              >
                {EDUCATION_LEVELS.map((lvl) => {
                  const isSelected = level === lvl.id;
                  const Icon =
                    lvl.id === 'elementary'
                      ? GraduationCap
                      : lvl.id === 'middle'
                      ? BookOpen
                      : lvl.id === 'high'
                      ? Award
                      : Compass;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setLevel(lvl.id)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFCC00] text-black shadow-md'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                      title={lvl.subLabel}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#FFCC00]'}`} />
                      <span className="hidden md:inline">{lvl.label}</span>
                      <span className="inline md:hidden">{lvl.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Level Tailored Summary Card */}
          <div className="mt-4 pt-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-4xl">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 text-[11px] font-mono font-bold border rounded bg-white/5 border-white/20 text-[#FFCC00]">
                  {content.badge}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {content.coreQuestionOrTopic.label}: <strong className="text-zinc-200">{content.coreQuestionOrTopic.text}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                "{content.headline}"
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-serif">
                {content.summary}
              </p>
            </div>

            {/* Quick Spec Badge Pill */}
            {content.factSheet.scale && (
              <div className="shrink-0 p-3 bg-black/60 border border-white/10 rounded-lg text-right hidden lg:block">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-0.5">지형 규모 (SCALE)</span>
                <span className="text-xs font-mono font-bold text-[#FFCC00]">
                  {content.factSheet.scale}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            2. Main Content Tabs Ribbon
           ======================================================== */}
        <div
          role="tablist"
          aria-label="지형 리포트 세부 탭"
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1 bg-black/90 border border-white/15 rounded-lg"
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
                className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-mono tracking-tight transition-all rounded cursor-pointer ${
                  isActive
                    ? 'bg-[#FFCC00] text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#FFCC00]'}`} />
                <span className="hidden sm:inline font-bold">{tab.label}</span>
                <span className="inline sm:hidden font-bold">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: 4단계 형성 원리 (EVOLUTION TIMELINE)
           ======================================================== */}
        {activeTab === 'evolution' && (
          <div
            id="panel-evolution"
            role="tabpanel"
            aria-labelledby="tab-evolution"
            className="space-y-4 animate-in fade-in duration-200"
          >
            <div className="bg-[#0b0b10] p-5 sm:p-7 border border-white/10 rounded-xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-[#FFCC00] bg-black rounded flex items-center justify-center text-[#FFCC00]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-white text-lg">
                      {placeInfo.placeName} 지형 진화 4단계 타임라인
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      {level === 'elementary'
                        ? '자연이 오랜 시간 바위를 깎고 쌓아 지형을 만든 순서입니다.'
                        : 'CHRONOLOGICAL EVOLUTION PROCESS // 기저 지반 형성부터 현대 지형까지'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#FFCC00] font-bold self-start sm:self-auto bg-white/5 px-2.5 py-1 border border-white/10 rounded">
                  {content.badge}
                </span>
              </div>

              {/* 4 Stages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {content.stages.map((stage) => (
                  <div
                    key={stage.stageNumber}
                    className="p-5 bg-white/5 border border-white/10 hover:border-[#FFCC00] rounded-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold text-black bg-[#FFCC00] px-2 py-0.5 rounded font-mono text-[11px]">
                          STEP 0{stage.stageNumber}
                        </span>
                        {stage.timeframe && (
                          <span className="font-mono text-[11px] text-zinc-400">{stage.timeframe}</span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-white text-base mb-2 group-hover:text-[#FFCC00] transition-colors leading-snug">
                        {stage.title}
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-4 font-serif">
                        {stage.process}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-xs">
                      <Eye className="w-3.5 h-3.5 text-[#FFCC00] shrink-0 mt-0.5" />
                      <span className="font-mono text-[11px] leading-relaxed text-[#FFCC00]">
                        <strong className="text-zinc-300">
                          {level === 'elementary' ? '[눈여겨볼 점] ' : '[관찰 지표] '}
                        </strong>
                        {stage.visualKeyFeature}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Action Footer */}
              <div className="mt-6 p-4 bg-black/60 border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <span className="text-zinc-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#FFCC00] shrink-0" />
                  <span>
                    {level === 'elementary'
                      ? '3D 입체 화면에서 이 지형의 높낮이와 단면을 직접 회전하며 관찰해 보세요.'
                      : '3D 디오라마에서 등고선과 지층 단면 스커트를 통해 입체적인 형태를 확인할 수 있습니다.'}
                  </span>
                </span>
                <button
                  onClick={() => onNavigateSlide(2)}
                  className="text-[#FFCC00] hover:underline font-bold cursor-pointer shrink-0"
                >
                  3D 디오라마로 입체 관찰 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: 핵심 개념 & 지질 팩트 (CONCEPTS & FACTS)
           ======================================================== */}
        {activeTab === 'concepts' && (
          <div
            id="panel-concepts"
            role="tabpanel"
            aria-labelledby="tab-concepts"
            className="space-y-5 animate-in fade-in duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Core Concepts Tailored by Level */}
              <div className="lg:col-span-7 bg-[#0b0b10] p-5 sm:p-6 border border-white/10 rounded-xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-5 h-5 text-[#FFCC00]" />
                      <h3 className="font-serif font-black text-white text-base sm:text-lg">
                        {level === 'elementary'
                          ? '꼭 알아두어야 할 기초 지형 개념'
                          : level === 'middle'
                          ? '중등 과학·지리 핵심 원리 개념'
                          : level === 'high'
                          ? '2022 개정 교과 핵심 용어 및 성취기준'
                          : '지리 교양 및 경관 이해를 위한 핵심 포인트'}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#FFCC00] bg-white/5 px-2 py-0.5 border border-white/10 rounded">
                      {content.badge}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {content.coreConcepts.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#FFCC00]/50 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-white text-sm text-[#FFCC00]">
                            {item.term}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500">POINT 0{idx + 1}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-serif">
                          {item.description}
                        </p>
                        {item.curriculumPoint && (
                          <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-400">
                            <span className="text-[#FFCC00] font-bold">
                              {level === 'elementary' ? '교과서 단원: ' : '교과 연계: '}
                            </span>
                            {item.curriculumPoint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-xs font-mono text-zinc-400 flex items-center justify-between">
                  <span>상단에서 [난이도]를 바꾸면 어휘와 개념이 즉시 변환됩니다.</span>
                  <span className="text-[#FFCC00]">4개 난이도 지원</span>
                </div>
              </div>

              {/* Right Column: Geological Fact Sheet */}
              <div className="lg:col-span-5 bg-[#0b0b10] p-5 sm:p-6 border border-white/10 rounded-xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/10">
                    <Layers className="w-5 h-5 text-[#FFCC00]" />
                    <h3 className="font-serif font-black text-white text-base sm:text-lg">
                      {level === 'elementary' ? '지형 관찰 명세표' : '지질학적 핵심 프로필 명세서'}
                    </h3>
                  </div>

                  <dl className="space-y-2.5 font-mono text-xs">
                    <div className="p-3 bg-white/5 border border-white/5 rounded">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">
                        {level === 'elementary' ? '이루고 있는 암석' : '구성 암석 (ROCK TYPE)'}
                      </dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {content.factSheet.rockType}
                      </dd>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 rounded">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">
                        {level === 'elementary' ? '만들어진 시대' : '형성 지질시대 (GEOLOGICAL AGE)'}
                      </dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {content.factSheet.geologicalAge}
                      </dd>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 rounded">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">
                        {level === 'elementary' ? '지구 내부 환경' : '지구조 환경 (TECTONIC SETTING)'}
                      </dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {content.factSheet.tectonicSetting}
                      </dd>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 rounded">
                      <dt className="text-zinc-400 text-[10px] uppercase mb-0.5">
                        {level === 'elementary' ? '지형을 만든 힘' : '주요 작용력 (GEOMORPHIC AGENT)'}
                      </dt>
                      <dd className="font-serif text-white font-bold text-sm">
                        {content.factSheet.geomorphicAgent}
                      </dd>
                    </div>

                    {content.factSheet.scale && (
                      <div className="p-3 bg-white/5 border border-white/5 rounded flex items-center justify-between">
                        <span className="text-zinc-400 text-[10px] uppercase">
                          {level === 'elementary' ? '크기와 높이' : '지형 규모 (SCALE)'}:
                        </span>
                        <span className="text-[#FFCC00] font-mono font-bold text-xs">
                          {content.factSheet.scale}
                        </span>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
                  * 지구과학 교과서 및 국립 지질 도폭 공인 관측 데이터 기반
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: 현장·위성 탐방 가이드 (FIELD & SATELLITE)
           ======================================================== */}
        {activeTab === 'field' && (
          <div
            id="panel-field"
            role="tabpanel"
            aria-labelledby="tab-field"
            className="space-y-5 animate-in fade-in duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Field Observation & Ethics */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-[#0b0b10] p-5 sm:p-6 border border-white/10 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/10">
                    <Compass className="w-5 h-5 text-[#FFCC00]" />
                    <div>
                      <h4 className="font-serif font-black text-white text-base">
                        {level === 'elementary' ? '현장 탐험 시 관찰 포인트' : '현장 탐험 시 핵심 관찰 포인트'}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">FIELD OBSERVATION CHECKPOINTS</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 font-serif">
                    {content.fieldNotes.observationPoints.map((pt, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded text-xs sm:text-sm text-zinc-200 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-bold text-[#FFCC00] shrink-0 mt-0.5">
                          0{i + 1}.
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Season & Conservation */}
                <div className="bg-[#0b0b10] p-5 sm:p-6 border border-white/10 rounded-xl shadow-xl space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                    <Calendar className="w-5 h-5 text-[#FFCC00]" />
                    <h4 className="font-serif font-black text-white text-base">
                      탐방 추천 시기 및 자연 보전
                    </h4>
                  </div>

                  {content.fieldNotes.bestSeason && (
                    <div className="p-3 bg-white/5 border border-white/5 rounded text-xs sm:text-sm">
                      <span className="font-mono font-bold text-[#FFCC00] block mb-1 uppercase text-xs">
                        [최적 방문 시기]
                      </span>
                      <p className="text-zinc-200 leading-relaxed font-serif">
                        {content.fieldNotes.bestSeason}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-black/60 border border-white/10 rounded text-xs sm:text-sm">
                    <span className="font-mono font-bold text-[#FFCC00] flex items-center gap-1.5 mb-1 uppercase">
                      <AlertTriangle className="w-4 h-4 text-[#FFCC00]" />
                      <span>{level === 'elementary' ? '탐험 안전 및 보전 수칙' : '안전 유의사항 및 지형 보전'}</span>
                    </span>
                    <p className="text-zinc-200 leading-relaxed font-serif">
                      {content.fieldNotes.cautionNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Satellite Checkpoints & Direct Maps */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-[#0b0b10] p-5 sm:p-6 border border-white/10 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/10">
                    <Globe className="w-5 h-5 text-[#FFCC00]" />
                    <div>
                      <h4 className="font-serif font-black text-white text-base">
                        위성사진 판독 핵심 지표 3선
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">ORBITAL RECONNAISSANCE SIGNATURES</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 font-serif">
                    {content.fieldNotes.satellitePoints.map((chk, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded text-xs sm:text-sm text-zinc-200 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-bold text-black bg-[#FFCC00] w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Satellite Maps Direct Links */}
                <div className="bg-[#0b0b10] p-5 sm:p-6 border border-white/10 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/10">
                    <MapPin className="w-5 h-5 text-[#FFCC00]" />
                    <h4 className="font-serif font-black text-white text-base">
                      외부 고해상도 위성 지도 바로가기
                    </h4>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}&t=k`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-white/10 bg-white/5 hover:bg-[#FFCC00] hover:text-black rounded transition-colors font-bold text-zinc-200"
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
                      className="flex items-center justify-between p-3 border border-white/10 bg-white/5 hover:bg-[#FFCC00] hover:text-black rounded transition-colors font-bold text-zinc-200"
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
                        className="flex items-center justify-between p-3 border border-white/10 bg-white/5 hover:bg-[#FFCC00] hover:text-black rounded transition-colors font-bold text-zinc-200"
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
            TAB 4: 심층 리포트 전문 (FULL DOSSIER)
           ======================================================== */}
        {activeTab === 'archive' && (
          <div
            id="panel-archive"
            role="tabpanel"
            aria-labelledby="tab-archive"
            className="space-y-5 animate-in fade-in duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 bg-[#0b0b10] p-6 sm:p-8 border border-white/10 rounded-xl shadow-xl prose prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-[#FFCC00] max-w-none">
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10 not-prose text-white font-serif font-black text-lg">
                  <FileText className="w-5 h-5 text-[#FFCC00]" />
                  <span>심층 지형학적 형성 보고서 전문</span>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.description}</ReactMarkdown>
              </div>

              <div className="lg:col-span-4 space-y-5">
                {result.searchSources.length > 0 && (
                  <div className="bg-[#0b0b10] p-5 border border-white/10 rounded-xl shadow-xl">
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/10 font-serif font-bold text-white text-sm">
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

                <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-zinc-400 space-y-2">
                  <p className="font-bold text-white uppercase text-[#FFCC00]">학습 활용 안내</p>
                  <p className="leading-relaxed">
                    상단 난이도 스위처(초등/중등/고등/일반)를 통해 교과서 단계별 핵심 개념을 학습하고, 본 전문 보고서를 통해 심화 지식을 확장할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            3. Bottom Slide Quick Jump Navigation Bar
           ======================================================== */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateSlide(1)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-[#FFCC00] hover:text-black rounded text-xs font-bold text-zinc-200 transition-all cursor-pointer border border-white/15"
            >
              <MapPin className="w-4 h-4 text-[#FFCC00]" />
              <span>CH.02 위성 지도로</span>
            </button>
            <button
              onClick={() => onNavigateSlide(2)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-[#FFCC00] hover:text-black rounded text-xs font-bold text-zinc-200 transition-all cursor-pointer border border-white/15"
            >
              <Box className="w-4 h-4 text-[#FFCC00]" />
              <span>CH.03 3D 디오라마로</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateSlide(0)}
            className="flex items-center gap-2 px-5 py-2 bg-[#FFCC00] text-black hover:bg-amber-400 rounded font-black text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>CH.01 홈으로 돌아가기</span>
          </button>
        </div>
      </div>
    </section>
  );
};
