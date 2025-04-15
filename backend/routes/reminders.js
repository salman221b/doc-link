const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentsModel");
app.get("/reminders", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const upcoming = new Date(now.getTime() + 15 * 60 * 1000);

  const appointments = await Appointment.find({
    patientId: userId,
    scheduledDate: { $gte: now, $lte: upcoming },
  }).populate("doctorId");

  const reminders = appointments.map((a) => ({
    doctorName: `${a.doctorId.firstName} ${a.doctorId.lastName}`,
    time: a.scheduledTime,
  }));

  res.json(reminders);
});

module.exports = router;
