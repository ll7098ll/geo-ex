# 🌍 지형 탐험가 (Geography Explorer)

> **전 세계와 대한민국의 165개 지질 명소를 스위스 브루탈리스트(Swiss-Brutalist) 키네틱 아카이브 UI, 4단 풀스크린 스냅 슬라이드, 240×240 고해상도 절차적 3D 디오라마, 실시간 GLSL 3D 등고선·지질 단면 시각화, 고해상도 위성지도, 그리고 4단계 맞춤 교육 대시보드로 입체 탐구하는 차세대 지리·지구과학 웹 플랫폼**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Version](https://img.shields.io/badge/Version-1.3.0-FFCC00?style=flat-square)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 1. 프로젝트 개요 (Overview)

**지형 탐험가 (Geography Explorer)**는 2차원 교과서 삽화와 평면 사진만으로는 체감하기 어려웠던 지형의 고저차, 형성과정, 공간적 규모를 **스위스 브루탈리스트 0px 직각 그리드 & 키네틱 아카이브 인터페이스** 위에서 입체적으로 학습할 수 있도록 설계된 100% 클라이언트 사이드 인터랙티브 지구과학 웹 플랫폼입니다.

화산, 해안, 하천, 카르스트, 빙하, 건조의 **6대 대분류**, **26개 기본 지형 태그**, **39종 고유 지오메트리 세부 아키타입**, 그리고 **총 165개(전 세계 86개소, 대한민국 79개소) 지질 명소 풀 데이터베이스**를 탑재하여 초·중·고 학생과 교사, 지리 애호가 모두에게 최적의 탐험 경험을 제공합니다.

### 🎨 Swiss-Brutalist Kinetic Design System
- **Strict 0px Architectural Geometry**: 모든 컨테이너, 버튼, 카드에 `0px` 직각 보더와 `1px` 헤어라인 그리드(`.hairline-border`), 코너 십자 표식(`.corner-ticks`), 28° 코발트 사선 해칭(`.diagonal-hatch-cobalt`) 적용.
- **5-Color Telemetry Palette**: Obsidian(`#08080A`), Slate Surface(`#131418`), Editorial Gold(`#FFCC00`), Electric Cobalt(`#1F34FF`), Cyan Ice(`#96D0FF`).
- **Kinetic Micro-Interactions**: 1프레임 코발트 챕터 전환 커튼(`PolarityCutGate`), 4단 수직 셔터 슬릿 커버(`HeroSlideshow`), 인터랙티브 조리개 레티클(`HeroApertureCanvas`), 스프링 물리 오도미터 카운터(`OdometerCounter`), 표본 수집 아카이브 서랍(`SpecimenDrawer`).

---

## 🖼️ 2. 4단 풀스크린 스냅 슬라이드 구조 (4-Slide Architecture)

뷰포트 `calc(100vh - 56px)` 단위로 구분된 4개의 액트(ACT 01~04)가 CSS Scroll Snap과 우측 플로팅 독(`01`~`04`)으로 완벽하게 동기화됩니다.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      4-ACT FULLSCREEN KINETIC EXPEDITION ARCHIVE                       │
├─────────────────┬─────────────────┬──────────────────┬─────────────────────────────────┤
│     ACT 01      │     ACT 02      │      ACT 03      │             ACT 04              │
│ [HERO ARCHIVE]  │[SATELLITE MAP]  │[3D DIORAMA STUDIO│    [GEOLOGICAL INVESTIGATION]   │
├─────────────────┼─────────────────┼──────────────────┼─────────────────────────────────┤
│• 4단 셔터 슬릿  │• 100vh WGS84 맵 │• 240×240 메쉬    │• 4단계 맞춤 난이도 스위처       │
│• 조리개 레티클  │• 돋보기 조작 락 │• GLSL 3D 등고선  │• 01. 4단 키네틱 아코디언 블레이드│
│• 6대 범주 26태그│• 28° 코발트 헤더│• 28층 지질 단면  │• 02. 핵심 개념 & 지질 팩트시트   │
│• 6초 자동 롤링  │• 연계 명소 칩   │• 고저차 1.0~1.6x │• 03. 현장·위성 탐방 가이드      │
│                 │• 표본 수집 버튼 │• 180° Y축 3D 플립│• 04. 심층 리포트 전문 (GFM)     │
└─────────────────┴─────────────────┴──────────────────┴─────────────────────────────────┘
```

1. **ACT 01 · 키네틱 히어로 커버 ([`HeroSlideshow.tsx`](src/components/HeroSlideshow.tsx))**:
   - 4분할 수직 셔터 블레이드(`grid-cols-4`) 애니메이션과 마우스 추적 위상 조리개 캔버스(`HeroApertureCanvas`) 결합.
   - 6대 대분류 6초 자동/수동 롤링 캐러셀 및 상단 헤더(`[ KR // 대한민국 ]` 79개소 · `[ WD // 전 세계 ]` 86개소) 권역 전환.
   - 26개 세부 지형 태그 원클릭 시 1프레임 코발트 `PolarityCutGate`와 함께 `ACT 02`로 스무스 스크롤 이동.
2. **ACT 02 · 위성 텔레메트리 맵 ([`GoogleMapSlide.tsx`](src/components/slides/GoogleMapSlide.tsx))**:
   - Google Satellite 위성 뷰(`t=k&z=13`)를 100% 뷰포트로 렌더링.
   - **위성 돋보기 조작 모드 토글**: 일반 스크롤 스냅 모드(`pointer-events-none`)와 지도 줌·팬 조작 모드(`pointer-events-auto`)를 충돌 없이 전환.
   - 28° 사선 해칭 에디토리얼 플래카드에서 형성 메커니즘, 외부 지도(Google Maps / Google Earth 3D / 한국 Naver Map), 연계 지형 칩 및 `[ + COLLECT SPECIMEN ]` 지원.
3. **ACT 03 · 3D 디오라마 스튜디오 ([`Terrain3DSlide.tsx`](src/components/slides/Terrain3DSlide.tsx) · [`Terrain3D.tsx`](src/components/Terrain3D.tsx))**:
   - 단일 영속 WebGL `<Canvas dpr={[1, 2]}>` 인스턴스를 인라인/전체화면(`ESC` 종료 지원) 모드가 공유하며, 비활성 슬라이드 시 `frameloop="demand"`로 GPU 부하를 자동 절감.
   - **240×240 적응형 고밀도 메쉬** + **GLSL 골드 등고선 셰이더**(수면 하부 자동 마스킹) + **28층 지질 단면 스커트(Strata Skirt)** + **고저차 배율(1.0x ➔ 1.3x ➔ 1.6x)**.
   - **특수 지질 메쉬(`TerrainSpecialMeshes`)**: 주상절리 기둥군(~270개), 전면 절개 석회/용암동굴, 3D 버섯바위, 해식아치, 폭포 캡록, 일체형 수조(`ConformantWaterMesh`) 등.
   - **하단 180° Y축 3D 플립 카드**: 앞면 지질 스펙 그리드(`(a)~(e)`) ↔ 뒷면 3대 시각 판독 매뉴얼 원클릭 전환.
4. **ACT 04 · 지질 심층 탐구 대시보드 ([`GeologicalGuideSlide.tsx`](src/components/slides/GeologicalGuideSlide.tsx))**:
   - **4단계 맞춤 난이도 스위처 (`초등` / `중등` / `고등` / `일반`)**: [`educationLevelHelper.ts`](src/utils/educationLevelHelper.ts)와 [`terrainConceptData.ts`](src/utils/terrainConceptData.ts)를 통한 어휘 순화 및 교과 성취기준 맞춤 변환.
   - **4대 탭 구성**:
     * `01. 4단계 형성 원리`: 호버·클릭으로 확장되는 **4단 키네틱 아코디언 블레이드(4-Blade Kinetic Accordion)**.
     * `02. 핵심 개념 & 지질 팩트`: 큐레이션 핵심 개념 3선 및 지질 프로필 팩트시트.
     * `03. 현장·위성 탐방 가이드`: 현장 관찰 포인트 3선 및 위성 판독 지표 3선.
     * `04. 심층 리포트 전문`: `react-markdown` + `remark-gfm` 기반 학술 형성 보고서 전문.

---

## ✨ 3. 표본 아카이브 및 시각화 컨트롤 (Archive & Controls)

- **표본 수집 아카이브 (`SpecimenDrawer`)**:
  - `ACT 02`, `ACT 03`, `ACT 04` 어디서든 표본을 수집하면 상단 헤더 `Specimen [ 00 ]` 오도미터 카운터가 스프링 애니메이션으로 증가하고 `localStorage`(`geo_specimens_v1`)에 영구 저장됩니다.
  - 서랍(`ESC` 지원)에서 수집한 표본의 `[ 탐색 바로가기 ]`를 누르면 해당 명소의 권역·범주·정확한 장소 ID로 즉시 복원되어 `ACT 03` 3D 디오라마로 점프합니다.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         ACT 03 시각화 제어 HUD 툴바 안내                               │
├──────────────┬─────────────────────────────────────────────────────────────────────────┤
│ [등고선 ON]  │ 3D 표면에 GLSL 골드 등고선 투영 (수면 하부는 자동 차단 마스킹)          │
│ [지층 ON]    │ 디오라마 4개 벽면에 28개 층위의 지질 단면 및 퇴적 줄무늬 스커트 노출    │
│ [고저차 1.x] │ 1.0x ➔ 1.3x ➔ 1.6x 원터치 순환으로 완경사 지형의 미세 기복 극대화       │
│ [회전 / 리셋]│ 360° 턴테이블 자동 회전 토글 및 표준 45° 투시 시점 원클릭 복귀          │
│ [전체화면]   │ 단일 WebGL 컨텍스트 유지 풀스크린 몰입 모드 (단축키 ESC 종료 지원)      │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 4. 기술 스택 (Tech Stack)

| 계층 | 주요 기술 및 패키지 | 비고 |
|:---|:---|:---|
| **Core** | React 19.0, TypeScript 5.8, Vite 6.2 | Strict Type Check (`tsc --noEmit`), Rollup `manualChunks` 번들 분리 |
| **3D Engine** | Three.js 0.183, React Three Fiber v9, Drei v10 | `dpr={[1, 2]}`, 비활성 슬라이드 `frameloop="demand"`, LRU 지오메트리·DEM 캐시 |
| **Shaders & Procedural** | Custom GLSL (`onBeforeCompile`), FBM, Warping, Voronoi | Triplanar 절벽 안티스트레칭, Cavity AO, 수면 하부 등고선 마스킹 |
| **UI & Motion** | Tailwind CSS v4, `@tailwindcss/typography`, Motion v12, Lucide React | Swiss-Brutalist `0px` 아키텍처, `AnimatePresence` 전환 |
| **Content** | `react-markdown`, `remark-gfm` | 165개 명소 데이터 + 26종 지형 교과 개념 지식 베이스 |

---

## 📁 5. 프로젝트 구조 (Project Structure)

```text
├── docs/                                  # 📚 기술 및 시각 가이드 문서
│   ├── ARCHITECTURE.md                    # 시스템 아키텍처, 3D 파이프라인 및 메모리 최적화 전략
│   ├── SLIDE_VISUAL_GUIDE.md              # 4-Act 키네틱 슬라이드 화면 도해 및 조작 매뉴얼
│   └── TERRAIN_CATALOG.md                 # 6대 범주 39종 아키타입 & 165개 지질 명소 전수 카탈로그
├── .github/                               # 🤝 이슈/PR 템플릿
├── src/
│   ├── components/
│   │   ├── Navigation.tsx                 # 56px 마스트헤드, 권역 스위처 & Specimen 오도미터 버튼
│   │   ├── SlideNavigationDock.tsx        # 우측 01~04 액트 플로팅 도크 & 키보드(↑/↓) 네비게이션
│   │   ├── HeroSlideshow.tsx              # ACT 01: 4단 셔터 커버 & 26개 지형 태그
│   │   ├── Terrain3D.tsx                  # R3F Canvas, OrbitControls, 3D 등고선 셰이더 파이프라인
│   │   ├── LoadingOverlay.tsx             # 지형 데이터 분석 로딩 오버레이
│   │   ├── ErrorMessage.tsx               # 시스템 알림 토스트
│   │   ├── kinetic/                       # Swiss-Brutalist 키네틱 모듈
│   │   │   ├── FilmGrainOverlay.tsx       # 정적 CSS 타일 노이즈 & 뷰포트 코너 크로스헤어
│   │   │   ├── HeroApertureCanvas.tsx     # 인터랙티브 2D 위상 조리개 레티클 캔버스
│   │   │   ├── OdometerCounter.tsx        # 스프링 물리 디지털 오도미터 카운터
│   │   │   ├── PolarityCutGate.tsx        # 1프레임 일렉트릭 코발트 챕터 전환 커튼
│   │   │   └── SpecimenDrawer.tsx         # localStorage 연동 슬라이드아웃 표본 아카이브
│   │   ├── slides/                        # ACT 02 ~ ACT 04 풀스크린 뷰포트
│   │   │   ├── GoogleMapSlide.tsx         # ACT 02: 100vh 위성 지도 & 돋보기 조작 모드
│   │   │   ├── Terrain3DSlide.tsx         # ACT 03: 단일 3D 스테이지, HUD & 180° Y축 플립 카드
│   │   │   └── GeologicalGuideSlide.tsx   # ACT 04: 4단계 난이도 스위처 & 4단 아코디언 대시보드
│   │   └── terrain/                       # 3D 절차적 지형 생성 및 셰이더 엔진
│   │       ├── terrainMath.ts             # FBM, Domain Warping, Hexagonal Voronoi 단일 수학 엔진
│   │       ├── terrainGenerators.ts       # 39종 아키타입 라우팅 & LRU GEOMETRY_CACHE(24)
│   │       ├── terrainTextures.ts         # 프로시저럴 범프 텍스처 생성기
│   │       ├── TerrainSpecialMeshes.tsx   # ConformantWaterMesh & 특수 지질 메쉬 (dispose 관리)
│   │       ├── generators/                # 6대 범주별 절차적 고도·색상 평가기
│   │       └── contour/                   # GLSL 셰이더 인젝션, LRU DEM_CACHE(20), 등고선 규격
│   ├── constants/
│   │   ├── terrains.ts                    # 6대 대분류 & 26개 지형 태그 마스터
│   │   ├── places.ts                      # 165개 명소 통합 엔트리 & getCategoryIdForPlace 헬퍼
│   │   └── places/                        # 6대 카테고리 165개 명소 데이터베이스 (33/25/25/31/18/33)
│   ├── hooks/
│   │   └── useTerrainSearch.ts            # 지형 검색, 장소 셔플 및 상태 훅
│   ├── utils/
│   │   ├── curriculumHelper.ts            # 2022 개정 교육과정 성취기준 및 팩트시트 헬퍼
│   │   ├── educationLevelHelper.ts        # 초/중/고/일반 4단계 맞춤 콘텐츠 변환 & 어휘 순화기
│   │   └── terrainConceptData.ts          # 26종 지형 핵심 질문 및 3대 개념 지식 베이스
│   ├── types/
│   │   ├── index.ts                       # PlaceInfo, GeologyMetadata, TerrainEvolutionStage 타입
│   │   └── contour.ts                     # DEM 표고 필드 및 등고선 설정 타입
│   ├── App.tsx                            # 최상위 4단 스냅 레이아웃 & 표본/스크롤 오케스트레이터
│   ├── main.tsx                           # React 엔트리 포인트
│   └── index.css                          # Tailwind CSS v4 & Swiss-Brutalist 아키텍처 유틸리티
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── LICENSE
```

---

## 🚀 6. 빠른 시작 (Getting Started)

### 사전 요구 사항
- **Node.js**: v20.18.0 이상 (v22+ 권장)
- **npm**: v10 이상

### 설치 및 실행
```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 구동 (http://localhost:3000)
npm run dev

# 3. TypeScript 정적 타입 검사 & 프로덕션 빌드
npm run lint
npm run build
```

---

## 📚 7. 상세 문서 안내 (Documentation Index)

- 🏗️ **[시스템 아키텍처 (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)**: 스위스 브루탈리스트 4-Act 레이아웃, 240×240 절차적 3D 파이프라인, GLSL 셰이더 인젝션, LRU 캐시 및 GPU 최적화 전략.
- 📖 **[4단 슬라이드 시각화 가이드 (docs/SLIDE_VISUAL_GUIDE.md)](docs/SLIDE_VISUAL_GUIDE.md)**: ACT 01~04 화면 구조, 표본 아카이브(`SpecimenDrawer`), 위성 돋보기 모드, 3D 플립 카드 및 4단 아코디언 조작 안내.
- 🌍 **[지형 총람 및 165개 지질 명소 카탈로그 (docs/TERRAIN_CATALOG.md)](docs/TERRAIN_CATALOG.md)**: 6대 대분류, 39종 아키타입 형성 원리 및 검증된 165개 명소(전 세계 86 / 대한민국 79) 전수 목록.
- 📋 **[변경 이력 (CHANGELOG.md)](CHANGELOG.md)** · 🤝 **[기여 가이드 (CONTRIBUTING.md)](CONTRIBUTING.md)** · 🛡️ **[행동 강령 (CODE_OF_CONDUCT.md)](CODE_OF_CONDUCT.md)** · 🔒 **[보안 정책 (SECURITY.md)](SECURITY.md)**

---

## 📄 8. 라이선스 (License)

본 프로젝트는 **[MIT 라이선스](LICENSE)**에 따라 오픈소스로 배포됩니다.
