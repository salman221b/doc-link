const express = require("express");
const router = express.Router();
const PaymentHistory = require("../models/paymentHistoryModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/payment-history", authMiddleware, async (req, res) => {
  try {
    const payments = await PaymentHistory.find({ userId: req.user.id }).sort({
      created_at: -1,
    });
    res.json({ success: true, history: payments });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment history" });
  }
});

module.exports = router;
