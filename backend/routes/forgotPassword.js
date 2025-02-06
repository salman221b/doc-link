const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendOtpEmail = require("../otp_verification/sendOtpEmail");
const router = express.Router();
const Otp = require("../models/otpModel");
const Doctor = require("../models/doctorsModel");
const Patient = require("../models/patientsModel");

router.post("/forgot-password", async (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  if (role === "patient") {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
  } else if (role === "doctor") {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
  }

  try {
    // Generate OTP and expiration date
    const generateOtp = () => {
      return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
    };
    const otp = generateOtp();

    sendOtpEmail.sendOtpEmail("", email, otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    await Otp.create({ email, otp, role, expiresAt });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP. Try again later" });
  }
});
module.exports = router;
