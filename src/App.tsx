import React, { useState, useEffect, useRef } from 'react';
import { TERRAIN_CATEGORIES } from './constants/terrains';
import { getCategoryIdForPlace } from './constants/places';
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
import { FilmGrainOverlay } from './components/kinetic/FilmGrainOverlay';
import { SpecimenDrawer } from './components/kinetic/SpecimenDrawer';
import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [region, setRegion] = useState<Region>('world');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>('화산');
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('volcanic');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Specimen Bag State (Persisted in localStorage)
  const [specimens, setSpecimens] = useState<PlaceInfo[]>(() => {
    try {
      const saved = localStorage.getItem('geo_specimens_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { loading, result, error, searchTerrain, selectPlace } = useTerrainSearch();

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const activeSlideIndexRef = useRef(0);
  const scrollAnimRef = useRef<number | null>(null);

  const cancelScrollAnim = () => {
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.style.scrollSnapType = '';
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onUserInterrupt = () => cancelScrollAnim();
    container.addEventListener('wheel', onUserInterrupt, { passive: true });
    container.addEventListener('touchstart', onUserInterrupt, { passive: true });
    return () => {
      cancelScrollAnim();
      container.removeEventListener('wheel', onUserInterrupt);
      container.removeEventListener('touchstart', onUserInterrupt);
    };
  }, []);

  // Sync specimens to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('geo_specimens_v1', JSON.stringify(specimens));
    } catch {
      // storage unavailable
    }
  }, [specimens]);

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

  // 3. Scroll tracking using IntersectionObserver to update activeSlideIndex cleanly
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-slide-index');
            if (indexStr !== null) {
              const newIndex = Number(indexStr);
              activeSlideIndexRef.current = newIndex;
              setActiveSlideIndex(newIndex);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55,
      }
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 4. Smooth slide transition handler (suspends CSS scroll-snap while animating so jumps never stall)
  const scrollToSlide = (index: number) => {
    const container = containerRef.current;
    const target = slideRefs.current[index];
    if (!container || !target) return;

    cancelScrollAnim();

    const startTop = container.scrollTop;
    const targetTop = target.offsetTop;
    const delta = targetTop - startTop;
    if (Math.abs(delta) < 1) {
      container.scrollTop = targetTop;
      return;
    }

    container.style.scrollSnapType = 'none';
    const duration = Math.min(680, Math.max(380, Math.abs(delta) * 0.42));
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      container.scrollTop = startTop + delta * eased;

      if (t < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        container.scrollTop = targetTop;
        container.style.scrollSnapType = '';
        scrollAnimRef.current = null;
      }
    };

    scrollAnimRef.current = requestAnimationFrame(step);
  };

  const handleExplore = async (terrain: string, categoryId: string) => {
    setSelectedTerrain(terrain);
    setCurrentCategoryId(categoryId);
    setIsAutoPlaying(false);

    await searchTerrain(terrain, region, categoryId);

    requestAnimationFrame(() => {
      scrollToSlide(1);
    });
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

  // Specimen Bag Handlers
  const handleAddSpecimen = (place: PlaceInfo) => {
    setSpecimens((prev) => {
      const exists = prev.some((p) => p.placeName === place.placeName);
      if (exists) {
        return prev.filter((p) => p.placeName !== place.placeName);
      }
      return [place, ...prev];
    });
  };

  const handleRemoveSpecimen = (placeName: string) => {
    setSpecimens((prev) => prev.filter((p) => p.placeName !== placeName));
  };

  const handleClearSpecimens = () => {
    setSpecimens([]);
  };

  const handleSelectSpecimen = async (specimen: PlaceInfo) => {
    const targetCategory = getCategoryIdForPlace(specimen);
    setRegion(specimen.region);
    setCurrentCategoryId(targetCategory);
    setSelectedTerrain(specimen.terrain);
    await searchTerrain(specimen.terrain, specimen.region, targetCategory, specimen.id);
    scrollToSlide(2); // Jump directly to 3D Diorama
  };

  const isCurrentCollected = Boolean(
    result?.placeInfo &&
      specimens.some((s) => s.placeName === result.placeInfo?.placeName)
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#08080A] text-white font-sans selection:bg-[#FFCC00] selection:text-black flex flex-col">
      {/* Subtle Film Grain Overlay */}
      <FilmGrainOverlay />

      {/* Global Loading Overlay */}
      <LoadingOverlay loading={loading} region={region} selectedTerrain={selectedTerrain} />

      {/* Solid Independent Top Navigation HUD (h-14 / 56px) */}
      <Navigation
        region={region}
        setRegion={handleRegionChange}
        onReset={handleReset}
        specimensCount={specimens.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Slide-out Specimen Archive Drawer */}
      <SpecimenDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        specimens={specimens}
        onRemoveSpecimen={handleRemoveSpecimen}
        onClearAll={handleClearSpecimens}
        onSelectSpecimen={handleSelectSpecimen}
      />

      {/* Global Fixed Right Floating Slide Dock */}
      <SlideNavigationDock
        activeSlideIndex={activeSlideIndex}
        onNavigate={scrollToSlide}
      />

      {/* Error Message Toast */}
      <ErrorMessage error={error} />

      {/* ========================================================
          Main Full-Page Scroll-Snap Container
         ======================================================== */}
      <main
        ref={containerRef}
        className="w-full flex-1 overflow-y-scroll overflow-x-hidden snap-y snap-mandatory no-scrollbar relative"
        tabIndex={0}
      >
        {/* ========================================================
            SLIDE 01: 메인 화면 (ACT 01: KINETIC HERO)
           ======================================================== */}
        <section
          id="section-main"
          data-slide-index="0"
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          className="h-[calc(100vh-56px)] w-full snap-start relative overflow-hidden"
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
            isActive={activeSlideIndex === 0}
          />
        </section>

        {/* ========================================================
            SLIDE 02: 구글 위성지도 (ACT 02: SATELLITE TELEMETRY)
           ======================================================== */}
        <section
          id="section-map"
          data-slide-index="1"
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
          className="h-[calc(100vh-56px)] w-full snap-start relative overflow-hidden"
          aria-label="02 구글 위성지도"
        >
          {result ? (
            <GoogleMapSlide
              result={result}
              region={region}
              selectedTerrain={selectedTerrain}
              onSelectAlternativePlace={handleSelectAlternativePlace}
              onScrollNext={() => scrollToSlide(2)}
              onAddSpecimen={handleAddSpecimen}
              isCollected={isCurrentCollected}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#08080A] p-6 text-center">
              <Compass className="w-12 h-12 text-[#FFCC00] animate-spin mb-4" />
              <h3 className="text-lg font-bold font-serif tracking-tight mb-2">
                위성 지도를 불러오는 중입니다
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                잠시 후 대형 위성 관측 지도가 표시됩니다.
              </p>
            </div>
          )}
        </section>

        {/* ========================================================
            SLIDE 03: 3D 입체 지형
           ======================================================== */}
        <section
          id="section-3d"
          data-slide-index="2"
          ref={(el) => {
            slideRefs.current[2] = el;
          }}
          className="h-[calc(100vh-56px)] w-full snap-start relative overflow-hidden"
          aria-label="03 3D 입체 지형"
        >
          {result ? (
            <Terrain3DSlide
              result={result}
              region={region}
              selectedTerrain={selectedTerrain}
              onSelectAlternativePlace={handleSelectAlternativePlace}
              onScrollNext={() => scrollToSlide(3)}
              onAddSpecimen={handleAddSpecimen}
              isCollected={isCurrentCollected}
              isActive={activeSlideIndex === 2}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#08080A] p-6 text-center">
              <Sparkles className="w-12 h-12 text-[#FFCC00] animate-pulse mb-4" />
              <h3 className="text-lg font-bold font-serif tracking-tight mb-2">
                3D 지형 디오라마를 생성하고 있습니다
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                자연 지형 시뮬레이션을 준비 중입니다.
              </p>
            </div>
          )}
        </section>

        {/* ========================================================
            SLIDE 04: 지형 매거진
           ======================================================== */}
        <section
          id="section-guide"
          data-slide-index="3"
          ref={(el) => {
            slideRefs.current[3] = el;
          }}
          className="h-[calc(100vh-56px)] w-full snap-start relative overflow-hidden"
          aria-label="04 지형 매거진"
        >
          {result ? (
            <GeologicalGuideSlide
              result={result}
              region={region}
              selectedTerrain={selectedTerrain}
              onNavigateSlide={scrollToSlide}
              onAddSpecimen={handleAddSpecimen}
              isCollected={isCurrentCollected}
              isActive={activeSlideIndex === 3}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#08080A] p-6 text-center">
              <h3 className="text-lg font-bold font-serif tracking-tight mb-2">
                지형 매거진 기사를 불러오고 있습니다
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                지구과학적 형성 단계 데이터를 준비 중입니다.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
