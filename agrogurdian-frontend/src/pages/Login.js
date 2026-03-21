import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // inline error instead of alert
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      // Log the exact error code to browser console for debugging
      console.error("🔴 Firebase Login Error Code:", err.code);
      console.error("🔴 Firebase Login Error Message:", err.message);
      const code = err.code || "";
      let msg = "Login failed. Please check your email and password.";

      if (code === "auth/invalid-credential" ||
          code === "auth/invalid-login-credentials" ||  // Email Enumeration Protection ON
          code === "auth/wrong-password" ||
          code === "auth/user-not-found") {
        msg = "Incorrect email or password. Please try again.";
      } else if (code === "auth/invalid-email") {
        msg = "Invalid email address format.";
      } else if (code === "auth/user-disabled") {
        msg = "This account has been disabled. Contact support.";
      } else if (code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please wait a few minutes and try again.";
      } else if (code === "auth/network-request-failed") {
        msg = "Network error. Please check your internet connection.";
      } else if (code === "auth/operation-not-allowed") {
        msg = "Email/password login is not enabled. Contact support.";
      }

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh",
      backgroundImage: `url(${process.env.PUBLIC_URL}/crops-bg.gif)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 0 },
    card: {
      position: "relative", zIndex: 1,
      background: "rgba(255,255,255,0.93)",
      backdropFilter: "blur(18px)",
      borderRadius: "24px", padding: "48px 40px",
      width: "100%", maxWidth: "440px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
    },
    logo: { textAlign: "center", fontSize: "48px", marginBottom: "8px" },
    h2: { textAlign: "center", fontSize: "26px", fontWeight: 700, color: "#1b5e20", margin: "0 0 6px" },
    subtitle: { textAlign: "center", color: "#555", fontSize: "14px", marginBottom: "24px" },
    divider: { height: "3px", background: "linear-gradient(90deg,#2e7d32,#66bb6a,#2e7d32)", borderRadius: "2px", marginBottom: "28px" },
    label: { display: "block", fontWeight: 600, color: "#333", marginBottom: "6px", fontSize: "14px" },
    input: {
      width: "100%", padding: "12px 16px", borderRadius: "10px",
      border: "2px solid #e0e0e0", fontSize: "15px", outline: "none",
      boxSizing: "border-box", marginBottom: "20px", fontFamily: "inherit",
      transition: "border-color 0.2s",
    },
    errorBox: {
      background: "#fff3f3",
      border: "1.5px solid #f44336",
      borderRadius: "10px",
      padding: "11px 14px",
      marginBottom: "16px",
      color: "#c62828",
      fontSize: "13px",
      fontWeight: 500,
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
    },
    btn: {
      width: "100%", padding: "14px",
      background: loading
        ? "linear-gradient(135deg,#a5d6a7,#81c784)"
        : "linear-gradient(135deg,#2e7d32,#66bb6a)",
      color: "white", border: "none", borderRadius: "12px",
      fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
      marginTop: "8px",
      boxShadow: "0 6px 20px rgba(46,125,50,0.35)",
      transition: "all 0.3s",
    },
    link: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#555" },
  };

  return (
    <div style={s.page}>
      <div style={s.overlay} />
      <div style={s.card}>
        <div style={s.logo}>🌱</div>
        <h2 style={s.h2}>Welcome Back!</h2>
        <p style={s.subtitle}>Login to access your AgroGuardian dashboard</p>
        <div style={s.divider} />

        <form onSubmit={submit}>
          <label style={s.label}>Email Address</label>
          <input
            style={s.input}
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
            disabled={loading}
          />

          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
            disabled={loading}
          />

          {/* Inline error message — no browser alert popup */}
          {errorMsg && (
            <div style={s.errorBox}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>

          <p style={s.link}>
            New to AgroGuardian?{" "}
            <Link to="/signup" style={{ color: "#2e7d32", fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
