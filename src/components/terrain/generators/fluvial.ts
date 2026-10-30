import * as THREE from 'three';
import { fbm, smoothstep, mixColor, TerrainEvalResult } from '../terrainMath';

export function evalFluvialTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // 1. 선상지 (산록 완경사 퇴적 부채꼴 지형 - 구례 선상지, 미국 데스밸리 선상지)
  if (normSub === '선상지') {
    // 산지 계곡 출구(Apex / 선정, y = -4.5, x = 0)
    const apexX = 0;
    const apexY = -4.5;
    const dx = x - apexX;
    const dy = y - apexY;
    const distFromApex = Math.sqrt(dx * dx + dy * dy);
    const fanAngle = Math.atan2(dx, dy); // y축 기준 방사 각도

    if (dy < 0) {
      // 상류 협곡 산지: 험준한 V자 계곡
      const canyonWall = Math.abs(x) * 1.3 + Math.abs(dy) * 0.4;
      h = (1.2 + canyonWall + fbm(x * 0.8, y * 0.8) * 0.5) * reliefScale;
      color.set(mixColor('#473a2d', '#5a4c3d', fbm(x * 3, y * 3)));
    } else {
      // 부채꼴 선상지 본체 (반경 각도 -55도 ~ +55도 부채꼴 형태)
      const inFanSector = Math.abs(fanAngle) < 0.95;
      
      if (inFanSector) {
        // 선정 -> 선앙 -> 선단으로 갈수록 완만해지는 방사상 원추 경사면
        const fanSlope = Math.max(0, 3.8 * Math.pow(1.0 - Math.min(1.0, distFromApex / 9.5), 1.25));
        
        // 선앙(Mid-fan)의 망상 수계(Braided Channels) 자갈 하천 홈
        const braidedChannels = Math.sin(fanAngle * 14.0 + fbm(x * 0.8, y * 0.8) * 3.0) * 0.18;

        h = (0.35 + fanSlope + braidedChannels + fbm(x * 1.2, y * 1.2) * 0.08) * reliefScale;

        if (distFromApex < 2.5) {
          // 선정 (Fan Apex): 거대한 각력과 굵은 호박돌 자갈 퇴적
          color.set(mixColor('#6b6155', '#82786b', fbm(x * 6, y * 6)));
        } else if (distFromApex < 6.5) {
          // 선앙 (Mid Fan): 자갈-모래층으로 물이 지하로 스며드는 복류천(Underground seepage) 구간 (과수원 지대)
          color.set(mixColor('#87785c', '#9e8d6e', fbm(x * 4, y * 4)));
        } else {
          // 선단 (Fan Toe): 복류하던 지하수가 솟아나는 용천대(Spring line)와 비옥한 논농사 녹지
          color.set(mixColor('#2b5e23', '#3d7a33', fbm(x * 3, y * 3)));
        }
      } else {
        // 선상지 측면을 감싸는 배후 산지
        h = (1.5 + Math.abs(x) * 0.6 + fbm(x * 0.6, y * 0.6) * 0.6) * reliefScale;
        color.set(mixColor('#384f29', '#4d6b38', fbm(x * 2, y * 2)));
      }
    }
    return { height: h, color };
  }

  // 2. 곡류천 & 우각호 (자유 곡류와 유로 절단으로 형성된 쇠뿔 모양 호수 - 회룡포, 한반도지형)
  if (normSub === '곡류천') {
    // 아름다운 S자 오메가(Ω) 자유 곡류 유로
    const riverY = y;
    const riverX = Math.sin(riverY * 0.5) * 3.2 - Math.sin(riverY * 1.0) * 0.8;
    const distToRiver = Math.abs(x - riverX);

    // 구하도 유로 절단으로 완전히 격리된 초승달 모양 우각호 (Oxbow Lake)
    const oxCenterX = -2.4;
    const oxCenterY = 2.4;
    const oxDist = Math.sqrt(Math.pow(x - oxCenterX, 2) + Math.pow(y - oxCenterY, 2));
    const isOxbowRing = Math.abs(oxDist - 1.8) < 0.45 && (x < -1.2);

    // 평야 기저면
    h = (1.6 + fbm(x * 0.3, y * 0.3) * 0.2) * reliefScale;

    if (distToRiver < 1.0) {
      // 활동 하천 수로 (하식애 vs 활주사면 비대칭 횡단면)
      const riverDepth = Math.cos((distToRiver / 1.0) * Math.PI * 0.5) * 1.4;
      h -= riverDepth * reliefScale;
      color.set(mixColor('#134854', '#1f6575', fbm(x * 6, y * 6)));
    } else if (isOxbowRing) {
      // 우각호 수면
      h = (0.45 + fbm(x * 3, y * 3) * 0.05) * reliefScale;
      color.set(mixColor('#16423a', '#245e54', fbm(x * 4, y * 4)));
    } else {
      // 포인트바(활주사면) 모래톱 vs 하식애(공격사면) 절벽
      const isPointBar = (x > riverX && riverY > 0) || (x < riverX && riverY < 0);
      if (distToRiver < 1.8 && isPointBar) {
        color.set(mixColor('#d1ba86', '#e0ca99', fbm(x * 4, y * 4)));
      } else {
        // 비옥한 범람원 충적 평야
        color.set(mixColor('#3f662d', '#53823c', fbm(x * 2, y * 2)));
      }
    }
    return { height: h, color };
  }

  // 3. 범람원 (홍수 시 토사가 퇴적된 자연제방 & 배후습지 - 낙동강, 한강 하류)
  if (normSub === '범람원') {
    // 중심부를 관류하는 하천
    const riverX = Math.sin(y * 0.4) * 1.8;
    const distToRiver = Math.abs(x - riverX);

    // 하천 바로 옆에 솟아오른 미고지 자연제방(Natural Levee, 배수 양호, 취락/도로 발달)
    const leveeDist = Math.abs(distToRiver - 1.6);
    const naturalLevee = Math.exp(-Math.pow(leveeDist / 0.7, 2)) * 1.4;

    // 자연제방 배후의 낮고 배수가 불량한 배후습지(Backswamp, 점토질, 논농사/습지)
    const isBackswamp = distToRiver > 2.6;
    const backswampDip = isBackswamp ? 0.45 : 0;

    h = (0.8 + naturalLevee - backswampDip + fbm(x * 0.8, y * 0.8) * 0.12) * reliefScale;

    if (distToRiver < 0.9) {
      // 하천 수로
      h = (0.2 + fbm(x * 2, y * 2) * 0.05) * reliefScale;
      color.set(mixColor('#1a4d57', '#256775', fbm(x * 5, y * 5)));
    } else if (leveeDist < 0.6) {
      // 자연제방: 사질 양토의 밝은 황토색 및 과수원/취락 지대
      color.set(mixColor('#8f7850', '#a88f63', fbm(x * 4, y * 4)));
    } else {
      // 배후습지: 짙은 흑갈색 유기물 실트질 토양 및 푸른 논 습지
      color.set(mixColor('#2c4a22', '#3a5e2f', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 4. 삼각주 (하천이 바다로 유입되며 토사를 부채꼴로 퇴적한 지형 - 낙동강 삼각주, 미시시피 삼각주)
  if (normSub === '삼각주') {
    // 상류(북쪽 y < -3)에서 해안(남쪽 y > 0)으로 진행하며 방사상 분기(Distributaries)
    const distProg = (y + 4.5) / 9.0;
    
    // 조족상/호상 삼각주 엽상체(Delta lobes)
    const mainBranch1 = Math.sin(y * 0.35) * (1.2 + distProg * 3.5);
    const mainBranch2 = -Math.cos(y * 0.35) * (0.8 + distProg * 3.2);

    const dBranch1 = Math.abs(x - mainBranch1);
    const dBranch2 = Math.abs(x - mainBranch2);
    const inWater = (y > -3 && (dBranch1 < 0.6 || dBranch2 < 0.55)) || (y > 3.8);

    h = (0.35 + Math.max(0, 1.2 * (1.0 - distProg)) + fbm(x * 1.5, y * 1.5) * 0.08) * reliefScale;

    if (inWater) {
      h = (0.18 + fbm(x * 2, y * 2) * 0.05) * reliefScale;
      color.set(mixColor('#14404f', '#1b566b', fbm(x * 4, y * 4)));
    } else if (distProg > 0.6) {
      // 하구 사주(Mouth bars) 및 삼각주 저습지 갈대밭
      color.set(mixColor('#4a6e38', '#5e8547', fbm(x * 5, y * 5)));
    } else {
      // 삼각주 평야 논농사 충적토
      color.set(mixColor('#385e2b', '#487538', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 5. 하안단구 (지반 융기와 하천 하방침식으로 형성된 계단식 지형 - 영월 정선 동강 하안단구)
  if (normSub === '하안단구') {
    // 깊게 굽이쳐 흐르는 감입곡류 하천(Incision canyon)
    const riverPath = Math.sin(y * 0.5) * 2.2;
    const distToRiver = Math.abs(x - riverPath);

    // 하천 양안에 형성된 다단식 계단상 단구면(T1, T2, T3 단구)
    let terraceLevel = 0;
    if (distToRiver > 3.4) terraceLevel = 3;      // 고위 단구면 (T3)
    else if (distToRiver > 2.2) terraceLevel = 2; // 중위 단구면 (T2)
    else if (distToRiver > 1.2) terraceLevel = 1; // 저위 단구면 (T1)
    else terraceLevel = 0;                        // 현생 하상 (Active riverbed)

    // 급격한 수직 단구애(Terrace scarp cliff)
    const scarpEdge = (distToRiver - (terraceLevel * 1.1 + 0.1)) < 0.25;

    h = (0.35 + terraceLevel * 1.25 + fbm(x * 0.6, y * 0.6) * 0.12) * reliefScale;

    if (terraceLevel === 0) {
      // 푸른 감입곡류 하천
      color.set(mixColor('#154b57', '#226978', fbm(x * 5, y * 5)));
    } else if (scarpEdge) {
      // 단구애 자갈층(Round gravel / 둥근 자갈층) 노출 단면
      color.set(mixColor('#6b5d4e', '#857462', fbm(x * 7, y * 7)));
    } else {
      // 평탄한 단구면 위 전답 및 마을 터
      color.set(mixColor('#416130', '#567e42', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 6. 폭포 (경암층과 연암층의 차별침식으로 쏟아지는 폭포와 깊은 폭호 - 나이아가라, 정방폭포)
  if (normSub === '폭포') {
    // 상류 경암층 평탄면(y < -0.5)과 폭포수 낭떠러지 단애(y = 0)
    const fallLipY = Math.sin(x * 0.4) * 0.4;
    const distToFall = y - fallLipY;

    // 하천 수로 중심선
    const streamX = Math.sin(y * 0.3) * 0.8;
    const distToStream = Math.abs(x - streamX);

    // 폭포 직하부 거대한 원형 폭호 (Plunge Pool)
    const poolDist = Math.sqrt(Math.pow(x - streamX, 2) + Math.pow(y - 1.2, 2));
    const inPlungePool = poolDist < 1.8;

    if (distToFall < 0) {
      // 상류 저항성 경암층(Caprock) 하상
      const channel = distToStream < 1.1 ? Math.cos((distToStream / 1.1) * Math.PI * 0.5) * 0.6 : 0;
      h = (4.4 - channel + fbm(x * 0.8, y * 0.8) * 0.15) * reliefScale;
      color.set(mixColor('#384e2e', '#4f6c42', fbm(x * 3, y * 3)));
    } else if (inPlungePool) {
      // 폭호 바닥 (낙하하는 수압으로 파여진 깊은 와혈 바닥)
      h = (0.28 + fbm(x * 2, y * 2) * 0.05) * reliefScale;
      color.set(mixColor('#0d3b45', '#165763', fbm(x * 4, y * 4)));
    } else if (distToFall < 1.0) {
      // 폭포 배후면 침식된 동굴성 하부 연암층(Undercut alcove)
      h = (0.6 + fbm(x * 3, y * 3) * 0.2) * reliefScale;
      color.set(mixColor('#2e2925', '#403934', fbm(x * 6, y * 6)));
    } else {
      // 하류 깊게 파인 협곡 양안 암벽
      const gorgeH = Math.min(3.8, Math.pow(distToStream / 1.8, 1.2) * 3.4);
      h = (0.6 + gorgeH + fbm(x * 0.7, y * 0.7) * 0.2) * reliefScale;
      color.set(mixColor('#473d34', '#5e5246', fbm(x * 4, y * 4)));
    }
    return { height: h, color };
  }

  return null;
}
