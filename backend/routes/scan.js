// backend/routes/scan.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../db.js";

const router = express.Router();

// __dirname for this routes folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads folder is one level up: backend/uploads
const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// simple ping for debug
router.get("/ping", (req, res) => res.json({ ok: true }));

// ---------- CREATE UPLOAD ----------
// POST /scan/create  (multipart form)
// fields: userId (text), plantImage (file)
router.post("/create", upload.single("plantImage"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const fileName = req.file?.filename;

    if (!userId || !fileName) {
      return res.status(400).json({ success: false, error: "Missing userId or image file" });
    }

    // Fake AI for now
    const species_identified = "Ficus elastica";
    const confidence_score = 0.82;

    // Use table: plant_uploads (id, user_id, file_name, species_identified, confidence_score, created_at)
    await db.query(
      `INSERT INTO plant_uploads (user_id, file_name, species_identified, confidence_score)
       VALUES (?, ?, ?, ?)`,
      [userId, fileName, species_identified, confidence_score]
    );

    return res.json({
      success: true,
      file_name: fileName,
      species_identified,
      confidence_score,
    });
  } catch (e) {
    console.error("Upload create error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------- LAST UPLOAD (optional) ----------
// GET /scan/last/:userId
router.get("/last/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM plant_uploads WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    if (rows.length === 0) return res.json({ success: true, upload: null });
    return res.json({ success: true, upload: rows[0] });
  } catch (e) {
    console.error("Fetch last error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------- LIST ALL UPLOADS ----------
// GET /scan/list/:userId
router.get("/list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      `SELECT id, user_id, file_name, species_identified, confidence_score, created_at
         FROM plant_uploads
        WHERE user_id = ?
        ORDER BY created_at DESC`,
      [userId]
    );
    return res.json({ success: true, uploads: rows });
  } catch (e) {
    console.error("Fetch list error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
