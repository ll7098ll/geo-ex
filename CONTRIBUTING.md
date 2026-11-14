# 🤝 기여 가이드라인 (Contributing to Geography Explorer)

지형 탐험가(Geography Explorer) 프로젝트에 관심을 가져주셔서 감사합니다!  
본 프로젝트는 전 세계와 대한민국의 지형과 지질학적 가치를 누구나 입체적으로 탐구할 수 있도록 돕는 오픈소스 교육 플랫폼입니다.  
버그 제보, 문서 개선, 신규 지질 명소 제안, 그리고 3D 절차적 지형 알고리즘 기여까지 모든 형태의 기여를 환영합니다.

---

## 📌 목차
1. [행동 강령 (Code of Conduct)](#1-행동-강령-code-of-conduct)
2. [개발 환경 설정 (Development Setup)](#2-개발-환경-설정-development-setup)
3. [신규 지질 명소(Place) 추가 가이드](#3-신규-지질-명소place-추가-가이드)
4. [신규 3D 절차적 지형 지오메트리 기여 가이드](#4-신규-3d-절차적-지형-지오메트리-기여-가이드)
5. [UI 및 디자인 컨벤션 (Swiss-Brutalist)](#5-ui-및-디자인-컨벤션-swiss-brutalist)
6. [커밋 메시지 컨벤션 (Commit Convention)](#6-커밋-메시지-컨벤션-commit-convention)
7. [풀 리퀘스트(PR) 제출 절차](#7-풀-리퀘스트pr-제출-절차)

---

## 1. 행동 강령 (Code of Conduct)

본 프로젝트는 상호 존중과 배려의 오픈소스 커뮤니티 문화를 지향합니다. 기여에 참여하는 모든 분은 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)의 행동 강령을 준수해야 합니다.

---

## 2. 개발 환경 설정 (Development Setup)

### 2.1 요구 사항
- **Node.js**: v20.18.0 이상 (LTS 권장, v22+ 최적 지원)
- **npm**: v10 이상 (또는 pnpm / yarn)
- **WebGL 2.0 지원 브라우저**: Chrome, Edge, Safari, Firefox 최신 버전

### 2.2 저장소 클론 및 패키지 설치
```bash
git clone https://github.com/ll7098ll/geo-ex.git
cd geo-ex
npm install
```

### 2.3 개발 서버 실행 및 검증
```bash
# 로컬 개발 서버 (http://localhost:3000)
npm run dev

# PR 제출 전 필수 검증: TypeScript 정적 타입 검사 & 프로덕션 빌드
npm run lint
npm run build
```

---

## 3. 신규 지질 명소(Place) 추가 가이드

지형 탐험가는 현재 **165개 지질 명소(전 세계 86개소, 대한민국 79개소)**를 탑재하고 있습니다.

### 3.1 파일 위치
명소가 속하는 대분류에 따라 `src/constants/places/` 내 해당 파일을 수정합니다:
- 화산: [`src/constants/places/volcanic.ts`](src/constants/places/volcanic.ts)
- 해안: [`src/constants/places/coastal.ts`](src/constants/places/coastal.ts)
- 하천: [`src/constants/places/fluvial.ts`](src/constants/places/fluvial.ts)
- 카르스트: [`src/constants/places/karst.ts`](src/constants/places/karst.ts)
- 빙하: [`src/constants/places/glacial.ts`](src/constants/places/glacial.ts)
- 건조: [`src/constants/places/arid.ts`](src/constants/places/arid.ts)

### 3.2 `PlaceInfo` 객체 작성 규격 예시
> **주의**: `id`는 전체 6개 파일 통틀어 **반드시 고유(Unique)**해야 합니다. 표본 수집 아카이브(`SpecimenDrawer`) 및 직접 조회(`getPlaceById`)가 `id`를 기준으로 동작합니다.

```typescript
{
  id: 'volcano-kr-18', // 전체 데이터셋 내 고유 식별자 (중복 금지)
  terrain: '주상절리',   // 26개 세부 지형 태그 중 하나
  region: 'korea',     // 'korea' | 'world'
  placeName: '포항 달전리 주상절리',
  countryOrArea: '대한민국 경상북도 포항시',
  tagline: '신생대 제3기 현무암질 안산암이 빚어낸 부채꼴 모양의 천연기념물 주상절리대',
  description: '### 장소 소개 및 선정 이유\n...',
  formationProcess: '약 1,500만 년 전 마그마가 지표 가까이 분출한 뒤 급격히 냉각되면서 수축 작용에 의해...',
  observationPoints: [
    '수직 방향이 아닌 완만한 경사로 누워있는 부채꼴 형태의 기둥 배열',
    '오각 및 육각형의 횡단면 단애 구조',
    '주변 퇴적암층과의 관입 경계면'
  ],
  mapQuery: '포항 달전리 주상절리',
  geology: {
    geologicalAge: '신생대 제3기 마이오세 (약 1,500만 년 전)',
    rockType: '현무암질 안산암',
    tectonicSetting: '동해 개열 및 한반도 동남부 화성 활동',
    geomorphicAgent: '용암 냉각 수축 및 절리 단애 풍화',
    scale: {
      elevationMeters: 65,
      lengthKm: 0.1
    }
  },
  evolutionStages: [
    {
      stageNumber: 1,
      title: '열하 분출 및 마그마 관입',
      timeframe: '약 1,500만 년 전',
      process: '동해 확장과 관련된 지각 변동으로 규산염 마그마가 균열을 따라 상승...',
      visualKeyFeature: '고온의 마그마 챔버 및 단층 틈새 충진'
    }
    // 총 3~4단계 권장 (4단 아코디언 블레이드 및 난이도별 해설과 자동 연동)
  ],
  fieldGuide: {
    coordinates: { lat: 36.0094, lng: 129.3142 },
    bestVisitingSeason: '사계절 탐방 가능 (오전 10시~오후 2시 일조 시 기둥 음영 선명)',
    satelliteCheckPoints: [
      '달전리 야산 사면의 노두 노출 구역 확인',
      '주변 경작지와 단애 지형의 경계선 관찰',
      '인근 하천 유로와의 고도차 판독'
    ],
    cautionAndConservation: '천연기념물 제415호 지정 구역으로 암석 채취 및 훼손 절대 금지'
  },
  curriculumLink: '중학교 과학 1권 지권의 암석 / 고등학교 지구과학 I 화성암과 지질 구조'
}
```

---

## 4. 신규 3D 절차적 지형 지오메트리 기여 가이드

지형 탐험가는 외부 3D 에셋 파일(GLTF/OBJ) 대신 순수 수치 수학과 GLSL 셰이더를 결합한 **절차적 디오라마** 엔진을 사용합니다.

1. **고도 함수 작성 (`src/components/terrain/generators/`)**:
   - `volcanic.ts`, `coastal.ts` 등의 제너레이터 모듈에 2D 좌표 `(x, y)`를 받아 `elevation`과 `color`를 반환하는 평가 함수를 구현합니다.
   - [`terrainMath.ts`](src/components/terrain/terrainMath.ts)의 `fbm`, `warpedFbm`, `smoothstep`, `clamp` 유틸리티를 재사용합니다.
2. **지형 키 라우팅 등록**:
   - [`src/components/terrain/terrainGenerators.ts`](src/components/terrain/terrainGenerators.ts)의 `resolveTerrainKey()` 함수에 새 키워드나 아키타입 분기를 등록합니다.
3. **특수 지질 메쉬 결합 및 GPU 메모리 해제 (선택 사항)**:
   - 복잡한 3D 피처가 필요한 경우 [`src/components/terrain/TerrainSpecialMeshes.tsx`](src/components/terrain/TerrainSpecialMeshes.tsx)에 서브 메쉬 컴포넌트를 정의하고, 반드시 `useDisposeGeometry` 훅으로 `BufferGeometry.dispose()`를 보장해야 합니다.
4. **등고선 메타데이터 등록**:
   - [`src/components/terrain/contour/terrainContourMetadata.ts`](src/components/terrain/contour/terrainContourMetadata.ts)에 기본 등고선 주곡선/계곡선 간격을 지정합니다.

---

## 5. UI 및 디자인 컨벤션 (Swiss-Brutalist)

- **직각 규율**: [`src/index.css`](src/index.css)의 전역 `border-radius: 0px !important` 원칙을 준수하며, 새로운 컴포넌트에도 둥근 모서리를 전제로 한 스타일링을 지양합니다.
- **토큰 활용**: 배경 `#08080A`, 패널 `#131418`, 강조 `#FFCC00` / `#1F34FF`, 유틸리티 클래스 `.hairline-border`, `.corner-ticks`, `.diagonal-hatch-cobalt`를 일관되게 사용합니다.
- **성능 규칙**: 비활성 슬라이드의 루프 애니메이션 및 WebGL `frameloop`을 차단(`isActive` 제어)하고, `prefers-reduced-motion`을 존중합니다.

---

## 6. 커밋 메시지 컨벤션 (Commit Convention)

본 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 규격을 준수합니다.

```text
<타입>[적용범위]: <설명>

[본문 (선택 사항)]
```

- `feat`: 새로운 기능 추가 (예: `feat(3d): add fault mountain scarp geometry`)
- `fix`: 버그 수정 (예: `fix(archive): load exact specimen id and region`)
- `perf`: 성능/메모리 최적화 (예: `perf(terrain): use LRU cache and dispose meshes`)
- `refactor`: 동작 변화 없는 코드 구조 정리
- `docs`: 문서 수정 및 보강 (예: `docs: update docs for v1.3.0`)
- `chore`: 빌드 설정, 패키지 관리 등

---

## 7. 풀 리퀘스트(PR) 제출 절차

1. 본 저장소를 개인 GitHub 계정으로 **Fork**합니다.
2. 새 브랜치를 생성합니다: `git checkout -b feat/add-new-terrain`
3. 변경 후 `npm run lint && npm run build` 통과 여부를 반드시 확인합니다.
4. 포크 저장소로 푸시한 뒤 `ll7098ll/geo-ex`의 `main` 브랜치로 Pull Request를 생성합니다.

기여해 주셔서 감사합니다! 🌍
