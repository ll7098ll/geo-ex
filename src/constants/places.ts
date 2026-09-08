import { PlaceInfo, Region } from '../types';
import { VOLCANIC_PLACES } from './places/volcanic';
import { COASTAL_PLACES } from './places/coastal';
import { FLUVIAL_PLACES } from './places/fluvial';
import { KARST_PLACES } from './places/karst';
import { GLACIAL_PLACES } from './places/glacial';
import { ARID_PLACES } from './places/arid';

/**
 * 112 curated world and Korean geographic landmark sites.
 * Pre-generated with comprehensive scientific formation processes,
 * exploration highlights, observation points, and high-precision search metadata.
 */
export const PRESET_PLACES: PlaceInfo[] = [
  ...VOLCANIC_PLACES,
  ...COASTAL_PLACES,
  ...FLUVIAL_PLACES,
  ...KARST_PLACES,
  ...GLACIAL_PLACES,
  ...ARID_PLACES,
];

/**
 * Normalizes terrain strings for robust matching, removing parenthetical terms
 * e.g., "해식애 (해안 절벽)" -> "해식애", "혼 (호른)" -> "혼"
 */
function normalizeTerrainName(terrain: string): string {
  return terrain.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
}

/**
 * Helper: Filter places by terrain category and region
 */
export function getPlacesForTerrain(terrain: string, region: Region): PlaceInfo[] {
  const normSearch = normalizeTerrainName(terrain);

  return PRESET_PLACES.filter(p => {
    if (p.region !== region) return false;
    if (p.terrain === terrain) return true;

    const normPlace = normalizeTerrainName(p.terrain);
    if (normPlace === normSearch) return true;

    // Support sub-matches like "호른" matching "혼 (호른)"
    if (p.terrain.includes(terrain) || terrain.includes(normPlace)) return true;

    // Specific alias handling
    if ((normSearch.includes('곡류') || normSearch === '곡류천') && normPlace.includes('곡류')) return true;
    if ((normSearch === '혼' || normSearch === '호른') && (normPlace.includes('혼') || normPlace.includes('호른'))) return true;
    if ((normSearch === '모레인' || normSearch === '빙퇴석') && (normPlace.includes('모레인') || normPlace.includes('빙퇴석'))) return true;
    if ((normSearch.includes('오름') || normSearch.includes('기생화산')) && (normPlace.includes('오름') || normPlace.includes('기생화산'))) return true;

    return false;
  });
}

// Memory of recently viewed place IDs to guarantee variety on subsequent searches
const recentlyViewedKey = 'geo_recently_viewed_places';

function getRecentlyViewed(): string[] {
  try {
    const raw = sessionStorage.getItem(recentlyViewedKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function recordRecentlyViewed(id: string) {
  try {
    const list = getRecentlyViewed();
    const updated = [id, ...list.filter(item => item !== id)].slice(0, 30);
    sessionStorage.setItem(recentlyViewedKey, JSON.stringify(updated));
  } catch {
    // Ignore storage issues in sandboxed iframes
  }
}

/**
 * Select a place ensuring different places appear each time.
 * If excludeId is provided (e.g. clicking "다른 장소 보기"), it avoids repeating the current place.
 */
export function getDiversePlace(
  terrain: string,
  region: Region,
  excludeId?: string
): { place: PlaceInfo; allCandidates: PlaceInfo[] } {
  let candidates = getPlacesForTerrain(terrain, region);

  // Fallback 1: if no region match, check all regions for this terrain
  if (candidates.length === 0) {
    const normSearch = normalizeTerrainName(terrain);
    candidates = PRESET_PLACES.filter(p => {
      const normPlace = normalizeTerrainName(p.terrain);
      return normPlace === normSearch || p.terrain === terrain || p.terrain.includes(terrain);
    });
  }

  // Fallback 2: if still empty, create a clean fallback
  if (candidates.length === 0) {
    const fallback: PlaceInfo = {
      id: `fallback-${Date.now()}`,
      terrain,
      region,
      placeName: `${region === 'korea' ? '대한민국' : '세계'}의 대표 ${terrain}`,
      countryOrArea: region === 'korea' ? '대한민국' : '전 세계',
      tagline: `${terrain}의 신비로운 형성과정과 지형학적 가치를 탐험해보세요.`,
      description: `### ${terrain} 탐험\n이곳은 ${region === 'korea' ? '대한민국' : '전 세계'}에서 관찰할 수 있는 대표적인 ${terrain} 지형입니다.\n\n### 과학적 형성 과정\n오랜 세월 동안 지구의 내적·외적 영력이 상호작용하여 형성되었습니다.\n\n### 탐험 포인트\n- 지형의 고유한 단면과 경사\n- 주변 생태계 및 지질 구조`,
      mapQuery: `${region === 'korea' ? '대한민국' : ''} ${terrain}`,
    };
    return { place: fallback, allCandidates: [fallback] };
  }

  const recentlyViewed = getRecentlyViewed();

  // Filter out the excluded ID if provided
  let available = excludeId ? candidates.filter(c => c.id !== excludeId) : candidates;
  if (available.length === 0) available = candidates;

  // Prefer candidates that haven't been recently viewed
  const unviewed = available.filter(c => !recentlyViewed.includes(c.id));
  const pool = unviewed.length > 0 ? unviewed : available;

  // Pick randomly from the pool
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  recordRecentlyViewed(chosen.id);

  return { place: chosen, allCandidates: candidates };
}

export function getPlaceById(id: string): PlaceInfo | undefined {
  return PRESET_PLACES.find(p => p.id === id);
}
