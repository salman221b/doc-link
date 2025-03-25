const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patientsModel");
const Doctor = require("../models/doctorsModel");
const dotenv = require("dotenv");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  //   console.log(req.body);

  try {
    let user;

    if (role === "patient") {
      // Search in Patient model
      user = await Patient.findOne({ email });
    } else if (role === "doctor") {
      // Search in Doctor model
      user = await Doctor.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verified === false) {
      return res.status(403).json({
        message: "Account not verified, Click on forgot password and verify",
      });
    }
    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role,
        phone: user.phone || "",
        name: `${user.firstName} ${user.lastName}` || "",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
