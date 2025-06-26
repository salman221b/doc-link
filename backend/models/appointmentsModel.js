const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  specialization: String,
  scheduledDate: Date,
  scheduledTime: String,
  reminderSent: {
    type: Boolean,
    default: false,
  },

  status: { type: String, default: "Pending" },
  mode: String,
  paymentMode: String,
  paymentStatus: String,
  amount: Number,
  reason: String,
  symptoms: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
