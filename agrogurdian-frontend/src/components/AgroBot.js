// AgroBot.js — Smart Farming Chatbot using Groq API
// Place at: src/components/AgroBot.js
//
// .env setup (already done!):
//   REACT_APP_GEMINI_API_KEY=gsk_xxxx   ← your Groq key works here
//   OR rename it properly:
//   REACT_APP_GROQ_API_KEY=gsk_xxxx
//
// This file reads BOTH variable names so either works!

import { useState, useRef, useEffect } from "react";
import "./AgroBot.css";

// ─── Farming Knowledge Base (instant offline responses) ──────────────────────
const FARMING_KNOWLEDGE = {
  greetings: ["hello", "hi", "hey", "namaste", "sat sri akal", "vanakkam", "kaise", "namaskar"],
  topics: {
    wheat: {
      keywords: ["wheat", "gehu", "gehun", "ਕਣਕ", "கோதுமை", "गेहूं"],
      response: `🌾 **Wheat Farming Guide:**\n• Best sowing: October–December (Rabi season)\n• Soil: Loamy/clay-loam, pH 6–7.5\n• Irrigation: 5–6 times; critical at tillering & grain filling\n• Fertilizer: 120kg N + 60kg P + 40kg K per hectare\n• Common disease: Rust → treat with Propiconazole\n• Yield: 4–6 tonnes/hectare\n• Harvest: March–April when moisture ~14%`
    },
    rice: {
      keywords: ["rice", "paddy", "dhan", "chawal", "ਚਾਵਲ", "அரிசி", "धान", "चावल"],
      response: `🌾 **Rice/Paddy Farming Guide:**\n• Season: Kharif (transplant June–July)\n• Water: 1200–2000mm; keep 5cm standing water\n• Soil: Heavy clay with good water retention\n• Fertilizer: 100kg N + 50kg P + 50kg K per hectare\n• Pests: Brown Planthopper → Chlorpyrifos; Stem Borer → Cartap\n• SRI method boosts yield 20–30%\n• Harvest: 90–150 days by variety`
    },
    soil: {
      keywords: ["soil", "mitti", "ph", "fertilizer", "khad", "ਮਿੱਟੀ", "மண்", "मिट्टी", "खाद"],
      response: `🌱 **Soil Health Tips:**\n• Test soil every 2–3 years (govt labs free)\n• Ideal pH: 6.0–7.5 for most crops\n• Add compost/vermicompost 2–5 tonnes/hectare\n• Sandy soil: add clay + organic matter\n• Clay soil: add sand for drainage\n• Avoid over-irrigation → prevents waterlogging\n• Green manure crops: Dhaincha, Sunhemp`
    },
    pest: {
      keywords: ["pest", "insect", "disease", "bug", "kida", "rog", "ਕੀੜਾ", "பூச்சி", "कीड़ा", "रोग"],
      response: `🔬 **Pest & Disease Management:**\n• Use our Disease Detection feature for photo diagnosis!\n• IPM reduces chemical use by 40–60%\n• Neem oil spray: 5ml/L water, safe & organic\n• Spray at dawn or dusk (not midday heat)\n• Rotate crops to break pest cycles\n• Aphids → Imidacloprid; Whitefly → Thiamethoxam\n• Biological: Trichogramma cards for stem borer`
    },
    government: {
      keywords: ["scheme", "subsidy", "loan", "pm kisan", "insurance", "yojana", "government", "sarkar", "सरकार", "योजना"],
      response: `🏛️ **Government Schemes for Farmers:**\n• PM-KISAN: ₹6,000/year → pmkisan.gov.in\n• PM Fasal Bima Yojana: Crop insurance at 2% premium\n• Kisan Credit Card: Loan up to ₹3 lakh at 4% interest\n• Soil Health Card: Free soil testing\n• eNAM: Online mandi for best prices\n• PM Krishi Sinchai: Subsidized drip/sprinkler\n• KVK helpline: 1800-180-1551 (free)`
    },
    organic: {
      keywords: ["organic", "jeevamrit", "compost", "vermicompost", "natural", "jaivik", "जैविक", "जीवामृत"],
      response: `🌿 **Organic Farming Guide:**\n• Jeevamrit: 200L water + 10kg cow dung + 10L cow urine + 2kg jaggery + 2kg gram flour\n• Vermicompost: 60–90 days; apply 2–5 t/ha\n• Green manure: Plow Dhaincha at flowering stage\n• Panchagavya: Natural growth promoter\n• Organic cert: Contact APEDA (apeda.gov.in)\n• Input cost reduces 30–50% after 3 years`
    },
    water: {
      keywords: ["irrigation", "drip", "sprinkler", "water", "sinchai", "pani", "ਪਾਣੀ", "தண்ணீர்", "पानी", "सिंचाई"],
      response: `💧 **Irrigation Tips:**\n• Drip: 40–60% water saving; ideal for vegetables/fruit\n• Sprinkler: 25–40% saving; good for wheat/groundnut\n• Flood: Only for paddy\n• Water at root zone — not leaves\n• Best time: Early morning (less evaporation)\n• Farm pond with govt subsidy: up to 50% cost covered\n• Tensiometer: ₹500 tool to check soil moisture`
    },
    maize: {
      keywords: ["maize", "corn", "makka", "makki", "मक्का", "ਮੱਕੀ"],
      response: `🌽 **Maize Farming Guide:**\n• Season: Kharif (June–July) or Rabi (Nov)\n• Soil: Well-drained loam, pH 6–7\n• Spacing: 60×20cm, 1 seed per hole\n• Fertilizer: 180kg N + 60kg P + 40kg K/ha\n• Water: 6–8 irrigations; critical at silking\n• Pests: Fall Armyworm → Emamectin Benzoate\n• Harvest: 90–110 days, when husk turns brown`
    }
  }
};

const getLocalResponse = (message) => {
  const msg = message.toLowerCase();
  if (FARMING_KNOWLEDGE.greetings.some(g => msg.includes(g))) {
    return `🙏 **Namaste!** Main hoon **AgroBot** — aapka smart farming sahayak!\n\nMain in topics mein help kar sakta hoon:\n• 🌾 Crop guidance (Wheat, Rice, Maize, Vegetables)\n• 🌱 Soil health & fertilizers\n• 🔬 Pest & disease management\n• 💧 Irrigation advice\n• 🏛️ Government schemes & subsidies\n• 🌿 Organic farming\n\nHindi, Punjabi, Tamil, ya English mein poochhein!`;
  }
  for (const topicData of Object.values(FARMING_KNOWLEDGE.topics)) {
    if (topicData.keywords.some(kw => msg.includes(kw))) {
      return topicData.response;
    }
  }
  return null;
};

// ─── Groq API Call ────────────────────────────────────────────────────────────
// Groq supports: llama-3.3-70b-versatile, llama3-8b-8192, mixtral-8x7b-32768
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are AgroBot, an expert agricultural assistant for Indian farmers built into the AgroGuardian app.
You help with crop recommendations, soil health, pest & disease management, weather impact on farming, irrigation techniques, Indian government schemes (PM-KISAN, Fasal Bima, KCC), and organic farming.

Rules:
- Keep responses under 150 words, use bullet points and emojis
- Use simple language a farmer can understand
- Include specific quantities (kg/hectare, doses, timings, costs in ₹)
- Mention relevant Indian government schemes when applicable
- If asked in Hindi/Punjabi/Tamil, reply in that same language
- Be encouraging, practical, and actionable
- Never say you cannot help — always give useful farming advice`;

const callGroqAPI = async (message, conversationHistory) => {
  // Read key from either variable name (supports both naming conventions)
  const apiKey =
    process.env.REACT_APP_GROQ_API_KEY ||
    process.env.REACT_APP_GEMINI_API_KEY; // your current .env key name

  if (!apiKey || (!apiKey.startsWith("gsk_") && !apiKey.startsWith("gro_"))) {
    const local = getLocalResponse(message);
    if (local) return local;
    return `⚠️ **API key not configured.**\n\nTo enable AI responses:\n1. Open **.env** file\n2. Make sure it has:\n   \`REACT_APP_GEMINI_API_KEY=gsk_your_groq_key\`\n3. Restart: \`npm start\`\n\nMeanwhile try: "wheat farming", "PM Kisan scheme", "soil tips"`;
  }

  try {
    // Build message history for Groq (last 6 messages for context)
    const historyMessages = conversationHistory
      .slice(-6)
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content
      }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...historyMessages,
          { role: "user", content: message }
        ],
        max_tokens: 400,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${response.status}`;
      console.error("Groq API error:", errMsg);

      // Specific error handling
      if (response.status === 401) {
        return "❌ **Invalid Groq API key.** Please check your key in the .env file. It should start with `gsk_`.";
      }
      if (response.status === 429) {
        return "⏳ **Rate limit reached.** Groq free tier has limits. Please wait 1 minute and try again.";
      }
      throw new Error(errMsg);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from Groq");
    return text;

  } catch (error) {
    console.error("Groq fetch error:", error.message);
    // Fallback to local knowledge base
    const local = getLocalResponse(message);
    if (local) {
      return `🔌 *(AI offline — using local knowledge)*\n\n${local}`;
    }
    return "🔌 **Connection error.** Please check your internet and try again. You can also ask about: wheat, rice, soil, pests, or government schemes.";
  }
};

// ─── Quick Questions ──────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  "Best crops for June?",
  "PM Kisan scheme details",
  "Wheat rust treatment?",
  "Drip irrigation cost?",
  "Organic farming tips",
  "Soil testing kaise karein?",
];

// ─── AgroBot Component ────────────────────────────────────────────────────────
function AgroBot() {
  const [isOpen,      setIsOpen]      = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [input,       setInput]       = useState("");
  const [messages,    setMessages]    = useState([{
    id: 1, role: "bot", time: new Date(),
    content: `🙏 **Namaste!** Main hoon **AgroBot** — aapka smart farming sahayak!\n\nCrop, soil, pest, weather, ya government scheme — kuch bhi poochhein.\nHindi, Punjabi, Tamil, English — sab mein jawab dunga! 🌱`
  }]);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;
    setInput("");

    const userMsg = { id: Date.now(), role: "user", content: messageText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Check local first for instant response on known topics
      const localResp = getLocalResponse(messageText);
      const apiKey = process.env.REACT_APP_GROQ_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

      let botResponse;
      if (localResp && !apiKey) {
        // No API key — use local only
        botResponse = localResp;
      } else {
        // Use Groq AI (falls back to local on error)
        botResponse = await callGroqAPI(messageText, messages);
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "bot", content: botResponse, time: new Date()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "bot",
        content: "❌ Something went wrong. Please try again.",
        time: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([{
    id: Date.now(), role: "bot", time: new Date(),
    content: `🗑️ Chat cleared! Nayi baat karein — crop, soil, pest, ya schemes ke baare mein poochhein!`
  }]);

  const formatMessage = (text) =>
    text.split("\n").map((line, i, arr) => {
      const parts = line.split(/\*\*(.*?)\*\*/g).map((p, j) =>
        j % 2 === 1 ? <strong key={j}>{p}</strong> : p
      );
      return <span key={i}>{parts}{i < arr.length - 1 && <br />}</span>;
    });

  const formatTime = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button className="agrobot-fab" onClick={() => setIsOpen(true)} aria-label="Open AgroBot">
          <span className="agrobot-fab-icon">🌱</span>
          <span className="agrobot-fab-pulse" />
          <div className="agrobot-fab-tooltip">Ask AgroBot</div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`agrobot-window ${isMinimized ? "minimized" : ""}`}>

          {/* Header */}
          <div className="agrobot-header">
            <div className="agrobot-header-left">
              <div className="agrobot-avatar">🌱</div>
              <div className="agrobot-header-info">
                <span className="agrobot-title">AgroBot</span>
                <span className="agrobot-status">
                  <span className="status-dot" />
                  Smart Farming Assistant
                </span>
              </div>
            </div>
            <div className="agrobot-header-actions">
              <button onClick={clearChat}                       className="agrobot-action-btn" title="Clear chat">🗑️</button>
              <button onClick={() => setIsMinimized(p => !p)}  className="agrobot-action-btn" title="Minimize">
                {isMinimized ? "⬆️" : "⬇️"}
              </button>
              <button onClick={() => setIsOpen(false)}         className="agrobot-action-btn" title="Close">✕</button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="agrobot-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`agrobot-message ${msg.role}`}>
                    {msg.role === "bot" && <div className="bot-avatar-small">🌱</div>}
                    <div className="message-bubble">
                      <div className="message-content">{formatMessage(msg.content)}</div>
                      <div className="message-time">{formatTime(msg.time)}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="agrobot-message bot">
                    <div className="bot-avatar-small">🌱</div>
                    <div className="message-bubble">
                      <div className="typing-indicator"><span /><span /><span /></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions — shown until 3rd message */}
              {messages.length <= 2 && (
                <div className="agrobot-quick">
                  <p className="quick-label">Quick questions:</p>
                  <div className="quick-chips">
                    {QUICK_QUESTIONS.map(q => (
                      <button key={q} className="quick-chip" onClick={() => sendMessage(q)}>{q}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="agrobot-input-area">
                <textarea
                  ref={inputRef}
                  className="agrobot-input"
                  placeholder="Kuch bhi poochhein... (Hindi/English)"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  className="agrobot-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? "⏳" : "➤"}
                </button>
              </div>

              <div className="agrobot-footer">Powered by Groq AI (Llama 3) • AgroGuardian</div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default AgroBot;