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
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 < Date.now();
  };

  if (!token || isTokenExpired(token)) {
    console.error("Token expired. Redirecting to login...");
    navigate("/login");
  }
  useEffect(() => {
    if (specialization) {
      axios
        .get(
          `http://localhost:5000/appointment?specialization=${encodeURIComponent(
            specialization
          )}`,
          { headers: { Authorization: `Bearer ${token}`, Role: "patient" } }
        )
        .then((response) => {
          console.log("Doctors API Response:", response.data);
          setDoctors(response.data);
        })
        .catch((error) => console.error("Error fetching doctors:", error));
    }
  }, [specialization, token]);
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <div
        style={{
          justifyItems: "center",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <form>
            <FormControl sx={{ minWidth: "100%", marginTop: "20px" }}>
              <InputLabel id="demo-simple-select-helper-label">
                Specialization
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "10px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={specialization}
                label="Specialization"
                name="specialization"
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Anesthesiology">Anesthesiology</MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Dermatology">Dermatology</MenuItem>
                <MenuItem value="EmergencyMedicine">
                  Emergency Medicine
                </MenuItem>
                <MenuItem value="Endocrinology">Endocrinology</MenuItem>
                <MenuItem value="Gastroenterology">Gastroenterology</MenuItem>
                <MenuItem value="GeneralSurgery">General Surgery</MenuItem>
                <MenuItem value="Geriatrics">Geriatrics</MenuItem>
                <MenuItem value="Hematology">Hematology</MenuItem>
                <MenuItem value="InfectiousDisease">
                  Infectious Disease
                </MenuItem>
                <MenuItem value="InternalMedicine">Internal Medicine</MenuItem>
                <MenuItem value="Nephrology">Nephrology</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="ObstetricsAndGynecology">
                  Obstetrics and Gynecology
                </MenuItem>
                <MenuItem value="Oncology">Oncology</MenuItem>
                <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Otolaryngology">Otolaryngology (ENT)</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                <MenuItem value="Pulmonology">Pulmonology</MenuItem>
                <MenuItem value="Radiology">Radiology</MenuItem>
                <MenuItem value="Rheumatology">Rheumatology</MenuItem>
                <MenuItem value="Urology">Urology</MenuItem>
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText> */}
            </FormControl>

            {doctors.map((doctor) => (
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
                  >
                    <ArrowForwardIcon />
                  </button>

                  <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                    <strong>Hospital:</strong> {doctor.hospitalName}
                  </p>

                  {/* ✅ Fixed Availability Schedule Display */}
                  <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                    <strong>Availability:</strong>
                  </p>
                  <ul style={{ fontSize: ".9rem", marginLeft: "50px" }}>
                    {Object.entries(doctor.availabilitySchedule).map(
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
            ))}

            <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "20px",
                marginTop: "20px",
                width: "100%",
              }}
              id="outlined-basic"
              label="Date of Appointment"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true, // This removes the default dd-mm-yyyy placeholder
              }}
            />
            <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "20px",
                width: "100%",
              }}
              id="outlined-basic"
              label="Time of Appointment"
              variant="outlined"
              type="time"
              InputLabelProps={{
                shrink: true, // This removes the default dd-mm-yyyy placeholder
              }}
            />
            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                // backgroundColor: "#F49696",
                // color: "#82EAAC",
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
