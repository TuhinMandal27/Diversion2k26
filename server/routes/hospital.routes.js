// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const db = require("../db");


// /**
//  * TEST ROUTE (very important)
//  */
// router.get("/test", (req, res) => {
//   res.json({ ok: true });
// });

// /**
//  * GET /api/hospitals/search?lat=..&lng=..
//  */
// router.get("/search", (req, res) => {
//   const { lat, lng } = req.query;

//   console.log("Hospital search hit:", lat, lng);

//   res.json([
//     {
//       name: "Apollo Hospital",
//       address: "Kolkata",
//       phone: "+91 98765 43210",
//       doctor_name: "Amit Sharma",
//       speciality: "Emergency Medicine",
//       distance: 2.1
//     },
//     {
//       name: "Fortis Hospital",
//       address: "Kolkata",
//       phone: "+91 91234 56789",
//       doctor_name: "Neha Verma",
//       speciality: "Trauma Specialist",
//       distance: 4.6
//     }
//   ]);
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const axios = require("axios");

/* TEST ROUTE */
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

/* Distance calculator (Haversine formula) */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* GET /api/hospitals/search */
router.get("/search", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    const overpassQuery = `
      [out:json];
      node
        ["amenity"="hospital"]
        (around:5000, ${lat}, ${lng});
      out;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      { headers: { "Content-Type": "text/plain" } }
    );

    const elements = response.data.elements;

    const hospitals = elements.map(h => {
      const distance = getDistance(
        parseFloat(lat),
        parseFloat(lng),
        h.lat,
        h.lon
      );

      return {
        name: h.tags.name || "Unnamed Hospital",
        address: h.tags["addr:full"] || h.tags["addr:street"] || "Address not available",
        phone: h.tags.phone || "N/A",

        // Mock doctor (for hackathon demo)
        doctor_name: "On-Duty Specialist",
        speciality: "Emergency Care",

        distance: distance
      };
    });

    // Sort by nearest
    hospitals.sort((a, b) => a.distance - b.distance);

    res.json(hospitals.slice(0, 15)); // limit to 15 results

  } catch (error) {
    console.error("Overpass error:", error.message);
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

module.exports = router;