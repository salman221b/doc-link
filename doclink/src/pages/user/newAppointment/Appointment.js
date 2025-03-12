import React, { useEffect, useState } from "react";
import NavBar from "../../../components/userNavbar/NavBar";
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

const Appointment = () => {
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

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
                <MenuItem value={"anesthesiology"}>Anesthesiology</MenuItem>
                <MenuItem value={"cardiology"}>Cardiology</MenuItem>
                <MenuItem value={"dermatology"}>Dermatology</MenuItem>
                <MenuItem value={"emergency_medicine"}>
                  Emergency Medicine
                </MenuItem>
                <MenuItem value={"endocrinology"}>Endocrinology</MenuItem>
                <MenuItem value={"gastroenterology"}>Gastroenterology</MenuItem>
                <MenuItem value={"general_surgery"}>General Surgery</MenuItem>
                <MenuItem value={"geriatrics"}>Geriatrics</MenuItem>
                <MenuItem value={"hematology"}>Hematology</MenuItem>
                <MenuItem value={"infectious_disease"}>
                  Infectious Disease
                </MenuItem>
                <MenuItem value={"internal_medicine"}>
                  Internal Medicine
                </MenuItem>
                <MenuItem value={"nephrology"}>Nephrology</MenuItem>
                <MenuItem value={"neurology"}>Neurology</MenuItem>
                <MenuItem value={"obstetrics_gynecology"}>
                  Obstetrics and Gynecology
                </MenuItem>
                <MenuItem value={"oncology"}>Oncology</MenuItem>
                <MenuItem value={"ophthalmology"}>Ophthalmology</MenuItem>
                <MenuItem value={"orthopedics"}>Orthopedics</MenuItem>
                <MenuItem value={"otolaryngology"}>
                  Otolaryngology (ENT)
                </MenuItem>
                <MenuItem value={"pediatrics"}>Pediatrics</MenuItem>
                <MenuItem value={"psychiatry"}>Psychiatry</MenuItem>
                <MenuItem value={"pulmonology"}>Pulmonology</MenuItem>
                <MenuItem value={"radiology"}>Radiology</MenuItem>
                <MenuItem value={"rheumatology"}>Rheumatology</MenuItem>
                <MenuItem value={"urology"}>Urology</MenuItem>
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText> */}
            </FormControl>
            <div
              className="card"
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                border: "1px solid ",
                borderRadius: "5px",
                padding: "20px",
              }}
            >
              <PersonIcon />
              <div className="text">
                <span style={{ marginLeft: "20px", fontSize: "1.5rem" }}>
                  Name{" "}
                </span>
                <span style={{ marginLeft: "50px" }}>Qualifications</span>
                <p style={{ fontSize: "0.7rem", marginLeft: "50px" }}>
                  Years of Experience
                </p>{" "}
                <button
                  className="btn "
                  style={{
                    float: "right",
                    backgroundColor: "#F49696",
                    color: "#82EAAC",
                  }}
                >
                  <ArrowForwardIcon />
                </button>
                <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                  Hospital/Clinic Affiliation
                </p>
                <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                  Availability:{" "}
                  <span style={{ fontSize: ".8rem", marginRight: "20px" }}>
                    Monday, Tuesday, Wednesday, Thursday, Friday
                  </span>
                </p>
              </div>
              {/* ------------------------------------------------------------------------------------------ */}
              <hr className="text" />
              <PersonIcon />
              <div className="text">
                <span style={{ marginLeft: "20px", fontSize: "1.5rem" }}>
                  Name{" "}
                </span>
                <span style={{ marginLeft: "50px" }}>Qualifications</span>
                <p style={{ fontSize: "0.7rem", marginLeft: "50px" }}>
                  Years of Experience
                </p>{" "}
                <button
                  className="btn "
                  style={{
                    float: "right",
                    backgroundColor: "#F49696",
                    color: "#82EAAC",
                  }}
                >
                  <ArrowForwardIcon />
                </button>
                <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                  Hospital/Clinic Affiliation
                </p>
                <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                  Availability:{" "}
                  <span style={{ fontSize: ".8rem", marginRight: "20px" }}>
                    Monday, Tuesday, Wednesday, Thursday, Friday
                  </span>
                </p>
              </div>
              {/* ------------------------------------------------------------------------------------------ */}
              <hr className="text" />
              <PersonIcon />
              <div className="text">
                <span style={{ marginLeft: "20px", fontSize: "1.5rem" }}>
                  Name{" "}
                </span>
                <span style={{ marginLeft: "50px" }}>Qualifications</span>
                <p style={{ fontSize: "0.7rem", marginLeft: "50px" }}>
                  Years of Experience
                </p>{" "}
                <button
                  className="btn "
                  style={{
                    float: "right",
                    backgroundColor: "#F49696",
                    color: "#82EAAC",
                  }}
                >
                  <ArrowForwardIcon />
                </button>
                <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                  Hospital/Clinic Affiliation
                </p>
                <p style={{ fontSize: "1rem", marginLeft: "50px" }}>
                  Availability:{" "}
                  <span style={{ fontSize: ".8rem", marginRight: "20px" }}>
                    Monday, Tuesday, Wednesday, Thursday, Friday
                  </span>
                </p>
              </div>
            </div>
            <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "20px",
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
