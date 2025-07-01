const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Doctor = require("../models/doctorsModel");

router.get("/manage-appointments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // today at 00:00

    const appointments = await Appointment.find({
      doctorId: userId,
      scheduledDate: { $gte: startOfToday },
    })
      .populate(
        "patientId",
        "firstName lastName age phone email state district"
      )
      .sort({ scheduledDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});
router.get("/manage-appointments/:id", authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorId: userId,
    }).populate(
      "patientId",
      "firstName lastName age phone email state district"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
});
router.get("/search-appointments-by-date", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const userId = req.user.id;

    let appointments = await Appointment.find({
      doctorId: userId,
      scheduledDate: { $gte: startDate, $lte: endDate },
      status: status === "all" ? { $exists: true } : status,
    })
      .populate(
        "patientId",
        "firstName lastName age phone email state district"
      )
      .sort({ scheduledDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

module.exports = router;
