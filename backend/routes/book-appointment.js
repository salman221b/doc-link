const express = require("express");
const router = express.Router();

router.post("/book-appointment", (req, res) => {
  // Implement your appointment booking logic here
  const {
    userId,
    doctor,
    specialization,
    selectedDate,
    selectedSlot,
    mode,
    payment_mode,
    payment_status,
  } = req.body;
  console.log(
    userId,
    doctor,
    specialization,
    selectedDate,
    selectedSlot,
    mode,
    payment_mode,
    payment_status
  );
  res.json({ message: "Appointment booked successfully" });
});
