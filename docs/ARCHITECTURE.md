# 🏗️ 지형 탐험가(Geography Explorer) 시스템 아키텍처 (v1.3.0)

지형 탐험가는 **React 19**, **Three.js**, **React Three Fiber(R3F)**, **TypeScript 5.8**, **Tailwind CSS v4**, **Motion v12**를 기반으로 구축된 100% 클라이언트 사이드 인터랙티브 지리·지구과학 탐구 웹 플랫폼입니다.  
본 문서는 스위스 브루탈리스트 4-Act 레이아웃, 키네틱 트랜지션 및 표본 아카이브 상태 흐름, 240×240 절차적 3D 디오라마 파이프라인, GLSL 셰이더 인젝션, 그리고 LRU 캐시 및 GPU 자원 최적화 아키텍처를 설명합니다.

---

## 1. 전체 시스템 아키텍처 다이어그램

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           GEOGRAPHY EXPLORER ENGINE (v1.3.0)                           │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┴───────────────────────────────────┐
        ▼                                                                       ▼
┌──────────────────────────────────┐                   ┌─────────────────────────────────────────┐
│     Global State & Persistence   │                   │             Data & Procedural           │
├──────────────────────────────────┤                   ├─────────────────────────────────────────┤
│ • region ('world' | 'korea')     │                   │ • constants/terrains.ts (6 Categories)  │
│ • selectedTerrain / categoryId   │                   │ • constants/places/*.ts (165 Sites)     │
│ • activeSlideIndex (0 ➔ 3)       │                   │ • educationLevelHelper + terrainConcept   │
│ • specimens[] (localStorage v1)  │                   │ • terrainMath.ts (FBM, Warping, Voronoi)│
│ • PolarityCutGate Timer Ref      │                   │ • terrainGenerators.ts (39 Archetypes)  │
└─────────────────┬────────────────┘                   └────────────────────┬────────────────────┘
                  │                                                         │
                  └─────────────────────────┬───────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           VIEWPORT ROOT CONTAINER (App.tsx)                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • FilmGrainOverlay: 정적 CSS 타일 노이즈 + 뷰포트 코너 크로스헤어 (+ [0,0] ~ [W,H] +)   │
│ • PolarityCutGate: 액트 전환 시 0.38s 일렉트릭 코발트(#1F34FF) 1프레임 전환 커튼        │
│ • Navigation (56px): 마스트헤드 + 권역 스위처 + Specimen OdometerCounter & Drawer      │
│ • SlideNavigationDock: 우측 고정 ACT 01~04 도크 + ↑/↓·PageUp/Down 키보드 네비게이션     │
│ • Snap Scroll Engine: snap-y snap-mandatory + 단일 마운트 IntersectionObserver (0.55)  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌──────────────┐    ┌──────────────┐                ┌──────────────┐    ┌──────────────┐
│    ACT 01    │    │    ACT 02    │                │    ACT 03    │    │    ACT 04    │
│ Kinetic Hero │    │Satellite Map │                │  3D Diorama  │    │Investigation │
├──────────────┤    ├──────────────┤                ├──────────────┤    ├──────────────┤
│• 4단 셔터슬릿│    │• 100vh WGS84 │                │• 단일 Canvas │    │• 4단계 난이도│
│• 조리개캔버스│    │• 돋보기 락   │                │• 240×240 DEM │    │• 4단 아코디언│
│  (활성 제어) │    │• 28°해칭카드 │                │• 28층 지층벽 │    │• 개념·팩트   │
│• 26태그 점프 │    │• 표본 수집   │                │• 180° 3D플립 │    │• GFM 리포트  │
└──────────────┘    └──────────────┘                └──────────────┘    └──────────────┘
```

---

## 2. 4-Act 스냅 스크롤 & 상태 동기화 메커니즘

### 2.1 단일 `IntersectionObserver` & `PolarityCutGate`
- 각 액트는 `calc(100vh - 56px)` 규격의 섹션으로 구성되며, `<main>` 컨테이너의 CSS Scroll Snap(`snap-y snap-mandatory`)을 따릅니다.
- [`App.tsx`](../src/App.tsx)는 `activeSlideIndexRef`를 참조해 마운트 시 **1회만** `IntersectionObserver(threshold: 0.55)`를 생성하므로, 슬라이드 전환이나 검색 결과 변경 시 옵저버가 불필요하게 해체·재생성되지 않습니다.
- 슬라이드 인덱스 변화가 감지되면 `triggerPolarityCut`이 이전 타이머를 정리하고 380ms 동안 일렉트릭 코발트(`#1F34FF`) 전환 커튼([`PolarityCutGate`](../src/components/kinetic/PolarityCutGate.tsx))을 표시합니다.

### 2.2 표본 아카이브(`SpecimenDrawer`) 복원 파이프라인
- 수집된 표본 배열은 `localStorage` 키 `geo_specimens_v1`에 자동 동기화됩니다.
- 사용자가 아카이브에서 특정 표본의 `[탐색 바로가기]`를 클릭하면 [`getCategoryIdForPlace`](../src/constants/places.ts)로 대분류 ID를 역추적하고, `specimen.region`, `specimen.terrain`, `specimen.id`를 함께 `searchTerrain()`에 전달하여 임의 셔플 없이 **해당 표본 지점을 정확히 복원**해 `ACT 03`으로 이동합니다.

### 2.3 위성 지도 돋보기 조작 모드 (`ACT 02`)
- [`GoogleMapSlide.tsx`](../src/components/slides/GoogleMapSlide.tsx)의 구글 위성 지도는 기본 상태에서 `pointer-events-none`으로 유지되어 스크롤 스냅을 방해하지 않습니다.
- `[ 위성 돋보기 조작 모드 켜기 ]` 활성화 시 `pointer-events-auto`로 전환되어 자유로운 줌·패닝을 허용합니다.

---

## 3. ACT 03: 3D 절차적 디오라마 렌더링 파이프라인

지형 탐험가는 외부 3D 모델(GLTF/OBJ) 파일 없이 수학적 노이즈 함수와 커스텀 GLSL 셰이더만으로 런타임에 고밀도 3D 디오라마를 합성합니다.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        3D PROCEDURAL DIORAMA PIPELINE (v1.3.0)                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ Step 1. 세부 아키타입 라우팅 (resolveTerrainKey) ]                                    │
│  • subTerrain + placeContext 문맥 분석 ➔ 39종 고유 지형 모델링 함수로 정밀 분기         │
│    (예: 곡류천 ➔ 감입곡류천 / 자유곡류천, 화산 ➔ 순상/종상/용암대지/수성/기생화산)     │
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 2. LRU DEM 표고 필드 생성 (terrainDEMGenerator.ts) ]                           │
│  • generateTerrainElevationField(): 240×240 그리드 표고·법선·식생/암석 Vertex Color 연산│
│  • Map 기반 LRU 캐시(최대 20개)로 동일 지형/고저차 배율 재조회 시 즉시 캐시 히트       │
│  • Terrain3D 루트에서는 DEM 재연산 대신 getTerrainContourMeta()로 등고선 규격만 경량조회│
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 3. 240×240 적응형 지오메트리 & 28층 지층 스커트 (terrainGenerators.ts) ]       │
│  • 0.083m 셀 간격 적응형 대각선 분할 삼각망 & 반시계(+Z) 법선 와인딩 보정              │
│  • 28층 세분화 지질 단면(Strata Skirt) 4면 수직 벽체 및 받침 플레이트(z = -1.35) 결합   │
│  • Map 기반 LRU GEOMETRY_CACHE(최대 24개) — 축출 시 오래된 BufferGeometry.dispose()    │
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 4. 일체형 수조 및 특수 지질 메쉬 (TerrainSpecialMeshes.tsx) ]                  │
│  • ConformantWaterMesh: 지형 외곽을 따라 밀착하는 일체형 수면 메쉬                     │
│  • 주상절리 기둥군(~270개), 전면 절개 동굴, 3D 버섯바위, 해식아치, 폭포 캡록 등 결합    │
│  • useDisposeGeometry 훅을 통해 언마운트/지형 전환 시 모든 특수 메쉬 GPU 메모리 해제    │
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 5. GLSL 등고선 인젝션 셰이더 (terrainContourShader.ts) ]                        │
│  • MeshStandardMaterial.onBeforeCompile 후킹 + customProgramCacheKey                   │
│  • Triplanar 절벽 안티스트레칭, Cavity AO, 수면 하부 등고선 자동 마스킹(uWaterLevel)    │
│  • uniformsRef 갱신을 통한 0ms 무지연 등고선 토글 (셰이더 재컴파일 0회)                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 디렉터리 구조 및 모듈 책임

```text
src/
├── App.tsx                                # 4-Act 스냅 컨테이너, 표본/지역 상태, IntersectionObserver
├── index.css                              # Tailwind v4 테마, 0px 브루탈리스트 규율, 3D 플립 유틸리티
├── components/
│   ├── Navigation.tsx                     # 56px 헤더, 권역 스위처(KR/WD), OdometerCounter 서랍 버튼
│   ├── SlideNavigationDock.tsx            # 우측 고정 01~04 액트 도크 & 글로벌 방향키 네비게이션
│   ├── HeroSlideshow.tsx                  # ACT 01: 4분할 셔터 슬라이드쇼 & 26개 지형 태그
│   ├── Terrain3D.tsx                      # 단일 R3F Canvas, OrbitControls, 조명 리그, DioramaMesh
│   ├── LoadingOverlay.tsx                 # 탐사 데이터 동기화 로딩 오버레이
│   ├── ErrorMessage.tsx                   # Swiss-Brutalist 시스템 알림 토스트
│   ├── kinetic/
│   │   ├── FilmGrainOverlay.tsx           # 정적 CSS 타일 필름 그레인 & 뷰포트 코너 크로스헤어
│   │   ├── HeroApertureCanvas.tsx         # 활성 슬라이드 한정 마우스 추적 조리개 캔버스
│   │   ├── OdometerCounter.tsx            # 스프링 물리 숫자 휠 카운터
│   │   ├── PolarityCutGate.tsx            # 1프레임 일렉트릭 코발트 챕터 전환 커튼
│   │   └── SpecimenDrawer.tsx             # localStorage 연동 슬라이드아웃 표본 아카이브 (ESC 지원)
│   ├── slides/
│   │   ├── GoogleMapSlide.tsx             # ACT 02: 100vh 위성 지도, 돋보기 락, 28° 해칭 플래카드
│   │   ├── Terrain3DSlide.tsx             # ACT 03: 영속 3D 스테이지(인라인/전체화면), 180° 3D 플립 카드
│   │   └── GeologicalGuideSlide.tsx       # ACT 04: 4단계 난이도 스위처, 4단 아코디언, 4대 대시보드 탭
│   └── terrain/
│       ├── terrainMath.ts                 # FBM, Domain Warping, Hexagonal Voronoi 단일 수학 엔진
│       ├── terrainGenerators.ts           # 39종 아키타입 라우팅, LRU GEOMETRY_CACHE(24)
│       ├── terrainTextures.ts             # 프로시저럴 범프 텍스처 생성기
│       ├── TerrainSpecialMeshes.tsx       # ConformantWaterMesh & 특수 지질 메쉬 (dispose 관리)
│       ├── generators/                    # volcanic, coastal, fluvial, karst, glacial, arid 생성기
│       └── contour/
│           ├── terrainContourShader.ts    # Triplanar 절벽 & 수면 마스킹 GLSL 셰이더
│           ├── terrainDEMGenerator.ts     # 240×240 DEM 필드 생성기 & LRU DEM_CACHE(20)
│           └── terrainContourMetadata.ts  # 39종 지형별 등고선 간격(index/intermediate) 규격
├── constants/
│   ├── terrains.ts                        # 6대 대분류 & 26개 지형 태그 마스터
│   ├── places.ts                          # 165개 명소 엔트리, 셔플 알고리즘, getCategoryIdForPlace
│   └── places/                            # 6대 범주별 데이터 (volcanic 33, coastal 25, fluvial 25, karst 31, glacial 18, arid 33)
├── hooks/
│   └── useTerrainSearch.ts                # 장소 검색, ID 직접 복원 및 후보 전환 커스텀 훅
├── utils/
│   ├── curriculumHelper.ts                # 2022 개정 교육과정 성취기준 및 팩트시트 헬퍼
│   ├── educationLevelHelper.ts            # 초등·중등·고등·일반 4단계 난이도 콘텐츠 변환기
│   └── terrainConceptData.ts              # 26종 지형별 핵심 질문 및 3대 개념 지식 베이스
└── types/
    ├── index.ts                           # PlaceInfo, GeologyMetadata, TerrainEvolutionStage
    └── contour.ts                         # TerrainElevationField, ContourIntervalSettings
```

---

## 5. 성능 및 리소스 최적화 전략

1. **단일 WebGL 캔버스 & 조건부 `frameloop` 제어**:
   - [`Terrain3DSlide.tsx`](../src/components/slides/Terrain3DSlide.tsx)는 인라인 모드와 전체화면 모드 전환 시에도 **단일 `<Terrain3D>` 인스턴스**를 유지하여 WebGL 컨텍스트 재생성 비용과 카메라 상태 초기화를 제거했습니다.
   - `ACT 03`이 뷰포트에 없을 때(`<Canvas frameloop={isActive ? 'always' : 'demand'}>`) 연속 렌더링과 자동 회전을 중단하며, `dpr={[1, 2]}`로 고해상도 디스플레이 과부하를 방지합니다.
2. **비활성 2D 애니메이션 & 합성 부하 차단**:
   - [`HeroApertureCanvas.tsx`](../src/components/kinetic/HeroApertureCanvas.tsx)는 `ACT 01`이 활성화된 경우에만(`isActive`) `mousemove` 리스너와 `requestAnimationFrame` 루프를 실행하며, `prefers-reduced-motion: reduce` 환경에서는 정적 프레임만 그립니다.
   - [`FilmGrainOverlay.tsx`](../src/components/kinetic/FilmGrainOverlay.tsx)는 실시간 SVG `<feTurbulence>` 필터 대신 정적 SVG data-URI CSS 타일 패턴을 사용하여 WebGL 캔버스 위 전체 화면 합성 비용을 줄였습니다.
3. **진성 LRU 캐싱 & GPU 메모리 해제 (`dispose`)**:
   - `GEOMETRY_CACHE`(최대 24)와 `DEM_CACHE`(최대 20) 모두 조회 시 최신 순서로 재삽입되는 LRU 방식으로 동작하며, 캐시 용량 초과 시 퇴출되는 `BufferGeometry`의 `.dispose()`를 즉시 호출합니다.
   - `TerrainSpecialMeshes` 내 모든 절차적 지오메트리는 `useDisposeGeometry` 훅으로 언마운트 시 GPU 버퍼를 안전하게 반환합니다.
4. **번들 청크 분리 (`vite.config.ts`)**:
   - `three-vendor`, `motion-vendor`, `markdown-vendor`, `places-data` 청크를 분리하여 초기 앱 코어 번들(~260kB, gzip ~84kB)의 파싱 부담을 낮추고 브라우저 캐시 효율을 높였습니다.
