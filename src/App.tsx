import React, { useState, useEffect, useCallback } from "react";
import { SearchResult, UnitSystem } from "./types";
import { useWeather } from "./hooks/useWeather";
import { Header } from "./components/Header";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { WeatherMap } from "./components/WeatherMap";
import { FiveDayForecast } from "./components/FiveDayForecast";
import { HourlyForecast } from "./components/HourlyForecast";
import { MetricsGrid } from "./components/MetricsGrid";
import { AirQualityCard } from "./components/AirQualityCard";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { AiModal } from "./components/AiModal";

const DEFAULT_FAVORITES: SearchResult[] = [
  { name: "San Francisco", latitude: 37.7749, longitude: -122.4194, country: "United States", admin1: "California" },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503, country: "Japan", admin1: "Tokyo" },
  { name: "London", latitude: 51.5074, longitude: -0.1278, country: "United Kingdom", admin1: "England" },
  { name: "New York", latitude: 40.7128, longitude: -74.006, country: "United States", admin1: "New York" },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522, country: "France", admin1: "Île-de-France" },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, country: "Australia", admin1: "New South Wales" },
];

export default function App() {
  const {
    weatherData,
    isLoading,
    fetchWeather,
    recentSearches,
    addRecentSearch,
  } = useWeather();

  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<SearchResult[]>(() => {
    try {
      const saved = localStorage.getItem("luminous_weather_favorites");
      return saved ? JSON.parse(saved) : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("luminous_weather_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.warn("Unable to save favorites to localStorage", e);
    }
  }, [favorites]);

  // Show auto-dismissing toast notification
  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // Startup Geolocation & Default City Handling
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(
            position.coords.latitude,
            position.coords.longitude,
            "Current Location"
          ).catch(() => {
            fetchWeather(37.7749, -122.4194, "San Francisco, USA");
          });
        },
        (_error) => {
          showToast("Location access denied. Loaded default location (San Francisco).");
          fetchWeather(37.7749, -122.4194, "San Francisco, USA");
        },
        { timeout: 8000 }
      );
    } else {
      showToast("Geolocation not supported by browser. Loaded San Francisco.");
      fetchWeather(37.7749, -122.4194, "San Francisco, USA");
    }
  }, [fetchWeather, showToast]);

  // Handle City Selection
  const handleSelectCity = (city: SearchResult) => {
    const fullName = city.country ? `${city.name}, ${city.country}` : city.name;
    addRecentSearch(city);
    fetchWeather(city.latitude, city.longitude, fullName);
  };

  // Handle Geolocation Button Click
  const handleUseGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(
            position.coords.latitude,
            position.coords.longitude,
            "Current Location"
          );
        },
        (_error) => {
          showToast("Unable to access current GPS position.");
        }
      );
    } else {
      showToast("Geolocation is not supported by your browser.");
    }
  };

  // Toggle temperature unit °C / °F
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  // Toggle favorite bookmark
  const isCurrentFavorite =
    weatherData &&
    favorites.some(
      (f) => f.name.toLowerCase() === weatherData.location.split(",")[0].toLowerCase()
    );

  const toggleCurrentFavorite = () => {
    if (!weatherData) return;
    const cityName = weatherData.location.split(",")[0].trim();
    if (isCurrentFavorite) {
      setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase()));
    } else {
      setFavorites((prev) => [
        ...prev,
        {
          name: cityName,
          latitude: weatherData.latitude,
          longitude: weatherData.longitude,
          country: weatherData.location.split(",")[1]?.trim() || "",
        },
      ]);
    }
  };

  const handleRemoveFavorite = (cityName: string) => {
    setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase()));
  };

  return (
    <div className="min-h-screen relative font-sans text-[#e2e2e2] antialiased overflow-x-hidden selection:bg-emerald-500/30 pb-20 md:pb-12">
      {/* Background Glowing Ambient Orbs */}
      <div className="ambient-orb bg-emerald-600/30 w-[500px] h-[500px] -top-24 -left-24" />
      <div
        className="ambient-orb bg-purple-600/30 w-[600px] h-[600px] -bottom-48 -right-24"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="ambient-orb bg-teal-500/20 w-[400px] h-[400px] top-[30%] left-[40%]"
        style={{ animationDelay: "-10s" }}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 glass-panel px-4 py-2.5 backdrop-blur-xl bg-black/80 border border-emerald-400/40 shadow-2xl flex items-center gap-2 text-xs text-[#e2e2e2] animate-fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-sm">info</span>
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12 flex flex-col gap-6">
        {/* Header */}
        <Header
          currentLocation={weatherData?.location || "San Francisco, USA"}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onSelectCity={handleSelectCity}
          onUseGeolocation={handleUseGeolocation}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          isLoading={isLoading}
          recentSearches={recentSearches}
        />

        {weatherData ? (
          <>
            {/* Bookmark Current Location Bar */}
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Live Station
                </span>
                <span className="text-xs text-gray-400">
                  Lat: {weatherData.latitude.toFixed(2)}°, Lon: {weatherData.longitude.toFixed(2)}°
                </span>
              </div>

              <button
                onClick={toggleCurrentFavorite}
                className="glass-button px-3 py-1 flex items-center gap-1.5 text-xs text-[#e2e2e2] hover:text-amber-300 transition-colors"
              >
                <span
                  className={`material-symbols-outlined text-sm ${
                    isCurrentFavorite ? "text-amber-300 icon-fill" : "text-gray-400"
                  }`}
                >
                  star
                </span>
                <span>{isCurrentFavorite ? "Saved" : "Save Location"}</span>
              </button>
            </div>

            {/* Split Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Current Weather */}
              <div className="col-span-1 lg:col-span-5">
                <CurrentWeatherCard data={weatherData} unit={unit} />
              </div>

              {/* Right: Interactive Weather Map */}
              <div className="col-span-1 lg:col-span-7">
                <WeatherMap data={weatherData} unit={unit} />
              </div>
            </div>

            {/* Lower Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 5-Day Forecast */}
              <div className="col-span-1 lg:col-span-4">
                <FiveDayForecast daily={weatherData.daily} unit={unit} />
              </div>

              {/* Right Column: Hourly & Metrics & AQI */}
              <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
                <HourlyForecast hourly={weatherData.hourly} unit={unit} />
                <MetricsGrid data={weatherData} unit={unit} />
                <AirQualityCard airQuality={weatherData.airQuality} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <span className="material-symbols-outlined text-emerald-400 text-5xl animate-spin">
              progress_activity
            </span>
            <p className="text-gray-300 font-medium mt-4">Initializing weather station...</p>
          </div>
        )}
      </div>

      {/* Mobile Floating Glass Bottom Navigation Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex justify-around items-center h-16 px-6 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full w-[92%] max-w-md shadow-2xl md:hidden">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center justify-center text-emerald-400"
        >
          <span className="material-symbols-outlined text-xl icon-fill">home</span>
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        <button
          onClick={() => {
            const mapEl = document.querySelector(".leaflet-container");
            mapEl?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center justify-center text-gray-400 hover:text-white"
        >
          <span className="material-symbols-outlined text-xl">map</span>
          <span className="text-[10px] font-medium mt-0.5">Map</span>
        </button>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex flex-col items-center justify-center text-purple-400"
        >
          <span className="material-symbols-outlined text-xl icon-fill">auto_awesome</span>
          <span className="text-[10px] font-medium mt-0.5">AI Brief</span>
        </button>

        <button
          onClick={() => setIsFavoritesOpen(true)}
          className="flex flex-col items-center justify-center text-amber-300"
        >
          <span className="material-symbols-outlined text-xl">star</span>
          <span className="text-[10px] font-medium mt-0.5">Saved</span>
        </button>
      </nav>

      {/* Saved Cities Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectCity={handleSelectCity}
        onRemoveFavorite={handleRemoveFavorite}
      />

      {/* Gemini AI Insights Modal */}
      {weatherData && (
        <AiModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          weatherData={weatherData}
        />
      )}
    </div>
  );
}
