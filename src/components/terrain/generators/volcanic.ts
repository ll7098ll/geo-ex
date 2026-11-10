import * as THREE from 'three';
import {
  fbm,
  warpedFbm,
  ridgedFbm,
  smoothstep,
  smax,
  clamp,
  mixColor,
  TerrainEvalResult,
} from '../terrainMath';

export function getCalderaShoreRadius(angle: number): number {
  return 3.62 + Math.sin(angle * 3.0 + 0.8) * 0.22 + Math.cos(angle * 4.0) * 0.14;
}

export function evalVolcanicTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const d = Math.hypot(x, y);
  const angle = Math.atan2(y, x);
  const color = new THREE.Color();
  let h = 0;

  // =========================================================================
  // 1. 순상화산 (Shield Volcano: 하와이 킬라우에아·마우나로아, 제주 한라산 기저)
  // 점성이 낮은 현무암질 용암이 얇고 넓게 퍼져 만든 4~8° 완경사 방패형 화산체 + 정상 함몰 화구
  // =========================================================================
  if (normSub === '순상화산') {
    // 광활한 방패(Shield) 볼록 돔 프로파일 (전역 20x20 전체에 완만하게 퍼짐)
    const normR = clamp(d / 12.6, 0, 1);
    let baseH = 0.55 + 2.95 * Math.pow(1.0 - Math.pow(normR, 1.65), 0.85);

    // 정상부 2단 함몰 칼데라 벤치(Kilauea Caldera) 및 할레마우마우(Halemaʻumaʻu) 화구 피트
    const outerCalderaR = 2.65 + Math.sin(angle * 3.0 + 0.4) * 0.18;
    const outerDrop = (1.0 - smoothstep(outerCalderaR - 0.42, outerCalderaR, d)) * 0.62;

    const dPit = Math.hypot(x + 0.22, y + 0.18);
    const innerPitR = 1.18 + Math.cos(angle * 4.0) * 0.08;
    const innerDrop = (1.0 - smoothstep(innerPitR - 0.32, innerPitR, dPit)) * 0.96;

    // 남동 열곡대(East/SW Rift Zone) 파호이호이 용암 수로 및 자연 용암 제방(Lava Levee)
    const flowAxisAngle = -1.05 + Math.sin(d * 0.42) * 0.18;
    const angDiff = Math.atan2(Math.sin(angle - flowAxisAngle), Math.cos(angle - flowAxisAngle));
    const channelDist = Math.abs(angDiff) * d;
    const inFlowZone = smoothstep(1.1, 2.2, d) * (1.0 - smoothstep(8.2, 9.8, d));
    const lavaLevee = Math.exp(-Math.pow((channelDist - 0.52) / 0.28, 2.0)) * 0.14 * inFlowZone;
    const lavaChannel = -Math.exp(-Math.pow(channelDist / 0.34, 2.0)) * 0.12 * inFlowZone;

    // 파호이호이 새끼줄 용암의 완만한 로브(Lobe) 주름 기복
    const ropyUndulation = warpedFbm(x * 0.45, y * 0.45, 4) * 0.16 + Math.sin(d * 5.2 + fbm(x, y) * 3.0) * 0.03;

    h = Math.max(0.28, (baseH - outerDrop - innerDrop + lavaLevee + lavaChannel + ropyUndulation) * reliefScale);

    const isActiveChannel = channelDist < 0.36 && d > 1.0 && d < 8.8;
    const isFreshBasaltLobe = Math.abs(angDiff) < 0.42 && d > 1.2;

    if (dPit < innerPitR - 0.18) {
      // 할레마우마우 화구 바닥: 용암호 주변 적열 현무암 암각
      color.set(mixColor('#2b0f08', '#4a180b', fbm(x * 6, y * 6)));
    } else if (d < outerCalderaR) {
      // 정상 칼데라 단구: 굳은 은회색~흑갈색 파호이호이 용암판과 황화물 분기 흔적
      const sulfur = fbm(x * 4.5, y * 4.5) > 0.68;
      color.set(sulfur ? '#7d7234' : mixColor('#232225', '#343136', fbm(x * 5, y * 5)));
    } else if (isActiveChannel) {
      // 열곡대 용암 유로: 붉은 잔열이 도는 암흑색 현무암
      const glow = smoothstep(8.5, 1.5, d) * 0.45;
      color.set(mixColor('#1a1617', '#6e220c', glow));
    } else if (isFreshBasaltLobe || d < 4.6) {
      // 신생 현무암 용암 평원
      color.set(mixColor('#242326', '#363338', warpedFbm(x * 1.4, y * 1.4, 3)));
    } else {
      // 하부 완사면 키푸카(Kipuka) 식생림과 풍화 현무암 토양 교차대
      const kipuka = smoothstep(0.42, 0.62, fbm(x * 0.55 + 3.1, y * 0.55 - 1.7, 4));
      const rockCol = mixColor('#2e2b2d', '#3e3a38', fbm(x * 2.5, y * 2.5));
      const vegCol = mixColor('#2e4c24', '#416631', fbm(x * 2.0, y * 2.0));
      color.copy(rockCol).lerp(vegCol, kipuka * smoothstep(4.2, 7.5, d));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 2. 종상화산 (Lava Dome: 제주 산방산, 세인트헬렌스 용암돔)
  // 점성이 매우 높은 조면암/데사이트질 용암이 화구 위로 볼록하게 압출 융기한 급경사 돔
  // =========================================================================
  if (normSub === '종상화산') {
    const domeX = 0.0;
    const domeY = 0.6;
    const rDome = Math.hypot(x - domeX, y - domeY);
    const domeAngle = Math.atan2(y - domeY, x - domeX);

    // 종(Bell)을 엎어놓은 듯 상부는 둥글고 측면은 65~75° 절벽으로 떨어지는 압출 돔 수식
    const domeRadius = 4.15 + Math.sin(domeAngle * 3.0 + 0.5) * 0.25 + fbm(x * 0.5, y * 0.5) * 0.2;
    let domeH = 0;
    if (rDome < domeRadius) {
      const t = rDome / domeRadius;
      // Super-ellipsoid bell profile: steep walls + rounded crown
      domeH = 4.95 * Math.pow(Math.max(0, 1.0 - Math.pow(t, 2.85)), 0.46);
      // 수직 주상절리 리브(Vertical cooling joint ribs) & 압출 유동 로브
      const verticalRibs = Math.sin(domeAngle * 30.0 + fbm(x * 2, y * 2) * 1.5) * 0.14 * smoothstep(0.35, 0.88, t);
      const crownLobes = ridgedFbm(x * 0.9, y * 0.9, 3) * 0.26 * (1.0 - t * t);
      domeH += verticalRibs + crownLobes;
    }

    // 기저부 동결·풍화 낙석이 쌓인 오목한 애추(Talus apron) 사면
    const talusH = 1.85 * Math.exp(-Math.max(0, rDome - domeRadius + 0.5) * 0.95);

    // 남쪽 전면 해안의 수성응회환 파식 단구(용머리해안 지층 대비) 및 주변 해안 평지
    const coastLineY = -6.2 + Math.sin(x * 0.35) * 0.65;
    const tuffRing = y < -2.2 && y > coastLineY - 0.6
      ? 0.95 * Math.exp(-Math.pow((x - 1.2) / 4.2, 2.0)) * smoothstep(coastLineY - 0.4, coastLineY + 1.4, y)
      : 0;
    const landPlain = smoothstep(coastLineY - 0.5, coastLineY + 1.2, y) * (0.72 + fbm(x * 0.4, y * 0.4) * 0.16);
    const seaFloor = 0.22 + fbm(x * 1.4, y * 1.4) * 0.08;

    const rawH = Math.max(seaFloor, smax(landPlain + tuffRing, Math.max(domeH, talusH), 0.32));
    h = rawH * reliefScale;

    if (y < coastLineY) {
      color.set(mixColor('#0d2636', '#163b4f', fbm(x * 3, y * 3)));
    } else if (rDome < domeRadius * 0.96 && rawH > 1.75) {
      const slopeZone = rDome / domeRadius;
      if (slopeZone > 0.62 && rawH < 4.1) {
        // 밝은 회백색~황회색 조면암 수직 절리 암벽 및 풍화혈(타포니) 그늘
        const jointShade = Math.sin(domeAngle * 30.0) * 0.5 + 0.5;
        color.set(mixColor('#5c5852', '#8f887d', jointShade * 0.7 + fbm(x * 5, y * 5) * 0.3));
      } else {
        // 돔 상부 상록활엽수림(구실잣밤나무·동백)과 조면암 암봉 노두 교차
        const rockOutcrop = smoothstep(0.55, 0.78, ridgedFbm(x * 1.6, y * 1.6, 3));
        const canopy = mixColor('#234520', '#355e2d', fbm(x * 3, y * 3));
        color.copy(canopy).lerp(new THREE.Color('#8a8378'), rockOutcrop * 0.65);
      }
    } else if (tuffRing > 0.35 && y < -3.8) {
      // 용머리해안 사층리 응회암 노두 (황갈색 화산재 층리)
      const tuffBed = Math.sin(rawH * 14.0 + x * 1.2) * 0.5 + 0.5;
      color.set(mixColor('#6e5338', '#9c7850', tuffBed));
    } else {
      // 기저부 애추 수림 및 제주 해안 초지/유채밭 녹지
      color.set(mixColor('#355928', '#4d7336', fbm(x * 2.2, y * 2.2)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 3. 용암대지 (Flood Basalt Plateau & Gorge: 철원 한탄강 용암대지, 데칸 고원)
  // 열하분출 현무암이 구하도를 메워 만든 평탄한 대지와 이를 수직으로 가르는 주상절리 협곡
  // =========================================================================
  if (normSub === '용암대지') {
    // 대지 중앙을 S자로 깊게 파고드는 한탄강 수직 현무암 협곡
    const canyonX = Math.sin(y * 0.34) * 2.35 + Math.cos(y * 0.18) * 0.75;
    const distCanyon = Math.abs(x - canyonX);

    // 지류 소협곡 (재인폭포/대교천 합류 지류)
    const tribY = 1.8 + (x - canyonX) * 0.45;
    const inTrib = x > canyonX && Math.abs(y - tribY) < 0.75 && x < canyonX + 5.5;
    const distTrib = x > canyonX ? Math.abs(y - tribY) : 99.0;

    // 광활하고 평탄한 현무암 용암대지 상부면 (철원평야)
    let plateauH = 3.45 + fbm(x * 0.35, y * 0.35, 3) * 0.14;

    // 대지 외곽 북서/북동 모서리에 용암에 묻히지 않고 솟아있는 기반암(화강암) 구릉 산지
    const oldHill1 = Math.max(0, 1.85 * Math.exp(-(Math.pow((x + 7.5) / 3.2, 2) + Math.pow((y - 6.8) / 3.2, 2))));
    const oldHill2 = Math.max(0, 1.55 * Math.exp(-(Math.pow((x - 7.8) / 2.8, 2) + Math.pow((y - 7.2) / 3.0, 2))));
    plateauH += oldHill1 + oldHill2;

    // 협곡 단면 (수직에 가까운 현무암 주상절리 단애 + 하상 자갈톱 + 고석정 화강암 고립암)
    const canyonWallT = smoothstep(0.95, 1.55, distCanyon);
    const tribWallT = x > canyonX && x < canyonX + 5.2 ? smoothstep(0.32, 0.78, distTrib) : 1.0;
    const combinedWallT = Math.min(canyonWallT, tribWallT);

    // 고석정(Goseokjeong) 스타일 협곡 내 화강암 잔류 고립 바위봉
    const goseokDist = Math.hypot(x - (canyonX + 0.38), y + 0.4);
    const goseokRock = goseokDist < 0.58 ? Math.pow(1.0 - goseokDist / 0.58, 0.55) * 1.65 : 0;

    const riverBedH = 0.26 + fbm(x * 2.2, y * 2.2) * 0.06;
    const rawH = riverBedH + (plateauH - riverBedH) * Math.pow(combinedWallT, 0.65) + goseokRock * (1.0 - canyonWallT * 0.7);
    h = rawH * reliefScale;

    if (goseokDist < 0.52 && goseokRock > 0.35) {
      // 고석정 중생대 백악기 밝은 화강암 바위
      color.set(mixColor('#8f8578', '#b5aa9a', fbm(x * 6, y * 6)));
    } else if (combinedWallT < 0.12) {
      // 옥빛 협곡 하상 암반 및 현무암 둥근 전석
      color.set(mixColor('#113c47', '#1c5663', fbm(x * 5, y * 5)));
    } else if (combinedWallT < 0.92) {
      // 협곡 수직 단애: 다층 용암류 경계(클링커층)와 수직 주상절리 암흑색 현무암 벽
      const flowUnit = Math.sin(rawH * 5.2) * 0.5 + 0.5;
      const colStriation = Math.sin((x + y) * 18.0) * 0.5 + 0.5;
      color.set(mixColor('#1c1c20', '#383330', flowUnit * 0.65 + colStriation * 0.35));
    } else if (oldHill1 + oldHill2 > 0.35) {
      // 배후 기반암 산림
      color.set(mixColor('#2d4d25', '#3e6332', fbm(x * 2.5, y * 2.5)));
    } else {
      // 평탄한 철원 현무암 용암대지 평야 (비옥한 점토질 평원 및 경작 초지)
      const patch = fbm(x * 0.9, y * 0.9, 3);
      color.set(mixColor('#46662e', '#65803c', patch));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 4. 수성화산 (Surtseyan Tuff Cone: 제주 성산일출봉 응회구)
  // 천해 수증기-마그마 폭발로 쌓인 성곽형 화구륜 + 넓은 사발형 화구 바닥 + 해식 층리 단애 + 육계사주
  // =========================================================================
  if (normSub === '수성화산') {
    const cx = 0.8;
    const cy = 0.5;
    const rc = Math.hypot(x - cx, y - cy);
    const ang = Math.atan2(y - cy, x - cx);

    // 왕관 모양 성곽 화구륜 반경 (약 3.35) 및 99봉 암릉 요철
    const rimR = 3.35 + Math.sin(ang * 5.0) * 0.12;
    const crownPeaks = Math.pow(Math.abs(Math.sin(ang * 14.0 + fbm(x * 1.8, y * 1.8) * 1.4)), 1.6) * 0.36;
    const rimElev = 3.45 + crownPeaks + Math.cos(ang - 0.6) * 0.22;

    // 동·남측(x > cx + 0.5 또는 y < cy - 0.8)은 거센 파랑에 깎여 수직 해식애로 절단됨!
    const waveCutExposure = smoothstep(-0.3, 0.7, Math.cos(ang + 0.55)); // 동남쪽 방향 가중치
    const outerLimitR = rimR + (1.0 - waveCutExposure * 0.68) * 2.9;

    let coneH = 0.22;
    if (rc <= rimR) {
      // 넓고 오목한 사발 모양(Saucer-like) 초원 분화구 내부
      const tIn = rc / rimR;
      const bowlFloor = 1.92 + fbm(x * 1.4, y * 1.4) * 0.1;
      coneH = bowlFloor + (rimElev - bowlFloor) * Math.pow(tIn, 2.8);
    } else if (rc <= outerLimitR) {
      const tOut = (rc - rimR) / Math.max(0.35, outerLimitR - rimR);
      // 해식 방향은 수직 단애로 급락, 내륙 방향은 32° 화쇄난류 사면
      const cliffPower = 1.0 - waveCutExposure * 0.55;
      coneH = 0.32 + (rimElev - 0.32) * Math.pow(1.0 - tOut, cliffPower * 1.7 + 0.45);
    }

    // 북서쪽으로 뻗어 제주 본섬과 연결되는 신양 섭지코지 육계사주(Tombolo)
    const spitAxisY = 0.6 - (x + 2.2) * 0.38;
    const distSpit = Math.abs(y - spitAxisY);
    const tomboloH = x < cx - 1.5
      ? Math.exp(-Math.pow(distSpit / 1.35, 2.0)) * (0.78 + smoothstep(-5.5, -9.5, x) * 1.35)
      : 0;

    const seaFloor = 0.22 + fbm(x * 1.5, y * 1.5) * 0.07;
    const rawH = Math.max(seaFloor, Math.max(coneH, tomboloH));
    h = rawH * reliefScale;

    if (rc < rimR - 0.22) {
      // 성산일출봉 분화구 내부 억새·초원 사발 평원
      color.set(mixColor('#497032', '#698f43', fbm(x * 2.5, y * 2.5)));
    } else if (rc <= outerLimitR && rawH > 0.62) {
      if (waveCutExposure > 0.38 && rc > rimR - 0.12) {
        // 해식 절벽에 적나라하게 드러난 황갈색·회갈색 수성 화산응회암(Tuff) 엽층리
        const ashBedding = Math.sin(rawH * 15.0 + ang * 2.0) * 0.5 + 0.5;
        color.set(mixColor('#594836', '#967c5c', ashBedding));
      } else if (rc < rimR + 0.25 && rawH > 3.2) {
        // 99봉 화구륜 성곽 바위 암봉
        color.set(mixColor('#575148', '#7d7467', fbm(x * 5, y * 5)));
      } else {
        // 외측 응회구 풀밭 사면
        color.set(mixColor('#385e29', '#4f7a39', fbm(x * 2.5, y * 2.5)));
      }
    } else if (tomboloH > 0.52) {
      // 육계사주 모래해변 및 본섬 해안 녹지
      color.set(x < -7.2 ? mixColor('#355928', '#486e35', fbm(x * 2, y * 2)) : mixColor('#d9c18c', '#edead0', fbm(x * 4, y * 4)));
    } else {
      // 제주 성산 앞바다 에메랄드 해저 암반
      color.set(mixColor('#0b2838', '#154459', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 5. 기생화산 (Scoria / Cinder Cone: 제주 다랑쉬오름·금오름·용눈이오름, 파리쿠틴)
  // 주 분석구(온전한 원형 굼부리 + 산정 화구습지) + 측면 말굽형 분석구(용암 유출 개구부)
  // =========================================================================
  if (normSub === '기생화산') {
    // 1) 주 오름 (다랑쉬/금오름 스타일 원형 30° 안식각 분석구, 중심 (-0.9, 0.7))
    const ox = -0.9;
    const oy = 0.7;
    const dMain = Math.hypot(x - ox, y - oy);
    const angMain = Math.atan2(y - oy, x - ox);
    const mainConeR = 6.2;
    const mainRimR = 1.75;
    const mainRimH = 4.25 + Math.sin(angMain * 2.0 + 0.5) * 0.18;
    const mainFloorH = 2.12;

    let mainH = 0;
    if (dMain < mainRimR) {
      const t = dMain / mainRimR;
      mainH = mainFloorH + (mainRimH - mainFloorH) * Math.pow(t, 2.1);
    } else if (dMain < mainConeR) {
      const t = (dMain - mainRimR) / (mainConeR - mainRimR);
      // 스코리아 안식각(30~32도) 직선~약오목 사면 + 방사상 침식 골(Rills)
      const rills = Math.sin(angMain * 12.0 + fbm(x * 0.8, y * 0.8) * 1.8) * 0.08 * smoothstep(0.08, 0.55, t) * (1.0 - t);
      mainH = 0.55 + (mainRimH - 0.55) * Math.pow(1.0 - t, 1.18) + rills;
    }

    // 2) 보조 말굽형 알오름 (용눈이/거문오름 스타일 breached horseshoe cone, 중심 (4.3, -2.8))
    const bx = 4.3;
    const by = -2.8;
    const dSub = Math.hypot(x - bx, y - by);
    const angSub = Math.atan2(y - by, x - bx);
    const subRimR = 1.05;
    const subConeR = 3.5;
    // 남서쪽(-2.1 rad)으로 화구벽이 터진 말굽형 개구부(Breach)
    const breachDiff = Math.abs(Math.atan2(Math.sin(angSub + 2.15), Math.cos(angSub + 2.15)));
    const breachMask = 1.0 - (1.0 - smoothstep(0.35, 0.85, breachDiff)) * smoothstep(0.25, 1.1, dSub) * 0.72;

    let subH = 0;
    if (dSub < subRimR) {
      const t = dSub / subRimR;
      subH = (0.85 + 1.55 * Math.pow(t, 1.8)) * breachMask + 0.55 * (1.0 - breachMask);
    } else if (dSub < subConeR) {
      const t = (dSub - subRimR) / (subConeR - subRimR);
      subH = 0.55 + 1.85 * Math.pow(1.0 - t, 1.2) * breachMask;
    }

    // 말굽형 개구부에서 흘러나간 용암류 혀(Breach lava flow lobe)
    const flowDist = Math.abs((x - bx) * Math.sin(-2.15) - (y - by) * Math.cos(-2.15));
    const flowAlong = (x - bx) * Math.cos(-2.15) + (y - by) * Math.sin(-2.15);
    const breachFlow = flowAlong > 0.6 && flowAlong < 4.8
      ? Math.exp(-Math.pow(flowDist / 0.95, 2.0)) * 0.28 * (1.0 - flowAlong / 5.2)
      : 0;

    // 제주 중산간 용암 산록 기저 평원
    const jejuPlain = 0.55 + warpedFbm(x * 0.25, y * 0.25, 3) * 0.24 - y * 0.015;
    const rawH = smax(jejuPlain + breachFlow, Math.max(mainH, subH), 0.28);
    h = rawH * reliefScale;

    if (dMain < 1.15) {
      // 주 오름 산정 화구습지 및 금오름 화구호 바닥
      color.set(mixColor('#1a3d30', '#2b5945', fbm(x * 6, y * 6)));
    } else if (dMain < mainRimR) {
      // 굼부리 내벽 적갈색 화산송이(스코리아) 노출면과 풀밭
      color.set(mixColor('#5e2d1e', '#473624', fbm(x * 6, y * 6)));
    } else if (dSub < 1.35 && breachDiff < 0.85 || breachFlow > 0.12) {
      // 말굽형 오름 터진 화구 및 암흑색 현무암 유출 용암류
      color.set(mixColor('#28211f', '#4a281d', fbm(x * 5, y * 5)));
    } else if (rawH > 3.2) {
      // 오름 능선 은빛 억새 군락지
      color.set(mixColor('#848c48', '#a8ab63', fbm(x * 3.5, y * 3.5)));
    } else {
      // 제주 중산간 목장 초지 및 곶자왈 숲 패치
      const forestPatch = smoothstep(0.48, 0.65, fbm(x * 0.8, y * 0.8, 4));
      color.copy(mixColor('#3d692c', '#52823b', fbm(x * 2, y * 2))).lerp(new THREE.Color('#21421b'), forestPatch * 0.7);
    }
    return { height: h, color };
  }

  // =========================================================================
  // 6. 화산 (Stratovolcano / 성층화산: 후지산, 베수비오, 세인트헬렌스)
  // 용암과 화산쇄설물이 교호 퇴적된 30~33° 오목 지수곡면 원추 + 바랑코 협곡 + 측화산 + 용암류
  // =========================================================================
  if (normSub === '화산') {
    const rimRadius = 1.42 + Math.sin(angle * 4.0) * 0.08;
    const peakHeight = 4.95;
    const floorHeight = 3.22;

    let baseH = 0;
    const inCrater = d < rimRadius;

    if (inCrater) {
      const t = d / rimRadius;
      baseH = floorHeight + (peakHeight - floorHeight) * Math.pow(t, 1.85);
    } else {
      const distFromRim = d - rimRadius;
      baseH = 0.35 + (peakHeight - 0.35) * Math.exp(-distFromRim * 0.31);
    }

    // 화구륜 암봉 요철
    const rimJagged =
      Math.sin(angle * 7.0 + fbm(x * 1.6, y * 1.6) * 2.2) *
      0.22 *
      smoothstep(0.75, 1.38, d) *
      (1.0 - smoothstep(1.42, 2.4, d));

    // 방사상 개석곡 (Barrancos): 산체를 깎아내린 깊은 V자 방사상 침식골
    const barrancos =
      -Math.pow(Math.abs(Math.sin(angle * 6.0 + fbm(x * 0.38, y * 0.38) * 2.0)), 2.4) *
      0.58 *
      smoothstep(1.75, 6.8, d) *
      (1.0 - smoothstep(8.0, 10.5, d));

    // 측화산 (Parasitic Cinder Cone): 동남쪽 산록(4.1, -2.2)
    const dSide = Math.hypot(x - 4.1, y + 2.2);
    const sideCone = dSide < 2.0 ? 1.38 * Math.pow(1.0 - dSide / 2.0, 1.25) : 0;
    const sideCrater = dSide < 0.46 ? (1.0 - Math.pow(dSide / 0.46, 2.0)) * 0.48 : 0;
    const pc = Math.max(0, sideCone - sideCrater);

    // 전면 남서쪽 사면으로 굽이쳐 흘러내린 아아(A'a) 용암류 엽상체와 용암 제방
    const flowAngle = -2.15 + Math.sin(d * 0.55) * 0.16;
    const flowDiff = Math.abs(Math.atan2(Math.sin(angle - flowAngle), Math.cos(angle - flowAngle)));
    const flowWidth = 0.28 + 0.025 * d;
    const flowMask = (1.0 - smoothstep(flowWidth * 0.65, flowWidth, flowDiff)) * smoothstep(1.45, 2.1, d) * (1.0 - smoothstep(7.6, 8.8, d));
    const lavaLobe = flowMask * (0.32 + ridgedFbm(x * 2.2, y * 2.2, 3) * 0.14);

    const rawH = Math.max(0.25, baseH + rimJagged + barrancos + pc + lavaLobe + fbm(x * 1.2, y * 1.2) * 0.14);
    h = rawH * reliefScale;

    if (d < 0.88) {
      color.set(mixColor('#1f120d', '#3b190d', fbm(x * 6, y * 6)));
    } else if (inCrater) {
      const isSulfur = fbm(x * 4.5, y * 4.5) > 0.64;
      color.set(isSulfur ? '#94802f' : mixColor('#522519', '#38160e', fbm(x * 5, y * 5)));
    } else if (flowMask > 0.3) {
      color.set(mixColor('#1b1817', '#2b2420', fbm(x * 7, y * 7)));
    } else if (dSide < 1.55 && pc > 0.25) {
      color.set(mixColor('#592d20', '#3d1e15', fbm(x * 5, y * 5)));
    } else if (rawH > 4.25) {
      // 고산 만년설 패치와 화산암설(Scree) 교차대
      const snowPatch = smoothstep(4.35, 4.75, rawH + fbm(x * 3, y * 3) * 0.25);
      color.copy(mixColor('#3a322c', '#26201c', fbm(x * 4, y * 4))).lerp(new THREE.Color('#e8eef2'), snowPatch * 0.75);
    } else if (rawH > 2.2) {
      color.set(mixColor('#49572e', '#3a4224', fbm(x * 3, y * 3)));
    } else {
      color.set(mixColor('#28471e', '#3a612c', fbm(x * 2, y * 2)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 7. 칼데라 (백두산 천지, 크레이터 레이크, 울릉도 나리분지)
  // 외륜산(Somma) + 급경사 함몰 단애벽(Scarp) + 칼데라호 + 중앙화구구(재생 돔)
  // =========================================================================
  if (normSub === '칼데라') {
    const r = Math.hypot(x, y);
    const rimAngle = Math.atan2(y, x);

    const rimCurve =
      5.2 +
      Math.sin(rimAngle * 3.0 + 0.8) * 0.35 +
      Math.cos(rimAngle * 5.0) * 0.2 +
      fbm(x * 0.3, y * 0.3) * 0.14;
    const shoreRadius = getCalderaShoreRadius(rimAngle);
    const waterLevel = 1.62;
    const lakeFloor = 0.52;

    const rimPeakH =
      4.32 +
      Math.sin(rimAngle * 4.0 + 0.3) * 0.38 +
      Math.cos(rimAngle * 7.0) * 0.22 +
      fbm(x * 0.6, y * 0.6) * 0.18;

    // 호수 내부 2차 분출 중앙화구구 (위저드 아일랜드 / 알봉형)
    const coneCenterX = 0.55;
    const coneCenterY = 0.35;
    const dCone = Math.hypot(x - coneCenterX, y - coneCenterY);
    const coneBaseRadius = 1.72;
    const coneCraterRadius = 0.38;

    let baseH = 0;

    if (r <= shoreRadius) {
      const tFloor = r / shoreRadius;
      baseH = lakeFloor + (waterLevel - 0.08 - lakeFloor) * Math.pow(tFloor, 2.0);

      if (dCone < coneBaseRadius) {
        const coneT = 1.0 - dCone / coneBaseRadius;
        let coneH = 2.88 * Math.pow(coneT, 0.88);
        if (dCone < coneCraterRadius) {
          const craterT = 1.0 - Math.pow(dCone / coneCraterRadius, 2.0);
          coneH -= 0.4 * craterT;
        }
        coneH += fbm(x * 2.5, y * 2.5) * 0.08;
        baseH = Math.max(baseH, coneH);
      }
    } else if (r <= rimCurve) {
      const tCliff = (r - shoreRadius) / Math.max(0.25, rimCurve - shoreRadius);
      baseH = waterLevel - 0.08 + (rimPeakH - (waterLevel - 0.08)) * Math.pow(tCliff, 1.32);
      const cliffCrevices = Math.sin(rimAngle * 16.0 + fbm(x * 1.5, y * 1.5) * 3.2) * 0.22 * tCliff * (1.0 - tCliff * 0.3);
      baseH += cliffCrevices;
    } else {
      const distOut = r - rimCurve;
      baseH = 0.35 + (rimPeakH - 0.35) * Math.exp(-distOut * 0.34);
      const barrancos =
        -Math.pow(Math.abs(Math.sin(rimAngle * 7.0 + fbm(x * 0.32, y * 0.32) * 2.0)), 2.2) *
        0.42 *
        smoothstep(0.25, 3.8, distOut);
      baseH += barrancos;
    }

    const distToRimPeak = Math.abs(r - rimCurve);
    const cragDetail =
      Math.sin(rimAngle * 20.0 + fbm(x * 2.0, y * 2.0) * 3.0) *
      0.2 *
      Math.exp(-Math.pow(distToRimPeak / 0.18, 2.0));

    const rawH = Math.max(0.25, baseH + cragDetail + fbm(x * 1.2, y * 1.2) * 0.09);
    h = rawH * reliefScale;

    const isCentralCone = dCone < coneBaseRadius && rawH > waterLevel - 0.04;

    if (isCentralCone) {
      if (dCone < coneCraterRadius) {
        color.set(mixColor('#221c1a', '#342b27', fbm(x * 4, y * 4)));
      } else {
        color.set(mixColor('#573428', '#3e2923', fbm(x * 3, y * 3)));
      }
    } else if (r <= shoreRadius) {
      color.set(mixColor('#0b2336', '#133a52', fbm(x * 3, y * 3)));
    } else if (r <= rimCurve + 0.15) {
      const strataNoise = fbm(x * 2.5, y * 2.5);
      const rockStrata = Math.sin(rawH * 6.8 + strataNoise * 2.0) * 0.5 + 0.5;
      color.set(mixColor('#453d36', '#6b5f53', rockStrata));
    } else if (rawH > 3.45) {
      color.set(mixColor('#7d7569', '#9c9386', fbm(x * 3, y * 3)));
    } else if (rawH > 2.15) {
      color.set(mixColor('#5a6e36', '#728645', fbm(x * 2.5, y * 2.5)));
    } else {
      color.set(mixColor('#24431d', '#355928', fbm(x * 2, y * 2)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 8. 주상절리 (제주 중문·대포 주상절리대, 북아일랜드 자이언츠 코즈웨이)
  // 배후 현무암 용암대지(Entablature)와 파식 해저면 기저 DEM (정밀 육각 기둥 군락은 3D 전용 메쉬로 결합)
  // =========================================================================
  if (normSub === '주상절리') {
    // 서쪽(x < 0)은 바다, 중앙(x ≈ -2.5 ~ +3.0)은 주상절리 계단 단애대, 동쪽(x > +3.0)은 상부 현무암 해안 대지
    const coastCurve = Math.sin(y * 0.32) * 1.15 + Math.cos(y * 0.65) * 0.45;
    const distInland = x - coastCurve;

    let rawH = 0;
    if (distInland > 2.8) {
      // 상부 비정질 현무암 캡록(Entablature) 및 해송 초지 대지
      const inlandRise = smoothstep(2.8, 5.2, distInland) * 0.55;
      rawH = 3.75 + inlandRise + fbm(x * 0.7, y * 0.7) * 0.18;
      color.set(
        distInland > 3.6
          ? mixColor('#2e4f23', '#416631', fbm(x * 2.2, y * 2.2))
          : mixColor('#2e3036', '#3d4047', fbm(x * 4, y * 4))
      );
    } else if (distInland > -2.6) {
      // 주상절리 다단 테라스 코어 기저면 (전용 260기 육각 기둥 볼륨 메쉬가 이 단애면을 빈틈없이 덮어 조형함)
      const t = smoothstep(-2.6, 2.8, distInland);
      rawH = 0.26 + Math.pow(t, 1.35) * 3.45;
      color.set(mixColor('#181a1e', '#262930', fbm(x * 4, y * 4)));
    } else {
      // 수중 현무암 파식 기저 암반
      rawH = 0.22 + fbm(x * 1.4, y * 1.4) * 0.1;
      color.set(mixColor('#0a1e2c', '#123147', fbm(x * 3, y * 3)));
    }

    h = rawH * reliefScale;
    return { height: h, color };
  }

  // =========================================================================
  // 9. 용암동굴 (제주 만장굴·거문오름 용암동굴계, 하와이 카주무라 동굴)
  // 완경사 파호이호이 용암 평원 + 전면 붕괴 함몰구(궤) 진입부 + 상부 천창(Skylight)
  // (중공 아치형 용암 터널 지붕과 천연교, 용암선반은 3D 전용 볼륨 메쉬로 완벽 결합)
  // =========================================================================
  if (normSub === '용암동굴') {
    const tubeCenterX = Math.sin(y * 0.26) * 1.35;
    const distTube = Math.abs(x - tubeCenterX);

    // 완만하게 남쪽(전면 y < 0)으로 흐르는 파호이호이 용암 대지 표면
    const surfaceBase = 2.65 + (y / 10.0) * 0.35 + warpedFbm(x * 0.45, y * 0.45, 3) * 0.26;
    // 새끼줄(Ropy pahoehoe) 미세 주름
    const ropy = Math.sin(y * 5.5 + Math.cos(x * 2.2) * 1.8) * 0.035;

    // 용암동굴 유로 축(distTube < 1.85)을 따라 동굴 바닥을 형성:
    // - 전면(y < 3.6): 붕괴 도랑 진입부 + 3D 중공 터널 아치 루프가 덮이는 내부 바닥 구간
    // - 후면(y > 3.6): 무너지지 않은 원형 용암 대지 지표면
    const alongOpenMask = 1.0 - smoothstep(3.2, 4.4, y);
    const crossMask = 1.0 - smoothstep(1.35, 2.05, distTube);
    const caveCarve = alongOpenMask * crossMask;

    const floorH = 0.42 + (y + 10.0) * 0.018 + fbm(x * 2.5, y * 2.5) * 0.06;
    const rawH = surfaceBase + ropy - (surfaceBase + ropy - floorH) * caveCarve;
    h = rawH * reliefScale;

    if (caveCarve > 0.65) {
      // 용암동굴 내부 바닥: 굳은 밧줄 용암 유로 및 어두운 현무암 암반
      color.set(mixColor('#14100f', '#241c19', fbm(x * 5, y * 5)));
    } else if (caveCarve > 0.12) {
      // 함몰구(궤) 다층 현무암 절벽 단면 및 양치식물(곶자왈 고사리) 이끼
      const moss = smoothstep(0.55, 0.75, fbm(x * 4, y * 4)) * (y < -2.2 ? 0.65 : 0.15);
      color.copy(mixColor('#2b221d', '#3e322b', fbm(x * 4, y * 4))).lerp(new THREE.Color('#2d5222'), moss);
    } else {
      // 상부 곶자왈 용암 평원: 파호이호이 암반 노두와 상록 곶자왈 수림 패치
      const gotjawal = smoothstep(0.42, 0.64, fbm(x * 0.75 + 2.0, y * 0.75, 4));
      color.copy(mixColor('#2a2624', '#3d3733', fbm(x * 3, y * 3))).lerp(new THREE.Color('#274a1f'), gotjawal * 0.78);
    }
    return { height: h, color };
  }

  // =========================================================================
  // 10. 단층 산맥 (경동지괴 & 정단층애: 태백산맥, 시에라네바다, 그랜드티턴)
  // 급경사 단층애(Fault Scarp) + V자 개석곡과 삼각말단면(Triangular Facets) + 선상 애추 + 완경사 경동 배후면
  // =========================================================================
  if (normSub === '단층 산맥') {
    const faultX = Math.sin(y * 0.16) * 0.55 - 0.85;
    const dx = x - faultX;

    // 산맥을 가로질러 침식하는 3개의 주요 V자 개석곡 (y = -5.2, 0.2, +5.4)
    const canyonSpacing = 5.2;
    const localValleyPhase = ((y + 7.8) % canyonSpacing + canyonSpacing) % canyonSpacing - canyonSpacing * 0.5;
    const valleyDistY = Math.abs(localValleyPhase);

    let rawH = 0;

    if (dx >= 0) {
      // 융기 상반: 주능선(dx ≈ 0.85)에서 최고봉을 이루고 동쪽으로 완만하게 기울어지는 경동지괴(Dip Slope)
      const crestProfile = smoothstep(0.0, 0.85, dx) * (1.0 - clamp((dx - 0.85) / 11.2, 0, 1) * 0.72);
      const ridgeCrest = 1.2 + crestProfile * 4.05 + ridgedFbm(x * 0.45, y * 0.45, 4) * 0.42;

      // 능선에서 동쪽 배후 사면 및 서쪽 단층애로 패여 들어가는 V자 침식 계곡
      const valleyDepth = (1.0 - smoothstep(0.0, 1.45, valleyDistY)) * 1.25 * smoothstep(0.0, 1.8, dx + 0.4);
      rawH = ridgeCrest - valleyDepth;
    } else {
      // 단층애(dx < 0): 55~60° 급경사 단층면이 계곡 침식으로 잘려 선명한 삼각말단면(Triangular Facets) 형성!
      const scarpWidth = 1.45;
      const scarpT = clamp(1.0 + dx / scarpWidth, 0.0, 1.0); // dx=0 -> 1, dx=-1.45 -> 0

      // 계곡 입구(valleyDistY 작음)에서는 능선이 깊게 파여 낮고, 계곡 사이(valleyDistY 큼)에서는 삼각형 면이 솟음
      const facetNotch = (1.0 - smoothstep(0.15, 1.55, valleyDistY)) * 1.65 * scarpT;
      const scarpH = 0.58 + Math.pow(scarpT, 1.15) * 4.45 - facetNotch + fbm(x * 2.2, y * 2.2) * 0.12 * scarpT;

      // 개석곡 입구마다 단층 지구대 바닥으로 부채꼴로 쏟아져 나온 복합 선상 애추(Alluvial/Talus Cones)
      const fanApexX = faultX - 0.95;
      const rFan = Math.hypot(x - fanApexX, localValleyPhase);
      const talusCone = x < faultX - 0.35 ? Math.max(0, 1.42 * Math.pow(Math.max(0, 1.0 - rFan / 2.35), 1.35)) : 0;

      // 침강 지구대 분지(Graben floor) 및 단층선 하천(Axial river at x ≈ faultX - 4.8)
      const riverX = faultX - 4.6 + Math.sin(y * 0.38) * 0.65;
      const distRiver = Math.abs(x - riverX);
      const riverCut = (1.0 - smoothstep(0.35, 0.95, distRiver)) * 0.34;
      const grabenFloor = 0.58 + smoothstep(-2.0, -8.5, dx) * 0.25 - riverCut + fbm(x * 0.9, y * 0.9) * 0.08;

      rawH = smax(grabenFloor, Math.max(scarpH, 0.55 + talusCone), 0.25);
    }

    h = Math.max(0.22, rawH * reliefScale);

    const riverX = faultX - 4.6 + Math.sin(y * 0.38) * 0.65;
    if (Math.abs(x - riverX) < 0.72 && dx < -2.0) {
      color.set(mixColor('#144757', '#1f6478', fbm(x * 5, y * 5)));
    } else if (dx < 0.2 && dx > -1.55 && rawH > 0.95) {
      // 삼각말단면 단층애 암벽 노두 및 애추 자갈층
      color.set(mixColor('#5c534a', '#7d7165', fbm(x * 5, y * 5)));
    } else if (dx <= -1.55) {
      // 지구대 충적 선상지 및 평원 초지
      color.set(mixColor('#5b6941', '#758252', fbm(x * 2.5, y * 2.5)));
    } else if (rawH > 4.25) {
      // 고산 화강편마암 암릉 및 잔설
      color.set(mixColor('#807a73', '#aba49c', fbm(x * 4, y * 4)));
    } else {
      // 경동지괴 배후 온대 산림 사면
      color.set(mixColor('#2f5224', '#466e34', fbm(x * 2, y * 2)));
    }
    return { height: h, color };
  }

  return null;
}
