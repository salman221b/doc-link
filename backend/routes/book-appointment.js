const express = require("express");
const router = express.Router();

router.post("/book-appointment", (req, res) => {
  // Implement your appointment booking logic here
  res.json({ message: "Appointment booked successfully" });
});
