import React, { useState, useEffect, useRef } from 'react';
import { TERRAIN_CATEGORIES } from './constants/terrains';
import { Region, PlaceInfo } from './types';
import { useTerrainSearch } from './hooks/useTerrainSearch';
import { Navigation } from './components/Navigation';
import { HeroSlideshow } from './components/HeroSlideshow';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ErrorMessage } from './components/ErrorMessage';
import { SlideNavigationDock } from './components/SlideNavigationDock';
import { GoogleMapSlide } from './components/slides/GoogleMapSlide';
import { Terrain3DSlide } from './components/slides/Terrain3DSlide';
import { GeologicalGuideSlide } from './components/slides/GeologicalGuideSlide';
import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [region, setRegion] = useState<Region>('world');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>('화산');
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('volcanic');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const { loading, result, error, searchTerrain, selectPlace } = useTerrainSearch();

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  // 1. Initialize with flagship place (e.g. 하와이 킬라우에아 화산) on initial load
  useEffect(() => {
    searchTerrain('화산', 'world', 'volcanic', 'volcano-wd-1');
  }, []);

  // 2. Auto-play hero slideshow when on page 1 and not actively searching
  useEffect(() => {
    if (!isAutoPlaying || loading || activeSlideIndex !== 0) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TERRAIN_CATEGORIES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, loading, activeSlideIndex]);

  // 3. Scroll tracking using IntersectionObserver to update activeSlideIndex
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-slide-index');
            if (indexStr !== null) {
              setActiveSlideIndex(Number(indexStr));
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55,
      }
    );

    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [result]);

  // 4. Smooth slide transition handler
  const scrollToSlide = (index: number) => {
    const target = slideRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExplore = async (terrain: string, categoryId: string) => {
    setSelectedTerrain(terrain);
    setCurrentCategoryId(categoryId);
    setIsAutoPlaying(false);

    await searchTerrain(terrain, region, categoryId);

    // Smoothly scroll down to Page 2 (Google Map)
    setTimeout(() => {
      scrollToSlide(1);
    }, 200);
  };

  const handleRegionChange = async (newRegion: Region) => {
    setRegion(newRegion);
    const targetTerrain = selectedTerrain || '순상화산';
    const targetCategory = currentCategoryId || 'volcanic';
    await searchTerrain(targetTerrain, newRegion, targetCategory);
  };

  const handleSelectAlternativePlace = (place: PlaceInfo) => {
    if (!result) return;
    const allCandidates = [
      ...(result.placeInfo ? [result.placeInfo] : []),
      ...(result.alternativePlaces || []),
    ];
    selectPlace(place, result.categoryId, allCandidates);
  };

  const handleReset = () => {
    scrollToSlide(0);
    setIsAutoPlaying(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-[#FFCC00] selection:text-black">
      {/* Global Loading Overlay */}
      <LoadingOverlay loading={loading} region={region} selectedTerrain={selectedTerrain} />

      {/* Global Fixed Top Navigation */}
      <Navigation region={region} setRegion={handleRegionChange} onReset={handleReset} />

      {/* Global Fixed Right Floating Slide Dock */}
      <SlideNavigationDock
        activeSlideIndex={activeSlideIndex}
        onNavigate={scrollToSlide}
      />

      {/* Error Message Toast */}
      <ErrorMessage error={error} />

      {/* ========================================================
          Main Full-Page Scroll-Snap Container (4 Distinct Slides)
         ======================================================== */}
      <main
        ref={containerRef}
        className="w-full h-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar"
        tabIndex={0}
      >
        {/* ========================================================
            SLIDE 01: 메인 화면 (HERO SLIDESHOW)
           ======================================================== */}
        <section
          id="section-main"
          data-slide-index="0"
          ref={(el) => { slideRefs.current[0] = el; }}
          className="h-screen w-full snap-start snap-always relative overflow-hidden"
          aria-label="01 메인 화면"
        >
          <HeroSlideshow
            categories={TERRAIN_CATEGORIES}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            onExplore={handleExplore}
            onScrollNext={() => scrollToSlide(1)}
          />
        </section>

        {/* ========================================================
            SLIDE 02: 구글 위성지도 (100vh FULLSCREEN MAP)
           ======================================================== */}
        <section
          id="section-map"
          data-slide-index="1"
          ref={(el) => { slideRefs.current[1] = el; }}
          className="h-screen w-full snap-start snap-always relative overflow-hidden"
          aria-label="02 구글 위성지도"
        >
          {result ? (
            <GoogleMapSlide
              result={result}
              region={region}
              selectedTerrain={selectedTerrain}
              onSelectAlternativePlace={handleSelectAlternativePlace}
              onScrollNext={() => scrollToSlide(2)}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
              <Compass className="w-12 h-12 text-[#FFCC00] animate-spin mb-4" />
              <h3 className="text-xl font-bold font-serif mb-2">지형 탐색 데이터를 불러오는 중...</h3>
              <p className="text-sm text-slate-400">잠시 후 대형 위성 지도가 표시됩니다.</p>
            </div>
          )}
        </section>

        {/* ========================================================
            SLIDE 03: 3D 입체 지형 (100vh 3D DIORAMA STUDIO)
           ======================================================== */}
        <section
          id="section-3d"
          data-slide-index="2"
          ref={(el) => { slideRefs.current[2] = el; }}
          className="h-screen w-full snap-start snap-always relative overflow-hidden"
          aria-label="03 3D 입체 지형"
        >
          {result ? (
            <Terrain3DSlide
              result={result}
              region={region}
              selectedTerrain={selectedTerrain}
              onSelectAlternativePlace={handleSelectAlternativePlace}
              onScrollNext={() => scrollToSlide(3)}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#07070a] p-6 text-center">
              <Sparkles className="w-12 h-12 text-[#FFCC00] animate-pulse mb-4" />
              <h3 className="text-xl font-bold font-serif mb-2">3D 지형 디오라마 준비 중...</h3>
              <p className="text-sm text-slate-400">자연 지형 시뮬레이션을 생성하고 있습니다.</p>
            </div>
          )}
        </section>

        {/* ========================================================
            SLIDE 04: 상세 지형 해설 (GEOLOGICAL GUIDE & CONTENT)
           ======================================================== */}
        <section
          id="section-guide"
          data-slide-index="3"
          ref={(el) => { slideRefs.current[3] = el; }}
          className="h-screen w-full snap-start snap-always relative overflow-hidden"
          aria-label="04 상세 지형 해설"
        >
          {result ? (
            <GeologicalGuideSlide
              result={result}
              region={region}
              selectedTerrain={selectedTerrain}
              onNavigateSlide={scrollToSlide}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#0a0a0c] p-6 text-center">
              <h3 className="text-xl font-bold font-serif mb-2">지형 해설을 준비하는 중...</h3>
              <p className="text-sm text-slate-400">지구과학적 형성 단계 데이터를 불러오고 있습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
