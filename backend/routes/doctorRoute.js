const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const doctorController = require("../controllers/doctorController");
// Store files in memory as Buffer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const email = req.body.email; // Get email from the request body
    if (!email) {
      return cb(new Error("Email is required for file storage"));
    }

    const folderPath = path.join("uploads", email); // Create a folder path based on email

    // Check if folder exists, if not, create it
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, folderPath);
    });
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
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
