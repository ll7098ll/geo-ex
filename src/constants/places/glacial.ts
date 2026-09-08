import { PlaceInfo } from '../../types';

export const GLACIAL_PLACES: PlaceInfo[] = [
  // ==========================================
  // 1. U자곡 (U-shaped Valley)
  // ==========================================
  {
    id: 'uvalley-kr-1',
    terrain: 'U자곡',
    region: 'korea',
    placeName: '백두산 북사면 빙식곡',
    countryOrArea: '대한민국(북한/중국 국경 백두산 북사면)',
    tagline: '신생대 제4기 빙하기에 백두산 정상 빙모가 산기슭을 긁어내며 형성한 거대 U자형 빙식 계곡',
    description: `### 장소 소개 및 선정 이유
백두산 천지 북쪽 사면(비룡폭포 하류)은 한반도에서 제4기 빙하기의 실체적 빙하 침식 작용을 가장 확실하게 증명하는 학술적 U자곡 지형입니다.

### 과학적 형성 과정
마지막 최대 빙하기(LGM) 당시 해발 2,000m 이상의 백두산 정상부에 형성된 거대한 얼음 모자(Ice Cap)에서 뻗어나온 곡빙하(Valley Glacier)가 거대한 무게와 저면 자갈로 산비탈을 깎아내려(굴식 및 마모), 좁았던 V자형 하곡을 바닥이 평평하고 양 벽이 가파른 전형적인 U자곡으로 넓혔습니다.

### 탐험 포인트
- **비룡폭포(장백폭포) 협곡 단면**: 양쪽 벽이 수직에 가깝게 치솟고 바닥이 완만한 U자형 단면
- **빙하 찰흔 바위**: 빙하 밑바닥 자갈이 화산암 기반암을 긁고 지나가며 남긴 평행 찰흔(Striations)`,
    formationProcess: '정상부 빙모에서 흘러내린 곡빙하의 강력한 저면 굴식(Plucking)과 측면 마모(Abrasion)',
    observationPoints: ['급경사 측벽과 평탄한 바닥의 U자 단면', '매끄럽게 연마된 기반암', '현애곡(Hanging Valley) 단차'],
    mapQuery: '백두산 장백폭포 협곡',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 후기 (약 7만~2만 년 전)',
      rockType: '조면암질 용암 및 백두산 화산쇄설암',
      tectonicSetting: '백두산 고산 화산체 정상 설선',
      geomorphicAgent: '곡빙하 저면 굴식(Plucking) 및 측방 마식(Abrasion)',
      scale: { elevationMeters: 2200, depthMeters: 180, lengthKm: 6.5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '화산체 형성 및 V자 하곡', timeframe: '약 10만 년 전', process: '화산 분출 후 천지 주변 빗물과 눈 녹은 물이 좁은 V자형 계곡을 파냄', visualKeyFeature: '가파른 V자형 계곡 골짜기' },
      { stageNumber: 2, title: '최대 빙기 정상 빙모 발달', timeframe: '약 2만 년 전 (LGM)', process: '설선이 고도 2,000m까지 하강하며 백두산 정상에 수백 미터 두께의 빙원 탄생', visualKeyFeature: '만년설과 거대한 얼음 덩어리 산체' },
      { stageNumber: 3, title: '곡빙하 하강 및 U자형 굴삭', timeframe: '약 1만 5,000년 전', process: '얼음의 거대한 중량과 바닥에 박힌 암괴들이 계곡 양쪽 벽과 바닥을 통째로 깎아냄', visualKeyFeature: '바닥이 평평하고 벽이 직각인 U자곡 탄생' },
      { stageNumber: 4, title: '빙하 퇴각 및 장백폭포', timeframe: '약 1만 년 전~현재', process: '빙하가 녹아 사라지고 천지 배출수가 U자곡 절벽을 타고 떨어지며 장백폭포 완성', visualKeyFeature: '웅장한 폭포와 양안의 수직 빙식애' }
    ],
    fieldGuide: {
      bestVisitingSeason: '7월~8월 (천지 만년설이 녹고 들꽃이 피는 한여름)',
      satelliteCheckPoints: ['천지 북쪽 달문에서 시작하여 완만한 바닥을 이루며 북쪽으로 뻗은 U자형 회색 계곡선', '계곡 양안의 가파른 암벽 그림자', '장백폭포 하류 온천 지대 김이 피어오르는 수계'],
      cautionAndConservation: '낙석 위험 및 고산 저체온증 대비'
    }
  },
  {
    id: 'uvalley-kr-2',
    terrain: 'U자곡',
    region: 'korea',
    placeName: '대구 비슬산 암괴류 (주빙하 돌강)',
    countryOrArea: '대한민국 대구광역시 달성군 유가읍',
    tagline: '빙하기 동결·융해 작용으로 깨진 집채만 한 화강암 바위들이 계곡을 가득 메운 세계 최대의 암괴류',
    description: `### 장소 소개 및 선정 이유
천연기념물 제435호인 비슬산 암괴류는 길이 2km, 두께 5m에 달하는 거대한 바위들이 강물처럼 계곡을 메우고 흘러내린 형태로, 한반도 빙하기 주빙하(Periglacial) 기후의 극한 환경을 증명하는 세계 최정상급 돌강입니다.

### 과학적 형성 과정
제4기 빙하기 당시 한반도는 두꺼운 얼음판에 덮이지는 않았으나 영구동토층이 형성되는 혹한의 주빙하 환경이었습니다. 바위 틈의 물이 얼고 녹기를 반복하면서 거대한 화강암이 부서졌고(동결파쇄), 여름철 해빙기에 미끄러운 점토를 타고 바위들이 완만한 경사를 따라 흘러내렸습니다.`,
    formationProcess: '주빙하 기후하에서의 동결 파쇄(Gelifraction) 및 동토 융해에 따른 솔리플럭션 이동',
    observationPoints: ['길이 2km의 거대 바위 강', '모서리가 둥글려진 거력들', '경사각 10~15도의 완만한 흐름선'],
    mapQuery: '비슬산 암괴류',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 빙기 (약 10만~1만 년 전)',
      rockType: '중생대 백악기 불국사 화강암 거력(Boulder)',
      tectonicSetting: '영남육괴 화강암 관입 산악 사면',
      geomorphicAgent: '동결-융해 쐐기작용(Frost Wedging) 및 융빙 유동(Solifluction)',
      scale: { lengthKm: 2.0, depthMeters: 5.0, elevationMeters: 1000 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '심부 풍화 및 핵석 형성', timeframe: '중생대~신생대 제3기', process: '온난다습한 기후에서 지하수 풍화로 화강암 절리 사이 둥근 바위 알맹이(핵석) 배태', visualKeyFeature: '흙 속에 묻혀 있던 거대한 둥근 화강암 바위들' },
      { stageNumber: 2, title: '제4기 빙기 주빙하 혹한', timeframe: '약 7만~2만 년 전', process: '한반도가 툰드라 주빙하대에 속하며 영구동토층 형성 및 동결 파쇄 극대화', visualKeyFeature: '바위 틈 얼음 팽창으로 부서지는 산정 암반' },
      { stageNumber: 3, title: '여름철 사면 유동(Solifluction)', timeframe: '간빙기 전환기', process: '표토가 녹으며 진흙과 거대한 바위들이 완경사 계곡을 따라 강물처럼 서서히 이동', visualKeyFeature: '계곡을 메우며 미끄러져 내려가는 바위의 강' },
      { stageNumber: 4, title: '미세 토양 세척 및 암괴류 완성', timeframe: '후빙기~현재', process: '강우가 바위 사이의 진흙을 씻어내어 거대한 순수 화강암 암괴들만 지표에 남음', visualKeyFeature: '2km 길이의 장엄한 바위 바다와 지하 복류수음' }
    ],
    fieldGuide: {
      bestVisitingSeason: '4월 말 참꽃(진달래) 축제 및 10월 가을 억새 시즌',
      satelliteCheckPoints: ['비슬산 대견봉 아래 계곡을 따라 회색 뱀처럼 구불구불 이어지는 돌강 띠', '주변의 짙은 초록색 침엽수림과 회색 바위밭의 극명한 색 대비', '대견사지 절터 앞 능선의 기암괴석군'],
      cautionAndConservation: '천연기념물 구역으로 바위 위 뜀박질 금지 및 낙상 주의'
    }
  },
  {
    id: 'uvalley-wd-1',
    terrain: 'U자곡',
    region: 'world',
    placeName: '미국 요세미티 밸리 (Yosemite Valley)',
    countryOrArea: '미국 캘리포니아주 시에라네바다 산맥',
    tagline: '거대한 빙하가 1,000m 화강암 산맥을 통째로 깎아내린 U자곡의 세계적 절대 성지',
    description: `### 장소 소개 및 선정 이유
존 뮤어가 '자연의 신전'이라 극찬한 요세미티 밸리는 엘 캐피탄, 하프돔 등 1,000m에 달하는 거대한 수직 화강암 벽들과 계곡 바닥의 푸른 초원이 완벽한 U자형을 이루는 지구상에서 가장 웅장한 빙식곡입니다.

### 과학적 형성 과정
선신세에 하천이 깎아놓았던 좁은 V자형 메르세드강 계곡을 따라 수차례의 빙하기 동안 두께 1,000m가 넘는 거대한 빙하가 밀고 내려왔습니다. 빙하는 연약한 절리면을 뜯어내고(Plucking) 단단한 화강암 바닥을 갈아내어 수직 벽과 평평한 계곡 바닥을 완성했습니다.`,
    formationProcess: '메르세드강 고하곡을 따라 진입한 초대형 곡빙하의 수직 절벽 삭박 및 저면 평탄화',
    observationPoints: ['1,000m 수직 단애 엘 캐피탄', '빙식 현애곡 요세미티 폭포', '계곡 바닥의 완벽한 평탄 초원'],
    mapQuery: 'Yosemite Valley California USA',
    geology: {
      geologicalAge: '백악기 화강암 저반 위 신생대 제4기 플라이스토세 빙하 침식',
      rockType: '치밀하고 균질한 백악기 화강암 (El Capitan Granite)',
      tectonicSetting: '시에라네바다 경동단괴 산맥 서사면',
      geomorphicAgent: '두께 1,000m 곡빙하의 굴식 및 마식 삭박',
      scale: { depthMeters: 1000, lengthKm: 12, areaKm2: 18 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 거대 화강암 저반 관입', timeframe: '약 1억 년 전', process: '지하 10km에서 거대한 마그마가 서서히 식어 절리가 거의 없는 단단한 암반 형성', visualKeyFeature: '지하에 묻힌 단단한 일체형 화강암 덩어리' },
      { stageNumber: 2, title: '시에라네바다 융기 및 V자 협곡', timeframe: '약 500만 년 전', process: '산맥이 융기하며 메르세드 강이 좁고 가파른 V자 협곡 굴착', visualKeyFeature: '하천이 흐르는 좁고 깊은 급경사 골짜기' },
      { stageNumber: 3, title: '두께 1,000m 빙하의 침공', timeframe: '약 100만~2만 년 전', process: '빙하기 얼음 혀가 계곡을 채우며 V자 협곡의 모서리를 통째로 갈아 마셔버림', visualKeyFeature: '얼음에 파묻힌 엘 캐피탄과 거대한 얼음 강' },
      { stageNumber: 4, title: '빙퇴석 호수와 평탄 U자곡 완성', timeframe: '약 1만 년 전~현재', process: '빙하가 녹으며 빙퇴석 댐 호수가 계곡 바닥을 모래로 평평하게 메워 낙원 초원 완성', visualKeyFeature: '수직 절벽에서 떨어지는 요세미티 폭포와 U자곡' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~6월 (눈 녹은 융설수로 요세미티 폭포 수량이 웅장한 봄철)',
      satelliteCheckPoints: ['시에라네바다 숲 한복판에 칼로 뚝 잘라낸 듯한 거대한 일자형 평탄 계곡선', '터널 뷰에서 조망되는 엘 캐피탄과 브라이덜베일 폭포의 수직 협곡 림', '하프돔의 독특한 반쪽 잘린 돔 형태'],
      cautionAndConservation: '야생 흑곰 서식지로 차량 내 음식물 보관 금지 및 레인저 규칙 준수'
    }
  },

  // ==========================================
  // 2. 호른 (Horn / Glacial Peak)
  // ==========================================
  {
    id: 'horn-kr-1',
    terrain: '호른',
    region: 'korea',
    placeName: '설악산 공룡능선 (주빙하 첨봉)',
    countryOrArea: '대한민국 강원도 속초시 / 양양군 / 인제군',
    tagline: '공룡의 등뼈처럼 하늘을 찌르는 백두대간 최고의 기암 칼날 능선',
    description: `### 장소 소개 및 선정 이유
국립공원 제1의 경관으로 꼽히는 설악산 공룡능선은 마등령에서 신선대까지 뻗은 약 5km의 암릉선으로, 제4기 빙하기 혹한의 주빙하 동결-파쇄 작용과 융기 침식이 결합하여 빚어낸 한국 지형학의 최고봉 칼날 능선(Arête)입니다.

### 과학적 형성 과정
지하의 화강암이 융기한 후, 제4기 빙하기 동안 0℃를 오르내리는 동결-융해 사이클이 바위 틈새의 물을 팽창시켜 양쪽 사면을 날카롭게 쪼개어 무너뜨렸고(서릿발 작용), 앙상한 칼날 뼈대만 남아 첨봉을 이루었습니다.`,
    formationProcess: '백악기 화강암의 지각 융기 및 제4기 빙기 혹한의 동결-파쇄 서릿발 쐐기 삭박',
    observationPoints: ['톱니바퀴 모양의 수직 첨봉들', '신선대에서 바라본 1275봉', '천불동 계곡으로 떨어지는 급경사 암벽'],
    mapQuery: '설악산 공룡능선',
    geology: {
      geologicalAge: '중생대 백악기 화강암 (약 8,000만 년 전) 위 제4기 주빙하 침식',
      rockType: '조립질 흑운모 화강암 및 반화강암 암맥',
      tectonicSetting: '태백산맥 북부 최고 융기축',
      geomorphicAgent: '동결 쐐기 서릿발 작용(Frost Shattering) 및 중력 붕락',
      scale: { elevationMeters: 1275, lengthKm: 5.1 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 화강암 심부 냉각', timeframe: '약 8,000만 년 전', process: '지하 수 km 깊이에서 마그마가 식으며 거대한 화강암체 형성', visualKeyFeature: '지하 암반 속에 발달한 직교 수직 절리면' },
      { stageNumber: 2, title: '동해 열개와 태백산맥 급융기', timeframe: '약 2,300만~1,500만 년 전', process: '지각 변동으로 해발 1,000m 이상으로 치솟아 지표에 노출', visualKeyFeature: '산마루로 드러난 거대한 바위산' },
      { stageNumber: 3, title: '빙하기 주빙하 동결 쐐기 난타', timeframe: '약 7만~2만 년 전', process: '한반도 혹한기에 바위 틈새 수분이 얼며 9% 팽창하여 양쪽 사면을 칼로 베듯 붕괴', visualKeyFeature: '양쪽 사면이 떨어져 나가며 날카로워지는 능선' },
      { stageNumber: 4, title: '공룡의 등뼈 완성', timeframe: '현재', process: '가장 단단한 중심 암맥만 톱니처럼 남아 1275봉, 범봉 등 기암 첨봉 완성', visualKeyFeature: '구름 위에 떠 있는 대한민국 최고의 암릉 비경' }
    ],
    fieldGuide: {
      bestVisitingSeason: '9월 말~10월 중순 설악산 단풍 절정기',
      satelliteCheckPoints: ['설악산 대청봉 북서쪽으로 톱니바퀴처럼 하얗게 도드라진 칼날 능선선', '능선 좌우로 깎아지른 천불동 계곡과 가야동 계곡의 음영 대비', '마등령에서 신선대까지 이어지는 바위 등뼈'],
      cautionAndConservation: '10시간 이상의 고난도 암릉 등산로로 체력 안배 및 기상 급변 철저 대비'
    }
  },
  {
    id: 'horn-wd-1',
    terrain: '호른',
    region: 'world',
    placeName: '스위스·이탈리아 마터호른 (Matterhorn)',
    countryOrArea: '스위스 체르마트 / 이탈리아 발토르낭슈',
    tagline: '사방에서 빙하가 깎아내려 만든 완벽한 4각 피라미드 빙식 첨봉의 세계적 상징',
    description: `### 장소 소개 및 선정 이유
해발 4,478m의 마터호른은 동서남북 네 면이 완벽한 피라미드 형태를 이루며 알프스 하늘을 찌르는 전 세계 빙식 첨봉(호른, Horn)의 절대적인 대명사이자 스위스의 상징입니다.

### 과학적 형성 과정
산봉우리의 동서남북 4개 사면에 각각 발달한 권곡 빙하(Cirque Glacier)들이 사방에서 중심부를 향해 바위벽을 갉아먹으며(두부 침식) 후퇴하다가, 정상부의 좁은 바위탑만 뾰족하게 남겨놓았습니다.`,
    formationProcess: '다방향 권곡 빙하의 구심적 두부 침식으로 형성된 4면 피라미드형 빙식 첨봉',
    observationPoints: ['동남서북 4면의 거대 피라미드 벽', '사면을 깎은 권곡 빙하 잔해', '회른리 능선(Hörnli Ridge)'],
    mapQuery: 'Matterhorn Zermatt Switzerland',
    geology: {
      geologicalAge: '아프리카판과 유럽판 충돌 조산운동 (약 4,500만 년 전) 위 제4기 빙식',
      rockType: '고변성 편마암, 녹색편암, 각섬암 (아프리카판 기원 오피올라이트)',
      tectonicSetting: '알프스 충돌 조산대 헬베틱-페닌 나페(Nappe) 구조',
      geomorphicAgent: '사방 4대 권곡 빙하의 후퇴성 두부 삭박(Cirque Headwall Erosion)',
      scale: { elevationMeters: 4478, depthMeters: 1200 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '아프리카판이 유럽판 위로 압쇄', timeframe: '약 4,500만 년 전', process: '판 충돌로 아프리카 대륙의 지괴가 밀려 올라와 알프스 지붕에 안착(나페 구조)', visualKeyFeature: '고산 지대에 얹혀진 단단한 변성암 덩어리' },
      { stageNumber: 2, title: '알프스 광역 융기', timeframe: '약 1,000만 년 전', process: '지반이 4,000m 이상으로 치솟으며 둥그스름한 거대 산체 형성', visualKeyFeature: '만년설로 뒤덮인 둥근 고산 돔' },
      { stageNumber: 3, title: '4방향 권곡 빙하의 협공', timeframe: '플라이스토세 빙기', process: '동서남북 4개 골짜기의 빙하가 정상부를 향해 바위벽을 안쪽으로 갉아냄', visualKeyFeature: '사방이 파여 나가며 날카로워지는 중심 피라미드' },
      { stageNumber: 4, title: '4,478m 마터호른 완성', timeframe: '현재', process: '눈과 얼음이 흘러내리고 완벽한 4각 피라미드형 암석 바늘탑 고착', visualKeyFeature: '체르마트 하늘을 찌르는 알프스의 여왕' }
    ],
    fieldGuide: {
      bestVisitingSeason: '7월~9월 (고르너그라트 전망대 열차 이용 최적기)',
      satelliteCheckPoints: ['우주에서도 뚜렷하게 보이는 완벽한 4각형 마터호른 그림자', '산기슭 사방으로 뻗어 나간 빙하(즈무트, 고르너 빙하)의 흰 혓바닥 줄기', '체르마트 계곡과의 수직 2,800m 극적인 고도차'],
      cautionAndConservation: '산악 전문 등반 시 낙석 및 기상 급변 주의'
    }
  },

  // ==========================================
  // 3. 권곡 (Cirque)
  // ==========================================
  {
    id: 'cirque-kr-1',
    terrain: '권곡',
    region: 'korea',
    placeName: '설악산 천불동 계곡 권곡두 (안락암 암벽)',
    countryOrArea: '대한민국 강원도 속초시 설악동',
    tagline: '빙하기 혹한의 얼음 덩어리가 웅덩이를 파고 앉았던 원형 극장 모양의 절벽 와지',
    description: `### 장소 소개 및 선정 이유
설악산 천불동 계곡 최상부 및 공룡능선 배후 사면은 한반도 제4기 주빙하기에 혹한의 눈과 얼음이 고이며 형성된 반원형 원형극장 모양의 바위 안식처, 즉 권곡(Cirque)성 와지의 원형을 간직하고 있습니다.

### 과학적 형성 과정
제4기 빙하기 당시 산정부 그늘진 사면에 쌓인 눈이 녹지 않고 다져져 만년설괴(Firn)가 되었고, 바닥의 동결 파쇄와 얼음의 회전 미끄럼 운동으로 암벽 밑바닥을 파내어 가파른 뒷벽(Headwall)을 가진 반원형 안락의자 모양의 지형을 만들었습니다.`,
    formationProcess: '만년설괴의 기저부 동결 파쇄 및 회전 유동 침식에 따른 반원형 암벽 와지 형성',
    observationPoints: ['반원형 말굽 모양의 암벽 병풍', '급경사 권곡두 뒷벽', '하류 U자곡과의 연결점'],
    mapQuery: '설악산 천불동계곡',
    geology: {
      geologicalAge: '신생대 제4기 플라이스토세 빙기',
      rockType: '백악기 반상 화강암',
      tectonicSetting: '태백산맥 설악산 단괴 산악',
      geomorphicAgent: '니베이션(Nivation, 설식 작용) 및 주빙하 동결 파쇄',
      scale: { depthMeters: 120, elevationMeters: 1100 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '설악산 융기 및 북사면 그늘', timeframe: '약 500만 년 전', process: '산맥 융기로 고도 1,000m 이상 지형에 일조량이 적은 북사면 계곡 형성', visualKeyFeature: '햇볕이 잘 들지 않는 깊은 계곡 상부' },
      { stageNumber: 2, title: '빙하기 만년설 집적', timeframe: '약 7만~2만 년 전', process: '겨울철 눈이 여름에도 녹지 않고 쌓여 단단한 만년설괴(Firn) 축적', visualKeyFeature: '계곡 꼭대기에 똬리를 튼 거대한 눈 덩어리' },
      { stageNumber: 3, title: '설식 및 바닥 굴착 작용', timeframe: '빙기 절정', process: '눈 덩어리 밑바닥에서 얼고 녹기가 반복되며 바위를 깨고 아래로 밀어냄', visualKeyFeature: '안락의자 형태로 옴폭 파여 들어가는 바위벽' },
      { stageNumber: 4, title: '권곡두 암벽 절경 완성', timeframe: '현재', process: '눈이 사라진 뒤 웅장한 말굽 모양의 암벽 병풍과 천불동 비경 안착', visualKeyFeature: '수직 바위벽과 기암괴석이 에워싼 원형 극장' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월 신록 및 10월 천불동 단풍 절정기',
      satelliteCheckPoints: ['대청봉 북동쪽 사면에 말굽 모양으로 움푹 파인 거대한 원형 바위벽 등고선', '천불동 계곡으로 이어지는 날카로운 협곡 입구', '비선대 주변 수직 암벽'],
      cautionAndConservation: '계곡 급경사 철계단 보행 주의'
    }
  },
  {
    id: 'cirque-wd-1',
    terrain: '권곡',
    region: 'world',
    placeName: '프랑스 피레네 가바르니 권곡 (Cirque de Gavarnie)',
    countryOrArea: '프랑스 오트피레네주 피레네 국립공원',
    tagline: '빅토르 위고가 "자연의 콜로세움"이라 극찬한 둘레 14km, 높이 1,500m의 초대형 권곡',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 피레네 산맥의 가바르니 권곡은 직경 3.5km, 둘레 14km, 수직 벽 높이만 1,500m에 달하는 지구상에서 가장 거대하고 완벽한 원형극장 모양의 빙식 권곡(Cirque)으로, 422m 높이의 거대한 가바르니 폭포가 쏟아져 내립니다.

### 과학적 형성 과정
플라이스토세 빙하기 동안 수백 미터 두께의 거대한 빙하 덩어리가 피레네산맥 정상부에 똬리를 틀고 앉아 수만 년 동안 회전 미끄럼 운동을 하며 석회암 뒷벽을 수직으로 뜯어내어 거대한 반원형 분지를 파냈습니다.`,
    formationProcess: '피레네 산악 빙하의 장기 회전 굴식에 따른 1,500m 수직 반원형 권곡 극장 형성',
    observationPoints: ['1,500m 수직 반원형 암벽 병풍', '422m 낙차의 가바르니 폭포', '롤랑의 갈라진 틈(Brèche de Roland)'],
    mapQuery: 'Cirque de Gavarnie Pyrenees France',
    geology: {
      geologicalAge: '고생대 및 백악기 석회암 위 신생대 제4기 플라이스토세 빙식',
      rockType: '괴상 석회암 및 퇴적 변성암',
      tectonicSetting: '이베리아판과 유라시아판 충돌 피레네 조산대',
      geomorphicAgent: '거대 권곡 빙하의 기저부 굴식 및 회전 활주',
      scale: { depthMeters: 1500, areaKm2: 30, lengthKm: 14 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '피레네 조산운동과 고원 형성', timeframe: '약 4,000만 년 전', process: '판 충돌로 석회암 대지가 해발 3,000m 이상으로 치솟음', visualKeyFeature: '구름 위에 솟은 거대한 석회암 산괴' },
      { stageNumber: 2, title: '거대 권곡 빙하의 태동', timeframe: '약 100만 년 전', process: '혹한의 기후로 거대한 만년설이 쌓여 수억 톤의 회전 빙하 형성', visualKeyFeature: '분지 바닥을 가득 메운 얼음 호수' },
      { stageNumber: 3, title: '1,500m 수직 뒷벽 굴착', timeframe: '플라이스토세 빙기', process: '빙하가 회전하며 뒷벽을 통째로 뜯어내어 1,500m의 거대한 수직 벽으로 후퇴', visualKeyFeature: '사방이 직벽으로 둘러싸인 거대한 원형 분지' },
      { stageNumber: 4, title: '빙하 퇴각과 422m 폭포', timeframe: '현재', process: '얼음이 녹아 사라지고 상부 만년설 융설수가 벽면을 타고 낙하하는 폭포 완성', visualKeyFeature: '자연이 만든 세계 최대의 천연 원형 콜로세움' }
    ],
    fieldGuide: {
      bestVisitingSeason: '6월~9월 (가바르니 마을에서 권곡 바닥까지의 완만한 트레킹 최적기)',
      satelliteCheckPoints: ['피레네 산맥 지도에서 완벽한 반원형 그릇 모양으로 파인 거대한 분지선', '스페인 국경 암벽 능선에 칼로 벤 듯 뚫린 롤랑의 틈(Brèche)', '권곡 중앙으로 모여 흐르는 은빛 폭포 물줄기'],
      cautionAndConservation: '봄철 해빙기 상부 만년설 눈사태 및 낙석 주의'
    }
  },

  // ==========================================
  // 4. 피오르드 (Fjord)
  // ==========================================
  {
    id: 'fjord-wd-1',
    terrain: '피오르드',
    region: 'world',
    placeName: '노르웨이 게이랑에르 피오르드 (Geirangerfjord)',
    countryOrArea: '노르웨이 뫼레오그롬스달주',
    tagline: '유네스코 세계유산으로 등재된 푸른 바다가 1,000m 빙식 절벽 사이를 파고든 요정의 만',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 게이랑에르 피오르드는 노르웨이 서해안을 대표하는 가장 수려한 피오르드로, 수심 수백 미터의 옥빛 바닷물이 1,400m에 달하는 수직 빙벽 협곡 사이를 15km나 파고들어 세계에서 가장 드라마틱한 절경을 빚어냅니다.

### 과학적 형성 과정
빙하기 동안 거대한 스칸디나비아 빙상이 옛 하천 골짜기를 바다 수면보다 훨씬 깊게(수심 수백 미터) 파내어 거대한 U자곡을 만들었고, 빙하기가 끝나며 얼음이 녹자 상승한 바닷물이 이 협곡을 채워 피오르드가 탄생했습니다.

### 탐험 포인트
- **7자매 폭포(Seven Sisters)**: 절벽에서 바다로 직접 수직 낙하하는 7갈래의 은빛 폭포수
- **플뤼달스유베 전망대**: 아찔한 절벽 바위 끝에서 피오르드 전체를 굽어보는 명소`,
    formationProcess: '스칸디나비아 대륙 빙하의 과심도 U자곡 굴착 후 후빙기 해수면 상승에 의한 침수',
    observationPoints: ['1,000m 수직 피오르드 협곡 벽', '바다로 떨어지는 7자매 폭포', '해수면 아래 수백 미터 수심'],
    mapQuery: 'Geirangerfjord Norway',
    geology: {
      geologicalAge: '선캄브리아기 편마암 기반암 위 신생대 제4기 플라이스토세 빙식',
      rockType: '선캄브리아기 화강암질 편마암 및 칼레도니아 변성암',
      tectonicSetting: '발틱 순상지 서측 대륙 연변부 융기 지대',
      geomorphicAgent: '스칸디나비아 대륙 빙상의 과심도(Overdeepening) 굴식 및 후빙기 침수',
      scale: { depthMeters: 600, lengthKm: 15, elevationMeters: 1400 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '선캄브리아기 단단한 편마암 고원', timeframe: '약 10억 년 전', process: '초경질 편마암 기반암이 형성되고 신생대 융기로 고원 협곡 배태', visualKeyFeature: '대서양을 마주한 높은 암석 고원' },
      { stageNumber: 2, title: '대륙 빙상의 수직 삭박', timeframe: '약 200만~2만 년 전', process: '수천 미터 두께의 빙하가 산맥을 통째로 누르며 해수면보다 깊게 바닥을 굴착', visualKeyFeature: '해저 수백 미터까지 파고든 거대한 U자 얼음 통로' },
      { stageNumber: 3, title: '빙하 퇴각과 바닷물 유입', timeframe: '약 1만 년 전', process: '빙하가 녹아 사라지자 북해의 푸른 바닷물이 협곡 안쪽으로 밀려들어 옴', visualKeyFeature: '천 길 낭떠러지 사이에 들어찬 바다' },
      { stageNumber: 4, title: '게이랑에르 요정의 만 완성', timeframe: '현재', process: '절벽에서 떨어지는 7자매 폭포와 크루즈선이 드나드는 세계 최고의 피오르드 안착', visualKeyFeature: '에메랄드빛 바다와 수직 설산의 환상적 조화' }
    ],
    fieldGuide: {
      bestVisitingSeason: '6월~8월 (크루즈선 운항 및 페리 유람, 도로 개방 최적기)',
      satelliteCheckPoints: ['스칸디나비아 해안에서 내륙으로 수십 km 깊숙이 뱀처럼 파고든 짙푸른 바다 물길선', '피오르드 양안의 깎아지른 절벽 그림자와 산정 만년설', '게이랑에르 항구 끝자락의 에스자 만곡부'],
      cautionAndConservation: '피오르드 암벽 산사태 쓰나미 경보 시스템 운영 구역'
    }
  }
];
