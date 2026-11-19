# 📜 변경 이력 (Changelog)

지형 탐험가(Geography Explorer) 프로젝트의 모든 주요 변경 사항이 이 파일에 기록됩니다.  
본 문서는 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/) 형식과 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

---

## [1.4.0] - 2026-11-19

### ✨ 주요 기능 & UX 개편 (NatGeo Editorial Dark & 100% Place Reachability)
- **내셔널 지오그래픽 에디토리얼 다크 테마 전면 적용 (`0ace45e`)**:
  - 기존 코발트 중심 텔레메트리 UI에서 **Obsidian `#08080A` · Slate `#131418` · NatGeo Signature Yellow `#FFCC00`** 중심의 에디토리얼 아카이브 디자인 시스템으로 전면 개편.
  - 상단 마스트헤드(`GEOGRAPHY EXPLORER · FIELD EXPEDITION JOURNAL`), 직관적인 한국어 HUD 라벨, 0px 직각 에디토리얼 프레임(`.magazine-frame`, `.magazine-drop-cap`) 정립.
- **슬라이드 04 지형 매거진(Editorial Magazine) 전면 리디자인 (`0ace45e`, `8637a0c`)**:
  - **다크 에디토리얼 모드 / 페이퍼 매거진 모드(`#F6F3EC` 웜 아이보리)** 실시간 전환 토글 추가.
  - 상단 **스티키 매거진 리더 바(`GuideStickyBar`)**: 기사 4대 섹션 목차 앵커(`서문 · 형성과정 · 심층해설 · 현장도감`), 4단계 교육과정 난이도 전환(`초등 · 중등 · 고등 · 일반`), 페이퍼/다크 토글, 표본 수집, 상단 읽기 진행률 바 통합.
  - **전 165개 지질 명소 실경 사진 100% 매핑 (`src/constants/placeImages.ts`)**: Wikimedia Commons 기반 장소별 실제 경관 사진 연결 및 로딩 실패 시 카테고리 커버 자동 폴백.
  - 매거진 커버 오프닝 스프레드 + `PART I: 4단계 지형 형성 연대기` + `PART II: 핵심 지형학 개념 3선` + `PART III: 심층 지형학적 형성 해설` + 우측 스티키 `FIELD DOSSIER`(팩트시트·현장 관찰 포인트·위성 판독 지표·탐방 시기/보존 수칙) 12컬럼 레이아웃 완성.
- **부드러운 슬라이드 전환 및 스크롤 UX 안정화 (`9db13dc`)**:
  - 화면 깜빡임을 유발하던 1프레임 전환 커튼(`PolarityCutGate`)을 완전 제거하고 `requestAnimationFrame` 기반 4차 이징(`useSlideNavigation`) 부드러운 전환으로 일원화.
  - 슬라이드 04 진입 시 항상 기사 최상단(서문)부터 시작하도록 내부 스크롤 가드 및 초기화 로직 보강.
- **UI 지형 태그 확장 (26개 → 34개) 및 100% 도달성 달성 (`15830c8`)**:
  - 기존 UI에서 접근할 수 없던 `기생화산 (오름)`, `파식대`, `석호`, `범람원`, `하안단구`, `카렌`, `권곡`, `메사·뷰트` 등 8개 지형 태그를 전면 노출.
  - 전체 **165/165개 지질 명소** 및 **39/39종 3D 아키타입** 100% UI 도달 달성 및 `matchesTerrainFilter` 문자열 충돌 방지(기생화산 vs 성층화산 분리).

### 🛠️ 3D 지형 렌더링 엔진 전면 고도화 (P0~P3 Overhaul, `15830c8`)
- **오프라인 프로시저럴 IBL 및 그림자 파이프라인 현대화**:
  - 외부 CDN HDRI 요청을 제거하고 `<Environment resolution={256} frames={1}>` + 4방향 `<Lightformer>` 기반 100% 오프라인 조명 환경 구축 (외부 네트워크 차단 환경에서도 WebGL 에러 0건).
  - Three.js `0.183` 호환 `shadows="percentage"` (`THREE.PCFShadowMap`) 적용 및 최적 카메라 프레이밍(`[0, 11.8, 19.6]`, `fov: 42`) 조정.
- **GLSL 3D 등고선 셰이더 3대 결함 완전 해결 (`terrainContourShader.ts`, `terrainGenerators.ts`)**:
  - **고저차 불변성(`reliefScale`-invariant)**: `elev = vTerrainLocalPos.z / max(0.25, uReliefScale)` 정규화로 고저차 `1.0x → 1.3x → 1.6x` 배율 변경 시에도 등고선 밀도 및 고도 기준 일관 유지.
  - **색공간 정확도**: Three.js Linear `THREE.Color` 유니폼을 `terrainLinearToSRGB()`로 변환해 후처리 sRGB 버퍼에서도 선명한 골드 계곡선·화이트 주곡선 출력.
  - **정점별 수면 마스킹(`aSubmerged` + `getLocalWaterElevation`)**: 해수면뿐 아니라 칼데라호, 권곡 빙하호(Tarn), 폭포 상·하류 이중 수위, U자곡 현곡 하천, 모레인 빙하호, 오아시스, 플라야 염호, 석회동굴 지하하천, 파식대 조수웅덩이까지 모든 수면 아래 등고선 완전 차단.
- **39종 지형 DEM 무결성(Zero Spikes) 및 지형학적 사실성 전면 보강**:
  - `권곡` 모서리 고도 폭발(21m → 5.99m 완만한 원형 카르), `단층 산맥` 급애 불연속 찢김 제거 및 알파인 주광 환경 분리, `U자곡` 현곡 폭포 착수 정렬, `폭포` 립 절벽·수막 밀착, `용암대지` 협곡 단애 연속성, `감입곡류천` 전단 스파이크 제거, `카렌` 석회암 용식 열극 자연화, `시스택` 아치·기둥 결합 보강 등 전 아키타입 정밀 수정.
  - 수면 아래 식생 배치 전수 제거(건지 고도 검증) 및 `빙하`(`roughness 0.72 / metalness 0.04`), `플라야`(`0.62 / 0.04`) 매트 PBR 질감 보정.
  - 주기적 심리스(Periodic Seamless) 절차적 암석·모래·빙하 범프 텍스처(`terrainTextures.ts`)로 타일링 경계선 제거.

### 🏗️ 아키텍처 모듈화 리팩터링 (`18abda8`)
- **단일 진실 원천(SSOT) 도입**: [`src/constants/terrainRegistry.ts`](src/constants/terrainRegistry.ts)에 `resolveTerrainKey`, `getBaseWaterElevation`, `CONTOUR_KEY_ALIASES`, `getCategoryForTerrainName` 통합.
- **3D 특수 메쉬 7분할 모듈화**: 거대 단일 파일이던 `TerrainSpecialMeshes.tsx`를 `src/components/terrain/meshes/{shared,volcanicMeshes,coastalMeshes,fluvialMeshes,karstMeshes,glacialMeshes,aridMeshes}.tsx`와 경량 레지스트리 디스패처로 분리.
- **커스텀 훅 & 공통 컴포넌트 추출**: `useSlideNavigation`, `useSpecimenBag`, `AlternativePlacesBar`, `SpecimenCollectButton`, `terrainEvaluator.ts`, 슬라이드 04 서브모듈(`src/components/slides/guide/*`) 분리로 유지보수성 대폭 강화.

### 📚 문서 전면 개편
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/SLIDE_VISUAL_GUIDE.md`, `docs/TERRAIN_CATALOG.md` 전체를 v1.4.0 최신 코드베이스 기준으로 전면 개편하고, 실제 프로덕션 UI 스크린샷 및 39종 3D 아키타입 카탈로그 시트(`docs/assets/`) 삽입.

---

## [1.3.0] - 2026-04-06

### ✨ 주요 기능 & 디자인 혁신 (Swiss-Brutalist Kinetic Showcase)
- **스위스 브루탈리스트 디자인 시스템 도입 (`9c0deff`)**:
  - 전역 `border-radius: 0px !important` 직각 규율, `.hairline-border`, `.corner-ticks`, `.diagonal-hatch` 시각 언어 구축.
- **키네틱 인터랙션 컴포넌트 구축**:
  - `HeroApertureCanvas`: 슬라이드 01 마우스 포인터 추적 위상학적 등고선 조리개 캔버스.
  - `SpecimenDrawer` & `OdometerCounter`: `localStorage` 영속화 기반 지형 표본 수집 서랍 및 디지털 오도미터 카운터.
  - `FilmGrainOverlay`: 다크 에디토리얼 필름 그레인 오버레이.
- **슬라이드 03 180° Y축 3D 플립 카드**: 지형 프로필 요약 ↔ 3D 지형 시각 판독 매뉴얼 전환.
- **슬라이드 04 4단계 교육과정 난이도 전환 (`ed250a5`)**: 초등·중등·고등·일반 4단계 해설 엔진(`educationLevelHelper.ts`, `terrainConceptData.ts`) 탑재.

### ⚡ 성능 최적화 및 버그 수정 (`41c37e6`, `3519ba4`, `8b4e086`)
- **WebGL 수명주기 & 메모리 최적화**: 비활성 슬라이드 `frameloop="demand"` 전환, 전체화면 단일 Canvas 유지, LRU 캐시(Geometry 24개 / DEM 16개) + `dispose()`, `useDisposeGeometry` 훅 적용.
- **명소 ID 중복 제거 및 표본 라우팅 정확도 수정**: 전체 165개 명소 고유 ID 검증 및 `getPlaceById` 기반 정확한 표본 복원.
- **레거시 잔재 제거 및 번들 청크 분리**: Vite `manualChunks`(`three-vendor`, `motion-vendor`, `markdown-vendor`, `places-data`) 구성.

---

## [1.2.0] - 2026-03-31

### ✨ 주요 기능 (Added)
- **전 39종 3D 절차적 지형 아키타입 엔진 완성**: 화산(10), 해안(7), 하천(7), 카르스트(4), 빙하(5), 건조(6) 총 39종 독립 3D 지오메트리·특수 메쉬 엔진 구축.
- **165개 지질 명소 과학 데이터셋 구축**: 전 세계 86개소, 대한민국 79개소(6개 파일 모듈화).
- **GLSL 실시간 3D 등고선 셰이더(`terrainContourShader.ts`)**: `MeshStandardMaterial.onBeforeCompile` 훅 기반 주곡선·계곡선, `fwidth()` 스크린 공간 안티앨리어싱.
- **4단 스냅 풀스크린 내비게이션 & 우측 플로팅 챕터 독(`SlideNavigationDock`)**.

---

## [1.0.0] - 2026-03-10

### 🎉 최초 릴리즈
- 지형 탐험가 웹 애플리케이션 초기 버전 출시 (React 19 + TypeScript + Vite 6 + Three.js).
- 6대 지형 카테고리 슬라이드쇼, 구글 위성지도 연동, 기본 3D 입체 지형 뷰어 및 지질 해설서 제공.
