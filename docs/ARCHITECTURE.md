# 🏗️ 지형 탐험가(Geography Explorer) 시스템 아키텍처

지형 탐험가는 **React 19**, **Three.js**, **React Three Fiber(R3F)**, **TypeScript 5.8**, **Tailwind CSS v4**를 기반으로 구축된 차세대 인터랙티브 3D 지리·지구과학 탐구 웹 플랫폼입니다.  
본 문서는 플랫폼의 전체 시스템 계층 구조, 4단 풀스크린 스냅 스크롤 동기화 메커니즘, 240×240 적응형 절차적 3D 지형 생성 엔진, 그리고 GLSL 셰이더 인젝션 파이프라인을 상세히 설명합니다.

---

## 1. 전체 시스템 아키텍처 다이어그램

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               GEOGRAPHY EXPLORER ENGINE                                │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┴───────────────────────────────────┐
        ▼                                                                       ▼
┌──────────────────────────────────┐                   ┌─────────────────────────────────────────┐
│     Global State Management      │                   │             Data Pipelines              │
├──────────────────────────────────┤                   ├─────────────────────────────────────────┤
│ • Region State ('world' | 'kr')  │                   │ • constants/terrains.ts (6 Categories)  │
│ • selectedTerrain (26 Tag Types) │                   │ • constants/places/*.ts (165 Sites)     │
│ • activeSlideIndex (0 ➔ 3)       │                   │ • terrainMath.ts (FBM, Warping, Voronoi)│
│ • useTerrainSearch Custom Hook   │                   │ • terrainGenerators.ts (39 Archetypes)  │
└─────────────────┬────────────────┘                   └────────────────────┬────────────────────┘
                  │                                                         │
                  └─────────────────────────┬───────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           VIEWPORT ROOT CONTAINER (App.tsx)                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • Top Header (Navigation.tsx): 내셔널지오그래픽 에디토리얼 마스트헤드 및 권역 전환 셀렉터      │
│ • Right Dock (SlideNavigationDock.tsx): 4단 슬라이드 양방향 인디케이터 플로팅 독       │
│ • Snap Scroll Engine: snap-y snap-mandatory (100vh) + IntersectionObserver (55% 임계값)│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌──────────────┐    ┌──────────────┐                ┌──────────────┐    ┌──────────────┐
│   SLIDE 01   │    │   SLIDE 02   │                │   SLIDE 03   │    │   SLIDE 04   │
│  Cover Hero  │    │Satellite Map │                │  3D Diorama  │    │Field Journal │
├──────────────┤    ├──────────────┤                ├──────────────┤    ├──────────────┤
│• 6대 대분류  │    │• WGS84 좌표계│                │• 240×240 DEM │    │• 4대 심층 탭 │
│• 26종 세부   │    │  고해상도 위성│                │• 28층 지질단면│    │  (개요/진화/ │
│• 6초 자동롤링│    │• 돋보기 조작 락│                │• 일체형 수조 │    │   탐방/보고서)│
│• 원클릭 탐색 │    │• 연계 지형 칩│                │• GLSL 셰이더 │    │• 2022 교육과정│
└──────────────┘    └──────────────┘                └──────────────┘    └──────────────┘
```

---

## 2. 4단 풀스크린 스냅 스크롤 및 상태 동기화 메커니즘

각 슬라이드는 `calc(100vh - 56px)` 높이의 개별 뷰포트 섹션으로 구동되며, 브라우저의 네이티브 CSS Scroll Snap(`snap-y snap-mandatory`)과 `IntersectionObserver`가 결합되어 매끄러운 화면 전환과 상태 동기화를 보장합니다.

```
[ 사용자 휠 / 터치 제스처 / 우측 도크 퀵 점프 클릭 ]
                         │
                         ▼
   main.snap-y.snap-mandatory 뷰포트 스냅 컨테이너 스크롤
                         │
                         ▼
   IntersectionObserver 감시 (Threshold: 0.55 / 55% 가시영역 진입)
                         │
                         ▼
        activeSlideIndex 상태 실시간 갱신 (0 ➔ 1 ➔ 2 ➔ 3)
                         │
                         ▼
   SlideNavigationDock 우측 인디케이터 독 활성 상태 및 툴팁 실시간 반영
```

### 돋보기 인터랙티브 모드 (Slide 02)
Slide 02의 구글 위성 지도는 100vh 전체화면 iframe으로 렌더링됩니다. 이때 지도 내부 드래그/줌 조작과 페이지 스냅 스크롤이 충돌하는 현상을 원천 방지하기 위해 **위성 지도 조작 모드(스크롤 잠금 토글)**를 탑재하였습니다:
- **일반 모드**: 지도 레이어가 `pointer-events-none` 상태로 유지되어 마우스 휠 동작 시 Slide 03으로 자연스럽게 스크롤 스냅.
- **조작 모드**: `isInteractiveMode = true` 시 지도 레이어가 `pointer-events-auto`로 활성화되어 자유로운 줌/팬 이동 지원.

---

## 3. Slide 03: 3D 절차적 디오라마 렌더링 파이프라인 (v1.2.0)

지형 탐험가는 대용량 3D 파일(GLTF/OBJ)을 다운로드하는 대신, 수치 지형 수학(Procedural Noise)과 WebGL 커스텀 GLSL 셰이더를 통해 런타임에 지형 디오라마를 즉시 절차 합성합니다.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        3D PROCEDURAL DIORAMA PIPELINE (v1.2.0)                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ Step 1. 세부 아키타입 라우팅 (resolveTerrainKey) ]                                    │
│  • category (화산, 해안, 하천, 카르스트, 빙하, 건조)                                    │
│  • subTerrain (26종 기본 지형) + placeContext (지질 맥락)                              │
│  • 39종 고유 지형 아키타입(순상화산, 감입곡류천, 파식대, 카렌 등)으로 정밀 분기        │
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 2. Single Source of Truth: DEM 표고 필드 생성 ]                                │
│  • generateTerrainElevationField() 호출                                                │
│  • 240×240 정규화 그리드 좌표 (x, y)에 대해 수학적 표고 평가 (fbm, warpedFbm, voronoi) │
│  • 지표면 정점 높이(Float32Array) 및 기복별 암석/식생 Vertex Color 연산                 │
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 3. 240×240 적응형 지오메트리 빌드 (generateTerrainDioramaGeometry) ]            │
│  • 0.083m 셀 간격의 고밀도 삼각망 대각선 적응 분할 (약 115,000 버텍스)                 │
│  • 상면 와인딩 정상화: 반시계 방향(+Z 법선) 보정으로 법선 벡터 왜곡 방지               │
│  • 28층 세분화 지질 단면(Strata Skirt): 4개 수직 벽면에 28단계 층리 지오메트리 구축   │
│  • 바닥 받침 플레이트(Base Pedestal, z = -1.35) 결합                                  │
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 4. 일체형 수조 수면 및 특수 지질 메쉬 결합 ]                                   │
│  • ConformantWaterMesh: 디오라마 외벽과 단차 없이 밀착 결합되는 전용 수면 메쉬          │
│  • TerrainSpecialMeshes: 주상절리 기둥군(~270개), 전면 절개동굴 2종, 3D 버섯바위,     │
│    해식아치, 폭포 캡록, 칼데라 용암호 등 실체화 메쉬 오버레이                          │
│                                                                                        │
│                                           │                                            │
│                                           ▼                                            │
│  [ Step 5. GLSL 등고선 인젝션 셰이더 (injectContourShader) ]                           │
│  • Three.js MeshStandardMaterial.onBeforeCompile 후킹                                  │
│  • Triplanar 수직 절벽 마이크로 텍스처링 (텍스처 늘어남 방지 및 미세 층리 합성)        │
│  • 수면 하부 등고선 마스킹 (aboveWater = z >= uWaterLevel - 0.015)                     │
│  • 골드 / 잉크 / 사이언 3대 등고선 테마 및 경사도 히트맵, 능선/계곡 판독선 실시간 렌더  │
│  • Three.js Uniforms 캐시를 통한 0ms 무지연 온/오프 토글 (재컴파일 0회)                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 디렉터리 구조 및 컴포넌트 계층 트리

```text
src/
├── App.tsx                                # 최상위 4단 풀스크린 스냅 컨테이너 및 전역 상태 관리
├── components/
│   ├── Navigation.tsx                     # 에디토리얼 매거진 마스트헤드 (권역 전환 및 커버 리셋)
│   ├── SlideNavigationDock.tsx            # 우측 고정 4단 슬라이드 퀵 점프 플로팅 독 (01~04)
│   ├── HeroSlideshow.tsx                  # SLIDE 01: 6대 대분류 롤링 캐러셀 & 26개 지형 태그
│   ├── LoadingOverlay.tsx                 # 지형 및 장소 로딩 오버레이
│   ├── ErrorMessage.tsx                   # 에러 피드백 토스트
│   ├── slides/
│   │   ├── GoogleMapSlide.tsx             # SLIDE 02: 100vh 구글 위성지도 & 조작 돋보기 모드
│   │   ├── Terrain3DSlide.tsx             # SLIDE 03: 3D 지형 디오라마 HUD & 지질 프로필 플래카드
│   │   └── GeologicalGuideSlide.tsx       # SLIDE 04: 에디토리얼 심층 4대 탭 교육 가이드
│   ├── Terrain3D.tsx                      # Three.js Canvas, OrbitControls, 셰이더 연결 캔버스
│   └── terrain/
│       ├── terrainMath.ts                 # 절차적 노이즈(FBM, Warping, Hexagonal Voronoi) 엔진
│       ├── terrainGenerators.ts           # 39종 지형 아키타입 라우팅 및 240×240 디오라마 빌더
│       ├── terrainTextures.ts             # 프로시저럴 범프 텍스처 (암석, 사구, 빙하 등)
│       ├── TerrainAnnotationsData.ts      # 지형별 3D 인터랙티브 주해 핀 데이터
│       ├── TerrainSpecialMeshes.tsx       # 주상절리 기둥군, 절개동굴 등 26종 특수 지질 메쉬
│       ├── generators/                    # 6대 범주별 절차적 고도 생성기 모듈
│       │   ├── volcanic.ts                # 순상/성층/종상화산, 칼데라, 용암대지, 주상절리 등
│       │   ├── coastal.ts                 # 해식애, 파식대, 시스택, 사주·사취, 갯벌, 석호 등
│       │   ├── fluvial.ts                 # 선상지, 곡류천, 감입곡류천, 삼각주, 범람원, 폭포 등
│       │   ├── karst.ts                   # 석회동굴, 돌리네, 탑 카르스트, 카렌 등
│       │   ├── glacial.ts                 # U자곡, 피오르드, 호른, 권곡, 모레인 등
│       │   └── arid.ts                    # 사막, 버섯바위, 오아시스, 플라야, 와디, 메사·뷰트 등
│       └── contour/                       # 3D 등고선 셰이더 및 DEM 표고 연산기
│           ├── terrainContourShader.ts    # Triplanar 절벽 & 수면 마스킹 GLSL 인젝션 셰이더
│           ├── terrainDEMGenerator.ts     # 240×240 정규화 DEM 표고 필드 생성기
│           └── terrainContourMetadata.ts  # 지형별 등고선 주곡선/계곡선 사양 정의
├── constants/
│   ├── terrains.ts                        # 6대 대분류 및 26개 기본 지형 태그 마스터
│   ├── places.ts                          # 165개 지질 명소 통합 엔트리 및 다채로운 장소 선택 알고리즘
│   └── places/                            # 6대 카테고리별 165개 전수 지질 명소 데이터베이스
│       ├── volcanic.ts                    # 화산 지형 명소 (33개소)
│       ├── coastal.ts                     # 해안 지형 명소 (25개소)
│       ├── fluvial.ts                     # 하천 지형 명소 (25개소)
│       ├── karst.ts                       # 카르스트 지형 명소 (31개소)
│       ├── glacial.ts                     # 빙하 지형 명소 (18개소)
│       └── arid.ts                        # 건조 지형 명소 (33개소)
├── hooks/
│   └── useTerrainSearch.ts                # 지형 검색, 장소 셔플 및 상태 관리 커스텀 훅
├── utils/
│   └── curriculumHelper.ts                # 2022 개정 교육과정 연계 메타데이터, 팩트시트, 용어사전 헬퍼
└── types/
    ├── index.ts                           # GeologicalMetadata, PlaceInfo, EvolutionStage 타입
    └── contour.ts                         # DEM 필드 및 등고선 사양 인터페이스
```

---

## 5. 성능 및 리소스 최적화 전략

1. **지오메트리 캐싱 (`GEOMETRY_CACHE`)**:
   - `카테고리-서브지형-고저차배율-지층표시-진화단계-재질` 복합 키를 기반으로 생성된 버퍼 지오메트리를 메모리에 캐싱하여 렌더링 지연을 방지합니다.
2. **셰이더 재컴파일 0회 원칙**:
   - 등고선 ON/OFF, 지층 표시, 테마 변경 시 Three.js WebGL 셰이더를 다시 컴파일하지 않고 `uniformsRef`를 통해 유니폼 버퍼만 0ms 지연으로 갱신하여 60 FPS 프레임을 방어합니다.
3. **가비지 컬렉션 및 WebGL 컨텍스트 보호**:
   - 컴포넌트 언마운트 시 지오메트리 및 텍스처의 `dispose()` 라이프사이클을 철저히 관리하여 탭 전환 시 메모리 누수를 원천 차단합니다.
