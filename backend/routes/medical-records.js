const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
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
    const { fileName, category, remarks, patientId, doctorId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const newRecord = new MedicalRecords({
      patientId,
      doctorId,
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
router.get("/medical-records", authMiddleware, async (req, res) => {
  try {
    const records = await MedicalRecords.find({ patientId: req.user.id }).sort({
      createdAt: -1,
    });
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
router.get("/search-medical-records", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start and End dates required." });
  }

  try {
    const records = await MedicalRecords.find({
      patientId: userId, // assuming token middleware adds this
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1)
        ),
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to fetch records!" });
  }
});

module.exports = router;
