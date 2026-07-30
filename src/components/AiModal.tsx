import React, { useEffect, useState } from "react";
import { WeatherData, AiInsight } from "../types";

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherData;
}

export const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, weatherData }) => {
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !weatherData) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch("/api/weather/ai-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: weatherData.location,
        current: weatherData.current,
        airQuality: weatherData.airQuality,
        uvIndex: weatherData.uvIndex,
      }),
    })
      .then((res) => res.json())
      .then((data: AiInsight) => {
        if (isMounted) {
          setInsight(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("AI Insight fetch error:", err);
          setError("Unable to generate AI weather insights.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, weatherData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 relative shadow-2xl border border-purple-400/30 max-h-[90vh] overflow-y-auto hide-scrollbar bg-black/60">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-purple-400 text-2xl icon-fill animate-pulse">
              auto_awesome
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#e2e2e2]">Gemini AI Weather Insights</h2>
              <p className="text-xs text-purple-300 font-medium">Smart lifestyle & atmospheric brief</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="glass-button w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="material-symbols-outlined text-purple-400 text-4xl animate-spin">
              progress_activity
            </span>
            <p className="text-sm text-gray-300 font-medium animate-pulse">
              Analyzing atmospheric data for {weatherData.location}...
            </p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-rose-400 font-medium">
            {error}
          </div>
        ) : insight ? (
          <div className="flex flex-col gap-6 mt-6">
            {/* Daily Brief */}
            <div className="glass-panel-inner p-4 border-purple-400/20 bg-purple-500/10">
              <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                Atmospheric Vibe
              </div>
              <p className="text-sm text-[#e2e2e2] leading-relaxed">{insight.summary}</p>
            </div>

            {/* What to Wear */}
            <div className="flex items-start gap-3 glass-panel-inner p-4">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">checkroom</span>
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Outfit Advisory
                </div>
                <p className="text-sm text-[#e2e2e2] mt-0.5">{insight.outfit}</p>
              </div>
            </div>

            {/* Activities Ratings */}
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Recommended Activities
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insight.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="glass-panel-inner p-3 flex flex-col justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#e2e2e2]">{act.name}</span>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {act.score} ({act.rating}/10)
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Alert */}
            {insight.healthAlert && (
              <div className="flex items-start gap-3 glass-panel-inner p-4 border-amber-500/20 bg-amber-500/5">
                <span className="material-symbols-outlined text-amber-300 text-2xl">health_and_safety</span>
                <div>
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                    Health Precaution
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5">{insight.healthAlert}</p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
