require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ server: true, db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ server: true, db: false, error: e.message });
  }
});

app.listen(process.env.PORT || 4000, () =>
  console.log("Backend running on port", process.env.PORT || 4000)
);
