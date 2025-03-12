const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/appointment", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
