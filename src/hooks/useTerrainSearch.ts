import { useState, useCallback } from 'react';
import { SearchResult, Region, PlaceInfo } from '../types';
import { getDiversePlace, getPlaceById, getPlacesForTerrain } from '../constants/places';

function buildSearchResult(
  place: PlaceInfo,
  categoryId: string,
  allCandidates: PlaceInfo[]
): SearchResult {
  const query = encodeURIComponent(place.mapQuery || place.placeName);
  const alternativePlaces = allCandidates.filter((c) => c.id !== place.id);

  const mapsDescription = `**${place.tagline}**\n\n- **행정구역/위치:** ${place.countryOrArea}\n- **형성 메커니즘:** ${place.formationProcess || '자연적 풍화·침식 및 지질 작용'}\n- **핵심 관찰 포인트:** ${place.observationPoints?.join(', ') || '지형 단면 및 식생 구조'}`;

  const searchSources = [
    {
      uri: `https://www.google.com/search?q=${query}`,
      title: `${place.placeName} 지형학 학술정보 및 탐방 안내`,
    },
    {
      uri: `https://ko.wikipedia.org/wiki/${query}`,
      title: `${place.placeName} 지질 백과사전`,
    },
  ];

  const mapsLinks = [
    {
      uri: `https://maps.google.com/?q=${query}&t=k`,
      title: `Google 지도에서 ${place.placeName} 고해상도 위성뷰 열기`,
    },
    {
      uri: `https://earth.google.com/web/search/${query}`,
      title: `Google Earth 3D 웹에서 ${place.placeName} 입체 탐색`,
    },
    ...(place.region === 'korea'
      ? [
          {
            uri: `https://map.naver.com/p/search/${query}`,
            title: `네이버 지도에서 ${place.placeName} 초고해상도 항공사진 열기`,
          },
          {
            uri: `https://map.kakao.com/link/search/${query}`,
            title: `카카오맵 스카이뷰에서 ${place.placeName} 보기`,
          },
        ]
      : []),
  ];

  return {
    placeName: place.placeName,
    description: place.description,
    searchSources,
    mapsDescription,
    mapsLinks,
    categoryId,
    placeInfo: place,
    alternativePlaces,
    selectedPlaceId: place.id,
  };
}

export const useTerrainSearch = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchTerrain = useCallback(
    (
      terrain: string,
      region: Region,
      categoryId: string,
      specificPlaceId?: string,
      excludePlaceId?: string
    ) => {
      setLoading(true);
      setError(null);

      try {
        let chosenPlace: PlaceInfo;
        let allCandidates: PlaceInfo[];

        const found = specificPlaceId ? getPlaceById(specificPlaceId) : undefined;
        if (found) {
          chosenPlace = found;
          const regionCandidates = getPlacesForTerrain(terrain, region);
          allCandidates = regionCandidates.length > 0 ? regionCandidates : [found];
        } else {
          const res = getDiversePlace(terrain, region, excludePlaceId);
          chosenPlace = res.place;
          allCandidates = res.allCandidates;
        }

        setResult(buildSearchResult(chosenPlace, categoryId, allCandidates));
      } catch (err: unknown) {
        console.error('Error during terrain search:', err);
        const message = err instanceof Error ? err.message : undefined;
        setError(message || '탐험 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const selectPlace = useCallback(
    (place: PlaceInfo, categoryId: string, allCandidates: PlaceInfo[]) => {
      setResult(buildSearchResult(place, categoryId, allCandidates));
    },
    []
  );

  return { loading, result, error, searchTerrain, selectPlace, setResult };
};
