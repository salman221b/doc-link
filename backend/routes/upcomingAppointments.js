const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({
      patientId: userId,
      scheduledDate: { $gte: new Date() },
    })
      .populate("doctorId", "firstName lastName specialization")
      .sort({ scheduledDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

module.exports = router;
