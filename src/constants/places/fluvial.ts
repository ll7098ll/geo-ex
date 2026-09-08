import { PlaceInfo } from '../../types';

export const FLUVIAL_PLACES: PlaceInfo[] = [
  // ==========================================
  // 1. 선상지 (Alluvial Fan)
  // ==========================================
  {
    id: 'fan-kr-1',
    terrain: '선상지',
    region: 'korea',
    placeName: '경남 사천 선상지',
    countryOrArea: '대한민국 경상남도 사천시 사천읍 일대',
    tagline: '급경사 산지에서 평지로 쏟아져 나온 토사가 부채꼴로 펼쳐진 한국의 대표 선상지',
    description: `### 장소 소개 및 선정 이유
사천 선상지는 와룡산과 이구산에서 발원한 하천이 좁은 골짜기를 빠져나와 넓은 사천평야를 만나며 형성된 전형적인 부채꼴 모양의 퇴적 지형입니다.

### 과학적 형성 과정
산골짜기를 빠른 유속으로 흐르던 하천이 평지에 도달하면 하천 경사가 급격히 완만해지고 유역 폭이 넓어지며 유속이 급감합니다. 이때 하천이 운반하던 자갈과 모래 등 조립질 퇴적물을 골짜기 어귀(선정)를 중심으로 부채꼴 형태로 쏟아내며 퇴적시켰습니다.

### 탐험 포인트
- **선정(Fan Apex)**: 큰 자갈과 바위가 집중되어 하천수가 지하로 스며드는 복류수(伏流水) 구간
- **선앙(Fan Middle)**: 자갈과 모래밭으로 이루어져 물이 부족해 주로 과수원과 밭으로 이용되는 지대
- **선단(Fan Toe)**: 지하로 흘렀던 복류수가 다시 지표로 솟아나는 용천대(湧泉帶)와 논농사 지대`,
    formationProcess: '산지 계곡 탈출구에서 유속 급감에 따른 자갈 및 토사의 부채꼴 방사상 퇴적',
    observationPoints: ['선정의 거친 자갈층', '선앙의 투수성 토양과 과수원', '선단의 용천대와 취락 분포'],
    mapQuery: '사천시 사천읍 평야',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 말기~홀로세',
      rockType: '화강암질 풍화 조립사 및 하천 자갈',
      tectonicSetting: '남해안 침식 구릉과 산간 충적 분지',
      geomorphicAgent: '하천 홍수 유수 퇴적 및 복류수 침투',
      scale: { areaKm2: 12.5, elevationMeters: 45 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '산악 골짜기 침식 운반', timeframe: '빙하기', process: '와룡산 급경사 계곡에서 집중 강우로 화강암 쇄설물이 하류로 맹렬히 이동', visualKeyFeature: '좁은 V자곡을 가득 채운 거친 토석류' },
      { stageNumber: 2, title: '경사 급변점 유속 급감', timeframe: '후빙기 초기', process: '평야 진입 지점에서 유속이 둔화되며 무거운 전석과 거친 자갈이 선정에 급속 낙하', visualKeyFeature: '계곡 어귀에 형성된 두꺼운 자갈 둔덕' },
      { stageNumber: 3, title: '방사상 분류 수로 분기', timeframe: '약 3,000년 전', process: '퇴적물이 수로를 막자 물길이 부채살처럼 좌우로 갈라지며 토사 고른 분산', visualKeyFeature: '방사상으로 퍼진 부채꼴 평면 형태' },
      { stageNumber: 4, title: '토지 이용 분화 완성', timeframe: '현재', process: '투수층 특성에 따라 선정 자갈지대, 선앙 과수원, 선단 용천 논으로 토지 이용 안착', visualKeyFeature: '선단의 동심원형 자연 취락 분포' }
    ],
    fieldGuide: {
      bestVisitingSeason: '벼 수확 전후 황금 들판이 펼쳐지는 9~10월',
      satelliteCheckPoints: ['산악 골짜기 출구에서 평야로 부채꼴로 퍼져나가는 등고선 패턴', '선앙의 건조한 밭과 선단의 푸른 논의 뚜렷한 색상 경계', '선단부를 따라 활처럼 휘어진 도로 및 마을 배열'],
      cautionAndConservation: '전형적인 농촌 도로 보행 시 농기계 주의'
    }
  },
  {
    id: 'fan-kr-2',
    terrain: '선상지',
    region: 'korea',
    placeName: '구례 지리산 간전 선상지',
    countryOrArea: '대한민국 전라남도 구례군 간전면',
    tagline: '지리산 남부 험준한 산악 계곡이 섬진강 평탄면과 만나며 펼쳐진 비옥한 복합 선상지',
    description: `### 장소 소개 및 선정 이유
지리산 남부 형제봉과 백운산 자락에서 섬진강 본류로 합류하는 계곡 하천들이 만든 복합 선상지로, 산지 하천의 막강한 퇴적력과 섬진강 하천 퇴적물이 어우러진 지질 명소입니다.

### 과학적 형성 과정
집중 호우 시 지리산 급경사 계곡을 타고 쏟아져 내려온 대량의 토사가 경사 급변점에서 부채꼴로 퇴적되었으며, 여러 계곡의 선상지가 옆으로 연결된 연속 선상지(바하다, Bajada)의 초기 양상을 보입니다.

### 탐험 포인트
- **계곡 출구 퇴적층**: 집채만 한 화강암 전석(바위)들이 널려 있는 선정 부근
- **섬진강 완충 합류부**: 미세한 모래와 점토가 퇴적되어 농경지로 개간된 선단부`,
    formationProcess: '지리산 고산 계곡의 고에너지 하천이 섬진강 유역 평탄지에 형성한 부채꼴 퇴적체',
    observationPoints: ['고도 급변 단애 경계선', '퇴적 입도별 분급 구조', '지하수 용출 지점'],
    mapQuery: '구례군 간전면',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 말기',
      rockType: '선캄브리아기 편마암 및 화강암질 각력',
      tectonicSetting: '지리산 지괴 단열 계곡 말단부',
      geomorphicAgent: '계곡 토석류 및 섬진강 본류 횡적 퇴적',
      scale: { areaKm2: 8.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '지리산 험준 산악 풍화', timeframe: '플라이스토세 빙기', process: '동결 파쇄로 지리산 산록에 대량의 각력암 생산', visualKeyFeature: '계곡 상류에 누적된 거대한 암괴군' },
      { stageNumber: 2, title: '간헐적 토석류 분출', timeframe: '약 1만 년 전', process: '집중 폭우 시 진흙과 바위가 한꺼번에 섬진강 계곡 입구로 돌진', visualKeyFeature: '평탄지로 쏟아지는 고에너지 토사 퇴적' },
      { stageNumber: 3, title: '연접 선상지(바하다) 결합', timeframe: '약 3,000년 전', process: '인접한 3개 계곡 선상지 말단이 좌우로 합쳐져 넓은 경사면 형성', visualKeyFeature: '산기슭을 따라 물결치는 복합 선상지' },
      { stageNumber: 4, title: '섬진강 하식애 접촉', timeframe: '현재', process: '섬진강 본류가 선단부를 깎아내며 선상지 단면이 강변에 노출', visualKeyFeature: '강변 모래톱과 산기슭 부채꼴 평원' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄철 섬진강 벚꽃 개화기 및 가을 단풍철',
      satelliteCheckPoints: ['지리산 거대 산줄기 말단에 붙어 있는 부드러운 경사면', '섬진강 본류 푸른 물줄기와 맞닿은 선단 경계선', '계곡 입구마다 형성된 부채꼴 농경지'],
      cautionAndConservation: '여름철 호우 시 계곡 돌발 수위 상승 주의'
    }
  },
  {
    id: 'fan-wd-1',
    terrain: '선상지',
    region: 'world',
    placeName: '미국 데스밸리 배드워터 바하다 (Badwater Alluvial Fan)',
    countryOrArea: '미국 캘리포니아주 데스밸리 국립공원',
    tagline: '단층 절벽 협곡에서 사막 분지 바닥으로 완벽한 대칭을 이루며 쏟아져 내린 교과서 선상지',
    description: `### 장소 소개 및 선정 이유
데스밸리의 블랙 마운틴 기슭에 발달한 선상지들은 식생이 전혀 없는 극도의 건조 기후 덕분에 지형학 교과서에 실린 선상지와 복합 선상지(Bajada)의 원형 그대로를 우주에서도 선명하게 관찰할 수 있습니다.

### 과학적 형성 과정
돌발 홍수(Flash Flood) 발생 시 좁은 협곡을 통과하던 거대한 토석류(Mudflow)가 분지 바닥으로 분출하면서 사방으로 에너지가 분산되어 퇴적되었습니다. 오랜 세월 동안 인접한 선상지들이 서로 결합하여 거대한 복합 선상지(바하다)를 형성했습니다.`,
    formationProcess: '돌발 홍수에 의한 건조 협곡 토석류의 평원 분출 및 연속 선상지 결합',
    observationPoints: ['완벽한 기하학적 부채꼴 형태', '선상지 표면의 망상 유로 흔적', '해저 86m 염호와의 접촉면'],
    mapQuery: 'Badwater Basin Death Valley California USA',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~현재 진행형',
      rockType: '선캄브리아기 탄산염암 및 제3기 화성암 각력',
      tectonicSetting: '분지-산맥 지구대 정단층 열곡 분지',
      geomorphicAgent: '간헐적 돌발 홍수(Flash Floods) 및 암석 건조 풍화',
      scale: { lengthKm: 6.5, areaKm2: 28 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '블랙마운틴 정단층 융기', timeframe: '약 300만 년 전', process: '정단층 운동으로 산맥이 솟고 데스밸리 바닥이 해수면 아래로 침하', visualKeyFeature: '수직 2,000m의 메마른 암벽 절벽' },
      { stageNumber: 2, title: '협곡 굴착 및 토사 축적', timeframe: '빙하기', process: '간헐적 폭우가 깊고 좁은 협곡 슬롯 캐니언을 깎아냄', visualKeyFeature: '협곡 내부를 가득 채운 모래 자갈' },
      { stageNumber: 3, title: '토석류 분출 및 방사 퇴적', timeframe: '지속', process: '수십 년에 한 번씩 터지는 폭우가 수만 톤의 자갈을 분지 바닥으로 쏟아냄', visualKeyFeature: '부챗살 모양으로 뻗어나간 회색 자갈 평원' },
      { stageNumber: 4, title: '바하다(Bajada) 연속 융합', timeframe: '현재', process: '인접한 수십 개 선상지가 연결되어 산맥 기저부 전체를 덮는 거대 경사면 완성', visualKeyFeature: '우주정거장에서도 선명한 거대 연속 부채꼴' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~3월 (한여름 50℃ 이상의 혹서기 절대 피할 것)',
      satelliteCheckPoints: ['검붉은 블랙마운틴 산자락에서 배드워터 백색 소금평원으로 쏟아져 나온 선명한 회색 부채꼴들', '부채꼴 표면에 새겨진 미세한 나뭇가지 모양의 마른 물길 줄기', '단층선을 따라 완벽한 일직선으로 이어진 선상지 꼭짓점(선정) 배열'],
      cautionAndConservation: '극단적 탈수 위험으로 식수 4리터 이상 상시 휴대 필수'
    }
  },

  // ==========================================
  // 2. 범람원 (Floodplain)
  // ==========================================
  {
    id: 'flood-kr-1',
    terrain: '범람원',
    region: 'korea',
    placeName: '김해 낙동강 삼각평야 범람원',
    countryOrArea: '대한민국 경상남도 김해시 ~ 부산광역시 강서구',
    tagline: '영남의 젖줄 낙동강이 억겁의 홍수로 빚어낸 한국 최대의 자연제방과 배후습지',
    description: `### 장소 소개 및 선정 이유
김해평야는 낙동강 하류에 형성된 충적 평야로, 하천 양안의 자연제방(Natural Levee)과 그 뒤편의 배후습지(Backswamp)가 교과서적으로 발달하여 고대 가야 문명의 비옥한 농업 기반이 되었습니다.

### 과학적 형성 과정
낙동강 본류가 범람할 때 유속이 급감하는 하천 바로 옆에는 모래 등 거친 입자가 쌓여 미기복 언덕인 자연제방을 이루었고, 물이 넘쳐 고인 먼 저지대에는 미세 점토가 가라앉아 물이 잘 빠지지 않는 배후습지를 형성했습니다.

### 탐험 포인트
- **자연제방 취락**: 홍수를 피해 미세하게 높은 자연제방 위에 자리 잡은 전통 마을과 과수원
- **배후습지 논**: 자연제방 뒤편의 저습지를 개간하여 만든 비옥한 벼농사 지대`,
    formationProcess: '하천 홍수 범람 시 입도 차별 퇴적으로 자연제방과 배후습지 분화',
    observationPoints: ['자연제방 위 도로와 취락', '배후습지 평야의 배수로', '낙동강 하구 둑'],
    mapQuery: '김해평야',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 6,000년 전~현재)',
      rockType: '하천 충적 실트, 점토 및 세립사',
      tectonicSetting: '낙동강 열곡 침강 하류 충적 분지',
      geomorphicAgent: '낙동강 계절 홍수 범람 및 조석 정체 작용',
      scale: { areaKm2: 170 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고김해만 침수', timeframe: '약 6,000년 전', process: '후빙기 해수면 상승으로 현재 김해평야 전역이 깊은 바다만(Bay)을 형성', visualKeyFeature: '산으로 둘러싸인 고대 바다' },
      { stageNumber: 2, title: '낙동강 대량 토사 유입', timeframe: '약 4,000년 전', process: '낙동강 상류에서 씻겨 내려온 막대한 토사가 고김해만을 빠르게 매립', visualKeyFeature: '하구 모래톱과 얕아지는 늪지대' },
      { stageNumber: 3, title: '자연제방과 배후습지 분화', timeframe: '약 2,000년 전', process: '반복된 홍수로 강변에는 1~2m 높은 모래 둔덕(자연제방)이, 뒤편엔 늪지 형성', visualKeyFeature: '자연제방 위 가야 고분군과 취락' },
      { stageNumber: 4, title: '인공 제방 축조 및 곡창지대', timeframe: '근현대', process: '일제강점기 방조제와 수로 정비로 배후습지가 전천후 옥토 김해평야로 개간', visualKeyFeature: '바둑판형 광활한 논과 시설 원예 단지' }
    ],
    fieldGuide: {
      bestVisitingSeason: '벼가 익어가는 가을철 및 낙동강 철새 도래기(11~2월)',
      satelliteCheckPoints: ['낙동강 본류를 따라 구불구불 이어지는 미세하게 밝은 자연제방 지대', '자연제방 배후에 바둑판처럼 펼쳐진 김해 들판', '선형으로 뻗은 인공 배수로망'],
      cautionAndConservation: '평야 지대 강풍 및 농로 자전거 주행 안전'
    }
  },
  {
    id: 'flood-wd-1',
    terrain: '범람원',
    region: 'world',
    placeName: '미국 미시시피강 하류 범람원',
    countryOrArea: '미국 루이지애나주 / 미시시피주',
    tagline: '북미 대륙의 심장을 관통하는 대하천이 수천 년간 만들어낸 장대한 자연제방과 곡류 분지',
    description: `### 장소 소개 및 선정 이유
미국 남부를 관통하는 미시시피강 하류는 전 세계에서 가장 거대하고 정교한 범람원 지형을 보여줍니다. 수천 킬로미터에 이르는 거대한 자연제방, 우각호(Oxbow Lake), 메마른 구하도(Meander Scar)가 장관을 이룹니다.

### 과학적 형성 과정
북미 대륙 41%의 면적에서 모인 막대한 유량이 봄철 눈 녹은 물과 함께 범람하면서 광대한 평원에 두꺼운 충적토를 겹겹이 쌓아 올렸습니다.`,
    formationProcess: '대륙 규모 하천의 주기적 대범람에 의한 광역 자연제방 및 범람 퇴적',
    observationPoints: ['초승달 모양의 거대 우각호 군락', '자연제방 위 레비(Levee) 도로', '사이프러스 습지'],
    mapQuery: 'Mississippi River Floodplain Louisiana USA',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 말기~홀로세',
      rockType: '하천 충적 점토, 실트 및 유기질 토양',
      tectonicSetting: '미시시피 엠베이먼트(Embayment) 완만 침강 분지',
      geomorphicAgent: '주기적 대홍수 및 유로 측방 이동',
      scale: { areaKm2: 90000, lengthKm: 1000 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '빙하 융설수 대방출', timeframe: '약 1만 2,000년 전', process: '로렌타이드 빙상이 녹으며 엄청난 양의 물과 진흙이 미시시피 골짜기로 쇄도', visualKeyFeature: '수십 km 폭의 거대한 빙하 배수로' },
      { stageNumber: 2, title: '곡류 및 측방 침식 퇴적', timeframe: '약 5,000년 전', process: '하천이 완만한 평원을 뱀처럼 사행하며 바깥쪽은 깎고 안쪽은 포인트 바 퇴적', visualKeyFeature: '수많은 S자 곡류 고리들의 생성' },
      { stageNumber: 3, title: '곡류 절단 및 우각호 다발', timeframe: '약 2,000년 전', process: '대홍수로 좁아진 목이 잘려 나가며 직선화되고 버려진 유로는 초승달 호수로 격리', visualKeyFeature: '강 주변에 점점이 흩어진 초승달 호수들' },
      { stageNumber: 4, title: '인공 슈퍼 레비 시스템', timeframe: '현재', process: '홍수 방제를 위해 자연제방 위에 수 미터의 거대 인공 제방(Levee) 구축', visualKeyFeature: '강 수면이 주변 도시 지붕보다 높은 천정천화' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄철 신록 및 가을철 선선한 기후 (여름철 혹서 습도 회피)',
      satelliteCheckPoints: ['미시시피강 본류 주변에 지문처럼 남아 있는 무수한 옛 유로 흔적(Meander Scars)', '본류와 나란히 고여 있는 초승달 모양의 우각호(Oxbow Lakes)들', '강줄기를 따라 일직선으로 보강된 인공 제방 둑길'],
      cautionAndConservation: '강변 습지 악어(Alligator) 서식지 접근 주의'
    }
  },

  // ==========================================
  // 3. 삼각주 (Delta)
  // ==========================================
  {
    id: 'delta-kr-1',
    terrain: '삼각주',
    region: 'korea',
    placeName: '부산 낙동강 하구 삼각주 (을숙도)',
    countryOrArea: '대한민국 부산광역시 사하구 / 강서구',
    tagline: '동양 최대의 철새 도래지이자 남해 조류와 하천이 빚어낸 한국 유일의 대규모 삼각주',
    description: `### 장소 소개 및 선정 이유
천연기념물 제179호인 낙동강 하구 삼각주는 강물이 바다로 진입할 때 유속이 급감하며 실어 온 토사를 삼각 형태로 퇴적시킨 지형으로, 을숙도를 비롯해 대마등, 장자도, 신자도 등 바깥 바다로 계속 자라나는 살아있는 모래등(하구 모래톱)을 관찰할 수 있습니다.

### 과학적 형성 과정
낙동강 본류가 남해의 완만한 파도와 만나며 퇴적물이 하구에 집중 침전되었고, 강물이 여러 갈래의 분류(Distributary)로 나뉘어 흐르면서 모래섬들이 연결되어 거대한 삼각주 평야를 형성했습니다.

### 탐험 포인트
- **을숙도 철새공원**: 갈대밭과 모래톱 사이를 오가는 고니와 철새 무리
- **전진 모래톱(연안사주)**: 신자도, 도요등 등 남쪽 바다를 향해 해마다 새로 솟아오르는 신생 모래톱`,
    formationProcess: '하천 하구 유속 소실 및 파랑·조류의 모래톱 재배열로 삼각주성 도서군 발달',
    observationPoints: ['을숙도 하중도 삼각주', '외곽 연안사주(신자도, 도요등)', '낙동강 하구둑 배수문'],
    mapQuery: '을숙도',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 3,000년 전~현재 진행형)',
      rockType: '해성 및 하성 모래, 실트 혼합 퇴적층',
      tectonicSetting: '남해안 침강만 하구 퇴적계',
      geomorphicAgent: '낙동강 유수 퇴적 및 남해 파랑·조류 재분급',
      scale: { areaKm2: 173 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고김해만 하구 모래톱 태동', timeframe: '약 4,000년 전', process: '낙동강 토사가 하구에 쏟아져 바다 밑에 거대한 수중 삼각주(Delta Front) 축적', visualKeyFeature: '바닷속에 잠긴 넓은 모래 평원' },
      { stageNumber: 2, title: '을숙도 등 하중도 수면 노출', timeframe: '약 2,000년 전', process: '퇴적물이 수면 위로 솟아오르며 갈대밭이 무성한 원시 을숙도 탄생', visualKeyFeature: '강줄기가 둘로 갈라지는 하중도' },
      { stageNumber: 3, title: '조류 재배열 외곽 사주 성장', timeframe: '조선시대~근대', process: '남해 파도가 모래를 해안선과 평행하게 밀어 올려 장자도, 대마등 형성', visualKeyFeature: '외곽에 띠 모양으로 늘어선 모래섬들' },
      { stageNumber: 4, title: '현대 모래톱 남하 전진', timeframe: '현재', process: '도요등, 신자도가 매년 수 미터씩 남쪽 바다로 자라나며 삼각주 지속 팽창', visualKeyFeature: '세계적인 철새 쉼터와 살아있는 하구 지형' }
    ],
    fieldGuide: {
      bestVisitingSeason: '겨울철(11월~2월) 천연기념물 고니 떼 장관 및 가을 갈대 시즌',
      satelliteCheckPoints: ['낙동강이 바다와 만나는 지점에 펼쳐진 거대한 부채꼴 모래톱 군락', '바깥 바다 쪽에 일렬로 방파제처럼 누워 있는 황금빛 신자도, 다대포 모래사주', '을숙도 생태공원의 초록색 갈대밭'],
      cautionAndConservation: '천연기념물 및 철새보호구역으로 드론 비행 절대 금지'
    }
  },
  {
    id: 'delta-wd-1',
    terrain: '삼각주',
    region: 'world',
    placeName: '이집트 나일강 삼각주 (Nile Delta)',
    countryOrArea: '이집트 알렉산드리아 / 카이로 북부',
    tagline: '그리스 문자 델타(Δ)의 어원이 된 인류 문명의 요람이자 고전적 원호상 삼각주',
    description: `### 장소 소개 및 선정 이유
헤로도토스가 "이집트는 나일강의 선물"이라 칭송했던 나일강 삼각주는 카이로 북쪽에서 지중해를 향해 부채꼴(원호상)로 펼쳐진 길이 160km, 해안선 240km의 거대한 삼각주로, '삼각주(Delta)'라는 용어의 기원이 된 역사적·지형학적 원형입니다.

### 과학적 형성 과정
수천 년 동안 동아프리카 고원에서 쏟아져 나온 에티오피아 고원 몬순 홍수가 비옥한 흑색 현무암질 실트(풍적토)를 지중해 연안에 겹겹이 쌓아 올려 만들었습니다.`,
    formationProcess: '원호상 지중해 연안류와 대하천 토사의 상호작용으로 반원형 원호상 삼각주 완성',
    observationPoints: ['지중해와 맞닿은 원호상 해안선', '로제타와 다미에타 2대 분류', '사막과 극명히 대비되는 녹색 삼각주'],
    mapQuery: 'Nile Delta Egypt',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~홀로세 (약 7,000년 전 본격 집적)',
      rockType: '유기질 풍부한 흑색 실트질 충적토 (Nile Silt)',
      tectonicSetting: '북아프리카 수동형 대륙붕 탄산염-쇄설성 분지',
      geomorphicAgent: '에티오피아 몬순 홍수 범람 및 지중해 파랑 분급',
      scale: { areaKm2: 22000, lengthKm: 160 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고대 나일 협곡 매립', timeframe: '마이오세 말기 지중해 건조기 이후', process: '바닷물이 다시 들어찬 나일 깊은 골짜기에 수백만 년간 토사 충진', visualKeyFeature: '지중해로 열린 넓은 퇴적 분지' },
      { stageNumber: 2, title: '7대 분류 수로망 번성', timeframe: '기원전 3,000년경', process: '나일강이 7갈래로 갈라져 지중해로 토사를 공급하며 그리스 문자 Δ 모양 완성', visualKeyFeature: '지중해를 향해 반원형으로 뻗은 녹색 부채꼴' },
      { stageNumber: 3, title: '연안 사구 및 석호 장벽', timeframe: '기원전 1,000년경', process: '지중해 파도가 삼각주 외곽에 모래톱을 만들어 만잘라호 등 거대 석호 격리', visualKeyFeature: '외곽 해안선에 늘어선 얕은 호수들' },
      { stageNumber: 4, title: '아스완 댐 건설과 침식 위기', timeframe: '1970년~현재', process: '상류 아스완 하이 댐으로 토사 공급이 98% 차단되어 지중해 파도에 해안선 후퇴 중', visualKeyFeature: '고밀도 농경 도시화와 연안 침식 방파제' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~4월 (지중해 연안의 선선하고 쾌적한 겨울철)',
      satelliteCheckPoints: ['황량한 황토색 사하라 사막 한가운데 선명하게 빛나는 거대한 에메랄드빛 삼각 녹색 부채꼴', '카이로에서 로제타와 다미에타 양 갈래로 갈라지는 Y자 분류 물줄기', '북쪽 지중해 해안선을 따라 펼쳐진 만잘라, 부룰루스 석호들'],
      cautionAndConservation: '아스완 댐 이후 토사 결핍 및 지구 온난화 해수면 상승 취약 지구'
    }
  },

  // ==========================================
  // 4. 감입곡류 (Incised Meander)
  // ==========================================
  {
    id: 'meander-kr-1',
    terrain: '감입곡류',
    region: 'korea',
    placeName: '영월 동강 어라연 감입곡류',
    countryOrArea: '대한민국 강원도 영월군 영월읍 거운리',
    tagline: '평야를 흐르던 고대 뱀 물길이 지각 융기로 석회암 산지를 깎아내린 절경',
    description: `### 장소 소개 및 선정 이유
명승 제14호인 영월 동강의 '어라연(魚羅淵)'은 고생대 석회암 지대를 태백산맥의 융기 운동과 함께 수직으로 깊게 파고들며 굽이쳐 흐르는 전형적인 굴삭 감입곡류천(Incised Meander)의 최고 명소입니다.

### 과학적 형성 과정
과거 평탄한 준평원 지대를 구불구불 흐르던 자유곡류천(Free Meander)이 신생대 제3기 태백산맥 경동성 요곡 융기 운동으로 하천 침식 기준면이 급격히 낮아지자, 본래의 굽이치던 물길 모양 그대로 수직 하방 침식을 단행하여 깊은 협곡을 만들었습니다.

### 탐험 포인트
- **삼선암(상선·중선·하선암)**: 감입곡류 하천 한복판에 솟구친 기암괴석 바위섬
- **석회암 절벽(뼝대)**: 감입곡류 공격사면에 수직으로 발달한 100m 높이의 석회암 병풍`,
    formationProcess: '준평원 자유곡류천의 지각 융기 부활에 따른 본래 곡형 유지 수직 하방 삭박',
    observationPoints: ['말굽 모양으로 휘감아 도는 물길', '수직 석회암 뼝대 단애', '공격사면과 활주사면의 비대칭'],
    mapQuery: '영월 동강 어라연',
    geology: {
      geologicalAge: '고생대 조선누층군 석회암 기반암 위 신생대 제3기 융기 침식',
      rockType: '고생대 전기 막골층 석회암 및 돌로마이트',
      tectonicSetting: '옥천변성대 북동부 태백산 분지 요곡 융기 지대',
      geomorphicAgent: '지각 융기에 따른 강력한 하방 유수 침식 및 석회암 용식',
      scale: { depthMeters: 150, lengthKm: 12 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 따뜻한 천해 석회암 형성', timeframe: '약 5억 년 전', process: '삼엽충이 살던 고생대 바다 밑에 두꺼운 석회질 침전층 고화', visualKeyFeature: '수억 년 세월의 단단한 석회암 암반' },
      { stageNumber: 2, title: '신생대 초기 준평원 자유곡류', timeframe: '약 3,000만 년 전', process: '한반도가 평평한 준평원일 때 동강의 조상 하천이 평야를 뱀처럼 사행', visualKeyFeature: '완만한 구릉 평야를 흐르는 완만한 곡류천' },
      { stageNumber: 3, title: '태백산맥 비대칭 융기 개시', timeframe: '약 2,300만~1,500만 년 전', process: '동해가 열리며 지반이 수백 미터 들리자 하천의 낙차가 커져 하방 침식 격화', visualKeyFeature: '기존 사행 모양 그대로 암반을 파고드는 물길' },
      { stageNumber: 4, title: '어라연 협곡과 삼선암 안착', timeframe: '현재', process: '150m 깊이의 석회암 V자 협곡과 강 한가운데 기암괴석 삼선암 완성', visualKeyFeature: '물안개 피어오르는 비경의 감입곡류' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~6월 및 10월 단풍철 (래프팅 또는 어라연 트레킹 코스 추천)',
      satelliteCheckPoints: ['산악 지대 한복판을 면도칼로 오려낸 듯 극단적으로 굽이치는 동강의 S자 곡선', '물길 바깥쪽에 형성된 짙은 그림자의 석회암 수직 뼝대 절벽', '물길 안쪽에 부드럽게 완경사를 이루는 활주사면의 자갈밭'],
      cautionAndConservation: '생태경관보전지역으로 야영 취사 금지 및 급류 래프팅 구명조끼 필수'
    }
  },
  {
    id: 'meander-wd-1',
    terrain: '감입곡류',
    region: 'world',
    placeName: '미국 호스슈 벤드 (Horseshoe Bend)',
    countryOrArea: '미국 애리조나주 페이지 콜로라도강',
    tagline: '콜로라도고원 융기가 나바호 사암을 300m 깊이로 깎아 만든 완벽한 말굽 모양 감입곡류',
    description: `### 장소 소개 및 선정 이유
글렌 캐니언 국립휴양지의 호스슈 벤드는 콜로라도강이 중생대 붉은 나바호 사암 대지를 270도 이상 휘감아 돌며 300m 수직 절벽을 깎아낸 전 세계에서 가장 완벽하고 극적인 말굽 모양(Horseshoe)의 감입곡류 지형입니다.

### 과학적 형성 과정
약 600만 년 전 콜로라도 고원이 광역적으로 수천 미터 융기하면서 평원을 흐르던 콜로라도강의 침식력이 극대화되어, 기존 사행 물길을 그대로 유지한 채 단단한 붉은 사암층을 수직으로 300m 깊이 파고 내려갔습니다.

### 탐험 포인트
- **300m 아찔한 직벽 림**: 난간 없는 사암 절벽 끝에서 내려다보는 옥빛 강물
- **사층리(Cross-bedding)**: 절벽 암벽에 선명하게 새겨진 쥬라기 시대 모래사막 바람의 흔적`,
    formationProcess: '콜로라도 고원 광역 융기에 따른 콜로라도강의 나바호 사암 심층 굴삭',
    observationPoints: ['270도 회전하는 말굽 물길', '300m 수직 적색 사암 절벽', '에메랄드빛 콜로라도 강물'],
    mapQuery: 'Horseshoe Bend Page Arizona USA',
    geology: {
      geologicalAge: '중생대 쥐라기 나바호 사암(약 1억 9,000만 년 전) 위 신생대 융기 침식',
      rockType: '바람에 의해 퇴적된 거대 사층리 석영질 나바호 사암 (Navajo Sandstone)',
      tectonicSetting: '콜로라도 고원 광역 테크토닉 융기',
      geomorphicAgent: '콜로라도강 고낙차 하방 수직 삭박',
      scale: { depthMeters: 305, lengthKm: 4.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '쥐라기 바람 사막(에르그) 퇴적', timeframe: '약 1억 9,000만 년 전', process: '거대한 모래언덕들이 바람에 날려 쌓이며 바람결 사층리를 품은 사암 고화', visualKeyFeature: '두께 수백 미터의 붉은 사암 지층' },
      { stageNumber: 2, title: '고원 융기 전 평탄 자유곡류', timeframe: '약 1,000만 년 전', process: '평평한 저지대에서 콜로라도강이 자유롭게 S자로 굽이치며 흐름', visualKeyFeature: '완만한 평원 위의 뱀 모양 물길' },
      { stageNumber: 3, title: '콜로라도 고원 수천 미터 융기', timeframe: '약 600만~500만 년 전', process: '고원 전체가 들썩이며 융기하여 강의 침식 기준면이 수천 미터 낮아짐', visualKeyFeature: '물살이 사나워지며 바닥을 맹렬히 파고듦' },
      { stageNumber: 4, title: '300m 말굽 협곡 완성', timeframe: '현재', process: '270도 말굽 고리를 그대로 유지한 채 300m 수직 협곡과 에메랄드 물길 완성', visualKeyFeature: '전 세계 여행자들을 전율케 하는 완벽한 원형 협곡' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄·가을철 (한여름 정오에는 그늘 없는 40℃ 사막 열기 극심)',
      satelliteCheckPoints: ['황갈색 사암 고원 한복판에 도장을 찍은 듯 완벽하게 돌아나간 U자형 청록색 물길', '반도 모양으로 고립된 중심부 거대 암석 지괴의 둥근 등고선', '절벽 끝까지 이어지는 붉은색 관광 산책로'],
      cautionAndConservation: '난간 없는 300m 낭떠러지이므로 절벽 끝 안전거리 2m 유지 엄수'
    }
  },

  // ==========================================
  // 5. 하안단구 (River Terrace)
  // ==========================================
  {
    id: 'terrace-kr-1',
    terrain: '하안단구',
    region: 'korea',
    placeName: '영월 청령포 및 방절리 하안단구',
    countryOrArea: '대한민국 강원도 영월군 영월읍 방절리',
    tagline: '단종의 유배지 청령포를 낳은 한반도 지각 융기와 하천 침식의 타임캡슐 계단',
    description: `### 장소 소개 및 선정 이유
명승 제50호 청령포 건너편 방절리 일대는 하천 양안에 계단 모양으로 펼쳐진 전형적인 하안단구(River Terrace)로, 과거 하천 바닥이었던 평탄면에 둥근 자갈층이 고스란히 남아 있어 한반도의 융기 역사를 증명합니다.

### 과학적 형성 과정
과거 하천이 흐르며 평탄한 곡저면을 만들고 둥근 자갈을 쌓은 뒤, 지반이 융기하거나 빙하기/간빙기 기후 변화로 침식력이 커지면서 하천이 바닥을 깊게 파고 내려가 이전 하상이 강가 언덕 계단으로 남았습니다.

### 탐험 포인트
- **단구면 위의 둥근 자갈**: 산꼭대기 가까운 계단 밭에서 발견되는 강물에 닳은 원마도 높은 자갈
- **청령포 감입 하도**: 3면이 깊은 강물로 둘러싸인 천혜의 유배지 지형`,
    formationProcess: '지반 융기 및 기후 변화에 따른 하방 침식 부활로 구 하상면의 계단식 잔존',
    observationPoints: ['다단 하안단구 평탄면', '단구 역층(둥근 강 자갈 노두)', '청령포 곡류 핵'],
    mapQuery: '영월 청령포',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 10만~2만 년 전)',
      rockType: '고기 하천 자갈층(Cobble & Gravel) 및 석회암 기반암',
      tectonicSetting: '태백산맥 서사면 간헐적 단속 융기축',
      geomorphicAgent: '간헐적 융기 및 빙기-간빙기 기후성 하천 침식 윤회',
      scale: { elevationMeters: 230, depthMeters: 40 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고기 하천 평탄 하상 퇴적', timeframe: '약 10만 년 전', process: '동강과 서강이 합류하는 지점에서 하천이 넓은 자갈밭 곡저면 형성', visualKeyFeature: '물속에서 구르는 둥근 자갈밭' },
      { stageNumber: 2, title: '지각 간헐 융기 및 1차 삭박', timeframe: '약 7만 년 전', process: '지반이 융기하며 하천이 바닥을 20m 수직 침식하여 1단 하안단구 분리', visualKeyFeature: '강물보다 훨씬 높아진 평평한 옛 강바닥 계단' },
      { stageNumber: 3, title: '2차 단속 침식 및 다단화', timeframe: '약 3만 년 전', process: '또 한 번의 침식 부활로 아래쪽에 새로운 저위 단구면이 추가 발달', visualKeyFeature: '2~3단의 뚜렷한 계단식 지형 형성' },
      { stageNumber: 4, title: '취락 입지 및 청령포 안착', timeframe: '현재', process: '홍수로부터 안전한 단구면 위에 마을과 과수원이 들어서고 단종 유배지 보존', visualKeyFeature: '굽이치는 서강 물길과 계단식 평탄면' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄~가을 연중 탐방 적기 (청령포 나룻배 도하 체험 추천)',
      satelliteCheckPoints: ['서강 물길이 거의 원형으로 목을 조르듯 휘감은 청령포 반도 지형', '물길 바로 옆 언덕 위에 계단식으로 형성된 평평한 방절리 밭자리들', '단구애 절벽과 도로의 고저차'],
      cautionAndConservation: '국가명승지로 솔숲 보존 및 강변 도하 시 안전 수칙 준수'
    }
  },
  {
    id: 'terrace-wd-1',
    terrain: '하안단구',
    region: 'world',
    placeName: '뉴질랜드 라카이아 강 하안단구 (Rakaia River Terraces)',
    countryOrArea: '뉴질랜드 남섬 캔터베리 평원',
    tagline: '남알프스 빙하 융설수가 깎아 만든 수십 미터 단차의 세계 최대급 다단 하안단구',
    description: `### 장소 소개 및 선정 이유
뉴질랜드 남섬의 라카이아 강은 남알프스 산맥에서 캔터베리 평원으로 흘러나오는 광대한 망상하천(Braided River)으로, 강 양안에 칼로 자른 듯 정교하게 발달한 4~5단의 거대한 하안단구가 지형학의 경이를 보여줍니다.

### 과학적 형성 과정
남알프스 산맥의 격렬한 판 경계 융기 운동과 빙하기-간빙기 사이의 하천 유량 급변이 결합하여, 빙퇴석 자갈 평원을 강물이 수직으로 단계별로 깊게 파고 내려가며 완벽한 계단 지형을 완성했습니다.`,
    formationProcess: '남알프스 판 경계 융기 및 빙기 하천 침식 부활에 따른 다단 하안단구 계단 형성',
    observationPoints: ['4~5단의 정교한 평탄 계단면', '단구애(Terrace Scarp) 수직 단차', '강바닥의 망상 하천 수계'],
    mapQuery: 'Rakaia River Terraces New Zealand',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 빙기~현재',
      rockType: '빙하 융설수 기원 조립질 그레이와케(Greywacke) 자갈층',
      tectonicSetting: '인도-호주판과 태평양판 충돌 알프스 단층대(Alpine Fault)',
      geomorphicAgent: '판 충돌 고속 융기 및 빙하 융설수 하방 굴착',
      scale: { depthMeters: 60, lengthKm: 45 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '빙하기 막대한 쇄설물 평원', timeframe: '약 10만 년 전', process: '빙하가 갈아놓은 엄청난 양의 자갈이 캔터베리 평원에 두껍게 깔림', visualKeyFeature: '지평선까지 펼쳐진 거대한 자갈 충적 평야' },
      { stageNumber: 2, title: '알프스 단층 고속 융기', timeframe: '약 5만 년 전', process: '판 충돌로 남섬 서측 지반이 연간 수 밀리미터씩 급격히 치솟음', visualKeyFeature: '산맥에서 평야로 쏟아지는 급류' },
      { stageNumber: 3, title: '다단계 하방 굴착 및 단구 분리', timeframe: '약 2만~1만 년 전', process: '유량이 풍부해진 강물이 옛 자갈 평원을 면도칼처럼 파고들며 60m 절벽 계단 형성', visualKeyFeature: '강 양쪽에 자로 잰 듯 늘어선 다단 계단' },
      { stageNumber: 4, title: '망상하천과의 복합 경관', timeframe: '현재', process: '계단 아래 현재 강바닥에는 수십 줄기의 푸른 빙하 물길이 땋은 머리처럼 흐름', visualKeyFeature: '비취색 망상 수계와 거대한 단구의 조화' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~4월 (뉴질랜드 여름철의 청명한 시계 확보 시기)',
      satelliteCheckPoints: ['하늘에서 보면 거대한 거인들의 계단처럼 강 양안에 평행하게 달리는 계단선들', '강바닥 전체를 은빛으로 뒤덮은 넓은 자갈밭과 그물망처럼 얽힌 푸른 물줄기', '평탄한 단구면 위에 조성된 대규모 원형 관개 목초지(Center-pivot)'],
      cautionAndConservation: '급류 및 자갈 바닥 침강 위험으로 허가된 전망대 관람 권장'
    }
  },

  // ==========================================
  // 추가 1: 곡류천 (Meander River)
  // ==========================================
  {
    id: 'meander-kr-2',
    terrain: '곡류천',
    region: 'korea',
    placeName: '안동 하회마을 화천 감입곡류와 부용대',
    countryOrArea: '대한민국 경상북도 안동시 풍천면 하회리',
    tagline: '낙동강 물줄기가 태극 모양으로 마을을 360도 감싸 안고 흐르는 물도리동 곡류천의 절정',
    description: `### 장소 소개 및 선정 이유
유네스코 세계문화유산인 하회마을은 낙동강 지류인 화천(花川)이 마을을 S자 태극 모양으로 감싸 안고 흐른다 하여 '하회(河回, 물도리동)'라 불립니다. 맞은편 64m 높이의 깎아지른 부용대 절벽과 넓은 백사장이 공격사면과 활주사면의 완벽한 지형 대조를 보여줍니다.

### 과학적 형성 과정
낙동강이 중생대 퇴적암 지대를 굽이쳐 흐르면서 바깥쪽은 빠른 유속으로 암반을 깎아 부용대 급절벽(공격사면)을 만들고, 안쪽은 느린 유속으로 모래를 쌓아 만송정 솔숲과 백사장(활주사면)을 형성했습니다.`,
    formationProcess: '하천 사행의 원심력에 의한 외측 공격사면 절벽 침식 및 내측 활주사면 모래 퇴적',
    observationPoints: ['부용대 정상에서 내려다보는 하회마을 전경', '물길 안쪽 만송정 솔숲과 백사장', 'S자로 휘도는 화천 물길'],
    mapQuery: '안동 하회마을 부용대',
    geology: {
      geologicalAge: '중생대 백악기 경상누층군 하산동층',
      rockType: '적갈색 이암 및 사암',
      tectonicSetting: '경상분지 의성소분지 북서부',
      geomorphicAgent: '하천 측방 침식 및 포인트 바(Point Bar) 모래 퇴적',
      scale: { lengthKm: 4.5, elevationMeters: 64 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 하천 퇴적암 형성', timeframe: '약 1억 년 전', process: '공룡 시대 붉은 모래와 진흙이 굳어 단단한 암반 형성', visualKeyFeature: '수평 줄무늬가 선명한 붉은 암벽' },
      { stageNumber: 2, title: '하천 굽이침과 차별 침식', timeframe: '신생대', process: '물길이 바깥쪽 암벽을 계속 때려 64m 높이 부용대 절벽 형성', visualKeyFeature: '강물을 내려다보는 수직 바위 절벽' },
      { stageNumber: 3, title: '하회 백사장과 마을 터 안착', timeframe: '현재', process: '안쪽에 모래가 쌓여 비옥한 터가 마련되고 풍산 류씨 씨족마을 정착', visualKeyFeature: '연꽃이 물 위에 뜬 형국의 길지' }
    ],
    fieldGuide: {
      bestVisitingSeason: '가을 안개 낀 아침 및 벚꽃 피는 봄',
      satelliteCheckPoints: ['S자로 마을을 한 바퀴 감아 도는 낙동강의 뚜렷한 리본형 물길', '마을 맞은편 북측의 수직 암벽 부용대 그림자'],
      cautionAndConservation: '전통 가옥 및 문화재 보호구역 준수'
    }
  },
  {
    id: 'meander-kr-3',
    terrain: '곡류천',
    region: 'korea',
    placeName: '순천만 동천·이사천 자유곡류천과 S자 갯골',
    countryOrArea: '대한민국 전라남도 순천시 대대동 순천만',
    tagline: '광활한 갈대밭과 갯벌을 부드럽게 가르며 바다로 흘러드는 은빛 S자 곡류 수로',
    description: `### 장소 소개 및 선정 이유
세계자연유산 순천만의 동천과 이사천은 하류 평탄면과 갯벌 지대를 자유롭게 사행(Free Meander)하며 바다로 나아가는 전형적인 저지대 자유곡류천과 감조 하천 지형입니다.

### 과학적 형성 과정
하천 경사가 거의 0에 가까운 해안 저평지에서 조석의 밀물과 썰물이 하천수와 만나 유속이 느려지면서, 가장 작은 저항선을 찾아 좌우로 자유롭게 굽이치는 S자 곡류 갯골을 형성했습니다.`,
    formationProcess: '극저경사 해안 평야에서의 조석 간만 및 유수 상호작용에 의한 자유 사행',
    observationPoints: ['용산전망대에서 내려다보는 S자 해질녘 물길', '540만㎡의 광활한 갈대밭 군락', '칠면초 군락과 둥근 갈대 원형환'],
    mapQuery: '순천만습지 용산전망대',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 6,000년 전~현재)',
      rockType: '하천 및 조간대 실트·점토 퇴적물',
      tectonicSetting: '남해안 침강 해안 만입부',
      geomorphicAgent: '하천 퇴적 및 일 2회 조석 순환',
      scale: { areaKm2: 21.6 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '후빙기 해수면 안정', timeframe: '약 6,000년 전', process: '순천만에 바닷물이 차오르고 하구에 미세 점토 퇴적', visualKeyFeature: '넓은 진흙 갯벌' },
      { stageNumber: 2, title: '동천 토사 공급과 갈대 정착', timeframe: '수천 년간', process: '동천이 실어 온 토사가 쌓이며 거대한 갈대 군락 형성', visualKeyFeature: '바다로 뻗어나가는 갈대숲' },
      { stageNumber: 3, title: 'S자 곡류 갯골 완성', timeframe: '현재', process: '일몰 시 붉게 물드는 은빛 S자 물길과 흑두루미 월동지 안착', visualKeyFeature: '황금빛 갈대와 어우러진 붉은 노을 물길' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~12월 갈대꽃 절정과 흑두루미 월동 시즌',
      satelliteCheckPoints: ['갯벌 한가운데 리본처럼 구불구불 이어지는 S자 조수로', '원형으로 자라난 갈대 섬들'],
      cautionAndConservation: '철새 서식지 보호를 위해 정숙 및 플래시 촬영 금지'
    }
  },
  {
    id: 'meander-wd-2',
    terrain: '곡류천',
    region: 'world',
    placeName: '미국 미시시피강 자유곡류천과 우각호 (Oxbow Lake)',
    countryOrArea: '미국 아칸소주·미시시피주 경계 충적 평야',
    tagline: '광대한 대평원을 뱀처럼 굽이치다 지름길을 뚫어 버려진 말굽 모양 호수(우각호)의 교과서',
    description: `### 장소 소개 및 선정 이유
미국 대륙을 관통하는 미시시피강 하류는 전 세계에서 가장 전형적이고 방대한 규모의 자유곡류천(Free Meander) 지대로, 심하게 굽이치던 물길의 목(Neck)이 홍수로 잘려 나가면서 생긴 우각호(Oxbow Lake)와 구하도가 무수히 널려 있습니다.

### 과학적 형성 과정
완만한 충적 평야에서 하천이 곡류를 거듭하며 고리 모양으로 팽창하다가, 대홍수 시 가장 좁아진 목 부분을 직선으로 관통하는 슈트 컷오프(Chute Cutoff)가 일어납니다. 버려진 옛 물길 양 끝에 모래가 쌓여 차단되면서 소뿔 모양의 호수인 우각호가 탄생합니다.`,
    formationProcess: '자유 사행천의 곡경 팽창 후 홍수기 하도 절단(Cutoff) 및 하도 양단 차단',
    observationPoints: ['치코 호수(Lake Chicot) 거대 우각호', '본류 옆에 남아 있는 초승달 모양 옛 물길 흔적', '자연제방과 배후습지 단면'],
    mapQuery: 'Lake Chicot State Park Arkansas USA',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 말~홀로세',
      rockType: '미시시피 충적 실트, 점토, 미세 모래',
      tectonicSetting: '북미 대륙 내부 미시시피 침강 분지',
      geomorphicAgent: '대하천 자유 사행 및 홍수 범람 하도 전이',
      scale: { lengthKm: 35, areaKm2: 20 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '평야 위 자유 사행 팽창', timeframe: '수천 년 전', process: '측방 침식으로 곡류 루프가 원에 가깝게 부풀어 오름', visualKeyFeature: '극단적으로 부풀어 오른 뱀 물길' },
      { stageNumber: 2, title: '대홍수와 목(Neck) 절단', timeframe: '수백 년 전', process: '홍수로 불어난 물이 좁아진 목을 직선으로 뚫고 직류화', visualKeyFeature: '직선 지름길로 쏟아지는 강물' },
      { stageNumber: 3, title: '양단 폐색과 우각호 탄생', timeframe: '현재', process: '퇴적물이 옛 물길 입구를 막아 초승달 모양 독립 호수 안착', visualKeyFeature: '강 옆에 고요히 남겨진 말굽형 호수' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄과 가을 철새 이동기',
      satelliteCheckPoints: ['미시시피강 주변을 따라 도열한 수십 개의 초승달 모양 호수들', '강이 끊어지며 남긴 나이테 모양의 옛 포인트 바 줄무늬'],
      cautionAndConservation: '습지 악어 및 곤충 주의'
    }
  },

  // ==========================================
  // 추가 2: 선상지 (Alluvial Fan)
  // ==========================================
  {
    id: 'fan-kr-3',
    terrain: '선상지',
    region: 'korea',
    placeName: '경주 남산 서편 선상지',
    countryOrArea: '대한민국 경상북도 경주시 남산동 일원',
    tagline: '신라 천년의 불교 유적을 품은 경주 분지 산록의 전형적 충적 선상지',
    description: `### 장소 소개 및 선정 이유
경주 남산 서편 자락은 화강암 산지에서 발원한 소하천들이 형산강 분지 평야로 쏟아져 나오며 모래와 자갈을 부채꼴로 퇴적시킨 역사와 자연이 공존하는 선상지입니다.

### 과학적 형성 과정
남산 화강암 산괴의 심한 풍화 쇄설토가 집중 호우 시 급경사 계곡을 따라 운반되다가, 형산강 단층곡 평탄면에 진입하면서 유속이 급감하여 완경사의 부채꼴 선상지면을 형성했습니다.`,
    formationProcess: '남산 화강암 풍화 쇄설토의 산록 탈출구 방사상 퇴적',
    observationPoints: ['남산 서록의 완만한 부채꼴 경사면', '선정부의 굵은 화강암 자갈', '선단부의 논농사 지대'],
    mapQuery: '경주 남산 서편',
    geology: {
      geologicalAge: '신생대 제4기 충적층',
      rockType: '불국사화강암 풍화 조립사 및 자갈',
      tectonicSetting: '양산단층대 동측 경주 분지',
      geomorphicAgent: '산록 사면 유수 퇴적',
      scale: { areaKm2: 3.8 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '화강암 심층 풍화', timeframe: '플라이스토세', process: '남산 암석이 잘게 부서져 토사 공급원 마련', visualKeyFeature: '화강암 마사토 사면' },
      { stageNumber: 2, title: '급류 운반과 선상지 퇴적', timeframe: '홀로세', process: '골짜기 입구마다 부채꼴 자갈 둔덕 형성', visualKeyFeature: '방사상 퇴적 부채면' },
      { stageNumber: 3, title: '신라 왕경 및 사찰 입지', timeframe: '삼국시대~현재', process: '배수가 좋고 조망이 뛰어난 선상지면에 포석정 등 유적 분포', visualKeyFeature: '솔숲과 고분이 어우러진 평화로운 경관' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄 벚꽃 및 가을 단풍철',
      satelliteCheckPoints: ['남산 등고선이 평지와 만나는 지점에 둥글게 퍼져나간 완경사면'],
      cautionAndConservation: '국립공원 사적지 보호구역 준수'
    }
  },

  // ==========================================
  // 추가 3: 삼각주 (Delta)
  // ==========================================
  {
    id: 'delta-wd-2',
    terrain: '삼각주',
    region: 'world',
    placeName: '미국 미시시피강 조족상 삼각주 (Bird-foot Delta)',
    countryOrArea: '미국 루이지애나주 멕시코만 해안',
    tagline: '멕시코만 바다를 향해 새의 발가락처럼 사방으로 뻗어나간 지구상 가장 대표적인 조족상 삼각주',
    description: `### 장소 소개 및 선정 이유
미시시피강 하구 삼각주는 북미 대륙 전체에서 운반된 막대한 토사가 멕시코만의 잔잔한 바다로 유입되면서, 여러 갈래의 분류(Distributaries) 수로를 따라 새 발가락(Bird-foot) 모양으로 바다를 파고든 세계 지형학의 최고 교과서입니다.

### 과학적 형성 과정
파도와 조류의 힘이 약하고 강이 운반하는 토사의 양이 압도적인 해양 환경에서, 강줄기 양옆에 자연제방이 길게 바다 쪽으로 뻗어나가면서 제방 사이에 수로가 생겨 새 발 모양의 돌출형 삼각주를 완성했습니다.`,
    formationProcess: '하천 우세형(Fluvial-dominated) 해안에서 자연제방 전진에 따른 조족상(Bird-foot) 퇴적',
    observationPoints: ['새 발가락 모양의 분류 수로망', '수로 양옆의 자연제방(Levee) 도로', '배후의 광활한 소금 습지(Salt Marsh)'],
    mapQuery: 'Mississippi River Delta Louisiana USA',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 발라드 삼각주 엽(약 1,000년 전~현재)',
      rockType: '미세 모래, 실트, 유기질 점토',
      tectonicSetting: '멕시코만 대륙붕 수동형 주변부(Passive Margin)',
      geomorphicAgent: '하천 퇴적 우세 및 점토 다짐 침하',
      scale: { areaKm2: 12000, lengthKm: 150 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '미시시피 토사 운반', timeframe: '수천 년간', process: '연간 수억 톤의 진흙과 모래가 하구로 집중', visualKeyFeature: '황토빛 강물이 바다로 분출' },
      { stageNumber: 2, title: '자연제방 연장과 수로 분기', timeframe: '약 1,000년 전', process: '수로 양옆에 제방이 쌓이며 바다 깊숙이 새 발가락처럼 돌출', visualKeyFeature: '바다 한가운데로 뻗어가는 가늘고 긴 둑길' },
      { stageNumber: 3, title: '현대 조족상 삼각주 안착', timeframe: '현재', process: '뉴올리언스 남단 해안선에 세계 최대 규모의 하천 우세 삼각주 위용', visualKeyFeature: '위성에서 선명하게 보이는 거대한 새 발 모양' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~4월 (온화하고 허리케인 위험이 적은 계절)',
      satelliteCheckPoints: ['멕시코만의 짙푸른 바다 속으로 손가락처럼 길게 뻗어나간 황갈색 퇴적 수로들'],
      cautionAndConservation: '해수면 상승 및 지반 침하로 인한 습지 보존 이슈 지역'
    }
  },

  // ==========================================
  // 추가 4: 하안단구 (River Terrace)
  // ==========================================
  {
    id: 'terrace-kr-2',
    terrain: '하안단구',
    region: 'korea',
    placeName: '정선 동강 귤암리 다단 하안단구',
    countryOrArea: '대한민국 강원특별자치도 정선군 정선읍 귤암리',
    tagline: '동강의 깊은 석회암 협곡 벽에 선명하게 새겨진 3단 계단식 옛 강바닥 지형',
    description: `### 장소 소개 및 선정 이유
동강 최상류 귤암리 일대는 강변 절벽을 따라 고도가 서로 다른 3~4개의 평탄면이 계단처럼 층을 이루고 있는 전형적인 융기성 하안단구 지형으로, 천연기념물 동강할미꽃의 자생지로도 유명합니다.

### 과학적 형성 과정
신생대 제3기 말부터 시작된 한반도의 비대칭 요곡 융기 운동 과정에서 지반이 간헐적으로 솟아오를 때마다 동강이 암반을 수직으로 파고들어 새로운 골짜기를 만들고, 옛 하상(강바닥)은 절벽 위의 평탄한 계단으로 남았습니다.`,
    formationProcess: '태백산맥 간헐적 지반 융기 및 하천 침식 부활에 의한 다단 침식 계단 형성',
    observationPoints: ['고도별 3단 평탄 단구면', '단구면에 퇴적된 둥근 강자갈층', '동강 수직 암벽의 동강할미꽃'],
    mapQuery: '정선 동강 귤암리',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~홀로세',
      rockType: '조선누층군 정선 석회암 위 하천 둥근 자갈층',
      tectonicSetting: '옥천대 정선 카르스트 협곡',
      geomorphicAgent: '지반 융기 및 감입곡류 하천 하방 굴착',
      scale: { depthMeters: 80, lengthKm: 5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고기 하천 평탄 하상', timeframe: '약 15만 년 전', process: '동강이 현재보다 80m 높은 위치에서 자갈을 깔며 흐름', visualKeyFeature: '산 위에 넓게 깔린 둥근 강돌밭' },
      { stageNumber: 2, title: '간헐적 지반 융기와 하각', timeframe: '수만 년간', process: '땅이 계단식으로 들릴 때마다 강물이 바닥을 깎아 3단 계단 형성', visualKeyFeature: '절벽 옆에 층층이 생긴 평평한 선반 지형' },
      { stageNumber: 3, title: '취락 및 과수원 이용', timeframe: '현재', process: '홍수가 닿지 않는 단구 평탄면에 마을과 사과 과수원 안착', visualKeyFeature: '동강 푸른 물길과 층층이 늘어선 평화로운 마을' }
    ],
    fieldGuide: {
      bestVisitingSeason: '4월 동강할미꽃 개화기 및 가을 단풍철',
      satelliteCheckPoints: ['동강 물줄기를 따라 협곡 사면에 계단식으로 형성된 평평한 밭자리들'],
      cautionAndConservation: '동강할미꽃 훼손 및 채취 금지'
    }
  },

  // ==========================================
  // 추가 5: 폭포 (Waterfall)
  // ==========================================
  {
    id: 'waterfall-kr-1',
    terrain: '폭포',
    region: 'korea',
    placeName: '제주 서귀포 정방폭포 (해안 직하 폭포)',
    countryOrArea: '대한민국 제주특별자치도 서귀포시 칠십리로 214번길',
    tagline: '높이 23m의 은빛 물줄기가 검은 주상절리 절벽에서 푸른 바다로 곧장 꽂히는 동양 유일의 해안 폭포',
    description: `### 장소 소개 및 선정 이유
명승 제43호인 정방폭포는 폭포수가 육상 하천을 거치지 않고 검은 현무암 주상절리 해식애(해안 절벽)에서 에메랄드빛 바다로 직접 떨어지는 동양에서 보기 드문 해안 직하형 폭포입니다.

### 과학적 형성 과정
한라산에서 분출한 조면안산암 용암류가 식으면서 수직 주상절리가 발달했고, 이후 해수면 상승으로 파도가 절벽 밑동을 깎아 수직 해식애를 만들었습니다. 하천이 이 절벽을 만나 낙차 23m의 해안 폭포가 되었습니다.`,
    formationProcess: '용암류 냉각 주상절리 및 파도 침식 해식애 단애면에 하천 낙하',
    observationPoints: ['바다로 직접 쏟아지는 23m 물줄기', '폭포 벽을 이루는 육각형 주상절리 바위', '폭포 주변 몽돌 해변'],
    mapQuery: '서귀포 정방폭포',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 서귀포 조면안산암류',
      rockType: '조면안산암질 현무암 및 기둥 모양 주상절리',
      tectonicSetting: '제주 화산도 남사면 해안선',
      geomorphicAgent: '파도에 의한 해식애 절벽 굴착 및 하천 낙하',
      scale: { depthMeters: 23, lengthKm: 0.1 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '조면안산암 용암 분출', timeframe: '약 40만 년 전', process: '용암이 두껍게 굳으며 수직 기둥(주상절리) 형성', visualKeyFeature: '거대한 육각 바위 기둥들' },
      { stageNumber: 2, title: '파도의 해식애 굴착', timeframe: '후빙기', process: '파도가 바위를 때려 23m 수직 낭떠러지 완성', visualKeyFeature: '바다와 맞닿은 깎아지른 절벽' },
      { stageNumber: 3, title: '해안 직하 폭포 탄생', timeframe: '현재', process: '동홍천 물줄기가 바다로 곧장 낙하하는 환상적인 절경 안착', visualKeyFeature: '푸른 바다로 하얗게 쏟아지는 물보라' }
    ],
    fieldGuide: {
      bestVisitingSeason: '여름철 장마 후 수량 풍부한 시기 (시원한 물보라 장관)',
      satelliteCheckPoints: ['서귀포 해안선 절벽에서 바다로 하얗게 쏟아지는 폭포 낙하지점'],
      cautionAndConservation: '젖은 해변 갯바위 미끄럼 주의'
    }
  },
  {
    id: 'waterfall-kr-2',
    terrain: '폭포',
    region: 'korea',
    placeName: '철원 한탄강 삼부연폭포',
    countryOrArea: '대한민국 강원특별자치도 철원군 갈말읍 신철원리',
    tagline: '가마솥 모양의 3단 돌개구멍 소(沼)를 뚫고 쏟아지는 20m 높이의 화강암 협곡 폭포',
    description: `### 장소 소개 및 선정 이유
명승 제84호이자 겸재 정선의 진경산수화 소재로 유명한 삼부연(三釜淵)폭포는 물줄기가 세 번 꺾어지며 가마솥(釜) 모양의 깊은 웅덩이 세 개를 뚫고 쏟아져 내리는 한국 하식 폭포의 백미입니다.

### 과학적 형성 과정
중생대 쥐라기 화강암 절벽을 흐르던 하천 급류가 회전하며 소용돌이치는 자갈 마식 작용(포트홀 굴착)과 단열선을 따라 하방 침식을 일으켜, 상·중·하 3개의 거대한 가마솥 소와 20m 높이의 폭포를 조각했습니다.`,
    formationProcess: '화강암 절리 단애면의 하천 유수 침식 및 자갈 마모에 의한 3단계 포트홀(Pothole) 굴착',
    observationPoints: ['노귀소·가마소·용소 3단 가마솥 웅덩이', '20m 수직 화강암 절벽', '겸재 정선 그림 속 구도와의 일치'],
    mapQuery: '철원 삼부연폭포',
    geology: {
      geologicalAge: '중생대 쥐라기 대보화강암 (약 1억 7,000만 년 전)',
      rockType: '흑운모 화강암',
      tectonicSetting: '추가령 구조곡 동측 명성산 지괴',
      geomorphicAgent: '하천 급류 자갈 소용돌이 마식(Cavitation & Abrasion)',
      scale: { depthMeters: 20 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '쥐라기 지하 화강암 관입', timeframe: '약 1억 7,000만 년 전', process: '마그마가 지하에서 식어 단단한 화강암 암반 형성', visualKeyFeature: '치밀한 백색 화강암 암괴' },
      { stageNumber: 2, title: '지반 융기와 계곡 급류 침식', timeframe: '신생대', process: '급류에 자갈이 회전하며 바닥에 3개의 깊은 원형 구멍(포트홀)을 뚫음', visualKeyFeature: '바위에 뚫린 3개의 둥근 가마솥 웅덩이' },
      { stageNumber: 3, title: '삼부연 명승 완성', timeframe: '현재', process: '사계절 마르지 않는 신비로운 3단 폭포의 위용 안착', visualKeyFeature: '비경을 이루는 에메랄드빛 소와 물줄기' }
    ],
    fieldGuide: {
      bestVisitingSeason: '비 온 뒤 여름철 (우레 같은 굉음과 풍부한 수량)',
      satelliteCheckPoints: ['명성산 북서쪽 좁은 계곡 길목에 위치한 폭포 전망대'],
      cautionAndConservation: '수심이 깊어 물놀이 절대 금지'
    }
  },
  {
    id: 'waterfall-wd-1',
    terrain: '폭포',
    region: 'world',
    placeName: '미국·캐나다 나이아가라 폭포 (Niagara Falls)',
    countryOrArea: '미국 뉴욕주 및 캐나다 온타리오주 경계',
    tagline: '초당 2,800톤의 빙하 호수물이 쏟아지며 매년 상류로 후퇴하는 세계 3대 대폭포',
    description: `### 장소 소개 및 선정 이유
세계 3대 폭포 중 하나인 나이아가라 폭포는 캐나다 호스슈 폭포(폭 790m, 낙차 53m)와 미국 폭포로 이루어져 있으며, 5대호의 에리호에서 온타리오호로 흐르는 거대한 물길이 쏟아져 내리는 지구상 가장 역동적인 차별 침식 폭포입니다.

### 과학적 형성 과정
상부의 단단한 록포트 백운암층 아래에 연약한 로체스터 셰일층이 받치고 있는 구조로, 쏟아지는 물살이 하부의 부드러운 셰일을 먼저 파내면 버티지 못한 상부 백운암이 무너져 내리면서 폭포가 1만 2천 년 동안 상류 쪽으로 11km나 후퇴(Waterfall Retreat)했습니다.`,
    formationProcess: '경암(백운암)과 연암(셰일)의 층서적 차별 침식 및 폭포 두부 후퇴(Headward Erosion)',
    observationPoints: ['말굽 모양의 캐나다 호스슈 폭포', '안개 숙녀호(Maid of the Mist) 유람선 물보라 체험', '11km에 걸친 나이아가라 협곡'],
    mapQuery: 'Niagara Falls Ontario Canada',
    geology: {
      geologicalAge: '고생대 실루리아기 (약 4억 3,000만 년 전) 위 후빙기 침식',
      rockType: '상부 록포트 백운암(Dolomite) 및 하부 셰일·사암 교호대',
      tectonicSetting: '북미 미시간 분지 동단 나이아가라 단애면(Niagara Cuesta)',
      geomorphicAgent: '빙하 유출 대수량의 셰일 굴식 및 백운암 블록 붕괴',
      scale: { depthMeters: 53, lengthKm: 1.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '실루리아기 단단한 백운암과 셰일 퇴적', timeframe: '약 4억 3,000만 년 전', process: '바다 밑에서 단단한 돌과 무른 진흙이 샌드위치처럼 층을 이룸', visualKeyFeature: '수평 줄무늬의 단애 암벽' },
      { stageNumber: 2, title: '빙하기 종료와 폭포 탄생', timeframe: '약 1만 2,000년 전', process: '녹아내린 빙하 물이 온타리오호 절벽으로 쏟아지며 첫 폭포 시작', visualKeyFeature: '현재보다 11km 하류에서 시작된 거대 낙수' },
      { stageNumber: 3, title: '하부 셰일 침식과 11km 후퇴', timeframe: '1만 2,000년간', process: '밑동이 파이며 바위가 무너져 매년 1m씩 상류로 뒷걸음질', visualKeyFeature: '폭포가 깎으며 지나간 깊은 나이아가라 협곡' },
      { stageNumber: 4, title: '세계적인 경관 안착', timeframe: '현재', process: '수력발전 수량 조절로 연간 30cm 후퇴 속도로 완화되며 영구 보존', visualKeyFeature: '무지개가 피어오르는 거대한 말굽 폭포' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~10월 (유람선 운항 및 야간 오색 조명쇼)',
      satelliteCheckPoints: ['5대호 연결 수로 중간에 하얗게 거품을 일으키는 호스슈 모양 폭포 라인'],
      cautionAndConservation: '물보라가 거세므로 우비 착용 및 방수 팩 필수'
    }
  },
  {
    id: 'waterfall-wd-2',
    terrain: '폭포',
    region: 'world',
    placeName: '브라질·아르헨티나 이과수 폭포 (Iguazu Falls)',
    countryOrArea: '아르헨티나 미시오네스주 및 브라질 파라나주 국경',
    tagline: '총 너비 2.7km, 275개의 물줄기가 굉음을 내지르는 \'악마의 목구멍\', 세계 최대의 폭포 시스템',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 이과수 폭포는 현지 원주민 과라니어족 말로 '큰 물(Y-Guasu)'이라는 뜻으로, 나이아가라 폭포보다 폭이 2배, 높이가 1.5배에 달하며 275개의 크고 작은 폭포군이 반원형을 이루는 지구상 최대 규모의 대폭포입니다.

### 과학적 형성 과정
중생대 곤드와나 대륙 분열 시기에 분출한 세계 최대의 파라나 현무암 용암 대지에 단층 운동으로 거대한 균열 계곡이 생겼고, 이과수강이 현무암 단애면을 깎아내며 U자형의 거대한 '악마의 목구멍(Garganta del Diablo)' 협곡을 형성했습니다.`,
    formationProcess: '파라나 홍수 현무암 대지의 테크토닉 단층 절벽 및 3단계 용암류 단애 낙하',
    observationPoints: ['우레 같은 굉음의 악마의 목구멍 전망대', '275개 폭포를 잇는 숲속 산책로', '브라질 쪽 파노라마 전경'],
    mapQuery: 'Iguazu Falls Argentina Brazil',
    geology: {
      geologicalAge: '중생대 백악기 파라나 트랩 현무암 (약 1억 3,500만 년 전)',
      rockType: '다공질 및 주상절리형 홍수 현무암(Flood Basalt)',
      tectonicSetting: '남미 대륙 내부 파라나 분지 열개 구조',
      geomorphicAgent: '대용량 하천 유수의 현무암 절리 침식 및 후퇴',
      scale: { depthMeters: 82, lengthKm: 2.7 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 거대 현무암 용암 분출', timeframe: '약 1억 3,500만 년 전', process: '남미 대륙이 찢어지며 두께 1,000m의 현무암 대지 형성', visualKeyFeature: '검고 두터운 용암 지층' },
      { stageNumber: 2, title: '단층 균열과 단애면 발생', timeframe: '신생대 제3기', process: '지각 균열로 계단식 단층 단애가 생기며 강물이 떨어짐', visualKeyFeature: '말굽 모양으로 갈라진 거대한 바위 절벽' },
      { stageNumber: 3, title: '2.7km 악마의 목구멍 완성', timeframe: '현재', process: '초당 1,500만 리터의 물이 쏟아지며 거대한 물안개 기둥을 뿜는 장관 안착', visualKeyFeature: '정글 속에서 피어오르는 거대한 수증기 구름' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄 9~11월 및 가을 3~5월 (쾌적한 기온과 적정 수량)',
      satelliteCheckPoints: ['짙은 정글 한가운데 U자형으로 깊게 파인 협곡과 하얀 물보라 분출점'],
      cautionAndConservation: '카메라 방수 대책 필수 및 야생 긴코너구리(코아티) 먹이주기 금지'
    }
  }
];

