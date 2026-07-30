import React from "react";
import { SearchResult } from "../types";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: SearchResult[];
  onSelectCity: (city: SearchResult) => void;
  onRemoveFavorite: (cityName: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectCity,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-sm h-full p-6 relative rounded-none rounded-l-3xl border-l border-white/10 flex flex-col justify-between shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-300 text-2xl">star</span>
              <h2 className="text-xl font-bold text-[#e2e2e2]">Saved Locations</h2>
            </div>
            <button
              onClick={onClose}
              className="glass-button w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* List */}
          <div className="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto hide-scrollbar">
            {favorites.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No saved locations yet. Click the star icon to bookmark locations!
              </p>
            ) : (
              favorites.map((city, idx) => (
                <div
                  key={idx}
                  className="glass-panel-inner p-3.5 flex items-center justify-between group hover:border-emerald-400/30 transition-all cursor-pointer"
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-400 text-xl group-hover:scale-110 transition-transform">
                      location_on
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#e2e2e2]">{city.name}</div>
                      <div className="text-xs text-gray-400">{city.country || "Global"}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city.name);
                    }}
                    className="p-1 text-gray-400 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400">
          Luminous Atmos • Dynamic Weather Intelligence
        </div>
      </div>
    </div>
  );
};
