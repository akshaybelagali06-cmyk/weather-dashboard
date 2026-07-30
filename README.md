# 🌤️ Luminous Atmos Weather Dashboard

A modern, high-performance, and feature-rich weather dashboard web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express**, **Open-Meteo API**, **Leaflet Maps**, and **Google Gemini AI**.

---

## 🌟 Highlights & Features

- 🌡️ **Real-Time Weather Metrics**: Accurate readings for temperature, feels-like temperature, humidity, wind speed & direction, atmospheric pressure, cloud cover, and UV index.
- 🍃 **Air Quality Index (AQI)**: Live air quality monitoring with breakdown metrics for PM2.5, PM10, O3, and NO2, accompanied by safety status badges.
- 🤖 **AI-Powered Insights (Gemini 3.6 Flash)**: Real-time AI meteorological analysis providing customized daily summaries, outfit recommendations, activity compatibility scores (running, cycling, outdoor dining, stargazing), and personalized health precautions.
- 🗺️ **Interactive Radar & Layer Maps**: Built-in Leaflet map with dynamic layer toggles for Radar, Temperature, Wind, and Cloud cover.
- 📅 **Hourly & 7-Day Forecasts**: 12-hour hourly forecast timeline and 7-day extended forecasts with high/low temperature metrics and precipitation probabilities (% POP).
- 📍 **Geolocation & Smart Search**: Auto-location detection via Browser Geolocation API, paired with a debounced search bar supporting global city geocoding and search history.
- ⭐️ **Favorites Drawer & Persistence**: Save and manage favorite locations with seamless `localStorage` persistence.
- 🔄 **Dynamic Units**: Instant toggle between Metric (°C, km/h) and Imperial (°F, mph) unit systems.
- 🎨 **Modern Aesthetics**: Sleek dark mode design with glassmorphism UI components, dynamic gradient cards, responsive grid layouts, and toast notifications.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapping**: [Leaflet.js](https://leafletjs.com/) (`leaflet` & `@types/leaflet`)

### **Backend & APIs**
- **Server**: [Express.js](https://expressjs.com/) with `tsx` (Dev) and `esbuild` (Prod)
- **AI SDK**: [`@google/genai`](https://www.npmjs.com/package/@google/genai) using the `gemini-3.6-flash` model
- **Weather Services**: 
  - [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
  - [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)

---

## 📁 Directory Structure

```text
weather-dashboard/
├── server.ts              # Express backend server with Gemini AI & Open-Meteo proxy endpoints
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Main application component & layout
│   ├── index.css          # Tailwind CSS configuration & global styles
│   ├── types.ts           # TypeScript type definitions & interfaces
│   ├── hooks/
│   │   └── useWeather.ts  # Custom hook for fetching and managing weather state
│   └── components/
│       ├── Header.tsx             # Navigation header, search bar & quick controls
│       ├── CurrentWeatherCard.tsx # Main current weather display
│       ├── WeatherMap.tsx         # Interactive Leaflet weather map
│       ├── FiveDayForecast.tsx    # Extended multi-day weather forecast
│       ├── HourlyForecast.tsx     # 12-hour forecast strip
│       ├── MetricsGrid.tsx        # Secondary weather parameters (UV, Pressure, Sunrise/Sunset)
│       ├── AirQualityCard.tsx     # AQI meter & pollutant breakdown card
│       ├── FavoritesDrawer.tsx    # Slide-over panel for saved favorite locations
│       └── AiModal.tsx            # Modal window presenting Gemini AI weather insights
├── dist/                  # Compiled production build output
├── public/ & assets/      # Static assets & icons
├── package.json           # Project dependencies & scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite bundler configuration
```

---

## 🚀 Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### **1. Clone the repository & Install dependencies**

```bash
git clone <repository-url>
cd weather-dashboard
npm install
```

### **2. Environment Setup**

Create a `.env` or `.env.local` file in the project root directory (you can copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Google Gemini API key:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

> **Note:** If `GEMINI_API_KEY` is not provided, the app will gracefully fall back to local rule-based weather summaries for AI insights without breaking the application.

---

## 📜 Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Launches the Express backend server with Vite middleware in development mode at `http://localhost:3000`.
- **`npm run build`**: Builds the React frontend with Vite and bundles the Express server using `esbuild` into `dist/`.
- **`npm run start`**: Runs the built production server from `dist/server.cjs`.
- **`npm run lint`**: Runs TypeScript type checking (`tsc --noEmit`).
- **`npm run clean`**: Cleans the `dist` directory and built server files.

---

## 🔌 API Endpoints Summary

The Express server (`server.ts`) exposes the following endpoints:

- `GET /api/weather/search?q=:cityName` - Queries Open-Meteo Geocoding API for city search results.
- `GET /api/weather/data?lat=:lat&lon=:lon&name=:name` - Fetches forecast, hourly, daily, astronomy, UV index, and AQI data.
- `POST /api/weather/ai-insights` - Calls Google Gemini AI to analyze atmospheric metrics and output structured lifestyle recommendations in JSON.

---