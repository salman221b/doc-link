const express = require("express");
const router = express.Router();
const MedicalRecords = require("../models/medicalRecordsModel");
router.post("/medical-records", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
