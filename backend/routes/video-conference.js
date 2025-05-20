const express = require("express");
const router = express.Router();
const { SDK } = require("@100mslive/server-sdk");

// Initialize 100ms SDK with your credentials
const hms = new SDK({
  accessKey: process.env.HMS_ACCESS_KEY,
  secret: process.env.HMS_SECRET,
});

// POST /create-room
router.post("/create-room", async (req, res) => {
  const { name } = req.body;

  try {
    const room = await hms.rooms.create({
      name,
      description: "Room created from backend",
      template_id: "6821b9828102660b706b9a3e",
    });

    console.log("Room created:", room);
    res.status(200).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
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
