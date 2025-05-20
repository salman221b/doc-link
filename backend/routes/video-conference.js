const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { SDK } = require("@100mslive/server-sdk");
const { getAuthToken } = require("../utils/100msAuth");

const hms = new SDK({
  accessKey: process.env.HMS_ACCESS_KEY,
  secret: process.env.HMS_SECRET,
});

// ✅ CREATE ROOM - via REST API
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
        name,
        description: "Room created via API",
        template_id: "6821b9828102660b706b9a3e", // ✅ use your template ID
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error creating room:", data);
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// ✅ GET ROOM TOKEN - via 100ms SDK
router.post("/get-100ms-token", async (req, res) => {
  const { user_id, room_id, role } = req.body;

  try {
    const token = await hms.auth.getRoomToken({
      room_id,
      user_id,
      role,
      type: "app",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

module.exports = router;
