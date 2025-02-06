const express = require("express");
const bcrypt = require("bcryptjs");
const Patient = require("../models/patientsModel");
const Doctor = require("../models/doctorsModel");
const router = express.Router();

router.post("/reset-password", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role === "patient") {
      const patient = await Patient.findOne({ email });
      if (!patient) {
        return res
          .status(404)
          .json({ message: "Patient not found, Signup first " });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await Patient.updateOne({ email }, { password: hashedPassword });
      if (patient.verified === false) {
        await Patient.updateOne({ email }, { verified: true });
      }

      return res.status(200).json({ message: "Password reset successfully" });
    } else if (role === "doctor") {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res
          .status(404)
          .json({ message: "Doctor not found, Signup first " });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await Doctor.updateOne({ email }, { password: hashedPassword });
      if (doctor.verified === false) {
        await Doctor.updateOne({ email }, { verified: true });
      }
      return res.status(200).json({ message: "Password reset successfully" });
    } else {
      return res.status(400).json({ message: "Invalid role  " });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Failed to reset password. Try again later" });
  }
});

module.exports = router;
