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

module.exports = router;