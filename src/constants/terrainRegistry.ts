/**
 * Single source of truth for terrain archetype resolution, aliases,
 * category classification, and base water elevations.
 */

export type TerrainCategoryId =
  | 'volcanic'
  | 'coastal'
  | 'fluvial'
  | 'karst'
  | 'glacial'
  | 'arid';

/**
 * Normalizes terrain strings for robust matching, removing parenthetical terms.
 * e.g., "해식애 (해안 절벽)" -> "해식애", "혼 (호른)" -> "혼"
 */
export function normalizeTerrainName(name: string): string {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
}

const DIRECT_SUB_ARCHETYPES = new Set([
  '순상화산',
  '종상화산',
  '용암대지',
  '수성화산',
  '감입곡류천',
]);

const SUBSTRING_TERRAIN_RULES: readonly { patterns: readonly string[]; key: string }[] = [
  { patterns: ['감입곡류'], key: '감입곡류천' },
  { patterns: ['오름', '기생화산'], key: '기생화산' },
  { patterns: ['사주', '사취'], key: '사주·사취' },
  { patterns: ['석호'], key: '석호' },
  { patterns: ['파식대'], key: '파식대' },
  { patterns: ['해식애'], key: '해식애' },
  { patterns: ['시스택'], key: '시스택' },
  { patterns: ['범람원'], key: '범람원' },
  { patterns: ['선상지'], key: '선상지' },
  { patterns: ['삼각주'], key: '삼각주' },
  { patterns: ['하안단구'], key: '하안단구' },
  { patterns: ['폭포'], key: '폭포' },
  { patterns: ['석회동굴'], key: '석회동굴' },
  { patterns: ['돌리네'], key: '돌리네' },
  { patterns: ['카렌'], key: '카렌' },
  { patterns: ['탑 카르스트', '탑카르스트'], key: '탑 카르스트' },
  { patterns: ['U자곡', '유자곡'], key: 'U자곡' },
  { patterns: ['피오르드'], key: '피오르드' },
  { patterns: ['혼', '호른'], key: '혼' },
  { patterns: ['권곡', '카르'], key: '권곡' },
  { patterns: ['모레인', '빙퇴석'], key: '모레인' },
  { patterns: ['메사', '뷰트'], key: '메사·뷰트' },
  { patterns: ['와디'], key: '와디' },
  { patterns: ['버섯바위'], key: '버섯바위' },
  { patterns: ['오아시스'], key: '오아시스' },
  { patterns: ['플라야'], key: '플라야' },
  { patterns: ['사막'], key: '사막' },
  { patterns: ['주상절리'], key: '주상절리' },
  { patterns: ['용암동굴'], key: '용암동굴' },
  { patterns: ['칼데라'], key: '칼데라' },
  { patterns: ['단층 산맥', '단층'], key: '단층 산맥' },
  { patterns: ['갯벌'], key: '갯벌' },
];

const INCISED_MEANDER_CONTEXT = [
  '감입곡류',
  '호스슈',
  '어라연',
  '한반도지형',
  '그랜드 캐니언',
  '구문소',
  '부용대',
];

const VOLCANIC_CONTEXT_RULES: readonly { key: string; hints: readonly string[] }[] = [
  { key: '기생화산', hints: ['기생화산', '오름', '파리쿠틴', '분석구', 'cinder cone'] },
  { key: '종상화산', hints: ['종상화산', '산방산', '용암돔'] },
  { key: '용암대지', hints: ['용암대지', '한탄강'] },
  { key: '수성화산', hints: ['수성화산', '응회구', '성산일출봉'] },
  { key: '순상화산', hints: ['순상화산', '킬라우에아', '마우나로아', '한라산'] },
];

/**
 * Resolves a display terrain name (plus optional place context) to a canonical 3D archetype key.
 */
export function resolveTerrainKey(name: string, placeContext = ''): string {
  const norm = normalizeTerrainName(name);

  if (DIRECT_SUB_ARCHETYPES.has(norm)) {
    return norm;
  }

  if (norm.includes('해안 사구') || (norm.includes('사구') && !norm.includes('사막'))) {
    return '해안 사구';
  }

  if (norm.includes('곡류') && !norm.includes('감입곡류')) {
    return INCISED_MEANDER_CONTEXT.some((hint) => placeContext.includes(hint))
      ? '감입곡류천'
      : '곡류천';
  }

  for (const rule of SUBSTRING_TERRAIN_RULES) {
    if (rule.patterns.some((p) => norm.includes(p))) {
      return rule.key;
    }
  }

  if (norm.includes('화산')) {
    for (const rule of VOLCANIC_CONTEXT_RULES) {
      if (rule.hints.some((hint) => placeContext.includes(hint))) {
        return rule.key;
      }
    }
    return '화산';
  }

  return norm;
}

const BASE_WATER_ELEVATIONS: Readonly<Record<string, number>> = {
  '갯벌': 0.33,
  '해식애': 0.50,
  '시스택': 0.50,
  '해안 사구': 0.42,
  '사주·사취': 0.52,
  '석호': 0.55,
  '파식대': 0.44,
  '주상절리': 0.52,
  '수성화산': 0.46,
  '종상화산': 0.42,
  '용암대지': 0.52,
  '곡류천': 0.56,
  '감입곡류천': 0.58,
  '범람원': 0.58,
  '삼각주': 0.50,
  '하안단구': 0.56,
  '탑 카르스트': 0.52,
  '피오르드': 0.66,
};

/**
 * Returns the base-level water elevation for terrains with sea/river base water,
 * or null for dry / perched-basin terrains where low outer slopes are subaerial land.
 */
export function getBaseWaterElevation(normSub: string, reliefScale = 1.0): number | null {
  const base = BASE_WATER_ELEVATIONS[normSub];
  return base !== undefined ? base * reliefScale : null;
}

export const CONTOUR_KEY_ALIASES: Readonly<Record<string, string>> = {
  '사주': '사주·사취',
  '사취': '사주·사취',
  '호른': '혼',
  '카르': '권곡',
  '빙퇴석': '모레인',
  '유자곡': 'U자곡',
  '탑카르스트': '탑 카르스트',
  '오름': '기생화산',
  '메사': '메사·뷰트',
  '뷰트': '메사·뷰트',
  '감입곡류': '감입곡류천',
};

export function getCategoryForTerrainName(terrainName: string): TerrainCategoryId {
  const t = (terrainName || '').toLowerCase();

  if (
    t.includes('화산') ||
    t.includes('칼데라') ||
    t.includes('주상절리') ||
    t.includes('용암') ||
    t.includes('오름') ||
    t.includes('단층')
  ) {
    return 'volcanic';
  }
  if (
    t.includes('하천') ||
    t.includes('곡류') ||
    t.includes('선상지') ||
    t.includes('삼각주') ||
    t.includes('폭포') ||
    t.includes('하안단구') ||
    t.includes('범람원')
  ) {
    return 'fluvial';
  }
  if (
    t.includes('해안') ||
    t.includes('갯벌') ||
    t.includes('절벽') ||
    t.includes('해식애') ||
    t.includes('사구') ||
    t.includes('시스택') ||
    t.includes('사주') ||
    t.includes('석호') ||
    t.includes('파식대')
  ) {
    return 'coastal';
  }
  if (
    t.includes('카르스트') ||
    t.includes('석회동굴') ||
    t.includes('돌리네') ||
    t.includes('카렌')
  ) {
    return 'karst';
  }
  if (
    t.includes('빙하') ||
    t.includes('피오르드') ||
    t.includes('u자곡') ||
    t.includes('혼') ||
    t.includes('호른') ||
    t.includes('모레인') ||
    t.includes('권곡')
  ) {
    return 'glacial';
  }
  return 'arid';
}
