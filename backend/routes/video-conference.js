const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const SECRET = process.env.HMS_SECRET;

router.post("/get-100ms-token", async (req, res) => {
  const { user_id, room_id, role } = req.body;

  console.log("Received token request:", { user_id, room_id, role });

  try {
    const response = await fetch(
      "https://prod-in.100ms.live/hmsapi/salmaan-videoconf-1433.app.100ms.live/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${ACCESS_KEY}:${SECRET}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          user_id,
          role,
          room_id,
        }),
      }
    );

    const data = await response.json();
    console.log("100ms API response:", data);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.message || "Failed to get 100ms token" });
    }

    res.json({ token: data.token });
  } catch (error) {
    console.error("Error fetching 100ms token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
