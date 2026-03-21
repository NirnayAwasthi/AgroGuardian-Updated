import { useState, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const FARMER_AVATARS = [
  { id: "farmer1", emoji: "👨‍🌾", label: "Male Farmer" },
  { id: "farmer2", emoji: "👩‍🌾", label: "Female Farmer" },
  { id: "farmer3", emoji: "🧑‍🌾", label: "Neutral Farmer" },
  { id: "tractor",  emoji: "🚜", label: "Tractor Rider" },
  { id: "plant",   emoji: "🌱", label: "Seedling" },
  { id: "wheat",   emoji: "🌾", label: "Wheat Grower" },
  { id: "sun",     emoji: "🌻", label: "Sunflower" },
  { id: "leaf",    emoji: "🍃", label: "Nature Lover" },
];

// Compress image to tiny 80x80 JPEG thumbnail for Firebase Auth photoURL
// Full-resolution photo gets stored in localStorage separately
const compressImage = (dataUrl, maxSize = 80, quality = 0.6) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
};

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", farmLocation: "",
    password: "", confirmPassword: "",
  });
  const [loading, setLoading]               = useState(false);
  const [errorMsg, setErrorMsg]             = useState("");
  const [profileMode, setProfileMode]       = useState("avatar");
  const [selectedAvatar, setSelectedAvatar] = useState("farmer1");
  const [photoPreview, setPhotoPreview]     = useState(null);
  const [photoData, setPhotoData]           = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Photo must be less than 5MB."); return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
      setPhotoData(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim())                     { setErrorMsg("Please enter your full name."); return; }
    if (formData.password.length < 6)                  { setErrorMsg("Password must be at least 6 characters."); return; }
    if (formData.password !== formData.confirmPassword) { setErrorMsg("Passwords do not match!"); return; }
    if (profileMode === "photo" && !photoData)          { setErrorMsg("Please select a photo or switch to Avatar."); return; }

    setLoading(true);
    try {
      // 1. Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth, formData.email, formData.password
      );
      const uid = userCredential.user.uid;

      // 2. Determine photoURL — MUST be small for Firebase Auth
      let firebasePhotoURL;
      if (profileMode === "photo" && photoData) {
        // Compress to 80x80 thumbnail — Firebase Auth can handle this
        const thumbnail = await compressImage(photoData, 80, 0.6);
        firebasePhotoURL = thumbnail || `avatar:👨‍🌾`;
        // Save full-res to localStorage for display in Navbar
        try { localStorage.setItem(`profilePhoto_${uid}`, photoData); } catch (_) {}
      } else {
        const av = FARMER_AVATARS.find((a) => a.id === selectedAvatar);
        firebasePhotoURL = `avatar:${av ? av.emoji : "👨‍🌾"}`;
      }

      // 3. Update profile (displayName + small photoURL)
      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
        photoURL: firebasePhotoURL,
      });

      // 4. Save phone & location to localStorage
      if (formData.farmLocation) localStorage.setItem(`farmLocation_${uid}`, formData.farmLocation);
      if (formData.phone)        localStorage.setItem(`phone_${uid}`, formData.phone);

      navigate("/home");

    } catch (err) {
      console.error("🔴 Signup error code:", err.code);
      console.error("🔴 Signup error msg:", err.message);

      const code = err.code || "";
      let msg = "Failed to create account. Please try again.";
      if (code === "auth/email-already-in-use")   msg = "This email is already registered. Please login instead.";
      else if (code === "auth/invalid-email")      msg = "Invalid email address format.";
      else if (code === "auth/weak-password")      msg = "Password too weak. Use at least 6 characters.";
      else if (code === "auth/network-request-failed") msg = "Network error. Check your internet connection.";
      else if (code === "auth/operation-not-allowed")  msg = "Email/password signup is disabled. Enable it in Firebase Console → Authentication → Sign-in method.";
      else if (err.message?.includes("photoURL"))  msg = "Profile photo is too large. Please use a Farmer Avatar instead.";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh",
      backgroundImage: `url(${process.env.PUBLIC_URL}/crops-bg.gif)`,
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    },
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", zIndex: 0 },
    card: {
      position: "relative", zIndex: 1,
      background: "rgba(255,255,255,0.93)", backdropFilter: "blur(18px)",
      borderRadius: "24px", padding: "40px 36px",
      width: "100%", maxWidth: "520px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
      maxHeight: "90vh", overflowY: "auto",
    },
    logo:     { textAlign: "center", fontSize: "44px", marginBottom: "6px" },
    h2:       { textAlign: "center", fontSize: "24px", fontWeight: 700, color: "#1b5e20", margin: "0 0 6px" },
    subtitle: { textAlign: "center", color: "#555", fontSize: "13px", marginBottom: "20px" },
    divider:  { height: "3px", background: "linear-gradient(90deg,#2e7d32,#66bb6a,#2e7d32)", borderRadius: "2px", marginBottom: "22px" },
    label:    { display: "block", fontWeight: 600, color: "#333", marginBottom: "5px", fontSize: "13px" },
    input: {
      width: "100%", padding: "11px 14px", borderRadius: "10px",
      border: "2px solid #e0e0e0", fontSize: "14px", outline: "none",
      boxSizing: "border-box", marginBottom: "16px", fontFamily: "inherit",
    },
    errorBox: {
      background: "#fff3f3", border: "1.5px solid #f44336", borderRadius: "10px",
      padding: "11px 14px", marginBottom: "16px", color: "#c62828",
      fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "flex-start", gap: "8px",
    },
    sectionTitle: { fontWeight: 700, color: "#1b5e20", fontSize: "14px", marginBottom: "12px", marginTop: "4px" },
    tabRow:       { display: "flex", gap: "10px", marginBottom: "16px" },
    tab: (active) => ({
      flex: 1, padding: "9px", borderRadius: "10px",
      border: `2px solid ${active ? "#2e7d32" : "#ddd"}`,
      background: active ? "linear-gradient(135deg,#2e7d32,#66bb6a)" : "white",
      color: active ? "white" : "#555", fontWeight: 600, fontSize: "13px", cursor: "pointer",
    }),
    avatarGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "18px" },
    avatarBtn: (sel) => ({
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "10px 6px", borderRadius: "12px",
      border: `2px solid ${sel ? "#2e7d32" : "#e0e0e0"}`,
      background: sel ? "rgba(46,125,50,0.1)" : "white", cursor: "pointer",
      boxShadow: sel ? "0 4px 12px rgba(46,125,50,0.3)" : "none",
    }),
    avatarEmoji: { fontSize: "28px" },
    avatarLabel: { fontSize: "10px", color: "#555", marginTop: "4px", textAlign: "center" },
    photoArea: {
      border: "2px dashed #66bb6a", borderRadius: "14px", padding: "20px",
      textAlign: "center", marginBottom: "8px", cursor: "pointer",
      background: "rgba(102,187,106,0.05)",
    },
    photoPreview: {
      width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover",
      border: "3px solid #2e7d32", margin: "0 auto 10px", display: "block",
    },
    btn: {
      width: "100%", padding: "14px",
      background: loading ? "linear-gradient(135deg,#a5d6a7,#81c784)" : "linear-gradient(135deg,#2e7d32,#66bb6a)",
      color: "white", border: "none", borderRadius: "12px",
      fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
      marginTop: "6px", boxShadow: "0 6px 20px rgba(46,125,50,0.35)", transition: "all 0.3s",
    },
    formLink: { textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#555" },
  };

  return (
    <div style={s.page}>
      <div style={s.overlay} />
      <div style={s.card}>
        <div style={s.logo}>🚜</div>
        <h2 style={s.h2}>Join AgroGuardian</h2>
        <p style={s.subtitle}>Create your account and start smart farming</p>
        <div style={s.divider} />

        <form onSubmit={submit}>
          <label style={s.label}>Full Name *</label>
          <input style={s.input} name="fullName" type="text" placeholder="Enter your full name"
            required value={formData.fullName} onChange={handleChange} disabled={loading} />

          <label style={s.label}>Email Address *</label>
          <input style={s.input} name="email" type="email" placeholder="Enter your email"
            required value={formData.email} onChange={handleChange} disabled={loading} />

          <label style={s.label}>Phone Number</label>
          <input style={s.input} name="phone" type="tel" placeholder="Enter your phone number"
            value={formData.phone} onChange={handleChange} disabled={loading} />

          <label style={s.label}>Farm Location</label>
          <input style={s.input} name="farmLocation" type="text" placeholder="City, State (e.g., Lucknow, UP)"
            value={formData.farmLocation} onChange={handleChange} disabled={loading} />

          <p style={s.sectionTitle}>🖼️ Choose Your Profile</p>
          <div style={s.tabRow}>
            <button type="button" style={s.tab(profileMode === "avatar")}
              onClick={() => { setProfileMode("avatar"); setErrorMsg(""); }}>🎭 Farmer Avatar</button>
            <button type="button" style={s.tab(profileMode === "photo")}
              onClick={() => { setProfileMode("photo"); setErrorMsg(""); }}>📷 Upload Photo</button>
          </div>

          {profileMode === "avatar" && (
            <div style={s.avatarGrid}>
              {FARMER_AVATARS.map((av) => (
                <button key={av.id} type="button" style={s.avatarBtn(selectedAvatar === av.id)}
                  onClick={() => setSelectedAvatar(av.id)}>
                  <span style={s.avatarEmoji}>{av.emoji}</span>
                  <span style={s.avatarLabel}>{av.label}</span>
                </button>
              ))}
            </div>
          )}

          {profileMode === "photo" && (
            <>
              <div style={s.photoArea} onClick={() => fileInputRef.current.click()}>
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" style={s.photoPreview} />
                    <p style={{ color: "#2e7d32", fontWeight: 600, fontSize: "13px", margin: 0 }}>
                      ✅ Photo selected — click to change
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>📷</div>
                    <p style={{ color: "#777", fontSize: "13px", margin: 0 }}>
                      Click to upload your photo<br />
                      <span style={{ fontSize: "11px", color: "#aaa" }}>(JPG, PNG — max 5MB)</span>
                    </p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*"
                  style={{ display: "none" }} onChange={handlePhotoChange} />
              </div>
              <p style={{ fontSize: "11px", color: "#888", marginBottom: "14px", textAlign: "center" }}>
                💡 Photo is auto-compressed. If signup fails, use Farmer Avatar.
              </p>
            </>
          )}

          <label style={s.label}>Password *</label>
          <input style={s.input} name="password" type="password"
            placeholder="Create a strong password (min 6 chars)"
            required value={formData.password} onChange={handleChange} disabled={loading} />

          <label style={s.label}>Confirm Password *</label>
          <input style={s.input} name="confirmPassword" type="password"
            placeholder="Re-enter your password"
            required value={formData.confirmPassword} onChange={handleChange} disabled={loading} />

          {errorMsg && (
            <div style={s.errorBox}>
              <span>⚠️</span><span>{errorMsg}</span>
            </div>
          )}

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account 🌱"}
          </button>

          <p style={s.formLink}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2e7d32", fontWeight: 600 }}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
