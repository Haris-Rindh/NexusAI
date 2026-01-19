require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios'); // For HuggingFace & Pollinations
const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
const { CohereClient } = require("cohere-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
} else {
  console.log("⚠️ No Mongo URI found. History features disabled.");
}

// --- DATA MODEL ---
const PostSchema = new mongoose.Schema({
  userId: String,
  topic: String,
  content: String,
  carouselData: Array,
  pollData: Object,
  type: String,
  status: { type: String, default: 'draft' },
  scheduledAt: Date,
  image: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

// ==========================================
// 🧠 HELPER: ROBUST JSON PARSER
// ==========================================
function cleanAndParseJSON(text) {
  // 1. Remove Markdown code blocks
  let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  // 2. Extract just the array part
  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1) {
    clean = clean.substring(firstBracket, lastBracket + 1);
  }

  try {
    return JSON.parse(clean);
  } catch (e) {
    // 3. Advanced Cleanup: Escape unescaped newlines inside strings
    try {
        const sanitized = clean
            .replace(/(?:\r\n|\r|\n)/g, '\\n')  
            .replace(/\\/g, "\\\\");           
        return JSON.parse(sanitized);
    } catch (finalErr) {
        throw new Error("JSON Parse Failed");
    }
  }
}

// ==========================================
// 🧠 THE AI PROVIDER CHAIN (FAILOVER SYSTEM)
// ==========================================

// 1. GOOGLE GEMINI (Primary)
async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini Key");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const { response } = await ai.models.generateContent({
    model: 'gemini-1.5-flash', 
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return response.text();
}

// 2. GROQ (Speed Layer)
async function callGroq(prompt) {
  if (!process.env.GROQ_API_KEY) throw new Error("No Groq Key");
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a JSON generator. Output strictly valid minified JSON. Do not output markdown." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7, // Higher temp = Less repetitive
  });
  return completion.choices[0]?.message?.content;
}

// 3. COHERE (Business Layer)
async function callCohere(prompt) {
  if (!process.env.COHERE_API_KEY) throw new Error("No Cohere Key");
  const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
  const response = await cohere.chat({
    message: prompt + " Respond with valid JSON array only. No markdown.",
    model: "command-r-plus", 
  });
  return response.text;
}

// 4. SIMULATION (The Safety Net)
async function callSimulation(topic) {
  await new Promise(r => setTimeout(r, 1000));
  return JSON.stringify([
    { id: 1, title: "The Strategy (Simulated)", content: `Here is why ${topic} matters.\n\n1. Efficiency\n2. Scale\n3. Profit\n\nStart today.` },
    { id: 2, title: "The Story (Simulated)", content: `I used to struggle with ${topic}. Then I found a better way.\n\nNow I save 10 hours a week.` },
    { id: 3, title: "The Guide (Simulated)", content: `How to master ${topic} in 3 steps:\n\n- Audit\n- Build\n- Ship\n\nSave this.` }
  ]);
}

// --- MASTER GENERATOR FUNCTION ---
async function generateWithFailover(topic, options) {
  // UPDATED PROMPT: STRICT LINKEDIN STYLE + DETAIL
  const prompt = `
    Role: Expert LinkedIn Ghostwriter.
    Topic: "${topic}"
    Tone: ${options.tone}
    Length: ${options.length} (Must be detailed)

    INSTRUCTIONS:
    1. Write 3 DISTINCT posts.
    2. Format: Short sentences. Line break after every sentence.
    3. Structure: Hook -> Story/Context -> Actionable Tips -> CTA.
    4. NO generic fluff. Give specific advice.
    5. Length: At least 100 words per post.

    Output strictly valid JSON array: 
    [{"id":1,"title":"The Hook Title","content":"First sentence.\\n\\nSecond sentence.\\n\\n- Tip 1\\n- Tip 2\\n\\nQuestion?"}]
  `;

  // THE CHAIN OF COMMAND
  try {
    console.log("👉 Trying Provider 1: Gemini...");
    const text = await callGemini(prompt);
    return cleanAndParseJSON(text);
  } catch (e) {
    console.log(`❌ Gemini Failed: ${e.message}. 👉 Trying Provider 2: Groq...`);
    try {
      const text = await callGroq(prompt);
      return cleanAndParseJSON(text);
    } catch (e) {
      console.log(`❌ Groq Failed: ${e.message}. 👉 Trying Provider 3: Cohere...`);
      try {
        const text = await callCohere(prompt);
        return cleanAndParseJSON(text);
      } catch (e) {
        console.log(`❌ Cohere Failed. 👉 Switching to SIMULATION.`);
        const text = await callSimulation(topic);
        return JSON.parse(text);
      }
    }
  }
}

// --- ROUTES ---

app.get('/', (req, res) => res.send('Nexus AI Multi-Model Engine 🟢'));

// 1. GENERATE POSTS
app.post('/api/generate', async (req, res) => {
  const { userId, topic, options } = req.body; 
  try {
    const variations = await generateWithFailover(topic, options);
    res.json({ success: true, data: variations });
  } catch (error) {
    console.error("All Engines Failed:", error);
    res.status(500).json({ success: false, error: "System Overload" });
  }
});

// 2. GENERATE CAROUSEL (Fixed for Unique Slides)
app.post('/api/generate-carousel', async (req, res) => {
  const { topic, slideCount } = req.body;
  const count = slideCount || 5;
  try {
    // UPDATED PROMPT: Enforces Narrative Flow & Uniqueness
    const prompt = `
      Act as a LinkedIn Carousel Architect.
      Topic: "${topic}"
      Total Slides: ${count}
      
      Task: Create a sequential narrative structure.
      Constraints:
      1. EXACTLY ${count} slides.
      2. EACH SLIDE MUST HAVE UNIQUE CONTENT. Do not repeat the intro.
      3. Content must be short and punchy (LinkedIn Style).
      
      Structure:
      - Slide 1: Hook/Title (Short).
      - Slide 2: The Problem/Context.
      - Slides 3 to ${count-1}: Distinct Step-by-Step tips or Insights.
      - Last Slide: Summary & CTA.
      
      Output strictly valid JSON Array: 
      [{"id":1, "title":"..", "content":".."}, {"id":2, "title":"..", "content":".."}...]
    `;
    
    // Try Groq first for carousels (it's faster and better at lists)
    let text;
    try { 
        console.log("👉 Carousel: Trying Groq...");
        text = await callGroq(prompt); 
    } catch { 
        console.log("❌ Groq Failed. Carousel: Trying Gemini...");
        text = await callGemini(prompt); 
    }
    
    res.json({ success: true, data: cleanAndParseJSON(text) });
  } catch (e) {
    // Fallback simulation
    const slides = Array.from({ length: count }, (_, i) => ({
      id: i + 1, title: `Slide ${i+1}: Insight`, content: "Simulation content due to AI limit."
    }));
    res.json({ success: true, data: slides }); 
  }
});

// 3. GENERATE IMAGE
app.post('/api/generate-image', async (req, res) => {
  const { topic, style } = req.body;
  try {
    let imagePrompt = topic;
    // Try to refine prompt with Groq
    if (process.env.GROQ_API_KEY) {
        try {
            const text = await callGroq(`Describe a visual image for: "${topic}". Style: ${style}. Return only the description text. No JSON.`);
            imagePrompt = text.trim();
        } catch (e) {}
    }

    const seed = Math.floor(Math.random() * 1000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?seed=${seed}&width=1080&height=1080&nologo=true`;
    res.json({ success: true, imageUrl, prompt: imagePrompt });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// 4. TOPIC SUGGESTION
app.get('/api/suggest-topic', async (req, res) => {
  try {
    const text = await callGroq("One trending B2B topic. Text only. No JSON.");
    res.json({ success: true, topic: text.replace(/"/g, '').trim() });
  } catch {
    res.json({ success: true, topic: "The Future of AI Agents" });
  }
});

// 5. TRENDS
app.get('/api/trends', async (req, res) => {
  res.json({ success: true, data: [
    { id: 1, topic: "AI Agents", category: "Tech", volume: "High", summary: "Agents are the new Apps." },
    { id: 2, topic: "Sustainable Tech", category: "Green", volume: "Med", summary: "Green computing is rising." },
    { id: 3, topic: "Deep Work", category: "Productivity", volume: "High", summary: "Focus is the new currency." }
  ]});
});

// --- CRUD OPERATIONS ---

app.post('/api/save', async (req, res) => {
  const { postId, userId, topic, content, carouselData, pollData, status, scheduledAt, type, image } = req.body;
  if (userId && mongoUri) {
    if (postId) {
      await Post.findByIdAndUpdate(postId, { topic, content, carouselData, pollData, type, status, scheduledAt, image });
    } else {
      await Post.create({ userId, topic, content, carouselData, pollData, type, status, scheduledAt, image });
    }
  }
  res.json({ success: true });
});

app.get('/api/history/:userId', async (req, res) => {
  if (!mongoUri) return res.json({ success: true, data: [] });
  const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json({ success: true, data: posts });
});

app.delete('/api/history/:id', async (req, res) => {
  if (!mongoUri) return res.json({ success: false });
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});