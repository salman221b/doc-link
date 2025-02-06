const express = require("express");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patientsModel");
const Doctor = require("../models/doctorsModel");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, async (req, res) => {
  const role = req.headers.role;
  try {
    if (role === "patient") {
      const user = await Patient.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user._doc, isVerified: user.verified });
    }
    if (role === "doctor") {
      const user = await Doctor.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user._doc, isVerified: user.verified });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
