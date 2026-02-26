const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);

router.post("/", (req, res) => {
  const sosData = req.body;

  console.log(" REAL-TIME SOS RECEIVED:");
  console.table(sosData);
  res.json({ success: true });
});

router.post("/", (req, res) => {
  console.log("🚨 SOS RECEIVED:", req.body);

  // MOCK doctor assignment (guaranteed)
  const assignedDoctor = {
    id: 1,
    name: "Dr. Neha Verma",
    speciality: "Emergency Medicine",
    hospital: "Apollo Hospital",
    consultUrl: "/consult.html"
  };

  console.log("SOS RECEIVED");
  console.table({
    latitude,
    longitude,
    address,
    time,
    assignedDoctor: assignedDoctor.name
  });

  res.json({
    success: true,
    doctor: assignedDoctor
  });
});

module.exports = router;