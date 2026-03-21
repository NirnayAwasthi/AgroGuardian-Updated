import React, { useState } from "react";
import "./FarmMonitor.css";

function FarmMonitor() {
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("dashboard");
  const API_KEY = "cb7257e0724e82c018463c5541017000";

  // Multilingual translations
  const translations = {
    en: {
      title: "🛰️ Farm Monitor",
      subtitle: "Real-time satellite monitoring of your agricultural land",
      dashboard: "Dashboard",
      satellite: "Satellite View",
      weather: "Weather Data",
      ndvi: "NDVI Analysis",
      soil: "Soil Conditions",
      dashboardDesc: "Get a comprehensive view of your farm with satellite imagery, weather data, and crop health indices.",
      satelliteDesc: "View your farm boundaries (polygons) in real-time using high-resolution satellite imagery.",
      weatherDesc: "Access current weather conditions, forecasts, and historical weather data for your farm location.",
      ndviDesc: "Monitor vegetation health using NDVI (Normalized Difference Vegetation Index) from satellite data.",
      soilDesc: "Track soil moisture, temperature, and other essential parameters for optimal crop growth.",
      features: {
        realTime: "Real-time Updates",
        historical: "Historical Data",
        alerts: "Weather Alerts",
        multiLayer: "Multi-layer Maps",
        ndviTrack: "NDVI Tracking",
        freeAccess: "Free API Access",
      },
      instructions: {
        title: "How to Use Farm Monitor",
        step1: "Click on 'Dashboard' to access the AgroMonitoring platform",
        step2: "Create a free account or login if you already have one",
        step3: "Click 'Add Polygon' to draw your farm boundaries on the map",
        step4: "Name your polygon and save it",
        step5: "View satellite images, NDVI, weather, and soil data for your farm",
        step6: "Set up alerts for weather events and crop health changes",
      },
      quickLinks: "Quick Access Links",
      viewDashboard: "View Dashboard",
      createPolygon: "Create Farm Polygon",
      viewWeather: "View Weather",
      viewSatellite: "View Satellite Images",
    },
    hi: {
      title: "🛰️ खेत की निगरानी",
      subtitle: "आपकी कृषि भूमि की वास्तविक समय उपग्रह निगरानी",
      dashboard: "डैशबोर्ड",
      satellite: "उपग्रह दृश्य",
      weather: "मौसम डेटा",
      ndvi: "NDVI विश्लेषण",
      soil: "मिट्टी की स्थिति",
      dashboardDesc: "उपग्रह इमेजरी, मौसम डेटा और फसल स्वास्थ्य सूचकांकों के साथ अपने खेत का व्यापक दृश्य प्राप्त करें।",
      satelliteDesc: "उच्च-रिज़ॉल्यूशन उपग्रह इमेजरी का उपयोग करके वास्तविक समय में अपने खेत की सीमाओं (बहुभुज) को देखें।",
      weatherDesc: "अपने खेत के स्थान के लिए वर्तमान मौसम की स्थिति, पूर्वानुमान और ऐतिहासिक मौसम डेटा तक पहुंचें।",
      ndviDesc: "उपग्रह डेटा से NDVI (सामान्यीकृत अंतर वनस्पति सूचकांक) का उपयोग करके वनस्पति स्वास्थ्य की निगरानी करें।",
      soilDesc: "इष्टतम फसल वृद्धि के लिए मिट्टी की नमी, तापमान और अन्य आवश्यक मापदंडों को ट्रैक करें।",
      features: {
        realTime: "वास्तविक समय अपडेट",
        historical: "ऐतिहासिक डेटा",
        alerts: "मौसम चेतावनी",
        multiLayer: "बहु-परत मानचित्र",
        ndviTrack: "NDVI ट्रैकिंग",
        freeAccess: "मुफ्त API पहुंच",
      },
      instructions: {
        title: "खेत मॉनिटर का उपयोग कैसे करें",
        step1: "एग्रोमॉनिटरिंग प्लेटफॉर्म तक पहुंचने के लिए 'डैशबोर्ड' पर क्लिक करें",
        step2: "एक मुफ्त खाता बनाएं या यदि आपके पास पहले से है तो लॉगिन करें",
        step3: "मानचित्र पर अपने खेत की सीमाएं खींचने के लिए 'पॉलीगॉन जोड़ें' पर क्लिक करें",
        step4: "अपने बहुभुज को नाम दें और इसे सहेजें",
        step5: "अपने खेत के लिए उपग्रह छवियां, NDVI, मौसम और मिट्टी डेटा देखें",
        step6: "मौसम की घटनाओं और फसल स्वास्थ्य परिवर्तनों के लिए अलर्ट सेट करें",
      },
      quickLinks: "त्वरित पहुंच लिंक",
      viewDashboard: "डैशबोर्ड देखें",
      createPolygon: "खेत बहुभुज बनाएं",
      viewWeather: "मौसम देखें",
      viewSatellite: "उपग्रह चित्र देखें",
    },
    pa: {
      title: "🛰️ ਖੇਤ ਦੀ ਨਿਗਰਾਨੀ",
      subtitle: "ਤੁਹਾਡੀ ਖੇਤੀ ਜ਼ਮੀਨ ਦੀ ਰੀਅਲ-ਟਾਈਮ ਸੈਟੇਲਾਈਟ ਨਿਗਰਾਨੀ",
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      satellite: "ਸੈਟੇਲਾਈਟ ਦ੍ਰਿਸ਼",
      weather: "ਮੌਸਮ ਡੇਟਾ",
      ndvi: "NDVI ਵਿਸ਼ਲੇਸ਼ਣ",
      soil: "ਮਿੱਟੀ ਦੀਆਂ ਸਥਿਤੀਆਂ",
      dashboardDesc: "ਸੈਟੇਲਾਈਟ ਇਮੇਜਰੀ, ਮੌਸਮ ਡੇਟਾ ਅਤੇ ਫਸਲ ਸਿਹਤ ਸੂਚਕਾਂਕਾਂ ਨਾਲ ਆਪਣੇ ਖੇਤ ਦਾ ਵਿਆਪਕ ਦ੍ਰਿਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ।",
      satelliteDesc: "ਉੱਚ-ਰੈਜ਼ੋਲੂਸ਼ਨ ਸੈਟੇਲਾਈਟ ਇਮੇਜਰੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਆਪਣੇ ਖੇਤ ਦੀਆਂ ਸੀਮਾਵਾਂ (ਬਹੁਭੁਜ) ਦੇਖੋ।",
      weatherDesc: "ਆਪਣੇ ਖੇਤ ਦੇ ਸਥਾਨ ਲਈ ਮੌਜੂਦਾ ਮੌਸਮ ਦੀਆਂ ਸਥਿਤੀਆਂ, ਪੂਰਵ ਅਨੁਮਾਨ ਅਤੇ ਇਤਿਹਾਸਕ ਮੌਸਮ ਡੇਟਾ ਤੱਕ ਪਹੁੰਚ ਕਰੋ।",
      ndviDesc: "ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਤੋਂ NDVI (ਸਧਾਰਣ ਅੰਤਰ ਬਨਸਪਤੀ ਸੂਚਕਾਂਕ) ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਬਨਸਪਤੀ ਸਿਹਤ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।",
      soilDesc: "ਸਰਵੋਤਮ ਫਸਲ ਵਾਧੇ ਲਈ ਮਿੱਟੀ ਦੀ ਨਮੀ, ਤਾਪਮਾਨ ਅਤੇ ਹੋਰ ਜ਼ਰੂਰੀ ਮਾਪਦੰਡਾਂ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ।",
      features: {
        realTime: "ਰੀਅਲ-ਟਾਈਮ ਅੱਪਡੇਟ",
        historical: "ਇਤਿਹਾਸਕ ਡੇਟਾ",
        alerts: "ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ",
        multiLayer: "ਬਹੁ-ਪਰਤ ਨਕਸ਼ੇ",
        ndviTrack: "NDVI ਟ੍ਰੈਕਿੰਗ",
        freeAccess: "ਮੁਫਤ API ਪਹੁੰਚ",
      },
      instructions: {
        title: "ਖੇਤ ਮਾਨੀਟਰ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ",
        step1: "ਐਗਰੋਮੋਨੀਟਰਿੰਗ ਪਲੇਟਫਾਰਮ ਤੱਕ ਪਹੁੰਚਣ ਲਈ 'ਡੈਸ਼ਬੋਰਡ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ",
        step2: "ਇੱਕ ਮੁਫਤ ਖਾਤਾ ਬਣਾਓ ਜਾਂ ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਪਹਿਲਾਂ ਹੀ ਹੈ ਤਾਂ ਲੌਗਇਨ ਕਰੋ",
        step3: "ਨਕਸ਼ੇ 'ਤੇ ਆਪਣੇ ਖੇਤ ਦੀਆਂ ਸੀਮਾਵਾਂ ਖਿੱਚਣ ਲਈ 'ਬਹੁਭੁਜ ਸ਼ਾਮਲ ਕਰੋ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ",
        step4: "ਆਪਣੇ ਬਹੁਭੁਜ ਨੂੰ ਨਾਮ ਦਿਓ ਅਤੇ ਇਸਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰੋ",
        step5: "ਆਪਣੇ ਖੇਤ ਲਈ ਸੈਟੇਲਾਈਟ ਚਿੱਤਰ, NDVI, ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਡੇਟਾ ਦੇਖੋ",
        step6: "ਮੌਸਮ ਦੀਆਂ ਘਟਨਾਵਾਂ ਅਤੇ ਫਸਲ ਸਿਹਤ ਤਬਦੀਲੀਆਂ ਲਈ ਅਲਰਟ ਸੈਟ ਕਰੋ",
      },
      quickLinks: "ਤੇਜ਼ ਪਹੁੰਚ ਲਿੰਕ",
      viewDashboard: "ਡੈਸ਼ਬੋਰਡ ਦੇਖੋ",
      createPolygon: "ਖੇਤ ਬਹੁਭੁਜ ਬਣਾਓ",
      viewWeather: "ਮੌਸਮ ਦੇਖੋ",
      viewSatellite: "ਸੈਟੇਲਾਈਟ ਚਿੱਤਰ ਦੇਖੋ",
    },
    ta: {
      title: "🛰️ பண்ணை கண்காணிப்பு",
      subtitle: "உங்கள் விவசாய நிலத்தின் நேரடி செயற்கைக்கோள் கண்காணிப்பு",
      dashboard: "டாஷ்போர்டு",
      satellite: "செயற்கைக்கோள் பார்வை",
      weather: "வானிலை தரவு",
      ndvi: "NDVI பகுப்பாய்வு",
      soil: "மண் நிலைமைகள்",
      dashboardDesc: "செயற்கைக்கோள் படங்கள், வானிலை தரவு மற்றும் பயிர் ஆரோக்கிய குறியீடுகளுடன் உங்கள் பண்ணையின் விரிவான பார்வையைப் பெறுங்கள்.",
      satelliteDesc: "உயர்-தெளிவுத்திறன் செயற்கைக்கோள் படங்களைப் பயன்படுத்தி நேரடியாக உங்கள் பண்ணை எல்லைகளை (பலகோணங்கள்) பார்க்கவும்.",
      weatherDesc: "உங்கள் பண்ணை இருப்பிடத்திற்கான தற்போதைய வானிலை நிலைமைகள், முன்னறிவிப்புகள் மற்றும் வரலாற்று வானிலை தரவை அணுகவும்.",
      ndviDesc: "செயற்கைக்கோள் தரவிலிருந்து NDVI (இயல்புநிலை வேறுபாடு தாவர குறியீடு) ஐப் பயன்படுத்தி தாவர ஆரோக்கியத்தை கண்காணிக்கவும்.",
      soilDesc: "உகந்த பயிர் வளர்ச்சிக்கு மண் ஈரப்பதம், வெப்பநிலை மற்றும் பிற அத்தியாவசிய அளவுருக்களைக் கண்காணிக்கவும்.",
      features: {
        realTime: "நேரடி புதுப்பிப்புகள்",
        historical: "வரலாற்று தரவு",
        alerts: "வானிலை எச்சரிக்கைகள்",
        multiLayer: "பல-அடுக்கு வரைபடங்கள்",
        ndviTrack: "NDVI கண்காணிப்பு",
        freeAccess: "இலவச API அணுகல்",
      },
      instructions: {
        title: "பண்ணை கண்காணிப்பு எவ்வாறு பயன்படுத்துவது",
        step1: "AgroMonitoring தளத்தை அணுக 'டாஷ்போர்டு' என்பதைக் கிளிக் செய்யவும்",
        step2: "ஒரு இலவச கணக்கை உருவாக்கவும் அல்லது ஏற்கனவே இருந்தால் உள்நுழையவும்",
        step3: "வரைபடத்தில் உங்கள் பண்ணை எல்லைகளை வரைய 'பலகோணத்தைச் சேர்' என்பதைக் கிளிக் செய்யவும்",
        step4: "உங்கள் பலகோணத்திற்கு பெயரிட்டு அதைச் சேமிக்கவும்",
        step5: "உங்கள் பண்ணைக்கான செயற்கைக்கோள் படங்கள், NDVI, வானிலை மற்றும் மண் தரவைப் பார்க்கவும்",
        step6: "வானிலை நிகழ்வுகள் மற்றும் பயிர் ஆரோக்கிய மாற்றங்களுக்கான எச்சரிக்கைகளை அமைக்கவும்",
      },
      quickLinks: "விரைவு அணுகல் இணைப்புகள்",
      viewDashboard: "டாஷ்போர்டைப் பார்க்கவும்",
      createPolygon: "பண்ணை பலகோணத்தை உருவாக்கவும்",
      viewWeather: "வானிலையைப் பார்க்கவும்",
      viewSatellite: "செயற்கைக்கோள் படங்களைப் பார்க்கவும்",
    },
  };

  const t = translations[language];

  const dashboardUrl = `https://home.agromonitoring.com/dashboard/polygons?appid=${API_KEY}`;
  const weatherUrl = `https://home.agromonitoring.com/dashboard/weather?appid=${API_KEY}`;
  const satelliteUrl = `https://home.agromonitoring.com/dashboard/satellite?appid=${API_KEY}`;

  return (
    <div className="farm-monitor-container">
      <div className="farm-monitor-overlay"></div>

      {/* Language Selector */}
      <div className="language-selector-monitor">
        <button
          className={language === "en" ? "active" : ""}
          onClick={() => setLanguage("en")}
        >
          English
        </button>
        <button
          className={language === "hi" ? "active" : ""}
          onClick={() => setLanguage("hi")}
        >
          हिंदी
        </button>
        <button
          className={language === "pa" ? "active" : ""}
          onClick={() => setLanguage("pa")}
        >
          ਪੰਜਾਬੀ
        </button>
        <button
          className={language === "ta" ? "active" : ""}
          onClick={() => setLanguage("ta")}
        >
          தமிழ்
        </button>
      </div>

      <div className="farm-monitor-content">
        {/* Header */}
        <div className="monitor-header">
          <h1 className="monitor-title">{t.title}</h1>
          <p className="monitor-subtitle">{t.subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-text">{t.features.realTime}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-text">{t.features.historical}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <div className="feature-text">{t.features.alerts}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <div className="feature-text">{t.features.multiLayer}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <div className="feature-text">{t.features.ndviTrack}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🆓</div>
            <div className="feature-text">{t.features.freeAccess}</div>
          </div>
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

        {/* Content Area */}
        {activeTab === "dashboard" && (
          <div className="dashboard-section">
            <div className="iframe-container">
              <iframe
                src={dashboardUrl}
                title="AgroMonitoring Dashboard"
                className="monitor-iframe"
                allowFullScreen
              />
            </div>

            {/* Quick Links */}
            <div className="quick-links">
              <h3>{t.quickLinks}</h3>
              <div className="links-grid">
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  <span className="link-icon">📊</span>
                  <span className="link-text">{t.viewDashboard}</span>
                </a>
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  <span className="link-icon">✏️</span>
                  <span className="link-text">{t.createPolygon}</span>
                </a>
                <a
                  href={weatherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  <span className="link-icon">🌤️</span>
                  <span className="link-text">{t.viewWeather}</span>
                </a>
                <a
                  href={satelliteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  <span className="link-icon">🛰️</span>
                  <span className="link-text">{t.viewSatellite}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "instructions" && (
          <div className="instructions-section">
            <div className="instructions-card">
              <h2>{t.instructions.title}</h2>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <p>{t.instructions.step1}</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <p>{t.instructions.step2}</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <p>{t.instructions.step3}</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <p>{t.instructions.step4}</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <p>{t.instructions.step5}</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <p>{t.instructions.step6}</p>
                  </div>
                </div>
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
