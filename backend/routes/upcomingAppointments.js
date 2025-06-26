const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Doctor = require("../models/doctorsModel");

router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // today at 00:00

    const appointments = await Appointment.find({
      patientId: userId,
      scheduledDate: { $gte: startOfToday },
    })
      .populate(
        "doctorId",
        "firstName lastName availabilitySchedule qualification"
      )
      .sort({ scheduledDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});
router.delete("/appointments/:id", authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    await Appointment.findByIdAndDelete(appointmentId);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
});
router.put("/appointments/:id", authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedData = req.body;
    console.log(updatedData);
    await Appointment.findByIdAndUpdate(appointmentId, updatedData);
    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
});

module.exports = router;
