import React, { useState } from 'react';
import './Crop.css';

// ── Quick Presets — saves farmer time ──────────────────────────────────────
const PRESETS = [
  { label: "🌾 Wheat Field",    icon: "🌾", values: { nitrogen: "90",  phosphorus: "42", potassium: "43", ph: "6.5", temperature: "22", humidity: "65", rainfall: "180" } },
  { label: "🌾 Rice Paddy",     icon: "🌾", values: { nitrogen: "80",  phosphorus: "40", potassium: "40", ph: "6.0", temperature: "28", humidity: "82", rainfall: "220" } },
  { label: "🌽 Maize/Corn",     icon: "🌽", values: { nitrogen: "100", phosphorus: "52", potassium: "35", ph: "6.8", temperature: "26", humidity: "60", rainfall: "150" } },
  { label: "🥔 Potato",         icon: "🥔", values: { nitrogen: "70",  phosphorus: "60", potassium: "80", ph: "5.5", temperature: "18", humidity: "75", rainfall: "140" } },
  { label: "🍅 Tomato",         icon: "🍅", values: { nitrogen: "60",  phosphorus: "55", potassium: "50", ph: "6.2", temperature: "24", humidity: "70", rainfall: "120" } },
  { label: "☕ Coffee",          icon: "☕", values: { nitrogen: "100", phosphorus: "28", potassium: "30", ph: "6.7", temperature: "25", humidity: "68", rainfall: "200" } },
];

// ── Season quick-fill for climate fields ──────────────────────────────────
const SEASONS = [
  { label: "☀️ Summer",  temp: "35", humidity: "45", rainfall: "80"  },
  { label: "🌧️ Monsoon", temp: "28", humidity: "88", rainfall: "250" },
  { label: "❄️ Winter",  temp: "16", humidity: "58", rainfall: "40"  },
  { label: "🍂 Rabi",    temp: "21", humidity: "62", rainfall: "90"  },
];

const EMPTY = { nitrogen: "", phosphorus: "", potassium: "", temperature: "", humidity: "", ph: "", rainfall: "" };

const Crop = () => {
  const [formData,   setFormData]   = useState(EMPTY);
  const [prediction, setPrediction] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setActivePreset(null); // deselect preset if user edits
  };

  // Apply a preset in one click
  const applyPreset = (preset, idx) => {
    setFormData(prev => ({ ...prev, ...preset.values }));
    setActivePreset(idx);
    setPrediction(null);
    setError(null);
  };

  // Fill only climate fields from chosen season
  const applySeason = (season) => {
    setFormData(prev => ({
      ...prev,
      temperature: season.temp,
      humidity:    season.humidity,
      rainfall:    season.rainfall,
    }));
  };

  // Auto-fetch weather for user's city via geolocation
  const autoFillWeather = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported by your browser."); return; }
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          // Open-Meteo — free, no API key needed
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`
          );
          const data = await res.json();
          const current = data.current;
          setFormData(prev => ({
            ...prev,
            temperature: String(Math.round(current.temperature_2m)),
            humidity:    String(Math.round(current.relative_humidity_2m)),
            // Approximate monthly rainfall from current precipitation
            rainfall:    String(Math.round(current.precipitation * 30)),
          }));
        } catch {
          alert("Could not fetch weather data. Please fill manually.");
        } finally {
          setWeatherLoading(false);
        }
      },
      () => { alert("Location permission denied. Please fill weather fields manually."); setWeatherLoading(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) setPrediction(data);
      else setError(data.error || 'Prediction failed');
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY);
    setPrediction(null);
    setError(null);
    setActivePreset(null);
  };

  const filled = Object.values(formData).filter(Boolean).length;
  const total  = Object.keys(formData).length;
  const progress = Math.round((filled / total) * 100);

  return (
    <div className="crop-container">
      <div className="crop-overlay" />
      <div className="crop-content">

        {/* Header */}
        <div className="crop-header">
          <h1 className="crop-title">🌾 Smart Crop Recommendation</h1>
          <p className="crop-subtitle">Get AI-powered crop suggestions based on soil and climate conditions</p>
        </div>

        <div className="crop-card">

          {/* ── Step 1: Quick Presets ── */}
          <div className="presets-section">
            <div className="section-label">
              <span className="step-badge">Step 1</span>
              <span>Pick a crop type to auto-fill soil data <em>(optional)</em></span>
            </div>
            <div className="presets-grid">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  className={`preset-btn ${activePreset === i ? "active" : ""}`}
                  onClick={() => applyPreset(p, i)}
                  type="button"
                >
                  <span className="preset-icon">{p.icon}</span>
                  <span className="preset-label">{p.label.replace(/.*? /, "")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Progress Bar ── */}
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Fields filled: {filled} / {total}</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="crop-form">
            <div className="form-grid">

              {/* Soil Nutrients */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="icon">🧪</span>
                  Soil Nutrients
                  <span className="step-badge" style={{ marginLeft: "auto", fontSize: "11px" }}>Step 2</span>
                </h3>

                {[
                  { name: "nitrogen",   label: "Nitrogen (N)",    placeholder: "e.g. 90",  hint: "0–140 kg/ha" },
                  { name: "phosphorus", label: "Phosphorus (P)",  placeholder: "e.g. 42",  hint: "5–145 kg/ha" },
                  { name: "potassium",  label: "Potassium (K)",   placeholder: "e.g. 43",  hint: "5–205 kg/ha" },
                  { name: "ph",         label: "Soil pH",         placeholder: "e.g. 6.5", hint: "3.5–9.5",  min: "0", max: "14", step: "0.01" },
                ].map(f => (
                  <div className="input-group" key={f.name}>
                    <label htmlFor={f.name}>
                      {f.label}
                      <span className="input-hint">{f.hint}</span>
                    </label>
                    <input
                      type="number" id={f.name} name={f.name}
                      value={formData[f.name]} onChange={handleChange}
                      placeholder={f.placeholder} required
                      step={f.step || "0.01"} min={f.min || "0"} max={f.max}
                    />
                  </div>
                ))}
              </div>

              {/* Climate Conditions */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="icon">🌡️</span>
                  Climate Conditions
                  <span className="step-badge" style={{ marginLeft: "auto", fontSize: "11px" }}>Step 3</span>
                </h3>

                {/* Season quick-fill */}
                <div className="season-row">
                  <span className="season-label">Quick-fill by season:</span>
                  <div className="season-chips">
                    {SEASONS.map((s, i) => (
                      <button key={i} type="button" className="season-chip" onClick={() => applySeason(s)}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto weather button */}
                <button type="button" className="btn-weather-auto" onClick={autoFillWeather} disabled={weatherLoading}>
                  {weatherLoading ? "⏳ Fetching..." : "📍 Auto-fill from my location"}
                </button>

                {[
                  { name: "temperature", label: "Temperature (°C)", placeholder: "e.g. 25.5", hint: "Avg. monthly °C" },
                  { name: "humidity",    label: "Humidity (%)",      placeholder: "e.g. 80",   hint: "0–100%", max: "100" },
                  { name: "rainfall",    label: "Rainfall (mm)",     placeholder: "e.g. 200",  hint: "Monthly avg." },
                ].map(f => (
                  <div className="input-group" key={f.name}>
                    <label htmlFor={f.name}>
                      {f.label}
                      <span className="input-hint">{f.hint}</span>
                    </label>
                    <input
                      type="number" id={f.name} name={f.name}
                      value={formData[f.name]} onChange={handleChange}
                      placeholder={f.placeholder} required
                      step="0.01" min="0" max={f.max}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Analyzing...</> : <><span>🔍</span> Get Recommendation</>}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                <span>↺</span> Reset All
              </button>
            </div>
          </form>

          {/* ── Result ── */}
          {error && (
            <div className="result-card error-card">
              <div className="result-icon">⚠️</div>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {prediction && (
            <div className="result-card success-card">
              <div className="result-icon">✅</div>
              <h3>Recommended Crop</h3>
              <div className="crop-name">{prediction.prediction}</div>
              {prediction.confidence && (
                <div className="confidence">
                  Confidence: <strong>{prediction.confidence.toFixed(2)}%</strong>
                </div>
              )}
              <div className="result-details">
                <p className="details-title">Based on your inputs:</p>
                <div className="details-grid">
                  <div className="detail-item"><span className="detail-label">N-P-K</span><span className="detail-value">{prediction.input.nitrogen}-{prediction.input.phosphorus}-{prediction.input.potassium}</span></div>
                  <div className="detail-item"><span className="detail-label">Temperature</span><span className="detail-value">{prediction.input.temperature}°C</span></div>
                  <div className="detail-item"><span className="detail-label">Humidity</span><span className="detail-value">{prediction.input.humidity}%</span></div>
                  <div className="detail-item"><span className="detail-label">pH</span><span className="detail-value">{prediction.input.ph}</span></div>
                  <div className="detail-item"><span className="detail-label">Rainfall</span><span className="detail-value">{prediction.input.rainfall} mm</span></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Crop;
