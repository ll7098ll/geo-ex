import { PlaceInfo } from '../../types';

export const ARID_PLACES: PlaceInfo[] = [
  // ==========================================
  // 1. 사막 (Desert)
  // ==========================================
  {
    id: 'desert-kr-1',
    terrain: '사막',
    region: 'korea',
    placeName: '태안 신두리 해안사구 (한국의 사막형 모래언덕)',
    countryOrArea: '대한민국 충청남도 태안군 원북면 신두리',
    tagline: '한국에서 유일하게 사막의 풍성 연흔과 거대 모래언덕을 관찰할 수 있는 천연기념물',
    description: `### 장소 소개 및 선정 이유
우리나라는 습윤 온대 기후에 속하여 진정한 건조 사막은 존재하지 않지만, 태안 신두리 해안사구는 강한 겨울 계절풍이 모래를 날려 쌓아 만들어낸 국내에서 가장 완벽한 사막형 모래언덕 지형입니다.

### 과학적 형성 과정
해안에서 불어오는 강한 바람이 마른 모래를 지속적으로 이동시켜 바람받이 완경사와 바람그늘 급경사를 지닌 전형적인 횡사구(Transverse Dune)와 초승달 사구(Barchan) 형태를 재현하고 있습니다.

### 탐험 포인트
- **모래 물결(풍성 연흔)**: 바람이 모래알을 굴리며 표면에 새겨놓은 정교한 물결무늬
- **사구 식물 생태**: 척박하고 건조한 모래땅에 뿌리를 깊게 내린 갯메꽃과 통보리사초`,
    formationProcess: '겨울철 강풍에 의한 모래의 도약(Saltation) 이동 및 풍성 퇴적',
    observationPoints: ['정교한 바람자국(연흔)', '사구 능선의 안식각 경사', '사막 생태 적응 식물'],
    mapQuery: '태안 신두리 해안사구',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 15,000년 전 빙하기 이후~현재)',
      rockType: '풍성 세립 석영사 (Aeolian Quartz Sand)',
      tectonicSetting: '황해 연안 리아스식 해안 사구성 해빈 배후지',
      geomorphicAgent: '북서 계절풍의 풍식(Deflation) 및 풍성 퇴적(Deposition)',
      scale: { lengthKm: 3.4, areaKm2: 2.6, elevationMeters: 19 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '후빙기 해수면 상승과 모래 공급', timeframe: '약 6,000년 전', process: '황해 바다가 차오르며 연안 조류와 파도가 대량의 조립질 석영 모래를 해안으로 운반', visualKeyFeature: '넓은 갯벌과 모래 해변' },
      { stageNumber: 2, title: '강력한 겨울 북서풍의 모래 날림', timeframe: '약 3,000년 전', process: '겨울철 시베리아 고기압에서 불어오는 초속 15m 강풍이 마른 모래를 내륙으로 도약 이동', visualKeyFeature: '모래바람이 휘몰아치는 해안가' },
      { stageNumber: 3, title: '초승달형 횡사구 형성', timeframe: '조선시대~근대', process: '내륙 언덕과 식생에 걸린 모래가 쌓이며 19m 높이의 거대한 2차 사구 능선 완성', visualKeyFeature: '사막처럼 펼쳐진 모래 언덕과 물결 연흔' },
      { stageNumber: 4, title: '사구 습지와 천연기념물 보전', timeframe: '현재', process: '사구 배후에 담수 습지인 두웅습지가 형성되고 국가 천연기념물 제431호로 보호', visualKeyFeature: '갯메꽃과 모래 능선, 그리고 배후 람사르 습지' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄철 갯메꽃 개화기 및 가을철 선선한 날씨',
      satelliteCheckPoints: ['신두리 백사장 배후로 넓게 펼쳐진 활모양의 황금빛 모래언덕 지대', '모래언덕 바로 뒤편에 숨겨진 둥근 두웅습지의 담수 수면', '방풍림 소나무 숲과의 명확한 녹색/황금색 경계선'],
      cautionAndConservation: '천연기념물로 탐방용 목재 데크 벗어나 사구 밟기 엄격 금지'
    }
  },
  {
    id: 'desert-kr-2',
    terrain: '사막',
    region: 'korea',
    placeName: '신안 우이도 돈목해변 풍성사구 (모래산)',
    countryOrArea: '대한민국 전라남도 신안군 도초면 우이도리',
    tagline: '동양 최대 규모인 높이 80m, 경사 33도의 거대한 모래산 사구',
    description: `### 장소 소개 및 선정 이유
신안 다도해의 숨겨진 보물 우이도 돈목해변에는 높이 80m, 밑변 길이 150m에 달하는 거대한 모래산(풍성사구)이 솟아 있습니다. 한국의 미니 사하라 사막으로 불릴 만큼 경이로운 모래 지형입니다.

### 과학적 형성 과정
겨울철 북서풍이 돈목해변의 미세한 모래를 산비탈을 따라 밀어 올려, 모래가 무너지지 않고 쌓일 수 있는 최대 각도인 '안식각(약 32~34도)'의 가파른 모래절벽을 형성했습니다.`,
    formationProcess: '겨울철 강풍에 의한 해빈 모래의 산사면 상승 도약 및 안식각 퇴적',
    observationPoints: ['높이 80m 모래산 능선', '33도의 가파른 슬립페이스 경사', '바람이 매일 바꾸어 놓는 모래 물결'],
    mapQuery: '우이도 모래산',
    geology: {
      geologicalAge: '신생대 제4기 홀로세',
      rockType: '균질한 세립질 석영 모래',
      tectonicSetting: '남서해 다도해 외해 노출 도서',
      geomorphicAgent: '강한 겨울 북서 계절풍 풍성 상승류',
      scale: { elevationMeters: 80, lengthKm: 0.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '다도해 조류에 의한 모래 공급', timeframe: '약 5,000년 전', process: '외해 조류와 파도가 돈목해변에 고운 석영 모래를 지속적으로 퇴적', visualKeyFeature: '은빛 모래톱이 넓게 펼쳐진 해안선' },
      { stageNumber: 2, title: '계절풍의 사면 풍상 운반', timeframe: '수천 년간 지속', process: '겨울철 북서풍이 해변 모래를 뒤편 바위산 사면으로 불어 올림', visualKeyFeature: '바위산을 덮으며 자라나는 모래 경사면' },
      { stageNumber: 3, title: '80m 모래산 완성', timeframe: '근대', process: '바람받이 완경사와 바람그늘 급경사가 완벽한 균형을 이루며 동양 최대 사구 안착', visualKeyFeature: '수직에 가까운 웅장한 황금빛 모래산' },
      { stageNumber: 4, title: '사구 보존과 생태 복원', timeframe: '현재', process: '사구 훼손 방지를 위해 출입 통제 및 자연 풍성 프로세스 지속 관찰', visualKeyFeature: '바람에 실려 매일 새로운 결을 짓는 모래산' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄과 가을 (목포항에서 쾌속선 운항 확인 필수)',
      satelliteCheckPoints: ['우이도 만입부 안쪽에 삼각형 형태로 산을 타고 오른 백색 모래 지대', '돈목해수욕장과 성촌해수욕장 사이의 모래 능선선', '사구 배후의 울창한 동백나무 군락'],
      cautionAndConservation: '사구 붕괴 방지 휴식년제로 직접 등반 금지 및 전망대 관람'
    }
  },
  {
    id: 'desert-kr-3',
    terrain: '사막',
    region: 'korea',
    placeName: '대구 달성 옥연지 하중도 사구 모래톱',
    countryOrArea: '대한민국 대구광역시 달성군 옥포읍 기세리',
    tagline: '낙동강 지류의 건조기 퇴적 작용으로 형성된 내륙 모래벌판',
    description: `### 장소 소개 및 선정 이유
내륙 하천변 건조 환경에서 바람과 유수가 빚어낸 독특한 모래 퇴적 지형으로, 비가 적은 영남 내륙 분지의 기후적 특성을 반영하는 하천 풍성 복합 지형입니다.

### 과학적 형성 과정
낙동강 지류 기세천의 유속이 느려지며 퇴적된 모래가 갈수기 건조한 대기에 노출된 후, 분지 바람에 의해 2차 이동하며 미세 사구와 연흔을 만듭니다.`,
    formationProcess: '하천 퇴적 모래의 갈수기 노출 및 분지 바람에 의한 미세 풍성 사구화',
    observationPoints: ['하천변 미세 모래톱 연흔', '갈수기 건열 및 풍성 퇴적 패턴', '옥연지 둘레길 조망'],
    mapQuery: '옥연지 송해공원',
    geology: {
      geologicalAge: '신생대 제4기 충적층',
      rockType: '하천 풍성 세립사 및 실트',
      tectonicSetting: '경상분지 내륙 침식 분지 하천변',
      geomorphicAgent: '하천 유수 퇴적 및 국지풍 재퇴적',
      scale: { areaKm2: 0.3 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '영남 분지 하천 토사 운반', timeframe: '홀로세', process: '비슬산 화강암 풍화토가 하천을 타고 흘러내림', visualKeyFeature: '모래자갈 하천' },
      { stageNumber: 2, title: '갈수기 건조 노출', timeframe: '매년 겨울~봄', process: '수위가 낮아지며 넓은 모래밭이 햇빛에 바짝 마름', visualKeyFeature: '드러난 황갈색 모래톱' },
      { stageNumber: 3, title: '국지풍에 의한 모래 재배열', timeframe: '현재', process: '분지 골바람이 모래 표면에 잔물결 연흔 형성', visualKeyFeature: '물결 모양 바람 자국' },
      { stageNumber: 4, title: '수변 공원 및 생태 보전', timeframe: '현재', process: '옥연지 생태 습지와 어우러진 지질 탐방로 조성', visualKeyFeature: '둘레길과 모래톱 풍경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄철 벚꽃 시즌 및 가을철',
      satelliteCheckPoints: ['옥연지 수면 상류부 모래 퇴적지', '비슬산 자락과 연결된 하천 합류부'],
      cautionAndConservation: '수변 안전 펜스 준수'
    }
  },
  {
    id: 'desert-wd-1',
    terrain: '사막',
    region: 'world',
    placeName: '나미비아 소수스블레이 & 듄 45 (Sossusvlei)',
    countryOrArea: '나미비아 나미브-나우클루프트 국립공원',
    tagline: '5,500만 년 전 생성된 세계에서 가장 오래된 나미브 사막의 300m 붉은 별사구 군락',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 나미브 사막의 소수스블레이는 철분이 산화되어 붉게 물든 300m 높이의 거대한 별사구(Star Dune)들이 하얀 소금 점토판과 극적인 대비를 이루는 지구상에서 가장 아름다운 모래사막입니다.

### 과학적 형성 과정
오렌지강에서 대서양으로 유입된 모래가 벵겔라 해류를 타고 북상한 뒤, 바다에서 불어오는 남서풍과 내륙에서 불어오는 동풍이 서로 충돌하며 모래를 높게 밀어 올려 다방향 칼날 능선을 지닌 거대한 별사구를 완성했습니다.`,
    formationProcess: '해양 한류(벵겔라 해류)에 의한 대기 하강 건조화 및 복합 풍향 충돌에 따른 초대형 별사구 집적',
    observationPoints: ['높이 300m의 적색 빅대디 사구', '데드블레이(Dead Vlei)의 900년 된 고사목', '새벽빛에 살아나는 칼날 모래 능선'],
    mapQuery: 'Sossusvlei Dune 45 Namibia',
    geology: {
      geologicalAge: '고진기 팔레오세 (약 5,500만 년 전 시작된 지구 최고령 사막)',
      rockType: '철분 산화막(헤마타이트)으로 코팅된 붉은 석영 모래',
      tectonicSetting: '남아프리카 서안 수동형 대륙 연변부',
      geomorphicAgent: '다방향 풍계(Multidirectional Wind System)에 의한 수직 수렴 집적',
      scale: { elevationMeters: 380, areaKm2: 32000 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '벵겔라 해류와 사막화 시작', timeframe: '약 5,500만 년 전', process: '남극에서 올라오는 차가운 해류가 비구름 생성을 막아 극도의 해안 건조 사막 출현', visualKeyFeature: '비가 내리지 않는 메마른 해안 대지' },
      { stageNumber: 2, title: '오렌지강 모래의 북상 공급', timeframe: '약 500만 년 전', process: '내륙에서 흘러나온 강 모래를 대서양 연안류가 북쪽으로 실어 날라 해안에 투하', visualKeyFeature: '해안선에 끝없이 쌓이는 황금빛 모래톱' },
      { stageNumber: 3, title: '철분 산화와 붉은 변색', timeframe: '수백만 년간 지속', process: '바람에 실려 내륙으로 이동한 모래 입자 표면의 철분이 산화되어 진한 다홍빛으로 변색', visualKeyFeature: '나이가 들수록 붉게 불타오르는 모래언덕' },
      { stageNumber: 4, title: '300m 별사구와 데드블레이 완성', timeframe: '현재', process: '남서풍과 동풍이 맞부딪치며 300m 높이로 치솟고 차우찹강이 마른 바닥엔 소금판 형성', visualKeyFeature: '흰 소금밭 위 검은 고사목과 거대한 붉은 모래언덕' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 나미비아 겨울철 (낮 기온 20~25℃로 사막 트레킹 최적기)',
      satelliteCheckPoints: ['대서양 해안선에서 내륙으로 수백 km 뻗어 있는 거대한 붉은 모래 바다(Sand Sea)', '차우찹(Tsauchab) 강물이 사막을 뚫고 들어가다 멈춘 하얀 백색 점토판 원형 구역', '별사구 꼭짓점에서 세 갈래로 뻗어나간 날카로운 능선선'],
      cautionAndConservation: '사막 한낮 45℃ 고온 탈수 주의 및 4륜구동(4WD) 차량 필수'
    }
  },
  {
    id: 'desert-wd-2',
    terrain: '사막',
    region: 'world',
    placeName: '모로코 사하라 사막 에르그 셰비 (Erg Chebbi Dunes)',
    countryOrArea: '모로코 드라타필라레트 메르주가',
    tagline: '사하라 사막의 관문, 150m 높이의 황금빛 횡사구와 초승달 바르한 모래 바다',
    description: `### 장소 소개 및 선정 이유
사하라 사막의 정수를 보여주는 에르그 셰비(Erg Chebbi)는 면적 110㎢에 걸쳐 높이 150m에 달하는 거대한 모래언덕들이 물결치듯 펼쳐진 세계 최고의 모래바다 사막입니다.

### 과학적 형성 과정
아틀라스 산맥 너머에서 불어오는 사하라 건조풍(시로코)이 미세한 모래 입자를 끊임없이 굴리고 도약시켜, 완만한 바람받이 사면과 급경사의 슬립페이스(Slip Face)를 가진 초승달 사구(Barchan)들을 대규모로 집적시켰습니다.`,
    formationProcess: '북아프리카 아열대 고압대 하강기류에 의한 극건조화 및 편서풍계 풍성 사구군 발달',
    observationPoints: ['높이 150m의 최고봉 대사구', '해 질 녘 황금색에서 붉은 자주색으로 변하는 사구면', '베두인 낙타 캐러밴 루트'],
    mapQuery: 'Erg Chebbi Merzouga Morocco',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~홀로세',
      rockType: '순도 높은 석영사 및 장석질 사립',
      tectonicSetting: '사하라 플랫폼 북단 아틀라스 조산대 전면 침강지',
      geomorphicAgent: '단방향 풍계의 지속적 염호 및 풍성 도약 집적',
      scale: { areaKm2: 110, elevationMeters: 150 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '사하라 녹색기 종료와 건조화', timeframe: '약 5,000년 전', process: '지구 세차운동으로 아프리카 몬순이 약화되며 초원이 급격히 사막으로 전환', visualKeyFeature: '말라붙은 호수와 일어나는 모래폭풍' },
      { stageNumber: 2, title: '강풍에 의한 미세 모래 분류', timeframe: '수천 년간 지속', process: '바람이 무거운 자갈은 뒤에 남기고 고운 모래만 메르주가 분지에 집중 퇴적', visualKeyFeature: '황금빛 모래 언덕들이 솟아오름' },
      { stageNumber: 3, title: '초승달 바르한과 횡사구 연계', timeframe: '현재', process: '일정한 풍향에 따라 모래 능선이 직각 방향으로 파도치듯 배열', visualKeyFeature: '끝없는 모래 파도의 지평선' },
      { stageNumber: 4, title: '사막 캠핑 및 천문 관측 명소', timeframe: '현재', process: '전 세계 여행자들이 별빛과 일출을 찾는 사하라의 상징적 명소 안착', visualKeyFeature: '밤하늘 은하수 아래 고요한 모래언덕' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~4월 (한낮에도 25℃ 안팎으로 쾌적)',
      satelliteCheckPoints: ['검은 자갈 사막(레그) 한가운데 뚜렷한 주황색 섬처럼 솟은 직사각형 모래바다 구역', '메르주가 오아시스 마을과의 극명한 색상 대비'],
      cautionAndConservation: '모래폭풍(하맘) 대비 방풍 고글 및 스카프 지참'
    }
  },
  {
    id: 'desert-wd-3',
    terrain: '사막',
    region: 'world',
    placeName: '칠레 아타카마 사막 달의 계곡 (Valle de la Luna)',
    countryOrArea: '칠레 안토파가스타주 산페드로데아타카마',
    tagline: '수백만 년 동안 비가 내리지 않은 지구상에서 가장 건조한 화성·달 표면 사막',
    description: `### 장소 소개 및 선정 이유
칠레 북부 해발 2,400m 고원에 위치한 아타카마 사막의 '달의 계곡'은 NASA가 화성 탐사 로봇(로버)의 주행 시험장으로 사용할 만큼 지구상에서 외계 행성과 가장 유사한 극건조 사막 지형입니다.

### 과학적 형성 과정
안데스 산맥이 동쪽의 아마존 비구름을 차단하는 비그늘(Rain Shadow) 효과와, 서쪽 태평양의 차가운 훔볼트 해류가 상승기류를 억제하는 이중 차단 효과로 연 강수량이 1mm 미만인 초건조 환경이 형성되었습니다. 바람에 깎인 암염과 점토층이 기괴한 첨탑과 협곡을 이루고 있습니다.`,
    formationProcess: '안데스 산맥 비그늘과 한류의 결합에 의한 극단적 초건조 풍화 및 암염 침식',
    observationPoints: ['순백의 소금으로 덮인 암염 지층', '바람이 깎아낸 코요테 바위(Piedra del Coyote)', '일몰 시 붉게 불타는 안데스 설산'],
    mapQuery: 'Valle de la Luna Atacama Chile',
    geology: {
      geologicalAge: '중신세 말기~제4기 (약 1,000만 년 전~현재)',
      rockType: '암염(Halite), 석고, 점토 및 응회암 호층',
      tectonicSetting: '나스카판 섭입에 따른 안데스 전호 고원 분지',
      geomorphicAgent: '바람에 의한 극한 풍식(Deflation) 및 미세 조해 작용',
      scale: { areaKm2: 105000, elevationMeters: 2407 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고대 소금 호수 증발', timeframe: '약 1,000만 년 전', process: '융기된 내륙 분지에 갇힌 호수가 증발하며 두터운 암염과 점토 지층 형성', visualKeyFeature: '하얀 소금과 진흙이 굳은 평탄면' },
      { stageNumber: 2, title: '안데스 조산 압축 변형', timeframe: '약 500만 년 전', process: '판 충돌 압력으로 수평 소금 지층이 습곡되고 수직으로 곧추섬', visualKeyFeature: '칼날처럼 일어선 암염 지층 절벽' },
      { stageNumber: 3, title: '수백만 년의 극한 건조 풍식', timeframe: '현재까지', process: '비가 전혀 내리지 않는 환경에서 모래바람만이 바위를 날카롭게 연마', visualKeyFeature: '외계 달 표면 같은 황량한 크레이터 풍경' },
      { stageNumber: 4, title: '세계 최고의 천체 관측 기지', timeframe: '현재', process: '수증기가 0%에 가까운 투명한 밤하늘로 ALMA 천문대 등 우주 관측 허브로 도약', visualKeyFeature: '지구상에서 가장 선명한 밤하늘 은하수' }
    ],
    fieldGuide: {
      bestVisitingSeason: '연중 언제나 맑음 (일교차 극심하므로 방한복 필수)',
      satelliteCheckPoints: ['황갈색 분지 속 흰 눈을 뿌려놓은 듯한 암염 지층의 백색 줄무늬', '코르디예라 데 라 살(소금 산맥)의 톱날 능선선'],
      cautionAndConservation: '고산병(해발 2,400m 이상) 유의 및 자외선 차단 필수'
    }
  },
  {
    id: 'desert-wd-4',
    terrain: '사막',
    region: 'world',
    placeName: '아라비아 룹알할리 사막 (Rub\' al Khali - The Empty Quarter)',
    countryOrArea: '사우디아라비아·오만·UAE·예멘 국경 지대',
    tagline: '면적 65만㎢, 한반도 3배에 달하는 지구상에서 가장 거대한 연속 모래사막',
    description: `### 장소 소개 및 선정 이유
'빈 공간(The Empty Quarter)'이라는 뜻을 가진 룹알할리는 전 세계에서 단절되지 않고 하나로 이어진 모래사막 중 압도적 1위 규모를 자랑합니다. 수백 미터 높이의 거대 메가 듄(Mega-dune)들이 바다처럼 물결칩니다.

### 과학적 형성 과정
아라비아 반도 남서부 고원지대의 화강암 풍화 모래가 계절풍 샤말(Shamal) 바람에 실려 내륙 침강 분지에 수백만 년간 쌓이면서 최대 높이 250m 이상의 장대한 선형 사구(Linear Dune) 열을 형성했습니다.`,
    formationProcess: '지속적인 북서풍(샤말)에 의한 거대 선형 메가듄(Seif Dune)의 평행 집적',
    observationPoints: ['수십 km 뻗어 있는 선형 모래산맥', '붉은 산화철 모래와 백색 석고 분지의 대비', '신기루 현상'],
    mapQuery: 'Rub al Khali Saudi Arabia',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 200만 년 전~현재)',
      rockType: '철분 코팅된 중립질 석영 모래 및 증발암',
      tectonicSetting: '아라비아 순상지 북동측 완경사 침강 분지',
      geomorphicAgent: '샤말 북서풍과 인도양 몬순 남동풍의 상호작용',
      scale: { areaKm2: 650000, elevationMeters: 250 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '분지 침강과 모래 유입', timeframe: '약 200만 년 전', process: '아라비아 지괴가 융기하며 흘러내린 대량의 쇄설물이 거대 저지대로 유입', visualKeyFeature: '모래가 메우기 시작하는 거대 내륙 분지' },
      { stageNumber: 2, title: '샤말 강풍의 선형 사구화', timeframe: '플라이스토세 빙하기', process: '빙하기 건조기에 불어닥친 강력한 바람이 모래를 고속도로처럼 긴 선형 능선으로 정렬', visualKeyFeature: '수백 킬로미터로 뻗은 평행 모래산맥들' },
      { stageNumber: 3, title: '모래 바다의 완성', timeframe: '현재', process: '세계 최대 규모의 단일 모래사막으로 안착하여 극한의 불모지 생태계 유지', visualKeyFeature: '끝이 보이지 않는 황금빛 지평선' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~2월 아라비아 겨울철 (여름철 50℃ 이상 치솟음)',
      satelliteCheckPoints: ['위성에서 아라비아 반도 3분의 1을 덮고 있는 거대한 황금색 줄무늬 패턴', '수직으로 길게 뻗은 수백 줄의 사구 능선선'],
      cautionAndConservation: '전문 가이드 및 위성 전화, 다중 4WD 차량 필수 동행'
    }
  },

  // ==========================================
  // 2. 버섯바위 (Mushroom Rock / Pedestal Rock)
  // ==========================================
  {
    id: 'mushroom-kr-1',
    terrain: '버섯바위',
    region: 'korea',
    placeName: '울릉도 남양리 통구미 버섯바위',
    countryOrArea: '대한민국 경상북도 울릉군 서면 남양리 통구미',
    tagline: '화산 쇄설물이 층층이 쌓인 암벽이 비바람과 파도에 깎여 버섯 모양을 이룬 절경',
    description: `### 장소 소개 및 선정 이유
울릉도 남양리 해안에 우뚝 솟은 통구미 버섯바위는 화산 폭발 당시 쌓인 응회암 지층의 차별 풍화와 파도 침식이 어우러져 만들어진 국내의 대표적인 버섯바위(Mushroom Rock) 지형입니다.

### 과학적 형성 과정
단단한 상부 지층에 비해 아래쪽 지층이 상대적으로 연약하여, 지표 부근의 모래바람과 해안 파도에 의해 바위 밑동이 더 빠르게 깎여 나가(차별 침식) 위는 넓고 아래는 잘록한 버섯 모양을 형성했습니다.`,
    formationProcess: '상하 지층의 경연 차이에 따른 차별 풍화 및 지표 부근 마식 작용',
    observationPoints: ['모자처럼 얹혀진 상부 암석', '잘록하게 파인 하부 목 부분', '수평 화산 쇄설층의 층리'],
    mapQuery: '울릉도 통구미 버섯바위',
    geology: {
      geologicalAge: '신생대 제3기 말~제4기 플라이스토세 화산 분출',
      rockType: '다공질 현무암질 응회암 및 라필리 응회암',
      tectonicSetting: '동해 울릉분지 해저 화산섬 해안선',
      geomorphicAgent: '파랑의 하부 마식 및 해풍 비말 차별 풍화',
      scale: { elevationMeters: 18 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '화산재와 분석의 층상 퇴적', timeframe: '약 100만 년 전', process: '해저 화산 폭발로 분출된 화산재와 돌멩이가 겹겹이 쌓여 굳어 응회암 형성', visualKeyFeature: '시루떡처럼 줄무늬가 선명한 화산암 절벽' },
      { stageNumber: 2, title: '해수면 변동과 파식 노출', timeframe: '약 1만 년 전', process: '해수면이 현재 높이에 도달하며 바닷가에 화산암 덩어리가 고립 노출', visualKeyFeature: '파도치는 해변에 홀로 선 바위 기둥' },
      { stageNumber: 3, title: '기저부 집중 침식 및 굴착', timeframe: '수천 년간 지속', process: '자갈 섞인 파도와 모래바람이 바위 아랫부분만 집중적으로 두들겨 깎아냄', visualKeyFeature: '밑동이 잘록하게 파여 들어가는 버섯 목' },
      { stageNumber: 4, title: '버섯바위 완성 및 낙석 균형', timeframe: '현재', process: '위는 넓고 아래는 좁은 위태로운 균형의 통구미 명물 버섯바위 완성', visualKeyFeature: '푸른 동해와 어우러진 신비로운 버섯 암괴' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~10월 울릉도 여객선 운항 원활기',
      satelliteCheckPoints: ['울릉순환로 통구미 몽돌해변 바로 옆에 바다를 향해 튀어나온 독립 바위', '바위 표면에 가로줄로 뚜렷하게 새겨진 층리 단면', '거북바위 인근 해안선'],
      cautionAndConservation: '태풍 및 고파랑 시 해안도로 침수 주의 및 암석 기어오르기 금지'
    }
  },
  {
    id: 'mushroom-kr-2',
    terrain: '버섯바위',
    region: 'korea',
    placeName: '부안 변산반도 채석강 버섯형 파식괴',
    countryOrArea: '대한민국 전라북도 부안군 변산면 격포리',
    tagline: '수만 권의 책을 쌓아놓은 듯한 퇴적암 해식대 위에 우뚝 솟은 버섯 모양 기암',
    description: `### 장소 소개 및 선정 이유
변산반도 국립공원 채석강은 중생대 백악기 격포분지의 퇴적암 지층이 파도에 깎여 만든 천혜의 지질 명소로, 해식대 위에 층상 차별 침식으로 형성된 소형 버섯바위들이 곳곳에 관찰됩니다.

### 과학적 형성 과정
셰일과 사암이 교대로 쌓인 격포리층에서 연약한 셰일층이 파도와 조류에 먼저 깎여 나가고, 상부의 단단한 사암층이 모자처럼 얹혀 버섯 형태를 이룹니다.`,
    formationProcess: '사암과 셰일 호층의 경연 차이에 따른 파랑 차별 침식',
    observationPoints: ['책을 쌓아놓은 듯한 수평 층리', '아래가 잘록하게 파인 해식 노치', '썰물 때 드러나는 평탄 파식대'],
    mapQuery: '채석강',
    geology: {
      geologicalAge: '중생대 백악기 격포리층 (약 8,000만 년 전)',
      rockType: '역암, 사암, 셰일 교호 퇴적암',
      tectonicSetting: '옥천대 서남단 백악기 주향이동 분지',
      geomorphicAgent: '조석 왕복 조류 및 파랑 침식',
      scale: { elevationMeters: 15 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 호수 퇴적', timeframe: '약 8,000만 년 전', process: '깊은 호수 바닥에 모래와 진흙이 층층이 쌓여 고화', visualKeyFeature: '수만 겹의 수평 퇴적층' },
      { stageNumber: 2, title: '파도의 하부 집중 타격', timeframe: '후빙기', process: '조석 간만의 차로 조간대 기저부가 집중적으로 침식', visualKeyFeature: '잘록한 바위 기둥 형성' },
      { stageNumber: 3, title: '버섯바위 노출', timeframe: '현재', process: '해식대 위에 독립된 버섯 형태의 잔류 암괴 안착', visualKeyFeature: '격포 바다와 어우러진 기암괴석' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 간조(썰물) 2시간 전후',
      satelliteCheckPoints: ['격포항 방파제 북측 닭이봉 해안선', '썰물 시 넓게 노출되는 암반 파식대'],
      cautionAndConservation: '밀물 시 고립 위험 있으므로 물때표 사전 확인 필수'
    }
  },
  {
    id: 'mushroom-kr-3',
    terrain: '버섯바위',
    region: 'korea',
    placeName: '제주 한림 귀덕리 해안 풍화 버섯바위',
    countryOrArea: '대한민국 제주특별자치도 제주시 한림읍 귀덕리',
    tagline: '용암 지표면이 거센 해풍과 비말 염풍화에 깎여 만든 현무암 버섯바위',
    description: `### 장소 소개 및 선정 이유
제주 서북부 귀덕리 해안가에는 점성이 낮은 현무암 파호이호이 용암류 표면이 염풍화와 바람에 의해 독특한 버섯 모양으로 남은 화산암 버섯바위가 분포합니다.

### 과학적 형성 과정
지표면 근처에서 바닷물 비말이 증발하며 소금 결정이 자라나 암석을 부수는 염풍화(Haloclasty)와 바람의 마식 작용이 지표 부근 밑동을 집중적으로 파내어 형성되었습니다.`,
    formationProcess: '해풍 비말에 의한 염풍화 및 지표면 모래바람 마식',
    observationPoints: ['다공질 현무암의 버섯형 단면', '소금 결정이 만든 미세 벌집 풍화혈(타포니)', '제주 푸른 바다와의 조화'],
    mapQuery: '한림 귀덕리 해안',
    geology: {
      geologicalAge: '신생대 제4기 홀로세',
      rockType: '다공질 알칼리 올리빈 현무암',
      tectonicSetting: '제주 화산도 해안 조간대',
      geomorphicAgent: '염풍화(Salt Weathering) 및 풍식',
      scale: { elevationMeters: 4 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '용암류 해안 유입', timeframe: '약 10만 년 전', process: '한라산 산록에서 분출한 용암이 해안선에 도달하여 굳음', visualKeyFeature: '검은 현무암 암반' },
      { stageNumber: 2, title: '염풍화와 풍화혈 확장', timeframe: '수천 년간', process: '바닷물 소금기가 바위 틈에서 팽창하며 하부를 부스러뜨림', visualKeyFeature: '기저부가 파여나간 바위' },
      { stageNumber: 3, title: '현무암 버섯바위 완성', timeframe: '현재', process: '독특한 모양의 천연 버섯 조각상 안착', visualKeyFeature: '올레길 코스의 독특한 바위 풍경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄과 가을 제주 올레 15코스 탐방 시',
      satelliteCheckPoints: ['귀덕포구 인근 해안 암초 지대'],
      cautionAndConservation: '현무암 표면이 거칠어 미끄러짐 및 찰과상 주의'
    }
  },
  {
    id: 'mushroom-wd-1',
    terrain: '버섯바위',
    region: 'world',
    placeName: '이집트 백사막 국립공원 (White Desert Chalk Mushrooms)',
    countryOrArea: '이집트 파라프라 오아시스 북부 신와디주',
    tagline: '눈부신 순백의 백악(Chalk) 바위들이 모래바람에 깎여 초현실적인 버섯 군락을 이룬 사막',
    description: `### 장소 소개 및 선정 이유
사하라 사막 중심부의 백사막(White Desert)은 눈이 내린 듯 순백의 백악(분필 원료 탄산염암) 대지가 바람에 깎여 만든 수천 개의 버섯바위와 기암들이 달 표면 같은 초현실적인 풍경을 자아내는 세계 최고의 건조 버섯바위 야외 박물관입니다.

### 과학적 형성 과정
바람에 날리는 모래 입자들은 무거워서 지표면 1m 이내 높이에서만 집중적으로 튀어 오르며 이동합니다(도약, Saltation). 이 때문에 암석의 상부보다 지표면과 맞닿은 1m 높이의 밑동이 수천 배 더 강한 샌드블라스트(Sandblast) 마모를 당해 아래쪽이 오목하게 파인 버섯바위가 되었습니다.`,
    formationProcess: '지표면 1m 이내 저고도 모래 도약 마식(Abrasion)에 의한 바위 기저부 집중 연마',
    observationPoints: ['완벽한 균형의 백색 버섯바위', '기저부 1m 연마 마식면', '백악 속 화석 흔적'],
    mapQuery: 'White Desert National Park Egypt',
    geology: {
      geologicalAge: '중생대 백악기 말 천해 탄산염암 (약 7,000만 년 전)',
      rockType: '초미세 유공충 사체로 이루어진 순백색 백악(Chalk)',
      tectonicSetting: '사하라 플랫폼 안정한 내륙 침강 분지',
      geomorphicAgent: '풍성 모래 제트 도약 마식(Aeolian Saltation Sandblasting)',
      scale: { areaKm2: 300, elevationMeters: 220 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 테티스해 탄산염 퇴적', timeframe: '약 7,000만 년 전', process: '따뜻한 고대 바다 밑에 미세한 석회질 조류가 눈처럼 내려 두꺼운 흰 분필층 형성', visualKeyFeature: '바다 밑에 깔린 눈부신 순백의 지층' },
      { stageNumber: 2, title: '사하라 대사막화', timeframe: '약 300만 년 전', process: '바다가 물러나고 기후가 극도로 건조해지며 흰 암반이 사막 바람에 직접 노출', visualKeyFeature: '황량한 모래사막에 드러난 흰 암석 대지' },
      { stageNumber: 3, title: '지표 1m 샌드블라스트 집중 폭격', timeframe: '수십만 년간 지속', process: '모래알들이 지표면 50cm~1m 높이로만 통통 튀며 바위 밑동을 사포질하듯 파냄', visualKeyFeature: '밑동이 깎여나가며 머리만 크게 남는 바위들' },
      { stageNumber: 4, title: '초현실적 백색 버섯 숲 완성', timeframe: '현재', process: '닭과 버섯, 낙타 모양의 기괴한 순백 조각상들이 끝없이 펼쳐진 야외 조각 공원 완성', visualKeyFeature: '별빛 아래 빛나는 거대한 하얀 버섯 바위들' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~4월 (사하라 사막 캠핑 및 야간 은하수 관측 최적기)',
      satelliteCheckPoints: ['황갈색 사하라 사막 한가운데 눈이 쌓인 듯 하얗게 빛나는 원형 백색 지대', '파라프라 오아시스로 이어지는 아스팔트 도로변 북측 구릉지', '점점이 흩어져 있는 백악질 기암들의 흰 그림자'],
      cautionAndConservation: '자연유산 파손 금지 및 사막 야간 기온 급강하(일교차 30℃) 방한 준비'
    }
  },
  {
    id: 'mushroom-wd-2',
    terrain: '버섯바위',
    region: 'world',
    placeName: '미국 유타주 고블린 밸리 주립공원 (Goblin Valley)',
    countryOrArea: '미국 유타주 그린리버 남서부',
    tagline: '수천 마리의 도깨비 버섯들이 붉은 사막 계곡을 가득 메운 판타지 기암 지대',
    description: `### 장소 소개 및 선정 이유
유타주 사막 한가운데 자리한 고블린 밸리는 상부는 단단한 사암, 하부는 부드러운 실트암으로 이루어진 수천 개의 버섯 모양 '고블린(Hoodoo / Pedestal Rock)'들이 모여 있는 세계적인 버섯바위 군락지입니다.

### 과학적 형성 과정
약 1억 7천만 년 전 쥐라기 조간대 퇴적 지층인 엔트라다 사암층이 융기한 후, 지표수 침식과 겨울철 동결-융해 작용, 모래바람에 의해 아래쪽의 연약한 점토질 셰일층이 먼저 부식되어 둥근 머리를 가진 버섯 기둥이 탄생했습니다.`,
    formationProcess: '엔트라다 사암과 실트암 층의 동결 융해 및 사막 풍화 차별 삭박',
    observationPoints: ['키 1~3m의 수천 개 도깨비 버섯바위', '상부 모자 사암과 하부 줄기 실트암의 경계선', '미로 같은 버섯바위 골짜기'],
    mapQuery: 'Goblin Valley State Park Utah',
    geology: {
      geologicalAge: '중생대 쥐라기 엔트라다 사암층 (약 1억 7,000만 년 전)',
      rockType: '사암(상부 캡) 및 실트암·셰일(하부 기둥)',
      tectonicSetting: '산 라파엘 스웰(San Rafael Swell) 배사 구조 외곽',
      geomorphicAgent: '차별 우수 침식(Differential Rainwash) 및 풍식',
      scale: { areaKm2: 12 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '쥐라기 조간대 펄 모래 퇴적', timeframe: '약 1억 7,000만 년 전', process: '조석 조간대에서 진흙과 모래가 번갈아 쌓여 지층 형성', visualKeyFeature: '적갈색 줄무늬 지층' },
      { stageNumber: 2, title: '지각 융기와 수직 절리 균열', timeframe: '신생대 제3기', process: '고원이 융기하며 바둑판 모양의 미세 균열 발생', visualKeyFeature: '격자형으로 갈라진 암석 대지' },
      { stageNumber: 3, title: '풍우 침식과 모서리 둥글림', timeframe: '수십만 년간', process: '빗물과 바람이 균열을 넓히고 하부 실트암을 먼저 깎아냄', visualKeyFeature: '머리가 둥근 버섯 기둥들이 분리됨' },
      { stageNumber: 4, title: '도깨비 계곡 완성', timeframe: '현재', process: '수천 개의 기괴한 버섯바위들이 미로를 이룬 신비의 계곡 완성', visualKeyFeature: '판타지 영화 속 외계 행성 풍경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄(4~5월)과 가을(9~10월)',
      satelliteCheckPoints: ['황량한 유타 사막 속 적갈색 계곡 분지', '미로처럼 점점이 박힌 암석 기둥들의 그림자'],
      cautionAndConservation: '연약한 사암 지형 파손 금지 및 한여름 탈수 주의'
    }
  },
  {
    id: 'mushroom-wd-3',
    terrain: '버섯바위',
    region: 'world',
    placeName: '미국 캔자스주 머시룸 록 주립공원 (Mushroom Rock State Park)',
    countryOrArea: '미국 캔자스주 엘스워스 카운티',
    tagline: '거대한 구형 탄산염 결핵체가 모래바람에 깎여 솟아오른 거인들의 버섯 우산',
    description: `### 장소 소개 및 선정 이유
캔자스주 스모키힐스에 위치한 머시룸 록 주립공원은 중생대 백악기 바다 밑에서 형성된 단단한 탄산염 결핵체(Concretion)가 부드러운 사암 기둥 위에 버섯처럼 얹혀진 지질학의 기적입니다.

### 과학적 형성 과정
지하수 속 탄산칼슘 성분이 특정 핵을 중심으로 뭉쳐 콘크리트처럼 단단한 공 모양의 결핵체가 되었고, 주변의 연약한 다코타 사암이 비바람에 씻겨 나가며 버섯 우산 모양의 독특한 지형을 남겼습니다.`,
    formationProcess: '방해석 시멘트화 결핵체(Concretion)의 잔류와 주변 사암의 차별 풍식',
    observationPoints: ['직경 8m에 달하는 거대 버섯 모자', '사암 기둥에 새겨진 교차 층리', '선사시대 인디언 각석'],
    mapQuery: 'Mushroom Rock State Park Kansas',
    geology: {
      geologicalAge: '중생대 백악기 다코타층 (약 1억 년 전)',
      rockType: '방해석 교결 사암 결핵체 및 연질 사암',
      tectonicSetting: '북미 서부 내륙 해로(Western Interior Seaway) 퇴적 분지',
      geomorphicAgent: '차별 풍화 및 풍우 세탈 작용',
      scale: { elevationMeters: 8 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 내륙해 결핵체 성장', timeframe: '약 1억 년 전', process: '해저 모래층 속에서 탄산칼슘이 뭉쳐 단단한 구형 결핵체 형성', visualKeyFeature: '모래 속에 파묻힌 단단한 돌 공' },
      { stageNumber: 2, title: '고원 융기와 지표 노출', timeframe: '신생대', process: '내륙해가 후퇴하고 대지가 드러남', visualKeyFeature: '평원에 노출된 사암 암반' },
      { stageNumber: 3, title: '주변 사암 침식과 버섯 기둥 출현', timeframe: '수만 년간', process: '비바람이 결핵체 아래 부드러운 모래를 깎아내며 기둥만 남김', visualKeyFeature: '우산을 쓴 듯한 버섯바위' },
      { stageNumber: 4, title: '주립 지질 공원 지정', timeframe: '현재', process: '캔자스 8대 자연 불가사의로 선정되어 보호', visualKeyFeature: '초원 위에 홀로 선 기이한 버섯바위' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 대평원 탐방 시즌',
      satelliteCheckPoints: ['스모키힐 평원 도로변의 원형 암석 돌출부'],
      cautionAndConservation: '바위에 낙서 및 기어오르기 엄격 금지'
    }
  },

  // ==========================================
  // 3. 오아시스 (Oasis)
  // ==========================================
  {
    id: 'oasis-kr-1',
    terrain: '오아시스',
    region: 'korea',
    placeName: '태안 신두리 두웅습지 (사구 오아시스 습지)',
    countryOrArea: '대한민국 충청남도 태안군 원북면 신두리',
    tagline: '사막 같은 모래언덕 배후에 형성된 람사르 등록 기적의 천연 담수 오아시스',
    description: `### 장소 소개 및 선정 이유
람사르 습지이자 천연기념물로 지정된 태안 두웅습지는 건조하고 메마른 신두리 해안사구 배후의 저지대에 바닷물이 아닌 순수한 민물이 솟아올라 형성된 국내 유일의 해안사구 오아시스 습지입니다.

### 과학적 형성 과정
해안사구의 모래층이 빗물을 스펀지처럼 흡수하여 거대한 지하 담수 렌즈(Freshwater Lens)를 형성하고, 이 물이 사구 뒤편의 불투수성 기반암 저지대로 서서히 용출되면서 사계절 내내 마르지 않는 신비로운 담수 호수 오아시스를 탄생시켰습니다.`,
    formationProcess: '해안사구 모래층의 담수 렌즈 축적 및 배후 저지대 지하수 용출',
    observationPoints: ['사구 모래언덕과 푸른 습지 수면의 대비', '멸종위기 금개구리와 맹꽁이 서식처', '습지 주변 수련과 노랑어리연꽃'],
    mapQuery: '두웅습지',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 7,000년 전)',
      rockType: '유기물 실트 점토층 및 사구성 석영사',
      tectonicSetting: '서해안 리아스식 사구성 해빈 배후 습지',
      geomorphicAgent: '사구 담수 렌즈 수두압에 의한 지하수 용출(Spring)',
      scale: { areaKm2: 0.065, depthMeters: 3 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '해안사구 성장과 배후 폐색', timeframe: '약 7,000년 전', process: '모래언덕이 높이 쌓이며 내륙 골짜기의 배수구를 가로막음', visualKeyFeature: '모래벽 뒤에 갇힌 오목한 골짜기' },
      { stageNumber: 2, title: '사구 담수 렌즈 형성', timeframe: '약 4,000년 전', process: '사구 모래층이 빗물을 머금어 바닷물 침투를 막고 지하 담수층 구축', visualKeyFeature: '모래땅 밑에 차오르는 맑은 민물' },
      { stageNumber: 3, title: '천연 오아시스 호수 탄생', timeframe: '현재', process: '사구 하부에서 솟아난 지하수가 호수를 이루고 모래사막 속 생명 보고로 발전', visualKeyFeature: '모래언덕 품 안에 안긴 에메랄드빛 습지' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 금개구리 울음소리와 수련 만개 시기',
      satelliteCheckPoints: ['신두리 사구 바로 동남쪽에 위치한 둥근 타원형 담수 수면', '습지를 둘러싼 소나무 숲'],
      cautionAndConservation: '람사르 습지보호지역으로 수질 오염 및 동식물 포획 엄금'
    }
  },
  {
    id: 'oasis-kr-2',
    terrain: '오아시스',
    region: 'korea',
    placeName: '제주 선흘리 동백동산 곶자왈 먼물깍 (화산 오아시스 습지)',
    countryOrArea: '대한민국 제주특별자치도 제주시 조천읍 선흘리',
    tagline: '물이 스며드는 화산 암반 숲속에서 기적처럼 물이 고인 람사르 오아시스 천연 못',
    description: `### 장소 소개 및 선정 이유
제주 동백동산 곶자왈의 중심에 자리한 '먼물깍'은 모든 빗물이 지하로 쏙 빠져버리는 현무암 불모지 숲에서 사계절 내내 마르지 않고 맑은 물이 고여 있는 화산 오아시스 습지입니다.

### 과학적 형성 과정
투수성이 높은 빌레 용암(파호이호이) 위에 화산재와 미세 유기 점토가 틈새를 완벽하게 메워 천연 방수층을 형성함으로써, 건조한 화산 암반 지대 한가운데 동식물의 생명수가 되는 천연 웅덩이 오아시스가 만들어졌습니다.`,
    formationProcess: '투수성 용암대지 위 불투수 점토층 침적에 따른 천연 화산 습지 웅덩이 형성',
    observationPoints: ['울창한 상록활엽수림 속 청정 습지 수면', '세계 유일 서식지 순채와 제주고사리삼', '검은 현무암과 어우러진 수생 식물'],
    mapQuery: '동백동산 먼물깍',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 화산 분출층',
      rockType: '파호이호이 알칼리 현무암 및 불투수성 유기 점토',
      tectonicSetting: '제주 동부 거문오름 용암류 지대',
      geomorphicAgent: '국지적 점토 실트 틈새 폐색 및 강우 집수',
      scale: { areaKm2: 0.005, depthMeters: 1.5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '거문오름 용암 분출', timeframe: '약 10만 년 전', process: '평평한 빌레 용암이 흐르며 얕은 접시 모양 와지 형성', visualKeyFeature: '넓게 펼쳐진 검은 암반' },
      { stageNumber: 2, title: '미세 점토 차수벽 형성', timeframe: '수천 년간', process: '낙엽과 흙이 암반 틈새를 메워 물이 빠지지 않는 방수 바닥 완성', visualKeyFeature: '물이 고이기 시작하는 웅덩이' },
      { stageNumber: 3, title: '람사르 곶자왈 오아시스 안착', timeframe: '현재', process: '희귀 야생 동식물이 모여드는 제주의 대표 화산 오아시스 완성', visualKeyFeature: '태고의 신비를 간직한 숲속 연못' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 연중 푸름 (비 온 직후 몽환적인 숲 안개)',
      satelliteCheckPoints: ['선흘리 동백동산 짙은 녹색 숲 한가운데 작은 반사 수면'],
      cautionAndConservation: '정숙 탐방 및 탐방로 벗어나기 금지'
    }
  },
  {
    id: 'oasis-wd-1',
    terrain: '오아시스',
    region: 'world',
    placeName: '중국 둔황 명사산 월아천 (Dunhuang Crescent Lake)',
    countryOrArea: '중국 간쑤성 주취안시 둔황 명사산',
    tagline: '수천 년 모래폭풍 속에서도 결코 묻히지 않은 초승달 모양의 실크로드 오아시스',
    description: `### 장소 소개 및 선정 이유
실크로드의 관문 둔황의 명사산(鳴沙山) 품에 안긴 '월아천(月牙泉)'은 높이 200m가 넘는 거대한 모래사막 언덕들 사이에 거짓말처럼 자리 잡은 초승달 모양의 천연 담수 오아시스 호수입니다.

### 과학적 형성 과정
당허강(Danghe River)의 지하수가 사구 사이의 단층 틈새를 따라 일정하게 솟아오르는 지하수 용출 지점에 위치하며, 주변 모래산의 독특한 지형 덕분에 모래바람이 불어도 바람이 호수 위에서 회오리쳐 모래가 물에 빠지지 않고 밖으로 밀려 나가는 기적 같은 공기역학 구조를 지니고 있습니다.`,
    formationProcess: '선상지 말단 지하수 용출과 사구 능선의 공기역학적 소용돌이에 의한 모래 유입 방지',
    observationPoints: ['완벽한 초승달 모양의 맑은 옥빛 수면', '호숫가에 우뚝 선 당나라 양식 명월각 누각', '명사산 사구 능선에서 내려다보는 전경'],
    mapQuery: 'Crescent Lake Dunhuang China',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세~홀로세',
      rockType: '풍성 석영 모래 및 하천 충적 사력층',
      tectonicSetting: '타림 분지 동단 치롄산맥 북록 하서주랑 침강대',
      geomorphicAgent: '단층성 자류 지하수 용출 및 와류형 풍성 역학',
      scale: { lengthKm: 0.1, depthMeters: 5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '치롄산맥 빙하 융설수 지하류 형성', timeframe: '수만 년 전', process: '만년설 녹은 물이 자갈층 밑으로 흘러 둔황 지하 분지로 유입', visualKeyFeature: '사막 밑을 흐르는 막대한 지하 수맥' },
      { stageNumber: 2, title: '사구 집적과 초승달 와지 고립', timeframe: '약 3,000년 전', process: '모래언덕이 에워싸며 지하수가 솟아오르는 천연 호수 형성', visualKeyFeature: '모래산 한가운데 푸른 오아시스' },
      { stageNumber: 3, title: '공기역학적 모래 배출 균형', timeframe: '현재까지', process: '남북 사구의 경사차로 바람이 호수 모래를 위로 걷어 올리는 천연 보호 작용', visualKeyFeature: '모래에 묻히지 않는 초승달 호수' },
      { stageNumber: 4, title: '실크로드 세계자연문화 명소', timeframe: '현재', process: '사막 탐험가와 실크로드 상인들의 안식처로 유네스코 지질공원 등재', visualKeyFeature: '석양빛에 황금빛으로 물드는 월아천' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~10월 (일몰 시간대 명사산 정상 등반 후 감상)',
      satelliteCheckPoints: ['거대한 명사산 모래산맥 북측 자락에 푸른 초승달 모양으로 뚜렷이 보이는 월아천', '호숫가 명월각 사원의 지붕 선'],
      cautionAndConservation: '사막 모래 덧신 착용 권장 및 수질 보호 구역 접근 금지'
    }
  },
  {
    id: 'oasis-wd-2',
    terrain: '오아시스',
    region: 'world',
    placeName: '페루 이카 와카치나 오아시스 (Huacachina Oasis)',
    countryOrArea: '페루 이카주 이카 서부 사막',
    tagline: '남미 유일의 천연 사막 오아시스, 거대 모래언덕이 감싼 에메랄드빛 천연 라군',
    description: `### 장소 소개 및 선정 이유
페루 남부 태평양 연안 사막에 자리한 '와카치나'는 높이 100m가 넘는 거대한 모래사구에 둘러싸인 천연 라군 오아시스로, 페루 50솔 화폐 도안에 등장하는 남미에서 가장 유명한 사막의 오아시스 마을입니다.

### 과학적 형성 과정
안데스산맥에서 지하로 침투한 지하수가 해안 사막의 깊은 사구 간 저지대(Interdune Depression)에서 용출하여 호수를 이루었으며, 주변의 야자수와 유칼립투스 숲이 증발을 억제하며 독특한 오아시스 미기후를 유지하고 있습니다.`,
    formationProcess: '안데스 침투 지하수의 사구간 함몰 저지대 천연 용출 및 오아시스 생태계 형성',
    observationPoints: ['에메랄드빛 천연 호수와 대추야자 숲', '호수를 둘러싼 가파른 모래언덕 능선', '사막 샌드보딩과 버기카 질주'],
    mapQuery: 'Huacachina Ica Peru',
    geology: {
      geologicalAge: '신생대 제4기',
      rockType: '풍성 해안 사암 모래 및 유기질 점토',
      tectonicSetting: '나스카판 섭입대 해안 전호 분지',
      geomorphicAgent: '단층 지하수 용출 및 풍성 사구 포위 작용',
      scale: { areaKm2: 0.02, depthMeters: 4 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '안데스 융설수 해안 침투', timeframe: '약 1만 년 전', process: '안데스 산맥에서 스며든 물이 이카 계곡 지하로 이동', visualKeyFeature: '사막 지하의 막대한 수맥' },
      { stageNumber: 2, title: '사구 포위와 용출 라군 탄생', timeframe: '수천 년 전', process: '바람이 만든 거대 사구 한복판에서 수맥이 터져 호수 형성', visualKeyFeature: '황량한 모래산 속 푸른 물웅덩이' },
      { stageNumber: 3, title: '야자수 군락과 미기후 정착', timeframe: '근대', process: '야자수와 관목이 활착하여 바람을 막고 증발 억제', visualKeyFeature: '동화 속 사막 오아시스 마을' },
      { stageNumber: 4, title: '국제적 사막 액티비티 성지', timeframe: '현재', process: '사막 샌드보딩과 선셋 투어로 세계적인 명소로 발전', visualKeyFeature: '모래언덕 위에서 내려다보는 불빛 찬란한 오아시스' }
    ],
    fieldGuide: {
      bestVisitingSeason: '연중 화창 (기온 20~28℃로 사계절 온화)',
      satelliteCheckPoints: ['황갈색 사막 한가운데 둥근 녹색 섬과 타원형 호수', '호수를 중심으로 동심원형으로 형성된 리조트 건물들'],
      cautionAndConservation: '호수 수위 보존을 위한 수질 관리 구역 준수'
    }
  },
  {
    id: 'oasis-wd-3',
    terrain: '오아시스',
    region: 'world',
    placeName: '이집트 사하라 시와 오아시스 (Siwa Oasis)',
    countryOrArea: '이집트 마트루주 서부 사하라 사막',
    tagline: '해수면 아래 19m 분지에 300여 개의 천연 미네랄 온천과 30만 그루 올리브 숲이 펼쳐진 고대 오아시스',
    description: `### 장소 소개 및 선정 이유
알렉산더 대왕이 신탁을 받기 위해 찾았던 전설적인 시와 오아시스는 리비아 국경 인근 사하라 사막 한가운데, 해수면보다 19m 낮은 함몰 분지에 수백 개의 천연 샘물과 옥빛 소금호수가 어우러진 지상 최고의 사막 오아시스 낙원입니다.

### 과학적 형성 과정
누비아 사암 대수층(Nubian Sandstone Aquifer System)의 거대한 화석 지하수가 지각 단층선을 따라 수두압으로 솟구쳐 나오는 천연 자류 온천(Artesian Spring)들이 수천 년간 마르지 않는 오아시스를 공급하고 있습니다.`,
    formationProcess: '누비아 사암 화석 대수층의 고압 지하수 자류 용출 및 해수면 하 침강 분지 수계 형성',
    observationPoints: ['클레오파트라 천연 온천수 목욕탕', '몸이 둥둥 뜨는 고염도 터키석빛 암염 호수', '30만 그루 대추야자와 올리브 숲'],
    mapQuery: 'Siwa Oasis Egypt',
    geology: {
      geologicalAge: '고생대 캄브리아기 누비아 사암층 위 신생대 충적층',
      rockType: '누비아 사암(대수층) 및 증발암, 암염(Halite)',
      tectonicSetting: '사하라 플랫폼 카타라 침강대 인접 함몰 분지',
      geomorphicAgent: '심부 화석 지하수 자류 용출(Artesian Wells)',
      scale: { areaKm2: 80, depthMeters: -19 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '누비아 화석 대수층 집수', timeframe: '빙하기 습윤기', process: '사하라가 푸른 초원이었던 과거 빙하기에 거대한 사암층에 막대한 담수 저장', visualKeyFeature: '지하 수천 미터에 저장된 화석 물' },
      { stageNumber: 2, title: '단층 파쇄대 지하수 용출', timeframe: '약 1만 년 전', process: '단층 틈새로 고압의 미네랄 천연수가 지표면으로 분출', visualKeyFeature: '사막 한복판에 솟구치는 300개의 샘' },
      { stageNumber: 3, title: '대추야자 숲과 소금 호수 형성', timeframe: '고대 이집트 시대', process: '용출수가 분지를 적셔 울창한 녹지대를 만들고 물이 증발한 가장자리엔 소금호수 탄생', visualKeyFeature: '야자수 숲과 하얀 소금밭의 조화' },
      { stageNumber: 4, title: '베르베르 전통과 천연 치유 오아시스', timeframe: '현재', process: '고립된 지형 덕분에 고대 베르베르 문화와 청정 온천 오아시스 보존', visualKeyFeature: '진흙 성채 샤리와 에메랄드빛 소금 온천' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~4월 (여름철 45℃ 고온 피할 것)',
      satelliteCheckPoints: ['황량한 사하라 사막 속에 짙은 녹색으로 길게 펼쳐진 시와 분지', '분지 동쪽에 짙은 청록색으로 빛나는 시와 소금호수 수면들'],
      cautionAndConservation: '소금호수 수영 시 고염도로 눈에 들어가지 않도록 주의'
    }
  },

  // ==========================================
  // 4. 플라야 (Playa / Salt Flat)
  // ==========================================
  {
    id: 'playa-kr-1',
    terrain: '플라야',
    region: 'korea',
    placeName: '순천만 갯벌 건조 염각판 (여름철 건열 플라야)',
    countryOrArea: '대한민국 전라남도 순천시 순천만 습지 일대',
    tagline: '햇빛에 바짝 마른 점토질 갯벌 표면이 육각형 균열판을 이루는 한국의 플라야 유사 지형',
    description: `### 장소 소개 및 선정 이유
조석에 의해 잠겼다가 햇빛에 노출되는 상부 갯벌 지대에서는 건조 지형의 전형적인 특징인 건열(Mud Crack)과 염각판(Salt Crust)이 플라야와 동일한 메커니즘으로 관찰됩니다.

### 과학적 형성 과정
만조 때 침전된 미세 점토질 퇴적물이 간조와 여름철 직사광선으로 수분을 잃으며 부피가 수축해 육각형 모양의 다각형 균열을 형성하고, 바닷물이 증발하며 얇은 소금 피막이 표면에 석출됩니다.`,
    formationProcess: '점토질 퇴적물의 급속 탈수 수축에 의한 다각형 건열(Mudcracks) 및 염류 석출',
    observationPoints: ['기하학적 다각형 건열 균열면', '표면에 하얗게 맺힌 미세 소금 피막', '붉은 칠면초 군락과의 경계선'],
    mapQuery: '순천만습지 갈대밭',
    geology: {
      geologicalAge: '신생대 제4기 홀로세',
      rockType: '점토(Clay) 및 증발 염류(Halite)',
      tectonicSetting: '황·남해안 연안 조간대 상부',
      geomorphicAgent: '일사 건조에 따른 탈수 수축 및 증발 침전',
      scale: { areaKm2: 0.5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '조석 점토 침전', timeframe: '만조 시', process: '바닷물에 실려 온 미세한 점토가 잔잔한 갯벌 바닥에 층을 이룸', visualKeyFeature: '매끄러운 펄 표면' },
      { stageNumber: 2, title: '강한 햇빛 탈수 수축', timeframe: '간조 직후', process: '태양열로 수분이 급격히 증발하며 점토가 오그라듦', visualKeyFeature: '쩍쩍 갈라지는 균열선' },
      { stageNumber: 3, title: '육각형 건열판 완성', timeframe: '현재', process: '가장자리부터 말려 올라간 다각형 점토판과 흰 소금막 안착', visualKeyFeature: '벌집 모양의 바닥 무늬' }
    ],
    fieldGuide: {
      bestVisitingSeason: '7월~9월 맑은 한낮 간조 시간대',
      satelliteCheckPoints: ['순천만 갈대군락 안쪽 건조 조간대'],
      cautionAndConservation: '갯벌 훼손 금지 및 지정 탐방로 데크에서 관찰'
    }
  },
  {
    id: 'playa-kr-2',
    terrain: '플라야',
    region: 'korea',
    placeName: '부안 곰소 천연 증발 염판 대지',
    countryOrArea: '대한민국 전라북도 부안군 진서면 곰소리',
    tagline: '조석 점토 평탄면 위에서 햇빛과 바람으로 소금 결정이 피어나는 천연 증발지',
    description: `### 장소 소개 및 선정 이유
곰소만 안쪽의 곰소 소금밭은 파도가 잔잔하고 일조량이 풍부한 지형 조건을 활용하여 천연 소금 플라야의 증발·결정화 과정을 가장 생생하게 관찰할 수 있는 명소입니다.

### 과학적 형성 과정
점토 바닥 위에 얕게 가둔 해수가 증발하면서 농축된 함수(Brine)에서 염화나트륨 결정이 석출되어 바닥 전체가 눈부신 백색 소금판으로 뒤덮입니다.`,
    formationProcess: '해수 증발 농축에 의한 증발암 광물(소금)의 인공적·자연적 결정 석출',
    observationPoints: ['눈송이처럼 자라나는 소금 결정체', '바둑판 모양의 증발지 수면 반사', '적갈색 갯벌과 순백 소금의 대비'],
    mapQuery: '곰소염전',
    geology: {
      geologicalAge: '신생대 제4기',
      rockType: '충적 점토 바닥 위 암염 결정',
      tectonicSetting: '곰소만 반폐쇄성 조간대',
      geomorphicAgent: '일사량과 해풍에 의한 수분 증발 침전',
      scale: { areaKm2: 0.3 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '곰소만 미세 펄 퇴적', timeframe: '홀로세', process: '물이 빠지지 않는 단단한 점토질 갯벌 평탄면 형성', visualKeyFeature: '방수 점토 바닥' },
      { stageNumber: 2, title: '바닷물 증발과 염도 상승', timeframe: '매일 한낮', process: '바람과 태양열로 수분이 날아가며 소금물 농축', visualKeyFeature: '아지랑이 피는 수면' },
      { stageNumber: 3, title: '백색 소금 결정판 형성', timeframe: '현재', process: '물이 다 마르며 바닥에 하얀 소금 꽃과 결정판 완성', visualKeyFeature: '거울처럼 하늘을 비추는 소금판' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 일조량 풍부한 맑은 날 정오',
      satelliteCheckPoints: ['곰소항 동측 사각형으로 정렬된 염전 수면들'],
      cautionAndConservation: '염전 작업장 내 무단 진입 금지'
    }
  },
  {
    id: 'playa-wd-1',
    terrain: '플라야',
    region: 'world',
    placeName: '볼리비아 우유니 소금평원 (Salar de Uyuni)',
    countryOrArea: '볼리비아 포토시주 다니엘캄포스',
    tagline: '해발 3,656m 안데스 고원에 펼쳐진 10,582㎢, 지구상에서 가장 거대한 세상의 거울 소금 플라야',
    description: `### 장소 소개 및 선정 이유
세계 최대의 소금 플라야인 우유니 소금사막(Salar de Uyuni)은 면적이 10,582㎢(경기도 전체 면적)에 달하며, 고저 차가 1m도 나지 않는 지구상에서 가장 완벽하게 평평한 순백의 소금 호수입니다.

### 과학적 형성 과정
과거 플라이스토세 빙하기에 안데스 고원에 존재했던 거대한 민친 호수(Lake Minchin)가 기후 온난화로 물이 증발하면서 두께 수 미터에 달하는 단단한 암염(Halite)과 석고 지층을 바닥에 남겼습니다. 우기에는 얇은 빗물이 고여 하늘을 완벽하게 반사하는 천연 거울을 만듭니다.`,
    formationProcess: '고대 거대 빙하호의 단계적 증발 농축 및 두께 10m 초평탄 암염 증발판 집적',
    observationPoints: ['건기 때 생기는 기하학적 육각형 소금 벌집(Polygons)', '우기 시 하늘과 구름을 반사하는 거대한 천연 거울 수면', '소금사막 한가운데 솟은 잉카와시 섬의 거대 선인장 군락'],
    mapQuery: 'Salar de Uyuni Bolivia',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 말기 (약 4만~1만 년 전)',
      rockType: '두께 10m 고순도 암염(Halite), 석고, 황산리튬 염수',
      tectonicSetting: '안데스 조산대 중부 알티플라노 고원 내륙 폐쇄 분지',
      geomorphicAgent: '고대 호수 고갈에 따른 극단적 증발 침전(Evaporation)',
      scale: { areaKm2: 10582, elevationMeters: 3656, depthMeters: 10 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '거대 고대호수 민친 번성', timeframe: '약 4만 년 전', process: '안데스 빙하가 녹은 물이 분지에 모여 수심 100m의 거대한 내륙해 형성', visualKeyFeature: '알티플라노 고원을 가득 채운 푸른 호수' },
      { stageNumber: 2, title: '기후 건조화와 수위 급감', timeframe: '약 1만 5,000년 전', process: '기온 상승으로 유입량보다 증발량이 많아지며 호수가 급격히 메마름', visualKeyFeature: '호수가 쪼그라들며 소금 농도 폭증' },
      { stageNumber: 3, title: '10m 두께 소금 바닥 결정화', timeframe: '약 1만 년 전', process: '물이 완전히 증발하고 리튬과 나트륨이 굳어 단단한 암염판 형성', visualKeyFeature: '지평선 끝까지 눈부시게 하얀 소금 평원' },
      { stageNumber: 4, title: '세상의 거울 안착', timeframe: '현재', process: '매년 1~3월 우기에는 얕은 물이 고여 하늘과 땅이 하나 되는 환상적 반영 연출', visualKeyFeature: '구름 위를 걷는 듯한 초현실적 풍경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '1~3월(우기 천연 거울 반영) 또는 5~10월(건기 기하학적 소금 결정선)',
      satelliteCheckPoints: ['남미 대륙 위성 영상에서 안데스 고원에 거대한 하얀 얼룩처럼 선명히 보이는 우유니 플라야', '소금 평원 한복판에 갈색 점으로 보이는 잉카와시 섬'],
      cautionAndConservation: '해발 3,656m 고산병 대비 및 강렬한 백색 반사광 대비 편광 선글라스 필수'
    }
  },
  {
    id: 'playa-wd-2',
    terrain: '플라야',
    region: 'world',
    placeName: '미국 캘리포니아 데스밸리 레이스트랙 플라야 (Racetrack Playa)',
    countryOrArea: '미국 캘리포니아주 인요 카운티 데스밸리 국립공원',
    tagline: '아무도 보지 않을 때 스스로 수백 미터를 움직이는 미스터리 \'세일링 스톤\'의 마른 호수 바닥',
    description: `### 장소 소개 및 선정 이유
데스밸리 국립공원의 해발 1,130m 고립된 산정에 자리한 '레이스트랙 플라야'는 바닥이 완벽한 수평을 이루는 마른 진흙 호수 바닥(Playa)으로, 수십 킬로그램의 무거운 바위들이 바닥에 긴 궤적을 남기며 스스로 움직이는 '세일링 스톤(Sailing Stones)' 현상으로 세계적인 과학 미스터리가 된 지형입니다.

### 과학적 형성 과정
겨울철 드물게 비가 내리면 플라야 바닥에 수 센티미터의 얕은 물이 고인 뒤 밤새 얇은 얼음판(Ice Window)이 얼어붙습니다. 다음 날 아침 햇빛에 얼음이 깨지면서 초속 10m가 넘는 강한 사막 바람이 얼음 뗏목을 밀어내고, 얼음에 갇힌 돌들이 부드러운 점토 바닥을 긁으며 스스로 전진하는 궤적을 남깁니다.`,
    formationProcess: '플라야 건조 점토판 위 동결 박빙(Thin Ice Sheets)과 강풍의 결합에 의한 암석 활주',
    observationPoints: ['바위 뒤로 길게 뻗은 미스터리 이동 궤적선', '바둑판처럼 촘촘히 갈라진 다각형 건열 진흙판', '그랜드스탠드(The Grandstand) 석영반암 고립 섬'],
    mapQuery: 'Racetrack Playa Death Valley California',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 1만 년 전~현재)',
      rockType: '극미세 점토 및 실트 증발 퇴적물, 주변 백운암 암괴',
      tectonicSetting: '분지-산맥 지구대(Basin and Range) 산악 폐쇄 분지',
      geomorphicAgent: '일시적 빗물 침수, 야간 동결 융해 및 강풍 풍력 이동',
      scale: { lengthKm: 4.5, elevationMeters: 1130 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '산간 폐쇄 분지 형성', timeframe: '플라이스토세', process: '단층 작용으로 산으로 둘러싸인 배수구 없는 마른 계곡 바닥 형성', visualKeyFeature: '사방이 절벽으로 둘러싸인 분지' },
      { stageNumber: 2, title: '초평탄 점토층 집적', timeframe: '수천 년간', process: '폭우 시 흘러든 미세 진흙이 바닥에 가라앉아 완벽한 수평판 형성', visualKeyFeature: '유리알처럼 평평한 마른 진흙 바닥' },
      { stageNumber: 3, title: '세일링 스톤 활주 현상 증명', timeframe: '2014년 과학 규명', process: '얇은 얼음 뗏목과 겨울 강풍이 결합하여 무거운 돌들을 미끄러뜨림', visualKeyFeature: '바위가 기어간 수백 미터의 궤적' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~3월 (고지대로 겨울철 영하 강등, 4WD 차량 필수)',
      satelliteCheckPoints: ['데스밸리 북서부 산맥 사이에 흰색 타원형으로 평평하게 뚫린 레이스트랙 플라야 면', '남쪽 끝자락의 흑색 고립 암반 그랜드스탠드'],
      cautionAndConservation: '젖어 있을 때 바닥을 밟거나 돌을 옮기는 행위 엄격 금지'
    }
  },
  {
    id: 'playa-wd-3',
    terrain: '플라야',
    region: 'world',
    placeName: '나미비아 에토샤 팬 (Etosha Pan)',
    countryOrArea: '나미비아 오시코토주 에토샤 국립공원',
    tagline: '우주에서도 하얗게 보이는 4,800㎢의 거대한 백색 소금 진흙 플라야 대지',
    description: `### 장소 소개 및 선정 이유
'위대한 흰색의 장소'라는 뜻의 에토샤 팬은 면적 4,800㎢에 달하는 아프리카 최대의 플라야로, 평소에는 백색 소금 먼지가 휘날리는 거대한 불모지이지만 우기에는 수천 마리의 플라밍고와 야생동물이 모여드는 기적의 호수가 됩니다.

### 과학적 형성 과정
과거 쿤레네강(Kunene River)이 흘러들던 거대한 내륙 호수였으나, 지각 융기로 강줄기가 대서양으로 방향을 바꾸자 물 공급이 끊겨 호수가 증발하고 백색 염류 점토판 플라야로 남았습니다.`,
    formationProcess: '고기 거대 하천의 수로 편향에 따른 내륙호 고갈 및 백색 증발암 침전',
    observationPoints: ['지평선 끝까지 펼쳐진 백색 소금판', '팬 가장자리 천연 워터홀에 모여든 코끼리와 사자', '우기철 100만 마리 홍학 떼'],
    mapQuery: 'Etosha Pan Namibia',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 (약 200만 년 전 고갈 시작)',
      rockType: '탄산염 실트, 암염 및 석고 증발 점토',
      tectonicSetting: '칼라하리 분지 북서부 내륙 침강 분지',
      geomorphicAgent: '하천 유입 단절에 따른 건조화 및 풍식 연마',
      scale: { areaKm2: 4800, lengthKm: 120 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '쿤레네강의 거대 호수 유입', timeframe: '약 200만 년 전', process: '아프리카 거대 강물이 분지를 채워 서울 면적 8배의 호수 유지', visualKeyFeature: '풍요로운 아프리카 내륙 바다' },
      { stageNumber: 2, title: '지각 융기와 강줄기 이탈', timeframe: '약 100만 년 전', process: '대서양 방향 단층 융기로 강물이 바다로 빠져나가며 호수 고갈', visualKeyFeature: '바닥을 드러내는 거대한 호수' },
      { stageNumber: 3, title: '소금 플라야와 야생의 오아시스', timeframe: '현재', process: '백색 소금판 주변에 지하수가 솟아 야생동물들의 천연 사파리 보고 완성', visualKeyFeature: '소금 먼지 속 코끼리 무리의 행진' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~10월 나미비아 건기 (워터홀 주변 야생동물 밀집 관찰 최적기)',
      satelliteCheckPoints: ['아프리카 남서부 위성 영상에서 뚜렷한 거대한 은백색 타원형 분지'],
      cautionAndConservation: '국립공원 차량 밖 하차 절대 금지'
    }
  },
  {
    id: 'playa-wd-4',
    terrain: '플라야',
    region: 'world',
    placeName: '미국 유타 보너빌 솔트 플랫 (Bonneville Salt Flats)',
    countryOrArea: '미국 유타주 툼엘 카운티 웬도버 인근',
    tagline: '시속 1,000km 지상 최고 속도 기록이 탄생하는 300㎢의 초평탄 백색 소금 고속도로',
    description: `### 장소 소개 및 선정 이유
유타주 서부에 펼쳐진 보너빌 소금평원은 빙하기 거대 보너빌 호수가 증발하며 남긴 단단한 암염판으로, 지구가 둥글다는 것을 눈으로 볼 수 있을 만큼 끝없이 평평하여 자동차 지상 최고 속도(Land Speed Record) 경쟁이 열리는 플라야입니다.

### 과학적 형성 과정
마지막 빙하기 당시 그레이트솔트호의 전신이었던 보너빌 호수의 수위가 낮아지면서, 바닥에 최대 1.5m 두께의 고순도 탄산염과 소금 결정층이 수평으로 쌓여 형성되었습니다.`,
    formationProcess: '빙하기 거대 보너빌호의 급격한 증발 및 고밀도 암염 결정판 침전',
    observationPoints: ['수평선 끝까지 뻗은 100% 수평 소금 트랙', '지구 곡률을 체감할 수 있는 광활한 백색 지평선', '속도 기록 측정 트랙 스피드웨이'],
    mapQuery: 'Bonneville Salt Flats Utah',
    geology: {
      geologicalAge: '플라이스토세 말기 (약 1만 4,000년 전)',
      rockType: '90% 순수 염화나트륨 암염 및 칼륨 염',
      tectonicSetting: '분지-산맥 지구대 서부 그레이트베이슨 사막',
      geomorphicAgent: '호수 파동 분출(Bonneville Flood) 이후 극단적 증발',
      scale: { areaKm2: 300, depthMeters: 1.5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '보너빌 호수의 거대 수역', timeframe: '약 3만 년 전', process: '유타주 대부분을 덮었던 수심 300m 담수호 번성', visualKeyFeature: '바다 같은 고대 거대 호수' },
      { stageNumber: 2, title: '레드록 패스 대홍수와 수위 급강하', timeframe: '약 1만 4,500년 전', process: '호수 둑이 터지며 엄청난 물이 방류되고 수위 급락', visualKeyFeature: '바닥을 드러내는 고대 호안선' },
      { stageNumber: 3, title: '단단한 암염 고속도로 안착', timeframe: '현재', process: '남은 물이 완전히 증발하여 콘크리트처럼 단단한 소금 바닥 완성', visualKeyFeature: '지상 최고 속도를 시험하는 소금 활주로' }
    ],
    fieldGuide: {
      bestVisitingSeason: '7월~10월 건기 (바닥이 바짝 말라 차량 주행 가능)',
      satelliteCheckPoints: ['80번 주간고속도로(I-80)가 가로지르는 눈부신 백색 평원'],
      cautionAndConservation: '비 온 뒤 젖은 소금판 진입 시 차량 바퀴 함몰 주의'
    }
  },

  // ==========================================
  // 5. 메사·뷰트 (Mesa & Butte)
  // ==========================================
  {
    id: 'mesa-wd-1',
    terrain: '메사·뷰트',
    region: 'world',
    placeName: '미국 모뉴먼트 밸리 (Monument Valley)',
    countryOrArea: '미국 유타주·애리조나주 나바호 네이션',
    tagline: '붉은 사암 평원에 신전의 기둥처럼 우뚝 솟아 서부 영화의 전설이 된 거대 메사와 뷰트',
    description: `### 장소 소개 및 선정 이유
나바호 부족 성지인 모뉴먼트 밸리는 지평선까지 뻗은 황량한 붉은 평원에 납작한 탁자 모양의 거대 메사(Mesa)와 외로운 촛대 모양의 뷰트(Butte)들이 늘어선 전 세계 건조 지형학의 최고 아이콘입니다.

### 과학적 형성 과정
과거 하나의 거대한 고원이었던 지형이 하천과 비바람에 깎여 나가면서, 상부의 단단한 사암층(캡록, Shinarump 력암)이 우산 역할을 하여 그 아래의 연약한 셰일층을 보호한 구역만 깎이지 않고 남아 평평한 메사가 되었고, 메사가 더 쪼개져 뾰족한 기둥이 된 것이 뷰트입니다.`,
    formationProcess: '수평 지층 고원의 절리망 풍화 및 단단한 캡록(Caprock) 보호에 의한 잔류 탁상지 형성',
    observationPoints: ['벙어리장갑 모양의 미튼 뷰트(Mitten Buttes)', '평평한 상부 캡록 단면', '절벽 기저부 탈루스(Talus) 완경사'],
    mapQuery: 'Monument Valley Utah USA',
    geology: {
      geologicalAge: '고생대 페름기~중생대 트라이아스기 (약 2억 7,000만~2억 년 전)',
      rockType: '데 첼리 사암(De Chelly Sandstone) 및 모엔코피 셰일, 캡록 력암',
      tectonicSetting: '콜로라도 고원 융기 수평 퇴적 분지',
      geomorphicAgent: '단속적 하천 삭박, 건조 붕락 및 캡록 차별 침식',
      scale: { elevationMeters: 300, areaKm2: 120 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '페름기 붉은 모래와 진흙 퇴적', timeframe: '약 2억 5,000만 년 전', process: '얕은 바다와 사막 바람이 번갈아 들며 두꺼운 수평 붉은 사암과 진흙층 형성', visualKeyFeature: '수백 미터 두께의 광대한 수평 적색 지층' },
      { stageNumber: 2, title: '상부 보호 뚜껑(캡록) 고화', timeframe: '약 2억 년 전', process: '최상부에 풍화에 지극히 강한 단단한 역암 및 사암 지층이 퇴적되어 천연 방패 구축', visualKeyFeature: '지층 꼭대기를 덮은 단단한 암석 뚜껑' },
      { stageNumber: 3, title: '고원 융기 및 절리 하천 삭박', timeframe: '약 5,000만 년 전', process: '콜로라도 고원 융기 후 빗물이 수직 균열을 따라 흘러 넓은 대지를 깎아 거대 메사로 분할', visualKeyFeature: '넓은 테이블 모양의 탁상 대지(메사)' },
      { stageNumber: 4, title: '뷰트와 촛대 바위로의 축소', timeframe: '현재', process: '사면 붕락으로 메사가 쪼개져 너비보다 높이가 더 높은 뷰트와 첨탑(Spire)으로 진화', visualKeyFeature: '모뉴먼트 밸리를 상징하는 세 쌍둥이 미튼 뷰트' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄(4~5월) 및 가을(9~10월) 일출/일몰 황금 시간대',
      satelliteCheckPoints: ['황갈색 콜로라도 고원 평원 위에 짙은 붉은색 섬처럼 솟은 4각형, 원형 메사와 뷰트들', '사암 기둥 아래 사방으로 부채꼴로 퍼져나간 부스러기 돌무더기(테일러스) 완경사면', '나바호 17마일 루프 드라이브 흙길'],
      cautionAndConservation: '나바호 부족 자치령 법률 준수 및 허가 구역 외 오프로드 진입 금지'
    }
  },
  {
    id: 'mesa-wd-2',
    terrain: '메사·뷰트',
    region: 'world',
    placeName: '미국 유타 캐니언랜즈 아일랜드 인 더 스카이 (Island in the Sky Mesa)',
    countryOrArea: '미국 유타주 모압 서부 캐니언랜즈 국립공원',
    tagline: '300m 수직 절벽 위에 공중섬처럼 홀로 떠 있는 거대한 모래사암 탁상 대지',
    description: `### 장소 소개 및 선정 이유
콜로라도 강과 그린 강이 수백만 년 동안 고원을 깎아내리며 만든 '아일랜드 인 더 스카이'는 절벽 위에 고립된 채 하늘에 떠 있는 거대한 섬처럼 솟아 있는 대표적인 거대 메사 지형입니다.

### 과학적 형성 과정
단단한 화이트 림 사암층이 상부를 보호하는 가운데 두 강이 주변 대지를 깊게 파내어 수직 절벽을 형성했고, 좁은 목(The Neck) 하나로만 본토와 연결된 전형적인 잔류 고원 메사가 되었습니다.`,
    formationProcess: '콜로라도강과 그린강의 양측방 협곡 굴착에 따른 고립 탁상대지 형성',
    observationPoints: ['메사 끝자락 그랜드뷰 포인트', '수백 미터 아래 펼쳐진 미로 협곡', '메사 가장자리 메사 아치'],
    mapQuery: 'Island in the Sky Canyonlands Utah',
    geology: {
      geologicalAge: '트라이아스기~쥐라기 윙게이트 사암층',
      rockType: '두터운 풍성 사암 및 석회질 셰일',
      tectonicSetting: '콜로라도 고원 중심부 단층 협곡 지대',
      geomorphicAgent: '하천 두부 침식 및 사면 붕락(Mass Wasting)',
      scale: { elevationMeters: 1800, areaKm2: 40 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '쥐라기 붉은 모래언덕 고화', timeframe: '약 2억 년 전', process: '거대한 사막 모래언덕이 굳어 단단한 사암층 형성', visualKeyFeature: '수백 미터 두께의 붉은 사암 절벽' },
      { stageNumber: 2, title: '콜로라도강 협곡 삭박', timeframe: '약 600만 년 전', process: '강물이 양쪽에서 고원을 파고들며 주변부를 깎아냄', visualKeyFeature: '깊은 계곡 사이에 고립되는 대지' },
      { stageNumber: 3, title: '하늘 위의 섬 메사 완성', timeframe: '현재', process: '너비 수십 미터의 좁은 목으로만 연결된 공중섬 탁상지 안착', visualKeyFeature: '절벽 위에서 360도로 펼쳐지는 파노라마' }
    ],
    fieldGuide: {
      bestVisitingSeason: '봄과 가을 일출 시간 (메사 아치 일출)',
      satelliteCheckPoints: ['두 강 사이에 삼각형 모양으로 솟아 있는 평평한 고원 지대'],
      cautionAndConservation: '절벽 난간 추락 주의'
    }
  },
  {
    id: 'mesa-wd-3',
    terrain: '메사·뷰트',
    region: 'world',
    placeName: '베네수엘라 로라이마산 테푸이 (Mount Roraima Tepui)',
    countryOrArea: '베네수엘라·브라질·가이아나 국경 기아나 고지',
    tagline: '코난 도일의 소설 <잃어버린 세계>와 픽사 애니메이션 <업>의 무대가 된 20억 년 된 원시 탁상산',
    description: `### 장소 소개 및 선정 이유
기아나 고지에 우뚝 솟은 로라이마산은 해발 2,810m, 사방이 1,000m 높이의 수직 절벽으로 차단된 거대한 탁상산(현지어로 '테푸이, Tepui')으로, 지구상에서 가장 오래된 암석으로 이루어진 궁극의 거대 메사 지형입니다.

### 과학적 형성 과정
약 20억 년 전 선캄브리아기에 퇴적된 단단한 로라이마 석영 사암 지층이 지각 변동으로 융기한 후, 수억 년에 걸친 비바람 침식으로 연약부가 깎여 나가고 단단한 사암 암반만이 수직 절벽으로 남았습니다. 고립된 정상 평탄면에는 독자적인 원시 생태계가 보존되어 있습니다.`,
    formationProcess: '선캄브리아기 순상지 석영 사암의 수직 단열 침식 및 1,000m 단애 잔류 탁상산 형성',
    observationPoints: ['사방 1,000m 수직 사암 절벽', '정상부의 검은 사암 미로와 천연 크리스탈 계곡', '구름바다 위로 솟아오른 탁상형 실루엣'],
    mapQuery: 'Mount Roraima Venezuela',
    geology: {
      geologicalAge: '선캄브리아기 원생대 (약 20억~18억 년 전 지구 최고령 지층)',
      rockType: '초고순도 석영 사암 및 규암 (Roraima Group Sandstone)',
      tectonicSetting: '기아나 순상지(Guiana Shield) 안정한 원생대 크라톤',
      geomorphicAgent: '수억 년간의 수직 단열 용식 삭박 및 암벽 대붕락',
      scale: { areaKm2: 31, elevationMeters: 2810, depthMeters: 1000 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '원생대 고원 사암 퇴적', timeframe: '약 20억 년 전', process: '원시 강과 바다 밑에 수천 미터 두께의 단단한 석영 모래층 퇴적', visualKeyFeature: '지구 역사상 가장 단단한 석영 암반' },
      { stageNumber: 2, title: '초대륙 분열과 고원 융기', timeframe: '중생대', process: '대륙이 갈라지며 기아나 고지가 솟아오르고 수직 균열 발생', visualKeyFeature: '수직으로 금이 간 거대한 고원 대지' },
      { stageNumber: 3, title: '수억 년의 침식과 테푸이 분리', timeframe: '수억 년간', process: '비바람이 균열을 깎아 주변 대지를 평평하게 밀어내고 거대 메사만 남김', visualKeyFeature: '1,000m 직벽의 고립된 탁상산 출현' },
      { stageNumber: 4, title: '잃어버린 세계의 섬 안착', timeframe: '현재', process: '고립된 정상에서 식충식물 등 독자적 고유 생물이 번성하는 원시 생태계 유지', visualKeyFeature: '구름 속에 뜬 신비의 탁상산' }
    ],
    fieldGuide: {
      bestVisitingSeason: '12월~4월 건기 (전문 가이드 동반 6일 트레킹 필수)',
      satelliteCheckPoints: ['아마존 밀림 북쪽 구름 속에 거대한 사각형 밥상처럼 솟은 짙은 흑색 암괴'],
      cautionAndConservation: '정상부 원시 식물 훼손 및 수정(크리스탈) 반출 엄격 금지'
    }
  },

  // ==========================================
  // 6. 와디 (Wadi / Dry Valley)
  // ==========================================
  {
    id: 'wadi-wd-1',
    terrain: '와디',
    region: 'world',
    placeName: '요르단 와디 럼 (Wadi Rum)',
    countryOrArea: '요르단 아카바주 남부',
    tagline: '영화 <마션>과 <듄>의 촬영지이자 화성처럼 붉은 모래 골짜기가 펼쳐진 달의 계곡',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연 및 복합유산인 '와디 럼(달의 계곡)'은 아라비아 사막 남부에 펼쳐진 장대한 건천(와디, Wadi) 계곡으로, 평소에는 물이 전혀 흐르지 않는 메마른 붉은 모래 협곡이지만 드물게 내리는 폭우 시 거대한 급류가 흘러 화성 같은 풍경을 빚어냅니다.

### 과학적 형성 과정
선캄브리아기 화강암 기반암 위에 쌓인 두터운 사암층이 수직 단층선을 따라 갈라진 후, 과거 플라이스토세 빙하기의 습윤했던 기후 당시 흐르던 거대한 하천이 계곡을 깊게 파놓았습니다. 현재는 건조 기후로 바뀌어 평소엔 마른 골짜기로 남아 있습니다.`,
    formationProcess: '과거 고습윤기 하천의 깊은 협곡 굴착 및 현재 건조기 간헐적 돌발 홍수(Flash Flood) 유지',
    observationPoints: ['수직 800m 적색 사암 절벽', '와디 바닥의 광활한 붉은 모래밭', '천연 암석 아치(움 프루스 아치)'],
    mapQuery: 'Wadi Rum Jordan',
    geology: {
      geologicalAge: '선캄브리아기 화강암 기저 위 캄브리아기~오르도비스기 사암층',
      rockType: '붉은색 석영질 사암 (Disi & Umm Ishrin Sandstone)',
      tectonicSetting: '사해 변환단층(Dead Sea Transform) 동측 아라비아 판 내부',
      geomorphicAgent: '고기 하천 침식(Paleo-fluvial) 및 간헐적 토석류 삭박',
      scale: { areaKm2: 720, elevationMeters: 1750, depthMeters: 800 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '캄브리아기 거대 사암층 집적', timeframe: '약 5억 년 전', process: '기반암 위에 철분을 품은 수백 미터 두께의 붉은 사암층이 수평으로 쌓여 고화', visualKeyFeature: '화강암 위에 올라앉은 붉은 사암 대지' },
      { stageNumber: 2, title: '수직 절리 단열과 격자망 발생', timeframe: '신생대 제3기 사해 단층기', process: '아라비아판 균열로 가로세로 수백 미터 간격의 거대한 수직 틈새 발생', visualKeyFeature: '바둑판 모양으로 깊게 금이 간 바위산' },
      { stageNumber: 3, title: '빙하기 고습윤성 거대 하천 굴착', timeframe: '플라이스토세 빙기', process: '당시 아라비아반도에 쏟아진 막대한 비로 거대한 강물이 흘러 800m 깊은 계곡 완성', visualKeyFeature: '사막 한가운데 흐르던 거대한 강줄기' },
      { stageNumber: 4, title: '건조화와 화성의 붉은 와디 완성', timeframe: '현재', process: '기후가 건조해지며 물이 마르고 바람이 실어 온 붉은 모래가 바닥을 메워 화성 계곡 안착', visualKeyFeature: '영화 속 외계 행성 같은 붉은 사암 협곡' }
    ],
    fieldGuide: {
      bestVisitingSeason: '3월~5월 및 9월~11월 (베두인 4WD 사막 사파리 투어 최적기)',
      satelliteCheckPoints: ['황갈색 위성 영상에서 붉은 물감을 칠한 듯 짙은 적갈색을 띠는 와디 럼 암괴들', '절벽 사이에 평평한 고속도로처럼 곧게 뻗은 마른 모래 골짜기 바닥', '모래언덕과 협곡이 만나는 붉은 부채꼴'],
      cautionAndConservation: '겨울철 돌발 홍수(Flash Flood) 발생 시 협곡 내 진입 절대 엄금'
    }
  },
  {
    id: 'wadi-wd-2',
    terrain: '와디',
    region: 'world',
    placeName: '오만 와디 바니 칼리드 (Wadi Bani Khalid)',
    countryOrArea: '오만 북동부 샤르키야주 하자르 산맥',
    tagline: '황량한 석회암 협곡 한복판에 1년 내내 마르지 않는 에메랄드빛 천연 수영장 협곡',
    description: `### 장소 소개 및 선정 이유
아라비아 반도 오만의 하자르 산맥에 위치한 '와디 바니 칼리드'는 건조한 사막 협곡 와디 중에서도 사계절 내내 마르지 않고 청록색 맑은 물이 솟아오르는 신비로운 하천 계곡입니다.

### 과학적 형성 과정
하자르 산맥 고산지대에 스며든 지하수가 카르스트 절벽 기저부에서 용출되어 협곡을 따라 흐르며 깊은 자연 수영장(Canyon Pool)을 형성하고, 하류의 사막 모래밭으로 스며들며 와디의 전형적인 유수 패턴을 보여줍니다.`,
    formationProcess: '산악 카르스트 단층 용출수와 간헐적 폭우의 협곡 굴착 작용',
    observationPoints: ['에메랄드빛 천연 협곡 수영장', '바람과 급류가 깎아놓은 매끄러운 흰색 석회암 암벽', '협곡 상류 무칼 동굴(Muqal Cave)'],
    mapQuery: 'Wadi Bani Khalid Oman',
    geology: {
      geologicalAge: '중생대 백악기 석회암층',
      rockType: '괴상 석회암 및 사암, 하천 자갈 퇴적물',
      tectonicSetting: '오만 오피올라이트 오버스러스트 인근 하자르 조산대',
      geomorphicAgent: '간헐적 플래시 플러드 하식 및 지하수 용출',
      scale: { lengthKm: 15, depthMeters: 150 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 석회암 산맥 융기', timeframe: '약 7,000만 년 전', process: '해양 지각 충돌로 하자르 산맥이 융기하며 깊은 단열망 형성', visualKeyFeature: '가파른 석회암 산악 암벽' },
      { stageNumber: 2, title: '급류 홍수의 계곡 굴착', timeframe: '수십만 년간', process: '드물게 내리는 폭우가 거센 급류로 변해 암벽을 깎아 깊은 협곡 완성', visualKeyFeature: '매끄럽게 파인 수직 협곡' },
      { stageNumber: 3, title: '지하수 용출과 사계절 천연 풀', timeframe: '현재', process: '사막 한가운데 연중 맑은 물이 고여 오만의 대표 생태 관광지 안착', visualKeyFeature: '황량한 바위산 속 청옥빛 파라다이스' }
    ],
    fieldGuide: {
      bestVisitingSeason: '10월~4월 (기온 25℃ 안팎, 수영 가능)',
      satelliteCheckPoints: ['갈색 하자르 산맥 협곡 사이로 길게 뻗은 푸른 물줄기와 야자수 오아시스'],
      cautionAndConservation: '비구름 접근 시 돌발 홍수 위험으로 즉시 협곡 탈출'
    }
  },
  {
    id: 'wadi-wd-3',
    terrain: '와디',
    region: 'world',
    placeName: '나미비아 피시 리버 캐니언 (Fish River Canyon)',
    countryOrArea: '나미비아 카라스주 남부',
    tagline: '길이 160km, 깊이 550m, 그랜드캐니언에 이은 아프리카 최대의 거대 건조 협곡',
    description: `### 장소 소개 및 선정 이유
나미비아 남부에 위치한 피시 리버 캐니언은 아프리카에서 가장 거대하고 장엄한 협곡으로, 평소에는 물이 거의 흐르지 않고 웅덩이 형태로만 남아 있는 세계적인 건천 와디 협곡입니다.

### 과학적 형성 과정
약 5억 년 전 판 구조 운동으로 지각이 갈라지며 단층 지구가 형성된 후, 과거 습윤했던 기후 당시 흐르던 거대한 강물이 깊이 550m까지 바닥을 깎아내렸습니다. 현재는 건조 기후로 바뀌어 매년 여름 짧은 우기에만 강물이 흐릅니다.`,
    formationProcess: '지구 단층 균열과 과거 고하천의 깊은 하방 침식 및 현재 건조 하도 잔존',
    observationPoints: ['깊이 550m의 거대한 수직 단애선', '협곡 바닥의 구불구불한 말라붙은 사행 유로', '지옥스 뷰포인트 조망'],
    mapQuery: 'Fish River Canyon Namibia',
    geology: {
      geologicalAge: '선캄브리아기 나마계 퇴적암 및 기저 복합체 (약 6억 5,000만 년 전)',
      rockType: '변성 편마암 기저 위 석영 사암, 혈암 및 백운암',
      tectonicSetting: '남아프리카 대륙 열개 단층 지구대',
      geomorphicAgent: '구조 단층선 추종 하천 굴착 및 건조 풍화',
      scale: { lengthKm: 160, depthMeters: 550, areaKm2: 1200 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '선캄브리아기 지각 분열 단층', timeframe: '약 5억 년 전', process: '대륙 지각이 갈라지며 지반이 푹 꺼진 지구대 계곡 형성', visualKeyFeature: '수직 절벽으로 갈라진 원시 대지' },
      { stageNumber: 2, title: '곤드와나 빙하와 강물의 협곡 삭박', timeframe: '약 3억 년 전', process: '빙하와 거대한 빙하 융설수가 협곡 바닥을 수백 미터 깊이로 파냄', visualKeyFeature: '바닥을 알 수 없는 거대한 대협곡' },
      { stageNumber: 3, title: '건조화와 아프리카 최대 건천 안착', timeframe: '현재', process: '물이 마르며 거대한 와디 협곡으로 변모하여 극한 트레커들의 성지로 발전', visualKeyFeature: '지구의 속살이 드러난 장대한 파노라마' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 나미비아 겨울철 (여름철 45℃ 이상으로 하이킹 통제)',
      satelliteCheckPoints: ['황갈색 아프리카 남부 고원에 뱀처럼 구불구불 깊게 파인 거대한 검은 균열선'],
      cautionAndConservation: '협곡 하이킹 시 의료진 사전 건강진단서 필수 요구'
    }
  }
];
