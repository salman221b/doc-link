const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const isAuthenticated = require("../middlewares/authMiddleware");

router.get("/patients", isAuthenticated, async (req, res) => {
  const doctorId = req.user.id;
  try {
    const patients = await Appointment.find({ doctorId: doctorId })
      .populate(
        "patientId",
        "firstName lastName age phone email state district _id createdAt"
      )
      .sort({ createdAt: -1 });

    const uniquePatients = [];
    const seen = new Set();

    for (const appt of patients) {
      const id = appt.patientId._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        uniquePatients.push(appt);
      }
    }
    res.json(uniquePatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});
module.exports = router;
