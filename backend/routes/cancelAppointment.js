const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const authMiddleware = require("../middlewares/authMiddleware");
router.put("/cancel-appointment/:id", authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Update appointment status to "Cancelled"
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Cancelled" },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel appointment" });
  }
});
module.exports = router;
