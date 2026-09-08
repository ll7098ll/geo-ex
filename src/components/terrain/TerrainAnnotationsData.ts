import { TerrainAnnotation } from '../../types';

// ==========================================
// Scientific 3D Annotations for All Terrains
// ==========================================
export const TERRAIN_ANNOTATIONS: Record<string, TerrainAnnotation[]> = {
  화산: [
    { name: '정상 분화구 & 용암호', description: '화산가스와 마그마가 끓어오르는 화구 중심부', position: [0, 4.4, 0] },
    { name: '방사상 협곡 (바랑코)', description: '화산 사면을 따라 빗물과 용암이 깎아낸 방사상 골짜기', position: [-3.2, 2.2, -2.5] },
    { name: '기생화산 (오름)', description: '화산 사면의 약한 틈새를 뚫고 분출한 분석구 화산체', position: [4.5, 2.3, 2.0] },
    { name: '기저부 용암류 완경사지', description: '점성이 낮은 용암이 넓게 퍼져 형성된 순상 산록', position: [6.0, 0.8, -5.0] },
  ],
  기생화산: [
    { name: '분화구 림 (Rim 능선)', description: '분출된 화산송이(스코리아)가 쌓여 형성된 30도 안식각 화구벽', position: [0, 4.0, -1.8] },
    { name: '산정 화구호 (분화구 습지)', description: '화구 바닥의 불투수 점토층에 빗물이 고여 형성된 천연 못', position: [0, 1.8, 0] },
    { name: '말굽형 터진 용암 유출구', description: '화산체 기저부 틈새로 용암류가 흘러나오며 붕괴된 화구벽 틈', position: [3.2, 1.9, 2.0] },
    { name: '화산송이 (스코리아) 비탈', description: '다공질 화산 쇄설물이 흘러내린 붉은빛 자갈 사면', position: [-3.8, 2.4, 2.2] },
  ],
  칼데라: [
    { name: '외륜산 칼데라 절벽', description: '지하 마그마방 함몰로 주저앉은 거대한 환상 단애벽', position: [0, 4.6, -5.8] },
    { name: '칼데라 호수 (천지/백록담)', description: '거대한 함몰 분지에 차오른 수백 미터 깊이의 산정 호수', position: [-1.2, 1.4, -0.5] },
    { name: '중앙화구구 (알봉/용암돔)', description: '칼데라 형성 후 2차 분출로 솟아오른 새로운 화산 돔', position: [2.2, 2.6, 1.0] },
    { name: '화산 쇄설류 외곽 고원', description: '화쇄류가 사방으로 쏟아져 나가 퇴적된 평탄한 외곽 완경사', position: [6.2, 2.8, 5.0] },
  ],
  주상절리: [
    { name: '육각형 주상절리 기둥군', description: '고온의 용암이 냉각되며 120도 수축 균열로 갈라진 6각 돌기둥', position: [2.2, 3.6, 0] },
    { name: '계단상 냉각 침식면', description: '파도의 반복 침식으로 계단 형태로 무너져 내린 단면', position: [-0.5, 2.2, 2.2] },
    { name: '파식 해안 기저부', description: '거센 파도가 주상절리 밑동을 강타하며 부서지는 조간대', position: [-4.0, 0.6, -1.5] },
    { name: '수직 냉각 균열선', description: '표면에서 내부로 수직 진행된 인장 응력 절리면', position: [4.0, 2.8, -2.5] },
  ],
  용암동굴: [
    { name: '용암동굴 함몰구 (천창)', description: '용암튜브 상부 천장이 붕괴되어 내부가 드러난 붕괴구', position: [0, 1.2, 0] },
    { name: '천연 현무암 아치교', description: '동굴 천장이 무너지지 않고 다리처럼 온전히 남은 구간', position: [0, 2.6, 2.8] },
    { name: '파호이호이 새끼줄 용암', description: '점성 낮은 밧줄 모양의 매끄러운 표면 용암 지표', position: [-4.2, 2.3, -2.8] },
    { name: '지하 용암 유로 (라바 튜브)', description: '표면이 식어 굳은 후 내부 용암만 빠져나가 빈 지하 터널', position: [0, 0.4, -3.2] },
  ],
  '단층 산맥': [
    { name: '수직 단층애 (단층 절벽)', description: '지각 인장 및 융기 변위로 칼로 자른 듯 솟아오른 급절벽', position: [-0.6, 4.4, 0] },
    { name: '삼각면 (Triangular Facet)', description: '계곡 침식으로 절벽 능선 끝자락에 형성된 삼각형 절단면', position: [-0.6, 2.6, -3.5] },
    { name: '경동지괴 완경사면', description: '단층 반대편으로 완만하게 기울어진 산맥의 등판 사면', position: [4.8, 2.4, 0] },
    { name: '단층 지구대 (저지대 분지)', description: '단층선 아래로 꺼져 내려앉아 퇴적물이 쌓인 평탄 분지', position: [-5.5, 0.5, 0] },
  ],
  갯벌: [
    { name: '수지상 갯골 (조류수로)', description: '밀물과 썰물이 드나들며 미세 펄을 나뭇가지 모양으로 파낸 물길', position: [0, 0.35, 0] },
    { name: '조간대 펄갯벌', description: '점토와 유기물이 두껍게 퇴적된 완만한 조간대 평탄면', position: [3.8, 0.55, -3.2] },
    { name: '상부 염습지 (갈대/칠면초)', description: '염생식물이 번성하여 조류 에너지를 줄이고 펄을 포착하는 구역', position: [6.0, 0.95, 4.2] },
    { name: '모래펄 전이대', description: '외해 파도와 조류가 만나는 모래와 점토의 혼합 퇴적대', position: [-5.2, 0.25, -2.0] },
  ],
  해식애: [
    { name: '수직 해식애 (해안 절벽)', description: '파도의 침식 작용으로 형성된 깎아지른 수직 바위 절벽', position: [0, 4.0, -1.5] },
    { name: '수평 파식대 (암반 플랫폼)', description: '절벽이 후퇴하면서 파도에 깎여 바다 밑에 평평하게 남은 암반', position: [-3.8, 0.45, 1.8] },
    { name: '해식동 노치 (Notch 홈)', description: '절벽 기저부 연약부가 파도에 집중 타격받아 파인 침식홈', position: [0.8, 0.7, -0.6] },
    { name: '퇴적암 수평 층리 단면', description: '수백만 년간 퇴적된 모래와 점토가 시루떡처럼 쌓인 지층선', position: [3.2, 3.2, -2.8] },
  ],
  시스택: [
    { name: '독립 시스택 (촛대바위)', description: '해식아치가 붕괴되어 본토와 완전히 분리된 외딴 바위탑', position: [2.8, 3.8, -1.0] },
    { name: '해식아치 (천연교)', description: '바다로 뻗은 곶의 양쪽이 파도에 뚫려 무지개처럼 연결된 아치', position: [-2.5, 3.0, 1.8] },
    { name: '후퇴하는 해안 곶 (Headland)', description: '파도의 집중 공격을 받아 지속적으로 후퇴하는 곶 지형', position: [-5.0, 3.4, -3.8] },
    { name: '수중 암초와 조간대 파식대', description: '시스택 주변 바다 밑에 남아있는 평평한 암반 침식 잔재', position: [3.2, 0.4, 2.5] },
  ],
  '해안 사구': [
    { name: '사구 능선 (Crest)', description: '바람이 불어오는 쪽과 넘어가는 쪽을 가르는 칼날 능선선', position: [0, 3.2, 0] },
    { name: '풍하측 슬립페이스 (급경사)', description: '모래가 굴러떨어지며 34도 안식각을 유지하는 가파른 비탈', position: [1.6, 2.0, 0.8] },
    { name: '풍상측 완경사면 & 연흔', description: '바람이 불어 올라오며 모래알이 잔물결 무늬를 남긴 완사면', position: [-3.6, 1.4, -2.2] },
    { name: '사구 배후 습지 (두웅습지)', description: '사구 뒤편 지하수위가 높아 담수가 고인 생태 보전 습지', position: [4.8, 0.75, 2.8] },
  ],
  '사주·사취': [
    { name: '만곡 사취 갈고리 (Hook Spit)', description: '연안류와 파랑 굴절에 의해 만 안쪽으로 둥글게 휜 모래톱 선단', position: [4.5, 1.3, 2.8] },
    { name: '사주 둑길 (Barrier Spit)', description: '연안류가 모래를 운반하여 바다와 만을 가로막는 모래 띠', position: [0, 0.95, 0] },
    { name: '배후 정온 수역 (만입)', description: '모래톱 뒤편 파도가 잦아들어 천연 항구가 되는 고요한 바다', position: [-3.5, 0.5, 2.2] },
    { name: '육계사주 (Tombolo)', description: '육지와 앞바다 섬을 연결하는 모래밭 둑길', position: [-4.2, 1.2, -3.0] },
  ],
  석호: [
    { name: '금빛 모래 사주 (Barrier)', description: '외해의 거센 파도를 차단하여 만을 호수로 폐쇄한 모래톱', position: [-2.6, 1.35, 0] },
    { name: '기수호 수면 (석호)', description: '담수와 해수가 섞여 독특한 기수 생태계를 이루는 호수', position: [1.6, 0.58, 0] },
    { name: '하구 갯트임 (Tidal Inlet)', description: '폭풍이나 조석 간만의 차로 바닷물이 교환되는 모래톱 틈새', position: [-2.6, 0.42, -4.8] },
    { name: '배후 사구 송림 (소나무 숲)', description: '모래바람을 막고 토양을 안정화하는 해안 방풍림 지대', position: [5.8, 2.0, 2.5] },
  ],
  파식대: [
    { name: '수평 파식대 플랫폼', description: '썰물 때 넓게 드러나는 평평하게 깎인 수평 퇴적암 바위 바닥', position: [-1.8, 0.65, 0] },
    { name: '조수 웅덩이 (Tide Pool)', description: '암반의 오목한 홈에 바닷물이 고여 해양생물이 서식하는 웅덩이', position: [-3.8, 0.5, 2.5] },
    { name: '책장 층리 해식애', description: '수만 권의 고서를 층층이 쌓아 올린 듯한 수직 퇴적 절벽', position: [3.8, 4.4, 0] },
    { name: '격자형 판상 방해석 맥', description: '지각 변형으로 암반 틈새에 광물이 침전된 격자 균열망', position: [-0.5, 0.7, -3.2] },
  ],
  선상지: [
    { name: '선정 (Apex / 부채꼴 꼭대기)', description: '급류 계곡이 평지로 터져나오며 거대한 자갈과 바위가 쌓이는 입구', position: [0, 4.0, -4.8] },
    { name: '선앙 복류대 (Mid-fan)', description: '자갈과 모래층 사이로 하천수가 지하로 스며드는 과수원/밭 지대', position: [1.8, 2.2, 0] },
    { name: '선단 용천대 (Fan Toe)', description: '지하로 흐르던 복류수가 다시 솟아올라 논농사를 짓는 외곽', position: [0, 0.6, 4.8] },
    { name: '방사상 망상 유로 (Braided Channels)', description: '홍수 시 여러 갈래로 흩어져 자갈을 퇴적하는 나뭇가지 물길', position: [-2.2, 1.8, -1.5] },
  ],
  곡류천: [
    { name: '공격사면 하식애 (Cut Bank)', description: '원심력으로 빠른 유속이 외벽을 강타하여 깎아낸 수직 절벽', position: [2.8, 2.4, -2.6] },
    { name: '활주사면 포인트바 (Point Bar)', description: '유속이 느린 안쪽에 모래와 고운 자갈이 초승달 모양으로 퇴적된 둔덕', position: [-1.2, 0.65, -1.8] },
    { name: '단절된 우각호 (Oxbow Lake)', description: '홍수 시 곡류 목이 절단되어 본류와 분리된 소뿔 모양 쇠뿔호수', position: [-3.5, 0.6, 2.8] },
    { name: '곡류 절단목 (Neck)', description: '두 곡류 고리가 가장 근접하여 홍수 때 물길이 직강화된 지점', position: [-0.8, 1.2, 1.2] },
  ],
  범람원: [
    { name: '사행 본류 수로 (Meander Channel)', description: '낮은 평야를 유유히 굽이쳐 흐르는 충적 하천 본류', position: [0, 0.42, 0] },
    { name: '자연제방 (Natural Levee)', description: '홍수 시 넘친 거친 모래가 하천 양안에 둑처럼 쌓인 미기복 둔덕', position: [1.8, 1.45, -1.6] },
    { name: '배후습지 (Backswamp)', description: '자연제방 뒤편 배수가 원활하지 않아 점토질 물이 고인 습지/논', position: [4.5, 0.75, 2.2] },
    { name: '제방 취락 및 도로선', description: '홍수 침수를 피해 자연제방의 높은 둔덕을 따라 형성된 마을 터', position: [-1.8, 1.4, 2.5] },
  ],
  삼각주: [
    { name: '분류 하천망 (Distributaries)', description: '하구에서 경사가 완만해져 부채꼴로 여러 갈래 나뉘는 물길', position: [0, 0.5, -3.0] },
    { name: '삼각주 하중도 (델타 평야)', description: '미세 실트와 점토가 퇴적되어 만든 비옥한 삼각형 섬 평야', position: [2.0, 0.82, 1.6] },
    { name: '하구 사주 및 조간대', description: '바다 파도와 하천 토사가 충돌하며 성장하는 전면 모래톱', position: [0, 0.32, 5.0] },
    { name: '조석 혼합 하구역', description: '강물과 바닷물이 뒤섞이며 풍부한 영양염류가 침전되는 기수역', position: [-3.8, 0.4, 3.5] },
  ],
  하안단구: [
    { name: '고위 단구면 (3차 단구)', description: '가장 오래전 강바닥이었으나 지반 융기로 가장 높이 솟은 옛 평탄면', position: [4.2, 3.8, -1.5] },
    { name: '중위 단구면 (2차 단구)', description: '계단 중간층에 형성된 과거 하천 범람원 평지 (마을/농경지)', position: [2.4, 2.4, 1.2] },
    { name: '단구애 (Terrace Scarp 절벽)', description: '하천의 하각 침식으로 단구면 사이를 깎아지른 계단식 수직 절벽', position: [1.4, 1.6, -1.8] },
    { name: '현재 감입 협곡 & 하천', description: '융기된 지형을 깊게 파고들며 흐르는 현재의 청정 강줄기', position: [-1.2, 0.45, 0] },
  ],
  폭포: [
    { name: '낙하 절벽 (폭포 단애면)', description: '단단한 상부 암석층을 뚫고 수직으로 쏟아지는 낙하 지점', position: [0, 4.2, -1.8] },
    { name: '깊은 폭호 (Plunge Pool)', description: '수직 낙하하는 엄청난 수압이 바닥 암반을 둥글게 파낸 깊은 웅덩이', position: [0, 0.48, 0.6] },
    { name: '두부침식 후퇴 협곡', description: '폭포 하부가 깎여 무너지며 상류 방향으로 후퇴해 남긴 협곡', position: [0, 1.6, 3.8] },
    { name: '연약 하부 지층 와포', description: '물보라 풍화로 안쪽으로 파고든 오버행 동굴 구조', position: [0, 1.8, -1.4] },
  ],
  석회동굴: [
    { name: '동굴 입구 거대 천연 아치', description: '석회암 지하 공동으로 통하는 웅장한 카르스트 입구 포털', position: [0, 1.8, 0] },
    { name: '지표 카렌 (Karren 능선)', description: '빗물의 용식 작용으로 뾰족하게 깎여 드러난 지표 석회암 바위', position: [3.8, 3.6, -2.8] },
    { name: '종유석 & 석순 (동굴 생성물)', description: '천장에서 떨어지는 탄산칼슘 지하수가 침전되어 자란 돌기둥', position: [0, 0.8, 0.5] },
    { name: '지하 함몰 싱크홀', description: '동굴 천장이 얇아져 지표면에서 깔때기 모양으로 꺼진 수직 구멍', position: [-3.5, 1.8, 2.2] },
  ],
  돌리네: [
    { name: '깔때기형 돌리네 와지', description: '석회암 수직 절리를 따라 빗물이 녹여 만든 접시형 함몰 분지', position: [0, 1.2, 0] },
    { name: '테라로사 (Terra Rossa) 적색토', description: '석회암 탄산염이 녹고 남은 불용성 산화철 적색 점토 풍화토', position: [2.5, 2.1, 1.6] },
    { name: '배수 싱크홀 (포노르/Ponor)', description: '돌리네 바닥에서 지하 동굴 수계로 빗물이 순식간에 빠지는 구멍', position: [0, 0.75, -0.2] },
    { name: '복합 우발라 (Uvala) 능선', description: '여러 돌리네가 침식 확장되며 하나로 합쳐진 거대 복합 함몰지 경계', position: [-4.2, 3.2, 3.2] },
  ],
  '탑 카르스트': [
    { name: '수직 석회암 봉림 (Tower Karst)', description: '열대 습윤 기후의 강렬한 용식으로 평원 위에 솟은 독립 바위탑', position: [0, 5.2, 0] },
    { name: '기저부 해식와/풍화 노치', description: '지표수와 접촉한 기둥 밑둥이 잘록하게 파고든 용식홈', position: [1.3, 1.2, 0.6] },
    { name: '에메랄드 카르스트 수면/평원', description: '용식 잔류탑 사이를 평평하게 가로지르는 고요한 수면', position: [-2.8, 0.52, 2.8] },
    { name: '암벽 자생 카르스트 식생', description: '흙이 없는 수직 석회암 틈새에 뿌리를 내린 아열대 식물군', position: [0, 4.4, 0.8] },
  ],
  카렌: [
    { name: '석회암 침봉 숲 (Pinnacles)', description: '빗물이 빗살무늬로 바위를 조각하여 만든 칼날 같은 석회암 숲', position: [0, 4.0, 0] },
    { name: '용식 구곡 (Rinnen 고랑)', description: '빗물이 바위 표면을 타고 흘러내리며 깊게 판 매끄러운 수직 홈', position: [2.6, 2.4, -1.9] },
    { name: '테라로사 붉은 점토 토양', description: '침봉 사이 갈라진 틈새 바닥을 가득 채운 산화철 붉은 흙', position: [-3.0, 1.2, 2.4] },
    { name: '용식 잔류암 두부', description: '풍화에 저항하여 뾰족하게 솟아오른 기둥 꼭대기 모서리', position: [3.8, 3.5, 3.0] },
  ],
  U자곡: [
    { name: '평탄한 U자곡 바닥 (Glacial Trough)', description: '거대한 빙하 혀가 바닥을 평평하게 대패질하여 만든 넓은 골짜기', position: [0, 0.65, 0] },
    { name: '수직 빙식곡 암벽 (Trough Wall)', description: '빙하의 강력한 찰과 작용으로 깎여나간 수천 미터 수직 화강암 벽', position: [-4.5, 4.4, 0] },
    { name: '현곡 (Hanging Valley) 폭포', description: '본류 빙하보다 침식 속도가 느려 높은 공중에 매달린 지류 계곡', position: [4.2, 3.6, -2.2] },
    { name: '양배암 (Roche Moutonnée)', description: '빙하가 넘어가며 앞쪽은 매끄럽고 뒤쪽은 뜯어낸 비대칭 암반 둔덕', position: [0.8, 0.85, 2.8] },
  ],
  피오르드: [
    { name: '침수된 피오르드 해만', description: '빙하기 U자곡에 후빙기 해수면이 상승하며 수백 미터 깊이로 찬 바다', position: [0, 0.72, 0] },
    { name: '1,000m급 수직 단애벽', description: '바다에서 곧바로 하늘을 찌르듯 치솟아 오른 웅장한 협곡 거벽', position: [-4.2, 4.6, 0] },
    { name: '만년설 고원 연봉', description: '협곡 꼭대기 사계절 내내 하얗게 빛나는 빙하 설원 고원지대', position: [4.8, 5.0, -3.8] },
    { name: '직포식 피오르드 폭포', description: '눈 녹은 물이 수백 미터 절벽에서 바다로 직접 수직 낙하하는 폭포', position: [3.8, 2.6, 1.8] },
  ],
  혼: [
    { name: '피라미드형 호른 첨두 (Horn Peak)', description: '3~4개 방향의 빙하 권곡이 사면을 갉아먹어 만든 삼각뿔 암봉', position: [0, 5.4, 0] },
    { name: '칼날 능선 아레트 (Arête)', description: '양쪽 빙식곡 사이가 얇게 깎여 칼날처럼 날카로운 산등성이', position: [-2.6, 3.6, -2.2] },
    { name: '빙식 권곡 (카르 / Cirque)', description: '빙하가 태동하여 둥글게 파낸 안락의자 모양의 반원형 분지', position: [2.6, 2.0, 2.6] },
    { name: '빙하 베르크슈룬트 (Bergschrund)', description: '움직이는 빙하와 산벽 얼음 사이에 갈라진 거대한 크레바스 균열대', position: [1.2, 3.8, -2.0] },
  ],
  권곡: [
    { name: '안락의자형 권곡 와지', description: '고산 만년설과 빙하의 태동부가 사면을 둥글게 파낸 반원형 분지', position: [0, 1.6, 0] },
    { name: '타른 (Tarn / 권곡호)', description: '빙하가 녹아 물러난 권곡 바닥 와지에 차오른 에메랄드빛 산정 호수', position: [0, 1.15, 0.8] },
    { name: '수직 권곡 두벽 (Headwall)', description: '빙하의 동결파쇄와 찰과로 형성된 깎아지른 3면 병풍 암벽', position: [0, 5.0, -3.6] },
    { name: '암석 문턱 (Rock Lip)', description: '권곡 바닥과 하류 U자곡을 구분하는 단단한 기반암 턱 능선', position: [0, 1.8, 3.5] },
  ],
  모레인: [
    { name: '말단 종퇴석 (Terminal Moraine)', description: '빙하가 밀고 내려오다 녹아 후퇴하며 끝자락에 둑처럼 쌓은 흙돌 언덕', position: [0, 2.3, 2.2] },
    { name: '빙하언색호 (모레인 댐 호수)', description: '종퇴석 둑이 빙하 녹은 옥빛 물을 가두어 형성된 빙하 호수', position: [0, 1.25, -1.2] },
    { name: '측퇴석 (Lateral Moraine)', description: '계곡 양쪽 가장자리를 따라 길게 뻗은 빙하 쇄설물 능선', position: [-4.0, 3.2, -2.8] },
    { name: '빙퇴석 찰흔 표석 (Glacial Erratics)', description: '빙하에 실려 먼 곳에서 운반되어 모레인 위에 얹힌 거대 암석', position: [2.2, 1.8, 3.2] },
  ],
  사막: [
    { name: '초승달 사구 (바르한 / Barchan)', description: '일정한 바람 방향을 따라 양 끝 뿔이 앞으로 뻗은 모래언덕', position: [0, 3.0, 0] },
    { name: '풍하측 슬립페이스 (급경사면)', description: '모래가 무너져 내리며 안식각(34도)을 유지하는 급경사 비탈', position: [1.3, 1.9, 0.9] },
    { name: '풍상측 완경사면 & 연흔', description: '바람이 불어오는 쪽에 형성된 질서정연한 물결무늬 모래 주름', position: [-3.6, 1.3, -2.6] },
    { name: '사구간 저지대 (사막 포장)', description: '모래가 날아가고 단단한 암석 자갈만 남은 편평한 사막 바닥', position: [4.2, 0.5, -4.0] },
  ],
  버섯바위: [
    { name: '저항성 캡록 (모자바위)', description: '상부의 단단한 암석층이 침식을 덜 받아 모자처럼 남은 상판', position: [0, 4.5, 0] },
    { name: '모래바람 마식 목 (Pedestal)', description: '지표 1m 부근 모래알 도약(Saltation) 마모로 심하게 잘록해진 기둥', position: [0, 2.3, 0] },
    { name: '풍식 자갈 대지 (Desert Pavement)', description: '미세 토사는 바람에 날아가고 굵은 자갈만 남은 단단한 사막 바닥', position: [-3.6, 0.6, 2.6] },
    { name: '풍식 삼릉석 (Ventifacts)', description: '바람에 실린 모래에 깎여 모서리가 날카롭게 각진 자갈들', position: [3.8, 0.7, -3.0] },
  ],
  '메사·뷰트': [
    { name: '메사 평탄 정상면 (Tableland)', description: '수평 지층의 단단한 캡록이 침식을 방어하여 형성된 광활한 테이블 고원', position: [-2.4, 4.6, -1.0] },
    { name: '고립된 바위 탑 (뷰트 / Butte)', description: '메사가 침식되어 더 작고 뾰족하게 분리된 독립 바위 첨탑', position: [4.4, 4.0, 2.2] },
    { name: '기저부 탤러스 (Talus) 사면', description: '절벽에서 떨어져 나온 풍화 암석 조각들이 쌓인 45도 너덜 비탈', position: [-2.4, 1.6, 1.8] },
    { name: '수평 적색 사암 층리', description: '붉은 철 성분을 품은 사암과 셰일이 수평으로 쌓인 지질 띠', position: [4.4, 2.4, 2.2] },
  ],
  와디: [
    { name: '건천 자갈 하상 (Dry Bed)', description: '평소에는 물이 전혀 없으나 폭우 시 급류가 쏟아지는 자갈 바닥', position: [0, 0.55, 0] },
    { name: '붉은 사암 슬롯 캐니언', description: '돌발 홍수가 깎아지른 수직 협곡으로 깊게 파낸 좁은 단애벽', position: [-2.8, 4.0, 0] },
    { name: '돌발홍수 (Flash Flood) 침식홈', description: '급류에 소용돌이치는 자갈이 바위벽에 조각한 유선형 물길 홈', position: [2.2, 1.8, -1.5] },
    { name: '상부 건조 사암 고원', description: '식생이 거의 없이 황량하게 펼쳐진 황토빛 사암 대지', position: [5.0, 3.8, 3.0] },
  ],
  오아시스: [
    { name: '오아시스 천연 용천 수면', description: '사구 사이 깊은 바람 파임 와지가 지하수면과 만나 솟아난 샘', position: [0, 0.62, 0] },
    { name: '대추야자 녹색 식생 띠', description: '수분을 머금은 오아시스 주변에 둥글게 번성하는 야자수 숲', position: [1.6, 1.25, 0.8] },
    { name: '포위 거대 사구 고원', description: '오아시스를 모래바람으로부터 병풍처럼 둘러싼 웅장한 모래언덕', position: [-4.2, 3.5, -3.6] },
    { name: '사구 바람 능선', description: '바람에 실려 온 고운 모래가 능선을 따라 흘러내리는 경계', position: [4.0, 3.0, 3.8] },
  ],
  플라야: [
    { name: '육각형 소금 다각형 (Polygons)', description: '소금물이 증발하며 염류가 수축·팽창해 만든 기하학적 벌집선', position: [0, 0.32, 0] },
    { name: '초평탄 암염 증발판', description: '수평선 끝까지 오차 없이 완벽한 수평을 이루는 순백의 소금 침전층', position: [3.6, 0.22, -3.2] },
    { name: '천연 거울 염수면 (우기)', description: '우기에 얕은 물이 고여 하늘과 구름을 완벽히 반사하는 거울 수면', position: [-2.6, 0.26, 2.6] },
    { name: '증발잔류암 결정체 (Halite)', description: '물속에서 과포화된 소금 결정이 사각 큐브 형태로 자란 광물층', position: [1.5, 0.3, 3.5] },
  ],
};

// Map aliases so all variants match seamlessly
TERRAIN_ANNOTATIONS['기생화산 (오름)'] = TERRAIN_ANNOTATIONS['기생화산'];
TERRAIN_ANNOTATIONS['오름'] = TERRAIN_ANNOTATIONS['기생화산'];
TERRAIN_ANNOTATIONS['해식애 (해안 절벽)'] = TERRAIN_ANNOTATIONS['해식애'];
TERRAIN_ANNOTATIONS['시스택 (바위섬)'] = TERRAIN_ANNOTATIONS['시스택'];
TERRAIN_ANNOTATIONS['사주'] = TERRAIN_ANNOTATIONS['사주·사취'];
TERRAIN_ANNOTATIONS['혼 (호른)'] = TERRAIN_ANNOTATIONS['혼'];
TERRAIN_ANNOTATIONS['모레in'] = TERRAIN_ANNOTATIONS['모레인'];
