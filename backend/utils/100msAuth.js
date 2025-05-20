// utils/100msAuth.js
const jwt = require("jsonwebtoken");

function getAuthToken() {
  const accessKey = process.env.HMS_ACCESS_KEY;
  const secret = process.env.HMS_SECRET;

  const payload = {
    access_key: accessKey,
    type: "management",
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  return jwt.sign(payload, secret);
}

module.exports = { getAuthToken };
