# 🤝 지질 명소 및 3D 지형 추가 기여 가이드 (Contributing Terrain & Places)

> **지형 탐험가 (Geography Explorer)** 플랫폼에 신규 국내외 지질 명소 프리셋을 추가하거나, 새로운 절차적 3D 지형 수학 모델을 확장하는 개발자 및 연구자용 실전 기여 지침서입니다.

---

## 📌 1. 데이터 및 코드 구조 개요

지질 명소 데이터와 3D 생성 알고리즘은 6대 대분류별로 모듈화되어 있습니다.

```
src/
├── constants/
│   ├── terrains.ts                  # 6대 대분류 및 26개 세부 지형 카테고리 정의
│   ├── places.ts                    # 전체 명소 취합 인덱스 (PRESET_PLACES)
│   └── places/                      # 범주별 명소 데이터셋
│       ├── volcanic.ts              # 화산/칼데라/주상절리/용암동굴/단층산맥 명소
│       ├── coastal.ts               # 갯벌/해식애/시스택/해안사구/사주 명소
│       ├── fluvial.ts               # 선상지/곡류천/삼각주/하안단구/폭포 명소
│       ├── karst.ts                 # 석회동굴/돌리네/탑카르스트 명소
│       ├── glacial.ts               # U자곡/피오르드/혼/모레인 명소
│       └── arid.ts                  # 사막/버섯바위/오아시스/플라야 명소
└── components/terrain/
    ├── terrainGenerators.ts         # 지형 생성기 라우팅 레지스트리
    └── generators/                  # 범주별 수치 절차 지형 생성기
```

---

## 🚀 2. 신규 지질 명소 추가 5단계 (Step-by-Step)

### [Step 1] 지형 카테고리 식별
추가하려는 명소가 26개 세부 지형 중 어디에 속하는지 `src/constants/terrains.ts`에서 확인합니다:
- **화산**: `'화산'`, `'칼데라'`, `'주상절리'`, `'용암동굴'`, `'단층 산맥'`
- **해안**: `'갯벌'`, `'해식애'`, `'시스택'`, `'해안 사구'`, `'사주'`
- **하천**: `'선상지'`, `'곡류천'`, `'삼각주'`, `'하안단구'`, `'폭포'`
- **카르스트**: `'석회동굴'`, `'돌리네'`, `'탑 카르스트'`
- **빙하**: `'U자곡'`, `'피오르드'`, `'혼'`, `'모레인'`
- **건조**: `'사막'`, `'버섯바위'`, `'오아시스'`, `'플라야'`

---

### [Step 2] WGS84 좌표 및 지도 검색 쿼리 추출
1. **Google Maps**에서 대상 명소를 검색합니다.
2. 마우스 우클릭으로 정밀 위도와 경도(소수점 4자리 이상 권장)를 복사합니다.
   - 예: 제주 성산일출봉 $\to$ 위도 `33.4581`, 경도 `126.9426`
   - 주의: Google Maps는 `(위도, 경도)` 순서로 표시되므로 `lat: 33.4581, lng: 126.9426`에 맞게 기입합니다.
3. `mapQuery`는 위성 지도에서 검색어 힌트로 쓰일 문자열(예: `'Seongsan Ilchulbong Jeju'`)을 지정합니다.

---

### [Step 3] `PlaceInfo` 객체 데이터 작성
해당 지형이 속한 파일(예: 화산이면 `src/constants/places/volcanic.ts`)을 열고 객체를 작성합니다:

```typescript
import { PlaceInfo } from '../../types';

export const NEW_VOLCANO_PLACE: PlaceInfo = {
  id: 'iceland-eyjafjallajokull',              // 영문 소문자-하이픈 고유 ID (중복 금지)
  placeName: '에이야퍄들라외퀴들 화산',          // 국문 공식 명칭
  placeNameEn: 'Eyjafjallajökull',             // 영문 공식 명칭
  terrain: '화산',                            // 26개 세부 지형명 중 일치해야 함
  region: 'world',                            // 'world' (전 세계) 또는 'korea' (대한민국)
  location: '아이슬란드 쉬뒤를란드 수르트세이 인근', // 행정구역 및 국가
  tagline: '2010년 유럽 항공 대란을 일으킨 빙하 화산의 거대한 칼데라와 폭발적 분화',
  description:
    '에이야퍄들라외퀴들은 빙모(Ice Cap) 아래에 분화구가 위치한 전형적인 성층 빙하화산입니다...',
  mapQuery: 'Eyjafjallajokull Volcano Iceland',
  coordinates: {
    lat: 63.6333,
    lng: -19.6167,
  },
  geology: {
    geologicalAge: '신생대 제4기 플라이스토세~홀로세 (활화산)',
    rockType: '현무암질 안산암, 유문암, 화산재',
    agent: '마그마 분출 및 빙하수 접촉에 의한 수성 폭발(Phreatomagmatic Eruption)',
    scale: '해발 1,651m, 분화구 직경 약 2.5km',
  },
  evolutionStages: [
    {
      step: 1,
      title: '1. 대서양 중앙 해령 열개 및 마그마 상승',
      description: '판의 확장 경계에서 상승한 맨틀 플룸 마그마가 지각 취약부를 뚫고 분출을 개시함.',
    },
    {
      step: 2,
      title: '2. 성층 화산체 형성 및 빙하 피복',
      description: '수만 년간 용암류와 화산쇄설물이 교대로 누적되며 원추형 화산체가 형성되고 상부에 두꺼운 빙모가 형성됨.',
    },
    {
      step: 3,
      title: '3. 2010년 수성 화산 폭발',
      description: '고온의 마그마가 상부 빙하 얼음과 격렬히 반응하며 미세 화산재 구름을 상공 9km까지 분출.',
    },
    {
      step: 4,
      title: '4. 현대의 복합 화산 경관',
      description: '빙하 침식과 최근 화산 쇄설물이 결합된 독특한 극지 화산 지형으로 보존됨.',
    },
  ],
  fieldGuide: {
    satellitePoints: [
      '화산 정상을 덮고 있는 거대한 백색 빙모(Ice Cap)와 칼데라 윤곽',
      '화산체 남사면을 따라 흘러내린 흑색 용암류와 화산재 퇴적 흔적',
      '빙하 융빙수로 인해 형성된 주변 푈뤼르(Sandur) 범람 평원',
    ],
    bestVisitingTime: '6월 ~ 8월 (아이슬란드 백야 및 여름철 접근성 우수)',
  },
};
```

---

### [Step 4] 배열 등록 및 통합 내보내기
해당 카테고리 파일의 배열(`VOLCANIC_PLACES` 등)에 새로 만든 객체를 추가합니다.
`src/constants/places.ts`에서 자동으로 이를 취합하여 전역 `PRESET_PLACES`로 내보내므로, 별도의 추가 작업 없이 즉시 앱 전역에서 검색 및 슬라이드 연동이 활성화됩니다.

---

## 🛠️ 3. 신규 3D 지형 절차 수식 추가 방법 (고급 기여자)

기존 26개 지형 외에 완전히 새로운 지형 유형을 개발하는 경우:

1. **`src/components/terrain/generators/{category}.ts`에 수식 함수 정의**:
   ```typescript
   export function generateCustomLandform(x: number, y: number): number {
     // x, y ∈ [-1, 1], 반환값 z ≥ 0
     const r = Math.sqrt(x * x + y * y);
     return Math.max(0, 0.8 * Math.exp(-r * r * 4) + 0.1 * fbm(x * 3, y * 3));
   }
   ```
2. **`src/components/terrain/terrainGenerators.ts`의 스위치 분기에 등록**:
   ```typescript
   case '새지형이름':
     return generateCustomLandform(x, y);
   ```
3. **`src/components/terrain/contour/terrainContourMetadata.ts`에 등고선 간격 메타데이터 등록**:
   ```typescript
   '새지형이름': {
     maxElevation: 1200,
     majorInterval: 200,
     minorInterval: 40,
     unit: 'm'
   }
   ```

---

## ✅ 4. 기여 전 자가 검증 체크리스트 (Quality Checklist)

기여하기 전에 아래 항목을 반드시 점검하세요:

- [ ] **ID 유일성**: `id` 필드가 다른 명소와 충돌하지 않는 고유한 영문 소문자 케밥 케이스인가?
- [ ] **위경도 검증**: `lat`(위도, -90~90)과 `lng`(경도, -180~180)의 순서가 바뀌지 않았는가?
- [ ] **필수 4단계 진화사**: `evolutionStages` 배열의 길이가 정확히 4개이며 1~4단계 순서가 올바른가?
- [ ] **위성 관찰 3선**: `fieldGuide.satellitePoints` 배열에 정확히 3개의 구체적인 판독 지침이 포함되어 있는가?
- [ ] **TypeScript 정적 검사 통과**: `npm run build`를 실행하여 컴파일 오류가 없는지 확인하였는가?
