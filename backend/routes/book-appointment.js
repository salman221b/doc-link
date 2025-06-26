const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
router.post("/book-appointment", async (req, res) => {
  try {
    const {
      userId,
      doctor,
      specialization,
      selectedDate,
      selectedSlot,
      mode,
      payment_mode,
      payment_status,
      amount,
      reason,
      symptoms,
    } = req.body;

    // Create a new appointment entry
    const newAppointment = new Appointment({
      patientId: userId,
      doctorId: doctor,
      specialization,
      scheduledDate: selectedDate,
      scheduledTime: selectedSlot,
      mode,
      paymentMode: payment_mode,
      paymentStatus: payment_status,
      amount,
      reason,
      symptoms,
    });

    // Save to the database
    await newAppointment.save();

    res.json({ success: true, message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment. Please try again.",
    });
  }
});

module.exports = router;
