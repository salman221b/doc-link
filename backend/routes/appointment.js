const express = require("express");
const Doctor = require("../models/doctorsModel");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/appointment", authMiddleware, async (req, res) => {
  try {
    // console.log("Authenticated User:", req.user); // Log the user details

    let { specialization } = req.query;

    if (!specialization) {
      return res.status(400).json({ message: "Specialization is required" });
    }
    if (typeof specialization === "string") {
      specialization = specialization.replace(/[\[\]"]/g, ""); // Remove brackets and quotes
    }

    console.log("Fetching doctors for specialization:", specialization);

    const doctors = await Doctor.find();

    const filteredDoctors = doctors.filter((doctor) => {
      let storedSpecialization = JSON.parse(doctor.specialization[0]); // Convert string to array
      return storedSpecialization.includes(specialization);
    });

    if (filteredDoctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    console.log("Doctors Fetched from DB:", filteredDoctors);
    res.json(filteredDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
