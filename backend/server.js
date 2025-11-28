// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db.js";               
import authRoutes from "./routes/auth.js";
import scanRoutes from "./routes/scan.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mount routes
app.use("/auth", authRoutes);
app.use("/scan", scanRoutes);

// ---- DB probe + start server (async safe) ----
async function start() {
  try {
    const [r1] = await db.query("SELECT DATABASE() AS db");
    const [r2] = await db.query("SHOW TABLES");
    console.log("Connected DB:", r1[0]?.db);
    console.log("Tables in DB:", r2.map((x) => Object.values(x)[0]));
  } catch (e) {
    console.error("DB probe failed:", e);
  }

  app.listen(5000, () => console.log("Server running on port 5000"));
}

start(); // <- run it
