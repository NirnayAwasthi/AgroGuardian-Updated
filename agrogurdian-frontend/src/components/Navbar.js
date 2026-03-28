import { Link, useNavigate } from "react-router-dom";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode,    setEditMode]    = useState(false);
  const dropdownRef  = useRef(null);
  const fileInputRef = useRef(null);
  const navigate     = useNavigate();
  const user         = auth.currentUser;

  const displayName   = user?.displayName || "Farmer";
  const photoURL      = user?.photoURL    || "";
  const email         = user?.email       || "";
  const localPhoto    = user?.uid ? localStorage.getItem(`profilePhoto_${user.uid}`) : null;
  const isAvatarEmoji = photoURL?.startsWith("avatar:");
  const avatarEmoji   = isAvatarEmoji ? photoURL.replace("avatar:", "") : null;
  const displayPhoto  = localPhoto || (!isAvatarEmoji ? photoURL : null);
  const farmLocation  = localStorage.getItem(`farmLocation_${user?.uid}`) || "Not set";
  const phone         = localStorage.getItem(`phone_${user?.uid}`) || "";
  const initials      = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const [editName,     setEditName]     = useState(displayName);
  const [editPhone,    setEditPhone]    = useState(phone);
  const [editLocation, setEditLocation] = useState(farmLocation === "Not set" ? "" : farmLocation);
  const [editPhoto,    setEditPhoto]    = useState(displayPhoto || "");
  const [saving,       setSaving]       = useState(false);
  const [saveMsg,      setSaveMsg]      = useState("");

  useEffect(() => {
    if (profileOpen) {
      setEditName(auth.currentUser?.displayName || "Farmer");
      setEditPhone(localStorage.getItem(`phone_${user?.uid}`) || "");
      setEditLocation(localStorage.getItem(`farmLocation_${user?.uid}`) || "");
      setEditPhoto(localStorage.getItem(`profilePhoto_${user?.uid}`) || "");
      setEditMode(false);
      setSaveMsg("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileOpen]);

  const logout = async () => {
    try { await signOut(auth); navigate("/login"); }
    catch (err) { console.error("Logout error:", err); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      if (editName.trim() && editName.trim() !== auth.currentUser?.displayName) {
        await updateProfile(auth.currentUser, { displayName: editName.trim() });
      }
      if (user?.uid) {
        if (editPhone.trim())    localStorage.setItem(`phone_${user.uid}`, editPhone.trim());
        else                     localStorage.removeItem(`phone_${user.uid}`);
        if (editLocation.trim()) localStorage.setItem(`farmLocation_${user.uid}`, editLocation.trim());
        else                     localStorage.removeItem(`farmLocation_${user.uid}`);
        if (editPhoto)           localStorage.setItem(`profilePhoto_${user.uid}`, editPhoto);
        else                     localStorage.removeItem(`profilePhoto_${user.uid}`);
      }
      setSaveMsg("✅ Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setSaveMsg("❌ Error saving. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderAvatar = (size = 40, fontSize = 20, photo = displayPhoto) => {
    const base = {
      width: size, height: size, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0, cursor: "pointer",
      border: "2px solid rgba(255,255,255,0.7)",
      background: "rgba(255,255,255,0.2)", fontSize,
    };
    if (photo) return (
      <div style={base}>
        <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
    if (avatarEmoji) return <div style={base}>{avatarEmoji}</div>;
    return (
      <div style={{ ...base, background: "linear-gradient(135deg,#66bb6a,#2e7d32)", fontSize: size * 0.38, fontWeight: 700, color: "white" }}>
        {initials}
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/home" className="logo-section">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="AgroGuardian" className="nav-logo-img" />
          <h2 className="brand-name">AgroGuardian</h2>
        </Link>

        <div className="nav-links">
          <Link to="/home"    className="nav-link"><span className="nav-link-icon">🏠</span> Home</Link>
          <Link to="/crop"    className="nav-link"><span className="nav-link-icon">🌾</span> Crop</Link>
          <Link to="/disease" className="nav-link"><span className="nav-link-icon">🔬</span> Disease</Link>
          <Link to="/weather" className="nav-link"><span className="nav-link-icon">🌤️</span> Weather</Link>
          <Link to="/about"   className="nav-link"><span className="nav-link-icon">ℹ️</span> About Us</Link>

          <div className="profile-wrapper" ref={dropdownRef}>
            <button className="profile-btn" onClick={() => setProfileOpen(p => !p)} aria-label="Profile menu">
              {renderAvatar(40, 20)}
              <span className="profile-btn-name">{displayName.split(" ")[0]}</span>
              <span className={`profile-chevron ${profileOpen ? "open" : ""}`}>▾</span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">

                {/* ── Header ── */}
                <div className="dropdown-header">
                  <div className="dropdown-avatar-large" style={{ position: "relative" }}>
                    {renderAvatar(70, 34, editMode ? (editPhoto || null) : displayPhoto)}
                    {editMode && (
                      <button className="avatar-edit-btn" onClick={() => fileInputRef.current?.click()} title="Change photo">
                        📷
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
                  </div>
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{editMode ? (editName || displayName) : displayName}</p>
                    <p className="dropdown-email">{email}</p>
                  </div>
                  <button
                    className={`edit-toggle-btn ${editMode ? "cancel" : ""}`}
                    onClick={() => { setEditMode(e => !e); setSaveMsg(""); }}
                    title={editMode ? "Cancel editing" : "Edit Profile"}
                  >
                    {editMode ? "✕" : "✏️"}
                  </button>
                </div>

                <div className="dropdown-divider" />

                {/* ── VIEW MODE ── */}
                {!editMode && (
                  <div className="dropdown-details">
                    <div className="dropdown-detail-row">
                      <span className="detail-icon">📍</span>
                      <div><span className="detail-label">Farm Location</span><span className="detail-value">{farmLocation}</span></div>
                    </div>
                    {phone && (
                      <div className="dropdown-detail-row">
                        <span className="detail-icon">📞</span>
                        <div><span className="detail-label">Phone</span><span className="detail-value">{phone}</span></div>
                      </div>
                    )}
                    <div className="dropdown-detail-row">
                      <span className="detail-icon">✉️</span>
                      <div><span className="detail-label">Email</span><span className="detail-value">{email}</span></div>
                    </div>
                    {saveMsg && <p className="save-msg success">{saveMsg}</p>}
                  </div>
                )}

                {/* ── EDIT MODE ── */}
                {editMode && (
                  <div className="dropdown-edit-form">
                    <div className="edit-field">
                      <label>👤 Display Name</label>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your full name" />
                    </div>
                    <div className="edit-field">
                      <label>📞 Phone Number</label>
                      <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="edit-field">
                      <label>📍 Farm Location</label>
                      <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="e.g. Lucknow, U.P." />
                    </div>
                    <div className="edit-field">
                      <label>🖼️ Profile Photo</label>
                      <div className="photo-actions">
                        <button type="button" className="photo-upload-btn" onClick={() => fileInputRef.current?.click()}>
                          📷 {editPhoto ? "Change Photo" : "Upload Photo"}
                        </button>
                        {editPhoto && (
                          <button type="button" className="photo-remove-btn" onClick={() => setEditPhoto("")}>✕ Remove</button>
                        )}
                      </div>
                    </div>
                    {saveMsg && <p className={`save-msg ${saveMsg.startsWith("✅") ? "success" : "error"}`}>{saveMsg}</p>}
                    <button className="save-profile-btn" onClick={handleSave} disabled={saving}>
                      {saving ? "⏳ Saving..." : "💾 Save Changes"}
                    </button>
                  </div>
                )}

                <div className="dropdown-divider" />
                <div className="dropdown-actions">
                  <button className="dropdown-logout-btn" onClick={logout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
