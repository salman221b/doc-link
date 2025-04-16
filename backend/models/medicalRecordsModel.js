const mongoose = require("mongoose");

const medicalRecordsSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  file: String,
  fileName: String,
  category: String,
  remarks: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MedicalRecords", medicalRecordsSchema);
