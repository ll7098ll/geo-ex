import * as THREE from 'three';
import {
  fbm,
  warpedFbm,
  ridgedFbm,
  hexVoronoi,
  smoothstep,
  smax,
  clamp,
  sdSegment,
  mixColor,
  TerrainEvalResult,
} from '../terrainMath';

/**
 * C1-continuous analytical Barchan crescentic sand dune evaluator.
 * Guarantees zero height and zero slope at horn tips (no rectangular box clipping!),
 * with a gentle convex windward stoss slope (10-14 deg) and a sharp 34 deg leeward slip-face brink.
 */
function evalBarchanDune(
  px: number,
  py: number,
  cx: number,
  cy: number,
  scale: number,
  heightMax: number,
  windAngle = -0.35
): { h: number; isSlipFace: boolean; ripples: number } {
  const cosA = Math.cos(windAngle);
  const sinA = Math.sin(windAngle);
  // u: cross-wind axis, v: downwind axis (wind blows from v < 0 toward v > 0; horns point toward +v)
  const u = ((px - cx) * cosA - (py - cy) * sinA) / scale;
  const v = ((px - cx) * sinA + (py - cy) * cosA) / scale;

  const halfW = 1.65;
  if (Math.abs(u) >= halfW) {
    return { h: 0, isSlipFace: false, ripples: 0 };
  }

  // Smooth C1 horn taper: (1 - (u/W)^2)^1.75 -> 0 height and 0 derivative at |u| = halfW
  const uNorm = u / halfW;
  const widthEnvelope = Math.pow(Math.max(0.0, 1.0 - uNorm * uNorm), 1.75);

  // Parabolic brink line curving forward (+v) into the two crescent horns
  const vBrink = 0.42 * u * u - 0.15;
  const dv = v - vBrink;

  // Stoss length (upwind) and slip-face length (downwind) taper smoothly toward the horns
  const stossLen = 1.55 * (1.0 - 0.35 * uNorm * uNorm);
  const slipLen = 0.62 * (0.45 + 0.55 * (1.0 - uNorm * uNorm));

  if (dv <= 0) {
    // Windward stoss slope (dv in [-stossLen, 0])
    if (dv <= -stossLen) return { h: 0, isSlipFace: false, ripples: 0 };
    const tStoss = clamp(1.0 + dv / stossLen, 0.0, 1.0);
    const profile = Math.pow(smoothstep(0.0, 1.0, tStoss), 1.12);
    const ripples =
      Math.sin(v * scale * 8.5 + Math.cos(u * scale * 2.0) * 1.4) *
      0.032 *
      Math.sin(tStoss * Math.PI) *
      widthEnvelope;
    return {
      h: heightMax * widthEnvelope * profile + ripples,
      isSlipFace: false,
      ripples,
    };
  } else {
    // Leeward 34-degree avalanche slip-face (dv in (0, slipLen])
    if (dv >= slipLen) return { h: 0, isSlipFace: false, ripples: 0 };
    const tSlip = clamp(1.0 - dv / slipLen, 0.0, 1.0);
    // Smooth foot transition at tSlip -> 0, linear steep slope near brink tSlip -> 1
    const profile = tSlip * tSlip * (2.0 - tSlip);
    return {
      h: heightMax * widthEnvelope * profile,
      isSlipFace: tSlip > 0.08,
      ripples: 0,
    };
  }
}

export const MUSHROOM_PEDESTAL_SPECS = [
  { mx: 0.0, my: -0.35, plinthR: 0.85 },   // 중앙 주 버섯바위 (여왕머리/이집트 백사막 주봉)
  { mx: 4.15, my: 2.35, plinthR: 0.65 },   // 우측 후면 제2 버섯바위
  { mx: -4.25, my: 1.85, plinthR: 0.62 },  // 좌측 후면 제3 버섯바위
];

export function evalAridTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // =========================================================================
  // 1. 사막 (바르한 초승달 사구군 & 횡사구 에르그 모래바다: 소수스블레이, 사하라 에르그 셰비)
  // C1 연속 함수로 사각형 절단 아티팩트를 100% 제거하고 날카로운 브링크(Brink) 능선과 34° 사태면 구현!
  // =========================================================================
  if (normSub === '사막') {
    const dunes = [
      { cx: -0.8, cy: 0.4, scale: 2.35, hMax: 3.35, ang: -0.42 },  // 중앙 거대 주 바르한 사구
      { cx: 4.4, cy: 3.2, scale: 1.75, hMax: 2.45, ang: -0.38 },   // 북동 사구
      { cx: -4.8, cy: -3.2, scale: 1.85, hMax: 2.65, ang: -0.45 }, // 남서 사구
      { cx: 3.9, cy: -3.6, scale: 1.55, hMax: 2.05, ang: -0.35 },  // 남동 사구
      { cx: -4.9, cy: 4.4, scale: 1.65, hMax: 2.25, ang: -0.40 },  // 북서 사구
    ];

    let maxDuneH = 0;
    let onSlipFace = false;
    for (const dn of dunes) {
      const res = evalBarchanDune(x, y, dn.cx, dn.cy, dn.scale, dn.hMax, dn.ang);
      if (res.h > maxDuneH) {
        maxDuneH = res.h;
        onSlipFace = res.isSlipFace;
      }
    }

    // 배경 사구간 저지대(Interdune corridor) 및 거대 선형 사구 잔물결 기복
    const bgUndulation =
      warpedFbm(x * 0.28, y * 0.28, 3) * 0.32 +
      Math.sin((x * 0.85 - y * 0.52) * 5.5) * 0.028 * (1.0 - clamp(maxDuneH / 0.8, 0, 1));

    const rawH = Math.max(0.28, 0.36 + maxDuneH + bgUndulation);
    h = rawH * reliefScale;

    if (maxDuneH < 0.14) {
      // 사구 사이 평탄한 자갈·조립사 바닥 (Interdune serir / reg corridor)
      color.set(mixColor('#a87642', '#c48f56', fbm(x * 4, y * 4)));
    } else if (onSlipFace) {
      // 바람그늘 34° 슬립페이스(Slip-face): 그늘진 붉은 황토·테라코타빛 고운 모래 사태면
      color.set(mixColor('#b86830', '#d17e41', fbm(x * 4, y * 4)));
    } else {
      // 햇빛을 받아 황금빛·살구빛으로 빛나는 풍상측 완사면 및 칼날 능선
      const crestHighlight = smoothstep(1.2, 3.4, rawH);
      color.set(mixColor('#d99952', '#f5c478', crestHighlight * 0.78 + fbm(x * 3.5, y * 3.5) * 0.22));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 2. 버섯바위 (모래바람 도약 마모가 빚은 풍식 자갈 사막 Reg & 기저 풍식 와지: 이집트 백사막, 야류, 고블린밸리)
  // 잘록한 버섯 목(z = 0.7~1.8)을 파묻어버리던 기존 마운드(h=1.95)를 완전히 제거하고,
  // 평탄한 사막 포도(Desert Pavement, h ≈ 0.48)와 와류 세굴 홈 위에 정교한 3D 층리 버섯바위 볼륨을 직결!
  // =========================================================================
  if (normSub === '버섯바위') {
    // 바람에 세립분이 날아가고 자갈과 풍식 암반이 남은 평탄한 사막 포도(Reg)
    const desertPavement =
      0.48 +
      warpedFbm(x * 0.35, y * 0.35, 3) * 0.14 +
      Math.sin(x * 4.8 - y * 1.6) * 0.022;

    // 외곽 배후(y > 6.2)의 낮은 풍식 야르당(Yardang: 바람 방향으로 길게 깎인 유선형 사암 둔덕)
    const yardang =
      y > 5.2
        ? smoothstep(5.2, 8.8, y) *
          Math.pow(Math.max(0, Math.cos(x * 0.85)), 2.2) *
          0.95
        : 0;

    // 각 3D 버섯바위 기둥 바로 밑동을 받치는 낮은 기반암 받침(h <= 0.64)과 그 둘레의 바람 와류 세굴 와지(Scour moat)
    let plinthLift = 0;
    let scourDip = 0;
    for (const m of MUSHROOM_PEDESTAL_SPECS) {
      const dm = Math.hypot(x - m.mx, y - m.my);
      if (dm < m.plinthR * 2.2) {
        // 기둥 바로 밑(dm < plinthR*0.65)은 0.14m 살짝 솟아 암반 뿌리를 형성하고,
        // 둘레(dm ≈ plinthR*1.2)는 모래바람 와류로 0.07m 오목하게 패임!
        const root = (1.0 - smoothstep(0.0, m.plinthR * 0.75, dm)) * 0.14;
        const moat = Math.exp(-Math.pow((dm - m.plinthR * 1.25) / 0.42, 2.0)) * 0.07;
        plinthLift = Math.max(plinthLift, root);
        scourDip = Math.max(scourDip, moat);
      }
    }

    const rawH = Math.max(0.32, desertPavement + yardang + plinthLift - scourDip);
    h = rawH * reliefScale;

    if (yardang > 0.35) {
      // 배후 야르당 풍식 사암 층리
      const strata = Math.sin(rawH * 12.0) * 0.5 + 0.5;
      color.set(mixColor('#a66c3b', '#d19862', strata));
    } else if (plinthLift > 0.04) {
      // 버섯바위 밑동 기반암 노두
      color.set(mixColor('#9c683b', '#ba8250', fbm(x * 6, y * 6)));
    } else if (scourDip > 0.03) {
      // 기둥 주변 와류 세굴 홈에 모인 밝은 세립 석영 모래
      color.set(mixColor('#d9b077', '#edd09f', fbm(x * 5, y * 5)));
    } else {
      // 사막 포도(Desert Pavement / Reg): 적갈색 사막 바니시(Desert varnish) 자갈과 황토 모래 평원
      const gravelNoise = fbm(x * 5.5, y * 5.5, 3);
      color.set(mixColor('#916940', '#b88b58', gravelNoise));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 3. 메사·뷰트 (수평 사암·셰일 지층의 차별침식 단계 메사 -> 뷰트 -> 스파이어: 모뉴먼트 밸리)
  // 굴곡진 앨코브·스퍼 단애를 지닌 테이블형 메사 + 독립 원기둥 뷰트 + 뾰족한 침봉(Spire) + 오목 애추(Talus)
  // =========================================================================
  if (normSub === '메사·뷰트') {
    // 1) 메사 (Mesa: 좌측 후면 (-3.5, 1.4) 중심, 폭이 높이보다 넓은 평정 탁자형 대지 + 방사상 침식 홈 Scalloped alcoves)
    const mx = (x + 3.5) / 3.45;
    const my = (y - 1.4) / 2.45;
    const mAng = Math.atan2(my, mx);
    // 단순 직사각형이 아닌 실제 콜로라도 고원처럼 절리 침식으로 패인 굴곡진 림록(Rimrock) 외곽선!
    const alcoveMod =
      1.0 +
      0.14 * Math.sin(mAng * 5.0 + 0.4) +
      0.09 * Math.cos(mAng * 8.0) +
      (fbm(x * 0.6, y * 0.6, 2) - 0.5) * 0.12;
    const rMesa = Math.pow(Math.pow(Math.abs(mx), 2.6) + Math.pow(Math.abs(my), 2.6), 1.0 / 2.6) / alcoveMod;

    let mesaH = 0;
    if (rMesa < 0.76) {
      // 저항성 사암 캡록(Caprock)이 보호하는 극평탄 테이블 정상면
      mesaH = 4.55 + fbm(x * 1.2, y * 1.2) * 0.07;
    } else if (rMesa < 0.96) {
      // 80° 수직 캡록 절벽 + 중간 경암 벤치 단차
      const tCliff = (0.96 - rMesa) / 0.20;
      const benchStep = Math.sin(tCliff * Math.PI * 2.0) * 0.09;
      mesaH = 2.45 + Math.pow(tCliff, 0.72) * 2.10 + benchStep;
    } else if (rMesa < 1.85) {
      // 하부 무른 셰일층 위에 쌓인 오목한 34° 애추(Talus apron) 사면과 방사상 침식골(Rills)
      const tTalus = (1.85 - rMesa) / 0.89;
      const rillGroove = Math.sin(mAng * 18.0 + rMesa * 2.0) * 0.06 * tTalus * (1.0 - tTalus);
      mesaH = 0.52 + Math.pow(tTalus, 1.45) * 1.93 + rillGroove;
    }

    // 2) 뷰트 (Butte: 우측 중앙 (3.7, 0.8) 중심, 메사가 깎여 정상 면적이 좁아진 고립 바위산)
    const bx = x - 3.7;
    const by = y - 0.8;
    const bAng = Math.atan2(by, bx);
    const bMod = 1.0 + 0.12 * Math.sin(bAng * 4.0 + 1.1) + 0.08 * Math.cos(bAng * 6.0);
    const rButte = Math.hypot(bx, by * 1.08) / bMod;

    let butteH = 0;
    if (rButte < 0.82) {
      butteH = 4.22 + fbm(x * 1.8, y * 1.8) * 0.08;
    } else if (rButte < 1.18) {
      const tCliff = (1.18 - rButte) / 0.36;
      butteH = 2.25 + Math.pow(tCliff, 0.75) * 1.97;
    } else if (rButte < 2.65) {
      const tTalus = (2.65 - rButte) / 1.47;
      const rills = Math.sin(bAng * 14.0) * 0.05 * tTalus * (1.0 - tTalus);
      butteH = 0.52 + Math.pow(tTalus, 1.48) * 1.73 + rills;
    }

    // 3) 스파이어 / 침봉 (Spire / Pinnacle: 전면 우측 (1.8, -4.1), 뷰트가 더욱 침식되어 기둥만 남은 최종 단계!)
    const sx = x - 1.8;
    const sy = y + 4.1;
    const sAng = Math.atan2(sy, sx);
    const rSpire = Math.hypot(sx, sy) / (1.0 + 0.1 * Math.sin(sAng * 3.0));

    let spireH = 0;
    if (rSpire < 0.28) {
      spireH = 3.85 + fbm(x * 3, y * 3) * 0.08;
    } else if (rSpire < 0.56) {
      const tCliff = (0.56 - rSpire) / 0.28;
      spireH = 1.95 + Math.pow(tCliff, 0.7) * 1.90;
    } else if (rSpire < 1.75) {
      const tTalus = (1.75 - rSpire) / 1.19;
      spireH = 0.52 + Math.pow(tTalus, 1.5) * 1.43;
    }

    // 기저부 적색 사막 페디먼트 평원 및 마른 건천(Arroyo) 바닥
    const arroyoDist = Math.abs(x - (0.3 + Math.sin(y * 0.38) * 1.1));
    const arroyoCut = (1.0 - smoothstep(0.25, 0.85, arroyoDist)) * 0.12;
    const desertPlain = 0.52 - arroyoCut + fbm(x * 0.6, y * 0.6) * 0.10;

    const rawH = Math.max(desertPlain, smax(mesaH, Math.max(butteH, spireH), 0.18));
    h = rawH * reliefScale;

    // 수평 퇴적 지층(Bedding strata): 수직 절벽과 애추에 드러나는 붉은 산화철 사암·셰일 줄무늬
    const strata = Math.sin(rawH * 10.5) * 0.5 + 0.5;
    if (rawH > 4.15) {
      // 메사·뷰트 상부 평탄 캡록 표면
      color.set(mixColor('#b85d35', '#d6784b', fbm(x * 4, y * 4)));
    } else if (rawH > 2.15) {
      // 수직 림록 단애: 적갈색 디섈리 사암(De Chelly Sandstone)과 밝은 사암 호층
      color.set(mixColor('#8f341b', '#d1683d', strata));
    } else if (rawH > 0.72) {
      // 오목한 애추(Talus) 사면: 오렌지빛·적갈색 오르간 록 셰일(Organ Rock Shale) 암설
      color.set(mixColor('#a85432', '#c97149', strata * 0.4 + fbm(x * 5, y * 5) * 0.6));
    } else {
      // 사막 평원 적황색 모래 및 건조 관목 패치
      color.set(mixColor('#c79258', '#deb076', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 4. 와디 (건조 사암 고원을 가르는 수지상 돌발홍수 협곡 & 마른 망상 자갈 하상: 와디 럼, 페트라 시크)
  // 물이 상시 흐르는 푸른 강이 아니라, 망상 자갈·모래톱과 건열 실트지가 드러난 건천(Dry Wash) 하상으로 조형!
  // =========================================================================
  if (normSub === '와디') {
    // 1) 주 와디 슬롯 캐니언 유로 (S자로 굽이치며 전면 y < -6.2 산록 입구에서 부채꼴로 개방됨)
    const wadiX = Math.sin(y * 0.36) * 2.15 + Math.cos(y * 0.19) * 0.75;
    const d1x = 0.36 * 2.15 * Math.cos(y * 0.36) - 0.19 * 0.75 * Math.sin(y * 0.19);
    const perpMain = Math.abs(x - wadiX) / Math.sqrt(1.0 + d1x * d1x);

    // 2) 동쪽 고원에서 합류하는 지류 건천 협곡 (Tributary Wadi)
    const tribSeg = sdSegment(
      x + Math.sin(y * 0.6) * 0.35,
      y,
      wadiX + 0.2,
      0.8,
      7.8,
      5.6
    );
    const perpTrib = x > wadiX - 0.3 ? tribSeg.dist / 0.68 : 99.0;

    // 전면 출구(y < -5.5)로 나오면서 협곡 폭이 나팔 모양으로 넓어짐
    const mainHalfW = 0.92 + smoothstep(-4.0, -9.5, y) * 1.65;
    const wadiRatio = Math.min(perpMain / mainHalfW, perpTrib);

    // 3) 계단식 적색 사암 고원 단애 (후면·측면은 3.9~4.5m 고원, 전면 y < -6.5는 분지 평원으로 열림)
    const plateauMask = smoothstep(-8.2, -4.5, y);
    const plateauTop = (3.85 + warpedFbm(x * 0.38, y * 0.38, 4) * 0.55) * plateauMask + 0.65 * (1.0 - plateauMask);

    // 와디 하상 내부의 돌발홍수(Flash flood) 망상 자갈·모래 바(Longitudinal gravel bars)
    const braidBar =
      Math.sin((x - wadiX) * 4.5 + Math.sin(y * 0.8) * 1.6) * 0.08 * clamp(1.0 - wadiRatio, 0.0, 1.0);
    const dryBedH = 0.44 + (y + 10.0) * 0.016 + Math.max(0, braidBar) + fbm(x * 2.5, y * 2.5) * 0.05;

    let rawH = dryBedH;
    if (wadiRatio >= 0.82) {
      const wallT = clamp((wadiRatio - 0.82) / 0.95, 0.0, 1.0);
      // 사암 지층 단차(Terraced sandstone canyon ledges)
      const terraceStep = Math.sin(wallT * Math.PI * 4.0) * 0.09 * plateauMask;
      rawH = dryBedH + Math.pow(wallT, 0.68) * (plateauTop - dryBedH) + terraceStep;
    }

    h = Math.max(0.28, rawH * reliefScale);

    if (wadiRatio < 0.85) {
      // 평상시 바싹 마른 건천 자갈·모래 하상 (Dry braided gravel bed & flash-flood boulders)
      const isBarCrest = braidBar > 0.025;
      color.set(
        isBarCrest
          ? mixColor('#b8a386', '#d4bf9e', fbm(x * 6, y * 6))
          : mixColor('#8f7d68', '#a8957d', fbm(x * 7, y * 7))
      );
    } else if (wadiRatio < 1.72 && plateauMask > 0.25) {
      // 플래시 플러드가 깎아낸 수직 적갈색·황토색 사암 슬롯 캐니언 절벽
      const strata = Math.sin(rawH * 11.0 + y * 0.25) * 0.5 + 0.5;
      color.set(mixColor('#8c3b20', '#cc6b3d', strata));
    } else {
      // 상부 건조 암석 사막 고원(함마다/Hammada)
      color.set(mixColor('#b57c47', '#cf965d', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 5. 오아시스 (거대 초승달 사구 병풍 속 풍식 와지 & 초승달 용천 호수(월아천) & 대추야자 녹지대: 둔황 월아천, 와카치나)
  // 사인파 격자 대신 비대칭 초승달 사구 능선이 오목한 용출수 호수를 포위하도록 조형!
  // =========================================================================
  if (normSub === '오아시스') {
    // 1) 중앙 오아시스 와지(Blowout depression)를 병풍처럼 감싸 안는 비대칭 거대 사구 능선
    const rCenter = Math.hypot(x, y * 1.08);
    const ang = Math.atan2(y, x);

    // 후면·좌우(북·서·동)에서 높게 솟아오른 에르그 사구 병풍 + 전면 남쪽으로 살짝 낮아져 카메라 시야 확보!
    const surroundDune =
      smoothstep(1.9, 6.2, rCenter) *
      (1.85 + 0.85 * Math.sin(ang * 2.0 + 0.6) + 0.55 * Math.sin(ang) + warpedFbm(x * 0.35, y * 0.35, 3) * 0.65);
    const duneRipples = Math.sin(x * 6.5 - y * 2.2) * 0.04 * smoothstep(2.4, 4.5, rCenter);

    // 2) 둔황 월아천(Crescent Lake) 스타일 초승달 모양 지하수 용출 호수 와지 (중심 (0, -0.25))
    const lakeArcY = -0.55 + 0.22 * x * x;
    const dLake = Math.hypot(x / 2.05, (y - lakeArcY) / 1.05);
    const inSpringBasin = 1.0 - smoothstep(0.65, 1.45, dLake);

    const rawH = Math.max(
      0.26,
      0.92 + surroundDune + duneRipples - inSpringBasin * 0.64 + fbm(x * 1.5, y * 1.5) * 0.05
    );
    h = rawH * reliefScale;

    if (dLake < 0.98 && rawH < 0.66) {
      // 사막 한가운데 지하수가 솟아오른 맑은 에메랄드·청록빛 오아시스 담수호 바닥
      color.set(mixColor('#095966', '#148291', fbm(x * 4, y * 4)));
    } else if (dLake < 1.75 && rawH < 1.28) {
      // 수변 대추야자(Date Palm) 숲과 갈대·잔디 녹색 생명 벨트!
      color.set(mixColor('#225c1b', '#387d2c', fbm(x * 4.5, y * 4.5)));
    } else if (dLake < 2.25 && rawH < 1.65) {
      // 오아시스 외곽 습윤 사질토 및 흙벽돌 취락 터
      color.set(mixColor('#b88e56', '#cfa66b', fbm(x * 4, y * 4)));
    } else {
      // 오아시스를 포위한 황금빛 사막 모래언덕
      const slipShade = Math.sin(ang * 3.0) * 0.5 + 0.5;
      color.set(mixColor('#cc8e47', '#f0bf75', slipShade * 0.6 + fbm(x * 3, y * 3) * 0.4));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 6. 플라야 (내륙 폐쇄 분지의 산록 바하다·페디먼트와 중앙 육각형 암염 소금평원: 우유니, 데스밸리 배드워터)
  // 외곽 테두리의 건조 산록 완사면(Bajada)이 중앙의 순백색 육각 다각형 소금판(Salt Pan)을 둘러싸 분지 지형 완성!
  // =========================================================================
  if (normSub === '플라야') {
    // 타원형 내륙 폐쇄 분지 반경 (전면 카메라 쪽은 낮게 열어 소금 평원이 시원하게 보이도록 구성)
    const basinRx = 7.4 + Math.sin(y * 0.4) * 0.45;
    const basinRy = y > 0 ? 6.6 : 9.2;
    const rBasin = Math.hypot(x / basinRx, y / basinRy);

    if (rBasin < 0.82) {
      // 1) 중앙 플라야 염호 바닥 (Playa Salt Flat): 극평탄 증발 암염 대지 + 기하학적 육각형 소금 결정 융기선(Salt Polygons)!
      const { dist } = hexVoronoi(x * 1.65, y * 1.65);
      const saltRidge = smoothstep(0.74, 0.94, dist);
      const rawH = 0.30 + saltRidge * 0.055 + fbm(x * 0.8, y * 0.8) * 0.012;
      h = rawH * reliefScale;

      if (saltRidge > 0.38) {
        // 솟아오른 순백색 할라이트(Halite / 암염) 다각형 결정 테두리
        color.set(mixColor('#f4f1ed', '#ffffff', fbm(x * 6, y * 6)));
      } else {
        // 얇은 염수막이 하늘을 비추는 연회백색·아이보리 소금 결정판
        color.set(mixColor('#ded8ce', '#f0ece4', fbm(x * 4, y * 4)));
      }
      return { height: h, color };
    } else {
      // 2) 염호 가장자리 염류 니질대(Saline Mudflat Apron: 0.82 ~ 0.98) -> 외곽 복합 선상지 바하다(Bajada) 및 건조 산록(rBasin >= 0.98)
      const mudT = smoothstep(0.82, 0.98, rBasin);
      const bajadaT = Math.max(0, rBasin - 0.95);
      const bajadaFans =
        Math.pow(bajadaT, 1.55) * 3.25 +
        Math.sin(Math.atan2(y, x) * 14.0) * 0.08 * smoothstep(0.95, 1.25, rBasin) +
        ridgedFbm(x * 0.65, y * 0.65, 3) * 0.38 * bajadaT;

      const rawH = 0.31 + mudT * 0.14 + bajadaFans;
      h = rawH * reliefScale;

      if (rBasin < 0.98) {
        // 소금판과 산록 사이의 황회색·적갈색 염류 진흙 전이대(Saline mudflat ring)
        color.set(mixColor('#b59f84', '#d6c8b4', 1.0 - mudT));
      } else if (rawH < 1.35) {
        // 바하다(Bajada) 산록 완사면 자갈 선상지
        color.set(mixColor('#966b47', '#b3835b', fbm(x * 4, y * 4)));
      } else {
        // 분지를 둘러싼 붉은 건조 황무지 산악 암벽
        const strata = Math.sin(rawH * 9.0) * 0.5 + 0.5;
        color.set(mixColor('#6e3f28', '#995c3d', strata));
      }
      return { height: h, color };
    }
  }

  return null;
}
