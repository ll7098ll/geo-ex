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

export function getSeaCliffEdgeX(y: number): number {
  return (
    1.85 +
    Math.sin(y * 0.38) * 1.15 +
    Math.cos(y * 0.78 + 0.6) * 0.48 +
    (fbm(0.4, y * 0.45, 3) - 0.5) * 0.75
  );
}

export function getWavePlatformCliffX(y: number): number {
  return 3.55 + Math.sin(y * 0.36) * 0.85 + (fbm(1.7, y * 0.5, 3) - 0.5) * 0.65;
}

export const SEA_STACK_SPECS = [
  { sx: -1.85, sy: 1.95, rx: 1.05, ry: 0.88, h: 4.35, rot: 0.35 }, // 제1 시스택 (촛대형)
  { sx: -3.65, sy: -1.45, rx: 1.22, ry: 0.96, h: 3.95, rot: -0.42 }, // 제2 시스택 (사각형 층리암)
  { sx: -0.95, sy: -3.55, rx: 0.82, ry: 0.74, h: 3.15, rot: 0.75 }, // 제3 시스택
  { sx: -5.55, sy: -2.65, rx: 0.95, ry: 0.85, h: 0.82, rot: 0.15 }, // 침식 말기 시스텀프(Sea Stump)
];

export const TIDE_POOL_SPECS = [
  { px: 0.65, py: 2.35, rx: 1.15, ry: 0.85 },
  { px: -1.35, py: -1.65, rx: 1.35, ry: 0.95 },
  { px: 1.45, py: -3.15, rx: 0.95, ry: 0.78 },
  { px: -0.85, py: 4.15, rx: 1.05, ry: 0.75 },
  { px: -2.45, py: 1.25, rx: 0.88, ry: 0.72 },
];

export function evalCoastalTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // =========================================================================
  // 1. 갯벌 (조간대 간석지 & 수지상 S자 갯골 수계망: 순천만, 신안 증도, 바덴해)
  // 후면(y > 4.5) 염습지(갈대·칠면초) -> 완경사 펄·혼합 갯벌 -> S자 주 갯골 및 2·3차 수지상 지류 갯골
  // =========================================================================
  if (normSub === '갯벌') {
    // 후면(북쪽 y = +10) 내륙 염습지에서 전면(남쪽 y = -10) 외해 조하대로 완만하게 낮아지는 경사
    const marshLineY = 4.8 + Math.sin(x * 0.35) * 0.85 + (fbm(x * 0.4, 2.1, 3) - 0.5) * 0.7;
    const tidalGradient = smoothstep(-10.0, 6.5, y) * 0.46;
    const upperMarshLift = smoothstep(marshLineY - 0.8, marshLineY + 2.4, y) * 0.48;

    // 1차 본류 S자 사행 갯골 (순천만 S자 갯골: 외해 쪽으로 갈수록 하폭이 넓어지는 나팔형 하구)
    const mainX = Math.sin(y * 0.34) * 2.45 + Math.cos(y * 0.18) * 0.85;
    const dMainDx = 0.34 * 2.45 * Math.cos(y * 0.34) - 0.18 * 0.85 * Math.sin(y * 0.18);
    const mainPerpDist = Math.abs(x - mainX) / Math.sqrt(1.0 + dMainDx * dMainDx);
    const mainHalfW = 0.36 + smoothstep(7.5, -10.0, y) * 0.92;
    const mainDepth =
      (1.0 - smoothstep(0.0, mainHalfW, mainPerpDist)) *
      (0.32 + smoothstep(7.0, -9.0, y) * 0.22);

    // 2차 수지상 지류 갯골 4갈래 (본류로 자연스럽게 합류하는 곡선 세류)
    const branches = [
      { ax: -6.8, ay: 3.8, bx: mainX - 0.1, by: 0.8, w: 0.46, d: 0.24 },
      { ax: 6.6, ay: 4.4, bx: mainX + 0.1, by: 1.6, w: 0.44, d: 0.23 },
      { ax: -7.2, ay: -2.2, bx: mainX - 0.15, by: -4.8, w: 0.52, d: 0.26 },
      { ax: 6.9, ay: -1.4, bx: mainX + 0.15, by: -4.2, w: 0.48, d: 0.25 },
    ];

    let subGullyDepth = 0;
    let minBranchRatio = 10.0;
    for (const br of branches) {
      // Sinuous perturbation perpendicular to segment
      const seg = sdSegment(
        x + Math.sin(y * 0.9) * 0.42,
        y + Math.cos(x * 0.8) * 0.35,
        br.ax,
        br.ay,
        br.bx,
        br.by
      );
      const localW = br.w * (0.45 + 0.55 * seg.t);
      const ratio = seg.dist / localW;
      if (ratio < minBranchRatio) minBranchRatio = ratio;
      const carve = (1.0 - smoothstep(0.0, localW, seg.dist)) * br.d * (0.4 + 0.6 * seg.t);
      subGullyDepth = Math.max(subGullyDepth, carve);
    }

    // 3차 미세 세류망(Micro-tidal rills) 및 조간대 연흔
    const microRills =
      Math.pow(1.0 - ridgedFbm(x * 0.85, y * 0.85, 3), 3.0) *
      0.06 *
      (1.0 - smoothstep(marshLineY - 0.5, marshLineY + 1.0, y));
    const mudUndulation = warpedFbm(x * 0.7, y * 0.7, 3) * 0.05;

    const rawH = Math.max(
      0.14,
      0.34 + tidalGradient + upperMarshLift - Math.max(mainDepth, subGullyDepth) - microRills + mudUndulation
    );
    h = rawH * reliefScale;

    if (mainPerpDist < mainHalfW * 0.72 || minBranchRatio < 0.65) {
      // 항상 조수가 고여 흐르는 갯골 수로 바닥 (윤기 나는 암흑회색 펄)
      color.set(mixColor('#12191e', '#1c2830', fbm(x * 6, y * 6)));
    } else if (y > marshLineY) {
      // 상부 염습지: 붉은 칠면초(Suaeda japonica) 군락과 황록색 갈대밭 패치 교차
      const suaedaPatch = smoothstep(0.36, 0.62, warpedFbm(x * 0.75 + 4.2, y * 0.75, 3));
      const reedCol = mixColor('#485e2b', '#667a3a', fbm(x * 3.5, y * 3.5));
      const suaedaCol = mixColor('#781e26', '#9e2b34', fbm(x * 4.5, y * 4.5));
      color.copy(reedCol).lerp(suaedaCol, suaedaPatch * (1.0 - smoothstep(marshLineY + 1.8, 9.2, y) * 0.5));
    } else if (mainPerpDist < mainHalfW * 1.25 || minBranchRatio < 1.15) {
      // 갯골 사면: 젖은 니질(실트·점토) 펄갯벌
      color.set(mixColor('#2c353b', '#3d484f', fbm(x * 5, y * 5)));
    } else {
      // 중·하부 혼합 갯벌 (내륙 세립 펄 -> 외해 사질 혼합 갯벌 전이)
      const sandMix = smoothstep(2.0, -8.5, y);
      const mudCol = mixColor('#434d53', '#556066', warpedFbm(x * 1.8, y * 1.8, 3));
      const sandMudCol = mixColor('#595c58', '#6e6f67', fbm(x * 3.5, y * 3.5));
      color.copy(mudCol).lerp(sandMudCol, sandMix * 0.65);
    }
    return { height: h, color };
  }

  // =========================================================================
  // 2. 해식애 (후퇴하는 수직 해안 절벽·해식동 노치·파식대: 태종대, 채석강, 모허 절벽)
  // 동쪽(x > cliffEdge) 해안 단구 고원 -> 78° 층리 해식애 단애 -> 서쪽 파식대 암반 및 외해
  // =========================================================================
  if (normSub === '해식애') {
    const cliffX = getSeaCliffEdgeX(y);
    const distInland = x - cliffX;

    let rawH = 0;
    if (distInland >= 0.15) {
      // 상부 해안 단구 평탄면 및 완만한 배후 구릉 (해송·초지)
      const terraceRise = smoothstep(0.15, 6.5, distInland) * 0.55;
      rawH = 3.95 + terraceRise + fbm(x * 0.55, y * 0.55, 4) * 0.28;

      const cliffRimRock = 1.0 - smoothstep(0.15, 0.75, distInland);
      const grassCol = mixColor('#2d4d23', '#436932', fbm(x * 2.2, y * 2.2));
      color.copy(grassCol).lerp(new THREE.Color('#695c4e'), cliffRimRock * 0.65);
    } else if (distInland > -0.78) {
      // 수직에 가까운 책장형 퇴적암 해식애 절벽면 (0.93m 수평 구간에서 3.45m 급락 -> 약 75도)
      const t = smoothstep(-0.78, 0.15, distInland);
      // 절벽 상하부 경암/연암 차별침식 계단 단면
      const rockBench = Math.sin(t * Math.PI * 4.0) * 0.06 * (1.0 - Math.abs(t - 0.5) * 1.6);
      rawH = 0.52 + Math.pow(t, 0.85) * 3.43 + rockBench;

      // 채석강 스타일 촘촘한 수평 퇴적 층리(Bedding) 색상
      const fineStrata = Math.sin(rawH * 14.0 + y * 0.25) * 0.5 + 0.5;
      const majorBand = Math.sin(rawH * 3.8) * 0.5 + 0.5;
      color.set(mixColor('#3f352d', '#7d6c5b', fineStrata * 0.7 + majorBand * 0.3));
    } else if (distInland > -3.4) {
      // 절벽 기저부 파식대 암반 벤치 (간조 시 물 위로 살짝 드러나는 침식 암반 플랫폼)
      const benchT = smoothstep(-3.4, -0.78, distInland);
      const jointGroove = Math.abs(Math.sin(x * 2.4 + y * 0.4)) < 0.14 ? -0.06 : 0;
      rawH = 0.30 + benchT * 0.26 + jointGroove + fbm(x * 2.5, y * 2.5) * 0.06;
      color.set(
        rawH > 0.46
          ? mixColor('#383936', '#4f4e48', fbm(x * 5, y * 5))
          : mixColor('#132d38', '#1f4452', fbm(x * 4, y * 4))
      );
    } else {
      // 서쪽 외해 해저 암반
      rawH = 0.20 + fbm(x * 1.4, y * 1.4) * 0.08;
      color.set(mixColor('#0a2230', '#12394d', fbm(x * 3, y * 3)));
    }

    h = rawH * reliefScale;
    return { height: h, color };
  }

  // =========================================================================
  // 3. 시스택 (곶 -> 해식아치 -> 독립 시스택 -> 시스텀프 진화 계열: 독도, 두무진, 12사도)
  // 동쪽 본토 해식 곶(x > 2.2) + 바다 위 3기 층리 시스택 & 1기 시스텀프 + 3D 천연 해식아치 연동
  // =========================================================================
  if (normSub === '시스택') {
    // 1) 동쪽 후퇴하는 해안 절벽 본토 + 서쪽으로 길게 뻗어 나온 곶(Headland Promontory at y ≈ 0.35)
    const baseCoastX = 4.6 + Math.sin(y * 0.42) * 0.75;
    const promontoryReach = 2.55 * Math.exp(-Math.pow((y - 0.35) / 1.45, 2.0));
    const headlandEdgeX = baseCoastX - promontoryReach;
    const distHeadland = x - headlandEdgeX;

    let headlandH = 0;
    if (distHeadland > -0.65) {
      const t = smoothstep(-0.65, 0.25, distHeadland);
      const topPlateau = 3.85 + smoothstep(0.25, 5.0, distHeadland) * 0.42 + fbm(x * 0.7, y * 0.7) * 0.18;
      headlandH = 0.32 + Math.pow(t, 0.78) * (topPlateau - 0.32);
    }

    // 해식아치 바깥쪽 교각 착지 암초 기단 (x ≈ -0.15, y ≈ 0.28 -> 3D 아치 교각과 정확히 결합)
    const archPierDist = Math.hypot((x + 0.15) / 0.82, (y - 0.28) / 0.75);
    const archPierBase = archPierDist < 1.0 ? 0.32 + Math.pow(1.0 - archPierDist, 0.65) * 0.55 : 0;

    // 2) 바다 한가운데 고립된 수직 층리 시스택 3기 + 파도에 깎여 낮아진 시스텀프(Sea Stump) 1기
    let stackH = 0;
    let activeStackTop = 0;
    for (const s of SEA_STACK_SPECS) {
      const cosR = Math.cos(s.rot);
      const sinR = Math.sin(s.rot);
      const lx = (x - s.sx) * cosR + (y - s.sy) * sinR;
      const ly = -(x - s.sx) * sinR + (y - s.sy) * cosR;
      const ang = Math.atan2(ly, lx);
      const shapeMod = 1.0 + 0.12 * Math.sin(ang * 3.0 + s.rot * 2.0) + 0.08 * Math.cos(ang * 4.0);
      const normD = Math.hypot(lx / (s.rx * shapeMod), ly / (s.ry * shapeMod));

      if (normD < 1.35) {
        // 주변 수중 파식 암초 받침(Abrasion reef plinth)
        const plinth = 0.30 + smoothstep(1.35, 0.92, normD) * 0.32;
        let colH = plinth;
        if (normD < 1.0) {
          // 수직 절벽형 기둥 프로파일 (등고선 ON 시 선명한 폐곡선 생성!)
          const wallT = clamp(1.0 - Math.pow(normD, 3.6), 0.0, 1.0);
          const flatCrown = Math.pow(wallT, 0.36);
          colH = Math.max(plinth, 0.38 + flatCrown * (s.h - 0.38) + fbm(x * 3.0, y * 3.0) * 0.08);
        }
        if (colH > stackH) {
          stackH = colH;
          activeStackTop = s.h;
        }
      }
    }

    const seaFloor = 0.22 + fbm(x * 1.4, y * 1.4) * 0.08;
    const rawH = Math.max(seaFloor, Math.max(headlandH, Math.max(stackH, archPierBase)));
    h = rawH * reliefScale;

    if (rawH > 0.62) {
      const strata = Math.sin(rawH * 12.5 + x * 0.3) * 0.5 + 0.5;
      if (distHeadland > 0.3 && rawH > 3.7) {
        // 본토 곶 상부 초지
        color.set(mixColor('#355728', '#4b7037', fbm(x * 2.5, y * 2.5)));
      } else if (activeStackTop > 3.0 && rawH > activeStackTop - 0.22) {
        // 시스택 정상부 잔디 캡과 해조(갈매기) 흔적 회백색 암반
        color.set(mixColor('#566938', '#7d7a6e', fbm(x * 4, y * 4)));
      } else {
        // 수평 층리가 선명한 적황갈색·회갈색 해식 사암/응회암 절벽
        color.set(mixColor('#4f4135', '#8c745c', strata));
      }
    } else if (rawH > 0.38) {
      // 물보라에 젖은 파식 암초대
      color.set(mixColor('#25363b', '#384c52', fbm(x * 5, y * 5)));
    } else {
      // 투명한 청록·코발트 해저
      color.set(mixColor('#0b2433', '#154358', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 4. 해안 사구 (해빈 -> 전사구 -> 사구습지(두웅습지) -> 비대칭 주 사구열 -> 방풍 해송림: 신두리)
  // 서쪽 바다·백사장(x < -4.8) -> 전사구 -> 습지 -> 완경사 풍상면 & 34° 슬립페이스 주사구 -> 동쪽 방풍림
  // =========================================================================
  if (normSub === '해안 사구') {
    const shorelineX = -6.6 + Math.sin(y * 0.32) * 0.55;

    // 1) 해빈(Beach)에서 내륙으로 완만하게 오르는 기저 모래면
    const baseRamp =
      0.20 +
      smoothstep(shorelineX - 2.0, shorelineX + 2.2, x) * 0.52 +
      smoothstep(-3.0, 7.5, x) * 0.42;

    // 2) 1차 전사구열 (Foredune ridge: x ≈ -3.4, 바람 통로인 취식구/Blowout 안부 포함)
    const foreAxisX = -3.35 + Math.sin(y * 0.48) * 0.55;
    const blowoutNotch = 1.0 - 0.52 * Math.exp(-Math.pow((y + 1.4) / 1.35, 2.0));
    const dxFore = x - foreAxisX;
    const foreProfile = dxFore < 0 ? Math.exp(-Math.pow(dxFore / 1.35, 2.0)) : Math.exp(-Math.pow(dxFore / 0.95, 2.0));
    const foreDune = foreProfile * 1.18 * blowoutNotch * (0.82 + 0.18 * fbm(x * 1.2, y * 1.2));

    // 3) 사구 배후 습지 (Interdunal Slack / 두웅습지: x ≈ -1.05, y ≈ 1.15 타원형 담수 와지)
    const slackDist = Math.hypot((x + 1.05) / 1.15, (y - 1.15) / 2.75);
    const slackDip = slackDist < 1.25 ? (1.0 - smoothstep(0.35, 1.25, slackDist)) * 0.46 : 0;

    // 4) 2차 주 횡사구·바르한형 사구열 (Main Transverse Dune: 서풍에 의한 완경사 풍상면 + 동쪽 34° 사태면!)
    const mainCrestX = 2.15 + Math.sin(y * 0.44) * 0.92 + Math.cos(y * 0.88 + 0.5) * 0.32;
    const dxMain = x - mainCrestX;
    const crestMod = 2.65 + Math.sin(y * 0.55 + 0.8) * 0.32 + fbm(0.8, y * 0.4, 3) * 0.25;
    let mainDune = 0;
    if (dxMain <= 0) {
      // 바람받이 풍상사면(Stoss, 10~14° 완경사) + 바람 연흔(Wind ripples)
      const stossT = clamp(1.0 + dxMain / 3.85, 0.0, 1.0);
      const ripples = Math.sin(x * 8.5 + Math.sin(y * 0.8) * 2.0) * 0.032 * smoothstep(0.15, 0.85, stossT);
      mainDune = Math.pow(smoothstep(0.0, 1.0, stossT), 1.15) * crestMod + ripples;
    } else {
      // 바람그늘 풍하사면(Slip-face, 34° 안식각 급경사로 칼날 능선 형성!)
      const slipT = clamp(1.0 - dxMain / 1.55, 0.0, 1.0);
      mainDune = Math.pow(slipT, 1.32) * crestMod;
    }

    // 5) 동쪽 내륙 해안 방풍림 안정 사구 지대 (x > 4.2)
    const backDuneHummock = smoothstep(3.8, 6.2, x) * warpedFbm(x * 0.55, y * 0.55, 3) * 0.45;

    const rawH = Math.max(0.18, baseRamp + foreDune + mainDune - slackDip + backDuneHummock);
    h = rawH * reliefScale;

    if (x < shorelineX) {
      // 서해 얕은 연안 해저 모래톱
      color.set(mixColor('#0f3547', '#1c536b', fbm(x * 3, y * 3)));
    } else if (x < shorelineX + 1.4) {
      // 파도에 젖은 해빈 백사장
      color.set(mixColor('#c2a56e', '#dfC58e', smoothstep(shorelineX, shorelineX + 1.4, x)));
    } else if (slackDist < 0.95) {
      // 두웅습지 수변: 수생식물·버드나무 녹색 습지 및 습윤 니토
      color.set(
        slackDist < 0.55
          ? mixColor('#1e4a38', '#2a634b', fbm(x * 5, y * 5))
          : mixColor('#356128', '#4c7a38', fbm(x * 4, y * 4))
      );
    } else if (x > 4.4) {
      // 내륙 해송(곰솔) 방풍림 임상 및 고정 사구 초지
      const pineFloor = smoothstep(4.4, 5.8, x);
      color.copy(mixColor('#b89b63', '#8f7c4f', fbm(x * 3, y * 3))).lerp(
        mixColor('#2d4d22', '#3f632f', fbm(x * 2.5, y * 2.5)),
        pineFloor * 0.85
      );
    } else if (dxMain > 0.02 && dxMain < 1.48) {
      // 풍하측 슬립페이스: 그늘진 고운 황금빛 사태 모래면
      color.set(mixColor('#cca462', '#dfb875', fbm(x * 4, y * 4)));
    } else if (foreProfile > 0.45 && blowoutNotch > 0.7) {
      // 전사구 통보리사초·갯그령 사구초지 패치
      const grassPatch = smoothstep(0.42, 0.68, fbm(x * 2.2, y * 2.2, 3));
      color.copy(mixColor('#e0be7e', '#f0d295', fbm(x * 3, y * 3))).lerp(new THREE.Color('#667d42'), grassPatch * 0.65);
    } else {
      // 건조사구 마루 및 풍상측 밝은 석영 모래
      color.set(mixColor('#e3c181', '#f6da9c', fbm(x * 3.5, y * 3.5)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 5. 사주·사취 (연안류 만곡 사취 갈고리 & 육계사주·육계도: 케이프코드, 쿠로니안, 섭지코지, 모도)
  // 서쪽 본토 곶 -> 만 입구를 가로지르는 사주 + 안쪽으로 휘어진 복합 사취(Recurved Hook) + 육계사주·육계도
  // =========================================================================
  if (normSub === '사주·사취') {
    // 1) 서쪽 본토 육지 (북서·남서 두 돌출 곶과 중앙 내만)
    const bayIndent = Math.exp(-Math.pow((y - 0.5) / 4.2, 2.0)) * 2.2;
    const mainlandEdgeX = -5.4 - bayIndent + Math.sin(y * 0.4) * 0.45;
    const mainlandH =
      x < mainlandEdgeX + 0.8
        ? smoothstep(mainlandEdgeX + 0.8, mainlandEdgeX - 3.6, x) * (2.65 + fbm(x * 0.6, y * 0.6) * 0.75)
        : 0;

    // 2) 북서 곶(-5.2, 4.2)에서 동남쪽으로 길게 뻗어 나와 끝단이 내만 쪽으로 갈고리처럼 휘는 사취(Recurved Hook Spit)
    const spitNodes: [number, number][] = [
      [-5.6, 4.3],
      [-3.2, 3.3],
      [-0.6, 2.4],
      [1.6, 1.6],
      [2.85, 1.35],
      [3.35, 1.85], // 사취 선단 굴절 시작
      [2.95, 2.75], // 내만 쪽으로 말려 들어간 주 갈고리(Main Hook)
      [2.15, 3.15],
    ];
    let minSpitDist = 99.0;
    let spitAlong = 0;
    for (let i = 0; i < spitNodes.length - 1; i++) {
      const seg = sdSegment(x, y, spitNodes[i][0], spitNodes[i][1], spitNodes[i + 1][0], spitNodes[i + 1][1]);
      if (seg.dist < minSpitDist) {
        minSpitDist = seg.dist;
        spitAlong = (i + seg.t) / (spitNodes.length - 1);
      }
    }
    // 2차 구 갈고리 능선 (Secondary older recurved ridge)
    const hook2 = sdSegment(x, y, 1.35, 1.75, 1.05, 2.95);
    const spitHalfW = 0.88 - spitAlong * 0.26;
    const mainSpitH = Math.exp(-Math.pow(minSpitDist / spitHalfW, 2.0)) * (1.02 - spitAlong * 0.16);
    const subHookH = Math.exp(-Math.pow(hook2.dist / 0.52, 2.0)) * 0.76;

    // 3) 동남쪽 앞바다 바위섬(육계도: (4.4, -3.1))과 본토 남서 곶(-5.2, -4.2)을 잇는 활 모양 육계사주(Tombolo)
    const islandCx = 4.4;
    const islandCy = -3.1;
    const dIsland = Math.hypot((x - islandCx) / 2.05, (y - islandCy) / 1.75);
    const tiedIslandH =
      dIsland < 1.15
        ? Math.pow(clamp(1.0 - dIsland / 1.15, 0, 1), 0.65) * 3.25 + fbm(x * 1.8, y * 1.8) * 0.18 * (1.0 - dIsland)
        : 0;

    // 육계사주 (양방향 파랑 굴절로 가운데가 살짝 잘록하고 매끈하게 휘어진 모래톱 둑길)
    const tomboloY = -4.15 + ((x + 5.4) / 9.8) * 1.05 + Math.sin(((x + 5.4) / 9.8) * Math.PI) * 0.85;
    const inTomboloSpan = smoothstep(-6.0, -4.6, x) * (1.0 - smoothstep(3.2, 4.6, x));
    const tomboloHalfW = 0.72 + Math.pow(Math.cos(((x + 0.5) / 5.2) * Math.PI * 0.5), 2.0) * -0.18;
    const tomboloH =
      inTomboloSpan * Math.exp(-Math.pow((y - tomboloY) / Math.max(0.52, tomboloHalfW), 2.0)) * 0.90;

    // 수중 연안 모래톱 여울(Submerged sand shoal)
    const shoalH =
      Math.max(
        Math.exp(-Math.pow(minSpitDist / 1.85, 2.0)),
        inTomboloSpan * Math.exp(-Math.pow((y - tomboloY) / 1.65, 2.0))
      ) * 0.42;

    const seaFloor = 0.20 + fbm(x * 1.3, y * 1.3) * 0.06;
    const sandFeatureH = Math.max(mainSpitH, Math.max(subHookH, tomboloH));
    const rawH = Math.max(seaFloor, Math.max(shoalH, smax(Math.max(mainlandH, tiedIslandH), sandFeatureH, 0.18)));
    h = rawH * reliefScale;

    if (mainlandH > 0.85 || tiedIslandH > 0.85) {
      if (rawH < 1.15) {
        // 기반암 해안 암반 테두리
        color.set(mixColor('#575046', '#786e60', fbm(x * 4, y * 4)));
      } else {
        // 본토 및 육계도 해송 상록수림
        color.set(mixColor('#2d5224', '#446e34', fbm(x * 2.5, y * 2.5)));
      }
    } else if (rawH > 0.54) {
      // 해수면 위로 드러난 순백~금빛 사주·사취·육계사주 모래톱 및 사구초지 능선
      const vegSpine = smoothstep(0.82, 0.98, rawH);
      color.copy(mixColor('#e3c68d', '#f7e2b2', fbm(x * 4, y * 4))).lerp(new THREE.Color('#6b8244'), vegSpine * 0.45);
    } else if (rawH > 0.36) {
      // 에메랄드빛 천해 모래 여울(Sand shoal)
      color.set(mixColor('#1b5b66', '#2e7d87', fbm(x * 3, y * 3)));
    } else {
      // 정온한 내만 및 외해 깊은 바다
      color.set(mixColor('#0b2838', '#134057', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 6. 석호 (사주가 만 입구를 가로막아 형성된 동해안 기수호: 화진포, 경포호, 송지호)
  // 서쪽(x < -3.2) 배후 산지 & 유입 하천 소삼각주 -> 중앙 석호(-3.2 ~ +2.1) -> 사주(x ≈ 2.8) & 갯트임 -> 동해(x > 3.5)
  // =========================================================================
  if (normSub === '석호') {
    // 1) 서쪽 배후 화강암 구릉 산지 및 석호로 유입되는 소하천 계곡(y ≈ 0.8)
    const creekY = 0.8 + Math.sin(x * 0.45) * 0.55;
    const distCreek = Math.abs(y - creekY);
    const creekCut = (1.0 - smoothstep(0.35, 1.35, distCreek)) * 1.45;
    const westHillBase = smoothstep(-2.8, -8.8, x) * (3.65 + warpedFbm(x * 0.45, y * 0.45, 3) * 0.85);
    const westHills = Math.max(0, westHillBase - creekCut * smoothstep(-2.5, -5.5, x));

    // 북쪽·남쪽 만을 감싸는 해안 구릉 곶 (석호를 아늑한 타원형 분지로 포위)
    const northSouthHeadlands =
      smoothstep(4.8, 8.8, Math.abs(y)) *
      smoothstep(3.6, -2.5, x) *
      (2.15 + fbm(x * 0.6, y * 0.6) * 0.55);

    // 유입 하천이 석호 서안(-3.2, 0.8)에 쌓아 올린 소규모 하구 삼각주(Bayhead Delta)
    const dDelta = Math.hypot((x + 3.0) / 1.35, (y - 0.8) / 1.55);
    const bayheadDelta = dDelta < 1.0 && distCreek > 0.28 ? (1.0 - dDelta) * 0.48 : 0;

    // 2) 동해 파랑과 연안류가 쌓아 올린 긴 모래 사주(Barrier Spit: x ≈ 2.75) + 갯트임(Tidal Inlet: y ≈ -1.65)
    const spitCenterX = 2.75 + Math.sin(y * 0.24) * 0.28;
    const dxSpit = x - spitCenterX;
    const inletCenterY = -1.65;
    const inletOpen = smoothstep(0.32, 0.95, Math.abs(y - inletCenterY)); // y ≈ -1.65에서 사주가 터져 바닷물 교환!
    const barrierSpit =
      Math.exp(-Math.pow(dxSpit / 0.88, 2.0)) *
      (0.88 + fbm(x * 1.5, y * 1.5) * 0.14) *
      inletOpen;

    // 3) 석호 기저 분지(-3.2 < x < 2.1) 및 동해 외해(x > 3.5)
    const inLagoonBasin = smoothstep(-3.4, -2.4, x) * (1.0 - smoothstep(1.8, 2.5, x)) * (1.0 - smoothstep(4.8, 6.2, Math.abs(y)));
    const lagoonFloor = 0.28 + fbm(x * 1.6, y * 1.6) * 0.06;
    const seaFloor = 0.18 + fbm(x * 1.4, y * 1.4) * 0.06;

    const baseSurface = x > 2.75 ? seaFloor : 0.42 - inLagoonBasin * 0.14;
    const rawH = Math.max(
      0.18,
      baseSurface + westHills + northSouthHeadlands + bayheadDelta + barrierSpit
    );
    h = rawH * reliefScale;

    if (x > spitCenterX + 0.65 && rawH < 0.56) {
      // 동해 푸른 외해 바닥
      color.set(mixColor('#092234', '#123b54', fbm(x * 3, y * 3)));
    } else if (Math.abs(dxSpit) < 0.95 && rawH > 0.56 && northSouthHeadlands < 0.4) {
      // 금빛 모래 사주 해변 및 중앙 방풍 해송림 띠
      const pineBelt = Math.abs(dxSpit) < 0.34 && inletOpen > 0.85 && rawH > 0.88;
      color.set(
        pineBelt
          ? mixColor('#2c5224', '#3d6931', fbm(x * 4, y * 4))
          : mixColor('#dec287', '#f4dca6', fbm(x * 4, y * 4))
      );
    } else if (rawH < 0.56) {
      // 잔잔한 청록빛 석호 기수역 바닥 및 갯트임 수로
      color.set(mixColor('#143d38', '#1f5750', fbm(x * 4, y * 4)));
    } else if (rawH < 0.76 && x < 2.2) {
      // 석호 수변 갈대습지 및 하구 소삼각주 퇴적대
      color.set(mixColor('#4c6935', '#688246', fbm(x * 5, y * 5)));
    } else {
      // 배후 소나무(적송·해송) 구릉 산림
      color.set(mixColor('#294720', '#3b5e2e', fbm(x * 2.2, y * 2.2)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 7. 파식대 (후퇴하는 책장 층리 해식애 + 절리망 암반 평탄면 + 조수 웅덩이: 변산 채석강, 태종대)
  // 동쪽(x > 3.55) 책장 층리 해식절벽 -> 중앙(-3.8 ~ +3.55) 직교 절리 & 경사 지층 리브 파식대 + 조수웅덩이 -> 서쪽 외해
  // =========================================================================
  if (normSub === '파식대') {
    const cliffEdge = getWavePlatformCliffX(y);
    const distCliff = x - cliffEdge;

    let rawH = 0;
    if (distCliff > -0.45) {
      // 부드럽게 안티에일리어싱된 수직 해식애 단애 및 상부 해안 단구 (톱니 깨짐 완벽 제거!)
      const cliffT = smoothstep(-0.45, 0.22, distCliff);
      const topH = 4.15 + smoothstep(0.22, 5.0, distCliff) * 0.45 + fbm(x * 0.6, y * 0.6) * 0.22;
      rawH = 0.78 + Math.pow(cliffT, 0.82) * (topH - 0.78);

      if (distCliff > 0.32) {
        color.set(mixColor('#315226', '#466b35', fbm(x * 2.5, y * 2.5)));
      } else {
        const bookStrata = Math.sin(rawH * 15.0 + y * 0.2) * 0.5 + 0.5;
        color.set(mixColor('#453a31', '#826e5c', bookStrata));
      }
    } else {
      // 광활한 파식대 암반 평탄면 (x = -3.85 저조선 단애까지 1.5°로 완만히 경사)
      const seaStepX = -3.85 + Math.sin(y * 0.42) * 0.55;
      const onBench = smoothstep(seaStepX - 0.55, seaStepX + 0.35, x);
      const benchSlope = 0.46 + smoothstep(seaStepX, cliffEdge - 0.45, x) * 0.34;

      // 지각 변형 직교 절리망 (부드러운 smoothstep 용식·침식 홈)
      const j1 = smoothstep(0.18, 0.03, Math.abs(Math.sin((x * 1.55 + y * 0.25) + fbm(x * 0.4, y * 0.4) * 0.4)));
      const j2 = smoothstep(0.16, 0.03, Math.abs(Math.sin((y * 1.45 - x * 0.22) + fbm(y * 0.4, x * 0.4) * 0.4)));
      const jointGroove = Math.max(j1, j2) * 0.14 * onBench;

      // 경사진 퇴적암 지층의 차별침식 미세 톱니 리브 (Tilted bedding micro-cuestas)
      const beddingRib = Math.sin(x * 4.2 + y * 0.5) * 0.035 * onBench;

      // 암반 위에 오목하게 파인 조수 웅덩이(Tide Pools: 썰물 때도 바닷물이 고여 있는 와지)
      let poolCarve = 0;
      let inTidePool = false;
      for (const p of TIDE_POOL_SPECS) {
        const pd = Math.hypot((x - p.px) / p.rx, (y - p.py) / p.ry);
        if (pd < 1.15) {
          const depth = (1.0 - smoothstep(0.45, 1.12, pd)) * 0.24;
          if (depth > poolCarve) poolCarve = depth;
          if (pd < 0.88) inTidePool = true;
        }
      }

      const subtidalFloor = 0.20 + fbm(x * 1.5, y * 1.5) * 0.07;
      rawH = subtidalFloor + (benchSlope - jointGroove + beddingRib - poolCarve - subtidalFloor) * onBench;

      if (onBench < 0.35) {
        color.set(mixColor('#0b2433', '#143f54', fbm(x * 3, y * 3)));
      } else if (inTidePool) {
        // 조수 웅덩이 바닥: 맑은 해수와 녹조·말미잘 암반
        color.set(mixColor('#143d45', '#215961', fbm(x * 6, y * 6)));
      } else if (jointGroove > 0.06) {
        // 절리 틈새: 파래·김 등 해조류와 방해석 맥 흔적
        color.set(mixColor('#1f3322', '#2f4a2e', fbm(x * 6, y * 6)));
      } else {
        // 평탄하게 깎여 드러난 회갈색~암회색 수성퇴적암 파식면
        const rockGrain = Math.sin(x * 4.2 + y * 0.5) * 0.5 + 0.5;
        color.set(mixColor('#4f4c46', '#757066', rockGrain * 0.65 + fbm(x * 4, y * 4) * 0.35));
      }
    }

    h = rawH * reliefScale;
    return { height: h, color };
  }

  return null;
}
