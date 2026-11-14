/**
 * Terrain DEM (Digital Elevation Model) & Contour Specification
 * 표준 표고 필드 및 등고선 간격 데이터 사양
 */

export interface ContourIntervalSettings {
  /** 주곡선(굵은선) 간격 */
  indexInterval: number;
  /** 계곡선(보통선) 간격 */
  intermediateInterval: number;
  /** 조곡선(파선) 간격 (선택적) */
  halfInterval?: number;
}

export interface TerrainElevationField {
  /** 지형 고유 식별자 (정규화된 이름, 예: '화산', '칼데라', '선상지') */
  terrainKey: string;
  /** 카테고리 (volcanic, coastal, fluvial, karst, glacial, arid) */
  category: string;
  /** 격자 분할 수 (기본 240) */
  segments: number;
  /** 실제 공간 크기 (기본 20x20, x/y 범위 -10 ~ +10) */
  worldSize: number;
  /** 격자 점 간격 (worldSize / segments) */
  step: number;

  /**
   * 1D 플랫 배열로 직렬화된 고도 데이터
   * 크기: (segments + 1) * (segments + 1)
   * 인덱스 접근: j * (segments + 1) + i
   */
  elevations: Float32Array;

  /** 정규화된 RGB 버텍스 컬러 (R, G, B 순서) */
  colors: Float32Array;

  /** 최소 표고 (상대 단위) */
  minElevation: number;
  /** 최대 표고 (상대 단위) */
  maxElevation: number;
  /** 총 기복량 (max - min) */
  reliefRange: number;

  /** 권장 등고선 간격 설정 */
  contourSettings: ContourIntervalSettings;
}
