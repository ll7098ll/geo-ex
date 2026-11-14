# 📋 변경 이력 (Changelog)

지형 탐험가(Geography Explorer) 프로젝트의 모든 주요 변경 사항은 이 문서에 기록됩니다.  
본 프로젝트는 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 표준을 준수하며, [유의적 버전(Semantic Versioning)](https://semver.org/lang/ko/)을 따릅니다.

---

## [1.3.0] - 2026-11-14

### 🎨 Added (Swiss-Brutalist Design DNA & Kinetic Showcase)
- **스위스 브루탈리스트 아키텍처 디자인 시스템 (`src/index.css`)**:
  - 전 요소 `0px` 직각 보더 규율(`border-radius: 0px !important`), `1px` 헤어라인 그리드(`.hairline-border`), 코너 십자 표식(`.corner-ticks`), 28° 코발트 사선 해칭(`.diagonal-hatch-cobalt`) 적용.
  - 5대 고대비 텔레메트리 팔레트(`#08080A` Obsidian, `#131418` Slate, `#FFCC00` Editorial Gold, `#1F34FF` Electric Cobalt, `#96D0FF` Cyan Ice) 정립.
- **키네틱 UI 컴포넌트 모듈 도입 (`src/components/kinetic/`)**:
  - `PolarityCutGate`: 액트 전환 시 0.38초 1프레임 일렉트릭 코발트 챕터 커튼 전환 효과.
  - `HeroApertureCanvas`: 마우스 좌표를 부드럽게 추적하는 위상 조리개 레티클 2D 캔버스.
  - `OdometerCounter`: 상단 헤더에 배치된 스프링 물리 기반 두 자리 숫자 롤링 카운터.
  - `SpecimenDrawer`: `localStorage`(`geo_specimens_v1`)와 연동되는 우측 슬라이드아웃 표본 아카이브 서랍(`ESC` 닫기 및 표본별 3D 디오라마 바로가기 지원).
  - `FilmGrainOverlay`: 3% 필름 그레인 질감과 뷰포트 모서리 크로스헤어 좌표 마크.
- **액트별 인터랙션 고도화**:
  - **ACT 01 (`HeroSlideshow`)**: 4분할 수직 셔터 블레이드(`grid-cols-4`) 커버 전환.
  - **ACT 03 (`Terrain3DSlide`)**: 하단 **180° Y축 3D 플립 카드** 도입(앞면 지질 스펙 ↔ 뒷면 3대 판독 매뉴얼) 및 전 액트 통합 표본 수집 액션.
  - **ACT 04 (`GeologicalGuideSlide`)**: Tab 01 **4단 키네틱 아코디언 블레이드(4-Blade Accordion)** 도입.

### ⚡ Performance & Refactoring (코드 최적화 및 정리)
- **WebGL & Canvas 런타임 최적화**:
  - `Terrain3DSlide`에서 인라인/전체화면 전환 시 중복 마운트되던 2개의 `<Terrain3D>` 캔버스를 단일 영속 인스턴스로 통합하고 `ESC` 키 종료 지원 추가.
  - 비활성 슬라이드 상태일 때 3D `<Canvas>`의 `frameloop`을 `'demand'`로 전환하고 `dpr={[1, 2]}`로 클램핑.
  - `HeroApertureCanvas`에 `isActive` 및 `prefers-reduced-motion` 감지를 적용해 비활성 슬라이드 또는 모션 감소 환경에서 `requestAnimationFrame` 루프 중단.
  - `FilmGrainOverlay`의 라이브 `<feTurbulence>` 필터 SVG를 정적 CSS 타일 노이즈(`data:image/svg+xml`) 배경으로 대체해 스크롤·WebGL 합성 부하 제거.
- **메모리 및 캐시 관리 강화**:
  - `terrainGenerators.ts`의 `GEOMETRY_CACHE`(최대 24)와 `terrainDEMGenerator.ts`의 `DEM_CACHE`(최대 20)를 `Map` 기반 **진성 LRU 캐시**로 업그레이드하고, 지오메트리 축출 시 `.dispose()` 호출 보장.
  - `TerrainSpecialMeshes.tsx` 내 모든 절차적 `BufferGeometry` 생성부에 `useDisposeGeometry` 클린업 훅 적용 및 미사용 `AnimatedWaterSurface` 제거.
  - `Terrain3D.tsx`에서 중복 호출되던 `generateTerrainElevationField`를 경량 메타 조회 `getTerrainContourMeta`로 대체.
- **번들 및 데드 코드 정리**:
  - 미사용 의존성(`@google/genai`, `express`, `dotenv`, `@types/express`, `tsx`, `autoprefixer`), AI Studio 잔여 파일(`.aistudio/`, `metadata.json`, `.env.example`), 미사용 3D 주해 핀 시스템(`TerrainAnnotationsData.ts`, `DioramaMesh` 데드 프롭) 삭제.
  - `vite.config.ts`에 `three-vendor`, `motion-vendor`, `markdown-vendor`, `places-data` Rollup `manualChunks` 적용.

### 🐛 Fixed (버그 수정)
- `src/constants/places/*.ts` 5개 파일에 존재하던 8건의 중복 장소 `id`를 모두 고유 ID로 교정(165개소 100% 고유 ID 확보).
- `SpecimenDrawer`에서 수집한 표본 클릭 시 현재 카테고리/지역으로 랜덤 탐색되던 버그 수정 (`getCategoryIdForPlace` + `specimen.region` + `specimen.id` 직접 로드).
- `App.tsx`의 `IntersectionObserver`가 슬라이드 전환마다 재생성되던 의존성 문제 해결 및 `PolarityCutGate` 타이머 정리 보강.
- `GoogleMapSlide` 연계 명소 버튼의 누락된 `group` hover 클래스 복구 및 `ErrorMessage` 스위스 브루탈리스트 스타일 통일.

---

## [1.2.0] - 2026-11-10

### 🌋 Added (주요 신규 기능)
- **3D 절차적 디오라마 지형 엔진 전면 개편**:
  - **240×240 고해상도 그리드**: 0.083m 셀 간격의 적응형 대각선 분할 삼각망을 적용하여 정밀 지표면을 절차적으로 생성.
  - **상면 와인딩 및 법선 정상화**: 반시계 방향(+Z 법선) 표준화로 셰이더 조명 및 반사광 계산 왜곡 해결.
  - **28층 세분화 지질 단면(Strata Skirt)**: 디오라마 4개 수직 벽면에 28단계 지질 층리 구조 렌더링.
  - **일체화 수조 메쉬(`ConformantWaterMesh`)** 및 **수면 하부 등고선 마스킹(`aboveWater`)** 도입.
- **39종 지오메트리 세부 아키타입 라우팅 (`resolveTerrainKey`)** 및 **특수 지질 메쉬 (`TerrainSpecialMeshes`)** 구축.
- **GLSL 등고선 인젝션 셰이더 (`injectContourShader`)**: Triplanar 절벽 안티스트레칭, Cavity AO, 경사도 히트맵, 능선/계곡 가이드 지원.
- **165개 전수 지질 명소 데이터베이스 구축** (전 세계 86개소, 대한민국 79개소).
- **Slide 04 맞춤 교육 대시보드 (`educationLevelHelper`, `terrainConceptData`)**: 초등/중등/고등/일반 4단계 난이도 스위처 및 4대 탭 도입.

---

## [1.1.0] - 2026-11-09

### 🌋 Added
- **4단 풀스크린 스냅 스크롤 아키텍처**: `calc(100vh - 56px)` 뷰포트, `IntersectionObserver` 동기화, 우측 플로팅 `SlideNavigationDock`.
- **실시간 GLSL 골드 등고선(Isoline) 셰이더** 및 3D 시각화 HUD 컨트롤러(고저차 1.0x~1.6x, 지층 ON/OFF, 360° 회전, 뷰 리셋, 전체화면).

---

## [1.0.0] - 2026-11-09

### 🌋 Added
- **지형 탐험가(Geography Explorer) 코어 플랫폼 최초 공개**: React 19, TypeScript 5.8, Three.js, React Three Fiber, Tailwind CSS v4, Vite 6.2 기반.
- 6대 대분류 히어로 슬라이드쇼, 26종 지형 태그, WGS84 위성 지도 임베드, 2022 개정 교육과정 연계 메타데이터(`curriculumHelper`).
