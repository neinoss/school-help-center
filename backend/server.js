require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db");

const app = express();
const corsOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ server: true, db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ server: true, db: false, error: e.message });
  }
});

const authRoutes = require("./auth");
app.use("/api", authRoutes);

// GET resources by subject+grade
app.get("/api/resources", async (req, res) => {
  const { subject, grade } = req.query;
  try {
    const [rows] = await db.query(
      "SELECT * FROM resources WHERE subject=? AND grade=? ORDER BY id DESC",
      [subject, Number(grade)]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ADD a resource (optional, for easy testing)
app.post("/api/resources", async (req, res) => {
  const { subject, grade, title, description, youtube_url } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO resources (subject, grade, title, description, youtube_url) VALUES (?,?,?,?,?)",
      [subject, Number(grade), title, description || null, youtube_url || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Track WhatsApp button clicks
app.post("/api/track/whatsapp", async (req, res) => {
  const { subject = null, grade = null } = req.body || {};
  try {
    await db.query(
      "INSERT INTO whatsapp_clicks (subject, grade) VALUES (?,?)",
      [subject, grade === null ? null : Number(grade)]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get total WhatsApp clicks
app.get("/api/track/whatsapp/count", async (req, res) => {
  try {
    const [[row]] = await db.query("SELECT COUNT(*) AS total FROM whatsapp_clicks");
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 4000, () =>
  console.log("Backend running on port", process.env.PORT || 4000)
);
