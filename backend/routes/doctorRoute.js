const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig"); // Import Cloudinary Config
const doctorController = require("../controllers/doctorController");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const email = req.body.email; // Get user's email from request body
    return {
      folder: `doctor_documents/${email}`, // Store files in a folder named after the email
      public_id: `${Date.now()}-${file.originalname}`, // Unique file name
      format: file.mimetype.split("/")[1], // Keep original file format
    };
  },
});

const upload = multer({ storage: storage });

router.post(
  "/registerdoctor",
  upload.fields([
    { name: "medicalLicenseDocument" },
    { name: "degreeCertificate" },
    { name: "governmentIdProof" },
  ]),
  doctorController.registerDoctor
);

module.exports = router;
