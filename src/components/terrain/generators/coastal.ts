import * as THREE from 'three';
import { fbm, smoothstep, mixColor, TerrainEvalResult } from '../terrainMath';

export function evalCoastalTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // 1. 갯벌 (조간대 간석지 / 갯골 수계망 - 서해안 순천만, 가로림만)
  if (normSub === '갯벌') {
    // 만입부(Bay) 형태의 조간대 간석지 기저 지형
    const baySlope = (y + 4.5) * 0.08;
    
    // 수지상(Dendritic) 갯골 나뭇가지 수계망
    const mainChannel = Math.sin(y * 0.45) * 1.6 + Math.cos(y * 0.22) * 0.9;
    const distToMain = Math.abs(x - mainChannel);
    const mainGully = distToMain < 1.1 ? Math.cos((distToMain / 1.1) * Math.PI * 0.5) * 0.85 : 0;
    
    // 2차 지류 갯골
    const branch1 = Math.abs(x - (mainChannel + Math.sin(y * 1.2) * 1.5));
    const gully1 = (y > -2 && branch1 < 0.5) ? Math.cos((branch1 / 0.5) * Math.PI * 0.5) * 0.45 : 0;

    h = Math.max(0.12, (0.45 + baySlope - mainGully - gully1 + fbm(x * 2.5, y * 2.5) * 0.08) * reliefScale);

    if (distToMain < 0.4) {
      // 갯골 중심부: 항상 조수가 흐르는 젖은 흑회색 실트질 뻘
      color.set(mixColor('#14181b', '#1f252a', fbm(x * 8, y * 8)));
    } else if (distToMain < 1.0) {
      // 갯골 사면: 물기를 머금은 펄 갯벌
      color.set(mixColor('#2b3338', '#384247', fbm(x * 6, y * 6)));
    } else if (y > 3.0) {
      // 상부 염습지(Salt marsh): 붉은 칠면초(Suaeda japonica)와 갈대 군락
      color.set(mixColor('#632128', '#384d28', fbm(x * 5, y * 5)));
    } else {
      // 중부 모래-펄 혼합 조간대
      color.set(mixColor('#424b50', '#566167', fbm(x * 4, y * 4)));
    }
    return { height: h, color };
  }

  // 2. 해식애 (파도의 침식 작용으로 형성된 깎아지른 바다 절벽 - 채석강, 태종대)
  if (normSub === '해식애') {
    // 톱니 모양의 해안선 절벽 경계
    const cliffX = Math.sin(y * 0.5) * 1.2 + fbm(y * 0.8, 0) * 0.6;
    const distFromCliff = x - cliffX;

    if (distFromCliff > 0) {
      // 상부 해안 단구 고원 (평탄한 침식면 + 해송 군락)
      h = (4.0 + fbm(x * 0.5, y * 0.5) * 0.4) * reliefScale;
      color.set(mixColor('#2f4a24', '#3e5c30', fbm(x * 2, y * 2)));
    } else if (distFromCliff > -0.7) {
      // 수직 해식애 절벽면 (수평 책장형 층리와 파식 해식구/Notch)
      const dropProg = -distFromCliff / 0.7;
      const notch = Math.sin(dropProg * Math.PI) * 0.35;
      h = (4.0 - dropProg * 3.4 - notch) * reliefScale;

      // 퇴적암 수평 층리(Bedding strata) 텍스처
      const strata = Math.sin(h * 8.0) * 0.5 + 0.5;
      color.set(mixColor('#473b32', '#706052', strata));
    } else {
      // 기저 파식대 (Wave-cut platform): 썰물 시 노출되는 편평한 암반
      h = (0.35 + fbm(x * 2.0, y * 2.0) * 0.15) * reliefScale;
      color.set(mixColor('#15242b', '#263d47', fbm(x * 4, y * 4)));
    }
    return { height: h, color };
  }

  // 3. 시스택 & 해식아치 (독도 독립문바위, 백령도 두무진 코끼리바위, 호주 12사도)
  if (normSub === '시스택') {
    // 바다를 향해 튀어나온 헤드랜드(곶 / Promontory)
    const headland = Math.max(0, 4.4 * Math.exp(-(Math.pow(x - 3.8, 2) * 0.15 + Math.pow(y, 2) * 0.08)));

    // 바다 한가운데 우뚝 솟은 고립된 바위 기둥 3개 (Sea Stacks / 촛대바위)
    const stacks = [
      { sx: -2.8, sy: 2.2, r: 1.1, h: 4.8 },  // 제1 시스택
      { sx: -3.5, sy: -1.8, r: 0.95, h: 4.0 }, // 제2 시스택
      { sx: -1.2, sy: -3.4, r: 0.8, h: 3.2 },  // 제3 시스택
    ];

    let stackH = 0;
    for (const s of stacks) {
      const sd = Math.sqrt(Math.pow(x - s.sx, 2) + Math.pow(y - s.sy, 2));
      if (sd < s.r) {
        // 하부가 파도에 깎여 약간 잘록하고 정상은 뾰족한 해식 기둥 형태
        const profile = Math.pow(Math.cos((sd / s.r) * Math.PI * 0.5), 0.5);
        stackH = Math.max(stackH, profile * s.h);
      }
    }

    // 바다 기저면
    const seaFloor = 0.28 + fbm(x * 1.5, y * 1.5) * 0.12;
    h = Math.max(seaFloor, Math.max(headland, stackH)) * reliefScale;

    if (h > 1.0 * reliefScale) {
      // 층리가 드러난 해식애 바위 표면 및 백색 갈매기 배설물(Guano)
      const strata = Math.sin(h * 9.0) * 0.5 + 0.5;
      color.set(mixColor('#544940', '#7a6c5f', strata));
      if (h > 4.2 * reliefScale) {
        // 정상부 낮은 초본 식생
        color.set(mixColor('#4d5e30', '#3b4725', fbm(x * 3, y * 3)));
      }
    } else {
      // 투명한 에메랄드-터키석 해양 암반
      color.set(mixColor('#0c212b', '#143644', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 4. 해안 사구 (바람에 의해 모래가 언덕을 이룬 지형 - 신두리 해안사구)
  if (normSub === '해안 사구') {
    // 해안선(서쪽)에서 내륙(동쪽)으로 불어오는 계절풍에 의해 배열된 2중 사구열
    // 1차 전사구(Foredune, x ~ -1.5)와 거대한 2차 횡사구열(Transverse Dune, x ~ 2.0)
    const dune1 = Math.exp(-Math.pow(x - (-1.5), 2) * 0.7) * 2.2;
    
    // 비대칭 단면: 완만한 바람받이 사면(10-14도)과 급격한 안식각 사태면(Slip face, 34도)
    const distDune2 = x - 2.0;
    const slipFace = distDune2 > 0 ? Math.exp(-distDune2 * 1.4) : Math.exp(distDune2 * 0.5);
    const dune2 = slipFace * 3.8;

    // 바람에 날린 미세 모래 물결 무늬 (Wind Ripples)
    const ripples = Math.sin(x * 7.0 - y * 1.5) * 0.06;
    
    // 사구 배후의 축축한 사구 소택지 (Dune Slack / 두웅습지)
    const slack = Math.exp(-(Math.pow(x - 0.2, 2) * 1.2 + Math.pow(y, 2) * 0.1)) * 0.6;

    h = Math.max(0.3, (0.4 + dune1 + dune2 - slack + ripples + fbm(x * 0.8, y * 0.8) * 0.15) * reliefScale);

    if (x < -4.0) {
      // 파도가 치는 백사장 해빈(Beach)
      color.set(mixColor('#d9bc84', '#eed098', fbm(x * 4, y * 4)));
    } else if (Math.abs(x - 0.2) < 0.8 && y > -3 && y < 3) {
      // 사구 배후 습지: 풍부한 식생(통발, 금개구리 서식지)
      color.set(mixColor('#2b5220', '#3e6b2c', fbm(x * 5, y * 5)));
    } else if (h > 2.5 * reliefScale) {
      // 건조한 사구 마루: 순수한 황금빛 세립질 석영 모래
      color.set(mixColor('#dfbd7e', '#f5d492', fbm(x * 3, y * 3)));
    } else {
      // 사구 고정 식물(통보리사초, 해당화)이 정착한 반고정 사구
      color.set(mixColor('#b89d63', '#a28650', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 5. 사주·사취 (연안류로 퇴적된 모래 부리 및 육계사주 - 신도/모도, 영흥도)
  if (normSub === '사주·사취') {
    // 서쪽 육지 본토
    const mainland = Math.max(0, 3.8 * (1.0 - (x + 8.0) / 4.0));
    
    // 동쪽의 고립된 기반암 바위섬 (육계도 / Tied Island)
    const islandDist = Math.sqrt(Math.pow(x - 4.5, 2) + Math.pow(y, 2));
    const tiedIsland = Math.max(0, 3.6 * (1.0 - islandDist / 2.2));

    // 본토와 섬을 연결하는 아름다운 만곡 육계사주 모래톱 (Tombolo / Spit)
    const spitY = Math.sin(x * 0.3) * 0.6;
    const distToSpit = Math.abs(y - spitY);
    const spit = (x > -3.5 && x < 4.0) ? Math.exp(-Math.pow(distToSpit / 0.85, 2)) * 1.45 : 0;

    // 만곡 사취 부리 (Curved hook)
    const hookDist = Math.sqrt(Math.pow(x - 1.5, 2) + Math.pow(y - 2.8, 2));
    const hook = Math.exp(-Math.pow(hookDist / 0.7, 2)) * 1.1;

    h = Math.max(0.25, (0.28 + mainland + tiedIsland + spit + hook + fbm(x * 1.2, y * 1.2) * 0.08) * reliefScale);

    if (tiedIsland > 0.8) {
      // 육계도 울창한 상록수림 및 바위 해안
      color.set(mixColor('#345427', '#486e35', fbm(x * 3, y * 3)));
    } else if (spit > 0.4 || hook > 0.4) {
      // 뽀얀 백사장 모래톱
      color.set(mixColor('#ebd099', '#fce2ab', fbm(x * 4, y * 4)));
    } else {
      // 맑은 청록색 연안 해수면
      color.set(mixColor('#0e2835', '#163d4f', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 6. 석호 (사주가 만의 입구를 막아 형성된 기수호 - 송지호, 화진포, 경포호)
  if (normSub === '석호') {
    // 바다(동쪽 x > 3.5), 모래 사주(Barrier Spit, 2.0 < x < 3.5), 석호(Lagoon, -3.0 < x < 2.0), 내륙 산지(x < -3.0)
    const sandSpit = Math.exp(-Math.pow(x - 2.6, 2) * 1.8) * 1.6;
    
    // 사주 사이의 좁은 조수 유입 통로 (갯트임 / Tidal Inlet)
    const inlet = Math.abs(y - 0.5) < 0.6 ? 1.4 : 0;
    
    // 내륙 배후의 소나무 숲 완경사 구릉지
    const inlandHills = Math.max(0, ((-x - 2.0) / 4.0) * 3.8 + fbm(x * 0.6, y * 0.6) * 0.8);
    
    // 석호 호수 바닥
    const isLagoon = x > -3.0 && x < 2.0 && Math.abs(y) < 5.0;
    const lagoonBowl = isLagoon ? 0.35 + fbm(x * 1.5, y * 1.5) * 0.08 : 0;

    h = Math.max(0.25, (0.3 + inlandHills + Math.max(0, sandSpit - inlet) + lagoonBowl) * reliefScale);

    if (x > 3.2) {
      // 동해 외해 푸른 바다
      color.set(mixColor('#0a1e2d', '#133249', fbm(x * 3, y * 3)));
    } else if (sandSpit > 0.5 && inlet === 0) {
      // 사주 모래톱 및 방풍림 해송(곰솔)
      color.set(mixColor('#d9bb82', '#eed198', fbm(x * 5, y * 5)));
    } else if (isLagoon) {
      // 고요한 갈대와 연꽃이 어우러진 석호 기수역
      color.set(mixColor('#193e38', '#23564e', fbm(x * 4, y * 4)));
    } else {
      // 배후 내륙 소나무 구릉림
      color.set(mixColor('#2b4722', '#3a5e2f', fbm(x * 2, y * 2)));
    }
    return { height: h, color };
  }

  // 7. 파식대 (조간대에 넓게 형성된 암반 평탄면 - 채석강, 영덕 해맞이공원)
  if (normSub === '파식대') {
    // 해안 절벽(동쪽)과 넓은 파식대 암반(서쪽)
    const cliffEdge = Math.sin(y * 0.4) * 0.8 + 2.4;
    
    if (x > cliffEdge) {
      // 후퇴하고 있는 해식애 수직 단애 (해식 절벽)
      h = (4.2 + fbm(x * 0.5, y * 0.5) * 0.4) * reliefScale;
      color.set(mixColor('#473c33', '#635448', fbm(x * 4, y * 4)));
    } else {
      // 조차에 의해 드러난 광활한 파식대 암반 평탄면
      // 바둑판 모양의 정밀 직교 절리망(Orthogonal Joint Grid)과 조수 웅덩이(Tide pools)
      const jx = Math.abs(Math.sin(x * 2.6));
      const jy = Math.abs(Math.sin(y * 2.6));
      const jointCracks = (jx < 0.12 || jy < 0.12) ? -0.22 : 0;

      h = Math.max(0.2, (0.55 + jointCracks + fbm(x * 1.5, y * 1.5) * 0.1) * reliefScale);

      if (jointCracks < 0) {
        // 갈라진 절리 틈새 해조류(파래, 김)와 젖은 해저면
        color.set(mixColor('#16201a', '#223026', fbm(x * 6, y * 6)));
      } else {
        // 평평하게 깎인 파식대 퇴적암층
        color.set(mixColor('#4a4843', '#66635c', fbm(x * 4, y * 4)));
      }
    }
    return { height: h, color };
  }

  return null;
}
