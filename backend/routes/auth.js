import express from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

// ---- MULTER CONFIG ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---- REGISTER ----
router.post("/register", async (req, res) => {
  const { username, realName, phone, email, password } = req.body;
  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, real_name, phone_number, email, password_hash) VALUES (?, ?, ?, ?, ?)",
      [username, realName, phone, email, hash]
    );
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---- LOGIN ----
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---- UPDATE PROFILE (includes email_visible) ----
router.post("/updateProfile", upload.single("profile_pic"), async (req, res) => {
  const { userId, username, real_name, email, phone_number } = req.body;

  // parse "1"/"0" or number to 1/0
  const visible =
    req.body.email_visible === "1" || req.body.email_visible === 1 ? 1 : 0;

  const profile_pic = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      `UPDATE users 
       SET username = ?, real_name = ?, email = ?, phone_number = ?, email_visible = ?,
           profile_pic = COALESCE(?, profile_pic)
       WHERE id = ?`,
      [username, real_name, email, phone_number, visible, profile_pic, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found or no changes made" });
    }

    console.log(`User ${userId} updated successfully. email_visible=${visible}`);
    res.json({
      success: true,
      message: "Profile updated successfully",
      profile_pic: profile_pic || null,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Database update failed" });
  }
});

// ---- CHANGE PASSWORD ----
router.post("/changePassword", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      newHash,
      userId,
    ]);

    console.log(`Password changed for user ${userId}`);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ---- GET USER ----
router.get("/getUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
