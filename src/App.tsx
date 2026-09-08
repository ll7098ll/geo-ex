import React, { useState, useEffect, useRef } from 'react';
import { TERRAIN_CATEGORIES } from './constants/terrains';
import { Region, PlaceInfo } from './types';
import { useTerrainSearch } from './hooks/useTerrainSearch';
import { Navigation } from './components/Navigation';
import { HeroSlideshow } from './components/HeroSlideshow';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ErrorMessage } from './components/ErrorMessage';
import { SearchResult } from './components/SearchResult';

export default function App() {
  const [region, setRegion] = useState<Region>('world');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('volcanic');

  const { loading, result, error, searchTerrain, selectPlace, setResult } = useTerrainSearch();
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlaying || loading || result) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TERRAIN_CATEGORIES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, loading, result]);

  const handleExplore = async (terrain: string, categoryId: string) => {
    setSelectedTerrain(terrain);
    setCurrentCategoryId(categoryId);
    setIsAutoPlaying(false);

    await searchTerrain(terrain, region, categoryId);

    // Scroll to result after a short delay
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleRegionChange = async (newRegion: Region) => {
    setRegion(newRegion);
    if (selectedTerrain && result) {
      await searchTerrain(selectedTerrain, newRegion, currentCategoryId);
    }
  };

  const handleSelectAlternativePlace = (place: PlaceInfo) => {
    if (!result) return;
    const allCandidates = [
      ...(result.placeInfo ? [result.placeInfo] : []),
      ...(result.alternativePlaces || []),
    ];
    selectPlace(place, result.categoryId, allCandidates);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleShufflePlace = async () => {
    if (!selectedTerrain || !result) return;
    await searchTerrain(selectedTerrain, region, result.categoryId, undefined, result.selectedPlaceId);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedTerrain(null);
    setIsAutoPlaying(true);
  };

  return (
    <div className="min-h-screen bg-black text-slate-900 font-sans selection:bg-[#FFCC00] selection:text-black">
      <LoadingOverlay loading={loading} region={region} selectedTerrain={selectedTerrain} />

      <Navigation region={region} setRegion={handleRegionChange} onReset={handleReset} />

      <HeroSlideshow
        categories={TERRAIN_CATEGORIES}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        isAutoPlaying={isAutoPlaying}
        setIsAutoPlaying={setIsAutoPlaying}
        onExplore={handleExplore}
      />

      <ErrorMessage error={error} />

      {result && (
        <SearchResult
          ref={resultRef}
          result={result}
          region={region}
          selectedTerrain={selectedTerrain}
          onSelectAlternativePlace={handleSelectAlternativePlace}
          onShufflePlace={handleShufflePlace}
        />
      )}
    </div>
  );
}
