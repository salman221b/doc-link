import React, { useEffect, useState } from "react";
import "./Appointment.css";
import NavBar from "../../../components/userNavbar/NavBar";
import axios from "axios";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Modal,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import LoadingScreen from "../../../components/loadingScreen/LoadingScreen";
const Appointment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [specialization, setSpecialization] = useState("");
  const [mode, setMode] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [noDoctors, setNoDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [doctorAvailability, setDoctorAvailability] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id; // Extract user ID

  // console.log(userId);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = JSON.parse(atob(token.split(".")[1]));

    return decoded.exp * 1000 < Date.now();
  };

  // Redirect if token is invalid
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      console.error("Token expired. Redirecting to login...");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch doctors based on specialization
  useEffect(() => {
    if (specialization) {
      setSelectedDoctor(null); // Reset selected doctor when specialization changes
      setNoDoctors(false);
      setLoading(true);

      axios
        .get(
          `https://doc-link-backend.onrender.com/appointment?specialization=${encodeURIComponent(
            specialization
          )}`,
          { headers: { Authorization: `Bearer ${token}`, Role: "patient" } }
        )
        .then((response) => {
          if (response.data.length > 0) {
            setDoctors(response.data);
            setNoDoctors(false);
          } else {
            setDoctors([]);
            setNoDoctors(true);
          }
        })
        .catch(() => {
          setDoctors([]);
          setNoDoctors(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDoctors([]);
      setNoDoctors(false);
      setSelectedDoctor(null);
    }
  }, [specialization, token]);

  // Update doctor availability when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      setDoctorAvailability(selectedDoctor.availabilitySchedule || {});
    } else {
      setDoctorAvailability({});
    }
  }, [selectedDoctor]);

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14); // Allow selection up to 2 weeks ahead
  const maxDateFormatted = maxDate.toISOString().split("T")[0];

  // Function to check if a date is disabled
  const isDateDisabled = (date) => {
    if (!selectedDoctor || !doctorAvailability) return true;
    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return !doctorAvailability[dayName]?.available;
  };

  // Handle date change
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    const dayName = new Date(newDate)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    console.log("Selected Day:", dayName);

    if (selectedDoctor && doctorAvailability[dayName]?.available) {
      let startTime = doctorAvailability[dayName].startTime; // e.g., "09:00"
      let endTime = doctorAvailability[dayName].endTime; // e.g., "17:00"

      if (startTime && endTime) {
        let slots = [];
        let [startHour, startMinute] = startTime.split(":").map(Number);
        let [endHour, endMinute] = endTime.split(":").map(Number);

        let startMinutes = startHour * 60 + startMinute;
        let endMinutes = endHour * 60 + endMinute;

        for (let i = startMinutes; i < endMinutes; i += 30) {
          let hours = Math.floor(i / 60);
          let minutes = i % 60;
          let formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}`;
          if (formattedTime !== "13:00" && formattedTime !== "13:30") {
            slots.push(formattedTime);
          }
        }

        console.log("Available Slots:", slots);
        setAvailableSlots(slots);
      }
    }

    if (isDateDisabled(newDate)) {
      setError(true);
    } else {
      setError(false);
    }
  };
  const handleBookNow = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePayment = async () => {
    setPageLoading(true);

    // Step 1: Call backend to create a payment order
    const response = await fetch(
      "https://doc-link-backend.onrender.com/create-payment",
      { method: "POST" }
    );
    const data = await response.json();

    const options = {
      key: "rzp_test_WgHvwbS8kVmH9H",
      amount: data.amount,
      currency: "INR",
      name: "Telemedicine App",
      order_id: data.order_id,
      handler: async function (response) {
        // Step 2: Verify payment on backend
        const verify = await fetch(
          "https://doc-link-backend.onrender.com/verify-payment",
          {
            method: "POST",
            body: JSON.stringify(response),
            headers: { "Content-Type": "application/json" },
          }
        );

        const verifyResponse = await verify.json();
        if (verifyResponse.success) {
          // Step 3: Save Appointment
          await fetch(
            "https://doc-link-backend.onrender.com/book-appointment",
            {
              method: "POST",
              // body: JSON.stringify({ appointmentDetails }),
              headers: { "Content-Type": "application/json" },
            }
          );
          alert("Appointment booked successfully!");
        } else {
          alert("Payment verification failed");
        }
        // setPageLoading(false);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <div
        style={{
          justifyItems: "center",
          marginTop: "50px",
          marginBottom: "250px",
        }}
      >
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <form>
            <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
              <InputLabel>Specialization</InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "10px" }}
                label="Specialization"
                name="specialization"
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                {[
                  "Anesthesiology",
                  "Cardiology",
                  "Dermatology",
                  "EmergencyMedicine",
                  "Endocrinology",
                  "Gastroenterology",
                  "GeneralSurgery",
                  "Geriatrics",
                  "Hematology",
                  "InfectiousDisease",
                  "InternalMedicine",
                  "Nephrology",
                  "Neurology",
                  "ObstetricsAndGynecology",
                  "Oncology",
                  "Ophthalmology",
                  "Orthopedics",
                  "Otolaryngology",
                  "Pediatrics",
                  "Psychiatry",
                  "Pulmonology",
                  "Radiology",
                  "Rheumatology",
                  "Urology",
                ].map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {loading ? (
              <p style={{ textAlign: "center" }} className="text">
                Loading doctors{loadingDots}
              </p>
            ) : selectedDoctor ? (
              <div
                className="selected-doctor"
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f9f9f9",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Selected Doctor: {selectedDoctor.firstName}{" "}
                {selectedDoctor.lastName}
              </div>
            ) : doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div
                  className="card"
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    border: "1px solid ",
                    borderRadius: "5px",
                    padding: "20px",
                  }}
                  key={doctor._id}
                >
                  <PersonIcon />
                  <div className="text">
                    <span style={{ marginLeft: "20px", fontSize: "1.5rem" }}>
                      {doctor.firstName} {doctor.lastName}
                    </span>
                    <span style={{ marginLeft: "50px" }}>
                      {doctor.qualification}
                    </span>
                    <p style={{ fontSize: "0.7rem", marginLeft: "50px" }}>
                      {doctor.yearOfExperience} years of experience
                    </p>

                    <button
                      className="btn"
                      style={{
                        float: "right",
                        backgroundColor: "#F49696",
                        color: "#82EAAC",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedDoctor(doctor);
                      }}
                    >
                      <ArrowForwardIcon />
                    </button>

                    <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                      <strong>Hospital:</strong> {doctor.hospitalName}
                    </p>

                    <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                      <strong>Availability:</strong>
                    </p>
                    <ul style={{ fontSize: ".9rem", marginLeft: "50px" }}>
                      {Object.entries(doctor.availabilitySchedule || {}).map(
                        ([day, details]) => (
                          <li key={day}>
                            <strong>
                              {day.charAt(0).toUpperCase() + day.slice(1)}:
                            </strong>{" "}
                            {details.available
                              ? `${details.startTime} - ${details.endTime}`
                              : "Not Available"}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ))
            ) : noDoctors ? (
              <p style={{ color: "red", textAlign: "center" }}>
                No Doctors Found
              </p>
            ) : null}
            {/* Appointment Fields */}
            {/* <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "20px",
                marginTop: "20px",
                width: "100%",
              }}
              label="Date of Appointment"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
            /> */}
            <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
              <InputLabel>Mode of Consultation</InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "10px" }}
                label="Mode of Consultation"
                name="mode"
                onChange={(e) => setMode(e.target.value)}
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                {[
                  "Video Consultation",
                  "Teleconsultation",
                  "In-Person Consultation",
                ].map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date of Appointment"
              type="date"
              variant="outlined"
              value={selectedDate}
              onChange={handleDateChange}
              inputProps={{
                min: today,
                max: maxDateFormatted,
              }}
              error={error}
              helperText={error ? "Doctor is not available on this day." : ""}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            />

            {/* <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "20px",
                width: "100%",
              }}
              label="Time of Appointment"
              variant="outlined"
              type="time"
              InputLabelProps={{ shrink: true }}
            /> */}
            {availableSlots.length > 0 ? (
              <div>
                <p className="text">Available Slots:</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`slot-button ${
                        selectedSlot === slot ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <button
              className="btn btn-primary"
              type="button"
              style={{
                width: "100%",
                fontWeight: "bold",
              }}
              onClick={handleBookNow}
              disabled={!selectedSlot}
            >
              Book Now
            </button>
            {/* Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "white",
                  boxShadow: 24,
                  p: 3,
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Confirm Your Appointment
                </Typography>

                <Typography variant="body1">
                  <strong>Specialization:</strong> {specialization}
                </Typography>
                <Typography variant="body1">
                  <strong>Doctor:</strong> {selectedDoctor?.firstName}{" "}
                  {selectedDoctor?.lastName}
                </Typography>
                <Typography variant="body1">
                  <strong>Mode:</strong> {mode}
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {selectedDate}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong> {selectedSlot}
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCloseModal}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    onClick={handlePayment}
                  >
                    Book Anyway
                  </Button>
                </Box>
              </Box>
            </Modal>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Appointment;
