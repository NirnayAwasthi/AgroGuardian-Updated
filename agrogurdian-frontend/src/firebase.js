import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
// ─── App Check Setup ────────────────────────────────────────────────────────
// On localhost (development), we use a debug token so App Check doesn't block.
// In production, it uses reCAPTCHA v3 automatically.
//
// HOW TO GET YOUR DEBUG TOKEN (one-time setup, 2 minutes):
//   1. Temporarily set this to any random string e.g. "debug-token-123"
//   2. Run your app → open browser Console (F12)
//   3. You'll see: "App Check debug token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
//   4. Copy that token → go to Firebase Console → App Check → Apps → 
//      your web app → Manage debug tokens → Add token → paste it → Save
//   5. Then paste the same token in REACT_APP_APPCHECK_DEBUG_TOKEN in .env
//
// FOR NOW (quickest fix): Just disable App Check enforcement in Firebase Console
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== "undefined") {
  // Enable debug token on localhost only
  if (window.location.hostname === "localhost") {
    // This tells App Check to use debug mode locally
    // eslint-disable-next-line no-restricted-globals
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.REACT_APP_APPCHECK_DEBUG_TOKEN || true;
  }

  // Only initialize App Check if reCAPTCHA site key is provided
  const reCaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  if (reCaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(reCaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
}

export const auth = getAuth(app);


