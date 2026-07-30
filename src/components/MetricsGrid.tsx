import React from "react";
import { WeatherData, UnitSystem } from "../types";

interface MetricsGridProps {
  data: WeatherData;
  unit: UnitSystem;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data, unit }) => {
  const { astronomy, uvIndex, visibility } = data;

  const visibilityDisplay =
    unit === "imperial"
      ? `${Math.round(visibility.valueKm * 0.621371)} mi`
      : `${visibility.valueKm} km`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Sunrise / Sunset */}
      <div className="glass-panel col-span-1 sm:col-span-2 p-5 flex items-center justify-around">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-amber-300 text-3xl">
            wb_twilight
          </span>
          <div>
            <div className="text-xs text-gray-400 font-medium">Sunrise</div>
            <div className="text-lg font-semibold text-[#e2e2e2]">{astronomy.sunrise}</div>
          </div>
        </div>

        <div className="w-px h-10 bg-white/10" />

        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-purple-400 text-3xl">
            wb_twilight
          </span>
          <div>
            <div className="text-xs text-gray-400 font-medium">Sunset</div>
            <div className="text-lg font-semibold text-[#e2e2e2]">{astronomy.sunset}</div>
          </div>
        </div>
      </div>

      {/* UV Index */}
      <div className="glass-panel p-5 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2">
          <span className="material-symbols-outlined text-amber-300 text-base">
            light_mode
          </span>
          UV Index
        </div>
        <div className="text-3xl font-bold text-[#e2e2e2] leading-none">{uvIndex.value}</div>
        <div className="text-sm font-semibold text-amber-300 mt-1.5">{uvIndex.label}</div>
      </div>

      {/* Visibility */}
      <div className="glass-panel p-5 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2">
          <span className="material-symbols-outlined text-emerald-400 text-base">
            visibility
          </span>
          Visibility
        </div>
        <div className="text-3xl font-bold text-[#e2e2e2] leading-none">
          {visibilityDisplay.split(" ")[0]}{" "}
          <span className="text-base font-normal text-gray-400">
            {visibilityDisplay.split(" ")[1]}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1.5 font-medium">
          {visibility.valueKm >= 10 ? "Clear atmosphere" : "Reduced visibility"}
        </div>
      </div>
    </div>
  );
};
