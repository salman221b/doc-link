// routes/hmsRoutes.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const {
  generateManagementToken,
  generateAppToken,
} = require("../utils/100msAuth");

// Create new consultation room
router.post("/create-room", async (req, res) => {
  const { name } = req.body;

  try {
    const response = await fetch("https://api.100ms.live/v2/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${generateManagementToken()}`,
      },
      body: JSON.stringify({
        name,
        template_id: process.env.HMS_TEMPLATE_ID,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw data;

    res.json({
      success: true,
      room: data,
    });
  } catch (error) {
    console.error("Room creation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Room creation failed",
    });
  }
});

// Generate auth token for participant
router.post("/get-token", async (req, res) => {
  const { room_id, user_id, role } = req.body;

  try {
    if (!room_id || !user_id || !role) {
      throw new Error("Missing required fields");
    }

    const token = generateAppToken(room_id, user_id, role);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Token generation failed:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Token generation failed",
    });
  }
});

module.exports = router;
