import * as THREE from 'three';
import {
  fbm,
  warpedFbm,
  ridgedFbm,
  smoothstep,
  smax,
  clamp,
  sdSegment,
  mixColor,
  TerrainEvalResult,
} from '../terrainMath';

// Incised Omega (Ω) meander canyon spine (영월 한반도지형 / 동강 어라연 / 호스슈 벤드 스타일)
export const INCISED_OMEGA_SPINE: [number, number][] = [
  [-6.8, 10.2],
  [-4.4, 7.6],
  [-1.95, 4.9],  // 곡류 잘록한 목(Meander Neck) 좌측 진입
  [-3.85, 1.8],
  [-4.95, -1.6], // 서쪽 루프 외벽
  [-3.35, -4.55],
  [0.0, -5.45],  // 전면 중앙 말발굽 정점 (카메라 정면 조망!)
  [3.45, -4.45],
  [4.95, -1.45], // 동쪽 루프 외벽
  [3.75, 1.9],
  [1.95, 4.85],  // 곡류 잘록한 목(Meander Neck) 우측 통과
  [4.5, 7.5],
  [7.0, 10.2],
];

export function getWaterfallLipY(x: number): number {
  // 상류 후면(y > 1.4)에서 전면(y < 1.4)으로 말발굽 형태로 파고든 두부침식 폭포 립(Lip)
  const horseshoeIndent = Math.cos(clamp(x / 2.8, -1.0, 1.0) * Math.PI * 0.5) * 0.72;
  return 1.35 + horseshoeIndent + Math.sin(x * 0.65) * 0.12;
}

export function evalFluvialTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // =========================================================================
  // 1. 선상지 (배후 협곡 출구 선정 -> 선앙 망상 복류대 -> 선단 용천대: 구례 간전, 데스밸리)
  // 후면(y > 3.6) 험준한 산지 V자 계곡에서 전면(y < 3.6) 평야로 단차 없이 매끄럽게 퍼지는 부채꼴 원추
  // =========================================================================
  if (normSub === '선상지') {
    const apexX = 0.0;
    const apexY = 3.8;

    // 1) 후면 산지 전면 단층·산록 경계선 (y ≈ 3.65) 및 상류 공급 V자 협곡
    const mtnFrontY = 3.65 + Math.cos(x * 0.28) * 0.42;
    const gorgeCenterX = Math.sin((y - apexY) * 0.38) * 0.65 * smoothstep(apexY, 9.5, y);
    const gorgeDistX = Math.abs(x - gorgeCenterX);

    // 상류 협곡 하상은 y=10(h=3.65)에서 선정 y=3.8(h=2.45)까지 연속적으로 내려와 선상지 정점과 정확히 일치!
    const gorgeBedH = 2.45 + clamp((y - apexY) / 6.2, 0.0, 1.0) * 1.22;
    const gorgeWallRise = Math.pow(gorgeDistX / 1.45, 1.35) * 2.55;
    const mountainBody =
      smoothstep(mtnFrontY - 0.65, mtnFrontY + 1.85, y) *
      (Math.min(5.55, gorgeBedH + gorgeWallRise) + ridgedFbm(x * 0.45, y * 0.45, 4) * 0.48);

    // 2) 방사상 부채꼴 선상지 원추 (Fan Cone: 선정 -> 선앙 -> 선단 오목 지수 경사면)
    const dx = x - apexX;
    const dy = apexY - y; // 전면(-y)으로 갈수록 양(+)으로 증가
    const rFan = Math.hypot(dx, Math.max(-0.6, dy));
    const fanAzimuth = Math.atan2(dx, Math.max(0.25, dy)); // 부채꼴 방사각 (-1.15 ~ +1.15 rad)

    const fanRadius = 12.6;
    const radialT = clamp(1.0 - rFan / fanRadius, 0.0, 1.0);
    const sectorEnvelope = 1.0 - smoothstep(0.88, 1.32, Math.abs(fanAzimuth));
    const fanConeBase = 0.36 + 2.12 * Math.pow(radialT, 1.45) * sectorEnvelope;

    // 3) 방사상 분기 망상 유로(Braided Channels): 선정에서는 깊고 뚜렷하며, 선앙에서 복류로 얕아짐
    const braidPhase1 = Math.sin(fanAzimuth * 9.0 + Math.sin(rFan * 0.9) * 1.1);
    const braidPhase2 = Math.sin(fanAzimuth * 19.0 - rFan * 1.3 + fbm(x * 0.7, y * 0.7) * 2.2);
    const activeMainBranch = smoothstep(0.75, 0.98, Math.cos((fanAzimuth + 0.12) * 3.2 + Math.sin(rFan * 0.6) * 0.5));
    const braidCarve =
      (activeMainBranch * 0.16 + Math.max(0, braidPhase1) * 0.06 + Math.max(0, braidPhase2) * 0.035) *
      smoothstep(0.3, 1.6, rFan) *
      (1.0 - smoothstep(6.2, 9.2, rFan)) *
      sectorEnvelope;

    // 4) 선단(Fan Toe, rFan ≈ 9.2~11.8) 외곽 평야 및 용천수 집수 소하천 (y ≈ -8.2)
    const collectorY = -8.25 + Math.cos(x * 0.22) * 0.55;
    const collectorCut = (1.0 - smoothstep(0.28, 0.85, Math.abs(y - collectorY))) * 0.22;
    const lowlandPlain = 0.36 - collectorCut + fbm(x * 0.9, y * 0.9) * 0.04;

    const fanTotal = Math.max(lowlandPlain, fanConeBase - braidCarve + fbm(x * 1.4, y * 1.4) * 0.05);
    const rawH = y > mtnFrontY - 0.5 ? smax(fanTotal, mountainBody, 0.38) : fanTotal;
    h = Math.max(0.18, rawH * reliefScale);

    const isUpperStream = y > apexY - 0.4 && gorgeDistX < 0.48;
    const isApexBraid = rFan < 4.2 && activeMainBranch > 0.55 && sectorEnvelope > 0.5 && y <= apexY;
    const isSpringStream = Math.abs(y - collectorY) < 0.52 || (rFan > 8.8 && rFan < 11.5 && Math.abs(Math.sin(fanAzimuth * 7.0)) > 0.92);

    if (isUpperStream || isApexBraid || isSpringStream) {
      // 상류 계곡수 -> 선정 망상 물줄기 -> (선앙 지하 복류) -> 선단 용천수 재출현!
      color.set(mixColor('#165161', '#267285', fbm(x * 5, y * 5)));
    } else if (y > mtnFrontY + 0.15 && mountainBody > fanTotal) {
      // 배후 산지 암릉 및 온대 산림
      color.set(
        rawH > 4.4
          ? mixColor('#665c52', '#82776b', fbm(x * 4, y * 4))
          : mixColor('#2d4f24', '#416932', fbm(x * 2.5, y * 2.5))
      );
    } else if (rFan < 3.0 && sectorEnvelope > 0.4) {
      // 선정(Fan Apex): 조립질 호박돌·자갈 각력 퇴적지
      color.set(mixColor('#736a5e', '#94897b', fbm(x * 6, y * 6)));
    } else if (rFan < 8.6 && sectorEnvelope > 0.35) {
      // 선앙(Mid-fan): 배수가 잘되는 사력질 복류천 지대 (과수원·밭 패치와 건천 자갈길 교차)
      const dryGravel = braidCarve > 0.055;
      const orchardPatch = fbm(Math.floor(x * 0.9), Math.floor(y * 0.9)) > 0.48;
      if (dryGravel) {
        color.set(mixColor('#968b78', '#b0a48e', fbm(x * 6, y * 6)));
      } else {
        color.set(
          orchardPatch
            ? mixColor('#5c7338', '#788f4c', fbm(x * 3, y * 3))
            : mixColor('#8f7d5b', '#a8946f', fbm(x * 3.5, y * 3.5))
        );
      }
    } else {
      // 선단(Fan Toe) 용천대 및 충적 평야 비옥한 논농사 지대
      color.set(mixColor('#356629', '#4b823b', fbm(x * 2.5, y * 2.5)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 2. 곡류천 (평야 자유곡류천 + 곡률 기반 공격/활주사면 비대칭 + 초승달 우각호: 미시시피, 동천)
  // 수학적 2차 도함수 곡률 부호에 따라 외측 하식애(급경사) vs 내측 포인트바(완경사 모래톱) 정밀 구현
  // =========================================================================
  if (normSub === '곡류천') {
    // 본류 자유곡류 S자 곡선 (동쪽에 배치하여 서쪽 평야에 단절된 우각호를 선명하게 조망)
    const riverX = 1.65 + 2.65 * Math.sin(y * 0.38) + 0.45 * Math.sin(y * 0.76);
    const d1x = 2.65 * 0.38 * Math.cos(y * 0.38) + 0.45 * 0.76 * Math.cos(y * 0.76);
    const d2x = -2.65 * 0.38 * 0.38 * Math.sin(y * 0.38) - 0.45 * 0.76 * 0.76 * Math.sin(y * 0.76);

    // 곡선에 수직인 실제 거리(법선 거리)로 계산하여 급커브에서도 균일한 하폭 유지
    const signedPerp = (x - riverX) / Math.sqrt(1.0 + d1x * d1x);
    const absPerp = Math.abs(signedPerp);

    // 곡률 부호 판별: d2x < 0 이면 곡선이 +X로 볼록 -> +X쪽(signedPerp > 0)이 공격사면(Cut-bank), -X쪽이 활주사면(Point-bar)!
    const bendIntensity = clamp(Math.abs(d2x) / 0.35, 0.0, 1.0);
    const onConvexOuterSide = (d2x < 0 && signedPerp > 0) || (d2x > 0 && signedPerp < 0);
    const onConcavePointBar = (d2x < 0 && signedPerp < 0) || (d2x > 0 && signedPerp > 0);

    const chanHalfW = 0.68;
    // 외측 공격사면은 0.28m 만에 수직에 가깝게 급락, 내측 활주사면은 1.85m에 걸쳐 완만하게 상승!
    const bankSpan = onConvexOuterSide
      ? 0.28 + (1.0 - bendIntensity) * 0.35
      : 0.65 + bendIntensity * 1.35;

    const plainBase = 1.24 + warpedFbm(x * 0.35, y * 0.35, 3) * 0.12;
    // 공격사면 직상부 자연제방 미고지
    const cutBankRim =
      onConvexOuterSide && absPerp > chanHalfW && absPerp < chanHalfW + 1.2
        ? Math.exp(-Math.pow((absPerp - chanHalfW - 0.35) / 0.45, 2.0)) * 0.18 * bendIntensity
        : 0;

    let riverT = smoothstep(chanHalfW * 0.65, chanHalfW + bankSpan, absPerp);
    if (onConcavePointBar) {
      // 포인트바 특유의 호상 사주열(Scroll bars) 미세 주름
      riverT = Math.pow(riverT, 1.35);
    }
    // 최심하상선(Thalweg)도 원심력에 의해 공격사면 쪽으로 치우침!
    const thalwegShift = (d2x < 0 ? 0.22 : -0.22) * bendIntensity;
    const thalwegDeep = Math.exp(-Math.pow((signedPerp - thalwegShift) / 0.42, 2.0)) * 0.12;
    const channelBed = 0.24 - thalwegDeep;

    let rawH = channelBed + (plainBase + cutBankRim - channelBed) * riverT;

    // 서쪽 평야에 유로 절단(Neck Cutoff)으로 고립된 초승달 모양 우각호(Oxbow Lake) & 구하도 습지(Meander Scar)
    const oxCx = -4.35;
    const oxCy = 0.85;
    const oxDx = x - oxCx;
    const oxDy = y - oxCy;
    const oxR = Math.hypot(oxDx, oxDy * 0.88);
    const oxAng = Math.atan2(oxDy, oxDx); // 동쪽(0 rad)이 본류를 향한 옛 절단목(Neck) 방향!
    // 동쪽 입구(|oxAng| < 0.82)는 토사로 메워져 막히고(Plugged neck), 서쪽 반원 호가 초승달 호수로 남음
    const oxArcMask = smoothstep(0.58, 1.18, Math.abs(oxAng));
    const oxRingDist = Math.abs(oxR - 2.15);
    const oxWaterCarve = (1.0 - smoothstep(0.18, 0.68, oxRingDist)) * oxArcMask;
    // 막힌 절단목 구하도 흔적(Meander scar swale)
    const scarCarve =
      (1.0 - smoothstep(0.22, 0.72, oxRingDist)) *
      (1.0 - oxArcMask) *
      smoothstep(0.15, 0.65, Math.abs(oxAng)) *
      0.38;

    rawH = rawH - (rawH - 0.26) * oxWaterCarve - scarCarve;
    h = Math.max(0.16, rawH * reliefScale);

    if (absPerp < chanHalfW + 0.12 && rawH < 0.58) {
      // 활동 곡류천 본류
      color.set(mixColor('#134c5c', '#1f6a7d', fbm(x * 5, y * 5)));
    } else if (oxWaterCarve > 0.48 && rawH < 0.58) {
      // 고립된 우각호: 유속이 정체되어 수초·플랑크톤이 풍부한 짙은 비취색 호수
      color.set(mixColor('#15453b', '#236153', fbm(x * 4, y * 4)));
    } else if (onConcavePointBar && bendIntensity > 0.25 && absPerp < chanHalfW + bankSpan * 0.72 && rawH < 0.98) {
      // 활주사면 포인트바(Point Bar): 밝은 모래·자갈 퇴적 백사장 및 호상 사주열
      const scrollWave = Math.sin(absPerp * 9.0) * 0.5 + 0.5;
      color.set(mixColor('#cfc49a', '#ebdfc0', scrollWave * 0.6 + fbm(x * 5, y * 5) * 0.4));
    } else if (onConvexOuterSide && bendIntensity > 0.25 && absPerp < chanHalfW + 0.42) {
      // 공격사면 하식애(Cut-bank): 침식으로 깎여 황갈색 충적 토층이 드러난 급절벽
      color.set(mixColor('#6e553b', '#8c6f4e', fbm(x * 6, y * 6)));
    } else if (scarCarve > 0.12 || (oxWaterCarve > 0.12 && rawH >= 0.58)) {
      // 구하도 습지 및 우각호 수변 갈대림
      color.set(mixColor('#2e5428', '#426e36', fbm(x * 4, y * 4)));
    } else {
      // 비옥한 충적 평야 농경지 및 초지 패치
      const fieldPattern = fbm(x * 0.85, y * 0.85, 3);
      color.set(mixColor('#3f692e', '#5a8741', fieldPattern));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 3. 감입곡류천 (융기 고원을 깊게 파고든 오메가 Ω 협곡: 영월 한반도지형·동강 어라연, 호스슈 벤드)
  // 외측 수직 기반암 단애(부용대/어라연 절벽) vs 내측 완경사 활주사면 반도 구릉 & 자갈 포인트바 완벽 대조!
  // =========================================================================
  if (normSub === '감입곡류천') {
    let minDist = 99.0;
    let signedSide = 1.0;

    for (let i = 0; i < INCISED_OMEGA_SPINE.length - 1; i++) {
      const [ax, ay] = INCISED_OMEGA_SPINE[i];
      const [bx, by] = INCISED_OMEGA_SPINE[i + 1];
      const seg = sdSegment(x, y, ax, ay, bx, by);
      if (seg.dist < minDist) {
        minDist = seg.dist;
        const cx = ax + (bx - ax) * seg.t;
        const cy = ay + (by - ay) * seg.t;
        const cross = (bx - ax) * (y - cy) - (by - ay) * (x - cx);
        signedSide = cross >= 0 ? 1.0 : -1.0; // +1 = 오메가 루프 안쪽(한반도지형 반도 내부!), -1 = 루프 바깥쪽(외벽 절벽!)
      }
    }

    // 루프 내부 반도 여부 (중심 (0, -0.8) 반도 구릉은 내측 활주사면으로 북에서 남으로 점진 하강!)
    const distPeninsulaCore = Math.hypot(x / 3.4, (y + 0.6) / 3.8);
    const isInsidePeninsula = signedSide > 0 && y < 5.2 && distPeninsulaCore < 1.35;

    // 융기된 배후 산지·고원 높이
    const plateauH =
      3.95 +
      warpedFbm(x * 0.32, y * 0.32, 4) * 0.75 +
      ridgedFbm(x * 0.5, y * 0.5, 3) * 0.38;

    // 반도 내부 활주사면 구릉: 잘록한 목(y ≈ 4.2, h ≈ 3.45)에서 남단 포인트바 끝(y ≈ -4.2, h ≈ 0.78)으로 비대칭 경사!
    const slipOffSlopeH =
      0.72 +
      smoothstep(-4.4, 3.8, y) * 2.75 +
      Math.max(0, 1.0 - Math.abs(x) / 2.8) * 0.45 +
      fbm(x * 0.9, y * 0.9) * 0.18;

    const chanHalfW = 0.76;
    const riverBedH = 0.22 + fbm(x * 2.5, y * 2.5) * 0.05;

    let rawH = 0;
    if (isInsidePeninsula) {
      // 내측 활주사면(Slip-off spur): 강물에서 완만하게 자갈·모래 포인트바를 거쳐 반도 소나무 구릉으로 상승
      const innerT = smoothstep(chanHalfW * 0.72, chanHalfW + 1.85, minDist);
      rawH = riverBedH + (slipOffSlopeH - riverBedH) * Math.pow(innerT, 1.15);
    } else {
      // 외측 공격사면(Incised Canyon Cut-bank): 수백 미터 높이의 깎아지른 기반암 수직 절벽!
      const outerT = smoothstep(chanHalfW * 0.78, chanHalfW + 0.75, minDist);
      const strataLedge = Math.sin(outerT * Math.PI * 3.0) * 0.08;
      rawH = riverBedH + (plateauH - riverBedH) * Math.pow(outerT, 0.68) + strataLedge * outerT;
    }

    h = Math.max(0.18, rawH * reliefScale);

    if (minDist < chanHalfW + 0.08 && rawH < 0.60) {
      // 옥빛 감입곡류 협곡 강물 바닥
      color.set(mixColor('#0f4552', '#1b6778', fbm(x * 5, y * 5)));
    } else if (isInsidePeninsula && minDist < chanHalfW + 1.35 && rawH < 0.98) {
      // 반도 끝단 초승달 모양 백사장·자갈 포인트바 (선암마을 한반도지형 끝단 모래톱!)
      color.set(mixColor('#cfc5a5', '#ebe3c7', fbm(x * 5, y * 5)));
    } else if (!isInsidePeninsula && minDist < chanHalfW + 0.95 && rawH > 0.60) {
      // 외벽 수직 암벽 단애: 고생대 석회암/중생대 사암 수평 층리 절벽
      const rockBand = Math.sin(rawH * 10.5 + x * 0.3) * 0.5 + 0.5;
      color.set(mixColor('#594e43', '#96826c', rockBand));
    } else {
      // 융기 산지 및 반도 구릉 울창한 소나무·혼효림 (사암 고원 노출부 혼합)
      const rockCrest = smoothstep(4.35, 4.95, rawH);
      color.copy(mixColor('#294d22', '#3f6931', fbm(x * 2.2, y * 2.2))).lerp(
        new THREE.Color('#8c755e'),
        rockCrest * 0.55
      );
    }
    return { height: h, color };
  }

  // =========================================================================
  // 4. 범람원 (하도 + 완만한 미고지 자연제방 + 저지대 배후습지 & 파제퇴적체: 낙동강·한강 하류)
  // 자연제방은 거대한 산벽이 아니라 배후습지보다 0.45~0.55m 살짝 높은 현실적 충적 미기복으로 조형
  // =========================================================================
  if (normSub === '범람원') {
    const riverX = Math.sin(y * 0.32) * 1.85 + Math.cos(y * 0.17) * 0.55;
    const d1x = 0.32 * 1.85 * Math.cos(y * 0.32) - 0.17 * 0.55 * Math.sin(y * 0.17);
    const signedPerp = (x - riverX) / Math.sqrt(1.0 + d1x * d1x);
    const perpDist = Math.abs(signedPerp);

    const chanHalfW = 0.95;

    // 1) 자연제방 (Natural Levee): 하천 양안 바로 옆에서 최고점을 찍고 배후습지 쪽으로 완만하게 낮아지는 비대칭 미고지
    const leveeOffset = Math.max(0, perpDist - chanHalfW);
    let leveeProfile = Math.exp(-Math.pow((leveeOffset - 0.55) / 1.15, 2.0)) * 0.52;

    // 홍수 시 동쪽 제방 일부(y ≈ 1.2)가 터져 배후습지로 부채꼴 퇴적된 파제퇴적체(Crevasse Splay)
    const crevasseBreach =
      signedPerp > 0 ? 1.0 - 0.48 * Math.exp(-Math.pow((y - 1.2) / 0.75, 2.0)) : 1.0;
    leveeProfile *= crevasseBreach;
    const splayDist = Math.hypot((signedPerp - 2.2) / 1.8, (y - 1.2) / 1.9);
    const crevasseSplay = signedPerp > 1.2 && splayDist < 1.0 ? (1.0 - splayDist) * 0.24 : 0;

    // 2) 배후습지 (Backswamp): 자연제방 바깥쪽(perpDist > 2.6)의 낮고 평탄한 점토질 저습지 및 얕은 늪지 와지
    const swampDepression =
      smoothstep(2.4, 3.8, perpDist) *
      (0.18 + smoothstep(0.45, 0.72, fbm(x * 0.55 + 1.4, y * 0.55, 3)) * 0.16);

    // 외곽 곡벽 구릉 끝자락 (|x| > 8.2)
    const valleyMargin = smoothstep(7.8, 10.0, Math.abs(x)) * (0.95 + fbm(x * 0.7, y * 0.7) * 0.35);

    const floodplainSurface = 0.72 + leveeProfile + crevasseSplay - swampDepression + valleyMargin + fbm(x * 1.1, y * 1.1) * 0.03;
    const channelT = smoothstep(chanHalfW * 0.68, chanHalfW + 0.35, perpDist);
    const riverBed = 0.22 + fbm(x * 2.5, y * 2.5) * 0.04;

    const rawH = riverBed + (floodplainSurface - riverBed) * channelT;
    h = Math.max(0.16, rawH * reliefScale);

    if (perpDist < chanHalfW + 0.12 && rawH < 0.64) {
      // 본류 하천 수로
      color.set(mixColor('#174d5c', '#246b7d', fbm(x * 5, y * 5)));
    } else if (leveeProfile + crevasseSplay > 0.20 && valleyMargin < 0.2) {
      // 자연제방 및 파제퇴적체: 배수가 양호한 사질양토 황갈색 밭·과수원·취락 터
      color.set(mixColor('#8c7751', '#ab9368', fbm(x * 3.5, y * 3.5)));
    } else if (valleyMargin > 0.25) {
      // 곡벽 산록림
      color.set(mixColor('#2f5225', '#426b33', fbm(x * 2.5, y * 2.5)));
    } else if (rawH < 0.59) {
      // 배후습지 저습지 늪 수면 및 창포·갈대 군락
      color.set(mixColor('#1c4232', '#2b5942', fbm(x * 5, y * 5)));
    } else {
      // 배후습지 점토질 논경지 바둑판 구획 색감
      const paddyGrid =
        Math.abs(Math.sin(x * 1.8)) < 0.07 || Math.abs(Math.sin(y * 1.8)) < 0.07 ? 0.15 : 0.0;
      color.set(mixColor('#355928', '#4c7538', clamp(fbm(x * 2.2, y * 2.2) + paddyGrid, 0, 1)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 5. 삼각주 (바다를 향해 부채꼴·새발 모양으로 돌출 성장하는 하구 퇴적 지형: 낙동강 을숙도, 나일·미시시피)
  // 후면(y > 4.2) 본류 하천 -> 분기점(0, 4.2) -> 4갈래 분류 하천 및 바다로 돌출한 델타 엽상체·하구 사주!
  // =========================================================================
  if (normSub === '삼각주') {
    const apexX = 0.0;
    const apexY = 4.4;

    // 1) 상류 본류 수로 (y > 4.2 -> (0, 4.4)로 진입)
    const trunkSeg = sdSegment(x - Math.sin((y - apexY) * 0.45) * 0.55, y, 0.0, 10.2, apexX, apexY);

    // 2) 분기점에서 전면 바다(-Y)를 향해 뻗어나가는 4개의 분류 하천(Distributaries) 및 돌출 퇴적 엽상체(Delta Lobes)
    const lobes = [
      { bx: -5.4, by: -3.2, lobeReach: 1.05, chanW: 0.42 },
      { bx: -1.85, by: -5.3, lobeReach: 1.35, chanW: 0.52 }, // 주 돌출 조족상 엽상체 1
      { bx: 2.05, by: -5.0, lobeReach: 1.28, chanW: 0.48 },  // 주 돌출 조족상 엽상체 2
      { bx: 5.5, by: -2.8, lobeReach: 0.98, chanW: 0.40 },
    ];

    // 기본 호상 삼각주 평야 + 각 분류 하도를 따라 바다 쪽으로 길게 돌출한 자연제방 엽상체(Bird-foot / Arcuate Lobes)!
    const dx = x - apexX;
    const dy = apexY - y;
    const rFromApex = Math.hypot(dx, Math.max(0.0, dy));
    const upperPlain = smoothstep(2.2, 6.2, y) * (0.48 + (y - 2.2) * 0.045);

    // 기본 반원형 델타 바디
    const arcuateBody = smoothstep(8.2, 4.5, rFromApex) * smoothstep(-5.8, 3.5, y) * 0.46;

    let lobeLand = 0;
    let channelCarve = 0;
    let mouthBarLift = 0;
    let minChanRatio = 99.0;

    // 본류 하도 굴착
    if (y > apexY - 0.3) {
      const trunkRatio = trunkSeg.dist / 0.68;
      minChanRatio = Math.min(minChanRatio, trunkRatio);
      channelCarve = Math.max(channelCarve, (1.0 - smoothstep(0.35, 0.72, trunkSeg.dist)) * 0.56);
    }

    for (const lb of lobes) {
      const wx = x + Math.sin(y * 0.55 + lb.bx) * 0.32;
      const seg = sdSegment(wx, y, apexX, apexY, lb.bx, lb.by);

      // 분류 하도 양안을 따라 바다 속으로 길게 뻗어 나가는 퇴적 둑(Prograding delta lobe)
      const lobeWidth = 1.65 + seg.t * 0.55;
      const thisLobe =
        Math.exp(-Math.pow(seg.dist / lobeWidth, 2.0)) *
        0.52 *
        (1.0 - smoothstep(0.78, 1.02, seg.t));
      lobeLand = Math.max(lobeLand, thisLobe);

      // 분류 수로 굴착
      const cw = lb.chanW * (1.05 - 0.25 * seg.t);
      const cRatio = seg.dist / cw;
      if (seg.t < 0.98) minChanRatio = Math.min(minChanRatio, cRatio);
      const thisCarve = (1.0 - smoothstep(cw * 0.55, cw * 1.15, seg.dist)) * 0.48 * (1.0 - smoothstep(0.92, 1.05, seg.t));
      channelCarve = Math.max(channelCarve, thisCarve);

      // 분류 하구 바로 앞바다에 초승달 모양으로 쌓이는 하구 사주(Distributary Mouth Bar / 을숙도형 사주섬!)
      const mbX = lb.bx + (lb.bx - apexX) * 0.14;
      const mbY = lb.by - 0.85;
      const dMouthBar = Math.hypot((x - mbX) / 1.15, (y - mbY) / 0.52);
      if (dMouthBar < 1.1) {
        mouthBarLift = Math.max(mouthBarLift, (1.0 - smoothstep(0.25, 1.05, dMouthBar)) * 0.42);
      }
    }

    const prodeltaSeaFloor = 0.20 + smoothstep(-9.5, 2.0, y) * 0.12 + fbm(x * 1.5, y * 1.5) * 0.05;
    const deltaTop = prodeltaSeaFloor + Math.max(upperPlain, Math.max(arcuateBody, lobeLand)) + mouthBarLift - channelCarve;
    const rawH = Math.max(0.16, deltaTop + fbm(x * 1.8, y * 1.8) * 0.035);
    h = rawH * reliefScale;

    if (rawH < 0.52) {
      // 분류 하도 및 전면 바다 (하구 부근은 황갈색 부유 토사 플룸이 섞인 기수역 색조!)
      const sedimentPlume = smoothstep(-7.8, -1.5, y) * Math.exp(-Math.pow(x / 6.8, 2.0));
      const seaCol = mixColor('#0c3347', '#16506b', fbm(x * 3, y * 3));
      const brackishCol = mixColor('#285957', '#427060', fbm(x * 4, y * 4));
      color.copy(seaCol).lerp(brackishCol, sedimentPlume * 0.72);
    } else if (mouthBarLift > 0.18 || rawH < 0.62) {
      // 신생 하구 모래톱 사주(Mouth bar) 및 조간대 갈대 저습지
      color.set(
        mouthBarLift > 0.22
          ? mixColor('#cfba86', '#e6d3a1', fbm(x * 5, y * 5))
          : mixColor('#4f7038', '#688a49', fbm(x * 5, y * 5))
      );
    } else {
      // 비옥한 삼각주 충적 평야 및 하중도 녹지
      color.set(mixColor('#365e29', '#4d7a3a', fbm(x * 2.5, y * 2.5)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 6. 하안단구 (지반 융기와 하방침식이 빚은 비대칭 다단 계단 지형 T0~T3: 영월·정선 동강, 라카이아 강)
  // 계단 깨짐 없는 매끄러운 smoothstep 단구애(둥근 강자갈층 노두)와 평탄한 구하상 단구면
  // =========================================================================
  if (normSub === '하안단구') {
    const riverX = -0.65 + Math.sin(y * 0.36) * 1.75;
    const d1x = 0.36 * 1.75 * Math.cos(y * 0.36);
    const signedPerp = (x - riverX) / Math.sqrt(1.0 + d1x * d1x);
    const absPerp = Math.abs(signedPerp);

    // 동쪽(signedPerp > 0)에 넓은 비대칭 단구면(T1, T2, T3)이 발달하고, 서쪽은 좁고 가파른 단구·산록 배치
    const isEast = signedPerp >= 0;
    const w0 = 0.85;
    const w1 = isEast ? 2.35 : 1.55;
    const w2 = isEast ? 4.85 : 2.95;
    const w3 = isEast ? 7.45 : 4.65;

    // 현생 하상(0.24) -> T0 범람원(0.66) -> T1 저위단구(1.52) -> T2 중위단구(2.48) -> T3 고위단구(3.42) -> 외곽 산지
    const s0 = smoothstep(w0 - 0.18, w0 + 0.22, absPerp);
    const s1 = smoothstep(w1 - 0.24, w1 + 0.26, absPerp);
    const s2 = smoothstep(w2 - 0.26, w2 + 0.28, absPerp);
    const s3 = smoothstep(w3 - 0.32, w3 + 0.45, absPerp);

    const hillRise = smoothstep(w3 + 0.4, w3 + 3.2, absPerp) * (1.15 + ridgedFbm(x * 0.5, y * 0.5, 3) * 0.45);
    // 상류(+y)에서 하류(-y)로 약 1도 기울어진 옛 하상 종단 경사 반영
    const valleyTilt = (y / 10.0) * 0.16;

    const rawH =
      0.24 +
      s0 * 0.44 +
      s1 * 0.86 +
      s2 * 0.96 +
      s3 * 0.94 +
      hillRise +
      valleyTilt * s0 +
      fbm(x * 0.9, y * 0.9) * 0.06;
    h = Math.max(0.18, rawH * reliefScale);

    // 급경사 단구애(Terrace Scarp Riser) 구간 판별 -> 둥근 구하상 역암/자갈층 노출!
    const onScarp1 = s1 > 0.08 && s1 < 0.92;
    const onScarp2 = s2 > 0.08 && s2 < 0.92;
    const onScarp3 = s3 > 0.08 && s3 < 0.92;

    if (absPerp < w0 && rawH < 0.58) {
      color.set(mixColor('#134b59', '#206b7d', fbm(x * 5, y * 5)));
    } else if (absPerp < w1 - 0.2 && s0 > 0.6) {
      // 현생 강변 자갈톱(Active gravel bar)
      color.set(mixColor('#aba190', '#c7beac', fbm(x * 6, y * 6)));
    } else if (onScarp1 || onScarp2 || onScarp3) {
      // 단구애 절벽: 옛 강물이 운반한 둥근 자갈층(원력층)과 적갈색 사질 퇴적 단면
      const gravelTex = fbm(x * 9.0, y * 9.0);
      color.set(mixColor('#6e5843', '#998167', gravelTex));
    } else if (s3 > 0.85 && hillRise > 0.35) {
      // 외곽 기반암 산림
      color.set(mixColor('#2b4d22', '#3d6630', fbm(x * 2.5, y * 2.5)));
    } else {
      // 평탄한 T1·T2·T3 단구면: 홍수 피해가 없는 구릉 위 밭농사지 및 산간 취락 터
      const cropPatch = fbm(Math.floor(x * 0.8) + 3.1, Math.floor(y * 0.8), 2);
      color.set(
        cropPatch > 0.55
          ? mixColor('#5d7839', '#77944b', fbm(x * 3, y * 3))
          : mixColor('#3e632d', '#537d3e', fbm(x * 3, y * 3))
      );
    }
    return { height: h, color };
  }

  // =========================================================================
  // 7. 폭포 (상류 경암층 고원 -> 말발굽형 폭포 단애 -> 폭호(Plunge Pool) -> 두부침식 후퇴 협곡: 나이아가라, 정방폭포)
  // 후면(y > 1.35) 상류에서 전면(y < 1.35) 카메라 정면을 향해 시원하게 쏟아져 내리는 정방향 배치!
  // =========================================================================
  if (normSub === '폭포') {
    const lipY = getWaterfallLipY(x);
    const streamX = Math.sin((y - 1.5) * 0.32) * 0.72;
    const distStream = Math.abs(x - streamX);

    // 폭포 낙하지점 직하부 깊은 원형 폭호 (Plunge Pool: (0, -0.15))
    const poolDist = Math.hypot(x / 2.05, (y + 0.15) / 1.75);

    let rawH = 0;
    if (y >= lipY) {
      // 1) 상류 저항성 경암층(Caprock: 돌로마이트/현무암) 대지 및 폭포로 유입되는 상류 하천
      const chanHalfW = 1.35;
      const inUpperRiver = 1.0 - smoothstep(chanHalfW * 0.45, chanHalfW, distStream);
      const plateauTop = 4.28 + smoothstep(1.5, 8.0, Math.abs(x)) * 0.42 + fbm(x * 0.7, y * 0.7) * 0.16;
      const upperBed = 3.56 + (y - lipY) * 0.025 + fbm(x * 2.5, y * 2.5) * 0.04;
      rawH = plateauTop - (plateauTop - upperBed) * inUpperRiver;

      if (inUpperRiver > 0.45) {
        color.set(mixColor('#145061', '#226f82', fbm(x * 5, y * 5)));
      } else if (distStream < chanHalfW + 0.45) {
        // 물에 씻긴 단단한 상부 경암층 암반 테두리
        color.set(mixColor('#57524b', '#756e64', fbm(x * 5, y * 5)));
      } else {
        // 상류 울창한 수림 고원
        color.set(mixColor('#2c5223', '#426e34', fbm(x * 2.2, y * 2.2)));
      }
    } else {
      // 2) 폭포 절벽 전면 급락부 + 깊은 폭호(Plunge Pool) + 두부침식 후퇴 협곡(Recession Gorge)
      const cliffWallT = smoothstep(lipY - 0.55, lipY, y);
      const gorgeHalfW = 1.65 + clamp((-0.8 - y) / 9.0, 0.0, 1.0) * 0.55;
      const gorgeWallT = smoothstep(gorgeHalfW * 0.72, gorgeHalfW + 0.85, distStream);

      const wallT = Math.max(cliffWallT, gorgeWallT);
      const plateauRimH = 4.22 + smoothstep(2.0, 8.0, Math.abs(x)) * 0.38 + fbm(x * 0.7, y * 0.7) * 0.16;

      // 하류 하상 및 깊게 파인 폭호 와지 바닥
      const poolScour = poolDist < 1.0 ? (1.0 - poolDist * poolDist) * 0.18 : 0;
      const lowerBed = 0.30 - poolScour + fbm(x * 2.5, y * 2.5) * 0.04;

      rawH = lowerBed + (plateauRimH - lowerBed) * Math.pow(wallT, 0.72);

      if (wallT < 0.15 && rawH < 0.62) {
        // 폭호 및 하류 협곡 급류 바닥
        color.set(mixColor('#0e4252', '#1c697d', fbm(x * 5, y * 5)));
      } else if (wallT < 0.92) {
        // 후퇴 협곡 양안 절벽: 상부 두꺼운 경암층(밝은 회갈색) vs 하부 무른 셰일 연암층(어두운 회흑색) 차별층리!
        const isUpperCaprock = rawH > 3.15;
        const shaleStrata = Math.sin(rawH * 14.0) * 0.5 + 0.5;
        color.set(
          isUpperCaprock
            ? mixColor('#696055', '#8f8373', fbm(x * 4, y * 4))
            : mixColor('#2e2b29', '#4a443f', shaleStrata)
        );
      } else {
        // 협곡 상단 수림대
        color.set(mixColor('#2c5223', '#426e34', fbm(x * 2.2, y * 2.2)));
      }
    }

    h = Math.max(0.14, rawH * reliefScale);
    return { height: h, color };
  }

  return null;
}
