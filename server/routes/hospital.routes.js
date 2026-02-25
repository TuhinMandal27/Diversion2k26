const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([]);
});

const db = require("../db");

/**
 * GET /api/hospitals?lat=..&lng=..
 * Returns nearest hospitals
 */
router.get("/", (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.json([]);
  }

  const query = `
    SELECT id, name, address, phone,
    (
      6371 * acos(
        cos(radians(?)) *
        cos(radians(latitude)) *
        cos(radians(longitude) - radians(?)) +
        sin(radians(?)) *
        sin(radians(latitude))
      )
    ) AS distance
    FROM hospitals
    ORDER BY distance
    LIMIT 10
  `;

  db.query(query, [lat, lng, lat], (err, rows) => {
    if (err) {
      console.error(err);
      return res.json([]);
    }
    res.json(rows);
  });
});

module.exports = router;