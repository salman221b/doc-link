const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // for generating unique jti

function getAuthToken() {
  const accessKey = process.env.HMS_ACCESS_KEY;
  const secret = process.env.HMS_SECRET;

  const payload = {
    access_key: accessKey,
    type: "management", // required for creating rooms
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours validity
    jti: uuidv4(), // 👈 required unique token ID
  };

  return jwt.sign(payload, secret);
}

module.exports = { getAuthToken };
