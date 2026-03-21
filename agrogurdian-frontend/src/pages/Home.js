import { Link } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import "./Home.css";

function Home() {
  const user = auth.currentUser;
  const userName = user?.displayName || "Farmer";
  const [language, setLanguage] = useState("en");

  const translations = {
    en: {
      welcome: "Welcome",
      explore: "Explore our smart farming solutions designed to help you grow better",
      dashboard: "Smart Agriculture Dashboard",
      dashboardDesc: "Leverage cutting-edge technology to make data-driven decisions and optimize your farming operations",
      cropTitle: "Crop Recommendation",
      cropDesc: "Get intelligent crop suggestions based on soil conditions, climate, and market trends using advanced machine learning algorithms.",
      cropFeatures: ["ML-powered analysis", "Soil & climate assessment", "Yield predictions"],
      diseaseTitle: "Plant Disease Detection",
      diseaseDesc: "Identify plant diseases instantly with our CNN-based EfficientNet model. Upload images for real-time diagnosis and treatment recommendations.",
      diseaseFeatures: ["CNN EfficientNet model", "Instant image analysis", "Treatment suggestions"],
      weatherTitle: "Weather Forecast",
      weatherDesc: "Plan your farming activities with accurate 5-day weather predictions. Get city-based forecasts with detailed metrics and alerts.",
      weatherFeatures: ["5-day predictions", "City-based forecasts", "Rainfall & temperature"],
      farmMonitorTitle: "Farm Monitor",
      farmMonitorDesc: "Track your farm in real-time using satellite imagery. Monitor crop health, vegetation index (NDVI), weather conditions, and soil moisture levels.",
      farmMonitorFeatures: ["Real-time satellite view", "NDVI vegetation index", "Weather & soil data"],
    },
    hi: {
      welcome: "स्वागत है",
      explore: "बेहतर फसल उगाने में मदद के लिए हमारे स्मार्ट खेती समाधानों का अन्वेषण करें",
      dashboard: "स्मार्ट कृषि डैशबोर्ड",
      dashboardDesc: "डेटा-संचालित निर्णय लेने और अपने खेती संचालन को अनुकूलित करने के लिए अत्याधुनिक तकनीक का लाभ उठाएं",
      cropTitle: "फसल की सिफारिश",
      cropDesc: "उन्नत मशीन लर्निंग एल्गोरिदम का उपयोग करके मिट्टी की स्थिति, जलवायु और बाजार के रुझानों के आधार पर बुद्धिमान फसल सुझाव प्राप्त करें।",
      cropFeatures: ["ML-संचालित विश्लेषण", "मिट्टी और जलवायु मूल्यांकन", "उपज की भविष्यवाणी"],
      diseaseTitle: "पौधों की बीमारी का पता लगाना",
      diseaseDesc: "हमारे CNN-आधारित EfficientNet मॉडल के साथ तुरंत पौधों की बीमारियों की पहचान करें।",
      diseaseFeatures: ["CNN EfficientNet मॉडल", "तत्काल छवि विश्लेषण", "उपचार सुझाव"],
      weatherTitle: "मौसम पूर्वानुमान",
      weatherDesc: "सटीक 5-दिवसीय मौसम भविष्यवाणियों के साथ अपनी खेती गतिविधियों की योजना बनाएं।",
      weatherFeatures: ["5-दिवसीय भविष्यवाणी", "शहर-आधारित पूर्वानुमान", "वर्षा और तापमान"],
      farmMonitorTitle: "खेत की निगरानी",
      farmMonitorDesc: "उपग्रह इमेजरी का उपयोग करके अपने खेत को वास्तविक समय में ट्रैक करें।",
      farmMonitorFeatures: ["रियल-टाइम उपग्रह दृश्य", "NDVI वनस्पति सूचकांक", "मौसम और मिट्टी डेटा"],
    },
    pa: {
      welcome: "ਸੁਆਗਤ ਹੈ",
      explore: "ਬਿਹਤਰ ਫਸਲ ਉਗਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਸਾਡੇ ਸਮਾਰਟ ਖੇਤੀ ਹੱਲਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ",
      dashboard: "ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਡੈਸ਼ਬੋਰਡ",
      dashboardDesc: "ਡੇਟਾ-ਸੰਚਾਲਿਤ ਫੈਸਲੇ ਲੈਣ ਅਤੇ ਆਪਣੀ ਖੇਤੀ ਦੇ ਸੰਚਾਲਨ ਨੂੰ ਅਨੁਕੂਲਿਤ ਕਰਨ ਲਈ ਅਤਿ-ਆਧੁਨਿਕ ਤਕਨਾਲੋਜੀ ਦਾ ਲਾਭ ਉਠਾਓ",
      cropTitle: "ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼",
      cropDesc: "ਉੱਨਤ ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਐਲਗੋਰਿਦਮ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋਏ ਬੁੱਧੀਮਾਨ ਫਸਲ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰੋ।",
      cropFeatures: ["ML-ਸੰਚਾਲਿਤ ਵਿਸ਼ਲੇਸ਼ਣ", "ਮਿੱਟੀ ਅਤੇ ਜਲਵਾਯੂ ਮੁਲਾਂਕਣ", "ਉਪਜ ਦੀ ਭਵਿੱਖਬਾਣੀ"],
      diseaseTitle: "ਪੌਦਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦਾ ਪਤਾ ਲਗਾਉਣਾ",
      diseaseDesc: "ਸਾਡੇ CNN-ਆਧਾਰਿਤ EfficientNet ਮਾਡਲ ਨਾਲ ਤੁਰੰਤ ਪੌਦਿਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਦੀ ਪਛਾਣ ਕਰੋ।",
      diseaseFeatures: ["CNN EfficientNet ਮਾਡਲ", "ਤਤਕਾਲ ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ", "ਇਲਾਜ ਸੁਝਾਅ"],
      weatherTitle: "ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ",
      weatherDesc: "ਸਹੀ 5-ਦਿਨ ਦੀ ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ ਨਾਲ ਆਪਣੀ ਖੇਤੀ ਦੀਆਂ ਗਤੀਵਿਧੀਆਂ ਦੀ ਯੋਜਨਾ ਬਣਾਓ।",
      weatherFeatures: ["5-ਦਿਨ ਦੀ ਭਵਿੱਖਬਾਣੀ", "ਸ਼ਹਿਰ-ਅਧਾਰਿਤ ਪੂਰਵ ਅਨੁਮਾਨ", "ਬਾਰਿਸ਼ ਅਤੇ ਤਾਪਮਾਨ"],
      farmMonitorTitle: "ਖੇਤ ਦੀ ਨਿਗਰਾਨੀ",
      farmMonitorDesc: "ਸੈਟੇਲਾਈਟ ਇਮੇਜਰੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਆਪਣੇ ਖੇਤ ਨੂੰ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਟ੍ਰੈਕ ਕਰੋ।",
      farmMonitorFeatures: ["ਰੀਅਲ-ਟਾਈਮ ਸੈਟੇਲਾਈਟ ਦ੍ਰਿਸ਼", "NDVI ਬਨਸਪਤੀ ਸੂਚਕਾਂਕ", "ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਡੇਟਾ"],
    },
    ta: {
      welcome: "வரவேற்கிறோம்",
      explore: "சிறந்த பயிர்களை வளர்க்க உதவும் எங்கள் ஸ்மார்ட் விவசாய தீர்வுகளை ஆராயுங்கள்",
      dashboard: "ஸ்மார்ட் விவசாய டாஷ்போர்டு",
      dashboardDesc: "தரவு சார்ந்த முடிவுகளை எடுக்கவும் உங்கள் விவசாய செயல்பாடுகளை மேம்படுத்தவும் அதிநவீன தொழில்நுட்பத்தைப் பயன்படுத்துங்கள்",
      cropTitle: "பயிர் பரிந்துரை",
      cropDesc: "மேம்பட்ட இயந்திர கற்றல் அல்காரிதம்களைப் பயன்படுத்தி அறிவார்ந்த பயிர் பரிந்துரைகளைப் பெறுங்கள்.",
      cropFeatures: ["ML-இயக்கப்படும் பகுப்பாய்வு", "மண் & காலநிலை மதிப்பீடு", "விளைச்சல் கணிப்புகள்"],
      diseaseTitle: "தாவர நோய் கண்டறிதல்",
      diseaseDesc: "எங்கள் CNN-அடிப்படையிலான EfficientNet மாதிரியுடன் தாவர நோய்களை உடனடியாக அடையாளம் காணுங்கள்.",
      diseaseFeatures: ["CNN EfficientNet மாதிரி", "உடனடி பட பகுப்பாய்வு", "சிகிச்சை பரிந்துரைகள்"],
      weatherTitle: "வானிலை முன்னறிவிப்பு",
      weatherDesc: "துல்லியமான 5-நாள் வானிலை கணிப்புகளுடன் உங்கள் விவசாய நடவடிக்கைகளைத் திட்டமிடுங்கள்.",
      weatherFeatures: ["5-நாள் கணிப்புகள்", "நகர அடிப்படையிலான முன்னறிவிப்புகள்", "மழை & வெப்பநிலை"],
      farmMonitorTitle: "பண்ணை கண்காணிப்பு",
      farmMonitorDesc: "செயற்கைக்கோள் படங்களைப் பயன்படுத்தி உங்கள் பண்ணையை நேரடியாக கண்காணிக்கவும்.",
      farmMonitorFeatures: ["நேரடி செயற்கைக்கோள் பார்வை", "NDVI தாவர குறியீடு", "வானிலை & மண் தரவு"],
    },
  };

  const t = translations[language];
  const bgUrl = `${process.env.PUBLIC_URL}/crops-bg.gif`;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
        paddingBottom: "1px",
      }}
    >
      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 0 }} />

      <div className="home-container" style={{ position: "relative", zIndex: 1 }}>
        {/* Language Selector */}
        <div className="language-selector-home">
          {["en", "hi", "pa", "ta"].map((lang) => (
            <button key={lang} className={language === lang ? "active" : ""} onClick={() => setLanguage(lang)}>
              {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : lang === "pa" ? "ਪੰਜਾਬੀ" : "தமிழ்"}
            </button>
          ))}
        </div>

        <div className="welcome-banner">
          <h2>{t.welcome}, {userName}! 👋</h2>
          <p>{t.explore}</p>
        </div>

        <div className="home-header">
          <h1 className="home-title">{t.dashboard}</h1>
          <p className="home-subtitle">{t.dashboardDesc}</p>
        </div>

        <div className="grid">
          <Link to="/crop" className="card">
            <span className="card-icon">🌾</span>
            <h3>{t.cropTitle}</h3>
            <p>{t.cropDesc}</p>
            <div className="card-features"><ul>{t.cropFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
          </Link>

          <Link to="/disease" className="card">
            <span className="card-icon">🔬</span>
            <h3>{t.diseaseTitle}</h3>
            <p>{t.diseaseDesc}</p>
            <div className="card-features"><ul>{t.diseaseFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
          </Link>

          <Link to="/weather" className="card">
            <span className="card-icon">🌤️</span>
            <h3>{t.weatherTitle}</h3>
            <p>{t.weatherDesc}</p>
            <div className="card-features"><ul>{t.weatherFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
          </Link>

          <Link to="/farm-monitor" className="card card-featured">
            <span className="card-icon">🛰️</span>
            <h3>{t.farmMonitorTitle}</h3>
            <p>{t.farmMonitorDesc}</p>
            <div className="card-features"><ul>{t.farmMonitorFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
            <div className="featured-badge">NEW</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
