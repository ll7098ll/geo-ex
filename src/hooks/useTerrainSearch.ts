import { useState } from 'react';
import { SearchResult, Region, PlaceInfo } from '../types';
import { getDiversePlace, getPlaceById, getPlacesForTerrain } from '../constants/places';

export const useTerrainSearch = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchTerrain = async (
    terrain: string,
    region: Region,
    categoryId: string,
    specificPlaceId?: string,
    excludePlaceId?: string
  ) => {
    setLoading(true);
    setError(null);

    // Provide a subtle realistic transition delay for smooth UX
    await new Promise((resolve) => setTimeout(resolve, 180));

    try {
      let chosenPlace: PlaceInfo;
      let allCandidates: PlaceInfo[];

      if (specificPlaceId) {
        const found = getPlaceById(specificPlaceId);
        if (found) {
          chosenPlace = found;
          allCandidates = getPlacesForTerrain(terrain, region);
          if (allCandidates.length === 0) {
            allCandidates = [found];
          }
        } else {
          const res = getDiversePlace(terrain, region, excludePlaceId);
          chosenPlace = res.place;
          allCandidates = res.allCandidates;
        }
      } else {
        const res = getDiversePlace(terrain, region, excludePlaceId);
        chosenPlace = res.place;
        allCandidates = res.allCandidates;
      }

      const placeName = chosenPlace.placeName;
      const description = chosenPlace.description;
      const mapsDescription = `**${chosenPlace.tagline}**\n\n- **행정구역/위치:** ${chosenPlace.countryOrArea}\n- **형성 메커니즘:** ${chosenPlace.formationProcess || '자연적 풍화·침식 및 지질 작용'}\n- **핵심 관찰 포인트:** ${chosenPlace.observationPoints?.join(', ') || '지형 단면 및 식생 구조'}`;

      const searchSources: { uri: string; title: string }[] = [
        {
          uri: `https://www.google.com/search?q=${encodeURIComponent(chosenPlace.mapQuery || placeName)}`,
          title: `${placeName} 지형학 학술정보 및 탐방 안내`,
        },
        {
          uri: `https://ko.wikipedia.org/wiki/${encodeURIComponent(chosenPlace.mapQuery || placeName)}`,
          title: `${placeName} 지질 백과사전`,
        },
      ];

      const mapsLinks: { uri: string; title: string }[] = [
        {
          uri: `https://maps.google.com/?q=${encodeURIComponent(chosenPlace.mapQuery || placeName)}`,
          title: `Google 지도에서 ${placeName} 고해상도 위성뷰 열기`,
        },
      ];

      // Filter alternative places excluding the currently selected one
      const alternativePlaces = allCandidates.filter((c) => c.id !== chosenPlace.id);

      setResult({
        placeName,
        description,
        searchSources,
        mapsDescription,
        mapsLinks,
        categoryId,
        placeInfo: chosenPlace,
        alternativePlaces,
        selectedPlaceId: chosenPlace.id,
      });
    } catch (err: any) {
      console.error('Error during terrain search:', err);
      setError(err.message || '탐험 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = (place: PlaceInfo, categoryId: string, allCandidates: PlaceInfo[]) => {
    const alternativePlaces = allCandidates.filter((c) => c.id !== place.id);
    const mapsDescription = `**${place.tagline}**\n\n- **행정구역/위치:** ${place.countryOrArea}\n- **형성 메커니즘:** ${place.formationProcess || '자연적 풍화·침식 및 지질 작용'}\n- **핵심 관찰 포인트:** ${place.observationPoints?.join(', ') || '지형 단면 및 식생 구조'}`;

    setResult({
      placeName: place.placeName,
      description: place.description,
      searchSources: [
        {
          uri: `https://www.google.com/search?q=${encodeURIComponent(place.mapQuery || place.placeName)}`,
          title: `${place.placeName} 지형학 학술정보 및 탐색`,
        },
        {
          uri: `https://ko.wikipedia.org/wiki/${encodeURIComponent(place.mapQuery || place.placeName)}`,
          title: `${place.placeName} 지질 백과사전`,
        },
      ],
      mapsDescription,
      mapsLinks: [
        {
          uri: `https://maps.google.com/?q=${encodeURIComponent(place.mapQuery || place.placeName)}`,
          title: `Google 지도에서 ${place.placeName} 위성뷰 열기`,
        },
      ],
      categoryId,
      placeInfo: place,
      alternativePlaces,
      selectedPlaceId: place.id,
    });
  };

  return { loading, result, error, searchTerrain, selectPlace, setResult };
};
