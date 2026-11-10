import { PlaceInfo, TerrainEvolutionStage } from '../types';
import { getCurriculumMeta, CurriculumMeta } from './curriculumHelper';
import { getTerrainKnowledge, TerrainMetadataRecord, TerrainLevelProfile } from './terrainConceptData';

export type EducationLevel = 'elementary' | 'middle' | 'high' | 'general';

export interface LevelConfig {
  id: EducationLevel;
  label: string;
  shortLabel: string;
  subLabel: string;
  iconName: string;
  badge: string;
  badgeColor: string;
}

export const EDUCATION_LEVELS: LevelConfig[] = [
  {
    id: 'elementary',
    label: '초등 (기초 탐구)',
    shortLabel: '초등',
    subLabel: '초등 3~6학년 과학·사회',
    iconName: 'GraduationCap',
    badge: '초등 과학·사회 기초',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'middle',
    label: '중등 (원리 이해)',
    shortLabel: '중등',
    subLabel: '중학교 과학·지리',
    iconName: 'BookOpen',
    badge: '중등 과학·지리 표준',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  {
    id: 'high',
    label: '고등 (교과 심층)',
    shortLabel: '고등',
    subLabel: '지구과학·한국지리·통합과학',
    iconName: 'Award',
    badge: '2022 개정 교과 심층',
    badgeColor: 'bg-[#FFCC00]/20 text-[#FFCC00] border-[#FFCC00]/40',
  },
  {
    id: 'general',
    label: '일반 (지리 교양)',
    shortLabel: '일반',
    subLabel: '성인 교양·자연유산 탐방',
    iconName: 'Compass',
    badge: '지리 교양 & 탐방',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
];

export interface FormattedStage {
  stageNumber: number;
  title: string;
  timeframe?: string;
  process: string;
  visualKeyFeature: string;
}

export interface LevelContent {
  level: EducationLevel;
  badge: string;
  headline: string;
  subhead: string;
  summary: string;
  coreQuestionOrTopic: {
    label: string;
    text: string;
  };
  stages: FormattedStage[];
  coreConcepts: {
    term: string;
    description: string;
    curriculumPoint?: string;
  }[];
  factSheet: {
    rockType: string;
    geologicalAge: string;
    tectonicSetting: string;
    geomorphicAgent: string;
    scale?: string;
  };
  fieldNotes: {
    observationPoints: string[];
    satellitePoints: string[];
    bestSeason?: string;
    cautionNote: string;
  };
}

/**
 * 지질학 전문 어휘를 초등 3~6학년 수준의 명확하고 단정한 표준어로 정제
 * (과장이나 유아틱한 비유 배제, 단정한 설명문 구조 유지)
 */
function refineTextForElementary(text: string): string {
  if (!text) return '';

  let res = text
    // 전문 화산/마그마 용어 순화
    .replace(/마그마방 내 분별결정작용으로/g, '땅속 마그마가 서서히 식으면서 성분이 변하여')
    .replace(/분별결정작용/g, '마그마가 식으며 성분이 나뉘는 작용')
    .replace(/규산염이 풍부한 고점성 조면암질 마그마/g, '끈적거림이 매우 강한 조면암질 용암')
    .replace(/점성\s*압출\s*분출/g, '끈적거리는 용암이 천천히 위로 솟아오름')
    .replace(/점성\s*압출/g, '끈적거리는 용암이 솟아오름')
    .replace(/점성이\s*낮(은|고)/g, '끈적거림이 적어 잘 흘러내리$1')
    .replace(/점성이\s*높(은|고)/g, '끈적거림이 강해 멀리 흐르지 못하$1')
    .replace(/유동성이\s*크고/g, '물처럼 잘 흘러내리고')
    .replace(/열하\s*분출/g, '지각의 갈라진 틈을 따라 뿜어져 나옴')
    .replace(/열하분화/g, '땅의 갈라진 틈으로 용암이 솟아나옴')
    .replace(/화산\s*쇄설물/g, '화산 폭발 때 뿜어져 나온 암석 부스러기와 재')
    .replace(/쇄설물/g, '암석 부스러기')
    .replace(/스코리아\s*콘/g, '화산재와 돌부스러기가 쌓인 원뿔형 언덕(기생화산)')
    .replace(/화구\s*함몰/g, '마그마가 빠져나간 뒤 꼭대기가 푹 주저앉음')
    .replace(/수직\s*방향\s*냉각\s*수축절리/g, '용암이 식으면서 부피가 줄어들어 생긴 수직 기둥 모양의 틈')
    .replace(/냉각\s*수축절리/g, '식으면서 생긴 기둥 모양 틈')
    .replace(/판상절리/g, '바위가 판자처럼 얇게 갈라진 틈')
    .replace(/주상절리/g, '육각형 기둥 모양 바위')
    // 전문 하천 용어 순화
    .replace(/하방\s*침식/g, '강물이 바닥 암석을 깊게 깎아내는 작용')
    .replace(/측방\s*침식/g, '강물이 옆쪽 기슭을 깎아내는 작용')
    .replace(/침식기준면/g, '강물이 더 이상 깎을 수 없는 바닥 높이(해수면)')
    .replace(/자유곡류/g, '평평한 들판을 뱀처럼 구불구불 흐르는 강')
    .replace(/감입곡류/g, '솟아오른 산지를 깊게 깎으며 구불구불 흐르는 강')
    .replace(/우각호/g, '옛 물길이 잘려 남은 소뿔 모양 호수')
    .replace(/선정,\s*선앙,\s*선단/g, '골짜기 입구(선정), 중간 자갈밭(선앙), 끝자락 평지(선단)')
    .replace(/토석류/g, '흙과 바위가 빗물과 함께 쏟아져 내리는 현상')
    // 전문 해안 용어 순화
    .replace(/파랑\s*에너지/g, '파도의 힘')
    .replace(/해식애/g, '파도에 깎여 생긴 바위 절벽')
    .replace(/파식대/g, '절벽 아래에 평평하게 남은 바위 바닥')
    .replace(/해식동/g, '파도가 파놓은 바위 동굴')
    .replace(/시스택/g, '절벽이 깎이고 바다에 홀로 남은 뾰족한 바위섬')
    .replace(/사주/g, '모래가 둑처럼 길게 이어져 쌓인 모래언덕')
    .replace(/석호/g, '모래둑이 바다를 가로막아 생긴 자연 호수')
    .replace(/조간대\s*갯벌/g, '밀물과 썰물 사이에 드러나는 평평한 갯벌')
    // 전문 카르스트 용어 순화
    .replace(/탄산염\s*용식\s*작용/g, '빗물에 석회암 바위가 서서히 녹는 작용')
    .replace(/용식\s*작용/g, '바위가 빗물에 녹는 작용')
    .replace(/탄산수소칼슘/g, '물에 녹은 석회 성분')
    .replace(/재침전/g, '다시 돌로 굳어짐')
    .replace(/종유석/g, '천장에서 자라는 돌고드름')
    .replace(/석순/g, '바닥에서 솟아오르는 돌순')
    .replace(/석주/g, '천장의 돌고드름과 바닥의 돌순이 만나 이룬 기둥')
    .replace(/돌리네/g, '땅이 빗물에 녹아 움푹 파인 접시 모양 웅덩이')
    .replace(/우발라/g, '여러 웅덩이가 합쳐져 커진 거대한 골짜기')
    .replace(/테라로사/g, '석회암이 녹은 뒤 남은 붉은 점토 흙')
    // 전문 빙하 용어 순화
    .replace(/저면\s*굴식\(Plucking\)/g, '빙하가 바닥의 바위를 뜯어내는 작용')
    .replace(/측면\s*마모\(Abrasion\)/g, '얼음에 박힌 돌이 골짜기 벽을 긁어 깎는 작용')
    .replace(/굴식/g, '얼음이 바위를 뜯어내는 작용')
    .replace(/마쇄/g, '얼음 속 자갈이 바위를 긁어내는 작용')
    .replace(/U자곡/g, '빙하가 깎아 만든 넓고 깊은 U자 모양 골짜기')
    .replace(/피오르드/g, '깊은 U자 골짜기에 바닷물이 들어와 생긴 바다 협곡')
    .replace(/모레인\(빙퇴석\)/g, '빙하가 녹으면서 남겨 놓은 불규칙한 자갈과 흙더미')
    .replace(/빙퇴석/g, '빙하가 운반해 쌓은 자갈과 흙더미')
    .replace(/호른\(Horn\)/g, '사방에서 빙하가 깎아 만든 뾰족한 피라미드 모양 봉우리')
    // 전문 지각/지구조 용어 순화
    .replace(/신생대\s*제4기\s*플라이스토세/g, '약 200만 년 전 빙하기 시대')
    .replace(/홀로세/g, '비교적 따뜻해진 최근(약 1만 년 전부터 현재)')
    .replace(/판\s*내부\s*열점\(Hotspot\)/g, '지구 깊은 곳에서 마그마가 계속 솟아나는 고정된 자리')
    .replace(/열점/g, '지구 깊은 곳에서 마그마가 솟아오르는 자리')
    .replace(/섭입대/g, '지각 판이 부딪혀 한쪽이 아래로 파고드는 곳')
    .replace(/지반\s*융기/g, '땅이 위로 솟아오름')
    .replace(/지반\s*침강/g, '땅이 아래로 가라앉음')
    .replace(/부정합/g, '아주 오랜 시간 차이가 나는 두 지층 사이의 경계')
    .replace(/타포니/g, '소금기와 바람 때문에 바위 표면에 벌집처럼 파인 구멍');

  return res;
}

/**
 * 중등 수준 텍스트 정제 (표준 과학 용어와 인과관계 강화)
 */
function refineTextForMiddle(text: string): string {
  if (!text) return '';
  return text
    .replace(/분별결정작용으로 규산염이 풍부한 고점성 조면암질 마그마 농축/g, '마그마의 분화 과정에서 SiO2(규산) 함량이 높아지며 점성이 큰 조면암질 마그마 형성')
    .replace(/열점\(Hotspot\)/g, '판 내부의 고정된 마그마 공급원인 열점(Hotspot)')
    .replace(/유압 반경/g, '수로의 단면 형상에 따른 수리학적 유압 반경')
    .replace(/굴식\(Plucking\)과 측면 마모\(Abrasion\)/g, '빙하의 강력한 저면 굴식(바위 뜯어냄)과 측면 마모(바위 긁어냄)');
}

export function getLevelContent(
  place: PlaceInfo,
  level: EducationLevel
): LevelContent {
  const meta: CurriculumMeta = getCurriculumMeta(place);
  const geo = place.geology;
  const stages = place.evolutionStages || [];
  const field = place.fieldGuide;
  const terrainKnowledge: TerrainMetadataRecord = getTerrainKnowledge(place.terrain);
  const profile: TerrainLevelProfile = terrainKnowledge[level];
  const name = place.placeName;

  // 1. Level-specific Headline & Summary
  let headline = `${name} 자연 지리 리포트`;
  let subhead = place.tagline;
  let summary = place.formationProcess || place.description.slice(0, 150) + '...';
  let badge = '2022 개정 교과 심층';

  let coreQuestionOrTopic = {
    label: profile.focusQuestion ? '핵심 탐구 주제' : '탐구 질문',
    text: profile.focusQuestion || meta.coreStandard,
  };

  if (level === 'elementary') {
    badge = '초등 과학·사회 (3~6학년)';
    headline = `${name} 지형은 어떻게 만들어졌을까요?`;
    subhead = refineTextForElementary(place.tagline);
    summary = refineTextForElementary(
      place.formationProcess ||
        `${name}은(는) 땅속의 마그마와 오랜 세월 비, 바람, 강물이 바위를 깎고 쌓으면서 만들어진 자연 지형입니다.`
    );
    coreQuestionOrTopic = {
      label: '초등 교과 탐구 질문',
      text: profile.focusQuestion,
    };
  } else if (level === 'middle') {
    badge = '중등 과학·지리 (1~3학년)';
    headline = `${name} 지형의 형성과 과학적 원리`;
    subhead = refineTextForMiddle(place.tagline);
    summary = refineTextForMiddle(
      place.formationProcess ||
        `${name}은(는) 지구 내부 에너지에 의한 지각 변동과 지표의 침식·퇴적 작용이 상호작용하여 형성되었습니다.`
    );
    coreQuestionOrTopic = {
      label: '중등 과학 원리 탐구',
      text: profile.focusQuestion,
    };
  } else if (level === 'high') {
    badge = '2022 개정 고등 지구과학·지리';
    headline = `${name} 지형학적 형성 메커니즘 및 지질 특성`;
    subhead = place.tagline;
    summary =
      place.formationProcess ||
      `${name}은(는) 지구조적 환경과 암석학적 분화, 그리고 지표 삭박 작용이 결합된 복합 지질 구조체입니다.`;
    coreQuestionOrTopic = {
      label: '2022 개정 성취기준 연계',
      text: `${meta.course} [${meta.unit}]: ${profile.focusQuestion}`,
    };
  } else {
    // General
    badge = '성인 지리 교양 & 현장 탐방';
    headline = `대지의 시간과 풍경: ${name}`;
    subhead = place.tagline;
    summary =
      place.formationProcess ||
      `수백만 년에 걸친 지질학적 시간 속에서 자연이 빚어낸 웅장한 지형과 그 경관적 가치를 살펴봅니다.`;
    coreQuestionOrTopic = {
      label: '지리 교양 및 관전 포인트',
      text: profile.focusQuestion,
    };
  }

  // 2. Format 4 Stages with Level Tailoring
  const formattedStages: FormattedStage[] = stages.length > 0
    ? stages.map((st) => {
        if (level === 'elementary') {
          return {
            stageNumber: st.stageNumber,
            title: refineTextForElementary(st.title),
            timeframe: st.timeframe ? refineTextForElementary(st.timeframe) : undefined,
            process: refineTextForElementary(st.process),
            visualKeyFeature: refineTextForElementary(st.visualKeyFeature),
          };
        } else if (level === 'middle') {
          return {
            stageNumber: st.stageNumber,
            title: refineTextForMiddle(st.title),
            timeframe: st.timeframe,
            process: refineTextForMiddle(st.process),
            visualKeyFeature: refineTextForMiddle(st.visualKeyFeature),
          };
        } else {
          // High & General: Keep precise academic or documentary wording
          return {
            stageNumber: st.stageNumber,
            title: st.title,
            timeframe: st.timeframe,
            process: st.process,
            visualKeyFeature: st.visualKeyFeature,
          };
        }
      })
    : [
        {
          stageNumber: 1,
          title: level === 'elementary' ? '기초 암반 형성' : '초기 지질 기반 형성',
          timeframe: '수백만 년 전',
          process:
            level === 'elementary'
              ? refineTextForElementary(place.formationProcess || '단단한 기반암이 먼저 자리를 잡았습니다.')
              : place.formationProcess || '지각 융기 및 초기 암반 형성',
          visualKeyFeature: '기저 지층 형성',
        },
        {
          stageNumber: 2,
          title: level === 'elementary' ? '본격적인 지형 발달' : '주요 조산 및 조륙 운동',
          timeframe: '수십만 년 전',
          process:
            level === 'elementary'
              ? '지하의 마그마나 흐르는 강물이 지형의 뼈대를 만들기 시작했습니다.'
              : '주요 작용력에 의한 본격적인 산체 및 골짜기 융기',
          visualKeyFeature: '지형 윤곽 가시화',
        },
        {
          stageNumber: 3,
          title: level === 'elementary' ? '비바람과 침식 작용' : '풍화 및 삭박 작용',
          timeframe: '수만 년 전',
          process:
            level === 'elementary'
              ? '비, 바람, 파도가 오랜 시간 바위를 깎고 다듬었습니다.'
              : '풍화와 침식에 의한 세부 미지형 조각',
          visualKeyFeature: '세부 절벽과 계곡 발달',
        },
        {
          stageNumber: 4,
          title: level === 'elementary' ? '현재의 모습 완성' : '홀로세 현세 지형 안착',
          timeframe: '현재',
          process:
            level === 'elementary'
              ? '오늘날 우리가 눈으로 직접 볼 수 있는 아름다운 지형이 완성되었습니다.'
              : '후빙기 해수면 안정 및 현세 평형 지형 도달',
          visualKeyFeature: '현대 관찰 지형',
        },
      ];

  // 3. Core Concepts / Terms by Level (Integrated from TERRAIN_KNOWLEDGE_BASE)
  let coreConcepts: { term: string; description: string; curriculumPoint?: string }[] = [];

  if (profile.concepts && profile.concepts.length > 0) {
    coreConcepts = profile.concepts.map((c) => ({
      term: c.term,
      description: c.description,
      curriculumPoint: c.curriculumPoint,
    }));
  } else {
    coreConcepts = meta.keyConcepts.slice(0, 3).map((kc) => ({
      term: kc,
      description: `${kc}은(는) 지형의 형성과 발달을 이해하는 핵심 개념입니다.`,
      curriculumPoint: `${meta.course} 연계`,
    }));
  }

  // 4. Fact Sheet
  const factSheet = {
    rockType:
      level === 'elementary'
        ? refineTextForElementary(geo?.rockType || '단단한 자연 암석')
        : geo?.rockType || '현무암 및 퇴적·변성암류',
    geologicalAge:
      level === 'elementary'
        ? refineTextForElementary(geo?.geologicalAge || '약 100만 년 전 빙하기 시대부터 현재')
        : geo?.geologicalAge || '신생대 제4기 플라이스토세~홀로세',
    tectonicSetting:
      level === 'elementary'
        ? refineTextForElementary(geo?.tectonicSetting || '지구 내부의 마그마 및 판 운동')
        : geo?.tectonicSetting || '판 내부 열점 또는 섭입대 경계',
    geomorphicAgent:
      level === 'elementary'
        ? refineTextForElementary(geo?.geomorphicAgent || '마그마 분출, 강물, 비바람')
        : geo?.geomorphicAgent || '화성 활동 및 유수·풍화 작용',
    scale: geo?.scale
      ? [
          geo.scale.elevationMeters ? `해발 ${geo.scale.elevationMeters.toLocaleString()}m` : '',
          geo.scale.areaKm2 ? `면적 ${geo.scale.areaKm2.toLocaleString()}㎢` : '',
          geo.scale.depthMeters ? `깊이 ${geo.scale.depthMeters}m` : '',
          geo.scale.lengthKm ? `연장 길이 ${geo.scale.lengthKm}km` : '',
        ]
          .filter(Boolean)
          .join(' · ')
      : undefined,
  };

  // 5. Field Notes
  const fieldNotes = {
    observationPoints: (place.observationPoints || []).map((pt) =>
      level === 'elementary' ? refineTextForElementary(pt) : pt
    ),
    satellitePoints: (field?.satelliteCheckPoints || [
      '산 정상부를 중심으로 방사상으로 뻗은 하천 수계망',
      '분화구 또는 절벽이 만드는 선명한 음영 경계선',
      '주변 평지와 구별되는 독특한 식생 및 암석 색조 대비',
    ]).map((pt) => (level === 'elementary' ? refineTextForElementary(pt) : pt)),
    bestSeason: field?.bestVisitingSeason,
    cautionNote:
      field?.cautionAndConservation ||
      (level === 'elementary'
        ? '정해진 관람로를 벗어나지 않고, 자연 바위나 식물을 훼손하지 않도록 주의합니다.'
        : '지정된 관람로를 준수하고 천연기념물 및 국립공원 보호 규정에 따라 지형을 보전합니다.'),
  };

  return {
    level,
    badge,
    headline,
    subhead,
    summary,
    coreQuestionOrTopic,
    stages: formattedStages,
    coreConcepts,
    factSheet,
    fieldNotes,
  };
}
