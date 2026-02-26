const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const aiRes = await axios.post(
      "http://127.0.0.1:5001/analyze",
      req.body
    );
    res.json(aiRes.data);
  } catch (err) {
    res.status(500).json({ error: "AI service unavailable" });
  }
});

module.exports = router;