const express = require("express");
const router = express.Router();
const HMSAccessToken = require("@100mslive/server-sdk").HMSAccessToken; // get it as a property

const ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const SECRET = process.env.HMS_SECRET;

router.post("/get-100ms-token", async (req, res) => {
  try {
    const { user_id, room_id, role } = req.body;

    // Note: HMSAccessToken is not a class constructor, but a factory function:
    const token = HMSAccessToken({
      accessKey: ACCESS_KEY,
      secret: SECRET,
    });

    token
      .setUserId(user_id)
      .setRoomId(room_id)
      .setRole(role)
      .setExpiration(3600);

    const jwt = await token.build();

    res.json({ token: jwt });
  } catch (error) {
    console.error("Error generating 100ms token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

module.exports = router;
