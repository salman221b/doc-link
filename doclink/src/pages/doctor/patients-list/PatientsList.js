import React, { useEffect, useState } from "react";
import NavBar from "../../../components/doctorNavbar/NavBar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import NoData from "../../../static/no_data.png";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { blue } from "@mui/material/colors";
import FilterPatients from "../../../components/filter/FilterPatients";
import CloseIcon from "@mui/icons-material/Close";
import { Card, Col, Container, Row } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const PatientsList = () => {
  const [filter, setFilter] = React.useState(false);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true; // Invalid token format
    }
  };
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [token, navigate]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          "https://doc-link-backend.onrender.com/patients",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Role: "doctor",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch patients. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [token]);
  const formatReadableDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Practice,</h1>
      <h1 className="title2"> Simplified.</h1>
      <p className="text" style={{ fontSize: "1rem", fontStyle: "italic" }}>
        Manage your appointments, patients, and medical records with ease.
      </p>

      <div className="search-area" style={{ marginTop: "50px" }}>
        <form>
          <div
            className="searchArea"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ width: "200px", marginTop: "-20px" }}>
              <InputLabel id="demo-simple-select-helper-label">
                Search By
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "10px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Search By"
                name="search-by"
                // onChange={handleChange}
              >
                <MenuItem value={"name"} selected>
                  Name
                </MenuItem>
                <MenuItem value={"id"}>ID</MenuItem>
                <MenuItem value={"contact-no"}>Contact No.</MenuItem>
              </Select>
            </FormControl>
            <div
              className="searchById"
              style={{
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                borderRadius: "10px",
                border: "1px solid #82EAAC",
                padding: "5px",
                width: "300px",
                // margin: "0 auto",
                marginLeft: "20px",
                marginTop: "-20px",
              }}
            >
              <input
                className="text"
                type="text"
                placeholder="Enter ID "
                style={{
                  width: "75%",
                  border: "none",
                  outline: "none",
                  padding: "5px",
                  // color: "#030E82",
                  fontSize: "15px",
                  fontWeight: "bold",
                  //   marginRight: "10px",
                  //   marginLeft: "10px",
                  //   marginTop: "5px",
                  //   marginBottom: "5px",
                  backgroundColor: "transparent",
                  borderRadius: "5px",
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0)",
                  textAlign: "center",
                }}
              />
              <ArrowForwardIcon
                style={{
                  color: "#82EAAC",
                  fontSize: "30px",
                  float: "right",
                  margin: "2px",
                  cursor: "pointer",
                  // backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "5px",
                }}
                className="input"
              />
            </div>
            <FormControl
              sx={{ width: "200px", marginTop: "-20px", marginLeft: "20px" }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Sort By
              </InputLabel>
              <Select
                style={{ backgroundColor: "white", borderRadius: "10px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={formData.specialization}
                label="Sort By"
                name="sort-by"
                // onChange={handleChange}
              >
                <MenuItem value={"name"} selected>
                  Name
                </MenuItem>
                <MenuItem value={"last-visit"}>Last Visit</MenuItem>
                <MenuItem value={"appointment-date"}>Appointment Date</MenuItem>
              </Select>
            </FormControl>
          </div>
        </form>
        <hr className="text" />
        <p
          style={{
            textDecoration: "underline",
            color: blue[500],
            cursor: "pointer",
          }}
          onClick={() => setFilter(!filter)}
        >
          Filters:
        </p>

        <CloseIcon
          style={{
            color: "red",
            float: "right",
            cursor: "pointer",
            display: filter ? "block" : "none",
          }}
          onClick={() => setFilter(false)}
        />
        {filter && <FilterPatients />}
        {/* ------------------------------------------------------------------------------------------------------------------------- */}
        <Container className="mt-4">
          <Row>
            {patients.length === 0 ? (
              <div style={{ textAlign: "center", marginBottom: "80px" }}>
                <img
                  src={NoData}
                  alt="No Data"
                  style={{ width: "300px", display: "block", margin: "auto" }}
                />
                <p className="text" style={{ marginTop: "20px" }}>
                  Oops, No patients found.!
                </p>
              </div>
            ) : (
              patients.map((patient) => (
                <Col md={6} xs={12} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <PersonIcon className="text" />{" "}
                        <span className="text" style={{ marginLeft: "20px" }}>
                          {patient.patientId.firstName}
                          {""}
                          {patient.patientId.lastName} {patient.patientId.age}
                        </span>
                        <span className="text" style={{ float: "right" }}>
                          {patient.patientId._id}
                        </span>
                      </Card.Title>
                      <Card.Text className="text">
                        Mobile:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {patient.patientId.phone}
                        </span>
                        <p>
                          Last Visit:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {formatReadableDate(patient.scheduledDate)}
                          </span>
                        </p>
                        <p>
                          Reason for Last Visit:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {patient.reason}
                          </span>
                        </p>
                        <p>
                          Symptoms:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {patient.symptoms}
                          </span>
                        </p>
                      </Card.Text>
                      <Button
                        style={{
                          width: "100%",
                          color: "#030E82",
                          backgroundColor: "#82EAAC",
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          setOpen(true);
                          setSelectedPatient({
                            scheduledDate: patient.scheduledDate,
                            reason: patient.reason,
                            symptoms: patient.symptoms,
                            appointmentId: patient._id,
                            phone: patient.patientId.phone,
                            email: patient.patientId.email,
                            age: patient.patientId.age,
                            gender: patient.patientId.gender,
                            state: patient.patientId.state,
                            district: patient.patientId.district,
                            createdAt: patient.patientId.createdAt,
                            firstName: patient.patientId.firstName,
                            lastName: patient.patientId.lastName,
                            id: patient.patientId._id,
                          });
                        }}
                      >
                        View Profile
                        <ArrowForwardIcon style={{ color: "#F49696" }} />
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
        {/* Modal Component */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>
            <CloseIcon
              style={{ float: "right", cursor: "pointer" }}
              onClick={() => setOpen(false)}
              color="secondary"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "20px",
                borderRadius: "10px",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#fff",
              }}
            >
              {/* Left: Profile Picture */}
              <PersonIcon
                alt="Profile"
                style={{
                  width: "20%",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              {/* Right: Name & Contacts */}
              <div style={{ marginLeft: "20px", width: "80%" }}>
                <h3 style={{ margin: "0", color: "#333" }}>
                  Patient Name (Age), &nbsp; Male
                </h3>

                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  {/* 📞 {selectedPatient.patientId.phone} */}
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  ✉️ johndoe@email.com
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  Medical History
                </p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div>
              Appointments
              <p> (Upcoming, Completed, and Canceled)</p>
            </div>
            <div style={{ marginTop: "20px" }}>
              Prescriptions(Doctor’s past prescriptions)
            </div>
            <div style={{ marginTop: "20px" }}>
              Reports & Test Results (Blood test, X-rays, MRI, etc.)
            </div>
            <p
              style={{
                float: "right",
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Download / Print
            </p>
          </DialogContent>
          <DialogActions>
            <div style={{ width: "100%" }}>
              <Button
                style={{
                  width: "100%",
                  color: "#030E82",
                  backgroundColor: "#82EAAC",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  alert(" join clicked");
                }}
              >
                Schedule a New Appointment{" "}
              </Button>
              <br />
              <Button
                style={{
                  width: "49%",
                  marginTop: "10px",
                  backgroundColor: "#030E82",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                View/Write Prescription
              </Button>
              <Button
                style={{
                  width: "49%",
                  marginTop: "10px",
                  backgroundColor: "#F49696",
                  fontWeight: "bold",
                  float: "right",
                  color: "#fff",
                }}
              >
                Upload Medical Reports
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PatientsList;
