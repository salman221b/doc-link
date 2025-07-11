const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const MedicalRecords = require("../models/medicalRecordsModel");

router.get("/medical-records-for-doctor", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const medicalRecords = await MedicalRecords.find({
      patientId: req.query,
    }).sort({ createdAt: -1 });
    res.json(medicalRecords);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
});
module.exports = router;
