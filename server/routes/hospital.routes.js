const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db");


/**
 * TEST ROUTE (very important)
 */
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

/**
 * GET /api/hospitals/search?lat=..&lng=..
 */
router.get("/search", (req, res) => {
  const { lat, lng } = req.query;

  console.log("Hospital search hit:", lat, lng);

  res.json([
    {
      name: "Apollo Hospital",
      address: "Kolkata",
      phone: "+91 98765 43210",
      doctor_name: "Amit Sharma",
      speciality: "Emergency Medicine",
      distance: 2.1
    },
    {
      name: "Fortis Hospital",
      address: "Kolkata",
      phone: "+91 91234 56789",
      doctor_name: "Neha Verma",
      speciality: "Trauma Specialist",
      distance: 4.6
    }
  ]);
});

/**
 * GET /api/hospitals?lat=..&lng=..
 * Returns nearest hospitals
 */
// router.get("/search", (req, res) => {
//   const { lat, lng } = req.query;

//   // simulate network delay (realistic)
//   setTimeout(() => {
//     res.json([
//       {
//         name: "Apollo Hospital",
//         address: "Sector 26, Noida",
//         phone: "+91 98765 43210",
//         doctor_name: "Amit Sharma",
//         speciality: "Emergency Medicine",
//         distance: 2.1
//       },
//       {
//         name: "Fortis Hospital",
//         address: "Sector 62, Noida",
//         phone: "+91 91234 56789",
//         doctor_name: "Neha Verma",
//         speciality: "Trauma Specialist",
//         distance: 4.6
//       },
//       {
//         name: "Max Super Speciality Hospital",
//         address: "Sector 19, Noida",
//         phone: "+91 99887 66554",
//         doctor_name: "Rahul Mehta",
//         speciality: "Cardiology",
//         distance: 6.3
//       }
//     ]);
//   }, 1500); // 1.5 sec delay for realism
// });

module.exports = router;