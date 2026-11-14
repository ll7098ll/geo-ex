import { ContourIntervalSettings } from '../../../types/contour';

export interface TerrainContourMeta {
  contourSettings: ContourIntervalSettings;
}

export const TERRAIN_CONTOUR_METADATA: Record<string, TerrainContourMeta> = {
  // 1. 화산 지형 (Volcanic)
  '화산': { contourSettings: { indexInterval: 2.0, intermediateInterval: 0.5 } },
  '순상화산': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },
  '종상화산': { contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 } },
  '용암대지': { contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 } },
  '수성화산': { contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 } },
  '칼데라': { contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 } },
  '주상절리': { contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 } },
  '용암동굴': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },
  '기생화산': { contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 } },
  '단층 산맥': { contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 } },

  // 2. 해안 지형 (Coastal)
  '갯벌': { contourSettings: { indexInterval: 0.4, intermediateInterval: 0.1 } },
  '해식애': { contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 } },
  '시스택': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },
  '해안 사구': { contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 } },
  '사주·사취': { contourSettings: { indexInterval: 0.5, intermediateInterval: 0.1 } },
  '석호': { contourSettings: { indexInterval: 0.5, intermediateInterval: 0.1 } },
  '파식대': { contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 } },

  // 3. 하천 지형 (Fluvial)
  '선상지': { contourSettings: { indexInterval: 1.0, intermediateInterval: 0.2 } },
  '범람원': { contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 } },
  '곡류천': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },
  '감입곡류천': { contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 } },
  '삼각주': { contourSettings: { indexInterval: 0.4, intermediateInterval: 0.1 } },
  '하안단구': { contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 } },
  '폭포': { contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 } },

  // 4. 카르스트 지형 (Karst)
  '돌리네': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },
  '석회동굴': { contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 } },
  '탑 카르스트': { contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 } },
  '카렌': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },

  // 5. 빙하 지형 (Glacial)
  'U자곡': { contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 } },
  '피오르드': { contourSettings: { indexInterval: 1.8, intermediateInterval: 0.4 } },
  '혼': { contourSettings: { indexInterval: 2.0, intermediateInterval: 0.5 } },
  '권곡': { contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 } },
  '모레인': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },

  // 6. 건조 지형 (Arid)
  '사막': { contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 } },
  '버섯바위': { contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 } },
  '오아시스': { contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 } },
  '플라야': { contourSettings: { indexInterval: 0.4, intermediateInterval: 0.1 } },
  '와디': { contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 } },
  '메사·뷰트': { contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 } },
};

const KEY_ALIASES: Record<string, string> = {
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

export function getTerrainContourMeta(key: string): TerrainContourMeta {
  const resolved = KEY_ALIASES[key] || key;
  return TERRAIN_CONTOUR_METADATA[resolved] || TERRAIN_CONTOUR_METADATA['화산'];
}
