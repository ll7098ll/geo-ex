# 🌍 지형 탐험가 (Geography Explorer)

> **전 세계와 대한민국의 165개 지질 명소를 4단 풀스크린 스냅 슬라이드, 240×240 고해상도 절차적 3D 디오라마, 실시간 3D 등고선·지질 단면 시각화, 고해상도 위성지도, 그리고 내셔널지오그래픽 탐사 저널 스타일의 에디토리얼 4대 탭 해설로 입체 탐구하는 차세대 지리·지구과학 교육 플랫폼**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Version](https://img.shields.io/badge/Version-1.2.0-FFCC00?style=flat-square)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 1. 프로젝트 개요 (Overview)

**지형 탐험가 (Geography Explorer)**는 2차원 교과서 삽화와 평면 사진만으로는 체감하기 어려웠던 지형의 고저차, 형성과정, 공간적 규모를 **4단 전면 스냅 슬라이드(Full-Page Snap Scroll)** 구조 속에서 **240×240 절차적 3D 디오라마(Procedural 3D Terrain)**, **커스텀 GLSL 3D 등고선 셰이더**, **28층 세분화 지질 단면 노출**, **고저차 과장 조절**, **실시간 구글 위성 지도**, 그리고 **2022 개정 교육과정 연계 에디토리얼 심층 해설**과 결합하여 입체적으로 학습할 수 있도록 설계된 전문 인터랙티브 웹 애플리케이션입니다.

화산, 해안, 하천, 카르스트, 빙하, 건조의 **6대 대분류**, **26개 기본 지형 태그**, **39종 고유 지오메트리 세부 아키타입**, 그리고 **총 165개(전 세계 86개소, 대한민국 79개소) 지질 명소 풀 데이터베이스**를 탑재하여 초·중·고 학생과 교사, 지구과학 연구자, 지리 애호가 모두에게 최적의 탐험 경험을 제공합니다.

---

## 🖼️ 2. 4단 풀스크린 스냅 슬라이드 구조 (4-Slide Architecture)

뷰포트 $100\text{vh}$ 단위로 구분된 4개의 화면이 부드러운 CSS 스냅 스크롤과 우측 플로팅 독(01~04)으로 완벽하게 동기화됩니다.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        4-Slide Fullscreen Expedition Experience                        │
├─────────────────┬─────────────────┬──────────────────┬─────────────────────────────────┤
│    SLIDE 01     │    SLIDE 02     │     SLIDE 03     │            SLIDE 04             │
│  [메인 히어로]  │  [구글 위성지도]│   [3D 디오라마]  │        [에디토리얼 심층 탭]     │
├─────────────────┼─────────────────┼──────────────────┼─────────────────────────────────┤
│• 26개 지형 태그 │• WGS84 좌표 핀  │• 3D 골드 등고선  │• [신규] 4단계 난이도 스위처 │
│• 6초 자동 롤링  │• [신규] 돋보기락│• 28층 지층 단면  │• 01. 4단계 형성 원리 (진화) │
│• 원클릭 즉시탐색│• 연계 지형 전환 │• 고저차 배율 조절│• 02. 핵심 개념 & 지질 팩트   │
│                 │                 │• 특수 메쉬 결합  │• 03. 현장·위성 탐방 가이드   │
│                 │                 │• 지질 프로필 플래카드 │• 04. 심층 리포트 전문       │
└─────────────────┴─────────────────┴──────────────────┴─────────────────────────────────┘
```

1. **SLIDE 01 · 메인 커버 히어로 (Cover Hero Slideshow)**:
   - 내셔널지오그래픽 탐사 저널(Field Expedition Journal Vol. 2026) 감성의 에디토리얼 커버.
   - 6대 대분류(화산, 해안, 하천, 카르스트, 빙하, 건조) 6초 자동/수동 롤링 캐러셀.
   - 상단 헤더에서 `[KR] 대한민국` (79개소) / `[WD] 전 세계` (86개소) 권역 원클릭 전환.
   - 세부 지형 태그를 클릭하면 대표 명소로 매칭되어 슬라이드 02로 스무스 스크롤 이동.
2. **SLIDE 02 · 초고해상도 구글 위성지도 (Satellite Expedition Map)**:
   - WGS84 정밀 지리 좌표를 전체화면(100vh)으로 렌더링.
   - **위성 지도 조작 돋보기 모드 (토글)**: 지도 드래그/줌 조작과 페이지 스크롤 스냅 간의 충돌을 방지하는 스크롤 잠금 스위치 탑재.
   - 미드-레프트 에디토리얼 패널을 통해 동일 지형 범주 내 연계 명소로 즉시 이동.
3. **SLIDE 03 · 3D 입체 지형 디오라마 스튜디오 (3D Diorama Visual Studio)**:
   - Three.js / React Three Fiber 기반의 **240×240 적응형 대각선 분할 고해상도 지형 엔진**.
   - **실시간 3D 골드 등고선(Isoline) 셰이더 투영** (수면 하부 자동 마스킹 지원).
   - **디오라마 4개 수직 벽면 28층 세분화 지질 단면(Strata Skirt) 노출 토글**.
   - **실시간 지형 고저차 과장 배율 조절 (1.0x ➔ 1.3x ➔ 1.6x)**: 완경사 지형의 미세 기복 극대화.
   - **특수 지질 메쉬 실체화**: 주상절리 기둥군(~270개), 전면 절개형 석회/용암동굴, 3D 버섯바위, 해식아치, 폭포 캡록 등.
   - 360° 턴테이블 자동 회전, 표준 45° 뷰 리셋, 전체화면 몰입 모드 (단축키 `ESC` 지원).
   - 하단 에디토리얼 지질 프로필 플래카드 (`EPOCH`, `LITHOLOGY`, `TECTONICS`, `AGENT`, `SCALE`).
4. **SLIDE 04 · 상세 지형 해설 & 4단계 맞춤 교육 대시보드 (Geological Investigation)**:
   - **4단계 학습자 맞춤 난이도 스위처 (`초등` / `중등` / `고등` / `일반`)**:
     * `초등 (기초 탐구)`: 유치한 비유 없이 담백하고 쉬운 교과 어휘 순화기 적용.
     * `중등 (원리 이해)`: 마그마 점성, 유수 침식·퇴적 등 인과관계 중심 과학 원리.
     * `고등 (교과 심층)`: 2022 개정 성취기준 코드, 암석 분화 계열, 수능/내신 포인트.
     * `일반 (지리 교양)`: 심층 시간(Deep Time)과 경관 미학, 현장 지리 여행 팁.
   - **4대 정리된 대시보드 탭**:
     * `01. 4단계 형성 원리`: 초기 분화부터 현재 경관까지 시계열 4단계 진화 타임라인.
     * `02. 핵심 개념 & 지질 팩트`: 단원, 성취기준, 3대 핵심 개념, 지질 프로필 팩트시트.
     * `03. 현장·위성 탐방 가이드`: 위성사진 판독 3대 단서, 최적 방문 조건, 지질 보존 및 안전 수칙.
     * `04. 심층 리포트 전문`: 전문 학술 분석 리포트 전문 마크다운.

---

## ✨ 3. 핵심 3D 시각화 도구 (Visual Capabilities)

Slide 03의 상단 HUD 툴바를 통해 누구나 손쉽게 3D 지형의 시각적 요소를 실시간 제어할 수 있습니다:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         SLIDE 03 시각화 제어 HUD 툴바 안내                             │
├──────────────┬─────────────────────────────────────────────────────────────────────────┤
│ [등고선 ON]  │ 3D 표면에 골드 등고선(Isoline) 투영 (수면 하부는 자동 차단 마스킹)      │
│ [지층 ON]    │ 디오라마 4개 벽면에 28개 층위의 지질 단층 및 퇴적 줄무늬 스커트 표시    │
│ [고저차 배율]│ 1.0x ➔ 1.3x ➔ 1.6x 원터치 순환으로 완경사 지형의 미세 기복을 극대화    │
│ [회전 / 리셋]│ 360도 부드러운 턴테이블 회전 및 표준 45도 투시 시점 원클릭 복귀         │
│ [전체화면]   │ 교실 전자칠판 및 대형 디스플레이 수업을 위한 3D 몰입형 전체화면 모드   │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 4. 기술 스택 (Tech Stack)

### Frontend & Core
- **Framework**: [React 19](https://react.dev/) (React 19.0.0)
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite 6.2](https://vitejs.dev/)

### 3D Graphics & Procedural Simulation
- **3D Engine**: [Three.js](https://threejs.org/) (r183)
- **React Canvas Integration**: [@react-three/fiber](https://r3f.docs.pmnd.rs/) (R3F v9)
- **3D Helpers & Orbit Controls**: [@react-three/drei](https://github.com/pmndrs/drei) (v10)
- **Procedural Noise Engine**: FBM (Fractional Brownian Motion), Domain Warping, Hexagonal Voronoi, Value Noise
- **Custom WebGL Shaders**: GLSL Isoline Injection Shader, Triplanar Cliff Micro-bedding, Cavity AO, Slope Heatmap

### UI & Editorial Design
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Motion](https://motion.dev/) (v12)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Parser**: [react-markdown](https://github.com/remarkjs/react-markdown) & [remark-gfm](https://github.com/remarkjs/remark-gfm)

---

## 📁 5. 프로젝트 구조 (Clean Project Structure)

```text
├── docs/                                  # 📚 시각화 및 기술 문서 (3대 핵심 가이드)
│   ├── ARCHITECTURE.md                    # 전체 시스템 아키텍처 및 3D 렌더링 파이프라인
│   ├── SLIDE_VISUAL_GUIDE.md              # 4단 슬라이드별 화면 도해 및 3D 조작 가이드
│   └── TERRAIN_CATALOG.md                 # 6대 범주 39종 아키타입 & 165개 지질 명소 총람
├── .github/                               # 🤝 GitHub 협업 및 이슈/PR 템플릿
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                  # 버그 제보 템플릿
│   │   └── terrain_place_request.md       # 신규 지형/명소 추가 제안 템플릿
│   └── PULL_REQUEST_TEMPLATE.md           # 풀 리퀘스트 표준 검증 템플릿
├── src/
│   ├── components/                        # UI 및 시뮬레이션 컴포넌트
│   │   ├── Navigation.tsx                 # 상단 에디토리얼 마스트헤드 (권역 전환 및 리셋)
│   │   ├── SlideNavigationDock.tsx        # 4단 스냅 슬라이드 우측 플로팅 인디케이터 독
│   │   ├── HeroSlideshow.tsx              # 슬라이드 01: 6대 대분류 히어로 슬라이드쇼
│   │   ├── slides/                        # 슬라이드별 풀스크린 뷰포트
│   │   │   ├── GoogleMapSlide.tsx         # 슬라이드 02: 100vh 구글 위성지도 & 조작 돋보기 모드
│   │   │   ├── Terrain3DSlide.tsx         # 슬라이드 03: 100vh 3D 디오라마 HUD & 지질 프로필
│   │   │   └── GeologicalGuideSlide.tsx   # 슬라이드 04: 에디토리얼 심층 4대 탭 교육 가이드
│   │   ├── Terrain3D.tsx                  # Three.js 캔버스 및 3D 디오라마 렌더러
│   │   ├── LoadingOverlay.tsx             # 탐색 로딩 오버레이
│   │   ├── ErrorMessage.tsx               # 에러 피드백 토스트
│   │   └── terrain/                       # 3D 절차적 지형 생성 및 셰이더 엔진
│   │       ├── terrainMath.ts             # 절차적 노이즈 및 수치 보간 단일 수학 엔진
│   │       ├── terrainGenerators.ts       # 39종 아키타입 라우팅 및 240×240 지오메트리 빌더
│   │       ├── terrainTextures.ts         # 프로시저럴 범프 텍스처 (암석, 사구, 빙하 등)
│   │       ├── TerrainAnnotationsData.ts  # 지형별 3D 인터랙티브 피처 핀 데이터
│   │       ├── TerrainSpecialMeshes.tsx   # 주상절리(~270개 기둥), 절개동굴 등 26종 특수 메쉬
│   │       ├── generators/                # 6대 범주별 절차적 높이 필드 생성기
│   │       └── contour/                   # 3D 등고선 셰이더 및 DEM 필드 모듈
│   │           ├── terrainContourShader.ts   # 실시간 3D 골드 등고선 GLSL 인젝션 셰이더
│   │           ├── terrainDEMGenerator.ts    # 240×240 정규화 DEM 표고 필드 생성기
│   │           └── terrainContourMetadata.ts # 지형별 등고선 기본 규격 정의
│   ├── constants/
│   │   ├── terrains.ts                    # 6대 대분류 및 26개 지형 태그 마스터
│   │   ├── places.ts                      # 165개 장소 프리셋 통합 엔트리
│   │   └── places/                        # 카테고리별 165개 전수 지질 명소 데이터베이스
│   ├── utils/
│   │   └── curriculumHelper.ts            # 2022 개정 교육과정 연계 메타데이터 및 용어사전 헬퍼
│   ├── hooks/
│   │   └── useTerrainSearch.ts            # 지형 검색 및 장소 셔플 커스텀 훅
│   ├── types/
│   │   ├── index.ts                       # 학술 메타데이터, 진화 단계, 장소 타입
│   │   └── contour.ts                     # DEM 표고 필드 및 등고선 사양 타입
│   ├── App.tsx                            # 최상위 4단 스냅 슬라이드 레이아웃 관리
│   ├── main.tsx                           # React 엔트리 포인트
│   └── index.css                          # Tailwind CSS v4 스타일시트 & 매거진 유틸리티
├── CHANGELOG.md                           # 버전별 공식 변경 이력 (Keep a Changelog 준수)
├── CONTRIBUTING.md                        # 기여 가이드라인 및 개발 가이드
├── CODE_OF_CONDUCT.md                     # Contributor Covenant v2.1 행동 강령
├── SECURITY.md                            # 보안 정책 및 취약점 제보 안내
├── package.json                           # 프로젝트 의존성 및 스크립트
├── tsconfig.json                          # TypeScript 컴파일러 설정
├── vite.config.ts                         # Vite 빌드 설정
└── LICENSE                                # MIT 라이선스
```

---

## 🚀 6. 빠른 시작 (Getting Started)

### 사전 요구 사항
- **Node.js**: v20.18.0 이상 (v22+ 권장)
- **npm**: v10 이상

### 설치 및 개발 서버 실행
```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 구동
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 지형 탐험을 시작할 수 있습니다.

### 프로덕션 빌드 & 린트 검증
```bash
# TypeScript 정적 타입 검사
npm run lint

# Vite 프로덕션 빌드 번들링
npm run build
```

---

## 📚 7. 상세 문서 안내 (Documentation Index)

프로젝트와 관련된 심층 기술 문서 및 커뮤니티 거버넌스 가이드는 아래 링크에서 확인하실 수 있습니다:

- 🏗️ **[시스템 아키텍처 (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)**: 전체 시스템 구조, 풀스크린 스냅 스크롤 동기화, 240×240 절차적 디오라마 파이프라인 및 GLSL 셰이더 인젝션 원리.
- 📖 **[4단 슬라이드 시각화 가이드 (docs/SLIDE_VISUAL_GUIDE.md)](docs/SLIDE_VISUAL_GUIDE.md)**: 4개 슬라이드별 화면 도해, 위성 지도 돋보기 모드, 3D 등고선/지층/고저차 HUD 조작법 및 지형학적 판독 요령.
- 🌍 **[지형 총람 및 165개 지질 명소 카탈로그 (docs/TERRAIN_CATALOG.md)](docs/TERRAIN_CATALOG.md)**: 6대 대분류, 39종 고유 지오메트리 아키타입 형성 원리 및 전 세계 86개소, 대한민국 79개소 지질 팩트 총람.
- 📋 **[변경 이력 (CHANGELOG.md)](CHANGELOG.md)**: v1.0.0부터 최신 v1.2.0까지의 기능 추가, 개선 및 릴리즈 히스토리.
- 🤝 **[기여 가이드라인 (CONTRIBUTING.md)](CONTRIBUTING.md)**: 로컬 개발 환경, 신규 지질 명소 추가 절차, 3D 절차적 지형 기여 방법 및 커밋 컨벤션.
- 🛡️ **[행동 강령 (CODE_OF_CONDUCT.md)](CODE_OF_CONDUCT.md)** & **[보안 정책 (SECURITY.md)](SECURITY.md)**: 오픈소스 상호 존중 규범과 보안 취약점 비공개 제보 안내.

---

## 📄 8. 라이선스 (License)

본 프로젝트는 **[MIT 라이선스](LICENSE)**에 따라 오픈소스로 자유롭게 사용, 연구, 수정 및 배포할 수 있습니다.
