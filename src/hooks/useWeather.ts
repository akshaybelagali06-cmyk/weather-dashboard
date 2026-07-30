import { useState, useCallback, useEffect } from "react";
import { WeatherData, SearchResult } from "../types";

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const RECENT_SEARCHES_KEY = "luminous_recent_searches";

interface CacheItem {
  timestamp: number;
  data: WeatherData;
}

const weatherCache = new Map<string, CacheItem>();

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>(() => {
    try {
      const saved = sessionStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearches = (searches: SearchResult[]) => {
    setRecentSearches(searches);
    try {
      sessionStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (e) {
      console.warn("Could not save recent searches to sessionStorage", e);
    }
  };

  const addRecentSearch = (city: SearchResult) => {
    const updated = [
      city,
      ...recentSearches.filter((item) => item.name.toLowerCase() !== city.name.toLowerCase()),
    ].slice(0, 5); // Keep top 5
    saveRecentSearches(updated);
  };

  const fetchWeather = useCallback(async (lat: number, lon: number, locationName: string) => {
    setIsLoading(true);
    setError(null);
    const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}_${locationName.toLowerCase()}`;

    // Check cache
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      setWeatherData(cached.data);
      setIsLoading(false);
      return cached.data;
    }

    try {
      const res = await fetch(
        `/api/weather/data?lat=${lat}&lon=${lon}&name=${encodeURIComponent(locationName)}`
      );
      if (!res.ok) {
        throw new Error("Unable to fetch weather data for location.");
      }
      const data: WeatherData = await res.json();
      setWeatherData(data);
      weatherCache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } catch (err: any) {
      const msg = err.message || "Failed to load weather data.";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    weatherData,
    isLoading,
    error,
    fetchWeather,
    recentSearches,
    addRecentSearch,
    clearRecentSearches: () => saveRecentSearches([]),
  };
}
