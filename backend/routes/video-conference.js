const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
require("dotenv").config();

const ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const SECRET = process.env.HMS_SECRET;

router.post("/get-100ms-token", async (req, res) => {
  const { user_id, room_id, role } = req.body;

  console.log("Received token request:", { user_id, room_id, role });

  if (!user_id || !room_id || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://api.100ms.live/v2/room-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${ACCESS_KEY}:${SECRET}`).toString("base64"),
      },
      body: JSON.stringify({
        user_id,
        room_id,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("100ms API error:", data);
      return res
        .status(response.status)
        .json({ error: "Token generation failed", details: data });
    }

    res.json({ token: data.token });
  } catch (err) {
    console.error("Error fetching 100ms token:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
