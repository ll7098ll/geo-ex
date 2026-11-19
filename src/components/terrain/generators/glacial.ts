import * as THREE from 'three';
import {
  fbm,
  warpedFbm,
  ridgedFbm,
  smoothstep,
  smin,
  clamp,
  sdSegment,
  mixColor,
  TerrainEvalResult,
} from '../terrainMath';

export function evalGlacialTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // =========================================================================
  // 1. 혼 (빙하 권곡의 두부침식이 빚어낸 비대칭 4각 피라미드 첨봉: 마터호른, 아마다블람)
  // 도메인 워핑된 4대 칼날 능선(아레테) + 4면 오목 권곡 거벽 + 암석 턱으로 둘러싸인 북벽 권곡호
  // =========================================================================
  if (normSub === '혼') {
    // 1) 완벽한 45° X자 대칭을 탈피하기 위해 좌표계를 자연스럽게 굴곡(Domain warp)시키고 정상부를 약간 비틀어 조형
    const summitX = 0.15;
    const summitY = 0.20;
    const wx =
      (x - summitX) +
      0.58 * Math.sin(y * 0.25 + 0.4) +
      (fbm(x * 0.28, y * 0.28, 3) - 0.5) * 0.72;
    const wy =
      (y - summitY) +
      0.52 * Math.cos(x * 0.25 - 0.3) +
      (fbm(y * 0.28 + 4.1, x * 0.28, 3) - 0.5) * 0.72;

    const r = Math.hypot(wx, wy);
    const angle = Math.atan2(wy, wx);

    // 4대 비대칭 아레테(Arêtes: 북동 회른리 능선, 남서 리옹 능선, 북서 츠무트 능선, 남동 푸르겐 능선)
    const invSqrt2 = 0.70710678;
    const distDiag1 = Math.abs(wx * 0.74 - wy * 0.67);
    const distDiag2 = Math.abs(wx * 0.66 + wy * 0.75);
    const distToRidge = Math.min(distDiag1, distDiag2);

    // 2) 중심 피라미드 첨두 코어 (1.6x 고도 과장에서도 화면 상단이 잘리지 않는 균형 잡힌 ~5.8m 첨봉!)
    const peakCore = 4.35 * Math.exp(-r * 0.27) * (1.0 - smoothstep(6.8, 9.5, r));

    // 3) 아레테 칼날 능선 및 침봉(Gendarmes) 요철
    const areteStrength = 1.18 * Math.exp(-distToRidge / 0.52) * Math.exp(-r * 0.17) * (1.0 - smoothstep(7.0, 9.4, r));
    const areteGendarmes =
      (ridgedFbm(x * 1.4, y * 1.4, 3) - 0.45) * 0.30 * Math.exp(-distToRidge / 0.38) * smoothstep(0.6, 4.5, r);

    // 4) 능선 사이 4대 거벽의 깊은 오목 권곡 스쿱 (Cirque Headwall Scoops)
    const maxFaceDist = Math.max(0.001, r * invSqrt2);
    const faceRatio = clamp(distToRidge / (maxFaceDist * 0.84), 0.0, 1.0);
    const cirqueHollow = -1.52 * Math.pow(faceRatio, 1.75) * smoothstep(0.95, 4.6, r) * (1.0 - smoothstep(6.4, 9.0, r));

    // 5) 북벽 권곡호(North Tarn at (0, 5.2)): 바깥쪽에 암석 문턱(Rock lip)을 세워 호수가 밖으로 절대 새지 않게 함!
    const dNorthTarn = Math.hypot(x / 1.65, (y - 5.2) / 1.45);
    const northTarnScoop = dNorthTarn < 1.0 ? -0.52 * Math.pow(1.0 - dNorthTarn * dNorthTarn, 1.4) : 0;
    const northTarnLip =
      dNorthTarn >= 0.85 && dNorthTarn < 1.55
        ? Math.exp(-Math.pow((dNorthTarn - 1.15) / 0.28, 2.0)) * 0.38
        : 0;

    // 기저부 애추(Talus) 및 빙퇴석 사면
    const baseSlope = 0.54 + 0.30 * Math.exp(-Math.pow((r - 6.0) / 2.2, 2.0));
    const rockStrata =
      fbm(x * 1.8, y * 1.8) * 0.12 + Math.sin(x * 2.8 - y * 2.6) * 0.06 * smoothstep(1.2, 5.0, r);

    const rawH = Math.max(
      0.26,
      peakCore + areteStrength + areteGendarmes + cirqueHollow + northTarnScoop + northTarnLip + baseSlope + rockStrata
    );
    h = rawH * reliefScale;

    if (dNorthTarn < 0.92 && rawH < 0.68) {
      // 북벽 권곡호(Tarn): 빙하 록플라워가 녹아든 옥빛 산정호수
      color.set(mixColor('#125666', '#1e7c8f', fbm(x * 4, y * 4)));
    } else {
      // 부드러운 연속 그라데이션 기반 만년설·설골(Couloir) 블렌딩 (하드 줄무늬 제거!)
      const tundraCol = mixColor('#435435', '#586e46', fbm(x * 3, y * 3));
      const talusCol = mixColor('#59534b', '#756d63', fbm(x * 4, y * 4));
      const strataLine = Math.sin(rawH * 9.0 + x * 0.7 + fbm(x * 2, y * 2) * 1.6) * 0.5 + 0.5;
      const gneissCol = mixColor('#34302c', '#5c554e', strataLine);
      const snowCol = mixColor('#dce9f2', '#f7fbff', fbm(x * 5, y * 5));

      const talusT = smoothstep(0.95, 1.55, rawH);
      const cliffT = smoothstep(1.85, 2.65, rawH);
      color.copy(tundraCol).lerp(talusCol, talusT).lerp(gneissCol, cliffT);

      // 오목한 거벽 설골과 고산 정상부에만 자연스럽게 쌓이는 만년설 (칼날 아레테 능선은 흑갈색 암벽 노출!)
      const couloirField = fbm(x * 0.85 + Math.cos(angle) * 0.6, y * 0.85 + Math.sin(angle) * 0.6, 3);
      const ridgeExposure = Math.exp(-distToRidge / 0.55) * smoothstep(0.8, 4.5, r);
      const couloirSnow =
        smoothstep(0.48, 0.72, couloirField) *
        smoothstep(0.32, 0.82, faceRatio) *
        smoothstep(1.85, 2.85, rawH) *
        (1.0 - ridgeExposure * 0.85);
      const summitSnow = smoothstep(3.55, 4.65, rawH + (fbm(x * 2.2, y * 2.2) - 0.5) * 0.45);
      const snowWeight = clamp(Math.max(summitSnow, couloirSnow * 0.88), 0.0, 0.94);
      color.lerp(snowCol, snowWeight);
    }
    return { height: h, color };
  }

  // =========================================================================
  // 2. U자곡 (평탄한 초원 곡저 + 수직 빙식절벽 + 절벽을 실제로 파낸 현곡(Hanging Valley) + 양배암: 요세미티, 라우터브루넨)
  // 곡저 전체가 물에 잠기지 않고, 넓은 빙식 초원 중앙으로 좁은 융빙수 시내만 흐르며 좌측 절벽 상단에 현곡이 파여 있음!
  // =========================================================================
  if (normSub === 'U자곡') {
    const valleyX = Math.sin(y * 0.25) * 1.15;
    const distValley = Math.abs(x - valleyX);

    // 1) 본류 U자형 빙식곡 단면 (바닥 반폭 2.05m는 평탄하고, 양안은 78° 급경사 화강암 거벽으로 솟구침)
    const floorHalfW = 2.05;
    const wallOffset = Math.max(0, distValley - floorHalfW);
    const uWallRise = Math.min(4.45, Math.pow(wallOffset / 1.85, 2.25) * 3.85);
    const alpineShoulder = smoothstep(1.6, 5.5, wallOffset) * (0.55 + ridgedFbm(x * 0.5, y * 0.5, 3) * 0.45);
    let trunkH = 0.58 + uWallRise + alpineShoulder + fbm(x * 0.8, y * 0.8) * 0.12;

    // 2) 좌측(서쪽, x < valleyX - 2.6) 절벽 상단을 실제로 깎아 파낸 지류 현곡(Hanging Valley: y ≈ 1.45)!
    // 절벽이 h = 2.72m에 도달하는 실제 림(x ≈ valleyX - 3.45)까지 매끄럽게 파내어 현곡 폭포와 정확히 정렬!
    const hvAxisY = 1.45 + Math.sin((x + 4.0) * 0.35) * 0.40;
    const distHV = Math.abs(y - hvAxisY);
    if (x < valleyX - 2.3) {
      const hvStreamCut = (1.0 - smoothstep(0.18, 0.46, distHV)) * 0.16;
      const hvFloor = 2.72 - hvStreamCut + Math.max(0, -x - 3.6) * 0.06 + fbm(x * 1.5, y * 1.5) * 0.04;
      const hvWall = Math.pow(Math.max(0, distHV - 0.65) / 1.05, 2.1) * 2.35;
      const hangingTroughH = hvFloor + hvWall;
      const hvBlendMask = smoothstep(valleyX - 2.75, valleyX - 3.55, x);
      const carvedH = smin(trunkH, hangingTroughH, 0.32);
      trunkH = trunkH * (1.0 - hvBlendMask) + carvedH * hvBlendMask;
    }

    // 3) 평탄한 U자곡 바닥 위 비대칭 양배암(Roche Moutonnée: 연속 함수로 상류 완경사 마식면 vs 하류 급경사 뜯김면 조형!)
    const rmDx = (x - (valleyX + 0.85)) / 0.58;
    const rmDy = (y + 2.5) / 1.15;
    const rmDist = Math.hypot(rmDx, rmDy);
    const leeSteepMod = 0.36 + 0.13 * (1.0 - smoothstep(-0.42, 0.18, rmDy));
    const rocheMoutonnee =
      rmDist < 1.0 ? Math.pow(1.0 - rmDist * rmDist, 1.35) * leeSteepMod : 0;

    // 4) 곡저 초원을 굽이쳐 흐르는 좁은 융빙수 하천 + 절벽 직하부(x = valleyX - 2.22, y = 1.45) 현곡 폭호 & 합류 소하천!
    const streamX = valleyX - 0.25 + Math.sin(y * 0.68) * 0.52;
    const distStream = Math.abs(x - streamX);
    const streamCut = (1.0 - smoothstep(0.18, 0.52, distStream)) * 0.34;
    const plungeX = Math.sin(1.45 * 0.25) * 1.15 - 2.22;
    const plungePoolDist = Math.hypot((x - plungeX) / 0.82, (y - 1.45) / 0.78);
    const plungeCut = (1.0 - smoothstep(0.28, 1.0, plungePoolDist)) * 0.34;
    // 폭호에서 본류 융빙수 시내로 합류하는 짧은 연결 유로
    const streamXAtFall = Math.sin(1.45 * 0.25) * 1.15 - 0.25 + Math.sin(1.45 * 0.68) * 0.52;
    const feederSeg = sdSegment(x, y, plungeX, 1.45, streamXAtFall, 1.15);
    const feederCut = (1.0 - smoothstep(0.16, 0.44, feederSeg.dist)) * 0.28;

    const rawH = Math.max(0.22, trunkH + rocheMoutonnee - Math.max(streamCut, Math.max(plungeCut, feederCut)));
    h = rawH * reliefScale;

    const isHangingStream = x < valleyX - 3.28 && distHV < 0.42;

    if ((distStream < 0.45 || plungePoolDist < 0.85 || feederSeg.dist < 0.38) && rawH < 0.46) {
      // 곡저 융빙수 시내 및 현곡 폭호
      color.set(mixColor('#145566', '#22788c', fbm(x * 5, y * 5)));
    } else if (isHangingStream && rawH < 3.15) {
      // 현곡 바닥을 흐르는 고산 빙하 계류
      color.set(mixColor('#186173', '#29899e', fbm(x * 5, y * 5)));
    } else if (rocheMoutonnee > 0.12) {
      // 빙하 찰흔이 새겨진 회백색 화강암 양배암 노두
      color.set(mixColor('#75787a', '#9ea2a6', fbm(x * 6, y * 6)));
    } else if (distValley < floorHalfW - 0.12 && rawH < 0.84) {
      // 평탄하고 푸른 U자곡 곡저 초원(요세미티 메도우) 및 침엽수림 바닥
      color.set(mixColor('#35612d', '#4c7d3f', fbm(x * 3, y * 3)));
    } else if (rawH > 4.35) {
      // 고산 빙식 숄더(Alps) 위 만년설 패치와 화강편마암 봉우리
      const snow = smoothstep(4.45, 5.05, rawH + fbm(x * 2.5, y * 2.5) * 0.3);
      color.copy(mixColor('#6e7378', '#8f969c', fbm(x * 4, y * 4))).lerp(new THREE.Color('#eef5fa'), snow * 0.85);
    } else {
      // 수직 빙식곡 절벽: 빙하 찰흔(수평 줄무늬)이 새겨진 웅장한 회백색·암회색 화강암 거벽(엘캐피탄 스타일)
      const striation = Math.sin(rawH * 7.5 + y * 0.4) * 0.5 + 0.5;
      color.set(mixColor('#484a4d', '#7c8085', striation * 0.65 + fbm(x * 5, y * 5) * 0.35));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 3. 피오르드 (해수면 상승으로 깊게 침수된 분지형 빙식 협만 + 해저 빙하 문턱: 게이랑에르, 밀포드 사운드)
  // 본류 협만 + 북동 분지 협만(Y자 분기, 합류점 고정 좌표) + 천길 수직 절벽 + 외해 입구 해저 빙하 문턱
  // =========================================================================
  if (normSub === '피오르드') {
    // 1) 본류 피오르드 수로 (전면 외해 y=-10 쪽으로 갈수록 살짝 넓어짐)
    const mainX = Math.sin(y * 0.26) * 1.65 - 0.35;
    const d1x = 0.26 * 1.65 * Math.cos(y * 0.26);
    const perpMain = Math.abs(x - mainX) / Math.sqrt(1.0 + d1x * d1x);
    const mainHalfW = 1.95 + smoothstep(6.0, -10.0, y) * 0.55;
    const normMain = perpMain / mainHalfW;

    // 2) 우측(북동쪽)으로 갈라져 나가는 지류 피오르드 협만 — 합류점 y = -0.2의 고정 mainX 사용!
    const junctionMainX = Math.sin(-0.2 * 0.26) * 1.65 - 0.35;
    const branchWarp = Math.sin((y + 0.2) * 0.45) * 0.32 * smoothstep(-0.2, 2.0, y);
    const branchSeg = sdSegment(
      x + branchWarp,
      y,
      junctionMainX + 0.2,
      -0.2,
      7.4,
      6.6
    );
    const branchHalfW = 1.28 * (1.05 - 0.24 * branchSeg.t);
    const normBranch = branchSeg.dist / branchHalfW;

    const fjordDistRatio = smin(normMain, normBranch, 0.20);

    // 3) 피오르드 해저 과심화 분지(Overdeepened Basin, h ≈ 0.15) & 외해 입구(y ≈ -7.8) 해저 빙하 문턱(Glacial Threshold Sill)
    const glacialSill = Math.exp(-Math.pow((y + 7.8) / 1.45, 2.0)) * 0.26;
    const fjordBed = 0.15 + glacialSill + fbm(x * 2.0, y * 2.0) * 0.04;

    // 4) 바다에서 곧장 치솟는 수직 단애와 만년설 고원·마이터 피크(Mitre Peak)형 첨봉
    const wallRise = Math.min(4.85, Math.pow(Math.max(0, fjordDistRatio - 0.85), 1.85) * 3.85);
    const plateauMountains =
      smoothstep(1.1, 2.2, fjordDistRatio) *
      (0.55 + ridgedFbm(x * 0.42, y * 0.42, 4) * 0.95);

    const rawH = Math.max(0.14, fjordBed + wallRise + plateauMountains);
    h = rawH * reliefScale;

    if (fjordDistRatio < 0.96 && rawH < 0.68) {
      // 깊고 푸른 코발트·네이비 피오르드 해수 바닥 (빙하 문턱 위는 약간 밝은 청록빛)
      color.set(
        glacialSill > 0.14
          ? mixColor('#0f384d', '#19546e', fbm(x * 4, y * 4))
          : mixColor('#071d2e', '#0e314a', fbm(x * 4, y * 4))
      );
    } else if (rawH > 4.25) {
      // 협만 상부 고원 만년설 설원
      const snowT = smoothstep(4.25, 4.95, rawH + fbm(x * 3, y * 3) * 0.25);
      color.copy(mixColor('#4f575e', '#757f87', fbm(x * 4, y * 4))).lerp(new THREE.Color('#f0f7fc'), snowT * 0.9);
    } else if (fjordDistRatio < 1.55) {
      // 수직 빙식 단애 암벽 (젖은 흑회색 변성암 절벽)
      const wetCliff = smoothstep(2.5, 0.7, rawH);
      color.set(mixColor('#26292e', '#4f5459', (1.0 - wetCliff * 0.5) * fbm(x * 6, y * 6)));
    } else {
      // 고원 아한대 자작나무·침엽수 이끼 산림과 암반 교차
      color.set(mixColor('#2b4730', '#416143', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 4. 권곡 (3면 병풍 권곡 두벽(Headwall) + 과심화 산정 권곡호(Tarn) + 암석 문턱(Rock Lip): 가바르니, 설악산)
  // 외곽 발산(21m) 완전 차단! 현실적 5.4m급 반원형 안락의자 아레테 능선 + 자연 설골 + 유기적 암석 문턱
  // =========================================================================
  if (normSub === '권곡') {
    const bowlCx = 0.0;
    const bowlCy = 0.85;
    const dx = x - bowlCx;
    const dy = y - bowlCy;
    const rBowl = Math.hypot(dx / 3.25, dy / 2.85);
    const ang = Math.atan2(dy, dx); // +Y(후면)가 +PI/2, -Y(전면 입구)가 -PI/2

    // 1) 3면 반원형 권곡 두벽(Headwall: 북·동·서 3면을 병풍처럼 감싸고 남쪽 전면만 열림!)
    const amphitheaterClosure = smoothstep(-0.78, 0.45, Math.sin(ang));

    // 권곡 바닥(rBowl < 0.72) -> 75° 권곡 두벽 급상승 -> rBowl ≈ 1.85 아레테 능선(최대 ~5.4m) -> 외곽 고산 사면
    const wallRiseT = smoothstep(0.72, 1.92, rBowl);
    const headwallClimb = Math.pow(wallRiseT, 1.15) * 3.25 * (0.14 + 0.86 * amphitheaterClosure);
    const areteCrest =
      Math.exp(-Math.pow((rBowl - 1.88) / 0.72, 2.0)) *
      (0.55 + ridgedFbm(x * 0.55, y * 0.55, 4) * 0.78) *
      amphitheaterClosure;
    const outerAlpineShoulder =
      smoothstep(2.05, 3.85, rBowl) *
      (ridgedFbm(x * 0.42, y * 0.42, 3) * 0.52 - 0.55) *
      amphitheaterClosure;

    // 2) 과심화 권곡호 와지(Overdeepened Tarn Bowl: (0, 0.70) 중심, 바닥 고도 0.72, 수위 1.32)
    const dTarn = Math.hypot(dx / 2.25, (y - 0.70) / 1.95);
    const tarnBowlH =
      dTarn < 1.15
        ? 0.72 + Math.pow(clamp(dTarn / 1.05, 0.0, 1.0), 1.85) * 0.78
        : 1.50;

    // 3) 전면 암석 문턱(Rock Threshold Lip: y ≈ -2.05를 가로지르는 단단한 기반암 턱)
    const lipCurveY = -2.05 + 0.055 * x * x;
    const lipDistY = Math.abs(y - lipCurveY);
    const outletNotch = 1.0 - 0.24 * Math.exp(-Math.pow((x - 0.25) / 0.55, 2.0));
    const lipSpan = 1.0 - smoothstep(2.6, 4.4, Math.abs(x));
    const rockLipH = Math.exp(-Math.pow(lipDistY / 0.98, 2.0)) * 0.78 * outletNotch * lipSpan;

    // 4) 문턱 아래 전면 하류 빙식 계곡 급사면 (y < -2.2에서 y = -10으로 하강)
    const lowerValleyDrop =
      smoothstep(-2.0, -9.2, y) * (0.98 - Math.min(0.88, Math.pow(Math.abs(x) / 3.9, 1.8) * 1.55));
    const outletStreamCut =
      y < -1.8 ? (1.0 - smoothstep(0.18, 0.58, Math.abs(x - 0.25 - Math.sin(y * 0.6) * 0.35))) * 0.22 : 0;

    const rawH = Math.max(
      0.32,
      tarnBowlH +
        headwallClimb +
        areteCrest +
        outerAlpineShoulder +
        rockLipH -
        lowerValleyDrop -
        outletStreamCut +
        fbm(x * 1.2, y * 1.2) * 0.08
    );
    h = rawH * reliefScale;

    if (dTarn < 0.98 && rawH < 1.34) {
      // 에메랄드빛 산정 권곡호(Tarn) 바닥
      color.set(mixColor('#105263', '#1d798f', fbm(x * 4, y * 4)));
    } else if (y < -1.8 && outletStreamCut > 0.10) {
      // 암석 문턱을 넘어 흘러내리는 산정 유출 계류
      color.set(mixColor('#186275', '#2b889e', fbm(x * 5, y * 5)));
    } else {
      // 고산 툰드라 초지 -> 빙하 마식 암석 문턱(부드러운 곡선 블렌딩) -> 3면 병풍 두벽 & 자연 설골/만년설!
      const tundraCol = mixColor('#485c3a', '#60764d', fbm(x * 3, y * 3));
      const polishedLipCol = mixColor('#6a6660', '#8d8880', fbm(x * 5, y * 5));
      const cliffCol = mixColor('#3e3b38', '#666059', fbm(x * 5.5, y * 5.5));
      const snowCol = mixColor('#dce8f2', '#f7fbff', fbm(x * 5, y * 5));

      const lipMask = smoothstep(0.18, 0.56, rockLipH) * (1.0 - smoothstep(0.45, 1.15, headwallClimb));
      const cliffMask = smoothstep(0.42, 1.25, headwallClimb + areteCrest);

      color.copy(tundraCol).lerp(polishedLipCol, lipMask * 0.85).lerp(cliffCol, cliffMask);

      // 부드러운 fbm 설골(Snow couloirs) 및 상단 아레테 만년설
      const gullyNoise = fbm(x * 0.92 + Math.cos(ang) * 0.7, y * 0.92 + Math.sin(ang) * 0.7, 3);
      const couloirSnow = smoothstep(0.55, 0.74, gullyNoise) * smoothstep(2.35, 3.45, rawH);
      const ridgeSnow = smoothstep(3.85, 4.75, rawH + (fbm(x * 2.2, y * 2.2) - 0.5) * 0.35);
      color.lerp(snowCol, clamp(Math.max(ridgeSnow, couloirSnow * 0.82), 0.0, 0.92));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 5. 모레인 (상류 빙하 설단 + 양측 측퇴석 + 초승달 종퇴석 제방 + 빙하언색호 + 융빙수 산두르: 밴프 모레인 호수, 알레치)
  // 종퇴석 전면 산두르 자갈 평원은 건조하게 유지하고, 좁은 망상 융빙수 유로에만 물줄기 배치!
  // =========================================================================
  if (normSub === '모레인') {
    // 1) 계곡 좌우를 감싸는 험준한 고산 암벽 능선 (|x| > 4.6)
    const valleyWall =
      smoothstep(4.2, 8.8, Math.abs(x)) *
      (3.45 + smoothstep(-6.0, 8.0, y) * 1.15 + ridgedFbm(x * 0.5, y * 0.5, 3) * 0.65);

    // 2) 상류(y > 2.2) 빙하 설단(Glacier Tongue)이 놓이는 오목한 기반암 바닥 (3D 크레바스 빙하 메쉬와 결합!)
    const upperGlacierBed = smoothstep(1.8, 9.5, y) * (1.55 - Math.min(0.45, Math.pow(x / 3.2, 2.0) * 0.35));

    // 3) 양안 측퇴석 능선 (Lateral Moraines: 빙하 양옆을 따라 쌓인 날카로운 쇄설물 둑, x ≈ ±3.35, y ∈ [-2.4, +8.2])
    const latX = 3.35 - smoothstep(2.0, -2.8, y) * 0.45;
    const distLat = Math.abs(Math.abs(x) - latX);
    const inLatSpan = smoothstep(-3.2, -1.2, y) * (1.0 - smoothstep(7.5, 9.5, y));
    const lateralMoraine =
      Math.exp(-Math.pow(distLat / 0.78, 2.0)) *
      (1.45 + fbm(x * 2.5, y * 2.5) * 0.28) *
      inLatSpan;

    // 4) 초승달(말발굽) 모양 말단 종퇴석 제방 (Terminal Moraine Arc: 하류 쪽으로 볼록하게 휘어진 비분급 표석 둑!)
    const termArcY = -2.85 + 0.21 * x * x;
    const distTerm = Math.abs(y - termArcY);
    const inTermSpan = 1.0 - smoothstep(3.1, 4.2, Math.abs(x));
    // 중앙 우측(x ≈ 0.4)에 융빙수가 뚫고 나가는 좁은 배수구(Outlet breach notch)
    const breachNotch = 1.0 - 0.52 * Math.exp(-Math.pow((x - 0.4) / 0.48, 2.0));
    const terminalMoraine =
      Math.exp(-Math.pow(distTerm / 0.92, 2.0)) *
      (1.42 + warpedFbm(x * 2.2, y * 2.2, 3) * 0.32) *
      inTermSpan *
      breachNotch;

    // 5) 종퇴석 바깥쪽(y < termArcY) 건조 산두르(Sandur) 자갈 평원 + 2갈래 망상 융빙수 유로
    const outwashSlope = smoothstep(-10.0, -2.5, y) * 0.30;
    const inOutwash = smoothstep(termArcY + 0.2, termArcY - 0.55, y) * (1.0 - smoothstep(3.0, 4.1, Math.abs(x)));
    const braidCenter1 = 0.4 * smoothstep(-6.5, -2.5, y) - 1.15 * smoothstep(-3.0, -9.5, y) + Math.sin(y * 0.9) * 0.42;
    const braidCenter2 = 0.4 * smoothstep(-5.5, -2.5, y) + 1.25 * smoothstep(-3.2, -9.5, y) + Math.cos(y * 0.85) * 0.38;
    const distBraid = Math.min(Math.abs(x - braidCenter1), Math.abs(x - braidCenter2));
    const outwashChannels = inOutwash * (1.0 - smoothstep(0.20, 0.54, distBraid)) * 0.36;

    // 6) 하류(y ≈ -5.6)에 낮게 남은 구 후퇴 종퇴석(Recessional Moraine Arc — 망상 유로 통과부 깔끔히 절개!)
    const recArcY = -5.65 + 0.16 * x * x;
    const recBraidBreach = smoothstep(0.22, 0.72, distBraid);
    const recessionalMoraine =
      Math.exp(-Math.pow((y - recArcY) / 0.72, 2.0)) *
      (0.52 + fbm(x * 2.8, y * 2.8) * 0.18) *
      (1.0 - smoothstep(3.4, 4.6, Math.abs(x))) *
      recBraidBreach;

    // 7) 종퇴석과 측퇴석 안쪽에 완전히 갇힌 빙하언색호(Moraine-dammed Proglacial Lake: y ∈ [-2.3, +2.3], |x| < 2.8)
    const inLakeBowl =
      smoothstep(termArcY + 0.35, termArcY + 1.05, y) *
      (1.0 - smoothstep(1.8, 2.6, y)) *
      (1.0 - smoothstep(2.2, 3.0, Math.abs(x)));
    const lakeScoop = inLakeBowl * 0.50;

    const rawH = Math.max(
      0.26,
      0.60 +
        outwashSlope +
        valleyWall +
        upperGlacierBed +
        Math.max(lateralMoraine, Math.max(terminalMoraine, recessionalMoraine)) -
        lakeScoop -
        outwashChannels +
        fbm(x * 1.8, y * 1.8) * 0.065
    );
    h = rawH * reliefScale;

    if (inLakeBowl > 0.35 && rawH < 1.08) {
      // 빙하 암분(Rock flour)이 부유하는 신비로운 밀키 터키석 빙하언색호 바닥
      color.set(mixColor('#14636b', '#269199', fbm(x * 4, y * 4)));
    } else if (outwashChannels > 0.11) {
      // 산두르 망상 융빙수 유로
      color.set(mixColor('#1c6b75', '#2e8f99', fbm(x * 5, y * 5)));
    } else if (y > 2.4 && Math.abs(x) < 3.0) {
      // 상류 빙하 설단 하부 설빙·찰흔 암반
      color.set(mixColor('#a8c5d6', '#d9ecf7', fbm(x * 4, y * 4)));
    } else if (lateralMoraine > 0.45 || terminalMoraine > 0.42 || recessionalMoraine > 0.26) {
      // 모레인(측퇴석·종퇴석) 능선: 모서리가 각진 거칠고 불규칙한 회갈색 암설·표석(Till & Erratics) 더미!
      const tillTex = fbm(x * 8.0, y * 8.0);
      color.set(mixColor('#595248', '#877c6d', tillTex));
    } else if (rawH > 3.65) {
      // 좌우 고산 봉우리 만년설 및 회색 암벽
      color.set(mixColor('#8a949c', '#e6eff5', smoothstep(3.65, 4.65, rawH)));
    } else {
      // 빙하 주변 아고산 침엽수림·툰드라 초지 및 건조 산두르 자갈 평원
      color.set(
        y < termArcY - 0.2 && Math.abs(x) < 3.8
          ? mixColor('#787164', '#948b7c', fbm(x * 5, y * 5))
          : mixColor('#385233', '#4e6e46', fbm(x * 3, y * 3))
      );
    }
    return { height: h, color };
  }

  return null;
}
