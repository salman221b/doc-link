// utils/100msAuth.js
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const HMS_ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const HMS_SECRET = process.env.HMS_SECRET;
const HMS_TEMPLATE_ID = process.env.HMS_TEMPLATE_ID;

const generateToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      access_key: HMS_ACCESS_KEY,
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
      jti: uuidv4(),
    },
    HMS_SECRET
  );
};

module.exports = {
  generateManagementToken: () => generateToken({ type: "management" }),
  generateAppToken: (roomId, userId, role) =>
    generateToken({
      room_id: roomId,
      user_id: userId,
      role,
      type: "app",
    }),
};
