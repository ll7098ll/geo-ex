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
    id: 'cave-kr-2',
    terrain: '석회동굴',
    region: 'korea',
    placeName: '삼척 대이리 환선굴',
    countryOrArea: '대한민국 강원특별자치도 삼척시 신기면 대이리',
    tagline: '총연장 6.2km, 천장 높이 25m의 웅장한 대공동을 자랑하는 동양 최대 크기의 석회동굴',
    description: `### 장소 소개 및 선정 이유
천연기념물 제178호인 삼척 환선굴은 주통로 폭이 최대 100m, 천장 높이가 25m에 달하는 압도적인 규모의 지하 광장을 품고 있는 동양 최대 크기의 석회동굴입니다.

### 과학적 형성 과정
고생대 조선누층군 대기층 풍촌 석회암에 풍부한 지하수가 유입되어 거대한 지하 하천을 이루며 수백만 년 동안 암석을 침식·용식하여 거대한 공동과 옥좌대, 꿈의 궁전 등 웅장한 유석을 빚어냈습니다.`,
    formationProcess: '풍부한 지하 유수량에 의한 대규모 지하공동 기계적 굴착 및 화학적 용식',
    observationPoints: ['웅장한 중앙 대광장', '높이 10m의 거대한 백색 유석벽(만리장성)', '지하 폭포와 소'],
    mapQuery: '삼척 환선굴',
    geology: {
      geologicalAge: '고생대 캄브리아기 풍촌 석회암 (약 5억 년 전)',
      rockType: '괴상 석회암 및 돌로마이트',
      tectonicSetting: '태백산분지 대이리 카르스트 지대',
      geomorphicAgent: '지하수계의 대유량 침식 및 탄산수소칼슘 침전',
      scale: { lengthKm: 6.2, depthMeters: 100 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '캄브리아기 해양 퇴적', timeframe: '약 5억 년 전', process: '두꺼운 풍촌 석회암 지층 침전', visualKeyFeature: '치밀한 석회암 암반' },
      { stageNumber: 2, title: '단층 파쇄대 대규모 지하수 침투', timeframe: '중생대~신생대', process: '지하 거대 급류가 암반 틈새를 뚫어 거대한 지하 강 형성', visualKeyFeature: '거대한 지하 수로' },
      { stageNumber: 3, title: '초대형 공동 붕락 및 확장', timeframe: '플라이스토세', process: '천장이 뜯겨 나가며 높이 25m 광활한 지하 궁전 탄생', visualKeyFeature: '축구장 크기의 지하 광장' },
      { stageNumber: 4, title: '유석 및 석회화 단구 발달', timeframe: '현재', process: '바닥과 벽면을 타고 흐르는 물이 거대한 유석과 계단식 논(휴석) 완성', visualKeyFeature: '황금빛 유석의 장관' }
    ],
    fieldGuide: {
      bestVisitingSeason: '여름철 (동굴 내부 연중 11~14℃로 시원함, 모노레일 이용 가능)',
      satelliteCheckPoints: ['덕항산 줄기 동측 깊은 계곡부에 위치한 환선굴 입구', '대이리 일대 촛대바위와 석회암 절벽선'],
      cautionAndConservation: '동굴 내부 바닥이 젖어 미끄러우므로 접지력 좋은 운동화 착용'
    }
  },
  {
    id: 'cave-kr-3',
    terrain: '석회동굴',
    region: 'korea',
    placeName: '영월 김삿갓면 고씨동굴',
    countryOrArea: '대한민국 강원특별자치도 영월군 김삿갓면 진별리',
    tagline: '남한강 물길과 맞닿은 4억 년 전 막골 석회암층의 4개 층 다층 입체 미로 동굴',
    description: `### 장소 소개 및 선정 이유
천연기념물 제219호인 고씨동굴은 남한강 지류 하상 바로 옆에 형성된 수평 다층 동굴로, 임진왜란 당시 고씨 가족이 피난을 했던 역사적 유래와 함께 상·중·하 4개 층의 입체적인 통로 구조를 자랑합니다.

### 과학적 형성 과정
남한강의 하천 수위 변동과 지반 융기에 발맞추어 지하수면이 단계적으로 낮아지면서 상층부의 오래된 동굴 통로부터 최하층의 현재 지하수가 흐르는 활성 통로까지 계단식으로 형성되었습니다.`,
    formationProcess: '남한강 하각 작용 및 지반 융기에 따른 4단계 수평 동굴 다층 발달',
    observationPoints: ['다양한 색상의 종유석과 석순', '지하 호수와 연못', '오작교와 사랑바위'],
    mapQuery: '영월 고씨동굴',
    geology: {
      geologicalAge: '고생대 오르도비스기 막골층 석회암 (약 4억 7,000만 년 전)',
      rockType: '층상 석회암 및 석회질 셰일 교호대',
      tectonicSetting: '옥천변성대 남한강 수계 연변부',
      geomorphicAgent: '남한강 수위 연동 지하수 용식 및 수직 절리 굴착',
      scale: { lengthKm: 3.4, depthMeters: 60 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '오르도비스기 막골층 퇴적', timeframe: '약 4억 7,000만 년 전', process: '탄산염 퇴적물이 교호하며 지층 형성', visualKeyFeature: '줄무늬 석회암 암반' },
      { stageNumber: 2, title: '상층 통로 굴착', timeframe: '플라이스토세 초기', process: '과거 높은 수위의 남한강 지하수가 상부 통로 용식', visualKeyFeature: '지하 상부 미로 통로' },
      { stageNumber: 3, title: '하천 하각과 4개 층 분리', timeframe: '플라이스토세 후기', process: '강바닥이 낮아지며 단계적으로 아래쪽 통로 생성', visualKeyFeature: '아파트 같은 4개 층 구조' },
      { stageNumber: 4, title: '2차 생성물 발달 및 보전', timeframe: '현재', process: '종유석과 동굴산호가 아름답게 번성', visualKeyFeature: '아름다운 지하 종유석 숲' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 연중 관람 가능',
      satelliteCheckPoints: ['남한강 물줄기 바로 옆 남측 산록 절벽에 위치한 입구'],
      cautionAndConservation: '안전모 착용 필수 (통로가 좁고 낮은 구간 다수)'
    }
  },
  {
    id: 'cave-kr-4',
    terrain: '석회동굴',
    region: 'korea',
    placeName: '평창 백룡동굴 (천연 탐사형 동굴)',
    countryOrArea: '대한민국 강원특별자치도 평창군 미탄면 마하리',
    tagline: '동강의 푸른 물결 아래 태고의 순수를 그대로 간직한 국내 유일의 생태 체험 석회동굴',
    description: `### 장소 소개 및 선정 이유
천연기념물 제260호인 백룡동굴은 인공 조명이나 철제 데크를 설치하지 않고 탐사복과 헤드램프를 착용하고 들어가는 국내 유일의 천연 탐사형 동굴로, 동강 수면 바로 위에서 태고의 원형을 완벽히 간직하고 있습니다.

### 과학적 형성 과정
동강의 곡류 침식 과정에서 지하 하천이 동강으로 빠져나가는 통로로 이용되었으며, 주기적인 침수와 방해석 재결정화로 종유석, 석순, 석화, 동굴진주 등이 훼손 없이 보존되었습니다.`,
    formationProcess: '동강 감입곡류 하천과 연동된 지하수계 용식 및 미개발 원시 보존',
    observationPoints: ['자연 그대로의 백색 석순 군락', '달걀프라이 모양의 독특한 석순', '동굴 산호와 방해석 석화'],
    mapQuery: '평창 백룡동굴',
    geology: {
      geologicalAge: '고생대 조선누층군 정선 석회암층',
      rockType: '결정질 고순도 석회암',
      tectonicSetting: '평창 미탄 카르스트 지대 동강 유역',
      geomorphicAgent: '동강 수위 연동 지하수 순환 및 화학 침전',
      scale: { lengthKm: 1.8 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '정선 석회암층 형성', timeframe: '고생대 전기', process: '천해 환경 탄산염 퇴적', visualKeyFeature: '두터운 석회암 지층' },
      { stageNumber: 2, title: '동강 수계와 지하 연결', timeframe: '신생대', process: '강물이 석회암 틈을 뚫고 지하 하천 구축', visualKeyFeature: '물 흐르는 지하 동굴' },
      { stageNumber: 3, title: '입구 퇴적 폐색과 자연 밀폐', timeframe: '수천 년 전', process: '토사가 입구를 막아 수백 년간 외부 오염 없이 보존', visualKeyFeature: '순백의 밀폐된 지하 보물창고' },
      { stageNumber: 4, title: '생태 탐사 동굴 개방', timeframe: '현재', process: '조명 없이 가이드 동반 탐사 프로그램으로만 한정 운영', visualKeyFeature: '램프 불빛에 반짝이는 동굴 생성물' }
    ],
    fieldGuide: {
      bestVisitingSeason: '4월~11월 (인터넷 사전 예약 필수, 탐사복 및 헬멧 지급)',
      satelliteCheckPoints: ['동강 물굽이가 180도 회전하는 백운산 절벽 하단 입구'],
      cautionAndConservation: '포복 통과 구간이 있으므로 체력 및 폐소공포증 유의'
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
  {
    id: 'cave-wd-2',
    terrain: '석회동굴',
    region: 'world',
    placeName: '슬로베니아 포스토이나 동굴 (Postojna Cave)',
    countryOrArea: '슬로베니아 포스토이나',
    tagline: '동굴 열차를 타고 탐험하는 24km 지하 궁전, 카르스트라는 이름의 기원이 된 유럽 최대의 석회동굴',
    description: `### 장소 소개 및 선정 이유
'카르스트(Karst)'라는 학술 용어가 탄생한 슬로베니아 크라스(Kras) 지방의 대표 석회동굴로, 200년 역사의 동굴 열차를 타고 들어가는 웅장한 지하 통로와 '브릴리언트(다이아몬드 석순)'로 유명합니다.

### 과학적 형성 과정
피브카(Pivka) 강이 백악기 석회암 대지 밑으로 파고들어 수평으로 지하 터널망을 파냈으며, 백색 방해석이 눈부신 석순과 커튼 종유석을 조밀하게 자라게 했습니다.`,
    formationProcess: '피브카강의 지하 잠입에 의한 거대 수평 터널 굴착 및 초미세 방해석 재결정화',
    observationPoints: ['눈부신 5m 높이의 백색 석순 브릴리언트', '지하 10,000석 규모의 천연 콘서트홀', '동굴 생물 올름(인간물고기)'],
    mapQuery: 'Postojna Cave Slovenia',
    geology: {
      geologicalAge: '중생대 백악기 석회암 (약 1억~7,000만 년 전)',
      rockType: '고순도 층상 석회암',
      tectonicSetting: '디나르 알프스 조산대 크라스 카르스트 고원',
      geomorphicAgent: '피브카강 지하 하천 용식 및 탄산칼슘 침전',
      scale: { lengthKm: 24.3, depthMeters: 115 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 테티스해 탄산염 퇴적', timeframe: '약 1억 년 전', process: '두꺼운 카르스트 고원 석회암 암반 형성', visualKeyFeature: '고원 석회암 지층' },
      { stageNumber: 2, title: '피브카강의 지하 유입', timeframe: '신생대 제3기 말', process: '강물이 암석 틈을 뚫고 지하로 사라지며 거대한 수로 굴착', visualKeyFeature: '지하로 흐르는 급류' },
      { stageNumber: 3, title: '지하 콘서트홀 공동 완성', timeframe: '플라이스토세', process: '수평 터널들이 교차하며 높이 40m의 웅장한 공간 탄생', visualKeyFeature: '거대한 돔형 지하 홀' },
      { stageNumber: 4, title: '동굴 열차 운행 및 세계적 명소', timeframe: '현재', process: '1872년 세계 최초 동굴 철도 개설 후 연간 100만 명 방문', visualKeyFeature: '열차가 달리는 신비의 지하 왕국' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 연중 10℃ 유지 (겉옷 필수)',
      satelliteCheckPoints: ['피브카강이 지하로 빨려 들어가는 동굴 입구 부근', '포스토이나 카르스트 고원의 돌리네 지대'],
      cautionAndConservation: '내부 사진 촬영 시 플래시 사용 금지 (올름 보호)'
    }
  },
  {
    id: 'cave-wd-3',
    terrain: '석회동굴',
    region: 'world',
    placeName: '뉴질랜드 와이토모 반딧불이 동굴 (Waitomo Glowworm Caves)',
    countryOrArea: '뉴질랜드 북섬 와이카토 와이토모',
    tagline: '암흑 속 지하 강을 따라 수만 마리 글로우웜이 은하수처럼 푸른빛을 뿜어내는 석회동굴',
    description: `### 장소 소개 및 선정 이유
뉴질랜드 북섬 와이토모(마오리어로 '물이 스며드는 구멍') 동굴은 지하 강을 보트로 유람하며 천장에 은하수처럼 수놓인 발광 곤충 아라크노캄파 루미노사(Waitomo Glowworm)를 감상하는 환상적인 석회동굴입니다.

### 과학적 형성 과정
약 3,000만 년 전 올리고세 산호와 조개껍데기가 쌓여 굳은 석회암층이 지각 융기 후 빗물과 지하 하천에 녹아 동굴을 형성했습니다.`,
    formationProcess: '올리고세 석회암층의 단층 지하수계 침식 및 반딧불이 동굴 생태계 안착',
    observationPoints: ['천장 가득 푸른빛 은하수를 이루는 반딧불이', '지하 보트 유람 코스', '웅장한 동굴 대성당(Cathedral)'],
    mapQuery: 'Waitomo Glowworm Caves New Zealand',
    geology: {
      geologicalAge: '고진기 올리고세 (약 3,000만 년 전)',
      rockType: '올리고세 테 쿠이티층군 석회암',
      tectonicSetting: '태평양판-호주판 경계 뉴질랜드 북섬 분지',
      geomorphicAgent: '지하수 용식 및 수중 보트 하도 형성',
      scale: { lengthKm: 1.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '올리고세 탄산염 침전', timeframe: '약 3,000만 년 전', process: '바다 밑에서 조개껍데기가 굳어 석회암 형성', visualKeyFeature: '화석이 풍부한 석회암층' },
      { stageNumber: 2, title: '지각 융기와 동굴 통로 개통', timeframe: '수백만 년 전', process: '육지로 솟아오른 후 빗물이 틈새를 녹여 수평 통로 완성', visualKeyFeature: '지하 강이 흐르는 통로' },
      { stageNumber: 3, title: '글로우웜 서식지 정착', timeframe: '현재', process: '습도와 바람이 없는 천연 조건에서 발광 유충들이 은하수 형성', visualKeyFeature: '푸른 별빛으로 가득 찬 동굴 천장' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~4월 남반구 여름철',
      satelliteCheckPoints: ['와이토모 숲속 계곡부에 위치한 동굴 방문자 센터 돔 지붕'],
      cautionAndConservation: '글로우웜 보호를 위해 내부 절대 정숙 및 사진 촬영 금지'
    }
  },
  {
    id: 'cave-wd-4',
    terrain: '석회동굴',
    region: 'world',
    placeName: '베트남 퐁냐케방 항손둥 동굴 (Hang Son Doong)',
    countryOrArea: '베트남 꽝빈성 퐁냐케방 국립공원',
    tagline: '보잉 747 비행기가 날아다닐 수 있는 부피 3,850만㎥, 지구상에서 가장 거대한 단일 동굴 통로',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 항손둥(Hang Son Doong, 산골짜기 동굴)은 단일 통로 높이가 200m, 폭이 150m, 길이가 9km에 달해 40층 고층 빌딩이 통째로 들어가는 압도적인 세계 최대 크기의 석회동굴입니다.

### 과학적 형성 과정
라오스 국경 안남산맥의 거대한 고생대 석회암층을 라오트엉강(Rao Thuong River) 급류가 단층선을 따라 파고들며 수직 붕락을 일으켜 초대형 지하 회랑을 완성했습니다. 천장이 붕괴된 천창(Doline) 아래에는 동굴 속 열대우림 밀림이 번성하고 있습니다.`,
    formationProcess: '안남산맥 단층대를 따른 거대 지하 급류의 고압 수력 굴착 및 천장 대붕괴',
    observationPoints: ['높이 200m의 초대형 동굴 단일 공동', '천창 아래 자라난 동굴 속 지하 정글(Garden of Edam)', '높이 70m의 거대한 석순 베트남의 만리장성'],
    mapQuery: 'Hang Son Doong Vietnam',
    geology: {
      geologicalAge: '고생대 석탄기~페름기 (약 4억~4억 5,000만 년 전)',
      rockType: '치밀질 고순도 탄산염암',
      tectonicSetting: '인도차이나 지괴 안남산맥 단층 카르스트',
      geomorphicAgent: '지하수 급류의 고압 용식 및 천장 싱크홀 붕괴',
      scale: { lengthKm: 9, depthMeters: 200, areaKm2: 38.5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 거대 석회암층 형성', timeframe: '약 4억 년 전', process: '아시아 최고령 석회암 지괴 형성', visualKeyFeature: '거대한 석회암 산맥' },
      { stageNumber: 2, title: '라오트엉강의 지하 굴착', timeframe: '약 300만 년 전', process: '단층 균열을 따라 지하 강물이 수백만 톤씩 흐르며 통로 확장', visualKeyFeature: '고층 빌딩 높이의 지하 회랑' },
      { stageNumber: 3, title: '천창 붕괴와 동굴 정글 탄생', timeframe: '수십만 년 전', process: '약한 천장 두 곳이 무너지며 햇빛이 쏟아져 동굴 내부에 밀림 형성', visualKeyFeature: '동굴 속으로 햇살이 쏟아지는 천창' },
      { stageNumber: 4, title: '세계 최대 동굴 공식 등극', timeframe: '2009년 탐사', process: '영국 동굴연구협회 탐사로 지구 최대 동굴로 공식 확인', visualKeyFeature: '자체 기후와 구름을 품은 거대한 동굴' }
    ],
    fieldGuide: {
      bestVisitingSeason: '1월~8월 건기 (연간 1,000명 한정 엄격 허가제)',
      satelliteCheckPoints: ['원시 밀림 한가운데 커다란 싱크홀 구멍 두 개가 뚫린 천창 지형'],
      cautionAndConservation: '전문 동굴 원정대 동반 4일 트레킹 필수'
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
    mapQuery: '문경 돌리네습지',
    geology: {
      geologicalAge: '고생대 조선누층군 석회암층',
      rockType: '결정질 석회암 및 적갈색 테라로사 점토',
      tectonicSetting: '옥천변성대 문경 탄전 인근 카르스트 구릉',
      geomorphicAgent: '화학적 용식 및 잔류 점토에 의한 포노르(배수구) 폐색',
      scale: { areaKm2: 0.5, depthMeters: 15 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석회암 수직 용식 와지 형성', timeframe: '약 10만 년 전', process: '빗물이 석회암 틈새를 녹이며 접시 모양으로 지표면이 가라앉음', visualKeyFeature: '물이 잘 빠지는 마른 깔때기 구덩이' },
      { stageNumber: 2, title: '테라로사 잔류 점토의 집적', timeframe: '약 1만 년 전', process: '석회암이 다 녹고 남은 붉은 점토가 바닥 배수구(포노르)에 두껍게 쌓임', visualKeyFeature: '바닥을 메우는 끈끈한 붉은 찰흙' },
      { stageNumber: 3, title: '천연 차수벽 완성 및 담수화', timeframe: '수천 년 전', process: '점토가 완벽한 방수포 역할을 하여 빗물이 빠지지 않고 호수를 이룸', visualKeyFeature: '산꼭대기 분지에 물이 차오름' },
      { stageNumber: 4, title: '국가습지 및 천연기념물 보전', timeframe: '현재', process: '세계적으로 희귀한 돌리네 습지로 인정받아 국가 보호구역으로 엄격 관리', visualKeyFeature: '다양한 멸종위기종이 뛰노는 생명의 요람' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄~가을 (야생화 만개 및 습지 생태 탐방로 완비)',
      satelliteCheckPoints: ['굴봉산 정상부 능선 안쪽에 타원형으로 오목하게 파인 녹색 습지 분지', '습지를 둘러싼 울창한 활엽수림'],
      cautionAndConservation: '생태경관보전지역으로 쓰레기 투기 및 동식물 채취 엄금'
    }
  },
  {
    id: 'doline-kr-2',
    terrain: '돌리네',
    region: 'korea',
    placeName: '단양 어상천면 삼태산 돌리네 밭',
    countryOrArea: '대한민국 충청북도 단양군 어상천면 심곡리·임현리',
    tagline: '석회암이 녹아내린 둥근 접시형 분지에 붉은 흙 테라로사로 마늘과 수박을 일구는 전형적 돌리네 군락',
    description: `### 장소 소개 및 선정 이유
단양 어상천면 일대는 산록과 구릉지에 수십 개의 돌리네가 촘촘히 발달한 한국 최대의 집단 돌리네 분지 지대로, 물이 지하로 쏙 빠지는 배수 특성을 활용해 밭농사를 짓는 독특한 카르스트 농경 문화를 보여줍니다.

### 과학적 형성 과정
지표면의 빗물이 석회암의 수직 절리를 녹이면서 지반이 깔때기 모양으로 주저앉았고, 석회암 속 탄산칼슘은 녹아 빠져나가고 불용성 철분과 알루미늄이 산화되어 남은 붉은 토양인 '테라로사(Terra Rossa)'가 기름진 밭을 형성했습니다.`,
    formationProcess: '석회암 절리선의 집중 용식에 따른 다발성 깔때기 함몰와지 및 테라로사 농경지 형성',
    observationPoints: ['움푹 꺼진 접시 모양 밭들', '붉은빛이 선명한 테라로사 토양', '비 온 뒤 빗물이 지하로 빨려 들어가는 배수구(포노르)'],
    mapQuery: '단양 어상천면 삼태산',
    geology: {
      geologicalAge: '고생대 조선누층군 풍촌/화절 석회암층',
      rockType: '석회암 및 테라로사(적색 점토질 토양)',
      tectonicSetting: '단양 카르스트 고원 분지',
      geomorphicAgent: '수직 절리 화학적 용식 및 포노르 배수',
      scale: { areaKm2: 4.5, depthMeters: 20 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 석회암 노출', timeframe: '신생대 융기', process: '석회암 대지가 지표로 노출되며 빗물과 접촉', visualKeyFeature: '석회암 암반 대지' },
      { stageNumber: 2, title: '수직 절리 용식과 함몰', timeframe: '수십만 년간', process: '물이 스며드는 틈마다 둥글게 함몰되어 수많은 돌리네 탄생', visualKeyFeature: '곰보빵처럼 움푹 파인 구릉들' },
      { stageNumber: 3, title: '테라로사 밭농사 정착', timeframe: '조선시대~현재', process: '배수가 잘되는 붉은 흙에 단양 육쪽마늘과 수박 재배', visualKeyFeature: '붉은 돌리네 밭고랑의 풍요로운 풍경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄~초여름 (푸른 농작물과 붉은 흙의 선명한 대비)',
      satelliteCheckPoints: ['삼태산 자락에 둥글둥글한 사발 모양으로 파여 있는 수십 개의 밭 고랑들'],
      cautionAndConservation: '농경지 작물 훼손 주의'
    }
  },
  {
    id: 'doline-kr-3',
    terrain: '돌리네',
    region: 'korea',
    placeName: '정선 화암면 몰운리 돌리네 군락',
    countryOrArea: '대한민국 강원특별자치도 정선군 화암면 몰운리',
    tagline: '해발 600m 산록에 줄지어 발달한 카르스트 깔때기 지형과 화암동굴의 배수 근원지',
    description: `### 장소 소개 및 선정 이유
정선 화암팔경의 하나인 화암동굴의 상부 산지 몰운리에는 지표면에서 빗물을 모아 지하 화암동굴로 공급하는 다수의 돌리네와 우발라(Uvala, 돌리네가 합쳐진 복합 함몰지)가 발달해 있습니다.

### 과학적 형성 과정
석회암 지층의 선구조를 따라 여러 개의 돌리네가 일렬로 형성된 후, 확장되면서 서로 합쳐져 거대한 복합 함몰 와지인 우발라로 진화하는 과정을 잘 보여줍니다.`,
    formationProcess: '인접한 돌리네들의 연속 확장 및 병합에 의한 우발라(Uvala) 진화',
    observationPoints: ['깔때기형 함몰지', '지하 동굴로 연결되는 수직 동굴 입구', '몰운대 절벽 조망'],
    mapQuery: '정선 몰운리',
    geology: {
      geologicalAge: '고생대 조선누층군 막골층',
      rockType: '정선 석회암',
      tectonicSetting: '정선 고원 카르스트 침식면',
      geomorphicAgent: '선구조 단열 용식 및 지하 수직 수계 연결',
      scale: { areaKm2: 1.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석회암 절리 집중 용식', timeframe: '플라이스토세', process: '빗물이 바위 틈을 파내며 독립 돌리네들 형성', visualKeyFeature: '나란히 늘어선 구덩이들' },
      { stageNumber: 2, title: '돌리네 확장 및 병합', timeframe: '수만 년간', process: '구덩이 사이의 턱이 무너지며 거대한 복합 우발라로 성장', visualKeyFeature: '길쭉하고 거대한 함몰 분지' },
      { stageNumber: 3, title: '화암동굴 수계 연결', timeframe: '현재', process: '지표수가 지하 화암동굴로 유입되며 동굴 생성물 성장 촉진', visualKeyFeature: '지하와 지상이 연결된 카르스트 시스템' }
    ],
    fieldGuide: {
      bestVisitingSeason: '가을 단풍철 (화암팔경 드라이브 코스 연계)',
      satelliteCheckPoints: ['화암동굴 상부 산지에 연속으로 늘어선 타원형 와지들'],
      cautionAndConservation: '급경사 산록 안전 주의'
    }
  },
  {
    id: 'doline-wd-1',
    terrain: '돌리네',
    region: 'world',
    placeName: '멕시코 유카탄 이킬 세노테 (Ik Kil Cenote)',
    countryOrArea: '멕시코 유카탄주 티눔 치첸이트사 인근',
    tagline: '수직 26m 지하로 뚫린 에메랄드빛 천연 우물, 마야 문명의 신성한 싱크홀',
    description: `### 장소 소개 및 선정 이유
유카탄 반도의 '세노테(Cenote)'는 거대한 지하 석회동굴의 천장이 붕괴하여 지하수면이 지표에 노출된 거대 붕락 돌리네(Collapse Sinkhole)로, 마야인들이 비의 신 차크에게 제사를 지내던 성소이자 신비로운 천연 수영장입니다.

### 과학적 형성 과정
약 6,600만 년 전 백악기 말 공룡을 멸종시킨 칙술루브 운석 충돌로 유카탄 반도 석회암층에 거대한 원형 균열 고리가 발생했고, 이후 수백만 년 동안 지하수가 석회암을 녹여 거대한 동굴을 만든 뒤 천장이 무너져 내려 수직 원통형 싱크홀이 형성되었습니다.`,
    formationProcess: '운석 충돌 단열선 및 지하수 용식에 따른 거대 동굴 천장 대붕락(Collapse Sinkhole)',
    observationPoints: ['수면으로 쏟아져 내리는 덩굴 줄기 커튼', '수심 48m의 투명한 에메랄드빛 담수', '원형 수직 단애벽'],
    mapQuery: 'Cenote Ik Kil Yucatan Mexico',
    geology: {
      geologicalAge: '신생대 제3기 마이오세~플라이스토세 석회암 (약 1,000만 년 전)',
      rockType: '다공질 생쇄설성 석회암(Coquina & Calcarenite)',
      tectonicSetting: '칙술루브 충돌구(Chicxulub Crater) 림 외곽 카르스트 평원',
      geomorphicAgent: '해수면 변동에 따른 지하 동굴 천장 수력 지지력 상실 및 중력 붕락',
      scale: { depthMeters: 26, elevationMeters: 48 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '운석 충돌과 원형 단열망 발생', timeframe: '약 6,600만 년 전', process: '거대 운석이 유카탄을 강타하며 지하 석회암에 원형 균열 고리 형성', visualKeyFeature: '반경 180km의 거대한 지하 균열선' },
      { stageNumber: 2, title: '지하수 용식과 거대 수중 동굴', timeframe: '플라이스토세 빙하기', process: '빗물이 균열을 따라 흘러 거대한 지하 하천망과 돔형 빈 공간 굴착', visualKeyFeature: '물로 가득 찬 거대한 지하 공동' },
      { stageNumber: 3, title: '해수면 하강과 천장 대붕괴', timeframe: '마지막 빙하기', process: '지하수위가 낮아지며 부력을 잃은 얇은 동굴 천장이 통째로 바닥으로 붕락', visualKeyFeature: '뻥 뚫린 거대한 원형 수직 구멍' },
      { stageNumber: 4, title: '해수면 상승과 신성한 세노테 완성', timeframe: '현재', process: '후빙기 지하수가 차오르며 수심 48m의 환상적인 에메랄드 천연 우물 안착', visualKeyFeature: '하늘에서 빛이 쏟아지는 지하 오아시스' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~4월 멕시코 건기 (정오 무렵 햇빛이 수직으로 수면에 꽂히는 시간대)',
      satelliteCheckPoints: ['치첸이트사 피라미드 남동쪽 평평한 밀림 속에 뚫린 짙푸른 원형 구멍', '반경 수십 km에 걸쳐 운석 충돌구 둘레를 따라 도열한 수천 개의 세노테 점들'],
      cautionAndConservation: '수질 보호를 위해 선크림·로션 샤워 제거 후 입수 필수'
    }
  },
  {
    id: 'doline-wd-2',
    terrain: '돌리네',
    region: 'world',
    placeName: '벨리즈 그레이트 블루홀 (Great Blue Hole)',
    countryOrArea: '벨리즈 라이트하우스 리프 산호초',
    tagline: '직경 318m, 수심 124m, 짙푸른 산호 바다 한가운데 수직으로 입을 벌린 세계 최대 해저 싱크홀',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산이자 자크 쿠스토가 세계 10대 다이빙 명소로 꼽은 '그레이트 블루홀'은 카리브해 산호초 바다 한복판에 짙푸른 눈동자처럼 완벽한 원형으로 뚫려 있는 지구상에서 가장 거대한 해저 싱크홀(돌리네)입니다.

### 과학적 형성 과정
과거 빙하기 당시 육지였던 산호 석회암 대지에 형성된 거대한 석회동굴이 해수면 상승과 함께 천장이 무너져 내린 후, 바닷물에 완전히 잠겨 해저 싱크홀로 진화했습니다. 수심 40m 아래에는 육지 시절 형성된 거대한 종유석들이 그대로 보존되어 있습니다.`,
    formationProcess: '빙하기 육상 석회동굴 붕락 후 후빙기 해수면 상승에 따른 해저 싱크홀(Blue Hole)화',
    observationPoints: ['완벽한 원형의 짙푸른 코발트블루 홀', '수심 40m 절벽에 매달린 8m 거대 종유석', '주변 산호초 띠(Lighthouse Reef)'],
    mapQuery: 'Great Blue Hole Belize',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 빙하기 (약 15만~1만 5,000년 전)',
      rockType: '산호초 기원 생물 쇄설성 석회암',
      tectonicSetting: '카리브판 북서부 산호초 환초(Atoll) 플랫폼',
      geomorphicAgent: '육상 카르스트 용식 천장 붕괴 및 후빙기 해수면 상승 침수',
      scale: { lengthKm: 0.318, depthMeters: 124 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '빙하기 육상 노출과 석회동굴 굴착', timeframe: '약 15만 년 전', process: '해수면이 현재보다 120m 낮아 육지였던 시절 빗물이 거대한 지하 동굴 굴착', visualKeyFeature: '육지 위에 만들어진 거대한 건조 석회동굴' },
      { stageNumber: 2, title: '거대 종유석과 석순 성장', timeframe: '수만 년간', process: '동굴 천장에서 물방울이 떨어지며 최대 8m 길이의 거대한 석회암 종유석 발달', visualKeyFeature: '동굴 천장에 주렁주렁 매달린 고드름 바위' },
      { stageNumber: 3, title: '천장 대붕괴', timeframe: '약 1만 5,000년 전', process: '지진과 침식으로 동굴 천장이 무너지며 직경 318m 거대한 수직 구멍 탄생', visualKeyFeature: '입을 크게 벌린 거대한 깔때기 구덩이' },
      { stageNumber: 4, title: '후빙기 침수와 해저 블루홀 완성', timeframe: '약 1만 년 전', process: '빙하가 녹아 바닷물이 차오르며 동굴이 잠기고 짙푸른 해저 블루홀 안착', visualKeyFeature: '에메랄드 바다 한가운데 빛나는 코발트빛 눈동자' }
    ],
    fieldGuide: {
      bestVisitingSeason: '12월~5월 카리브해 건기 (경비행기 투어로 상공 조망 추천)',
      satelliteCheckPoints: ['에메랄드빛 얕은 산호초 바다 한가운데 완벽한 원형으로 짙은 남색을 띤 블루홀'],
      cautionAndConservation: '수심 40m 이상 다이빙 시 어드밴스드 자격증 필수 및 무감압 한계 준수'
    }
  },
  {
    id: 'doline-wd-3',
    terrain: '돌리네',
    region: 'world',
    placeName: '중국 충칭 샤오자이 톈컹 (Xiaozhai Tiankeng)',
    countryOrArea: '중국 충칭시 펑제현',
    tagline: '깊이 662m, 용적 1억 2,000만㎥, 세계에서 가장 깊고 거대한 천상의 구멍 싱크홀',
    description: `### 장소 소개 및 선정 이유
'하늘의 구멍(天坑, Tiankeng)'이라 불리는 샤오자이 톈컹은 깊이 662m, 상부 직경 626m로 에펠탑 두 개가 들어가고도 남는 지구상에서 가장 거대한 싱크홀입니다.

### 과학적 형성 과정
지하 2.8km 깊이의 디푸 카르스트 지하 하천이 트라이아스기 석회암을 수직과 수평으로 깎아내 거대한 공동을 만든 후, 천장이 단계적으로 대규모 붕괴하여 2단 계단 구조의 수직 거대 싱크홀이 되었습니다.`,
    formationProcess: '거대 지하 하천의 수평 공동 굴착 및 단계적 천장 대붕괴(Tiankeng)',
    observationPoints: ['깊이 662m 수직 단애', '2단 계단형 함몰 구조', '바닥의 독자적 미기후 원시림과 지하 강 출구'],
    mapQuery: 'Xiaozhai Tiankeng Chongqing China',
    geology: {
      geologicalAge: '중생대 트라이아스기 지아링장층 석회암 (약 2억 4,000만 년 전)',
      rockType: '치밀질 고순도 탄산염암',
      tectonicSetting: '양쯔 플랫폼 서북부 충칭 카르스트 고원',
      geomorphicAgent: '디푸 지하 강 급류 용식 및 중력 대붕락',
      scale: { depthMeters: 662, areaKm2: 0.28 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '트라이아스기 석회암 형성', timeframe: '약 2억 4,000만 년 전', process: '두꺼운 해양 탄산염암 퇴적', visualKeyFeature: '거대한 고원 석회암 암반' },
      { stageNumber: 2, title: '지하 거대 급류의 공동 굴착', timeframe: '약 100만 년 전', process: '지하 하천이 거대한 동굴 돔을 파냄', visualKeyFeature: '지하 수백 미터의 거대 공동' },
      { stageNumber: 3, title: '2단계 천장 대붕락', timeframe: '수십만 년 전', process: '상부와 하부 천장이 무너지며 662m 깊이의 수직 구멍 형성', visualKeyFeature: '하늘에서 땅 밑으로 뚫린 거대한 절벽 구멍' },
      { stageNumber: 4, title: '세계 최고 싱크홀 안착', timeframe: '현재', process: '2,800개 계단 트레킹 코스와 고유 식물군 보존', visualKeyFeature: '구름이 피어오르는 천상의 구멍' }
    ],
    fieldGuide: {
      bestVisitingSeason: '4월~10월 (안개가 걷히는 맑은 날 정오)',
      satelliteCheckPoints: ['산악 구릉 한가운데 검고 깊게 뚫린 거대한 원형 함몰지'],
      cautionAndConservation: '2,800개 수직 계단 왕복 체력 안배 필수'
    }
  },
  {
    id: 'doline-wd-4',
    terrain: '돌리네',
    region: 'world',
    placeName: '오만 빔마 싱크홀 (Bimmah Sinkhole)',
    countryOrArea: '오만 무스카트주 하위얏 나즘 공원',
    tagline: '해변 근처 석회암 대지가 주저앉으며 바닷물과 민물이 만난 에메랄드빛 보석 싱크홀',
    description: `### 장소 소개 및 선정 이유
아라비아해 해안선에서 불과 600m 떨어진 사막 평원에 위치한 빔마 싱크홀(현지명 하위얏 나즘, '떨어진 유성')은 지름 50m, 깊이 20m의 석회암 함몰구에 투명한 터키석색 기수호가 찰랑이는 환상적인 해안 카르스트 싱크홀입니다.

### 과학적 형성 과정
지하 석회암층이 용식되면서 천장이 주저앉아 형성되었으며, 인근 바다와 지하 수중 동굴로 연결되어 해수와 담수가 섞인 맑은 기수호(Brackish Lake)를 유지합니다.`,
    formationProcess: '해안 석회암층의 지하 용식 붕락 및 해저 동굴 연결 기수호 형성',
    observationPoints: ['터키석색 투명한 호수', '단면이 노출된 석회암 수평 절벽', '천연 각질 제거 닥터피시 서식'],
    mapQuery: 'Bimmah Sinkhole Oman',
    geology: {
      geologicalAge: '고진기 에오세 석회암 (약 5,000만 년 전)',
      rockType: '층상 탄산염암',
      tectonicSetting: '하자르 산맥 전면 아라비아만 해안 단구',
      geomorphicAgent: '지하수 용식 천장 붕괴 및 해수 지하 침투',
      scale: { depthMeters: 20, lengthKm: 0.07 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '에오세 석회암 퇴적', timeframe: '약 5,000만 년 전', process: '따뜻한 천해에서 탄산염층 형성', visualKeyFeature: '석회암 대지' },
      { stageNumber: 2, title: '지하 공동 형성 및 붕괴', timeframe: '홀로세', process: '지하수가 틈을 넓히다 천장이 푹 꺼짐', visualKeyFeature: '원형 함몰 웅덩이' },
      { stageNumber: 3, title: '바닷물 유입과 에메랄드 호수 완성', timeframe: '현재', process: '지하 통로로 바닷물이 들어와 맑고 잔잔한 천연 풀장 안착', visualKeyFeature: '사막 속 사파이어 보석 같은 싱크홀' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~4월 (기온 25~30℃, 수영 가능)',
      satelliteCheckPoints: ['무스카트-수르 고속도로 해변가 공원 내 타원형 청록색 웅덩이'],
      cautionAndConservation: '수영 시 안전 수칙 준수 및 절벽 다이빙 금지'
    }
  },

  // ==========================================
  // 3. 카렌 (Karren / Limestone Pavement)
  // ==========================================
  {
    id: 'karren-kr-1',
    terrain: '카렌',
    region: 'korea',
    placeName: '문경새재 조령산 카렌 (Karren)',
    countryOrArea: '대한민국 경상북도 문경시 문경읍 상초리 조령산',
    tagline: '빗물이 빗살무늬처럼 파고들어 백색 비석들이 줄지어 선 듯한 천연 석림 카렌',
    description: `### 장소 소개 및 선정 이유
문경새재를 품은 조령산 일대의 석회암 노두는 지표면에 드러난 석회암 암반이 빗물에 씻겨 나가며 날카로운 홈과 고랑을 형성한 한국의 대표적인 카렌(Karren) 지형입니다.

### 과학적 형성 과정
지표면에 노출된 석회암 암석 위로 이산화탄소를 머금은 빗물이 흘러내리면서, 물이 흐르는 길을 따라 수직 홈(Rinnenkarren)과 깊은 틈새(Kluftkarren)를 녹여 파내어 바위가 빗살무늬나 묘비 모양으로 뾰족하게 남았습니다.`,
    formationProcess: '지표 노출 석회암 위 우수의 용식 유하에 따른 미세 홈(Rillen) 및 암맥 삭박',
    observationPoints: ['날카로운 칼날 모양 바위 능선', '빗물이 타고 흐른 수직 홈', '바위 틈 사이의 석회암 고유 식물'],
    mapQuery: '문경새재 조령산',
    geology: {
      geologicalAge: '고생대 캄브리아기~오르도비스기 조선누층군',
      rockType: '결정질 석회암',
      tectonicSetting: '옥천변성대 북동부 소백산육괴 경계부',
      geomorphicAgent: '빗물(우수)의 표면 화학적 세탈 및 차별 용식',
      scale: { areaKm2: 0.8 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석회암 고원 노출', timeframe: '중생대 이후', process: '토양이 씻겨 나가며 순수한 석회암 바위 표면이 비바람에 직접 노출', visualKeyFeature: '매끄러운 백색 암반 표면' },
      { stageNumber: 2, title: '빗물 침식과 미세 홈 굴착', timeframe: '수만 년간', process: '비가 올 때마다 탄산수가 바위 틈을 타고 흘러내리며 좁고 깊은 홈 형성', visualKeyFeature: '바위에 새겨지는 수많은 세로 골짜기' },
      { stageNumber: 3, title: '카렌 지대(석림) 완성', timeframe: '현재', process: '홈이 깊어져 바위들이 마치 비석처럼 제각기 뾰족하게 솟은 카렌 암군 완성', visualKeyFeature: '무덤의 비석처럼 도열한 기암 능선' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄과 가을 조령산 등산 시즌',
      satelliteCheckPoints: ['조령산 등산로 주변에 하얗게 돌출된 석회암 바위 능선선'],
      cautionAndConservation: '카렌 암벽 표면이 날카로우므로 등산 장갑 착용 필수'
    }
  },
  {
    id: 'karren-kr-2',
    terrain: '카렌',
    region: 'korea',
    placeName: '단양 도양리 석회암 카렌지대',
    countryOrArea: '대한민국 충청북도 단양군 매포읍 도양리',
    tagline: '푸른 풀밭 위에 하얀 석회암 묘비들이 솟아오른 듯한 전형적인 묘비형 카렌 군락',
    description: `### 장소 소개 및 선정 이유
단양 매포읍 도양리의 구릉 사면에는 토양이 빗물에 씻겨 내려간 후 땅속에서 용식되던 석회암 기둥들이 지표면에 비석처럼 도드라진 묘비형 카렌(Cemetery Karren)이 대규모로 분포합니다.

### 과학적 형성 과정
과거 토양층 아래에서 산성 부식토와 접촉하여 둥글게 녹았던 석회암 암반이 삼림 벌채와 강우로 겉흙이 침식되어 지표에 노출되면서, 빗물의 직접적인 2차 용식을 받아 날카로운 능선과 홈을 갖춘 카렌이 되었습니다.`,
    formationProcess: '토양 하부 용식(피복 카렌) 후 지표 노출(노출 카렌)로 이어지는 2단계 지형 진화',
    observationPoints: ['묘비처럼 솟은 석회암 바위 군락', '바위 표면의 세로 빗물 고랑', '테라로사 붉은 흙과의 조화'],
    mapQuery: '단양 도양리',
    geology: {
      geologicalAge: '고생대 전기 풍촌 석회암',
      rockType: '고순도 결정질 석회암',
      tectonicSetting: '단양 카르스트 구릉 사면',
      geomorphicAgent: '토양 침식에 따른 피복 카렌의 지표 노출 및 강우 세탈',
      scale: { areaKm2: 0.3 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '토양 속 1차 둥근 용식', timeframe: '수만 년 전', process: '흙 속의 유기산이 석회암 표면을 둥글둥글하게 녹임', visualKeyFeature: '흙 속에 묻힌 바위 요철' },
      { stageNumber: 2, title: '토양 침식과 지표 노출', timeframe: '근대', process: '빗물에 겉흙이 씻겨 나가며 숨겨졌던 바위 기둥들이 지표로 드러남', visualKeyFeature: '풀밭에 솟아오른 바위 머리들' },
      { stageNumber: 3, title: '빗물의 2차 칼날 조각', timeframe: '현재', process: '직접 내리는 비가 홈을 파내어 뾰족한 묘비형 카렌 완성', visualKeyFeature: '비석들이 밭을 이룬 듯한 독특한 풍경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄과 가을',
      satelliteCheckPoints: ['매포읍 남측 구릉지에 흰 점으로 도드라진 석회암 노두 지대'],
      cautionAndConservation: '사유지 및 농경지 경계 준수'
    }
  },
  {
    id: 'karren-kr-3',
    terrain: '카렌',
    region: 'korea',
    placeName: '삼척 덕풍계곡 용소 카렌 노두',
    countryOrArea: '대한민국 강원특별자치도 삼척시 가곡면 풍곡리',
    tagline: '원시 계곡 급류와 암벽이 빚어낸 청정 석회암 하천 침식 카렌',
    description: `### 장소 소개 및 선정 이유
삼척 응봉산 자락의 깊은 오지 덕풍계곡은 맑은 계곡물이 흐르는 암반에 석회암의 화학적 용식과 하천 유수의 물리적 마식이 결합하여 형성된 하천형 플루비오카르스트 카렌 지형입니다.

### 과학적 형성 과정
급류에 실려 온 자갈들이 소용돌이치며 바닥에 포트홀(돌개구멍)을 파냄과 동시에, 석회암 암반 표면을 약산성 계곡물이 녹여 물결 모양의 유수 카렌 홈(Flute)을 조각했습니다.`,
    formationProcess: '하천 마식(Abrasion)과 카르스트 화학 용식의 복합 작용',
    observationPoints: ['물결무늬 하천 카렌 암반', '옥빛 계곡 소와 포트홀', '제1용소·제2용소 기암절벽'],
    mapQuery: '덕풍계곡',
    geology: {
      geologicalAge: '고생대 조선누층군 석회암',
      rockType: '치밀 석회암',
      tectonicSetting: '태백산맥 동사면 응봉산 카르스트 협곡',
      geomorphicAgent: '하천 유수 화학 용식 및 자갈 마모 작용',
      scale: { lengthKm: 6 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석회암 협곡 융기', timeframe: '신생대', process: '지반 융기로 깊은 계곡 형성', visualKeyFeature: '깎아지른 석회암 협곡' },
      { stageNumber: 2, title: '급류의 돌개구멍과 홈 굴착', timeframe: '수만 년간', process: '물이 소용돌이치며 바위에 둥근 구멍과 매끄러운 고랑 형성', visualKeyFeature: '물에 깎인 바위 홈들' },
      { stageNumber: 3, title: '하천 카렌 완성', timeframe: '현재', process: '비취색 계곡물과 어우러진 신비로운 암반 경관 안착', visualKeyFeature: '자연이 빚은 천연 워터파크 바위' }
    ],
    fieldGuide: {
      bestVisitingSeason: '여름철 및 가을 단풍철 트레킹',
      satelliteCheckPoints: ['응봉산 북사면에 깊게 파인 S자형 덕풍계곡선'],
      cautionAndConservation: '비 올 때 급류 범람 위험 있으므로 일기예보 필수 확인'
    }
  },
  {
    id: 'karren-wd-1',
    terrain: '카렌',
    region: 'world',
    placeName: '중국 윈난 스린 석림 (Shilin Stone Forest)',
    countryOrArea: '중국 윈난성 쿤밍시 스린 이족 자치현',
    tagline: '지상 위로 솟구친 수천 개의 돌기둥들이 숲을 이룬 세계 최대의 카렌 지질공원',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 스린(石林)은 '돌로 이루어진 숲'이라는 이름 그대로 350㎢의 광활한 대지 위에 높이 20~50m에 달하는 거대한 석회암 기둥들이 빽빽하게 솟아 있어 전 세계 카렌 지형 중 가장 웅장하고 압도적인 규모를 자랑합니다.

### 과학적 형성 과정
약 2억 7천만 년 전 고생대 페름기 바다 밑에서 퇴적된 두꺼운 석회암층이 융기한 후, 아열대 습윤 기후의 풍부한 빗물과 토양 속 식물 유기산이 석회암의 수직 절리를 수백만 년 동안 집중적으로 녹여 파내면서, 깎이지 않고 남은 바위들이 거대한 돌기둥 숲(석림)을 형성했습니다.`,
    formationProcess: '아열대 습윤 환경에서 수직 절리망을 따른 지하 및 지표 우수의 장기 집중 용식',
    observationPoints: ['아스마(Ashima) 전설 바위', '미로 같은 칼날 카렌 통로', '망봉대(望峰亭)에서 내려다보는 석림 바다'],
    mapQuery: 'Shilin Stone Forest Yunnan China',
    geology: {
      geologicalAge: '고생대 페름기 치샤/마오커우층 (약 2억 7,000만 년 전)',
      rockType: '고순도 괴상 생물쇄설성 석회암 및 백운암',
      tectonicSetting: '양쯔 지괴 남서부 윈구이 고원 카르스트 평원',
      geomorphicAgent: '아열대 산성 우수 및 토양산에 의한 거대 절리 용식 굴착',
      scale: { areaKm2: 350, elevationMeters: 1750, depthMeters: 45 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '페름기 산호초 석회암 퇴적', timeframe: '약 2억 7,000만 년 전', process: '따뜻한 적도 바다에서 두꺼운 탄산염 지층 형성 후 현무암에 덮여 보호', visualKeyFeature: '수백 미터 두께의 석회암 암반' },
      { stageNumber: 2, title: '윈구이 고원 융기와 절리 발생', timeframe: '중생대 히말라야 조산운동', process: '대륙 충돌로 고원이 융기하며 바둑판 모양의 수직 균열망 형성', visualKeyFeature: '격자형으로 금이 간 거대한 석회암 대지' },
      { stageNumber: 3, title: '아열대 폭우의 집중 용식', timeframe: '약 200만 년 전~현재', process: '아열대 몬순 빗물이 틈새를 20~50m 깊이로 녹여 파내어 기둥들만 고립', visualKeyFeature: '바위 숲 사이로 깊게 파인 미로 계곡' },
      { stageNumber: 4, title: '세계자연유산 대석림 완성', timeframe: '현재', process: '칼날처럼 날카롭고 웅장한 수천 개의 회색 바위 기둥들이 숲을 이루는 절경 안착', visualKeyFeature: '지상 최고의 카렌 야외 박물관' }
    ],
    fieldGuide: {
      bestVisitingSeason: '연중 온화 (봄 3~5월 및 가을 9~11월 최적)',
      satelliteCheckPoints: ['쿤밍 남동쪽 위성 사진에서 짙은 흑회색으로 넓게 퍼진 바위 기둥 숲 텍스처', '석림 호수(스린호)를 둘러싼 기암괴석들의 그림자'],
      cautionAndConservation: '미로 같은 통로에서 길을 잃기 쉬우므로 지정 탐방로 준수'
    }
  },
  {
    id: 'karren-wd-2',
    terrain: '카렌',
    region: 'world',
    placeName: '아일랜드 더 버런 (The Burren)',
    countryOrArea: '아일랜드 서부 클래어 카운티',
    tagline: '빙하가 흙을 벗겨내고 빗물이 바둑판처럼 깊은 틈새(Grykes)를 파놓은 300㎢의 거대 석회암 포장도로',
    description: `### 장소 소개 및 선정 이유
'바위투성이 장소'라는 게일어 이름의 더 버런은 빙하기 빙하가 지표면의 토양을 불도저처럼 밀어낸 뒤, 수억 년 된 석회암 암반이 바둑판 모양의 카렌 포장도로(Limestone Pavement)를 이룬 독특한 카르스트 지형입니다.

### 과학적 형성 과정
석탄기 석회암이 수평 암반층(Clints)을 이루고 있으며, 절리를 따라 빗물이 녹아 들어가 깊이 1~2m의 틈새(Grykes)를 바둑판처럼 파놓았습니다. 그늘진 틈새 속에는 북극-고산 식물과 지중해 식물이 함께 자라는 독특한 미기후 생태계가 형성되어 있습니다.`,
    formationProcess: '빙하의 표층 삭박 후 우수에 의한 석회암 포장면 절리 용식(Limestone Pavement)',
    observationPoints: ['바둑판 모양의 거대 석회암 암반 평원', '틈새(Grykes) 속에 숨겨진 야생란', '청동기 고인돌 폴나브론 돌멘'],
    mapQuery: 'The Burren Ireland',
    geology: {
      geologicalAge: '고생대 석탄기 (약 3억 5,000만 년 전)',
      rockType: '수평 층상 탄산염암 (Burren Limestone)',
      tectonicSetting: '유럽 칼레도니아 조산대 외곽 완경사 대지',
      geomorphicAgent: '마지막 빙기 빙식 후 홀로세 우수 용식',
      scale: { areaKm2: 300 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석탄기 산호 바다 퇴적', timeframe: '약 3억 5,000만 년 전', process: '수평으로 넓게 깔린 석회암 지층 형성', visualKeyFeature: '단단한 수평 바위 평원' },
      { stageNumber: 2, title: '빙하의 겉흙 박리', timeframe: '약 1만 5,000년 전', process: '빙하가 지나가며 모든 흙을 깎아내 순수한 암반만 노출', visualKeyFeature: '나무 한 그루 없는 회색 바위 대지' },
      { stageNumber: 3, title: '빗물의 바둑판 홈 파기', timeframe: '현재까지', process: '비가 균열을 녹여 깊은 홈(Grykes)과 평탄면(Clints) 완성', visualKeyFeature: '바둑판처럼 갈라진 거대한 바위 들판' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~8월 (바위 틈 야생화 만개 시기)',
      satelliteCheckPoints: ['골웨이만 남쪽에 회색 줄무늬로 덮인 광활한 평탄 고원'],
      cautionAndConservation: '바위 틈 발 빠짐 주의'
    }
  },
  {
    id: 'karren-wd-3',
    terrain: '카렌',
    region: 'world',
    placeName: '마다가스카르 칭기 드 베마라하 (Tsingy de Bemaraha)',
    countryOrArea: '마다가스카르 서부 멜라키주',
    tagline: '\'맨발로 걸을 수 없는 곳\', 면도날처럼 날카로운 수백만 개의 수직 바위바늘 카렌 숲',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 '칭기(Tsingy)'는 현지어로 '발끝으로만 걸어야 하는 곳'이라는 뜻으로, 수직 100m 높이의 석회암 바늘들이 칼날처럼 빽빽하게 솟아 있는 지구상에서 가장 험준하고 날카로운 침상 카렌(Spike Karren) 지형입니다.

### 과학적 형성 과정
쥐라기 석회암 대지가 열대 폭우와 지하수계에 의해 수평과 수직으로 동시에 용식되었으며, 지표면에서는 강렬한 우수가 바위 상부를 연필심처럼 뾰족하게 깎아내어 접근이 불가능한 천연 요새를 만들었습니다.`,
    formationProcess: '열대 폭우의 극단적 수직 용식 및 지하 동굴 붕락에 의한 첨두형 카렌(Needle Karren)',
    observationPoints: ['면도날처럼 날카로운 수직 바위 바늘 숲', '바위 첨탑 사이를 잇는 아찔한 현수교', '고유종 여우원숭이 시파카'],
    mapQuery: 'Tsingy de Bemaraha Madagascar',
    geology: {
      geologicalAge: '중생대 쥐라기 (약 1억 7,000만 년 전)',
      rockType: '치밀질 미송 석회암',
      tectonicSetting: '모잠비크 해협 동측 마다가스카르 서부 퇴적 분지',
      geomorphicAgent: '열대 몬순 호우의 극한 수직 삭박',
      scale: { areaKm2: 1520, elevationMeters: 100 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '쥐라기 석회암 융기', timeframe: '약 1억 7,000만 년 전', process: '해양 탄산염층이 고원으로 솟아오름', visualKeyFeature: '두터운 고원 암반' },
      { stageNumber: 2, title: '열대 우수와 지하수의 이중 침식', timeframe: '수백만 년간', process: '위에서는 빗물이 바늘로 깎고 아래서는 동굴이 무너짐', visualKeyFeature: '수직으로 깊게 파이는 계곡' },
      { stageNumber: 3, title: '극도의 칼날 칭기 완성', timeframe: '현재', process: '사람이 밟을 수 없는 칼날 바위 숲과 독자적 고유 생태계 보존', visualKeyFeature: '외계 행성 같은 칼날 바늘 숲' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~10월 마다가스카르 건기 (우기철 도로 침수로 접근 불가)',
      satelliteCheckPoints: ['황갈색 서부 마다가스카르 속 회색 톱날 모양 능선 지대'],
      cautionAndConservation: '암벽 등반 하네스 및 안전 헬멧 착용 필수'
    }
  },

  // ==========================================
  // 4. 탑 카르스트 (Tower Karst / Fenglin)
  // ==========================================
  {
    id: 'tower-kr-1',
    terrain: '탑 카르스트',
    region: 'korea',
    placeName: '영월 선돌 (신선암 탑 카르스트 잔구)',
    countryOrArea: '대한민국 강원특별자치도 영월군 영월읍 방절리',
    tagline: '서강 푸른 물길 위에 높이 70m의 수직 석회암 기둥이 칼로 쪼갠 듯 우뚝 솟은 탑 카르스트',
    description: `### 장소 소개 및 선정 이유
명승 제76호인 영월 선돌은 남한강 상류 서강(西江)의 푸른 곡류 물길 옆에 높이 70m의 거대한 석회암 바위 기둥이 탑처럼 수직으로 서 있는 한국의 대표적인 탑 카르스트(Tower Karst) 잔구 지형입니다.

### 과학적 형성 과정
과거 하나의 거대한 석회암 절벽산이었으나, 수직 절리(단열선)를 따라 스며든 빗물이 화학적 용식을 일으켜 틈을 넓히고, 아래로는 서강의 물살이 절벽 하부를 깎아내면서(하식 작용) 본체에서 분리되어 홀로 우뚝 선 수직 바위탑으로 남았습니다.`,
    formationProcess: '수직 절리면의 집중 용식 및 서강 하천의 측방 하식에 의한 탑상 잔구(Residual Tower) 형성',
    observationPoints: ['두 갈래로 쪼개진 70m 수직 암탑', '발아래 굽이쳐 흐르는 서강 사행천', '선돌 전망대 조망'],
    mapQuery: '영월 선돌',
    geology: {
      geologicalAge: '고생대 전기 오르도비스기 영흥층 석회암',
      rockType: '암회색 결정질 석회암 및 돌로마이트',
      tectonicSetting: '옥천대 융기 축 남한강 수계',
      geomorphicAgent: '수직 단열 용식 삭박 및 하천 공격사면 측방 침식',
      scale: { elevationMeters: 70 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '오르도비스기 천해 석회암 형성', timeframe: '약 4억 5,000만 년 전', process: '두꺼운 영흥층 석회암 지층이 퇴적되어 암반 형성', visualKeyFeature: '치밀한 수평 석회암 절벽' },
      { stageNumber: 2, title: '단층 작용과 수직 절리 균열', timeframe: '중생대 지각 변동', process: '서강 물길 옆 절벽에 세로로 깊은 수직 균열 발생', visualKeyFeature: '세로로 금이 간 거대한 바위 절벽' },
      { stageNumber: 3, title: '빗물 용식과 서강의 하식 분리', timeframe: '신생대 플라이스토세', process: '빗물이 세로 틈을 녹여 넓히고 강물이 밑동을 쳐서 암벽 본체와 완전히 분리', visualKeyFeature: '절벽에서 떨어져 나오는 거대한 바위 기둥' },
      { stageNumber: 4, title: '70m 선돌 완성', timeframe: '현재', process: '신선이 노닐었다는 전설과 함께 한 폭의 동양화 같은 명승 선돌 안착', visualKeyFeature: '서강 푸른 물과 어우러진 장엄한 수직 석회암 탑' }
    ],
    fieldGuide: {
      bestVisitingSeason: '가을 단풍철 및 새벽 물안개 피어오르는 시간대',
      satelliteCheckPoints: ['서강이 크게 휘감아 도는 공격사면 절벽 끝자락', '선돌 전망대 데크 시설'],
      cautionAndConservation: '전망대 난간 외 위험 구역 출입 금지'
    }
  },
  {
    id: 'tower-kr-2',
    terrain: '탑 카르스트',
    region: 'korea',
    placeName: '단양 도담삼봉 (수중 탑 카르스트 잔구)',
    countryOrArea: '대한민국 충청북도 단양군 매포읍 하괴리',
    tagline: '남한강 맑은 물 위에 세 개의 석회암 봉우리로 솟아오른 기적의 수중 탑 카르스트 잔구',
    description: `### 장소 소개 및 선정 이유
명승 제44호이자 단양팔경의 제1경인 도담삼봉은 남한강 맑은 물 한가운데 늠름하게 솟아오른 세 개의 석회암 암봉으로, 주변 석회암 대지가 물과 비바람에 다 깎여 나가고 가장 단단한 부분만 남은 한국의 대표적 수중 탑 카르스트 잔구입니다.

### 과학적 형성 과정
고생대 조선누층군 석회암이 남한강의 물살에 의해 침식되고 빗물에 용식되는 과정에서, 차별 침식으로 연약부가 씻겨 나가고 단단한 세 개의 봉우리만 수면 위에 솟아오른 탑 카르스트 형태로 보존되었습니다.`,
    formationProcess: '남한강의 장기적 측방 침식과 화학적 용식에 따른 잔류 암봉(Residual Monadnock) 형성',
    observationPoints: ['장군봉을 중심으로 양옆의 처봉과 첩봉', '봉우리 허리에 형성된 파식 홈과 침식 흔적', '석문(천연 아치)과의 연계'],
    mapQuery: '도담삼봉',
    geology: {
      geologicalAge: '고생대 전기 오르도비스기 영흥층',
      rockType: '결정질 석회암',
      tectonicSetting: '옥천대 단양 남한강 곡류대',
      geomorphicAgent: '하천 측방 침식 및 화학 용식 잔류',
      scale: { elevationMeters: 15 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 석회암 형성', timeframe: '약 4억 5,000만 년 전', process: '두터운 탄산염암 지층 퇴적', visualKeyFeature: '단단한 석회암 암반' },
      { stageNumber: 2, title: '남한강 물길의 주변부 침식', timeframe: '신생대', process: '강물이 주변 연약한 암석을 깎아 평탄화', visualKeyFeature: '강물 속에 드러나는 바위 능선' },
      { stageNumber: 3, title: '세 봉우리의 분리 고립', timeframe: '플라이스토세~현재', process: '가장 단단한 중심부만 세 개의 탑으로 남아 남한강 위에 안착', visualKeyFeature: '물 위에 뜬 그림 같은 세 봉우리' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 연중 (새벽 물안개 및 일몰 조명 연출)',
      satelliteCheckPoints: ['남한강 물줄기 한가운데 솟은 세 개의 암초 지점'],
      cautionAndConservation: '유람선 및 모터보트 탑승 시 구명조끼 필수 착용'
    }
  },
  {
    id: 'tower-kr-3',
    terrain: '탑 카르스트',
    region: 'korea',
    placeName: '영월 청령포 주변 서강 석회암 탑 카르스트 암봉',
    countryOrArea: '대한민국 강원특별자치도 영월군 영월읍 방절리 청령포',
    tagline: '삼면이 강으로 둘러싸인 단종의 유배지 뒤편에 우뚝 솟은 수직 석회암 단애 암봉',
    description: `### 장소 소개 및 선정 이유
단종 유배지로 유명한 영월 청령포의 배후에는 서강의 공격사면 급류가 깎아지른 수직 암벽을 형성하며 솟아오른 웅장한 석회암 탑 카르스트 암봉들이 병풍처럼 둘러서 있습니다.

### 과학적 형성 과정
서강의 심한 곡류 운동으로 바깥쪽 공격사면 하부가 지속적으로 파도와 유수에 깎여 수직 절벽을 형성했고, 빗물의 용식 작용이 더해져 단애면 꼭대기가 첨탑 형태로 조각되었습니다.`,
    formationProcess: '감입곡류 하천의 공격사면 수직 하식 및 절리면 화학 용식',
    observationPoints: ['노산대 수직 석회암 절벽', '굽이도는 서강과 울창한 관음송 숲', '방절리 하안단구와의 대비'],
    mapQuery: '영월 청령포',
    geology: {
      geologicalAge: '고생대 오르도비스기 석회암',
      rockType: '회색 석회암',
      tectonicSetting: '영월 카르스트 분지 서강 유역',
      geomorphicAgent: '하천 공격사면 하식 및 화학 용식',
      scale: { elevationMeters: 80 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석회암층 퇴적', timeframe: '고생대', process: '두꺼운 석회암 암반 형성', visualKeyFeature: '수평 지층' },
      { stageNumber: 2, title: '서강의 굽이침과 하식', timeframe: '신생대', process: '강물이 벽을 치며 80m 수직 절벽 형성', visualKeyFeature: '강을 내려다보는 깎아지른 절벽' },
      { stageNumber: 3, title: '탑상 암봉 완성', timeframe: '현재', process: '역사적 명소와 결합된 자연유산 안착', visualKeyFeature: '솔숲과 푸른 강, 거대한 절벽의 조화' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄과 가을 (도선 배를 타고 입장)',
      satelliteCheckPoints: ['서강이 3면을 감싸고 도는 반도형 지형 배후의 수직 암벽'],
      cautionAndConservation: '문화재보호구역 준수'
    }
  },
  {
    id: 'tower-wd-1',
    terrain: '탑 카르스트',
    region: 'world',
    placeName: '중국 구이린 리강 탑 카르스트 (Guilin Li River Karst)',
    countryOrArea: '중국 광시 좡족 자치구 구이린시~양숴현',
    tagline: '20위안 화폐 배경이자 평원 위에 수만 개의 원뿔형 석회암 탑들이 숲을 이룬 세계 탑 카르스트의 교과서',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 구이린-양숴 카르스트는 맑은 에메랄드빛 리강(漓江)을 따라 솟아오른 수만 개의 수직 석회암 봉우리들이 한 폭의 거대한 수묵화를 이루는 전 세계 탑 카르스트(봉림, 峰林) 지형의 최고봉입니다.

### 과학적 형성 과정
두께 수천 미터의 고생대 순수 석회암층이 지각 융기한 후, 아열대 몬순 기후의 고온 다습한 환경에서 수억 년간 이산화탄소가 풍부한 빗물과 하천수가 암석을 녹여 평평한 침식 평원 위에 홀로 선 수직 탑 카르스트 기둥들을 남겼습니다.`,
    formationProcess: '고온 다습 아열대 기후 하에서 수평 침식 평원화 및 수직 봉림(Fenglin) 잔구화',
    observationPoints: ['20위안 지폐 배경 황포도영(黃布倒影)', '구마화산(九馬畫山) 절벽의 말 모양 줄무늬', '대나무 뗏목 유람'],
    mapQuery: 'Li River Guilin China',
    geology: {
      geologicalAge: '고생대 데본기~석탄기 (약 3억 8,000만~3억 년 전)',
      rockType: '초고순도(탄산칼슘 98% 이상) 탄산염암',
      tectonicSetting: '양쯔 지괴 남부 광시 침강 분지 융기 고원',
      geomorphicAgent: '아열대 극한 화학적 용식 및 리강 하천 수평 삭박',
      scale: { areaKm2: 2500, elevationMeters: 300 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '데본기 초고순도 석회암 퇴적', timeframe: '약 3억 8,000만 년 전', process: '두께 3,000m의 순수한 석회암층이 균질하게 퇴적', visualKeyFeature: '어마어마한 두께의 해저 탄산염 지층' },
      { stageNumber: 2, title: '고원 융기와 봉총(Fengcong) 단계', timeframe: '신생대 제3기', process: '지반 융기 후 초기 용식으로 밑둥이 서로 이어진 원뿔형 봉우리(봉총) 형성', visualKeyFeature: '기저부가 연결된 올록볼록한 산봉우리들' },
      { stageNumber: 3, title: '하천 침식 평원화와 봉림(Fenglin) 진화', timeframe: '플라이스토세~현재', process: '리강 수계가 바닥을 평평하게 깎아내며 밑둥 연결부가 사라지고 독립된 수직 탑(봉림) 완성', visualKeyFeature: '평평한 평야와 강물 위에 우뚝 솟은 수직 기둥들' },
      { stageNumber: 4, title: '천하제일산수 안착', timeframe: '현재', process: '세계자연유산이자 중국 최고의 산수화 풍경으로 전 세계인에게 감동 선사', visualKeyFeature: '강물에 비치는 산 그림자와 가마우지 낚싯배' }
    ],
    fieldGuide: {
      bestVisitingSeason: '4월~10월 (안개 낀 리강 유람의 몽환적 정취)',
      satelliteCheckPoints: ['구이린에서 양숴로 이어지는 푸른 리강 물줄기 주변에 무수히 돋아난 원형 봉우리 그림자들'],
      cautionAndConservation: '뗏목 탑승 시 구명조끼 필수 착용'
    }
  },
  {
    id: 'tower-wd-2',
    terrain: '탑 카르스트',
    region: 'world',
    placeName: '베트남 하롱베이 (Ha Long Bay)',
    countryOrArea: '베트남 꽝닌성 하롱시',
    tagline: '에메랄드빛 바다 위에 1,600여 개의 수직 탑 카르스트 섬들이 떠 있는 세계자연유산의 바다',
    description: `### 장소 소개 및 선정 이유
'용이 내려앉은 만'이라는 뜻의 하롱베이는 1,553㎢의 청록색 바다 위에 각양각색의 수직 석회암 기둥과 섬 1,600여 개가 솟아 있는 지구상에서 가장 장엄한 침수된 해양 탑 카르스트 지형입니다.

### 과학적 형성 과정
약 5억 년에 걸쳐 형성된 두꺼운 석회암 대지가 열대 기후의 빗물에 깎여 육상 탑 카르스트가 된 후, 마지막 빙하기가 끝나며 해수면이 상승하여 계곡이 바닷물에 잠기면서 환상적인 해양 카르스트 군도로 변모했습니다.`,
    formationProcess: '육상 탑 카르스트(봉림) 형성 후 후빙기 해수면 상승에 의한 해양 침수 카르스트화',
    observationPoints: ['키스 바위(투가 바위)', '섬 내부의 승솟 동굴과 석회동굴들', '바다에 둘러싸인 히든 라군'],
    mapQuery: 'Ha Long Bay Vietnam',
    geology: {
      geologicalAge: '고생대 석탄기~페름기 (약 3억 4,000만~2억 5,000만 년 전)',
      rockType: '두꺼운 괴상 탄산염암',
      tectonicSetting: '통킹만 연변부 대륙붕 침강 해안',
      geomorphicAgent: '열대 용식 후 후빙기 해수면 상승(Marine Inundation) 및 조석 파식',
      scale: { areaKm2: 1553, elevationMeters: 100 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 거대 석회암층 형성', timeframe: '약 3억 년 전', process: '두꺼운 석회암 대지 형성', visualKeyFeature: '거대한 고원 지층' },
      { stageNumber: 2, title: '열대 몬순 육상 탑 카르스트 진화', timeframe: '수천만 년간', process: '비바람이 대지를 깎아 구이린처럼 솟은 수천 개의 암봉 완성', visualKeyFeature: '육지에 솟아오른 웅장한 바위탑들' },
      { stageNumber: 3, title: '후빙기 해수면 상승과 바다 침수', timeframe: '약 1만 년 전', process: '바닷물이 골짜기를 채우며 산봉우리들이 바다 위의 섬으로 변모', visualKeyFeature: '바다에 잠기며 섬이 되는 바위산들' },
      { stageNumber: 4, title: '해양 탑 카르스트 완성', timeframe: '현재', process: '파도가 섬 밑동을 깎아 버섯 모양 섬들과 해식동굴을 품은 절경 안착', visualKeyFeature: '푸른 바다 위 수천 개의 기암괴석 섬들' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~12월 및 3월~4월 (쾌적하고 맑은 날씨)',
      satelliteCheckPoints: ['통킹만 북쪽 해안선에 빽빽하게 흩뿌려진 수천 개의 에메랄드빛 섬들'],
      cautionAndConservation: '크루즈 투어 시 환경 규정 준수'
    }
  },
  {
    id: 'tower-wd-3',
    terrain: '탑 카르스트',
    region: 'world',
    placeName: '태국 팡아만 제임스 본드 섬 (Ko Tapu / Phang Nga Bay)',
    countryOrArea: '태국 팡아주 팡아만 국립공원',
    tagline: '영화 <007 황금총을 가진 사나이>의 무대, 바닥이 잘록하게 파인 20m 수직 못 바위',
    description: `### 장소 소개 및 선정 이유
태국 남부 팡아만에 솟은 코 타푸(Ko Tapu, 못 바위)는 1974년 제임스 본드 영화에 등장하여 전 세계에 알려진 기이한 수직 바위섬으로, 위는 넓고 아래는 바닷물 파도에 깎여 못처럼 좁아진 극적인 해양 탑 카르스트입니다.

### 과학적 형성 과정
페름기 석회암이 지각 변동으로 솟은 뒤, 조석 간만의 차로 인해 매일 밀려드는 파도와 해풍이 바위 기저부를 집중적으로 깎아내는 파식 노치(Notch) 작용으로 밑동이 잘록해졌습니다.`,
    formationProcess: '해양 탑 카르스트 기저부의 지속적인 파식 노치 굴착에 따른 역원뿔형 잔구 형성',
    observationPoints: ['못 모양의 20m 수직 기암 코 타푸', '배후의 기울어진 카오 핑 칸 바위', '맹그로브 숲 카약 탐험'],
    mapQuery: 'Ko Tapu James Bond Island Thailand',
    geology: {
      geologicalAge: '고생대 페름기 (약 2억 8,000만 년 전)',
      rockType: '생물 쇄설성 석회암',
      tectonicSetting: '안다만해 팡아만 침강 조간대',
      geomorphicAgent: '조석 파식 노치(Marine Notch) 및 화학적 해수 용식',
      scale: { elevationMeters: 20 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '페름기 석회암 대지 융기', timeframe: '고생대 말', process: '안다만해 연안에 두꺼운 석회암 형성', visualKeyFeature: '거대한 석회암 대지' },
      { stageNumber: 2, title: '침수와 파식 노치 형성', timeframe: '후빙기', process: '바닷물이 섬 기저부를 지속적으로 깎아내며 밑동 축소', visualKeyFeature: '밑동이 좁아지는 바위 기둥' },
      { stageNumber: 3, title: '제임스 본드 섬 안착', timeframe: '현재', process: '위태롭지만 완벽한 균형을 이룬 천연 조각품으로 세계적 인기', visualKeyFeature: '청록빛 바다에 우뚝 선 못 바위' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~4월 안다만해 건기',
      satelliteCheckPoints: ['팡아만 안쪽 에메랄드 만입부에 솟은 기암들'],
      cautionAndConservation: '침식으로 인한 붕괴 위험으로 섬 직접 상륙 금지 (선상 관람)'
    }
  },
  {
    id: 'tower-wd-4',
    terrain: '탑 카르스트',
    region: 'world',
    placeName: '라오스 방비엥 남송강 탑 카르스트 (Vang Vieng Karst Towers)',
    countryOrArea: '라오스 비엔티안주 방비엥',
    tagline: '옥빛 남송강 물길을 따라 병풍처럼 솟아오른 거대한 석회암 봉우리와 블루라군',
    description: `### 장소 소개 및 선정 이유
배낭여행자들의 천국 라오스 방비엥은 잔잔한 남송강(Nam Song River)을 따라 수직으로 치솟은 웅장한 석회암 탑 카르스트 봉우리들과 지하 동굴에서 흘러나온 옥빛 천연 샘 '블루라군'이 어우러진 동남아 최고의 카르스트 명소입니다.

### 과학적 형성 과정
열대 우림의 빗물과 남송강의 하천 침식이 수백만 년 동안 평야를 깎아내며 거대한 바위 기둥들을 남겼고, 봉우리 내부에는 탐남 동굴, 탐짱 동굴 등 풍부한 석회동굴이 형성되었습니다.`,
    formationProcess: '남송강 하천 평탄화 및 석회암 단애의 장기 화학 용식',
    observationPoints: ['남송강 카약에서 바라보는 탑 카르스트 연봉', '에메랄드빛 블루라군 다이빙', '열기구에서 내려다보는 일출 카르스트 파노라마'],
    mapQuery: 'Vang Vieng Laos',
    geology: {
      geologicalAge: '고생대 석탄기~페름기 탄산염암',
      rockType: '결정질 석회암',
      tectonicSetting: '인도차이나 반도 내륙 카르스트 평원',
      geomorphicAgent: '하천 측방 삭박 및 아열대 우수 용식',
      scale: { elevationMeters: 400 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 석회암 퇴적', timeframe: '약 3억 년 전', process: '두꺼운 해양 석회암 지층 고화', visualKeyFeature: '석회암 고원' },
      { stageNumber: 2, title: '남송강의 협곡 삭박', timeframe: '신생대', process: '강물이 평야를 만들며 바위탑들만 남김', visualKeyFeature: '평원에 우뚝 선 바위산들' },
      { stageNumber: 3, title: '블루라군과 동굴 발달', timeframe: '현재', process: '봉우리 기저부에서 투명한 미네랄 용천수가 솟아 명소 탄생', visualKeyFeature: '청옥빛 호수와 거대한 바위산' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~2월 건기 (쾌적하고 맑은 하늘)',
      satelliteCheckPoints: ['남송강을 따라 길게 늘어선 짙은 녹색의 가파른 카르스트 암벽들'],
      cautionAndConservation: '동굴 탐험 시 헤드램프 지참'
    }
  }
];
