# 지형 탐험가(Geography Explorer) 종합 문서 체계 전면 개편 및 신규 가이드 신설 계획

지형 탐험가 플랫폼의 최신 기능(4단 풀스크린 스냅 슬라이드, 3D 절차적 디오라마, Marching Squares 2D 등고선/단면도, 듀얼 3D 비교, 교과 연계 4탭 가이드, 전 세계 60개소/국내 52개소 총 112개 프리셋)에 맞추어 기존 7개 문서를 전면 최신화하고, 교육 현장 및 개발 확장성을 극대화하기 위한 특화 문서 3종을 신설합니다.

## User Review & Critical Decisions

> [!IMPORTANT]
> 사전 질의응답을 통해 확정된 방향성에 따라, 기존 7종의 문서를 유지하면서 전면 최신화하고, 요청하신 3대 특화 영역(수업 활동지/평가 루브릭, 3D 수치 수식/셰이더 명세, 신규 지형/명소 기여 가이드)을 신규 전문 문서로 분과하여 체계화합니다.

- **문서화 목적 및 대상**: 교육용 학습·수업 지도 가이드와 개발자용 3D 기술 아키텍처를 50:50으로 균형 있게 보강
- **문서 구조 전략**: 기존 7개 문서를 최신 코드베이스와 정합화하여 유지하고, 중복을 제거하면서 깊이를 심화
- **신규 신설 문서 3종**:
  1. `docs/STUDENT_WORKSHEET.md`: 수업 실습용 학생 탐구 활동지(프린트/디지털 겸용) 및 과정 중심 수행평가 기준안(Rubric)
  2. `docs/PROCEDURAL_TERRAIN_MATH.md`: 절차적 3D 지형 생성 알고리즘 수식, 노이즈 함수, 등고선 커스텀 GLSL 셰이더 상세 문서
  3. `docs/CONTRIBUTING_TERRAIN.md`: 신규 지형 및 지질 명소 데이터셋 확장, WGS84 좌표 추출, 지질학 메타데이터 검증 가이드

---

## 1. Overview & Core Concept

- **목적**: 
  - 교사와 학생에게는 실제 교실 수업과 디지털 탐구 과제에 즉시 투입 가능한 실질적인 수업 활동지와 평가 루브릭을 제공합니다.
  - 개발자와 기여자에게는 3D 수치 시뮬레이션 파이프라인의 수학적 원리와 신규 지질 명소 데이터를 손쉽게 기여할 수 있는 명확한 기술 레퍼런스를 제공합니다.
- **문서 생태계 구조**:
  - 사용자 및 교사용(User/Pedagogical): `USER_MANUAL.md`, `CURRICULUM_GUIDE.md`, `STUDENT_WORKSHEET.md(신설)`
  - 도메인 지형학(Domain Knowledge): `TERRAIN_GUIDE.md`, `CONTOUR_GUIDE.md`
  - 엔지니어링 및 개발자(Developer/Architecture): `ARCHITECTURE.md`, `SLIDE_ARCHITECTURE.md`, `DATA_SCHEMA.md`, `PROCEDURAL_TERRAIN_MATH.md(신설)`, `CONTRIBUTING_TERRAIN.md(신설)`
  - 통합 허브(Root Hub): `README.md` (전체 문서 인덱스 및 링크 체계)

---

## 2. 문서별 상세 개편 및 보강 계획

```
┌────────────────────────────────────────────────────────────────────────┐
│                   지형 탐험가 종합 문서 체계도 (Docs Architecture)             │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 🎓 교육 및 사용자  │ 🏔️ 지형학 및 지질 │ 💻 아키텍처 및 기여 개발        │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ • USER_MANUAL.md  │ • TERRAIN_GUIDE.md│ • ARCHITECTURE.md              │
│   (기능별 조작법) │   (26종 지형 총람)│   (전체 시스템/데이터 흐름)    │
│ • CURRICULUM_     │ • CONTOUR_GUIDE.md│ • SLIDE_ARCHITECTURE.md        │
│   GUIDE.md        │   (등고선/단면도) │   (4단 스냅/옵서버/상태 동기화)│
│   (2022 개정 연계)│                   │ • DATA_SCHEMA.md               │
│ • STUDENT_        │                   │   (TypeScript 타입 규격)       │
│   WORKSHEET.md    │                   │ • PROCEDURAL_TERRAIN_MATH.md   │
│   [신설: 활동지]  │                   │   [신설: 3D 수식 및 셰이더]    │
│                   │                   │ • CONTRIBUTING_TERRAIN.md      │
│                   │                   │   [신설: 명소 추가 기여 가이드]│
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### [트랙 1] 기존 7종 핵심 문서 전면 최신화 및 보강

1. **`docs/ARCHITECTURE.md` (시스템 아키텍처 최신화)**
   - 최신 React 19 + R3F + Tailwind CSS v4 파이프라인 반영
   - 전체 컴포넌트 계층 트리(Navigation, HeroSlideshow, GoogleMapSlide, Terrain3DSlide, GeologicalGuideSlide, ContourMapModal, TerrainCompareView) 실체화
   - 지형 생성부터 3D 지오메트리 변위, 2D DEM 그리드 생성, 등고선 렌더링까지의 데이터 파이프라인 다이어그램 보강

2. **`docs/SLIDE_ARCHITECTURE.md` (4단 풀스크린 스냅 슬라이드 아키텍처)**
   - `IntersectionObserver` 55% 임계값 기반 활성 슬라이드 전환 원리
   - 슬라이드 01(대분류/세부지형) ➔ 슬라이드 02(위성/대안명소) ➔ 슬라이드 03(3D/등고선/비교) ➔ 슬라이드 04(4탭 해설) 간 상태 흐름 정밀 매핑
   - 모바일/태블릿 반응형 뷰포트 처리 및 터치 제스처 스냅 제어 전략 기술

3. **`docs/CURRICULUM_GUIDE.md` (2022 개정 교육과정 연계 수업 가이드)**
   - 2022 개정 교육과정(중학교 과학, 고등학교 통합과학, 지구과학, 한국지리, 세계지리) 성취기준 코드 및 단원 연계표 최신화
   - 플랫폼의 4단 슬라이드 구조를 45분/50분 차시별 수업(도입-전개-발전-정리)으로 적용하는 수업 지도안 예시 2종(화산 지형, 카르스트/하천 지형) 수록

4. **`docs/USER_MANUAL.md` (사용자 및 교사용 매뉴얼)**
   - 3D 궤도 뷰어 조작법, 고저차 강조(0.6x~1.5x), 어노테이션 핀 활용법
   - 2D 등고선도 및 실시간 A-B 단면선 작도, 고도 프로파일 차트 판독 실습 요령
   - 듀얼 3D 비교 모드(화면 분할 및 카메라 연동) 조작 팁 및 단축키 정리

5. **`docs/CONTOUR_GUIDE.md` (등고선 및 단면도 분석 가이드)**
   - 주곡선, 간곡선, 조곡선 식별법과 등고선 간격에 따른 경사도(완경사/급경사/절벽) 판독 요령
   - 능선과 계곡의 등고선 굴곡 방향 구분법
   - Marching Squares 알고리즘 및 바이리니어 보간법을 통한 A-B 단면 고도 프로파일 생성 메커니즘 수식 설명

6. **`docs/TERRAIN_GUIDE.md` (26개 지형 총람 및 112개 명소 가이드)**
   - 6대 대분류(화산, 해안, 하천, 카르스트, 빙하, 건조) 산하 26종 세부 지형의 지질학적 형성 메커니즘(침식, 운반, 퇴적, 화성 활동, 용식, 풍화 등) 총정리
   - 전 세계 60개소 및 국내 52개소 대표 지질 명소 팩트 및 관찰 포인트 일람표 매핑

7. **`docs/DATA_SCHEMA.md` (데이터 모델 및 타입 인터페이스 명세)**
   - `PlaceInfo`, `GeologyMetadata`, `EvolutionStage`, `FieldGuide`, `TerrainCategory` 등 TypeScript 인터페이스 상세 기술
   - 필드별 필수/선택 여부, 정규표현식/유효성 제약조건, 권역(`korea` | `world`) 분류 기준 명시

---

### [트랙 2] 신규 특화 문서 3종 신설

1. **신규 문서 1: `docs/STUDENT_WORKSHEET.md` (수업 실습용 학생 탐구 활동지 & 루브릭)**
   - **구성**:
     - `[활동 1] 위성 사진과 3D 디오라마로 탐색하는 지형의 입체성`: 위성 뷰와 3D 뷰를 비교하여 지형의 고저차와 배후 경관 관찰하기
     - `[활동 2] 2D 등고선도와 A-B 단면도로 경사도 분석하기`: 직접 단면선을 긋고 최고/최저 고도, 평균 경사각($\theta$)을 측정하여 계곡/능선 판단하기
     - `[활동 3] 두 지형 1:1 비교 분석 보고서`: 대조적인 지형(예: 순상화산 vs 성층화산, U자곡 vs V자곡)을 듀얼 모드로 관찰하고 공통점/차이점 서술하기
     - `[평가 기준] 과정 중심 수행평가 채점 기준표(Rubric)`: 지형 관찰의 정확성, 단면도 작도 및 수치 해석 능력, 형성 원리 이해도 3단계 척도(상/중/하) 제공

2. **신규 문서 2: `docs/PROCEDURAL_TERRAIN_MATH.md` (절차적 3D 지형 수식 및 셰이더 상세)**
   - **구성**:
     - `terrainMath.ts`의 수학 엔진 상세:
       - 결정론적 PRNG 및 2D Value Noise 수식
       - Fractional Brownian Motion (fBm): 옥타브별 지속률(Persistence)과 공극률(Lacunarity)
       - Domain Warping: 유체 침식 및 복잡한 지층 주름을 표현하는 $f(p + g(p))$ 왜곡 기법
       - Hexagonal Voronoi: 주상절리 육각 기둥 단차 연산
     - 26종 지형별 고도 함수 $z = f(x, y)$ 수식 모델:
       - 원추형 화산(Gaussian Bell + Crater Dip), 칼데라(외륜산 융기 및 호수 분지), 갯벌(조석 갯골 분기), 피오르드(침수 U자곡)
     - 커스텀 등고선 셰이더(`terrainContourShader.ts`) GLSL 파이프라인:
       - 버텍스 셰이더의 표고 정규화 및 프래그먼트 셰이더의 등고선 밴딩 주기 연산
       - Hypsometric Tinting (고도 색채환) 컬러 램프 보간 기법

3. **신규 문서 3: `docs/CONTRIBUTING_TERRAIN.md` (신규 지질 명소 및 프리셋 기여 가이드)**
   - **구성**:
     - 신규 명소 데이터 추가 5단계 워크플로우:
       1. 세부 지형 카테고리 선정 (`src/constants/terrains.ts`)
       2. WGS84 위도/경도 및 Google Maps 쿼리 스트링 획득 방법
       3. 지질학적 팩트시트(`GeologyMetadata`) 및 4단계 진화사(`EvolutionStage`) 작성 표준 가이드라인
       4. 현장 관찰 포인트 및 위성 판독 3선 작성 요령
       5. 해당 권역/지형 상수 파일(`src/constants/places/*.ts`)에 데이터 등록 및 `npm run build` 검증
     - 신규 절차적 지형 생성기 함수 추가 방법:
       - `generators/*.ts` 모듈에 새로운 지형 고도 함수 등록 및 `terrainGenerators.ts` 스위치문 연동법
     - 체크리스트 및 흔한 오류(좌표 반전, 누락된 필드, TypeScript 컴파일 에러) 트러블슈팅

---

### [트랙 3] 메인 README.md 및 문서 내비게이션 동기화

- **`README.md` 전면 동기화**:
  - 새로 추가된 문서 3종을 포함하여 전체 10개 문서에 대한 **'문서 디렉터리 및 빠른 링크'** 섹션 구축
  - 교사/학생/개발자 각 타깃별 추천 읽기 순서(Roadmap) 수록
  - 최신 112개 명소 및 기능 배지, 듀얼 비교 뷰, 등고선 단면도 스펙 동기화

---

## 3. Key Product Decisions & Trade-Offs

- **기존 문서 유지 vs 통합**:
  - *결정*: 기존 7개 문서를 삭제하거나 하나의 거대한 파일로 뭉개지 않고, 고유의 역할을 유지하면서 깊이를 대폭 보강합니다.
  - *이유*: 교사용 가이드, 지형학 도감, 3D 개발 문서, 데이터 스키마는 각기 대상 독자와 사용 목적이 뚜렷하게 다르므로, 모듈형 문서를 유지하는 것이 가독성과 유지보수성에 훨씬 유리합니다.
- **신규 문서 3종 독립 분리**:
  - *결정*: 요청하신 세 가지 핵심 영역을 독립 파일(`STUDENT_WORKSHEET.md`, `PROCEDURAL_TERRAIN_MATH.md`, `CONTRIBUTING_TERRAIN.md`)로 신설합니다.
  - *이유*: 기존 문서에 끼워 넣을 경우 문서 길이가 과도하게 비대해져 실제 교실에서 활동지를 출력하거나, 개발자가 수학 공식/기여 가이드만 신속히 찾아볼 때 탐색 비용이 높아지는 문제를 방지합니다.

---

## 4. Technical Architecture & Document Navigation

```
[ Root Directory ]
│
├── README.md  <── 모든 문서의 허브 & 학습/개발 로드맵 인덱스
│
└── docs/
    ├── 1. USER_MANUAL.md            (화면별 조작법, 3D/등고선 제어 팁)
    ├── 2. CURRICULUM_GUIDE.md       (2022 개정 교육과정 연계, 차시별 수업 모형)
    ├── 3. STUDENT_WORKSHEET.md      [신설] (탐구 활동지 3종, 수행평가 루브릭)
    ├── 4. TERRAIN_GUIDE.md          (6대 범주 26종 지형 성인, 112개 명소 총람)
    ├── 5. CONTOUR_GUIDE.md          (2D 등고선도 판독법, A-B 단면선 고도 프로파일)
    ├── 6. ARCHITECTURE.md           (시스템 전체 아키텍처, 렌더링 파이프라인)
    ├── 7. SLIDE_ARCHITECTURE.md     (4단 스냅 슬라이드, 상태 동기화)
    ├── 8. PROCEDURAL_TERRAIN_MATH.md[신설] (절차적 노이즈 수식, 셰이더 GLSL)
    ├── 9. DATA_SCHEMA.md            (TypeScript 데이터 모델 규격)
    └── 10. CONTRIBUTING_TERRAIN.md  [신설] (명소 데이터/지형 추가 기여 매뉴얼)
```

모든 문서는 일관된 디자인 톤(이모지 헤더, GitHub 인용 블록, 수식 표기, 1:1 대조 표)과 마크다운 린트 규칙을 준수하여 작성됩니다.
