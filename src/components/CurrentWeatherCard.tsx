import React from "react";
import { WeatherData, UnitSystem } from "../types";

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const { location, dateFormatted, current } = data;

  const displayTemp = unit === "imperial" ? Math.round((current.temp * 9) / 5 + 32) : current.temp;
  const displayFeelsLike =
    unit === "imperial" ? Math.round((current.feelsLike * 9) / 5 + 32) : current.feelsLike;
  const displayWind =
    unit === "imperial"
      ? `${Math.round(current.windSpeed * 0.621371)} mph`
      : `${current.windSpeed} km/h`;

  // Render glowing glass weather orb graphic
  const renderWeatherGraphic = () => {
    const isCloudy = current.condition.toLowerCase().includes("cloud");
    const isRainy = current.condition.toLowerCase().includes("rain") || current.condition.toLowerCase().includes("drizzle");
    const isSnowy = current.condition.toLowerCase().includes("snow");

    return (
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        {/* Glow orb */}
        <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl opacity-80 animate-pulse" />
        
        {/* Sun sphere */}
        <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-yellow-500 to-amber-300 rounded-full shadow-[0_0_35px_rgba(251,191,36,0.8)]" />

        {/* Cloud overlay if partly cloudy, cloudy, or rainy */}
        {(isCloudy || isRainy || isSnowy) && (
          <div className="absolute bottom-1 left-[-15%] w-[130%] h-[55%] bg-white/75 rounded-full blur-[1px] backdrop-blur-xl border border-white/50 shadow-lg flex items-center justify-center">
            {isRainy && (
              <div className="absolute -bottom-3 flex gap-1.5 opacity-90">
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1 h-3 bg-cyan-300 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            )}
            {isSnowy && (
              <div className="absolute -bottom-3 flex gap-1.5 text-cyan-200 text-xs animate-pulse">
                <span>❄</span>
                <span>❄</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 sm:p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
      {/* Background soft sheen */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-700" />

      {/* Header Info */}
      <div className="flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-2 text-2xl font-semibold text-[#e2e2e2]">
            <span className="material-symbols-outlined icon-fill text-emerald-400 text-2xl">
              location_on
            </span>
            <span>{location}</span>
          </div>
          <div className="text-sm sm:text-base text-gray-400 font-normal mt-1">
            {dateFormatted}
          </div>
        </div>
      </div>

      {/* Main Temperature & Graphic */}
      <div className="flex items-center justify-between mt-6 sm:mt-8 z-10">
        <div className="flex flex-col">
          <span className="text-6xl sm:text-7xl font-extralight text-[#e2e2e2] text-glow leading-none tracking-tight">
            {displayTemp}°
          </span>
          <span className="text-xl sm:text-2xl font-semibold mt-3 text-[#e2e2e2]">
            {current.label}
          </span>
          <span className="text-sm sm:text-base text-gray-400 font-medium">
            Feels like {displayFeelsLike}°
          </span>
        </div>

        {renderWeatherGraphic()}
      </div>

      {/* Footer Metrics Bar */}
      <div className="flex justify-between items-center mt-10 pt-5 border-t border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-2xl">
            water_drop
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Humidity</span>
            <span className="text-sm sm:text-base font-semibold text-[#e2e2e2]">
              {current.humidity}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-2xl">
            air
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Wind</span>
            <span className="text-sm sm:text-base font-semibold text-[#e2e2e2]">
              {displayWind}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-2xl">
            speed
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Pressure</span>
            <span className="text-sm sm:text-base font-semibold text-[#e2e2e2]">
              {current.pressure} hPa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
