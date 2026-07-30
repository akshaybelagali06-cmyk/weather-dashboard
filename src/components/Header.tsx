import React, { useState, useEffect, useRef } from "react";
import { SearchResult, UnitSystem } from "../types";

interface HeaderProps {
  currentLocation: string;
  unit: UnitSystem;
  onToggleUnit: () => void;
  onSelectCity: (city: SearchResult) => void;
  onUseGeolocation: () => void;
  onOpenAiModal: () => void;
  onOpenFavorites: () => void;
  isLoading: boolean;
  recentSearches: SearchResult[];
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  unit,
  onToggleUnit,
  onSelectCity,
  onUseGeolocation,
  onOpenAiModal,
  onOpenFavorites,
  isLoading,
  recentSearches,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    setSearchError(null);
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data: SearchResult[] = await res.json();
          setResults(data);
          setShowDropdown(true);
          if (data.length === 0) {
            setSearchError("City not found");
          }
        } else {
          setSearchError("City not found");
        }
      } catch (err) {
        console.error("Search error:", err);
        setSearchError("Network error. Try again.");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Execute direct search by input text (on Enter or Click Search Icon)
  const handleExecuteSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // If autocomplete result is already available, pick top match
    if (results.length > 0) {
      onSelectCity(results[0]);
      setShowDropdown(false);
      setQuery("");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/weather/search?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data: SearchResult[] = await res.json();
        if (data && data.length > 0) {
          onSelectCity(data[0]);
          setShowDropdown(false);
          setQuery("");
        } else {
          setSearchError("City not found");
          setShowDropdown(true);
        }
      } else {
        setSearchError("City not found");
        setShowDropdown(true);
      }
    } catch (err) {
      setSearchError("City not found");
      setShowDropdown(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full bg-transparent py-4 px-2 gap-4 relative z-40">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-bold text-[#e2e2e2] text-glow tracking-tight">
            Weather Dashboard
          </h1>
          {isLoading && (
            <span
              className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"
              title="Updating weather data..."
            />
          )}
        </div>
        <span className="text-xs md:text-sm text-gray-400 font-normal">
          Real-time global weather & atmospheric intelligence
        </span>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Apple-style Glassmorphism Search Bar */}
        <div className="relative flex-1 md:flex-initial md:w-80" ref={dropdownRef}>
          <div className="relative flex items-center">
            {/* Left Magnifying Glass Icon (Clickable to trigger search) */}
            <button
              onClick={handleExecuteSearch}
              type="button"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors z-10 flex items-center justify-center"
              title="Search Location"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>

            {/* Apple-style Rounded Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleExecuteSearch();
                }
              }}
              placeholder="Search city..."
              className="glass-input rounded-full py-2.5 pl-10 pr-10 text-sm text-[#e2e2e2] w-full focus:outline-none placeholder:text-gray-400/70"
            />

            {/* Loading Spinner or Clear Button (×) */}
            {isSearching ? (
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 animate-spin text-lg pointer-events-none">
                progress_activity
              </span>
            ) : query ? (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setSearchError(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors w-5 h-5 flex items-center justify-center rounded-full bg-white/10 text-xs font-bold"
                title="Clear Search"
              >
                ✕
              </button>
            ) : null}
          </div>

          {/* Search Dropdown / Autocomplete / Recent Searches */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-panel p-2 z-50 max-h-72 overflow-y-auto hide-scrollbar shadow-2xl border border-emerald-500/20 backdrop-blur-2xl bg-black/80">
              {searchError ? (
                <div className="p-3 text-center text-xs text-rose-400 font-medium flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{searchError}</span>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {results.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectCity(item);
                        setQuery("");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-[#e2e2e2] hover:bg-emerald-500/20 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400 text-base group-hover:scale-110 transition-transform">
                          location_on
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {item.admin1 ? `${item.admin1}, ` : ""}{item.country || ""}
                      </span>
                    </button>
                  ))}
                </div>
              ) : !query.trim() && recentSearches.length > 0 ? (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">history</span>
                    Recent Searches
                  </div>
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectCity(item);
                        setQuery("");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-white/10 flex items-center justify-between transition-colors"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-[10px] text-gray-400">{item.country}</span>
                    </button>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-3 text-center text-xs text-gray-400">
                  Press Enter to search "{query}"
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-gray-400">
                  Type a city name to search...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Unit Toggle °C / °F */}
          <button
            onClick={onToggleUnit}
            className="glass-button w-10 h-10 flex items-center justify-center font-semibold text-xs text-[#e2e2e2] hover:text-emerald-300 transition-colors"
            title="Toggle Temperature Unit (°C / °F)"
          >
            {unit === "metric" ? "°C" : "°F"}
          </button>

          {/* Geolocation Button */}
          <button
            onClick={onUseGeolocation}
            className="glass-button w-10 h-10 flex items-center justify-center text-[#e2e2e2] hover:text-emerald-300 transition-all active:scale-95"
            title="Use Current GPS Location"
          >
            <span className="material-symbols-outlined text-lg">my_location</span>
          </button>

          {/* AI Weather Insights Button */}
          <button
            onClick={onOpenAiModal}
            className="glass-button px-3 h-10 flex items-center gap-1.5 text-[#e2e2e2] hover:text-purple-300 bg-purple-500/10 border-purple-400/30 transition-all active:scale-95"
            title="Gemini AI Weather Insights"
          >
            <span className="material-symbols-outlined text-purple-300 text-lg icon-fill animate-pulse">
              auto_awesome
            </span>
            <span className="hidden sm:inline text-xs font-semibold tracking-wide">AI Brief</span>
          </button>

          {/* Favorites List Button */}
          <button
            onClick={onOpenFavorites}
            className="glass-button w-10 h-10 flex items-center justify-center text-[#e2e2e2] hover:text-amber-300 transition-all active:scale-95"
            title="Saved Locations"
          >
            <span className="material-symbols-outlined text-lg">star</span>
          </button>
        </div>
      </div>
    </header>
  );
};
