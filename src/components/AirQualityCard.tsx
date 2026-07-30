import React from "react";
import { WeatherData } from "../types";

interface AirQualityCardProps {
  airQuality: WeatherData["airQuality"];
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  const { aqi, label, pm2_5, pm10, o3, no2 } = airQuality;

  return (
    <div className="glass-panel p-6 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2 z-10 relative">
        <div>
          <h3 className="text-lg font-semibold text-[#e2e2e2]">Air Quality Index</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Real-time air pollution levels</p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10"
          style={{ backgroundColor: `${airQuality.color}20`, color: airQuality.color }}
        >
          AQI {aqi}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-4 gap-4 z-10 relative">
        <div>
          <div className="text-5xl sm:text-6xl font-light leading-none text-glow text-[#e2e2e2]">
            {aqi}
          </div>
          <div className="text-base font-semibold mt-2" style={{ color: airQuality.color }}>
            {label}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {aqi <= 50
              ? "Air quality is satisfactory and poses little or no risk."
              : aqi <= 100
              ? "Air quality is acceptable for most people."
              : "Sensitive individuals may experience minor health effects."}
          </div>
        </div>

        {/* Abstract Wave SVG Graphic */}
        <div className="w-full md:w-1/2 h-16 relative">
          <svg className="w-full h-full fill-none" viewBox="0 0 200 50">
            <path
              className="opacity-30 stroke-emerald-400"
              strokeWidth="2"
              d="M0,25 Q25,5 50,25 T100,25 T150,25 T200,10"
            />
            <path
              className="stroke-emerald-400 animate-[pulse_3s_infinite]"
              strokeWidth="3"
              d="M0,25 Q25,15 50,25 T100,25 T150,25 T180,20"
            />
            <circle className="fill-emerald-400" cx="180" cy="20" r="4" />
          </svg>
        </div>
      </div>

      {/* Pollutant Breakdown Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-4 border-t border-white/10 z-10 relative">
        <div className="glass-panel-inner p-2.5 flex flex-col items-center">
          <span className="text-[11px] text-gray-400 font-medium">PM2.5</span>
          <span className="text-sm font-bold text-[#e2e2e2] mt-0.5">{pm2_5} μg/m³</span>
        </div>
        <div className="glass-panel-inner p-2.5 flex flex-col items-center">
          <span className="text-[11px] text-gray-400 font-medium">PM10</span>
          <span className="text-sm font-bold text-[#e2e2e2] mt-0.5">{pm10} μg/m³</span>
        </div>
        <div className="glass-panel-inner p-2.5 flex flex-col items-center">
          <span className="text-[11px] text-gray-400 font-medium">Ozone (O₃)</span>
          <span className="text-sm font-bold text-[#e2e2e2] mt-0.5">{o3} μg/m³</span>
        </div>
        <div className="glass-panel-inner p-2.5 flex flex-col items-center">
          <span className="text-[11px] text-gray-400 font-medium">NO₂</span>
          <span className="text-sm font-bold text-[#e2e2e2] mt-0.5">{no2} μg/m³</span>
        </div>
      </div>
    </div>
  );
};
