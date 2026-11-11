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
  Plus,
  Check,
} from 'lucide-react';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../../types';
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
  onAddSpecimen?: (place: PlaceInfo) => void;
  isCollected?: boolean;
}

type TabKey = 'evolution' | 'concepts' | 'field' | 'archive';

export const GeologicalGuideSlide: React.FC<GeologicalGuideSlideProps> = ({
  result,
  region,
  selectedTerrain,
  onNavigateSlide,
  onAddSpecimen,
  isCollected = false,
}) => {
  const [level, setLevel] = useState<EducationLevel>('high');
  const [activeTab, setActiveTab] = useState<TabKey>('evolution');
  const [expandedBlade, setExpandedBlade] = useState<number>(0);

  const { placeInfo } = result;

  if (!placeInfo) {
    return (
      <section
        id="section-guide"
        className="h-full w-full relative overflow-y-auto bg-[#08080A] text-zinc-100 p-8 flex items-center justify-center font-mono"
      >
        <p className="text-zinc-400">[ GEOLOGICAL DOSSIER LOADING... ]</p>
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
      className="h-full w-full relative overflow-y-auto bg-[#08080A] text-zinc-100 selection:bg-[#FFCC00] selection:text-black pt-4 sm:pt-6 pb-28 no-scrollbar"
      aria-label="04 상세 지형 해설"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-5">
        {/* ========================================================
            1. Level Switcher Bar & Technical Publication Header
           ======================================================== */}
        <div className="bg-[#131418] hairline-border p-5 sm:p-6 shadow-2xl corner-ticks">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 hairline-border-b">
            {/* Left: Location & Terrain Breadcrumb */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#FFCC00] uppercase mb-1">
                <span className="bg-[#1F34FF] text-white px-1.5 py-0.5 text-[10px] font-black font-mono">
                  ACT 04
                </span>
                <span>[ GEOLOGICAL INVESTIGATION ]</span>
                <span className="text-white/30">·</span>
                <span className="text-zinc-300">
                  {region === 'world' ? 'GLOBAL ARCHIVE' : 'KOREA ARCHIVE'}
                </span>
                <span className="text-white/30">·</span>
                <span className="text-white">{selectedTerrain || placeInfo.terrain}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black text-white tracking-tighter uppercase">
                {placeInfo.placeName}
                <span className="text-sm sm:text-base font-mono font-normal text-zinc-400 ml-3">
                  [ {placeInfo.countryOrArea} ]
                </span>
              </h1>
            </div>

            {/* Right: Specimen Action Button & Education Level Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {onAddSpecimen && (
                <button
                  onClick={() => onAddSpecimen(placeInfo)}
                  className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer hairline-border corner-ticks ${
                    isCollected
                      ? 'bg-[#1F34FF] text-white border-[#1F34FF]'
                      : 'bg-black text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black'
                  }`}
                >
                  {isCollected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>[ 수집 완료 ]</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>[ + 표본 수집 ]</span>
                    </>
                  )}
                </button>
              )}

              <div
                role="group"
                aria-label="해설 수준 선택"
                className="grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-black hairline-border"
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
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFCC00] text-black font-black'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                      title={lvl.subLabel}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-black' : 'text-[#FFCC00]'
                        }`}
                      />
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
                <span className="inline-block px-2 py-0.5 text-[11px] font-mono font-bold bg-white/5 hairline-border text-[#FFCC00]">
                  {content.badge}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {content.coreQuestionOrTopic.label}:{' '}
                  <strong className="text-zinc-200">
                    {content.coreQuestionOrTopic.text}
                  </strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                "{content.headline}"
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-serif">
                {content.summary}
              </p>
            </div>

            {/* Quick Spec Badge */}
            {content.factSheet.scale && (
              <div className="shrink-0 p-3 bg-black hairline-border text-right hidden lg:block">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                  [ SCALE // 지형 규모 ]
                </span>
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
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-[#131418] hairline-border corner-ticks"
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
                className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-mono tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFCC00] text-black font-black shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-black' : 'text-[#FFCC00]'
                  }`}
                />
                <span className="hidden sm:inline font-bold">[ {tab.label} ]</span>
                <span className="inline sm:hidden font-bold">[ {tab.shortLabel} ]</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: 4단 아코디언 블레이드 (4-BLADE ACCORDION BLADE)
           ======================================================== */}
        {activeTab === 'evolution' && (
          <div
            id="panel-evolution"
            role="tabpanel"
            aria-labelledby="tab-evolution"
            className="space-y-4"
          >
            <div className="bg-[#131418] p-5 sm:p-7 hairline-border shadow-2xl corner-ticks">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 hairline-border-b gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 hairline-border bg-black flex items-center justify-center text-[#FFCC00]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-white text-lg tracking-tight uppercase">
                      {placeInfo.placeName} 4단 아코디언 지형 진화 블레이드
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      [ CHRONOLOGICAL 4-BLADE KINETIC ACCORDION // 클릭하거나 마우스를 올려 단계를 확장하세요 ]
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#96D0FF] font-bold self-start sm:self-auto bg-black px-2.5 py-1 hairline-border">
                  {content.badge}
                </span>
              </div>

              {/* 4-Blade Accordion Container */}
              <div className="flex flex-col lg:flex-row gap-3 min-h-[380px] w-full">
                {content.stages.map((stage, idx) => {
                  const isExpanded = expandedBlade === idx;
                  return (
                    <div
                      key={stage.stageNumber}
                      onMouseEnter={() => setExpandedBlade(idx)}
                      onClick={() => setExpandedBlade(idx)}
                      className={`hairline-border p-5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden group corner-ticks ${
                        isExpanded
                          ? 'lg:flex-[2.8] bg-[#08080A] border-[#FFCC00]'
                          : 'lg:flex-1 bg-black/60 hover:bg-[#08080A]/80 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* Top Header */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-3 border-b border-white/10 pb-2">
                          <span
                            className={`px-2 py-0.5 font-mono text-[11px] font-black uppercase ${
                              isExpanded
                                ? 'bg-[#FFCC00] text-black'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            PHASE 0{stage.stageNumber}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {stage.timeframe}
                          </span>
                        </div>

                        {/* Stage Title */}
                        <h4
                          className={`font-sans font-black text-base sm:text-lg mb-2 uppercase tracking-tight transition-colors ${
                            isExpanded ? 'text-white' : 'text-zinc-300'
                          }`}
                        >
                          {stage.title}
                        </h4>

                        {/* Detailed Description */}
                        <p
                          className={`text-xs sm:text-sm font-serif leading-relaxed ${
                            isExpanded
                              ? 'text-zinc-200 line-clamp-none'
                              : 'text-zinc-400 line-clamp-3 lg:line-clamp-6'
                          }`}
                        >
                          {stage.process}
                        </p>
                      </div>

                      {/* Mechanism Tag & Giant Stage Number Watermark */}
                      <div className="mt-4 pt-3 hairline-border-t flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-mono text-[#96D0FF] font-semibold truncate block max-w-[200px]">
                          // {stage.visualKeyFeature}
                        </span>
                        <span className="text-xs font-mono text-zinc-500 font-bold">
                          [0{stage.stageNumber}]
                        </span>
                      </div>

                      {/* Giant Background Watermark Number */}
                      <div className="absolute -bottom-6 -right-2 text-7xl font-sans font-black text-white/[0.03] pointer-events-none select-none">
                        0{stage.stageNumber}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: 핵심 개념 & 지질 팩트 (CONCEPTS & FACTSHEET)
           ======================================================== */}
        {activeTab === 'concepts' && (
          <div
            id="panel-concepts"
            role="tabpanel"
            aria-labelledby="tab-concepts"
            className="space-y-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Core Concepts */}
              <div className="lg:col-span-7 bg-[#131418] p-5 sm:p-6 hairline-border shadow-2xl corner-ticks space-y-4">
                <div className="flex items-center gap-2.5 pb-3 hairline-border-b">
                  <Layers className="w-5 h-5 text-[#FFCC00]" />
                  <div>
                    <h4 className="font-sans font-black text-white text-base tracking-tight uppercase">
                      {level === 'elementary'
                        ? '꼭 알아야 할 3가지 지형 비밀'
                        : '핵심 지형학적 개념 3선 (KEY CONCEPTS)'}
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono">
                      [ CURATED SCIENTIFIC PRINCIPLES ]
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {content.coreConcepts.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#08080A] hairline-border space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-black bg-[#FFCC00] px-1.5 py-0.2">
                          0{idx + 1}
                        </span>
                        <h5 className="font-sans font-bold text-white text-sm">
                          {item.term}
                        </h5>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 font-serif leading-relaxed pl-6">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Specimen Factsheet */}
              <div className="lg:col-span-5 bg-[#131418] p-5 sm:p-6 hairline-border shadow-2xl corner-ticks space-y-4">
                <div className="flex items-center gap-2.5 pb-3 hairline-border-b">
                  <CheckCircle2 className="w-5 h-5 text-[#1F34FF]" />
                  <div>
                    <h4 className="font-sans font-black text-white text-base tracking-tight uppercase">
                      지질 프로필 팩트시트
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono">
                      [ SPECIMEN GEOLOGICAL FACTSHEET ]
                    </p>
                  </div>
                </div>

                <dl className="space-y-2.5 text-xs font-mono">
                  <div className="p-3 bg-[#08080A] hairline-border flex items-center justify-between">
                    <dt className="text-zinc-500 uppercase">[ (a) 지질 시대 ]</dt>
                    <dd className="font-sans text-white font-bold text-sm">
                      {content.factSheet.geologicalAge}
                    </dd>
                  </div>
                  <div className="p-3 bg-[#08080A] hairline-border flex items-center justify-between">
                    <dt className="text-zinc-500 uppercase">[ (b) 암석 분류 ]</dt>
                    <dd className="font-sans text-white font-bold text-sm">
                      {content.factSheet.rockType}
                    </dd>
                  </div>
                  <div className="p-3 bg-[#08080A] hairline-border flex items-center justify-between">
                    <dt className="text-zinc-500 uppercase">[ (c) 지체 구조 ]</dt>
                    <dd className="font-sans text-white font-bold text-sm truncate max-w-[180px]">
                      {content.factSheet.tectonicSetting}
                    </dd>
                  </div>
                  <div className="p-3 bg-[#08080A] hairline-border flex items-center justify-between">
                    <dt className="text-zinc-500 uppercase">[ (d) 형성 인자 ]</dt>
                    <dd className="font-sans text-white font-bold text-sm truncate max-w-[180px]">
                      {content.factSheet.geomorphicAgent}
                    </dd>
                  </div>
                </dl>
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
            className="space-y-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Field Points */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-[#131418] p-5 sm:p-6 hairline-border shadow-2xl corner-ticks">
                  <div className="flex items-center gap-2.5 pb-3 mb-4 hairline-border-b">
                    <Compass className="w-5 h-5 text-[#FFCC00]" />
                    <div>
                      <h4 className="font-sans font-black text-white text-base tracking-tight uppercase">
                        현장 탐험 시 핵심 관찰 포인트
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        [ FIELD OBSERVATION CHECKPOINTS ]
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 font-serif">
                    {content.fieldNotes.observationPoints.map((pt, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 bg-[#08080A] hairline-border text-xs sm:text-sm text-zinc-200 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-bold text-[#FFCC00] shrink-0 mt-0.5">
                          [0{i + 1}]
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Satellite Checkpoints */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-[#131418] p-5 sm:p-6 hairline-border shadow-2xl corner-ticks">
                  <div className="flex items-center gap-2.5 pb-3 mb-4 hairline-border-b">
                    <Globe className="w-5 h-5 text-[#1F34FF]" />
                    <div>
                      <h4 className="font-sans font-black text-white text-base tracking-tight uppercase">
                        위성사진 판독 핵심 지표 3선
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        [ ORBITAL RECONNAISSANCE SIGNATURES ]
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 font-serif">
                    {content.fieldNotes.satellitePoints.map((chk, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 bg-[#08080A] hairline-border text-xs sm:text-sm text-zinc-200 leading-relaxed"
                      >
                        <span className="font-mono text-xs font-bold text-white bg-[#1F34FF] px-1.5 py-0.5 shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
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
            className="space-y-5"
          >
            <div className="bg-[#131418] p-6 sm:p-8 hairline-border shadow-2xl corner-ticks prose prose-invert prose-headings:font-sans prose-headings:font-black prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-[#FFCC00] max-w-none">
              <div className="flex items-center gap-3 pb-3 mb-4 hairline-border-b not-prose text-white font-sans font-black text-lg uppercase">
                <FileText className="w-5 h-5 text-[#FFCC00]" />
                <span>심층 지형학적 형성 보고서 전문 [ FULL ARCHIVE ]</span>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result.description}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* ========================================================
            3. Bottom Slide Quick Jump Navigation Bar
           ======================================================== */}
        <div className="pt-6 hairline-border-t flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateSlide(1)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131418] hover:bg-[#1F34FF] text-white text-xs font-bold transition-all cursor-pointer hairline-border corner-ticks"
            >
              <MapPin className="w-4 h-4 text-[#96D0FF]" />
              <span>[ CH.02 위성 텔레메트리 ]</span>
            </button>
            <button
              onClick={() => onNavigateSlide(2)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131418] hover:bg-[#1F34FF] text-white text-xs font-bold transition-all cursor-pointer hairline-border corner-ticks"
            >
              <Box className="w-4 h-4 text-[#96D0FF]" />
              <span>[ CH.03 3D 디오라마 ]</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateSlide(0)}
            className="flex items-center gap-2 px-5 py-2 bg-[#FFCC00] text-black hover:bg-amber-400 font-mono font-black text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>[ ACT 01 홈으로 돌아가기 ]</span>
          </button>
        </div>
      </div>
    </section>
  );
};
