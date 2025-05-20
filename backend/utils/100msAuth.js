function getAuthToken() {
  const accessKey = process.env.HMS_ACCESS_KEY;
  const secret = process.env.HMS_SECRET;
  return Buffer.from(`${accessKey}:${secret}`).toString("base64");
}

module.exports = { getAuthToken };
