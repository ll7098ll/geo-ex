import { PlaceInfo, GeologicalGlossaryItem } from '../types';

/**
 * 중·고교 지구과학 및 지리 교육과정 연계 도우미
 * 각 지형별 핵심 개념, 형성 메커니즘, 교과 용어 사전 및 팩트 시트를 일관되게 구조화합니다.
 */

export interface CurriculumMeta {
  course: string;
  unit: string;
  coreStandard: string;
  keyConcepts: string[];
}

export function getCurriculumMeta(place: PlaceInfo): CurriculumMeta {
  const t = (place.terrain || '').toLowerCase();
  const name = (place.placeName || '').toLowerCase();

  if (t.includes('화산') || t.includes('칼데라') || t.includes('주상절리') || t.includes('용암')) {
    return {
      course: '지구과학 I / 한국지리',
      unit: '지권의 변동과 화산 활동',
      coreStandard: '마그마의 성질(점성, SiO2 함량)에 따른 화산체 형태 및 판구조론적 분출 환경 이해',
      keyConcepts: ['순상화산 / 성층화산', '열점(Hotspot)', '현무암질 마그마', '칼데라 함몰', '주상절리 냉각 수축'],
    };
  }

  if (t.includes('하천') || t.includes('곡류') || t.includes('선상지') || t.includes('삼각주') || t.includes('폭포') || t.includes('하안단구')) {
    return {
      course: '한국지리 / 통합사회',
      unit: '유수의 작용과 한반도 및 세계 하천 지형',
      coreStandard: '유수의 침식·운반·퇴적 작용 및 지반 융기와 침식기준면 변동에 따른 하천 지형 발달 원리 규명',
      keyConcepts: ['자유곡류 / 감입곡류', '하방 침식 / 측방 침식', '선상지(선정-선앙-선단)', '하안단구 융기', '하구 삼각주'],
    };
  }

  if (t.includes('해안') || t.includes('갯벌') || t.includes('절벽') || t.includes('해식애') || t.includes('사구') || t.includes('시스택') || t.includes('사주')) {
    return {
      course: '한국지리 / 지구과학 I',
      unit: '해안 지형의 형성과 해수면 변동',
      coreStandard: '곶(침식 지형)과 만(퇴적 지형)에서 파랑 에너지 집중과 분산에 따른 지형 형성 작용 비교',
      keyConcepts: ['파랑 에너지 집중/분산', '해식애와 파식대', '시스택과 해식동', '사빈과 사주/석호', '조차와 조간대 갯벌'],
    };
  }

  if (t.includes('카르스트') || t.includes('동굴') || t.includes('돌리네') || t.includes('탑 카르스트')) {
    return {
      course: '지구과학 I / 한국지리',
      unit: '지표의 풍화 작용과 탄산염 순환',
      coreStandard: '지하수 및 빗물 속 탄산에 의한 석회암(탄산칼슘) 화학적 용식 작용과 종유석 등 2차 생성물 발달',
      keyConcepts: ['화학적 용식 작용 (CaCO3 + H2O + CO2 ⇌ Ca(HCO3)2)', '돌리네와 우발라', '석회동굴(종유석/석순)', '테라로사 붉은 점토', '탑 카르스트(용식 잔구)'],
    };
  }

  if (t.includes('빙하') || t.includes('피오르드') || t.includes('u자곡') || t.includes('혼') || t.includes('호른') || t.includes('모레인')) {
    return {
      course: '세계지리 / 지구과학 II',
      unit: '빙하기 기후 변화와 빙하 지형',
      coreStandard: '거대한 빙하의 이동에 의한 강력한 굴식 및 마쇄 작용, 그리고 해수면 상승에 따른 피오르 침수 과정',
      keyConcepts: ['U자곡(빙식곡)', '피오르드(침수된 U자곡)', '호른(피라미드형 암봉)', '빙퇴석(모레인)', '현곡(매달린 계곡)과 빙하호'],
    };
  }

  // Default: Arid / Wind
  return {
    course: '세계지리 / 지구과학',
    unit: '건조 기후 지역의 지형과 풍화',
    coreStandard: '일교차에 의한 기계적(물리적) 풍화와 바람에 의한 모래 침식·퇴적이 만들어내는 사막 경관',
    keyConcepts: ['바람의 마식 및 취식', '사구(바르한)', '버섯바위와 야르당', '와디(건천)', '플라야(염호)'],
  };
}

export function getKeyTakeaways(place: PlaceInfo): string[] {
  if (place.keyTakeaways && place.keyTakeaways.length > 0) {
    return place.keyTakeaways;
  }

  const meta = getCurriculumMeta(place);
  const formation = place.formationProcess || place.tagline;

  return [
    `형성 핵심 원리: ${formation}`,
    `지질학적 분류: ${place.geology?.rockType || '자연 암반'} 및 ${place.geology?.tectonicSetting || '지각 판 변동 환경'}`,
    `탐구 핵심 단서: ${place.observationPoints?.[0] || '지형 단면과 사면 경사'} 및 위성 지도 상의 고유 형태`,
  ];
}

export function getGlossaryItems(place: PlaceInfo): GeologicalGlossaryItem[] {
  if (place.glossary && place.glossary.length > 0) {
    return place.glossary;
  }

  const t = (place.terrain || '').toLowerCase();
  const name = (place.placeName || '').toLowerCase();

  if (t.includes('화산') || t.includes('칼데라') || t.includes('주상절리')) {
    return [
      {
        term: '순상화산 (Shield Volcano)',
        definition: '점성이 낮고 유동성이 큰 현무암질 마그마가 넓게 퍼져 경사가 10° 미만으로 완만한 방패 모양의 화산체입니다.',
        curriculumNote: '하와이 마우나로아/킬라우에아, 제주도 한라산 하부가 대표적 예시입니다.',
      },
      {
        term: '열점 (Hotspot)',
        definition: '판의 경계와 관계없이 맨틀 상부 또는 핵-맨틀 경계에서 플룸(Plume)이 솟아올라 지표로 분출하는 고정된 마그마 공급점입니다.',
        curriculumNote: '판이 열점 위를 이동하면서 일렬로 늘어선 화산 열도(하와이-엠페러 해산군)를 형성합니다.',
      },
      {
        term: '칼데라 (Caldera)',
        definition: '대규모 화산 분출 후 마그마 챔버가 텅 비면서 정상부가 자체 무게를 이기지 못하고 함몰되어 형성된 대형 분지입니다.',
        curriculumNote: '지름이 보통 2km 이상이며, 백두산 천지, 킬라우에아 칼데라 등이 있습니다.',
      },
      {
        term: '파호이호이 용암 (Pāhoehoe)',
        definition: '표면이 매끄럽고 주름진 밧줄 모양을 띠는 현무암질 용암류로, 내부 가스가 서서히 방출되며 유동성이 매우 높습니다.',
        curriculumNote: '현무암의 낮은 SiO2(52% 이하)와 고온(1,100℃ 이상) 특성을 입증합니다.',
      },
      {
        term: '주상절리 (Columnar Joint)',
        definition: '고온의 용암이 지표로 분출한 뒤 급격히 냉각되면서 부피 수축으로 인해 수직의 다각형(주로 5~6각형) 기둥으로 갈라진 틈입니다.',
        curriculumNote: '용암의 냉각면과 직각 방향으로 균열이 수직 발달합니다.',
      },
    ];
  }

  if (t.includes('하천') || t.includes('곡류') || t.includes('선상지') || t.includes('삼각주') || t.includes('폭포') || t.includes('단구')) {
    return [
      {
        term: '감입곡류하천 (Incised Meander)',
        definition: '평탄한 지표를 흐르던 자유곡류천이 지반의 융기나 해수면 하강으로 하방 침식력이 강해져 깊은 골짜기를 파고 흐르는 하천입니다.',
        curriculumNote: '한국의 동강, 영월 한반도지형, 미국 그랜드 캐니언 콜로라도강이 대표적입니다.',
      },
      {
        term: '하방 침식 (Downcutting)',
        definition: '하천의 유수가 바닥 암반을 수직 아래 방향으로 깎아내리는 작용으로, V자곡과 깊은 협곡을 형성합니다.',
        curriculumNote: '상류 지역 및 지반 융기 지역에서 가장 활발하게 일어납니다.',
      },
      {
        term: '선상지 (Alluvial Fan)',
        definition: '산지에서 평지로 나오는 골짜기 입구(곡구)에서 유속이 급감하며 토사가 부채꼴 모양으로 쌓인 퇴적 지형입니다.',
        curriculumNote: '선정(자갈), 선앙(모래·복류천), 선단(용천대)으로 구분됩니다.',
      },
      {
        term: '삼각주 (Delta)',
        definition: '하천이 바다나 호수로 흘러드는 하구에서 유속이 멈추면서 미립질 점토와 모래가 퇴적되어 형성된 평야 지형입니다.',
        curriculumNote: '나일강, 미시시피강, 낙동강 하구 삼각주가 교과서 대표 사례입니다.',
      },
    ];
  }

  if (t.includes('해안') || t.includes('갯벌') || t.includes('절벽') || t.includes('해식애') || t.includes('사구') || t.includes('시스택') || t.includes('사주')) {
    return [
      {
        term: '해식애와 파식대 (Sea Cliff & Wave-cut Platform)',
        definition: '파도의 침식으로 형성된 가파른 해안 절벽(해식애)과, 절벽이 후퇴하면서 절벽 밑에 평평하게 남은 암반면(파식대)입니다.',
        curriculumNote: '파랑 에너지가 집중되는 곶(Headland) 지역에서 강하게 발달합니다.',
      },
      {
        term: '시스택 (Sea Stack)',
        definition: '파식대 위에 해식애가 침식되어 고립된 촛대 모양의 뾰족한 바위섬입니다.',
        curriculumNote: '독도 촛대바위, 울릉도 삼선암, 부산 오륙도 등이 대표적입니다.',
      },
      {
        term: '조간대 갯벌 (Tidal Flat)',
        definition: '조석 간만의 차가 크고 파랑이 잔잔한 만(Bay) 입구에서 점토와 미사 입자가 조류에 의해 넓게 퇴적된 평탄지입니다.',
        curriculumNote: '서해안 갯벌(유네스코 세계자연유산)은 세계 5대 갯벌에 속합니다.',
      },
      {
        term: '사주와 석호 (Spit & Lagoon)',
        definition: '연안류에 의해 모래가 둑 모양으로 길게 이어져 쌓인 사주가 만의 입구를 가로막아 형성된 자연 호수(석호)입니다.',
        curriculumNote: '강원도 동해안의 경포호, 영랑호, 송지호 등이 대표적입니다.',
      },
    ];
  }

  if (t.includes('카르스트') || t.includes('동굴') || t.includes('돌리네')) {
    return [
      {
        term: '탄산염 용식 작용 (Chemical Dissolution)',
        definition: '이산화탄소가 녹아 약산성을 띤 빗물과 지하수가 탄산칼슘(CaCO3) 성분의 석회암을 화학적으로 녹이는 과정입니다.',
        curriculumNote: '화학식: CaCO3 + H2O + CO2 ⇌ Ca(HCO3)2 (탄산수소칼슘 수용액으로 용해)',
      },
      {
        term: '돌리네 (Doline)',
        definition: '석회암 평원에서 빗물이 스며드는 수직 절리를 따라 암석이 녹아내려 형성된 깔때기 모양의 와지(움푹 파인 땅)입니다.',
        curriculumNote: '여러 돌리네가 합쳐지면 우발라(Uvala)가 됩니다.',
      },
      {
        term: '석회동굴 생성물 (Speleothems)',
        definition: '용해된 탄산수소칼슘 지하수가 동굴 천장에서 이산화탄소를 방출하며 다시 탄산칼슘으로 침전된 결정체입니다.',
        curriculumNote: '천장에서 자라면 종유석, 바닥에서 솟으면 석순, 둘이 만나면 석주가 됩니다.',
      },
      {
        term: '탑 카르스트 (Tower Karst)',
        definition: '고온 다습한 열대·아열대 환경에서 석회암 대지가 극심한 수직 용식과 침식을 받아 수직 절벽의 기암괴석 기둥으로 남은 지형입니다.',
        curriculumNote: '베트남 하롱베이, 중국 계림(구이린)이 세계적 명소입니다.',
      },
    ];
  }

  if (t.includes('빙하') || t.includes('피오르드') || t.includes('u자곡') || t.includes('혼') || t.includes('모레인')) {
    return [
      {
        term: 'U자곡 (Glacial Trough)',
        definition: '기존의 V자형 하천 계곡을 거대한 빙하가 밀고 내려가며 골짜기 바닥과 양측 벽면을 깎아내려 만든 U자 단면의 거대 골짜기입니다.',
        curriculumNote: '빙하가 녹아 사라진 뒤 양옆에 높은 수직 단애가 남습니다.',
      },
      {
        term: '피오르드 (Fjord)',
        definition: '빙하기에 빙하가 파놓은 깊은 U자곡에 후빙기 해수면이 상승하며 바닷물이 침수되어 형성된 좁고 긴 해안 협만입니다.',
        curriculumNote: '노르웨이 송네 피오르드, 뉴질랜드 밀포드 사운드가 대표적입니다.',
      },
      {
        term: '호른 (Horn / 혼)',
        definition: '산봉우리 주변에서 여러 개의 권곡(빙하 발원지) 빙하가 사방으로 깎아 들어가 형성된 날카로운 피라미드 모양의 암봉입니다.',
        curriculumNote: '스위스 마터호른이 가장 전형적인 호른 지형입니다.',
      },
      {
        term: '빙퇴석 / 모레인 (Moraine)',
        definition: '빙하가 암석을 긁고 운반하다가 얼음이 녹으면서 퇴적시킨 분급되지 않은 불규칙한 자갈과 토사의 둑입니다.',
        curriculumNote: '물에 의해 둥글게 마모되지 않고 각진 파쇄암편이 섞여 있는 것이 특징입니다.',
      },
    ];
  }

  // Default Arid
  return [
    {
      term: '기계적 풍화 (Mechanical Weathering)',
      definition: '수분 부족과 큰 일교차로 인해 암석 내부의 광물들이 수축과 팽창을 반복하며 물리적으로 부서지는 작용입니다.',
      curriculumNote: '사막 지역에서는 화학적 풍화보다 물리적 암석 파쇄가 압도적으로 우세합니다.',
    },
    {
      term: '버섯바위 (Mushroom Rock / Yardang)',
      definition: '바람에 실린 모래가 지표면 부근(약 1~2m 높이)에 집중되어 암석 아랫부분을 집중 마식(Sandblasting)하여 만들어진 버섯 모양 바위입니다.',
      curriculumNote: '바람에 의한 침식이 지표면에 집중됨을 보여주는 대표적 증거입니다.',
    },
    {
      term: '바르한 (Barchan)',
      definition: '일정한 방향의 바람이 지속적으로 불 때 형성되는 초승달 모양의 모래 언덕(사구)입니다.',
      curriculumNote: '바람이 불어가는 방향으로 초승달의 두 뿔이 돌출됩니다.',
    },
    {
      term: '와디 (Wadi)',
      definition: '평소에는 바짝 마른 자갈 바닥이지만, 간헐적인 폭우가 내리면 급류가 쏟아져 흐르는 건조 지역의 골짜기(건천)입니다.',
      curriculumNote: '돌발 홍수 위험이 높아 사막 여행 시 야영을 피해야 하는 곳입니다.',
    },
  ];
}
