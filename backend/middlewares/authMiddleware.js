const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorsModel"); // If doctors are stored separately
const Patient = require("../models/patientsModel"); // If patients are stored separately

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    const role = req.headers.role; // Extract role from request headers

    if (!token || !role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (role === "doctor") {
      user = await Doctor.findById(decoded.id);
    } else if (role === "patient") {
      user = await Patient.findById(decoded.id);
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is verified
    if (!user.verified) {
      return res.status(403).json({
        message: "Account not verified",
      });
    }

    req.user = user; // Attach user data to request object
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
