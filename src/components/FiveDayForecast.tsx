import React from "react";
import { DailyForecastItem, UnitSystem } from "../types";

interface FiveDayForecastProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
}

export const FiveDayForecast: React.FC<FiveDayForecastProps> = ({ daily, unit }) => {
  // Convert temperature helper
  const formatTemp = (c: number) =>
    unit === "imperial" ? Math.round((c * 9) / 5 + 32) : Math.round(c);

  // Determine scale range for bars
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const minRange = Math.min(...allMins, 10);
  const maxRange = Math.max(...allMaxs, 30);
  const totalSpan = Math.max(1, maxRange - minRange);

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#e2e2e2]">5-Day Forecast</h3>
        <span className="material-symbols-outlined text-gray-400 text-lg">calendar_month</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {daily.slice(0, 5).map((item, idx) => {
          const minFormatted = formatTemp(item.minTemp);
          const maxFormatted = formatTemp(item.maxTemp);

          // Calculate left and width percentages for gradient temp bar
          const leftPct = Math.max(0, Math.min(80, ((item.minTemp - minRange) / totalSpan) * 100));
          const widthPct = Math.max(20, Math.min(100 - leftPct, ((item.maxTemp - item.minTemp) / totalSpan) * 100));

          return (
            <div
              key={idx}
              className="flex items-center justify-between glass-panel-inner px-4 py-3 hover:bg-white/5 transition-colors"
            >
              {/* Day Name */}
              <span className="w-10 font-semibold text-sm text-[#e2e2e2]">{item.day}</span>

              {/* Icon */}
              <span className="material-symbols-outlined text-amber-300 text-xl" title={item.label}>
                {item.icon}
              </span>

              {/* Min Temp */}
              <span className="w-8 text-right text-sm text-gray-300 font-medium opacity-80">
                {minFormatted}°
              </span>

              {/* Temperature Range Bar */}
              <div className="w-20 sm:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden relative mx-2">
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-500 rounded-full"
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                  }}
                />
              </div>

              {/* Max Temp */}
              <span className="w-8 text-right text-sm text-[#e2e2e2] font-semibold">
                {maxFormatted}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
