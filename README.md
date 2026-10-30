# 🌍 지형 탐험가 (Geography Explorer)

> **전 세계와 대한민국의 다양한 지형을 4단 풀스크린 스냅 슬라이드, 3D 절차적 시뮬레이션, 인터랙티브 2D 등고선도 및 단면도 분석, 그리고 중·고교 교육과정 연계 4탭 학습 가이드로 입체 탐구하는 차세대 지리·지구과학 교육 플랫폼**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 1. 프로젝트 소개 (Overview)

**지형 탐험가 (Geography Explorer)**는 2차원 교과서 삽화와 평면 사진만으로는 체감하기 어려웠던 지형의 고저차, 형성과정, 공간적 규모를 **4단 전면 스냅 슬라이드(Full-Page Snap Scroll)** 구조 속에서 **실시간 3D 수치 시뮬레이션(Procedural 3D Terrain)**, **Marching Squares 기반 2D 등고선도 및 지형 단면 분석**, **듀얼 3D 비교 모드**, **실시간 구글 위성 지도**, 그리고 **교과 연계 4탭 정형화 해설**과 결합하여 입체적으로 학습할 수 있도록 설계된 전문 인터랙티브 웹 애플리케이션입니다.

화산, 해안, 하천, 카르스트, 빙하, 건조의 **6대 대분류** 및 **26개 세부 지형**, 그리고 **전 세계(60개소)를 메인 기본 권역**으로 하여 대한민국(52개소)까지 총 **112개 지질 명소 프리셋**을 탑재하여 초·중·고 학생과 교사, 지구과학 연구자, 지리 애호가 모두에게 최적의 탐험 경험을 제공합니다.

---

## 🖼️ 2. 4단 풀스크린 스냅 슬라이드 구조 (4-Slide Architecture)

뷰포트 $100\text{vh}$ 단위로 구분된 4개의 화면이 부드러운 스냅 스크롤과 우측 플로팅 독(01~04)으로 완벽하게 동기화됩니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4-Slide Fullscreen Experience                   │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│    SLIDE 01     │    SLIDE 02     │     SLIDE 03     │    SLIDE 04     │
│   [메인 화면]   │  [구글 위성지도]│ [3D 디오라마/단면│  [상세 지형 해설]│
│                 │                 │                  │                 │
│ 6대 대분류 탐색 │ 100vh 위성 뷰   │ 360° 3D 디오라마 │ 4대 주제별 탭   │
│ 26개 지형 칩    │ 동일지형 명소   │ 2D 등고선/단면도 │ 교과 성취기준   │
│ 전세계 기본선택 │ Google Earth    │ 듀얼 3D 비교 모드│ 용어사전/타임라인│
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

1. **SLIDE 01 · 메인 화면 (Hero Slideshow)**:
   - 6대 대분류(화산, 해안, 하천, 카르스트, 빙하, 건조) 자동/수동 롤링 캐러셀.
   - 세부 26개 지형 칩을 클릭하면 선택된 지형의 실제 위성 위치로 스무스 스크롤 자동 이동.
2. **SLIDE 02 · 구글 위성지도 (100vh Fullscreen Map)**:
   - 전 세계 및 국내 대표 명소의 고해상도 위성 좌표를 전체화면으로 렌더링.
   - 동일 지형 내 다른 대표 랜드마크로 즉시 이동할 수 있는 `대안 장소 선택 칩 바`.
3. **SLIDE 03 · 3D 입체 지형 스튜디오 (100vh 3D Diorama & Analysis)**:
   - Three.js / React Three Fiber 기반의 절차적 3D 디오라마 캔버스.
   - 시점 프리셋(기본/조감도/정면), 지형 특징 3D 어노테이션 핀, 고저차 강조(0.6x~1.5x) 슬라이더.
   - **2D 등고선도 및 A-B 단면선 고도 프로파일 분석 시스템 (Contour Map Modal)**.
   - **두 지형 나란히 3D 비교 및 카메라 동기화 모드 (Dual 3D Compare View)**.
4. **SLIDE 04 · 상세 지형 해설 (Curriculum-Aligned 4-Tab Guide)**:
   - 긴 스크롤 없이 필요한 내용만 선택 열람하는 4대 탭 인터페이스:
     - `01. 교과 핵심 개요`: 중·고교 교육과정 성취기준 + 지질 팩트시트 + 3대 핵심 요약 카드
     - `02. 형성 원리 4단계`: 기저 형성부터 현대 경관까지 4단계 진화 타임라인
     - `03. 현장·위성 탐방`: 현장 관찰 포인트 + 위성사진 판독 3선 + Google Earth 3D 링크
     - `04. 용어·심층 정리`: 필수 지질학 용어 사전(Glossary) + 심층 지형 보고서 + 학술 출처

---

## ✨ 3. 핵심 기능 (Key Features)

### 🏔️ 1. 절차적 3D 정밀 지형 시뮬레이터 (3D Procedural Terrain Studio)
- **수학적 절차 생성 알고리즘 (Math Engine)**:
  - FBM, Domain Warping, Voronoi 노이즈를 결합하여 주상절리 육각 기둥, 단층애, 갯벌 갯골, 삼각주 분지 등을 실시간 연산.
- **다각도 관찰 뷰모드 & 궤도 컨트롤(OrbitControls)**:
  - `기본(Isometric)`, `조감도(Top-down)`, `정면(Front View)`, `360° 자동 턴테이블`.
- **지형 특징 3D 어노테이션 핀 (Feature Pins)**:
  - 분화구, 기생화산, 파식대, 해식아치 등 지형학적 핵심 포인트를 3D 공간 상에 핀과 툴팁으로 시각화.
- **실시간 고저차 강조 조절 (Relief Scale)**:
  - 0.6x ~ 1.5x 실시간 수직 과장 조절 슬라이더로 완경사 지형의 미세 기복 분석.
- **전체화면 몰입 모드 (Fullscreen)**:
  - 단축키 `ESC`로 간편하게 복귀할 수 있는 풀스크린 3D 뷰어.

### 📐 2. 2D 인터랙티브 등고선도 및 지형 단면 분석 (Contour & Cross-Section)
- **Marching Squares 등고선 생성 알고리즘**:
  - $80 \times 80$ DEM 그리드로부터 주곡선 및 간곡선 실시간 벡터 추출 및 고도 색채환(Hypsometric Tinting) 채색.
- **실시간 대화형 A-B 단면선 작도**:
  - 2D 등고선도 위를 마우스로 드래그하여 임의의 단면선 $A \to B$ 지정.
- **실시간 고도 프로파일 차트 (Elevation Profile Chart)**:
  - 단면선 상의 100개 포인트를 바이리니어 보간하여 최고/최저 표고, 평균 경사각($\theta$), 경사 방향 실시간 연산.
  - 차트 마우스 호버 시 2D 등고선도 상의 해당 지점에 십자선 실시간 동기화.
- **3D 수직 슬라이스 평면 투영 (Elevation Slice Plane)**:
  - 2D 단면선을 3D 뷰어 공간 상에 수직 절단 평면으로 투영하여 2D 단면과 3D 형상의 관계를 직관적으로 이해.

### ⚖️ 3. 두 지형 동시 비교 뷰 (Dual 3D Terrain Comparison)
- **나란히 비교 (Side-by-Side Dual 3D Viewports)**:
  - 서로 다른 두 지형(예: 화산 vs 칼데라, U자곡 vs 곡류천)을 50:50 분할 화면에서 동시에 3D 렌더링.
- **카메라 궤도 동기화 (Camera Orbit Sync)**:
  - 카메라 회전 및 줌 조작을 실시간 연동하여 동일 각도/배율에서 형태학적 차이를 분석.
- **지질·지형학적 7대 항목 1:1 대조 테이블**:
  - 지질 연대, 암석 종류, 주 형성 작용, 정량적 스케일, 지형 발달 과정, 위성 관찰 포인트를 1:1 대조.

### 🛰️ 4. 전 세계(World) 메인 기본 권역 & 112개 지질 명소
- **기본 메인 권역을 '전 세계(World)'로 설정**하여 하와이 킬라우에아 화산, 그랜드 캐니언, 요세미티 U자곡 등 세계적 지형을 우선 로드.
- 상단 네비게이션에서 원클릭으로 **'대한민국(Korea)'** 지형으로 즉시 전환 지원 (제주도, 한탄강, 독도, 단양 등 52개소).

### 🎓 5. 중·고교 교육과정 연계 정형화 학습 가이드 (Curriculum-Aligned Guide)
- **교과 연계 단원 및 성취기준**: 중1 과학 '지권의 변화', 고교 '지구과학 I/II', '한국지리', '세계지리' 단원 연계.
- **지질 프로필 팩트 시트**: 구성 암석(Rock Type), 지질시대(Age), 지구조 환경(Tectonic Setting), 작용력, 고도/면적 제원.
- **3대 핵심 요약 카드**: 지형별 필수 학습 포인트 3선 정형화.
- **지질 용어 사전 (Glossary)**: 시험 출제 빈도가 높은 핵심 용어 정의 및 교과서 탐구 노트 카드 제공.

---

## 🗺️ 4. 지원 지형 분류 체계 (Covered Terrains)

| 대분류 | 대표 아이콘 | 포함 세부 지형 (26종) | 주요 지질 작용 및 메커니즘 |
| :--- | :---: | :--- | :--- |
| **화산 및 산지 지형** | 🌋 | 화산, 칼데라, 주상절리, 용암동굴, 단층 산맥 | 마그마 분출, 냉각 수축, 지각 융기/단층 변위 |
| **해안 지형** | 🌊 | 갯벌, 해식애 (해안 절벽), 시스택 (바위섬), 해안 사구, 사주 | 파랑 침식, 조석 간만 퇴적, 연안류 운반, 풍성 퇴적 |
| **하천 지형** | 💧 | 선상지, 곡류천, 삼각주, 하안단구, 폭포 | 유수 침식·운반·퇴적, 하방/측방 침식, 지반 융기 |
| **카르스트 지형** | 🧭 | 석회동굴, 돌리네, 탑 카르스트 | 약산성 지하수에 의한 탄산염 화학적 용식 작용 |
| **빙하 지형** | ❄️ | U자곡, 피오르드, 혼 (호른), 모레인 | 대륙·곡빙하 굴식(Plucking), 마식, 빙퇴석 퇴적, 침수 |
| **건조 지형** | ☀️ | 사막, 버섯바위, 오아시스, 플라야 | 큰 일교차에 의한 기계적 풍화, 바람의 마식 및 취식 |

---

## 🛠️ 5. 기술 스택 (Tech Stack)

### Frontend & Core
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite 6.2](https://vitejs.dev/)

### 3D Graphics & Simulation
- **3D Engine**: [Three.js](https://threejs.org/)
- **React Canvas Integration**: [@react-three/fiber](https://r3f.docs.pmnd.rs/) (R3F v9)
- **3D Helpers & Orbit Controls**: [@react-three/drei](https://github.com/pmndrs/drei)

### Analysis & Algorithms
- **Procedural Noise**: FBM, Value Noise, Voronoi Distance, Domain Warping
- **Contour Engine**: Marching Squares 2D Vectorization, Hypsometric Tinting
- **Cross-Section Math**: Bilinear Interpolation, Continuous Slope & Angle Calculation

### UI & Styling
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) & [remark-gfm](https://github.com/remarkjs/remark-gfm)

---

## 📁 6. 프로젝트 폴더 구조 (Project Structure)

```text
├── docs/                                  # 📚 상세 기술 및 교육 문서 총람
│   ├── ARCHITECTURE.md                    # 시스템 아키텍처 및 3D/DEM 수치 파이프라인
│   ├── SLIDE_ARCHITECTURE.md              # 4단 풀스크린 스냅 슬라이드 및 컴포넌트 아키텍처
│   ├── CURRICULUM_GUIDE.md                # 중·고교 지구과학 & 지리 교육과정 수업 활용 가이드
│   ├── USER_MANUAL.md                     # 사용자 및 교사 조작 매뉴얼 & FAQ
│   ├── TERRAIN_GUIDE.md                   # 26개 지형학 총람 및 112개 명소 가이드
│   ├── CONTOUR_GUIDE.md                   # 등고선 판독 및 단면 분석 활용 가이드
│   └── DATA_SCHEMA.md                     # 데이터 모델 규격 및 신규 명소 추가 가이드
├── src/
│   ├── components/                        # UI 및 시뮬레이션 컴포넌트
│   │   ├── Navigation.tsx                 # 권역 전환(전세계/대한민국) 및 메인 리셋 헤더
│   │   ├── SlideNavigationDock.tsx        # 4단 스냅 슬라이드 우측 고정 인디케이터 독
│   │   ├── HeroSlideshow.tsx              # 슬라이드 01: 6대 대분류 히어로 슬라이드쇼
│   │   ├── slides/                        # 슬라이드별 전용 풀스크린 컴포넌트
│   │   │   ├── GoogleMapSlide.tsx         # 슬라이드 02: 100vh 구글 위성지도 뷰
│   │   │   ├── Terrain3DSlide.tsx         # 슬라이드 03: 100vh 3D 디오라마 스튜디오
│   │   │   └── GeologicalGuideSlide.tsx   # 슬라이드 04: 4대 탭 교육 가이드 해설 슬라이드
│   │   ├── Terrain3D.tsx                  # Three.js 26개 지형 3D 디오라마 캔버스
│   │   ├── TerrainCompareView.tsx         # 듀얼 3D 뷰포트 & 카메라 동기화 비교 모드
│   │   ├── LoadingOverlay.tsx             # 탐색 로딩 오버레이
│   │   ├── ErrorMessage.tsx               # 에러 피드백 토스트
│   │   └── terrain/                       # 3D 지형 생성 및 등고선 분석 하위 모듈
│   │       ├── terrainMath.ts             # 노이즈, FBM, Voronoi 단일 수학 공급원
│   │       ├── terrainGenerators.ts       # 6대 범주 지형 수치 평가기 통합 및 DEM 연동
│   │       ├── terrainTextures.ts         # 절차적 캔버스 텍스처 (암석, 사구, 빙하 등)
│   │       ├── TerrainAnnotationsData.ts  # 지형별 3D 인터랙티브 피처 핀 좌표 및 해설
│   │       ├── TerrainSpecialMeshes.tsx   # 주상절리 기둥, 시스택 바위, 석순 등 특수 메쉬
│   │       ├── generators/                # 6대 범주별 절차적 높이 필드 생성기
│   │       │   ├── volcanic.ts            # 화산, 칼데라, 주상절리, 용암동굴, 단층산맥
│   │       │   ├── coastal.ts             # 갯벌, 해식애, 시스택, 사구, 사주
│   │       │   ├── fluvial.ts             # 선상지, 곡류천, 삼각주, 하안단구, 폭포
│   │       │   ├── karst.ts               # 석회동굴, 돌리네, 탑 카르스트
│   │       │   ├── glacial.ts             # U자곡, 피오르드, 혼, 모레인
│   │       │   └── arid.ts                # 사막, 버섯바위, 오아시스, 플라야
│   │       └── contour/                   # 2D 등고선 & 단면 분석 모듈
│   │           ├── ContourMapModal.tsx    # 2D 등고선도 모달 래퍼
│   │           ├── ContourMapView.tsx     # 인터랙티브 2D 등고선도 캔버스 뷰
│   │           ├── ContourReadingGuideModal.tsx # 등고선 판독법 교육 가이드 모달
│   │           ├── ElevationProfileChart.tsx    # A-B 단면선 고도 프로파일 차트
│   │           ├── ElevationSlicePlane.tsx      # 3D 공간 상의 수직 절단 평면
│   │           ├── CrossSection3DVisualizer.tsx # 3D 단면 시각화 관리자
│   │           ├── marchingSquares.ts     # Marching Squares 등고선 벡터 추출기
│   │           ├── crossSectionMath.ts    # 단면선 바이리니어 보간 및 경사각 연산
│   │           ├── terrainDEMGenerator.ts # 80x80 DEM 표고 그리드 생성기
│   │           └── terrainContourMetadata.ts    # 지형별 표고 범위 및 등고선 간격 설정
│   ├── constants/
│   │   ├── terrains.ts                    # 6대 범주 및 26개 지형 메타데이터
│   │   ├── places.ts                      # 112개 장소 프리셋 통합 및 필터링
│   │   └── places/                        # 대분류별 장소 데이터베이스 (112개소)
│   ├── utils/
│   │   └── curriculumHelper.ts            # 교육과정 성취기준, 팩트시트, 용어사전 헬퍼
│   ├── hooks/
│   │   └── useTerrainSearch.ts            # 지형 검색 및 장소 셔플 커스텀 훅
│   ├── types/
│   │   ├── index.ts                       # 학술 메타데이터, 진화 단계, 장소, 용어 사전 타입
│   │   └── contour.ts                     # DEM 표고 필드, 등고선 패스, 단면 샘플 타입
│   ├── App.tsx                            # 최상위 4단 스냅 슬라이드 레이아웃 관리
│   ├── main.tsx                           # React 엔트리 포인트
│   └── index.css                          # Tailwind CSS v4 스타일시트
├── index.html                             # HTML5 진입점 및 메타데이터
├── package.json                           # 프로젝트 의존성 및 스크립트
├── tsconfig.json                          # TypeScript 컴파일러 설정
├── vite.config.ts                         # Vite 빌드 설정
└── LICENSE                                # MIT 라이선스
```

---

## 🚀 7. 빠른 시작 (Getting Started)

### 요구 사양 (Prerequisites)
- **Node.js**: `18.x` 이상 (`20.x` 권장)
- **npm** (또는 yarn / pnpm / bun)

### 설치 (Installation)

```bash
# 1. 저장소 복제 (Clone Repository)
git clone https://github.com/your-username/geography-explorer.git

# 2. 프로젝트 디렉터리로 이동
cd geography-explorer

# 3. 의존성 패키지 설치
npm install
```

### 개발 서버 실행 (Development)

```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 지형 탐험을 시작할 수 있습니다.

### 프로덕션 빌드 (Production Build)

```bash
# TypeScript 타입 검사 및 Vite 정적 빌드 산출물 생성 (dist/ 폴더)
npm run build

# 빌드 결과물 로컬 미리보기
npm run preview
```

---

## 📚 8. 상세 기술 및 교육 문서 색인 (Documentation Index)

프로젝트와 관련된 전문 문서는 `docs/` 디렉터리에 체계적으로 정리되어 있습니다:

- 🎓 **[교육과정 수업 활용 가이드 (docs/CURRICULUM_GUIDE.md)](docs/CURRICULUM_GUIDE.md)**: 2022/2015 개정 중·고교 과학 및 지리 단원 매핑표, 4단계 수업 모형, 학생 활동지 및 수행평가 루브릭.
- 📐 **[4단 스냅 슬라이드 아키텍처 (docs/SLIDE_ARCHITECTURE.md)](docs/SLIDE_ARCHITECTURE.md)**: 4단 전체화면 스냅 스크롤 설계, IntersectionObserver 상태 추적, 4탭 교육 가이드 컴포넌트 구조.
- 📖 **[사용자 & 교사 매뉴얼 (docs/USER_MANUAL.md)](docs/USER_MANUAL.md)**: 화면별 조작법, 3D 카메라 제어, 등고선 단면선 긋기, 듀얼 비교 뷰 활용법, 단축키 및 FAQ.
- 🏗️ **[시스템 아키텍처 (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)**: 3D 절차적 렌더링 파이프라인, 수치 노이즈 함수, DEM 그리드 및 Marching Squares 알고리즘 수식 분석.
- 🌍 **[26개 지형학 총람 (docs/TERRAIN_GUIDE.md)](docs/TERRAIN_GUIDE.md)**: 6대 대분류 26종 세부 지형의 성인, 지질 기작, 112개 국내외 명소 총람.
- 📐 **[등고선 및 단면 분석 가이드 (docs/CONTOUR_GUIDE.md)](docs/CONTOUR_GUIDE.md)**: 등고선 기초, 능선/계곡 판독법, 지형 단면도 작도 원리, 학교 수업 실습 활용안.
- 📋 **[데이터 모델 및 기여 가이드 (docs/DATA_SCHEMA.md)](docs/DATA_SCHEMA.md)**: TypeScript 인터페이스 스키마 및 신규 지질 명소 데이터 추가 방법.

---

## 📄 9. 라이선스 (License)

본 프로젝트는 **[MIT 라이선스](LICENSE)**에 따라 오픈소스로 자유롭게 사용, 연구, 수정 및 배포할 수 있습니다.
