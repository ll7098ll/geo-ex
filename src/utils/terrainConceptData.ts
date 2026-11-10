/**
 * 26종 세부 지형별 정선된 난이도별(초등/중등/고등/일반) 개념 사전 및 교과 탐구 기준
 * 유치한 비유나 과장 없이 초등은 담백하고 쉬운 어휘로, 중등은 표준 과학 원리로,
 * 고등은 2022 개정 성취기준 학술 심층으로, 일반은 지리 교양·자연유산 관점으로 구성됩니다.
 */

export interface ConceptItem {
  term: string;
  description: string;
  curriculumPoint: string;
}

export interface TerrainLevelProfile {
  focusQuestion: string;
  concepts: ConceptItem[];
  keyMechanism: string;
}

export interface TerrainMetadataRecord {
  category: string;
  terrainName: string;
  elementary: TerrainLevelProfile;
  middle: TerrainLevelProfile;
  high: TerrainLevelProfile;
  general: TerrainLevelProfile;
}

export const TERRAIN_KNOWLEDGE_BASE: Record<string, TerrainMetadataRecord> = {
  // ============================================================
  // 1. 화산 및 산지 지형 (Volcanic)
  // ============================================================
  '화산': {
    category: 'volcanic',
    terrainName: '화산',
    elementary: {
      focusQuestion: '화산마다 모양이 완만하거나 뾰족하게 다른 까닭은 무엇일까요?',
      keyMechanism: '마그마가 끈적거리는 정도(점성)에 따라 용암이 흘러가는 거리가 달라 산의 모양이 결정됩니다.',
      concepts: [
        {
          term: '마그마와 용암',
          description: '지하 깊은 곳에서 암석이 녹은 뜨거운 물질을 마그마라고 하며, 이것이 분화구를 통해 지표면 밖으로 흘러나온 것을 용암이라고 부릅니다.',
          curriculumPoint: '초등 4학년 2학기 과학 [화산과 지진]',
        },
        {
          term: '완만한 화산 (방패 모양)',
          description: '끈적거림이 적고 묽은 현무암질 용암은 멀리까지 넓게 흘러내려 경사가 완만한 방패 모양의 화산체를 만듭니다.',
          curriculumPoint: '용암의 흐름과 화산의 겉모양',
        },
        {
          term: '가파른 화산 (종 모양)',
          description: '끈적거림이 강한 용암은 멀리 흘러가지 못하고 분화구 주변에 솟아오르며 굳어 가파른 종 모양의 화산을 만듭니다.',
          curriculumPoint: '점성에 따른 화산 형태 비교',
        },
      ],
    },
    middle: {
      focusQuestion: '마그마의 점성과 화학 조성은 화산의 분출 양식과 산체 경사에 어떤 영향을 미치는가?',
      keyMechanism: '규산(SiO2) 함량이 낮아 점성이 작은 현무암질 마그마는 순상화산을, 점성이 큰 조면·유문암질 마그마는 종상화산을 만듭니다.',
      concepts: [
        {
          term: '순상화산과 종상화산',
          description: '현무암질 용암의 완경사 순상화산(10° 이하)과 조면암질 용암의 급경사 종상화산(30° 이상)은 마그마의 점성 차이에서 비롯됩니다.',
          curriculumPoint: '중2 과학 [지권의 변화 - 화성암과 화산]',
        },
        {
          term: '성층화산 (복합화산)',
          description: '점성이 중간인 안산암질 마그마가 분출할 때, 용암류와 화산 쇄설물이 번갈아 겹겹이 쌓여 원추형 산체를 형성합니다.',
          curriculumPoint: '화산 분출물의 퇴적 구조',
        },
        {
          term: '화산 분출물의 종류',
          description: '기체인 화산 가스, 액체인 용암류, 고체 파편인 화산탄·부석·화산재로 구분되며 폭발 강도를 좌우합니다.',
          curriculumPoint: '화산 쇄설물과 화산 활동의 특징',
        },
      ],
    },
    high: {
      focusQuestion: '판구조론적 분출 환경과 마그마 분별결정작용에 따른 화성암복합체의 지형 발달 분석',
      keyMechanism: '열점 플룸 및 섭입대 마그마 생성 조건에 따라 SiO2 함량, 휘발성 가스 분압, 분별결정작용이 화산체 지형을 분화시킵니다.',
      concepts: [
        {
          term: '마그마 분화와 SiO2 함량 계열',
          description: '현무암질(SiO2 52% 이하, 저점성, 고온) ➔ 안산암질 ➔ 조면·유문암질(SiO2 66% 이상, 고점성, 저온) 계열에 따른 유동성 거동 차이입니다.',
          curriculumPoint: '2022 개정 [12지과Ⅰ02-03] 화성암의 산출 상태와 성인',
        },
        {
          term: '열점(Hotspot)과 판 내부 화산활동',
          description: '상부 맨틀 또는 핵-맨틀 경계에서 상승하는 맨틀 플룸에 의해 판 경계와 무관하게 고정된 마그마 공급점에서 화산이 생성됩니다.',
          curriculumPoint: '2022 개정 [12지과Ⅰ02-02] 판 구조론과 플룸 구조론',
        },
        {
          term: '화산쇄설성 밀도류(PDC)와 용결응회암',
          description: '고온의 가스와 화산재가 중력에 의해 사면을 고속으로 질주하며 퇴적된 후 자체 열과 하중으로 압착·용결된 지형 구조입니다.',
          curriculumPoint: '화산재 퇴적층과 층서학적 대비',
        },
      ],
    },
    general: {
      focusQuestion: '불과 대지가 빚어낸 거대한 지구의 숨결: 화산의 형태와 지리적 유산',
      keyMechanism: '지하 깊은 곳의 에너지가 지표를 뚫고 나와 새로운 대지를 창조하는 지구의 가장 역동적인 지형 형성 과정입니다.',
      concepts: [
        {
          term: '화산 경관의 지형학적 미학',
          description: '화산은 완만한 용암 대지부터 날카로운 화구벽, 고요한 화구호에 이르기까지 지구에서 가장 다채로운 입체 경관을 보여줍니다.',
          curriculumPoint: '세계자연유산 및 지질공원(Geopark)',
        },
        {
          term: '화산 토양과 인문 생태계',
          description: '풍화된 현무암과 화산재는 미네랄이 풍부한 비옥한 토양을 형성하여 고유한 농경 문화와 고산 식생대를 탄생시켰습니다.',
          curriculumPoint: '자연환경과 인간 생활의 상호작용',
        },
        {
          term: '현장 지질 탐방 관전 포인트',
          description: '용암이 흐른 방향을 보여주는 밧줄 모양 주름(파호이호이)과 화산 사면의 경사 변화를 관찰하는 것이 핵심입니다.',
          curriculumPoint: '지리 탐방 현장 가이드',
        },
      ],
    },
  },

  '칼데라': {
    category: 'volcanic',
    terrainName: '칼데라',
    elementary: {
      focusQuestion: '화산 꼭대기에 커다란 분지나 호수가 생긴 이유는 무엇일까요?',
      keyMechanism: '엄청난 양의 마그마가 뿜어져 나온 뒤, 속이 빈 화산 꼭대기가 스스로의 무게를 이기지 못하고 푹 주저앉아 만들어집니다.',
      concepts: [
        {
          term: '함몰 (주저앉음)',
          description: '땅속의 마그마가 밖으로 다 빠져나가면서 생긴 빈 공간으로 화산 정상부가 바닥으로 가라앉는 현상입니다.',
          curriculumPoint: '초등 4학년 과학 [지표의 변화와 화산]',
        },
        {
          term: '칼데라와 일반 분화구의 차이',
          description: '단순히 마그마가 뿜어져 나온 화구는 지름이 수백 미터이지만, 칼데라는 산 전체가 무너져 내려 지름이 수 킬로미터에 이릅니다.',
          curriculumPoint: '화산 정상부 지형의 비교',
        },
        {
          term: '칼데라호 (물웅덩이)',
          description: '푹 꺼진 거대한 분지에 빗물과 눈 녹은 물이 고여 형성된 깊고 맑은 호수입니다. 백두산 천지가 대표적입니다.',
          curriculumPoint: '우리나라의 대표적인 화산 지형',
        },
      ],
    },
    middle: {
      focusQuestion: '대규모 마그마 분출 후 화산체의 중력 함몰 메커니즘과 칼데라 지형의 특징',
      keyMechanism: '지하 마그마 챔버의 배출에 따른 지지력 상실로 고리 모양의 원형 단층을 따라 산체가 수직 함몰합니다.',
      concepts: [
        {
          term: '마그마 챔버의 수축과 함몰',
          description: '격렬한 폭발 분출로 마그마 챔버의 압력이 급감하면 상부 하중을 버티지 못하고 칼데라 림(외륜산) 내부가 함몰됩니다.',
          curriculumPoint: '중2 과학 [화산 활동과 지표 변화]',
        },
        {
          term: '이중 화산과 중앙화구구',
          description: '칼데라 바닥에서 2차 소규모 분출이 일어나 새로운 작은 화산(알봉 등)이나 용암돔이 솟아오른 복합 구조체입니다.',
          curriculumPoint: '울릉도 나리분지와 알봉의 형성',
        },
        {
          term: '외륜산 (칼데라 림)',
          description: '함몰되지 않고 바깥에 병풍처럼 남아 분지를 둘러싸고 있는 절벽 능선입니다.',
          curriculumPoint: '칼데라의 지형 요소',
        },
      ],
    },
    high: {
      focusQuestion: '환상 단층(Ring Fault)을 통한 피스톤식 함몰 구조와 재생 칼데라(Resurgent Caldera) 지형 분석',
      keyMechanism: '규산염 마그마의 폭발적 플리니식 분출 ➔ 환상 균열을 따른 수직 지반 침하 ➔ 열수 활동 및 잔류 돔 융기 진화사를 규명합니다.',
      concepts: [
        {
          term: '환상 단층계와 피스톤 함몰',
          description: '마그마 챔버 상부의 인장 응력으로 형성된 원형 단층면을 따라 기반암 블록이 수직으로 낙하하는 지체구조적 과정입니다.',
          curriculumPoint: '2022 개정 [12지과Ⅰ02-03] 대규모 분출과 구조 함몰',
        },
        {
          term: '응회암 대지와 이그님브라이트(Ignimbrite)',
          description: '칼데라 형성 시 분출된 대량의 화산 쇄설성 유동체가 주변 수십 km 평원을 덮어 두꺼운 부석질 응회암층을 형성합니다.',
          curriculumPoint: '화산 층서학과 대규모 분출 퇴적물',
        },
        {
          term: '칼데라 호수의 수리 지질학적 특성',
          description: '유입 하천 없이 강수와 지하 용천에 의해 담수되며, 주변 칼데라 림의 급사면 붕락과 열수 분출공의 영향을 받습니다.',
          curriculumPoint: '백두산 천지의 지질학적 안정성 평가',
        },
      ],
    },
    general: {
      focusQuestion: '대지의 붕괴가 빚어낸 천연 분지와 산정 호수의 지리적 서사',
      keyMechanism: '화산의 가장 파괴적인 폭발 이후 남겨진 거대한 분지 속에 생명과 호수가 깃드는 지질학적 반전의 무대입니다.',
      concepts: [
        {
          term: '백두산 천지와 울릉도 나리분지의 대비',
          description: '수심 380m의 웅장한 호수가 된 천지와 달리, 울릉도 나리분지는 평평한 분지 바닥에 비옥한 화산재 평원이 되어 삶의 터전이 되었습니다.',
          curriculumPoint: '한국의 대표 화산 유산 비교',
        },
        {
          term: '외륜산 능선에서 조망하는 파노라마',
          description: '칼데라 가장자리(외륜산)에 서면 수만 년 전 거대한 산 정상이 무너져 내린 경계선을 한눈에 조망할 수 있습니다.',
          curriculumPoint: '지리 탐방과 경관 관찰법',
        },
        {
          term: '지구조적 재생과 온천 활동',
          description: '함몰 후에도 지하에 잔류하는 마그마의 열기로 인해 칼데라 내부에는 고온의 온천과 화산 가스 분출공이 지속됩니다.',
          curriculumPoint: '화산 후열 활동과 지열 에너지',
        },
      ],
    },
  },

  '주상절리': {
    category: 'volcanic',
    terrainName: '주상절리',
    elementary: {
      focusQuestion: '바닷가 절벽에 거대한 육각형 돌기둥들이 규칙적으로 서 있는 까닭은 무엇일까요?',
      keyMechanism: '뜨거운 용암이 공기나 물과 만나 차갑게 식으면서 부피가 줄어들어, 가뭄에 논바닥이 갈라지듯 기둥 모양으로 쪼개졌습니다.',
      concepts: [
        {
          term: '냉각 수축 (식으면서 줄어듦)',
          description: '뜨거운 물질이 차갑게 식으면 부피가 줄어듭니다. 용암도 식으면서 부피가 줄어들며 틈(절리)이 생깁니다.',
          curriculumPoint: '초등 4학년 과학 [화산과 암석]',
        },
        {
          term: '육각형 기둥 모양',
          description: '균일하게 식을 때 가장 안정적인 형태가 5~6각형입니다. 벌집 모양처럼 빈틈없이 기둥 형태로 갈라집니다.',
          curriculumPoint: '자연에서 발견되는 규칙적인 무늬',
        },
        {
          term: '기둥 절벽의 침식',
          description: '기둥 모양으로 갈라진 바위에 파도가 부딪히면 기둥 하나씩 떨어져 나가며 수직 절벽을 유지합니다.',
          curriculumPoint: '파도의 작용과 바위 절벽',
        },
      ],
    },
    middle: {
      focusQuestion: '용암류의 냉각 중심점 형성과 인장 응력에 의한 다각형 기둥 절리 발달 원리',
      keyMechanism: '용암 표면에서 내부로 냉각면이 진행되면서 수직 방향으로 전단 균열이 전파되어 수직 기둥을 형성합니다.',
      concepts: [
        {
          term: '주상절리의 냉각 수축 중심',
          description: '용암이 냉각될 때 등간격의 수축 중심점들을 향해 수축력이 작용하여 수학적으로 가장 효율적인 육각 기둥망이 생깁니다.',
          curriculumPoint: '중2 과학 [지권의 변화 - 암석의 특징]',
        },
        {
          term: '콜로네이드(Colonnade)와 엔타블러처',
          description: '규칙적이고 굵은 수직 기둥대(콜로네이드)와 불규칙하게 뒤틀린 상부 기둥대(엔타블러처)로 단면이 구분됩니다.',
          curriculumPoint: '용암류 두께별 냉각 속도 차이',
        },
        {
          term: '현무암질 용암과 하천·해식 절벽',
          description: '제주 중문 대포동, 철원 한탄강 등 용암이 급격히 냉각된 수변 환경에서 가장 뚜렷하게 관찰됩니다.',
          curriculumPoint: '우리나라의 대표적 주상절리 지형',
        },
      ],
    },
    high: {
      focusQuestion: '열탄성 수축 응력장 해석 및 냉각면과 절리면의 기하학적 직교성(Orthogonality) 분석',
      keyMechanism: '열전도 경계면(냉각 등온면)에 수직인 방향으로 최대 인장 응력이 집중되어 3방향 균열각 120°의 헥사고날 절리가 발달합니다.',
      concepts: [
        {
          term: '냉각 전면(Cooling Front)과 120° 균열 접합',
          description: '표면에서 내부로 침투하는 열 손실 구배에 따라 균열이 수직 진행하며, 표면 에너지 최소화 원리에 의해 120° 삼중 결절점을 형성합니다.',
          curriculumPoint: '2022 개정 [12지과Ⅰ02-03] 화성암의 산출 형태와 절리',
        },
        {
          term: '한탄강 현무암 협곡과 부정합 피복',
          description: '선캄브리아기 편마암 및 중생대 화강암 기반암 위에 신생대 제4기 현무암이 부정합으로 덮이고 하방 침식되어 형성된 주상절리 단면입니다.',
          curriculumPoint: '2022 개정 [12한지02-01] 한반도 지형 형성과 화성 활동',
        },
        {
          term: '판상절리와 주상절리의 역학적 대비',
          description: '하중 제거에 의한 수평 팽창 균열인 판상절리(화강암)와, 열수축에 의한 수직 인장 균열인 주상절리(현무암/조면암)의 응력 상태 비교입니다.',
          curriculumPoint: '구조 지질학과 암석 절리의 분류',
        },
      ],
    },
    general: {
      focusQuestion: '돌로 빚은 오르간 파이프: 자연의 기하학과 주상절리의 경관 미학',
      keyMechanism: '고온의 용암이 바다나 강물을 만나 굳어지는 짧은 시간 동안 수학적 대칭성을 그리며 완성된 천연 건축물입니다.',
      concepts: [
        {
          term: '바다와 강이 조각한 수직 회랑',
          description: '제주 중문의 검푸른 파도와 철원 한탄강의 비취빛 물줄기가 기둥 사이사이를 깎아내며 웅장한 수직 기둥 협곡을 완성했습니다.',
          curriculumPoint: '국가지질공원 대표 명소',
        },
        {
          term: '자연이 빚은 완벽한 다각형의 규칙',
          description: '사람이 인위적으로 깎은 듯 정교한 4~8각 기둥들은 물질이 식을 때 에너지를 가장 적게 소비하려는 자연의 법칙을 보여줍니다.',
          curriculumPoint: '지리 교양과 자연의 과학적 원리',
        },
        {
          term: '현장 관찰의 묘미: 수직 기둥과 단면 타일',
          description: '절벽 옆에서는 거대한 기둥 숲을, 절벽 꼭대기에서는 거북 등껍질이나 벌집처럼 맞물린 다각형 바닥면을 관찰할 수 있습니다.',
          curriculumPoint: '주상절리 입체 관찰법',
        },
      ],
    },
  },

  // ============================================================
  // 2. 하천 지형 (Fluvial)
  // ============================================================
  '선상지': {
    category: 'fluvial',
    terrainName: '선상지',
    elementary: {
      focusQuestion: '산에서 흘러나온 강물이 평지를 만날 때 부채 모양의 땅이 만들어지는 이유는 무엇일까요?',
      keyMechanism: '급경사 산골짜기를 빠르게 흐르던 물이 평평한 땅을 만나 갑자기 느려지면서, 싣고 오던 무거운 자갈과 모래를 부채꼴로 쌓아 놓습니다.',
      concepts: [
        {
          term: '물살이 느려지며 쌓이는 흙과 돌',
          description: '빠르게 달리던 물이 넓고 평평한 곳으로 나오면 힘을 잃어 무거운 돌멩이와 흙을 그 자리에 떨어뜨려 쌓습니다.',
          curriculumPoint: '초등 3학년 2학기 과학 [지표의 변화]',
        },
        {
          term: '부채 모양 (부챗살 형태)',
          description: '골짜기 입구에서 물길이 부챗살처럼 여러 갈래로 퍼져 흐르며 흙과 모래를 골고루 펼쳐 놓아 부채 모양이 됩니다.',
          curriculumPoint: '흐르는 물이 만든 독특한 지형',
        },
        {
          term: '물이 땅속으로 스며드는 곳',
          description: '모래와 굵은 자갈이 쌓인 곳은 물이 땅속으로 쏙 스며들어 겉으로는 물이 흐르지 않는 마른 내(건천)가 되기도 합니다.',
          curriculumPoint: '흙의 알갱이 크기와 물 빠짐',
        },
      ],
    },
    middle: {
      focusQuestion: '경사 급변에 따른 유속 감속과 선상지의 토사 분급 및 3단 구조(선정-선앙-선단)',
      keyMechanism: '산지 하천이 곡구를 빠져나올 때 운반력이 급감하여 입자 크기 순서로 분급 퇴적되며 부채꼴 지형을 이룹니다.',
      concepts: [
        {
          term: '선상지의 3대 구조',
          description: '입구인 선정(큰 자갈), 중간인 선앙(모래·복류천), 끝부분인 선단(미세 점토·용천대)으로 구분됩니다.',
          curriculumPoint: '중1 사회 [자연환경과 인간 생활 - 하천 지형]',
        },
        {
          term: '복류천과 용천대',
          description: '물이 잘 빠지는 자갈과 모래층인 선앙에서는 물이 지하로 스며들어 흐르다가(복류), 선단에서 다시 지표로 솟아납니다(용천).',
          curriculumPoint: '지하수 흐름과 토양 투수성',
        },
        {
          term: '선상지의 전통적 토지 이용',
          description: '물이 귀한 선앙은 밭이나 과수원으로, 용천수가 풍부한 선단은 논농사와 취락(마을) 입지로 이용됩니다.',
          curriculumPoint: '자연 지형에 적응한 주민 생활',
        },
      ],
    },
    high: {
      focusQuestion: '곡구 탈출 하천의 퇴적 동역학(Sediment Dynamics)과 지형 발달사 및 건조·습윤 선상지 대비',
      keyMechanism: '수심 감소에 따른 유압 반경 급감 ➔ 퇴적물 운반 한계 초과 ➔ 수로 막힘과 분기(Avulsion) 반복으로 방사상 퇴적체를 구축합니다.',
      concepts: [
        {
          term: '유압 반경(Hydraulic Radius) 감소와 퇴적 메커니즘',
          description: '산지 좁은 수로에서 넓은 범람면으로 진입 시 수심 감소로 유압 반경이 작아져 전단 응력(τ)이 감소, 한계 소류력을 밑돌며 급속 퇴적됩니다.',
          curriculumPoint: '2022 개정 [12한지02-02] 하천 지형과 충적 지형',
        },
        {
          term: '토석류 선상지 vs 건천 하천 선상지',
          description: '습윤 기후의 연속 유수에 의한 분급 선상지와 건조 기후 돌발 홍수(Flash Flood)의 미분급 토석류(Debris Flow) 선상지의 조직 차이입니다.',
          curriculumPoint: '2022 개정 [12세지02-01] 세계의 주요 퇴적 지형',
        },
        {
          term: '한반도 선상지의 발달 특수성',
          description: '침식 윤회의 노년기 산지가 많아 대규모 선상지 발달이 드물며, 사천·청도·경주 등 국지적 구조선 교차 분지 곡구에 제한적으로 산출됩니다.',
          curriculumPoint: '한반도 지형 발달과 퇴적 분지 특성',
        },
      ],
    },
    general: {
      focusQuestion: '산과 평야가 만나는 경계: 물길이 빚어낸 천연 부채와 인간의 삶',
      keyMechanism: '험준한 산악 지대에서 거친 토사를 품고 내려온 강물이 대평원에 펼쳐 놓은 생명의 충적선입니다.',
      concepts: [
        {
          term: '하늘에서 본 부채꼴 경관',
          description: '인공위성이나 비행기에서 내려다보면 계곡 입구를 축으로 완만한 호를 그리며 사방으로 펼쳐진 거대한 부채 형태가 장관을 이룹니다.',
          curriculumPoint: '위성 영상으로 읽는 지구 지형',
        },
        {
          term: '물이 사라졌다 다시 솟는 마법의 땅',
          description: '자갈밭 속으로 숨어버렸던 맑은 계곡물이 부채 끝자락 선단에서 시원한 샘물(용천수)로 솟아나 마을을 번영시켰습니다.',
          curriculumPoint: '자연 지리와 전통 취락의 조화',
        },
        {
          term: '현장 답사 포인트: 자갈 크기의 변화',
          description: '계곡 입구에서 평야 쪽으로 걸어가며 발밑의 자갈 크기가 커다란 바윗덩어리에서 점차 고운 모래로 바뀌는 퇴적의 법칙을 체험합니다.',
          curriculumPoint: '현장 탐방 체험 가이드',
        },
      ],
    },
  },

  '곡류천': {
    category: 'fluvial',
    terrainName: '곡류천',
    elementary: {
      focusQuestion: '강물이 곧게 흐르지 않고 뱀처럼 구불구불 흐르는 까닭은 무엇일까요?',
      keyMechanism: '강물이 흐를 때 바깥쪽은 물살이 빨라 기슭을 깎아내고, 안쪽은 물살이 느려 모래를 쌓으면서 점점 더 구불구불해집니다.',
      concepts: [
        {
          term: '바깥쪽은 깎이고 (공격사면)',
          description: '물이 굽이쳐 흐를 때 바깥쪽 기슭은 물살이 세게 부딪쳐 흙과 바위를 깎아내며 가파른 절벽을 만듭니다.',
          curriculumPoint: '초등 3학년 과학 [지표의 변화 - 흐르는 물]',
        },
        {
          term: '안쪽은 쌓이고 (퇴적사면)',
          description: '물살이 느려지는 안쪽 기슭에는 강물이 싣고 온 고운 모래와 자갈이 잔잔하게 쌓여 넓은 백사장이 됩니다.',
          curriculumPoint: '침식과 퇴적이 만드는 지형',
        },
        {
          term: '소뿔 모양 호수 (우각호)',
          description: '강물이 너무 심하게 구부러지다 홍수가 나 물길이 지름길로 뚫리면, 잘려 나간 옛 물길이 소뿔 모양의 호수로 남습니다.',
          curriculumPoint: '우리 국토의 아름다운 강',
        },
      ],
    },
    middle: {
      focusQuestion: '측방 침식과 유속 차이에 의한 자유곡류 발달과 지반 융기에 따른 감입곡류천 형성',
      keyMechanism: '원심력에 의한 나선형 2차 순환류가 하천 측벽을 침식하고, 지반 융기 시 깊은 협곡을 파고드는 감입곡류로 진화합니다.',
      concepts: [
        {
          term: '공격사면(침식애)과 활주사면(포인트바)',
          description: '곡류부 바깥쪽의 강한 측방 침식 절벽(공격사면)과 안쪽의 완만한 모래 퇴적지(포인트바)가 짝을 이룹니다.',
          curriculumPoint: '중1 사회 [하천 지형과 주변 경관]',
        },
        {
          term: '자유곡류와 감입곡류의 차이',
          description: '평야를 자유롭게 휘도는 자유곡류천과, 원래 곡류하던 하천이 지반 융기로 하방 침식이 강해져 산지 속을 파고든 감입곡류천입니다.',
          curriculumPoint: '지반 융기와 하천의 부활',
        },
        {
          term: '구하도와 우각호',
          description: '홍수 시 곡류 목(Meander Neck)이 절단되면서 유로가 직선화되고 남겨진 옛 하천 바닥(구하도)과 쇠뿔호수(우각호)입니다.',
          curriculumPoint: '하천 유로의 변천사',
        },
      ],
    },
    high: {
      focusQuestion: '동강 및 한반도 감입곡류하천의 형성사와 침식기준면 변동 및 나선류(Helicoidal Flow) 유체역학',
      keyMechanism: '신생대 제3기 경동성 요곡운동 ➔ 구 평원면(준평원) 위 자유곡류천의 하방 침식 부활 ➔ 비대칭 단면의 감입곡류 협곡 구축.',
      concepts: [
        {
          term: '생육곡류 vs 굴삭곡류',
          description: '융기 속도와 하방 침식이 완만하여 측방 침식을 동반한 비대칭 단면의 생육곡류와, 급속 융기로 양안이 수직 절벽인 대칭 단면의 굴삭곡류입니다.',
          curriculumPoint: '2022 개정 [12한지02-02] 한반도의 융기와 하천 발달',
        },
        {
          term: '나선류(Helicoidal Flow)와 바닥 전단 응력',
          description: '곡류 수로의 표층수 원심 외측 편향과 저층수 내측 보상류가 형성하는 나선형 순환이 하상 횡단 토사 수송을 제어합니다.',
          curriculumPoint: '하천 수리학과 퇴적구조 역학',
        },
        {
          term: '영월 한반도지형과 하안단구 연계',
          description: '평창강 감입곡류와 포인트바의 침식·퇴적 대조, 그리고 주변 지반 융기 지표인 다단 하안단구의 층서학적 편년입니다.',
          curriculumPoint: '지구조 운동과 충적 지형 편년',
        },
      ],
    },
    general: {
      focusQuestion: '푸른 비단길을 두른 산줄기: 굽이치는 물결이 빚어낸 한국의 절경',
      keyMechanism: '태고의 평원을 흐르던 물줄기가 솟아오르는 산맥을 칼처럼 베어내며 완성한 천혜의 수변 회랑입니다.',
      concepts: [
        {
          term: '영월 선암마을 한반도지형의 절경',
          description: '굽이치는 강물이 깎아낸 공격사면과 모래가 쌓인 활주사면이 기막히게 어우러져 삼면이 바다인 한반도 형상을 조각해 냈습니다.',
          curriculumPoint: '한국의 지리적 상징과 명승',
        },
        {
          term: '뼝대(석회암 수직 절벽)와 동강의 비경',
          description: '감입곡류 하천이 석회암 지대를 깊게 파고들며 만든 100m 높이의 수직 절벽(뼝대)은 동강 래프팅과 생태 탐방의 백미입니다.',
          curriculumPoint: '생태 지리 탐방 가이드',
        },
        {
          term: '물길이 바뀐 흔적: 구하도의 논밭',
          description: '물이 흐르지 않게 된 둥근 고리 모양의 옛 물길(구하도)은 오늘날 비옥한 농경지가 되어 자연의 변천사를 웅변합니다.',
          curriculumPoint: '풍경 속에 숨은 지리적 역사',
        },
      ],
    },
  },

  // ============================================================
  // 3. 해안 지형 (Coastal)
  // ============================================================
  '해식애 (해안 절벽)': {
    category: 'coastal',
    terrainName: '해식애 (해안 절벽)',
    elementary: {
      focusQuestion: '바닷가에 깎아지른 듯한 바위 절벽과 평평한 바위 바닥이 생기는 까닭은 무엇일까요?',
      keyMechanism: '거센 파도가 바위 절벽 아랫부분을 계속 깎아내면, 지탱할 곳을 잃은 위쪽 바위가 무너져 내리며 가파른 절벽이 만들어집니다.',
      concepts: [
        {
          term: '파도가 치는 바닷가 절벽 (해식애)',
          description: '바다로 불쑥 튀어나온 육지에 거센 파도가 계속 부딪쳐 바위를 깎아내면서 가파른 수직 절벽이 만들어집니다.',
          curriculumPoint: '초등 사회 [우리나라의 해안선]',
        },
        {
          term: '절벽 밑의 평평한 바위 바닥 (파식대)',
          description: '절벽이 파도에 깎여 뒤로 물러나면서, 절벽 발치 아래에 바닷물 높이에 맞춰 평평하게 남은 바위 바닥입니다.',
          curriculumPoint: '파도의 침식 작용',
        },
        {
          term: '파도가 파놓은 바위 틈과 동굴',
          description: '바위의 약한 틈새에 파도가 집중되면 작은 동굴(해식동)이 생기고, 더 깎이면 구멍 뚫린 바위가 되기도 합니다.',
          curriculumPoint: '다양한 해안 바위 지형',
        },
      ],
    },
    middle: {
      focusQuestion: '곶(Headland)에서의 파랑 에너지 집중과 노치(Notch) 형성 및 해식애 후퇴 과정',
      keyMechanism: '파랑 굴절로 곶에 에너지가 집중되어 절벽 하부에 홈(노치)이 생기고, 상부 암반 붕괴로 절벽이 후퇴하며 파식대를 넓힙니다.',
      concepts: [
        {
          term: '파랑의 굴절과 곶의 침식',
          description: '수심이 얕은 곶 쪽으로 파도가 꺾여 모여들며 에너지가 집중되므로, 곶에서는 강한 침식으로 해식애가 발달합니다.',
          curriculumPoint: '중1 사회 [해안 지형의 형성과 주민 생활]',
        },
        {
          term: '해식노치(Notch)와 낙하 붕괴',
          description: '파도의 충격과 자갈의 마쇄로 해수면 높이에 깊은 홈(노치)이 파이면, 상부 하중을 버티지 못하고 암벽이 무너집니다.',
          curriculumPoint: '해안 침식의 단계적 메커니즘',
        },
        {
          term: '해식애와 파식대의 공존',
          description: '가파른 해식애 절벽과 그 앞바다 썰물 때 드러나는 평평한 암반인 파식대는 항상 한 쌍으로 함께 발달합니다.',
          curriculumPoint: '채석강과 해금강의 해안 단면',
        },
      ],
    },
    high: {
      focusQuestion: '해식애 후퇴율(Cliff Retreat Rate)과 기반암 절리 구조 및 파식대 평형 경사각 해석',
      keyMechanism: '수압 충격(Hydraulic Action) 및 마쇄(Corrasion) ➔ 노치 한계 응력 초과 ➔ 절리면을 따른 평면·전도 파괴와 단구화 진화.',
      concepts: [
        {
          term: '파랑 쇄파대(Surf Zone) 수리학과 노치 성장',
          description: '쇄파 시 포획된 공기 방울의 급격한 압축·팽창에 의한 충격압(수십 톤/㎡)이 기반암 절리를 파쇄하여 깊은 수평 노치를 만듭니다.',
          curriculumPoint: '2022 개정 [12지과Ⅰ02-04] 해양 지표의 풍화·침식',
        },
        {
          term: '변안단구(Marine Terrace)의 고해수면 지표',
          description: '파식대가 융기하거나 빙하기 해수면 하강으로 해안선 위에 계단 모양으로 드러난 해안단구는 제4기 지각 융기 속도의 표준 시계입니다.',
          curriculumPoint: '2022 개정 [12한지02-03] 동해안 해안단구와 해수면 변동',
        },
        {
          term: '채석강 격포리 셰일·사암층 층리와 해식',
          description: '중생대 백악기 격포분지 퇴적암의 미세한 수평 층리 및 단층 절리면을 따라 파랑이 선택적 차별 침식을 일으킨 대표 지질명소입니다.',
          curriculumPoint: '퇴적암층의 구조와 해식 지형 분석',
        },
      ],
    },
    general: {
      focusQuestion: '천만 권의 책을 쌓아 올린 바위 절벽: 파도가 깎아낸 수만 년의 지층 일기장',
      keyMechanism: '푸른 파도가 쉼 없이 밀려와 단단한 바위를 두드리고 무너뜨리며 조각해 낸 바다의 장엄한 서사시입니다.',
      concepts: [
        {
          term: '변산반도 채석강의 웅장한 수직 책장',
          description: '수만 권의 고서적을 차곡차곡 쌓아 올린 듯한 수평 지층 절벽(해식애)은 백악기 공룡 시대 호수에 쌓인 퇴적물이 바다를 만난 현장입니다.',
          curriculumPoint: '유네스코 세계지질공원 명소',
        },
        {
          term: '썰물 때 걸어보는 바다 밑 바위 카펫(파식대)',
          description: '바닷물이 빠지면 절벽 발치에 수백 미터에 걸쳐 평평한 바위 바닥이 드러나며 파도가 조각한 지형의 단면을 직접 밟아볼 수 있습니다.',
          curriculumPoint: '간조 시간대 현장 관찰 가이드',
        },
        {
          term: '해식동굴 속에서 바라보는 일몰 파노라마',
          description: '파도가 파놓은 아치형 해식동 안쪽에서 붉게 물드는 서해 낙조를 프레임처럼 담아내는 것은 해안 지리 여행의 하이라이트입니다.',
          curriculumPoint: '해안 지리 여행과 사진 미학',
        },
      ],
    },
  },

  // ============================================================
  // 4. 카르스트 지형 (Karst)
  // ============================================================
  '석회동굴': {
    category: 'karst',
    terrainName: '석회동굴',
    elementary: {
      focusQuestion: '단단한 석회암 바위 속에 거대한 지하 궁전과 고드름 모양 돌이 자라나는 까닭은 무엇일까요?',
      keyMechanism: '빗물에 녹아 있는 물질이 석회암 바위를 아주 천천히 녹여 빈 동굴을 만들고, 천장에서 떨어진 물방울 속 성분이 다시 굳어 돌고드름이 됩니다.',
      concepts: [
        {
          term: '바위를 녹이는 빗물 (용식)',
          description: '공기 중의 이산화탄소가 녹아 약한 산성을 띤 빗물이 석회암 바위의 틈새로 스며들며 바위를 서서히 녹여 냅니다.',
          curriculumPoint: '초등 4학년 과학 [지층과 암석]',
        },
        {
          term: '천장에서 자라는 고드름돌 (종유석)',
          description: '동굴 천장에서 물방울이 떨어질 때, 물방울 속에 녹아 있던 석회 성분이 남아서 아래로 자라는 돌고드름입니다.',
          curriculumPoint: '동굴 속 신비한 자연 생성물',
        },
        {
          term: '바닥에서 솟는 돌순 (석순)과 기둥 (석주)',
          description: '바닥으로 떨어진 물방울에서 솟아오른 것이 석순이고, 천장의 종유석과 바닥의 석순이 만나 기둥이 된 것이 석주입니다.',
          curriculumPoint: '석회동굴의 2차 생성물 관찰',
        },
      ],
    },
    middle: {
      focusQuestion: '탄산수소칼슘의 화학적 가역 반응(용해와 침전)과 석회동굴 생성물(Speleothems) 발달사',
      keyMechanism: 'CO2가 녹은 지하수가 CaCO3를 녹여 동굴을 뚫고, 동굴 내 CO2 기화 시 탄산칼슘으로 재결정화되어 종유석을 형성합니다.',
      concepts: [
        {
          term: '석회암의 화학적 용식 반응식',
          description: 'CaCO3 + H2O + CO2 ⇌ Ca(HCO3)2 반응으로, 지하수가 석회암을 녹여 지하 수로망을 확장시킵니다.',
          curriculumPoint: '중2 과학 [물질의 변화와 화학 반응]',
        },
        {
          term: '동굴 생성물 3총사: 종유석·석순·석주',
          description: '동굴 천장의 감압으로 CO2가 탈기되며 탄산칼슘이 침전되어 종유석(위), 석순(아래), 석주(합체 기둥)가 자랍니다.',
          curriculumPoint: '중1 사회 [다양한 자연 경관 - 카르스트]',
        },
        {
          term: '석회암 지대의 붉은 흙 (테라로사)',
          description: '석회암의 탄산칼슘은 물에 녹아 씻겨 내려가고, 녹지 않는 철·알루미늄 산화물이 남아 붉은 점토토를 형성합니다.',
          curriculumPoint: '풍화 잔적토와 토양의 색깔',
        },
      ],
    },
    high: {
      focusQuestion: '탄산염 지질 유체역학 및 지하수면(Water Table) 변동에 따른 다층 동굴 통로 발달 분석',
      keyMechanism: '침식기준면 하강 ➔ 포화대 수평 공동 확장 ➔ 통기대 수직 용식 및 스펠레오템 성장 ➔ 다단계 동굴 테라스 형성 메커니즘을 해석합니다.',
      concepts: [
        {
          term: '통기대(Vadose Zone)와 포화대(Phreatic Zone) 동굴학',
          description: '지하수면 아래 수압에 의한 둥근 원통형 통로(포화대)와, 지하수면 위 중력 유수에 의한 깊은 협곡형 통로(통기대)의 수리학적 대비입니다.',
          curriculumPoint: '2022 개정 [12지과Ⅰ02-04] 지하수의 작용과 지질 구조',
        },
        {
          term: '고생대 조선누층군 탄산염암의 퇴적 환경',
          description: '약 5억 년 전 따뜻한 천해 환경에서 조개·산호 등 생화학적 탄산칼슘이 퇴적된 대석회암통의 층서와 지질학적 연속성입니다.',
          curriculumPoint: '2022 개정 [12한지02-01] 한반도의 지질 계통과 카르스트',
        },
        {
          term: '동굴 생성물의 고기후학적(Paleoclimate) 지표',
          description: '석순 단면의 성장 나이테와 산소 동위원소(δ18O) 비율을 분석하여 과거 수만 년간의 빙하기·간빙기 몬순 강수량을 복원합니다.',
          curriculumPoint: '지구 환경 변화와 고기후 프록시 분석',
        },
      ],
    },
    general: {
      focusQuestion: '5억 년의 암흑이 빚어낸 지하 궁전: 단양·영월·울진 석회동굴의 신비',
      keyMechanism: '물 한 방울이 100년에 1cm를 자라게 하는 인내의 시간이 지하 깊은 어둠 속에서 조각해 낸 백색의 조각 숲입니다.',
      concepts: [
        {
          term: '단양 고수동굴과 영월 고씨굴의 웅장함',
          description: '사자바위, 마리아상 등 인간의 상상력을 뛰어넘는 석순과 종유석들이 지하 수직 절벽과 다층 회랑을 따라 펼쳐집니다.',
          curriculumPoint: '한국의 천연기념물 동굴 유산',
        },
        {
          term: '빛과 어둠이 교차하는 동굴 생태계',
          description: '햇빛이 전혀 들지 않는 항온·항습의 환경에서 눈이 퇴화된 박쥐와 동굴옆새우 등 특수 생물들이 공존하는 안식처입니다.',
          curriculumPoint: '동굴 환경과 생물 다양성 보전',
        },
        {
          term: '동굴 탐방 시 주의할 보전 에티켓',
          description: '사람 손의 유분과 이산화탄소는 수만 년간 자란 석순의 성장을 멈추게 하고 검게 변색시키므로 절대 만지지 않는 것이 규칙입니다.',
          curriculumPoint: '자연유산 보전 윤리와 관람 수칙',
        },
      ],
    },
  },

  // ============================================================
  // 5. 빙하 지형 (Glacial)
  // ============================================================
  '피오르드': {
    category: 'glacial',
    terrainName: '피오르드',
    elementary: {
      focusQuestion: '바다 깊숙이 거대한 골짜기가 이어지고 양쪽에 높은 수직 절벽이 솟은 까닭은 무엇일까요?',
      keyMechanism: '엄청나게 무거운 빙하가 산골짜기 바닥과 벽을 깊게 깎아 U자 모양 골짜기를 만든 뒤, 얼음이 녹자 바닷물이 밀려들어왔습니다.',
      concepts: [
        {
          term: '얼음 덩어리가 깎은 U자 골짜기',
          description: '강물이 깎은 골짜기는 뾰족한 V자 모양이지만, 거대한 얼음 덩어리(빙하)가 바닥과 양옆을 다 깎으면 넓고 깊은 U자 모양이 됩니다.',
          curriculumPoint: '초등 3학년 과학 [지표의 변화]',
        },
        {
          term: '바닷물이 들어와 생긴 깊은 바다 골짜기',
          description: '빙하기가 끝나고 날씨가 따뜻해져 얼음이 녹자, 바닷물 높이가 높아지면서 깊게 파인 골짜기 속으로 바닷물이 가득 찼습니다.',
          curriculumPoint: '기후 변화와 바다의 모습',
        },
        {
          term: '절벽에서 떨어지는 폭포들',
          description: '양쪽 수직 바위 절벽 위에서 녹은 물이 수백 미터 아래 깊은 바다로 바로 쏟아져 내리는 장관을 이룹니다.',
          curriculumPoint: '세계의 독특한 자연환경',
        },
      ],
    },
    middle: {
      focusQuestion: '대륙·곡빙하의 강력한 굴식(Plucking)과 마쇄(Abrasion), 그리고 후빙기 해수면 상승에 의한 침수 메커니즘',
      keyMechanism: '수천 미터 두께의 빙하가 파놓은 빙식곡(U자곡)에 간빙기 해수면이 100m 이상 상승하여 협만이 형성됩니다.',
      concepts: [
        {
          term: '빙하의 굴식과 마쇄 작용',
          description: '얼음 바닥에 박힌 암석 파편이 기반암을 긁어내는 마쇄와, 얼어붙은 바위를 통째로 뜯어내는 굴식으로 깊은 U자곡을 팝니다.',
          curriculumPoint: '중1 사회 [자연으로 떠나는 여행 - 빙하 지형]',
        },
        {
          term: '피오르드의 특징: 깊은 수심과 얕은 입구(문턱)',
          description: '빙하가 가장 두꺼웠던 내륙 쪽은 수심이 1,000m 이상 깊고, 바다와 만나는 입구 쪽은 얼음이 얇아져 얕은 모레인 문턱이 남습니다.',
          curriculumPoint: '피오르드의 독특한 지형 수심 구조',
        },
        {
          term: '현곡(매달린 계곡)과 직하 폭포',
          description: '본류 빙하보다 덜 깎인 지류 빙하 계곡이 본류 계곡 벽 높은 곳에 매달려 있어, 수백 미터의 웅장한 폭포를 만듭니다.',
          curriculumPoint: '노르웨이 피오르드 폭포의 원리',
        },
      ],
    },
    high: {
      focusQuestion: '플라이스토세 빙기-간빙기 해수면 변동론(Glacio-eustasy)과 피오르드 협만의 지형 동역학',
      keyMechanism: '등정압 반등(Isostatic Rebound)과 유스타틱 해수면 상승의 복합 작용, 초심부 해저 분지(Overdeepening) 형성을 분석합니다.',
      concepts: [
        {
          term: '빙저 과굴식(Glacial Overdeepening)과 빙하 문턱(Sill)',
          description: '빙하 두께와 기저 정수압의 극대화로 해수면보다 수백 미터 깊게 바닥을 깎아내는 과굴식과 말단부 빙퇴석 둔덕(Sill)의 수문학적 역할입니다.',
          curriculumPoint: '2022 개정 [12세지02-02] 빙하 및 주빙하 지형',
        },
        {
          term: '후빙기 빙하 등정압 융기(Post-glacial Rebound)',
          description: '수천 미터 빙하의 하중이 제거되자 맨틀의 점성 복원으로 스칸디나비아 지각이 매년 수 밀리미터씩 솟아오르는 지체구조 현상입니다.',
          curriculumPoint: '2022 개정 [12지과Ⅱ01-02] 지각 평형설과 맨틀 점성',
        },
        {
          term: '리아스식 해안과 피오르드식 해안의 비교',
          description: '하천 침식곡(V자곡) 침수로 해안선이 복잡하고 수심이 얕은 리아스식과, 빙식곡(U자곡) 침수로 수심이 극도로 깊고 절벽인 피오르드의 대비입니다.',
          curriculumPoint: '침수 해안의 기원별 지형 분류',
        },
      ],
    },
    general: {
      focusQuestion: '거인의 도끼로 가른 대협곡: 노르웨이와 뉴질랜드 피오르드의 웅장함',
      keyMechanism: '수만 년 전 푸른 빙하가 산맥을 가르고 지나간 자리에 차오른 쪽빛 바다와 천 길 낭떠러지의 합주곡입니다.',
      concepts: [
        {
          term: '송네 피오르드와 게이랑에르의 비경',
          description: '유람선을 타고 들어가면 양옆으로 1,000m가 넘는 수직 암벽이 하늘을 가리고 일곱 자매 폭포가 은빛 물보라를 흩뿌립니다.',
          curriculumPoint: '세계자연유산 피오르드 탐방',
        },
        {
          term: '내륙 깊숙이 들어온 잔잔한 천연 항구',
          description: '외해의 거친 파도가 입구의 얕은 문턱에 걸러져 협만 안쪽은 호수처럼 잔잔하여 고대 바이킹의 거점이자 크루즈의 성지가 되었습니다.',
          curriculumPoint: '빙하 지형과 인문 해양 문화',
        },
        {
          term: '위성 영상 판독법: 산맥을 파고든 깊은 손가락',
          description: '위성에서 보면 거대한 빙모(Ice Cap)에서 바다를 향해 나뭇가지나 손가락처럼 뻗어 나간 쪽빛 물줄기들이 선명하게 드러납니다.',
          curriculumPoint: '위성으로 감상하는 지구의 기하학',
        },
      ],
    },
  },

  // ============================================================
  // 6. 건조 지형 (Arid)
  // ============================================================
  '사막': {
    category: 'arid',
    terrainName: '사막',
    elementary: {
      focusQuestion: '비가 거의 오지 않는 사막에서 바람은 어떻게 모래 언덕을 만들까요?',
      keyMechanism: '큰 일교차로 바위가 부서져 모래가 되고, 끊임없이 부는 바람이 모래를 굴리고 날려 거대한 물결 모양 언덕을 만듭니다.',
      concepts: [
        {
          term: '바위가 바스러져 모래가 되는 과정',
          description: '낮에는 뜨거운 햇빛에 바위가 늘어나고 밤에는 몹시 추워 줄어들기를 반복하면서, 단단한 바위가 조금씩 부서져 모래가 됩니다.',
          curriculumPoint: '초등 3학년 과학 [지표의 변화 - 풍화 작용]',
        },
        {
          term: '바람이 쌓은 모래 언덕 (사구)',
          description: '바람이 모래 알갱이를 싣고 날아가다가 장애물을 만나거나 힘이 약해지면 모래를 쌓아 산처럼 높은 언덕을 만듭니다.',
          curriculumPoint: '바람의 힘과 지표의 변화',
        },
        {
          term: '초승달 모양 모래 언덕',
          description: '한 방향으로 바람이 계속 불면 바람이 불어가는 쪽으로 두 뿔이 길게 뻗은 초승달 모양의 모래 언덕이 만들어집니다.',
          curriculumPoint: '사막에서 관찰할 수 있는 무늬',
        },
      ],
    },
    middle: {
      focusQuestion: '기계적 풍화의 우세와 바람의 취식·마식 작용 및 사구(Barchan)의 이동 메커니즘',
      keyMechanism: '수분 부족으로 물리적 암석 파쇄가 주도하며, 모래 알갱이의 도약(Saltation) 이동으로 사구가 바람 방향으로 전진합니다.',
      concepts: [
        {
          term: '물리적 풍화(기계적 풍화)의 특징',
          description: '극심한 일교차에 따른 암석 광물의 차등 열팽창·수축과 결빙 쐐기 작용으로 화학적 변화 없이 암석이 파쇄됩니다.',
          curriculumPoint: '중2 과학 [지권의 변화 - 암석의 풍화]',
        },
        {
          term: '바람의 취식과 마식 작용',
          description: '가벼운 미립자를 날려 보내는 취식(Deflation)과, 모래 알갱이가 암석 기저부를 샌드블라스트처럼 깎는 마식(Abrasion)입니다.',
          curriculumPoint: '중1 사회 [건조 기후 지역의 지형]',
        },
        {
          term: '사구의 형상과 바람의 방향',
          description: '바람을 받는 완만한 사면(풍상측)을 타고 올라간 모래가 가파른 반대편 사면(풍하측)으로 미끄러져 내리며 사구가 전진합니다.',
          curriculumPoint: '바르한과 횡사구의 이동 원리',
        },
      ],
    },
    high: {
      focusQuestion: '아열대 고압대 하강 기류와 건조 지형학(Arid Geomorphology) 및 풍성 수송 역학(Aeolian Transport)',
      keyMechanism: '대기 대순환 하강 기류 ➔ 극도의 건조 기후 ➔ 풍속 임계 전단 속도 초과 시 모래의 도약 수송과 역암질 사막 포도(Desert Pavement) 형성.',
      concepts: [
        {
          term: '풍성 모래 수송 모드: 부유·도약·포복',
          description: '지름 0.05~0.5mm 모래 입자가 바닥을 튕기며 이동하는 도약(Saltation)이 전체 풍성 수송량의 70% 이상을 차지합니다.',
          curriculumPoint: '2022 개정 [12세지02-03] 건조 및 반건조 지역의 지형',
        },
        {
          term: '사막의 3대 유형: 에르그(Erg)·레그(Reg)·하마다(Hamada)',
          description: '광활한 모래사막(에르그), 자갈이 깔린 자갈사막(레그), 기반암이 그대로 노출된 암석사막(하마다)의 구조적 분류입니다.',
          curriculumPoint: '사막 지형의 표면 피복별 지리학적 분류',
        },
        {
          term: '와디(Wadi)와 플라야(Playa)의 수문 지형학',
          description: '돌발 홍수 시 일시적으로 거센 급류가 흐르는 건천(와디)과, 배수가 막힌 분지 바닥에 형성된 염호(플라야)의 증발 잔류염 침전입니다.',
          curriculumPoint: '건조 지역의 유수 지형과 증발암 침전',
        },
      ],
    },
    general: {
      focusQuestion: '황금빛 모래언덕과 바람의 속삭임: 침묵의 땅 사막이 전하는 감동',
      keyMechanism: '물 한 방울 없는 극한의 건조함 속에서 오직 바람과 모래가 수억 년의 시간 동안 깎고 쌓아 올린 미니멀리즘의 정점입니다.',
      concepts: [
        {
          term: '빛과 그림자가 만드는 능선의 황홀경',
          description: '새벽과 해 질 무렵, 붉은 태양이 사구의 칼날 같은 능선 한쪽에 짙은 그림자를 드리우며 극적인 입체감을 선물합니다.',
          curriculumPoint: '사막 지리 여행과 빛의 미학',
        },
        {
          term: '바람이 남긴 작은 물결: 풍성 연흔',
          description: '거대한 모래언덕 표면을 자세히 들여다보면 잔잔한 바람이 빚어낸 규칙적인 모래 물결 줄무늬(연흔)를 발견할 수 있습니다.',
          curriculumPoint: '미세 지형 관찰의 즐거움',
        },
        {
          term: '사막 여행자의 안전 수칙: 일교차와 수분',
          description: '낮에는 40도를 넘지만 밤에는 영하 가까이 떨어지는 사막의 일교차에 대비하고, 지형지물이 없는 사구에서 방향 감각을 유지하는 법입니다.',
          curriculumPoint: '건조 지대 탐방 안전 가이드',
        },
      ],
    },
  },
};

/**
 * 26종 세부 지형 이름을 매핑하여 가장 적합한 정선 지식 프로필 반환
 */
export function getTerrainKnowledge(terrainName: string): TerrainMetadataRecord {
  const t = (terrainName || '').trim();

  // Exact match
  if (TERRAIN_KNOWLEDGE_BASE[t]) {
    return TERRAIN_KNOWLEDGE_BASE[t];
  }

  // Partial matches
  if (t.includes('칼데라')) return TERRAIN_KNOWLEDGE_BASE['칼데라'];
  if (t.includes('주상절리')) return TERRAIN_KNOWLEDGE_BASE['주상절리'];
  if (t.includes('화산') || t.includes('오름') || t.includes('용암')) return TERRAIN_KNOWLEDGE_BASE['화산'];

  if (t.includes('선상지')) return TERRAIN_KNOWLEDGE_BASE['선상지'];
  if (t.includes('곡류') || t.includes('하천') || t.includes('강') || t.includes('폭포') || t.includes('삼각주') || t.includes('단구')) {
    return TERRAIN_KNOWLEDGE_BASE['곡류천'];
  }

  if (t.includes('해식') || t.includes('절벽') || t.includes('해안') || t.includes('시스택') || t.includes('사주') || t.includes('갯벌')) {
    return TERRAIN_KNOWLEDGE_BASE['해식애 (해안 절벽)'];
  }

  if (t.includes('동굴') || t.includes('석회') || t.includes('카르스트') || t.includes('돌리네') || t.includes('탑')) {
    return TERRAIN_KNOWLEDGE_BASE['석회동굴'];
  }

  if (t.includes('피오르드') || t.includes('빙하') || t.includes('u자') || t.includes('혼') || t.includes('모레인')) {
    return TERRAIN_KNOWLEDGE_BASE['피오르드'];
  }

  // Default: Arid / Desert
  return TERRAIN_KNOWLEDGE_BASE['사막'];
}
