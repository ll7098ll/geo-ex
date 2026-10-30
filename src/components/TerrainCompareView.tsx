import React, { useState, useMemo, useEffect } from 'react';
import {
  GitCompare,
  ArrowLeftRight,
  Pin,
  PinOff,
  Shuffle,
  Layers,
  Globe,
  Mountain,
  Eye,
  Compass,
  Activity,
  Clock,
  ChevronDown,
  Check,
  ZoomIn,
  X,
  Sparkles,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import Terrain3D from './Terrain3D';
import { PlaceInfo, Region } from '../types';
import { PRESET_PLACES, getPlacesForTerrain } from '../constants/places';
import { TERRAIN_CATEGORIES } from '../constants/terrains';

export interface TerrainCompareViewProps {
  currentPlace?: PlaceInfo;
  currentCategory: string;
  currentSubTerrain: string;
  region: Region;
  onClose?: () => void;
  onSelectNewBasePlace?: (place: PlaceInfo) => void;
}

export interface ComparePreset {
  id: string;
  title: string;
  label: string;
  description: string;
  terrainA: string;
  terrainB: string;
}

export const COMPARE_PRESETS: ComparePreset[] = [
  {
    id: 'volcano-caldera',
    title: '화산 vs 칼데라',
    label: '융기 vs 함몰',
    description: '마그마 분출로 높이 솟은 원추형 화산체와 마그마방 함몰로 꺼진 분지호 대조',
    terrainA: '화산',
    terrainB: '칼데라',
  },
  {
    id: 'uvalley-river',
    title: '빙하 U자곡 vs 곡류천',
    label: '빙식 vs 유수 침식',
    description: '빙하 굴식으로 깎아지른 수직 U자 협곡과 평원을 굽이쳐 흐르는 유수 곡류천 대조',
    terrainA: 'U자곡',
    terrainB: '곡류천',
  },
  {
    id: 'limestone-lava',
    title: '석회동굴 vs 용암동굴',
    label: '화학 용식 vs 물리적 터널',
    description: '석회암의 탄산 화학 용식 동굴과 현무암 표면 냉각 배출로 생긴 용암 튜브 대조',
    terrainA: '석회동굴',
    terrainB: '용암동굴',
  },
  {
    id: 'fjord-cliff',
    title: '피오르드 vs 해식애',
    label: '빙식 협만 vs 파식 절벽',
    description: '빙식곡이 바다에 잠긴 깊은 협만과 거친 파도가 직접 깎아낸 수직 해안 절벽 대조',
    terrainA: '피오르드',
    terrainB: '해식애 (해안 절벽)',
  },
  {
    id: 'fan-delta',
    title: '선상지 vs 삼각주',
    label: '산록 퇴적 vs 하구 퇴적',
    description: '골짜기 입구 유속 급감으로 부채꼴 퇴적된 선상지와 강 하구 정체수역 퇴적 삼각주 대조',
    terrainA: '선상지',
    terrainB: '삼각주',
  },
  {
    id: 'columnar-stack',
    title: '주상절리 vs 시스택',
    label: '냉각 수축 vs 파도 고립',
    description: '고온 용암의 120도 수축 균열 기둥과 파도 침식으로 본토에서 분리된 촛대 바위섬 대조',
    terrainA: '주상절리',
    terrainB: '시스택 (바위섬)',
  },
];

/**
 * Normalizes terrain string
 */
function cleanTerrainName(terrain: string): string {
  return terrain.replace(/\s*\(.*?\)\s*/g, '').trim();
}

/**
 * Resolves category ID from subTerrain name
 */
export function getCategoryIdForSubTerrain(subTerrain: string): string {
  const norm = cleanTerrainName(subTerrain).toLowerCase();
  for (const cat of TERRAIN_CATEGORIES) {
    if (
      cat.items.some((item) => {
        const normItem = cleanTerrainName(item).toLowerCase();
        return norm.includes(normItem) || normItem.includes(norm);
      })
    ) {
      return cat.id;
    }
  }
  return 'volcanic';
}

/**
 * Finds a representative place for a given terrain
 */
function findDefaultPlaceForTerrain(terrain: string, preferredRegion?: Region, excludeId?: string): PlaceInfo {
  const norm = cleanTerrainName(terrain).toLowerCase();
  let matches = PRESET_PLACES.filter((p) => {
    const pNorm = cleanTerrainName(p.terrain).toLowerCase();
    return pNorm === norm || p.terrain.includes(norm) || norm.includes(pNorm);
  });

  if (matches.length === 0) {
    matches = PRESET_PLACES;
  }

  // Filter out excludeId if possible
  const withoutExcluded = excludeId ? matches.filter((p) => p.id !== excludeId) : matches;
  const pool = withoutExcluded.length > 0 ? withoutExcluded : matches;

  // Filter by preferred region if specified
  if (preferredRegion) {
    const regionMatches = pool.filter((p) => p.region === preferredRegion);
    if (regionMatches.length > 0) {
      return regionMatches[0];
    }
  }

  return pool[0];
}

export const TerrainCompareView: React.FC<TerrainCompareViewProps> = ({
  currentPlace,
  currentCategory,
  currentSubTerrain,
  region,
  onClose,
  onSelectNewBasePlace,
}) => {
  // 1. Base Place (Pinned by default)
  const initialBase = useMemo(() => {
    if (currentPlace) return currentPlace;
    return findDefaultPlaceForTerrain(currentSubTerrain, region);
  }, [currentPlace, currentSubTerrain, region]);

  const [basePlace, setBasePlace] = useState<PlaceInfo>(initialBase);
  const [isBasePinned, setIsBasePinned] = useState<boolean>(true);

  // Keep basePlace in sync if user changes outside place while pinned
  useEffect(() => {
    if (currentPlace && currentPlace.id !== basePlace.id && isBasePinned) {
      setBasePlace(currentPlace);
    }
  }, [currentPlace, isBasePinned]);

  // 2. Target Place (Interactive Comparison Partner)
  // Pick an engaging contrasting initial target
  const initialTarget = useMemo(() => {
    const baseNorm = cleanTerrainName(initialBase.terrain);
    // Find matching preset first
    const matchingPreset = COMPARE_PRESETS.find(
      (p) => cleanTerrainName(p.terrainA) === baseNorm || cleanTerrainName(p.terrainB) === baseNorm
    );
    if (matchingPreset) {
      const targetTerrain =
        cleanTerrainName(matchingPreset.terrainA) === baseNorm
          ? matchingPreset.terrainB
          : matchingPreset.terrainA;
      return findDefaultPlaceForTerrain(targetTerrain, region, initialBase.id);
    }

    // Default contrasting fallbacks:
    const fallbackTerrain = baseNorm === '화산' ? '칼데라' : baseNorm === '칼데라' ? '화산' : 'U자곡';
    return findDefaultPlaceForTerrain(fallbackTerrain, region, initialBase.id);
  }, [initialBase, region]);

  const [targetPlace, setTargetPlace] = useState<PlaceInfo>(initialTarget);

  // Target selectors state
  const targetCategory = useMemo(
    () => getCategoryIdForSubTerrain(targetPlace.terrain),
    [targetPlace.terrain]
  );
  const baseCategory = useMemo(
    () => getCategoryIdForSubTerrain(basePlace.terrain),
    [basePlace.terrain]
  );

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(targetCategory);

  // Update category filter when target place changes
  useEffect(() => {
    setSelectedCategoryFilter(targetCategory);
  }, [targetCategory]);

  const activeCategoryObj = useMemo(
    () => TERRAIN_CATEGORIES.find((c) => c.id === selectedCategoryFilter) || TERRAIN_CATEGORIES[0],
    [selectedCategoryFilter]
  );

  // Available places for currently selected category
  const availableTargetPlaces = useMemo(() => {
    return PRESET_PLACES.filter((p) => {
      const pCat = getCategoryIdForSubTerrain(p.terrain);
      return pCat === selectedCategoryFilter;
    });
  }, [selectedCategoryFilter]);

  // Tabs for the contrast report
  const [activeCompareTab, setActiveCompareTab] = useState<'matrix' | 'satellite' | 'evolution'>('matrix');

  // Swap Left and Right
  const handleSwap = () => {
    const temp = basePlace;
    setBasePlace(targetPlace);
    setTargetPlace(temp);
    if (onSelectNewBasePlace) {
      onSelectNewBasePlace(targetPlace);
    }
  };

  // Quick preset selection
  const handleApplyPreset = (preset: ComparePreset) => {
    const placeA = findDefaultPlaceForTerrain(preset.terrainA, region);
    const placeB = findDefaultPlaceForTerrain(preset.terrainB, region, placeA.id);
    setBasePlace(placeA);
    setTargetPlace(placeB);
    if (onSelectNewBasePlace) {
      onSelectNewBasePlace(placeA);
    }
  };

  // Shuffle target place within current category
  const handleShuffleTarget = () => {
    const candidates = availableTargetPlaces.filter((p) => p.id !== targetPlace.id);
    if (candidates.length > 0) {
      const randomPlace = candidates[Math.floor(Math.random() * candidates.length)];
      setTargetPlace(randomPlace);
    } else {
      // Pick random place from entire database
      const allOthers = PRESET_PLACES.filter((p) => p.id !== targetPlace.id && p.id !== basePlace.id);
      const randomPlace = allOthers[Math.floor(Math.random() * allOthers.length)];
      setTargetPlace(randomPlace);
    }
  };

  // Base Place selector toggle
  const [showBaseSelector, setShowBaseSelector] = useState(false);

  // Scientific Agent Energy Classification
  const getEnergyType = (catId: string) => {
    if (catId === 'volcanic') return { type: '내인적 작용 (Endogenic)', desc: '지구 내부 열에너지 및 마그마 활동' };
    if (catId === 'glacial') return { type: '외인적 작용 (Exogenic - 빙하)', desc: '빙하 하중 및 중력 굴식·마모' };
    if (catId === 'fluvial') return { type: '외인적 작용 (Exogenic - 유수)', desc: '강수·하천 침식 및 유속 에너지' };
    if (catId === 'karst') return { type: '외인적 작용 (Exogenic - 용식)', desc: '탄산 지하수의 화학적 용해 작용' };
    if (catId === 'coastal') return { type: '외인적 작용 (Exogenic - 해양)', desc: '파도·조류 및 연안류의 파식·퇴적' };
    return { type: '외인적 작용 (Exogenic - 풍식)', desc: '건조 기후 바람의 사포 작용 및 풍적' };
  };

  const baseEnergy = getEnergyType(baseCategory);
  const targetEnergy = getEnergyType(targetCategory);

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in duration-300">
      {/* ========================================================
          1. Header & Global Toolbar
         ======================================================== */}
      <div className="px-5 sm:px-8 py-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-[#FFCC00] shadow-sm">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg sm:text-xl text-white tracking-tight">
                지형 나란히 비교 모드 (Side-by-Side Contrast)
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                <Sparkles className="w-3 h-3" />
                실시간 3D & 과학적 데이터 대조
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              한 지형을 고정하고 다양한 지형을 탐색하여 형성 원리와 3D 구조를 비교하세요.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-xs active:scale-95"
            title="좌우 지형 맞바꾸기"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
            <span>좌우 맞바꾸기</span>
          </button>

          {/* Close Compare Mode Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 rounded-lg text-xs font-medium border border-slate-700 hover:border-red-800 transition-all cursor-pointer"
              title="비교 모드 닫고 단일 뷰로 복귀"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">단일 뷰 복귀</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          2. Recommended Comparison Presets Bar
         ======================================================== */}
      <div className="px-5 sm:px-8 py-3 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>추천 대조 테마:</span>
          </span>
          {COMPARE_PRESETS.map((preset) => {
            const isSelected =
              (cleanTerrainName(basePlace.terrain) === cleanTerrainName(preset.terrainA) &&
                cleanTerrainName(targetPlace.terrain) === cleanTerrainName(preset.terrainB)) ||
              (cleanTerrainName(basePlace.terrain) === cleanTerrainName(preset.terrainB) &&
                cleanTerrainName(targetPlace.terrain) === cleanTerrainName(preset.terrainA));

            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{preset.title}</span>
                <span className={`text-[11px] ${isSelected ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                  / {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. Dual 3D Stage (Side-by-Side Viewports)
         ======================================================== */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* ====================================
              LEFT COLUMN: 기준 지형 (고정 📌)
             ==================================== */}
          <div className="flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg relative">
            {/* Left Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setIsBasePinned(!isBasePinned)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
                    isBasePinned
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isBasePinned ? '현재 기준 지형으로 고정됨' : '지형 고정 해제됨'}
                >
                  {isBasePinned ? (
                    <>
                      <Pin className="w-3.5 h-3.5 text-amber-400" />
                      <span>기준 고정됨</span>
                    </>
                  ) : (
                    <>
                      <PinOff className="w-3.5 h-3.5" />
                      <span>고정 해제</span>
                    </>
                  )}
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base truncate">{basePlace.placeName}</h4>
                    <span className="text-xs text-amber-400 font-medium shrink-0">
                      / {basePlace.terrain}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {basePlace.countryOrArea} • {basePlace.region === 'korea' ? '국내' : '해외'}
                  </p>
                </div>
              </div>

              {/* Base Place Quick Selector Toggle */}
              <button
                onClick={() => setShowBaseSelector(!showBaseSelector)}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>기준 변경</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showBaseSelector ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Optional Base Place Dropdown */}
            {showBaseSelector && (
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap gap-2 text-xs">
                <span className="w-full text-[11px] text-slate-400 font-semibold mb-1">
                  기준으로 지정할 지형 명소 선택:
                </span>
                {PRESET_PLACES.slice(0, 12).map((place) => (
                  <button
                    key={place.id}
                    onClick={() => {
                      setBasePlace(place);
                      setShowBaseSelector(false);
                      if (onSelectNewBasePlace) onSelectNewBasePlace(place);
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border ${
                      place.id === basePlace.id
                        ? 'bg-amber-400 text-black border-amber-300 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {place.placeName} ({place.terrain})
                  </button>
                ))}
              </div>
            )}

            {/* Left 3D Canvas Box */}
            <div className="w-full h-[360px] sm:h-[420px] bg-slate-950 relative border-b border-slate-800">
              <Terrain3D category={baseCategory} subTerrain={basePlace.terrain} />
              <div className="absolute top-3 left-3 pointer-events-none z-10">
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[11px] font-medium text-slate-300 border border-slate-700">
                  3D 시뮬레이터 A (기준)
                </span>
              </div>
            </div>

            {/* Left Quick Metadata Bar */}
            <div className="p-3.5 bg-slate-900/70 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-amber-400" />
                  작용 원동력
                </span>
                <p className="font-bold text-slate-200 mt-0.5 truncate">{baseEnergy.type}</p>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Mountain className="w-3 h-3 text-amber-400" />
                  대표 암석
                </span>
                <p className="font-bold text-slate-200 mt-0.5 truncate">
                  {basePlace.geology?.rockType || '화성암/퇴적암 암반'}
                </p>
              </div>
            </div>
          </div>

          {/* Center Floating Swap Indicator */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={handleSwap}
              className="w-11 h-11 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 hover:text-white hover:bg-amber-500 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer group"
              title="양쪽 지형 맞바꾸기"
            >
              <ArrowLeftRight className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* ====================================
              RIGHT COLUMN: 대조 지형 (탐색 🔍)
             ==================================== */}
          <div className="flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg relative">
            {/* Right Header & Terrain Picker Controls */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 shrink-0">
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>대조 탐색 중</span>
                  </span>
                  <div className="truncate">
                    <h4 className="font-bold text-white text-base truncate">{targetPlace.placeName}</h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {targetPlace.countryOrArea} • {targetPlace.region === 'korea' ? '국내' : '해외'}
                    </p>
                  </div>
                </div>

                {/* Shuffle Button */}
                <button
                  onClick={handleShuffleTarget}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded text-xs font-medium border border-slate-700 transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95"
                  title="다른 대조 명소 무작위 탐색"
                >
                  <Shuffle className="w-3 h-3 text-sky-400" />
                  <span>다른 명소</span>
                </button>
              </div>

              {/* Dynamic Terrain Explorer Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                {/* 1. Category Selection */}
                <div className="relative">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setSelectedCategoryFilter(newCat);
                      const catObj = TERRAIN_CATEGORIES.find((c) => c.id === newCat);
                      if (catObj && catObj.items.length > 0) {
                        const defaultP = findDefaultPlaceForTerrain(catObj.items[0], region, basePlace.id);
                        setTargetPlace(defaultP);
                      }
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer appearance-none pr-7 truncate"
                  >
                    {TERRAIN_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        대분류: {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 2. Specific Terrain Sub-item Selection */}
                <div className="relative">
                  <select
                    value={cleanTerrainName(targetPlace.terrain)}
                    onChange={(e) => {
                      const newTerrain = e.target.value;
                      const place = findDefaultPlaceForTerrain(newTerrain, region, basePlace.id);
                      setTargetPlace(place);
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer appearance-none pr-7 truncate"
                  >
                    {activeCategoryObj.items.map((item) => (
                      <option key={item} value={cleanTerrainName(item)}>
                        세부 지형: {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right 3D Canvas Box */}
            <div className="w-full h-[360px] sm:h-[420px] bg-slate-950 relative border-b border-slate-800">
              <Terrain3D category={targetCategory} subTerrain={targetPlace.terrain} />
              <div className="absolute top-3 left-3 pointer-events-none z-10">
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[11px] font-medium text-slate-300 border border-slate-700">
                  3D 시뮬레이터 B (대조)
                </span>
              </div>
            </div>

            {/* Right Quick Metadata Bar */}
            <div className="p-3.5 bg-slate-900/70 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-sky-400" />
                  작용 원동력
                </span>
                <p className="font-bold text-slate-200 mt-0.5 truncate">{targetEnergy.type}</p>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Mountain className="w-3 h-3 text-sky-400" />
                  대표 암석
                </span>
                <p className="font-bold text-slate-200 mt-0.5 truncate">
                  {targetPlace.geology?.rockType || '화성암/퇴적암 암반'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. Deep-Dive Contrast Navigation Tabs
           ======================================================== */}
        <div className="mt-8 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCompareTab('matrix')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeCompareTab === 'matrix'
                ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>핵심 지형학적 대조 분석표</span>
          </button>

          <button
            onClick={() => setActiveCompareTab('satellite')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeCompareTab === 'satellite'
                ? 'border-sky-400 text-sky-300 bg-sky-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>나란히 보는 위성 지도</span>
          </button>

          <button
            onClick={() => setActiveCompareTab('evolution')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeCompareTab === 'evolution'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>형성 진화사 대조</span>
          </button>
        </div>

        {/* TAB 1: 핵심 지형학적 대조 분석표 (Matrix) */}
        {activeCompareTab === 'matrix' && (
          <div className="pt-6 space-y-6 animate-in fade-in duration-200">
            {/* Comparative Insight Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-sky-950/40 border border-slate-700 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-white font-bold block mb-1">
                  지형학적 핵심 대조 인사이트 ({basePlace.terrain} vs {targetPlace.terrain})
                </strong>
                {baseCategory === targetCategory ? (
                  <span>
                    두 지형은 모두 동일한 <strong>{baseEnergy.type}</strong> 권역에 속하지만, 형성된 구체적인 지질학적
                    국면(예: 분출 양식, 침식 강도, 모암의 물성 등)에 따라 전혀 다른 외형과 단면 구조를 나타냅니다.
                  </span>
                ) : (
                  <span>
                    기준 지형({basePlace.placeName})은 <strong>{baseEnergy.type}</strong>에 의해 형성된 반면,
                    대조 지형({targetPlace.placeName})은 <strong>{targetEnergy.type}</strong>에 의해 조각되었습니다.
                    지구의 내적 마그마 열에너지와 외적 대기·수문·빙하 순환 에너지의 역동적 상호작용을 생생하게 대조할 수 있습니다.
                  </span>
                )}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-bold">
                      <th className="p-3.5 sm:p-4 w-1/4 min-w-[120px]">비교 항목</th>
                      <th className="p-3.5 sm:p-4 w-3/8 min-w-[200px] text-amber-300 bg-amber-950/20 border-r border-slate-800">
                        기준 지형: {basePlace.placeName} ({basePlace.terrain})
                      </th>
                      <th className="p-3.5 sm:p-4 w-3/8 min-w-[200px] text-sky-300 bg-sky-950/20">
                        대조 지형: {targetPlace.placeName} ({targetPlace.terrain})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {/* 1. 분류 및 에너지원 */}
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-400 bg-slate-900/40">
                        작용 분류 & 에너지원
                      </td>
                      <td className="p-3.5 sm:p-4 border-r border-slate-800">
                        <div className="font-semibold text-white">{baseEnergy.type}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{baseEnergy.desc}</div>
                      </td>
                      <td className="p-3.5 sm:p-4">
                        <div className="font-semibold text-white">{targetEnergy.type}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{targetEnergy.desc}</div>
                      </td>
                    </tr>

                    {/* 2. 주 형성 인자 */}
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-400 bg-slate-900/40">
                        주요 형성 인자 (Agent)
                      </td>
                      <td className="p-3.5 sm:p-4 border-r border-slate-800 font-medium text-slate-200">
                        {basePlace.geology?.geomorphicAgent || '화산 분출 및 유수 침식'}
                      </td>
                      <td className="p-3.5 sm:p-4 font-medium text-slate-200">
                        {targetPlace.geology?.geomorphicAgent || '빙하 삭박, 유수 침식 및 풍화'}
                      </td>
                    </tr>

                    {/* 3. 구성 암석 및 지질 시대 */}
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-400 bg-slate-900/40">
                        구성 암석 & 시대
                      </td>
                      <td className="p-3.5 sm:p-4 border-r border-slate-800">
                        <div className="text-white font-medium">{basePlace.geology?.rockType || '화성암 계열'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          시대: {basePlace.geology?.geologicalAge || '신생대 플라이스토세~홀로세'}
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4">
                        <div className="text-white font-medium">{targetPlace.geology?.rockType || '화강암·퇴적암 계열'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          시대: {targetPlace.geology?.geologicalAge || '신생대 플라이스토세 빙하기'}
                        </div>
                      </td>
                    </tr>

                    {/* 4. 대표 규모 및 수치 */}
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-400 bg-slate-900/40">
                        실측 규모 & 단차
                      </td>
                      <td className="p-3.5 sm:p-4 border-r border-slate-800">
                        {basePlace.geology?.scale?.elevationMeters && (
                          <div>해발 {basePlace.geology.scale.elevationMeters}m</div>
                        )}
                        {basePlace.geology?.scale?.depthMeters && (
                          <div>깊이/단차 {basePlace.geology.scale.depthMeters}m</div>
                        )}
                        {basePlace.geology?.scale?.areaKm2 && (
                          <div>면적 {basePlace.geology.scale.areaKm2}㎢</div>
                        )}
                        {!basePlace.geology?.scale && <div>지형 실측 참조</div>}
                      </td>
                      <td className="p-3.5 sm:p-4">
                        {targetPlace.geology?.scale?.elevationMeters && (
                          <div>해발 {targetPlace.geology.scale.elevationMeters}m</div>
                        )}
                        {targetPlace.geology?.scale?.depthMeters && (
                          <div>깊이/단차 {targetPlace.geology.scale.depthMeters}m</div>
                        )}
                        {targetPlace.geology?.scale?.areaKm2 && (
                          <div>면적 {targetPlace.geology.scale.areaKm2}㎢</div>
                        )}
                        {!targetPlace.geology?.scale && <div>지형 실측 참조</div>}
                      </td>
                    </tr>

                    {/* 5. 핵심 형성 프로세스 */}
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-400 bg-slate-900/40">
                        과학적 형성 과정
                      </td>
                      <td className="p-3.5 sm:p-4 border-r border-slate-800 leading-relaxed">
                        {basePlace.formationProcess || basePlace.description.slice(0, 160) + '...'}
                      </td>
                      <td className="p-3.5 sm:p-4 leading-relaxed">
                        {targetPlace.formationProcess || targetPlace.description.slice(0, 160) + '...'}
                      </td>
                    </tr>

                    {/* 6. 주요 현장 관찰 포인트 */}
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-400 bg-slate-900/40">
                        핵심 관찰 포인트
                      </td>
                      <td className="p-3.5 sm:p-4 border-r border-slate-800">
                        {basePlace.observationPoints && basePlace.observationPoints.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {basePlace.observationPoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        ) : (
                          <div>지표 단면 및 암석 노두 관찰</div>
                        )}
                      </td>
                      <td className="p-3.5 sm:p-4">
                        {targetPlace.observationPoints && targetPlace.observationPoints.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {targetPlace.observationPoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        ) : (
                          <div>지표 단면 및 암석 노두 관찰</div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 나란히 보는 위성 지도 (Satellite Maps) */}
        {activeCompareTab === 'satellite' && (
          <div className="pt-6 space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Satellite Map */}
              <div className="flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h5 className="font-bold text-white text-xs sm:text-sm">
                      {basePlace.placeName} 위성 지도
                    </h5>
                    <span className="text-[11px] text-amber-300/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 hidden sm:inline">
                      {basePlace.terrain}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {basePlace.region === 'korea' && (
                      <a
                        href={`https://map.naver.com/p/search/${encodeURIComponent(
                          basePlace.mapQuery || basePlace.placeName
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 hover:text-white rounded-md text-[11px] font-semibold border border-emerald-500/30 transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="네이버 지도 고해상도 항공뷰 열기"
                      >
                        <span>네이버 지도</span>
                      </a>
                    )}
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        basePlace.mapQuery || basePlace.placeName
                      )}&t=k`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-md text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
                      title={`${basePlace.placeName} Google 위성 지도 새 창에서 열기`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                      <span>지도에서 열기</span>
                    </a>
                  </div>
                </div>
                <div className="w-full h-[360px] relative overflow-hidden bg-slate-900">
                  <iframe
                    title={`${basePlace.placeName} 위성 뷰`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      basePlace.mapQuery || basePlace.placeName
                    )}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Right Satellite Map */}
              <div className="flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <h5 className="font-bold text-white text-xs sm:text-sm">
                      {targetPlace.placeName} 위성 지도
                    </h5>
                    <span className="text-[11px] text-sky-300/80 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/30 hidden sm:inline">
                      {targetPlace.terrain}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {targetPlace.region === 'korea' && (
                      <a
                        href={`https://map.naver.com/p/search/${encodeURIComponent(
                          targetPlace.mapQuery || targetPlace.placeName
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 hover:text-white rounded-md text-[11px] font-semibold border border-emerald-500/30 transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="네이버 지도 고해상도 항공뷰 열기"
                      >
                        <span>네이버 지도</span>
                      </a>
                    )}
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        targetPlace.mapQuery || targetPlace.placeName
                      )}&t=k`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-md text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
                      title={`${targetPlace.placeName} Google 위성 지도 새 창에서 열기`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                      <span>지도에서 열기</span>
                    </a>
                  </div>
                </div>
                <div className="w-full h-[360px] relative overflow-hidden bg-slate-900">
                  <iframe
                    title={`${targetPlace.placeName} 위성 뷰`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      targetPlace.mapQuery || targetPlace.placeName
                    )}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 형성 진화사 대조 (Evolution Stages) */}
        {activeCompareTab === 'evolution' && (
          <div className="pt-6 space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Base Place Evolution */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="font-bold text-amber-300 text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {basePlace.placeName} 지형 진화 단계
                </h5>
                {basePlace.evolutionStages && basePlace.evolutionStages.length > 0 ? (
                  <div className="space-y-3">
                    {basePlace.evolutionStages.map((st) => (
                      <div key={st.stageNumber} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                          <span>{st.stageNumber}단계: {st.title}</span>
                          <span className="text-[11px] text-slate-400 font-normal">{st.timeframe}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{st.process}</p>
                        <div className="mt-2 text-[11px] text-amber-200/80 bg-amber-950/30 px-2 py-1 rounded">
                          특징: {st.visualKeyFeature}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">상세 진화 단계는 기본 지질 연구자료를 참조하세요.</p>
                )}
              </div>

              {/* Target Place Evolution */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="font-bold text-sky-300 text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {targetPlace.placeName} 지형 진화 단계
                </h5>
                {targetPlace.evolutionStages && targetPlace.evolutionStages.length > 0 ? (
                  <div className="space-y-3">
                    {targetPlace.evolutionStages.map((st) => (
                      <div key={st.stageNumber} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-sky-400 font-bold mb-1">
                          <span>{st.stageNumber}단계: {st.title}</span>
                          <span className="text-[11px] text-slate-400 font-normal">{st.timeframe}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{st.process}</p>
                        <div className="mt-2 text-[11px] text-sky-200/80 bg-sky-950/30 px-2 py-1 rounded">
                          특징: {st.visualKeyFeature}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">상세 진화 단계는 기본 지질 연구자료를 참조하세요.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
