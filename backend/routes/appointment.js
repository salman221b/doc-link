const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/appointment", authMiddleware, async (req, res) => {});

module.exports = router;
