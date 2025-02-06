const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, "First name is required"],
    },
    lastName: { type: String, require: [true, "Last name is required"] },

    email: { type: String, require: [true, "Email is required"], unique: true },
    age: { type: String, require: [true, "Age is required"] },
    phone: { type: String, require: [true, "Phone number is required"] },
    state: { type: String, require: [true, "State is required"] },
    district: { type: String, require: [true, "District is required"] },
    password: { type: String, require: [true, "Password is required"] },

    role: { type: String, require: [true, "Role is required"] },
    verified: { type: Boolean, default: false },
    agreed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Patient", patientSchema);
