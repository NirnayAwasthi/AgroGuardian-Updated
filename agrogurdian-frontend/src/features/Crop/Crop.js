import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Crop.css';

// ── MapTiler API Key ──────────────────────────────────────────────────────────
const MAPTILER_KEY = 'JyrUrBjHTwoq4If3qvCE';

// ── All 22 crops with REAL dataset mean values ────────────────────────────────
const CROP_DATA = {
  apple:       { icon:'🍎', emoji:'🍎', N:21,  P:134, K:200, temperature:22.6, humidity:92.3, ph:5.93, rainfall:112.7,
    soilType:'Well-drained loamy or sandy loam', season:'Rabi / Winter', states:'J&K, Himachal Pradesh, Uttarakhand',
    desc:'Prefers cool climate with well-defined seasons. Needs high phosphorus and potassium.' },
  banana:      { icon:'🍌', emoji:'🍌', N:100, P:82,  K:50,  temperature:27.4, humidity:80.4, ph:5.98, rainfall:104.6,
    soilType:'Rich loamy, well-drained', season:'Year-round (tropical)', states:'Maharashtra, Tamil Nadu, AP, Karnataka',
    desc:'Tropical fruit requiring high nitrogen and warm humid conditions.' },
  blackgram:   { icon:'🫘', emoji:'🫘', N:40,  P:68,  K:19,  temperature:30.0, humidity:65.1, ph:7.13, rainfall:67.9,
    soilType:'Sandy loam to heavy black soil', season:'Kharif / Rabi', states:'UP, Maharashtra, Rajasthan, MP',
    desc:'Pulse crop tolerating warm climate and moderate rainfall.' },
  chickpea:    { icon:'🌰', emoji:'🌰', N:40,  P:68,  K:80,  temperature:18.9, humidity:16.9, ph:7.34, rainfall:80.1,
    soilType:'Sandy loam, well-drained', season:'Rabi (winter)', states:'MP, Rajasthan, Maharashtra, UP',
    desc:'Drought-tolerant legume needing cool dry winters.' },
  coconut:     { icon:'🥥', emoji:'🥥', N:22,  P:17,  K:31,  temperature:27.4, humidity:94.8, ph:5.98, rainfall:175.7,
    soilType:'Sandy loam, coastal alluvial', season:'Year-round (tropical)', states:'Kerala, Tamil Nadu, Karnataka, AP',
    desc:'Thrives in high humidity coastal areas with abundant rainfall.' },
  coffee:      { icon:'☕', emoji:'☕', N:101, P:29,  K:30,  temperature:25.5, humidity:58.9, ph:6.79, rainfall:158.1,
    soilType:'Deep well-drained loamy, red laterite', season:'Year-round (plantation)', states:'Karnataka, Kerala, Tamil Nadu',
    desc:'Requires moderate temperature, well-distributed rainfall and shade.' },
  cotton:      { icon:'🌿', emoji:'🌿', N:118, P:46,  K:20,  temperature:24.0, humidity:79.8, ph:6.91, rainfall:80.4,
    soilType:'Black cotton soil (Regur), deep alluvial', season:'Kharif', states:'Gujarat, Maharashtra, Telangana, Punjab',
    desc:'Requires high nitrogen and warm dry conditions at boll opening.' },
  grapes:      { icon:'🍇', emoji:'🍇', N:23,  P:133, K:200, temperature:23.8, humidity:81.9, ph:6.03, rainfall:69.6,
    soilType:'Deep loamy, well-drained gravelly', season:'Rabi / Spring', states:'Maharashtra, Karnataka, AP, Tamil Nadu',
    desc:'Needs high P and K, warm days and cool nights for quality fruit.' },
  jute:        { icon:'🌾', emoji:'🌾', N:78,  P:47,  K:40,  temperature:25.0, humidity:79.6, ph:6.73, rainfall:174.8,
    soilType:'Alluvial loamy', season:'Kharif', states:'West Bengal, Bihar, Assam, Odisha',
    desc:'Grows well in humid climate with high rainfall and alluvial soil.' },
  kidneybeans: { icon:'🫘', emoji:'🫘', N:21,  P:68,  K:20,  temperature:20.1, humidity:21.6, ph:5.75, rainfall:105.9,
    soilType:'Sandy loam to loam, well-drained', season:'Kharif / Rabi', states:'J&K, Himachal Pradesh, UP',
    desc:'Cool-season legume preferring moderate temperatures and low humidity.' },
  lentil:      { icon:'🟤', emoji:'🟤', N:19,  P:68,  K:19,  temperature:24.5, humidity:64.8, ph:6.93, rainfall:45.7,
    soilType:'Sandy loam, light soil', season:'Rabi (winter)', states:'UP, MP, Bihar, Rajasthan',
    desc:'Low water requirement. Grows well in cool, dry winter climate.' },
  maize:       { icon:'🌽', emoji:'🌽', N:78,  P:48,  K:20,  temperature:22.4, humidity:65.1, ph:6.25, rainfall:84.8,
    soilType:'Well-drained loamy to sandy loam', season:'Kharif / Rabi', states:'Karnataka, AP, Rajasthan, UP',
    desc:'Versatile cereal crop requiring moderate nitrogen and rainfall.' },
  mango:       { icon:'🥭', emoji:'🥭', N:20,  P:27,  K:30,  temperature:31.2, humidity:50.2, ph:5.77, rainfall:94.7,
    soilType:'Deep, well-drained alluvial or laterite', season:'Summer (fruit)', states:'UP, AP, Bihar, Gujarat, Karnataka',
    desc:'Thrives in hot humid tropics. Requires dry period before flowering.' },
  mothbeans:   { icon:'🫘', emoji:'🫘', N:21,  P:48,  K:20,  temperature:28.2, humidity:53.2, ph:6.83, rainfall:51.2,
    soilType:'Sandy, light loamy', season:'Kharif', states:'Rajasthan, Gujarat, UP',
    desc:'Highly drought-tolerant pulse, suited for arid and semi-arid zones.' },
  mungbean:    { icon:'🫘', emoji:'🫘', N:21,  P:47,  K:20,  temperature:28.5, humidity:85.5, ph:6.72, rainfall:48.4,
    soilType:'Sandy loam, well-drained', season:'Kharif / Zaid', states:'Rajasthan, Maharashtra, UP, AP',
    desc:'Short-duration legume thriving in warm humid conditions with low rainfall.' },
  muskmelon:   { icon:'🍈', emoji:'🍈', N:100, P:18,  K:50,  temperature:28.7, humidity:92.3, ph:6.36, rainfall:24.7,
    soilType:'Sandy loam, light alluvial', season:'Zaid (summer)', states:'UP, Punjab, Rajasthan, Maharashtra',
    desc:'Warm-season fruit needing high humidity, abundant water but low rainfall.' },
  orange:      { icon:'🍊', emoji:'🍊', N:20,  P:17,  K:10,  temperature:22.8, humidity:92.2, ph:7.02, rainfall:110.5,
    soilType:'Well-drained sandy loam to loam', season:'Rabi / Winter', states:'Nagpur (Maharashtra), Punjab, Rajasthan',
    desc:'Citrus fruit needing mild climate, high humidity and well-drained soil.' },
  papaya:      { icon:'🍈', emoji:'🍈', N:50,  P:59,  K:50,  temperature:33.7, humidity:92.4, ph:6.74, rainfall:142.6,
    soilType:'Well-drained loamy, slightly sandy', season:'Year-round (tropical)', states:'AP, Karnataka, Gujarat, West Bengal',
    desc:'Fast-growing tropical fruit requiring hot humid conditions and no waterlogging.' },
  pigeonpeas:  { icon:'🫘', emoji:'🫘', N:21,  P:68,  K:20,  temperature:27.7, humidity:48.1, ph:5.79, rainfall:149.5,
    soilType:'Sandy loam to clay loam, well-drained', season:'Kharif', states:'Maharashtra, Karnataka, MP, UP',
    desc:'Deep-rooted legume, drought-tolerant and suitable for intercropping.' },
  pomegranate: { icon:'🍎', emoji:'🍎', N:19,  P:19,  K:40,  temperature:21.8, humidity:90.1, ph:6.43, rainfall:107.5,
    soilType:'Well-drained sandy loam to loam', season:'Kharif / Rabi (fruit)', states:'Maharashtra, Rajasthan, Gujarat, Karnataka',
    desc:'Highly drought-tolerant fruit crop suited to arid and semi-arid climates.' },
  rice:        { icon:'🌾', emoji:'🌾', N:80,  P:48,  K:40,  temperature:23.7, humidity:82.3, ph:6.43, rainfall:236.2,
    soilType:'Clay loam, heavy alluvial (paddy soil)', season:'Kharif (main)', states:'West Bengal, UP, Punjab, AP, Tamil Nadu',
    desc:'Staple cereal requiring high rainfall or irrigation and humid conditions.' },
  watermelon:  { icon:'🍉', emoji:'🍉', N:99,  P:17,  K:50,  temperature:25.6, humidity:85.2, ph:6.50, rainfall:50.8,
    soilType:'Sandy loam, well-drained', season:'Zaid (summer)', states:'UP, Karnataka, Maharashtra, AP',
    desc:'Warm-season vine crop needing full sun, moderate water and sandy soil.' },
};

// ── Language Support ──────────────────────────────────────────────────────────
const LANGUAGES = {
  en: {
    name:"English", flag:"🇬🇧",
    title:"Smart Crop Recommendation", subtitle:"AI-powered suggestions based on soil & climate",
    step1:"Select Crop Preset", step1sub:"Auto-fill any of the 22 dataset crops",
    step2:"Soil Nutrients", step3:"Climate Conditions", step4:"Land Details",
    getBtn:"Get Recommendation", reset:"Reset All", analyzing:"Analyzing...",
    confidence:"Confidence", recommended:"Recommended Crop",
    basedOn:"Based on your inputs",
    landArea:"Land Area", landUnit:"Unit", location:"Farm Location",
    searchLocation:"Search your farm location...",
    autoWeather:"📍 Auto-fill from my location", fetching:"⏳ Fetching...",
    quickSeason:"Quick-fill by season", fieldsOf:"fields filled",
    nitrogen:"Nitrogen (N)", phosphorus:"Phosphorus (P)",
    potassium:"Potassium (K)", ph:"Soil pH",
    temperature:"Temperature (°C)", humidity:"Humidity (%)", rainfall:"Rainfall (mm)",
    errorTitle:"Error", clickMap:"Click on map to set farm location",
    soilSummary:"Soil", climateSummary:"Climate", landSummary:"Land", optional:"optional",
    downloadPDF:"📄 Download Report", cropSelector:"Or select crop manually",
    soilType:"Soil Type", season:"Best Season", states:"Recommended States",
    cropInfo:"Crop Information",
  },
  hi: {
    name:"हिंदी", flag:"🇮🇳",
    title:"स्मार्ट फसल अनुशंसा", subtitle:"मिट्टी और जलवायु के आधार पर AI सुझाव",
    step1:"फसल प्रीसेट चुनें", step1sub:"22 फसलों में से चुनें",
    step2:"मिट्टी पोषक तत्व", step3:"जलवायु स्थिति", step4:"भूमि विवरण",
    getBtn:"अनुशंसा प्राप्त करें", reset:"सब रीसेट करें", analyzing:"विश्लेषण हो रहा है...",
    confidence:"विश्वसनीयता", recommended:"अनुशंसित फसल",
    basedOn:"आपके इनपुट के आधार पर",
    landArea:"भूमि क्षेत्र", landUnit:"इकाई", location:"खेत का स्थान",
    searchLocation:"अपने खेत का स्थान खोजें...",
    autoWeather:"📍 मेरी लोकेशन से भरें", fetching:"⏳ प्राप्त हो रहा है...",
    quickSeason:"मौसम के अनुसार भरें", fieldsOf:"फ़ील्ड भरे",
    nitrogen:"नाइट्रोजन (N)", phosphorus:"फास्फोरस (P)",
    potassium:"पोटेशियम (K)", ph:"मिट्टी pH",
    temperature:"तापमान (°C)", humidity:"आर्द्रता (%)", rainfall:"वर्षा (mm)",
    errorTitle:"त्रुटि", clickMap:"खेत की लोकेशन के लिए नकशे पर क्लिक करें",
    soilSummary:"मिट्टी", climateSummary:"जलवायु", landSummary:"भूमि", optional:"वैकल्पिक",
    downloadPDF:"📄 रिपोर्ट डाउनलोड करें", cropSelector:"या फसल मैन्युअल चुनें",
    soilType:"मिट्टी का प्रकार", season:"सर्वोत्तम मौसम", states:"अनुशंसित राज्य",
    cropInfo:"फसल जानकारी",
  },
};

// ── Land Units ────────────────────────────────────────────────────────────────
const LAND_UNITS = [
  { value:'hectare', label:'Hectare (ha)',   toHectare:1 },
  { value:'acre',    label:'Acre',           toHectare:0.404686 },
  { value:'bigha',   label:'Bigha (Pucca)', toHectare:0.2529 },
  { value:'bigha_r', label:'Bigha (Raw)',   toHectare:0.1613 },
  { value:'guntha',  label:'Guntha',        toHectare:0.01012 },
  { value:'kanal',   label:'Kanal',         toHectare:0.0809 },
  { value:'marla',   label:'Marla',         toHectare:0.00505 },
  { value:'sqm',     label:'Sq. Meter',     toHectare:0.0001 },
];

const SEASONS = [
  { label:"☀️ Summer",  temp:"35", humidity:"45", rainfall:"80"  },
  { label:"🌧️ Monsoon", temp:"28", humidity:"88", rainfall:"250" },
  { label:"❄️ Winter",  temp:"16", humidity:"58", rainfall:"40"  },
  { label:"🍂 Rabi",    temp:"21", humidity:"62", rainfall:"90"  },
];

const EMPTY = { nitrogen:"", phosphorus:"", potassium:"", temperature:"", humidity:"", ph:"", rainfall:"" };

// ── PDF Generator ─────────────────────────────────────────────────────────────
const generatePDF = (prediction, formData, landArea, landUnit, farmLocation, cropInfo, t) => {
  const crop = prediction.prediction;
  const info = cropInfo || CROP_DATA[crop?.toLowerCase()];
  const date = new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
  const landUnitObj = LAND_UNITS.find(u => u.value === landUnit);
  const landInHa = landArea ? (parseFloat(landArea) * (landUnitObj?.toHectare || 1)).toFixed(3) : null;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AgroGuardian Crop Report</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Segoe UI',Arial,sans-serif; color:#1a2e1a; background:#fff; }
  .page { padding:40px 50px; max-width:800px; margin:auto; }
  .header { background:linear-gradient(135deg,#1b5e20,#2e7d32); color:#fff; padding:30px; border-radius:12px; margin-bottom:24px; display:flex; align-items:center; gap:20px; }
  .header-logo { font-size:48px; }
  .header h1 { font-size:26px; font-weight:700; }
  .header p { font-size:13px; opacity:0.85; margin-top:4px; }
  .badge { background:rgba(255,255,255,0.2); padding:4px 12px; border-radius:20px; font-size:11px; display:inline-block; margin-top:8px; }
  .section { background:#f8fdf8; border:1px solid #c8e6c9; border-radius:10px; padding:20px; margin-bottom:18px; }
  .section-title { font-size:14px; font-weight:700; color:#2e7d32; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px; border-bottom:2px solid #a5d6a7; padding-bottom:8px; }
  .crop-result { text-align:center; padding:24px; background:linear-gradient(135deg,#e8f5e9,#f1f8e9); border:2px solid #66bb6a; border-radius:12px; margin-bottom:18px; }
  .crop-emoji { font-size:56px; display:block; margin-bottom:8px; }
  .crop-name-pdf { font-size:32px; font-weight:800; color:#1b5e20; text-transform:capitalize; margin-bottom:8px; }
  .confidence-pdf { font-size:15px; color:#388e3c; font-weight:600; }
  .conf-bar { background:#c8e6c9; border-radius:20px; height:10px; margin:8px auto; max-width:300px; }
  .conf-fill { background:linear-gradient(90deg,#43a047,#66bb6a); height:10px; border-radius:20px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
  .stat-box { background:#fff; border:1px solid #a5d6a7; border-radius:8px; padding:12px; text-align:center; }
  .stat-label { font-size:10px; color:#558b2f; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
  .stat-value { font-size:18px; font-weight:800; color:#1b5e20; margin-top:4px; }
  .info-row { display:flex; gap:8px; margin-bottom:8px; align-items:flex-start; }
  .info-key { font-size:12px; font-weight:700; color:#2e7d32; min-width:140px; }
  .info-val { font-size:12px; color:#333; }
  .footer { text-align:center; margin-top:30px; padding-top:16px; border-top:1px solid #c8e6c9; font-size:11px; color:#888; }
  .watermark { color:#c8e6c9; font-size:10px; margin-top:6px; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-logo">🌿</div>
    <div>
      <h1>AgroGuardian — Crop Recommendation Report</h1>
      <p>AI-powered crop advisory for Indian farmers</p>
      <span class="badge">Generated on ${date}</span>
    </div>
  </div>

  <div class="crop-result">
    <span class="crop-emoji">${info?.icon || '🌱'}</span>
    <div class="crop-name-pdf">${crop}</div>
    <div class="confidence-pdf">Model Confidence: ${prediction.confidence?.toFixed(1) || 'N/A'}%</div>
    <div class="conf-bar"><div class="conf-fill" style="width:${Math.min(prediction.confidence||0,100)}%"></div></div>
    <p style="font-size:12px;color:#555;margin-top:8px">${info?.desc || ''}</p>
  </div>

  <div class="section">
    <div class="section-title">📊 Soil Nutrient Inputs</div>
    <div class="grid3">
      <div class="stat-box"><div class="stat-label">Nitrogen (N)</div><div class="stat-value">${formData.nitrogen} <span style="font-size:12px">kg/ha</span></div></div>
      <div class="stat-box"><div class="stat-label">Phosphorus (P)</div><div class="stat-value">${formData.phosphorus} <span style="font-size:12px">kg/ha</span></div></div>
      <div class="stat-box"><div class="stat-label">Potassium (K)</div><div class="stat-value">${formData.potassium} <span style="font-size:12px">kg/ha</span></div></div>
      <div class="stat-box"><div class="stat-label">Soil pH</div><div class="stat-value">${formData.ph}</div></div>
      <div class="stat-box"><div class="stat-label">Temperature</div><div class="stat-value">${formData.temperature}°C</div></div>
      <div class="stat-box"><div class="stat-label">Humidity</div><div class="stat-value">${formData.humidity}%</div></div>
    </div>
    <div class="stat-box" style="margin-top:10px;text-align:center">
      <div class="stat-label">Rainfall</div>
      <div class="stat-value">${formData.rainfall} mm</div>
    </div>
  </div>

  ${info ? `
  <div class="section">
    <div class="section-title">🌾 Crop Profile</div>
    <div class="info-row"><span class="info-key">Soil Type:</span><span class="info-val">${info.soilType}</span></div>
    <div class="info-row"><span class="info-key">Best Season:</span><span class="info-val">${info.season}</span></div>
    <div class="info-row"><span class="info-key">Recommended States:</span><span class="info-val">${info.states}</span></div>
    <div class="info-row"><span class="info-key">Ideal N-P-K (kg/ha):</span><span class="info-val">${info.N} – ${info.P} – ${info.K}</span></div>
    <div class="info-row"><span class="info-key">Ideal Temperature:</span><span class="info-val">${info.temperature}°C</span></div>
    <div class="info-row"><span class="info-key">Ideal Humidity:</span><span class="info-val">${info.humidity}%</span></div>
    <div class="info-row"><span class="info-key">Ideal Rainfall:</span><span class="info-val">${info.rainfall} mm/month</span></div>
  </div>` : ''}

  ${(landArea || farmLocation) ? `
  <div class="section">
    <div class="section-title">🗺️ Farm Details</div>
    ${landArea ? `<div class="info-row"><span class="info-key">Land Area:</span><span class="info-val">${landArea} ${landUnitObj?.label || ''} ≈ ${landInHa} Hectares</span></div>` : ''}
    ${farmLocation ? `<div class="info-row"><span class="info-key">Farm Location:</span><span class="info-val">${farmLocation.name}</span></div>
    <div class="info-row"><span class="info-key">Coordinates:</span><span class="info-val">${farmLocation.lat?.toFixed(4)}°N, ${farmLocation.lng?.toFixed(4)}°E</span></div>` : ''}
  </div>` : ''}

  <div class="section">
    <div class="section-title">💡 Advisory Notes</div>
    <p style="font-size:12px;color:#444;line-height:1.7">
      • This recommendation is generated by an AI model trained on 2200 agricultural data samples.<br/>
      • Always consult your local agricultural extension officer (Krishi Vigyan Kendra) before making final decisions.<br/>
      • Soil test results from a certified lab will further improve accuracy.<br/>
      • Input values (N, P, K, pH) should ideally come from a soil test report.
    </p>
  </div>

  <div class="footer">
    <strong>AgroGuardian</strong> — Smart Farming for Every Indian Farmer 🇮🇳
    <div class="watermark">This report is computer-generated. For official use, please verify with a certified agronomist.</div>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type:'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) { setTimeout(() => win.print(), 800); }
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function Crop() {
  const [lang, setLang]                     = useState('en');
  const [formData, setFormData]             = useState(EMPTY);
  const [landArea, setLandArea]             = useState('');
  const [landUnit, setLandUnit]             = useState('hectare');
  const [prediction, setPrediction]         = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [activePreset, setActivePreset]     = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [farmLocation, setFarmLocation]     = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults]   = useState([]);
  const [mapLoaded, setMapLoaded]           = useState(false);
  const [showMap, setShowMap]               = useState(false);
  const [activeTab, setActiveTab]           = useState('soil');
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [cropSearch, setCropSearch]         = useState('');
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markerRef   = useRef(null);
  const t = LANGUAGES[lang];

  const cropList = Object.keys(CROP_DATA).sort();
  const filteredCrops = cropList.filter(c =>
    c.toLowerCase().includes(cropSearch.toLowerCase())
  );

  // ── Load MapTiler ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.maptilersdk) { setMapLoaded(true); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.umd.min.js';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showMap || !mapLoaded || !mapRef.current || mapInstance.current) return;
    const sdk = window.maptilersdk;
    sdk.config.apiKey = MAPTILER_KEY;
    const map = new sdk.Map({
      container: mapRef.current,
      style: sdk.MapStyle.OUTDOOR,
      center: farmLocation ? [farmLocation.lng, farmLocation.lat] : [78.9629, 20.5937],
      zoom: farmLocation ? 12 : 4,
    });
    mapInstance.current = map;
    map.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      placeMarker(map, lng, lat);
      try {
        const res  = await fetch(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`);
        const data = await res.json();
        const name = data.features?.[0]?.place_name || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
        setFarmLocation({ lat, lng, name });
        setLocationSearch(name);
      } catch {
        setFarmLocation({ lat, lng, name:`${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E` });
      }
    });
    return () => { map.remove(); mapInstance.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap, mapLoaded]);

  const placeMarker = (map, lng, lat) => {
    const sdk = window.maptilersdk;
    if (markerRef.current) markerRef.current.remove();
    const el = document.createElement('div');
    el.className = 'farm-marker'; el.innerHTML = '📍';
    markerRef.current = new sdk.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
    map.flyTo({ center: [lng, lat], zoom: 13, duration: 1200 });
  };

  // ── Location search ───────────────────────────────────────────────────────
  const doSearch = useCallback(async (q) => {
    if (q.length < 3) { setSearchResults([]); return; }
    try {
      const res  = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${MAPTILER_KEY}&limit=5`);
      const data = await res.json();
      setSearchResults(data.features || []);
    } catch { setSearchResults([]); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(locationSearch), 400);
    return () => clearTimeout(timer);
  }, [locationSearch, doSearch]);

  const selectSearchResult = (feature) => {
    const [lng, lat] = feature.center;
    setFarmLocation({ lat, lng, name: feature.place_name });
    setLocationSearch(feature.place_name);
    setSearchResults([]);
    if (mapInstance.current) placeMarker(mapInstance.current, lng, lat);
  };

  // ── Apply crop preset from selector ──────────────────────────────────────
  const applyCropPreset = (cropKey) => {
    const c = CROP_DATA[cropKey];
    setFormData({
      nitrogen:    String(c.N),
      phosphorus:  String(c.P),
      potassium:   String(c.K),
      temperature: String(c.temperature),
      humidity:    String(c.humidity),
      ph:          String(c.ph),
      rainfall:    String(c.rainfall),
    });
    setActivePreset(cropKey);
    setShowCropSelector(false);
    setCropSearch('');
    setPrediction(null); setError(null);
  };

  const applySeason = (s) => {
    setFormData(prev => ({ ...prev, temperature:s.temp, humidity:s.humidity, rainfall:s.rainfall }));
  };

  const autoFillWeather = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const res  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`);
        const data = await res.json();
        const c    = data.current;
        setFormData(prev => ({
          ...prev,
          temperature: String(Math.round(c.temperature_2m)),
          humidity:    String(Math.round(c.relative_humidity_2m)),
          rainfall:    String(Math.round(c.precipitation * 30)),
        }));
        const gR   = await fetch(`https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${MAPTILER_KEY}`);
        const gD   = await gR.json();
        const name = gD.features?.[0]?.place_name || `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        setFarmLocation({ lat, lng: lon, name });
        setLocationSearch(name);
      } catch { alert('Could not fetch weather. Please fill manually.'); }
      finally   { setWeatherLoading(false); }
    }, () => { alert('Location permission denied.'); setWeatherLoading(false); });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setActivePreset(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setPrediction(null);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          ...formData,
          land_area: landArea ? parseFloat(landArea) * (LAND_UNITS.find(u=>u.value===landUnit)?.toHectare||1) : null,
          land_unit: landUnit,
          location: farmLocation,
        }),
      });
      const data = await response.json();
      if (data.success) setPrediction(data);
      else setError(data.error || 'Prediction failed');
    } catch {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    setFormData(EMPTY); setPrediction(null); setError(null);
    setActivePreset(null); setLandArea(''); setFarmLocation(null);
    setLocationSearch(''); setShowCropSelector(false); setCropSearch('');
  };

  const filled   = Object.values(formData).filter(Boolean).length;
  const total    = Object.keys(formData).length;
  const progress = Math.round((filled / total) * 100);

  const predCropKey  = prediction?.prediction?.toLowerCase();
  const cropInfo     = CROP_DATA[predCropKey];
  const cropEmoji    = cropInfo?.emoji || '🌱';

  const landInHectares = landArea
    ? (parseFloat(landArea) * (LAND_UNITS.find(u=>u.value===landUnit)?.toHectare||1)).toFixed(3)
    : null;

  return (
    <div className="crop-container" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/crop-bg.jpg)` }}>
      <div className="crop-overlay" />
      <div className="particles" aria-hidden="true">
        {[...Array(12)].map((_,i) => <div key={i} className={`particle particle-${i+1}`}/>)}
      </div>

      <div className="crop-content">

        {/* ── Header ── */}
        <header className="crop-header">
          <div className="header-badge">🌿 AgroGuardian AI</div>
          <h1 className="crop-title">{t.title}</h1>
          <p className="crop-subtitle">{t.subtitle}</p>
          <div className="lang-switcher">
            {Object.entries(LANGUAGES).map(([code, l]) => (
              <button key={code} className={`lang-btn ${lang===code?'active':''}`}
                onClick={() => setLang(code)} type="button">
                {l.flag} {l.name}
              </button>
            ))}
          </div>
        </header>

        {/* ── Crop Selector (22 crops) ── */}
        <div className="presets-section">
          <div className="section-label">
            <span className="step-badge">01</span>
            <span>{t.step1} <em>— {t.step1sub}</em></span>
          </div>

          <button
            type="button"
            className={`crop-selector-toggle ${showCropSelector ? 'active' : ''}`}
            onClick={() => setShowCropSelector(v => !v)}
          >
            {activePreset
              ? <>{CROP_DATA[activePreset]?.icon} {activePreset.charAt(0).toUpperCase()+activePreset.slice(1)} selected ✓</>
              : <>{t.cropSelector} ▾</>
            }
          </button>

          {showCropSelector && (
            <div className="crop-selector-panel">
              <input
                className="crop-search-input"
                type="text"
                placeholder="Search crop..."
                value={cropSearch}
                onChange={e => setCropSearch(e.target.value)}
                autoFocus
              />
              <div className="crop-selector-grid">
                {filteredCrops.map(cropKey => {
                  const c = CROP_DATA[cropKey];
                  return (
                    <button
                      key={cropKey} type="button"
                      className={`crop-card ${activePreset===cropKey?'active':''}`}
                      onClick={() => applyCropPreset(cropKey)}
                    >
                      <span className="crop-card-icon">{c.icon}</span>
                      <span className="crop-card-name">
                        {cropKey.charAt(0).toUpperCase()+cropKey.slice(1)}
                      </span>
                      <span className="crop-card-npk">N{c.N}·P{c.P}·K{c.K}</span>
                      {activePreset === cropKey && <span className="crop-card-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Progress ── */}
        <div className="progress-wrap">
          <div className="progress-label">
            <span>{filled} / {total} {t.fieldsOf}</span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width:`${progress}%` }}>
              <div className="progress-glow"/>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tab-bar">
          {[
            { id:'soil',    icon:'🧪', label:t.step2 },
            { id:'climate', icon:'🌡️', label:t.step3 },
            { id:'land',    icon:'🗺️', label:t.step4 },
          ].map(tab => (
            <button key={tab.id} type="button"
              className={`tab-btn ${activeTab===tab.id?'active':''}`}
              onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span> {tab.label}
              {tab.id==='soil'    && filled>=4 && <span className="tab-done">✓</span>}
              {tab.id==='climate' && formData.temperature && formData.humidity && formData.rainfall && <span className="tab-done">✓</span>}
              {tab.id==='land'    && (farmLocation||landArea) && <span className="tab-done">✓</span>}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="crop-form">

          {/* ══ SOIL TAB ══ */}
          {activeTab==='soil' && (
            <div className="tab-panel animated-in">
              <div className="step-header">
                <span className="step-badge">02</span>
                <h3 className="section-title">🧪 {t.step2}</h3>
              </div>
              <div className="inputs-grid-2">
                {[
                  { name:"nitrogen",   label:t.nitrogen,   placeholder:"e.g. 80",  hint:"0–140 kg/ha" },
                  { name:"phosphorus", label:t.phosphorus, placeholder:"e.g. 48",  hint:"5–145 kg/ha" },
                  { name:"potassium",  label:t.potassium,  placeholder:"e.g. 40",  hint:"5–205 kg/ha" },
                  { name:"ph",         label:t.ph,         placeholder:"e.g. 6.5", hint:"3.5–9.5", step:"0.01", min:"0", max:"14" },
                ].map(f => (
                  <div className="input-group" key={f.name}>
                    <label htmlFor={f.name}>
                      {f.label}<span className="input-hint">{f.hint}</span>
                    </label>
                    <div className="input-wrap">
                      <input type="number" id={f.name} name={f.name}
                        value={formData[f.name]} onChange={handleChange}
                        placeholder={f.placeholder} required
                        step={f.step||"1"} min={f.min||"0"} max={f.max} />
                      {formData[f.name] && <span className="input-check">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="tab-next-btn" onClick={() => setActiveTab('climate')}>
                Next: {t.step3} →
              </button>
            </div>
          )}

          {/* ══ CLIMATE TAB ══ */}
          {activeTab==='climate' && (
            <div className="tab-panel animated-in">
              <div className="step-header">
                <span className="step-badge">03</span>
                <h3 className="section-title">🌡️ {t.step3}</h3>
              </div>
              <div className="season-row">
                <span className="season-label">{t.quickSeason}:</span>
                <div className="season-chips">
                  {SEASONS.map((s,i) => (
                    <button key={i} type="button" className="season-chip" onClick={() => applySeason(s)}>{s.label}</button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-weather-auto" onClick={autoFillWeather} disabled={weatherLoading}>
                {weatherLoading ? t.fetching : t.autoWeather}
              </button>
              <div className="inputs-grid-2" style={{marginTop:'1rem'}}>
                {[
                  { name:"temperature", label:t.temperature, placeholder:"e.g. 25", hint:"Avg. monthly °C" },
                  { name:"humidity",    label:t.humidity,    placeholder:"e.g. 80",  hint:"0–100%", max:"100" },
                  { name:"rainfall",    label:t.rainfall,    placeholder:"e.g. 200", hint:"Monthly avg. mm" },
                ].map(f => (
                  <div className="input-group" key={f.name}>
                    <label htmlFor={f.name}>
                      {f.label}<span className="input-hint">{f.hint}</span>
                    </label>
                    <div className="input-wrap">
                      <input type="number" id={f.name} name={f.name}
                        value={formData[f.name]} onChange={handleChange}
                        placeholder={f.placeholder} required
                        step="0.1" min="0" max={f.max} />
                      {formData[f.name] && <span className="input-check">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="tab-nav-btns">
                <button type="button" className="tab-back-btn" onClick={() => setActiveTab('soil')}>← {t.step2}</button>
                <button type="button" className="tab-next-btn" onClick={() => setActiveTab('land')}>Next: {t.step4} →</button>
              </div>
            </div>
          )}

          {/* ══ LAND TAB ══ */}
          {activeTab==='land' && (
            <div className="tab-panel animated-in">
              <div className="step-header">
                <span className="step-badge">04</span>
                <h3 className="section-title">🗺️ {t.step4} <em className="optional-tag">({t.optional})</em></h3>
              </div>

              <div className="land-area-row">
                <div className="input-group" style={{flex:1}}>
                  <label htmlFor="landArea">
                    {t.landArea}
                    {landInHectares && landUnit!=='hectare' &&
                      <span className="input-hint">≈ {landInHectares} ha</span>}
                  </label>
                  <div className="input-wrap">
                    <input type="number" id="landArea"
                      value={landArea} onChange={e => setLandArea(e.target.value)}
                      placeholder="e.g. 2.5" step="0.001" min="0" />
                    {landArea && <span className="input-check">✓</span>}
                  </div>
                </div>
                <div className="input-group" style={{flex:1}}>
                  <label htmlFor="landUnit">{t.landUnit}</label>
                  <select id="landUnit" value={landUnit}
                    onChange={e => setLandUnit(e.target.value)} className="unit-select">
                    {LAND_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Location search */}
              <div className="location-section">
                <label className="loc-label">📍 {t.location}</label>
                <p className="loc-helper">Type village, block, district, or state — or click the map pin</p>
                <div className="location-search-wrap">
                  <input type="text" className="location-input"
                    placeholder={t.searchLocation}
                    value={locationSearch}
                    onChange={e => setLocationSearch(e.target.value)} />
                  {locationSearch && (
                    <button type="button" className="loc-clear"
                      onClick={() => { setLocationSearch(''); setSearchResults([]); setFarmLocation(null); }}>✕</button>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <div className="search-dropdown">
                    {searchResults.map((f,i) => (
                      <button key={i} type="button" className="search-result-item" onClick={() => selectSearchResult(f)}>
                        <span className="result-icon">📌</span>
                        <div>
                          <div className="result-name">{f.text}</div>
                          <div className="result-place">{f.place_name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {farmLocation && (
                  <div className="location-badge">
                    <span>📍</span>
                    <div>
                      <div className="loc-name">{farmLocation.name}</div>
                      <div className="loc-coords">{farmLocation.lat?.toFixed(4)}°N, {farmLocation.lng?.toFixed(4)}°E</div>
                    </div>
                  </div>
                )}
                <button type="button" className="map-toggle-btn" onClick={() => setShowMap(v => !v)}>
                  {showMap ? '🗺️ Hide Map' : `🗺️ Open Map — ${t.clickMap}`}
                </button>
                {showMap && (
                  <div className="map-container-wrap">
                    <div ref={mapRef} className="map-container"/>
                    {!mapLoaded && (
                      <div className="map-loading">
                        <div className="map-spinner"/><span>Loading map…</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="tab-nav-btns">
                <button type="button" className="tab-back-btn" onClick={() => setActiveTab('climate')}>← {t.step3}</button>
              </div>
            </div>
          )}

          {/* ── Submit Bar ── */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading || filled < total}>
              {loading
                ? <><span className="spinner"/> {t.analyzing}</>
                : <><span>🔍</span> {t.getBtn}</>
              }
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <span>↺</span> {t.reset}
            </button>
          </div>
          {filled < total && (
            <p className="fill-warning">
              ⚠️ Please fill all {total - filled} remaining field{total-filled>1?'s':''} before submitting.
            </p>
          )}
        </form>

        {/* ── Error ── */}
        {error && (
          <div className="result-card error-card">
            <div className="result-icon">⚠️</div>
            <h3>{t.errorTitle}</h3>
            <p>{error}</p>
          </div>
        )}

        {/* ── Result ── */}
        {prediction && (
          <div className="result-card success-card">
            <div className="result-glow"/>
            <div className="result-icon big-bounce">{cropEmoji}</div>
            <div className="result-label">{t.recommended}</div>

            {/* FIX 1: Crop name now bold and clearly visible */}
            <div className="crop-name">{prediction.prediction?.toUpperCase()}</div>

            {/* FIX 2: Confidence with real interpretation */}
            {prediction.confidence != null && (
              <div className="confidence-wrap">
                <div className="confidence-bar-bg">
                  <div className="confidence-bar-fill"
                    style={{ width:`${Math.min(prediction.confidence,100)}%` }}/>
                </div>
                <span className="confidence-text">
                  {t.confidence}: <strong>{prediction.confidence.toFixed(1)}%</strong>
                  <span className="conf-badge" style={{
                    background: prediction.confidence>=75?'#2e7d32':prediction.confidence>=50?'#f57f17':'#b71c1c',
                    color:'#fff', padding:'2px 10px', borderRadius:'20px', fontSize:'0.75rem', marginLeft:'8px'
                  }}>
                    {prediction.confidence>=75?'High ✓':prediction.confidence>=50?'Moderate':'Low — check inputs'}
                  </span>
                </span>
              </div>
            )}

            {/* Crop Info Card */}
            {cropInfo && (
              <div className="crop-info-card">
                <div className="crop-info-title">🌾 {t.cropInfo}</div>
                <p className="crop-info-desc">{cropInfo.desc}</p>
                <div className="crop-info-grid">
                  <div className="crop-info-item">
                    <span className="crop-info-key">🌍 {t.soilType}</span>
                    <span className="crop-info-val">{cropInfo.soilType}</span>
                  </div>
                  <div className="crop-info-item">
                    <span className="crop-info-key">📅 {t.season}</span>
                    <span className="crop-info-val">{cropInfo.season}</span>
                  </div>
                  <div className="crop-info-item" style={{gridColumn:'1/-1'}}>
                    <span className="crop-info-key">📍 {t.states}</span>
                    <span className="crop-info-val">{cropInfo.states}</span>
                  </div>
                  <div className="crop-info-item">
                    <span className="crop-info-key">🌡️ Ideal Temp</span>
                    <span className="crop-info-val">{cropInfo.temperature}°C</span>
                  </div>
                  <div className="crop-info-item">
                    <span className="crop-info-key">💧 Ideal Rainfall</span>
                    <span className="crop-info-val">{cropInfo.rainfall} mm</span>
                  </div>
                </div>
              </div>
            )}

            <div className="result-details">
              <p className="details-title">{t.basedOn}:</p>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">{t.soilSummary} N-P-K</span>
                  <span className="detail-value">{prediction.input.nitrogen}-{prediction.input.phosphorus}-{prediction.input.potassium}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t.temperature}</span>
                  <span className="detail-value">{prediction.input.temperature}°C</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t.humidity}</span>
                  <span className="detail-value">{prediction.input.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t.ph}</span>
                  <span className="detail-value">{prediction.input.ph}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t.rainfall}</span>
                  <span className="detail-value">{prediction.input.rainfall} mm</span>
                </div>
                {landArea && (
                  <div className="detail-item">
                    <span className="detail-label">{t.landSummary}</span>
                    <span className="detail-value">{landArea} {LAND_UNITS.find(u=>u.value===landUnit)?.label}</span>
                  </div>
                )}
                {farmLocation && (
                  <div className="detail-item" style={{gridColumn:'1/-1'}}>
                    <span className="detail-label">📍 {t.location}</span>
                    <span className="detail-value" style={{fontSize:'0.9rem'}}>{farmLocation.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── PDF Download ── */}
            <button
              type="button"
              className="btn-download-pdf"
              onClick={() => generatePDF(prediction, formData, landArea, landUnit, farmLocation, cropInfo, t)}
            >
              {t.downloadPDF}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
