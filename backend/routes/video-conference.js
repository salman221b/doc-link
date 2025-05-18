const express = require("express");
const router = express.Router();
const { HMSAccessToken } = require("@100mslive/server-sdk");

const ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const SECRET = process.env.HMS_SECRET;
console.log("Access Key:", ACCESS_KEY); // 🔒 remove this in production!

router.post("/get-100ms-token", async (req, res) => {
  try {
    const { user_id, room_id, role } = req.body;

    if (!user_id || !room_id || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const token = new HMSAccessToken({
      accessKey: ACCESS_KEY,
      secret: SECRET,
    });

    token
      .setUserId(user_id)
      .setRoomId(room_id)
      .setRole(role)
      .setExpiration(3600);

    const jwt = await token.build();
    return res.json({ token: jwt });
  } catch (err) {
    console.error("Error generating 100ms token:", err.message);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});
module.exports = router;
