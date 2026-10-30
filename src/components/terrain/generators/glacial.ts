import * as THREE from 'three';
import { fbm, smoothstep, mixColor, TerrainEvalResult } from '../terrainMath';

export function evalGlacialTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const d = Math.sqrt(x * x + y * y);
  const color = new THREE.Color();
  let h = 0;

  // 1. 혼 (빙하 침식으로 깎인 날카로운 4각 뿔 봉우리 - 전형적 마터호른/피라미달 피크)
  if (normSub === '혼') {
    // 혼(Pyramidal Peak / Horn)은 3~4개의 빙하 권곡(Cirque)이 사방에서 산체를 갉아먹어 형성된
    // 웅장하고 날카로운 피라미드형 바위산입니다.
    // 4개 주능선(Arêtes / 아레테)이 대각선 방향(북동, 북서, 남동, 남서)으로 뻗어 나가며,
    // 그 사이 4대 사면(북벽, 남벽, 동벽, 서벽)은 빙하의 두부침식으로 거대하게 오목 파여 있습니다.

    const r = Math.hypot(x, y);
    const angle = Math.atan2(y, x);

    // 4대 대각선 아레테(칼날 능선) 축까지의 수직 거리 계산
    // 대각선 1: y = x  => |x - y| / sqrt(2)
    // 대각선 2: y = -x => |x + y| / sqrt(2)
    const invSqrt2 = 0.70710678;
    const distToDiag1 = Math.abs(x - y) * invSqrt2;
    const distToDiag2 = Math.abs(x + y) * invSqrt2;
    const distToRidge = Math.min(distToDiag1, distToDiag2);

    // 1) [중심 첨두 코어 (Horn Spire Core)]
    // 정상을 향해 지수함수적으로 가파르게 치솟는 오목한 피라미드 단면 (Concave profile)
    // r=0에서 6.4 높이까지 날카롭게 솟구침
    const peakCore = 6.4 * Math.exp(-r * 0.28) * (1.0 - smoothstep(6.5, 9.2, r));

    // 2) [칼날 능선 (Arêtes / 아레테 강화)]
    // 능선 축선(distToRidge = 0)을 따라 솟아오르는 날카로운 능선 뼈대
    const areteRidge = 1.85 * Math.exp(-distToRidge / 0.55) * Math.exp(-r * 0.18) * (1.0 - smoothstep(6.8, 9.2, r));
    // 아레테 능선 상의 톱니바퀴형 암봉(Gendarmes 침봉) 요철
    const areteGendarmes = Math.sin(r * 4.5 + fbm(x * 2.0, y * 2.0) * 2.5) * 0.22 * Math.exp(-distToRidge / 0.35);

    // 3) [4대 권곡 협벽의 거대한 오목 함몰 (Cirque Headwall Scoops)]
    // 능선과 능선 사이의 4대 거벽(북벽, 남벽, 동벽, 서벽)은 빙하가 깊숙이 파내어 거대한 오목 절벽 형성
    const maxFaceDist = r * invSqrt2; // 능선에서 가장 먼 면 중심거리
    const faceRatio = maxFaceDist > 0.001 ? Math.min(1.0, distToRidge / (maxFaceDist * 0.85)) : 0;
    const cirqueHollow = -2.1 * Math.pow(faceRatio, 1.8) * smoothstep(1.0, 4.8, r) * (1.0 - smoothstep(6.5, 9.0, r));

    // 4) [기저부 권곡 바닥 및 북벽 권곡호(Tarn) 분지]
    // 북쪽 사면(x≈0, y>4.0)에 형성된 빙하의 요람 권곡(카르) 분지
    const northCirqueDist = Math.hypot(x, y - 5.2);
    let tarnBasin = 0;
    if (northCirqueDist < 1.8) {
      const tarnT = 1.0 - (northCirqueDist / 1.8);
      tarnBasin = -0.55 * Math.pow(tarnT, 1.5); // 호수 바닥 오목 와지
    }

    // 5) [기저부 애추(Talus/Scree) 완경사면]
    const baseSlope = 0.55 + 0.35 * Math.exp(-Math.pow((r - 6.2) / 2.0, 2.0));

    // 미세 암벽 절리 및 층리 노이즈
    const rockStrata = fbm(x * 1.8, y * 1.8) * 0.18 + Math.sin(x * 3.0 - y * 3.0) * 0.08 * smoothstep(1.5, 5.0, r);

    h = (peakCore + areteRidge + areteGendarmes + cirqueHollow + tarnBasin + baseSlope + rockStrata) * reliefScale;
    h = Math.max(0.28, h);

    // ==========================================
    // 지질학적 색상 분포 (마터호른 변성퇴적암 및 만년설/눈골)
    // ==========================================
    const isTarnWater = northCirqueDist < 1.4 && h < 0.75 * reliefScale;

    if (isTarnWater) {
      // 권곡호(Tarn): 빙하 록플라워(Rock flour)가 부유하는 에메랄드 청록빛 호수
      color.set(mixColor('#145869', '#1e7b8c', fbm(x * 4, y * 4)));
    } else {
      // 4대 암벽의 쿠루아르(Couloir, 눈골) 및 밴드 눈자국
      const couloirNoise = Math.sin(r * 4.2 + angle * 8.0 + fbm(x * 3, y * 3) * 3.0);
      const isSnowChute = couloirNoise > 0.45 && r > 1.2 && r < 5.8;

      if (h > 4.6 * reliefScale) {
        // 정상 첨두부: 칼바람에 깎인 새하얀 만년설과 설벽
        color.set(mixColor('#e8f1f5', '#ffffff', fbm(x * 6, y * 6)));
      } else if (h > 2.8 * reliefScale) {
        // 중상부 거벽(암벽): 깎아지른 수직 편마암/편암 지층 + 눈골(Couloir) 만년설
        if (isSnowChute) {
          // 암벽 홈에 박힌 단단한 빙설
          color.set(mixColor('#d9e5eb', '#eef5f8', fbm(x * 5, y * 5)));
        } else {
          // 눈이 쌓이지 못하고 드러난 흑갈색 수직 거벽 암반
          const strataLine = Math.sin(h * 8.0 + fbm(x * 2, y * 2) * 2.0) * 0.5 + 0.5;
          color.set(mixColor('#38332f', '#544d46', strataLine));
        }
      } else if (h > 1.4 * reliefScale) {
        // 중하부 암설 사면: 동결파쇄로 부서진 애추(Scree / Talus) 모서리진 바위지대
        color.set(mixColor('#5c564e', '#736b62', fbm(x * 4, y * 4)));
      } else {
        // 산록 기저부: 한대 고산 툰드라 이끼 및 지의류 초지
        color.set(mixColor('#465437', '#596b46', fbm(x * 3, y * 3)));
      }
    }

    return { height: h, color };
  }

  // 2. U자곡 & 피오르드 (빙하가 계곡을 깎아 만든 수직 절벽과 평탄한 바닥 - 노르웨이 가이랑에르, 뉴질랜드 밀포드 사운드)
  if (normSub === 'U자곡' || normSub === '피오르드') {
    const valleyX = Math.sin(y * 0.3) * 1.2;
    const distToValley = Math.abs(x - valleyX);

    // 완벽한 U자형 빙식곡 단면 함수: 바닥은 넓고 평탄하며 양안은 수직에 가까운 급경사
    const uFloorWidth = 2.4;
    const uSlope = Math.pow(Math.max(0, distToValley - uFloorWidth * 0.5) / 2.2, 2.6);
    
    // 측면 현곡(Hanging Valley) - 폭포수가 쏟아지는 지류 빙식곡
    const isHangingValley = (y > 1.2 && y < 2.8 && x < -2.8);
    const hangingFloor = isHangingValley ? 2.2 : 0;

    h = (0.45 + Math.min(4.8, uSlope * 3.6) + hangingFloor + fbm(x * 0.7, y * 0.7) * 0.2) * reliefScale;

    if (normSub === '피오르드' && distToValley < uFloorWidth * 0.8) {
      // 피오르드: 깊은 바닷물이 채워진 짙은 코발트블루 해수면
      h = (0.28 + fbm(x * 2, y * 2) * 0.05) * reliefScale;
      color.set(mixColor('#0a2638', '#113c54', fbm(x * 4, y * 4)));
    } else if (distToValley < uFloorWidth * 0.8) {
      // 내륙 U자곡: 퇴적토가 깔린 평탄한 빙식곡 바닥 초원
      color.set(mixColor('#385e32', '#4b7842', fbm(x * 3, y * 3)));
    } else if (h > 3.6 * reliefScale) {
      // 고원 위 잔설과 회색 기반암
      color.set(mixColor('#828a91', '#9ca4ab', fbm(x * 4, y * 4)));
    } else {
      // 빙하 찰흔(Glacial striations)이 새겨진 수직 암벽
      color.set(mixColor('#4a4846', '#63605d', fbm(x * 5, y * 5)));
    }
    return { height: h, color };
  }

  // 3. 권곡 (빙하의 발원지로 반원형 안락의자 모양의 오목한 산정 분지 - 백두산 천지 칼데라와 구분되는 카르/Cirque)
  if (normSub === '권곡') {
    // 웅장한 말발굽형(안락의자형) 권곡벽(Cirque Headwall)
    const headwallDist = Math.sqrt(Math.pow(x, 2) + Math.pow(y + 1.8, 2));
    const isHeadwall = y < 1.0;
    
    let bowlH = 0;
    if (isHeadwall) {
      // 수직 300m 이상의 웅장한 급경사 암벽
      bowlH = Math.pow(Math.max(0, headwallDist - 1.8) / 3.2, 1.8) * 4.6;
    } else {
      // 하류 쪽 빙하 유출 턱(Rock Threshold / 권곡 턱)
      const lip = Math.exp(-Math.pow((y - 2.2) / 0.8, 2)) * 1.6;
      bowlH = lip;
    }

    // 권곡 바닥 빙식호(Tarn / 산정 호수) 분지
    const isTarn = Math.sqrt(Math.pow(x, 2) + Math.pow(y - 0.2, 2)) < 1.6;

    h = (0.55 + bowlH + fbm(x * 0.8, y * 0.8) * 0.25) * reliefScale;

    if (isTarn) {
      // 빙하 유백색 침전물이 섞인 신비로운 옥빛 권곡호(Tarn Lake)
      h = (0.35 + fbm(x * 2, y * 2) * 0.05) * reliefScale;
      color.set(mixColor('#165969', '#247a8c', fbm(x * 4, y * 4)));
    } else if (isHeadwall && headwallDist > 2.2) {
      // 깎아지른 권곡벽 암벽과 빙하 찰흔
      color.set(mixColor('#47433f', '#5e5954', fbm(x * 6, y * 6)));
    } else {
      // 빙퇴석 더미 및 한대 식생
      color.set(mixColor('#4c5e3d', '#5f754c', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 4. 모레인 (빙하가 운반해 쌓아놓은 미분급 자갈/토사 제방 - 알프스, 칠레 빙하지대)
  if (normSub === '모레인') {
    // 말발굽 모양의 종퇴석(Terminal Moraine Ridge, y = 1.0)
    const moraineArc = Math.sqrt(Math.pow(x, 2) + Math.pow(y - 0.2, 2));
    const distToRidge = Math.abs(moraineArc - 3.2);
    const terminalRidge = Math.exp(-Math.pow(distToRidge / 0.9, 2)) * 2.8;

    // 양측 측퇴석(Lateral Moraines)
    const lateral1 = Math.exp(-Math.pow((x - (-3.0)) / 0.8, 2)) * smoothstep(0, -4, y) * 2.4;
    const lateral2 = Math.exp(-Math.pow((x - 3.0) / 0.8, 2)) * smoothstep(0, -4, y) * 2.4;

    // 빙퇴석 제방 안쪽에 갇힌 빙하 융설수 말단호(Proglacial Lake)
    const inLake = (moraineArc < 2.9 && y < 1.0);

    h = (0.4 + terminalRidge + lateral1 + lateral2 + fbm(x * 1.5, y * 1.5) * 0.18) * reliefScale;

    if (inLake) {
      // 빙하 록플라워(Rock flour)가 부유하는 우윳빛 청록색 호수
      h = (0.28 + fbm(x * 2, y * 2) * 0.05) * reliefScale;
      color.set(mixColor('#196366', '#268a8f', fbm(x * 4, y * 4)));
    } else if (distToRidge < 0.6) {
      // 모레인 능선: 모서리가 각진 거대한 표이암(Erratic boulders)과 자갈 더미
      color.set(mixColor('#695e52', '#827566', fbm(x * 7, y * 7)));
    } else {
      // 외곽 툰드라 초원
      color.set(mixColor('#425736', '#546e45', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  return null;
}
