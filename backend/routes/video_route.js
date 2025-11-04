import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/videos/" });

const predict_video = path.resolve("python_files/predict_video.py");

router.post("/predict-video", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file uploaded" });
  }

  const videoPath = path.resolve(req.file.path);

  exec(`python "${predict_video}" "${videoPath}"`, (err, stdout, stderr) => {
    fs.unlinkSync(videoPath); 

    if (err) {
      console.error("❌ Prediction error:", stderr);
      return res.status(500).json({ error: "Prediction failed" ,
        error1: err
      });
    }

    const [labelRaw, confidenceRaw] = stdout.trim().split("|");
    const label = parseInt(labelRaw.trim(), 10);
    const confidence = parseFloat(confidenceRaw.trim());

    let predictionText;
    if (label === 1) predictionText = "Real Video Detected";
    else if (label === 0) predictionText = "Fake Video Detected";
    else predictionText = "Unknown result";

    res.json({ prediction: predictionText, confidence });
  });
});

export default router;
