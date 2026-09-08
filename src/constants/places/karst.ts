import { PlaceInfo } from '../../types';

export const KARST_PLACES: PlaceInfo[] = [
  // ==========================================
  // 1. 석회동굴 (Limestone Cave)
  // ==========================================
  {
    id: 'cave-kr-1',
    terrain: '석회동굴',
    region: 'korea',
    placeName: '단양 고수동굴',
    countryOrArea: '대한민국 충청북도 단양군 단양읍',
    tagline: '약 5억 년 전 고생대 조선누층군 석회암층에 지하수가 빚어낸 천연 지하 궁전',
    description: `### 장소 소개 및 선정 이유
천연기념물 제256호인 고수동굴은 총연장 1,395m에 달하는 석회동굴로, '사자바위', '마리아상', '천당못' 등 종유석, 석순, 석주가 전 세계적으로도 가장 조밀하고 다양하게 발달한 한국 대표 석회동굴입니다.

### 과학적 형성 과정
약 5억 년 전 고생대 전기에 바다 밑에서 형성된 석회암(탄산칼슘, CaCO₃) 층에 빗물과 토양을 거쳐 이산화탄소를 흡수한 약산성 지하수(H₂CO₃)가 절리(틈새)를 따라 흘러들면서 화학적 용식 작용을 일으켜 거대한 공동을 만들었습니다. 이후 천장에서 물방울이 떨어지며 탄산칼슘을 재침전시켜 2차 동굴 생성물들을 성장시켰습니다.

### 탐험 포인트
- **종유폭포**: 천장에서 바닥으로 거대한 폭포가 얼어붙은 듯 쏟아져 내린 백색 탄산염 유석 벽
- **석순과 석주**: 바닥에서 솟아오른 석순과 천장에서 자란 종유석이 맞닿아 기둥을 이룬 석주`,
    formationProcess: '약산성 지하수에 의한 석회암의 탄산수소칼슘 용해 및 탄산칼슘 재침전 2차 생성물 발달',
    observationPoints: ['중력 방향의 종유석(Stalactite)', '상향 성장 석순(Stalagmite)', '결합된 석주(Column)'],
    mapQuery: '단양 고수동굴',
    geology: {
      geologicalAge: '고생대 전기 오르도비스기 고성층 석회암 (약 4억 5,000만 년 전)',
      rockType: '결정질 석회암 및 돌로마이트질 석회암',
      tectonicSetting: '옥천대 북동부 단양 석회암 지대',
      geomorphicAgent: '탄산수소칼슘 화학적 용식(Dissolution) 및 재결정화',
      scale: { lengthKm: 1.4, depthMeters: 50 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 천해 탄산염 퇴적', timeframe: '약 4억 5,000만 년 전', process: '적도 부근 따뜻하고 얕은 바다에서 해양 생물 사체들이 두꺼운 석회암층 형성', visualKeyFeature: '치밀하고 단단한 청회색 석회암 지층' },
      { stageNumber: 2, title: '단층 균열 및 지하수 포화대 침식', timeframe: '신생대 제3기', process: '지하수면 아래(포화대)에서 탄산수가 절리망을 넓히며 거대한 초기 지하 터널 굴착', visualKeyFeature: '물로 가득 찬 원통형 지하 공동' },
      { stageNumber: 3, title: '지반 융기와 불포화대 전이', timeframe: '플라이스토세', process: '지하수면이 아래로 내려가면서 동굴 내부에 공기가 차고 천장에서 물방울 낙하', visualKeyFeature: '공기로 채워진 동굴과 낙하하는 지하수' },
      { stageNumber: 4, title: '2차 동굴 생성물 번성', timeframe: '현재', process: '물방울에서 이산화탄소가 빠져나가며 방해석 결정이 자라 종유석, 석순, 석주 완성', visualKeyFeature: '화려한 지하 석회암 신전 경관' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 연중 15℃ 유지 (여름철 피서 및 겨울철 온화)',
      satelliteCheckPoints: ['단양 시가지 동측 산지에 빽빽하게 분포하는 석회암 노두 암반', '고수동굴 상부 산지 능선에 오목오목 파인 돌리네 깔때기들', '남한강으로 합류하는 고수천 계곡선'],
      cautionAndConservation: '천연기념물 동굴 생성물 손대기 금지 및 좁은 철제 계단 보행 주의'
    }
  },
  {
    id: 'cave-wd-1',
    terrain: '석회동굴',
    region: 'world',
    placeName: '미국 켄터키 매머드 케이브 (Mammoth Cave)',
    countryOrArea: '미국 켄터키주 에드먼슨 카운티',
    tagline: '탐사된 총연장만 686km에 달하는 지구상에서 가장 길고 거대한 지하 미로',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 매머드 케이브 국립공원은 현재까지 확인된 동굴 통로 길이만 686km(서울-부산 거리 초과)로 전 세계에서 압도적으로 가장 긴 석회동굴 시스템이며, 지금도 새로운 통로가 계속 발견되고 있습니다.

### 과학적 형성 과정
고생대 미시시피기 석회암층 위에 비투과성 사암 지층(빅 클리프 사암)이 마치 뚜껑처럼 덮여 있어 외부 빗물에 동굴 천장이 무너지지 않고 보호된 상태에서, 그린강(Green River) 지하수계가 수평으로 수백 킬로미터의 통로를 단계별로 뚫어냈습니다.`,
    formationProcess: '보호 사암 캡록 아래에서 그린강 수위 하강에 따른 5개 층위 다층 수평 미로 굴착',
    observationPoints: ['로툰다(Rotunda) 거대 돔', '보텀리스 핏(Bottomless Pit) 수직 갱도', '눈먼 동굴 물고기'],
    mapQuery: 'Mammoth Cave National Park Kentucky USA',
    geology: {
      geologicalAge: '고생대 석탄기 미시시피기 (약 3억 3,000만 년 전)',
      rockType: '고순도 세인트루이스/세인트주느비에브 석회암 위 사암 캡록',
      tectonicSetting: '일리노이 분지 남동부 완경사 구조 분지',
      geomorphicAgent: '그린강 지하수계의 다층 수평 용식 작용',
      scale: { lengthKm: 686, depthMeters: 115 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석회암 및 사암 캡록 퇴적', timeframe: '약 3억 3,000만 년 전', process: '두꺼운 석회암 위에 침식을 막아주는 단단한 사암층이 퇴적되어 천장 붕괴 방지판 형성', visualKeyFeature: '지하 석회암을 감싼 단단한 모래암석 뚜껑' },
      { stageNumber: 2, title: '그린강 계곡 침식 및 지하수 유입', timeframe: '약 1,000만 년 전', process: '그린강이 고원을 파고들며 측면 틈새로 막대한 양의 지하수 유입', visualKeyFeature: '지하로 빨려 들어가는 거대한 강물' },
      { stageNumber: 3, title: '5개 층위 수평 통로 완성', timeframe: '빙하기 플라이스토세', process: '강 수위가 낮아질 때마다 새로운 층의 수평 동굴 통로가 거미줄처럼 계속 확장', visualKeyFeature: '5층으로 겹쳐진 거대한 지하 도로망' },
      { stageNumber: 4, title: '무수(Dry) 통로와 거대 공동 안착', timeframe: '현재', process: '물이 빠져나간 상층부는 건조하게 보존되고 최하층에서는 여전히 지하 하천 흐름', visualKeyFeature: '끝이 보이지 않는 매머드급 암흑 세계' }
    ],
    fieldGuide: {
      bestVisitingSeason: '국립공원 사전 레인저 투어 예약 필수 (사계절 연중 12℃ 유지)',
      satelliteCheckPoints: ['켄터키 숲속에 사암 고원과 그린강 협곡이 깊게 파고든 지형 경계', '고원 표면에 수천 개가 촘촘히 뚫려 있는 깔때기 구멍 싱크홀(돌리네) 군락', '그린강이 구불구불 흘러가는 푸른 물길'],
      cautionAndConservation: '박쥐 흰코증후군 예방을 위해 타 동굴 착용 신발 소독 엄수'
    }
  },

  // ==========================================
  // 2. 돌리네 (Doline / Sinkhole)
  // ==========================================
  {
    id: 'doline-kr-1',
    terrain: '돌리네',
    region: 'korea',
    placeName: '문경 굴봉산 돌리네습지',
    countryOrArea: '대한민국 경상북도 문경시 산북면 우곡리',
    tagline: '물이 고이지 않는 석회암 깔때기 분지에서 사계절 물이 차 있는 세계적 희귀 돌리네 습지',
    description: `### 장소 소개 및 선정 이유
환경부 지정 국가습지보호지역이자 천연기념물 제560호인 문경 굴봉산 돌리네습지는 통상 물이 지하로 빠져버리는 석회암 돌리네 지형에 사계절 내내 물이 마르지 않고 습지가 형성된 전 세계적으로도 손꼽히는 기적 같은 카르스트 지형입니다.

### 과학적 형성 과정
석회암이 빗물에 녹아 우묵한 접시 모양의 돌리네가 형성된 후, 불용성 잔류 점토(테라로사)와 유기물이 바닥의 배수구(포노르)를 완벽하게 틀어막아 물이 빠져나가지 못하는 천연 방수층을 만들어 습지를 탄생시켰습니다.

### 탐험 포인트
- **접시 모양의 돌리네 지형**: 산 정상부 부근에 사방이 완만하게 둘러싸인 타원형 함몰 분지
- **멸종위기 야생생물 서식지**: 수달, 담비, 삵, 꼬리진달래 등이 살아가는 풍요로운 카르스트 생태계`,
    formationProcess: '석회암 용식 함몰와지 형성 후 테라로사 점토층의 천연 불투수 차수벽 작용',
    observationPoints: ['사방이 막힌 돌리네 와지', '돌리네 바닥의 담수 식생', '주변 적갈색 테라로사 토양'],
    mapQuery: '문경돌리네습지',
    geology: {
      geologicalAge: '고생대 전기 조선누층군 석회암 위 제4기 충적 점토층',
      rockType: '결정질 석회암 및 불용성 점토 테라로사(Terra Rossa)',
      tectonicSetting: '옥천변성대 문경 탄전 인근 카르스트 지대',
      geomorphicAgent: '석회암 표면 용식 함몰 및 유기물 점토 차수',
      scale: { areaKm2: 0.5, elevationMeters: 280 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석회암 지표 용식 함몰', timeframe: '약 10만 년 전', process: '빗물이 굴봉산 석회암을 녹여 직경 수백 미터의 오목한 돌리네 깔때기 분지 형성', visualKeyFeature: '물이 쏙쏙 빠져나가는 메마른 싱크홀' },
      { stageNumber: 2, title: '테라로사 점토 집적', timeframe: '빙하기~후빙기', process: '석회암 속 탄산칼슘은 녹아 나가고 남은 산화철·알루미늄 붉은 점토가 바닥에 퇴적', visualKeyFeature: '돌리네 바닥에 쌓이는 붉은 진흙층' },
      { stageNumber: 3, title: '배수구(포노르)의 점토 폐색', timeframe: '약 3,000년 전', process: '미세 점토와 썩은 식물 유기물이 지하 구멍을 완벽하게 밀봉하여 방수층 완성', visualKeyFeature: '빠져나가지 못하고 고이기 시작하는 빗물' },
      { stageNumber: 4, title: '기적의 카르스트 습지 안착', timeframe: '현재', process: '지하수 용출과 강수가 더해져 사계절 수위가 유지되는 생태 보고로 번성', visualKeyFeature: '산꼭대기 분지에 피어난 수련과 버드나무 숲' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~6월 신록 및 9월 가을철 (친환경 전동차 탑승 추천)',
      satelliteCheckPoints: ['굴봉산 능선 해발 280m 안쪽에 숨겨진 계란 모양의 옴폭한 녹색 분지', '분지 바닥에 푸르게 빛나는 타원형 습지 수면', '사방이 더 높은 능선으로 완벽히 둘러싸인 독립 폐쇄 배수계'],
      cautionAndConservation: '습지보호구역으로 탐방 데크 외 진입 금지 및 채집 엄금'
    }
  },
  {
    id: 'doline-wd-1',
    terrain: '돌리네',
    region: 'world',
    placeName: '멕시코 유카탄 세노테 이킬 (Cenote Ik Kil)',
    countryOrArea: '멕시코 유카탄주 치첸이차',
    tagline: '마야 문명이 비의 신 차크에게 제사를 올린 지하 26m의 거대한 원통형 천연 우물',
    description: `### 장소 소개 및 선정 이유
치첸이차 마야 유적지 인근의 '이킬 세노테'는 유카탄 석회암 반도에 형성된 전형적인 함몰 돌리네(Collapse Sinkhole)로, 지하 26m 깊이로 수직으로 뚫린 원형 절벽과 수심 40m의 맑고 푸른 지하수가 열대 덩굴 식물과 어우러져 절경을 이룹니다.

### 과학적 형성 과정
지하 거대 석회동굴의 천장이 빗물의 지속적인 용식과 중력을 이기지 못하고 한꺼번에 무너지면서 지표면에 직경 60m의 거대한 원통형 구멍이 뚫렸고, 유카탄의 거대한 지하수면(Water Table)이 그대로 노출되어 천연 수영장 우물이 되었습니다.`,
    formationProcess: '지하 석회동굴 천장의 자중 붕괴 함몰 및 지하수면 노출에 의한 세노테 형성',
    observationPoints: ['지하 26m 수직 원통형 벽면', '천장에서 수면으로 늘어진 열대 공기뿌리', '40m 수심의 청옥빛 담수'],
    mapQuery: 'Cenote Ik Kil Yucatan Mexico',
    geology: {
      geologicalAge: '신생대 제3기~제4기 플라이스토세 (약 100만 년 전~현재)',
      rockType: '다공질 제3기 천해 석회암 (Porous Limestone)',
      tectonicSetting: '칙술루브 운석 충돌구 림 외곽 유카탄 플랫폼',
      geomorphicAgent: '지하수면 변동에 따른 동굴 천장 중력 붕괴',
      scale: { depthMeters: 66, areaKm2: 0.003 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '운석 충돌과 지하 균열', timeframe: '약 6,600만 년 전', process: '공룡을 멸종시킨 칙술루브 소행성 충돌로 유카탄 반도 전역에 동심원 단열망 형성', visualKeyFeature: '지하 암반에 새겨진 거대한 충격 균열선' },
      { stageNumber: 2, title: '빙하기 지하 동굴 굴착', timeframe: '빙하기 저해수면기', process: '해수면이 낮을 때 빗물이 지하로 쏟아지며 거대한 동굴 터널망 굴착', visualKeyFeature: '지표면 바로 아래 뚫린 거대 공동' },
      { stageNumber: 3, title: '천장 수직 자중 대함몰', timeframe: '약 1만 년 전', process: '동굴 지붕이 얇아지며 원형 블록 형태로 통째로 무너져 내려 지표 개방', visualKeyFeature: '깊이 26m의 거대한 원통형 구멍 출현' },
      { stageNumber: 4, title: '지하수면 복원 및 담수호', timeframe: '현재', process: '해수면 상승으로 유카탄 지하수면이 차오르며 40m 깊이의 푸른 지하 우물 완성', visualKeyFeature: '넝쿨이 드리운 마야 신성 세노테의 신비' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~4월 멕시코 건기 (정오 무렵 햇빛이 수직으로 수면에 꽂힐 때 환상적)',
      satelliteCheckPoints: ['평평한 유카탄 밀림 숲 한복판에 펀치로 뚫어놓은 듯한 둥근 검은 원형 구멍', '치첸이차 피라미드와 직선거리로 인접한 배치', '주변에 강줄기(지표 하천)가 전혀 없는 지형적 특성'],
      cautionAndConservation: '수질 보호를 위해 선크림·로션 샤워 제거 후 구명조끼 착용 입수'
    }
  },

  // ==========================================
  // 3. 카렌 (Karren)
  // ==========================================
  {
    id: 'karren-kr-1',
    terrain: '카렌',
    region: 'korea',
    placeName: '문경 문경새재 조령산 카렌펠트',
    countryOrArea: '대한민국 경상북도 문경시 문경읍 조령산 일대',
    tagline: '백두대간 산마루 석회암 암반이 빗물에 씻기며 묘비처럼 솟아오른 천연 돌밭',
    description: `### 장소 소개 및 선정 이유
문경새재와 조령산 일대의 능선부에는 빗물에 용식되어 울퉁불퉁해진 석회암 바위들이 묘비처럼 지표면에 솟아 있는 전형적인 카렌(Karren)과 카렌펠트(돌밭) 지형이 장관을 이룹니다.

### 과학적 형성 과정
지표면에 노출된 석회암 암반 표면을 타고 흐르는 빗물이 탄산 성분으로 바위 표면의 연약한 절리 틈을 화학적으로 녹여내면서, 깊은 고랑(Rinnenkarren)을 파고 남은 단단한 돌출부가 칼날이나 이빨 모양의 돌기둥(카렌)으로 남았습니다.`,
    formationProcess: '노출된 석회암 암반 표면의 빗물 유하 용식으로 날카로운 고랑과 돌출 암치 발달',
    observationPoints: ['이빨 모양으로 솟은 석회암 카렌', '빗물이 깎아낸 미세 용식 고랑', '붉은 테라로사 토양'],
    mapQuery: '문경새재 조령산',
    geology: {
      geologicalAge: '고생대 전기 조선누층군 석회암 (약 4억 7,000만 년 전)',
      rockType: '청회색 치밀 석회암',
      tectonicSetting: '백두대간 중부 산악 융기 능선',
      geomorphicAgent: '강우 유출수(Rainwash) 표면 화학 용식',
      scale: { elevationMeters: 800 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 석회암 지괴 융기', timeframe: '신생대 제3기', process: '지하 깊은 곳의 석회암 지층이 백두대간 조산 융기 운동으로 산마루로 노출', visualKeyFeature: '산정에 드러난 평평한 석회암 암반' },
      { stageNumber: 2, title: '토양 피복하 지하 용식', timeframe: '빙하기~온난기', process: '부식토 아래에서 산성 토양수가 바위 표면을 둥글넓적하게 먼저 삭박', visualKeyFeature: '흙 속에 파묻혀 부식되는 바위 요철' },
      { stageNumber: 3, title: '표토 유실 및 암반 노출', timeframe: '약 1만 년 전', process: '비바람으로 겉흙이 씻겨 내려가며 요철 암반이 대기 중에 완전히 노출', visualKeyFeature: '지표로 튀어나온 기괴한 암석 기둥들' },
      { stageNumber: 4, title: '빗물 세로고랑(카렌) 조각', timeframe: '현재', process: '떨어지는 빗물이 바위 표면에 날카로운 홈을 파내며 양떼 모양의 카렌펠트 완성', visualKeyFeature: '비석들이 밭을 이룬 듯한 카렌 지형' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄·가을철 등산 시즌 (문경새재 옛길과 연계 탐방)',
      satelliteCheckPoints: ['조령산 산등성이를 따라 희끗희끗하게 드러난 석회암 암반 노두', '산림 사이에 바위들이 무리 지어 박혀 있는 밝은 회색 패턴', '문경새재 협곡 관문 주변의 지형 배치'],
      cautionAndConservation: '비에 젖은 석회암 카렌 바위는 대단히 미끄러우므로 등산화 착용 필수'
    }
  },
  {
    id: 'karren-wd-1',
    terrain: '카렌',
    region: 'world',
    placeName: '중국 윈난 쿤밍 스린 (석림, 石林)',
    countryOrArea: '중국 윈난성 쿤밍시 이량현',
    tagline: '칼날 같은 돌기둥들이 숲을 이루어 하늘을 찌르는 유네스코 세계자연유산의 바위 숲',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 윈난성 쿤밍 석림(Stone Forest)은 면적 350㎢에 걸쳐 수만 개의 거대한 회색 석회암 기둥들이 마치 빽빽한 대나무 숲처럼 솟아오른 지구상에서 가장 웅장하고 극적인 메가 카렌(Mega-Karren) 지형입니다.

### 과학적 형성 과정
약 2억 7천만 년 전 페름기 바다에 쌓인 두터운 석회암이 지각 융기 후, 지표 토양 아래에서 산성 지하수에 의해 수직 절리가 수십 미터 깊이로 녹아내리고 이후 토양이 씻겨 나가며 거대한 바위 기둥 숲이 완성되었습니다.`,
    formationProcess: '페름기 순수 석회암의 지하 절리 용식 후 지표 박탈에 따른 거대 카렌 삼림 노출',
    observationPoints: ['높이 20~30m의 칼날 석주림', '칼로 베어낸 듯한 수직 빗물 고랑', '돌기둥 사이의 미로 미기복'],
    mapQuery: 'Stone Forest Kunming Yunnan China',
    geology: {
      geologicalAge: '고생대 후기 페름기 (약 2억 7,000만 년 전)',
      rockType: '고순도 두터운 괴상 석회암 (Purity > 95% CaCO₃)',
      tectonicSetting: '양쯔 지괴 남서부 윈구이 고원 탄산염 순상지',
      geomorphicAgent: '지하 피복 용식(Subcutaneous Dissolution) 및 표토 박탈',
      scale: { areaKm2: 350, elevationMeters: 1750, depthMeters: 30 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '페름기 고온 천해 탄산염 고화', timeframe: '약 2억 7,000만 년 전', process: '원시 바다에서 500m 두께의 순도 높은 석회암이 퇴적되어 거대 암반 구축', visualKeyFeature: '티끌 없는 순백의 거대 석회암층' },
      { stageNumber: 2, title: '격자형 수직 절리 단열망', timeframe: '중생대 조산운동기', process: '대륙 충돌로 석회암 대지에 가로세로 바둑판 모양의 깊은 수직 단열선 형성', visualKeyFeature: '체스판처럼 쪼개진 거대 지하 암반' },
      { stageNumber: 3, title: '붉은 토양 속 피복 용식', timeframe: '신생대 제3기 고열대 기후', process: '식생 토양 속 산성수가 수직 틈새를 20~30m 깊이로 넓게 녹여 기둥 분리', visualKeyFeature: '붉은 흙 속에 묻힌 수만 개의 지하 돌기둥' },
      { stageNumber: 4, title: '토양 침식 삭박과 석림 출현', timeframe: '현재', process: '기후 변화와 융기로 흙이 씻겨 나가며 지하의 거대한 바위 숲이 지상으로 일제히 노출', visualKeyFeature: '하늘을 찌르는 350㎢의 신비로운 돌의 숲' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 봄 같은 쿤밍 날씨로 연중 우수 (3~5월 및 9~11월 최적)',
      satelliteCheckPoints: ['녹색 고원 평야 한가운데 거대한 흑회색 바위 군락이 곰팡이처럼 빽빽한 패턴', '미로처럼 얽힌 보행 통로와 에메랄드빛 카르스트 인공 호수', '우뚝 솟은 망봉정 전망대 주변의 밀집 석주 림'],
      cautionAndConservation: '미로 같은 카렌 숲 내부에서 길을 잃기 쉬우므로 주 탐방로 유지'
    }
  },

  // ==========================================
  // 4. 탑 카르스트 (Tower Karst)
  // ==========================================
  {
    id: 'tower-kr-1',
    terrain: '탑 카르스트',
    region: 'korea',
    placeName: '영월 선돌 탑카르스트',
    countryOrArea: '대한민국 강원도 영월군 영월읍 방절리 서강변',
    tagline: '서강 푸른 물길 위에 신선처럼 우뚝 솟아오른 70m 높이의 석회암 칼날 탑',
    description: `### 장소 소개 및 선정 이유
명승 제76호인 영월 선돌(立石)은 서강 절벽 가장자리에 70m 높이로 솟아 있는 두 갈래의 거대한 석회암 수직 바위기둥으로, 동양화 한 폭을 그대로 옮겨놓은 듯한 한국의 대표적인 탑 카르스트(Tower Karst) 초기 형태입니다.

### 과학적 형성 과정
고생대 오르도비스기 석회암 절벽에 발달한 수직 절리를 따라 빗물과 지하수가 집중적으로 용식 작용을 벌여 절벽 본체와 바위기둥 사이의 틈새를 갈라놓았고, 아래 서강의 하식 작용이 더해져 홀로 우뚝 선 탑 형태를 완성했습니다.`,
    formationProcess: '석회암 수직 절리의 집중 용식 분리와 서강 하천 하식애 측방 침식의 결합',
    observationPoints: ['70m 수직 선돌 기둥', '기둥 사이 쪼개진 용식 틈새', '서강 굽이치는 물길 조망'],
    mapQuery: '영월 선돌',
    geology: {
      geologicalAge: '고생대 전기 오르도비스기 영흥층 석회암',
      rockType: '담회색 괴상 석회암 및 돌로마이트',
      tectonicSetting: '태백산 분지 융기 산악 하천 절벽',
      geomorphicAgent: '수직 절리 용식 분리 및 서강 하식 침식',
      scale: { elevationMeters: 70, depthMeters: 70 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 석회암 형성', timeframe: '약 4억 8,000만 년 전', process: '삼엽충 바다 밑에 두껍고 단단한 영흥층 석회암 침전', visualKeyFeature: '균질하고 치밀한 탄산염 암반' },
      { stageNumber: 2, title: '지각 융기와 수직 단열', timeframe: '신생대 제3기', process: '한반도 융기로 지표에 노출되며 암벽에 평행한 수직 절리면 발생', visualKeyFeature: '절벽을 따라 수직으로 금이 간 암반' },
      { stageNumber: 3, title: '절리 틈 용식 팽창', timeframe: '약 10만 년 전', process: '빗물이 금 간 틈새로 스며들어 화학적으로 석회암을 녹여 틈새를 수 미터로 벌림', visualKeyFeature: '본체 암벽에서 분리되기 시작하는 바위' },
      { stageNumber: 4, title: '서강 하식과 독립 입석 완성', timeframe: '현재', process: '서강 강물이 기저부를 씻어내고 풍화가 진행되어 70m 수직 쌍기둥 탑 완성', visualKeyFeature: '굽이치는 강물 위 우뚝 선 두 갈래 신선바위' }
    ],
    fieldGuide: {
      bestVisitingSeason: '이른 아침 서강 물안개가 피어오르는 가을철(9~11월)',
      satelliteCheckPoints: ['서강 하천 공격사면의 급경사 절벽 끝자락', '전망대 데크 바로 아래 바다 쪽으로 돌출된 작은 바위 기둥 돌기', '청령포로 이어지는 U자형 서강 물줄기 궤적'],
      cautionAndConservation: '전망대 난간 기대기 금지 및 강변 절벽 추락 주의'
    }
  },
  {
    id: 'tower-wd-1',
    terrain: '탑 카르스트',
    region: 'world',
    placeName: '중국 구이린 리강 탑 카르스트 (Guilin Karst)',
    countryOrArea: '중국 광시 좡족 자치구 구이린시 / 양숴현',
    tagline: '"계림 산수는 천하제일"이라는 찬사를 받는 2만여 개 원추형 봉우리들의 수상 파노라마',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 구이린-양숴 카르스트는 20위안 화폐 배경으로 유명하며, 평탄한 충적 평야와 옥빛 리강(漓江) 수면 위로 수백 미터 높이의 뾰족한 탑(Fenglin)과 봉우리(Fengcong)들이 2만 개 이상 솟구친 열대 탑 카르스트의 세계 최고봉입니다.

### 과학적 형성 과정
고온다습한 아열대 기후에서 풍부한 강우와 울창한 식생이 뿜어내는 고농도 이산화탄소가 두께 3,000m의 데본기-석탄기 순수 석회암층을 수백만 년 동안 집요하게 용식하여, 사면 전체가 수직으로 깎인 원추형 석회암 탑들을 빚어냈습니다.`,
    formationProcess: '고온다습 아열대 환경의 강력한 화학적 용식과 하천 측방 침식이 만든 독립 석회암 봉우리',
    observationPoints: ['20위안 배경 양숴 황포도영', '리강 수면에 비친 탑 카르스트 반영', '관암 수중 동굴'],
    mapQuery: 'Li River Guilin Guangxi China',
    geology: {
      geologicalAge: '고생대 데본기~석탄기 (약 3억 8,000만~3억 2,000만 년 전)',
      rockType: '순도 99%에 달하는 초고순도 생쇄설성 석회암',
      tectonicSetting: '양쯔 남부 온난 천해 탄산염 거대 플랫폼',
      geomorphicAgent: '아열대 몬순 호우의 극단적 용식 및 리강 측방 삭박',
      scale: { areaKm2: 2000, elevationMeters: 400, depthMeters: 250 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '데본기 거대 탄산염 플랫폼', timeframe: '약 3억 5,000만 년 전', process: '따뜻한 고생대 바다에서 3,000m 두께의 순수 석회암층 퇴적', visualKeyFeature: '지구상에서 가장 두꺼운 석회암 대지' },
      { stageNumber: 2, title: '지각 융기와 봉총(Fengcong) 형성', timeframe: '신생대 초기', process: '고원이 융기하며 깊은 싱크홀들이 파여 기저부가 연결된 봉우리 무리(봉총) 형성', visualKeyFeature: '계란판 모양으로 움푹움푹 파인 산악 카르스트' },
      { stageNumber: 3, title: '리강 하천 평탄화와 봉림(Fenglin)', timeframe: '약 200만 년 전', process: '리강 물길이 주변을 깎아 평탄한 범람원을 만들며 봉우리 밑동을 완전히 고립 분리', visualKeyFeature: '평야 위에 독립적으로 솟은 원통형 탑들' },
      { stageNumber: 4, title: '수묵화 비경 안착', timeframe: '현재', process: '사면의 수직 용식 홈과 아열대 식생이 어우러져 2만 개 탑 카르스트 파노라마 완성', visualKeyFeature: '강물에 비치는 천하제일의 산수화 절경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '4월~10월 (리강 유람선 수량이 풍부하고 강안에 안개가 서리는 시기)',
      satelliteCheckPoints: ['구이린에서 양숴까지 초록색 평야 위에 팝콘처럼 촘촘히 돋아난 수만 개의 둥근 봉우리 그림자들', '봉우리 사이를 뱀처럼 사행하며 굽이치는 리강의 은빛 물줄기', '산봉우리 꼭대기에 구멍이 뚫린 월량산(Moon Hill)의 천연 아치'],
      cautionAndConservation: '리강 대나무 뗏목 탑승 시 구명조끼 착용 및 소지품 침수 주의'
    }
  }
];
