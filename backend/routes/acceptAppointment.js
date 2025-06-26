const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Doctor = require("../models/doctorsModel");

router.put("/accept-appointment/:id", authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Update appointment status
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Accepted" },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      success: true,
      message: "Appointment updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update appointment" });
  }
});
module.exports = router;
