require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
const defaultOrigins = ["http://localhost:3000", "https://neinoss.github.io"];
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const originAllowlist = new Set([...defaultOrigins, ...allowedOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (originAllowlist.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

function requireUser(req, res, next) {
  const token = req.cookies && req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

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

// Favorites
app.get("/api/favorites", requireUser, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM favorites WHERE user_id=? ORDER BY id DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/favorites/toggle", requireUser, async (req, res) => {
  const { subject = null, grade = null, title, url = null, kind, resource_id = null } =
    req.body || {};

  if (!title || !kind) {
    return res.status(400).json({ error: "Missing fields." });
  }

  const params = [req.user.id];
  let lookupQuery =
    "SELECT id FROM favorites WHERE user_id=? AND subject=? AND grade=? AND title=? AND url=? AND kind=?";
  if (resource_id) {
    lookupQuery = "SELECT id FROM favorites WHERE user_id=? AND resource_id=?";
    params.push(Number(resource_id));
  } else {
    params.push(subject, grade === null ? null : Number(grade), title, url, kind);
  }

  try {
    const [existing] = await db.query(lookupQuery, params);
    if (existing.length) {
      await db.query("DELETE FROM favorites WHERE id=?", [existing[0].id]);
      return res.json({ favorited: false, id: existing[0].id });
    }

    const [result] = await db.query(
      "INSERT INTO favorites (user_id, subject, grade, title, url, kind, resource_id) VALUES (?,?,?,?,?,?,?)",
      [
        req.user.id,
        subject,
        grade === null ? null : Number(grade),
        title,
        url,
        kind,
        resource_id === null ? null : Number(resource_id)
      ]
    );

    return res.json({ favorited: true, id: result.insertId });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 4000, () =>
  console.log("Backend running on port", process.env.PORT || 4000)
);
