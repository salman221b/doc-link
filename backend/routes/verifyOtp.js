const express = require("express");

const router = express.Router();
const Otp = require("../models/otpModel");
const Patient = require("../models/patientsModel");
const Doctor = require("../models/doctorsModel");

router.post("/verify-otp", async (req, res) => {
  const { email, otp, role } = req.body;
  console.log(email, otp, role);

  const record = await Otp.findOne({ email, otp, role });

  if (!record) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (new Date() > record.expiresAt) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  // OTP is valid; delete it from the database
  await Otp.deleteOne({ email, role });

  if (role === "patient") {
    await Patient.updateOne({ email }, { verified: true });
    return res.status(200).json({ message: "OTP verified successfully" });
  }

  if (role === "doctor") {
    await Doctor.updateOne({ email }, { verified: true });
    return res.status(200).json({ message: "OTP verified successfully" });
  }
});
module.exports = router;
