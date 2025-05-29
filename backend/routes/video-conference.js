const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const {
  generateManagementToken,
  generateAppToken,
} = require("../utils/100msAuth");

// Create a new dynamic room
router.post("/create-room", async (req, res) => {
  const { name, description, session_id } = req.body;
  console.log("Creating room:", { name, session_id });

  try {
    const response = await fetch("https://api.100ms.live/v2/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${generateManagementToken()}`,
      },
      body: JSON.stringify({
        name: `${name}-${session_id}`, // Unique room name
        description: description || "Doctor-Patient Consultation",
        template_id: process.env.HMS_TEMPLATE_ID,
      }),
    });

    const data = await response.json();
    console.log("100ms API Response:", data);

    if (!response.ok || !data.id) {
      throw new Error(data.message || "Failed to create room");
    }

    res.json({
      success: true,
      room: {
        id: data.id,
        code: data.room_code,
        name: data.name,
      },
    });
  } catch (error) {
    console.error("Room creation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Room creation failed",
    });
  }
});

// Generate auth token
router.post("/get-token", async (req, res) => {
  const { room_id, user_id, role } = req.body;

  if (!room_id || !user_id || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const token = generateAppToken(room_id, user_id, role);

    const decoded = jwt.decode(token);
    console.log("Generated token for:", {
      room_id,
      user_id,
      role,
      decodedRoomID: decoded?.room_id,
    });

    res.json({
      success: true,
      token,
      room_id,
    });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({
      success: false,
      error: "Token generation failed",
      details: error.message,
    });
  }
});

module.exports = router;
