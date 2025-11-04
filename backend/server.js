// import express from "express";
// import cors from "cors";
// import imageRoutes from "./routes/image_route.js";
// import videoRoutes from "./routes/video_route.js";
// import audioRoutes from "./routes/audio_route.js";
// import multer from "multer";
// import dotenv from "dotenv";
// import fetch from "node-fetch";
// import fs from "fs";

// dotenv.config();

// const upload = multer({ dest: "uploads/" });
// const app = express();
// app.use(cors());

// console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);


// app.post("/api/analyze", upload.single("file"), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const fileData = fs.readFileSync(filePath);
//     const base64Image = fileData.toString("base64");


//     const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

//     const prompt = `
// You are an AI authenticity checker. Analyze the uploaded image and determine if it looks AI-generated or real. 
// Return your response strictly in JSON format like:
// {
//   "prediction": "real" or "fake",
//   "confidence": "0-100%",
//   "explanation": "short reasoning"
// }
// `;

//     const body = {
//       contents: [
//         {
//           parts: [
//             { text: prompt },
//             {
//               inline_data: {
//                 mime_type: req.file.mimetype,
//                 data: base64Image,
//               },
//             },
//           ],
//         },
//       ],
//     };

//     const resp = await fetch(`${url}?key=${process.env.GEMINI_API_KEY}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await resp.json();


//     const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
//     res.json({ raw: data, parsed: text });
//     fs.unlinkSync(filePath);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to analyze image" });
//   }
// });




// app.use("/", imageRoutes);
// app.use("/", videoRoutes);
// app.use("/", audioRoutes);

// app.listen(4000, () => {
//   console.log("🚀 Node backend running on port 4000");
// });



// ====================== IMPORTS ======================
import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ====================== CONFIG ======================
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/deepfakeDB";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// ====================== DATABASE ======================
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====================== SCHEMAS ======================

// ---- USER ----
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

// ---- HISTORY ----
const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileType: String,
    prediction: String,
    confidence: String,
    explanation: String,
  },
  { timestamps: true }
);
const History = mongoose.model("History", historySchema);

// ====================== AUTH MIDDLEWARE ======================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ====================== AUTH ROUTES ======================

// ---- Signup ----
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ---- Login ----
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ---- Logout ----
app.post("/api/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// ====================== GEMINI ANALYSIS ROUTE ======================
app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    // ✅ Optional user detection for history saving
    const token = req.headers.authorization?.split(" ")[1];
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch {
        console.log("⚠️ Invalid or missing token in analysis");
      }
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString("base64");

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

    const prompt = `
You are an AI authenticity checker. Analyze the uploaded media (image/video/audio) 
and determine if it looks AI-generated or real. 
Return your response strictly in JSON format like:
{
  "prediction": "real" or "fake",
  "confidence": "0-100%",
  "explanation": "short reasoning"
}`;

    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: req.file.mimetype,
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    const resp = await fetch(`${url}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      parsed = {
        prediction: "unknown",
        confidence: "0%",
        explanation: "Parsing error",
      };
    }

    // ✅ Save result to history if logged in
    if (userId) {
      await History.create({
        userId,
        fileType: req.file.mimetype,
        prediction: parsed.prediction || "unknown",
        confidence: parsed.confidence || "0%",
        explanation: parsed.explanation || "N/A",
      });
    }

    fs.unlinkSync(filePath);
    res.json({ raw: data, parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze file" });
  }
});

// ====================== HISTORY ROUTES ======================

// Get all user history
app.get("/api/history", authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Delete single history record
app.delete("/api/history/:id", authMiddleware, async (req, res) => {
  try {
    await History.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "History item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete history item" });
  }
});

// Clear entire history
app.delete("/api/history", authMiddleware, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.json({ message: "All history cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// ====================== PROFILE ROUTE ======================
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// ====================== SERVER START ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `🔑 GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "Loaded" : "Missing!"}`
  );
});
