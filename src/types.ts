export interface SearchResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  code: number;
  label: string;
  icon: string;
  pop: number; // Precipitation probability %
}

export interface DailyForecastItem {
  day: string;
  dateStr: string;
  minTemp: number;
  maxTemp: number;
  code: number;
  label: string;
  icon: string;
  pop: number;
}

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  dateFormatted: string;
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    label: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    isDay: boolean;
    cloudCover: number;
  };
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  astronomy: {
    sunrise: string;
    sunset: string;
  };
  uvIndex: {
    value: number;
    label: string;
  };
  visibility: {
    valueKm: number;
  };
  airQuality: {
    aqi: number;
    label: string;
    color: string;
    pm2_5: number;
    pm10: number;
    o3: number;
    no2: number;
  };
}

export interface AiInsight {
  summary: string;
  outfit: string;
  activities: {
    name: string;
    score: string;
    rating: number;
    description: string;
  }[];
  healthAlert: string;
}

export type UnitSystem = 'metric' | 'imperial';
export type MapLayer = 'radar' | 'temperature' | 'wind' | 'clouds';
