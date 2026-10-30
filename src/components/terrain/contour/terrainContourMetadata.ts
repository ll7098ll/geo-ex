import {
  GeomorphicFeatureVector,
  ContourIntervalSettings,
  CrossSectionPreset,
} from '../../../types/contour';

export interface TerrainContourMeta {
  contourSettings: ContourIntervalSettings;
  features: GeomorphicFeatureVector[];
  contourReadingTips: string[];
  crossSectionPresets: CrossSectionPreset[];
}

export const TERRAIN_CONTOUR_METADATA: Record<string, TerrainContourMeta> = {
  // ====================================================
  // 1. 화산 지형 (Volcanic)
  // ====================================================
  '화산': {
    contourSettings: { indexInterval: 2.0, intermediateInterval: 0.5 },
    features: [
      { id: 'crater_rim', name: '화구륜(화구 테두리)', type: 'crater', points: [[0, 0]], hasHachures: true, description: '중심부 화구 오목 함몰선' },
      { id: 'radial_ridge', name: '방사상 능선', type: 'ridge', points: [[0, 0], [7, 7], [-6, 6], [-5, -6], [6, -5]] }
    ],
    contourReadingTips: [
      '정상부 화구로 갈수록 동심원 등고선 간격이 좁아지며 급경사를 이룹니다.',
      '중심부 분화구에는 안쪽으로 낮아지는 요지(빗금) 기호가 표시됩니다.',
      '사면을 따라 흐른 용암류 흔적으로 방사상으로 굴곡진 등고선이 나타납니다.'
    ],
    crossSectionPresets: [
      { id: 'crater_diam', name: '화구 중심 관통 단면 (A-B)', p1: [-9, 0], p2: [9, 0], description: '화산 사면 상승 → 화구륜 정점 → 분화구 바닥 함몰 → 반대편 사면' },
      { id: 'ridge_slope', name: '방사 능선 사면 단면', p1: [-8, -8], p2: [0, 0], description: '기저부 산록에서 정상 화구 테두리까지의 사면 경사' }
    ]
  },
  '칼데라': {
    contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 },
    features: [
      { id: 'caldera_wall', name: '외륜산 칼데라 급절벽', type: 'cliff', points: [[-5.2, -5.2], [5.2, -5.2], [5.2, 5.2], [-5.2, 5.2]], hasHachures: true },
      { id: 'resurgent_dome', name: '중앙화구구(재생 돔)', type: 'peak', points: [[0.55, 0.35]] }
    ],
    contourReadingTips: [
      '외륜산 안쪽으로 등고선이 극도로 밀집하여 거대한 절벽을 형성합니다.',
      '칼데라 바닥 분지는 등고선 간격이 매우 넓어 평탄한 평지를 보입니다.',
      '중심부에는 2차 분출로 솟아오른 중앙화구구의 독립된 동심원 등고선이 존재합니다.'
    ],
    crossSectionPresets: [
      { id: 'caldera_profile', name: '칼데라 외륜산-중앙화구구 종단 (A-B)', p1: [-9, 0], p2: [9, 0], description: '외륜산 능선 → 칼데라 내벽 수직 절벽 → 평탄 칼데라호/분지 바닥 → 중앙화구구 원추' }
    ]
  },
  '주상절리': {
    contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 },
    features: [
      { id: 'column_cliff', name: '주상절리 수직 단애', type: 'cliff', points: [[-8, 0], [8, 0]] }
    ],
    contourReadingTips: [
      '해안선과 맞닿은 절벽면에서 등고선이 거의 한 선으로 겹칠 만큼 극도로 밀집합니다.',
      '상부 평탄면은 육각형 기둥 단면의 미세한 기복이 반영되어 미세한 파동선을 그립니다.',
      '기둥의 수직 냉각 수축절리로 인해 단애면 등고선이 계단 모양의 꺾임을 보입니다.'
    ],
    crossSectionPresets: [
      { id: 'cliff_face', name: '상부 평탄면-수직 주상절리 단애 (A-B)', p1: [0, 7], p2: [0, -7], description: '용암대지 상부 평탄면 → 수직 주상절리 절벽 급락 → 해식 기저 파식대' }
    ]
  },
  '용암동굴': {
    contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 },
    features: [
      { id: 'lava_tube_axis', name: '용암동굴 축선', type: 'channel', points: [[-7, -6], [0, 0], [7, 6]] },
      { id: 'sinkhole', name: '함몰구(궤)', type: 'sinkhole', points: [[1, 1]], hasHachures: true }
    ],
    contourReadingTips: [
      '지표면 자체는 순상화산 특유의 매우 완만한 등고선 간격을 보입니다.',
      '용암 튜브 천장이 붕괴된 곳에 작은 국소 함몰 등고선(빗금)이 산재합니다.',
      '동굴 흐름 축선을 따라 완만한 골짜기 형상의 요철이 관찰됩니다.'
    ],
    crossSectionPresets: [
      { id: 'lava_axis', name: '동굴 천장 함몰구 횡단 단면 (A-B)', p1: [-6, 6], p2: [6, -6], description: '완경사 순상화산 사면 → 함몰구 개구부 급경사 → 동굴 상부 지표' }
    ]
  },
  '기생화산': {
    contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 },
    features: [
      { id: 'scoria_cone', name: '분화구(굼부리)', type: 'crater', points: [[0, 0]], hasHachures: true },
      { id: 'parasitic_summit', name: '오름 봉우리', type: 'peak', points: [[0, 2]] }
    ],
    contourReadingTips: [
      '완만한 화산 산록 평원 위에 고립된 형태의 원형 폐곡선 등고선 덩어리가 솟아 있습니다.',
      '정상부에 소형 굼부리(분화구)가 말굽형 또는 원형으로 오목하게 패여 있습니다.',
      '스코리아(화산송이) 퇴적으로 사면 경사가 약 30도로 매우 균일한 등고선 간격을 이룹니다.'
    ],
    crossSectionPresets: [
      { id: 'oreum_profile', name: '오름 분화구 횡단 단면 (A-B)', p1: [-8, 0], p2: [8, 0], description: '제주 평탄 산록 → 오름 스코리아 사면 → 굼부리 테두리 → 분화구 바닥' }
    ]
  },
  '단층 산맥': {
    contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 },
    features: [
      { id: 'fault_scarp', name: '주 단층애(Fault Scarp)', type: 'fault_line', points: [[-1, -10], [0.5, 0], [-0.5, 10]] }
    ],
    contourReadingTips: [
      '단층선을 경계로 서측과 동측의 등고선 패턴이 극단적으로 대조됩니다.',
      '단층애 사면은 등고선이 직선형으로 조밀하며, 반대편 경동사면은 넓고 완만하게 펼쳐집니다.',
      '단층선을 따라 직선형 골짜기 및 삼각말단면(Triangular Facet)이 형성됩니다.'
    ],
    crossSectionPresets: [
      { id: 'tilt_block', name: '경동지괴 횡단 단면 (A-B)', p1: [-9, 0], p2: [9, 0], description: '단층애 급경사 절벽 → 주능선 단층면 정상 → 완경사 경동 배후 사면' }
    ]
  },

  // ====================================================
  // 2. 해안 지형 (Coastal)
  // ====================================================
  '갯벌': {
    contourSettings: { indexInterval: 0.4, intermediateInterval: 0.1 },
    features: [
      { id: 'tidal_channel', name: '수지상 조수로(Tidal Channel)', type: 'channel', points: [[0, -8], [0, 0], [-4, 6], [4, 7]] }
    ],
    contourReadingTips: [
      '등고선 간격이 광활하게 벌어져 해안선 안쪽의 극평탄한 조간대를 보여줍니다.',
      '밀물과 썰물이 깎아낸 수지상(나뭇가지 모양) 조수로 홈을 따라 V자형 등고선 굴곡이 관찰됩니다.',
      '해안제방선에 이르러서야 갑작스럽게 등고선이 계단식으로 밀집합니다.'
    ],
    crossSectionPresets: [
      { id: 'mudflat_creek', name: '조간대-조수로 횡단 단면 (A-B)', p1: [-8, 0], p2: [8, 0], description: '평탄 갯벌 간척지 → U-V자형 조수로 수로 바닥 → 갯벌 완경사' }
    ]
  },
  '해식애': {
    contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 },
    features: [
      { id: 'wave_cut_cliff', name: '해식 절벽 라인', type: 'cliff', points: [[-10, 0], [10, 0]] }
    ],
    contourReadingTips: [
      '해안선과 평행하게 등고선이 면도날처럼 밀집하여 수직 파식 절벽을 표현합니다.',
      '절벽 아래 바다 쪽은 평탄한 파식대로 등고선이 사라지거나 매우 얕아집니다.',
      '절벽 상부는 완만한 산록 지형으로 등고선 간격이 급격히 넓어집니다.'
    ],
    crossSectionPresets: [
      { id: 'cliff_to_sea', name: '배후 산지-해식 절벽-파식대 단면 (A-B)', p1: [0, 8], p2: [0, -8], description: '배후 완경사 구릉 → 수직 해식애 낭떠러지 → 평탄 파식대 암반 및 해수면' }
    ]
  },
  '시스택': {
    contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 },
    features: [
      { id: 'sea_stack_peak', name: '시스택 독립 암초', type: 'peak', points: [[0, 1], [-4, -3], [4, -2]] }
    ],
    contourReadingTips: [
      '평탄한 해수면 한가운데 손톱만 한 독립된 폐곡선 등고선들이 고립되어 솟아 있습니다.',
      '절벽으로 둘러싸여 둘레 등고선이 매우 좁고 가파릅니다.',
      '원래 해식애였던 본체 육지와의 사이에 파식대 평면이 펼쳐집니다.'
    ],
    crossSectionPresets: [
      { id: 'sea_stack_cut', name: '시스택 촛대바위 관통 단면 (A-B)', p1: [-8, 1], p2: [8, 1], description: '해수면 → 수직 시스택 암봉 상승 → 뾰족한 첨탑 정상 → 해수면 급락' }
    ]
  },
  '해안 사구': {
    contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 },
    features: [
      { id: 'dune_crest', name: '사구 능선(Dune Crest)', type: 'ridge', points: [[-8, 2], [0, 3], [8, 2]] }
    ],
    contourReadingTips: [
      '바닷바람을 맞는 완만한 풍상측 사면(넓은 간격)과 급경사의 풍하측 슬립페이스(조밀 간격)가 대조를 이룹니다.',
      '해안선에 평행한 물결 모양의 등고선 띠가 형성됩니다.',
      '사구 배후 저습지(사구열 사이 습지)는 등고선이 낮아지는 완충지대를 보입니다.'
    ],
    crossSectionPresets: [
      { id: 'dune_cross', name: '백사장-사구능선-배후지 단면 (A-B)', p1: [0, -8], p2: [0, 8], description: '해변 백사장 → 사구 완경사 풍상면 → 사구 능선 정점 → 급경사 풍하면' }
    ]
  },
  '사주·사취': {
    contourSettings: { indexInterval: 0.5, intermediateInterval: 0.1 },
    features: [
      { id: 'sand_spit_axis', name: '모래톱 연장축', type: 'ridge', points: [[-9, -2], [-2, 0], [6, 3]] }
    ],
    contourReadingTips: [
      '만 입구를 가로질러 좁고 긴 띠 모양으로 저고도 등고선이 바다 쪽으로 뻗어 나갑니다.',
      '사주 안쪽의 석호(Lagoon) 구역은 완벽한 수평 폐쇄 수면을 이룹니다.',
      '사취 끝부분은 파도 굴절에 의해 갈고리 모양(Hook)으로 굽어지는 등고선을 보입니다.'
    ],
    crossSectionPresets: [
      { id: 'sandspit_cut', name: '석호-모래사주-외해 횡단 단면 (A-B)', p1: [-2, 7], p2: [-2, -7], description: '내만 석호 정온 수면 → 좁은 모래톱 사주 융기 → 외해 파도 타격 사면' }
    ]
  },
  '석호': {
    contourSettings: { indexInterval: 0.5, intermediateInterval: 0.1 },
    features: [
      { id: 'lagoon_basin', name: '석호 수면', type: 'depression_zone', points: [[0, 2]], hasHachures: true },
      { id: 'spit_barrier', name: '사주 방파제', type: 'ridge', points: [[-9, -4], [9, -4]] }
    ],
    contourReadingTips: [
      '바다와 맞닿아 있지만 사주에 의해 차단된 거대한 수평 수면(등고선 무존재 영역)이 특징입니다.',
      '배후 산지 골짜기 유입부에는 삼각주 형태의 미세 퇴적 등고선이 형성됩니다.',
      '바다 쪽 외해 경계에는 1~2가닥의 좁고 긴 모래톱 등고선이 길게 가로막고 있습니다.'
    ],
    crossSectionPresets: [
      { id: 'lagoon_profile', name: '배후 산지-석호 수면-사주 횡단 (A-B)', p1: [0, 8], p2: [0, -8], description: '배후 침식 구릉 → 석호 수면(해발 0~1m) → 사주 모래톱 고개 → 동해 외해' }
    ]
  },
  '파식대': {
    contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 },
    features: [
      { id: 'wave_platform', name: '파식대 암반 평탄면', type: 'channel', points: [[-8, -3], [8, -3]] },
      { id: 'cliff_back', name: '해식애 절벽', type: 'cliff', points: [[-8, 2], [8, 2]] }
    ],
    contourReadingTips: [
      '해수면 부근에 넓게 펼쳐진 거의 평탄한 등고선 무풍지대(간격 광활)가 파식대입니다.',
      '파식대 안쪽 육지 방향으로 등고선이 겹칠 듯 밀집하는 해식애 절벽이 마주합니다.',
      '만조 시 바닷물에 잠기고 간조 시 드러나는 완만한 1~2도 경사를 이룹니다.'
    ],
    crossSectionPresets: [
      { id: 'bench_profile', name: '파식대 암반면-해식애 단면 (A-B)', p1: [0, -8], p2: [0, 8], description: '바다 저조선 → 평탄한 파식대 바위 단면 → 해식애 기저 파식구 → 수직 절벽' }
    ]
  },

  // ====================================================
  // 3. 하천 지형 (Fluvial)
  // ====================================================
  '선상지': {
    contourSettings: { indexInterval: 1.0, intermediateInterval: 0.2 },
    features: [
      { id: 'apex', name: '선정(Apex)', type: 'peak', points: [[0, 7]] },
      { id: 'fan_boundary', name: '선단(Toe)', type: 'channel', points: [[-8, -7], [0, -9], [8, -7]] }
    ],
    contourReadingTips: [
      '골짜기 입구(선정)를 꼭짓점으로 하여 하류 방향으로 방사상 부채꼴 호형 등고선이 펼쳐집니다.',
      '선정에서 선앙을 지나 선단으로 갈수록 등고선 간격이 점진적으로 넓어져 완만해집니다.',
      '선앙의 복류천 구역은 하천 표시가 끊어졌다가 선단 용천대에서 다시 수로가 시작됩니다.'
    ],
    crossSectionPresets: [
      { id: 'fan_radial', name: '선정-선앙-선단 종단 단면 (A-B)', p1: [0, 8], p2: [0, -8], description: '계곡 출구 선정 급경사 → 자갈 선앙 완경사 전개 → 선단 평야 접점' },
      { id: 'fan_cross', name: '선상지 중앙 횡단 단면 (A-B)', p1: [-8, 0], p2: [8, 0], description: '좌측 산록 → 선상지 중심 부채꼴 볼록 능선 → 우측 산록' }
    ]
  },
  '범람원': {
    contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 },
    features: [
      { id: 'natural_levee', name: '자연제방(Natural Levee)', type: 'ridge', points: [[-4, -8], [2, 0], [-3, 8]] },
      { id: 'backswamp', name: '배후습지(Backswamp)', type: 'depression_zone', points: [[6, 0]], hasHachures: true }
    ],
    contourReadingTips: [
      '하천 양안을 따라 미세하게 솟아오른 자연제방의 좁고 긴 폐곡선 등고선이 관찰됩니다.',
      '자연제방 뒤편 배후습지는 지표면이 더 낮아 등고선이 안쪽으로 꺾여 들어갑니다.',
      '홍수 시 물이 넘쳐 퇴적된 모래 제방과 점토 습지의 미세 고저차가 확연합니다.'
    ],
    crossSectionPresets: [
      { id: 'floodplain_cut', name: '하천-자연제방-배후습지 단면 (A-B)', p1: [-6, 0], p2: [8, 0], description: '하도 물줄기 → 하안 자연제방 미고지 → 배후습지 저지대' }
    ]
  },
  '곡류천': {
    contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 },
    features: [
      { id: 'thalweg', name: '하곡 중심 최심하상선(Thalweg)', type: 'channel', points: [[-7, -8], [-2, -2], [5, 0], [-1, 5], [7, 8]] }
    ],
    contourReadingTips: [
      '곡류 바깥쪽 공격사면은 침식으로 등고선이 밀집된 하식애 절벽을 이룹니다.',
      '곡류 안쪽 활주사면(Point Bar)은 퇴적으로 등고선이 매우 완만하고 넓게 퍼집니다.',
      '감입곡류천에서는 계곡 양안 산지 사이로 등고선이 S자로 휘돌아 나갑니다.'
    ],
    crossSectionPresets: [
      { id: 'meander_cross', name: '공격사면(하식애)-활주사면 횡단 (A-B)', p1: [6, -1], p2: [-6, -1], description: '공격사면 수직 절벽 침식면 → 깊은 유심 하상 → 활주사면 완경사 모래톱' }
    ]
  },
  '삼각주': {
    contourSettings: { indexInterval: 0.4, intermediateInterval: 0.1 },
    features: [
      { id: 'distributary', name: '분류 하천망', type: 'channel', points: [[0, 8], [-5, -6], [0, -7], [5, -6]] }
    ],
    contourReadingTips: [
      '바다와 맞닿는 하구에 삼각형 모양의 극도로 평탄한 등고선이 수평에 가깝게 펼쳐집니다.',
      '여러 갈래로 갈라지는 분류(Distributaries) 하도 사이로 미세한 미지형 굴곡이 있습니다.',
      '해안선에 이르러 0m 등고선이 넓은 부채꼴로 바다를 향해 돌출합니다.'
    ],
    crossSectionPresets: [
      { id: 'delta_profile', name: '삼각주 정점-하구 연안 종단 단면 (A-B)', p1: [0, 8], p2: [0, -8], description: '하천 하류 평야 → 분류 갈래길 평탄면 → 바다 해수면 만남' }
    ]
  },
  '하안단구': {
    contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 },
    features: [
      { id: 'terrace_scarp', name: '단구애(Terrace Scarp)', type: 'cliff', points: [[-8, -1], [8, -1]] }
    ],
    contourReadingTips: [
      '계단 모양의 등고선 배열: 평탄한 단구면(넓은 간격)과 수직 급경사의 단구애(밀집선)가 층층이 교대합니다.',
      '융기와 하방침식의 역사가 다단 계단식 등고선으로 한눈에 파악됩니다.',
      '하천 상류로 갈수록 과거 하천 바닥이었던 단구면의 고도가 높아집니다.'
    ],
    crossSectionPresets: [
      { id: 'terrace_steps', name: '다단 하안단구 계단 횡단 단면 (A-B)', p1: [0, 8], p2: [0, -8], description: '고위 단구면 → 단구애 급경사 → 중위 단구면 → 단구애 → 현 하천 바닥' }
    ]
  },
  '폭포': {
    contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 },
    features: [
      { id: 'waterfall_drop', name: '폭포 단애면', type: 'cliff', points: [[-4, 2], [4, 2]] },
      { id: 'plunge_pool', name: '폭호(Plunge Pool)', type: 'sinkhole', points: [[0, 0]], hasHachures: true }
    ],
    contourReadingTips: [
      '하천 진행 방향을 가로질러 등고선이 순간적으로 뚝 끊어지듯 초밀집하는 절벽이 나타납니다.',
      '폭포 아래에는 낙수로 파인 원형의 폭호 웅덩이 함몰선이 확인됩니다.',
      '폭포 상류와 하류의 하상 고도 차이가 계단 단층처럼 뚜렷합니다.'
    ],
    crossSectionPresets: [
      { id: 'falls_drop', name: '폭포 낙차 및 폭호 종단 단면 (A-B)', p1: [0, 7], p2: [0, -7], description: '상류 완만 하상 → 폭포 립(Lip) 절벽 수직 급락 → 폭호 와지 → 하류 협곡' }
    ]
  },

  // ====================================================
  // 4. 카르스트 지형 (Karst)
  // ====================================================
  '돌리네': {
    contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 },
    features: [
      { id: 'doline_center', name: '싱크홀 중심 배수구(Ponor)', type: 'sinkhole', points: [[0, 0]], hasHachures: true },
      { id: 'uvala_rim', name: '우발라 복합 함몰지', type: 'depression_zone', points: [[-4, 3], [4, -3]], hasHachures: true }
    ],
    contourReadingTips: [
      '원형 및 타원형의 폐곡선 등고선 안쪽에 빗금(요지 표기)이 쳐져 지표면이 푹 꺼진 깔때기 형태를 보입니다.',
      '주변보다 낮은 중심점으로 빗물이 스며드는 포노르(Ponor) 지점을 확인하세요.',
      '여러 돌리네가 결합하여 커진 우발라(Uvala)는 누에고치 모양의 다핵 함몰선을 나타냅니다.'
    ],
    crossSectionPresets: [
      { id: 'doline_cut', name: '돌리네 깔때기 함몰 단면 (A-B)', p1: [-7, 0], p2: [7, 0], description: '카르스트 지표 고지대 → 돌리네 외곽 사면 하강 → 중심 흡수혈(Ponor) 최저점 → 반대 사면' }
    ]
  },
  '석회동굴': {
    contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 },
    features: [
      { id: 'karst_surface', name: '지표 카렌대', type: 'ridge', points: [[-6, -6], [6, 6]] }
    ],
    contourReadingTips: [
      '지표면은 석회암 용식 작용으로 인한 불규칙하고 울퉁불퉁한 돌기형 등고선이 산재합니다.',
      '동굴 입구 주변으로 수직 절리형 침식선이 가파르게 발달합니다.',
      '동굴 천장 함몰로 인한 국소 돌리네들이 동굴 주향을 따라 일렬로 배열됩니다.'
    ],
    crossSectionPresets: [
      { id: 'cave_entry', name: '동굴 입구 협곡 횡단 단면 (A-B)', p1: [-7, 5], p2: [7, -5], description: '석회암 고원 지표 → 동굴 입구 급경사 함몰 단애 → 협곡 계곡 바닥' }
    ]
  },
  '탑 카르스트': {
    contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 },
    features: [
      { id: 'tower_1', name: '제1 석회암 봉우리', type: 'peak', points: [[-4, -3]] },
      { id: 'tower_2', name: '제2 석회암 봉우리', type: 'peak', points: [[3, 3]] },
      { id: 'tower_3', name: '제3 석회암 봉우리', type: 'peak', points: [[2, -4]] }
    ],
    contourReadingTips: [
      '극도로 평탄한 용식 평원 위에 원통형의 초밀집 동심원 등고선 기둥들이 탑처럼 솟아 있습니다.',
      '수직 직벽에 가까운 경사로 인해 등고선 간격이 기둥 테두리에 모여 있습니다.',
      '봉우리 사이의 바닥은 등고선이 거의 없어 평탄한 충적/용식 평야를 보입니다.'
    ],
    crossSectionPresets: [
      { id: 'tower_cut', name: '용식 평원-석회암 봉우리 단면 (A-B)', p1: [-8, -3], p2: [8, -3], description: '평탄 침식 평원 → 수직 기둥형 탑카르스트 암봉 상승 → 봉우리 정상 → 평원 착지' }
    ]
  },
  '카렌': {
    contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 },
    features: [
      { id: 'karen_furrow', name: '용식 홈(카렌펠트)', type: 'channel', points: [[-5, -5], [0, 0], [5, 5]] }
    ],
    contourReadingTips: [
      '석회암 암반 표면에 빗물 용식으로 파인 얕은 고랑과 돌출부가 톱니 모양의 미세 등고선을 이룹니다.',
      '절리망을 따라 격자 또는 평행 선형으로 굴곡진 독특한 주름 등고선이 나타납니다.',
      '지표수 유출선이 뚜렷하지 않고 빗물이 암석 틈새로 곧장 침투합니다.'
    ],
    crossSectionPresets: [
      { id: 'karen_ridge', name: '카렌 톱니형 요철 횡단 단면 (A-B)', p1: [-6, 6], p2: [6, -6], description: '용식 고랑 → 석회암 날카로운 돌출봉 → 용식 홈 반복 요철' }
    ]
  },

  // ====================================================
  // 5. 빙하 지형 (Glacial)
  // ====================================================
  'U자곡': {
    contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 },
    features: [
      { id: 'u_valley_axis', name: '빙하 침식 계곡 바닥', type: 'channel', points: [[0, -10], [0, 10]] }
    ],
    contourReadingTips: [
      '하천의 V자곡과 달리, 계곡 바닥은 등고선이 거의 없는 넓고 평탄한 평면을 형성합니다.',
      '계곡 양쪽 사면은 등고선이 빽빽하게 겹쳐 수직에 가까운 U자 빙식애 절벽을 이룹니다.',
      '지류 빙하가 깎아낸 현곡(Hanging Valley)이 U자곡 절벽 중간에 걸려 있습니다.'
    ],
    crossSectionPresets: [
      { id: 'u_profile', name: 'U자 빙식곡 양안 절벽 횡단 (A-B)', p1: [-8, 0], p2: [8, 0], description: '좌측 빙식 절벽 수직 하강 → 광활한 평탄 U자곡 바닥 → 우측 빙식 절벽 수직 상승' }
    ]
  },
  '피오르드': {
    contourSettings: { indexInterval: 1.8, intermediateInterval: 0.4 },
    features: [
      { id: 'fjord_channel', name: '침수된 U자 협곡 수로', type: 'channel', points: [[-2, -10], [2, 10]] }
    ],
    contourReadingTips: [
      '해수면(0m 등고선) 안쪽으로 깊숙이 들어온 좁고 긴 수로 양안으로 천길 낭떠러지 등고선이 병풍처럼 둘러섭니다.',
      '바다 쪽으로 갈수록 얕아지는 빙하 말단 문턱(Threshold) 지형이 관찰됩니다.',
      '바닷물이 U자곡 깊숙이 침수한 익곡 특유의 깎아지른 절벽선이 길게 이어집니다.'
    ],
    crossSectionPresets: [
      { id: 'fjord_cross', name: '피오르드 해협 횡단 단면 (A-B)', p1: [-7, 0], p2: [7, 0], description: '피오르드 고원 암벽 → 수직 해식 빙식애 절벽 → 깊은 수로 해수면 → 대안 암벽' }
    ]
  },
  '혼': {
    contourSettings: { indexInterval: 2.0, intermediateInterval: 0.5 },
    features: [
      { id: 'horn_peak', name: '호른 정상 4각 피라미드 첨두', type: 'peak', points: [[0, 0]] },
      { id: 'arete_ne', name: '북동 아레테 (칼날 능선)', type: 'ridge', points: [[0, 0], [6, 6]] },
      { id: 'arete_sw', name: '남서 아레테 (칼날 능선)', type: 'ridge', points: [[0, 0], [-6, -6]] },
      { id: 'cirque_north', name: '북벽 권곡호(Tarn)', type: 'sinkhole', points: [[0, 5.2]], hasHachures: true }
    ],
    contourReadingTips: [
      '4개 방향의 반원형 권곡(Cirque) 등고선이 교차하며 중앙에 날카로운 4각 피라미드 침식 암봉을 남깁니다.',
      '4대 칼날 능선(아레테)을 따라 등고선이 뾰족한 V자로 꺾여 밖으로 뻗어나갑니다.',
      '능선 사이의 4대 거벽(북벽, 남벽 등)은 등고선이 극도로 밀집된 수직 절벽을 형성합니다.'
    ],
    crossSectionPresets: [
      { id: 'horn_ridge', name: '남서 아레테-호른 정상-북동 아레테 단면 (A-B)', p1: [-7, -7], p2: [7, 7], description: '남서 칼날 아레테 능선 → 혼(Horn) 피라미드 암봉 정상(6.4m) → 북동 아레테 능선' },
      { id: 'horn_face', name: '남벽 거벽-호른 정상-북벽 권곡호 단면 (C-D)', p1: [0, -6], p2: [0, 6], description: '남벽 깎아지른 권곡 헤드월 → 정상 첨두 → 북벽 오목 권곡호(Tarn)' }
    ]
  },
  '권곡': {
    contourSettings: { indexInterval: 1.5, intermediateInterval: 0.3 },
    features: [
      { id: 'cirque_headwall', name: '권곡 헤드월(Headwall)', type: 'cliff', points: [[-6, 4], [0, 6], [6, 4]] },
      { id: 'tarn_lake', name: '권곡호(Tarn)', type: 'sinkhole', points: [[0, 1]], hasHachures: true }
    ],
    contourReadingTips: [
      '말굽 모양 또는 안락의자 모양으로 둥글게 파인 반원형 등고선 형태를 보입니다.',
      '뒷벽(Headwall)은 수직 절벽으로 등고선이 빽빽하고, 바닥은 완만한 오목 웅덩이입니다.',
      '바닥 웅덩이에 빙하가 녹아 형성된 빙하호(Tarn) 폐곡선이 존재합니다.'
    ],
    crossSectionPresets: [
      { id: 'cirque_bowl', name: '헤드월 절벽-권곡호-암석 문턱 단면 (A-B)', p1: [0, 8], p2: [0, -6], description: '수직 권곡 뒷벽(Headwall) → 권곡호(Tarn) 분지 와지 → 빙하 찰과 암석 문턱' }
    ]
  },
  '모레인': {
    contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 },
    features: [
      { id: 'terminal_moraine', name: '종퇴석(Terminal Moraine) 제방', type: 'ridge', points: [[-8, -3], [0, -5], [8, -3]] }
    ],
    contourReadingTips: [
      '빙하가 녹으며 밀어놓은 암석 부스러기가 계곡 말단에 초승달 형태의 둑(제방) 등고선을 이룹니다.',
      '표면 기복이 무작위적이고 불규칙한 미소 구릉 등고선 군집을 보입니다.',
      '모레인 안쪽은 빙하가 빠져나간 넓고 평탄한 곡저 평원을 이룹니다.'
    ],
    crossSectionPresets: [
      { id: 'moraine_ridge', name: '빙하 평원-종퇴석 제방 횡단 (A-B)', p1: [0, 4], p2: [0, -8], description: '빙하 후퇴 평원 바닥 → 불규칙 종퇴석 언덕 융기 → 외곽 융빙수 사면' }
    ]
  },

  // ====================================================
  // 6. 건조 지형 (Arid)
  // ====================================================
  '사막': {
    contourSettings: { indexInterval: 0.8, intermediateInterval: 0.2 },
    features: [
      { id: 'barchan_crest', name: '바르한 초승달 능선', type: 'ridge', points: [[-5, 3], [0, 0], [5, 3]] }
    ],
    contourReadingTips: [
      '초승달 모양의 바르한(Barchan) 사구: 볼록한 풍상측은 완경사, 안쪽 오목한 슬립페이스는 조밀한 급경사입니다.',
      '사구 양쪽 끝의 뿔(Horn)이 바람이 불어가는 방향으로 길게 뻗어 있습니다.',
      '사구와 사구 사이의 바람 통로는 평탄한 자갈 바닥(세리르)을 이룹니다.'
    ],
    crossSectionPresets: [
      { id: 'barchan_cut', name: '바르한 사구 바람 축 단면 (A-B)', p1: [0, -8], p2: [0, 6], description: '바람맞이 풍상측 완사면 → 바르한 칼날 능선 정점 → 슬립페이스 34도 안식각 절벽' }
    ]
  },
  '버섯바위': {
    contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 },
    features: [
      { id: 'pedestal_cap', name: '버섯바위 상부 갓(Cap Rock)', type: 'peak', points: [[0, 0]] }
    ],
    contourReadingTips: [
      '바람에 날린 모래 침식으로 지표 부근 기둥이 잘록하게 깎여, 상부 갓보다 하부 기둥 둘레 등고선이 작아집니다.',
      '주변은 평탄한 풍식 자갈 평원(레그)으로 등고선이 드뭅니다.',
      '국소 고립 암괴 주위로 등고선이 팽이처럼 응축되어 나타납니다.'
    ],
    crossSectionPresets: [
      { id: 'mushroom_cut', name: '버섯바위 갓-잘록한 기둥 단면 (A-B)', p1: [-5, 0], p2: [5, 0], description: '자갈 평원 → 잘록한 하부 기둥 침식부 → 돌출된 상부 갓바위' }
    ]
  },
  '오아시스': {
    contourSettings: { indexInterval: 0.6, intermediateInterval: 0.15 },
    features: [
      { id: 'oasis_pool', name: '오아시스 수면', type: 'sinkhole', points: [[0, 0]], hasHachures: true }
    ],
    contourReadingTips: [
      '거대한 사구 언덕들 사이에 옴폭하게 파인 오목 분지 등고선이 나타납니다.',
      '분지 가장 낮은 바닥에 지하수가 지표로 노출된 수평 저수 구역이 자리합니다.',
      '오목 분지 둘레를 따라 빗금(요지 기호)이 안쪽 수면을 향해 표시됩니다.'
    ],
    crossSectionPresets: [
      { id: 'oasis_profile', name: '모래사구-오아시스 웅덩이 단면 (A-B)', p1: [-8, 0], p2: [8, 0], description: '주변 높은 사구 언덕 → 오아시스 분지 오목 경사 → 지하수 용출 수면' }
    ]
  },
  '플라야': {
    contourSettings: { indexInterval: 0.4, intermediateInterval: 0.1 },
    features: [
      { id: 'playa_floor', name: '플라야 건조 염호 바닥', type: 'depression_zone', points: [[-5, -5], [5, -5], [5, 5], [-5, 5]], hasHachures: true }
    ],
    contourReadingTips: [
      '산록완사면(페디먼트)에 둘러싸인 중심부에 완벽한 수평의 폐쇄 분지 평면이 펼쳐집니다.',
      '물이 증발하며 남은 염류 침전 바닥으로 등고선이 거의 없는 백색 평원입니다.',
      '비가 올 때만 일시적으로 얕은 염호(Playa Lake)를 형성하는 분지 최저점입니다.'
    ],
    crossSectionPresets: [
      { id: 'playa_cross', name: '산록 바하다-플라야 염호 단면 (A-B)', p1: [-8, 0], p2: [8, 0], description: '산록 완경사 바하다 선상지군 → 플라야 평탄 염호 바닥 분지' }
    ]
  },
  '와디': {
    contourSettings: { indexInterval: 1.0, intermediateInterval: 0.25 },
    features: [
      { id: 'wadi_canyon', name: '와디 건천 협곡선', type: 'channel', points: [[-8, -8], [0, 0], [8, 8]] }
    ],
    contourReadingTips: [
      '사막 고원을 깊게 파고든 급경사 협곡 사이로 평탄한 모래자갈 하상이 뻗어 있습니다.',
      '평소에는 물이 흐르지 않는 건천이지만, 돌발 홍수 시 거친 급류가 흐릅니다.',
      '협곡 양안은 등고선이 계단식 단애로 밀집하고 하상은 넓고 평탄합니다.'
    ],
    crossSectionPresets: [
      { id: 'wadi_canyon_cut', name: '와디 건천 협곡 횡단 단면 (A-B)', p1: [-7, 7], p2: [7, -7], description: '건조 고원 평탄면 → 와디 수직 협곡벽 급락 → 평탄한 모래자갈 하상 바닥' }
    ]
  },
  '메사·뷰트': {
    contourSettings: { indexInterval: 1.2, intermediateInterval: 0.3 },
    features: [
      { id: 'mesa_caprock', name: '메사 정상 캡록(Caprock)', type: 'cliff', points: [[-5, -5], [5, -5], [5, 5], [-5, 5]] }
    ],
    contourReadingTips: [
      '단단한 수평 지층이 남긴 정상부의 극평탄한 테이블 지형(등고선 무풍)이 메사입니다.',
      '테이블 테두리는 수직 절벽(등고선 겹침)이며, 그 아래는 침식 부스러기가 쌓인 테일러스 완사면입니다.',
      '침식이 더 진행되어 뾰족한 원통형 탑으로 작아진 것이 뷰트(Butte)입니다.'
    ],
    crossSectionPresets: [
      { id: 'mesa_profile', name: '메사 테이블 지형 횡단 단면 (A-B)', p1: [-8, 0], p2: [8, 0], description: '기저 평원 → 테일러스 완사면 → 수직 캡록 절벽 → 메사 상부 수평 평탄면' }
    ]
  }
};

// Aliases lookup mapping
const KEY_ALIASES: Record<string, string> = {
  '사주': '사주·사취',
  '사취': '사주·사취',
  '호른': '혼',
  '카르': '권곡',
  '빙퇴석': '모레인',
  '유자곡': 'U자곡',
  '탑카르스트': '탑 카르스트',
  '오름': '기생화산',
  '메사': '메사·뷰트',
  '뷰트': '메사·뷰트',
};

export function getTerrainContourMeta(key: string): TerrainContourMeta {
  const resolved = KEY_ALIASES[key] || key;
  return (
    TERRAIN_CONTOUR_METADATA[resolved] ||
    TERRAIN_CONTOUR_METADATA['화산']
  );
}
