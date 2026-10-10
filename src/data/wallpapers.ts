import { WallpaperConfig } from '../types';

export interface WallpaperPresetItem {
  id: string;
  name: string;
  category: 'nature' | 'cosmic' | 'cyber' | 'minimal' | 'gradient';
  thumbnail: string;
  type: WallpaperConfig['type'];
  value: string;
  defaultBlur?: number;
  defaultDim?: number;
}

export const WALLPAPER_CATEGORIES = [
  { id: 'all', label: 'All Wallpapers' },
  { id: 'nature', label: 'Nature & Earth' },
  { id: 'cosmic', label: 'Cosmic & Sky' },
  { id: 'cyber', label: 'Cyber & Urban' },
  { id: 'minimal', label: 'Minimal & Dark' },
  { id: 'gradient', label: 'Gradients' },
] as const;

export const WALLPAPER_PRESETS: WallpaperPresetItem[] = [
  // Minimal & Dark
  {
    id: 'pitch-black',
    name: 'Pitch Black',
    category: 'minimal',
    type: 'solid',
    value: '#000000',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 0,
    defaultDim: 0,
  },
  {
    id: 'obsidian-carbon',
    name: 'Obsidian Carbon',
    category: 'minimal',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0a0b10 0%, #141722 50%, #06070a 100%)',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 0,
    defaultDim: 10,
  },
  {
    id: 'minimal-waves',
    name: 'Dark Glass Flow',
    category: 'minimal',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 4,
    defaultDim: 30,
  },
  {
    id: 'dark-architect',
    name: 'Dark Geometry',
    category: 'minimal',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 0,
    defaultDim: 35,
  },

  // Nature & Earth
  {
    id: 'alpine-twilight',
    name: 'Alpine Twilight',
    category: 'nature',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 3,
    defaultDim: 30,
  },
  {
    id: 'misty-forest',
    name: 'Misty Pine Forest',
    category: 'nature',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 2,
    defaultDim: 35,
  },
  {
    id: 'ocean-sunset',
    name: 'Sunset Ocean Waves',
    category: 'nature',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 4,
    defaultDim: 35,
  },
  {
    id: 'mountain-peaks',
    name: 'Snow Peaks Horizon',
    category: 'nature',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 3,
    defaultDim: 35,
  },
  {
    id: 'desert-dunes',
    name: 'Desert Twilight Dunes',
    category: 'nature',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 2,
    defaultDim: 30,
  },

  // Cosmic & Sky
  {
    id: 'aurora-borealis',
    name: 'Northern Aurora',
    category: 'cosmic',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 3,
    defaultDim: 25,
  },
  {
    id: 'deep-space-nebula',
    name: 'Deep Space Nebula',
    category: 'cosmic',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 2,
    defaultDim: 30,
  },
  {
    id: 'starry-milkyway',
    name: 'Starry Horizon',
    category: 'cosmic',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 2,
    defaultDim: 25,
  },

  // Cyber & Urban
  {
    id: 'tokyo-rain-night',
    name: 'Tokyo Rainy Night',
    category: 'cyber',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 3,
    defaultDim: 30,
  },
  {
    id: 'cyber-skyline',
    name: 'Cyberpunk Skyline',
    category: 'cyber',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 3,
    defaultDim: 35,
  },
  {
    id: 'lofi-twilight-city',
    name: 'Cozy Twilight Room',
    category: 'cyber',
    type: 'preset',
    value: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 2,
    defaultDim: 25,
  },

  // Gradients
  {
    id: 'cosmic-indigo-mesh',
    name: 'Midnight Indigo',
    category: 'gradient',
    type: 'gradient',
    value: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 45%, #030712 100%)',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 0,
    defaultDim: 15,
  },
  {
    id: 'emerald-velvet',
    name: 'Emerald Glass',
    category: 'gradient',
    type: 'gradient',
    value: 'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #051b14 100%)',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 0,
    defaultDim: 15,
  },
  {
    id: 'sunset-magenta',
    name: 'Sunset Magenta',
    category: 'gradient',
    type: 'gradient',
    value: 'linear-gradient(135deg, #3b0764 0%, #701a75 40%, #18181b 100%)',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 0,
    defaultDim: 20,
  },
  {
    id: 'cyberpunk-neon-gradient',
    name: 'Neon Cyber Drift',
    category: 'gradient',
    type: 'gradient',
    value: 'linear-gradient(135deg, #18002e 0%, #0c2b45 50%, #1c0936 100%)',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=60',
    defaultBlur: 0,
    defaultDim: 20,
  },
];

export const DEFAULT_WALLPAPER: WallpaperConfig = {
  type: 'preset',
  name: 'Alpine Twilight',
  value: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
  blur: 3,
  dim: 30,
};

export const DEFAULT_GLASS: {
  transparency: number;
  blur: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  borderGlow: boolean;
} = {
  transparency: 25,
  blur: '2xl',
  borderGlow: true,
};
