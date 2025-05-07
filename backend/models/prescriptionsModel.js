const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true },
  frequency: String,
  remarks: { type: String },
});
const prescriptionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    diagnosis: String,
    medicines: [medicineSchema],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Prescription", prescriptionSchema);
