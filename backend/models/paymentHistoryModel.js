const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  userId: String,
  doctorId: String,
  amount: Number,
  payment_mode: String,
  payment_status: String,
  payment_id: String,
  order_id: String,
  created_at: Date,
});
module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);
