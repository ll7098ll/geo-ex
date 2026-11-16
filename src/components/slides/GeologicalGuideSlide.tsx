import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MapPin, ArrowUp, Box } from 'lucide-react';
import { SearchResult as SearchResultType, Region, PlaceInfo } from '../../types';
import { TERRAIN_CATEGORIES } from '../../constants/terrains';
import { PLACE_IMAGES } from '../../constants/placeImages';
import { EducationLevel, getLevelContent } from '../../utils/educationLevelHelper';
import { DARK_GUIDE_THEME, PAPER_GUIDE_THEME } from './guide/guideTheme';
import { GuideStickyBar } from './guide/GuideStickyBar';
import { GuideTimelineSection } from './guide/GuideTimelineSection';
import { GuideFieldDossier } from './guide/GuideFieldDossier';

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
  const dossierRef = useRef<HTMLElement>(null);

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

  const content = useMemo(
    () => (placeInfo ? getLevelContent(placeInfo, level) : null),
    [placeInfo, level]
  );

  if (!placeInfo || !content) {
    return (
      <div className="h-full w-full relative overflow-hidden bg-[#0A0A0C] text-zinc-100 p-8 flex items-center justify-center font-serif">
        <p className="text-zinc-400">지형 매거진 기사를 불러오는 중입니다...</p>
      </div>
    );
  }

  const category = TERRAIN_CATEGORIES.find((c) => c.id === result.categoryId);
  const displayImageUrl = (!imgError && placeImageEntry?.url) || category?.image || '';
  const theme = isPaperMode ? PAPER_GUIDE_THEME : DARK_GUIDE_THEME;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress(Math.min(1, Math.max(0, el.scrollTop / maxScroll)));
  };

  const handleJumpToSection = (section: 'intro' | 'timeline' | 'essay' | 'dossier') => {
    const targetMap = {
      intro: introRef,
      timeline: timelineRef,
      essay: essayRef,
      dossier: dossierRef,
    };
    setCanScrollInternal(true);
    requestAnimationFrame(() => {
      targetMap[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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

      {/* 1. Sticky Minimal Magazine Reader Bar */}
      <GuideStickyBar
        placeInfo={placeInfo}
        level={level}
        onLevelChange={setLevel}
        isPaperMode={isPaperMode}
        onTogglePaperMode={() => setIsPaperMode((prev) => !prev)}
        isCollected={isCollected}
        onAddSpecimen={onAddSpecimen}
        onJumpToSection={handleJumpToSection}
        theme={theme}
      />

      {/* 2. Magazine Cover & Feature Opening Spread */}
      <article className="max-w-6xl mx-auto px-5 sm:px-10 pt-10 sm:pt-14 space-y-14 sm:space-y-16">
        <header ref={introRef} className="scroll-mt-20 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-sans font-bold tracking-[0.18em] uppercase">
              <span className="inline-block w-2 h-5 bg-[#FFCC00]" />
              <span className={isPaperMode ? 'text-[#181715]' : 'text-[#FFCC00]'}>
                FEATURE STORY
              </span>
              <span className={theme.subtle}>·</span>
              <span className={theme.subtle}>{category?.name || '지형 아카이브'}</span>
              <span className={theme.subtle}>·</span>
              <span className={theme.subtle}>{region === 'world' ? 'WORLD' : 'KOREA'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.12]">
              {placeInfo.placeName}
            </h1>

            <p className={`text-lg sm:text-xl lg:text-2xl font-serif leading-relaxed max-w-4xl ${theme.muted}`}>
              {content.headline}
            </p>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-2">
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

            <div className={displayImageUrl ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
              <div className="flex items-center gap-2 text-xs font-sans font-bold">
                <span className="px-2 py-0.5 bg-[#FFCC00] text-black">{content.badge}</span>
                <span className={theme.subtle}>에디토리얼 요약</span>
              </div>

              <p
                className={`text-base sm:text-lg font-serif leading-[1.9] ${theme.dropCap} ${
                  isPaperMode ? 'text-[#24221F]' : 'text-[#EAE6DF]'
                }`}
              >
                {content.summary}
              </p>

              <blockquote
                className={`magazine-pullquote border-l-[3px] border-[#FFCC00] pl-5 space-y-1.5 ${theme.surface} pr-5 py-4`}
              >
                <span className="text-[11px] font-sans font-bold tracking-wider uppercase text-[#FFCC00] bg-black/80 inline-block px-2 py-0.5">
                  {content.coreQuestionOrTopic.label}
                </span>
                <p className="text-base sm:text-lg font-serif font-semibold leading-relaxed">
                  {content.coreQuestionOrTopic.text}
                </p>
              </blockquote>
            </div>
          </div>
        </header>

        {/* 3. PART I: 4단계 지형 형성 연대기 */}
        <GuideTimelineSection
          sectionRef={timelineRef}
          stages={content.stages}
          expandedStage={expandedStage}
          onSelectStage={setExpandedStage}
          isPaperMode={isPaperMode}
          theme={theme}
        />

        {/* 4. PART II: 12-Column Editorial Spread (Essay + Field Dossier) */}
        <section className={`pt-10 border-t ${theme.border} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start`}>
          <div ref={essayRef} className="lg:col-span-7 scroll-mt-20 space-y-12">
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
                      <h3 className="font-serif font-bold text-base sm:text-lg">{item.term}</h3>
                      <p className={`text-sm font-serif leading-[1.85] ${theme.muted}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

          <GuideFieldDossier dossierRef={dossierRef} content={content} theme={theme} />
        </section>

        {/* 5. Editorial Footer Navigation */}
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
