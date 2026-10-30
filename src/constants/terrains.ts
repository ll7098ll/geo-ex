import { Mountain, Waves, Droplets, Compass, Snowflake, Sun } from 'lucide-react';
import { TerrainCategory } from '../types';

export const TERRAIN_CATEGORIES: TerrainCategory[] = [
  {
    id: 'volcanic',
    name: '화산 및 산지 지형',
    icon: Mountain,
    description: '지각 변동과 마그마의 활동으로 만들어진 웅장한 지형',
    items: ['화산', '칼데라', '주상절리', '용암동굴', '단층 산맥'],
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'coastal',
    name: '해안 지형',
    icon: Waves,
    description: '파도와 조류가 오랜 시간 조각한 바다의 예술품',
    items: ['갯벌', '해식애 (해안 절벽)', '시스택 (바위섬)', '해안 사구', '사주'],
    image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&q=80&w=2073'
  },
  {
    id: 'fluvial',
    name: '하천 지형',
    icon: Droplets,
    description: '흐르는 물이 깎고 쌓아 만든 생명의 터전',
    items: ['선상지', '곡류천', '삼각주', '하안단구', '폭포'],
    image: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'karst',
    name: '카르스트 지형',
    icon: Compass,
    description: '석회암이 물에 녹아 형성된 신비로운 지하 세계',
    items: ['석회동굴', '돌리네', '탑 카르스트'],
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2070' // Updated Karst Image (Halong Bay)
  },
  {
    id: 'glacial',
    name: '빙하 지형',
    icon: Snowflake,
    description: '거대한 얼음 덩어리가 훑고 지나간 흔적',
    items: ['U자곡', '피오르드', '혼 (호른)', '모레인'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'arid',
    name: '건조 지형',
    icon: Sun,
    description: '바람과 모래가 지배하는 척박하지만 경이로운 땅',
    items: ['사막', '버섯바위', '오아시스', '플라야'],
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=2070'
  }
];
