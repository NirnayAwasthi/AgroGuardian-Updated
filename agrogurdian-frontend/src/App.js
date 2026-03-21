import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AgroBot from "./components/AgroBot";   // ← NEW: Chatbot

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";

// Import feature components
import Crop from "./features/Crop/Crop";
import Disease from "./features/Disease/Disease";
import Weather from "./features/Weather/Weather";
import FarmMonitor from "./features/FarmMonitor/FarmMonitor";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <Navbar />}

      <Routes>
        {/* Default route */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/signup" />} />

        {/* Authentication routes */}
        <Route path="/login"  element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />

        {/* Protected routes */}
        <Route path="/home"         element={user ? <Home />        : <Navigate to="/signup" />} />
        <Route path="/crop"         element={user ? <Crop />        : <Navigate to="/signup" />} />
        <Route path="/disease"      element={user ? <Disease />     : <Navigate to="/signup" />} />
        <Route path="/weather"      element={user ? <Weather />     : <Navigate to="/signup" />} />
        <Route path="/farm-monitor" element={user ? <FarmMonitor /> : <Navigate to="/signup" />} />
        <Route path="/about"        element={user ? <AboutUs />     : <Navigate to="/signup" />} />

        {/* Catch all */}
        <Route path="*" element={user ? <Navigate to="/home" /> : <Navigate to="/signup" />} />
      </Routes>

      <Footer />

      {/* AgroBot — only shown to logged-in users, floats on every page */}
      {user && <AgroBot />}
    </BrowserRouter>
  );
}

export default App;
