const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Patient = require("../models/patientsModel");
const Otp = require("../models/otpModel");
const sendOtpEmail = require("../otp_verification/sendOtpEmail");

const registerPatient = asyncHandler(async (req, res) => {
  console.log("Patient registration request:", req.body);

  const {
    firstName,
    lastName,
    email,
    age,
    phone,
    state,
    district,
    password,
    confirmPassword,
    role,
    verified,
    agreed,
  } = req.body;
  console.log("First Name", firstName);
  if (!firstName || !lastName || !email || !phone || !state) {
    return res.status(400).json({ errorMessage: "All fields are mandatory" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ errorMessage: "Password and Confirm Password do not match" });
  }

  const existingUser = await Patient.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ errorMessage: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
  };
  const otp = generateOtp();

  try {
    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      age,
      phone,
      state,
      district,
      password: hashedPassword,
      role,
      verified: false,
      agreed,
    });

    sendOtpEmail.sendOtpEmail(firstName, email, otp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    await Otp.create({ email, otp, role, expiresAt });

    res.status(201).json({
      id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ errorMessage: "Server error. Please try again." });
  }
});

module.exports = { registerPatient };
