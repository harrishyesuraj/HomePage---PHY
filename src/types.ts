export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
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

export interface AppSettings {
  accentColor: string; // 'blue' | 'emerald' | 'violet' | 'rose' | 'amber' | 'neutral'
  bgStyle: string; // 'solid' | 'gradient' | 'glass' | 'mesh'
  searchProvider: 'google' | 'duckduckgo' | 'bing' | 'github';
  useCelsius: boolean;
}
