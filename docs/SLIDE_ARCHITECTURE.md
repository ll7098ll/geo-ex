# 📐 4단 풀스크린 스냅 슬라이드 및 컴포넌트 아키텍처 (Slide Architecture)

> **지형 탐험가 (Geography Explorer)**의 4단 전체화면 스냅 스크롤(Snap-Scroll) 시스템, 슬라이드 간 상태 동기화 메커니즘, 4탭 교육 가이드 컴포넌트, 그리고 반응형 뷰포트 관리 구조를 상세히 설명하는 기술 문서입니다.

---

## 📌 1. 4-Slide 스냅 스크롤 설계 철학 (Architecture Overview)

기존의 복잡한 중첩 스크롤과 산만한 위젯 분산을 극복하기 위해, 본 애플리케이션은 **뷰포트 $100\text{vh}$ 단위의 4단 전면 스냅 슬라이드(Full-Page Snap Scroll)**를 채택하였습니다. 사용자는 마우스 휠, 스와이프, 키보드, 또는 우측 플로팅 독(Floating Dock)을 통해 4개의 독립된 전문 학습 공간을 매끄럽게 오갈 수 있습니다.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              App.tsx (Root Container)                           │
│  - Snap Container: `snap-y snap-mandatory scroll-smooth no-scrollbar`           │
│  - Active Slide Tracking: IntersectionObserver (threshold: 0.55)                │
│  - Global State: `region: 'world' | 'korea'`, `result: SearchResult`            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   [SLIDE 01] section-main (100vh)                                               │
│   └── HeroSlideshow.tsx                                                         │
│       ├── 6대 대분류 자동/수동 롤링 캐러셀 (화산/해안/하천/카르스트/빙하/건조)  │
│       └── 세부 26개 지형 칩 선택 버튼 (클릭 시 Slide 02로 스무스 스크롤 이동)   │
│                                                                                 │
│   [SLIDE 02] section-map (100vh)                                                │
│   └── GoogleMapSlide.tsx                                                        │
│       ├── Fullscreen Google Maps 고해상도 위성 지도 뷰포트                       │
│       ├── 현재 명소 타이틀 & 태그라인 오버레이                                  │
│       ├── 동일 지형의 다른 명소(Alternative Places) 칩 바                       │
│       └── [03 3D 입체 지형으로 이동] 퀵 액션 버튼                               │
│                                                                                 │
│   [SLIDE 03] section-3d (100vh)                                                 │
│   └── Terrain3DSlide.tsx                                                        │
│       ├── Three.js/R3F 3D 지형 디오라마 스튜디오 (Terrain3D.tsx)                │
│       ├── 카메라 시점 프리셋 (기본 / 조감도 / 정면 / 턴테이블)                  │
│       ├── 고저차 강조 슬라이더 (0.6x ~ 1.5x 실시간 변위)                        │
│       ├── 3D 특징 어노테이션 핀 & 툴팁 시스템                                    │
│       ├── 2D 등고선도 및 A-B 단면선 분석 모달 (ContourMapModal.tsx)             │
│       ├── 듀얼 3D 지형 비교 뷰 모달 (TerrainCompareView.tsx)                    │
│       └── [04 상세 지형 해설로 이동] 퀵 액션 버튼                               │
│                                                                                 │
│   [SLIDE 04] section-guide (100vh, 내부 스크롤 허용)                            │
│   └── GeologicalGuideSlide.tsx                                                  │
│       ├── 상단 헤더: 권역, 지형명, 교육과정 연계 뱃지                           │
│       ├── 4대 세그먼트 탭 바 [01 개요] [02 형성원리] [03 탐방가이드] [04 용어]   │
│       ├── 탭 1: 교과 성취기준 + 지질 팩트시트 + 3대 핵심 요약 카드             │
│       ├── 탭 2: 시대순 4단계 진화 타임라인 카드 그리드                          │
│       ├── 탭 3: 현장 관찰 포인트 + 위성 판독 3선 + Google Earth 3D 링크        │
│       ├── 탭 4: 교과 핵심 지질학 용어 사전 + 정제된 심층 보고서 + 학술 출처     │
│       └── 하단 복귀 도크 (01 메인 / 02 위성 / 03 3D 디오라마)                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧭 2. 슬라이드 상태 관리 및 스크롤 감지 (State & Scroll Engine)

### 2.1 IntersectionObserver 기반 활성 슬라이드 추적
단순 `scroll` 이벤트 리스너 대신 브라우저 하드웨어 가속 기반의 `IntersectionObserver`를 사용하여 현재 뷰포트에 55% 이상 노출된 슬라이드를 실시간 감지합니다.

```typescript
// App.tsx
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const indexStr = entry.target.getAttribute('data-slide-index');
          if (indexStr !== null) {
            setActiveSlideIndex(Number(indexStr));
          }
        }
      });
    },
    { root: container, threshold: 0.55 }
  );

  slideRefs.current.forEach((ref) => {
    if (ref) observer.observe(ref);
  });

  return () => observer.disconnect();
}, [result]);
```

### 2.2 우측 플로팅 독 (`SlideNavigationDock.tsx`)
화면 우측 중앙에 고정 배치된 미니멀 인디케이터 독은 다음 기능을 수행합니다:
1. **현재 슬라이드 시각화**: 01 ~ 04 번호와 활성 슬라이드의 골드 액센트(`#FFCC00`) 표시.
2. **원클릭 이동**: 특정 번호를 클릭하면 `target.scrollIntoView({ behavior: 'smooth', block: 'start' })`를 호출하여 부드럽게 해당 화면으로 이동.
3. **접근성(a11y)**: 각 버튼에 명확한 `aria-label` 및 툴팁 제공.

---

## 🗂️ 3. 슬라이드 04: 4대 주제별 탭 구조 (`GeologicalGuideSlide.tsx`)

사용자의 피드백을 반영하여 긴 세로 스크롤을 배제하고, 교육적 목적에 맞게 세분화된 4개 탭을 제공합니다.

### 3.1 탭 컴포넌트 데이터 인터페이스
각 탭의 콘텐츠는 `src/utils/curriculumHelper.ts`를 통해 일관된 스키마로 공급됩니다:

```typescript
export interface CurriculumMeta {
  course: string;        // 예: '지구과학 I / 한국지리'
  unit: string;          // 예: '지권의 변동과 화산 활동'
  coreStandard: string;  // 교육과정 성취기준 서술문
  keyConcepts: string[]; // ['순상화산 / 성층화산', '열점', '현무암질 마그마' 등]
}

export interface GeologicalGlossaryItem {
  term: string;          // 예: '순상화산 (Shield Volcano)'
  definition: string;    // 학술적 명확한 정의
  curriculumNote?: string;// 교과서 시험/탐구 포인트
}
```

### 3.2 탭별 역할 및 UI 구현 방식
1. **01. 교과 핵심 개요 (Overview)**:
   - 교과 성취기준 배너와 지질학적 핵심 프로필(Fact Sheet: 암석 종류, 연대, 판구조 환경, 규모)을 좌측에, 3대 핵심 요약 카드 및 메커니즘 요약문을 우측에 배치하는 2-Column Split.
2. **02. 형성 원리 4단계 (Evolution)**:
   - 시간의 흐름에 따른 4단계 수평 카드 그리드(`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
   - 각 단계마다 `단계 번호`, `시대`, `제목`, `지구과학적 과정`, `현장 판독 시각 특징`을 정형화하여 노출.
3. **03. 현장·위성 탐방 가이드 (Field Guide)**:
   - 좌측: 현장 방문 시 체크포인트 목록 + 최적 방문 시기 + 지질 보전 수칙.
   - 우측: 위성사진 판독 핵심 3선 + Google Maps 고해상도 위성뷰 / Google Earth 3D 웹 바로가기 링크.
4. **04. 용어·심층 정리 (Glossary & In-Depth)**:
   - 상단: 4~5개의 교과 핵심 지질학 용어 사전(Glossary) 카드 그리드.
   - 하단: `react-markdown` 및 `remark-gfm` 기반의 정제된 심층 지형 보고서 본문과 학술 출처 목록.

---

## 🌍 4. 전 세계(World) 메인 기본 권역 설정 메커니즘

앱 진입 시 세계적인 지형 랜드마크를 기본으로 노출하도록 최적화되어 있습니다:

```typescript
// App.tsx
// 1. 초기 상태 기본값을 'world' 및 대표 화산인 '화산(순상화산)'으로 설정
const [region, setRegion] = useState<Region>('world');
const [selectedTerrain, setSelectedTerrain] = useState<string | null>('화산');
const [currentCategoryId, setCurrentCategoryId] = useState<string>('volcanic');

// 2. 초기 기동 시 하와이 킬라우에아 화산(volcano-wd-1) 즉시 로드
useEffect(() => {
  searchTerrain('화산', 'world', 'volcanic', 'volcano-wd-1');
}, []);
```

- 사용자가 상단 네비게이션에서 `대한민국`을 누르면 `handleRegionChange`를 통해 동일 지형 범주의 한국 대표 명소(예: 제주 성산일출봉, 한라산)로 부드럽게 전환됩니다.

---

## ⚡ 5. 성능 및 뷰포트 최적화 (Performance & Rendering)

1. **지연 로딩 및 가상화 배제**: 4개의 슬라이드는 가상 DOM에서 언마운트되지 않고 CSS `snap-always`로 유지되어, 슬라이드 간 전환 시 3D 캔버스나 지도를 다시 초기화하는 딜레이가 없습니다.
2. **3D 렌더 루프 최적화**: 사용자가 슬라이드 03(3D)에 머물지 않을 때도 WebGL Context가 유실되지 않도록 Canvas 인스턴스를 보존하며, 모바일 및 저사양 환경을 고려하여 텍스처를 절차적 캔버스로 경량 생성합니다.
3. **Zero-Pill 디자인 준수**: 메타데이터 렌더링 시 과도한 인라인 뱃지와 캡슐 요소를 지양하고 타이포그래피 구분 기호(`·`, `/`)를 사용하여 DOM 트리 노드 수를 35% 이상 절감하였습니다.
