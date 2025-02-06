const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    age: String,
    phone: String,
    state: String,
    district: String,
    password: String,
    role: String,
    medicalLicenseNumber: String,
    specialization: String,
    qualification: String,
    yearOfExperience: String,
    hospitalName: String,
    registrationAuthority: String,
    registrationNumber: String,
    consultationFee: {
      inPerson: String,
      video: String,
      teleconsultation: String,
    },
    availableConsultations: {
      inPerson: Boolean,
      video: Boolean,
      teleconsultation: Boolean,
    },
    availabilitySchedule: Object, // Accepts nested day-wise schedule
    clinicAddress: String,
    medicalLicenseDocument: {
      file_name: String,
      file_type: String,
      file_data: String, // Path to file
    },
    degreeCertificate: {
      file_name: String,
      file_type: String,
      file_data: String, // Path to file
    },
    governmentIdProof: {
      file_name: String,
      file_type: String,
      file_data: String, // Path to file
    },
    language: Object,
    shortBio: String,
    profileLinks: {
      linkedin: String,
      website: String,
    },
    verified: { type: Boolean, default: false },

    agreed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Doctor", DoctorSchema);
