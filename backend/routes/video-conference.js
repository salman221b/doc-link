const express = require("express");
const router = express.Router();
const { HMSAccessToken } = require("@100mslive/server-sdk");

const ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const SECRET = process.env.HMS_SECRET;

router.post("/get-100ms-token", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  const { user_id, room_id, role } = req.body;

  const token = new HMSAccessToken({
    accessKey: ACCESS_KEY,
    secret: SECRET,
  });

  token
    .setUserId(user_id)
    .setRoomId(room_id)
    .setRole(role) // Must match template role
    .setExpiration(3600); // 1 hour

  const jwt = await token.build();
  res.json({ token: jwt });
});

module.exports = router;
