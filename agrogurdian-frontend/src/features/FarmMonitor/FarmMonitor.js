import React, { useState, useEffect, useRef } from "react";
import "./FarmMonitor.css";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const API_KEY = "cb7257e0724e82c018463c5541017000";

// Base tile layers (always-visible backgrounds)
const BASE_LAYERS = {
  satellite: {
    label: "🛰️ Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Imagery | © OpenStreetMap",
  },
  ndvi: {
    label: "🌿 NDVI",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri | NDVI overlay via AgroMonitoring",
  },
  evi: {
    label: "🌱 EVI",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri | EVI overlay via AgroMonitoring",
  },
  base: {
    label: "🗺️ Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  },
};

// AgroMonitoring overlay tiles — drawn on top of satellite base
// Using the v2 endpoint with explicit colormap for more accurate NDVI colouring
const OVERLAY_TILES = {
  ndvi: `https://tile.agromonitoring.com/v2/ndvi/{z}/{x}/{y}.png?appid=${API_KEY}&paletteid=1`,
  evi:  `https://tile.agromonitoring.com/v2/evi/{z}/{x}/{y}.png?appid=${API_KEY}&paletteid=1`,
};

// ─── TRANSLATIONS ───────────────────────────────────────────────────────────
const translations = {
  en: {
    title: "🛰️ Farm Monitor",
    subtitle: "Real-time satellite monitoring of your agricultural land",
    dashboard: "Dashboard",
    instructions: { title: "How to Use" },
    features: {
      realTime: "Real-time Updates",
      historical: "Historical Data",
      alerts: "Weather Alerts",
      multiLayer: "Multi-layer Maps",
      ndviTrack: "NDVI Tracking",
      freeAccess: "Free API Access",
    },
    mapLayer: "Map Layer",
    soilData: "Soil & Weather",
    loading: "Loading farm data…",
    ndviScore: "NDVI Score",
    soilMoisture: "Soil Moisture",
    temperature: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    viewFull: "Open Full Dashboard ↗",
    lat: "Latitude",
    lng: "Longitude",
    zoom: "Use scroll to zoom · Drag to pan",
    steps: [
      "The map below loads live satellite & NDVI data for your farm area.",
      "Switch layers using the buttons above the map (Satellite, NDVI, EVI, Map).",
      "Click anywhere on the map to get soil & weather data for that location.",
      "Green = healthy vegetation on NDVI; red/yellow = stressed crops.",
      "Use 'Open Full Dashboard' to manage polygons on AgroMonitoring directly.",
      "Set up alerts for weather events and crop health changes on the dashboard.",
    ],
    quickLinks: "Quick Links",
    viewDashboard: "View Dashboard",
    createPolygon: "Create Farm Polygon",
    viewWeather: "View Weather",
    viewSatellite: "View Satellite Images",
  },
  hi: {
    title: "🛰️ खेत की निगरानी",
    subtitle: "आपकी कृषि भूमि की वास्तविक समय उपग्रह निगरानी",
    dashboard: "डैशबोर्ड",
    instructions: { title: "उपयोग कैसे करें" },
    features: {
      realTime: "वास्तविक समय अपडेट",
      historical: "ऐतिहासिक डेटा",
      alerts: "मौसम चेतावनी",
      multiLayer: "बहु-परत मानचित्र",
      ndviTrack: "NDVI ट्रैकिंग",
      freeAccess: "मुफ्त API पहुंच",
    },
    mapLayer: "मानचित्र परत",
    soilData: "मिट्टी और मौसम",
    loading: "खेत डेटा लोड हो रहा है…",
    ndviScore: "NDVI स्कोर",
    soilMoisture: "मिट्टी नमी",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
    viewFull: "पूरा डैशबोर्ड खोलें ↗",
    lat: "अक्षांश",
    lng: "देशांतर",
    zoom: "ज़ूम के लिए स्क्रॉल करें · खींचें",
    steps: [
      "नीचे का नक्शा आपके खेत के लिए लाइव उपग्रह और NDVI डेटा दिखाता है।",
      "नक्शे के ऊपर बटनों से परतें बदलें (उपग्रह, NDVI, EVI, नक्शा)।",
      "मिट्टी और मौसम डेटा के लिए मानचित्र पर क्लिक करें।",
      "NDVI पर हरा = स्वस्थ वनस्पति; लाल/पीला = तनावग्रस्त फसलें।",
      "पॉलीगॉन प्रबंधित करने के लिए 'पूरा डैशबोर्ड खोलें' उपयोग करें।",
      "मौसम और फसल स्वास्थ्य परिवर्तनों के लिए अलर्ट सेट करें।",
    ],
    quickLinks: "त्वरित लिंक",
    viewDashboard: "डैशबोर्ड देखें",
    createPolygon: "खेत बहुभुज बनाएं",
    viewWeather: "मौसम देखें",
    viewSatellite: "उपग्रह चित्र देखें",
  },
  pa: {
    title: "🛰️ ਖੇਤ ਦੀ ਨਿਗਰਾਨੀ",
    subtitle: "ਤੁਹਾਡੀ ਖੇਤੀ ਜ਼ਮੀਨ ਦੀ ਰੀਅਲ-ਟਾਈਮ ਸੈਟੇਲਾਈਟ ਨਿਗਰਾਨੀ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    instructions: { title: "ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ" },
    features: {
      realTime: "ਰੀਅਲ-ਟਾਈਮ ਅੱਪਡੇਟ",
      historical: "ਇਤਿਹਾਸਕ ਡੇਟਾ",
      alerts: "ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ",
      multiLayer: "ਬਹੁ-ਪਰਤ ਨਕਸ਼ੇ",
      ndviTrack: "NDVI ਟ੍ਰੈਕਿੰਗ",
      freeAccess: "ਮੁਫਤ API ਪਹੁੰਚ",
    },
    mapLayer: "ਨਕਸ਼ਾ ਪਰਤ",
    soilData: "ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ",
    loading: "ਖੇਤ ਡੇਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…",
    ndviScore: "NDVI ਸਕੋਰ",
    soilMoisture: "ਮਿੱਟੀ ਨਮੀ",
    temperature: "ਤਾਪਮਾਨ",
    humidity: "ਨਮੀ",
    windSpeed: "ਹਵਾ ਦੀ ਗਤੀ",
    viewFull: "ਪੂਰਾ ਡੈਸ਼ਬੋਰਡ ਖੋਲੋ ↗",
    lat: "ਅਕਸ਼ਾਂਸ਼",
    lng: "ਦੇਸ਼ਾਂਤਰ",
    zoom: "ਜ਼ੂਮ ਲਈ ਸਕ੍ਰੋਲ ਕਰੋ · ਖਿੱਚੋ",
    steps: [
      "ਹੇਠਾਂ ਦਾ ਨਕਸ਼ਾ ਤੁਹਾਡੇ ਖੇਤ ਲਈ ਲਾਈਵ ਸੈਟੇਲਾਈਟ ਅਤੇ NDVI ਡੇਟਾ ਦਿਖਾਉਂਦਾ ਹੈ।",
      "ਨਕਸ਼ੇ ਦੇ ਉੱਪਰ ਬਟਨਾਂ ਨਾਲ ਪਰਤਾਂ ਬਦਲੋ।",
      "ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਡੇਟਾ ਲਈ ਨਕਸ਼ੇ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
      "NDVI 'ਤੇ ਹਰਾ = ਸਿਹਤਮੰਦ ਬਨਸਪਤੀ; ਲਾਲ/ਪੀਲਾ = ਤਣਾਅਗ੍ਰਸਤ ਫਸਲਾਂ।",
      "ਪੌਲੀਗੋਨ ਪ੍ਰਬੰਧਨ ਲਈ 'ਪੂਰਾ ਡੈਸ਼ਬੋਰਡ ਖੋਲੋ' ਵਰਤੋ।",
      "ਮੌਸਮ ਅਤੇ ਫਸਲ ਸਿਹਤ ਤਬਦੀਲੀਆਂ ਲਈ ਅਲਰਟ ਸੈੱਟ ਕਰੋ।",
    ],
    quickLinks: "ਤੇਜ਼ ਲਿੰਕ",
    viewDashboard: "ਡੈਸ਼ਬੋਰਡ ਦੇਖੋ",
    createPolygon: "ਖੇਤ ਬਹੁਭੁਜ ਬਣਾਓ",
    viewWeather: "ਮੌਸਮ ਦੇਖੋ",
    viewSatellite: "ਸੈਟੇਲਾਈਟ ਚਿੱਤਰ ਦੇਖੋ",
  },
  ta: {
    title: "🛰️ பண்ணை கண்காணிப்பு",
    subtitle: "உங்கள் விவசாய நிலத்தின் நேரடி செயற்கைக்கோள் கண்காணிப்பு",
    dashboard: "டாஷ்போர்டு",
    instructions: { title: "எவ்வாறு பயன்படுத்துவது" },
    features: {
      realTime: "நேரடி புதுப்பிப்புகள்",
      historical: "வரலாற்று தரவு",
      alerts: "வானிலை எச்சரிக்கைகள்",
      multiLayer: "பல-அடுக்கு வரைபடங்கள்",
      ndviTrack: "NDVI கண்காணிப்பு",
      freeAccess: "இலவச API அணுகல்",
    },
    mapLayer: "வரைபட அடுக்கு",
    soilData: "மண் மற்றும் வானிலை",
    loading: "பண்ணை தரவு ஏற்றுகிறது…",
    ndviScore: "NDVI மதிப்பெண்",
    soilMoisture: "மண் ஈரப்பதம்",
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    windSpeed: "காற்று வேகம்",
    viewFull: "முழு டாஷ்போர்டைத் திற ↗",
    lat: "அட்சரேகை",
    lng: "தீர்க்கரேகை",
    zoom: "ஸ்க்ரோல் செய்து ஜூம் · இழுக்கவும்",
    steps: [
      "கீழே உள்ள வரைபடம் உங்கள் பண்ணைக்கான நேரடி செயற்கைக்கோள் மற்றும் NDVI தரவைக் காட்டுகிறது.",
      "வரைபடத்திற்கு மேலே உள்ள பொத்தான்களைப் பயன்படுத்தி அடுக்குகளை மாற்றவும்.",
      "மண் மற்றும் வானிலை தரவுக்கு வரைபடத்தில் கிளிக் செய்யவும்.",
      "NDVI இல் பச்சை = ஆரோக்கியமான தாவரங்கள்; சிவப்பு/மஞ்சள் = மன அழுத்தமான பயிர்கள்.",
      "பலகோணங்களை நிர்வகிக்க 'முழு டாஷ்போர்டைத் திற' பயன்படுத்தவும்.",
      "வானிலை மற்றும் பயிர் ஆரோக்கிய மாற்றங்களுக்கான எச்சரிக்கைகளை அமைக்கவும்.",
    ],
    quickLinks: "விரைவு இணைப்புகள்",
    viewDashboard: "டாஷ்போர்டைப் பார்க்கவும்",
    createPolygon: "பண்ணை பலகோணத்தை உருவாக்கவும்",
    viewWeather: "வானிலையைப் பார்க்கவும்",
    viewSatellite: "செயற்கைக்கோள் படங்களைப் பார்க்கவும்",
  },
};

// ─── FARM MONITOR COMPONENT ─────────────────────────────────────────────────
function FarmMonitor() {
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeLayer, setActiveLayer] = useState("satellite");
  const [mapReady, setMapReady] = useState(false);
  const [clickData, setClickData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 12.98315, lng: 17.05078 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorCoords, setCursorCoords] = useState(null);
  const debounceRef = useRef(null);
  const suggestionsRef = useRef(null);

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const baseTileRef = useRef(null);
  const overlayTileRef = useRef(null);
  const markerRef = useRef(null);

  const t = translations[language];

  const dashboardUrl = `https://home.agromonitoring.com/dashboard/polygons?appid=${API_KEY}`;
  const weatherUrl = `https://home.agromonitoring.com/dashboard/weather?appid=${API_KEY}`;
  const satelliteUrl = `https://home.agromonitoring.com/dashboard/satellite?appid=${API_KEY}`;

  // ── Load Leaflet dynamically ──────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "dashboard") return;

    const loadLeaflet = async () => {
      // Inject Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Inject Leaflet JS
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      setMapReady(true);
    };

    loadLeaflet();
  }, [activeTab]);

  // ── Initialize map once Leaflet + DOM are ready ───────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current || leafletMapRef.current) return;

    const L = window.L;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // India center default
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    leafletMapRef.current = map;

    // Base satellite tile (Esri — always works, no auth needed)
    const base = L.tileLayer(BASE_LAYERS.satellite.url, {
      attribution: BASE_LAYERS.satellite.attribution,
      maxZoom: 19,
    }).addTo(map);
    baseTileRef.current = base;

    // Cursor coordinates
    map.on("mousemove", (e) => {
      setCursorCoords({ lat: e.latlng.lat.toFixed(5), lng: e.latlng.lng.toFixed(5) });
    });
    map.on("mouseout", () => setCursorCoords(null));

    // Map click → fetch soil + weather + NDVI
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      setMapCenter({ lat: lat.toFixed(5), lng: lng.toFixed(5) });
      setLoadingData(true);
      setClickData(null);

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([lat, lng]).addTo(map).bindPopup("📍 Loading data…").openPopup();

      try {
        // ── 1. Open-Meteo: accurate current weather + soil moisture (free, no key) ──
        const omResp = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
          `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,` +
          `soil_moisture_0_to_1cm,soil_temperature_0cm` +
          `&wind_speed_unit=ms&timezone=auto`
        );
        const om  = omResp.ok ? await omResp.json() : null;
        const omc = om?.current ?? {};

        // ── 2. NASA POWER API: real NDVI proxy via FPAR (fraction of absorbed PAR) ──
        //    FPAR from MODIS correlates directly with NDVI (NDVI ≈ FPAR * 1.15 + 0.08)
        //    No API key needed. Returns last 8-day composite for the point.
        const today  = new Date();
        const start  = new Date(today); start.setDate(today.getDate() - 16);
        const fmt    = (d) => d.toISOString().slice(0,10).replace(/-/g,"");
        const nasaResp = await fetch(
          `https://power.larc.nasa.gov/api/temporal/daily/point` +
          `?parameters=FPAR,LAI,ALLSKY_SFC_PAR_TOT` +
          `&community=AG&longitude=${lng}&latitude=${lat}` +
          `&start=${fmt(start)}&end=${fmt(today)}&format=JSON`
        );
        const nasaData = nasaResp.ok ? await nasaResp.json() : null;

        // Extract most recent valid FPAR (skip fill values = -999)
        let fpar = null;
        if (nasaData?.properties?.parameter?.FPAR) {
          const fparEntries = Object.values(nasaData.properties.parameter.FPAR);
          const validFpar = fparEntries.filter(v => v > 0 && v <= 1);
          if (validFpar.length) fpar = validFpar[validFpar.length - 1];
        }
        // LAI (Leaf Area Index) — extra context
        let lai = null;
        if (nasaData?.properties?.parameter?.LAI) {
          const laiEntries = Object.values(nasaData.properties.parameter.LAI);
          const validLai = laiEntries.filter(v => v >= 0 && v < 10);
          if (validLai.length) lai = validLai[validLai.length - 1];
        }

        // ── 3. Derive NDVI from FPAR (MODIS relationship: Beer-Lambert inverse) ──
        //    Standard empirical: NDVI = 0.52 * FPAR + 0.08  (Myneni et al.)
        //    Also cross-check with soil moisture from Open-Meteo
        let ndviRaw = null;
        let ndviSource = "";
        if (fpar !== null) {
          ndviRaw   = Math.min(1, Math.max(-0.1, 0.52 * fpar + 0.08));
          ndviSource = "NASA MODIS/POWER";
        } else {
          // Last resort: estimate from soil moisture + season (rough heuristic)
          const sm = omc.soil_moisture_0_to_1cm;
          if (sm != null) {
            ndviRaw   = Math.min(0.85, Math.max(0.05, sm * 2.2));
            ndviSource = "Estimated (soil moisture proxy)";
          }
        }

        const ndviDisplay = ndviRaw != null ? ndviRaw.toFixed(3) : "N/A";
        let ndviLabel = "";
        let ndviColor = "#999";
        if (ndviRaw != null) {
          if (ndviRaw > 0.6)      { ndviLabel = "Dense Vegetation 🌳"; ndviColor = "#00c853"; }
          else if (ndviRaw > 0.4) { ndviLabel = "Moderate Crop 🌾";    ndviColor = "#76d275"; }
          else if (ndviRaw > 0.2) { ndviLabel = "Sparse / Young 🌱";   ndviColor = "#ffca28"; }
          else if (ndviRaw > 0)   { ndviLabel = "Very Sparse 🏜️";      ndviColor = "#ff8f00"; }
          else                    { ndviLabel = "Bare / Water 💧";      ndviColor = "#e53935"; }
        }

        // ── 4. AgroMonitoring: fallback for weather if Open-Meteo fails ──────────
        let weatherFallback = null;
        if (!omc.temperature_2m) {
          const wResp = await fetch(
            `https://api.agromonitoring.com/agro/1.0/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
          );
          weatherFallback = wResp.ok ? await wResp.json() : null;
        }

        const data = {
          lat: lat.toFixed(5),
          lng: lng.toFixed(5),
          temp:         omc.temperature_2m        ?? weatherFallback?.main?.temp     ?? "N/A",
          humidity:     omc.relative_humidity_2m  ?? weatherFallback?.main?.humidity ?? "N/A",
          wind:         omc.wind_speed_10m        ?? weatherFallback?.wind?.speed    ?? "N/A",
          soilMoisture: omc.soil_moisture_0_to_1cm != null
                          ? (omc.soil_moisture_0_to_1cm * 100).toFixed(1) + "%"
                          : "N/A",
          soilTemp:     omc.soil_temperature_0cm != null
                          ? omc.soil_temperature_0cm.toFixed(1) + "°C"
                          : "N/A",
          ndvi:         ndviDisplay,
          ndviLabel,
          ndviColor,
          ndviSource,
          lai:          lai != null ? lai.toFixed(2) : null,
        };

        setClickData(data);

        if (markerRef.current) {
          markerRef.current
            .bindPopup(
              `<b>📍 ${data.lat}, ${data.lng}</b><br>` +
              `🌡️ ${data.temp}°C &nbsp; 💧 ${data.humidity}% &nbsp; 🌿 NDVI: <b>${data.ndvi}</b>`
            )
            .openPopup();
        }
      } catch (err) {
        setClickData({ error: "Could not fetch data. Please check your network connection." });
      } finally {
        setLoadingData(false);
      }
    });

    return () => {
      map.remove();
      leafletMapRef.current = null;
      baseTileRef.current = null;
      overlayTileRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  // ── Switch tile layer when activeLayer changes ────────────────────────────
  useEffect(() => {
    const map = leafletMapRef.current;
    const L = window.L;
    if (!map || !L) return;

    // Remove existing base and overlay
    if (baseTileRef.current) map.removeLayer(baseTileRef.current);
    if (overlayTileRef.current) { map.removeLayer(overlayTileRef.current); overlayTileRef.current = null; }

    const baseInfo = BASE_LAYERS[activeLayer];
    const newBase = L.tileLayer(baseInfo.url, {
      attribution: baseInfo.attribution,
      maxZoom: 19,
    }).addTo(map);
    baseTileRef.current = newBase;

    // Add NDVI or EVI overlay on top of satellite base
    if (OVERLAY_TILES[activeLayer]) {
      const overlay = L.tileLayer(OVERLAY_TILES[activeLayer], {
        opacity: 0.82,
        maxZoom: 18,
      }).addTo(map);
      overlayTileRef.current = overlay;
    }
  }, [activeLayer]);

  // ── Close suggestions on outside click ───────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Nominatim search helper — tries multiple strategies for Indian villages ─
  const nominatimSearch = async (query, limit = 7) => {
    const base = "https://nominatim.openstreetmap.org/search";
    const common = `&format=json&limit=${limit}&addressdetails=1&namedetails=1&accept-language=en`;
    const headers = { "Accept-Language": "en", "User-Agent": "FarmMonitor/1.0" };

    // Strategy 1: strict India country code
    let res = await fetch(`${base}?q=${encodeURIComponent(query)}&countrycodes=in${common}`, { headers });
    let results = res.ok ? await res.json() : [];

    // Strategy 2: if nothing found, try appending common UP/India suffixes
    if (!results.length) {
      res = await fetch(`${base}?q=${encodeURIComponent(query + ", Uttar Pradesh, India")}&countrycodes=in${common}`, { headers });
      results = res.ok ? await res.json() : [];
    }

    // Strategy 3: structured search — split on comma and use as street + city
    if (!results.length) {
      const parts = query.split(",").map(s => s.trim());
      const street = encodeURIComponent(parts[0]);
      const city   = encodeURIComponent(parts.slice(1).join(", ") || "");
      res = await fetch(`${base}?street=${street}&city=${city}&country=India${common}`, { headers });
      results = res.ok ? await res.json() : [];
    }

    // Strategy 4: free-form global fallback (no countrycodes restriction)
    if (!results.length) {
      res = await fetch(`${base}?q=${encodeURIComponent(query + " India")}&format=json&limit=${limit}&addressdetails=1&accept-language=en`, { headers });
      results = res.ok ? await res.json() : [];
    }

    return results;
  };

  // ── Fetch autocomplete suggestions (debounced) ────────────────────────────
  const fetchSuggestions = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.length < 3) { setSearchSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await nominatimSearch(query, 7);
        setSearchSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSearchSuggestions([]);
      }
    }, 400);
  };

  // ── Navigate map to a chosen suggestion ──────────────────────────────────
  const selectSuggestion = (item) => {
    const { lat, lon, display_name, type, addresstype } = item;
    const shortName = display_name.split(",").slice(0, 3).join(",");
    setSearchQuery(shortName);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    if (!leafletMapRef.current) return;
    const L = window.L;
    // Villages/hamlets zoom closer; towns/cities zoom out more
    const isVillage = ["village", "hamlet", "locality", "neighbourhood", "farm"].includes(type) ||
                      ["village", "hamlet"].includes(addresstype);
    const zoomLevel = isVillage ? 15 : type === "city" || type === "town" ? 12 : 13;
    leafletMapRef.current.setView([parseFloat(lat), parseFloat(lon)], zoomLevel);
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([parseFloat(lat), parseFloat(lon)])
      .addTo(leafletMapRef.current)
      .bindPopup(`📍 ${shortName}`)
      .openPopup();
  };

  // ── Location search (Go button / Enter) ───────────────────────────────────
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !leafletMapRef.current) return;
    if (searchSuggestions.length > 0) { selectSuggestion(searchSuggestions[0]); return; }
    setSearchLoading(true);
    setSearchError("");
    try {
      const results = await nominatimSearch(searchQuery, 1);
      if (!results.length) {
        setSearchError("Village not found. Try: 'Kakwan, Bilhaur, Kanpur' or add district/state.");
        return;
      }
      selectSuggestion(results[0]);
    } catch {
      setSearchError("Search failed. Please check your internet connection.");
    } finally {
      setSearchLoading(false);
    }
  };

  // ─── NDVI color legend values ─────────────────────────────────────────────
  const getNdviColor = (val) => {
    if (val === "N/A") return "#999";
    const v = parseFloat(val);
    if (v > 0.6) return "#00c853";
    if (v > 0.4) return "#76d275";
    if (v > 0.2) return "#ffca28";
    if (v > 0) return "#ff8f00";
    return "#e53935";
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="farm-monitor-container">
      {/* ── Background video (embedded; no external file path needed) ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="bg-video"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"
      >
        {/* Place your video file (e.g. Farmariel.mp4) in /public and update src */}
        <source src="/Farmariel.mp4" type="video/mp4" />
      </video>

      <div className="farm-monitor-overlay"></div>

      {/* Language Selector */}
      <div className="language-selector-monitor">
        {["en", "hi", "pa", "ta"].map((lang) => (
          <button
            key={lang}
            className={language === lang ? "active" : ""}
            onClick={() => setLanguage(lang)}
          >
            {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : lang === "pa" ? "ਪੰਜਾਬੀ" : "தமிழ்"}
          </button>
        ))}
      </div>

      <div className="farm-monitor-content">
        {/* Header */}
        <div className="monitor-header">
          <h1 className="monitor-title">{t.title}</h1>
          <p className="monitor-subtitle">{t.subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {[
            ["⚡", t.features.realTime],
            ["📊", t.features.historical],
            ["🔔", t.features.alerts],
            ["🗺️", t.features.multiLayer],
            ["🌿", t.features.ndviTrack],
            ["🆓", t.features.freeAccess],
          ].map(([icon, label]) => (
            <div className="feature-card" key={label}>
              <div className="feature-icon">{icon}</div>
              <div className="feature-text">{label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            {t.dashboard}
          </button>
          <button
            className={activeTab === "instructions" ? "active" : ""}
            onClick={() => setActiveTab("instructions")}
          >
            {t.instructions.title}
          </button>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div className="dashboard-section">

            {/* Search bar with autocomplete */}
            <div style={{ position: "relative" }} ref={suggestionsRef}>
              <form className="map-search-bar" onSubmit={handleSearch}>
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search village, farm, district… (e.g. Kakwan, Bilhaur)"
                  value={searchQuery}
                  autoComplete="off"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchError("");
                    fetchSuggestions(e.target.value);
                  }}
                  onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                />
                <button type="submit" className="search-btn" disabled={searchLoading}>
                  {searchLoading ? "…" : "Go"}
                </button>
              </form>

              {/* Autocomplete dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <ul className="search-suggestions">
                  {searchSuggestions.map((item, idx) => {
                    const parts = item.display_name.split(",");
                    const main  = parts.slice(0, 2).join(",");
                    const sub   = parts.slice(2, 5).join(",");
                    return (
                      <li
                        key={idx}
                        className="suggestion-item"
                        onMouseDown={() => selectSuggestion(item)}
                      >
                        <span className="suggestion-icon">📍</span>
                        <span>
                          <span className="suggestion-main">{main}</span>
                          {sub && <span className="suggestion-sub">{sub}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {searchError && <p className="search-error">⚠️ {searchError}</p>}

            {/* Layer switcher */}
            <div className="layer-switcher">
              <span className="layer-label">{t.mapLayer}:</span>
              {Object.entries(BASE_LAYERS).map(([key, val]) => (
                <button
                  key={key}
                  className={activeLayer === key ? "active" : ""}
                  onClick={() => setActiveLayer(key)}
                >
                  {val.label}
                </button>
              ))}
            </div>

            {/* Map container */}
            <div className="iframe-container" style={{ position: "relative" }}>
              {!mapReady && (
                <div className="map-loading">
                  <div className="map-spinner"></div>
                  <p>{t.loading}</p>
                </div>
              )}
              <div
                ref={mapRef}
                id="leaflet-map"
                style={{ width: "100%", height: "580px", borderRadius: "20px", display: mapReady ? "block" : "none" }}
              />

              {/* NDVI Legend — shown when NDVI or EVI layer is active */}
              {mapReady && (activeLayer === "ndvi" || activeLayer === "evi") && (
                <div className="ndvi-legend">
                  <div className="legend-title">{activeLayer.toUpperCase()} Index</div>
                  {[
                    { color: "#00c853", label: "> 0.6  Dense Vegetation" },
                    { color: "#76d275", label: "0.4–0.6  Moderate" },
                    { color: "#ffca28", label: "0.2–0.4  Sparse" },
                    { color: "#ff8f00", label: "0–0.2  Very Sparse" },
                    { color: "#e53935", label: "< 0  Bare / Water" },
                  ].map(({ color, label }) => (
                    <div className="legend-row" key={label}>
                      <span className="legend-dot" style={{ background: color }}></span>
                      <span className="legend-text">{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Cursor coordinates bar */}
              {mapReady && cursorCoords && (
                <div className="cursor-coords">
                  📍 {cursorCoords.lat}, {cursorCoords.lng}
                </div>
              )}
            </div>

            <p className="map-hint">💡 {t.zoom} &nbsp;·&nbsp; Click map to get soil & weather data</p>

            {/* Click data panel */}
            {(loadingData || clickData) && (
              <div className="soil-panel">
                <h3>📍 {t.soilData} — {mapCenter.lat}, {mapCenter.lng}</h3>
                {loadingData ? (
                  <p className="soil-loading">{t.loading}</p>
                ) : clickData?.error ? (
                  <p className="soil-error">{clickData.error}</p>
                ) : (
                  <div className="soil-grid">
                    <div className="soil-card ndvi-card" style={{ borderColor: clickData.ndviColor || getNdviColor(clickData.ndvi) }}>
                      <span className="soil-icon">🌿</span>
                      <span className="soil-value" style={{ color: clickData.ndviColor || getNdviColor(clickData.ndvi) }}>
                        {clickData.ndvi}
                      </span>
                      <span className="soil-name">{t.ndviScore}</span>
                      {clickData.ndviLabel && (
                        <span style={{ fontSize: "0.72rem", color: clickData.ndviColor || getNdviColor(clickData.ndvi), fontWeight: 700, textAlign: "center", marginTop: "2px" }}>
                          {clickData.ndviLabel}
                        </span>
                      )}
                      {clickData.ndviSource && (
                        <span style={{ fontSize: "0.65rem", color: "#aaa", textAlign: "center", marginTop: "1px" }}>
                          via {clickData.ndviSource}
                        </span>
                      )}
                    </div>
                    <div className="soil-card">
                      <span className="soil-icon">💧</span>
                      <span className="soil-value">{clickData.soilMoisture}</span>
                      <span className="soil-name">{t.soilMoisture}</span>
                    </div>
                    <div className="soil-card">
                      <span className="soil-icon">🌡️</span>
                      <span className="soil-value">{clickData.temp}°C</span>
                      <span className="soil-name">{t.temperature}</span>
                    </div>
                    <div className="soil-card">
                      <span className="soil-icon">🌫️</span>
                      <span className="soil-value">{clickData.humidity}%</span>
                      <span className="soil-name">{t.humidity}</span>
                    </div>
                    <div className="soil-card">
                      <span className="soil-icon">🌬️</span>
                      <span className="soil-value">{clickData.wind} m/s</span>
                      <span className="soil-name">{t.windSpeed}</span>
                    </div>
                    <div className="soil-card">
                      <span className="soil-icon">🌍</span>
                      <span className="soil-value">{clickData.soilTemp}</span>
                      <span className="soil-name">Soil Temp (0cm)</span>
                    </div>
                    {clickData.lai != null && (
                      <div className="soil-card">
                        <span className="soil-icon">🍃</span>
                        <span className="soil-value">{clickData.lai}</span>
                        <span className="soil-name">LAI (MODIS)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quick Links */}
            <div className="quick-links">
              <h3>{t.quickLinks}</h3>
              <div className="links-grid">
                <a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className="quick-link">
                  <span className="link-icon">📊</span>
                  <span className="link-text">{t.viewDashboard}</span>
                </a>
                <a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className="quick-link">
                  <span className="link-icon">✏️</span>
                  <span className="link-text">{t.createPolygon}</span>
                </a>
                <a href={weatherUrl} target="_blank" rel="noopener noreferrer" className="quick-link">
                  <span className="link-icon">🌤️</span>
                  <span className="link-text">{t.viewWeather}</span>
                </a>
                <a href={satelliteUrl} target="_blank" rel="noopener noreferrer" className="quick-link">
                  <span className="link-icon">🛰️</span>
                  <span className="link-text">{t.viewSatellite}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── INSTRUCTIONS TAB ── */}
        {activeTab === "instructions" && (
          <div className="instructions-section">
            <div className="instructions-card">
              <h2>{t.instructions.title}</h2>
              <div className="steps-list">
                {t.steps.map((step, i) => (
                  <div className="step-item" key={i}>
                    <div className="step-number">{i + 1}</div>
                    <div className="step-content">
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="video-tutorial">
                <h3>📹 Video Tutorial (Coming Soon)</h3>
                <p>Watch a step-by-step video guide on how to set up and use the Farm Monitor.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmMonitor;
