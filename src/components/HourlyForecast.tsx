import React from "react";
import { HourlyForecastItem, UnitSystem } from "../types";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const formatTemp = (c: number) =>
    unit === "imperial" ? Math.round((c * 9) / 5 + 32) : Math.round(c);

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#e2e2e2]">Hourly Forecast</h3>
        <span className="material-symbols-outlined text-gray-400 text-lg">schedule</span>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between min-w-[84px] h-36 p-3.5 rounded-2xl transition-all ${
                isNow
                  ? "glass-panel-inner border-emerald-400/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/5 scale-105"
                  : "hover:bg-white/5 border border-white/5"
              }`}
            >
              <span className={`text-xs font-medium ${isNow ? "text-emerald-300 font-bold" : "text-gray-400"}`}>
                {item.time}
              </span>

              <span
                className={`material-symbols-outlined text-2xl ${
                  item.icon.includes("rain") || item.icon.includes("thunder")
                    ? "text-cyan-400"
                    : "text-amber-300"
                }`}
                title={item.label}
              >
                {item.icon}
              </span>

              {item.pop > 0 && (
                <span className="text-[10px] text-cyan-300 font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">water_drop</span>
                  {item.pop}%
                </span>
              )}

              <span className="text-lg font-semibold text-[#e2e2e2]">
                {formatTemp(item.temp)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
