const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendOtpEmail = require("../otp_verification/sendOtpEmail");
const router = express.Router();
const Otp = require("../models/otpModel");

let otpStore = {}; // Temporary in-memory store for OTPs (replace with DB in production)

// Endpoint to resend OTP
router.post("/resend-otp", async (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Generate a new OTP (4-digit random number)
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save OTP in the store (replace with DB in production)
    otpStore[email] = otp;

    // Send OTP via email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Your Resended OTP Code",
      text: `Hi, \n Your new OTP code is: ${otp}. Valid till 10 minutes`,
    };

    await transporter.sendMail(mailOptions);

    // sendOtpEmail.sendOtpEmail(email, otp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    await Otp.updateOne({ email, role }, { otp, expiresAt });
    const record = await Otp.findOne({ email, role });

    if (!record) {
      await Otp.create({ email, otp, role, expiresAt });
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});

module.exports = router;
