import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Eye, RotateCw, Grid, Layers, MapPin, Sparkles, Maximize2 } from 'lucide-react';
import { TerrainAnnotation } from '../types';

// ==========================================
// Math & Procedural Noise Helpers
// ==========================================
const random = (x: number, y: number) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
};

const noise = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);
  const a = random(ix, iy);
  const b = random(ix + 1, iy);
  const c = random(ix, iy + 1);
  const d = random(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy * (1.0 - ux) + (d - b) * ux * uy;
};

const fbm = (x: number, y: number, octaves = 5) => {
  let v = 0;
  let a = 0.5;
  let shift = 100.0;
  for (let i = 0; i < octaves; i++) {
    v += a * noise(x, y);
    x = x * 2.0 + shift;
    y = y * 2.0 + shift;
    a *= 0.5;
  }
  return v;
};

const warpedFbm = (x: number, y: number, octaves = 4) => {
  const wx = fbm(x + 1.7, y + 9.2, 3);
  const wy = fbm(x + 8.3, y + 2.8, 3);
  return fbm(x + 3.0 * wx, y + 3.0 * wy, octaves);
};

const hexVoronoi = (x: number, y: number) => {
  const hx = x * (2.0 / Math.sqrt(3));
  const hy = y;
  const ix = Math.floor(hx);
  const iy = Math.floor(hy);
  let minDist = 10.0;
  let cellId = 0;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const px = ix + i;
      const py = iy + j;
      const jx = px + random(px, py) * 0.15;
      const jy = py + random(px + 7.1, py + 3.4) * 0.15;
      const dx = hx - jx;
      const dy = hy - jy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) {
        minDist = d;
        cellId = random(px * 13, py * 37);
      }
    }
  }
  return { dist: minDist, cellId };
};

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

const mixColor = (c1: string, c2: string, t: number) => {
  const color1 = new THREE.Color(c1);
  const color2 = new THREE.Color(c2);
  color1.lerp(color2, clamp(t, 0, 1));
  return color1;
};

// Normalize terrain name and resolve to canonical 3D terrain archetype
export const normalizeTerrainName = (name: string): string => {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
};

export const resolveTerrainKey = (name: string): string => {
  const norm = normalizeTerrainName(name);
  if (norm.includes('오름') || norm.includes('기생화산')) return '기생화산';
  if (norm.includes('사주') || norm.includes('사취')) return '사주·사취';
  if (norm.includes('석호')) return '석호';
  if (norm.includes('파식대')) return '파식대';
  if (norm.includes('해식애')) return '해식애';
  if (norm.includes('시스택')) return '시스택';
  if (norm.includes('사구')) return '해안 사구';
  if (norm.includes('감입곡류') || norm.includes('곡류')) return '곡류천';
  if (norm.includes('범람원')) return '범람원';
  if (norm.includes('선상지')) return '선상지';
  if (norm.includes('삼각주')) return '삼각주';
  if (norm.includes('하안단구')) return '하안단구';
  if (norm.includes('폭포')) return '폭포';
  if (norm.includes('석회동굴')) return '석회동굴';
  if (norm.includes('돌리네')) return '돌리네';
  if (norm.includes('카렌')) return '카렌';
  if (norm.includes('탑 카르스트') || norm.includes('탑카르스트')) return '탑 카르스트';
  if (norm.includes('U자곡') || norm.includes('유자곡')) return 'U자곡';
  if (norm.includes('피오르드')) return '피오르드';
  if (norm.includes('혼') || norm.includes('호른')) return '혼';
  if (norm.includes('권곡') || norm.includes('카르')) return '권곡';
  if (norm.includes('모레인') || norm.includes('빙퇴석')) return '모레인';
  if (norm.includes('메사') || norm.includes('뷰트')) return '메사·뷰트';
  if (norm.includes('와디')) return '와디';
  if (norm.includes('버섯바위')) return '버섯바위';
  if (norm.includes('오아시스')) return '오아시스';
  if (norm.includes('플라야')) return '플라야';
  if (norm.includes('사막')) return '사막';
  if (norm.includes('주상절리')) return '주상절리';
  if (norm.includes('용암동굴')) return '용암동굴';
  if (norm.includes('칼데라')) return '칼데라';
  if (norm.includes('단층 산맥') || norm.includes('단층')) return '단층 산맥';
  if (norm.includes('갯벌')) return '갯벌';
  if (norm.includes('화산')) return '화산';
  return norm;
};

// ==========================================
// Annotations Data for Each Terrain Type
// ==========================================
export const TERRAIN_ANNOTATIONS: Record<string, TerrainAnnotation[]> = {
  화산: [
    { name: '정상 화구 & 용암호', description: '화산가스와 마그마가 솟구치는 화구 중심', position: [0, 4.2, 0] },
    { name: '기생화산 (오름)', description: '화산 사면의 균열을 통해 분출한 분석구', position: [4.5, 2.3, 2.0] },
    { name: '용암류 협곡', description: '용암이 경사면을 따라 흘러내리며 굳은 골짜기', position: [-2.5, 1.5, -3.5] },
  ],
  기생화산: [
    { name: '분화구 림 (Rim)', description: '스코리아가 비오듯 쏟아져 쌓인 30도 안식각 화구벽 능선', position: [0, 3.8, -1.8] },
    { name: '산정 화구호 (분화구 습지)', description: '화구 바닥 불투수 점토층에 빗물이 고인 신비로운 천연 못', position: [0, 1.8, 0] },
    { name: '말굽형 터진 용암 유출부', description: '화산체 기저부 약한 틈새로 용암류가 흘러나오며 무너진 사면', position: [2.8, 2.0, 1.8] },
  ],
  칼데라: [
    { name: '외륜산 절벽', description: '마그마방 함몰로 형성된 칼데라 테두리 산벽', position: [0, 4.5, -5.5] },
    { name: '칼데라 호수', description: '함몰 분지에 빗물과 지하수가 차오른 호면', position: [-1.5, 1.4, 0] },
    { name: '중앙화구구 (알봉/용암돔)', description: '칼데라 형성 후 2차 분출로 솟아난 화산체', position: [1.8, 2.4, 0.8] },
  ],
  주상절리: [
    { name: '육각형 주상절리 기둥', description: '고온 용암의 급냉 수축으로 갈라진 다각형 돌기둥', position: [2.5, 3.8, 0] },
    { name: '계단상 냉각면', description: '파도에 깎이며 형성된 다층 계단식 절리 단면', position: [0.5, 2.2, 2.5] },
    { name: '파식 해안선', description: '거센 파도가 주상절리 하부를 때리는 조간대', position: [-3.5, 0.9, -1.0] },
  ],
  용암동굴: [
    { name: '용암동굴 함몰구 (천창)', description: '용암튜브 상부 천장이 붕괴되어 내부가 드러난 개구부', position: [0, 1.2, 0] },
    { name: '천연 현무암 아치교', description: '동굴 천장이 무너지지 않고 다리처럼 남은 구간', position: [0, 2.4, 2.8] },
    { name: '파호이호이 용암지표', description: '새끼줄 꼬인 모양의 매끄러운 밧줄 용암 표면', position: [-4.0, 2.2, -2.5] },
  ],
  '단층 산맥': [
    { name: '수직 단층애 (단층 절벽)', description: '지각 인장 변위로 형성된 sheer vertical fault scarp', position: [-0.5, 4.2, 0] },
    { name: '완경사 사면 (경동지괴)', description: '반대편으로 완만하게 기울어진 산맥의 등판', position: [4.5, 2.5, 0] },
    { name: '단층 지구 분지', description: '단층선 아래로 꺼져 내려앉은 저지대 평야', position: [-5.0, 0.6, 0] },
  ],
  갯벌: [
    { name: '수지상 갯골 (조류수로)', description: '밀물과 썰물이 드나들며 미세 펄을 파낸 S자 물길', position: [0, 0.4, 0] },
    { name: '조간대 펄갯벌', description: '미립질 점토와 유기물이 두껍게 퇴적된 평탄지', position: [3.5, 0.6, -3.0] },
    { name: '상부 염습지 전이대', description: '칠면초와 갈대가 모래와 펄을 붙잡아두는 경계', position: [5.5, 0.9, 4.0] },
  ],
  해식애: [
    { name: '수직 해식애', description: '파도의 침식 작용으로 형성된 깎아지른 수직 바위 절벽', position: [0, 3.8, -1.5] },
    { name: '평탄한 파식대', description: '절벽이 후퇴하면서 파도에 깎여 바다 밑에 평평하게 남은 암반', position: [-3.5, 0.4, 1.5] },
    { name: '해식동 노치 (Notch)', description: '절벽 기저부 연약부가 파도에 뚫려 형성된 동굴', position: [1.2, 0.7, -0.5] },
  ],
  시스택: [
    { name: '독립 시스택 기둥', description: '해식아치가 무너져 본토와 완전히 분리된 외딴 바위탑', position: [2.5, 3.6, -1.0] },
    { name: '해식아치 (천연교)', description: '바다로 뻗은 곶의 양쪽이 파도에 뚫려 연결된 아치', position: [-2.5, 2.8, 1.5] },
    { name: '후퇴하는 해안 곶', description: '파도의 집중 공격을 받는 돌출된 해식애 지형', position: [-4.5, 3.2, -3.5] },
  ],
  '해안 사구': [
    { name: '주사구 칼날 능선', description: '바람이 불어가는 쪽에 형성된 가파른 슬립페이스 경계', position: [0, 2.8, 0] },
    { name: '풍성 연흔 (물결무늬)', description: '모래알이 바람결을 따라 춤추며 남긴 미세 주름', position: [-3.5, 1.2, -2.5] },
    { name: '사구 배후 습지 (두웅습지)', description: '모래언덕 뒤편 담수가 고여 형성된 독특한 사구습지', position: [4.5, 0.8, 2.5] },
  ],
  '사주·사취': [
    { name: '만곡 사취 갈고리 (Hook Spit)', description: '연안류와 파랑 굴절에 의해 안쪽으로 휜 모래톱 선단', position: [4.2, 1.2, 2.5] },
    { name: '사주 둑길 (Barrier)', description: '외해 파도를 가로막고 만을 폐쇄해 나가는 모래 띠', position: [0, 0.9, 0] },
    { name: '배후 정온 수역 (만입)', description: '사취 뒤편 파도가 잦아들어 안전한 천연 항만 구역', position: [-3.2, 0.5, 2.0] },
  ],
  석호: [
    { name: '금빛 모래 사주 (Barrier)', description: '외해 바다를 가로막아 내해를 호수로 만든 긴 모래톱', position: [-2.5, 1.3, 0] },
    { name: '천연 기수호 수면', description: '담수와 해수가 만나 풍요로운 생태계를 품은 잔잔한 석호', position: [1.5, 0.6, 0] },
    { name: '하구 갯트임 (Inlet)', description: '폭풍이나 밀물 때 바닷물이 석호로 교환되는 통로', position: [-2.5, 0.4, -4.5] },
  ],
  파식대: [
    { name: '수평 암반 파식대', description: '간조(썰물) 때 넓게 드러나는 평평하게 깎인 퇴적암 바위 바닥', position: [-1.5, 0.7, 0] },
    { name: '조수 웅덩이 (Tide Pool)', description: '파식대 홈에 바닷물이 고여 해양 생물들이 서식하는 웅덩이', position: [-3.5, 0.5, 2.2] },
    { name: '퇴적암 책장 해식애', description: '수만 권의 책을 차곡차곡 쌓아 올린 듯한 수직 층리 단애벽', position: [3.8, 4.2, 0] },
  ],
  선상지: [
    { name: '선정 (Apex)', description: '급류 계곡이 평지로 터져나오며 거력이 퇴적되는 입구', position: [0, 3.8, -4.5] },
    { name: '선앙 복류대 (Mid-fan)', description: '자갈층 사이로 하천수가 스며들어 밭농사가 발달한 사면', position: [1.5, 2.0, 0] },
    { name: '선단 용천대 (Fan toe)', description: '지하로 스며들었던 복류수가 다시 솟아 논농사를 짓는 외곽', position: [0, 0.6, 4.5] },
  ],
  곡류천: [
    { name: '공격사면 하식애 (Cut Bank)', description: '원심력으로 빠른 물살이 외벽을 쳐서 깎아낸 수직 절벽', position: [2.5, 2.2, -2.5] },
    { name: '활주사면 포인트바 (Point Bar)', description: '유속이 느린 안쪽에 모래와 자갈이 퇴적된 백사장', position: [-1.2, 0.6, -1.8] },
    { name: '단절된 우각호 (Oxbow Lake)', description: '홍수 때 곡류 목이 끊어지며 남은 소뿔 모양의 쇠뿔호수', position: [-3.2, 0.6, 2.5] },
  ],
  범람원: [
    { name: '미앤더 사행 하천', description: '낮은 구배의 충적 평야를 굽이쳐 흐르는 본류 물길', position: [0, 0.4, 0] },
    { name: '자연제방 (Natural Levee)', description: '홍수 시 거친 토사가 하천 양안에 쌓여 살짝 솟은 둑', position: [1.6, 1.4, -1.5] },
    { name: '배후습지 (Backswamp)', description: '제방 뒤편 배수가 원활하지 않아 형성된 비옥한 저습지', position: [4.2, 0.7, 2.0] },
  ],
  삼각주: [
    { name: '분류 하천망 (Distributaries)', description: '하구에서 유속이 느려져 여러 갈래로 갈라지는 물길', position: [0, 0.6, -2.5] },
    { name: '삼각주 하중도 (습지 평야)', description: '미세 실트와 점토가 쌓여 만든 비옥한 삼각형 삼각주 섬', position: [1.8, 0.8, 1.5] },
    { name: '하구 사주 및 조간대', description: '바다 파도와 하천 토사가 만나 쌓이는 전면 모래톱', position: [0, 0.3, 4.5] },
  ],
  하안단구: [
    { name: '고위 단구면 (3차 단구)', description: '가장 오래전 강바닥이었으나 지반 융기로 높이 솟은 평탄면', position: [4.0, 3.6, -1.5] },
    { name: '중위 단구면 (2차 단구)', description: '계단 중간층에 형성된 과거 범람원 평지 마을터', position: [2.2, 2.2, 1.0] },
    { name: '하식 협곡 & 현재 하천', description: '계단식 절벽을 깊게 깎으며 흐르는 현재의 강줄기', position: [-1.0, 0.5, 0] },
  ],
  폭포: [
    { name: '낙하 절벽 (폭포 단애)', description: '단단한 상부 암석층을 뚫고 수직으로 쏟아지는 낙하 지점', position: [0, 3.8, -1.8] },
    { name: '깊은 폭호 (Plunge Pool)', description: '낙하하는 거센 물줄기가 바닥을 깊이 파내어 만든 원형 소', position: [0, 0.5, 0.5] },
    { name: '두부침식 후퇴 협곡', description: '폭포가 상류 방향으로 후퇴하며 남긴 깎아지른 암석 협곡', position: [0, 1.5, 3.5] },
  ],
  석회동굴: [
    { name: '지표 카렌 (Karren)', description: '빗물에 석회암이 씻겨 나가며 형성된 뾰족한 암석 능선', position: [3.5, 3.4, -2.5] },
    { name: '동굴 입구 천연 아치', description: '석회암층 내부 거대 지하 공동으로 통하는 동굴 아치', position: [0, 1.8, 0] },
    { name: '지하 함몰 싱크홀', description: '지하 동굴 천장이 약해져 지표에서 깔때기형으로 꺼진 구멍', position: [-3.2, 1.6, 2.0] },
  ],
  돌리네: [
    { name: '깔때기형 돌리네 와지', description: '석회암 절리를 따라 빗물이 녹여 만든 둥근 접시형 함몰지', position: [0, 1.2, 0] },
    { name: '테라로사 적색 토양', description: '석회암이 용식되고 남은 불용성 산화철 적색 점토층', position: [2.2, 2.0, 1.5] },
    { name: '배수 싱크홀 (포노르)', description: '돌리네 바닥에서 지하 동굴 수계로 빗물이 빠지는 배수구', position: [0, 0.8, -0.2] },
  ],
  '탑 카르스트': [
    { name: '수직 석회암 봉림 (Tower Karst)', description: '열대 습윤 용식 작용으로 평원 위에 홀로 우뚝 선 석회암 탑', position: [0, 4.8, 0] },
    { name: '봉우리 기저부 해식와/풍화홈', description: '물과 산성 토양에 접촉한 기둥 밑둥이 잘록하게 파인 홈', position: [1.2, 1.4, 0.5] },
    { name: '수평 침식 평원', description: '석회암 기둥 사이를 흐르는 잔잔한 카르스트 수면', position: [-2.5, 0.6, 2.5] },
  ],
  카렌: [
    { name: '석회암 침봉 숲 (Karren Pinnacles)', description: '빗물의 용식 작용으로 뾰족하게 깎여 솟은 수직 석회암 기둥', position: [0, 3.8, 0] },
    { name: '용식 구곡 (Rinnen)', description: '빗물이 바위 표면을 타고 흘러내리며 조각한 매끄러운 고랑 홈', position: [2.5, 2.2, -1.8] },
    { name: '테라로사 붉은 점토', description: '석회암의 탄산염이 녹고 남은 불용성 산화철 적색 풍화토', position: [-2.8, 1.2, 2.2] },
  ],
  U자곡: [
    { name: '평탄한 U자곡 바닥', description: '빙하 혀가 바닥을 넓고 평평하게 밀어내어 형성된 바닥면', position: [0, 0.6, 0] },
    { name: '수직 빙식곡 암벽', description: '빙하의 강력한 찰과 작용으로 깎인 1,000m급 화강암 거벽', position: [-4.2, 4.2, 0] },
    { name: '현곡 (Hanging Valley) 폭포', description: '본류 빙하보다 덜 깎여 공중에 매달린 지류 계곡과 폭포', position: [4.0, 3.5, -2.0] },
  ],
  피오르드: [
    { name: '침수된 피오르드 해만', description: '빙하기 U자곡에 후빙기 바닷물이 수백 미터 깊이로 밀려든 만', position: [0, 0.8, 0] },
    { name: '1,000m 수직 단애벽', description: '바다에서 곧바로 수직으로 치솟아 오른 장엄한 협곡 암벽', position: [-4.0, 4.5, 0] },
    { name: '만년설 빙식 연봉', description: '피오르드 절벽 꼭대기에 사계절 내내 하얗게 빛나는 빙하 설원', position: [4.5, 4.8, -3.5] },
  ],
  혼: [
    { name: '피라미드형 호른 첨두', description: '3~4개 방향의 빙하 권곡이 사면을 갉아먹어 만든 뾰족한 바위산', position: [0, 5.2, 0] },
    { name: '칼날 능선 아레트 (Arête)', description: '이웃한 두 빙식곡 사이가 얇게 깎여 칼날처럼 날카로운 산등성이', position: [-2.5, 3.4, -2.0] },
    { name: '빙식 권곡 (카르 / Cirque)', description: '빙하가 태동하여 둥글게 파낸 안락의자 모양의 원형 와지', position: [2.5, 1.8, 2.5] },
  ],
  권곡: [
    { name: '안락의자형 권곡 와지', description: '고산 만년설과 빙하의 태동부가 사면을 둥글게 파낸 반원형 분지', position: [0, 1.6, 0] },
    { name: '타른 (Tarn / 권곡호)', description: '빙하가 녹아 물러난 권곡 바닥 와지에 차오른 옥빛 산정 호수', position: [0, 1.2, 0.8] },
    { name: '수직 권곡 두벽 (Headwall)', description: '빙하의 동결파쇄와 찰과로 형성된 깎아지른 3면 암벽', position: [0, 4.8, -3.5] },
  ],
  모레in: [
    { name: '말단 종퇴석 (Terminal Moraine)', description: '빙하가 후퇴하며 말단부에 불도저처럼 밀어 쌓아둔 흙돌 둔덕', position: [0, 2.2, 2.0] },
    { name: '빙하언색호 (모레인 댐 호수)', description: '종퇴석 둑이 빙하 녹은 에메랄드빛 물을 가두어 만든 호수', position: [0, 1.4, -1.0] },
    { name: '측퇴석 (Lateral Moraine)', description: '계곡 양쪽 가장자리를 따라 길게 뻗은 빙하 쇄설물 능선', position: [-3.8, 3.0, -2.5] },
  ],
  사막: [
    { name: '초승달 사구 (바르한)', description: '일정한 바람 방향을 따라 양 끝 뿔이 앞으로 뻗은 모래언덕', position: [0, 2.8, 0] },
    { name: '풍하측 슬립페이스 (급경사)', description: '모래가 무너져 내리며 안식각(34도)을 유지하는 급경사면', position: [1.2, 1.8, 0.8] },
    { name: '모래 물결 (풍성 연흔)', description: '바람이 불어오는 완경사면에 질서정연하게 새겨진 모래 주름', position: [-3.5, 1.2, -2.5] },
  ],
  버섯바위: [
    { name: '저항성 캡록 (모자바위)', description: '상부의 단단한 암석층이 침식을 덜 받아 넓은 모자처럼 남은 형태', position: [0, 4.4, 0] },
    { name: '모래바람 마식 목 (Pedestal)', description: '지표 1m 부근 모래알 도약(Saltation) 마모로 잘록해진 기둥', position: [0, 2.2, 0] },
    { name: '풍식 자갈 대지', description: '모래는 바람에 날아가고 굵은 자갈만 남은 사막 포장(Desert Pavement)', position: [-3.5, 0.5, 2.5] },
  ],
  '메사·뷰트': [
    { name: '메사 평탄 정상면 (Tableland)', description: '수평 지층의 단단한 캡록이 침식을 방어하여 형성된 테이블 고원', position: [-2.2, 4.5, -1.0] },
    { name: '고립된 바위 탑 (뷰트 / Butte)', description: '메사가 침식되어 더 작고 뾰족하게 분리된 독립 바위 첨탑', position: [4.2, 3.8, 2.2] },
    { name: '기저부 탤러스 (Talus) 사면', description: '절벽에서 떨어져 나온 풍화 암석 조각들이 쌓인 45도 너덜 비탈', position: [-2.2, 1.5, 1.8] },
  ],
  와디: [
    { name: '건천 자갈 하상 (Dry Bed)', description: '평소에는 물이 전혀 없으나 폭우 시 급류가 쏟아지는 자갈 바닥', position: [0, 0.6, 0] },
    { name: '붉은 사암 슬롯 캐니언', description: '돌발 홍수가 깎아지른 수직 협곡으로 깊게 파낸 단애벽', position: [-2.8, 3.8, 0] },
    { name: '플래시 플러드 충적 부채꼴', description: '협곡 출구로 급류가 터져 나오며 토사가 쏟아진 퇴적체', position: [0, 1.0, 4.5] },
  ],
  오아시스: [
    { name: '오아시스 천연 수면', description: '사구 사이 깊은 바람 파임 와지가 지하수면과 만나 형성된 샘', position: [0, 0.6, 0] },
    { name: '야자수 녹색 식생 띠', description: '수분을 머금은 오아시스 주변에 번성하는 대추야자 숲', position: [1.5, 1.2, 0.8] },
    { name: '포위 사구 고원', description: '오아시스를 바람과 모래로부터 병풍처럼 감싸는 거대 모래언덕', position: [-4.0, 3.4, -3.5] },
  ],
  플라야: [
    { name: '육각형 소금 다각형 (Polygons)', description: '소금물이 증발하며 염류가 수축·팽창해 만든 기하학적 벌집선', position: [0, 0.3, 0] },
    { name: '초평탄 암염 증발판', description: '수평선 끝까지 완벽한 수평을 이루는 순백의 소금 침전층', position: [3.5, 0.2, -3.0] },
    { name: '천연 거울 염수면', description: '우기에 얕은 물이 고여 하늘과 구름을 완벽히 반사하는 거울 수면', position: [-2.5, 0.25, 2.5] },
  ],
};
// Alias mapping for moraine
TERRAIN_ANNOTATIONS['모레인'] = TERRAIN_ANNOTATIONS['모레in'];

// ==========================================
// Geometry Cache & Generator
// ==========================================
const GEOMETRY_CACHE: Record<string, THREE.BufferGeometry> = {};

export const generateTerrainGeometry = (category: string, subTerrain: string, reliefScale = 1.0) => {
  const normSub = resolveTerrainKey(subTerrain);
  const cacheKey = `${category}-${normSub}-${reliefScale.toFixed(2)}`;
  if (GEOMETRY_CACHE[cacheKey]) return GEOMETRY_CACHE[cacheKey];

  // High-res grid: 240x240 on 20x20 world units (balanced detail & 60fps performance)
  const size = 20;
  const segments = 240;
  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let h = 0;
    const d = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);

    // =====================================
    // 1. VOLCANIC
    // =====================================
    if (normSub === '기생화산') {
      // Classic Jeju Cinder Cone (Oreum) with 30-degree scoria slopes & circular summit crater lake
      const coneR = 7.5;
      const coneH = Math.max(0, 4.5 * (1.0 - Math.pow(d / coneR, 1.3)));
      
      // Deep crater bowl at the summit (금오름 / 다랑쉬오름 분화구)
      const craterR = 2.4;
      const craterDepth = d < craterR ? smoothstep(craterR, 0, d) * 2.8 : 0;
      
      // Horseshoe breach (말굽형 분화구 유출 틈새, 용암이 빠져나간 골짜기)
      const breachAngle = Math.atan2(y - 1.0, x - 2.5);
      const isBreach = Math.abs(breachAngle - 0.4) < 0.6 && d > 1.8 && d < 6.0;
      const breachCut = isBreach ? 1.2 * smoothstep(0.6, 0, Math.abs(breachAngle - 0.4)) : 0;
      
      // Subtle parasitic ripples & scoria scree
      const oreumRibs = Math.abs(Math.sin(angle * 5 + fbm(x * 0.5, y * 0.5) * 1.5)) * 0.25 * smoothstep(2.0, 6.5, d);
      
      h = Math.max(0.35, (coneH - craterDepth - breachCut + oreumRibs + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale);
      
      if (d < 1.0) {
        // Crater bottom wetland / crater lake bed (분화구 습지/화구호)
        color.set(mixColor('#1e4034', '#2d5e4d', fbm(x * 5, y * 5)));
      } else if (d < craterR + 0.5) {
        // Crater inner walls: dark red-brown scoria (송이석) and dark basalt
        color.set(mixColor('#5a3224', '#3d1e15', fbm(x * 6, y * 6)));
      } else if (h > 2.8 * reliefScale) {
        // Summit ridge: golden silver-grass (억새) & low shrubs
        color.set(mixColor('#7a8543', '#969950', fbm(x * 3, y * 3)));
      } else {
        // Slopes: green grassland (초원)
        color.set(mixColor('#385e2b', '#4c7a3a', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '화산') {
      // Elegant stratovolcano with exponential cone + summit crater
      const cone = 5.2 * Math.exp(-d * 0.32);
      const craterR = 1.8;
      const crater = d < craterR ? smoothstep(craterR, 0, d) * 2.6 : 0;
      
      // Radial barrancos (fluvial ravines carved on volcano flanks)
      const ribs = Math.abs(Math.sin(angle * 6 + fbm(x * 0.4, y * 0.4) * 2.0)) * 0.35 * smoothstep(1.5, 7.0, d);
      
      // Parasitic scoria cones (오름) on slopes
      const pc1 = Math.exp(-(Math.pow(x - 4.5, 2) + Math.pow(y - 2.0, 2)) * 0.8) * 1.5;
      const pc2 = Math.exp(-(Math.pow(x + 3.5, 2) + Math.pow(y + 3.0, 2)) * 1.0) * 1.2;

      h = (cone - crater + ribs + pc1 + pc2 + fbm(x * 1.5, y * 1.5, 3) * 0.25) * reliefScale;

      if (d < 1.4) {
        // Deep inside crater: black volcanic rock & sulfur vents
        color.set(mixColor('#1c0f0a', '#2c1208', fbm(x * 6, y * 6)));
      } else if (h > 3.8 * reliefScale) {
        // Summit volcanic ash & basalt
        color.set(mixColor('#382f28', '#25201b', fbm(x * 4, y * 4)));
      } else if (h > 1.8 * reliefScale) {
        // Mid-slope: sparse mountain vegetation & basalt scree
        color.set(mixColor('#4d5830', '#3b3226', fbm(x * 3, y * 3)));
      } else {
        // Base: lush sub-volcanic forest
        color.set(mixColor('#2d4722', '#3a5a2b', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '칼데라') {
      // Circular outer rim ridge with huge caldera basin inside
      const rimR = 6.0;
      const distToRim = Math.abs(d - rimR);
      const rimHeight = Math.exp(-Math.pow(distToRim / 1.5, 2)) * 4.4;
      
      let basin = 0;
      if (d < rimR) {
        // Sunken basin floor around height 0.6
        basin = 0.6 + Math.exp(-Math.pow(d / 4.0, 2)) * 0.3;
        // Central resurgent dome (중앙화구구, e.g. Wizard Island / 알봉)
        const island = Math.exp(-(Math.pow(x - 1.8, 2) + Math.pow(y - 0.8, 2)) * 1.2) * 2.2;
        h = (basin + island + fbm(x * 2, y * 2) * 0.2) * reliefScale;
      } else {
        // Outer flank gently sloping down
        h = (rimHeight * 0.8 * Math.exp(-(d - rimR) * 0.3) + fbm(x * 1.5, y * 1.5) * 0.4) * reliefScale;
      }
      h += (rimHeight * 0.9) * reliefScale;

      if (d < rimR - 1.0) {
        // Basin floor / resurgent island
        if (h > 1.5 * reliefScale) color.set(mixColor('#5c6b42', '#3e4a2c', fbm(x * 4, y * 4)));
        else color.set(mixColor('#142a38', '#1c3d52', fbm(x * 3, y * 3)));
      } else if (distToRim < 1.8) {
        // Steep rim rocky walls
        color.set(mixColor('#4a433d', '#615850', fbm(x * 5, y * 5)));
      } else {
        // Outer green forest slopes
        color.set(mixColor('#345428', '#456b35', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '주상절리') {
      // Stepped hexagonal basalt prism columns along a rugged coastline
      const { dist, cellId } = hexVoronoi(x * 1.6, y * 1.6);
      const jointGap = smoothstep(0.72, 0.95, dist);
      
      // Coastal edge dividing ocean and basalt plateau
      const coastX = fbm(y * 0.4, 0) * 1.5 - 1.0;
      
      if (x > coastX) {
        // Stepped quantized column height per cell!
        const quantizedH = 2.4 + cellId * 1.8;
        // Gap between columns creates distinct 3D hexagonal pillars
        h = (quantizedH - jointGap * 0.85 + fbm(x * 0.8, y * 0.8) * 0.2) * reliefScale;
        
        // Dark basalt texture with mineral reflections
        if (jointGap > 0.4) color.set(mixColor('#0d0e10', '#18191c', fbm(x * 8, y * 8)));
        else color.set(mixColor('#2b2d30', '#3e4146', fbm(x * 4, y * 4) + cellId * 0.15));
      } else {
        // Sea floor under coastal surf
        h = (0.2 + fbm(x * 1.5, y * 1.5) * 0.3) * reliefScale;
        color.set(mixColor('#0a1e2d', '#102e44', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '용암동굴') {
      // Basaltic pahoehoe plain with an open collapsed lava tube trench & natural arch
      const tubeCurve = Math.sin(y * 0.4) * 2.5;
      const distToTube = Math.abs(x - tubeCurve);
      
      // Skylight collapses along the tube
      const isArch = Math.abs(y - 2.8) < 1.0;
      
      h = (2.2 + warpedFbm(x * 0.6, y * 0.6, 3) * 0.6) * reliefScale;
      
      if (distToTube < 1.6) {
        if (!isArch) {
          // Trench hollowed out revealing subterranean lava channel
          const trenchDepth = smoothstep(1.6, 0.2, distToTube) * 2.8;
          h -= trenchDepth * reliefScale;
          color.set(h < 0.5 * reliefScale ? mixColor('#18100c', '#0d0806', fbm(x * 6, y * 6)) : mixColor('#2a1e18', '#382820', fbm(x * 4, y * 4)));
        } else {
          // Natural basalt arch bridging across the trench
          color.set(mixColor('#3a2f26', '#4a3d32', fbm(x * 4, y * 4)));
        }
      } else {
        color.set(mixColor('#262320', '#38332c', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '단층 산맥') {
      // Classic tilted fault block (경동지괴): sheer vertical scarp on one side, gentle dip slope on other
      const faultX = 0;
      if (x >= faultX) {
        // Gentle dip slope (완경사면)
        const dip = (x - faultX) / 10.0;
        h = (4.5 - dip * 3.5 + fbm(x * 0.8, y * 0.8) * 0.6) * reliefScale;
        color.set(mixColor('#385628', '#4b6e37', fbm(x * 2, y * 2)));
      } else {
        // Vertical fault scarp (단층애) dropping down to graben valley floor
        const distToFault = faultX - x;
        if (distToFault < 0.8) {
          // Sheer cliff face
          h = (4.5 - distToFault * 4.5) * reliefScale;
          color.set(mixColor('#544d47', '#6e655c', fbm(x * 6, y * 6)));
        } else {
          // Flat graben valley floor
          h = (0.5 + fbm(x * 1.2, y * 1.2) * 0.3) * reliefScale;
          color.set(mixColor('#6e634d', '#7d7259', fbm(x * 3, y * 3)));
        }
      }
      if (h > 3.8 * reliefScale) color.set(mixColor('#827b74', '#9e9790', fbm(x * 4, y * 4)));
    }

    // =====================================
    // 2. COASTAL
    // =====================================
    else if (normSub === '갯벌') {
      // Flat intertidal mudflat gently sloping from coast to sea with branching tidal creeks
      const slope = (1.0 - (x + 10) / 20.0) * 1.0;
      
      // Branching dendritic tidal channels (갯골)
      const creek1 = Math.abs(fbm(x * 0.35 + 2, y * 0.35, 3) - 0.5);
      const creek2 = Math.abs(fbm(x * 0.8 + 5, y * 0.8, 3) - 0.5);
      const channelCut = smoothstep(0.12, 0, creek1) * 0.65 + smoothstep(0.18, 0, creek2) * 0.35;
      
      h = Math.max(0.1, (slope - channelCut + 0.3) * reliefScale);
      
      if (channelCut > 0.15) {
        // Wet muddy channel with organic silt
        color.set(mixColor('#1f1914', '#15100c', fbm(x * 6, y * 6)));
      } else if (x > 5) {
        // Salt marsh grass belt
        color.set(mixColor('#384d28', '#4b6436', fbm(x * 4, y * 4)));
      } else {
        // Grey-brown tidal mudflat
        color.set(mixColor('#473c33', '#3a312a', fbm(x * 5, y * 5)));
      }
    }
    else if (normSub === '해식애' || normSub === '해식애 (해안 절벽)') {
      // Coastal headland: high plateau ending in vertical cliff + flat wave-cut platform below
      const cliffLine = fbm(y * 0.4, 0) * 2.0 - 0.5;
      
      if (x > cliffLine + 0.6) {
        // Plateau top
        h = (3.8 + fbm(x * 0.8, y * 0.8) * 0.5) * reliefScale;
        color.set(mixColor('#3c5e28', '#4f7535', fbm(x * 2, y * 2)));
      } else if (x >= cliffLine) {
        // Sheer sea cliff dropping to wave-cut platform
        const cliffProgress = (x - cliffLine) / 0.6;
        h = (0.5 + cliffProgress * 3.3) * reliefScale;
        color.set(mixColor('#544f4a', '#6b645e', fbm(x * 6, y * 6)));
      } else {
        // Wave-cut platform (파식대) cut flat at low tide
        h = (0.35 + fbm(x * 2, y * 2) * 0.15) * reliefScale;
        color.set(mixColor('#303a42', '#1c2830', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '시스택' || normSub === '시스택 (바위섬)') {
      // Sea with isolated monumental sea stacks and sea arch
      h = 0.3 * reliefScale;
      
      // Retreating headland on the left
      if (x < -5.5) {
        h = (3.5 - (x + 5.5) * 0.4 + fbm(x * 0.8, y * 0.8) * 0.5) * reliefScale;
        color.set(mixColor('#3a5428', '#4d6d37', fbm(x * 2, y * 2)));
      } else {
        // Sea Stacks: discrete vertical rock pillars
        const stacks = [
          { sx: 2.5, sy: -1.0, r: 1.4, h: 4.2 },
          { sx: 4.5, sy: 3.0, r: 1.1, h: 3.2 },
          { sx: -1.5, sy: 4.0, r: 0.9, h: 2.8 },
        ];
        for (const st of stacks) {
          const sd = Math.sqrt(Math.pow(x - st.sx, 2) + Math.pow(y - st.sy, 2));
          if (sd < st.r) {
            const stackShape = Math.cos((sd / st.r) * Math.PI * 0.5);
            h = Math.max(h, (0.4 + stackShape * st.h + fbm(x * 4, y * 4) * 0.3) * reliefScale);
          }
        }
        
        // Natural Sea Arch between [-2.5, 1.5] and [-4.0, 1.5]
        const archDist = Math.sqrt(Math.pow(x - (-3.2), 2) + Math.pow(y - 1.5, 2));
        if (archDist < 1.8) {
          const archH = Math.cos((archDist / 1.8) * Math.PI * 0.5) * 3.4;
          // Arch opening hole
          if (archDist > 0.5) {
            h = Math.max(h, (archH + fbm(x * 3, y * 3) * 0.2) * reliefScale);
          }
        }

        if (h > 1.0 * reliefScale) {
          color.set(mixColor('#5c544d', '#786e65', fbm(x * 5, y * 5)));
        } else {
          color.set(mixColor('#0d2538', '#14364e', fbm(x * 2, y * 2)));
        }
      }
    }
    else if (normSub === '해안 사구') {
      // Undulating coastal sand dunes with distinct gentle windward slopes and steep slip faces
      const mainDune = Math.exp(-Math.pow((x - 1.0) / 2.5, 2)) * 3.2;
      const foreDune = Math.exp(-Math.pow((x + 4.5) / 2.0, 2)) * 2.0;
      const duneSlack = Math.exp(-Math.pow((x - 5.5) / 2.0, 2)) * 0.6;
      
      const windRipples = Math.sin(x * 4.0 - y * 1.5) * 0.08;
      h = Math.max(0.2, (mainDune + foreDune - duneSlack + windRipples + fbm(x * 0.8, y * 0.8) * 0.3) * reliefScale);
      
      if (x > 5.0) {
        // Coastal vegetation stabilizing the dunes
        color.set(mixColor('#5a783a', '#446028', fbm(x * 3, y * 3)));
      } else {
        // Golden sand
        color.set(mixColor('#d4b87c', '#e6cca0', fbm(x * 4, y * 4)));
      }
    }
    else if (normSub === '사주' || normSub === '사주·사취') {
      // Sandspit & Tombolo connecting rocky island to mainland with lagoon
      const mainland = Math.exp(-(x + 7.5) * 0.6) * 3.0;
      const tiedIsland = Math.exp(-(Math.pow(x - 6.0, 2) + Math.pow(y - 4.0, 2)) * 0.3) * 3.8;
      
      // Curved tombolo spit path
      const spitPath = -0.15 * Math.pow(x, 2) + 0.4 * x + 1.0;
      const distToSpit = Math.abs(y - spitPath);
      const spitRidge = (distToSpit < 1.6 && x > -6.5 && x < 5.5)
        ? Math.cos((distToSpit / 1.6) * Math.PI * 0.5) * 1.2
        : 0;

      h = Math.max(0.2, (mainland + tiedIsland + spitRidge + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale);

      if (spitRidge > 0.3) {
        // Golden sandspit bar
        color.set(mixColor('#e2cb91', '#f0deaf', fbm(x * 6, y * 6)));
      } else if (h > 1.8 * reliefScale) {
        // Rocky island / mainland
        color.set(mixColor('#4a5c37', '#635b50', fbm(x * 3, y * 3)));
      } else {
        // Coastal water & lagoon
        color.set(mixColor('#0e2e42', '#184763', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '석호') {
      // Classic coastal lagoon: Open Sea (left) -> Long sand barrier spit (center) -> Calm brackish lagoon basin (right) -> Inland pine hills
      const barrierX = -2.5;
      const distToBarrier = Math.abs(x - barrierX);
      const isBarrier = distToBarrier < 1.4;
      
      // Tidal inlet gap through the sand spit (하구 갯트임 수로)
      const isTidalInlet = isBarrier && Math.abs(y - (-4.0)) < 1.2;
      
      const barrierHeight = (isBarrier && !isTidalInlet)
        ? Math.cos((distToBarrier / 1.4) * Math.PI * 0.5) * 1.5
        : 0;

      // Inland pine hills on the far right
      const inlandHills = x > 4.5 ? Math.exp((x - 4.5) * 0.4) * 0.8 + fbm(x * 0.8, y * 0.8) * 0.6 : 0;
      
      if (x < barrierX - 1.4) {
        // Open sea floor
        h = (0.2 + fbm(x * 1.5, y * 1.5) * 0.15) * reliefScale;
        color.set(mixColor('#0a2436', '#123954', fbm(x * 3, y * 3)));
      } else if (isBarrier) {
        // Sand barrier ridge or tidal inlet
        h = Math.max(0.3, (0.35 + barrierHeight + fbm(x * 2, y * 2) * 0.1) * reliefScale);
        if (isTidalInlet) {
          color.set(mixColor('#15425c', '#1d5573', fbm(x * 4, y * 4)));
        } else {
          color.set(mixColor('#dfc78d', '#eedcb0', fbm(x * 5, y * 5)));
        }
      } else if (x < 5.0) {
        // Calm shallow brackish lagoon lake bed (석호 기수호 바닥)
        h = (0.4 + fbm(x * 0.8, y * 0.8) * 0.12) * reliefScale;
        color.set(mixColor('#194a4f', '#246166', fbm(x * 3, y * 3)));
      } else {
        // Inland vegetated pine dunes & hills
        h = (1.2 + inlandHills) * reliefScale;
        color.set(mixColor('#38572d', '#4c733f', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '파식대') {
      // Extensive horizontal wave-cut rock platform exposed at low tide with tide pools & bookstack cliffs (Chaeseokgang / Taejongdae)
      const cliffLine = 3.5;
      
      if (x > cliffLine) {
        // Book-stacked layered sedimentary sea cliff (책장 층리 해식 절벽)
        const cliffH = 4.4 + fbm(x * 0.8, y * 0.8) * 0.5;
        h = cliffH * reliefScale;
        // Fine horizontal strata coloring (퇴적암 층리 줄무늬)
        const strata = Math.sin(y * 8.0 + h * 6.0) * 0.5 + 0.5;
        color.set(mixColor('#4a443e', '#736b63', strata));
      } else if (x > -6.0) {
        // Wide horizontal wave-cut rock platform (파식대 평탄면)
        const jointFissures = (Math.sin(x * 3.5) * Math.cos(y * 3.0)) * 0.08;
        // Tide pools (조수 웅덩이 함몰부)
        const tp1 = Math.exp(-(Math.pow(x + 3.0, 2) + Math.pow(y - 2.0, 2)) * 0.8) * 0.35;
        const tp2 = Math.exp(-(Math.pow(x + 0.5, 2) + Math.pow(y + 3.0, 2)) * 0.7) * 0.3;
        
        h = Math.max(0.35, (0.75 + jointFissures - tp1 - tp2 + fbm(x * 1.5, y * 1.5) * 0.08) * reliefScale);
        
        if (tp1 > 0.15 || tp2 > 0.15) {
          // Tide pools with green algae and sea water
          color.set(mixColor('#163b40', '#255259', fbm(x * 5, y * 5)));
        } else {
          // Dark wet wave-cut bedrock
          color.set(mixColor('#3e4347', '#535b61', fbm(x * 4, y * 4)));
        }
      } else {
        // Sea beyond platform
        h = (0.2 + fbm(x * 1.5, y * 1.5) * 0.15) * reliefScale;
        color.set(mixColor('#0a2133', '#11354f', fbm(x * 2, y * 2)));
      }
    }

    // =====================================
    // 3. FLUVIAL
    // =====================================
    else if (normSub === '선상지') {
      // Canyon mouth (Apex at [0, -5]) expanding into a wide semicircular fan apron
      const apexY = -5.0;
      const fanDy = y - apexY;
      const fanDist = Math.sqrt(x * x + fanDy * fanDy);
      
      if (y < apexY) {
        // Mountain gorge background
        h = (3.5 + Math.abs(x) * 0.6 - Math.exp(-x * x * 0.8) * 2.0 + fbm(x * 0.8, y * 0.8) * 0.8) * reliefScale;
        color.set(mixColor('#42453e', '#55584f', fbm(x * 3, y * 3)));
      } else {
        // Fan cone sloping gently downwards from apex
        const fanSlope = Math.max(0, 3.2 - fanDist * 0.28);
        const fanAngle = Math.atan2(x, fanDy);
        // Fan boundary constraint (roughly 120 degree cone)
        const inFan = Math.abs(fanAngle) < 1.1 && fanDist < 12.0;
        
        // Braided stream distributary gullies
        const braided = Math.abs(Math.sin(fanAngle * 8.0 + fbm(x * 0.5, y * 0.5) * 3.0)) * 0.25;
        
        if (inFan) {
          h = Math.max(0.4, (fanSlope - braided + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale);
          if (fanDist < 4.0) {
            // Apex gravel / boulders
            color.set(mixColor('#827668', '#998d7e', fbm(x * 6, y * 6)));
          } else if (fanDist > 9.0) {
            // Fan toe springs & fertile plains
            color.set(mixColor('#4a6e2e', '#5c843c', fbm(x * 3, y * 3)));
          } else {
            // Mid-fan orchard and crop fields
            color.set(mixColor('#708a46', '#879e56', fbm(x * 4, y * 4)));
          }
        } else {
          // Low surrounding plain
          h = (0.5 + fbm(x * 0.6, y * 0.6) * 0.3) * reliefScale;
          color.set(mixColor('#54733b', '#65844a', fbm(x * 2, y * 2)));
        }
      }
    }
    else if (normSub === '곡류천') {
      // Meandering river with deep cut banks on outer bends, sandy point bars on inner bends, and an oxbow lake!
      const riverMeander = Math.sin(y * 0.55) * 3.8 + Math.sin(y * 0.2) * 1.5;
      const distToRiver = x - riverMeander;
      const curvature = -Math.sin(y * 0.55); // Local curvature determines cut bank vs point bar
      
      // Separate cutoff Oxbow Lake (우각호)
      const oxbowCenter = [-3.2, 2.5];
      const oxbowDist = Math.sqrt(Math.pow(x - oxbowCenter[0], 2) + Math.pow(y - oxbowCenter[1], 2));
      const inOxbow = Math.abs(oxbowDist - 1.8) < 0.65;
      
      // Floodplain base height
      h = (2.2 + fbm(x * 0.6, y * 0.6) * 0.4) * reliefScale;
      
      if (Math.abs(distToRiver) < 1.3) {
        // Active River bed: dug down to height 0.3
        h = (0.35 + fbm(x * 2, y * 2) * 0.1) * reliefScale;
        color.set(mixColor('#261f18', '#1a140e', fbm(x * 6, y * 6)));
      } else if (Math.abs(distToRiver) < 3.0) {
        // Transition banks
        if (distToRiver * curvature > 0) {
          // Outer bend: Cut Bank (공격사면) - steep erosional cliff
          h = (2.2 - smoothstep(1.3, 1.8, Math.abs(distToRiver)) * 1.8) * reliefScale;
          color.set(mixColor('#695745', '#7a6754', fbm(x * 4, y * 4)));
        } else {
          // Inner bend: Point Bar (활주사면) - gentle slope with sand deposits
          h = (2.2 - smoothstep(1.3, 3.0, Math.abs(distToRiver)) * 1.8) * reliefScale;
          color.set(mixColor('#d9c48f', '#ebd6a2', fbm(x * 5, y * 5)));
        }
      } else if (inOxbow) {
        // Crescent oxbow lake bed
        h = 0.4 * reliefScale;
        color.set(mixColor('#1e3224', '#2a4432', fbm(x * 4, y * 4)));
      } else {
        // Green floodplain
        color.set(mixColor('#3f612d', '#527a3c', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '범람원') {
      // Extensive alluvial floodplain: S-curved river channel + elevated Natural Levees on both banks + low Backswamps & marshes
      const riverPath = Math.sin(y * 0.45) * 3.5;
      const distToRiver = Math.abs(x - riverPath);
      
      // Natural Levees (자연제방): sandy ridges flanking both sides of the river
      const leveeWidth = 1.6;
      const isLevee = distToRiver >= 1.2 && distToRiver < 3.2;
      const leveeHeight = isLevee
        ? Math.sin(((distToRiver - 1.2) / 2.0) * Math.PI) * 0.9
        : 0;

      // Backswamp (배후습지): lower muddy wetland behind the natural levees
      const isBackswamp = distToRiver >= 3.2;
      
      if (distToRiver < 1.2) {
        // Active River Bed
        h = 0.35 * reliefScale;
        color.set(mixColor('#1f1812', '#140f0a', fbm(x * 6, y * 6)));
      } else if (isLevee) {
        // Natural Levee: well-drained fertile sandy ridge with villages and orchards
        h = (1.4 + leveeHeight + fbm(x * 1.5, y * 1.5) * 0.15) * reliefScale;
        color.set(mixColor('#829654', '#9eb06b', fbm(x * 4, y * 4)));
      } else {
        // Backswamp: low poorly drained flat wetland / rice paddy fields
        h = (0.75 + fbm(x * 0.8, y * 0.8) * 0.12) * reliefScale;
        color.set(mixColor('#2b4c34', '#3d6148', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '삼각주') {
      // River delta splitting into multiple distributary channels entering sea
      const riverMain = Math.abs(x - fbm(y * 0.3, 0) * 1.5);
      // Branching distributary channels as y increases (flowing southward)
      const ch1 = Math.abs(x - (y * 0.4 + 1.2));
      const ch2 = Math.abs(x - (-y * 0.4 - 1.2));
      const ch3 = Math.abs(x - (y * 0.7 + 3.0));
      const ch4 = Math.abs(x - (-y * 0.7 - 3.0));
      
      const isChannel = (y < -2 && riverMain < 1.2) ||
        (y >= -2 && (ch1 < 0.9 || ch2 < 0.9 || ch3 < 0.7 || ch4 < 0.7));

      // Triangular fan elevation
      const deltaFan = y > -2 ? Math.max(0, 1.2 - (y + 2) * 0.12 - Math.abs(x) * 0.12) : 1.4;
      
      if (isChannel) {
        h = 0.3 * reliefScale;
        color.set(mixColor('#211912', '#140f0a', fbm(x * 6, y * 6)));
      } else if (y > 6.0) {
        // Open sea
        h = 0.2 * reliefScale;
        color.set(mixColor('#0e2b3d', '#133a52', fbm(x * 2, y * 2)));
      } else {
        // Lush delta islands
        h = (deltaFan + fbm(x * 1.2, y * 1.2) * 0.25) * reliefScale;
        color.set(mixColor('#3b5c2a', '#4d7537', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '하안단구') {
      // Staircase river terraces step down to an incised canyon river
      const dist = Math.abs(x);
      
      if (dist < 1.2) {
        // Incised river bed
        h = 0.4 * reliefScale;
        color.set(mixColor('#221c16', '#17120e', fbm(x * 6, y * 6)));
      } else if (dist < 3.2) {
        // Terrace 1 (Lower)
        h = (1.5 + fbm(x * 1.2, y * 1.2) * 0.15) * reliefScale;
        color.set(mixColor('#486830', '#597c3c', fbm(x * 3, y * 3)));
      } else if (dist < 5.8) {
        // Terrace 2 (Middle)
        h = (2.8 + fbm(x * 1.2, y * 1.2) * 0.15) * reliefScale;
        color.set(mixColor('#5a783e', '#6d8c4e', fbm(x * 3, y * 3)));
      } else {
        // Terrace 3 (High plateau)
        h = (4.2 + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale;
        color.set(mixColor('#6a864d', '#7c9a5d', fbm(x * 3, y * 3)));
      }
      
      // Steep scarps (단구애) between terraces
      if ((dist > 1.0 && dist < 1.5) || (dist > 3.0 && dist < 3.5) || (dist > 5.5 && dist < 6.0)) {
        color.set(mixColor('#63574c', '#75675a', fbm(x * 6, y * 6)));
      }
    }
    else if (normSub === '폭포') {
      // Plateau dropping sheer over a vertical precipice into a circular plunge pool & gorge
      const inRiver = Math.abs(x) < 1.4;
      
      if (y < -1.0) {
        // High plateau river
        h = (4.2 - (inRiver ? 0.6 : 0) + fbm(x * 0.8, y * 0.8) * 0.3) * reliefScale;
        color.set(inRiver ? mixColor('#32576b', '#416f87', fbm(x * 4, y * 4)) : mixColor('#3d5929', '#4f7236', fbm(x * 2, y * 2)));
      } else if (y <= 0.8) {
        // Sheer vertical cliff face drop!
        const dropRatio = (y - (-1.0)) / 1.8;
        h = (4.2 - dropRatio * 3.4 - (inRiver ? 0.6 : 0)) * reliefScale;
        color.set(mixColor('#544c45', '#6b6158', fbm(x * 6, y * 6)));
      } else {
        // Gorge & plunge pool (폭호)
        const poolDist = Math.sqrt(x * x + Math.pow(y - 1.8, 2));
        const inPool = poolDist < 2.0;
        
        if (inPool) {
          h = 0.3 * reliefScale;
          color.set(mixColor('#1a3a47', '#285566', fbm(x * 4, y * 4)));
        } else if (inRiver && y > 1.8) {
          // Downstream gorge river
          h = 0.5 * reliefScale;
          color.set(mixColor('#2b4959', '#386073', fbm(x * 4, y * 4)));
        } else {
          // High gorge canyon walls
          const gorgeWall = Math.min(3.2, Math.abs(x) * 1.2);
          h = (0.8 + gorgeWall + fbm(x * 0.8, y * 0.8) * 0.3) * reliefScale;
          color.set(mixColor('#59524a', '#435432', fbm(x * 3, y * 3)));
        }
      }
    }

    // =====================================
    // 4. KARST
    // =====================================
    else if (normSub === '석회동굴') {
      // Limestone karst landscape with karren flutes, sinkhole caverns, and open cave entrance
      h = (3.4 + warpedFbm(x * 0.6, y * 0.6, 3) * 0.8) * reliefScale;
      
      // Cave entrance portal & sinkholes
      const caveCenter = [0, 0];
      const caveDist = Math.sqrt(Math.pow(x - caveCenter[0], 2) + Math.pow(y - caveCenter[1], 2));
      
      if (caveDist < 2.8) {
        const caveDrop = Math.cos((caveDist / 2.8) * Math.PI * 0.5) * 3.6;
        h -= caveDrop * reliefScale;
        color.set(h < 1.0 * reliefScale ? mixColor('#0f0d0b', '#1a1612', fbm(x * 6, y * 6)) : mixColor('#635f59', '#7a756e', fbm(x * 4, y * 4)));
      } else {
        // Limestone grey with green karst moss
        color.set(mixColor('#706f6b', '#5c634d', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '돌리네') {
      // Rolling limestone plateau with distinct circular funnel-shaped sinkholes (와지)
      h = (3.2 + fbm(x * 0.5, y * 0.5) * 0.6) * reliefScale;
      
      const dolines = [
        { cx: 0, cy: 0, r: 3.2, depth: 2.5 },
        { cx: -4.5, cy: 3.5, r: 2.2, depth: 1.8 },
        { cx: 4.2, cy: -3.0, r: 2.5, depth: 2.0 },
      ];
      
      for (const dol of dolines) {
        const dd = Math.sqrt(Math.pow(x - dol.cx, 2) + Math.pow(y - dol.cy, 2));
        if (dd < dol.r) {
          const funnel = Math.cos((dd / dol.r) * Math.PI * 0.5) * dol.depth;
          h -= funnel * reliefScale;
          // Reddish Terra Rossa soil in the doline bowl
          color.set(mixColor('#853b26', '#9c4832', fbm(x * 6, y * 6)));
        }
      }
      
      if (color.r < 0.4) {
        color.set(mixColor('#496632', '#5d7d42', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '탑 카르스트') {
      // Tower Karst: vertical monolithic towers rising dramatically out of flat emerald waters/plains
      h = 0.5 * reliefScale;
      
      const towers = [
        { tx: 0, ty: 0, r: 1.6, th: 4.8 },
        { tx: 4.2, ty: 2.8, r: 1.3, th: 4.0 },
        { tx: -4.0, ty: 3.5, r: 1.4, th: 4.3 },
        { tx: 4.5, ty: -3.2, r: 1.2, th: 3.6 },
        { tx: -3.8, ty: -3.8, r: 1.5, th: 4.5 },
      ];
      
      for (const tow of towers) {
        const td = Math.sqrt(Math.pow(x - tow.tx, 2) + Math.pow(y - tow.ty, 2));
        if (td < tow.r) {
          // Steep near-vertical walls with rounded crown
          const towerShape = Math.exp(-Math.pow(td / (tow.r * 0.8), 6));
          h = Math.max(h, (0.5 + towerShape * tow.th + fbm(x * 3, y * 3) * 0.3) * reliefScale);
        }
      }

      if (h > 3.0 * reliefScale) {
        // Vegetated limestone summit
        color.set(mixColor('#2b4d20', '#3b662d', fbm(x * 4, y * 4)));
      } else if (h > 0.8 * reliefScale) {
        // Sheer limestone rock walls
        color.set(mixColor('#696e6d', '#848a88', fbm(x * 5, y * 5)));
      } else {
        // Emerald water / karst plain
        color.set(mixColor('#14453e', '#1c5e55', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '카렌') {
      // Limestone Stone Forest: dense knife-sharp Karren pinnacles, solution flutes (Rinnen), and terra rossa clefts
      // Solution flutes: directional chemical erosion grooves
      const fluteNoise = Math.sin(x * 2.8 + fbm(x * 0.5, y * 0.5) * 2.5) * 0.5 + 0.5;
      const { dist: cellDist, cellId } = hexVoronoi(x * 0.85, y * 0.85);
      
      // Pinnacles stand up where cellDist is low, deep clefts where cellDist is high
      const pinnacleProfile = Math.pow(Math.max(0, 1.0 - cellDist * 1.3), 2.2);
      const pinnacleHeight = 1.8 + cellId * 2.8;
      
      // Secondary razor-sharp micro-flutes on pinnacle flanks
      const microFlutes = Math.abs(Math.sin(y * 6.0 + x * 2.0)) * 0.35 * smoothstep(0.3, 0.9, pinnacleProfile);
      
      h = Math.max(0.4, (0.8 + pinnacleProfile * pinnacleHeight + microFlutes + fluteNoise * 0.3) * reliefScale);
      
      if (pinnacleProfile > 0.45) {
        // Sharp grey limestone pinnacles with lichen
        color.set(mixColor('#7a7d80', '#9aa0a6', fbm(x * 6, y * 6)));
      } else if (pinnacleProfile > 0.15) {
        // Fluted rock walls
        color.set(mixColor('#545759', '#666b6e', fbm(x * 4, y * 4)));
      } else {
        // Cleft floor filled with Terra Rossa (red clay residual soil)
        color.set(mixColor('#873926', '#9e4632', fbm(x * 5, y * 5)));
      }
    }

    // =====================================
    // 5. GLACIAL
    // =====================================
    else if (normSub === 'U자곡') {
      // Classic broad, flat-bottomed, steep-walled glacial trough valley
      const valleyWidth = 4.0;
      const distFromCenter = Math.abs(x);
      
      if (distFromCenter < valleyWidth) {
        // Flat valley floor
        h = (0.6 + fbm(x * 0.8, y * 0.8) * 0.2) * reliefScale;
        color.set(mixColor('#3d592b', '#4f7238', fbm(x * 3, y * 3)));
      } else {
        // Parabolic steep U-valley walls
        const wallDist = (distFromCenter - valleyWidth) / 4.0;
        h = (0.6 + Math.pow(clamp(wallDist, 0, 1.4), 1.6) * 4.2 + fbm(x * 0.8, y * 0.8) * 0.4) * reliefScale;
        
        if (h > 3.8 * reliefScale) {
          // Snow patches on high peaks
          color.set(mixColor('#d9e6eb', '#ffffff', fbm(x * 4, y * 4)));
        } else {
          // Grey granite rock walls
          color.set(mixColor('#545b63', '#6c747d', fbm(x * 5, y * 5)));
        }
      }
    }
    else if (normSub === '피오르드') {
      // Deep drowned glacial canyon: steep cliffs rising directly out of sapphire blue fjord water
      const fjordWidth = 3.2;
      const distFromCenter = Math.abs(x);
      
      if (distFromCenter < fjordWidth) {
        // Sea level inside fjord
        h = 0.5 * reliefScale;
        color.set(mixColor('#092233', '#0e314a', fbm(x * 2, y * 2)));
      } else {
        // Sheer granite cliffs rising to snow-capped peaks
        const wallDist = (distFromCenter - fjordWidth) / 4.0;
        h = (0.5 + Math.pow(clamp(wallDist, 0, 1.5), 1.4) * 4.6 + fbm(x * 0.8, y * 0.8) * 0.4) * reliefScale;
        
        if (h > 3.8 * reliefScale) {
          color.set(mixColor('#e0edf2', '#ffffff', fbm(x * 4, y * 4)));
        } else {
          color.set(mixColor('#4a5157', '#5f676e', fbm(x * 5, y * 5)));
        }
      }
    }
    else if (normSub === '혼' || normSub === '혼 (호른)') {
      // Sharp 3-sided pyramidal peak with knife-edge arêtes and cirques
      const a3 = angle * 3.0;
      const areteRidge = Math.cos(a3);
      
      // Central peak height
      const peakH = Math.max(0, 5.2 - d * 0.6);
      // Depressions between arêtes (Cirques/권곡)
      const cirqueHollow = (1.0 - areteRidge) * 0.55 * smoothstep(1.0, 6.0, d);
      
      h = Math.max(0.4, (peakH - cirqueHollow + fbm(x * 1.5, y * 1.5) * 0.3) * reliefScale);
      
      if (h > 3.8 * reliefScale) {
        // Summit snow
        color.set(mixColor('#e8f2f7', '#ffffff', fbm(x * 4, y * 4)));
      } else if (h > 2.0 * reliefScale) {
        // Dark rugged granite
        color.set(mixColor('#485159', '#3b4249', fbm(x * 4, y * 4)));
      } else {
        // Lower slope vegetation & scree
        color.set(mixColor('#384c2a', '#4b6139', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '권곡') {
      // Classic Alpine Cirque: Amphitheater-shaped glacial basin carved into mountain headwall with circular Tarn lake
      const bowlDist = Math.sqrt(x * x + Math.pow(y + 1.0, 2));
      const headwallAngle = Math.atan2(y + 1.0, x);
      
      // Surrounding 3-sided sheer headwall (권곡 두벽) for y < 2
      const isHeadwall = y < 1.5 && (bowlDist > 3.8 && bowlDist < 8.5);
      const headwallH = isHeadwall
        ? Math.pow(smoothstep(3.8, 7.5, bowlDist), 1.4) * 4.8
        : (y < -3.5 ? 4.8 : 0);

      // Rock threshold / lip at the cirque outlet (암석 턱) around y = 2.8
      const isLip = Math.abs(y - 2.8) < 1.2 && Math.abs(x) < 3.5;
      const lipHeight = isLip ? 1.6 : 0;
      
      // Flat basin / Tarn lake depression inside bowl
      if (bowlDist <= 3.8) {
        // Deep Tarn Lake bowl
        h = (1.0 + Math.pow(bowlDist / 3.8, 2) * 0.4 + fbm(x * 1.5, y * 1.5) * 0.1) * reliefScale;
        color.set(mixColor('#195361', '#247a8c', fbm(x * 4, y * 4)));
      } else if (isHeadwall || y < -3.5) {
        // Steep granite headwall with snow pockets & bergschrund
        h = Math.max(1.4, (1.2 + headwallH + fbm(x * 2, y * 2) * 0.4) * reliefScale);
        if (h > 4.2 * reliefScale) {
          color.set(mixColor('#d8e7ed', '#ffffff', fbm(x * 5, y * 5)));
        } else {
          color.set(mixColor('#464e54', '#5e6870', fbm(x * 6, y * 6)));
        }
      } else {
        // Down-valley threshold & moraine till slope
        const valleySlope = Math.max(0.6, 2.0 - (y - 2.0) * 0.28 + lipHeight);
        h = (valleySlope + fbm(x * 1.2, y * 1.2) * 0.25) * reliefScale;
        color.set(mixColor('#546944', '#706456', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '모레인') {
      // Glacial valley with curved terminal moraine damming a turquoise meltwater lake
      const latMoraineL = Math.exp(-Math.pow((x + 4.5) / 1.5, 2)) * 3.2;
      const latMoraineR = Math.exp(-Math.pow((x - 4.5) / 1.5, 2)) * 3.2;
      
      // Crescent terminal moraine ridge damming the valley
      const termDist = Math.abs(Math.sqrt(x * x + Math.pow(y - 2.0, 2)) - 4.5);
      const termMoraine = Math.exp(-Math.pow(termDist / 1.2, 2)) * 2.2;
      
      h = Math.max(0.5, (latMoraineL + latMoraineR + termMoraine + fbm(x * 1.2, y * 1.2) * 0.3) * reliefScale);
      
      if (y < 1.0 && Math.abs(x) < 3.5) {
        // Turquoise glacial lake
        h = 1.0 * reliefScale;
        color.set(mixColor('#2c7a8c', '#3fa3ba', fbm(x * 3, y * 3)));
      } else if (termMoraine > 0.8 || latMoraineL > 1.2 || latMoraineR > 1.2) {
        // Unsorted gravel & rock moraine till
        color.set(mixColor('#6e6255', '#807466', fbm(x * 6, y * 6)));
      } else {
        // Alpine tundra
        color.set(mixColor('#466336', '#597945', fbm(x * 2, y * 2)));
      }
    }

    // =====================================
    // 6. ARID
    // =====================================
    else if (normSub === '사막') {
      // Crescent barchan dunes with wind ripples and sharp slip faces
      const barchan = (bx: number, by: number, scale: number) => {
        const dx = (x - bx) / scale;
        const dy = (y - by) / scale;
        const ridgeX = -dy * dy * 1.2;
        const dist = dx - ridgeX;
        const height = dist < 0
          ? Math.exp(-Math.pow(dist / 2.0, 2))
          : Math.exp(-Math.pow(dist / 0.6, 2));
        return height * Math.exp(-Math.pow(dy, 2) * 0.5) * scale * 1.6;
      };

      const d1 = barchan(0, 0, 2.8);
      const d2 = barchan(-4.5, 3.5, 2.0);
      const d3 = barchan(4.2, -3.0, 2.2);

      const ripples = Math.sin(x * 4.0 - y * 1.5) * 0.05;
      h = Math.max(0.3, (Math.max(d1, d2, d3) + ripples + fbm(x * 0.6, y * 0.6) * 0.2) * reliefScale);

      // Warm desert ochre sand
      color.set(mixColor('#cc9b58', '#e2b372', smoothstep(0.4, 3.0, h) + fbm(x * 4, y * 4) * 0.15));
    }
    else if (normSub === '버섯바위') {
      // Desert bedrock plateau with undercut pedestal mushroom rocks
      h = (0.6 + fbm(x * 0.5, y * 0.5) * 0.2) * reliefScale;

      const mushroomPillars = [
        { mx: 0, my: 0, capR: 2.2, neckR: 1.0, capH: 4.4 },
        { mx: 4.5, my: 3.2, capR: 1.5, neckR: 0.7, capH: 3.2 },
      ];

      for (const m of mushroomPillars) {
        const md = Math.sqrt(Math.pow(x - m.mx, 2) + Math.pow(y - m.my, 2));
        if (md < m.capR) {
          // Caprock table
          const capShape = Math.exp(-Math.pow(md / m.capR, 4));
          h = Math.max(h, (capShape * m.capH + fbm(x * 3, y * 3) * 0.2) * reliefScale);
        }
      }

      if (h > 2.0 * reliefScale) {
        // Resistant caprock
        color.set(mixColor('#b88b56', '#cf9e67', fbm(x * 4, y * 4)));
      } else {
        // Desert gravel plain
        color.set(mixColor('#a68453', '#8f6f43', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '메사·뷰트') {
      // Monument Valley style: Flat-topped Mesa tableland, isolated slender Butte pillar, and 45-degree talus scree aprons
      // Mesa 1: Large tableland on the left
      const mesaDist = Math.max(Math.abs(x - (-3.2)) / 3.4, Math.abs(y - (-1.0)) / 2.6);
      const isMesaTop = mesaDist < 0.7;
      const isMesaCliff = mesaDist >= 0.7 && mesaDist < 1.0;
      const isMesaTalus = mesaDist >= 1.0 && mesaDist < 1.7;
      
      let mesaH = 0;
      if (isMesaTop) {
        mesaH = 4.4 + fbm(x * 0.8, y * 0.8) * 0.15;
      } else if (isMesaCliff) {
        const cliffProg = (1.0 - mesaDist) / 0.3;
        mesaH = 2.4 + cliffProg * 2.0;
      } else if (isMesaTalus) {
        const talusProg = (1.7 - mesaDist) / 0.7;
        mesaH = 0.6 + talusProg * 1.8;
      }

      // Butte: Slender rock spire on the right (x=4.2, y=2.5)
      const butteDist = Math.sqrt(Math.pow(x - 4.2, 2) + Math.pow(y - 2.5, 2));
      let butteH = 0;
      if (butteDist < 0.9) {
        butteH = 3.9 + fbm(x * 2, y * 2) * 0.15;
      } else if (butteDist < 1.4) {
        butteH = 1.8 + ((1.4 - butteDist) / 0.5) * 2.1;
      } else if (butteDist < 2.5) {
        butteH = 0.6 + ((2.5 - butteDist) / 1.1) * 1.2;
      }

      const desertPlain = 0.5 + fbm(x * 0.4, y * 0.4) * 0.2;
      h = Math.max(desertPlain, Math.max(mesaH, butteH)) * reliefScale;

      // Color based on geological strata (Navajo red sandstone + shale layers)
      const strata = Math.sin(h * 5.0) * 0.5 + 0.5;
      if (h > 4.0 * reliefScale) {
        // Mesa resistant caprock table
        color.set(mixColor('#c47743', '#d98b54', fbm(x * 5, y * 5)));
      } else if (h > 2.0 * reliefScale) {
        // Sheer red sandstone cliffs with horizontal strata
        color.set(mixColor('#a64d2d', '#c25c36', strata));
      } else if (h > 0.9 * reliefScale) {
        // Talus debris slope (scree apron)
        color.set(mixColor('#b87349', '#cf885b', fbm(x * 4, y * 4)));
      } else {
        // Desert floor
        color.set(mixColor('#cfa067', '#dbb079', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '와디') {
      // Dry desert canyon (Wadi): meander slot canyon deeply incised into arid sandstone plateau
      const wadiCurve = Math.sin(y * 0.45) * 2.8 + Math.cos(y * 0.2) * 1.2;
      const distToWadi = Math.abs(x - wadiCurve);
      
      const plateauH = 3.6 + fbm(x * 0.5, y * 0.5) * 0.6;
      
      if (distToWadi < 1.1) {
        // Dry gravel riverbed floor
        h = (0.5 + fbm(x * 2, y * 2) * 0.12) * reliefScale;
        // Dry greyish gravel & desert sand
        color.set(mixColor('#948474', '#a89887', fbm(x * 6, y * 6)));
      } else if (distToWadi < 2.2) {
        // Sheer slot canyon walls
        const wallProg = (distToWadi - 1.1) / 1.1;
        h = (0.5 + Math.pow(wallProg, 0.8) * 3.1) * reliefScale;
        // Striped red canyon rock strata
        const strata = Math.sin(h * 6.0) * 0.5 + 0.5;
        color.set(mixColor('#a14728', '#bd5c3a', strata));
      } else {
        // Arid sandstone plateau above
        h = plateauH * reliefScale;
        color.set(mixColor('#bf8a54', '#d49e65', fbm(x * 3, y * 3)));
      }
    }
    else if (normSub === '오아시스') {
      // Deep desert dune basin cradling a fresh palm oasis pool
      const duneRim = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 2.0 + fbm(x * 0.5, y * 0.5) * 0.6;
      const basinDrop = Math.exp(-d * d * 0.15) * 3.5;
      
      h = Math.max(0.4, (2.8 + duneRim - basinDrop) * reliefScale);
      
      if (d < 1.8) {
        // Oasis water pool
        color.set(mixColor('#0f687a', '#178a9e', fbm(x * 4, y * 4)));
      } else if (d < 3.6) {
        // Lush palm vegetation belt
        color.set(mixColor('#255e1a', '#347825', fbm(x * 5, y * 5)));
      } else {
        // Golden sand dunes
        color.set(mixColor('#d9a762', '#edbf7e', fbm(x * 2, y * 2)));
      }
    }
    else if (normSub === '플라야') {
      // Flat salt flat basin with hexagonal polygon desiccation crack patterns
      h = 0.25 * reliefScale;
      const { dist } = hexVoronoi(x * 2.2, y * 2.2);
      const crack = smoothstep(0.8, 0.95, dist);
      
      // Micro relief along polygon ridges
      h += (crack * 0.08 + fbm(x * 0.5, y * 0.5) * 0.04) * reliefScale;
      
      if (crack > 0.4) {
        // Salt polygon ridge
        color.set(mixColor('#f0ece6', '#ffffff', fbm(x * 6, y * 6)));
      } else {
        // Evaporite salt flat crust
        color.set(mixColor('#d9d3c7', '#e8e2d8', fbm(x * 4, y * 4)));
      }
    }
    else {
      // Generic mountain
      h = (fbm(x * 0.6, y * 0.6) * 3.0) * reliefScale;
      color.set('#666666');
    }

    pos.setZ(i, h);
    col[i * 3] = color.r;
    col[i * 3 + 1] = color.g;
    col[i * 3 + 2] = color.b;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  GEOMETRY_CACHE[cacheKey] = geo;
  return geo;
};

// ==========================================
// Animated Water Component
// ==========================================
const AnimatedWater = ({
  color = '#006699',
  position = [0, 0, 0.8],
  roughness = 0.15,
  transmission = 0.85,
}: {
  color?: string;
  position?: [number, number, number];
  roughness?: number;
  transmission?: number;
}) => {
  const uniforms = useRef({ uTime: { value: 0 } });
  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[20, 20, 48, 48]} />
      <meshPhysicalMaterial
        color={color}
        transmission={transmission}
        opacity={0.9}
        transparent
        roughness={roughness}
        ior={1.33}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = uniforms.current.uTime;
          shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
             float wave = sin(position.x * 2.0 + uTime * 1.5) * 0.03
                        + cos(position.y * 2.0 + uTime * 1.2) * 0.03;
             transformed.z += wave;
            `
          );
        }}
      />
    </mesh>
  );
};

// ==========================================
// Animated Active Lava Pool for Volcano
// ==========================================
const AnimatedLava = ({ position = [0, 0, 2.4] }: { position?: [number, number, number] }) => {
  const uniforms = useRef({ uTime: { value: 0 } });
  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position}>
      <circleGeometry args={[1.5, 48]} />
      <meshBasicMaterial
        color="#ff3300"
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = uniforms.current.uTime;
          shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
             float wave = sin(position.x * 6.0 + uTime * 2.5) * 0.04
                        + cos(position.y * 6.0 + uTime * 2.0) * 0.04;
             transformed.z += wave;
            `
          );
        }}
      />
      <pointLight color="#ff4400" intensity={3.0} distance={8} />
    </mesh>
  );
};

// ==========================================
// 3D Terrain Diorama Mesh
// ==========================================
interface TerrainMeshProps {
  category: string;
  subTerrain: string;
  wireframe: boolean;
  reliefScale: number;
  showAnnotations: boolean;
}

const TerrainMesh: React.FC<TerrainMeshProps> = ({
  category,
  subTerrain,
  wireframe,
  reliefScale,
  showAnnotations,
}) => {
  const normSub = resolveTerrainKey(subTerrain);
  const geometry = useMemo(() => {
    return generateTerrainGeometry(category, subTerrain, reliefScale);
  }, [category, subTerrain, reliefScale]);

  const annotations = TERRAIN_ANNOTATIONS[normSub] || [];

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Primary Terrain Mesh */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          wireframe={wireframe}
          roughness={category === 'arid' ? 0.95 : category === 'glacial' ? 0.35 : 0.78}
          metalness={category === 'glacial' ? 0.3 : 0.02}
        />
      </mesh>

      {/* Solid Diorama Pedestal Base */}
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[20.05, 20.05, 1.2]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.9} />
      </mesh>

      {/* Dynamic Water Bodies aligned with actual terrain depression levels */}
      {(normSub === '칼데라' ||
        normSub === '오아시스' ||
        normSub === '피오르드' ||
        normSub === '사주' ||
        normSub === '사주·사취' ||
        normSub === '석호' ||
        normSub === '파식대' ||
        normSub === '시스택' ||
        normSub === '시스택 (바위섬)' ||
        normSub === '해식애' ||
        normSub === '해식애 (해안 절벽)' ||
        normSub === '곡류천' ||
        normSub === '범람원' ||
        normSub === '삼각주' ||
        normSub === '권곡' ||
        normSub === '모레인' ||
        normSub === '폭포') && (
        <AnimatedWater
          position={[
            0,
            0,
            normSub === '칼데라'
              ? 1.35 * reliefScale
              : normSub === '오아시스'
              ? 0.55 * reliefScale
              : normSub === '피오르드'
              ? 0.75 * reliefScale
              : normSub === '권곡'
              ? 1.15 * reliefScale
              : normSub === '모레인'
              ? 1.05 * reliefScale
              : normSub === '석호'
              ? 0.48 * reliefScale
              : normSub === '파식대'
              ? 0.38 * reliefScale
              : normSub === '범람원'
              ? 0.38 * reliefScale
              : normSub === '폭포'
              ? 0.45 * reliefScale
              : 0.45 * reliefScale,
          ]}
          color={
            normSub === '오아시스'
              ? '#0d7c94'
              : normSub === '모레인'
              ? '#3ba3ba'
              : normSub === '권곡'
              ? '#2a949e'
              : normSub === '석호'
              ? '#14637d'
              : normSub === '피오르드'
              ? '#0a2e47'
              : '#00628f'
          }
        />
      )}

      {/* Active Lava Pool in Volcano Crater */}
      {normSub === '화산' && <AnimatedLava position={[0, 0, 2.3 * reliefScale]} />}

      {/* 3D Interactive Feature Annotation Pins */}
      {showAnnotations &&
        annotations.map((anno, idx) => {
          // Adjust z by relief scale and rotation (in group space, z is world Y)
          const adjustedPos: [number, number, number] = [
            anno.position[0],
            anno.position[2],
            anno.position[1] * reliefScale + 0.5,
          ];
          return (
            <group key={idx} position={adjustedPos}>
              <Html distanceFactor={14} center>
                <div className="group relative flex flex-col items-center pointer-events-auto cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-[#FFCC00] text-black font-bold flex items-center justify-center text-xs shadow-lg border-2 border-white animate-bounce">
                    {idx + 1}
                  </div>
                  <div className="absolute top-7 bg-black/90 text-white text-[11px] px-2.5 py-1.5 rounded shadow-xl border border-white/20 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex flex-col items-center pointer-events-none">
                    <span className="font-bold text-[#FFCC00]">{anno.name}</span>
                    <span className="text-[10px] text-gray-300 max-w-[140px] text-center leading-tight">
                      {anno.description}
                    </span>
                  </div>
                </div>
              </Html>
            </group>
          );
        })}
    </group>
  );
};

// ==========================================
// Main Export: Terrain3D Component
// ==========================================
interface Terrain3DProps {
  category: string;
  subTerrain: string;
}

export default function Terrain3D({ category, subTerrain }: Terrain3DProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [reliefScale, setReliefScale] = useState(1.0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const controlsRef = useRef<any>(null);

  const setCameraView = (view: 'perspective' | 'top' | 'front') => {
    if (!controlsRef.current) return;
    setAutoRotate(false);
    if (view === 'top') {
      controlsRef.current.object.position.set(0, 22, 0.01);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'front') {
      controlsRef.current.object.position.set(0, 3, 18);
      controlsRef.current.target.set(0, 1.5, 0);
    } else {
      controlsRef.current.object.position.set(0, 9, 15);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  };

  const normSub = resolveTerrainKey(subTerrain);
  const annotationList = TERRAIN_ANNOTATIONS[normSub] || [];

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden select-none">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 9, 15], fov: 45 }}>
        <Sky
          sunPosition={[100, 30, 80]}
          turbidity={category === 'arid' ? 6 : 0.2}
          rayleigh={category === 'arid' ? 1.8 : 0.6}
        />
        <Environment preset={category === 'volcanic' ? 'sunset' : category === 'glacial' ? 'dawn' : 'city'} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[12, 16, 8]} intensity={1.8} castShadow />
        <directionalLight position={[-10, 8, -10]} intensity={0.55} color="#c2d9ff" />
        <directionalLight position={[0, -10, 5]} intensity={0.25} color="#e6f0ff" />

        <React.Suspense fallback={null}>
          <TerrainMesh
            category={category}
            subTerrain={subTerrain}
            wireframe={wireframe}
            reliefScale={reliefScale}
            showAnnotations={showAnnotations}
          />
        </React.Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2 - 0.02}
          minDistance={4}
          maxDistance={32}
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
        />
      </Canvas>

      {/* Top Toolbar Controls */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-sm border border-white/10 pointer-events-auto shadow-md">
          <button
            onClick={() => setCameraView('perspective')}
            className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="기본 입체 뷰"
          >
            <Eye className="w-3.5 h-3.5 text-[#FFCC00]" />
            입체
          </button>
          <button
            onClick={() => setCameraView('top')}
            className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="수직 항공 뷰"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            항공뷰
          </button>
          <button
            onClick={() => setCameraView('front')}
            className="px-2.5 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="정면 횡단면 뷰"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            정면
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-sm border border-white/10 pointer-events-auto shadow-md">
          {/* Toggle Annotations */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${
              showAnnotations ? 'bg-[#FFCC00] text-black' : 'text-white/80 hover:bg-white/10'
            }`}
            title="지형 특징 핀 표시"
          >
            <MapPin className="w-3.5 h-3.5" />
            특징 핀
          </button>

          {/* Toggle Wireframe */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${
              wireframe ? 'bg-white text-black' : 'text-white/80 hover:bg-white/10'
            }`}
            title="등고선 격자망 보기"
          >
            <Grid className="w-3.5 h-3.5" />
            격자망
          </button>

          {/* Toggle Auto Rotation */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
              autoRotate ? 'text-[#FFCC00]' : 'text-white/40 hover:text-white'
            }`}
            title="자동 회전"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Bottom Controls: Relief Scale Slider & Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4 pointer-events-none z-20">
        {/* Relief exaggeration slider */}
        <div className="bg-black/70 backdrop-blur-md px-3 py-2 rounded-sm border border-white/10 pointer-events-auto flex items-center gap-2.5 text-xs text-white shadow-lg">
          <span className="text-gray-300 font-medium whitespace-nowrap">고저차: {reliefScale.toFixed(1)}x</span>
          <input
            type="range"
            min="0.6"
            max="1.5"
            step="0.1"
            value={reliefScale}
            onChange={(e) => setReliefScale(parseFloat(e.target.value))}
            className="w-20 sm:w-24 accent-[#FFCC00] cursor-pointer"
          />
        </div>

        {/* Status Badge */}
        <div className="bg-black/70 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-2 border border-white/10 pointer-events-none shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
          <span className="font-bold text-[#FFCC00]">{subTerrain}</span>
          <span className="text-gray-400 hidden sm:inline">• 정밀 지형 시뮬레이션</span>
        </div>
      </div>

      {/* Interactive Feature Annotations List (Drawer hint on bottom left if pins enabled) */}
      {showAnnotations && annotationList.length > 0 && (
        <div className="absolute left-3 top-16 hidden md:flex flex-col gap-1 pointer-events-auto max-w-[210px] z-10">
          <div className="bg-black/75 backdrop-blur-md p-2 rounded-sm border border-white/10 text-white text-[11px] shadow-lg">
            <div className="flex items-center gap-1 font-bold text-[#FFCC00] mb-1.5 pb-1 border-b border-white/10">
              <Sparkles className="w-3 h-3" />
              핵심 지형 포인트 ({annotationList.length})
            </div>
            <div className="space-y-1">
              {annotationList.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5 text-gray-300 leading-tight">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFCC00] text-black font-bold flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium text-white">{a.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
