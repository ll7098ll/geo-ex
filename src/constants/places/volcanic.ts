import { PlaceInfo } from '../../types';

export const VOLCANIC_PLACES: PlaceInfo[] = [
  // ==========================================
  // 1. 화산 (Volcano)
  // ==========================================
  {
    id: 'volcano-kr-1',
    terrain: '화산',
    region: 'korea',
    placeName: '제주 한라산 백록담',
    countryOrArea: '대한민국 제주특별자치도',
    tagline: '신생대 제4기 현무암 및 조면암 화산 분출로 형성된 거대한 순상화산',
    description: `### 장소 소개 및 선정 이유
한라산(1,947m)은 대한민국 최고봉이자 유네스코 세계자연유산으로 등재된 대표적인 화산체입니다. 정상부에는 분화구 호수인 '백록담'이 자리하며, 화산 활동의 다채로운 양상을 한눈에 보여주는 완만한 순상화산 지형입니다.

### 과학적 형성 과정
한라산은 약 180만 년 전부터 시작된 단계별 화산 활동으로 형성되었습니다. 하부는 점성이 낮은 현무암질 용암이 넓게 퍼져 완만한 순상화산 형태를 이루었고, 이후 정상부에서 점성이 높은 조면암질 용암이 분출하며 종상화산의 돔 구조를 덧붙였습니다. 이후 분화구가 함몰하고 빗물이 고여 백록담이 탄생했습니다.

### 탐험 포인트
- **백록담 화구벽**: 서쪽의 조면암 암벽과 동쪽의 현무암 지층의 대비
- **오름(측화산)**: 산록에 분포하는 360여 개의 기생화산 군락
- **고도별 식생대**: 아열대에서 한대 고산식물에 이르는 수직 생태계`,
    formationProcess: '현무암질 용암 분출로 완만한 산체 형성 후 정상부 조면암 돔 형성 및 화구 함몰',
    observationPoints: ['백록담 화구벽과 화구호', '영실기암의 판상절리', '산록의 기생화산(오름)'],
    mapQuery: '한라산 백록담',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~홀로세 (약 180만~2만 년 전)',
      rockType: '다공질 알칼리 현무암, 조면안산암, 조면암',
      tectonicSetting: '유라시아판 내부 대륙 열점 화산활동',
      geomorphicAgent: '다단계 마그마 분출, 화산 쇄설물 집적, 주빙하 풍화',
      scale: { elevationMeters: 1947, areaKm2: 153.3, depthMeters: 108 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '해저 용암 분출기', timeframe: '약 180만 년 전', process: '초기 해저 균열을 통해 다량의 현무암질 용암이 뿜어져 나와 기저 대지 형성', visualKeyFeature: '수중 베개용암 및 광역 평탄 현무암 지층' },
      { stageNumber: 2, title: '순상 산체 형성기', timeframe: '약 80만~30만 년 전', process: '점성이 낮은 용암이 반복 유출되며 경사 3~5°의 완만한 순상화산체 완성', visualKeyFeature: '방사상으로 퍼진 넓은 용암류 평원' },
      { stageNumber: 3, title: '정상 돔 및 오름 분출', timeframe: '약 10만~2만 년 전', process: '점성 높은 조면암 분출로 백록담 서벽 및 360여 기생화산(오름) 동시 다발 폭발', visualKeyFeature: '원추형 스코리아 콘과 가파른 조면암 돔' },
      { stageNumber: 4, title: '화구 함몰 및 현재 백록담', timeframe: '약 2만 년 전 ~ 현재', process: '중심 화구 함몰과 강수 유입으로 수심 1~4m의 산정 화구호 안착', visualKeyFeature: '원형 분화구와 암벽 병풍 속 담수호' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월(철쭉 개화기) 및 10월(단풍철), 가시거리 확보된 맑은 날',
      satelliteCheckPoints: ['한라산 정상부를 중심으로 방사상으로 뻗은 하천 수계망', '산록에 점점이 흩어진 동심원형 기생화산 오름 군락', '백록담 타원형 분화구와 서벽의 밝은 조면암 암벽'],
      cautionAndConservation: '국립공원 보호구역으로 지정 탐방로 외 출입 금지 및 화산석 채취 엄금'
    }
  },
  {
    id: 'volcano-kr-2',
    terrain: '화산',
    region: 'korea',
    placeName: '제주 산방산 종상화산',
    countryOrArea: '대한민국 제주도 서귀포시 안덕면',
    tagline: '점성이 매우 높은 조면암질 용암이 굳어 솟아오른 거대한 돔형 화산',
    description: `### 장소 소개 및 선정 이유
제주 서남부 해안가에 우뚝 솟은 산방산(395m)은 일반적인 완만한 오름과 달리 종(鐘)을 엎어놓은 듯한 가파른 절벽을 자랑하는 용암돔(종상화산)입니다.

### 과학적 형성 과정
약 80만 년 전, 규산(SiO2) 함량이 높은 조면암질 용암이 화구 밖으로 멀리 흘러가지 못하고 그 자리에서 그대로 솟구치며 굳어 형성되었습니다.

### 탐험 포인트
- **수직 주상절리**: 산방산 사면을 둘러싼 거대한 수직 암벽 기둥
- **산방굴사**: 풍화와 침식으로 형성된 천연 풍화혈(타포니) 동굴
- **용머리해안과의 대비**: 산방산 기저부의 수성화산 쇄설층과의 지질 대비`,
    formationProcess: '점성 높은 조면암질 용암이 화구 주변에 집적되어 굳은 용암돔',
    observationPoints: ['종 모양의 가파른 돔 단면', '풍화혈과 주상절리 절벽', '용머리 응회환과의 대비'],
    mapQuery: '산방산',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 80만 년 전)',
      rockType: '조면안산암 및 조면암',
      tectonicSetting: '제주도 초기 화산활동기 점성 용암 압출',
      geomorphicAgent: '점성 용암 돔 융기 및 해식·풍화 작용',
      scale: { elevationMeters: 395, areaKm2: 1.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '마그마 분화 농축', timeframe: '약 90만 년 전', process: '마그마방 내 분별결정작용으로 규산염이 풍부한 고점성 조면암질 마그마 농축', visualKeyFeature: '지하 마그마 챔버의 압력 축적' },
      { stageNumber: 2, title: '수직 돔 압출 분출', timeframe: '약 80만 년 전', process: '고점성 용암이 지표면을 뚫고 완두콩처럼 천천히 부풀어 오르며 수직 융기', visualKeyFeature: '측면 이동 없이 위로 치솟는 종 모양 돔' },
      { stageNumber: 3, title: '냉각 수축 및 절리 형성', timeframe: '약 75만 년 전', process: '급격한 공기 냉각에 의해 표면에서 중심부로 수직 방향 냉각 수축절리 발달', visualKeyFeature: '수백 미터 높이의 웅장한 수직 기둥 절벽' },
      { stageNumber: 4, title: '해식 및 풍화혈 발달', timeframe: '현재', process: '해풍과 염풍화로 절벽 표면에 타포니와 산방굴사 풍화동굴 형성', visualKeyFeature: '벌집 모양 풍화 구멍과 해안 절애' }
    ],
    fieldGuide: {
      bestVisitingSeason: '연중 관람 가능, 3~4월 유채꽃 개화 시 용머리해안과 연계 추천',
      satelliteCheckPoints: ['평탄한 해안 단구 위에 완두콩처럼 불쑥 솟아오른 둥근 원형 등고선', '사면 전체에 빽빽하게 드리운 가파른 절벽 그림자', '남측 하단부 용머리해안의 갈색 퇴적층과의 접촉선'],
      cautionAndConservation: '천연기념물 제374호로 암벽 등반 금지 및 낙석 주의구역 준수'
    }
  },
  {
    id: 'volcano-kr-3',
    terrain: '화산',
    region: 'korea',
    placeName: '철원 한탄강 용암대지',
    countryOrArea: '대한민국 강원도 철원군',
    tagline: '열하분출한 현무암 용암이 평원을 메워 만든 국내 유일의 내륙 용암대지',
    description: `### 장소 소개 및 선정 이유
철원 한탄강 일대는 화산 분화구가 아닌 지각의 틈(열하)을 따라 대량의 현무암 용암이 솟구쳐 옛 하천 골짜기를 메워 만든 광활한 평탄지입니다.

### 과학적 형성 과정
약 50만~10만 년 전 평강 오리산 일대 열하에서 점성이 낮은 염기성 현무암 용암이 수차례 분출해 구 하도를 메웠고, 이후 한탄강이 이 용암층을 수직으로 깎아내려 주상절리 협곡을 만들었습니다.

### 탐험 포인트
- **고석정 및 송대소**: 현무암 단면과 기반암인 화강암의 부정합 관찰
- **주상절리길**: 한탄강 물길을 따라 수직으로 깎아지른 현무암 협곡`,
    formationProcess: '열하분출된 현무암 용암류의 충진과 이후 하천의 두부침식',
    observationPoints: ['평탄한 현무암 대지', '용암층 단면의 다공질 현무암', '협곡 벽면의 수직 절벽'],
    mapQuery: '철원 한탄강 고석정',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 54만~12만 년 전)',
      rockType: '알칼리 올리빈(감람석) 현무암',
      tectonicSetting: '추가령 구조곡 열하 단층선 분출',
      geomorphicAgent: '열하 용암 홍수 및 하천의 두부침식',
      scale: { elevationMeters: 220, lengthKm: 110 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '추가령 구조곡 열하 분출', timeframe: '약 54만 년 전', process: '평강 오리산 인근 지각 틈새에서 다량의 현무암 용암이 하천 골짜기를 따라 유출', visualKeyFeature: '고(古)한탄강 골짜기를 가득 메우는 용암 호수' },
      { stageNumber: 2, title: '다층 용암대지 고착', timeframe: '약 30만 년 전', process: '수차례 분출된 용암류가 식으면서 두께 30~50m의 철원 평야 용암대지 완성', visualKeyFeature: '산지 사이의 광활한 평탄 곡저면' },
      { stageNumber: 3, title: '냉각 수축 및 주상절리대', timeframe: '약 15만 년 전', process: '용암 내부 열 방출 과정에서 다각형 수직 냉각 절리면 광범위 형성', visualKeyFeature: '수직으로 갈라진 현무암 기둥 단면층' },
      { stageNumber: 4, title: '하천 재침식과 V자 협곡', timeframe: '현재', process: '한탄강 물길이 절리선을 따라 수직 침식하여 깊이 30m 협곡과 폭포 형성', visualKeyFeature: '송대소 부채꼴 주상절리와 옥빛 협곡 하천' }
    ],
    fieldGuide: {
      bestVisitingSeason: '9월~11월 (한탄강 물윗길 및 잔도길 걷기 최적)',
      satelliteCheckPoints: ['주변 산지 사이에 끼어 있는 기형적으로 평평한 철원평야 지형', '평야 한복판을 면도칼로 자른 듯 구불구불 파고 들어간 깊은 한탄강 협곡선', '고석정 일대의 하천 환류 핵'],
      cautionAndConservation: '유네스코 세계지질공원 보호구역 준수'
    }
  },
  {
    id: 'volcano-kr-4',
    terrain: '화산',
    region: 'korea',
    placeName: '제주 성산일출봉 수성화산체',
    countryOrArea: '대한민국 제주도 서귀포시 성산읍',
    tagline: '바닷속 마그마 폭발로 빚어진 유네스코 세계자연유산 수성화산 응회구',
    description: `### 장소 소개 및 선정 이유
성산일출봉(182m)은 얕은 바다 밑에서 분출한 마그마가 차가운 바닷물과 격렬하게 반응하는 수성화산활동(Surtseyan eruption)에 의해 탄생한 세계적인 응회구(Tuff Cone)의 교과서적 지형입니다.

### 과학적 형성 과정
약 5천~7천 년 전, 마그마가 물과 만나 급격히 식어 부서지며 발생한 강력한 수증기 폭발로 화산재가 안개처럼 분출되어 성벽 모양의 원추형 분화구를 형성했습니다.

### 탐험 포인트
- **사발 모양의 거대 분화구**: 직경 600m, 바닥 면적 2.14㎢의 넓은 분화구
- **퇴적 구조 노두**: 파도에 깎인 단면에 선명하게 드러난 화도 쇄설층의 층리`,
    formationProcess: '마그마와 해수의 격렬한 수증기 마그마성 폭발 및 화산재 집적',
    observationPoints: ['성곽 모양의 99개 바위 봉우리', '해식 단면에 노출된 층리 구조', '육계사주(신양해변)'],
    mapQuery: '성산일출봉',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 7천~5천 년 전)',
      rockType: '화산응회암 (Tuff)',
      tectonicSetting: '연안 얕은 바다 해저 수성화산 폭발',
      geomorphicAgent: '수증기 마그마 폭발 및 해식 파랑 침식',
      scale: { elevationMeters: 182, areaKm2: 2.14, depthMeters: 90 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '수중 마그마 수증기 폭발', timeframe: '약 7,000년 전', process: '상승하는 마그마가 천해의 바닷물과 접촉하며 급격한 기화 팽창 폭발 발생', visualKeyFeature: '거대한 버섯구름 화산재 분연주' },
      { stageNumber: 2, title: '화쇄 난류 및 응회구 축적', timeframe: '약 6,000년 전', process: '습한 화산재 쇄설류가 사방으로 흩뿌려지며 안식각보다 가파른 성곽형 분화구 구축', visualKeyFeature: '가파른 경사각(30° 이상)의 거대 사발형 화구' },
      { stageNumber: 3, title: '파랑에 의한 해식애 형성', timeframe: '약 3,000년 전', process: '동해와 남해의 거센 파도가 화산체 동·남측을 지속 침식하여 수직 단애 노출', visualKeyFeature: '화산재 퇴적층리가 드러난 해안 수직 절벽' },
      { stageNumber: 4, title: '육계사주 연결 (토폴로)', timeframe: '현재', process: '침식된 모래가 조류에 실려 제주 본섬과 일출봉 사이를 메워 육계도 완성', visualKeyFeature: '신양 섭지코지로 이어지는 모래톱 길' }
    ],
    fieldGuide: {
      bestVisitingSeason: '일출 시간대(연중) 및 봄철 유채꽃 만개 시기',
      satelliteCheckPoints: ['바다로 툭 튀어나온 완벽한 왕관 형태의 둥근 분화구 림', '서측으로 육지와 연결된 가느다란 모래톱(육계사주)', '동남측 해안 절벽의 부채꼴 침식 단면'],
      cautionAndConservation: '천연보호구역으로 탐방로 엄수'
    }
  },
  {
    id: 'volcano-wd-1',
    terrain: '화산',
    region: 'world',
    placeName: '하와이 킬라우에아 화산',
    countryOrArea: '미국 하와이주 하와이섬 (빅아일랜드)',
    tagline: '태평양 열점(Hotspot) 위에서 끊임없이 끓어오르는 세계 최고의 활화산',
    description: `### 장소 소개 및 선정 이유
하와이 화산국립공원의 킬라우에아는 현무암질 마그마가 만들어내는 유동성 넘치는 용암 호수와 파호이호이 용암을 실시간으로 관찰할 수 있는 전 지구적 화산 연구의 중심지입니다.

### 과학적 형성 과정
태평양판 내부의 고정된 맨틀 열점에서 뿜어져 나온 규산 함량이 낮은 현무암질 마그마가 얇고 넓게 수천 번 겹쳐 흐르며 방패를 엎어놓은 듯한 완만한 순상화산을 구축했습니다.

### 탐험 포인트
- **할레마우마우 분화구**: 분화구 내부에서 분출하는 용암 분수와 화산 가스
- **용암 튜브**: 흘러내린 용암의 표면이 굳고 내부가 빠져나가며 형성된 터널`,
    formationProcess: '열점 현무암질 마그마의 지속적 열하 및 중심 분출에 의한 순상화산 형성',
    observationPoints: ['할레마우마우 칼데라 화구', '신선한 파호이호이 용암 대지', '해안 진입 용암 분기공'],
    mapQuery: 'Kilauea Volcano Hawaii USA',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~현재 진행형 (약 28만 년 전~현재)',
      rockType: '솔레아이트질 현무암 및 피크라이트',
      tectonicSetting: '태평양판 열점(Mantle Plume Hotspot)',
      geomorphicAgent: '현무암 용암류 분출 및 화구 함몰',
      scale: { elevationMeters: 1247, areaKm2: 1430 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '해저 마운드 형성기', timeframe: '약 28만 년 전', process: '태평양 6,000m 심해 바닥에서 베개용암이 누적되며 해저 화산 융기', visualKeyFeature: '원추형 심해 화산 마운드' },
      { stageNumber: 2, title: '해수면 돌파 및 순상 산체', timeframe: '약 10만 년 전', process: '해수면을 뚫고 점성 낮은 용암이 수십 km를 흘러내리며 8° 이하의 완만한 사면 형성', visualKeyFeature: '방패 모양의 거대한 순상화산 지형' },
      { stageNumber: 3, title: '정상 칼데라 함몰', timeframe: '약 1,500년 전', process: '마그마 챔버 급배출로 정상부가 붕괴하며 직경 5km의 거대 칼데라 형성', visualKeyFeature: '칼데라 벽면과 할레마우마우 화구호' },
      { stageNumber: 4, title: '열하대(Rift Zone) 활동', timeframe: '2018년~현재', process: '동부 열하대를 통해 용암이 분출하며 새로운 해안 대지를 바다로 확장', visualKeyFeature: '바다로 흘러드는 붉은 용암과 증기 기둥' }
    ],
    fieldGuide: {
      bestVisitingSeason: '야간 관측 시 분화구 붉은 용암광이 선명한 건기(11월~4월)',
      satelliteCheckPoints: ['킬라우에아 정상의 거대한 할레마우마우 칼데라 함몰지', '동남측 바다를 향해 뻗어나간 검은색 용암 흐름 줄기(Lava Flow Tracks)', '동부 열하대를 따라 늘어선 분석구 크레이터 열선'],
      cautionAndConservation: '아황산가스 농도 경보 및 활성 용암 접근 차단선 필히 엄수'
    }
  },
  {
    id: 'volcano-wd-2',
    terrain: '화산',
    region: 'world',
    placeName: '일본 후지산 (Mount Fuji)',
    countryOrArea: '일본 시즈오카현 / 야마나시현',
    tagline: '완벽한 원추형 대칭미를 자랑하는 일본 최고봉 복합 성층화산',
    description: `### 장소 소개 및 선정 이유
후지산(3,776m)은 유라시아판, 필리핀해판, 북미판 3개의 지각판이 만나는 삼중 접점 부근에 위치한 전형적인 성층화산(Stratovolcano)으로, 세계에서 가장 수려한 대칭 원추형 실루엣을 자랑합니다.

### 과학적 형성 과정
약 10만 년 전부터 고후지 화산 위에 안산암-현무암질 용암과 화산쇄설물이 층층이 번갈아 쌓여(성층) 거대한 원추형 산체를 이루었습니다.

### 탐험 포인트
- **오하치메구리**: 정상 분화구 둘레(직경 800m)를 일주하는 능선길
- **후지 5호**: 용암류가 계곡을 막아 형성된 화산 언색호 군락`,
    formationProcess: '용암류와 화산쇄설물의 교대 분출에 의한 거대 대칭 성층화산 형성',
    observationPoints: ['완벽한 원추형 산록 경사', '정상 화구 림과 분기공', '용암 언색호(가와구치호 등)'],
    mapQuery: 'Mount Fuji Japan',
    geology: {
      geologicalAge: '신생대 제4기 (약 10만 년 전~1707년 호에이 분화)',
      rockType: '현무암 및 현무암질 안산암',
      tectonicSetting: '판 섭입대 3중 합류 지점(Triple Junction)',
      geomorphicAgent: '성층 분출 및 빙하·풍화 침식',
      scale: { elevationMeters: 3776, areaKm2: 1200, depthMeters: 250 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '선고후지 분화기', timeframe: '약 10만 년 전', process: '안산암질 마그마가 분출하여 기초 기반 화산체 형성', visualKeyFeature: '기저 안산암 화산 쇄설층' },
      { stageNumber: 2, title: '고후지 화산기', timeframe: '약 8만~1만 년 전', process: '폭발적 분화로 대량의 화산재와 스코리아를 분출하며 고도 3,000m 도달', visualKeyFeature: '두터운 화산재 퇴적층과 원추형 실루엣' },
      { stageNumber: 3, title: '신후지 화산 활동기', timeframe: '약 1만 년 전~1707년', process: '유동성 현무암 용암류가 사면을 덮으며 매끄러운 완벽한 대칭 사면 완성', visualKeyFeature: '현재의 3,776m 원추형 정상과 호에이 분화구' },
      { stageNumber: 4, title: '휴지기 및 만년설 지형', timeframe: '현재', process: '주빙하 빙식 및 융설수 침식으로 사면에 깊은 협곡(오사와 붕괴지) 발달', visualKeyFeature: '산정 만년설과 서측 거대 붕괴 계곡' }
    ],
    fieldGuide: {
      bestVisitingSeason: '등산 공식 개방 시즌(7월 초~9월 초), 사진 촬영은 가을~겨울 청명한 날',
      satelliteCheckPoints: ['완벽한 동심원 형태의 거대한 화산 원뿔 능선', '남동 사면에 크게 뚫린 1707년 호에이 기생 분화구', '북측 기저부에 반달 모양으로 늘어선 후지 5대 화산호수'],
      cautionAndConservation: '활화산으로 화산 방재 레벨 및 산정 저온·고산병 대비 필수'
    }
  },
  {
    id: 'volcano-wd-3',
    terrain: '화산',
    region: 'world',
    placeName: '이탈리아 베수비오 화산 (Mount Vesuvius)',
    countryOrArea: '이탈리아 캄파니아주 나폴리',
    tagline: '서기 79년 고대 도시 폼페이를 매몰시킨 플리니식 분화의 상징적 복합화산',
    description: `### 장소 소개 및 선정 이유
나폴리만 뒤편에 솟은 베수비오 화산(1,281m)은 서기 79년 폼페이와 헤르쿨라네움을 화산재로 삼킨 인류 역사상 가장 유명한 화산 중 하나로, 외륜산(소마산) 안에 새로운 원추 화산이 자란 복합화산입니다.

### 과학적 형성 과정
아프리카판이 유라시아판 밑으로 섭입하면서 마그마가 생성되었고, 거대한 고대 칼데라 붕괴 이후 그 내부에서 폭발적인 플리니식 분화가 일어나 새로운 원추체가 솟아올랐습니다.

### 탐험 포인트
- **그란 코노(Gran Cono)**: 직경 450m, 깊이 300m의 주 분화구
- **소마산 외륜벽**: 고대 거대 분화로 붕괴된 외벽 능선`,
    formationProcess: '외륜 칼데라 함몰 후 분화구 내부에 새로운 화산원뿔이 재성장한 소마-베수비오 복합 화산',
    observationPoints: ['중심 화구벽의 유황 분기공', '나폴리만을 굽어보는 칼데라 외륜선', '폼페이 유적과의 지형적 연계'],
    mapQuery: 'Mount Vesuvius Italy',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~홀로세 (약 2만 5천 년 전~현재)',
      rockType: '테프라이트, 백류석질 조면안산암',
      tectonicSetting: '아프리카판과 유라시아판 섭입대 캄파니아 화산호',
      geomorphicAgent: '폭발적 플리니식 분화 및 화쇄류(Pyroclastic Flow)',
      scale: { elevationMeters: 1281, areaKm2: 135, depthMeters: 300 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고대 소마 화산기', timeframe: '약 2만 5천 년 전', process: '초기 성층화산 형성 후 거대한 칼데라 붕괴 발생', visualKeyFeature: '반원형 말굽 형태의 거대 외륜산 림' },
      { stageNumber: 2, title: '서기 79년 플리니식 대분화', timeframe: '서기 79년 8월', process: '33km 상공까지 치솟은 화산재 기둥 붕괴로 치명적 화쇄류가 폼페이 매몰', visualKeyFeature: '수 미터 두께의 경석 및 부석층 퇴적' },
      { stageNumber: 3, title: '그란 코노 원추체 성장', timeframe: '중세~1944년', process: '칼데라 바닥에서 지속적인 분화로 새로운 중심 화산 원뿔이 성장', visualKeyFeature: '이중 화산 형태의 복합 화산체 완성' },
      { stageNumber: 4, title: '현재의 분기공 활동', timeframe: '1944년 이후 휴지기', process: '중심 분화구 벽면에서 미세한 유황 가스 분기 지속', visualKeyFeature: '직경 450m의 거대한 깔때기형 화구 단애' }
    ],
    fieldGuide: {
      bestVisitingSeason: '4월~6월 및 9월~10월의 쾌청한 지중해성 기후',
      satelliteCheckPoints: ['말굽 모양의 소마산 북측 능선 안에 안긴 새로운 원추형 화산', '나폴리 시가지와 위험하게 인접한 고밀도 거주 배후 화산 사면', '과거 용암류가 흘러내린 어두운 띠 구조'],
      cautionAndConservation: '전 세계에서 가장 위험한 화산 중 하나로 국립공원 안전 지침 필수'
    }
  },
  {
    id: 'volcano-wd-4',
    terrain: '화산',
    region: 'world',
    placeName: '미국 세인트헬렌스 화산',
    countryOrArea: '미국 워싱턴주 캐스케이드 산맥',
    tagline: '1980년 측면 폭발로 산 정상 400m가 날아간 지구상 최대의 산사태 폭발 화산',
    description: `### 장소 소개 및 선정 이유
세인트헬렌스(2,549m)는 1980년 5월 18일, 마그마 관입으로 부풀어 오른 북측 사면이 무너지며 발생한 거대한 측면 폭발(Lateral Blast)로 산정부 고도가 400m나 낮아지고 거대한 말굽형 분화구가 뚫린 현대 화산학의 살아있는 실험실입니다.

### 과학적 형성 과정
후안데푸카판이 북미판 아래로 섭입하면서 형성된 캐스케이드 화산호의 일원으로, 지하 점성 마그마가 북쪽 사면을 불룩하게 밀어올리다 지진으로 산사태가 일어나며 감압 폭발했습니다.

### 탐험 포인트
- **말굽형 분화구**: 북쪽으로 뻥 뚫린 거대한 절벽 분화구
- **새로운 용암돔**: 분화구 내부에서 자라나는 조면안산암질 용암 돔`,
    formationProcess: '산사태에 따른 급격한 감압으로 발생한 파괴적 측면 폭발 및 함몰',
    observationPoints: ['북쪽으로 열린 말굽형 거대 분화구', '새로 성장한 중심 용암돔', '화쇄류로 쓰러진 숲 흔적'],
    mapQuery: 'Mount St. Helens Washington USA',
    geology: {
      geologicalAge: '신생대 제4기 (약 4만 년 전~1980년 폭발)',
      rockType: '데사이트(석영안산암) 및 안산암',
      tectonicSetting: '캐스케이드 섭입대 화산호(Cascade Volcanic Arc)',
      geomorphicAgent: '측면 폭발, 거대 산사태(Debris Avalanche), 라하르(화산이류)',
      scale: { elevationMeters: 2549, depthMeters: 600, lengthKm: 3.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '대칭 원추화산 완성', timeframe: '1980년 이전', process: '눈 덮인 대칭 성층화산으로 아메리카의 후지산으로 불림', visualKeyFeature: '고도 2,950m의 완벽한 삼각 뿔 형태' },
      { stageNumber: 2, title: '북측 잠복돔 팽창', timeframe: '1980년 3월~5월', process: '마그마 상승으로 북쪽 산비탈이 하루 1.5m씩 옆으로 부풀어 오름', visualKeyFeature: '비대칭으로 거대하게 튀어나온 사면 융기부' },
      { stageNumber: 3, title: '산사태 및 측면 폭발', timeframe: '1980년 5월 18일', process: '규모 5.1 지진으로 산사태 발생, 300도 고온 가스가 시속 480km로 측면 폭발', visualKeyFeature: '산체 상부 400m 증발 및 북측 산림 완전 초토화' },
      { stageNumber: 4, title: '화구 내 돔 및 빙하 형성', timeframe: '현재', process: '그늘진 말굽형 분화구 내부에 새로운 용암돔 성장 및 크레이터 빙하 탄생', visualKeyFeature: '화산 한가운데서 자라나는 얼음과 암석 돔' }
    ],
    fieldGuide: {
      bestVisitingSeason: '존스턴 릿지 관측소가 개방되는 여름철(6월~9월)',
      satelliteCheckPoints: ['북쪽을 향해 거대하게 뜯겨 나간 말굽 모양의 분화구 림', '분화구 북측 터틀 계곡을 따라 펼쳐진 광활한 회색 쇄설토 평원', '분화구 내부 중심부에 돌출한 원형의 신생 용암돔'],
      cautionAndConservation: '국립화산기념물로 지정된 생태계 자연 복원 연구지구'
    }
  },

  // ==========================================
  // 2. 칼데라 (Caldera)
  // ==========================================
  {
    id: 'caldera-kr-1',
    terrain: '칼데라',
    region: 'korea',
    placeName: '백두산 천지 칼데라',
    countryOrArea: '대한민국/북한 백두산 (중국 지린성 접경)',
    tagline: '서기 946년 천년 대분화로 마그마 챔버가 붕괴하며 형성된 아시아 최대 칼데라호',
    description: `### 장소 소개 및 선정 이유
백두산(2,744m) 정상의 천지는 수면 해발 2,189m, 최대 수심 384m에 이르는 거대한 칼데라 호수로, 세계 화산사에서 손꼽히는 폭발적 분화의 결정체입니다.

### 과학적 형성 과정
서기 946년 추정 '밀레니엄 대분화(VEI 7)' 당시 막대한 양의 알칼리 유문암질 마그마가 분출되어 텅 빈 지하 마그마 챔버가 상부의 거대한 무게를 이기지 못하고 함몰하여 분화구 호수를 형성했습니다.

### 탐험 포인트
- **천지 화구벽**: 장군봉 등 16개 기암 봉우리가 둘러싼 칼데라 림
- **장백폭포**: 천지의 유일한 배출구인 달문을 통해 떨어지는 68m 폭포`,
    formationProcess: '초거대 폭발에 따른 마그마방 급배출 및 상부 화산체 함몰 칼데라 형성',
    observationPoints: ['천지 칼데라호', '장백폭포와 달문 배수구', '화구벽 단면의 부석층'],
    mapQuery: '백두산 천지',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (서기 946년 밀레니엄 분화)',
      rockType: '알칼리 유문암질 부석, 코멘다이트, 조면암',
      tectonicSetting: '동아시아 대륙판 내부 열수성 배후 화산활동',
      geomorphicAgent: '초거대 플리니식 분화, 칼데라 함몰, 빙식 침식',
      scale: { elevationMeters: 2744, areaKm2: 9.17, depthMeters: 384 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '기저 현무암 용암대지', timeframe: '약 200만~100만 년 전', process: '다량의 현무암질 용암이 뿜어져 나와 광활한 백두용암대지 구축', visualKeyFeature: '수백 km²에 이르는 완만한 현무암 고원' },
      { stageNumber: 2, title: '중심 조면암 성층화산', timeframe: '약 60만~10만 년 전', process: '중심 화구에서 점성 높은 용암이 솟아 고도 3,000m 이상의 웅장한 원추 화산 형성', visualKeyFeature: '가파른 경사의 거대한 화산 원뿔' },
      { stageNumber: 3, title: '946년 밀레니엄 대분화', timeframe: '서기 946년', process: '화산폭발지수(VEI) 7에 달하는 대분화로 마그마 챔버 붕괴 및 칼데라 함몰', visualKeyFeature: '직경 4.4km의 거대한 타원형 함몰 분지' },
      { stageNumber: 4, title: '천지 화구호 완성', timeframe: '현재', process: '강수와 온천수가 유입되어 저수량 20억 톤의 세계 최고 깊이 칼데라호 형성', visualKeyFeature: '푸른 호수를 둘러싼 16개 톱니바퀴 암벽 능선' }
    ],
    fieldGuide: {
      bestVisitingSeason: '7월~8월 (천지 수면 얼음이 녹고 야생화가 만개하는 시기)',
      satelliteCheckPoints: ['하늘에서 뚜렷하게 식별되는 타원형 천지 수면과 흰 눈', '천지 북측 달문 배수구를 통해 빠져나가는 장백폭포 협곡선', '중국과 북한 국경을 가르는 화구벽 능선선'],
      cautionAndConservation: '고산 지대 강풍 및 기상 급변 대비 보온 의류 필수'
    }
  },
  {
    id: 'caldera-kr-2',
    terrain: '칼데라',
    region: 'korea',
    placeName: '울릉도 나리분지 칼데라',
    countryOrArea: '대한민국 경상북도 울릉군 북면',
    tagline: '해저 2,000m에서 솟아오른 동해 화산섬 정상의 이중 화산 칼데라 분지',
    description: `### 장소 소개 및 선정 이유
나리분지는 동해 심해저에서 솟아오른 울릉도 정상부에 유일하게 존재하는 거대한 평탄 분지로, 외륜산 칼데라 함몰과 그 내부에서 새로 솟아오른 알봉(중앙화구구)을 함께 볼 수 있는 이중화산의 명소입니다.

### 과학적 형성 과정
약 2만 년 전 거대한 폭발과 함께 마그마방이 꺼지며 나리 칼데라가 형성되었고, 이후 칼데라 내부에서 마지막 분화로 점성 높은 조면안산암질 알봉 용암돔이 솟아올랐습니다.

### 탐험 포인트
- **나리분지와 알봉**: 칼데라 바닥 평야와 그 위에 솟은 작은 종 모양의 알봉
- **외륜산 절벽**: 깃대봉, 미륵산 등 분지를 사방으로 에워싼 500m 암벽`,
    formationProcess: '외륜 칼데라 함몰 후 분지 내부에 알봉 용암돔이 재생성된 이중 화산',
    observationPoints: ['평탄한 칼데라 바닥', '알봉 용암돔', '성인봉 외륜산 암벽 병풍'],
    mapQuery: '울릉도 나리분지',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 말기~홀로세 (약 2만~5천 년 전)',
      rockType: '조면암, 조면안산암, 포놀라이트',
      tectonicSetting: '동해 울릉분지 심해저 열점 화산활동',
      geomorphicAgent: '칼데라 함몰 및 중앙화구구 재생성',
      scale: { elevationMeters: 350, areaKm2: 2.0, depthMeters: 500 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '심해 화산섬 형성', timeframe: '약 250만 년 전', process: '동해 수심 2,000m 바닥에서 용암이 분출하여 해수면 위로 우뚝 솟음', visualKeyFeature: '가파른 해식 절벽의 화산섬' },
      { stageNumber: 2, title: '나리 칼데라 대함몰', timeframe: '약 2만 년 전', process: '폭발적 분화로 성인봉 북측 지반이 원형으로 붕괴하여 나리분지 형성', visualKeyFeature: '사방이 절벽으로 둘러싸인 거대한 그릇 분지' },
      { stageNumber: 3, title: '알봉 재생성 분출', timeframe: '약 5천 년 전', process: '칼데라 바닥에서 마지막 용암이 솟아올라 둥근 빵 모양의 알봉(중앙화구구) 축조', visualKeyFeature: '분지 한가운데 자리 잡은 돔 형태의 작은 언덕' },
      { stageNumber: 4, title: '충적 평야 퇴적', timeframe: '현재', process: '외륜산에서 씻겨 내려온 토양이 분지 바닥을 메워 비옥한 평탄 분지 형성', visualKeyFeature: '울릉도 유일의 광활한 농경지 평원' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~6월 신록 및 10월 단풍철 (겨울철은 수 미터 폭설 관측)',
      satelliteCheckPoints: ['가파른 산악 지형 한복판에 타원형으로 폭 꺼진 밝은 녹색 평탄지', '나리분지 남서측에 솟아오른 원형의 알봉 등고선', '분지를 완벽하게 둘러싸고 있는 성인봉 외륜산 병풍선'],
      cautionAndConservation: '울릉도 천연기념물 보존 구역'
    }
  },
  {
    id: 'caldera-wd-1',
    terrain: '칼데라',
    region: 'world',
    placeName: '미국 오리건 크레이터 레이크 (Crater Lake)',
    countryOrArea: '미국 오리건주 캐스케이드 산맥',
    tagline: '7,700년 전 마자마산 붕괴로 탄생한 미국에서 가장 깊고 푸른 칼데라 호수',
    description: `### 장소 소개 및 선정 이유
크레이터 레이크 국립공원의 호수는 수심 594m로 미국에서 가장 깊으며, 외부 하천의 유입 없이 오직 빗물과 눈 녹은 물로만 채워져 전 세계에서 가장 맑고 짙은 잉크빛 사파이어 블루 수면을 자랑합니다.

### 과학적 형성 과정
약 7,700년 전 고도 3,700m의 성층화산이던 마자마산(Mount Mazama)이 폭발하며 마그마방이 비어 산정부가 통째로 붕괴했고, 이후 칼데라 내부에 비저드 아일랜드(Wizard Island) 스코리아 콘이 자라났습니다.

### 탐험 포인트
- **위저드 아일랜드**: 칼데라 수면 위로 솟아오른 원추형 화산섬 마법사의 섬
- **팬텀 쉽(Phantom Ship)**: 호수 위에 유령선처럼 솟아 있는 고대 암석 섬`,
    formationProcess: '마자마 화산의 폭발적 플리니식 분화 후 산체 자중 붕괴 칼데라 형성',
    observationPoints: ['594m 수심의 짙푸른 호면', '위저드 아일랜드 분석구', '600m 높이의 칼데라 림'],
    mapQuery: 'Crater Lake National Park Oregon USA',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 7,700년 전)',
      rockType: '유문암, 데사이트, 안산암',
      tectonicSetting: '캐스케이드 섭입대 화산호',
      geomorphicAgent: '산체 붕괴성 칼데라 함몰 및 강수 집수',
      scale: { elevationMeters: 1883, areaKm2: 53.2, depthMeters: 594 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고대 마자마산 성장', timeframe: '약 40만 년 전', process: '반복된 안산암질 분화로 고도 3,700m의 거대한 복합 성층화산 형성', visualKeyFeature: '캐스케이드 산맥의 우뚝 솟은 빙하 봉우리' },
      { stageNumber: 2, title: '치명적 마자마 분화', timeframe: '약 7,700년 전', process: '세인트헬렌스 분화의 40배가 넘는 유문암질 마그마가 뿜어져 나오며 지반 붕괴', visualKeyFeature: '산 정상부 전체가 지하로 주저앉는 거대 함몰' },
      { stageNumber: 3, title: '호수 내 재분출', timeframe: '약 7,000년 전', process: '칼데라 바닥에서 용암과 스코리아가 분출하여 위저드 아일랜드 형성', visualKeyFeature: '새로 솟아오른 완벽한 원추형 섬' },
      { stageNumber: 4, title: '순수 담수호 완성', timeframe: '현재', process: '연간 수 미터의 눈과 비가 고여 광물질 없는 순수 투명도의 호수 안착', visualKeyFeature: '가시 수심 40m의 짙은 코발트블루 거대 호면' }
    ],
    fieldGuide: {
      bestVisitingSeason: '림 드라이브 도로가 전면 개방되는 여름철(7월~9월)',
      satelliteCheckPoints: ['원형에 가까운 거대한 짙푸른 호수와 가파른 칼데라 절벽 림', '서측 수면에 떠 있는 뚜렷한 원뿔 모양의 위저드 아일랜드', '주변 캐스케이드 산맥의 짙은 녹색 침엽수림과의 대비'],
      cautionAndConservation: '겨울철 폭설로 도로 폐쇄 및 가파른 호수 절벽 접근 엄금'
    }
  },
  {
    id: 'caldera-wd-2',
    terrain: '칼데라',
    region: 'world',
    placeName: '탄자니아 응고롱고로 칼데라 (Ngorongoro Crater)',
    countryOrArea: '탄자니아 아루샤주 동아프리카 지구대',
    tagline: '붕괴되지 않고 그대로 보존된 세계 최대의 미침몰 온전한 칼데라 분지',
    description: `### 장소 소개 및 선정 이유
응고롱고로 칼데라는 면적 260㎢, 깊이 610m의 거대한 분지로, 화산 분화 후 산체가 물에 잠기지 않고 완전히 보존된 전 세계 최대의 건조 칼데라 분지이자 수만 마리의 야생동물이 살아가는 자연의 방주입니다.

### 과학적 형성 과정
약 200만~300만 년 전 킬리만자로산보다 높았을 것으로 추정되는 거대 화산이 폭발하면서 내부 마그마가 빠져나가 산체가 수직으로 붕괴하여 형성되었습니다.

### 탐험 포인트
- **마가디 호수(Lake Magadi)**: 칼데라 바닥에 형성된 플라밍고의 염호
- **자연 울타리 분지**: 600m의 칼데라 절벽에 갇혀 고립 진화한 야생동물 생태계`,
    formationProcess: '초거대 화산의 폭발 후 마그마 챔버 수직 함몰로 형성된 건조형 분지 칼데라',
    observationPoints: ['610m 수직 분지 림', '마가디 소금 호수', '사바나 평원 분지 바닥'],
    mapQuery: 'Ngorongoro Conservation Area Tanzania',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 250만 년 전)',
      rockType: '현무암, 조면암질 현무암',
      tectonicSetting: '동아프리카 열곡대(East African Rift System)',
      geomorphicAgent: '열곡대 장력 화산 활동 및 칼데라 함몰',
      scale: { elevationMeters: 2286, areaKm2: 260, depthMeters: 610 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '거대 성층화산 형성', timeframe: '약 300만 년 전', process: '동아프리카 열곡대를 따라 솟구친 마그마가 고도 5,000m의 대화산 형성', visualKeyFeature: '아프리카 대륙을 굽어보는 거대 화산체' },
      { stageNumber: 2, title: '내부 마그마방 공동화', timeframe: '약 250만 년 전', process: '수백 km³의 용암이 주변으로 유출되며 산체 하부 마그마 지지대 소실', visualKeyFeature: '정상부 균열과 가스 대분출' },
      { stageNumber: 3, title: '수직 자중 함몰', timeframe: '약 240만 년 전', process: '화산 중심부가 거대한 원형 블록 형태로 수직 낙하하며 600m 단애 분지 형성', visualKeyFeature: '직경 20km의 광활한 원형 칼데라 그릇' },
      { stageNumber: 4, title: '자연 생태 분지 안착', timeframe: '현재', process: '벽면에서 흐르는 담수와 바닥의 알칼리 염호가 어우러져 독자적 생태계 구축', visualKeyFeature: '절벽으로 닫힌 사바나 동물 천국' }
    ],
    fieldGuide: {
      bestVisitingSeason: '건기인 6월~10월 (야생동물 관측 및 사파리 차량 진입 최적)',
      satelliteCheckPoints: ['동아프리카 고원 한복판에 새겨진 완벽한 원형의 거대한 분지 그릇', '칼데라 바닥 서남쪽에 하얗게 빛나는 마가디 염호', '칼데라 외곽 림을 따라 빽빽한 산지 운무림'],
      cautionAndConservation: '유네스코 세계유산 및 엄격한 사파리 가이드 동행 필수'
    }
  },

  // ==========================================
  // 3. 주상절리 (Columnar Joint)
  // ==========================================
  {
    id: 'joint-kr-1',
    terrain: '주상절리',
    region: 'korea',
    placeName: '제주 중문·대포해안 주상절리대',
    countryOrArea: '대한민국 제주특별자치도 서귀포시',
    tagline: '신생대 녹하지악 오름 용암이 바다와 만나 굳은 해안 수직 육각기둥 병풍',
    description: `### 장소 소개 및 선정 이유
천연기념물 제443호인 중문·대포 주상절리대는 높이 30~40m, 폭 1km에 걸쳐 해안선을 따라 펼쳐진 국내 최대 규모의 주상절리대로, 신이 정교하게 깎아 만든 듯한 다각형(4~6각형) 돌기둥의 극치를 보여줍니다.

### 과학적 형성 과정
약 25만 년 전 녹하지악 화산에서 분출한 점성 낮은 조면현무암질 용암이 해안으로 흘러들어 바닷물과 접촉하며 표면부터 급격히 냉각·수축되었습니다. 이 과정에서 체적 수축 중심점들을 잇는 인장 균열이 수직으로 발달하여 육각기둥을 형성했습니다.

### 탐험 포인트
- **파식대 위의 기둥 단면**: 파도에 기둥 상부가 잘려나가 벌집 모양으로 드러난 수평 단면
- **해식동과 부딪히는 포말**: 주상절리 틈새로 솟구치는 거대한 파도 물보라`,
    formationProcess: '고온 용암류의 급격한 냉각 수축에 따른 수직 인장 다각형 균열 발달',
    observationPoints: ['4~6각형 수직 기둥 절애', '파도에 깎인 벌집 모양 바닥 단면', '해식애와 부딪히는 파도'],
    mapQuery: '중문 대포 주상절리대',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 25만 년 전)',
      rockType: '조면현무암 (Trachybasalt)',
      tectonicSetting: '제주도 남부 해안 용암 유출',
      geomorphicAgent: '용암 급랭 수축 및 해식 파랑 작용',
      scale: { elevationMeters: 35, lengthKm: 1.0 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '녹하지악 용암 해안 유입', timeframe: '약 25만 년 전', process: '약 1,100℃의 고온 현무암 용암류가 바다로 흘러들어 두꺼운 층을 이룸', visualKeyFeature: '바닷물과 맞닿아 끓어오르는 두터운 용암류' },
      { stageNumber: 2, title: '냉각 중심점 형성 및 수축', timeframe: '냉각 수개월 후', process: '표면 냉각으로 수축 중심점들이 규칙적 육각형 인장 스트레스 그리드 생성', visualKeyFeature: '표면에 그물망처럼 갈라지는 균열선' },
      { stageNumber: 3, title: '수직 절리선 하강 전파', timeframe: '완전 냉각기', process: '용암 내부로 냉각면이 이동함에 따라 균열이 수직 방향으로 전파되어 기둥 분리', visualKeyFeature: '수십 미터 높이의 완벽한 다각형 기둥 군락' },
      { stageNumber: 4, title: '파랑 침식 및 기둥 탈락', timeframe: '현재', process: '거센 해파가 기둥 기저부를 강타하여 절리선을 따라 기둥이 무너지며 수직 단애 완성', visualKeyFeature: '계단식 기둥 절벽과 웅장한 파도 포말' }
    ],
    fieldGuide: {
      bestVisitingSeason: '연중 관람 가능, 만조 시 파도가 기둥에 부딪혀 솟구칠 때 장관',
      satelliteCheckPoints: ['서귀포 해안선을 따라 짙은 검은색으로 각진 톱니 모양 해안선', '기둥 상부가 침식되어 계단처럼 바다로 낮아지는 암초군', '중문 관광단지 남측 곶 지형'],
      cautionAndConservation: '전망 데크에서만 관람 가능하며 암벽 접근 차단'
    }
  },
  {
    id: 'joint-kr-2',
    terrain: '주상절리',
    region: 'korea',
    placeName: '광주 무등산 서석대·입석대',
    countryOrArea: '대한민국 광주광역시 동구 / 전남 화순군',
    tagline: '해발 1,000m 고산 정상부에 솟구친 중생대 백악기 화산폭발의 유산 석풍화 기둥',
    description: `### 장소 소개 및 선정 이유
유네스코 세계지질공원인 무등산의 입석대와 서석대는 바닷가가 아닌 해발 1,000m가 넘는 고산 정상부에 웅장하게 서 있는 주상절리로, 한 변이 1~2m에 달하는 세계 최대급 굵기의 돌기둥들입니다.

### 과학적 형성 과정
약 8,700만 년 전 중생대 백악기 화산 폭발로 분출된 두터운 석영안산암질 화산재와 용암이 천천히 식으며 거대한 기둥을 형성했고, 이후 수천만 년 동안 융기와 주빙하 환경의 동결-융해 풍화로 주변 토양이 씻겨 나가며 단단한 기둥 노두만 지표에 우뚝 드러났습니다.

### 탐험 포인트
- **서석대(1,100m)**: 병풍을 펼쳐놓은 듯 석양빛에 수정처럼 빛나는 거대 암벽
- **입석대(1,017m)**: 신전의 석조 신전 기둥처럼 독립되어 서 있는 거대 석주들
- **너덜덜(덕산너덜)**: 주빙하기에 기둥들이 무너져 흘러내린 돌강(암괴류)`,
    formationProcess: '백악기 산성 화산암 냉각 절리 형성 후 주빙하 동결융해 풍화 노출',
    observationPoints: ['입석대 거대 독립 석주', '서석대 주상절리 병풍 암벽', '산록 너덜지대(Felsenmeer)'],
    mapQuery: '무등산 입석대',
    geology: {
      geologicalAge: '중생대 백악기 (약 8,700만 년 전)',
      rockType: '무등산 석영안산암 (Dacite)',
      tectonicSetting: '고태평양판 섭입에 따른 한반도 남부 백악기 대륙호 화산활동',
      geomorphicAgent: '화산암 냉각 수축 절리 및 제4기 주빙하 풍화 침식',
      scale: { elevationMeters: 1017, depthMeters: 40 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 칼데라 분화', timeframe: '약 8,700만 년 전', process: '석영안산암질 화쇄류가 두껍게 쌓이며 화산 함몰체 내부를 가득 메움', visualKeyFeature: '수백 미터 두께의 고온 마그마성 퇴적층' },
      { stageNumber: 2, title: '지하 서냉 및 초대형 기둥 형성', timeframe: '분화 직후', process: '지하 깊은 곳에서 수만 년에 걸쳐 천천히 식으며 기둥 직경 1~2m의 거대 절리 생성', visualKeyFeature: '암체 내부에 규칙적으로 발달한 수직 메가 기둥' },
      { stageNumber: 3, title: '지각 융기 및 침식 노출', timeframe: '신생대 제3기', process: '한반도 융기 운동과 침식 작용으로 상부 퇴적층이 벗겨지며 기둥 노출', visualKeyFeature: '산마루 능선에 서서히 드러나는 암괴' },
      { stageNumber: 4, title: '빙기 주빙하 풍화', timeframe: '플라이스토세 빙기~현재', process: '혹한기 동결 파쇄로 기둥들이 쪼개져 굴러떨어지며 기둥벽과 너덜겅 완성', visualKeyFeature: '산비탈을 타고 흐르는 거대한 돌강 너덜 지대' }
    ],
    fieldGuide: {
      bestVisitingSeason: '늦가을 억새철(10~11월) 및 겨울철 상고대 설경 시기',
      satelliteCheckPoints: ['무등산 정상부 천왕봉 서남측 능선에 돌출된 회백색 수직 암벽', '산비탈을 따라 부채꼴로 넓게 쏟아져 내린 회색 너덜겅(덕산너덜) 군락', '중머리재에서 이어지는 뚜렷한 등산 능선로'],
      cautionAndConservation: '천연기념물 제465호로 암석 훼손 및 등반 금지'
    }
  },
  {
    id: 'joint-wd-1',
    terrain: '주상절리',
    region: 'world',
    placeName: '북아일랜드 자이언트 코즈웨이 (Giant\'s Causeway)',
    countryOrArea: '영국 북아일랜드 앤트림주',
    tagline: '4만여 개의 정육각형 현무암 기둥이 바다로 뻗어나가는 거인의 둑길',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 자이언트 코즈웨이는 아일랜드 전설 속 거인 핀 맥쿨이 스코틀랜드로 건너가기 위해 징검다리를 놓았다는 설화가 깃든 곳으로, 약 4만 개의 거의 완벽한 정육각형 현무암 돌기둥들이 바다를 향해 계단식으로 뻗어 있습니다.

### 과학적 형성 과정
약 6,000만 년 전 북대서양이 열리며 발생한 고신생대 화산 활동으로 두꺼운 현무암 용암 대지가 만들어졌고, 용암이 냉각되면서 완벽한 기하학적 수축 절리를 형성했습니다.

### 탐험 포인트
- **거인의 오르간**: 절벽에 수직으로 12m 높이로 늘어선 파이프 오르간 모양의 절리
- **소원의 의자(Wishing Chair)**: 기둥들이 의자 형태로 깎여나간 천연 좌석`,
    formationProcess: '북대서양 개열기 열하 용암 분출 및 극도로 규칙적인 다각형 냉각 절리 발달',
    observationPoints: ['바다로 뻗은 4만여 개의 기둥 둑길', '거인의 오르간 기둥벽', '해안 절애 단면'],
    mapQuery: 'Giants Causeway Northern Ireland UK',
    geology: {
      geologicalAge: '고신생대 팔레오세 (약 6,000만~5,500만 년 전)',
      rockType: '솔레아이트질 현무암',
      tectonicSetting: '북대서양 마그마 화성구역(NAIP) 지각 분열',
      geomorphicAgent: '용암 호수 서냉 및 북대서양 거친 해파 침식',
      scale: { elevationMeters: 28, areaKm2: 0.7, lengthKm: 4.8 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '북대서양 지각 열개 분출', timeframe: '약 6,000만 년 전', process: '유럽과 그린란드가 분리되면서 지각 틈새로 막대한 현무암 용암 유출', visualKeyFeature: '앤트림 고원을 덮은 거대한 용암 홍수' },
      { stageNumber: 2, title: '용암 계곡 정체 및 냉각', timeframe: '분출 직후', process: '옛 하천 골짜기에 갇힌 두께 30m 이상의 용암 호수가 천천히 균일 냉각', visualKeyFeature: '극도의 기하학적 균일성을 가진 인장 응력망' },
      { stageNumber: 3, title: '수직 육각 기둥 분할', timeframe: '냉각 수천 년 후', process: '기둥 지름 약 45cm의 완벽한 4만 개 육각 석주로 분할 완성', visualKeyFeature: '밀집된 연필 다발 형태의 현무암 기둥 블록' },
      { stageNumber: 4, title: '빙하 및 대서양 파랑 침식', timeframe: '현재', process: '빙하기 빙하의 찰과 및 거친 파도가 표면을 깎아 평탄한 디딤돌 둑길 완성', visualKeyFeature: '바다 속으로 잠겨 들어가는 계단형 기둥 도로' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 (아일랜드 해안의 바람이 비교적 잔잔하고 해가 긴 시기)',
      satelliteCheckPoints: ['앤트림 해안 절벽 기저부에서 바다로 혓바닥처럼 튀어나온 어두운 암석 둑길', '절벽 능선을 따라 둥글게 파인 원형 만입부들(Amphitheatres)', '절벽 중턱에 띠 모양으로 드러난 붉은색 고토양 라테라이트 층'],
      cautionAndConservation: '젖은 기둥 표면 미끄럼 주의 및 너울성 파도 경계'
    }
  },
  {
    id: 'joint-wd-2',
    terrain: '주상절리',
    region: 'world',
    placeName: '미국 와이오밍 데빌스타워 (Devils Tower)',
    countryOrArea: '미국 와이오밍주 블랙힐스',
    tagline: '평원 위로 솟아오른 386m의 거대한 외계 신전 같은 화성암 주상절리 암주',
    description: `### 장소 소개 및 선정 이유
미국 최초의 국립기념물(1906년 지정)이자 스티븐 스필버그의 영화 '미지와의 조우'의 배경으로 유명한 데빌스타워는 벨푸어슈 강 평원 위로 386m(해발 1,559m) 수직으로 솟구친 거대한 주상절리 화산경(Volcanic Neck)입니다.

### 과학적 형성 과정
약 5,000만 년 전 고신생대 에오세에 지하 퇴적암층을 뚫고 관입한 마그마가 굳어 형성되었으며, 이후 주변의 무른 사암과 셰일이 수천만 년에 걸쳐 침식되어 씻겨 나간 뒤 단단한 주상절리 기둥 덩어리만 우뚝 남았습니다.

### 탐험 포인트
- **초대형 주상절리 기둥**: 폭 2~3m에 달하는 수백 개의 거대한 수직 기둥 홈
- **기저부 너덜 사면(Talus Slope)**: 떨어진 기둥 암괴들이 산기슭을 덮은 붕괴 사면`,
    formationProcess: '지하 암주 마그마 관입 후 주변 퇴적암층의 차별 침식으로 중심 절리 암주 잔존',
    observationPoints: ['수직 386m 기둥 암벽', '기둥 붕락 테일러스 사면', '기저부 수평 지층과의 부정합'],
    mapQuery: 'Devils Tower National Monument Wyoming USA',
    geology: {
      geologicalAge: '고신생대 에오세 (약 5,000만~4,050만 년 전)',
      rockType: '포놀라이트 반암 (Phonolite Porphyry)',
      tectonicSetting: '라라미드 조산운동기 대륙 내부 마그마 관입',
      geomorphicAgent: '차별 침식(Differential Erosion) 및 절리 붕락',
      scale: { elevationMeters: 1559, depthMeters: 386 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '마그마 지하 관입', timeframe: '약 5,000만 년 전', process: '퇴적암 지하 2~3km 깊이로 포놀라이트 마그마가 돔 형태로 관입', visualKeyFeature: '지표 아래 숨겨진 마그마 덩어리' },
      { stageNumber: 2, title: '냉각 수축 기둥 형성', timeframe: '냉각기', process: '마그마가 굳으면서 기둥 폭 3m에 이르는 거대한 수직 절리면 발달', visualKeyFeature: '지하에 묻힌 거대한 세로줄 원통 암체' },
      { stageNumber: 3, title: '광역 퇴적암 차별 침식', timeframe: '지난 수천만 년간', process: '비바람과 벨푸어슈 강이 주변의 연약한 퇴적암을 모두 깎아 운반', visualKeyFeature: '평평한 대지 위로 서서히 드러나는 거대 탑' },
      { stageNumber: 4, title: '풍화 탈락 및 테일러스', timeframe: '현재', process: '동결 풍화로 기둥들이 외곽부터 하나씩 무너져 기슭에 테일러스 형성', visualKeyFeature: '수직 절벽 암주와 기슭의 암괴 사면' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~6월 및 9월~10월 (여름철 번개 폭풍 및 고온 회피)',
      satelliteCheckPoints: ['완만한 평원 한가운데 면도날처럼 튀어나온 둥근 원통형 거대 바위 기둥', '바위 기둥 주변으로 동심원 형태로 쏟아져 내린 회백색 테일러스 너덜 지대', '기둥 서측을 굽이쳐 흐르는 벨푸어슈 하천'],
      cautionAndConservation: '원주민 신성 구역(6월 암벽 등반 자제 기간) 및 방울뱀 주의'
    }
  },

  // ==========================================
  // 4. 용암동굴 (Lava Tube)
  // ==========================================
  {
    id: 'lavatube-kr-1',
    terrain: '용암동굴',
    region: 'korea',
    placeName: '제주 거문오름 용암동굴계 (만장굴)',
    countryOrArea: '대한민국 제주특별자치도 제주시 구좌읍',
    tagline: '유네스코 세계자연유산으로 등재된 총연장 7.4km의 세계 최상급 용암 튜브',
    description: `### 장소 소개 및 선정 이유
만장굴은 거문오름에서 분출한 현무암 용암류가 바다로 흘러가면서 만든 거대한 지하 용암동굴로, 폭 최대 23m, 높이 최대 30m에 이르며 세계적으로도 동굴 내부 구조가 가장 완벽하게 보존된 동굴입니다.

### 과학적 형성 과정
약 20만 년 전, 점성이 낮은 현무암 용암이 흐를 때 공기와 맞닿은 겉 표면은 먼저 식어 굳어 단단한 지붕(용암 껍질)을 이루었고, 내부의 뜨거운 용암은 보온된 채 터널 속을 계속 흘러 빠져나가 텅 빈 지하 통로를 남겼습니다.

### 탐험 포인트
- **용암석주(Lava Column)**: 천장에서 떨어진 용암이 바닥에 쌓여 기둥을 이룬 높이 7.6m의 세계 최대 용암석주
- **용암유선(Lava Flow Lines)**: 용암이 흐르면서 벽면에 남긴 물결 모양의 수위 자국
- **용암발가락**: 용암이 흐르다가 굳어 발가락 모양을 띤 구조`,
    formationProcess: '표면 냉각 고화 후 내부 잔류 용암 배출에 의한 지하 터널형 공동 형성',
    observationPoints: ['7.6m 높이의 용암석주', '동굴 벽면의 다층 용암유선', '용암종유와 용암산호'],
    mapQuery: '만장굴',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 20만 년 전)',
      rockType: '다공질 알칼리 올리빈 현무암',
      tectonicSetting: '거문오름 기생화산 단열 분출',
      geomorphicAgent: '용암류 내부 열 전달 차단 및 중력 배출',
      scale: { lengthKm: 7.4, depthMeters: 30 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '거문오름 대량 용암 분출', timeframe: '약 20만 년 전', process: '거문오름 분화구에서 1,150℃의 파호이호이 용암이 완만한 사면을 따라 바다로 돌진', visualKeyFeature: '지표면을 뒤덮고 흘러가는 거대한 용암의 강' },
      { stageNumber: 2, title: '표면 냉각 지붕 형성', timeframe: '분출 중반', process: '공기에 노출된 상층부가 먼저 굳어 천장 튜브를 형성하여 내부 열 손실 차단', visualKeyFeature: '지표는 굳었으나 지하에서 콸콸 흐르는 용암 터널' },
      { stageNumber: 3, title: '마그마 공급 중단 및 배출', timeframe: '분출 말기', process: '화구 마그마 공급이 끊기자 튜브 내부의 액체 용암이 경사를 타고 모두 바다로 유출', visualKeyFeature: '내부가 비어버린 거대한 원통형 지하 동굴' },
      { stageNumber: 4, title: '2차 구조물 및 천석 붕락', timeframe: '현재', process: '천장에서 떨어지는 용암 방울로 종유석이 굳고, 일부 천장이 무너져 입구 개구부 형성', visualKeyFeature: '7.6m 돌기둥 석주와 신비로운 동굴 내부' }
    ],
    fieldGuide: {
      bestVisitingSeason: '연중 내부 온도 11~15℃ 유지 (여름철 피서 및 겨울철 온난)',
      satelliteCheckPoints: ['거문오름에서 김녕 해안까지 이어지는 선형의 붕괴 도랑 궤적', '동굴 천장이 무너져 형성된 입구 개구부 숲 구멍들', '해안가 만장굴-김녕굴-당처물굴로 이어지는 지형적 일직선 연장축'],
      cautionAndConservation: '천연기념물 제98호로 낙수 대비 미끄럼 방지화 착용'
    }
  },
  {
    id: 'lavatube-wd-1',
    terrain: '용암동굴',
    region: 'world',
    placeName: '미국 하와이 카주무라 동굴 (Kazumura Cave)',
    countryOrArea: '미국 하와이주 하와이섬 (빅아일랜드)',
    tagline: '총연장 65.5km, 낙차 1,100m를 자랑하는 지구상에서 가장 길고 깊은 용암동굴',
    description: `### 장소 소개 및 선정 이유
하와이 빅아일랜드 킬라우에아 화산 동측 사면에 발달한 카주무라 동굴은 총길이 65.5km, 수직 고저차 1,101m로 지구상에서 가장 길고, 가장 깊으며, 가장 연속적인 매머드급 용암 튜브 시스템입니다.

### 과학적 형성 과정
약 500년 전 킬라우에아의 아이랄라(ʻAilāʻau) 용암 분출 당시 수십 년 동안 지속적으로 흘러내린 파호이호이 현무암 용암류가 사면을 타고 바다로 이어지며 정교한 다층 튜브 네트워크를 완성했습니다.

### 탐험 포인트
- **다층 튜브 갤러리**: 복층 터널 형태로 층층이 연결된 수직 용암 폭포
- **용암 펄(Lava Pearls)**: 용암 방울이 굴러다니며 동심원으로 굳은 희귀 구조`,
    formationProcess: '킬라우에아 화산 장기 지속 파호이호이 용암류의 중력 사면 다층 튜브화',
    observationPoints: ['용암 폭포 수직 단차', '매끄러운 동굴 내벽 유선', '다층 연결 통로'],
    mapQuery: 'Kazumura Cave Hawaii USA',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 500년 전, 서기 15세기경)',
      rockType: '파호이호이 현무암',
      tectonicSetting: '하와이 열점 화산활동',
      geomorphicAgent: '중력 사면 용암 배출 및 튜브 층위 분할',
      scale: { lengthKm: 65.5, depthMeters: 1101 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '아이랄라 장기 용암 분출', timeframe: '서기 1400년대', process: '킬라우에아 화구에서 수십 년간 끊김 없이 파호이호이 용암 분출', visualKeyFeature: '동쪽 바다를 향해 흐르는 거대한 용암 강' },
      { stageNumber: 2, title: '다중 튜브 루핑(Roofing)', timeframe: '분출 10년 후', process: '용암 표면이 굳으면서 지붕을 만들고 내부에서 새로운 침식으로 하층 튜브 굴착', visualKeyFeature: '2층, 3층으로 깊어지는 지하 용암 파이프' },
      { stageNumber: 3, title: '용암 폭포 및 협곡화', timeframe: '분출 30년 후', process: '경사 급변 구간에서 용암이 폭포처럼 떨어지며 수직 단차 15m 공동 형성', visualKeyFeature: '동굴 내부의 거대한 수직 용암 폭포 흔적' },
      { stageNumber: 4, title: '냉각 고착 및 천창 개구', timeframe: '현재', process: '용암이 완전히 배출된 뒤 열대 우림 지하에 안정적인 거대 동굴망 안착', visualKeyFeature: '고사리 넝쿨이 드리운 천창 입구와 지하 동굴' }
    ],
    fieldGuide: {
      bestVisitingSeason: '전문 동굴 가이드 투어를 통한 사전 예약 필수',
      satelliteCheckPoints: ['킬라우에아 화산 정상부에서 해안 힐로 방향으로 완만하게 흐르는 숲 사면', '우거진 정글 사이에 점점이 뚫려 있는 작은 원형 천창(Skylight) 구멍들', '사면 경사를 따른 완벽한 일직선 지형 경사선'],
      cautionAndConservation: '전 구간 비공개 보호구역으로 사유지 침범 금지 및 안전장비 착용 필수'
    }
  },

  // ==========================================
  // 5. 단층 산맥 (Fault Mountain)
  // ==========================================
  {
    id: 'fault-kr-1',
    terrain: '단층 산맥',
    region: 'korea',
    placeName: '태백산맥 동해안 단층애 (경동지괴)',
    countryOrArea: '대한민국 강원도 강릉시 ~ 동해시 ~ 삼척시 일대',
    tagline: '동쪽은 깎아지른 수직 단애 절벽, 서쪽은 완만한 사면을 이루는 한반도의 척추',
    description: `### 장소 소개 및 선정 이유
태백산맥은 한반도의 비대칭 융기 운동을 대표하는 전형적인 경동지괴(Tilted Block) 단층 산맥입니다. 동해안 쪽은 단층선을 따라 수직으로 깎아지른 가파른 단층애(Fault Scarp)를 형성하고, 서쪽은 완만하게 기울어진 비대칭 산맥 단면을 보여줍니다.

### 과학적 형성 과정
신생대 제3기 마이오세(약 2,300만~1,500만 년 전) 동해가 열리면서 발생한 지각 인장과 이후 이어진 동서 압축 응력으로 인해 한반도 동측 지괴가 비대칭으로 높게 솟아올랐습니다(불국사 변형 운동).

### 탐험 포인트
- **대관령 고갯길**: 강릉 해안 평지에서 해발 832m 고위평탄면으로 급상승하는 단애면
- **고위평탄면(대관령 풍력발전단지)**: 산 정상부에 보존된 과거의 옛 침식 평원`,
    formationProcess: '동해 확장과 관련된 비대칭 융기(경동지괴 운동) 및 동측 정단층애 형성',
    observationPoints: ['동해안 급경사 단층애', '대관령 정상부 고위평탄면', '동서 비대칭 사면'],
    mapQuery: '대관령 옛길',
    geology: {
      geologicalAge: '신생대 제3기 마이오세~플라이오세 (약 2,300만~500만 년 전)',
      rockType: '선캄브리아기 편마암, 고생대 퇴적암, 화강암',
      tectonicSetting: '동해 배후분지 확장에 따른 한반도 동부 융기',
      geomorphicAgent: '비대칭 단층 융기(경동성 요곡운동) 및 개석 하천 침식',
      scale: { elevationMeters: 1561, lengthKm: 500 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '한반도 준평원 상태', timeframe: '중생대 말~고신생대', process: '오랜 침식 작용으로 한반도 전역이 기복이 낮은 평탄한 지형 유지', visualKeyFeature: '낮고 평평한 한반도 고생토 평원' },
      { stageNumber: 2, title: '동해 열개 및 단층 파쇄', timeframe: '약 2,300만 년 전', process: '일본 열도가 대륙에서 떨어져 나가며 동해가 열리고 동해안 단층대 형성', visualKeyFeature: '동해 해저 분열과 해안선 단층 균열' },
      { stageNumber: 3, title: '동고서저 비대칭 융기', timeframe: '약 1,500만 년 전', process: '동해안 축을 중심으로 지괴가 숟가락처럼 들리며 태백산맥 융기', visualKeyFeature: '동쪽은 천 길 낭떠러지, 서쪽은 완만한 경사 지괴' },
      { stageNumber: 4, title: '고위평탄면 잔존 및 현재', timeframe: '현재', process: '과거 평원면이 대관령 정상부에 고위평탄면으로 남고 동사면은 깊은 침식 계곡 발달', visualKeyFeature: '산정 풍력단지와 해안가 수직 절벽의 절경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 모두 우수하며, 대관령 운무 및 단풍철(10월) 추천',
      satelliteCheckPoints: ['동해안선과 나란하게 달리는 짙푸른 산맥 단애 능선선', '강릉 시가지 바로 뒤편에서 급격히 고도가 치솟는 조밀한 등고선', '대관령 산정부에 하얗게 펼쳐진 넓고 평평한 배추밭과 풍력기 기지'],
      cautionAndConservation: '산악 도로 급커브 및 동절기 결빙 주의'
    }
  },
  {
    id: 'fault-kr-2',
    terrain: '단층 산맥',
    region: 'korea',
    placeName: '울산-경주 양산단층대 구조곡',
    countryOrArea: '대한민국 경상북도 경주시 ~ 울산광역시 일대',
    tagline: '한반도 최대의 활성 주향이동 단층선이 빚어낸 170km의 직선형 단층 골짜기',
    description: `### 장소 소개 및 선정 이유
양산단층은 부산에서 경주를 거쳐 영덕에 이르는 약 170km의 한반도 최대 직선형 주향이동 단층대로, 지각의 수평 엇갈림 운동이 지표에 남긴 단층 파쇄대와 긴 직선형 구조곡을 선명하게 관찰할 수 있는 지질학적 현장입니다.

### 과학적 형성 과정
백악기 말부터 인도판과 유라시아판의 충돌 응력이 한반도에 전달되어 동남부 지각에 거대한 우수향 주향이동 단층이 생성되었습니다. 지반이 부서진 단층선을 따라 하천이 침식하여 긴 직선형 골짜기가 발달했습니다.

### 탐험 포인트
- **단층 굴절 하천(Offset Stream)**: 단층선을 통과하며 기역자(ㄱ) 모양으로 꺾여 흐르는 하천 물길
- **단층 삼각말단면(Triangular Facet)**: 산줄기 끝이 단층면에 의해 반듯하게 잘려 나간 삼각형 단애`,
    formationProcess: '지각 압축 응력에 의한 주향이동 단층 운동 및 단층 파쇄대 침식 골짜기 형성',
    observationPoints: ['직선형 단층선 하곡', '하천 변위선', '단층 점토 및 파쇄암 노두'],
    mapQuery: '경주 양산단층대',
    geology: {
      geologicalAge: '중생대 백악기 말~제4기 현재 진행형',
      rockType: '단층 각력암, 단층 점토(Gouge), 백악기 퇴적암/화산암',
      tectonicSetting: '동아시아 대륙 경계 우수향 주향이동 단층계',
      geomorphicAgent: '단층 수평 변위 및 파쇄대 하천 침식',
      scale: { lengthKm: 170, depthMeters: 400 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 경상분지 인장 균열', timeframe: '약 9,000만 년 전', process: '지각 인장력으로 영덕-부산 간 거대한 지구대 균열선 초기 배태', visualKeyFeature: '호수 퇴적분지 내 평행 단층선' },
      { stageNumber: 2, title: '주향이동 단층 전단 운동', timeframe: '약 5,000만 년 전', process: '동아시아 지각 응력 반전으로 좌우 블록이 수평으로 어긋나는 우수향 주향이동 발생', visualKeyFeature: '수 킬로미터에 이르는 지층 수평 어긋남' },
      { stageNumber: 3, title: '파쇄대 하천 직선 침식', timeframe: '신생대 제4기', process: '암석이 가루가 된 단층 파쇄대를 따라 하천이 집중 침식하여 직선 하곡 형성', visualKeyFeature: '자대고 그은 듯한 170km의 직선 골짜기' },
      { stageNumber: 4, title: '하천 굴절 및 단층 변위', timeframe: '현재', process: '하천 물길이 단층선을 가로지를 때 단층 이동으로 수십 미터 꺾여 흐름', visualKeyFeature: 'ㄱ자로 꺾인 하천 변위와 삼각말단면' }
    ],
    fieldGuide: {
      bestVisitingSeason: '항공사진 및 위성 관측은 연중 우수, 현장 지질 노두 탐방은 봄·가을',
      satelliteCheckPoints: ['경주-울산-부산으로 이어지는 눈에 띄는 자로 잰 듯한 일직선 골짜기', '경부고속도로와 35번 국도가 이 단층 골짜기를 그대로 통과하는 선형 교통망', '산줄기 말단부가 단층선을 따라 일렬로 잘린 삼각말단면'],
      cautionAndConservation: '활성단층 연구 구간으로 정밀 지진 계측 시설 보호'
    }
  },
  {
    id: 'fault-wd-1',
    terrain: '단층 산맥',
    region: 'world',
    placeName: '미국 그랜드티턴 산맥 (Grand Teton)',
    countryOrArea: '미국 와이오밍주 잭슨홀',
    tagline: '산기슭 구릉지 없이 평원 위로 2,000m 직벽을 솟구친 전형적인 정단층 지루 산맥',
    description: `### 장소 소개 및 선정 이유
그랜드티턴(4,199m)은 티턴 정단층을 따라 잭슨홀 평원 바닥에서 완충 구릉 없이 수직으로 솟아올라 전 세계에서 가장 극적이고 장엄한 지형학적 단층 스카프(Fault Scarp)를 보여주는 단층 지루 산맥입니다.

### 과학적 형성 과정
약 1,300만 년 전 시작된 북미 분지-산맥 지구대(Basin and Range)의 지각 인장력으로 인해 티턴 단층이 발생했습니다. 서쪽 블록은 위로 융기(지루/Horst)하고, 동쪽 잭슨홀 블록은 아래로 주저앉아(지구/Graben) 2,000m의 단차를 만들었습니다.

### 탐험 포인트
- **티턴 단층애(Fault Scarp)**: 제니 호수와 산기슭 경계면에 드러난 선명한 수직 단층 절벽
- **무구릉 지형(No Foothills)**: 평원에서 시작하여 완충 능선 없이 곧바로 치솟는 급경사`,
    formationProcess: '지각 인장에 따른 정단층 운동으로 한쪽 블록이 융기하고 반대편이 침강한 단층지루',
    observationPoints: ['2,000m 수직 단애', '잭슨홀 평원 단층 경계선', '빙식 침식과의 복합 지형'],
    mapQuery: 'Grand Teton National Park Wyoming USA',
    geology: {
      geologicalAge: '신생대 제3기 마이오세~현재 진행형 (약 1,300만 년 전~현재)',
      rockType: '선캄브리아기 화강암 및 편마암',
      tectonicSetting: '북미 분지-산맥 지구대(Basin and Range) 인장 정단층',
      geomorphicAgent: '수직 정단층 변위 및 플라이스토세 빙하 침식',
      scale: { elevationMeters: 4199, depthMeters: 2100, lengthKm: 65 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '북미 서부 지각 인장 시작', timeframe: '약 1,300만 년 전', process: '태평양판과 북미판의 상호작용으로 북미 서부 지각이 동서로 늘어남', visualKeyFeature: '지표면에 거대한 남북 방향 정단층 균열 발생' },
      { stageNumber: 2, title: '지루 융기 및 지구 침강', timeframe: '약 900만 년 전', process: '단층 서쪽 블록이 융기하고 동쪽 잭슨홀 분지가 수천 미터 침하', visualKeyFeature: '평원과 산맥 사이 거대한 수직 단애선 형성' },
      { stageNumber: 3, title: '알프스형 빙하 침식', timeframe: '약 200만~2만 년 전', process: '치솟은 단층 산맥 정상부에 빙하가 발달하여 뾰족한 호른과 피오르드 협곡 조각', visualKeyFeature: '피라미드처럼 날카로운 첨봉과 U자곡' },
      { stageNumber: 4, title: '제니호 모레인 언색', timeframe: '현재', process: '빙하가 녹으며 단층애 바로 앞에 빙퇴석(모레인) 댐 호수인 제니호 형성', visualKeyFeature: '호수에 거울처럼 비치는 수직 2,000m 산맥 벽' }
    ],
    fieldGuide: {
      bestVisitingSeason: '6월 말~9월 (야생화 만개 및 하이킹 트레일 눈 녹는 시기)',
      satelliteCheckPoints: ['완벽하게 평평한 잭슨홀 평원 서측 경계선을 따라 면도칼처럼 솟은 산맥선', '산기슭과 평원 사이에 구릉지(Foothills)가 일절 없는 극단적 경사 불연속선', '단층선을 따라 진주알처럼 늘어선 빙퇴석 언색호수군'],
      cautionAndConservation: '그리즐리 곰 서식지로 곰 스프레이 소지 및 낙석 주의'
    }
  },
  {
    id: 'fault-wd-2',
    terrain: '단층 산맥',
    region: 'world',
    placeName: '미국 시에라네바다 산맥 (Sierra Nevada)',
    countryOrArea: '미국 캘리포니아주 동부',
    tagline: '거대한 화강암 단괴가 한쪽으로 기울어 솟아오른 세계 최대급 경동지괴 산맥',
    description: `### 장소 소개 및 선정 이유
미국 캘리포니아의 척추인 시에라네바다 산맥은 동쪽은 오웬스 밸리를 향해 3,000m 수직 단애를 이루고, 서쪽은 센트럴 밸리를 향해 완만한 경사를 이루는 지구상에서 가장 거대한 경동지괴(Tilted Fault Block) 산맥입니다.

### 과학적 형성 과정
약 400만 년 전부터 본격화된 지각 변형으로 산맥 동쪽의 시에라네바다 단층대를 따라 거대한 화강암 저반 덩어리가 서쪽으로 기울어지며(Tilt) 급격히 융기했습니다.

### 탐험 포인트
- **휘트니산(Mount Whitney)**: 미국 본토 최고봉(4,421m)의 날카로운 단층 정상부
- **오웬스 밸리(Owens Valley)**: 단층 아래로 푹 꺼져 내려앉은 거대한 단층 지구 분지`,
    formationProcess: '초거대 화강암 저반 블록의 일방향 틸팅(Tilting) 및 동측 정단층 침하',
    observationPoints: ['동측 수직 단층벽', '서측 완경사 산록', '단층애 기저부 선상지 군락'],
    mapQuery: 'Mount Whitney California USA',
    geology: {
      geologicalAge: '신생대 제3기 플라이오세~현재 (약 400만 년 전~현재)',
      rockType: '백악기 시에라네바다 화강암 저반 (Granite Batholith)',
      tectonicSetting: '분지-산맥 지구대 서측 경계 전단 인장 단층',
      geomorphicAgent: '단괴 틸팅 융기 및 오웬스 밸리 정단층 낙하',
      scale: { elevationMeters: 4421, depthMeters: 3300, lengthKm: 640 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 거대 마그마 저반 관입', timeframe: '약 1억~8,000만 년 전', process: '섭입대 심부에서 거대한 화강암 덩어리가 굳어 지하 암반 형성', visualKeyFeature: '지하 수십 km에 걸친 단단한 화강암 거반' },
      { stageNumber: 2, title: '동측 정단층 발생 및 틸팅', timeframe: '약 500만~400만 년 전', process: '분지-산맥 지구대 확장으로 동쪽 단층선을 따라 서쪽으로 기울어지며 융기', visualKeyFeature: '동쪽은 직벽, 서쪽은 완만한 사면의 거대 지괴' },
      { stageNumber: 3, title: '오웬스 밸리 지구 함몰', timeframe: '약 200만 년 전', process: '단층 동쪽 지반이 3,000m 아래로 급격히 침하하여 메마른 단층 지구 형성', visualKeyFeature: '미국 최고 단차의 휘트니산-오웬스 협곡 구조' },
      { stageNumber: 4, title: '빙식 지형 및 현재', timeframe: '현재', process: '요세미티 U자곡 및 휘트니산 칼날 능선이 빙하에 의해 깎여 완성', visualKeyFeature: '웅장한 화강암 돔과 단층애의 조화' }
    ],
    fieldGuide: {
      bestVisitingSeason: '동측 395번 하이웨이 드라이브는 가을철(10월) 최적',
      satelliteCheckPoints: ['캘리포니아 동부를 가로지르는 선명한 백색 화강암 산맥 능선', '오웬스 밸리 건조 평원과 산맥 기저부 사이의 날카로운 선형 경계선', '산기슭마다 쏟아져 나온 거대한 선상지 부채꼴 군락'],
      cautionAndConservation: '고산 지대 극단적 기상 변화 및 3,000m 이상 고산증 대비 필수'
    }
  }
];
