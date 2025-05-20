const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const { generateAccessToken } = require("@100mslive/server-sdk");

require("dotenv").config();

const ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const SECRET = process.env.HMS_SECRET;

function getAuthToken() {
  return Buffer.from(`${ACCESS_KEY}:${SECRET}`).toString("base64");
}

// 1. Create a Room
router.post("/create-room", async (req, res) => {
  const { name } = req.body;

  try {
    const response = await fetch("https://api.100ms.live/v2/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${getAuthToken()}`,
      },
      body: JSON.stringify({
        name: name,
        description: "Room created via API",
        template_id: "6821b9828102660b706b9a3e",
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// 2. Generate Token for Room
router.post("/get-100ms-token", (req, res) => {
  const { user_id, room_id, role } = req.body;

  try {
    // generateAccessToken params: (accessKey, secret, userId, roomId, role, expiration)
    const token = generateAccessToken(
      process.env.HMS_ACCESS_KEY,
      process.env.HMS_SECRET,
      user_id,
      room_id,
      role,
      3600 // 1 hour expiration in seconds
    );

    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

module.exports = router;
