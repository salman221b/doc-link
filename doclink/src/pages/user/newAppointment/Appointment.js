import React, { useEffect, useState } from "react";
import NavBar from "../../../components/userNavbar/NavBar";
import axios from "axios";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
const Appointment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [noDoctors, setNoDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [doctorAvailability, setDoctorAvailability] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");
  const [availableSlots, setAvailableSlots] = useState([]);
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

  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <div
        style={{
          justifyItems: "center",
          marginTop: "50px",
          marginBottom: "180px",
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
              <p style={{ textAlign: "center" }}>
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
                <p>Available Slots:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      className="slot-button"
                      // onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: "10px 15px",
                        borderRadius: "5px",
                        border: "1px solid #007bff",
                        // backgroundColor: selectedSlot === slot ? "#007bff" : "white",
                        // color: selectedSlot === slot ? "white" : "#007bff",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                fontWeight: "bold",
              }}
            >
              Book Now
            </button>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Appointment;
