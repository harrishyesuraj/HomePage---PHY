import { WeatherData } from '../types';

// Standard fallback mock locations in case of offline / rate limits
const MOCK_WEATHER_DATA: Record<string, WeatherData> = {
  "london": {
    city: "London",
    country: "United Kingdom",
    temp: 18,
    condition: "cloudy",
    description: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    tempMax: 22,
    tempMin: 14,
    forecast: [
      { day: "Tue", temp: 18, condition: "cloudy" },
      { day: "Wed", temp: 20, condition: "sunny" },
      { day: "Thu", temp: 17, condition: "rainy" },
      { day: "Fri", temp: 15, condition: "rainy" },
      { day: "Sat", temp: 19, condition: "sunny" },
    ]
  },
  "new york": {
    city: "New York",
    country: "United States",
    temp: 24,
    condition: "sunny",
    description: "Clear Sky",
    humidity: 50,
    windSpeed: 8,
    tempMax: 28,
    tempMin: 19,
    forecast: [
      { day: "Tue", temp: 24, condition: "sunny" },
      { day: "Wed", temp: 26, condition: "sunny" },
      { day: "Thu", temp: 23, condition: "cloudy" },
      { day: "Fri", temp: 21, condition: "stormy" },
      { day: "Sat", temp: 25, condition: "sunny" },
    ]
  },
  "tokyo": {
    city: "Tokyo",
    country: "Japan",
    temp: 22,
    condition: "rainy",
    description: "Light Showers",
    humidity: 80,
    windSpeed: 15,
    tempMax: 25,
    tempMin: 18,
    forecast: [
      { day: "Tue", temp: 22, condition: "rainy" },
      { day: "Wed", temp: 24, condition: "cloudy" },
      { day: "Thu", temp: 26, condition: "sunny" },
      { day: "Fri", temp: 23, condition: "sunny" },
      { day: "Sat", temp: 21, condition: "cloudy" },
    ]
  },
  "sydney": {
    city: "Sydney",
    country: "Australia",
    temp: 16,
    condition: "sunny",
    description: "Sunny and Brisk",
    humidity: 45,
    windSpeed: 10,
    tempMax: 19,
    tempMin: 11,
    forecast: [
      { day: "Tue", temp: 16, condition: "sunny" },
      { day: "Wed", temp: 17, condition: "sunny" },
      { day: "Thu", temp: 15, condition: "cloudy" },
      { day: "Fri", temp: 16, condition: "sunny" },
      { day: "Sat", temp: 18, condition: "sunny" },
    ]
  },
  "paris": {
    city: "Paris",
    country: "France",
    temp: 21,
    condition: "sunny",
    description: "Clear and Pleasant",
    humidity: 58,
    windSpeed: 9,
    tempMax: 24,
    tempMin: 15,
    forecast: [
      { day: "Tue", temp: 21, condition: "sunny" },
      { day: "Wed", temp: 23, condition: "sunny" },
      { day: "Thu", temp: 20, condition: "cloudy" },
      { day: "Fri", temp: 18, condition: "rainy" },
      { day: "Sat", temp: 22, condition: "sunny" },
    ]
  }
};

const DEFAULT_WEATHER: WeatherData = {
  city: "San Francisco",
  country: "United States",
  temp: 14,
  condition: "cloudy",
  description: "Foggy and Clouded",
  humidity: 78,
  windSpeed: 18,
  tempMax: 17,
  tempMin: 11,
  forecast: [
    { day: "Mon", temp: 14, condition: "cloudy" },
    { day: "Tue", temp: 15, condition: "cloudy" },
    { day: "Wed", temp: 16, condition: "sunny" },
    { day: "Thu", temp: 14, condition: "cloudy" },
    { day: "Fri", temp: 13, condition: "windy" },
  ]
};

function mapWMOCode(code: number): { condition: string; description: string } {
  if (code === 0) return { condition: 'sunny', description: 'Clear Sky' };
  if (code === 1 || code === 2 || code === 3) return { condition: 'cloudy', description: 'Partly Cloudy' };
  if (code === 45 || code === 48) return { condition: 'cloudy', description: 'Foggy' };
  if (code === 51 || code === 53 || code === 55) return { condition: 'rainy', description: 'Light Drizzle' };
  if (code === 61 || code === 63 || code === 65) return { condition: 'rainy', description: 'Rainy' };
  if (code === 71 || code === 73 || code === 75) return { condition: 'snowy', description: 'Snowy' };
  if (code === 77) return { condition: 'snowy', description: 'Snow Grains' };
  if (code === 80 || code === 81 || code === 82) return { condition: 'rainy', description: 'Rain Showers' };
  if (code === 85 || code === 86) return { condition: 'snowy', description: 'Snow Showers' };
  if (code === 95) return { condition: 'stormy', description: 'Thunderstorm' };
  if (code === 96 || code === 99) return { condition: 'stormy', description: 'Thunderstorm with Hail' };
  return { condition: 'cloudy', description: 'Cloudy' };
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function fetchLiveWeather(cityName: string): Promise<WeatherData> {
  const normalized = cityName.trim().toLowerCase();
  
  try {
    // 1. Geocode lookup
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    
    if (!geoRes.ok) {
      throw new Error("Geocoding service unavailable");
    }
    
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      // Find matches in local fallback
      if (MOCK_WEATHER_DATA[normalized]) {
        return MOCK_WEATHER_DATA[normalized];
      }
      // If we didn't find anything, search for sub-matches
      const match = Object.keys(MOCK_WEATHER_DATA).find(k => k.includes(normalized) || normalized.includes(k));
      if (match) {
        return MOCK_WEATHER_DATA[match];
      }
      throw new Error("Location not found");
    }
    
    const location = geoData.results[0];
    const { name, country, latitude, longitude } = location;
    
    // 2. Fetch Weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    
    if (!weatherRes.ok) {
      throw new Error("Weather service unavailable");
    }
    
    const weatherData = await weatherRes.json();
    const current = weatherData.current;
    const daily = weatherData.daily;
    
    const mappedCurrent = mapWMOCode(current.weather_code);
    
    // Process forecast
    const forecast: Array<{ day: string; temp: number; condition: string }> = [];
    if (daily && daily.time) {
      // Build 5-day forecast
      for (let i = 1; i < Math.min(6, daily.time.length); i++) {
        const dateStr = daily.time[i];
        const date = new Date(dateStr);
        const dayName = DAYS[date.getUTCDay()] || "Day";
        const tempMax = daily.temperature_2m_max[i];
        const tempMin = daily.temperature_2m_min[i];
        const avgTemp = Math.round((tempMax + tempMin) / 2);
        const mappedForecast = mapWMOCode(daily.weather_code[i]);
        
        forecast.push({
          day: dayName,
          temp: avgTemp,
          condition: mappedForecast.condition
        });
      }
    }
    
    return {
      city: name,
      country: country || "",
      temp: Math.round(current.temperature_2m),
      condition: mappedCurrent.condition,
      description: mappedCurrent.description,
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      tempMax: Math.round(daily?.temperature_2m_max[0] ?? current.temperature_2m),
      tempMin: Math.round(daily?.temperature_2m_min[0] ?? current.temperature_2m),
      forecast: forecast.length > 0 ? forecast : (MOCK_WEATHER_DATA[normalized]?.forecast || DEFAULT_WEATHER.forecast)
    };
  } catch (error) {
    console.warn("Falling back to local data matching cityName:", cityName, error);
    if (MOCK_WEATHER_DATA[normalized]) {
      return MOCK_WEATHER_DATA[normalized];
    }
    const match = Object.keys(MOCK_WEATHER_DATA).find(k => k.includes(normalized) || normalized.includes(k));
    if (match) {
      return MOCK_WEATHER_DATA[match];
    }
    // Return a default city customized with the searched name
    return {
      ...DEFAULT_WEATHER,
      city: cityName.charAt(0).toUpperCase() + cityName.slice(1)
    };
  }
}

export async function fetchLiveWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData> {
  let cityName = "Your Location";
  let countryName = "";

  // 1. Reverse Geocode lookup
  try {
    const geoRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (geoRes.ok) {
      const geo = await geoRes.json();
      cityName = geo.city || geo.locality || geo.principalSubdivision || "Current Location";
      countryName = geo.countryName || "";
    }
  } catch (e) {
    console.warn("Reverse geocode failed, using coordinates fallback", e);
  }

  // 2. Open-Meteo live weather forecast
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const weatherRes = await fetch(weatherUrl);

  if (!weatherRes.ok) {
    throw new Error("Unable to retrieve weather for current location");
  }

  const weatherData = await weatherRes.json();
  const current = weatherData.current;
  const daily = weatherData.daily;
  const mappedCurrent = mapWMOCode(current.weather_code);

  const forecast: Array<{ day: string; temp: number; condition: string }> = [];
  if (daily && daily.time) {
    for (let i = 1; i < Math.min(6, daily.time.length); i++) {
      const dateStr = daily.time[i];
      const date = new Date(dateStr);
      const dayName = DAYS[date.getUTCDay()] || "Day";
      const tempMax = daily.temperature_2m_max[i];
      const tempMin = daily.temperature_2m_min[i];
      const avgTemp = Math.round((tempMax + tempMin) / 2);
      const mappedForecast = mapWMOCode(daily.weather_code[i]);

      forecast.push({
        day: dayName,
        temp: avgTemp,
        condition: mappedForecast.condition
      });
    }
  }

  return {
    city: cityName,
    country: countryName,
    temp: Math.round(current.temperature_2m),
    condition: mappedCurrent.condition,
    description: mappedCurrent.description,
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    tempMax: Math.round(daily?.temperature_2m_max[0] ?? current.temperature_2m),
    tempMin: Math.round(daily?.temperature_2m_min[0] ?? current.temperature_2m),
    forecast: forecast.length > 0 ? forecast : DEFAULT_WEATHER.forecast
  };
}

