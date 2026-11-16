import { useState, useEffect } from 'react';
import { TERRAIN_CATEGORIES } from './constants/terrains';
import { getCategoryIdForPlace } from './constants/places';
import { Region, PlaceInfo } from './types';
import { useTerrainSearch } from './hooks/useTerrainSearch';
import { useSpecimenBag } from './hooks/useSpecimenBag';
import { useSlideNavigation } from './hooks/useSlideNavigation';
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

interface SlideLoadingFallbackProps {
  title: string;
  subtitle: string;
  icon?: 'compass' | 'sparkles';
}

function SlideLoadingFallback({ title, subtitle, icon }: SlideLoadingFallbackProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#08080A] p-6 text-center">
      {icon === 'compass' && (
        <Compass className="w-12 h-12 text-[#FFCC00] animate-spin mb-4" />
      )}
      {icon === 'sparkles' && (
        <Sparkles className="w-12 h-12 text-[#FFCC00] animate-pulse mb-4" />
      )}
      <h3 className="text-lg font-bold font-serif tracking-tight mb-2">{title}</h3>
      <p className="text-xs text-zinc-400 font-sans">{subtitle}</p>
    </div>
  );
}

export default function App() {
  const [region, setRegion] = useState<Region>('world');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>('화산');
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('volcanic');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { specimens, toggleSpecimen, removeSpecimen, clearSpecimens } = useSpecimenBag();
  const { activeSlideIndex, containerRef, scrollToSlide, setSlideRef } = useSlideNavigation();
  const { loading, result, error, searchTerrain, selectPlace } = useTerrainSearch();

  // Initialize with flagship place (하와이 킬라우에아 화산) on initial load
  useEffect(() => {
    searchTerrain('화산', 'world', 'volcanic', 'volcano-wd-1');
  }, [searchTerrain]);

  // Auto-play hero slideshow when on page 1 and not actively searching
  useEffect(() => {
    if (!isAutoPlaying || loading || activeSlideIndex !== 0) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TERRAIN_CATEGORIES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, loading, activeSlideIndex]);

  const handleExplore = (terrain: string, categoryId: string) => {
    setSelectedTerrain(terrain);
    setCurrentCategoryId(categoryId);
    setIsAutoPlaying(false);

    searchTerrain(terrain, region, categoryId);

    requestAnimationFrame(() => {
      scrollToSlide(1);
    });
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    const targetTerrain = selectedTerrain || '화산';
    const targetCategory = currentCategoryId || 'volcanic';
    searchTerrain(targetTerrain, newRegion, targetCategory);
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

  const handleSelectSpecimen = (specimen: PlaceInfo) => {
    const targetCategory = getCategoryIdForPlace(specimen);
    setRegion(specimen.region);
    setCurrentCategoryId(targetCategory);
    setSelectedTerrain(specimen.terrain);
    searchTerrain(specimen.terrain, specimen.region, targetCategory, specimen.id);
    scrollToSlide(2);
  };

  const isCurrentCollected = Boolean(
    result?.placeInfo &&
      specimens.some((s) => s.placeName === result.placeInfo?.placeName)
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#08080A] text-white font-sans selection:bg-[#FFCC00] selection:text-black flex flex-col">
      <FilmGrainOverlay />
      <LoadingOverlay loading={loading} region={region} selectedTerrain={selectedTerrain} />

      <Navigation
        region={region}
        setRegion={handleRegionChange}
        onReset={handleReset}
        specimensCount={specimens.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      <SpecimenDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        specimens={specimens}
        onRemoveSpecimen={removeSpecimen}
        onClearAll={clearSpecimens}
        onSelectSpecimen={handleSelectSpecimen}
      />

      <SlideNavigationDock
        activeSlideIndex={activeSlideIndex}
        onNavigate={scrollToSlide}
      />

      <ErrorMessage error={error} />

      <main
        ref={containerRef}
        className="w-full flex-1 overflow-y-scroll overflow-x-hidden snap-y snap-mandatory no-scrollbar relative"
        tabIndex={0}
      >
        {/* SLIDE 01: 메인 화면 */}
        <section
          id="section-main"
          data-slide-index="0"
          ref={setSlideRef(0)}
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

        {/* SLIDE 02: 구글 위성지도 */}
        <section
          id="section-map"
          data-slide-index="1"
          ref={setSlideRef(1)}
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
              onAddSpecimen={toggleSpecimen}
              isCollected={isCurrentCollected}
            />
          ) : (
            <SlideLoadingFallback
              icon="compass"
              title="위성 지도를 불러오는 중입니다"
              subtitle="잠시 후 대형 위성 관측 지도가 표시됩니다."
            />
          )}
        </section>

        {/* SLIDE 03: 3D 입체 지형 */}
        <section
          id="section-3d"
          data-slide-index="2"
          ref={setSlideRef(2)}
          className="h-[calc(100vh-56px)] w-full snap-start relative overflow-hidden"
          aria-label="03 3D 입체 지형"
        >
          {result ? (
            <Terrain3DSlide
              result={result}
              selectedTerrain={selectedTerrain}
              onSelectAlternativePlace={handleSelectAlternativePlace}
              onScrollNext={() => scrollToSlide(3)}
              onAddSpecimen={toggleSpecimen}
              isCollected={isCurrentCollected}
              isActive={activeSlideIndex === 2}
            />
          ) : (
            <SlideLoadingFallback
              icon="sparkles"
              title="3D 지형 디오라마를 생성하고 있습니다"
              subtitle="자연 지형 시뮬레이션을 준비 중입니다."
            />
          )}
        </section>

        {/* SLIDE 04: 지형 매거진 */}
        <section
          id="section-guide"
          data-slide-index="3"
          ref={setSlideRef(3)}
          className="h-[calc(100vh-56px)] w-full snap-start relative overflow-hidden"
          aria-label="04 지형 매거진"
        >
          {result ? (
            <GeologicalGuideSlide
              result={result}
              region={region}
              selectedTerrain={selectedTerrain}
              onNavigateSlide={scrollToSlide}
              onAddSpecimen={toggleSpecimen}
              isCollected={isCurrentCollected}
              isActive={activeSlideIndex === 3}
            />
          ) : (
            <SlideLoadingFallback
              title="지형 매거진 기사를 불러오고 있습니다"
              subtitle="지구과학적 형성 단계 데이터를 준비 중입니다."
            />
          )}
        </section>
      </main>
    </div>
  );
}
