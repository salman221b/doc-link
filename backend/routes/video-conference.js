const express = require("express");
const router = express.Router();
const { SDK } = require("@100mslive/server-sdk");
const { getAuthToken } = require("../utils/100msAuth");
// Initialize 100ms SDK with your credentials
const hms = new SDK({
  accessKey: process.env.HMS_ACCESS_KEY,
  secret: process.env.HMS_SECRET,
});

// POST /create-room
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
        template_id: "6821b9828102660b706b9a3e",
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
// POST /get-100ms-token
router.post("/get-100ms-token", async (req, res) => {
  const { user_id, room_id, role } = req.body;

  try {
    const token = await hms.rooms.createToken({
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
