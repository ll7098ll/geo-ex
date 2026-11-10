import * as THREE from 'three';
import {
  fbm,
  warpedFbm,
  ridgedFbm,
  smoothstep,
  smin,
  smax,
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
  // 도메인 워핑된 4대 칼날 능선(아레테) + 4면 오목 권곡 거벽 + 암석 턱으로 둘러싸인 북벽·전면 권곡호
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

    // 2) 중심 피라미드 첨두 코어 (오목한 지수 함수 단면으로 하늘을 찌르듯 6.45m까지 치솟음)
    const peakCore = 6.42 * Math.exp(-r * 0.27) * (1.0 - smoothstep(6.8, 9.5, r));

    // 3) 아레테 칼날 능선 및 침봉(Gendarmes) 요철
    const areteStrength = 1.95 * Math.exp(-distToRidge / 0.52) * Math.exp(-r * 0.17) * (1.0 - smoothstep(7.0, 9.4, r));
    const areteGendarmes =
      (ridgedFbm(x * 1.4, y * 1.4, 3) - 0.45) * 0.42 * Math.exp(-distToRidge / 0.38) * smoothstep(0.6, 4.5, r);

    // 4) 능선 사이 4대 거벽의 깊은 오목 권곡 스쿱 (Cirque Headwall Scoops)
    const maxFaceDist = Math.max(0.001, r * invSqrt2);
    const faceRatio = clamp(distToRidge / (maxFaceDist * 0.84), 0.0, 1.0);
    const cirqueHollow = -2.18 * Math.pow(faceRatio, 1.75) * smoothstep(0.95, 4.6, r) * (1.0 - smoothstep(6.4, 9.0, r));

    // 5) 북벽 권곡호(North Tarn at (0, 5.2)) & 전면 권곡 와지: 바깥쪽에 암석 문턱(Rock lip)을 세워 호수가 밖으로 절대 새지 않게 함!
    const dNorthTarn = Math.hypot(x / 1.65, (y - 5.2) / 1.45);
    const northTarnScoop = dNorthTarn < 1.0 ? -0.58 * Math.pow(1.0 - dNorthTarn * dNorthTarn, 1.4) : 0;
    const northTarnLip =
      dNorthTarn >= 0.85 && dNorthTarn < 1.55
        ? Math.exp(-Math.pow((dNorthTarn - 1.15) / 0.28, 2.0)) * 0.42
        : 0;

    // 기저부 애추(Talus) 및 빙퇴석 사면
    const baseSlope = 0.62 + 0.36 * Math.exp(-Math.pow((r - 6.0) / 2.2, 2.0));
    const rockStrata =
      fbm(x * 1.8, y * 1.8) * 0.16 + Math.sin(x * 2.8 - y * 2.6) * 0.08 * smoothstep(1.2, 5.0, r);

    const rawH = Math.max(
      0.28,
      peakCore + areteStrength + areteGendarmes + cirqueHollow + northTarnScoop + northTarnLip + baseSlope + rockStrata
    );
    h = rawH * reliefScale;

    if (dNorthTarn < 0.92 && rawH < 0.72) {
      // 북벽 권곡호(Tarn): 빙하 록플라워가 녹아든 옥빛 산정호수
      color.set(mixColor('#125666', '#1e7c8f', fbm(x * 4, y * 4)));
    } else {
      const couloirNoise = Math.sin(r * 4.0 + angle * 8.0 + fbm(x * 2.8, y * 2.8) * 2.8);
      const isSnowChute = (couloirNoise > 0.42 && r > 1.1 && r < 5.8) || (faceRatio > 0.65 && rawH > 2.4 && rawH < 3.6);

      if (rawH > 4.65) {
        // 정상부 설벽 및 상고대 만년설
        color.set(mixColor('#e8f1f7', '#ffffff', fbm(x * 6, y * 6)));
      } else if (rawH > 2.65) {
        if (isSnowChute) {
          color.set(mixColor('#d7e5ed', '#eef6fa', fbm(x * 5, y * 5)));
        } else {
          // 마터호른 특유의 경사진 흑갈색·회록색 변성편마암 층리 거벽
          const strataLine = Math.sin(rawH * 8.5 + x * 0.8 + fbm(x * 2, y * 2) * 1.8) * 0.5 + 0.5;
          color.set(mixColor('#34302c', '#59524b', strataLine));
        }
      } else if (rawH > 1.35) {
        // 동결파쇄 애추(Talus/Scree) 암설 비탈
        color.set(mixColor('#59534b', '#756d63', fbm(x * 4, y * 4)));
      } else {
        // 고산 툰드라 초지 및 빙퇴석 구릉
        color.set(mixColor('#435435', '#586e46', fbm(x * 3, y * 3)));
      }
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
    let trunkH = 0.56 + uWallRise + alpineShoulder + fbm(x * 0.8, y * 0.8) * 0.14;

    // 2) 좌측(서쪽, x < valleyX - 1.8) 절벽 상단을 실제로 깎아 파낸 지류 현곡(Hanging Valley: y ≈ 1.4)!
    // 벽돌을 더하는(+2.2) 대신 smin으로 산체를 파내어(Carve) 절벽 중턱(h ≈ 2.75)에 매달린 U자형 지류 곡저 형성!
    if (x < valleyX - 1.2) {
      const hvAxisY = 1.45 + Math.sin((x + 4.0) * 0.35) * 0.45;
      const distHV = Math.abs(y - hvAxisY);
      const hvFloor = 2.72 + Math.max(0, -x - 3.5) * 0.08 + fbm(x * 1.5, y * 1.5) * 0.05;
      const hvWall = Math.pow(Math.max(0, distHV - 0.68) / 1.05, 2.1) * 2.35;
      const hangingTroughH = hvFloor + hvWall;
      const hvBlendMask = smoothstep(valleyX - 1.35, valleyX - 2.35, x);
      const carvedH = smin(trunkH, hangingTroughH, 0.35);
      trunkH = trunkH * (1.0 - hvBlendMask) + carvedH * hvBlendMask;
    }

    // 3) 평탄한 U자곡 바닥 위 비대칭 양배암(Roche Moutonnée: 빙하가 깎은 고래등 모양 기반암 둔덕 at (valleyX + 0.85, -2.5))
    const rmDx = (x - (valleyX + 0.85)) / 0.55;
    const rmDy = (y + 2.5) / 1.15;
    const rmDist = Math.hypot(rmDx, rmDy);
    // 상류(+y) 완경사 마식면 vs 하류(-y) 급경사 뜯김면(Plucking)
    const rocheMoutonnee =
      rmDist < 1.0
        ? Math.pow(1.0 - rmDist * rmDist, 1.3) * (rmDy > -0.2 ? 0.38 : 0.46)
        : 0;

    // 4) 곡저 초원을 굽이쳐 흐르는 좁은 융빙수 하천 (폭 0.48m만 낮추어 물이 흐르게 함) + 현곡 폭포 직하부 소폭호
    const streamX = valleyX - 0.25 + Math.sin(y * 0.68) * 0.52;
    const distStream = Math.abs(x - streamX);
    const streamCut = (1.0 - smoothstep(0.18, 0.52, distStream)) * 0.32;
    const plungePoolDist = Math.hypot(x - (valleyX - 1.55), y - 1.45);
    const plungeCut = (1.0 - smoothstep(0.25, 0.85, plungePoolDist)) * 0.30;

    const rawH = Math.max(0.22, trunkH + rocheMoutonnee - Math.max(streamCut, plungeCut));
    h = rawH * reliefScale;

    const isHangingStream = x < valleyX - 1.95 && Math.abs(y - (1.45 + Math.sin((x + 4.0) * 0.35) * 0.45)) < 0.36;

    if ((distStream < 0.45 || plungePoolDist < 0.72) && rawH < 0.46) {
      // 곡저 융빙수 시내 및 현곡 폭호
      color.set(mixColor('#145566', '#22788c', fbm(x * 5, y * 5)));
    } else if (isHangingStream && rawH < 3.15) {
      // 현곡 바닥을 흐르는 고산 빙하 계류
      color.set(mixColor('#186173', '#29899e', fbm(x * 5, y * 5)));
    } else if (rocheMoutonnee > 0.12) {
      // 빙하 찰흔이 새겨진 회백색 화강암 양배암 노두
      color.set(mixColor('#75787a', '#9ea2a6', fbm(x * 6, y * 6)));
    } else if (distValley < floorHalfW - 0.15 && rawH < 0.82) {
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
  // 본류 협만 + 북동 분지 협만(Y자 분기) + 천길 수직 절벽 + 외해 입구 해저 빙하 문턱(Glacial Sill)
  // =========================================================================
  if (normSub === '피오르드') {
    // 1) 본류 피오르드 수로 (전면 외해 y=-10 쪽으로 갈수록 살짝 넓어짐)
    const mainX = Math.sin(y * 0.26) * 1.65 - 0.35;
    const d1x = 0.26 * 1.65 * Math.cos(y * 0.26);
    const perpMain = Math.abs(x - mainX) / Math.sqrt(1.0 + d1x * d1x);
    const mainHalfW = 1.95 + smoothstep(6.0, -10.0, y) * 0.55;
    const normMain = perpMain / mainHalfW;

    // 2) 우측(북동쪽)으로 갈라져 나가는 지류 피오르드 협만(Branching Fjord Arm: 게이랑에르 스타일!)
    const branchSeg = sdSegment(
      x + Math.sin(y * 0.5) * 0.35,
      y,
      mainX + 0.2,
      -0.2,
      7.2,
      6.4
    );
    const branchHalfW = 1.25 * (1.05 - 0.25 * branchSeg.t);
    const normBranch = x > mainX - 0.5 ? branchSeg.dist / branchHalfW : 99.0;

    const fjordDistRatio = smin(normMain, normBranch, 0.18);

    // 3) 피오르드 해저 과심화 분지(Overdeepened Basin, h ≈ 0.14) & 외해 입구(y ≈ -7.8) 해저 빙하 문턱(Glacial Threshold Sill, h ≈ 0.42)
    const glacialSill = Math.exp(-Math.pow((y + 7.8) / 1.45, 2.0)) * 0.26;
    const fjordBed = 0.15 + glacialSill + fbm(x * 2.0, y * 2.0) * 0.04;

    // 4) 바다에서 곧장 1,000m급으로 치솟는 수직 단애와 만년설 고원·마이터 피크(Mitre Peak)형 첨봉
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
  // 후면(y > -0.5)에 웅장한 반원형 안락의자 절벽을 배치하고 전면(y < -2.2) 암석 문턱 너머로 계곡이 열려 정면 조망 완비!
  // =========================================================================
  if (normSub === '권곡') {
    const bowlCx = 0.0;
    const bowlCy = 0.85;
    const dx = x - bowlCx;
    const dy = y - bowlCy;
    const rBowl = Math.hypot(dx / 3.25, dy / 2.85);
    const ang = Math.atan2(dy, dx); // +Y(후면)가 +PI/2, -Y(전면 입구)가 -PI/2

    // 1) 3면 반원형 권곡 두벽(Headwall: 북·동·서 3면을 병풍처럼 감싸고 남쪽 전면만 열림!)
    const frontOpenMask = 1.0 - smoothstep(-2.25, -0.90, ang) * smoothstep(-0.90, -2.25, -Math.PI - ang);
    // 간단하고 대칭적인 정면 개구부 가중치: sin(ang)이 -1(정면 남쪽)일 때 열리고, +1(후면 북쪽) 및 좌우일 때 높음
    const amphitheaterClosure = clamp((Math.sin(ang) + 0.68) / 1.35, 0.0, 1.0);

    // 권곡 바닥(rBowl < 0.78)은 오목한 과심화 와지(h ≈ 0.74), rBowl > 0.78부터 75° 절벽으로 치솟음!
    const headwallClimb =
      rBowl > 0.72
        ? Math.pow((rBowl - 0.72) / 1.45, 1.55) * 4.45 * (0.28 + 0.72 * amphitheaterClosure)
        : 0;
    const outerRidge =
      rBowl > 1.35
        ? ridgedFbm(x * 0.55, y * 0.55, 4) * 0.65 * amphitheaterClosure
        : 0;

    // 2) 과심화 권곡호 와지(Overdeepened Tarn Bowl: (0, 0.75) 중심, 바닥 고도 0.72, 수위 1.32)
    const dTarn = Math.hypot(dx / 2.25, (y - 0.70) / 1.95);
    const tarnBowlH =
      dTarn < 1.15
        ? 0.72 + Math.pow(clamp(dTarn / 1.05, 0.0, 1.0), 1.85) * 0.78
        : 1.50;

    // 3) 전면 암석 문턱(Rock Threshold Lip: y ≈ -2.05를 가로지르는 단단한 기반암 턱 h ≈ 1.52~1.68)
    // 호수 수위(1.32)보다 항상 높아 물 디스크가 절대로 밖으로 삐져나오지 않음!
    const lipDistY = Math.abs(y - (-2.05 + 0.06 * x * x));
    const outletNotch = 1.0 - 0.24 * Math.exp(-Math.pow((x - 0.25) / 0.55, 2.0)); // 중앙 작은 유출구 홈(h ≈ 1.26)
    const rockLipH = Math.exp(-Math.pow(lipDistY / 0.95, 2.0)) * 0.82 * outletNotch;

    // 4) 문턱 아래 전면 하류 빙식 계곡 급사면 (y < -2.4에서 y = -10으로 하강)
    const lowerValleyDrop = smoothstep(-2.0, -9.2, y) * (0.95 - Math.min(0.85, Math.pow(Math.abs(x) / 3.8, 1.8) * 1.65));
    const outletStreamCut =
      y < -1.8 ? (1.0 - smoothstep(0.18, 0.58, Math.abs(x - 0.25 - Math.sin(y * 0.6) * 0.35))) * 0.22 : 0;

    const rawH = Math.max(
      0.32,
      tarnBowlH + headwallClimb + outerRidge + rockLipH - lowerValleyDrop - outletStreamCut + fbm(x * 1.2, y * 1.2) * 0.08
    );
    h = rawH * reliefScale;

    if (dTarn < 0.98 && rawH < 1.34) {
      // 에메랄드빛 산정 권곡호(Tarn) 바닥
      color.set(mixColor('#105263', '#1d798f', fbm(x * 4, y * 4)));
    } else if (y < -1.8 && outletStreamCut > 0.10) {
      // 암석 문턱을 넘어 흘러내리는 산정 유출 계류
      color.set(mixColor('#186275', '#2b889e', fbm(x * 5, y * 5)));
    } else if (rawH > 4.25) {
      // 권곡 상단 아레테 능선 및 베르크슈룬트(Bergschrund) 만년설
      color.set(mixColor('#e3edf5', '#ffffff', fbm(x * 5, y * 5)));
    } else if (headwallClimb > 0.65) {
      // 동결파쇄로 깎아지른 3면 병풍 권곡 두벽(Headwall)과 설골(Snow couloirs)
      const snowGully = Math.sin(ang * 14.0 + fbm(x * 2, y * 2) * 2.0) > 0.58 && rawH > 2.2;
      color.set(
        snowGully
          ? mixColor('#d4e3ed', '#ebf4fa', fbm(x * 5, y * 5))
          : mixColor('#3e3b38', '#635d56', fbm(x * 6, y * 6))
      );
    } else if (lipDistY < 1.1 && Math.abs(x) < 3.4) {
      // 빙하에 매끄럽게 마식된 암석 문턱(Rock Lip) 기반암과 표석
      color.set(mixColor('#63605b', '#87837c', fbm(x * 5, y * 5)));
    } else {
      // 고산 툰드라 초지 및 애추 자갈밭
      color.set(mixColor('#495c3b', '#5f754d', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 5. 모레인 (상류 빙하 설단 + 양측 측퇴석 + 초승달 종퇴석 제방 + 빙하언색호 + 융빙수 산두르: 밴프 모레인 호수, 알레치)
  // 후면(y > 2.2) 빙하 계곡 -> 좌우 측퇴석(x ≈ ±3.4) -> 말단 종퇴석 아치(y ≈ -2.8) & 빙하호 -> 전면 융빙수 평원
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

    // 5) 하류(y ≈ -5.6)에 낮게 남은 구 후퇴 종퇴석(Recessional Moraine Arc)
    const recArcY = -5.65 + 0.16 * x * x;
    const recessionalMoraine =
      Math.exp(-Math.pow((y - recArcY) / 0.72, 2.0)) *
      (0.52 + fbm(x * 2.8, y * 2.8) * 0.18) *
      (1.0 - smoothstep(3.4, 4.6, Math.abs(x))) *
      (1.0 - 0.65 * Math.exp(-Math.pow((x + 0.3) / 0.55, 2.0)));

    // 6) 종퇴석과 측퇴석 안쪽에 완전히 갇힌 빙하언색호(Moraine-dammed Proglacial Lake: y ∈ [-2.3, +2.3], |x| < 2.8)
    const inLakeBowl =
      smoothstep(termArcY + 0.35, termArcY + 1.05, y) *
      (1.0 - smoothstep(1.8, 2.6, y)) *
      (1.0 - smoothstep(2.2, 3.0, Math.abs(x)));
    const lakeScoop = inLakeBowl * 0.38;

    // 7) 종퇴석 바깥쪽(y < termArcY) 융빙수 망상 하천 평원(Outwash Plain / Sandur)
    const outwashSlope = smoothstep(-10.0, -2.5, y) * 0.32;
    const braid1 = Math.sin(x * 2.4 + Math.sin(y * 0.8) * 1.5);
    const outwashChannels =
      y < termArcY - 0.3 && Math.abs(x) < 3.6
        ? smoothstep(0.72, 0.96, braid1) * 0.14
        : 0;

    const rawH = Math.max(
      0.28,
      0.48 +
        outwashSlope +
        valleyWall +
        upperGlacierBed +
        Math.max(lateralMoraine, Math.max(terminalMoraine, recessionalMoraine)) -
        lakeScoop -
        outwashChannels +
        fbm(x * 1.8, y * 1.8) * 0.08
    );
    h = rawH * reliefScale;

    if (inLakeBowl > 0.35 && rawH < 1.10) {
      // 빙하 암분(Rock flour)이 부유하는 신비로운 밀키 터키석 빙하언색호 바닥
      color.set(mixColor('#14636b', '#269199', fbm(x * 4, y * 4)));
    } else if (outwashChannels > 0.06 && rawH < 0.72) {
      // 산두르 융빙수 망상 물줄기
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
      // 빙하 주변 아고산 침엽수림·툰드라 초지 및 산두르 자갈 평원
      color.set(
        y < -3.2 && Math.abs(x) < 3.5
          ? mixColor('#6e685c', '#857e70', fbm(x * 5, y * 5))
          : mixColor('#385233', '#4e6e46', fbm(x * 3, y * 3))
      );
    }
    return { height: h, color };
  }

  return null;
}
