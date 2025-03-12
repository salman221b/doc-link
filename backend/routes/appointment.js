const express = require("express");
const Doctor = require("../models/doctorsModel");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/appointment", authMiddleware, async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Log the user details

    const { specialization } = req.query;

    if (!specialization) {
      return res.status(400).json({ message: "Specialization is required" });
    }

    // Fetch doctors where specialization array contains the requested specialization
    const doctors = await Doctor.find({
      specialization: { $in: specialization.split(",") },
    });

    console.log("Doctors Fetched from DB:", doctors); // Debugging log

    if (!Array.isArray(doctors)) {
      return res.status(500).json({ message: "Unexpected data format" });
    }

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
