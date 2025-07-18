import React, { useEffect, useState } from "react";
import NavBar from "../../../components/doctorNavbar/NavBar";
import {
  Button,
  Dialog,
  CircularProgress,
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
import CloseIcon from "@mui/icons-material/Close";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const PatientsList = () => {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [searchBy, setSearchBy] = useState("");
  const [value, setValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [medicalRecords, setMedicalRecords] = useState([]);

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
        setLoading(true);
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
  const handleSearch = async () => {
    if (!searchBy || !value) {
      setError("Please select a search criteria and enter a value.");
      return;
    }
    setSearching(true);
    try {
      setError("");
      const response = await fetch(
        `https://doc-link-backend.onrender.com/search-patients?searchBy=${searchBy}&value=${value}`,
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
          `Failed to search patients. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSearching(false);
    }
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: "#82EAAC",
        }}
      >
        <CircularProgress
          size={80}
          thickness={3}
          sx={{
            color: "#F49696",
          }}
        />
        <h2 style={{ marginTop: "20px", color: "#82EAAC" }}>Loading...</h2>
      </div>
    );
  }
  const handleSort = async (sortBy) => {
    try {
      const response = await fetch(
        `https://doc-link-backend.onrender.com/sort-patients?sortBy=${sortBy}`,
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
        throw new Error(`Failed to sort patients. Status: ${response.status}`);
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleMedicalRecordDetails = async (patientId) => {
    try {
      const response = await fetch(
        `https://doc-link-backend.onrender.com/medical-records-for-doctor/${patientId}`,
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
          `Failed to fetch medical records. Status: ${response.status}`
        );
      }
      const data = await response.json();
      setMedicalRecords(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  function formattedDate(isoDate) {
    const date = new Date(isoDate);
    return date
      .toLocaleString("en-GB", {
        // timeZone: "Asia/Kolkata", // Optional: use for IST
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  }
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Practice,</h1>
      <h1 className="title2"> Simplified.</h1>
      <p className="text" style={{ fontSize: "1rem", fontStyle: "italic" }}>
        Manage your appointments, patients, and medical records with ease.
      </p>

      <div className="search-area" style={{ marginTop: "90px" }}>
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
                onChange={(e) => setSearchBy(e.target.value)}
              >
                <MenuItem value={"name"} selected>
                  Name
                </MenuItem>
                <MenuItem value={"id"}>Patient ID</MenuItem>
                <MenuItem value={"phone"}>Contact No.</MenuItem>
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
                placeholder={
                  searchBy === "name"
                    ? "Enter Patient Name"
                    : searchBy === "id"
                    ? "Enter Patient ID"
                    : "Enter Contact No."
                }
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
                onChange={(e) => setValue(e.target.value)}
              />
              {searching ? (
                <CircularProgress
                  size={24}
                  className="input"
                  style={{
                    color: "#82EAAC",
                    fontSize: "30px",
                    float: "right",
                    margin: "2px",
                    cursor: "pointer",
                    // backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                <ArrowForwardIcon
                  className="input"
                  style={{
                    color: "#82EAAC",
                    fontSize: "30px",
                    float: "right",
                    margin: "2px",
                    cursor: "pointer",
                    // backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "5px",
                  }}
                  onClick={handleSearch}
                />
              )}
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
                onChange={(e) => {
                  handleSort(e.target.value);
                }}
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
        <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          {error}
        </p>
        <hr className="text" />

        {/* ------------------------------------------------------------------------------------------------------------------------- */}
        <Container className="mt-4" style={{ marginBottom: "40px" }}>
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
                            scheduledTime: patient.scheduledTime,
                            reason: patient.reason,
                            symptoms: patient.symptoms,
                            appointmentId: patient._id,
                            phone: patient.patientId.phone,
                            email: patient.patientId.email,
                            age: patient.patientId.age,
                            gender: patient.patientId.gender,
                            state: patient.patientId.state,
                            district: patient.patientId.district,
                            createdAt: patient.createdAt,
                            firstName: patient.patientId.firstName,
                            lastName: patient.patientId.lastName,
                            id: patient.patientId._id,
                            status: patient.status,
                          });
                          handleMedicalRecordDetails(patient.patientId._id);
                        }}
                      >
                        Medical Record Details
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
                  {selectedPatient.firstName} {selectedPatient.lastName} (
                  {selectedPatient.age}), &nbsp; {selectedPatient.gender}
                </h3>

                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  📞 {selectedPatient.phone} &nbsp;{" "}
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  ✉️ {selectedPatient.email}
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  📍 {selectedPatient.state}, {selectedPatient.district}
                </p>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  <strong>Patient ID:</strong> {selectedPatient.id}
                </p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div>
              <Row>
                {medicalRecords.map((rec) => (
                  <Col md={6} xs={12} className="mb-5">
                    <Card key={rec._id}>
                      <Card.Body>
                        <div className="text">
                          <Card.Title>
                            {rec.file.endsWith(".pdf") ? (
                              <embed
                                src={rec.file}
                                width="100%"
                                height="100px"
                                type="application/pdf"
                                onClick={() => window.open(rec.file, "_blank")}
                              />
                            ) : (
                              <img
                                src={rec.file}
                                alt={rec.fileName}
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                                onClick={() => window.open(rec.file, "_blank")}
                              />
                            )}
                          </Card.Title>
                          <Card.Text>
                            <Table>
                              <tr>
                                <td>Name:</td>
                                <td>{rec.fileName}</td>
                              </tr>
                              <tr>
                                <td>Category:</td>
                                <td>{rec.category}</td>
                              </tr>
                              <tr>
                                <td>Remarks:</td>
                                <td> {rec.remarks ? rec.remarks : "-"}</td>
                              </tr>
                              <tr>
                                <td>Created At:</td>
                                <td> {formattedDate(rec.createdAt)}</td>
                              </tr>
                            </Table>
                          </Card.Text>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => window.open(rec.file, "_blank")}
                        >
                          View
                        </Button>{" "}
                        <Button
                          variant="success"
                          size="sm"
                          // onClick={() => downloadFile(rec.file)}
                        >
                          Download
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          // onClick={() => deleteFile(rec._id)}
                          style={{ marginRight: "10px", float: "right" }}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PatientsList;
