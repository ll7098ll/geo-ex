export interface GeologicalMetadata {
  geologicalAge: string;          // 예: '신생대 제4기 플라이스토세 (약 180만 년 전)'
  rockType: string;               // 예: '다공질 알칼리 현무암 및 조면암'
  tectonicSetting?: string;       // 예: '판 내부 열점(Hotspot) 분출'
  geomorphicAgent?: string;       // 예: '화산 분출 및 유수 침식'
  scale?: {
    elevationMeters?: number;     // 해발 고도 (m)
    areaKm2?: number;             // 면적 (㎢)
    depthMeters?: number;         // 깊이/단차 (m)
    lengthKm?: number;            // 연장 길이 (km)
  };
}

export interface TerrainEvolutionStage {
  stageNumber: 1 | 2 | 3 | 4;
  title: string;                  // 단계명 (예: 1단계: 해저 현무암 용암 분출)
  timeframe: string;              // 시대 (예: 약 180만 년 전)
  process: string;                // 구체적 지질학적 작용 메커니즘
  visualKeyFeature: string;       // 당시 지형 특징
}

export interface FieldObservationGuide {
  coordinates?: { lat: number; lng: number };
  bestVisitingSeason?: string;    // 최적 방문 시기 및 조건 (예: 4~10월, 썰물 간조 2시간 전)
  satelliteCheckPoints: string[]; // 위성사진 판독 핵심 3선
  cautionAndConservation?: string;// 지질 보존 주의사항 및 안전 수칙
}

export interface PlaceInfo {
  id: string;
  terrain: string;
  region: Region;
  placeName: string;
  countryOrArea: string;
  tagline: string;
  description: string;
  formationProcess?: string;
  observationPoints?: string[];
  mapQuery: string;
  geology?: GeologicalMetadata;
  evolutionStages?: TerrainEvolutionStage[];
  fieldGuide?: FieldObservationGuide;
}

export interface TerrainAnnotation {
  name: string;
  description: string;
  position: [number, number, number]; // [x, y, z] in 3D scene
}

export interface SearchResult {
  placeName: string;
  description: string;
  searchSources: { uri: string; title: string }[];
  mapsDescription: string;
  mapsLinks: { uri: string; title: string }[];
  categoryId: string;
  placeInfo?: PlaceInfo;
  alternativePlaces?: PlaceInfo[];
  selectedPlaceId?: string;
}

export type Region = 'korea' | 'world';

export interface TerrainCategory {
  id: string;
  name: string;
  icon: any; // Lucide icon
  description: string;
  items: string[];
  image: string;
}

