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

  // ==========================================
  // 3. 메사·뷰트 (Mesa & Butte)
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

  // ==========================================
  // 4. 와디 (Wadi / Dry Valley)
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
  }
];
