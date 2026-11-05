# 🌍 지형 탐험가 (Geography Explorer)

> **전 세계와 대한민국의 다양한 지형을 4단 풀스크린 스냅 슬라이드, 3D 절차적 디오라마, 실시간 3D 등고선·지층 시각화, 고해상도 위성지도, 그리고 교과 연계 4탭 학습 가이드로 입체 탐구하는 차세대 지리·지구과학 교육 플랫폼**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 1. 프로젝트 개요 (Overview)

**지형 탐험가 (Geography Explorer)**는 2차원 교과서 삽화와 평면 사진만으로는 체감하기 어려웠던 지형의 고저차, 형성과정, 공간적 규모를 **4단 전면 스냅 슬라이드(Full-Page Snap Scroll)** 구조 속에서 **실시간 3D 절차적 디오라마(Procedural 3D Terrain)**, **커스텀 GLSL 3D 등고선 셰이더**, **지층 단면 노출**, **고저차 과장 조절**, **실시간 구글 위성 지도**, 그리고 **교과 연계 4탭 정형화 해설**과 결합하여 입체적으로 학습할 수 있도록 설계된 전문 인터랙티브 웹 애플리케이션입니다.

화산, 해안, 하천, 카르스트, 빙하, 건조의 **6대 대분류** 및 **26개 세부 지형**, 그리고 **전 세계(60개소)를 메인 기본 권역**으로 하여 대한민국(52개소)까지 총 **112개 지질 명소 데이터베이스**를 탑재하여 초·중·고 학생과 교사, 지구과학 연구자, 지리 애호가 모두에게 최적의 탐험 경험을 제공합니다.

---

## 🖼️ 2. 4단 풀스크린 스냅 슬라이드 구조 (4-Slide Architecture)

뷰포트 $100\text{vh}$ 단위로 구분된 4개의 화면이 부드러운 스냅 스크롤과 우측 플로팅 독(01~04)으로 완벽하게 동기화됩니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4-Slide Fullscreen Experience                   │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│    SLIDE 01     │    SLIDE 02     │     SLIDE 03     │    SLIDE 04     │
│  [메인 히어로]  │  [구글 위성지도]│   [3D 디오라마]  │  [상세 지형 해설]│
├─────────────────┼─────────────────┼──────────────────┼─────────────────┤
│• 6대 대분류     │• 100vh 위성 뷰  │• 360° 3D 디오라마 │• 4대 주제별 탭  │
│• 26개 지형 태그 │• WGS84 좌표 핀  │• [신규] 3D 등고선│• 교과 성취기준  │
│• 6초 자동 롤링  │• 연계 지형 전환 │• [신규] 지층 단면│• 4단계 형성사   │
│• 원클릭 즉시탐색│• 구글 어스 링크 │• [신규] 고저차 배율│• 현장 관찰 가이드│
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

1. **SLIDE 01 · 메인 히어로 (Hero Slideshow)**:
   - 6대 대분류(화산, 해안, 하천, 카르스트, 빙하, 건조) 자동/수동 롤링 캐러셀.
   - 세부 26개 지형 태그를 클릭하면 선택된 지형의 대표 명소로 자동 선택되어 슬라이드 02로 스무스 스크롤 이동.
2. **SLIDE 02 · 구글 위성지도 (100vh Fullscreen Map)**:
   - 전 세계 및 국내 대표 명소의 고해상도 위성 좌표를 전체화면으로 렌더링.
   - 상단 바의 `연계 지형` 버튼을 통해 동일 범주 내 다른 대표 명소로 즉시 이동.
3. **SLIDE 03 · 3D 입체 지형 디오라마 (100vh 3D Diorama & Visual Studio)**:
   - Three.js / React Three Fiber 기반의 고해상도 절차적 3D 디오라마 캔버스.
   - **실시간 3D 골드 등고선(Isoline) 셰이더 투영 토글 (등고선 ON/OFF)**.
   - **지오메트리 측면 지층 단면(Strata) 스커트 노출 토글 (지층 ON/OFF)**.
   - **실시간 지형 고저차 과장 배율 조절 (1.0x ➔ 1.3x ➔ 1.6x)**.
   - 360° 자동 회전, 뷰 리셋, 전체화면 몰입 모드 (단축키 `ESC` 지원).
   - 하단 핵심 지질 프로필 리본 (지질 시대, 암석 종류, 지체 구조, 형성 인자, 대표 규모).
4. **SLIDE 04 · 상세 지형 해설 (Curriculum-Aligned 4-Tab Guide)**:
   - `01. 지질학 프로필`: 핵심 지질 요약, 지체 구조, 암석학적 특성.
   - `02. 4단계 형성 진화`: 초기 형성부터 현재 경관까지 시계열 진화 타임라인.
   - `03. 현장·위성 탐방`: 현장 관찰 핵심 포인트 3선, 위성 사진 판독법, 지질 탐방 수칙.
   - `04. 교과 연계`: 2022 개정 중·고교 과학, 통합과학, 지구과학 성취기준 코드 및 단원 연계.

---

## ✨ 3. 핵심 3D 시각화 도구 (Visual Capabilities)

Slide 03의 상단 툴바를 통해 누구나 손쉽게 3D 지형의 시각적 요소를 제어할 수 있습니다:

```
┌────────────────────────────────────────────────────────────────────────┐
│                    SLIDE 03 시각화 제어 툴바 안내                       │
├──────────────┬─────────────────────────────────────────────────────────┤
│ [등고선 ON]  │ 3D 표면에 금색 등고선(Isoline) 라인을 실시간 투영       │
│ [지층 ON]    │ 지오메트리 4면에 지질 단층 및 퇴적 줄무늬 스커트 표시   │
│ [고저차 배율]│ 1.0x ➔ 1.3x ➔ 1.6x 원터치 순환으로 미세 기복 극대화    │
│ [회전 / 리셋]│ 360도 부드러운 자동 턴테이블 회전 및 기본 시점 원클릭 복귀│
│ [전체화면]   │ 대형 화면/전자칠판 수업을 위한 3D 몰입형 전체화면 모드 │
└──────────────┴─────────────────────────────────────────────────────────┘
```

---

## 🛠️ 4. 기술 스택 (Tech Stack)

### Frontend & Core
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite 6.2](https://vitejs.dev/)

### 3D Graphics & Simulation
- **3D Engine**: [Three.js](https://threejs.org/)
- **React Canvas Integration**: [@react-three/fiber](https://r3f.docs.pmnd.rs/) (R3F v9)
- **3D Helpers & Orbit Controls**: [@react-three/drei](https://github.com/pmndrs/drei)
- **Procedural Noise**: FBM, Value Noise, Hexagonal Voronoi, Domain Warping
- **Custom Shaders**: GLSL Isoline Contour Injection Shader

### UI & Styling
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) & [remark-gfm](https://github.com/remarkjs/remark-gfm)

---

## 📁 5. 프로젝트 구조 (Clean Project Structure)

```text
├── docs/                                  # 📚 시각화 및 기술 문서 (3대 핵심 가이드)
│   ├── ARCHITECTURE.md                    # 전체 시스템 아키텍처 및 3D 렌더링 파이프라인
│   ├── SLIDE_VISUAL_GUIDE.md              # 4단 슬라이드별 화면 도해 및 3D 조작 가이드
│   └── TERRAIN_CATALOG.md                 # 6대 대분류 26종 지형 원리 & 112개 지질 명소 총람
├── src/
│   ├── components/                        # UI 및 시뮬레이션 컴포넌트
│   │   ├── Navigation.tsx                 # 상단 헤더 (전세계/대한민국 권역 전환 및 리셋)
│   │   ├── SlideNavigationDock.tsx        # 4단 스냅 슬라이드 우측 고정 인디케이터 독
│   │   ├── HeroSlideshow.tsx              # 슬라이드 01: 6대 대분류 히어로 슬라이드쇼
│   │   ├── slides/                        # 슬라이드별 풀스크린 컴포넌트
│   │   │   ├── GoogleMapSlide.tsx         # 슬라이드 02: 100vh 구글 위성지도 뷰
│   │   │   ├── Terrain3DSlide.tsx         # 슬라이드 03: 100vh 3D 디오라마 & 시각화 HUD
│   │   │   └── GeologicalGuideSlide.tsx   # 슬라이드 04: 4대 탭 교육 가이드 해설 슬라이드
│   │   ├── Terrain3D.tsx                  # Three.js 26개 지형 3D 디오라마 캔버스
│   │   ├── LoadingOverlay.tsx             # 탐색 로딩 오버레이
│   │   ├── ErrorMessage.tsx               # 에러 피드백 토스트
│   │   └── terrain/                       # 3D 지형 생성 및 등고선 셰이더 하위 모듈
│   │       ├── terrainMath.ts             # 노이즈, FBM, Voronoi 단일 수학 엔진
│   │       ├── terrainGenerators.ts       # 6대 범주 지형 수치 평가기 통합 및 DEM 연동
│   │       ├── terrainTextures.ts         # 프로시저럴 범프 텍스처 (암석, 사구, 빙하 등)
│   │       ├── TerrainAnnotationsData.ts  # 지형별 3D 인터랙티브 피처 핀 데이터
│   │       ├── TerrainSpecialMeshes.tsx   # 화산 분화구, 주상절리 기둥 등 특수 지질 메쉬
│   │       ├── generators/                # 6대 범주별 절차적 높이 필드 생성기
│   │       └── contour/                   # 3D 등고선 셰이더 및 DEM 필드 모듈
│   │           ├── terrainContourShader.ts   # 실시간 3D 골드 등고선 GLSL 셰이더
│   │           ├── terrainDEMGenerator.ts    # DEM 고도 필드 및 기복량 연산기
│   │           └── terrainContourMetadata.ts # 지형별 등고선 간격 설정값
│   ├── constants/
│   │   ├── terrains.ts                    # 6대 범주 및 26개 지형 메타데이터
│   │   ├── places.ts                      # 112개 장소 프리셋 통합 및 필터링
│   │   └── places/                        # 대분류별 장소 데이터베이스 (112개소)
│   ├── utils/
│   │   └── curriculumHelper.ts            # 교육과정 성취기준, 팩트시트, 용어사전 헬퍼
│   ├── hooks/
│   │   └── useTerrainSearch.ts            # 지형 검색 및 장소 셔플 커스텀 훅
│   ├── types/
│   │   ├── index.ts                       # 학술 메타데이터, 진화 단계, 장소 타입
│   │   └── contour.ts                     # DEM 표고 필드 및 등고선 간격 사양 타입
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

## 🚀 6. 빠른 시작 (Getting Started)

### 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 지형 탐험을 시작할 수 있습니다.

### 프로덕션 빌드 & 린트 검증
```bash
# TypeScript 정적 타입 검사
npm run lint

# Vite 프로덕션 빌드
npm run build
```

---

## 📚 7. 상세 문서 안내 (Documentation Index)

프로젝트와 관련된 3종의 핵심 시각화 문서는 `docs/` 디렉터리에 정리되어 있습니다:

- 🏗️ **[시스템 아키텍처 (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)**: 전체 시스템 구조, 풀스크린 스냅 스크롤 동기화, R3F 3D 지형 렌더링 및 GLSL 등고선 셰이더 파이프라인.
- 📖 **[4단 슬라이드 시각화 가이드 (docs/SLIDE_VISUAL_GUIDE.md)](docs/SLIDE_VISUAL_GUIDE.md)**: 4개 슬라이드별 화면 도해, 3D 등고선/지층/고저차 컨트롤러 조작법 및 교육적 판독 요령.
- 🌍 **[지형 총람 및 112개 지질 명소 카탈로그 (docs/TERRAIN_CATALOG.md)](docs/TERRAIN_CATALOG.md)**: 6대 대분류 26종 세부 지형의 형성 원리와 전 세계 60개소, 국내 52개소 지질 팩트 총람.

---

## 📄 8. 라이선스 (License)

본 프로젝트는 **[MIT 라이선스](LICENSE)**에 따라 오픈소스로 자유롭게 사용, 연구, 수정 및 배포할 수 있습니다.
