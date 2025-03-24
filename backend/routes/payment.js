const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_TEST,
  key_secret: process.env.RAZORPAY_SECRET_TEST,
});

router.post("/create-payment", async (req, res) => {
  const payment = await razorpay.orders.create({
    amount: 50000, // Amount in paise (₹500)
    currency: "INR",
    payment_capture: 1,
  });
  res.json({ order_id: payment.id, amount: payment.amount });
});

router.post("/verify-payment", async (req, res) => {
  // Verify payment signature
  const isValid = verifyPayment(req.body);
  if (isValid) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
module.exports = router;
