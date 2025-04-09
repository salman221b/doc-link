const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // today at 00:00

    const appointments = await Appointment.find({
      patientId: userId,
      scheduledDate: { $gte: startOfToday },
    })
      .populate("doctorId", "firstName lastName")
      .sort({ scheduledDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

module.exports = router;
