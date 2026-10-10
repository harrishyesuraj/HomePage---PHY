export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  folder?: string; // Subfolder path inside category, e.g. "Work/Projects" or "Designs"
  createdAt: number;
}

export interface QuickShortcut {
  id: string;
  title: string;
  url: string;
  iconName: string; // From Lucide icons list
  color: string;    // Tailwind color classes for background/border
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  isPinned?: boolean;
}

export interface WeatherData {
  city: string;
  country?: string;
  temp: number;
  condition: string; // 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy'
  description: string;
  humidity: number;
  windSpeed: number;
  tempMax: number;
  tempMin: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

export interface WidgetVisibility {
  weather: boolean;
  bookmarks: boolean;
  notes: boolean;
  quickLinks: boolean;
  clock: boolean;
}

export interface WallpaperConfig {
  type: 'preset' | 'custom-url' | 'upload' | 'solid' | 'gradient';
  value: string; // URL, data URL, hex color, or CSS gradient
  name: string;
  blur: number; // 0 to 24 px
  dim: number; // 0 to 85 % overlay dimming
}

export interface GlassEffectConfig {
  transparency: number; // 5 to 70 (opacity percent)
  blur: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  borderGlow: boolean;
}

export interface AppSettings {
  accentColor: string; // 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber'
  bgStyle: string; // 'solid' | 'gradient' | 'glass' | 'mesh'
  searchProvider: 'google' | 'duckduckgo' | 'bing' | 'github';
  useCelsius: boolean;
  wallpaper?: WallpaperConfig;
  glass?: GlassEffectConfig;
}
