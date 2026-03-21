import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* ── Layered Wave Divider ── */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wave layer 1 — back, lightest */}
          <path
            className="wave-1"
            d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1380,40 1440,55 L1440,120 L0,120 Z"
            fill="#1a3a1a"
            fillOpacity="0.55"
          />
          {/* Wave layer 2 — middle */}
          <path
            className="wave-2"
            d="M0,75 C200,30 400,90 600,55 C800,20 1000,80 1200,50 C1320,32 1400,65 1440,70 L1440,120 L0,120 Z"
            fill="#142814"
            fillOpacity="0.8"
          />
          {/* Wave layer 3 — front, solid */}
          <path
            className="wave-3"
            d="M0,90 C240,50 480,110 720,80 C960,50 1200,100 1440,75 L1440,120 L0,120 Z"
            fill="#0f1f0f"
            fillOpacity="1"
          />
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-container">

          {/* Col 1 — Brand with REAL LOGO */}
          <div className="footer-col footer-brand">
            <div className="footer-logo">
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="AgroGuardian Logo"
                className="footer-logo-img"
              />
              <h3 className="footer-brand-name">AgroGuardian</h3>
            </div>
            <p className="footer-tagline">
              With the grace of Shri Priya Ju, we developed a cutting-edge technology for Empowering farmers. Our smart agriculture platform
              combines AI, ML, and real-time data to revolutionize farming and maximize crop yields.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">🤖 AI Powered</span>
              <span className="footer-badge">🔬 ML Based</span>
              <span className="footer-badge">🛰️ Satellite Data</span>
            </div>
          </div>

          {/* Col 2 — Features */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              <span className="footer-title-bar" />
              Core Features
            </h4>
            <ul className="footer-list">
              <li><span className="footer-list-icon">🌾</span> ML-based Crop Recommendation</li>
              <li><span className="footer-list-icon">🔬</span> Plant Disease Detection (CNN)</li>
              <li><span className="footer-list-icon">🌤️</span> 5-Day Weather Forecasting</li>
              <li><span className="footer-list-icon">🛰️</span> Farm Monitor (Satellite)</li>
              <li><span className="footer-list-icon">🤖</span> AgroBot AI Assistant</li>
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              <span className="footer-title-bar" />
              Contact Information
            </h4>
            <ul className="footer-list">
              <li>
                <span className="footer-list-icon">📧</span>
                <a href="mailto:nirnayawasthi2003@gmail.com" className="footer-link">
                  nirnayawasthi2003@gmail.com
                </a>
              </li>
              <li><span className="footer-list-icon">📞</span> +91 9125999412</li>
              <li><span className="footer-list-icon">📍</span> Lucknow, UP, India</li>
            </ul>

            <h4 className="footer-col-title" style={{ marginTop: "1.6rem" }}>
              <span className="footer-title-bar" />
              Quick Links
            </h4>
            <ul className="footer-list">
              <li><span className="footer-list-icon">🏠</span> Home</li>
              <li><span className="footer-list-icon">ℹ️</span> About Us</li>
              <li><span className="footer-list-icon">🌾</span> Crop Recommendation</li>
            </ul>
          </div>

        </div>

        <div className="footer-divider" />

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © {currentYear} <strong>AgroGuardian</strong> — Smart Farming System
            </p>
            <p className="footer-rights">
              All Rights Reserved &nbsp;|&nbsp; || हमारें माई स्यामा जू कौ राज ||💚
            </p>
            <p className="footer-links-row">
              <a href="#!" className="footer-policy-link">Privacy Policy</a>
              <span className="footer-dot">•</span>
              <a href="#!" className="footer-policy-link">Terms of Service</a>
              <span className="footer-dot">•</span>
              <a href="#!" className="footer-policy-link">Support</a>
            </p>
          </div>

          {/* Shri Radha Charan Kamal — bottom right */}
          <div className="footer-pyariju-wrapper">
            <img
              src={`${process.env.PUBLIC_URL}/shri-radha-charan-kamal.png`}
              alt="Shri Radha Charan Kamal"
              className="footer-pyariju-img"
              title="Shri Radha Charan Kamal 🪷"
            />
            <p className="footer-pyariju-caption">Shri Shyama Ju Charan Kamal 🪷</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
