import React from 'react';
import {
  StratovolcanoFeatures,
  ShieldVolcanoFeatures,
  DomeVolcanoFeatures,
  LavaPlateauFeatures,
  TuffConeFeatures,
  ParasiticConeFeatures,
  CalderaLakeFeatures,
  ColumnarJointingColumns,
  LavaTubeFeatures,
  FaultMountainFeatures,
} from './meshes/volcanicMeshes';
import {
  TidalFlatFeatures,
  SeaCliffFeatures,
  SeaArchAndStack,
  CoastalDuneFeatures,
  SandSpitFeatures,
  LagoonFeatures,
  WaveCutPlatformFeatures,
} from './meshes/coastalMeshes';
import {
  AlluvialFanFeatures,
  MeanderingRiverFeatures,
  IncisedMeanderFeatures,
  FloodplainFeatures,
  DeltaFeatures,
  RiverTerraceFeatures,
  WaterfallCascades,
} from './meshes/fluvialMeshes';
import {
  DolineFeatures,
  TowerKarstFeatures,
  LimestoneCaveFeatures,
} from './meshes/karstMeshes';
import {
  GlacialHornFeatures,
  GlacialValleyFeatures,
  CirqueFeatures,
  GlacialFeatures,
} from './meshes/glacialMeshes';
import {
  UndercutMushroomRock,
  OasisPalms,
  PlayaBrineFeatures,
} from './meshes/aridMeshes';

type SpecialMeshComponent = React.FC<{ reliefScale: number }>;

const SPECIAL_MESH_BY_TERRAIN: Readonly<Record<string, SpecialMeshComponent>> = {
  // 1. Volcanic
  '화산': StratovolcanoFeatures,
  '순상화산': ShieldVolcanoFeatures,
  '종상화산': DomeVolcanoFeatures,
  '용암대지': LavaPlateauFeatures,
  '수성화산': TuffConeFeatures,
  '기생화산': ParasiticConeFeatures,
  '칼데라': CalderaLakeFeatures,
  '주상절리': ColumnarJointingColumns,
  '용암동굴': LavaTubeFeatures,
  '단층 산맥': FaultMountainFeatures,

  // 2. Coastal
  '갯벌': TidalFlatFeatures,
  '해식애': SeaCliffFeatures,
  '시스택': SeaArchAndStack,
  '해안 사구': CoastalDuneFeatures,
  '사주·사취': SandSpitFeatures,
  '석호': LagoonFeatures,
  '파식대': WaveCutPlatformFeatures,

  // 3. Fluvial
  '선상지': AlluvialFanFeatures,
  '곡류천': MeanderingRiverFeatures,
  '감입곡류천': IncisedMeanderFeatures,
  '범람원': FloodplainFeatures,
  '삼각주': DeltaFeatures,
  '하안단구': RiverTerraceFeatures,
  '폭포': WaterfallCascades,

  // 4. Karst
  '돌리네': DolineFeatures,
  '탑 카르스트': TowerKarstFeatures,
  '석회동굴': LimestoneCaveFeatures,

  // 5. Glacial
  '혼': GlacialHornFeatures,
  'U자곡': GlacialValleyFeatures,
  '피오르드': ({ reliefScale }) => <GlacialFeatures reliefScale={reliefScale} isFjord />,
  '권곡': CirqueFeatures,
  '모레인': ({ reliefScale }) => <GlacialFeatures reliefScale={reliefScale} isFjord={false} />,

  // 6. Arid
  '버섯바위': UndercutMushroomRock,
  '오아시스': OasisPalms,
  '플라야': PlayaBrineFeatures,
};

export const TerrainSpecialMeshes: React.FC<{
  normSub: string;
  reliefScale: number;
}> = ({ normSub, reliefScale }) => {
  const FeatureComponent = SPECIAL_MESH_BY_TERRAIN[normSub];
  return FeatureComponent ? <FeatureComponent reliefScale={reliefScale} /> : null;
};
