# 📋 데이터 모델 규격 및 확장 가이드 (Data Schema & Contribution)

> 본 문서는 **지형 탐험가 (Geography Explorer)**의 핵심 데이터 구조(TypeScript 인터페이스), 지질 메타데이터 스키마 규격, 그리고 신규 국내외 지질 명소 프리셋을 추가하는 개발자 가이드를 제공합니다.

---

## 📐 1. 핵심 타입 정의 (Core Interfaces)

모든 데이터 인터페이스는 `src/types/index.ts` 및 `src/types/contour.ts`에 정의되어 있습니다.

### 1.1 지질 명소 정보 (`PlaceInfo`)

```typescript
export interface PlaceInfo {
  id: string;                    // 고유 식별자 (예: 'jeju-seongsan')
  placeName: string;             // 명소 국문 명칭 (예: '성산일출봉')
  placeNameEn?: string;          // 영문 명칭 (예: 'Seongsan Ilchulbong')
  terrain: string;               // 세부 지형 카테고리 (예: '화산')
  region: 'korea' | 'world';     // 권역 (대한민국 또는 전 세계)
  location: string;              // 행정구역/국가 위치 (예: '제주특별자치도 서귀포시')
  tagline: string;               // 한 줄 요약 소개 문구
  description: string;           // 지형학적 상세 해설 본문
  mapQuery?: string;             // 구글 지도 위성 뷰 검색 쿼리
  coordinates?: {
    lat: number;                 // 위도 (WGS84)
    lng: number;                 // 경도 (WGS84)
  };
  geology?: GeologyMetadata;     // 학술 지질학 메타데이터
  evolutionStages?: EvolutionStage[]; // 4단계 진화 타임라인
  fieldGuide?: FieldGuide;       // 현장 탐방 및 위성 관찰 가이드
}
```

### 1.2 지질학 전문 메타데이터 (`GeologyMetadata`)

```typescript
export interface GeologyMetadata {
  geologicalAge: string;         // 형성 지질 연대 (예: '신생대 제4기 플라이스토세 (약 5천~10만 년 전)')
  rockType: string;              // 주요 구성 암석 (예: '현무암질 화산쇄설암, 응회암')
  agent: string;                 // 주 형성 작용 (예: '수성화산 활동 (마그마-지하수 상호작용)')
  scale: string;                 // 정량적 규모 (예: '해발 182m, 분화구 직경 약 600m')
}
```

### 1.3 지형 발달 4단계 진화사 (`EvolutionStage`)

```typescript
export interface EvolutionStage {
  step: number;                  // 발달 단계 번호 (1 ~ 4)
  title: string;                 // 단계 제목 (예: '1. 해저 마그마 분출')
  description: string;           // 단계별 지형 진화 과정 설명
}
```

### 1.4 현장 탐방 및 위성 가이드 (`FieldGuide`)

```typescript
export interface FieldGuide {
  satellitePoints: string[];     // 위성 지도에서 확인 가능한 핵심 포인트 3선
  bestVisitingTime: string;      // 최적 탐방 시기 및 관찰 조건
  safetyCaution?: string;        // 지질 보존 및 안전 수칙
}
```

---

## 🗺️ 2. DEM 표고 그리드 및 등고선 데이터 (`contour.ts`)

```typescript
export interface TerrainElevationField {
  width: number;                 // 그리드 가로 셀 수 (80)
  height: number;                // 그리드 세로 셀 수 (80)
  data: Float32Array;            // 0~1 정규화 고도 배열 (크기 width * height)
  minElevation: number;          // 실제 최저 표고 (m)
  maxElevation: number;          // 실제 최고 표고 (m)
  elevationRange: number;        // 표고차 (m)
  category: string;              // 지형 대분류 ID
  subTerrain: string;            // 세부 지형 이름
}

export interface CrossSectionSample {
  t: number;                     // 단면선 상의 정규화 위치 (0.0 ~ 1.0)
  x: number;                     // 2D 캔버스 X 좌표
  y: number;                     // 2D 캔버스 Y 좌표
  normalizedElevation: number;   // 0~1 정규화 고도
  actualElevation: number;       // 실제 계산된 표고 (m)
  distance: number;              // 시작점(A)으로부터의 누적 거리 (m/km)
}
```

---

## 🛠️ 3. 신규 지질 명소 추가 방법 (How to Add a Place)

새로운 지질 명소를 추가하려면 해당 대분류 파일(`src/constants/places/` 디렉터리)을 수정합니다.

### 3.1 파일 매핑
- **화산·산지 지형**: `src/constants/places/volcanic.ts`
- **해안 지형**: `src/constants/places/coastal.ts`
- **하천 지형**: `src/constants/places/fluvial.ts`
- **카르스트 지형**: `src/constants/places/karst.ts`
- **빙하 지형**: `src/constants/places/glacial.ts`
- **건조 지형**: `src/constants/places/arid.ts`

### 3.2 추가 템플릿 코드 예시

```typescript
export const NEW_PLACES: PlaceInfo[] = [
  {
    id: 'korea-hallasan-baengnokdam',
    placeName: '한라산 백록담',
    placeNameEn: 'Hallasan Baengnokdam Crater Lake',
    terrain: '화산',
    region: 'korea',
    location: '제주특별자치도 제주시/서귀포시',
    tagline: '대한민국 최고봉에 형성된 신비로운 백록담 화구호',
    description: '남한 최고봉(해발 1,947m)에 위치한 순상화산의 분화구로, 점성이 낮은 조면암질 용암과 현무암질 용암이 교대 분출하며 형성되었습니다.',
    mapQuery: '한라산 백록담',
    coordinates: { lat: 33.3617, lng: 126.5332 },
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~홀로세 (약 2만 5천 년 전 형성)',
      rockType: '백록담 조면암, 현무암질 화산쇄설암',
      agent: '화산 분출 및 정상부 화구 함몰 작용',
      scale: '해발 1,947m, 분화구 동서 600m, 남북 400m, 둘레 1,720m, 깊이 108m',
    },
    evolutionStages: [
      { step: 1, title: '순상화산체 형성', description: '점성이 낮은 현무암질 용암이 광범위하게 분출하여 완만한 방패 모양의 기저 화산체를 형성했습니다.' },
      { step: 2, title: '조면암 돔 융기', description: '정상부에서 점성이 높은 조면암질 용암이 솟아올라 험준한 정상 암벽과 돔 형태를 만들었습니다.' },
      { step: 3, title: '분화구 형성 및 냉각', description: '화산 가스 분출과 함께 중심부가 함몰되어 깊이 108m의 원형 분화구가 완성되었습니다.' },
      { step: 4, title: '화구호 백록담 형성', description: '불투수성 점토질 퇴적층 위에 강우가 고여 신비로운 고산 화구호가 유지되고 있습니다.' },
    ],
    fieldGuide: {
      satellitePoints: [
        '정상부 거대한 타원형 화구호와 북벽의 깎아지른 조면암 절벽',
        '사방으로 뻗어나간 방사상 계곡 침식 패턴',
        '산록에 흩어져 있는 360여 개의 기생화산(오름) 군집',
      ],
      bestVisitingTime: '5~6월(철쭉 개화기) 및 10~11월(단풍철), 기상 변화가 심하므로 이른 아침 산행 권장',
      safetyCaution: '국립공원 보호구역으로 지정 탐방로 외 출입이 엄격히 금지됩니다.',
    },
  },
];
```

새로 추가된 데이터는 `constants/places.ts`에 자동 집계되며, 메인 슬라이더 탐색, 3D 디오라마, 위성 지도, 2D 등고선도 및 두 지형 비교 뷰 전반에 즉각 반영됩니다.
