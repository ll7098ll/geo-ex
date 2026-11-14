import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Compass,
  Layers,
  MapPin,
  Globe,
  ArrowUp,
  Box,
  Plus,
  Check,
  Sun,
  Moon,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../../types';
import { TERRAIN_CATEGORIES } from '../../constants/terrains';
import { PLACE_IMAGES } from '../../constants/placeImages';
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
  isActive?: boolean;
}

export const GeologicalGuideSlide: React.FC<GeologicalGuideSlideProps> = ({
  result,
  region,
  selectedTerrain,
  onNavigateSlide,
  onAddSpecimen,
  isCollected = false,
  isActive = false,
}) => {
  const [level, setLevel] = useState<EducationLevel>('high');
  const [expandedStage, setExpandedStage] = useState<number>(0);
  const [isPaperMode, setIsPaperMode] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [imgError, setImgError] = useState<boolean>(false);
  const [canScrollInternal, setCanScrollInternal] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const essayRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);

  const { placeInfo } = result;
  const placeImageEntry = placeInfo ? PLACE_IMAGES[placeInfo.id] : undefined;

  const resetToTop = () => {
    const el = sectionRef.current;
    if (el) {
      el.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      el.scrollTop = 0;
    }
    setScrollProgress(0);
  };

  useEffect(() => {
    setImgError(false);
    setExpandedStage(0);
    resetToTop();
  }, [placeInfo?.id]);

  useEffect(() => {
    if (!isActive) {
      setCanScrollInternal(false);
      resetToTop();
      return;
    }

    resetToTop();
    const rafId = requestAnimationFrame(() => {
      resetToTop();
    });
    const timerId = setTimeout(() => {
      resetToTop();
      setCanScrollInternal(true);
    }, 260);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [isActive]);

  if (!placeInfo) {
    return (
      <div className="h-full w-full relative overflow-hidden bg-[#0A0A0C] text-zinc-100 p-8 flex items-center justify-center font-serif">
        <p className="text-zinc-400">지형 매거진 기사를 불러오는 중입니다...</p>
      </div>
    );
  }

  const content = getLevelContent(placeInfo, level);
  const category = TERRAIN_CATEGORIES.find((c) => c.id === result.categoryId);
  const displayImageUrl =
    (!imgError && placeImageEntry?.url) || category?.image || '';

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress(Math.min(1, Math.max(0, el.scrollTop / maxScroll)));
  };

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    setCanScrollInternal(true);
    requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  // Theme tokens: Dark Editorial vs Warm Print Paper
  const theme = isPaperMode
    ? {
        bg: 'bg-[#F6F3EC]',
        text: 'text-[#181715]',
        muted: 'text-[#5C5852]',
        subtle: 'text-[#7A746B]',
        surface: 'bg-[#EDE8DD]',
        card: 'bg-[#FAF8F3]',
        border: 'border-[#181715]/12',
        stickyBg: 'bg-[#F6F3EC]/92',
        dropCap: 'magazine-drop-cap-paper',
        prose:
          'prose prose-stone prose-headings:font-serif prose-headings:font-black prose-headings:text-[#181715] prose-p:text-[#2A2825] prose-p:font-serif prose-p:leading-[1.9] prose-strong:text-[#181715] prose-li:text-[#2A2825] prose-li:font-serif prose-blockquote:border-l-[#FFCC00] prose-blockquote:text-[#181715]',
        levelIdle: 'text-[#5C5852] hover:text-[#181715]',
      }
    : {
        bg: 'bg-[#0A0A0C]',
        text: 'text-[#EDE9E0]',
        muted: 'text-zinc-300',
        subtle: 'text-zinc-400',
        surface: 'bg-[#121317]',
        card: 'bg-[#14151A]',
        border: 'border-white/10',
        stickyBg: 'bg-[#0A0A0C]/92',
        dropCap: 'magazine-drop-cap',
        prose:
          'prose prose-invert prose-headings:font-serif prose-headings:font-black prose-headings:text-white prose-p:text-[#DCD7CE] prose-p:font-serif prose-p:leading-[1.9] prose-strong:text-white prose-li:text-[#DCD7CE] prose-li:font-serif prose-blockquote:border-l-[#FFCC00] prose-blockquote:text-[#EDE9E0]',
        levelIdle: 'text-zinc-400 hover:text-white',
      };

  return (
    <div
      ref={sectionRef}
      onScroll={handleScroll}
      style={{ overflowAnchor: 'none' }}
      className={`h-full w-full relative ${
        canScrollInternal ? 'overflow-y-auto' : 'overflow-y-hidden'
      } transition-colors duration-500 ${theme.bg} ${theme.text} selection:bg-[#FFCC00] selection:text-black pb-24 no-scrollbar`}
    >
      {/* Top Reading Progress Bar */}
      <div className="sticky top-0 left-0 right-0 z-40 h-[2px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-[#FFCC00] transition-[width] duration-150 ease-out"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* ========================================================
          1. Sticky Minimal Magazine Reader Bar
         ======================================================== */}
      <div
        className={`sticky top-[2px] z-30 border-b ${theme.border} ${theme.stickyBg} backdrop-blur-md transition-colors duration-500`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Article Title & Section Anchors */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-4 bg-[#FFCC00] shrink-0" />
              <span className="font-serif font-bold text-xs sm:text-sm truncate">
                {placeInfo.placeName}
              </span>
            </div>

            <nav
              aria-label="기사 목차"
              className={`hidden md:flex items-center gap-3 text-xs font-sans border-l ${theme.border} pl-4 ${theme.subtle}`}
            >
              <button
                onClick={() => scrollToRef(introRef)}
                className="hover:text-[#FFCC00] transition-colors cursor-pointer"
              >
                서문
              </button>
              <button
                onClick={() => scrollToRef(timelineRef)}
                className="hover:text-[#FFCC00] transition-colors cursor-pointer"
              >
                형성과정
              </button>
              <button
                onClick={() => scrollToRef(essayRef)}
                className="hover:text-[#FFCC00] transition-colors cursor-pointer"
              >
                심층해설
              </button>
              <button
                onClick={() => scrollToRef(dossierRef)}
                className="hover:text-[#FFCC00] transition-colors cursor-pointer"
              >
                현장도감
              </button>
            </nav>
          </div>

          {/* Right: Reader Level Pill + Paper/Dark Mode + Collect */}
          <div className="flex items-center gap-2">
            {/* Level Switcher with Smooth Layout Pill */}
            <div
              role="group"
              aria-label="해설 수준 선택"
              className={`flex items-center p-0.5 border ${theme.border} ${theme.surface}`}
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
                    title={lvl.subLabel}
                    className={`relative flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-semibold transition-colors cursor-pointer ${
                      isSelected ? 'text-black font-bold' : theme.levelIdle
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="guide-level-pill"
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                        className="absolute inset-0 bg-[#FFCC00]"
                      />
                    )}
                    <Icon className="w-3 h-3 relative z-10 shrink-0" />
                    <span className="relative z-10">{lvl.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Paper / Dark Reading Theme Toggle */}
            <button
              onClick={() => setIsPaperMode((prev) => !prev)}
              title={isPaperMode ? '다크 에디토리얼 모드로 전환' : '페이퍼 매거진 모드로 전환'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 border ${theme.border} ${theme.surface} text-xs font-sans font-semibold hover:border-[#FFCC00] transition-colors cursor-pointer`}
            >
              {isPaperMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#181715]" />
                  <span className="hidden sm:inline">다크</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span className="hidden sm:inline">페이퍼</span>
                </>
              )}
            </button>

            {/* Specimen Collect Button */}
            {onAddSpecimen && (
              <button
                onClick={() => onAddSpecimen(placeInfo)}
                className={`px-3 py-1.5 text-xs font-sans font-bold transition-colors duration-200 flex items-center gap-1 cursor-pointer border ${
                  isCollected
                    ? 'bg-[#FFCC00] text-black border-[#FFCC00]'
                    : `${theme.surface} ${theme.border} hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00]`
                }`}
              >
                {isCollected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">수집됨</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-[#FFCC00]" />
                    <span className="hidden sm:inline">표본 수집</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          2. Magazine Cover & Feature Opening Spread
         ======================================================== */}
      <article className="max-w-6xl mx-auto px-5 sm:px-10 pt-10 sm:pt-14 space-y-14 sm:space-y-16">
        <header ref={introRef} className="scroll-mt-20 space-y-8">
          {/* Category Kicker */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-sans font-bold tracking-[0.18em] uppercase">
              <span className="inline-block w-2 h-5 bg-[#FFCC00]" />
              <span className={isPaperMode ? 'text-[#181715]' : 'text-[#FFCC00]'}>
                FEATURE STORY
              </span>
              <span className={theme.subtle}>·</span>
              <span className={theme.subtle}>
                {category?.name || '지형 아카이브'}
              </span>
              <span className={theme.subtle}>·</span>
              <span className={theme.subtle}>
                {region === 'world' ? 'WORLD' : 'KOREA'}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.12]">
              {placeInfo.placeName}
            </h1>

            {/* Editorial Standfirst / Deck */}
            <p className={`text-lg sm:text-xl lg:text-2xl font-serif leading-relaxed max-w-4xl ${theme.muted}`}>
              {content.headline}
            </p>
          </div>

          {/* Horizontal Byline & Metadata Rule */}
          <div
            className={`py-4 border-y ${theme.border} grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans`}
          >
            <div>
              <span className={`block text-[11px] mb-0.5 ${theme.subtle}`}>위치</span>
              <span className="font-bold">{placeInfo.countryOrArea}</span>
            </div>
            <div>
              <span className={`block text-[11px] mb-0.5 ${theme.subtle}`}>지형 분류</span>
              <span className="font-bold">{selectedTerrain || placeInfo.terrain}</span>
            </div>
            <div>
              <span className={`block text-[11px] mb-0.5 ${theme.subtle}`}>지질 시대</span>
              <span className="font-bold truncate block">{content.factSheet.geologicalAge}</span>
            </div>
            <div>
              <span className={`block text-[11px] mb-0.5 ${theme.subtle}`}>규모 · 수준</span>
              <span className="font-bold truncate block">
                {content.factSheet.scale || content.badge}
              </span>
            </div>
          </div>

          {/* 2-Column Opening Feature: Yellow-Framed Plate + Lead Essay with Drop Cap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-2">
            {/* Left: NatGeo Yellow-Framed Photo Plate */}
            {displayImageUrl && (
              <figure className="lg:col-span-5 space-y-3">
                <div className="magazine-frame overflow-hidden bg-black aspect-[4/3] relative group">
                  <img
                    src={displayImageUrl}
                    alt={`${placeInfo.placeName} - ${placeImageEntry?.title || category?.name || ''}`}
                    onError={() => {
                      if (!imgError) setImgError(true);
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                </div>
                <figcaption className={`text-xs font-serif leading-relaxed flex items-start gap-2 ${theme.subtle}`}>
                  <span className="font-sans font-bold text-[#FFCC00] bg-black px-1.5 py-0.5 text-[10px] shrink-0 mt-0.5">
                    FIG. 01
                  </span>
                  <span>
                    {placeInfo.placeName}({placeInfo.countryOrArea})의 실제 경관. &ldquo;{placeInfo.tagline}&rdquo;
                  </span>
                </figcaption>
              </figure>
            )}

            {/* Right: Opening Lead Essay & Pull Quote */}
            <div className={displayImageUrl ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
              <div className="flex items-center gap-2 text-xs font-sans font-bold">
                <span className="px-2 py-0.5 bg-[#FFCC00] text-black">
                  {content.badge}
                </span>
                <span className={theme.subtle}>에디토리얼 요약</span>
              </div>

              <p
                className={`text-base sm:text-lg font-serif leading-[1.9] ${theme.dropCap} ${
                  isPaperMode ? 'text-[#24221F]' : 'text-[#EAE6DF]'
                }`}
              >
                {content.summary}
              </p>

              {/* Pull Quote Callout */}
              <blockquote
                className={`magazine-pullquote border-l-[3px] border-[#FFCC00] pl-5 py-1.5 space-y-1.5 ${theme.surface} pr-5 py-4`}
              >
                <span className="block text-[11px] font-sans font-bold tracking-wider uppercase text-[#FFCC00] bg-black/80 inline-block px-2 py-0.5">
                  {content.coreQuestionOrTopic.label}
                </span>
                <p className="text-base sm:text-lg font-serif font-semibold leading-relaxed">
                  {content.coreQuestionOrTopic.text}
                </p>
              </blockquote>
            </div>
          </div>
        </header>

        {/* ========================================================
            3. PART I: 4단계 지형 형성 연대기 (Editorial Timeline Spread)
           ======================================================== */}
        <section ref={timelineRef} className={`scroll-mt-20 pt-10 border-t ${theme.border} space-y-6`}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#FFCC00] mb-1.5 flex items-center gap-2">
                <span className="inline-block w-4 h-[2px] bg-[#FFCC00]" />
                <span>PART I · CHRONOLOGY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
                지형이 완성되기까지의 4단계 연대기
              </h2>
            </div>
            <p className={`text-xs font-sans ${theme.subtle}`}>
              단계를 선택하면 형성 과정과 지형학적 특징을 자세히 볼 수 있습니다
            </p>
          </div>

          {/* Smooth Interactive 4-Column Editorial Spread */}
          <div className="flex flex-col lg:flex-row gap-3 w-full">
            {content.stages.map((stage, idx) => {
              const isExpanded = expandedStage === idx;
              return (
                <div
                  key={stage.stageNumber}
                  onMouseEnter={() => setExpandedStage(idx)}
                  onClick={() => setExpandedStage(idx)}
                  className={`border p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-[flex-grow,background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isExpanded
                      ? `lg:flex-[2.4] ${theme.card} border-[#FFCC00]`
                      : `lg:flex-1 ${theme.surface} ${theme.border} opacity-85 hover:opacity-100`
                  }`}
                >
                  <div>
                    <div className={`flex items-baseline justify-between gap-2 pb-3 mb-4 border-b ${theme.border}`}>
                      <span
                        className={`font-serif font-black text-2xl sm:text-3xl leading-none ${
                          isExpanded
                            ? 'text-[#FFCC00] bg-black px-2 py-1'
                            : theme.subtle
                        }`}
                      >
                        0{stage.stageNumber}
                      </span>
                      {stage.timeframe && (
                        <span className={`text-[11px] font-sans font-medium text-right ${theme.subtle}`}>
                          {stage.timeframe}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg mb-2.5 leading-snug">
                      {stage.title}
                    </h3>

                    <p
                      className={`font-serif text-sm leading-[1.8] transition-colors ${
                        isExpanded ? theme.muted : `${theme.subtle} line-clamp-3`
                      }`}
                    >
                      {stage.process}
                    </p>
                  </div>

                  <div className={`mt-5 pt-3 border-t ${theme.border} flex items-center justify-between gap-2`}>
                    <span className={`text-xs font-sans font-medium ${isExpanded ? (isPaperMode ? 'text-[#181715]' : 'text-[#FFCC00]') : theme.subtle}`}>
                      핵심 특징 · {stage.visualKeyFeature}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            4. PART II: 12-Column Editorial Spread (Essay + Field Dossier)
           ======================================================== */}
        <section className={`pt-10 border-t ${theme.border} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start`}>
          {/* Left / Main Column (7/12): Key Concepts & Full Essay */}
          <div ref={essayRef} className="lg:col-span-7 scroll-mt-20 space-y-12">
            {/* Key Concepts Glossary */}
            <div className="space-y-5">
              <div>
                <div className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#FFCC00] mb-1.5 flex items-center gap-2">
                  <span className="inline-block w-4 h-[2px] bg-[#FFCC00]" />
                  <span>PART II · KEY CONCEPTS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
                  {level === 'elementary'
                    ? '꼭 알아야 할 3가지 지형 비밀'
                    : '핵심 지형학 개념 3선'}
                </h2>
              </div>

              <div className={`divide-y ${theme.border} border-y ${theme.border}`}>
                {content.coreConcepts.map((item, idx) => (
                  <div key={idx} className="py-5 flex gap-4 sm:gap-5 items-start">
                    <span className="font-serif font-black text-xl text-[#FFCC00] bg-black px-2 py-0.5 shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-serif font-bold text-base sm:text-lg">
                        {item.term}
                      </h3>
                      <p className={`text-sm font-serif leading-[1.85] ${theme.muted}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Long-Form Article */}
            <div className="space-y-5">
              <div>
                <div className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#FFCC00] mb-1.5 flex items-center gap-2">
                  <span className="inline-block w-4 h-[2px] bg-[#FFCC00]" />
                  <span>PART III · IN-DEPTH REPORT</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
                  심층 지형학적 형성 해설
                </h2>
              </div>

              <div className={`${theme.prose} max-w-[68ch]`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Right / Sticky Sidebar Column (5/12): Field Specimen Dossier */}
          <aside ref={dossierRef} className="lg:col-span-5 scroll-mt-20 lg:sticky lg:top-20 space-y-6">
            {/* Geological Profile Fact Sheet */}
            <div className={`border ${theme.border} border-t-[3px] border-t-[#FFCC00] ${theme.card} p-6 space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <span className="text-[11px] font-sans font-bold uppercase tracking-[0.18em] text-[#FFCC00] bg-black px-2 py-0.5 inline-block mb-1.5">
                    FIELD DOSSIER
                  </span>
                  <h3 className="font-serif font-black text-lg">지질 프로필 팩트시트</h3>
                </div>
                <Layers className="w-5 h-5 text-[#FFCC00]" />
              </div>

              <dl className={`divide-y ${theme.border} text-xs sm:text-sm font-sans`}>
                <div className="py-2.5 flex items-baseline justify-between gap-4">
                  <dt className={`shrink-0 ${theme.subtle}`}>지질 시대</dt>
                  <dd className="font-semibold text-right">{content.factSheet.geologicalAge}</dd>
                </div>
                <div className="py-2.5 flex items-baseline justify-between gap-4">
                  <dt className={`shrink-0 ${theme.subtle}`}>암석 분류</dt>
                  <dd className="font-semibold text-right">{content.factSheet.rockType}</dd>
                </div>
                <div className="py-2.5 flex items-baseline justify-between gap-4">
                  <dt className={`shrink-0 ${theme.subtle}`}>지체 구조</dt>
                  <dd className="font-semibold text-right">{content.factSheet.tectonicSetting}</dd>
                </div>
                <div className="py-2.5 flex items-baseline justify-between gap-4">
                  <dt className={`shrink-0 ${theme.subtle}`}>형성 인자</dt>
                  <dd className="font-semibold text-right">{content.factSheet.geomorphicAgent}</dd>
                </div>
                {content.factSheet.scale && (
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <dt className={`shrink-0 ${theme.subtle}`}>대표 규모</dt>
                    <dd className="font-bold text-right">{content.factSheet.scale}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Field Observation Checkpoints */}
            <div className={`border ${theme.border} ${theme.card} p-6 space-y-4`}>
              <div className="flex items-center gap-2 pb-2.5 border-b border-current/10">
                <Compass className="w-4 h-4 text-[#FFCC00]" />
                <h3 className="font-serif font-bold text-base">현장 탐방 관찰 포인트</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm font-serif">
                {content.fieldNotes.observationPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 leading-relaxed">
                    <span className="font-mono text-[11px] font-bold bg-[#FFCC00] text-black px-1.5 py-0.5 shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <span className={theme.muted}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Satellite Photo Reading Tips */}
            <div className={`border ${theme.border} ${theme.card} p-6 space-y-4`}>
              <div className="flex items-center gap-2 pb-2.5 border-b border-current/10">
                <Globe className="w-4 h-4 text-[#FFCC00]" />
                <h3 className="font-serif font-bold text-base">위성사진 판독 핵심 지표</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm font-serif">
                {content.fieldNotes.satellitePoints.map((chk, i) => (
                  <li key={i} className="flex items-start gap-3 leading-relaxed">
                    <span className="font-mono text-[11px] font-bold bg-[#FFCC00] text-black px-1.5 py-0.5 shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <span className={theme.muted}>{chk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visiting Season & Conservation Notes */}
            {(content.fieldNotes.bestSeason || content.fieldNotes.cautionNote) && (
              <div className={`border ${theme.border} ${theme.surface} p-5 space-y-3 text-xs font-sans`}>
                {content.fieldNotes.bestSeason && (
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">추천 탐방 시기</span>
                      <span className={theme.muted}>{content.fieldNotes.bestSeason}</span>
                    </div>
                  </div>
                )}
                {content.fieldNotes.cautionNote && (
                  <div className={`flex items-start gap-2.5 pt-2.5 border-t ${theme.border}`}>
                    <ShieldAlert className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">지질 보존 및 안전 수칙</span>
                      <span className={theme.muted}>{content.fieldNotes.cautionNote}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </aside>
        </section>

        {/* ========================================================
            5. Editorial Footer Navigation
           ======================================================== */}
        <footer className={`pt-8 border-t ${theme.border} flex flex-wrap items-center justify-between gap-4 font-sans`}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateSlide(1)}
              className={`group flex items-center gap-2 px-4 py-2 border ${theme.border} ${theme.surface} hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] text-xs font-bold transition-colors duration-200 cursor-pointer`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors" />
              <span>구글 위성지도 다시 보기</span>
            </button>
            <button
              onClick={() => onNavigateSlide(2)}
              className={`group flex items-center gap-2 px-4 py-2 border ${theme.border} ${theme.surface} hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] text-xs font-bold transition-colors duration-200 cursor-pointer`}
            >
              <Box className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors" />
              <span>3D 입체 지형으로 돌아가기</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateSlide(0)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFCC00] text-black hover:bg-amber-400 font-sans font-bold text-xs tracking-wide transition-colors duration-200 shadow-lg cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>매거진 커버(첫 화면)로</span>
          </button>
        </footer>
      </article>
    </div>
  );
};
