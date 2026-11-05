# 지형 탐험가(Geography Explorer) 코드 경량화 및 4단 슬라이드 중심 시각화 문서 체계 개편 계획

실제 사용자 화면에 노출되는 4개 슬라이드(메인 히어로, 위성 지도, 3D 디오라마, 상세 지형 해설)에 맞춰 불필요한 레거시 코드와 불일치 문서를 전면 정리하고, 3D 화면의 지층 및 3D 등고선 시각 효과를 활성화하며, 도해와 다이어그램 중심의 정합성 높은 시각화 문서 체계를 구축합니다.

## User Review & Critical Decisions

> [!IMPORTANT]
> 사전 질의응답을 통해 사용자가 직접 선택한 세 가지 핵심 방향을 100% 반영하여 설계를 확정했습니다.

- **정리 및 삭제 범위**: 화면에 렌더링되지 않는 미사용 레거시 코드(`SearchResult.tsx`, `TerrainCompareView.tsx` 및 단절된 모달 파일)와 현재 화면과 어긋난 기존 문서를 전면 정리 및 삭제
- **문서 체계 개편 방식**: 산재되어 있던 10종의 문서를 실제 동작하는 4개 슬라이드(Slide 01~04)와 112개 지형 카탈로그, 시스템 아키텍처 중심의 3대 시각화 문서 체계(`README.md`, `docs/SLIDE_VISUAL_GUIDE.md`, `docs/TERRAIN_CATALOG.md`, `docs/ARCHITECTURE.md`)로 압축 개편
- **시각화 강화 영역**: 
  1. **UI 시각화**: Slide 03(3D 지형 디오라마)에 실시간 '3D 등고선 셰이더 오버레이', '지층 단면 노출', '고저차 과장(Relief Scale)' 토글 컨트롤러를 추가하여 3D 시각 효과 극대화
  2. **문서 시각화**: ASCII 구조도, 상태 전이 흐름도, 4단 뷰포트 레이아웃 맵, 지질 팩트시트 테이블을 적극 도입하여 한눈에 파악 가능한 비주얼 문서로 작성

---

## 1. Overview & Core Concept

- **What It Does**:
  - **코드베이스 순도 100% 달성**: 현재 풀스크린 스냅 4단 슬라이드 구조에서 실제로 실행되는 코드만 남기고, 이전 모놀리식 뷰나 미연동 기능 잔재를 완벽히 제거합니다.
  - **3D 시각 효과 활성화**: 이미 셰이더와 지오메트리 엔진으로 구축되어 있었으나 UI가 닫혀 있던 '3D 등고선 라인', '지층 단면(Strata)', '고저차 배율'을 조작할 수 있는 세련된 3D 툴바를 제공합니다.
  - **화면 1:1 일치 시각화 문서**: 사용자가 화면에서 보고 조작하는 모든 요소가 문서의 도해 및 설명과 오차 없이 100% 일치하도록 문서 생태계를 일신합니다.
- **Target Audience**:
  - 지구과학 및 지리 교과를 탐구하는 교사와 학생
  - 3D 절차적 지형 렌더링 엔진을 유지보수하고 지형 데이터를 확장하는 개발자
- **Key Value**:
  - 죽은 코드와 어긋난 문서로 인한 혼선 제거 (Zero Confusion)
  - 3D 디오라마의 시각적 인터랙션 및 입체 지형 판독성 극대화

---

## 2. User Experience & Visual Design

### Key User Flows & Visual Enhancements

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4-Slide Fullscreen Experience                   │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 01. HERO SLIDESHOW │ 02. SATELLITE MAP  │ 03. 3D TERRAIN DIORAMA       │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ • 6대 대분류 배너  │ • 구글 위성 풀스크린│ • 360° 자유 궤도 회전        │
│ • 26종 세부 지형   │ • WGS84 좌표 줌인  │ • [신규] 3D 등고선 오버레이  │
│ • 원클릭 즉시 탐색 │ • 연계 지형 퀵 전환│ • [신규] 지층 단면 뷰 토글   │
│                    │                    │ • [신규] 고저차 과장 조절    │
│                    │                    │ • 하단 핵심 지질 프로필 리본 │
└────────────────────┴────────────────────┴──────────────────────────────┘
                                  │
                                  ▼
                     ┌────────────────────────────┐
                     │ 04. GEOLOGICAL GUIDE SLIDE │
                     ├────────────────────────────┤
                     │ • 지질 팩트시트 & 암석학   │
                     │ • 4단계 지형 진화 시계열   │
                     │ • 현장 탐방 핵심 체크포인트│
                     │ • 2022 개정 교육과정 연계  │
                     └────────────────────────────┘
```

- **Slide 03 3D 디오라마 UI 시각화 강화**:
  - 상단 툴바에 컴팩트한 시각화 제어 그룹 추가:
    - `등고선 (Contours)`: 금색 3D 등고선 셰이더 실시간 투영 토글
    - `지층 (Strata)`: 지오메트리 측면 지층 줄무늬 노출 토글
    - `고저차 (Relief)`: 1.0x / 1.3x / 1.6x 고저차 스케일 원터치 전환
    - `회전 (Rotate)` & `뷰 리셋 (Reset)`: 기존 카메라 제어 기능 유지
  - 기존의 검증된 다크 미니멀리즘 테마(`bg-black/85 backdrop-blur-md`, `#FFCC00` 액센트, 세리프 제목)를 유지하여 시각적 일체감 보장

- **문서 디자인 및 비주얼 도해**:
  - 텍스트 나열을 지양하고 ASCII 박스 드로잉, 뷰포트 레이아웃 도면, 2열 비교 테이블을 적극 활용
  - 화면 UI 구성요소와 1:1로 매칭되는 컴포넌트 맵 수록

---

## 3. Key Product Decisions & Trade-Offs

- **미사용 컴포넌트 파일 완전 삭제**:
  - *결정*: `SearchResult.tsx`, `TerrainCompareView.tsx`, 사용되지 않는 2D 등고선 모달 컴포넌트군(`ContourMapModal.tsx`, `CrossSection3DVisualizer.tsx`, `ElevationSlicePlane.tsx`, `ContourReadingGuideModal.tsx` 등)을 파일 시스템에서 안전하게 삭제합니다.
  - *이유*: 4단 슬라이드 아키텍처로 완전 전환된 현재, 사용되지 않는 컴포넌트가 남아있으면 번들 크기 증가, IDE 검색 혼선, 문서와의 불일치를 유발합니다.
- **3D 디오라마 내장 셰이더 및 시각화 기능 활성화**:
  - *결정*: 2D 캔버스 팝업 모달 대신, 사용자가 가장 몰입하는 Slide 03 3D 뷰포트 위에 3D 등고선 및 지층 뷰를 직접 오버레이합니다.
  - *이유*: 별도의 팝업을 띄우지 않고 3D 화면 자체에서 즉시 등고선 굴곡과 지형의 단면을 입체적으로 관찰할 수 있어 훨씬 높은 시각적 임팩트와 학습 효과를 제공합니다.
- **문서 10종 ➔ 4대 시각화 통합 문서로 압축**:
  - *결정*: 현재 화면에 보이지도 않는 가상의 듀얼 비교나 2D 모달을 다루던 기존 10종 문서를 과감히 정리하고, 화면 구조와 1:1로 완벽히 일치하는 4대 문서(`README.md`, `SLIDE_VISUAL_GUIDE.md`, `TERRAIN_CATALOG.md`, `ARCHITECTURE.md`)로 압축 개편합니다.
  - *이유*: 문서가 많더라도 실제 앱과 다르면 무용지물입니다. 실제 코드 및 화면과 100% 정합되는 압축된 시각화 문서가 교사와 개발자 모두에게 훨씬 가치 있습니다.

---

## 4. Technical Architecture & File Cleanup Strategy

### Component & Data Hierarchy Diagram

```
[ App.tsx ] (Full-Page Snap Scroll Container)
 │
 ├── [ Navigation.tsx ] (Top Header: 권역 선택, 리셋)
 ├── [ SlideNavigationDock.tsx ] (우측 플로팅 슬라이드 인디케이터)
 │
 ├── [ Slide 01: HeroSlideshow.tsx ]
 │     └── 6대 범주, 26개 지형 슬라이더, 원클릭 탐색
 │
 ├── [ Slide 02: GoogleMapSlide.tsx ]
 │     └── 구글 위성 지도 임베드, WGS84 좌표 핀, 연계 명소
 │
 ├── [ Slide 03: Terrain3DSlide.tsx ] ──★ [ 시각화 컨트롤러 강화 ]
 │     └── [ Terrain3D.tsx ]
 │           ├── DioramaMesh (절차적 3D 지형 & 지층 단면)
 │           ├── terrainContourShader (3D 골드 등고선 셰이더)
 │           └── TerrainSpecialMeshes (화산 분화구/마그마/주상절리 등)
 │
 └── [ Slide 04: GeologicalGuideSlide.tsx ]
       └── 4탭 해설: 지질학 프로필 / 4단계 진화 / 현장 가이드 / 교육과정 연계
```

### 파일 정리 및 문서 재편 상세 목록

| 구분 | 파일 경로 | 처리 계획 | 사유 |
|:---|:---|:---:|:---|
| **코드 삭제** | `src/components/SearchResult.tsx` | **삭제** | 4단 슬라이드 이전 구형 단일 스크롤 모놀리식 뷰 (미참조) |
| **코드 삭제** | `src/components/TerrainCompareView.tsx` | **삭제** | 현재 화면에서 진입로 없는 듀얼 비교 뷰 (미참조) |
| **코드 삭제** | `src/components/terrain/contour/ContourMapModal.tsx` | **삭제** | 2D 등고선 모달 컴포넌트 (미참조) |
| **코드 삭제** | `src/components/terrain/contour/ContourMapView.tsx` | **삭제** | 2D 등고선 캔버스 뷰 (미참조) |
| **코드 삭제** | `src/components/terrain/contour/ContourReadingGuideModal.tsx` | **삭제** | 등고선 읽기 안내 모달 (미참조) |
| **코드 삭제** | `src/components/terrain/contour/CrossSection3DVisualizer.tsx` | **삭제** | 단면 3D 시각화 미사용 컴포넌트 |
| **코드 삭제** | `src/components/terrain/contour/ElevationProfileChart.tsx` | **삭제** | 2D 고도 차트 미사용 컴포넌트 |
| **코드 삭제** | `src/components/terrain/contour/ElevationSlicePlane.tsx` | **삭제** | 슬라이스 평면 미사용 컴포넌트 |
| **코드 삭제** | `src/components/terrain/contour/crossSectionMath.ts` | **삭제** | A-B 단면 수학 함수 (미참조) |
| **코드 삭제** | `src/components/terrain/contour/marchingSquares.ts` | **삭제** | 2D 등고선 추출 알고리즘 (미참조) |
| **코드 보존/활용**| `src/components/terrain/contour/terrainContourShader.ts` | **보존 및 연동** | 3D 지표면에 직접 렌더링되는 실시간 3D 등고선 셰이더 |
| **코드 보존/활용**| `src/components/terrain/contour/terrainDEMGenerator.ts` | **보존 및 연동** | 3D 고도 필드 및 등고선 간격 메타데이터 생성기 |
| **코드 보존/활용**| `src/components/terrain/contour/terrainContourMetadata.ts` | **보존 및 연동** | 지형별 등고선 간격 설정값 |
| **기능 강화** | `src/components/Terrain3D.tsx` & `Terrain3DSlide.tsx` | **수정** | 3D 등고선 셰이더, 지층 단면, 고저차 과장 토글 컨트롤 연동 |
| **문서 재편** | `README.md` | **전면 개편** | 4단 슬라이드 시각 맵, 3D 시각화 기능, 최신 문서 인덱스 동기화 |
| **문서 재편** | `docs/SLIDE_VISUAL_GUIDE.md` | **신규 통합** | 4개 슬라이드별 화면 도해, 조작법, 시각적 판독 가이드 (기존 매뉴얼 대체) |
| **문서 재편** | `docs/TERRAIN_CATALOG.md` | **신규 통합** | 6대 범주 26개 지형 원리 & 112개 국내외 명소 팩트 총람 (기존 가이드 대체) |
| **문서 재편** | `docs/ARCHITECTURE.md` | **전면 개편** | 4단 풀스크린 스냅 슬라이드 + R3F 3D 지형 셰이더 아키텍처 다이어그램 |
| **구형 문서 정리**| `docs/CONTOUR_GUIDE.md` 외 8개 기존 파일 | **정리/삭제** | 실제 화면과 불일치하는 구형 문서 8종 정리 및 신규 3대 문서로 흡수 통합 |
