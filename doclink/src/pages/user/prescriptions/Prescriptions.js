import React, { useEffect, useState } from "react";
import NavBar from "../../../components/userNavbar/NavBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import NoData from "../../../static/no_data.png";

import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Prescriptions = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("https://doc-link-backend.onrender.com/prescriptions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Role: "patient",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch records", err);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: "#82EAAC", // Light Green Text
        }}
      >
        <CircularProgress
          size={80}
          thickness={3}
          sx={{
            color: "#F49696", // Light Red Spinner
          }}
        />
        <h2 style={{ marginTop: "20px", color: "#82EAAC" }}>Loading...</h2>
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      <h1 className="title1">Your Health,</h1>
      <h1 className="title2">Just a Click Away.</h1>
      <form>
        <div
          className="searchArea"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Start date"
            variant="outlined"
            type="date"
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
          />
          <TextField
            id="outlined-basic"
            label="End date"
            variant="outlined"
            type="date"
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            InputLabelProps={{
              shrink: true, // This removes the default dd-mm-yyyy placeholder
            }}
          />
          <button
            className="searchButton"
            type="submit"
            style={{
              marginLeft: "20px",
              marginBottom: "20px",
              backgroundColor: "#82EAAC",
              color: "#030E82",
              height: "50px",
              width: "100px",
              borderRadius: "10px",
            }}
          >
            Search
            <ArrowForwardIcon />
          </button>
        </div>
      </form>

      {records.length === 0 ? (
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <img
            src={NoData}
            alt="No Data"
            style={{ width: "300px", display: "block", margin: "auto" }}
          />
          <p className="text" style={{ marginTop: "20px" }}>
            Oops, No Prescriptions Found!
          </p>
        </div>
      ) : (
        <Container className="mt-4">
          <Row>
            {records.map((rec) => (
              <Col md={6} xs={12} className="mb-5">
                <Card key={rec._id}>
                  <Card.Body>
                    <div className="text">
                      <Card.Title>
                        {rec.doctorName ? (
                          <span>
                            <PersonIcon /> {rec.doctorName}
                          </span>
                        ) : (
                          <span>
                            <PersonIcon /> Unknown
                          </span>
                        )}
                      </Card.Title>
                      <Card.Text>
                        <strong>Specialization:</strong>{" "}
                        {rec.specialization || "N/A"}
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
        </Container>
      )}
      {/* <Row>
          <Col md={6} xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <div className="text">
                  <Card.Title>
                    <PersonIcon />{" "}
                    <span style={{ marginLeft: "20px" }}>Name</span>
                    <span
                      style={{
                        float: "right",
                        fontSize: "15px",
                        marginRight: "30px",
                      }}
                    >
                      Specialization
                    </span>
                  </Card.Title>
                  <Card.Text>
                    Consultaion Date & Time
                    <br />
                    <TextField
                      style={{ backgroundColor: "white", borderRadius: "10px" }}
                      fullWidth
                      id="outlined-multiline-static"
                      label="Diagnosis / Summary"
                      multiline
                      rows={4}
                      defaultValue=""
                    />
                    <p style={{ marginTop: "10px" }}>Prescribed Medicines:</p>
                    <ol>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                      <li>
                        Name <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Dosage & Instructions
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.9rem", marginLeft: "10px" }}
                        >
                          Validity / Expiry Date{" "}
                        </span>
                      </li>
                    </ol>
                    <p style={{ marginTop: "10px" }}> Next Follow-up Date : </p>
                  </Card.Text>
                </div>

                <Button
                  style={{
                    width: "100%",
                    color: "#030E82",
                    backgroundColor: "#82EAAC",
                    fontWeight: "bold",
                  }}
                >
                  Download
                  <ArrowForwardIcon style={{ color: "#F49696" }} />
                </Button>
              </Card.Body>
            </Card>
          </Col>

        </Row> */}
    </div>
  );
};

export default Prescriptions;
