const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const router = express.Router();
const COOKIE_NAME = "auth_token";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setAuthCookie(res, token, remember) {
  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };

  if (remember) {
    options.maxAge = 7 * 24 * 60 * 60 * 1000;
  }

  res.cookie(COOKIE_NAME, token, options);
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sanitizeEmail(raw) {
  return String(raw || "").trim().toLowerCase();
}

// signup
router.post("/signup", async (req, res) => {
  const email = sanitizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const remember = Boolean(req.body.remember);

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: "Password too short." });
  }

  const [existing] = await db.query(
    "SELECT id FROM users WHERE email=?",
    [email]
  );
  if (existing.length) {
    return res
      .status(400)
      .json({ success: false, message: "Email already in use." });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.query(
      "INSERT INTO users (email, password_hash) VALUES (?,?)",
      [email, hash]
    );

    const user = { id: result.insertId, email };
    const token = signToken(user);
    setAuthCookie(res, token, remember);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  const email = sanitizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const remember = Boolean(req.body.remember);

  if (!EMAIL_RE.test(email) || !password) {
    return res.status(400).json({ success: false, message: "Invalid login." });
  }

  const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
  if (!rows.length) {
    return res.status(401).json({ success: false, message: "Login failed." });
  }

  const match = await bcrypt.compare(password, rows[0].password_hash);
  if (!match) {
    return res.status(401).json({ success: false, message: "Login failed." });
  }

  const user = { id: rows[0].id, email: rows[0].email };
  const token = signToken(user);
  setAuthCookie(res, token, remember);
  res.json({ success: true, user });
});

// logout
router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

// current user
router.get("/me", (req, res) => {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (!token) return res.json({ user: null });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { id: payload.id, email: payload.email } });
  } catch {
    res.json({ user: null });
  }
});

module.exports = router;
