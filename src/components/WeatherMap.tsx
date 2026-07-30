import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { WeatherData, UnitSystem, MapLayer } from "../types";

interface WeatherMapProps {
  data: WeatherData;
  unit: UnitSystem;
}

const TILE_LAYERS: Record<MapLayer, { url: string; attribution: string }> = {
  radar: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  temperature: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  wind: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  clouds: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

export const WeatherMap: React.FC<WeatherMapProps> = ({ data, unit }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayer>("radar");
  const [showLayersMenu, setShowLayersMenu] = useState<boolean>(false);

  const displayTemp =
    unit === "imperial" ? Math.round((data.current.temp * 9) / 5 + 32) : data.current.temp;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [data.latitude, data.longitude],
      zoom: 11,
      zoomControl: false, // We render custom zoom buttons
      attributionControl: true,
    });

    const tileInfo = TILE_LAYERS.radar;
    const tileLayer = L.tileLayer(tileInfo.url, {
      maxZoom: 19,
      attribution: tileInfo.attribution,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map layer tiles
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const layerConfig = TILE_LAYERS[activeLayer];
    tileLayerRef.current.setUrl(layerConfig.url);
  }, [activeLayer]);

  // Update map position & marker when location changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { latitude, longitude, location, current } = data;

    // Smooth animated flyTo
    map.flyTo([latitude, longitude], 12, {
      duration: 1.5,
      easeLinearity: 0.25,
    });

    // Custom HTML marker badge
    const customIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="flex flex-col items-center cursor-pointer group">
          <div class="glass-panel-inner px-3 py-1.5 flex items-center gap-1.5 shadow-2xl backdrop-blur-xl bg-black/80 border border-emerald-400/40 text-white rounded-2xl whitespace-nowrap group-hover:scale-105 transition-transform">
            <span class="material-symbols-outlined text-amber-300 text-sm">${current.icon}</span>
            <span class="font-bold text-xs">${displayTemp}°${unit === "metric" ? "C" : "F"}</span>
          </div>
          <div class="w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-[0_0_15px_rgba(52,211,153,0.9)] animate-pulse -mt-1"></div>
        </div>
      `,
      iconSize: [80, 50],
      iconAnchor: [40, 45],
    });

    // Popup Content
    const popupContent = `
      <div class="p-2 text-center">
        <div class="font-bold text-sm text-[#e2e2e2]">${location}</div>
        <div class="text-xs text-emerald-400 font-semibold mt-0.5">${current.condition}</div>
        <div class="text-base font-extrabold text-amber-300 mt-1">${displayTemp}°${unit === "metric" ? "C" : "F"}</div>
      </div>
    `;

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      markerRef.current.setIcon(customIcon);
      markerRef.current.setPopupContent(popupContent);
    } else {
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
      marker.bindPopup(popupContent);
      markerRef.current = marker;
    }
  }, [data, displayTemp, unit]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([data.latitude, data.longitude], 12);
    }
  };

  const getLayerLabel = () => {
    switch (activeLayer) {
      case "radar":
        return "Dark Radar Map";
      case "temperature":
        return "Thermal Voyager";
      case "wind":
        return "Topographic";
      case "clouds":
        return "Satellite View";
    }
  };

  return (
    <div className="glass-panel relative overflow-hidden h-[420px] w-full group select-none flex flex-col">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Badge Top Left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="glass-panel-inner px-3 py-1.5 flex items-center gap-2 backdrop-blur-xl bg-black/60 border-emerald-400/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-[#e2e2e2] tracking-wide">
            {getLayerLabel()}
          </span>
        </div>
      </div>

      {/* Map Control Buttons Top Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2.5">
        {/* Layer Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            className={`glass-button w-9 h-9 flex items-center justify-center text-[#e2e2e2] transition-colors ${
              showLayersMenu ? "bg-emerald-500/30 text-emerald-300" : ""
            }`}
            title="Toggle Map Style"
          >
            <span className="material-symbols-outlined text-lg">layers</span>
          </button>

          {showLayersMenu && (
            <div className="absolute right-11 top-0 w-40 glass-panel p-1.5 flex flex-col gap-1 z-30 shadow-2xl backdrop-blur-2xl bg-black/90 border-emerald-500/20">
              <button
                onClick={() => {
                  setActiveLayer("radar");
                  setShowLayersMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                  activeLayer === "radar"
                    ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-sm">dark_mode</span>
                Dark Radar
              </button>
              <button
                onClick={() => {
                  setActiveLayer("temperature");
                  setShowLayersMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                  activeLayer === "temperature"
                    ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-sm">map</span>
                Voyager
              </button>
              <button
                onClick={() => {
                  setActiveLayer("wind");
                  setShowLayersMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                  activeLayer === "wind"
                    ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-sm">terrain</span>
                Topographic
              </button>
              <button
                onClick={() => {
                  setActiveLayer("clouds");
                  setShowLayersMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                  activeLayer === "clouds"
                    ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-sm">public</span>
                Standard
              </button>
            </div>
          )}
        </div>

        {/* Center / Recenter Location Button */}
        <button
          onClick={handleRecenter}
          className="glass-button w-9 h-9 flex items-center justify-center text-[#e2e2e2] hover:text-emerald-300 transition-colors"
          title="Center on searched location"
        >
          <span className="material-symbols-outlined text-lg">my_location</span>
        </button>

        {/* Zoom In/Out Block */}
        <div className="glass-button flex flex-col overflow-hidden !rounded-xl">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 flex items-center justify-center border-b border-white/20 hover:bg-white/10 text-[#e2e2e2]"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 text-[#e2e2e2]"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
        </div>
      </div>

      {/* Location Label Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <span className="text-sm font-bold text-[#e2e2e2] text-glow tracking-tight bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
          📍 {data.location}
        </span>
      </div>
    </div>
  );
};
