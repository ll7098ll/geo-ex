import { PlaceInfo } from '../../types';

export const COASTAL_PLACES: PlaceInfo[] = [
  // ==========================================
  // 1. 갯벌 (Tidal Flat)
  // ==========================================
  {
    id: 'mud-kr-1',
    terrain: '갯벌',
    region: 'korea',
    placeName: '순천만 연안습지 갯벌',
    countryOrArea: '대한민국 전라남도 순천시',
    tagline: '5.4㎢의 거대한 갈대군락과 구불구불한 S자 갯골이 조화를 이루는 세계유산 연안갯벌',
    description: `### 장소 소개 및 선정 이유
순천만은 유네스코 세계자연유산으로 등재된 '한국의 갯벌'의 핵심 구역으로, 조수간만의 차와 하천 퇴적물이 만든 완벽한 보전 상태의 점토질 갯벌 생태계입니다.

### 과학적 형성 과정
하천(동천과 이사천)이 상류에서 침식해 운반해 온 미세한 실트와 점토질 유기물이 고흥반도와 여수반도로 둘러싸인 폐쇄형 만(Bay)의 잔잔한 환경에서 침전되어 두꺼운 퇴적층을 이루었습니다. 썰물 때 바닷물이 빠져나가며 미세한 갯골(Tidal Channel) 망이 그물처럼 드러납니다.

### 탐험 포인트
- **용산전망대 S자 갯골**: 일몰 시 황금빛으로 물드는 조류 침식 수로의 유려한 곡선미
- **칠면초 및 갈대 군락**: 염도와 퇴적 심도에 따라 띠 모양으로 분포하는 염생식물 융단`,
    formationProcess: '하천 유입 퇴적물과 조류의 상호작용으로 형성된 점토질 갯벌과 조류성 갯골',
    observationPoints: ['구불구불한 갯골(S자 물길)', '짱뚱어와 칠게 서식공', '갈대 및 칠면초 식생대'],
    mapQuery: '순천만습지',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 6,000년 전 후빙기 해수면 안정기~현재)',
      rockType: '점토(Clay), 실트(Silt) 및 유기질 펄 퇴적물',
      tectonicSetting: '침강성 리아스식 해안의 반폐쇄성 만입부',
      geomorphicAgent: '조석 왕복 조류(Tidal Currents) 및 하천 유수 침전',
      scale: { areaKm2: 21.6, depthMeters: 4.5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '후빙기 해수면 상승 및 만입', timeframe: '약 1만~6,000년 전', process: '빙하기 종료 후 해수면이 100m 이상 상승하여 골짜기가 바다에 잠겨 순천만 형성', visualKeyFeature: '복잡한 리아스식 익곡만' },
      { stageNumber: 2, title: '점토질 세립 퇴적물 집적', timeframe: '약 4,000년 전', process: '동천과 이사천이 실어 나른 미세 실트가 잔잔한 파랑 환경에서 바닥에 침강', visualKeyFeature: '두께 수 미터의 부드러운 펄 퇴적층' },
      { stageNumber: 3, title: '조류 수로(갯골) 망 분기', timeframe: '약 2,000년 전', process: '하루 두 차례 썰물 물살이 갯벌 바닥을 깎아내며 수지상 S자 갯골 형성', visualKeyFeature: '그물망처럼 갈라진 배수 수로망' },
      { stageNumber: 4, title: '염생식물 활착 및 안정화', timeframe: '현재', process: '갈대와 칠면초 뿌리가 펄을 붙잡아 갯벌 표면을 단단하게 고정하고 생태계 완성', visualKeyFeature: '붉은 칠면초와 은빛 갈대밭의 조화' }
    ],
    fieldGuide: {
      bestVisitingSeason: '9월~11월 (칠면초가 붉게 물들고 갈대꽃이 피며 흑두루미가 도래하는 시기)',
      satelliteCheckPoints: ['고흥반도와 여수반도 사이에 깊숙이 들어온 나비 모양의 만입부', '썰물 시 위성에서 선명하게 드러나는 은빛 수로망과 어두운 갯벌 면', '동천 하구 주변의 동심원형 원형 갈대 군락'],
      cautionAndConservation: '세계자연유산 및 람사르 습지로 갯벌 무단 진입 금지 및 간조 시 갯골 고립 주의'
    }
  },
  {
    id: 'mud-kr-2',
    terrain: '갯벌',
    region: 'korea',
    placeName: '신안 증도 모래·펄 혼합 갯벌',
    countryOrArea: '대한민국 전라남도 신안군 증도면',
    tagline: '수많은 섬들이 외해 파도를 막아주어 형성된 세계 최고 수준의 생물다양성 혼합 갯벌',
    description: `### 장소 소개 및 선정 이유
아시아 최초 슬로시티인 신안 증도 갯벌은 다도해의 복잡한 섬 지형 사이에서 파도가 감쇄되어 형성된 독특한 모래-펄 혼합 갯벌로, 유네스코 생물권보전지역입니다.

### 과학적 형성 과정
서해안의 거대한 조차(최대 6m)와 다도해 섬들에 의한 차폐 효과로 인해 외해의 거센 파도가 들어오지 못하고 퇴적물이 안전하게 침전되어 섬과 섬 사이를 메우며 발달했습니다.

### 탐험 포인트
- **짱뚱어다리**: 갯벌 위를 가로지르는 470m의 목책교 위에서 관찰하는 갯벌 저서생물
- **태평염전**: 갯벌 지형을 활용하여 조성된 국내 최대 규모의 근대 천일염전`,
    formationProcess: '다도해 도서 지형의 파랑 차폐와 대조차 조류 퇴적 작용의 결합',
    observationPoints: ['모래-펄 전이대 퇴적구조', '조류에 의해 형성된 연흔(Ripple Marks)', '게 구멍 군락'],
    mapQuery: '신안 증도 짱뚱어다리',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (현재 진행형)',
      rockType: '모래-점토 혼합 퇴적물 (Sandy Mud)',
      tectonicSetting: '다도해 침강 해안 군도',
      geomorphicAgent: '대조차 조류 및 연안류 분급 작용',
      scale: { areaKm2: 31.3 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '다도해 침강 및 군도 격리', timeframe: '약 7,000년 전', process: '해수면 상승으로 산봉우리들이 무수한 섬으로 변모', visualKeyFeature: '섬 사이 좁은 해협 수로' },
      { stageNumber: 2, title: '파랑 에너지 차폐', timeframe: '약 5,000년 전', process: '외곽 섬들이 거친 파도를 분산시켜 잔잔한 조간대 정온 수역 확보', visualKeyFeature: '파도가 잦아든 내해 갯벌' },
      { stageNumber: 3, title: '모래·실트 차별 분급', timeframe: '약 2,000년 전', process: '강한 조류 구간에는 모래가, 안쪽 정온 구역에는 부드러운 펄이 분급 퇴적', visualKeyFeature: '발이 빠지지 않는 단단한 모래펄 갯벌' },
      { stageNumber: 4, title: '염전 조성 및 람사르 습지', timeframe: '근현대', process: '평탄한 조간대 지형을 활용한 태평염전 조성 및 생물다양성 보고 안착', visualKeyFeature: '광활한 갯벌과 바둑판 염전의 공존' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~10월 (간조 시간대에 짱뚱어와 농게의 활발한 섭식 활동 관찰)',
      satelliteCheckPoints: ['증도 본섬과 화도 사이에 썰물 때 연결되는 거대한 회백색 갯벌 노두', '바둑판처럼 정교하게 구획된 거대한 태평염전 소금밭', '우전해수욕장의 흰 모래사장과 배후 해송숲'],
      cautionAndConservation: '물때(조석표) 확인 필수, 밀물 시 갯벌 고립 엄격 주의'
    }
  },
  {
    id: 'mud-wd-1',
    terrain: '갯벌',
    region: 'world',
    placeName: '독일·네덜란드 바덴해 (Wadden Sea)',
    countryOrArea: '독일 / 네덜란드 / 덴마크 북해 연안',
    tagline: '길이 500km, 면적 11,434㎢에 달하는 지구상에서 가장 크고 온전한 조수 갯벌 시스템',
    description: `### 장소 소개 및 선정 이유
유네스코 세계자연유산인 바덴해는 네덜란드, 독일, 덴마크 3국에 걸쳐 펼쳐진 세계 최대의 단일 연안 갯벌 시스템입니다. 사주섬(Barrier Islands)들이 북해의 거센 폭풍 파도를 막아주는 독특한 방파제 역할을 합니다.

### 과학적 형성 과정
마지막 빙하기 이후 북해 해수면이 상승하면서 형성된 모래톱 섬들이 외해의 파도를 막아주고, 그 배후의 얕은 조간대에 조석 작용으로 모래와 펄이 두껍게 쌓여 형성되었습니다.

### 탐험 포인트
- **조간대 갯벌 하이킹(Wattwandern)**: 간조 시 사주섬까지 걸어서 건너는 전통 갯벌 탐사
- **바다표범 휴식지**: 썰물 때 드러나는 외곽 모래톱(플라트) 위의 바다표범 무리`,
    formationProcess: '배리어 아일랜드의 파랑 차단과 북해 대조차 조류 퇴적의 결합',
    observationPoints: ['끝없이 펼쳐진 수평선 갯벌', '조류가 빚어낸 거대 갯골(Priele)', '모래톱 연흔'],
    mapQuery: 'Wadden Sea Germany',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 7,000년 전~현재)',
      rockType: '세립사(Fine Sand) 및 실트질 펄(Mud)',
      tectonicSetting: '북해 분지 수동형 대륙붕 연안',
      geomorphicAgent: '반일주조 조석류 및 북해 폭풍해일 퇴적',
      scale: { areaKm2: 11434, lengthKm: 500 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '빙하기 퇴적물 침수', timeframe: '약 8,000년 전', process: '스칸디나비아 빙하가 남긴 막대한 모래 빙퇴석이 해수면 상승으로 침수', visualKeyFeature: '물에 잠긴 광활한 북해 모래 대지' },
      { stageNumber: 2, title: '사주섬(외곽 방파도) 형성', timeframe: '약 5,000년 전', process: '파랑에 의해 해안선과 평행하게 모래톱 섬들이 연속적으로 늘어섬', visualKeyFeature: '프리지아 군도 사주섬 장벽 완성' },
      { stageNumber: 3, title: '배후 정온 갯벌 대퇴적', timeframe: '약 2,000년 전', process: '사주섬 뒤편의 얕은 바다에 매일 두 차례 모래와 실트가 층층이 퇴적', visualKeyFeature: '수평선 너머까지 드러나는 평탄 갯벌' },
      { stageNumber: 4, title: '동적 갯골 시스템 지속', timeframe: '현재', process: '조류의 에너지로 거대한 갯골(Priele)이 물길을 바꾸며 살아 숨 쉬는 지형 유지', visualKeyFeature: '철새 1,200만 마리의 기착지' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 (온화한 기후와 공인 가이드 동반 갯벌 하이킹 최적기)',
      satelliteCheckPoints: ['네덜란드에서 덴마크까지 초승달 모양으로 늘어선 프리지아 사주섬 띠', '사주섬 안쪽으로 하얗게 드러나는 거대한 간석지 융단', '북해로 통하는 굵고 깊은 조류 유출입 해협들'],
      cautionAndConservation: '밀물 속도가 인간 보행 속도보다 빠르므로 단독 진입 절대 금지'
    }
  },
  {
    id: 'mud-wd-2',
    terrain: '갯벌',
    region: 'world',
    placeName: '캐나다 펀디만 (Bay of Fundy)',
    countryOrArea: '캐나다 노바스코샤주 / 뉴브런즈윅주',
    tagline: '최대 16.3m의 세계 최고 조차를 기록하는 조석 에너지의 절대 제왕 갯벌',
    description: `### 장소 소개 및 선정 이유
캐나다 동부 대서양 연안의 펀디만은 밀물과 썰물의 수위 차이가 세계 최고인 최고 16.3m(건물 5층 높이)에 달하며, 하루 1,600억 톤의 바닷물이 오가며 빚어낸 경이로운 조석 갯벌 지형입니다.

### 과학적 형성 과정
펀디만의 깔때기 모양(Funnel) 지형과 수심 구조가 대서양 조석 파동의 고유 주기(약 12.5시간)와 완벽하게 일치하여 일어나는 '조석 공명(Tidal Resonance)' 현상 때문에 조차가 극단적으로 증폭됩니다.

### 탐험 포인트
- **호프웰 록스(Hopewell Rocks)**: 썰물 때는 바닥까지 걸어 다니다가 밀물 때는 바위 꼭대기만 남는 화분 모양의 시스택
- **조석 해일(Tidal Bore)**: 밀물이 시작될 때 강물을 거슬러 역류하는 거대한 파도`,
    formationProcess: '지형적 조석 공명에 의한 극대 조차 발생 및 조류에 의한 기저부 삭박',
    observationPoints: ['호프웰 록스 기저부 파식대', '조석 해일 역류 현상', '붉은 사암 실트 갯벌'],
    mapQuery: 'Hopewell Rocks New Brunswick Canada',
    geology: {
      geologicalAge: '고생대 석탄기 사암 기반암 위 신생대 제4기 조석 퇴적층',
      rockType: '붉은색 장석사암, 역암 및 조석 적색 실트 점토',
      tectonicSetting: '대서양 판개열성 열곡 분지',
      geomorphicAgent: '16m 조석 공명 수위 변동 및 조류 삭박',
      scale: { depthMeters: 16.3, lengthKm: 270 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '석탄기 열곡 분지 퇴적', timeframe: '약 3억 년 전', process: '철분이 산화된 붉은 사암과 역암이 두껍게 쌓여 기반암 형성', visualKeyFeature: '적갈색 수평 퇴적암 지층' },
      { stageNumber: 2, title: '후빙기 침수 및 만입', timeframe: '약 1만 년 전', process: '빙하기 얼음이 녹으며 깔때기 형태의 펀디만에 바닷물 유입', visualKeyFeature: '안쪽으로 좁아지는 270km V자형 만' },
      { stageNumber: 3, title: '조석 공명 주기 일치', timeframe: '약 4,000년 전', process: '만 내부 수심과 길이가 대서양 조석 주기와 정확히 일치하여 조차 증폭 개시', visualKeyFeature: '하루 2회 16m 수위 급변동 발생' },
      { stageNumber: 4, title: '호프웰 록스 조각 및 현재', timeframe: '현재', process: '조류가 사암 기둥 하부를 깎아내 화분 모양의 바위섬과 진흙 갯벌 완성', visualKeyFeature: '만조 시 잠기고 간조 시 솟아오르는 신비의 바위' }
    ],
    fieldGuide: {
      bestVisitingSeason: '6월~10월 (간조와 만조를 6시간 간격으로 2회 모두 비교 관람 필수)',
      satelliteCheckPoints: ['미국 메인주와 캐나다 노바스코샤 사이로 좁아지며 깊숙이 파고든 V자형 만', '만 안쪽 치그넥토 만과 미나스 분지의 붉은색 흙탕물 조류 패턴', '하구 강변을 따라 역류하는 조석해일의 선명한 흰 물결선'],
      cautionAndConservation: '조석 유입 속도가 극히 빠르므로 호프웰 록스 퇴장 신호 사이렌 엄수'
    }
  },

  // ==========================================
  // 2. 해식애 (Sea Cliff)
  // ==========================================
  {
    id: 'cliff-kr-1',
    terrain: '해식애',
    region: 'korea',
    placeName: '부산 영도 태종대 신선바위 해식애',
    countryOrArea: '대한민국 부산광역시 영도구',
    tagline: '남해의 거센 파도가 100m 높이의 백악기 퇴적암을 수직으로 깎아 세운 절벽',
    description: `### 장소 소개 및 선정 이유
태종대는 부산 영도 최남단에 위치한 대표적인 암석 해안으로, 파도의 침식 작용(파랑 에너지)이 깎아 만든 100m 높이의 해식애와 그 아래 편평하게 발달한 파식대(Wave-cut Platform)가 완벽한 쌍을 이룹니다.

### 과학적 형성 과정
중생대 백악기 호수 퇴적층에 마그마가 관입한 단단한 암석에 거센 파도가 부딪히며 해식애 기저부에 해식구(Notch)를 파고, 상부가 붕괴하며 수직 단애가 후퇴하여 형성되었습니다.

### 탐험 포인트
- **신선바위 파식대**: 파도에 깎여 평평해진 넓은 바위 암반
- **망부석**: 해식애가 후퇴할 때 무너지지 않고 홀로 남은 시스택`,
    formationProcess: '파랑의 기저부 굴식과 파식 작용으로 인한 암벽 붕괴 및 파식대 발달',
    observationPoints: ['100m 수직 암벽 해식애', '평탄한 계단식 파식대', '기저부 해식동굴'],
    mapQuery: '태종대 신선바위',
    geology: {
      geologicalAge: '중생대 백악기 다대포층군 (약 8,000만 년 전)',
      rockType: '응회질 셰일, 사암, 안산암질 관입암',
      tectonicSetting: '경상분지 남동부 화산 쇄설 퇴적분지',
      geomorphicAgent: '남해 파랑 에너지의 굴식(Hydraulic Action) 및 마식',
      scale: { elevationMeters: 100, lengthKm: 1.5 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 호수 퇴적 및 화산 관입', timeframe: '약 8,000만 년 전', process: '공룡이 살던 거대 호수에 셰일과 사암이 쌓이고 마그마가 단단하게 관입', visualKeyFeature: '선명한 평행 퇴적 층리와 단단한 관입암체' },
      { stageNumber: 2, title: '후빙기 해수면 안정', timeframe: '약 6,000년 전', process: '현재 해수면 높이에 도달하며 외해 파도가 암반 기저부를 집중 타격', visualKeyFeature: '수면 높이에 파인 해식구(Notch) 홈' },
      { stageNumber: 3, title: '암벽 자중 붕괴 및 단애 후퇴', timeframe: '지속 작용', process: '파인 홈 위의 암벽이 무게를 이기지 못하고 절리선을 따라 와르르 붕락', visualKeyFeature: '뒤로 물러선 100m 수직 단애와 아래 잔해' },
      { stageNumber: 4, title: '신선바위 파식대 평탄화', timeframe: '현재', process: '바닷물이 드나들며 무너진 파편들을 깎아내 넓고 평평한 신선바위 완성', visualKeyFeature: '물 위에 드러난 평평한 암반과 기암' }
    ],
    fieldGuide: {
      bestVisitingSeason: '가을철(9~11월) 청명한 날 (대마도가 육안으로 조망됨)',
      satelliteCheckPoints: ['영도 남단 끝자락에 바다를 향해 칼로 자른 듯 돌출된 회색 암반선', '등대 아래 바다와 맞닿은 평평한 백색 파식대(신선바위)', '절벽 바깥에 외롭게 서 있는 촛대 모양 망부석 시스택'],
      cautionAndConservation: '비바람 및 너울성 파도 시 갯바위 추락 위험 통제 준수'
    }
  },
  {
    id: 'cliff-kr-2',
    terrain: '해식애',
    region: 'korea',
    placeName: '부안 채석강 수성퇴적암 해식절벽',
    countryOrArea: '대한민국 전북특별자치도 부안군 변산반도',
    tagline: '수만 권의 책을 쌓아 올린 듯 억겁의 퇴적 지층을 파도가 깎아낸 지질학의 성지',
    description: `### 장소 소개 및 선정 이유
변산반도 격포리에 위치한 채석강(천연기념물 제28호)은 당나라 시인 이태백이 노닐던 채석강만큼 아름답다 하여 붙여진 이름으로, 마치 수만 권의 책을 차곡차곡 쌓아놓은 듯한 퇴적암 층리가 해식애 단면에 노출되어 있습니다.

### 과학적 형성 과정
약 8,000만 년 전 중생대 백악기 격포분지 호수에 쌓인 셰일과 사암 지층이 단단히 굳은 후, 서해의 강한 파도가 수직 절리를 따라 침식하여 해식동굴, 해식애, 파식대를 종합적으로 만들어냈습니다.

### 탐험 포인트
- **해식동굴(Sea Cave)**: 절벽 하부에 파도가 파고들어 뚫어놓은 천연 동굴 실루엣
- **퇴적 구조(Sedimentary Structures)**: 사층리, 점이층리, 화산 쇄설물 관입 노두`,
    formationProcess: '백악기 호수 퇴적층의 융기 후 서해 파랑에 의한 층리 및 절리 차별 침식',
    observationPoints: ['수만 권의 책을 쌓은 듯한 층리 절벽', '파식대 위 해식동굴', '단층 변위 구조'],
    mapQuery: '변산반도 채석강',
    geology: {
      geologicalAge: '중생대 백악기 격포리층 (약 8,500만~7,000만 년 전)',
      rockType: '흑색 셰일, 사암, 역암, 응회암',
      tectonicSetting: '주향이동 단층성 당겨열림 분지(Pull-apart Basin)',
      geomorphicAgent: '서해 파랑 침식 및 해수 풍화(Salt Weathering)',
      scale: { elevationMeters: 25, lengthKm: 1.2 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '백악기 깊은 호수 퇴적', timeframe: '약 8,000만 년 전', process: '호수 바닥에 계절과 홍수에 따라 점토와 모래가 얇은 판상으로 반복 침전', visualKeyFeature: '밀리미터 단위의 정교한 평행 줄무늬 층리' },
      { stageNumber: 2, title: '고화 및 지각 변형 단층', timeframe: '중생대 말', process: '두꺼운 암석으로 굳어진 후 지각 운동으로 정단층과 역단층 균열 발생', visualKeyFeature: '층리가 어긋난 선명한 단층선' },
      { stageNumber: 3, title: '해수면 상승 및 파랑 집중', timeframe: '약 6,000년 전', process: '서해가 열리고 파도가 퇴적층 수평 층리면을 따라 집요하게 굴식 진행', visualKeyFeature: '책장처럼 한 장씩 뜯겨 나가는 암벽' },
      { stageNumber: 4, title: '해식동굴 및 파식대 완성', timeframe: '현재', process: '단층 교차점에 깊은 해식동굴이 뚫리고 앞마당에 넓은 파식대 안착', visualKeyFeature: '동굴 안에서 노을을 담는 포토존 완성' }
    ],
    fieldGuide: {
      bestVisitingSeason: '사계절 모두 우수, 반드시 간조(썰물) 2시간 전에 방문해야 파식대 보행 가능',
      satelliteCheckPoints: ['격포항 방파제 북측으로 반달 모양으로 휘어지는 해안 암벽선', '썰물 시 위성사진에 뚜렷이 드러나는 줄무늬 암반 파식대', '닭이봉 정상 전망대와 해안 절벽의 고도차'],
      cautionAndConservation: '밀물 시작 시 파식대가 급격히 잠기므로 만조 시간 1시간 전 철수 필수'
    }
  },
  {
    id: 'cliff-wd-1',
    terrain: '해식애',
    region: 'world',
    placeName: '아일랜드 모허 절벽 (Cliffs of Moher)',
    countryOrArea: '아일랜드 클레어주 대서양 연안',
    tagline: '대서양의 거친 분노를 온몸으로 받아내는 최고 높이 214m, 길이 14km의 압도적 절벽',
    description: `### 장소 소개 및 선정 이유
유네스코 세계지질공원이자 아일랜드 최고 명소인 모허 절벽은 대서양 수면에서 수직으로 최고 214m까지 치솟아 장장 14km에 걸쳐 펼쳐진 유럽에서 가장 장엄한 해식애입니다.

### 과학적 형성 과정
약 3억 2천만 년 전 고생대 석탄기 삼각주 하구에 쌓인 사암과 실트암 지층이 대서양의 맹렬한 파도와 혹독한 북대서양 바람에 의해 수평 층리를 따라 무너지며 직벽을 이루었습니다.

### 탐험 포인트
- **오브라이언 타워**: 절벽의 최고점(214m)에 1835년 세워진 석조 전망대
- **브래넌 록(Branaunmore)**: 절벽에서 떨어져 나온 67m 높이의 거대한 해식 기둥(시스택)`,
    formationProcess: '고생대 해양 삼각주 퇴적층의 융기와 북대서양 강풍 및 거대 파랑의 삭박',
    observationPoints: ['214m 수직 직벽', '단면에 드러난 수평 퇴적암 줄무늬', '브래넌록 시스택'],
    mapQuery: 'Cliffs of Moher Ireland',
    geology: {
      geologicalAge: '고생대 석탄기 (약 3억 2,000만 년 전)',
      rockType: '셰일, 실트암, 샌드스톤(사암)',
      tectonicSetting: '고생대 삼각주 분지 융기체',
      geomorphicAgent: '북대서양 최대 15m 너울성 파랑 및 해풍 침식',
      scale: { elevationMeters: 214, lengthKm: 14 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '고생대 거대 삼각주 퇴적', timeframe: '약 3억 2,000만 년 전', process: '고대 거대한 하천이 바다로 모래와 진흙을 쏟아내며 두터운 수평 층리 축적', visualKeyFeature: '수백 미터 두께의 흑색 셰일과 황갈색 사암층' },
      { stageNumber: 2, title: '지각 융기 및 절리 발달', timeframe: '약 2억 5,000만 년 전', process: '바리스칸 조산운동으로 지층이 융기하며 수직 방향의 규칙적 인장 절리 생성', visualKeyFeature: '체스판처럼 갈라진 거대 퇴적암 대지' },
      { stageNumber: 3, title: '북대서양 개열과 파랑 공격', timeframe: '신생대~현재', process: '북대서양의 시속 100km 강풍과 10m 넘는 거수 파도가 수직 절리면을 파고듦', visualKeyFeature: '수직으로 쪼개져 나가는 거대한 암석 블록' },
      { stageNumber: 4, title: '14km 연속 수직 단애 완성', timeframe: '현재', process: '지속적인 붕락으로 214m 높이의 거대 해식애와 브래넌록 시스택 안착', visualKeyFeature: '대서양 수평선과 직각으로 만나는 장엄한 암벽' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~9월 (아일랜드 해안의 일조량이 가장 길고 퍼핀 새 관찰 가능)',
      satelliteCheckPoints: ['아일랜드 서해안에 남북으로 반듯하게 뻗은 거대한 톱날 모양 해안선', '절벽 능선을 따라 짙은 초록색 목초지와 암흑색 바다의 극단적 경계', '절벽 기저부에 부서지는 하얀 포말 띠'],
      cautionAndConservation: '돌풍에 의한 추락 위험이 매우 크므로 지정 보호 펜스 절대 월경 금지'
    }
  },

  // ==========================================
  // 3. 시스택 (Sea Stack)
  // ==========================================
  {
    id: 'stack-kr-1',
    terrain: '시스택',
    region: 'korea',
    placeName: '백령도 두무진 선대암·형제바위',
    countryOrArea: '대한민국 인천광역시 옹진군 백령도 북서단',
    tagline: '신선들이 모여 회의를 하는 듯 서해 최북단에 솟아오른 10억 년 세월의 규암 시스택',
    description: `### 장소 소개 및 선정 이유
명승 제8호인 백령도 두무진은 '장군들이 머리를 맞대고 회의를 하는 형상'이라 하여 붙여진 이름으로, 약 10억 년 전 선캄브리아기 규암층이 파도의 차별 침식을 받아 빚어진 기기묘묘한 바위기둥(시스택)과 해식 아치가 해안을 가득 채우고 있습니다.

### 과학적 형성 과정
단단한 규암과 무른 사암이 섞인 지층에서 파도가 틈새(절리)를 먼저 파고들어 해식동굴을 만들고, 동굴이 뚫려 해식아치(Sea Arch)가 되었다가 아치의 지붕이 무너지면서 홀로 우뚝 선 바위기둥(시스택)으로 진화했습니다.

### 탐험 포인트
- **선대암(촛대바위)**: 뾰족한 칼날처럼 하늘로 치솟은 30m 높이의 독립 규암탑
- **코끼리바위(해식아치)**: 코끼리가 바닷물을 들이켜는 듯 구멍이 뚫린 천연 아치교`,
    formationProcess: '해식애 → 해식동 → 해식아치 붕괴 → 독립 시스택으로 이어지는 해안 침식의 완성',
    observationPoints: ['30~40m 수직 규암 바위기둥 군락', '코끼리바위 해식아치', '선캄브리아기 사층리'],
    mapQuery: '백령도 두무진',
    geology: {
      geologicalAge: '선캄브리아기 신원생대 상원누층군 (약 10억~8억 년 전)',
      rockType: '백색 및 담홍색 규암 (Quartzite)',
      tectonicSetting: '한반도 경기육괴 북서단 변성퇴적암대',
      geomorphicAgent: '서해 파랑 굴식 및 혹한기 동결 파쇄',
      scale: { elevationMeters: 45, lengthKm: 2.0 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '선캄브리아기 사암 퇴적 및 변성', timeframe: '약 10억 년 전', process: '석영이 풍부한 모래가 두껍게 쌓인 후 강한 열과 압력을 받아 초경질 규암으로 변성', visualKeyFeature: '모스 굳기 7에 달하는 극도로 단단한 암반' },
      { stageNumber: 2, title: '지각 융기 및 수직 절리망', timeframe: '고생대~중생대', process: '지각 변동으로 규암 암반에 수평·수직 방향의 격자형 균열선(절리) 발달', visualKeyFeature: '격자무늬로 쪼개진 바위 단애' },
      { stageNumber: 3, title: '해식동굴 및 해식아치 관통', timeframe: '약 5,000년 전', process: '파도가 연약한 절리 틈새를 파고들어 양쪽이 뚫린 코끼리바위 아치 형성', visualKeyFeature: '파도가 드나드는 천연 암석 무지개다리' },
      { stageNumber: 4, title: '아치 붕괴 및 독립 시스택 안착', timeframe: '현재', process: '아치 지붕이 중력으로 무너져 내리며 육지와 분리된 선대암·형제바위 기둥 완성', visualKeyFeature: '바다 위에 홀로 선 장군 모습의 바위탑' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~10월 (유람선을 타고 바다에서 바라보는 해상 관람 필수)',
      satelliteCheckPoints: ['백령도 북서단 곶에 빗으로 빗어놓은 듯 바다로 뻗은 뾰족한 암초 톱날선', '본섬 암벽에서 떨어져 나와 바다에 점점이 박힌 선대암 독립 바위들', '에메랄드빛 서해 청정 수역'],
      cautionAndConservation: '군사 작전 지역 및 천연기념물 보존 구역으로 해상 항로 준수'
    }
  },
  {
    id: 'stack-kr-2',
    terrain: '시스택',
    region: 'korea',
    placeName: '독도 촛대바위 및 삼형제굴바위',
    countryOrArea: '대한민국 경상북도 울릉군 울릉읍 독도리',
    tagline: '동해 2,000m 심해 화산체가 파도에 깎여 남은 대한민국 아침을 여는 화산암 시스택',
    description: `### 장소 소개 및 선정 이유
천연기념물 제336호인 독도는 약 460만~250만 년 전 해저 화산활동으로 탄생한 화산섬으로, 울릉도나 제주도보다 훨씬 오래되어 산체 대부분이 거친 동해 파도에 깎여나가고 단단한 암맥과 화도 주변 암석만 시스택으로 남았습니다.

### 과학적 형성 과정
거대한 화산체가 바닷속으로 침식되어 사라지는 '해산(Seamount) 침식의 마지막 단계'에서, 파도의 침식에 끝까지 저항한 화도(마그마 통로) 관입암체가 촛대바위와 삼형제굴바위 같은 독립 암주로 남았습니다.

### 탐험 포인트
- **동도 촛대바위**: 동도 선착장 옆에 촛대처럼 뾰족하게 솟아오른 17m 높이의 시스택
- **삼형제굴바위**: 3개의 해식동굴(구멍)이 뚫려 있는 기암 바위섬`,
    formationProcess: '고대 해저 화산체의 극심한 해식 작용에 따른 화산암맥 시스택 잔존',
    observationPoints: ['촛대바위 독립 암봉', '삼형제굴바위 아치 구조', '동도 천장굴 침식와지'],
    mapQuery: '독도 촛대바위',
    geology: {
      geologicalAge: '신생대 제3기 플라이오세 (약 460만~250만 년 전)',
      rockType: '조면안산암, 알칼리 현무암 및 화산각력암',
      tectonicSetting: '동해 울릉분지 심해저 열점 화산활동',
      geomorphicAgent: '동해 고에너지 너울성 파랑의 장기 삭박 작용',
      scale: { elevationMeters: 168.5, areaKm2: 0.187 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '심해저 거대 화산 분출', timeframe: '약 460만 년 전', process: '수심 2,000m 동해 바닥에서 용암이 분출하여 직경 20km가 넘는 대형 화산섬 형성', visualKeyFeature: '해수면 위로 높이 솟은 원시 독도 화산' },
      { stageNumber: 2, title: '화산 활동 종료 및 해식 시작', timeframe: '약 250만 년 전', process: '마그마 분출이 멈추고 거친 동해의 풍랑이 화산 쇄설 사면을 맹렬히 깎아냄', visualKeyFeature: '사방에서 무너져 내리는 화산재 절벽' },
      { stageNumber: 3, title: '외곽 산체 완전 삭박', timeframe: '약 100만 년 전', process: '화산체 대부분이 파도에 깎여 물속에 잠기고 단단한 중심부 암맥만 잔존', visualKeyFeature: '동도와 서도 2개 섬으로 축소 분리' },
      { stageNumber: 4, title: '촛대바위 시스택 군락 완성', timeframe: '현재', process: '파도가 절리를 따라 굴식하여 89개의 부속 기암괴석과 촛대바위 완성', visualKeyFeature: '푸른 바다 위 우뚝 솟은 동해의 등불 바위' }
    ],
    fieldGuide: {
      bestVisitingSeason: '울릉도 경유 입도가 가능한 4월~10월 파도가 잔잔한 날',
      satelliteCheckPoints: ['동해 한복판에 우뚝 솟은 동도와 서도의 정교한 실루엣', '동도 선착장 바로 옆 바다에 돌출된 뾰족한 점 형태의 촛대바위', '서도 북측의 삼형제굴바위 해식 구멍들'],
      cautionAndConservation: '독도 천연보호구역으로 기상 악화 시 접안 불가 및 환경 보존 엄수'
    }
  },
  {
    id: 'stack-wd-1',
    terrain: '시스택',
    region: 'world',
    placeName: '호주 그레이트오션로드 12사도 바위 (Twelve Apostles)',
    countryOrArea: '호주 빅토리아주 포트캠벨 국립공원',
    tagline: '남극해의 맹렬한 파도가 남서부 석회암 해안에서 깎아낸 세계에서 가장 유명한 거대 석주군',
    description: `### 장소 소개 및 선정 이유
호주 빅토리아주의 그레이트오션로드를 대표하는 '12사도 바위'는 남극해의 거친 파도가 높이 45m의 석회암 절벽을 침식하여 만들어낸 세계 최대 규모의 시스택 군락으로, 황금빛 일출과 석양으로 전 세계 사진작가들을 매료시킵니다.

### 과학적 형성 과정
약 1,000만~2,000만 년 전 고대 바다 밑에 쌓인 부드러운 석회암이 지각 융기로 육지가 된 후, 남극해의 거센 파도가 1년에 약 2cm씩 절벽을 깎아내며 [절벽 절리 → 해식동굴 → 해식아치 → 시스택]의 연속 진화 과정을 극적으로 증명하고 있습니다.

### 탐험 포인트
- **기둥 붕괴의 역사**: 2005년 관광객들이 보는 앞에서 50m 기둥 하나가 무너져 내린 살아있는 침식의 현장
- **로크 아드 고지(Loch Ard Gorge)**: 침식으로 절벽이 무너지며 육지 깊숙이 들어온 모래 해안 협곡`,
    formationProcess: '남극해 파랑의 석회암 해식애 기저부 굴식 및 아치 붕괴로 독립 암주 잔류',
    observationPoints: ['바다 위에 늘어선 45m 석회암 기둥들', '단면에 드러난 조개껍질 퇴적층', '붕괴된 기둥 잔해'],
    mapQuery: 'Twelve Apostles Victoria Australia',
    geology: {
      geologicalAge: '신생대 제3기 마이오세 (약 2,000만~1,000만 년 전)',
      rockType: '포트캠벨 석회암 (부드러운 해양 생물 탄산염암)',
      tectonicSetting: '호주 남부 수동형 대륙연변부 탄산염 플랫폼',
      geomorphicAgent: '남극해의 윈드서핑 파랑 에너지 및 강산성 해풍',
      scale: { elevationMeters: 45, lengthKm: 17 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '마이오세 따뜻한 천해 탄산염 퇴적', timeframe: '약 2,000만 년 전', process: '해양 미생물과 조개껍데기가 바다 밑에 두껍게 쌓여 석회암층 형성', visualKeyFeature: '황백색의 부드러운 해양 퇴적암' },
      { stageNumber: 2, title: '대륙 융기 및 파랑 강타', timeframe: '약 6,000년 전', process: '해수면 안정 후 남극해의 8m 이상 고파랑이 해식애 기저부에 해식동굴 굴착', visualKeyFeature: '절벽 아래 뚫린 어두운 파도 동굴들' },
      { stageNumber: 3, title: '해식아치 교량 형성', timeframe: '수천 년 전', process: '동굴이 관통하여 육지와 이어진 아치(런던 브리지 형태) 형성', visualKeyFeature: '거대한 천연 석회암 무지개다리' },
      { stageNumber: 4, title: '아치 붕락 및 현재 12사도', timeframe: '현재', process: '지속적인 파도 충격으로 아치 상판이 무너지며 독립된 기둥(사도)들로 분리', visualKeyFeature: '에메랄드 바다 위 황금빛 독립 석주 군락' }
    ],
    fieldGuide: {
      bestVisitingSeason: '11월~3월 호주의 여름철 (일몰 1시간 전 황금빛 석양 조망 추천)',
      satelliteCheckPoints: ['황토색 석회암 절벽과 남극해 짙푸른 바다가 만나는 직선형 해안선', '해안선을 따라 바다 쪽에 일정한 간격으로 늘어선 바위기둥 점들', '하얗게 부서지는 남극해 파도의 포말 띠선'],
      cautionAndConservation: '절벽 침식이 연간 2cm씩 진행되므로 절벽 가장자리 접근 절대 엄금'
    }
  },

  // ==========================================
  // 4. 해안 사구 (Coastal Dune)
  // ==========================================
  {
    id: 'dune-kr-1',
    terrain: '해안 사구',
    region: 'korea',
    placeName: '태안 신두리 해안사구',
    countryOrArea: '대한민국 충청남도 태안군 원북면 신두리',
    tagline: '길이 3.4km, 폭 1.3km에 이르는 한국 최대의 천연기념물 모래언덕',
    description: `### 장소 소개 및 선정 이유
천연기념물 제431호인 태안 신두리 사구는 대한민국 최대 규모의 해안 모래언덕으로, 빙하기 이후 수천 년 동안 겨울철 북서계절풍이 백사장의 모래를 육지로 날라 올려 빚어낸 한국 지리학의 독보적 사구 지형입니다.

### 과학적 형성 과정
간조 시 넓게 드러난 신두리 백사장의 미세한 석영 모래가 강한 겨울 북서풍을 타고 내륙으로 이동하다가, 배후의 순비기나무, 해당화 등 사구 식생에 걸려 유속이 느려지면서 겹겹이 쌓여 사구열(Dune Ridge)을 형성했습니다.

### 탐험 포인트
- **바르한(초승달 사구) 지형**: 바람의 방향을 따라 둥글게 휘어진 초승달 모래언덕
- **두웅습지**: 사구가 지하수 배수를 막아 사구 배후에 형성된 람사르 등록 담수습지`,
    formationProcess: '조간대 건조 모래의 북서계절풍 풍성 운반 및 사구 식생에 의한 집적',
    observationPoints: ['바르한 모래언덕 능선', '바람이 만든 물결무늬 연흔(Ripple)', '두웅습지 배후와지'],
    mapQuery: '태안 신두리 해안사구',
    geology: {
      geologicalAge: '신생대 제4기 후기 홀로세 (약 3,000년 전~현재)',
      rockType: '풍성 석영질 세립사 (Quartz Dune Sand)',
      tectonicSetting: '서해안 개방형 모래만(Pocket Beach)',
      geomorphicAgent: '겨울철 북서풍(Wind Drag) 및 사구 식생 포집 작용',
      scale: { areaKm2: 4.4, lengthKm: 3.4, depthMeters: 19 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '후빙기 석영 모래 연안 집적', timeframe: '약 6,000년 전', process: '해수면 상승 후 파랑이 바다 밑 석영 모래를 신두리 해변으로 밀어올림', visualKeyFeature: '넓고 완만한 조간대 백사장' },
      { stageNumber: 2, title: '겨울 북서풍에 의한 모래 비산', timeframe: '약 3,000년 전', process: '썰물 때 마른 모래가 시속 40km 이상의 강한 북서풍을 타고 육지 쪽으로 이동', visualKeyFeature: '모래바람이 휘몰아치는 해변 배후' },
      { stageNumber: 3, title: '통보리사초 식생 포집', timeframe: '약 1,500년 전', process: '사구 식물의 촘촘한 뿌리와 잎에 모래가 걸려 퇴적되며 사구 능선 성장', visualKeyFeature: '최고 높이 19m의 웅장한 사구열' },
      { stageNumber: 4, title: '두웅습지 형성 및 생태계 완성', timeframe: '현재', process: '사구가 빗물의 바다 유출을 차단하여 배후에 담수 호수인 두웅습지 안착', visualKeyFeature: '표범장지뱀과 통보리사초의 사막형 생태계' }
    ],
    fieldGuide: {
      bestVisitingSeason: '바람 연흔이 선명하고 억새가 어우러지는 가을~겨울철',
      satelliteCheckPoints: ['신두리 해수욕장 배후에 펼쳐진 넓은 황금빛 초승달 모양 모래밭', '사구 내륙 쪽에 오목하게 고인 타원형의 짙푸른 두웅습지 수면', '사구 외곽을 둘러싼 해송 방풍림 숲 경계선'],
      cautionAndConservation: '천연기념물 보호를 위해 모래언덕 탐방로 데크길 이탈 절대 금지'
    }
  },
  {
    id: 'dune-wd-1',
    terrain: '해안 사구',
    region: 'world',
    placeName: '프랑스 필라 사구 (Dune of Pilat)',
    countryOrArea: '프랑스 지롱드주 아르카숑 만',
    tagline: '높이 106m, 길이 2.7km, 유럽에서 가장 거대하고 장엄한 움직이는 모래언덕',
    description: `### 장소 소개 및 선정 이유
프랑스 남서부 대서양 연안에 위치한 필라 사구는 해발 106m, 폭 500m, 길이 2.7km, 모래 체적 약 6,000만 m³에 달하는 유럽 대륙 최고 높이의 거대한 살아있는 해안 사구입니다.

### 과학적 형성 과정
대서양의 거센 파도가 아르카숑 만 입구로 밀어올린 막대한 양의 모래가 썰물 시 햇볕에 마르고, 연중 불어오는 강한 서풍에 의해 소나무 숲 위로 매년 1~5m씩 내륙을 향해 전진하며 삼림을 집어삼키고 있습니다.

### 탐험 포인트
- **모래언덕 능선 전망**: 한쪽은 망망대해 대서양, 반대쪽은 끝없는 초록빛 소나무 숲이 펼쳐지는 극적인 대비
- **화석 토양층(Paleosol)**: 사구 단면에 검은 띠처럼 드러난 수천 년 전 고대 숲의 화석 토양층`,
    formationProcess: '대서양 파랑이 공급한 모래의 항풍 운반 및 내륙 삼림을 덮치는 진행성 사구',
    observationPoints: ['106m 모래 칼날 능선', '사구 단면의 검은 고토양층', '모래에 묻혀가는 소나무 숲'],
    mapQuery: 'Dune of Pilat France',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 4,000년 전~현재 진행형)',
      rockType: '순수 석영 세립사 (Quartz Sand, 순도 98% 이상)',
      tectonicSetting: '비스케이만 대서양 연안 평탄 저지대',
      geomorphicAgent: '대서양 편서풍(Westerly Winds) 및 풍성 도약(Saltation)',
      scale: { elevationMeters: 106, lengthKm: 2.7, depthMeters: 106 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '비스케이만 빙하 모래 공급', timeframe: '약 4,000년 전', process: '빙하기 강물이 운반한 막대한 석영 모래가 대서양 연안에 모래톱 형성', visualKeyFeature: '해안가를 가득 메운 광대한 백사장' },
      { stageNumber: 2, title: '바람에 의한 1차 사구 발달', timeframe: '기원전 1,000년경', process: '강한 서풍이 모래를 내륙으로 밀어올려 초기 모래언덕 형성', visualKeyFeature: '고대 소나무 숲이 번성한 1차 사구' },
      { stageNumber: 3, title: '숲의 매몰과 고토양층 형성', timeframe: '서기 16세기', process: '기후 한랭화와 강풍으로 사구가 급격히 성장하며 기존 숲을 매몰', visualKeyFeature: '모래 속에 갇힌 유기물 화석층' },
      { stageNumber: 4, title: '106m 거대 필라 사구 완성', timeframe: '현재', process: '매년 내륙으로 1~5m씩 전진하며 6,000만 톤의 모래가 소나무 숲을 덮음', visualKeyFeature: '바다와 숲 사이 솟구친 거대한 황금 모래산' }
    ],
    fieldGuide: {
      bestVisitingSeason: '5월~6월 및 9월~10월 (한여름 뙤약볕 모래 열기 회피 추천)',
      satelliteCheckPoints: ['대서양 해안선과 내륙의 짙푸른 랑드 삼림 사이에 끼어 있는 거대한 흰색 쐐기', '아르카숑 만 입구 뱅 다르갱 모래톱과 연결되는 모래 이동선', '사구 동쪽 사면이 소나무 숲 경계를 침범하고 있는 경계면'],
      cautionAndConservation: '100m 급경사 모래면 하강 시 관성 주의 및 쓰레기 투기 엄금'
    }
  },

  // ==========================================
  // 5. 사주 (Sand Spit & Tombolo)
  // ==========================================
  {
    id: 'spit-kr-1',
    terrain: '사주',
    region: 'korea',
    placeName: '진도 신비의 바닷길 (조석 육계사주)',
    countryOrArea: '대한민국 전라남도 진도군 고군면 회동리',
    tagline: '조석 간만의 차로 현대판 모세의 기적을 연출하는 2.8km의 바닷속 자갈·모래 사주',
    description: `### 장소 소개 및 선정 이유
명승 제9호인 진도 신비의 바닷길은 회동리와 의신면 모도 사이 2.8km 바다 밑에 쌓인 모래와 자갈 사주(Spit)가 조수간만의 차로 썰물 때 수면 위로 약 40m 폭으로 드러나는 세계적인 자연 경관입니다.

### 과학적 형성 과정
진도 본섬과 모도 사이의 좁은 해협을 통과하는 강한 왕복 조류가 회동리 곶에서 약해지며 운반하던 모래, 자갈, 패각을 해저 둔덕 형태로 길게 퇴적시켰고, 극단적인 대조기(백중사리 등)에 바닷물이 완전히 빠지며 육계사주가 길로 노출됩니다.

### 탐험 포인트
- **바닷길 열림**: 양쪽 바다를 가르며 2.8km를 걸어서 건너는 모도 횡단
- **해양 저서생물**: 드러난 사주 표면에서 채취하는 해삼, 전복, 낙지, 조개류`,
    formationProcess: '조류의 유속 감쇄 구역에 형성된 수중 사주 둔덕의 극대 간조기 노출',
    observationPoints: ['바닷물이 갈라지는 2.8km 자갈길', '사주 양안의 역방향 조류 소용돌이', '조간대 해양생물'],
    mapQuery: '진도 신비의 바닷길',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (현재 진행형)',
      rockType: '모래, 자갈, 패각편 혼합 조류퇴적물',
      tectonicSetting: '다도해 리아스식 연안 좁은 조석 해협',
      geomorphicAgent: '울돌목 인근의 강력한 왕복 조류(Tidal Currents) 퇴적',
      scale: { lengthKm: 2.8, depthMeters: 6.0 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '다도해 침수 및 해협 형성', timeframe: '약 6,000년 전', process: '해수면 상승으로 진도 본섬과 모도 사이에 빠른 물살의 해협 탄생', visualKeyFeature: '섬 사이 물살이 센 바다' },
      { stageNumber: 2, title: '양방향 조류의 퇴적물 공급', timeframe: '약 3,000년 전', process: '밀물과 썰물이 하루 두 번 교차하며 곶(회동리) 끝에 자갈과 패각을 퇴적', visualKeyFeature: '바닷속에 자라나는 얕은 수중 모래톱 둑' },
      { stageNumber: 3, title: '수중 육계사주 완성', timeframe: '약 1,000년 전', process: '모도 섬까지 2.8km 구간 전체에 해저 능선이 일직선으로 완만하게 연결', visualKeyFeature: '만조 시엔 안 보이나 수심 2~3m에 잠긴 바닷길' },
      { stageNumber: 4, title: '대조기 간조 노출 현상', timeframe: '현재', process: '음력 2~3월 영등사리 때 조차가 6m 이상 벌어지며 폭 40m의 자갈길 완벽 노출', visualKeyFeature: '바다 한가운데 수만 명이 걷는 기적의 길' }
    ],
    fieldGuide: {
      bestVisitingSeason: '음력 2월 말~3월 초 "신비의 바닷길 축제" 기간 간조 시간대',
      satelliteCheckPoints: ['진도 회동리에서 남동측 모도 섬까지 바닷속으로 옅은 청록색으로 이어진 해저 능선선', '사주 양쪽으로 물결이 부딪히는 조류 경계선', '간조 시 하얗게 드러나는 직선형 연결 보도'],
      cautionAndConservation: '바닷길 열림 시간은 약 1시간에 불과하므로 밀물 방송 시 즉시 육지 복귀 필수'
    }
  },
  {
    id: 'spit-wd-1',
    terrain: '사주',
    region: 'world',
    placeName: '러시아·리투아니아 쿠로니안 사주 (Curonian Spit)',
    countryOrArea: '리투아니아 / 러시아 칼리닌그라드 발트해',
    tagline: '길이 98km, 폭 400m~3.8km, 발트해와 석호를 가르는 유네스코 세계유산 모래 방파제',
    description: `### 장소 소개 및 선정 이유
유네스코 세계문화유산인 쿠로니안 사주는 발트해와 쿠로니안 석호(Lagoon)를 완전히 분리하며 남북으로 98km나 길게 뻗은 지구상에서 가장 긴 모래 사주 지형 중 하나로, 거대한 모래언덕과 침엽수림이 공존합니다.

### 과학적 형성 과정
빙하기 이후 연안류(Longshore Drift)가 발트해 남쪽의 모래를 북쪽으로 지속적으로 운반하여 만 입구를 가로지르는 사주를 만들었고, 바람이 모래를 내륙 쪽으로 날려 최고 높이 67m의 거대한 사구 지대를 덧붙였습니다.

### 탐험 포인트
- **파르니다스 사구(Parnidis Dune)**: 석호 수면을 굽어보는 높이 52m의 백색 이동 사구
- **춤추는 숲(Dancing Forest)**: 바람과 모래 때문에 나무줄기가 꽈배기처럼 꼬인 기이한 소나무 숲`,
    formationProcess: '발트해 연안류에 의한 모래 퇴적 연장 및 바람의 풍성 사구 형성 결합',
    observationPoints: ['98km 초장거리 모래 방파제', '석호와 외해 발트해의 수평 대비', '춤추는 소나무 숲'],
    mapQuery: 'Curonian Spit Lithuania',
    geology: {
      geologicalAge: '신생대 제4기 홀로세 (약 5,000년 전~현재)',
      rockType: '풍성 및 연안 석영질 세립사',
      tectonicSetting: '발트해 후빙기 지각 반등 및 연안 퇴적 분지',
      geomorphicAgent: '북향 연안류(Longshore Drift) 및 발트해 편서풍',
      scale: { lengthKm: 98, areaKm2: 98 }
    },
    evolutionStages: [
      { stageNumber: 1, title: '발트해 빙하 빙퇴석 섬들', timeframe: '약 7,000년 전', process: '해수면 상승으로 옛 빙하 모레인 언덕들이 징검다리 섬으로 남음', visualKeyFeature: '일렬로 늘어선 해저 사주 핵' },
      { stageNumber: 2, title: '연안류 모래 공급 및 연결', timeframe: '약 5,000년 전', process: '남쪽에서 밀려오는 연안류가 모래를 운반하여 섬과 섬 사이를 둑길처럼 연결', visualKeyFeature: '북쪽을 향해 자라나는 좁고 긴 모래톱' },
      { stageNumber: 3, title: '쿠로니안 석호 완전 격리', timeframe: '약 2,000년 전', process: '98km 전체가 이어지며 발트해 외해와 쿠로니안 석호를 완벽하게 차단', visualKeyFeature: '담수화된 거대한 내해 석호 탄생' },
      { stageNumber: 4, title: '거대 이동 사구와 삼림 조성', timeframe: '근현대', process: '사막화된 사구가 마을을 덮치자 대대적인 소나무 식재로 안정화 성공', visualKeyFeature: '유럽 최대의 사구 휴양지 안착' }
    ],
    fieldGuide: {
      bestVisitingSeason: '6월~8월 (발트해의 온화한 백야 기후와 자전거 사주 횡단 최적기)',
      satelliteCheckPoints: ['발트해 지도에서 눈에 번쩍 띄는 가느다란 실 모양의 98km 사주 띠', '사주 서측의 짙푸른 발트해와 동측의 옅은 청록색 쿠로니안 석호의 색상 대비', '사주 중간중간에 보이는 황금빛 모래언덕 패치들'],
      cautionAndConservation: '국경선(리투아니아-러시아) 통과 구역 및 이동사구 보행 금지 펜스 준수'
    }
  }
];
