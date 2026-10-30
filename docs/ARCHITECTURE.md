# 🏗️ 지형 탐험가 시스템 아키텍처 (System Architecture)

> 본 문서는 **지형 탐험가 (Geography Explorer)**의 소프트웨어 아키텍처, 절차적 3D 지형 렌더링 파이프라인, 수치 표고 모델(DEM) 및 등고선 산출 알고리즘, 그리고 컴포넌트 간 데이터 흐름을 상세히 기술합니다.

---

## 📌 1. 전체 아키텍처 개요 (High-Level Overview)

본 애플리케이션은 **React 19**, **Three.js / React Three Fiber(R3F)**, **TypeScript** 기반의 고성능 클라이언트 사이드 인터랙티브 시뮬레이션 플랫폼입니다. 무거운 지형 3D 에셋 파일(GLTF/OBJ 등)을 네트워크로 매번 다운로드하는 대신, **클라이언트 사이드 절차적 수치 알고리즘(Procedural Math)**을 통해 지형 형상을 실시간 연산하여 즉시 렌더링합니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          사용자 인터페이스 계층                          │
│   Navigation · HeroSlideshow · 3D Diorama Studio · SearchResult        │
│   ContourMapModal (2D 등고선) · TerrainCompareView (듀얼 3D 비교)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ React Props & State
┌───────────────────────────────────▼────────────────────────────────────┐
│                         상태 관리 및 비즈니스 로직                        │
│   useTerrainSearch Hook  ──▶  PRESET_PLACES (112개소 메타데이터)        │
│   Region (Korea / World) ──▶  TERRAIN_CATEGORIES (6대 범주 / 26종)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     3D 렌더링 엔진 (Three.js/R3F)   │ │  2D 등고선 & 단면 분석 엔진 (Canvas) │
│ - PlaneGeometry 정점 변위 (Math)  │ │ - 80x80 DEM 표고 그리드 생성     │
│ - 절차적 텍스처 (Canvas CanvasTex) │ │ - Marching Squares 등고선 추적   │
│ - 지질 단면 슬라이스 (Custom Plane)│ │ - A-B 단면선 고도 프로파일 차트  │
│ - 3D 피처 어노테이션 핀 (3D Pins) │ │ - 고도 색채환 (Hypsometric Tint) │
└───────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 🏔️ 2. 절차적 3D 지형 생성 파이프라인 (Procedural 3D Pipeline)

지형의 표고값은 `src/components/terrain/` 내 전용 지형 생성기(`generators/`)에 의해 결정됩니다.

### 2.1 수학적 노이즈 기초
- **단일 소스 수학 모듈 (`terrainMath.ts`)**:
  - `random(seed)`: 결정론적 의사 난수 생성기(PRNG)
  - `noise(x, y)`: 2차원 값 노이즈(Value Noise) 및 바이리니어 보간
  - `fbm(x, y, octaves, persistence, lacunarity)`: 다중 옥타브 분수 브라운 운동(Fractional Brownian Motion)
  - `warpedFbm(x, y)`: 도메인 왜곡(Domain Warping)을 통한 복잡한 유체·지층 침식 패턴 생성
  - `hexVoronoi(x, y)`: 6각형 보로노이 셀 거리 및 셀 중심 추출 (주상절리 생성 전용)

### 2.2 지형별 전문 생성기 (`src/components/terrain/generators/`)
각 대분류별로 독립 모듈이 구성되어 세부 지형의 고도 $z = f(x, y)$ 및 지질 특성을 반환합니다:
- **`volcanic.ts`**: 화산(원추형 가우스 곡선), 칼데라(칼데라호 분지 함몰), 주상절리(육각 기둥 표면 수축), 용암동굴, 단층 산맥
- **`coastal.ts`**: 갯벌(조석 갯골 네트워크 및 완경사), 해식애(파식 절벽 및 파식대), 시스택(촛대 바위섬), 해안 사구(풍성 풍식 립플), 사주
- **`fluvial.ts`**: 선상지(부채꼴 퇴적 경사), 곡류천(사행천 사인파 곡선 및 우각호), 삼각주(하구 분지), 하안단구(계단식 평탄면), 폭포
- **`karst.ts`**: 석회동굴(용식 공동), 돌리네(원형 싱크홀 깔때기), 탑 카르스트(용식 잔류 석회암 봉우리)
- **`glacial.ts`**: U자곡(빙식 U자형 단면), 피오르드(침수 협만 해수면 연동), 혼(3~4개 권곡이 깎아낸 피라미드 봉우리), 모레인(빙퇴석 융기)
- **`arid.ts`**: 사막(바르한 초승달 사구), 버섯바위(풍식 협소 기둥), 오아시스(사구 사이 지하수 노출), 플라야(건조 염호 평원)

### 2.3 3D 정점 배치 및 법선 벡터 연산
`Terrain3D.tsx`에서 R3F의 `PlaneGeometry(width, height, segmentsX, segmentsY)` 정점 버퍼에 접근하여, 각 그리드 좌표 $(x, y)$에 지형 수식을 적용하고 `computeVertexNormals()`를 호출하여 동적 라이팅(DirectionalLight + AmbientLight + HemisphereLight)이 입체적으로 반응하도록 구성합니다.

---

## 🗺️ 3. DEM 표고 그리드 & 등고선(Contour) 생성 아키텍처

### 3.1 수치 표고 모델(DEM) 추출 (`terrainDEMGenerator.ts`)
- 2D 등고선도 및 3D 슬라이스 평면의 일관성을 위해 $N \times N$ (기본 $80 \times 80$)의 정규화 표고 그리드 `TerrainElevationField`를 생성합니다.
- 각 셀 $[i, j]$는 지형의 로컬 고도 $Z(i, j) \in [0, 1]$과 실제 매핑 고도(m)를 보관합니다.
- 최고 고도(`maxElevation`), 최저 고도(`minElevation`), 고도차(`elevationRange`)를 자동 산출합니다.

### 3.2 Marching Squares 등고선 추출 (`marchingSquares.ts`)
- **알고리즘**: 2차원 스칼라 필드에서 특정 등고선 레벨 $h_k$에 대한 윤곽선을 추적하는 Marching Squares 구현.
- 4개 정점의 이진 상태($2^4 = 16$가지 케이스)에 따른 셀 절단 에지를 선형 보간(Linear Interpolation)하여 부드러운 벡터 선분(`ContourPath`)을 생성합니다.
- **등고선 계층**:
  - `주곡선 (Index Contour)`: 굵은 선(2px, 강조 색상), 고도 라벨 표시
  - `간곡선 (Intermediate Contour)`: 얇은 선(1px), 세밀한 경사 표현
- **고도 색채환 (Hypsometric Tinting)**:
  - 저지대(녹색/갈색)부터 고지대(황색, 적갈색, 백색 만년설)까지 점진적 색상 팔레트 매핑.

### 3.3 A-B 단면선 및 고도 프로파일 (`crossSectionMath.ts`)
- 사용자가 2D 등고선도 상에서 마우스 드래그로 지정한 임의의 절단선 $A(x_1, y_1) \to B(x_2, y_2)$을 $M$개 포인트(기본 100샘플)로 분할.
- 바이리니어 표고 보간(`bilinearInterpolateDEM`)을 통해 연속적인 지형 단면 고도 곡선을 계산.
- `ElevationProfileChart.tsx`: 단면의 최고/최저 표고, 평균 경사각($\theta$), 경사 방향(방위각)을 실시간 SVG/Canvas 차트로 시각화.
- `CrossSection3DVisualizer.tsx`: 단면선을 3D 뷰어 상에 수직 절단 평면(`ElevationSlicePlane.tsx`)으로 투영하여 2D 단면과 3D 공간을 일대일 동기화.

---

## 🔄 4. 두 지형 동시 비교 뷰 (Dual 3D Terrain Comparison)

`TerrainCompareView.tsx`는 서로 다른 두 지형(예: 화산 vs 칼데라, 빙하 U자곡 vs 곡류천)을 50:50 분할 뷰포트로 동시에 배치합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                  TerrainCompareView (통합 비교 뷰)                │
├────────────────────────────────┬────────────────────────────────┤
│       지형 A (Base Terrain)     │      지형 B (Target Terrain)    │
│  - 3D 캔버스 A (R3F Viewport)   │  - 3D 캔버스 B (R3F Viewport)   │
│  - 실시간 회전/줌 OrbitControls │  - 실시간 회전/줌 OrbitControls │
│  - 지형 A 메타데이터 요약        │  - 지형 B 메타데이터 요약        │
├────────────────────────────────┴────────────────────────────────┤
│ [카메라 동기화 토글]  [지형 A/B 좌우 맞바꿈]  [비교 프리셋 퀵 선택] │
├─────────────────────────────────────────────────────────────────┤
│            지질학적·지형학적 7대 항목 1:1 대조 테이블             │
│  지질 연대 · 암석 종류 · 형성 기작 · 지형 스케일 · 탐방 관찰 포인트 │
└─────────────────────────────────────────────────────────────────┘
```

- **카메라 제어 동기화**: `syncCamera` 플래그 활성화 시, 주 캔버스의 카메라 회전 쿼터니언과 줌 팩터를 종속 캔버스에 즉각 전달하여 동일한 각도에서 두 지형의 형태학적 차이를 직관적으로 비교.
- **6대 핵심 프리셋 탑재**:
  1. 화산 vs 칼데라 (융기 vs 함몰)
  2. 빙하 U자곡 vs 곡류천 (빙식 vs 유수 침식)
  3. 석회동굴 vs 용암동굴 (화학 용식 vs 물리 터널)
  4. 피오르드 vs 해식애 (빙식 협만 vs 파식 절벽)
  5. 선상지 vs 삼각주 (산록 퇴적 vs 하구 퇴적)
  6. 주상절리 vs 시스택 (냉각 수축 vs 파도 고립)

---

---

## 📊 5. 상태 관리 & 4단 슬라이드 데이터 흐름 (Data Flow)

1. **지형 선택 및 슬라이드 전환 (`App.tsx`)**:
   - `HeroSlideshow (Slide 01)`에서 사용자가 지형 칩을 클릭하면 `handleExplore(terrain, categoryId)` 호출.
   - 검색 완료 후 `scrollToSlide(1)`을 통해 **슬라이드 02 (구글 위성 지도)**로 부드럽게 자동 스크롤.
2. **검색 및 데이터 조회 (`useTerrainSearch.ts`)**:
   - `PRESET_PLACES`에서 현재 권역(`region: 'world' | 'korea'`, **기본값: 'world'**) 및 선택된 지형 카테고리에 매칭되는 장소 목록을 필터링.
   - 대표 장소 및 대안 장소(Alternative Places)를 선별하여 `SearchResult` 객체 구성.
3. **슬라이드별 전문 뷰포트 렌더링**:
   - `Slide 02 (GoogleMapSlide.tsx)`: 100vh 구글 위성 지도 및 대안 장소 칩 바 표출.
   - `Slide 03 (Terrain3DSlide.tsx)`: 100vh 3D 디오라마 스튜디오, 2D 등고선/단면도 모달, 듀얼 3D 비교 뷰.
   - `Slide 04 (GeologicalGuideSlide.tsx)`: `curriculumHelper.ts`를 통해 교육과정 성취기준, 지질 팩트시트, 3대 핵심 요약, 4단계 진화 타임라인, 현장/위성 가이드, 필수 지질학 용어 사전(Glossary)을 4대 탭으로 렌더링.
4. **등고선 및 단면도 활성화**:
   - `generateTerrainElevationField(categoryId, subTerrain)`를 통해 80x80 DEM 그리드를 연산.
   - `ContourMapModal` 오픈 시 인터랙티브 캔버스로 전달되어 Marching Squares 등고선 벡터 및 A-B 단면선 고도 프로파일 생성.
