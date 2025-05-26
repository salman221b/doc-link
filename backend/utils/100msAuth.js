// utils/100msAuth.js
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const generateAppToken = (roomId, userId, role) => {
  const payload = {
    access_key: process.env.HMS_ACCESS_KEY,
    room_id: roomId,
    user_id: userId,
    role: role,
    type: "app", // Changed from 'management' to 'app'
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
    jti: uuidv4(),
    groups: [], // Add empty groups array
  };

  return jwt.sign(payload, process.env.HMS_SECRET);
};

module.exports = { generateAppToken };
