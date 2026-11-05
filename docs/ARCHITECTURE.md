# 지형 탐험가(Geography Explorer) 시스템 아키텍처

지형 탐험가는 React 19, Three.js, React Three Fiber(R3F), Tailwind CSS v4를 기반으로 구축된 4단 풀스크린 스냅 스크롤 지리·지구과학 탐구 웹 플랫폼입니다.

---

## 1. 전체 시스템 아키텍처 다이어그램

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GEOGRAPHY EXPLORER ENGINE                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌──────────────────────┐                                  ┌──────────────────────┐
│  State Management    │                                  │   Data Pipelines     │
├──────────────────────┤                                  ├──────────────────────┤
│ • Region (korea/wd)  │                                  │ • terrains.ts (6 Cat)│
│ • selectedTerrain    │                                  │ • places/*.ts (112)  │
│ • activeSlideIndex   │                                  │ • terrainMath.ts     │
│ • useTerrainSearch   │                                  │ • terrainTextures.ts │
└──────────┬───────────┘                                  └──────────┬───────────┘
           │                                                         │
           └────────────────────────┬────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    VIEWPORT ROOT CONTAINER (App.tsx)                   │
├────────────────────────────────────────────────────────────────────────┤
│ • Top Header (Navigation.tsx): 권역 전환 (전 세계 60 / 대한민국 52)     │
│ • Right Dock (SlideNavigationDock.tsx): 4단 슬라이드 퀵 점프 도크      │
│ • Snap Scroll Engine: snap-y snap-mandatory + IntersectionObserver    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌────────────────┬──────────────┴────────────────┬────────────────┐
    ▼                ▼                               ▼                ▼
┌──────────────┐ ┌──────────────┐             ┌──────────────┐ ┌──────────────┐
│  SLIDE 01    │ │  SLIDE 02    │             │  SLIDE 03    │ │  SLIDE 04    │
│  Main Hero   │ │  Satellite   │             │  3D Diorama  │ │  Geological  │
├──────────────┤ ├──────────────┤             ├──────────────┤ ├──────────────┤
│• 6대 대분류  │ │• WGS84 좌표  │             │• R3F 절차 지형│ │• 지질 프로필 │
│• 26종 세부   │ │  위성 뷰     │             │• 3D 등고선   │ │• 4단계 진화  │
│• 즉시 탐색   │ │• 연계 지형 퀵│             │• 지층 단면   │ │• 현장 가이드 │
│• 6초 자동롤링│ │  표본 전환   │             │• 고저차 배율 │ │• 교육과정    │
└──────────────┘ └──────────────┘             └──────────────┘ └──────────────┘
```

---

## 2. 4단 풀스크린 스냅 스크롤 및 상태 동기화 메커니즘

각 슬라이드는 `calc(100vh - 56px)` 높이의 단일 뷰포트 섹션으로 구성되며, CSS Scroll Snap과 브라우저 `IntersectionObserver`가 완벽하게 결합되어 동작합니다.

```
[ 사용자 휠 / 터치 스와이프 / 우측 도크 클릭 ]
                     │
                     ▼
  main.snap-y.snap-mandatory (뷰포트 스크롤)
                     │
                     ▼
  IntersectionObserver (Threshold: 55%)
                     │
                     ▼
       activeSlideIndex 상태 실시간 갱신 (0 ➔ 1 ➔ 2 ➔ 3)
                     │
                     ▼
    SlideNavigationDock 우측 도크 활성 핀 하이라이트 동기화
```

---

## 3. Slide 03: 3D 절차적 디오라마 & 셰이더 파이프라인

Slide 03은 Three.js 및 R3F 기반의 고성능 3D 렌더러로 구동되며, 수학적 노이즈 알고리즘과 커스텀 GLSL 셰이더를 통해 자연 지형과 등고선을 실시간 합성합니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        3D DIORAMA RENDER PIPELINE                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ 입력 파라미터 ]                                                      │
│  • category (화산, 해안, 하천, 카르스트, 빙하, 건조)                   │
│  • subTerrain (26종 세부 지형)                                         │
│  • reliefScale (1.0x / 1.3x / 1.6x)                                    │
│  • showStrata (지층 단면 온/오프)                                      │
│  • show3DContours (3D 골드 등고선 셰이더 온/오프)                      │
│                                                                        │
│                                   │                                    │
│                                   ▼                                    │
│  [ 절차적 지오메트리 엔진 (generateTerrainDioramaGeometry) ]            │
│  • Fractional Brownian Motion (fBm) + Domain Warping 표고 연산         │
│  • 지표면 메쉬 버텍스 생성 및 고도별 Vertex Color 맵핑                 │
│  • 지오메트리 4면 지층 단면(Strata) 스커트 및 바닥면 생성              │
│                                                                        │
│                                   │                                    │
│                                   ▼                                    │
│  [ 커스텀 GLSL 셰이더 주입 (injectContourShader) ]                     │
│  • MeshStandardMaterial.onBeforeCompile 후킹                           │
│  • 월드 고도(World Elevation) 기반 골드 밴딩(Gold Isoline) 실시간 계산 │
│  • Uniform 캐시를 통해 0ms 지연시간으로 실시간 등고선 온/오프 토글     │
│                                                                        │
│                                   │                                    │
│                                   ▼                                    │
│  [ 특수 지질 메쉬 오버레이 (TerrainSpecialMeshes) ]                    │
│  • 화산 분화구 / 마그마 방 / 용암동굴 / 주상절리 기둥 클러스터 실체화   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 컴포넌트 계층 트리

```
src/
├── App.tsx                        // 루트 뷰포트 & 스냅 스크롤 컨테이너
├── components/
│   ├── Navigation.tsx             // 상단 네비게이션 (권역 변경, 홈 리셋)
│   ├── SlideNavigationDock.tsx    // 우측 플로팅 4단 슬라이드 퀵 점프 도크
│   ├── LoadingOverlay.tsx         // 탐색 전환 시 전체화면 로딩
│   ├── ErrorMessage.tsx           // 에러 토스트
│   ├── HeroSlideshow.tsx          // Slide 01: 메인 히어로 배너 슬라이더
│   ├── slides/
│   │   ├── GoogleMapSlide.tsx     // Slide 02: 풀스크린 위성 지도
│   │   ├── Terrain3DSlide.tsx     // Slide 03: 3D 지형 디오라마 & 시각화 HUD
│   │   └── GeologicalGuideSlide.tsx // Slide 04: 4탭 지질학 해설
│   ├── Terrain3D.tsx              // R3F 3D 캔버스, OrbitControls, 셰이더 연결
│   └── terrain/
│       ├── TerrainSpecialMeshes.tsx // 지형별 커스텀 3D 구조물
│       ├── TerrainAnnotationsData.ts // 3D 지형 주해 데이터
│       ├── terrainGenerators.ts   // 26종 지형 고도 생성 진입점
│       ├── terrainMath.ts         // 노이즈, 워핑, 펄린, 육각 보로노이 수학
│       ├── terrainTextures.ts     // 프로시저럴 범프 텍스처
│       ├── generators/            // 6대 대분류별 세부 고도 생성기 모듈
│       └── contour/
│           ├── terrainContourShader.ts   // 3D 등고선 GLSL 인젝션 셰이더
│           ├── terrainDEMGenerator.ts    // 표고 필드 및 등고선 간격 연산기
│           └── terrainContourMetadata.ts // 지형별 등고선 기본 규격
├── constants/
│   ├── terrains.ts                // 6대 범주 및 26종 세부 지형 마스터
│   ├── places.ts                  // 112개 지질 명소 통합 엔트리
│   └── places/                    // 카테고리별 명소 데이터셋
├── hooks/
│   └── useTerrainSearch.ts        // 지형/명소 탐색 및 상태 훅
└── utils/
    └── curriculumHelper.ts        // 2022 개정 교육과정 연계 데이터
```

---

## 5. 성능 및 리소스 최적화

- **Three.js 메모리 해제**: `useMemo` 기반의 지오메트리 캐싱 및 React 렌더 사이클 연동으로 캔버스 전환 시 누수 방지
- **셰이더 재컴파일 0회**: 등고선 ON/OFF 및 테마 변경 시 셰이더를 재컴파일하지 않고 Three.js Uniforms 값만 갱신하여 60FPS 프레임 유지
- **독립적인 고해상도 위성 지도**: 외부 타일 API 의존 없이 안정적인 정밀 위성 임베드를 제공하여 네트워크 부하 최소화
