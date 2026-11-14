import { PlaceInfo } from '../types';

/**
 * 중·고교 지구과학 및 지리 교육과정 연계 도우미
 * 각 지형별 교과 단원 및 성취기준 메타데이터를 제공합니다.
 */

export interface CurriculumMeta {
  course: string;
  unit: string;
  coreStandard: string;
  keyConcepts: string[];
}

export function getCurriculumMeta(place: PlaceInfo): CurriculumMeta {
  const t = (place.terrain || '').toLowerCase();

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
