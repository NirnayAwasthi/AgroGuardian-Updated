import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-page">

      {/* ── Hero with Farm Video Background ── */}
      <section className="about-hero">
        {/* Looping farm video — muted & autoplay required by browsers */}
        <video
          className="hero-video-bg"
          src={`${process.env.PUBLIC_URL}/Farms.mp4`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Dark overlay so text stays readable */}
        <div className="hero-video-overlay" />

        <div className="about-hero-content">
          <span className="about-hero-icon">🌱</span>
          <h1>About AgroGuardian</h1>
          <p className="about-hero-sub">
            Smart Weather, Crop &amp; Disease Predictor for Farmers
          </p>
          <div className="about-hero-divider" />
          <p className="about-hero-tagline">
            Empowering every farmer with the intelligence they deserve
          </p>
        </div>
      </section>

      {/* ── Inspiration & Problem ── */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-section-header">
            <span className="about-section-icon">💡</span>
            <h2>Our Inspiration &amp; The Problem We Solve</h2>
          </div>
          <div className="about-story">
            <p>
              India is an agrarian nation — yet millions of farmers still make critical decisions
              based on guesswork, word-of-mouth, and decades-old practices. A single wrong
              decision — a delayed harvest, an undetected disease, or an unpredicted storm — can
              wipe out an entire season's livelihood.
            </p>
            <p>
              We built <strong>AgroGuardian</strong> because we believe technology should serve
              those who feed the world. The inspiration came from real stories: a farmer who lost
              his entire wheat crop because he didn't know a fungal blight was spreading, and
              another who could have harvested two days earlier had he known a hailstorm was approaching.
            </p>
          </div>

          <div className="problem-cards">
            {[
              { icon: "🌧️", title: "Unpredictable Weather", desc: "Sudden floods, unseasonal rains, and droughts can devastate crops. With AgroGuardian's 5-day forecast, farmers plan harvests, irrigation, and sprays around real weather data." },
              { icon: "🦠", title: "Undetected Plant Diseases", desc: "Early-stage diseases are invisible to the naked eye. Our CNN-based disease detector catches blight, rust, and rot at early stages — giving farmers time to act." },
              { icon: "🌾", title: "Wrong Crop Choices", desc: "Planting the wrong crop leads to poor yields. Our ML engine analyzes soil nutrients, pH, temperature, and rainfall to suggest the crop most likely to thrive on your land." },
              { icon: "📡", title: "No Real-Time Farm Visibility", desc: "Our Farm Monitor uses satellite imagery and NDVI indexing so farmers can spot stress zones, dry patches, and uneven growth from their phone." },
            ].map((c, i) => (
              <div className="problem-card" key={i}>
                <span>{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="about-section about-section-alt">
        <div className="about-section-inner">
          <div className="about-section-header">
            <span className="about-section-icon">⚙️</span>
            <h2>Current Features</h2>
          </div>
          <div className="features-grid">
            {[
              { icon: "🌾", title: "ML Crop Recommendation",      desc: "Trained on thousands of data points across soil types and climates. Uses Random Forest & Decision Tree algorithms.", tag: "Machine Learning" },
              { icon: "🔬", title: "Plant Disease Detection",      desc: "CNN model based on EfficientNet detects 38+ plant diseases across tomato, rice, wheat, and maize from a single leaf photo.", tag: "Deep Learning / CNN" },
              { icon: "🌤️", title: "5-Day Weather Forecast",      desc: "Live weather API delivering hyperlocal forecasts including temperature, humidity, rainfall probability, and wind speed for any city.", tag: "Real-Time API" },
              { icon: "🛰️", title: "Farm Monitor (Satellite)",    desc: "NDVI analysis gives a bird's-eye view of crop health, soil moisture, and stress areas across your entire farm.", tag: "Satellite Analytics" },
              { icon: "🌐", title: "Multilingual Interface",       desc: "Available in English, Hindi, Punjabi, and Tamil — ensuring farmers across regions use the platform in their native language.", tag: "Accessibility" },
              { icon: "🔐", title: "Secure Authentication",        desc: "Firebase-powered user authentication ensures each farmer has a secure, personal dashboard with their farm history.", tag: "Firebase Auth" },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-card-top">
                  <span className="feature-icon">{f.icon}</span>
                  <span className="feature-tag">{f.tag}</span>
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Future Scope ── */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-section-header">
            <span className="about-section-icon">🚀</span>
            <h2>Future Scope</h2>
          </div>
          <p className="about-future-intro">AgroGuardian is just getting started. Here's where we're heading:</p>
          <div className="future-timeline">
            {[
              { phase: "Phase 2", icon: "📱", title: "Mobile App (Android & iOS)", desc: "A dedicated app with offline support so farmers in low-connectivity areas can still access predictions and alerts." },
              { phase: "Phase 2", icon: "🤖", title: "AI Chatbot for Farmers",     desc: "A conversational AI assistant that answers farming queries in local languages — from sowing schedules to pesticide dosages." },
              { phase: "Phase 3", icon: "📊", title: "Market Price Integration",   desc: "Real-time mandi prices so farmers can decide the best time and location to sell their produce for maximum profit." },
              { phase: "Phase 3", icon: "🛸", title: "Drone Integration",           desc: "Connect with agricultural drones for field-level data collection, targeted pesticide spraying, and automated health monitoring." },
              { phase: "Phase 4", icon: "🌍", title: "Pan-India Expansion",        desc: "Extend the platform to cover all Indian states with region-specific crop databases and government scheme alerts." },
              { phase: "Phase 4", icon: "🤝", title: "Farmer Community Network",   desc: "A peer-to-peer knowledge-sharing platform where farmers can post queries, share best practices, and form cooperatives." },
            ].map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-badge">{item.phase}</div>
                <div className="timeline-content">
                  <div className="timeline-icon">{item.icon}</div>
                  <div><h4>{item.title}</h4><p>{item.desc}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <span style={{ fontSize: "52px" }}>🌏</span>
          <h2>Our Mission</h2>
          <p>
            To make precision agriculture accessible to every Indian farmer — regardless of
            literacy, land size, or location — by harnessing the power of Artificial Intelligence,
            Machine Learning, and real-time data.
          </p>
          <div className="about-mission-stats">
            {[
              { num: "38+",   label: "Diseases Detected" },
              { num: "22+",   label: "Crops Supported" },
              { num: "4",     label: "Indian Languages" },
              { num: "5-Day", label: "Weather Forecast" },
            ].map((s, i) => (
              <div className="stat" key={i}>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutUs;
