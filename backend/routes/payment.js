const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_TEST,
  key_secret: process.env.RAZORPAY_SECRET_TEST,
});

router.post("/create-payment", async (req, res) => {
  const { amount } = req.body;
  const payment = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    payment_capture: 1,
  });
  res.json({ order_id: payment.id, amount: payment.amount });
});

router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // Step 1: Generate HMAC SHA256 signature
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_TEST)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      // Step 2: Fetch payment details from Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      res.json({
        success: true,
        payment_mode: payment.method, // Example: "upi", "card", "netbanking"
        payment_status: payment.status, // Example: "captured", "failed"
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Payment verification failed" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Invalid payment signature" });
  }
});

module.exports = router;
