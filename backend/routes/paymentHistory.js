const express = require("express");
const router = express.Router();
const PaymentHistory = require("../models/paymentHistoryModel");
const authMiddleware = require("../middlewares/authMiddleware");

// GET: Fetch payment history for logged-in user
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

// POST: Save a new payment record
router.post("/payment-history", authMiddleware, async (req, res) => {
  try {
    console.log("Received payment POST body:", req.body);
    const {
      doctorId,
      amount,
      payment_mode,
      payment_status,
      payment_id,
      order_id,
      created_at,
    } = req.body;

    const payment = new PaymentHistory({
      userId: req.user.id, // taken from authMiddleware
      doctorId,
      amount,
      payment_mode,
      payment_status,
      payment_id,
      order_id,
      created_at: created_at || new Date(),
    });

    await payment.save();

    res.status(201).json({ success: true, message: "Payment history saved." });
  } catch (error) {
    console.error("Error saving payment history:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save payment history" });
  }
});
router.get("/search-payment-history", authMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start and End dates required." });
  }

  try {
    const payments = await PaymentHistory.find({
      userId: req.user.id, // assuming token middleware adds this
      created_at: {
        $gte: new Date(startDate),
        $lt: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1)
        ),
      },
    }).sort({ created_at: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to fetch records!" });
  }
});

module.exports = router;
