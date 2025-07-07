const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentsModel");
const isAuthenticated = require("../middlewares/authMiddleware");

router.get("/patients", isAuthenticated, async (req, res) => {
  const doctorId = req.user.id;
  try {
    const patients = await Appointment.find({ doctorId: doctorId })
      .populate(
        "patientId",
        "firstName lastName age phone email state district _id createdAt"
      )
      .sort({ createdAt: -1 });

    const uniquePatients = [];
    const seen = new Set();

    for (const appt of patients) {
      const id = appt.patientId._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        uniquePatients.push(appt);
      }
    }
    res.json(uniquePatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});
router.get("/search-patients", isAuthenticated, async (req, res) => {
  const { searchBy, value } = req.query;

  if (!searchBy || !value) {
    return res.status(400).json({ message: "Invalid search parameters" });
  }

  const doctorId = req.user.id;
  try {
    const patients = await Appointment.find({ doctorId: doctorId })
      .populate(
        "patientId",
        "firstName lastName age phone email state district _id createdAt"
      )
      .sort({ createdAt: -1 });

    const uniquePatients = [];
    const seen = new Set();

    for (const appt of patients) {
      const id = appt.patientId._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        uniquePatients.push(appt);
      }
    }
    const filteredPatients = uniquePatients.filter((appt) => {
      const patient = appt.patientId;
      if (searchBy === "name") {
        return (
          patient.firstName.toLowerCase().includes(value.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(value.toLowerCase())
        );
      } else if (searchBy === "id") {
        return patient._id.toString().includes(value);
      } else if (searchBy === "phone") {
        return patient.phone.includes(value);
      }
      return false;
    });
    res.json(filteredPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

router.get("/sort-patients", isAuthenticated, async (req, res) => {
  const { sortBy } = req.query;
  if (!sortBy) {
    return res.status(400).json({ message: "Invalid sort parameter" });
  }
  const doctorId = req.user.id;

  try {
    const patients = await Appointment.find({ doctorId: doctorId })
      .populate(
        "patientId",
        "firstName lastName age phone email state district _id createdAt"
      )
      .sort({ createdAt: -1 });

    const uniquePatients = [];
    const seen = new Set();

    for (const appt of patients) {
      const id = appt.patientId._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        uniquePatients.push(appt);
      }
    }

    uniquePatients.sort((a, b) => {
      if (sortBy === "name") {
        return a.patientId.firstName.localeCompare(b.patientId.firstName);
      } else if (sortBy === "last-visit") {
        return new Date(a.scheduledDate) - new Date(b.scheduledDate);
      } else if (sortBy === "appointment-date") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });
    res.json(uniquePatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

module.exports = router;
