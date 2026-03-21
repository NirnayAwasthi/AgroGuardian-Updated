import { useState } from "react";
import axios from "axios";
import "./Weather.css";

// ── Crop Recommendation Engine ────────────────────────────────────────────────
// Maps city/state names → region info + seasonal crop data
// Recommendations are based on: temp, humidity, rainfall, and Indian agro-zones

const CITY_REGION_MAP = {
  // Uttar Pradesh
  lucknow:      { state: "Uttar Pradesh",  region: "Indo-Gangetic Plain" },
  kanpur:       { state: "Uttar Pradesh",  region: "Indo-Gangetic Plain" },
  agra:         { state: "Uttar Pradesh",  region: "Indo-Gangetic Plain" },
  varanasi:     { state: "Uttar Pradesh",  region: "Indo-Gangetic Plain" },
  allahabad:    { state: "Uttar Pradesh",  region: "Indo-Gangetic Plain" },
  // Punjab & Haryana
  amritsar:     { state: "Punjab",         region: "Punjab Plains" },
  ludhiana:     { state: "Punjab",         region: "Punjab Plains" },
  chandigarh:   { state: "Haryana",        region: "Punjab Plains" },
  hisar:        { state: "Haryana",        region: "Punjab Plains" },
  // Rajasthan
  jaipur:       { state: "Rajasthan",      region: "Thar Desert & Semi-arid" },
  jodhpur:      { state: "Rajasthan",      region: "Thar Desert & Semi-arid" },
  udaipur:      { state: "Rajasthan",      region: "Thar Desert & Semi-arid" },
  // Maharashtra
  mumbai:       { state: "Maharashtra",    region: "Deccan Plateau & Coastal" },
  pune:         { state: "Maharashtra",    region: "Deccan Plateau & Coastal" },
  nagpur:       { state: "Maharashtra",    region: "Deccan Plateau & Coastal" },
  nashik:       { state: "Maharashtra",    region: "Deccan Plateau & Coastal" },
  // Tamil Nadu & Kerala
  chennai:      { state: "Tamil Nadu",     region: "South Coastal" },
  coimbatore:   { state: "Tamil Nadu",     region: "South Coastal" },
  madurai:      { state: "Tamil Nadu",     region: "South Coastal" },
  kochi:        { state: "Kerala",         region: "South Coastal" },
  thiruvananthapuram: { state: "Kerala",   region: "South Coastal" },
  // West Bengal & Odisha
  kolkata:      { state: "West Bengal",    region: "Eastern Plains & Delta" },
  bhubaneswar:  { state: "Odisha",         region: "Eastern Plains & Delta" },
  // Madhya Pradesh & Chhattisgarh
  bhopal:       { state: "Madhya Pradesh", region: "Central Highlands" },
  indore:       { state: "Madhya Pradesh", region: "Central Highlands" },
  raipur:       { state: "Chhattisgarh",   region: "Central Highlands" },
  // Gujarat
  ahmedabad:    { state: "Gujarat",        region: "Gujarat Plains" },
  surat:        { state: "Gujarat",        region: "Gujarat Plains" },
  rajkot:       { state: "Gujarat",        region: "Gujarat Plains" },
  // Karnataka & Andhra Pradesh
  bangalore:    { state: "Karnataka",      region: "Deccan Plateau" },
  bengaluru:    { state: "Karnataka",      region: "Deccan Plateau" },
  mysore:       { state: "Karnataka",      region: "Deccan Plateau" },
  hyderabad:    { state: "Telangana",      region: "Deccan Plateau" },
  visakhapatnam:{ state: "Andhra Pradesh", region: "South Coastal" },
  // Bihar & Jharkhand
  patna:        { state: "Bihar",          region: "Indo-Gangetic Plain" },
  ranchi:       { state: "Jharkhand",      region: "Chota Nagpur Plateau" },
  // Delhi & NCR
  delhi:        { state: "Delhi",          region: "Indo-Gangetic Plain" },
  "new delhi":  { state: "Delhi",          region: "Indo-Gangetic Plain" },
  gurgaon:      { state: "Haryana",        region: "Indo-Gangetic Plain" },
  noida:        { state: "Uttar Pradesh",  region: "Indo-Gangetic Plain" },
  // Assam & NE
  guwahati:     { state: "Assam",          region: "North-East India" },
  // Himachal & Uttarakhand
  shimla:       { state: "Himachal Pradesh", region: "Himalayan Foothills" },
  dehradun:     { state: "Uttarakhand",    region: "Himalayan Foothills" },
};

// Crop recommendation logic based on weather conditions + region
const getCropRecommendations = (weatherData, cityName) => {
  if (!weatherData || weatherData.length === 0) return null;

  // Average conditions over 5 days
  const avgTemp     = weatherData.reduce((s, d) => s + d.main.temp, 0) / weatherData.length;
  const avgHumidity = weatherData.reduce((s, d) => s + d.main.humidity, 0) / weatherData.length;
  const rainDays    = weatherData.filter(d => ["Rain", "Drizzle", "Thunderstorm"].includes(d.weather[0].main)).length;
  const isRainy     = rainDays >= 2;
  const isDry       = rainDays === 0 && avgHumidity < 50;

  // Determine current month → season
  const month = new Date().getMonth() + 1; // 1–12
  let season;
  if (month >= 6 && month <= 9)       season = "kharif";   // Jun–Sep (Monsoon)
  else if (month >= 10 && month <= 11) season = "rabi_early"; // Oct–Nov (Early Rabi)
  else if (month >= 12 || month <= 3)  season = "rabi";    // Dec–Mar (Winter/Rabi)
  else                                 season = "zaid";    // Apr–May (Summer/Zaid)

  // Region lookup
  const key    = cityName.toLowerCase().trim();
  const region = CITY_REGION_MAP[key] || { state: "India", region: "General" };

  // Build recommendations
  let crops = [];
  let advice = "";
  let suitability = "good"; // good | moderate | poor

  // ── KHARIF Season (June–Sep, Monsoon) ──────────────────────────────────────
  if (season === "kharif") {
    if (avgTemp >= 25 && avgTemp <= 35 && isRainy) {
      crops = [
        { name: "Rice (Paddy)", emoji: "🌾", reason: "Perfect — warm + rainy conditions", famousIn: "West Bengal, Punjab, UP, Odisha" },
        { name: "Maize (Corn)", emoji: "🌽", reason: "Thrives in warm humid weather", famousIn: "Karnataka, Rajasthan, MP" },
        { name: "Soybean", emoji: "🫘", reason: "Excellent kharif legume in monsoon", famousIn: "Madhya Pradesh, Maharashtra" },
        { name: "Cotton", emoji: "🌿", reason: "Warm season, suits well-drained black soil", famousIn: "Gujarat, Maharashtra, Telangana" },
        { name: "Groundnut", emoji: "🥜", reason: "Warm temp + moderate rain ideal", famousIn: "Gujarat, Andhra Pradesh, Tamil Nadu" },
      ];
      advice = "Excellent monsoon conditions. Prioritise rice transplanting and kharif sowing.";
      suitability = "good";
    } else if (avgTemp >= 25 && !isRainy) {
      crops = [
        { name: "Cotton", emoji: "🌿", reason: "Tolerates dry spells if irrigation available", famousIn: "Gujarat, Maharashtra" },
        { name: "Groundnut", emoji: "🥜", reason: "Drought-tolerant, suits dry kharif", famousIn: "Gujarat, AP, Tamil Nadu" },
        { name: "Bajra (Pearl Millet)", emoji: "🌾", reason: "Highly drought-resistant", famousIn: "Rajasthan, Haryana, Gujarat" },
        { name: "Jowar (Sorghum)", emoji: "🌾", reason: "Excellent in dry warm conditions", famousIn: "Maharashtra, Karnataka, MP" },
      ];
      advice = "Dry kharif — use drought-resistant crops. Ensure irrigation for rice.";
      suitability = "moderate";
    }
  }

  // ── RABI Season (Oct–Mar, Winter) ──────────────────────────────────────────
  else if (season === "rabi" || season === "rabi_early") {
    if (avgTemp >= 10 && avgTemp <= 25 && avgHumidity >= 40) {
      crops = [
        { name: "Wheat", emoji: "🌾", reason: "Classic rabi crop — cool temp is ideal", famousIn: "Punjab, Haryana, UP, MP" },
        { name: "Mustard", emoji: "🌼", reason: "Cool dry weather suits mustard perfectly", famousIn: "Rajasthan, UP, Haryana" },
        { name: "Gram (Chickpea)", emoji: "🫘", reason: "Cool season legume, low water need", famousIn: "MP, Rajasthan, UP, Maharashtra" },
        { name: "Barley", emoji: "🌾", reason: "Cool-tolerant, less water than wheat", famousIn: "UP, Rajasthan, Bihar" },
        { name: "Peas (Matar)", emoji: "🫛", reason: "Short cool-season crop, high value", famousIn: "UP, Uttarakhand, Punjab" },
        { name: "Potato", emoji: "🥔", reason: "Cool nights are ideal for tuber development", famousIn: "UP, West Bengal, Punjab" },
      ];
      advice = "Ideal rabi conditions. Wheat sowing window is open. Prioritise moisture conservation.";
      suitability = "good";
    } else if (avgTemp < 10) {
      crops = [
        { name: "Barley", emoji: "🌾", reason: "More cold-tolerant than wheat", famousIn: "UP, Rajasthan, Himachal" },
        { name: "Mustard", emoji: "🌼", reason: "Handles cold well if frost-free", famousIn: "Rajasthan, Haryana, Punjab" },
        { name: "Gram (Chickpea)", emoji: "🫘", reason: "Withstands cool dry conditions", famousIn: "MP, Maharashtra, Rajasthan" },
      ];
      advice = "Cold conditions — avoid sensitive crops. Monitor for frost damage on wheat.";
      suitability = "moderate";
    }
  }

  // ── ZAID Season (Apr–May, Summer) ──────────────────────────────────────────
  else if (season === "zaid") {
    if (avgTemp >= 30) {
      crops = [
        { name: "Watermelon", emoji: "🍉", reason: "Thrives in hot dry summer conditions", famousIn: "UP, Karnataka, AP" },
        { name: "Muskmelon", emoji: "🍈", reason: "Hot season fruit crop, low water need", famousIn: "UP, Rajasthan, Gujarat" },
        { name: "Cucumber", emoji: "🥒", reason: "Fast-growing summer vegetable", famousIn: "UP, Haryana, Punjab" },
        { name: "Moong Dal (Green Gram)", emoji: "🫘", reason: "Short duration, heat tolerant", famousIn: "Rajasthan, Maharashtra, UP" },
        { name: "Urad Dal (Black Gram)", emoji: "🫘", reason: "Summer pulse, matures in 70 days", famousIn: "UP, MP, AP" },
        { name: "Sunflower", emoji: "🌻", reason: "Thrives in warm conditions, high value", famousIn: "Karnataka, Maharashtra, Haryana" },
      ];
      advice = "Hot summer/zaid season. Focus on short-duration crops & cucurbits. Ensure drip irrigation.";
      suitability = avgTemp > 42 ? "poor" : "moderate";
    }
  }

  // ── Region-specific bonus crops ────────────────────────────────────────────
  const regionBonusCrops = {
    "South Coastal":          { name: "Coconut",       emoji: "🥥", reason: "Year-round coastal crop" },
    "North-East India":       { name: "Tea",            emoji: "🍵", reason: "High rainfall & humidity perfect for tea" },
    "Himalayan Foothills":    { name: "Apple",          emoji: "🍎", reason: "Cool hills suit apple orchards" },
    "Deccan Plateau":         { name: "Turmeric",       emoji: "🌿", reason: "Black soil + warm climate for spices" },
    "Thar Desert & Semi-arid":{ name: "Bajra",          emoji: "🌾", reason: "Most drought-tolerant cereal for arid zones" },
    "Punjab Plains":          { name: "Sugarcane",      emoji: "🎋", reason: "High water availability suits sugarcane" },
    "Gujarat Plains":         { name: "Bt-Cotton",      emoji: "🌿", reason: "Gujarat's flagship cash crop" },
    "Eastern Plains & Delta": { name: "Jute",           emoji: "🌿", reason: "High humidity & rainfall suits jute" },
  };

  const bonus = regionBonusCrops[region.region];
  if (bonus && crops.length > 0) {
    crops.push({ ...bonus, famousIn: region.state });
  }

  // Fallback if no crops yet
  if (crops.length === 0) {
    crops = [
      { name: "Tomato", emoji: "🍅", reason: "Adaptable vegetable crop", famousIn: "All India" },
      { name: "Onion",  emoji: "🧅", reason: "Suited to varied conditions", famousIn: "Maharashtra, UP, Karnataka" },
      { name: "Maize",  emoji: "🌽", reason: "Flexible across seasons", famousIn: "Karnataka, Rajasthan, MP" },
    ];
    advice = "Mixed conditions — focus on versatile vegetable crops.";
    suitability = "moderate";
  }

  return {
    season,
    region: region.region,
    state: region.state,
    avgTemp: Math.round(avgTemp),
    avgHumidity: Math.round(avgHumidity),
    isRainy,
    isDry,
    crops,
    advice,
    suitability,
  };
};

// ── Component ─────────────────────────────────────────────────────────────────
function Weather() {
  const [city, setCity]         = useState("");
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [cropRec, setCropRec]   = useState(null);
  const [searchedCity, setSearchedCity] = useState("");

  const getWeatherIcon = (weatherMain) => {
    const icons = {
      Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
      Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Smoke: "🌫️",
      Haze: "🌫️", Dust: "🌫️", Fog: "🌫️", Sand: "🌫️",
      Ash: "🌋", Squall: "💨", Tornado: "🌪️",
    };
    return icons[weatherMain] || "🌤️";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const getSuitabilityColor = (s) =>
    s === "good" ? "#4CAF50" : s === "moderate" ? "#FF9800" : "#f44336";

  const getSeasonLabel = (s) => ({
    kharif: "☔ Kharif (Monsoon)",
    rabi: "❄️ Rabi (Winter)",
    rabi_early: "🍂 Early Rabi (Oct–Nov)",
    zaid: "☀️ Zaid (Summer)",
  }[s] || s);

  const getWeather = async () => {
    if (!city.trim()) { setError("Please enter a city name."); return; }
    setLoading(true);
    setError("");
    setList([]);
    setCropRec(null);

    try {
      const key = "0546b9c86b69c675937e44c4beec6dc7";
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&appid=${key}&units=metric`
      );
      const daily = res.data.list.filter(x => x.dt_txt.includes("12:00:00")).slice(0, 5);
      setList(daily);
      setSearchedCity(city.trim());
      setCropRec(getCropRecommendations(daily, city.trim()));
    } catch {
      setError("City not found. Please check spelling and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") getWeather(); };

  return (
    <div className="weather-page">

      {/* Header */}
      <div className="weather-header">
        <h2 className="page-title">🌍 5-Day Weather Forecast</h2>
        <div className="weather-search">
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="🔍 Enter city name (e.g. Lucknow, Mumbai)..."
          />
          <button className="btn" onClick={getWeather} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="error-msg">⚠️ {error}</p>}
      </div>

      {/* Weather Cards */}
      {list.length > 0 && (
        <div className="weather-grid">
          {list.map((d, i) => (
            <div key={i} className="weather-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <h4 className="card-date">{formatDate(d.dt_txt)}</h4>
              <div className="weather-icon">{getWeatherIcon(d.weather[0].main)}</div>
              <div className="main-temp">{Math.round(d.main.temp)}°C</div>
              <p className="weather-description">{d.weather[0].description}</p>
              <div className="weather-details">
                <div className="detail-item">
                  <div className="detail-icon">🌡️</div>
                  <div className="detail-label">Feels Like</div>
                  <div className="detail-value">{Math.round(d.main.feels_like)}°C</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">💧</div>
                  <div className="detail-label">Humidity</div>
                  <div className="detail-value">{d.main.humidity}%</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">💨</div>
                  <div className="detail-label">Wind</div>
                  <div className="detail-value">{Math.round(d.wind.speed)} m/s</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">🌊</div>
                  <div className="detail-label">Pressure</div>
                  <div className="detail-value">{d.main.pressure} hPa</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">👁️</div>
                  <div className="detail-label">Visibility</div>
                  <div className="detail-value">{d.visibility ? (d.visibility / 1000).toFixed(1) : "N/A"} km</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">☁️</div>
                  <div className="detail-label">Cloudiness</div>
                  <div className="detail-value">{d.clouds.all}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Crop Recommendation Section ── */}
      {cropRec && (
        <div className="crop-rec-section">
          <div className="crop-rec-header">
            <h3>🌱 Crop Recommendations for {searchedCity}</h3>
            <p className="crop-rec-subtitle">
              Based on current weather in <strong>{cropRec.region}</strong>, {cropRec.state}
            </p>
          </div>

          {/* Summary badges */}
          <div className="crop-summary-badges">
            <div className="badge badge-season">{getSeasonLabel(cropRec.season)}</div>
            <div className="badge badge-temp">🌡️ Avg {cropRec.avgTemp}°C</div>
            <div className="badge badge-humidity">💧 Humidity {cropRec.avgHumidity}%</div>
            <div className="badge badge-rain">{cropRec.isRainy ? "🌧️ Rainy Days" : cropRec.isDry ? "🔥 Dry Conditions" : "⛅ Mixed Weather"}</div>
            <div className="badge" style={{ background: getSuitabilityColor(cropRec.suitability) }}>
              {cropRec.suitability === "good" ? "✅ Good Growing Conditions" : cropRec.suitability === "moderate" ? "⚠️ Moderate Conditions" : "❌ Challenging Conditions"}
            </div>
          </div>

          {/* Advice box */}
          <div className="crop-advice-box">
            <span className="advice-icon">💡</span>
            <p>{cropRec.advice}</p>
          </div>

          {/* Crop cards */}
          <div className="crop-cards-grid">
            {cropRec.crops.map((crop, idx) => (
              <div className="crop-card" key={idx} style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="crop-emoji">{crop.emoji}</div>
                <div className="crop-name">{crop.name}</div>
                <div className="crop-reason">{crop.reason}</div>
                <div className="crop-famous">
                  <span className="famous-label">📍 Famous in:</span>
                  <span className="famous-value">{crop.famousIn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Map */}
      {list.length > 0 && (
        <div className="weather-map-section">
          <h3 className="map-header">🗺️ Real-Time Weather Map</h3>
          <div className="map-container">
            <iframe
              className="map-iframe"
              src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=26.8467&lon=80.9462&zoom=6`}
              title="Weather Map"
              allowFullScreen
            />
            <div className="map-info">
              <div className="map-info-item">🌡️ Temperature Layer</div>
              <div className="map-info-item">🌧️ Precipitation</div>
              <div className="map-info-item">💨 Wind Speed</div>
              <div className="map-info-item">☁️ Cloud Cover</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
