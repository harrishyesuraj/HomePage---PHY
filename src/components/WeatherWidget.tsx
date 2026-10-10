import React, { useState, useEffect } from 'react';
import { 
  Cloud, Sun, CloudRain, Snowflake, CloudLightning, Wind, Droplets, Loader2, Search, MapPin
} from 'lucide-react';
import { WeatherData, AppSettings } from '../types';
import { fetchLiveWeather } from '../utils/weather';
import { motion, AnimatePresence } from 'motion/react';

interface WeatherWidgetProps {
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
}

const WEATHER_ICONS: Record<string, React.ReactNode> = {
  sunny: <Sun className="w-12 h-12 text-amber-500 animate-[spin_40s_linear_infinite]" />,
  cloudy: <Cloud className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />,
  rainy: <CloudRain className="w-12 h-12 text-blue-400" />,
  snowy: <Snowflake className="w-12 h-12 text-sky-200" />,
  stormy: <CloudLightning className="w-12 h-12 text-indigo-400" />,
  windy: <Wind className="w-12 h-12 text-slate-400" />
};

const FORECAST_ICONS: Record<string, React.ReactNode> = {
  sunny: <Sun className="w-5 h-5 text-amber-500" />,
  cloudy: <Cloud className="w-5 h-5 text-zinc-400" />,
  rainy: <CloudRain className="w-5 h-5 text-blue-400" />,
  snowy: <Snowflake className="w-5 h-5 text-sky-200" />,
  stormy: <CloudLightning className="w-5 h-5 text-indigo-400" />,
  windy: <Wind className="w-5 h-5 text-slate-400" />
};

export default function WeatherWidget({ settings, onChangeSettings }: WeatherWidgetProps) {
  const [cityName, setCityName] = useState(() => {
    return localStorage.getItem('last_weather_city') || 'San Francisco';
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorInput, setErrorInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const loadWeather = async (city: string) => {
    setLoading(true);
    setErrorInput('');
    try {
      const data = await fetchLiveWeather(city);
      setWeather(data);
      // Only persist if search succeeded
      setCityName(data.city);
      localStorage.setItem('last_weather_city', data.city);
    } catch (err: any) {
      setErrorInput(err.message || 'Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(cityName);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    loadWeather(searchQuery);
    setSearchQuery('');
    setIsSearching(false);
  };

  const getCelsius = (tempC: number) => {
    return tempC;
  };

  const getFahrenheit = (tempC: number) => {
    return Math.round((tempC * 9/5) + 32);
  };

  const renderTemp = (tempC: number) => {
    if (settings.useCelsius) {
      return `${tempC}°C`;
    }
    return `${getFahrenheit(tempC)}°F`;
  };

  return (
    <div 
      id="weather-widget-card" 
      className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-5 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-zinc-300/50 dark:hover:border-white/15"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-zinc-450 dark:text-zinc-450">
          <MapPin className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-sans">
            Weather Info
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Switcher */}
          <button
            id="temp-unit-toggle"
            onClick={() => onChangeSettings({ ...settings, useCelsius: !settings.useCelsius })}
            className="text-[10px] font-mono px-2 py-1 rounded bg-white/65 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-white/85 dark:hover:bg-white/10 hover:text-zinc-800 dark:hover:text-zinc-100 border border-zinc-200/40 dark:border-white/10 transition-colors cursor-pointer"
            title="Switch Temperature Unit"
          >
            {settings.useCelsius ? '→ °F' : '→ °C'}
          </button>

          {/* Search Button Toggle */}
          <button
            id="weather-search-toggle"
            onClick={() => setIsSearching(!isSearching)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Search Location"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.form 
            id="weather-search-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSearchSubmit}
            className="mb-4 overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                id="weather-search-input"
                type="text"
                autoFocus
                placeholder="Enter city name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
              />
              <button
                id="weather-search-submit-btn"
                type="submit"
                className="px-3 py-1.5 bg-indigo-500 dark:bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-600 dark:hover:bg-indigo-550 transition-colors cursor-pointer"
              >
                Go
              </button>
            </div>
            {errorInput && (
              <p className="text-[10px] text-red-500 mt-1">{errorInput}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
          <span className="text-[10px] font-mono text-zinc-400">Loading forecast...</span>
        </div>
      ) : weather ? (
        <div id="weather-details-section">
          {/* Main Weather Details */}
          <div className="flex items-center gap-4 justify-between mb-5">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-medium tracking-tight text-zinc-800 dark:text-zinc-100">
                  {weather.city}
                </span>
                {weather.country && (
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-505 font-medium">
                    {weather.country}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium capitalize mt-0.5">
                {weather.description}
              </p>
              <div className="flex gap-3 mt-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-zinc-405" />
                  {weather.windSpeed} km/h
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-400 dark:text-sky-400" />
                  {weather.humidity}%
                </span>
              </div>
            </div>

            <div className="text-right flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-display font-semibold text-zinc-800 dark:text-zinc-100">
                  {renderTemp(weather.temp)}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  H: {renderTemp(weather.tempMax)} L: {renderTemp(weather.tempMin)}
                </div>
              </div>
              <div>
                {WEATHER_ICONS[weather.condition] || <Cloud className="w-12 h-12 text-zinc-400" />}
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100/50 dark:bg-white/10 mb-4" />

          {/* 5 Day Forecast Grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {weather.forecast && weather.forecast.map((fc, index) => (
              <div 
                key={`${fc.day}-${index}`} 
                id={`weather-forecast-day-${index}`}
                className="flex flex-col items-center p-1.5 rounded-xl bg-white/20 dark:bg-white/5 border border-zinc-150/40 dark:border-white/5 text-center"
              >
                <span className="text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500">{fc.day}</span>
                <span className="my-1.5 select-none">{FORECAST_ICONS[fc.condition] || <Cloud className="w-4 h-4 text-zinc-400" />}</span>
                <span className="text-xs font-sans font-semibold text-zinc-700 dark:text-zinc-300">
                  {renderTemp(fc.temp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-zinc-405">
          Weather service unavailable.
        </div>
      )}
    </div>
  );
}
