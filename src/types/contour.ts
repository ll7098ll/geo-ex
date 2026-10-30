/**
 * Terrain DEM (Digital Elevation Model) & Contour Specification
 * Phase 1: 표준 표고 필드 및 등고선 데이터 사양
 */

export interface ContourIntervalSettings {
  /** 주곡선(굵은선 + 라벨) 간격 (m 단위 또는 상대 고도 단위) */
  indexInterval: number;
  /** 계곡선(보통선) 간격 */
  intermediateInterval: number;
  /** 조곡선(파선) 간격 (선택적) */
  halfInterval?: number;
}

export type FeatureType = 
  | 'crater'          // 화구 / 칼데라 함몰부
  | 'sinkhole'        // 돌리네 / 싱크홀
  | 'fault_line'      // 단층선
  | 'cliff'           // 단애면 / 해식애
  | 'channel'         // 하천 중심선 / 조수로
  | 'ridge'           // 능선
  | 'peak'            // 독립 봉우리
  | 'depression_zone';// 함몰 폐곡선 구역

export interface GeomorphicFeatureVector {
  id: string;
  name: string;
  type: FeatureType;
  /** 2D 정규화 좌표 [-10, 10] 범위의 제어점들 */
  points: [number, number][];
  description?: string;
  /** 요지(안쪽 빗금) 여부 */
  hasHachures?: boolean;
}

export interface TerrainElevationField {
  /** 지형 고유 식별자 (정규화된 이름, 예: '화산', '칼데라', '선상지') */
  terrainKey: string;
  /** 카테고리 (volcanic, coastal, fluvial, karst, glacial, arid) */
  category: string;
  /** 격자 분할 수 (기본 160) */
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

  /** 최소 표고 (m / 상대 단위) */
  minElevation: number;
  /** 최대 표고 (m / 상대 단위) */
  maxElevation: number;
  /** 총 기복량 (max - min) */
  reliefRange: number;

  /** 권장 등고선 간격 설정 */
  contourSettings: ContourIntervalSettings;

  /** 구조선, 화구, 하천 등의 주요 지형 벡터 피처 */
  features: GeomorphicFeatureVector[];

  /** 교육적 등고선 독도 관전 포인트 */
  contourReadingTips: string[];

  /** 지형별 추천 단면도 절단선 프리셋 */
  crossSectionPresets: CrossSectionPreset[];
}

/**
 * 지형별 사전 정의된 대표 단면도 절단선 프리셋 (A -> B)
 */
export interface CrossSectionPreset {
  id: string;
  name: string;
  /** 정규화된 2D 평면 좌표 [-10, 10] */
  p1: [number, number];
  p2: [number, number];
  description: string;
}

/**
 * 단면도 곡선 상의 단일 표본 샘플 점
 */
export interface CrossSectionSample {
  /** 선분 진행 비율 (0.0 ~ 1.0) */
  t: number;
  /** 월드 X 좌표 (-10 ~ 10) */
  x: number;
  /** 월드 Y 좌표 (-10 ~ 10) */
  y: number;
  /** 표고 고도 Z (m) */
  elevation: number;
  /** 시작점(A)으로부터의 누적 수평 거리 (m) */
  distance: number;
  /** 국소 경사각 (도, 0° ~ 90°) */
  slopeAngle: number;
}

/**
 * 단면도 샘플링 및 통계 분석 결과
 */
export interface CrossSectionResult {
  p1: [number, number];
  p2: [number, number];
  totalDistance: number;
  minElevation: number;
  maxElevation: number;
  reliefDelta: number;
  maxSlopeAngle: number;
  avgSlopeAngle: number;
  samples: CrossSectionSample[];
}
