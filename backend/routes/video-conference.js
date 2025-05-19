const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // v2 for CommonJS
require("dotenv").config();

const ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const SECRET = process.env.HMS_SECRET;

router.post("/get-100ms-token", async (req, res) => {
  const { user_id, room_id, role } = req.body;
  console.log("Received token request:", { user_id, room_id, role });

  try {
    const apiResponse = await fetch("https://api.100ms.live/v2/room-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${ACCESS_KEY}:${SECRET}`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify({
        user_id,
        room_id,
        role,
      }),
    });

    const text = await apiResponse.text(); // get raw text

    try {
      const data = JSON.parse(text); // try parsing JSON
      if (!data.token) {
        console.error("Invalid 100ms response:", data);
        return res
          .status(500)
          .json({ error: "Token not found", details: data });
      }

      res.json({ token: data.token });
    } catch (parseError) {
      console.error("Failed to parse 100ms response as JSON:", text);
      return res
        .status(500)
        .json({ error: "Invalid response from 100ms", raw: text });
    }
  } catch (error) {
    console.error("Error fetching 100ms token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
