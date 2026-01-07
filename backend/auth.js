const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");

const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (email, password_hash) VALUES (?,?)",
      [email, hash]
    );
    res.json({ success: true });
  } catch {
    res.status(400).json({ success: false });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  if (!rows.length) return res.json({ success: false });

  const match = await bcrypt.compare(password, rows[0].password_hash);
  res.json({ success: match });
});

module.exports = router;
