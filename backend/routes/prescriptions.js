const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Prescription = require("../models/prescriptionsModel");

router.get("/prescriptions", authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.user.id,
    }).sort({
      createdAt: -1,
    });
    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
});
module.exports = router;
