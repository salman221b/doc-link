const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const MedicalRecords = require("../models/medicalRecordsModel");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "medical_records",
      public_id: `${Date.now()}-${file.originalname}`,
      allowed_formats: ["jpg", "png", "pdf", "jpeg"],
    };
  },
});
const upload = multer({ storage });
router.post("/medical-records", upload.single("file"), async (req, res) => {
  try {
    const { fileName, category, remarks, patientId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const newRecord = new MedicalRecords({
      patientId,
      file: req.file.path, // Cloudinary URL
      fileName,
      category,
      remarks,
    });

    await newRecord.save();
    res.status(201).json({
      message: "Medical record uploaded successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/medical-records", async (req, res) => {
  try {
    const records = await MedicalRecords.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records" });
  }
});
router.delete("/medical-records/:id", async (req, res) => {
  try {
    const record = await MedicalRecords.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record" });
  }
});
module.exports = router;
