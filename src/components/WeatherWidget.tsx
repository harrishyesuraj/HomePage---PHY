import React, { useState, useEffect } from 'react';
import { 
  Cloud, Sun, CloudRain, Snowflake, CloudLightning, Wind, Droplets, Loader2, 
  Search, MapPin, Navigation, RefreshCw, Check, ArrowRightLeft
} from 'lucide-react';
import { WeatherData, AppSettings } from '../types';
import { fetchLiveWeather, fetchLiveWeatherByCoords } from '../utils/weather';
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

const POPULAR_CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'San Francisco', 'Sydney', 'Berlin'];

export default function WeatherWidget({ settings, onChangeSettings }: WeatherWidgetProps) {
  const [cityName, setCityName] = useState(() => {
    return localStorage.getItem('last_weather_city') || 'San Francisco';
  });
  const [isLiveLocation, setIsLiveLocation] = useState<boolean>(() => {
    return localStorage.getItem('weather_mode') === 'live';
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errorInput, setErrorInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  // Load weather by city name
  const loadWeatherCity = async (city: string) => {
    setLoading(true);
    setErrorInput('');
    try {
      const data = await fetchLiveWeather(city);
      setWeather(data);
      setCityName(data.city);
      setIsLiveLocation(false);
      localStorage.setItem('weather_mode', 'city');
      localStorage.setItem('last_weather_city', data.city);
    } catch (err: any) {
      setErrorInput(err.message || 'Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  // Load weather using device's live GPS coordinates
  const loadLiveLocation = () => {
    if (!navigator.geolocation) {
      setErrorInput('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setErrorInput('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchLiveWeatherByCoords(latitude, longitude);
          setWeather(data);
          setIsLiveLocation(true);
          localStorage.setItem('weather_mode', 'live');
          localStorage.setItem('last_weather_city', data.city);
          setIsChangingLocation(false);
        } catch (err: any) {
          setErrorInput(err.message || 'Failed to fetch live weather forecast');
          loadWeatherCity(cityName);
        } finally {
          setGeoLoading(false);
        }
      },
      (geoError) => {
        console.warn('Geolocation error:', geoError);
        setGeoLoading(false);
        setErrorInput(
          geoError.code === 1 
            ? 'Location access denied. You can change location by entering a city.' 
            : 'Unable to retrieve location. Using saved city.'
        );
        loadWeatherCity(cityName);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // On initial mount
  useEffect(() => {
    if (isLiveLocation) {
      loadLiveLocation();
    } else {
      loadWeatherCity(cityName);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    loadWeatherCity(searchQuery.trim());
    setSearchQuery('');
    setIsChangingLocation(false);
  };

  const handleQuickCitySelect = (city: string) => {
    loadWeatherCity(city);
    setIsChangingLocation(false);
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
      className="card-glass-panel border rounded-3xl p-5 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-white/30 h-full min-h-[460px] flex flex-col justify-between"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <MapPin className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 font-sans">
            Weather Forecast
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Live GPS button */}
          <button
            id="weather-live-location-btn"
            onClick={loadLiveLocation}
            disabled={geoLoading}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              isLiveLocation
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-white/60 dark:bg-white/5 text-zinc-400 hover:text-zinc-200 border-zinc-200/40 dark:border-white/10'
            }`}
            title="Use Live Location Cast"
          >
            {geoLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Change Location Button */}
          <button
            id="weather-change-location-btn"
            onClick={() => setIsChangingLocation(!isChangingLocation)}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
              isChangingLocation
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-white/60 dark:bg-white/5 text-zinc-400 hover:text-zinc-200 border-zinc-200/40 dark:border-white/10'
            }`}
            title="Change Location"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Change</span>
          </button>
        </div>
      </div>

      {/* Change Location Drawer */}
      <AnimatePresence>
        {isChangingLocation && (
          <motion.div
            id="weather-location-changer-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 p-3 bg-white/40 dark:bg-black/30 border border-zinc-200/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-inner"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-zinc-300">
                Change Location
              </span>
              <button
                type="button"
                onClick={loadLiveLocation}
                disabled={geoLoading}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>Detect Live GPS</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-2.5">
              <input
                id="weather-search-input"
                type="text"
                autoFocus
                placeholder="Enter city (e.g. Chicago, London, Berlin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-white/60 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500/50"
              />
              <button
                id="weather-search-submit-btn"
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Set
              </button>
            </form>

            {/* Popular quick-pick cities */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-zinc-500 font-mono">Popular:</span>
              {POPULAR_CITIES.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleQuickCitySelect(city)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    cityName.toLowerCase() === city.toLowerCase() && !isLiveLocation
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                      : 'bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-zinc-200 border-white/5'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {errorInput && (
              <p className="text-[10px] text-red-400 mt-2 font-mono">{errorInput}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Forecast Body */}
      {loading || geoLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
          <span className="text-[10px] font-mono text-zinc-400">
            {geoLoading ? 'Detecting live location & forecast...' : 'Loading weather forecast...'}
          </span>
        </div>
      ) : weather ? (
        <div id="weather-details-section">
          {/* Main Weather Details */}
          <div className="flex items-center gap-4 justify-between mb-5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-medium tracking-tight text-zinc-800 dark:text-zinc-100">
                  {weather.city}
                </span>
                {weather.country && (
                  <span className="text-xs font-mono text-zinc-400 font-medium">
                    {weather.country}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium capitalize mt-0.5 flex items-center gap-1.5">
                <span>{weather.description}</span>
                {isLiveLocation && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </p>
              <div className="flex gap-3 mt-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-zinc-400" />
                  {weather.windSpeed} km/h
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-400" />
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
        <div className="text-center py-6 text-xs text-zinc-400">
          Weather service unavailable. Click Change to choose a city.
        </div>
      )}
    </div>
  );
}
