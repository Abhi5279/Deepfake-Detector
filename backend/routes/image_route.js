import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


const predict_image = path.resolve("python_files/predict_image.py");

router.post("/predict-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.resolve(req.file.path);

  
  exec(`python "${predict_image}" "${imagePath}"`, (err, stdout, stderr) => {
   
    fs.unlinkSync(imagePath);

    if (err) {
      console.error("❌ Prediction error:", stderr);
      return res.status(500).json({ error: "Prediction failed" });
    }

    const [labelRaw, confidenceRaw] = stdout.trim().split("|");
    const label = parseInt(labelRaw.trim(), 10);
    const confidence = parseFloat(confidenceRaw.trim());

    let predictionText;
    if (label === 1) predictionText = "Real Face Detected";
    else if (label === 0) predictionText = "Fake Face Detected";
    else predictionText = "Unknown result";

    res.json({ prediction: predictionText, confidence });
  });
});

export default router;
