# 🌍 지형 탐험가 (Geography Explorer)

> **대한민국과 전 세계의 다양한 지형을 3D 시뮬레이션과 고해상도 위성 지도로 입체 탐구하는 인터랙티브 지리·지구과학 교육 플랫폼**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 프로젝트 소개 (Overview)

**지형 탐험가(Geography Explorer)**는 2차원 교과서 삽화와 평면 사진만으로는 체감하기 어려웠던 지형의 고저차, 형성과정, 공간적 규모를 **절차적 3D 지형 렌더링(Procedural 3D Terrain)**과 **실시간 구글 위성 지도**를 결합하여 입체적으로 학습할 수 있도록 설계된 인터랙티브 웹 애플리케이션입니다.

화산, 해안, 하천, 카르스트, 빙하, 건조의 **6대 대분류** 및 **26개 세부 지형**, 그리고 대한민국과 전 세계의 **112개 지질 명소 프리셋**을 탑재하여 학생, 교사, 지리·지질 애호가 모두에게 실감 나는 탐험 경험을 제공합니다.

---

## ✨ 핵심 기능 (Key Features)

### 🏔️ 1. 절차적 3D 정밀 지형 시뮬레이터 (3D Terrain Simulation)
- **수학적 절차 생성 알고리즘**:
  - 다중 옥타브 분수 브라운 운동(FBM, Fractional Brownian Motion)과 보로노이(Voronoi) 노이즈를 활용하여 주상절리의 육각 기둥, 단층애(Fault Scarp), 갯벌의 수지상 갯골, 삼각주 분지 등을 정밀하게 구현.
- **다각도 관찰 뷰모드**:
  - `기본 시점 (Isometric)`: 지형 전체의 윤곽과 공간감을 조망
  - `조감도 (Top-down)`: 위성 지도와 대조 가능한 수직 하향 뷰
  - `정면 횡단면 (Front View)`: 지층 및 단면 경사도 분석에 용이한 뷰
  - `360도 자유 회전 및 궤도 컨트롤(OrbitControls)`: 마우스 드래그 및 줌 인/아웃
- **지형 특징 3D 어노테이션 핀 (Feature Pins)**:
  - 분화구, 기생화산, 파식대, 해식아치, 배후습지 등 지형학적 핵심 포인트를 3D 공간 상에 인터랙티브 핀과 툴팁으로 시각화.
- **분석 보조 도구**:
  - `고저차 강조 슬라이더 (Relief Scale)`: 0.6x ~ 1.5x 실시간 지형 과장 조절
  - `등고선 격자망 (Wireframe Grid)`: 표면 와이어프레임을 통한 고도 변화 감지
  - `자동 회전 (Auto Rotation)`: 전시 및 프리젠테이션용 부드러운 턴테이블 모드

### 🛰️ 2. 실시간 구글 위성 지도 & 랜드마크 연동 (Satellite Imagery)
- 선택한 명소의 정확한 위성 좌표를 Google Satellite 뷰와 직접 연계하여 실제 지표 패턴 확인.
- 동일 지형 내 다른 대표 명소로 즉시 이동할 수 있는 **대안 장소 추천(Alternative Places)** 및 **무작위 셔플(Shuffle)** 지원.

### 📚 3. 지질학·지형학 전문 학술 데이터 (Scientific Insights)
- **정규화된 지질 메타데이터**:
  - 형성 지질 연대 (Geological Age, 예: 신생대 제4기)
  - 대표 구성 암석 (Rock Type, 예: 다공질 알칼리 현무암)
  - 형성 주체 및 지형 형성 작용 (Geomorphic Agent, 예: 마그마 분출, 유수 침식)
  - 정량적 스케일 (해발 고도, 면적, 깊이, 연장 길이)
- **지형 발달 4단계 진화사 (Evolution Stages)**:
  - 원시 상태부터 현재 형태에 이르기까지 지형의 변천 과정을 단계별 타임라인 카드로 체계화.
- **현장 탐방 & 위성 판독 가이드 (Field Guide)**:
  - 위성사진 판독 핵심 체크포인트 3선
  - 최적 방문 시기 및 관찰 조건 (예: 썰물 간조 2시간 전, 계절별 수량)
  - 지질 보존 및 안전 유의사항

### 🌏 4. 대한민국 vs 전 세계 권역 전환 (Dual Regional Coverage)
- **대한민국 (Korea)**: 제주도 성산일출봉, 한탄강 주상절리, 신두리 해안사구, 영월 한반도지형(감입곡류천), 단양 고수동굴, 백두산 천지 등 국내 대표 지질 유산 집중 탐구.
- **전 세계 (Global)**: 하와이 킬라우에아, 그랜드 캐니언, 나이아가라 폭포, 하롱베이 탑 카르스트, 노르웨이 게이랑에르 피오르드, 사하라 사막 등 글로벌 랜드마크 탐구.

---

## 🗺️ 지원 지형 분류 체계 (Covered Terrains)

| 대분류 | 대표 이미지 | 포함 세부 지형 (Sub-terrains) |
| :--- | :---: | :--- |
| **화산 및 산지 지형** | 🌋 | 화산, 칼데라, 주상절리, 용암동굴, 단층 산맥 |
| **해안 지형** | 🌊 | 갯벌, 해식애 (해안 절벽), 시스택 (바위섬), 해안 사구, 사주 |
| **하천 지형** | 💧 | 선상지, 곡류천, 삼각주, 하안단구, 폭포 |
| **카르스트 지형** | 🧭 | 석회동굴, 돌리네, 탑 카르스트 |
| **빙하 지형** | ❄️ | U자곡, 피오르드, 혼 (호른), 모레인 |
| **건조 지형** | ☀️ | 사막, 버섯바위, 오아시스, 플라야 |

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend & Core
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite 6](https://vitejs.dev/)

### 3D Graphics & Simulation
- **3D Engine**: [Three.js](https://threejs.org/)
- **React Canvas Integration**: [@react-three/fiber](https://r3f.docs.pmnd.rs/) (R3F)
- **3D Helpers & Controls**: [@react-three/drei](https://github.com/pmndrs/drei) (OrbitControls, Sky, Environment)

### UI & Styling
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown) & [remark-gfm](https://github.com/remarkjs/remark-gfm)

---

## 📁 프로젝트 폴더 구조 (Project Structure)

```text
├── src/
│   ├── components/              # 주요 UI 및 3D 렌더링 컴포넌트
│   │   ├── Terrain3D.tsx        # Three.js 기반 26개 지형 절차적 3D 시뮬레이터
│   │   ├── SearchResult.tsx     # 지형 상세 분석, 위성 뷰, 학술 데이터 대시보드
│   │   ├── HeroSlideshow.tsx    # 메인 지형 대분류 슬라이드쇼
│   │   ├── Navigation.tsx       # 상단 글로벌/국내 권역 선택 네비게이션
│   │   ├── Header.tsx           # 타이틀 및 유틸리티 헤더
│   │   ├── LoadingOverlay.tsx   # 인터랙티브 로딩 오버레이
│   │   └── ErrorMessage.tsx     # 에러 피드백 컴포넌트
│   ├── constants/
│   │   ├── terrains.ts          # 6대 대분류 및 26개 지형 카테고리 정의
│   │   ├── places.ts            # 전체 112개 장소 프리셋 통합 및 검색 필터 로직
│   │   └── places/              # 권역별 지질 명소 상세 데이터베이스
│   │       ├── volcanic.ts      # 화산·산지 지형 데이터 (24개소)
│   │       ├── coastal.ts       # 해안 지형 데이터 (22개소)
│   │       ├── fluvial.ts       # 하천 지형 데이터 (22개소)
│   │       ├── karst.ts         # 카르스트 지형 데이터 (14개소)
│   │       ├── glacial.ts       # 빙하 지형 데이터 (16개소)
│   │       └── arid.ts          # 건조 지형 데이터 (14개소)
│   ├── hooks/
│   │   └── useTerrainSearch.ts  # 지형 검색, 장소 추천 및 무작위 셔플 훅
│   ├── types/
│   │   └── index.ts             # 학술 메타데이터, 진화 단계, 지형 데이터 타입 정의
│   ├── App.tsx                  # 메인 레이아웃 및 상태 관리 엔트리
│   ├── main.tsx                 # React 루트 마운트
│   └── index.css                # Tailwind CSS v4 메인 스타일시트
├── index.html                   # HTML 엔트리 포인트
├── package.json                 # 프로젝트 의존성 및 스크립트 설정
├── tsconfig.json                # 타입스크립트 컴파일러 설정
└── vite.config.ts               # Vite 플러그인 및 빌드 설정
```

---

## 🚀 빠른 시작 (Getting Started)

### 요구 사양 (Prerequisites)
- **Node.js**: `18.x` 이상 (20.x 권장)
- **npm** 또는 **yarn / pnpm**

### 설치 (Installation)

```bash
# 1. 저장소 복제 (Clone Repository)
git clone https://github.com/your-username/terrain-explorer.git

# 2. 프로젝트 디렉터리로 이동
cd terrain-explorer

# 3. 의존성 패키지 설치
npm install
```

### 개발 서버 실행 (Development)

```bash
npm run dev
```
브라우저에서 `http://localhost:3000` (또는 터미널에 표시된 주소)로 접속하여 애플리케이션을 확인합니다.

### 프로덕션 빌드 (Production Build)

```bash
# 타입 검사 및 정적 빌드 산출물 생성 (dist/ 폴더)
npm run build

# 빌드 결과물 로컬 미리보기
npm run preview
```

---

## 🎮 조작 가이드 (Interaction Guide)

- **지형 탐색**: 메인 슬라이더에서 탐색할 지형(예: 칼데라, 주상절리, 갯벌 등)의 칩을 클릭합니다.
- **3D 뷰 조작**:
  - `좌클릭 + 드래그`: 3D 지형 궤도 회전
  - `우클릭 + 드래그`: 카메라 평면 이동 (Pan)
  - `스크롤 휠`: 카메라 줌 인 / 줌 아웃
- **상단 툴바**:
  - `시점 버튼`: 기본, 탑다운, 정면 뷰를 원클릭으로 전환
  - `특징 핀`: 지형의 형성 핵심 부위 핀 토글
  - `격자망`: 지형 표면 등고선 와이어프레임 확인
- **하단 슬라이더**:
  - `고저차 슬라이더`: 완만한 사구부터 험준한 산악까지 입체감을 즉각 강조

---

## 📄 라이선스 (License)

본 프로젝트는 **MIT 라이선스**에 따라 자유롭게 사용, 수정 및 배포할 수 있습니다. 자세한 사항은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 💡 문의 및 기여 (Contributing)

버그 제보 및 기능 제안은 언제나 환영합니다!
- 이슈 등록: [GitHub Issues](https://github.com/your-username/terrain-explorer/issues)
- 풀 리퀘스트(Pull Request)를 통한 지리 데이터 확장 및 코드 기여를 환영합니다.
